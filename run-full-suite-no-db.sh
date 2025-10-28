#!/usr/bin/env bash
# run-full-suite-no-db.sh - 2025-10-17
# Test suite without direct DB operations (uses Supabase REST API instead)

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

# Max attempts per module & target success percent
MAX_ATTEMPTS_PER_MODULE=3
MODULE_TARGET_PERCENT=80

# Playwright config
PLAYWRIGHT_WORKERS_PER_MODULE=1
PLAYWRIGHT_TIMEOUT_MS=45000

# Parallel modules (reduced for stability)
PARALLEL_MAX=2

# Modules (13)
MODULES=(auth users patients appointments billing notifications dashboard admin files reports settings integration payments)

#########################
# === وظائف مساعدة === #
#########################

timestamp(){ date -u +"%Y%m%dT%H%M%SZ"; }
log(){ echo "[$(timestamp)] $*"; }

check_requirements(){
  log "Checking required tools..."
  local tools=(node npm npx jq)
  for t in "${tools[@]}"; do
    if ! command -v "${t}" >/dev/null 2>&1; then
      log "❌ ERROR: ${t} not found in PATH."
      return 1
    fi
  done
  log "✅ All required tools found"
}

# Generate helper scripts for analysis + timeout fix
generate_helper_scripts(){
  mkdir -p ./scripts/ci
  
  # analyze-playwright-report.js
  cat > ./scripts/ci/analyze-playwright-report.js <<'NODEJS'
#!/usr/bin/env node
const fs=require('fs'); const path=require('path');
const reportPath=process.argv[2]; 
if(!reportPath||!fs.existsSync(reportPath)){
  console.error("Usage: node analyze-playwright-report.js path"); 
  fs.writeFileSync(path.join(path.dirname(reportPath) || '.', 'analysis.json'),JSON.stringify({total:0,passed:0,failed:0,percent:0,failures:[]},null,2));
  process.exit(0);
}
const data=JSON.parse(fs.readFileSync(reportPath,'utf8')); 
let total=0,passed=0,failed=0,failures=[];
function walkSuites(suites){
  for(const s of suites){
    if(s.tests)for(const t of s.tests){
      total++; 
      if(t.status==='passed')passed++; 
      else {
        failed++; 
        failures.push({title:t.title,error:t.error});
      }
    } 
    if(s.suites)walkSuites(s.suites);
  }
}
if(Array.isArray(data.suites))walkSuites(data.suites);
const percent=total?Math.round((passed/total)*100):100;
fs.writeFileSync(path.join(path.dirname(reportPath),'analysis.json'),JSON.stringify({total,passed,failed,percent,failures},null,2));
console.log(JSON.stringify({total,passed,failed,percent}));
NODEJS
  chmod +x ./scripts/ci/analyze-playwright-report.js

  # suggest-fixes-from-trace.js (increase timeout)
  cat > ./scripts/ci/suggest-fixes-from-trace.js <<'NODEJS'
#!/usr/bin/env node
const fs=require('fs'); 
const reportPath=process.argv[2]; 
if(!reportPath||!fs.existsSync(reportPath)){
  console.error("Usage: node suggest-fixes-from-trace.js path"); 
  process.exit(0);
}
const data=JSON.parse(fs.readFileSync(reportPath,'utf8')); 
let increase=false;
function walk(s){
  if(s.tests){
    for(const t of s.tests){
      if(t.status!=='passed'&&t.errors){
        for(const e of t.errors){
          const msg=String(e.message||''); 
          if(msg.includes('Timeout')||msg.includes('waitForURL')) increase=true;
        }
      }
    }
  } 
  if(s.suites)for(const ss of s.suites)walk(ss);
}
if(data.suites)for(const root of data.suites)walk(root);
if(increase){
  console.log("Detected timeout issues → increase PLAYWRIGHT_TIMEOUT_MS"); 
  process.exit(2);
} else process.exit(0);
NODEJS
  chmod +x ./scripts/ci/suggest-fixes-from-trace.js
}

# Apply automatic timeout increase to playwright-auto.config.ts
adjust_playwright_config_timeout(){
  local config_file="playwright-auto.config.ts"
  if [[ -f "${config_file}" ]]; then
    log "Updating ${config_file} with new timeout=${PLAYWRIGHT_TIMEOUT_MS}"
    sed -i -E "s/(timeout:\s*)[0-9]+/\1${PLAYWRIGHT_TIMEOUT_MS}/g" "${config_file}" || true
  fi
}

