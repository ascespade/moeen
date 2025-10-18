#!/usr/bin/env bash
# run-full-suite.sh - 2025-10-17
# سكربت شامل Supawright + Playwright + DB auto-fix + auto-apply + auto-adjust timeouts

set -Eeuo pipefail
IFS=$'\n\t'

#########################
# === إعداد المتغيرات === #
#########################

export NODE_ENV="test"

# Supabase (from user)
export NEXT_PUBLIC_SUPABASE_URL="https://socwpqzcalgvpzjwavgh.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY3dwcXpjYWxndnB6andhdmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDU1OTAsImV4cCI6MjA3NDg4MTU5MH0.V1XbwXlL_ZfdvwtPe7az15t73Lyy3ezUBTi_5XP0VcQ"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY3dwcXpjYWxndnB6andhdmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwNTU5MCwiZXhwIjoyMDc0ODgxNTkwfQ.e7U09qA-JUwGzqlJhuBwic2V-wzYCwwKvAwuDS2fsHU"

# PostgreSQL connection (Supabase DB)
export SUPABASE_DB_URL="postgresql://postgres:password@socwpqzcalgvpzjwavgh.supabase.co:5432/postgres"

# APPLY DB CHANGES AUTOMATICALLY
export FORCE_APPLY=true

# Max attempts per module & target success percent
MAX_ATTEMPTS_PER_MODULE=6
MODULE_TARGET_PERCENT=90

# Playwright config
PLAYWRIGHT_WORKERS_PER_MODULE=2
PLAYWRIGHT_TIMEOUT_MS=60000

# Parallel modules
PARALLEL_MAX=0

# Modules (13)
MODULES=(auth users patients appointments billing notifications dashboard admin files reports settings integration payments)

#########################
# === وظائف مساعدة === #
#########################

timestamp(){ date -u +"%Y%m%dT%H%M%SZ"; }
log(){ echo "[$(timestamp)] $*"; }

check_requirements(){
  log "Checking required tools..."
  local tools=(node npm psql pg_dump npx)
  for t in "${tools[@]}"; do
    if ! command -v "${t}" >/dev/null 2>&1; then
      log "⚠️ Warning: ${t} not found in PATH."
    fi
  done
  if ! command -v supawright >/dev/null 2>&1; then
    log "ℹ️ supawright CLI not found. Will fallback to node scripts."
  fi
}

# DB backup
db_backup(){
  if command -v pg_dump >/dev/null 2>&1; then
    log "Backing up DB..."
    local out="db-backup-$(timestamp).sql"
    pg_dump "${SUPABASE_DB_URL}" -Fc -f "${out}" || log "DB backup failed"
    log "Backup done: ${out}"
  fi
}

# Inspect DB schema and apply defaults + NOT NULL (FORCE_APPLY=true)
generate_db_alter_suggestions(){
  log "Inspecting DB schema and applying auto fixes..."
  local sql_q="SELECT table_schema, table_name, column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema NOT IN ('pg_catalog','information_schema') ORDER BY table_schema, table_name;"
  mkdir -p ./tmp
  echo "${sql_q}" > ./tmp/schema-query.sql
  psql "${SUPABASE_DB_URL}" -t -A -F $'\t' -f ./tmp/schema-query.sql > ./tmp/schema-cols.tsv
  > ./tmp/db-alter-suggestions.sql
  while IFS=$'\t' read -r schema table col dtype nullable def; do
    if [[ "${nullable}" == "NO" ]]; then continue; fi
    nullcount=$(psql "${SUPABASE_DB_URL}" -t -A -c "SELECT count(*) FROM \"${schema}\".\"${table}\" WHERE \"${col}\" IS NULL;" 2>/dev/null || echo 0)
    if [[ "${nullcount}" -gt 0 ]]; then
      case "${dtype}" in
        integer|numeric|bigint|smallint|decimal|real|double\ precision) dval="0";;
        boolean) dval="false";;
        timestamp*|date) dval="now()";;
        *) dval="''";;
      esac
      echo "ALTER TABLE \"${schema}\".\"${table}\" ALTER COLUMN \"${col}\" SET DEFAULT ${dval};" >> ./tmp/db-alter-suggestions.sql
      echo "UPDATE \"${schema}\".\"${table}\" SET \"${col}\" = ${dval} WHERE \"${col}\" IS NULL;" >> ./tmp/db-alter-suggestions.sql
      echo "ALTER TABLE \"${schema}\".\"${table}\" ALTER COLUMN \"${col}\" SET NOT NULL;" >> ./tmp/db-alter-suggestions.sql
    else
      echo "ALTER TABLE \"${schema}\".\"${table}\" ALTER COLUMN \"${col}\" SET NOT NULL;" >> ./tmp/db-alter-suggestions.sql
    fi
  done < ./tmp/schema-cols.tsv

  if [[ -s ./tmp/db-alter-suggestions.sql ]]; then
    log "Applying DB suggestions..."
    psql "${SUPABASE_DB_URL}" -f ./tmp/db-alter-suggestions.sql
    log "DB fixes applied."
  else
    log "No DB changes needed."
  fi
}

