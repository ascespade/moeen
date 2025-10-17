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
