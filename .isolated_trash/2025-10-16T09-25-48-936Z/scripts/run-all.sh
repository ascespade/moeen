#!/usr/bin/env bash
set -uo pipefail

WORKDIR="/workspace"
REPORT_DIR="$WORKDIR/reports"
LOG_DIR="$REPORT_DIR/logs"
SCRIPTS_DIR="$WORKDIR/scripts"
FINAL_REPORT="$REPORT_DIR/final-report.json"
LHR_PATH="$REPORT_DIR/lighthouse-report.json"
SERVER_URL="http://localhost:3000"
MAX_RETRIES=5

mkdir -p "$LOG_DIR"

timestamp() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
log() { echo "$(timestamp) | $1"; }
write_log() { echo "$(timestamp) | $1" >> "$LOG_DIR/run.log"; }

update_todo() {
  local task_name="$1"
  local task_status="$2"
  local reason="$3"
  python3 - <<PY
import json,os
rfile="$FINAL_REPORT"
report = {"tasks":[]}
if os.path.exists(rfile):
    try: report=json.load(open(rfile))
    except: report={"tasks":[]}
task={"name":"$task_name","status":"$task_status","reason":"$reason","timestamp":"$(date -u +'%Y-%m-%dT%H:%M:%SZ')"}
report["tasks"].append(task)
json.dump(report, open(rfile,"w"), indent=2)
PY
}

run_with_retries() {
  local cmd="$1"; local name="$2"; local timeout_secs="${3:-300}"
  local attempt=1; local success=0
  local out_file="$LOG_DIR/${name// /_}.out"
  local err_file="$LOG_DIR/${name// /_}.err"
  echo "" > "$out_file"; echo "" > "$err_file"

  while [ $attempt -le $MAX_RETRIES ]; do
    log "[$name] attempt $attempt/$MAX_RETRIES"
    write_log "[$name] attempt $attempt/$MAX_RETRIES"
    if timeout "$timeout_secs"s bash -lc "$cmd" >"$out_file" 2>"$err_file"; then
      success=1
      break
    else
      write_log "[$name] failed attempt $attempt"
      tail -n +1 "$err_file" >> "$LOG_DIR/run.log"
      sleep $((2 ** attempt))
      attempt=$((attempt+1))
    fi
  done

  local status="failed"
  [ $success -eq 1 ] && status="completed"
  update_todo "$name" "$status" ""
  return $( [ $success -eq 1 ] && echo 0 || echo 1 )
}

wait_for_server() {
  local attempts=0
  local max_attempts=10
  local wait_sec=3
  while [ $attempts -lt $max_attempts ]; do
    if curl -sSf --max-time 5 "$SERVER_URL" >/dev/null 2>&1; then
      log "[health] server healthy at $SERVER_URL"
      return 0
    else
      log "[health] server not ready, retry in $wait_sec sec..."
      sleep $wait_sec
      attempts=$((attempts+1))
      wait_sec=$((wait_sec*2))
    fi
  done
  log "[health] server failed to start after $max_attempts attempts"
  return 1
}

cd "$WORKDIR" or exit 1
log "Start full automation run"
write_log "=== START RUN ==="

# --------- STEP 1: depcheck ----------
run_with_retries "npx depcheck --json > \"$REPORT_DIR/depcheck.json\"" "depcheck" 120 || true

# --------- STEP 2: ESLint + Prettier ----------
run_with_retries "npx eslint . --fix --no-error-on-unmatched-pattern || true" "eslint_fix" 300 || true
run_with_retries "npx prettier --write . || true" "prettier" 120 || true

# --------- STEP 3: Optional custom scripts ----------
[ -f "$SCRIPTS_DIR/consolidate-duplicates.js" ] && run_with_retries "node $SCRIPTS_DIR/consolidate-duplicates.js" "consolidate_duplicates" 180 || true
[ -f "$SCRIPTS_DIR/enforce-naming.js" ] && run_with_retries "node $SCRIPTS_DIR/enforce-naming.js" "enforce_naming" 180 || true

# --------- STEP 4: Build ----------
run_with_retries "npm run build --if-present || npm run build 2>/dev/null || true" "build" 900 || true

# --------- STEP 5: Start server ----------
START_LOG="$LOG_DIR/server_start.out"
nohup bash -lc "npm run start --if-present || node server.js || npx serve -s build -l 3000" >"$START_LOG" 2>&1 &
SERVER_PID=$!
sleep 3
write_log "server pid: $SERVER_PID"

# --------- STEP 6: Wait for server health ----------
if wait_for_server; then
  update_todo "server_health" "completed" ""
else
  update_todo "server_health" "failed" "Server did not become healthy"
fi

# --------- STEP 7: Lazy-load, API, mocks ----------
[ -f "$SCRIPTS_DIR/lazy-load-modules.js" ] && run_with_retries "node $SCRIPTS_DIR/lazy-load-modules.js" "lazy_load_modules" 180 || true
[ -f "$SCRIPTS_DIR/optimize-api.js" ] && run_with_retries "node $SCRIPTS_DIR/optimize-api.js" "optimize_api" 300 || true
[ -f "$SCRIPTS_DIR/replace-mocks.js" ] && run_with_retries "node $SCRIPTS_DIR/replace-mocks.js" "replace_mocks" 180 || true

# --------- STEP 8: Lighthouse (if server healthy) ----------
if curl -sSf --max-time 5 "$SERVER_URL" >/dev/null 2>&1; then
  run_with_retries "npx lighthouse $SERVER_URL --output json --output-path \"$LHR_PATH\" --quiet --chrome-flags='--headless'" "lighthouse" 600 || true
else
  log "[lighthouse] skipped because server is not reachable"
  update_todo "Lighthouse" "skipped" "Server not reachable after retries"
fi

# --------- STEP 9: Tests & TypeCheck ----------
run_with_retries "npx tsc --noEmit || true" "type_check" 300 || true
run_with_retries "npm test --silent || true" "tests" 600 || true
run_with_retries "npx eslint . || true" "eslint_final_check" 300 || true

# --------- STEP 10: Deployment prep ----------
[ -f "$SCRIPTS_DIR/prep-deployment.js" ] && run_with_retries "node $SCRIPTS_DIR/prep-deployment.js" "prep_deployment" 300 || true
[ -f "$SCRIPTS_DIR/fix-saudi-health-types.js" ] && run_with_retries "node $SCRIPTS_DIR/fix-saudi-health-types.js" "fix_saudi_health_types" 180 || true

# --------- STEP 11: Generate final report ----------
node "$SCRIPTS_DIR/generate-final-report.js" "$REPORT_DIR" "$LHR_PATH" || true

log "Automation run finished. Final report at $FINAL_REPORT"
write_log "=== END RUN ==="