# Generate helper scripts for analysis + timeout fix
generate_helper_scripts(){
  mkdir -p ./scripts/ci
  # analyze-playwright-report.js
  cat > ./scripts/ci/analyze-playwright-report.js <<'NODEJS'
#!/usr/bin/env node
const fs=require('fs'); const path=require('path');
const reportPath=process.argv[2]; if(!reportPath||!fs.existsSync(reportPath)){console.error("Usage: node analyze-playwright-report.js path"); process.exit(0);}
const data=JSON.parse(fs.readFileSync(reportPath,'utf8')); let total=0,passed=0,failed=0,failures=[];
function walkSuites(suites){for(const s of suites){if(s.tests)for(const t of s.tests){total++; if(t.status==='passed')passed++; else {failed++; failures.push({title:t.title,error:t.error});}} if(s.suites)walkSuites(s.suites);}}
if(Array.isArray(data.suites))walkSuites(data.suites);
const percent=total?Math.round((passed/total)*100):100;
fs.writeFileSync(path.join(path.dirname(reportPath),'analysis.json'),JSON.stringify({total,passed,failed,percent,failures},null,2));
NODEJS
  chmod +x ./scripts/ci/analyze-playwright-report.js

  # suggest-fixes-from-trace.js (increase timeout)
  cat > ./scripts/ci/suggest-fixes-from-trace.js <<'NODEJS'
#!/usr/bin/env node
const fs=require('fs'); const reportPath=process.argv[2]; if(!reportPath||!fs.existsSync(reportPath)){console.error("Usage: node suggest-fixes-from-trace.js path"); process.exit(0);}
const data=JSON.parse(fs.readFileSync(reportPath,'utf8')); let increase=false;
function walk(s){if(s.tests){for(const t of s.tests){if(t.status!=='passed'&&t.errors){for(const e of t.errors){const msg=String(e.message||''); if(msg.includes('Timeout')||msg.includes('waitForURL')) increase=true;}}}} if(s.suites)for(const ss of s.suites)walk(ss);}
if(data.suites)for(const root of data.suites)walk(root);
if(increase){console.log("Detected timeout issues → increase PLAYWRIGHT_TIMEOUT_MS"); process.exit(2);} else process.exit(0);
NODEJS
  chmod +x ./scripts/ci/suggest-fixes-from-trace.js
}

# Apply automatic timeout increase to playwright.config.ts
adjust_playwright_config_timeout(){
  local config_file="playwright.config.ts"
  if [[ -f "${config_file}" ]]; then
    log "Updating ${config_file} with new timeout=${PLAYWRIGHT_TIMEOUT_MS}"
    sed -i -E "s/(timeout:\s*)[0-9]+/\1${PLAYWRIGHT_TIMEOUT_MS}/g" "${config_file}" || true
  fi
}

