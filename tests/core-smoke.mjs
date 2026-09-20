import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const required=[
  'sala-projeto.html','arq-project-hub.js','arq-resilience.js','arq-account.js',
  'admin-qualidade.html','arq-admin-quality.js','docs/ARQSELECT_AUDITORIA_ROADMAP_6_0.md',
  'docs/ARQSELECT_ARQUITETURA_CORE_6_0.md'
];
const fail=[];
for(const f of required) if(!fs.existsSync(path.join(root,f))) fail.push('Arquivo ausente: '+f);

const jsFiles=['arq-config.js','arq-experience.js','arqselect-6.js','arq-project-hub.js','arq-resilience.js','arq-account.js','arq-admin-quality.js','arq-intelligence.js','arq-services.js','sw.js'];
for(const f of jsFiles){
  try{new vm.Script(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});}
  catch(e){fail.push('JS inválido '+f+': '+e.message);}
}

const version=fs.readFileSync('VERSION.txt','utf8');
if(!version.includes('6.0.0'))fail.push('VERSION.txt não está em 6.0.0');

const hub=fs.readFileSync('sala-projeto.html','utf8');
for(const label of ['Visão geral','Produtos','Fornecedores','Prestadores','Orçamentos','Arquivos','Chat','Timeline','Favoritos','Equipe']){
  if(!hub.includes(label)&&!fs.readFileSync('arq-project-hub.js','utf8').includes(label))fail.push('Aba do Hub ausente: '+label);
}

const projects=fs.readFileSync('ARQSELECT_ARQUITETO_PROJETOS.html','utf8');
if(!projects.includes('sala-projeto.html?projectId='))fail.push('Lista de projetos não abre Hub canônico');

const cfg=fs.readFileSync('arq-config.js','utf8');
if(!cfg.includes('arq-resilience.js?v=6.0.0'))fail.push('Resiliência global não carregada');

const settings=fs.readFileSync('configuracoes.html','utf8');
for(const id of ['notificationPrefs','exportMyData','requestDeletion','accountFeedback'])if(!settings.includes(id))fail.push('Configuração ausente: '+id);

const design=fs.readFileSync('arq-design-system.css','utf8');
const opens=(design.match(/{/g)||[]).length,closes=(design.match(/}/g)||[]).length;
if(opens!==closes)fail.push('CSS com chaves desbalanceadas');

const audit=fs.readFileSync('docs/ARQSELECT_AUDITORIA_ROADMAP_6_0.md','utf8');
const rows=(audit.match(/^| d+ |/gm)||[]).length;
if(rows!==127)fail.push('Roadmap não contém os 127 itens: '+rows);

if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log('ARQSELECT 6.0 core smoke: OK');
