import { createServer } from 'vite';
import { spawn } from 'node:child_process';
const server=await createServer({server:{host:'127.0.0.1',port:5180,strictPort:true}});
await server.listen();
try {
 console.log('Preview HTTP',(await fetch('http://127.0.0.1:5180/',{signal:AbortSignal.timeout(5000)})).status);
 const child=spawn(process.execPath,['node_modules/@playwright/test/cli.js','test',...process.argv.slice(2)],{stdio:'inherit',env:{...process.env,MIRA_QA_URL:'http://127.0.0.1:5180'}});
 process.exitCode=await new Promise(resolve=>child.on('exit',code=>resolve(code??1)));
} finally {await server.close();}
