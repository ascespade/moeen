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