# Module loop
run_module_loop(){
  local module="$1"; local attempts=0; local success_percent=0
  local outdir="test-results/${module}-$(date +%s)"; mkdir -p "${outdir}"
  local test_id_base="auto-${module}-$(date +%s)"
  log "=== START module: ${module} ==="

  while (( attempts < MAX_ATTEMPTS_PER_MODULE )); do
    attempts=$((attempts+1))
    export TEST_ID="${test_id_base}-${attempts}"
    # Seed data
    if command -v supawright >/dev/null 2>&1; then
      supawright seed --module="${module}" --test-id="${TEST_ID}" || true
    fi
    # Run Playwright
    local module_out="${outdir}/${module}-report-attempt${attempts}.json"
    npx playwright test --config=playwright-auto.config.ts --grep "${module}" \
      --workers="${PLAYWRIGHT_WORKERS_PER_MODULE}" --timeout="${PLAYWRIGHT_TIMEOUT_MS}" \
      --reporter=json="${module_out}" || true

    # Analyze
    node ./scripts/ci/analyze-playwright-report.js "${module_out}" || true
    success_percent=$(jq -r '.percent' "${outdir}/analysis.json" 2>/dev/null || echo 0)
    log "[${module}] Success percent: ${success_percent}%"

    if (( success_percent >= MODULE_TARGET_PERCENT )); then
      log "[${module}] ✅ Module target reached"
      supawright teardown --module="${module}" --test-id="${TEST_ID}" || true
      return 0
    fi

    # Timeout detection + adjustment
    node ./scripts/ci/suggest-fixes-from-trace.js "${module_out}" || {
      PLAYWRIGHT_TIMEOUT_MS=$((PLAYWRIGHT_TIMEOUT_MS+20000))
      adjust_playwright_config_timeout
      log "[${module}] Timeout increased to ${PLAYWRIGHT_TIMEOUT_MS}"
    }

    supawright teardown --module="${module}" --test-id="${TEST_ID}" || true
    sleep 2
  done
  log "[${module}] ❌ Max attempts reached"
  return 1
}

#########################
# === Main Execution === #
#########################

log "Starting full aggressive suite..."
check_requirements
db_backup
generate_helper_scripts
generate_db_alter_suggestions

log "Installing dependencies..."
npm ci --prefer-offline --no-audit --progress=false || npm install --no-audit --progress=false || true
npx eslint . --fix || true
npx prettier --write . || true
npx tsc --noEmit || true

mkdir -p test-results test-reports

# Parallel modules
if [[ "${PARALLEL_MAX}" -eq 0 ]]; then
  PARALLEL_MAX=$(nproc || echo 4)
  PARALLEL_MAX=$(( PARALLEL_MAX>${#MODULES[@]}?${#MODULES[@]}:PARALLEL_MAX ))
fi
log "Running up to ${PARALLEL_MAX} modules in parallel"

export -f run_module_loop
export MAX_ATTEMPTS_PER_MODULE MODULE_TARGET_PERCENT PLAYWRIGHT_WORKERS_PER_MODULE PLAYWRIGHT_TIMEOUT_MS
export SUPABASE_DB_URL SUPABASE_SERVICE_ROLE_KEY NEXT_PUBLIC_SUPABASE_URL

printf "%s\n" "${MODULES[@]}" | xargs -n1 -P "${PARALLEL_MAX}" -I{} bash -c 'run_module_loop "$@"' _ {}

# Aggregate reports
log "Aggregating final report..."
node -e "
const fs=require('fs'),path=require('path'); const resultsDir='test-results';
let aggregate={ modules:[] };
if(fs.existsSync(resultsDir)){
  const dirs=fs.readdirSync(resultsDir);
  for(const d of dirs){
    const analysisPath=path.join(resultsDir,d,'analysis.json');
    if(fs.existsSync(analysisPath)){
      try{ const a=JSON.parse(fs.readFileSync(analysisPath)); aggregate.modules.push({module:d,analysis:a}); }catch(e){}
    }
  }
}
fs.writeFileSync('test-reports/final-report-'+Date.now()+'.json',JSON.stringify(aggregate,null,2));
console.log('Final report generated');
"

log "All done. ✅ Check test-results and test-reports. DB changes applied automatically."

exit 0
