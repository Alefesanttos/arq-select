import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),allowed=new Set(JSON.parse(fs.readFileSync(path.join(root,'backend-contracts-6.0.json'),'utf8')).actions);
const skip=new Set(['node_modules','.git']);const files=[];
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(skip.has(ent.name))continue;const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p);else if(/\.(?:js|html)$/i.test(ent.name)&&!p.includes(path.sep+'assets'+path.sep))files.push(p)}}
walk(root);
const actions=new Map(),patterns=[/\bapi\s*\(\s*['"]([^'"]+)['"]/g,/\.api\s*\(\s*['"]([^'"]+)['"]/g,/\bacao\s*:\s*['"]([^'"]+)['"]/g,/[?&]acao=([A-Za-z0-9_]+)/g];
for(const file of files){const c=fs.readFileSync(file,'utf8');for(const re of patterns){for(const m of c.matchAll(re)){const a=m[1];if(!actions.has(a))actions.set(a,new Set());actions.get(a).add(path.relative(root,file))}}}
const missing=[...actions.keys()].filter(a=>!allowed.has(a)).sort();
const report={scannedFiles:files.length,frontendActions:actions.size,backendActions:allowed.size,missing,usage:Object.fromEntries([...actions].sort().map(([a,s])=>[a,[...s].sort()]))};
fs.mkdirSync(path.join(root,'reports'),{recursive:true});fs.writeFileSync(path.join(root,'reports','contracts-6.0.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({scannedFiles:report.scannedFiles,frontendActions:report.frontendActions,backendActions:report.backendActions,missing},null,2));
if(missing.length)process.exit(2);
