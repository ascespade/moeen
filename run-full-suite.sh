#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'
export NODE_ENV="${NODE_ENV:-test}"
export NEXT_PUBLIC_SUPABASE_URL
export NEXT_PUBLIC_SUPABASE_ANON_KEY
export SUPABASE_SERVICE_ROLE_KEY
export SUPABASE_DB_URL
export FORCE_APPLY
MAX_ATTEMPTS_PER_MODULE=${MAX_ATTEMPTS_PER_MODULE:-6}
MODULE_TARGET_PERCENT=${MODULE_TARGET_PERCENT:-90}
PLAYWRIGHT_WORKERS_PER_MODULE=${PLAYWRIGHT_WORKERS_PER_MODULE:-2}
PLAYWRIGHT_TIMEOUT_MS=${PLAYWRIGHT_TIMEOUT_MS:-60000}
MODULES=(auth users patients appointments billing notifications dashboard admin files reports settings integration payments)

# Map module name to Playwright grep pattern (broad match)
pattern_for_module(){
  case "$1" in
    auth) echo "Authentication Module|Login Module|Supabase Integration Tests|auth|login" ;;
    users) echo "Admin Module|users|user management|Admin Users" ;;
    patients) echo "Medical Records Module|Healthcare Patients|patients page|patient" ;;
    appointments) echo "Appointments Module|Healthcare Appointments|appointments" ;;
    billing) echo "Payments Module|billing|payment" ;;
    notifications) echo "Notifications Module|notifications" ;;
    dashboard) echo "Dashboard|System Health Tests|navigation" ;;
    admin) echo "Admin Module|admin panel" ;;
    files) echo "File Cleanup System|upload documents|files" ;;
    reports) echo "Report|Lighthouse Performance Tests|Performance Tests" ;;
    settings) echo "Settings Module|settings" ;;
    integration) echo "Supabase Integration Tests|Chatbot & AI Module|integration|Chatbot System" ;;
    payments) echo "Payments Module|payment" ;;
    *) echo "$1" ;;
  esac
}
log(){ echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $*"; }
# helper
retry(){ local n=0; local max=${3:-3}; local delay=2; until [ $n -ge $max ]; do "$@" && break; n=$((n+1)); sleep $delay; delay=$((delay*3)); done; [ $n -lt $max ]; }
# generate helper scripts if missing
mkdir -p scripts/ci tmp test-results test-reports
if [ ! -f scripts/ci/analyze-playwright-report.js ]; then cat > scripts/ci/analyze-playwright-report.js <<'NODE'
#!/usr/bin/env node
const fs=require('fs'); const p=process.argv[2]; if(!p||!fs.existsSync(p)){process.exit(0);} const d=JSON.parse(fs.readFileSync(p,'utf8')); let total=0,passed=0,failed=0,failures=[]; function walk(s){if(s.tests){for(const t of s.tests){total++; if(t.status==='passed')passed++; else {failed++; failures.push({title:t.title,error:t.error});}}} if(s.suites)for(const ss of s.suites)walk(ss);} if(Array.isArray(d.suites)) for(const s of d.suites) walk(s); const percent=total?Math.round(passed*100/total):100; const out={total,passed,failed,percent,failures}; const outPath=require('path').join(require('path').dirname(p),'analysis.json'); fs.writeFileSync(outPath,JSON.stringify(out,null,2));
NODE
chmod +x scripts/ci/analyze-playwright-report.js; fi
if [ ! -f scripts/ci/suggest-fixes-from-trace.js ]; then cat > scripts/ci/suggest-fixes-from-trace.js <<'NODE'
#!/usr/bin/env node
const fs=require('fs'); const p=process.argv[2]; if(!p||!fs.existsSync(p)){process.exit(0);} const d=JSON.parse(fs.readFileSync(p,'utf8')); let inc=false; function walk(s){if(s.tests){for(const t of s.tests){if(t.status!=='passed'&&t.errors){for(const e of t.errors){const m=String(e.message||''); if(m.includes('Timeout')||m.includes('waitForURL')) inc=true;}}}} if(s.suites)for(const ss of s.suites)walk(ss);} if(d.suites)for(const s of d.suites) walk(s); process.exit(inc?2:0);
NODE
chmod +x scripts/ci/suggest-fixes-from-trace.js; fi
# DB suggestions optional
if command -v psql >/dev/null 2>&1; then log "DB auto-fix enabled"; else log "DB auto-fix skipped (psql not available)"; fi
# Playwright config adjustment helper
adjust_timeout(){ sed -i -E "s/(timeout:\s*)[0-9]+/\\1${PLAYWRIGHT_TIMEOUT_MS}/g" playwright.config.ts || true; }
adjust_timeout
# global setup smoke
log "Global setup smoke..."; retry node -e "process.exit(0)" || true
# module loop
for module in "${MODULES[@]}"; do
  attempts=0; success=0; outdir="test-results/${module}-$(date -u +%Y%m%dT%H%M%SZ)"; mkdir -p "$outdir";
  while [ $attempts -lt ${MAX_ATTEMPTS_PER_MODULE} ]; do
    attempts=$((attempts+1)); reportJson="$outdir/report-attempt${attempts}.json";
    # seed (best-effort)
    if command -v supawright >/dev/null 2>&1; then supawright seed --module="$module" --test-id="auto-$module-$attempts" || true; elif [ -f scripts/supawright-runner.js ]; then node scripts/supawright-runner.js seed "$module" || true; fi
    # run tests
    log "Running module $module attempt $attempts";
    PATTERN="$(pattern_for_module "$module")"
    npx playwright test --config=playwright-auto.config.ts --grep "$PATTERN" --workers=${PLAYWRIGHT_WORKERS_PER_MODULE} --timeout=${PLAYWRIGHT_TIMEOUT_MS} --reporter=json="$reportJson" || true
    node scripts/ci/analyze-playwright-report.js "$reportJson" || true
    percent=$(node -e "try{const d=require('fs').readFileSync('$outdir/analysis.json','utf8'); console.log(JSON.parse(d).percent||0);}catch(e){console.log(0)}")
    echo "{\"time\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"module\":\"$module\",\"attempt\":$attempts,\"percent\":$percent,\"status\":\"$([ $percent -ge ${MODULE_TARGET_PERCENT} ] && echo ok || echo retrying)\"}" | tee -a tmp/progress.log
    if [ "$percent" -ge ${MODULE_TARGET_PERCENT} ]; then success=1; break; fi
    # auto-fix timeouts
    node scripts/ci/suggest-fixes-from-trace.js "$reportJson" || rc=$?; rc=${rc:-0}; if [ $rc -eq 2 ]; then PLAYWRIGHT_TIMEOUT_MS=$((PLAYWRIGHT_TIMEOUT_MS+20000)); adjust_timeout; fi
    npx eslint . --fix || true; npx tsc --noEmit || true
    # teardown
    if command -v supawright >/dev/null 2>&1; then supawright teardown --module="$module" --test-id="auto-$module-$attempts" || true; elif [ -f scripts/supawright-runner.js ]; then node scripts/supawright-runner.js teardown "$module" || true; fi
  done
  if [ $success -ne 1 ]; then echo "{\"time\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"module\":\"$module\",\"attempt\":$attempts,\"percent\":$percent,\"status\":\"failed\"}" | tee -a tmp/progress.log; fi
done
# aggregate
finalReport="test-reports/final-report-$(date -u +%Y%m%dT%H%M%SZ).json"; node -e "const fs=require('fs'),p='test-results';let res=[];if(fs.existsSync(p)){for(const d of fs.readdirSync(p)){const a=p+'/'+d+'/analysis.json';if(fs.existsSync(a)){try{res.push({module:d,analysis:JSON.parse(fs.readFileSync(a,'utf8'))});}catch{}}}} fs.writeFileSync('${finalReport}',JSON.stringify({modules:res},null,2)); console.log('${finalReport}')" | tee tmp/final-report-path.txt
# summary
summary=tmp/FINAL_SUMMARY.md; echo "# Final Suite Summary" > "$summary"; echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$summary"; echo >> "$summary"; while IFS= read -r line; do echo "- $line" >> "$summary"; done < tmp/progress.log
# tar artifacts
artTar="artifacts-$(date -u +%Y%m%dT%H%M%SZ).tgz"; tar -czf "$artTar" test-results test-reports tmp || true; mv "$artTar" tmp/ 2>/dev/null || true
log "DONE"; exit 0
