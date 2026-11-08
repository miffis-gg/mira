import { createServer } from 'vite';
import { chromium } from '@playwright/test';
const server=await createServer({server:{host:'127.0.0.1',port:5180,strictPort:true}});
await server.listen();
try {
 const response=await fetch('http://127.0.0.1:5180/',{signal:AbortSignal.timeout(5000)});
 console.log('HTTP',response.status);
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('http://127.0.0.1:5180/',{timeout:15000});
 console.log('Title',await page.title());
 await page.evaluate(()=>document.fonts.ready);
 await page.addStyleTag({content:'section{content-visibility:visible !important}'});
 await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=900){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,100));}window.scrollTo({top:0,behavior:'instant'});});
 await page.screenshot({path:'qa/screenshots/preview-1440.png',fullPage:true});
 await page.screenshot({path:'qa/screenshots/hero-1440.png'});
 await browser.close();
} catch(e) {console.error(e.message);process.exitCode=1;} finally {await server.close();}
