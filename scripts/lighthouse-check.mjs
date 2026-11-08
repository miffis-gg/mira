import { preview } from 'vite';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import fs from 'node:fs/promises';
const server=await preview({preview:{host:'127.0.0.1',port:5181,strictPort:true}});
const chrome=await launch({chromePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',chromeFlags:['--headless','--disable-gpu','--no-first-run']});
try{
 await fs.mkdir('qa/lighthouse',{recursive:true});
 for(const preset of ['mobile','desktop']){
  const result=await lighthouse('http://127.0.0.1:5181/',{port:chrome.port,output:'html',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo'],...(preset==='desktop'?{formFactor:'desktop',screenEmulation:{mobile:false,width:1440,height:900,deviceScaleFactor:1,disabled:false},throttlingMethod:'provided'}:{})});
  if(!result)throw Error('Lighthouse returned no result');
  await fs.writeFile(`qa/lighthouse/${preset}.html`,result.report);
  const summary={categories:Object.fromEntries(Object.entries(result.lhr.categories).map(([id,v])=>[id,Math.round((v.score??0)*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','cumulative-layout-shift','total-blocking-time'].map(id=>[id,result.lhr.audits[id].displayValue])),issues:Object.values(result.lhr.audits).filter(a=>a.score!==null&&a.score<1&&a.details?.type!=='opportunity').map(a=>({id:a.id,title:a.title,score:a.score,description:a.description}))};
  await fs.writeFile(`qa/lighthouse/${preset}.json`,JSON.stringify(summary,null,2));console.log(preset,JSON.stringify(summary));
 }
} finally {await chrome.kill();await new Promise(resolve=>server.httpServer.close(resolve));}
