import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const required=[
  'sala-projeto.html','arq-project-hub.js','arq-resilience.js','arq-account.js',
  'admin-qualidade.html','arq-admin-quality.js','solicitar-orcamento.html','arq-rfq.js',
  'central-oportunidades.html','arq-opportunities.js',
  'docs/ARQSELECT_AUDITORIA_ROADMAP_6_2.md','docs/ARQSELECT_ARQUITETURA_WEEKLY_6_2.md'
];
const fail=[];
for(const f of required) if(!fs.existsSync(path.join(root,f))) fail.push('Arquivo ausente: '+f);

const jsFiles=['arq-config.js','arq-experience.js','arqselect-6.js','arq-project-hub.js','arq-resilience.js','arq-account.js','arq-admin-quality.js','arq-intelligence.js','arq-services.js','arq-rfq.js','arq-opportunities.js','arq-workspace-app-6.js','arq-network.js','arq-onboarding.js','arq-profile-6.js','arq-notifications.js','arq-agenda.js','arq-catalog-import.js','arq-exports.js','arq-moderation.js','sw.js'];
for(const f of jsFiles){
  try{new vm.Script(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});}
  catch(e){fail.push('JS inválido '+f+': '+e.message);}
}

const version=fs.readFileSync('VERSION.txt','utf8');
if(!version.includes('6.2.0'))fail.push('VERSION.txt não está em 6.2.0');

const hubJs=fs.readFileSync('arq-project-hub.js','utf8');
for(const label of ['Visão geral','Produtos','Fornecedores','Prestadores','Orçamentos','Arquivos','Chat','Timeline','Favoritos','Equipe']){
  if(!hubJs.includes(label))fail.push('Aba do Hub ausente: '+label);
}
if(!hubJs.includes('solicitar-orcamento.html?projectId='))fail.push('Hub não abre RFQ inteligente');

const legacyProject=fs.readFileSync('projeto.html','utf8');
if(!legacyProject.includes('sala-projeto.html'))fail.push('projeto.html não redireciona ao Hub canônico');

const rfq=fs.readFileSync('arq-rfq.js','utf8');
for(const action of ['portal_rfq_criar','portal_matching_unificado','portal_especificacoes','portal_projetos'])if(!rfq.includes(action))fail.push('RFQ sem ação: '+action);
for(const field of ['quantidade','medidas','observacoes','prazoDesejado','localizacao','fornecedores','anexos'])if(!rfq.includes(field))fail.push('RFQ sem campo: '+field);

const workspace=fs.readFileSync('arq-workspace-app-6.js','utf8');
for(const action of ['portal_propostas_comparar','portal_proposta_acao'])if(!workspace.includes(action))fail.push('Comparador sem ação: '+action);
for(const action of ['FAVORITAR','SOLICITAR_REVISAO','ABRIR_CHAT','ACEITAR','RECUSAR','ARQUIVAR'])if(!workspace.includes(action))fail.push('Comparador sem operação: '+action);

const ops=fs.readFileSync('arq-opportunities.js','utf8');
for(const action of ['portal_oportunidades_unificadas','portal_oportunidade_status'])if(!ops.includes(action))fail.push('Central de oportunidades sem ação: '+action);

const cfg=fs.readFileSync('arq-config.js','utf8');
if(!cfg.includes('6.2.0'))fail.push('Configuração não está em 6.2.0');

const design=fs.readFileSync('arq-design-system.css','utf8');
const opens=(design.match(/{/g)||[]).length,closes=(design.match(/}/g)||[]).length;
if(opens!==closes)fail.push('CSS com chaves desbalanceadas');
if(!design.includes('ARQSELECT 6.1 — OPERATIONAL CORE'))fail.push('Design System sem camada 6.1');

const audit=fs.readFileSync('docs/ARQSELECT_AUDITORIA_ROADMAP_6_2.md','utf8');
const rows=(audit.match(/^\|\s*\d+\s*\|/gm)||[]).length;
if(rows!==127)fail.push('Roadmap não contém os 127 itens: '+rows);


const weekly=[
  ['conexoes.html','portal_conexoes_rede'],['arq-network.js','portal_recomendacoes_rede'],
  ['arq-onboarding.js','portal_onboarding_salvar'],['arq-intelligence.js','public_descoberta_avancada'],
  ['arq-profile-6.js','public_reputacao'],['arq-notifications.js','portal_notificacoes_unificadas'],
  ['arq-agenda.js','portal_agenda_unificada'],['arq-catalog-import.js','portal_catalogo_importar_lote'],
  ['arq-exports.js','portal_exportacao_gerar'],['arq-moderation.js','admin_moderacao_fila']
];
for(const [file,needle] of weekly){
  if(!fs.existsSync(path.join(root,file)))fail.push('Arquivo Weekly ausente: '+file);
  else if(!fs.readFileSync(path.join(root,file),'utf8').includes(needle))fail.push(file+' sem contrato '+needle);
}
for(const p of ['onboarding-arquiteto.html','onboarding-fornecedor.html','agenda.html','notificacoes.html','importar-catalogo.html','exportacoes.html','admin-moderacao.html','para-arquitetos.html','para-fornecedores.html','para-prestadores.html','para-marcas.html']){
 if(!fs.existsSync(path.join(root,p)))fail.push('Página 6.2 ausente: '+p);
}

if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log('ARQSELECT 6.2 weekly value smoke: OK');