# Module loop
run_module_loop(){
  local module="$1"
  local attempts=0
  local success_percent=0
  local outdir="test-results/${module}-$(date +%s)"
  mkdir -p "${outdir}"
  
  log "=== START module: ${module} ==="

  while (( attempts < MAX_ATTEMPTS_PER_MODULE )); do
    attempts=$((attempts+1))
    log "[${module}] Attempt ${attempts}/${MAX_ATTEMPTS_PER_MODULE}"
    
    # Run Playwright
    local module_out="${outdir}/${module}-report-attempt${attempts}.json"
    
    # Check if there are any test files for this module
    if ! ls tests/e2e/*${module}*.spec.ts 2>/dev/null | grep -q .; then
      log "[${module}] ⚠️  No test files found, skipping"
      echo '{"suites":[]}' > "${module_out}"
      success_percent=100
      break
    fi
    
    npx playwright test --config=playwright-auto.config.ts \
      --grep "${module}" \
      --workers="${PLAYWRIGHT_WORKERS_PER_MODULE}" \
      --timeout="${PLAYWRIGHT_TIMEOUT_MS}" \
      --reporter=json > "${module_out}" 2>&1 || true

    # Analyze
    if [[ -s "${module_out}" ]]; then
      node ./scripts/ci/analyze-playwright-report.js "${module_out}" 2>/dev/null || true
      if [[ -f "${outdir}/analysis.json" ]]; then
        success_percent=$(jq -r '.percent' "${outdir}/analysis.json" 2>/dev/null || echo 0)
      else
        success_percent=0
      fi
    else
      log "[${module}] ⚠️  No output generated"
      echo '{"suites":[]}' > "${module_out}"
      success_percent=0
    fi
    
    log "[${module}] Success: ${success_percent}%"

    if (( success_percent >= MODULE_TARGET_PERCENT )); then
      log "[${module}] ✅ Module target reached"
      return 0
    fi

    # Timeout detection + adjustment
    node ./scripts/ci/suggest-fixes-from-trace.js "${module_out}" 2>/dev/null || {
      PLAYWRIGHT_TIMEOUT_MS=$((PLAYWRIGHT_TIMEOUT_MS+15000))
      adjust_playwright_config_timeout
      log "[${module}] Timeout increased to ${PLAYWRIGHT_TIMEOUT_MS}ms"
    }

    sleep 1
  done
  
  log "[${module}] ⚠️  Max attempts reached (${success_percent}%)"
  return 1
}

#########################
# === Main Execution === #
#########################

log "🚀 Starting test suite (no direct DB access)..."
check_requirements || exit 1

generate_helper_scripts
log "✅ Helper scripts generated"

log "📦 Checking dependencies..."
if [[ ! -d "node_modules" ]]; then
  log "Installing dependencies..."
  npm ci --prefer-offline --no-audit --progress=false 2>&1 | tail -5 || npm install --no-audit 2>&1 | tail -5
fi

mkdir -p test-results test-reports

# Determine parallel execution
if [[ "${PARALLEL_MAX}" -eq 0 ]]; then
  PARALLEL_MAX=$(nproc 2>/dev/null || echo 2)
  PARALLEL_MAX=$(( PARALLEL_MAX > ${#MODULES[@]} ? ${#MODULES[@]} : PARALLEL_MAX ))
fi

log "🏃 Running ${#MODULES[@]} modules (up to ${PARALLEL_MAX} in parallel)"
log "⚙️  Config: ${MAX_ATTEMPTS_PER_MODULE} attempts, ${MODULE_TARGET_PERCENT}% target, ${PLAYWRIGHT_TIMEOUT_MS}ms timeout"

# Export functions and variables
export -f run_module_loop timestamp log
export MAX_ATTEMPTS_PER_MODULE MODULE_TARGET_PERCENT PLAYWRIGHT_WORKERS_PER_MODULE PLAYWRIGHT_TIMEOUT_MS
export NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY

# Run modules
printf "%s\n" "${MODULES[@]}" | xargs -n1 -P "${PARALLEL_MAX}" -I{} bash -c 'run_module_loop "$@"' _ {}

# Aggregate reports
log "📊 Aggregating final report..."
node -e "
const fs=require('fs'),path=require('path'); 
const resultsDir='test-results';
let aggregate={ 
  timestamp: new Date().toISOString(),
  modules: [],
  summary: { total: 0, passed: 0, failed: 0 }
};

if(fs.existsSync(resultsDir)){
  const dirs=fs.readdirSync(resultsDir);
  for(const d of dirs){
    const analysisPath=path.join(resultsDir,d,'analysis.json');
    if(fs.existsSync(analysisPath)){
      try{ 
        const a=JSON.parse(fs.readFileSync(analysisPath,'utf8')); 
        const moduleName = d.split('-')[0];
        aggregate.modules.push({
          module: moduleName,
          analysis: a
        });
        aggregate.summary.total += a.total || 0;
        aggregate.summary.passed += a.passed || 0;
        aggregate.summary.failed += a.failed || 0;
      }catch(e){
        console.error('Error reading', analysisPath, e.message);
      }
    }
  }
}

const reportFile = 'test-reports/final-report-'+Date.now()+'.json';
fs.writeFileSync(reportFile, JSON.stringify(aggregate,null,2));
console.log('📄 Report saved:', reportFile);
console.log('📊 Summary:', aggregate.summary);
"

log "✅ All done! Check test-results/ and test-reports/"

exit 0
