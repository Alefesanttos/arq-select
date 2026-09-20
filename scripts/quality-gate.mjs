import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const errors=[];
const required=['index.html','login.html','projeto.html','matching.html','comparar-propostas.html','especificacoes.html','arquivos-projeto.html','chat.html','explorar.html','produto.html','arq-config.js','arq-design-system.css','arq-experience.js','arq-ecosystem-6.js','arqselect-6.js','arq-workspace-6.js','arq-workspace-app-6.js'];
for(const f of required){if(!fs.existsSync(f))errors.push('Ausente: '+f)}
for(const f of fs.readdirSync('.').filter(x=>x.endsWith('.js'))){const r=spawnSync(process.execPath,['--check',f],{encoding:'utf8'});if(r.status!==0)errors.push('JS inválido: '+f)}
const css=fs.readFileSync('arq-design-system.css','utf8');
if((css.match(/{/g)||[]).length!==(css.match(/}/g)||[]).length)errors.push('CSS desbalanceado');
const version=fs.readFileSync('VERSION.txt','utf8');
if(!version.includes('ARQSELECT 6.0.0'))errors.push('Versão incorreta');
const project=fs.readFileSync('arq-workspace-app-6.js','utf8');
if(!project.includes('arq-project-tabs'))errors.push('Hub do Projeto ausente');
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Quality gate ARQSELECT 6.0 aprovado.');