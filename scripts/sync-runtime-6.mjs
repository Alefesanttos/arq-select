import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),version='6.0.0';
const assetNames=['arq-config.js','arq-design-system.css','arq-experience.js','arqselect-6.js','arqselect-6.css','arq-services.js','arq-services.css','arq-premium.js','arq-premium.css','arq-ui-5.css','arq-polish.css','arq-workspace-6.js','arq-workspace-app-6.js','arq-intelligence.js','arq-business.js','arq-performance.js','arq-commerce.js','arq-project-hub.js','arq-account.js','arq-resilience.js','arq-admin-quality.js'];
const skipDirs=new Set(['.git','node_modules','assets']),files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(skipDirs.has(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(html|js)$/i.test(e.name))files.push(p)}}
walk(root);
let changed=[];
for(const file of files){let c=fs.readFileSync(file,'utf8'),before=c;
 for(const asset of assetNames){const re=asset.replace(/[.*+?^$()|[\]\\{}]/g,'\\$&');c=c.replace(new RegExp(re+'\\?v=[0-9.]+','g'),asset+'?v='+version)}
 c=c.replace(/ARQSELECT 5\.7/g,'ARQSELECT 6.0');
 if(c!==before){fs.writeFileSync(file,c);changed.push(path.relative(root,file))}}
fs.mkdirSync(path.join(root,'reports'),{recursive:true});fs.writeFileSync(path.join(root,'reports','runtime-sync-6.0.json'),JSON.stringify({version,changedFiles:changed.length,files:changed},null,2));
console.log(JSON.stringify({version,changedFiles:changed.length,files:changed.slice(0,120)},null,2));