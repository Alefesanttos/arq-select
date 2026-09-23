import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const required=[
  'sala-projeto.html','arq-project-hub.js','arq-resilience.js','arq-account.js',
  'admin-qualidade.html','arq-admin-quality.js','solicitar-orcamento.html','arq-rfq.js',
  'central-oportunidades.html','arq-opportunities.js',
  'docs/ARQSELECT_AUDITORIA_ROADMAP_6_3.md','docs/ARQSELECT_ARQUITETURA_CORE_6_3.md','docs/ARQSELECT_BACKEND_6_3.md'
];
required.push('networking.html');
required.push('arq-network.js');
required.push('em-alta.html');
required.push('arq-trends.js');
required.push('agenda.html');
required.push('arq-agenda.js');
required.push('onboarding.html');
required.push('arq-onboarding.js');
required.push('arq-profile-intelligence.js');
required.push('blog.html');
required.push('cases.html');
required.push('eventos.html');
required.push('planos.html');
required.push('indicacoes.html');
required.push('organizacao.html');
required.push('importar-catalogo.html');
required.push('exportar.html');
required.push('admin-webhooks.html');
required.push('recentes.html');
required.push('mapa.html');
required.push('arq-product-intelligence.js');
required.push('app-mobile.html');
required.push('arq-mobile-app.css');
required.push('arq-mobile-app.js');
const fail=[];
for(const f of required) if(!fs.existsSync(path.join(root,f))) fail.push('Arquivo ausente: '+f);

const jsFiles=['arq-config.js','arq-experience.js','arqselect-6.js','arq-project-hub.js','arq-resilience.js','arq-account.js','arq-admin-quality.js','arq-intelligence.js','arq-services.js','arq-rfq.js','arq-opportunities.js','arq-workspace-app-6.js','arq-network.js','arq-trends.js','arq-agenda.js','arq-onboarding.js','arq-profile-intelligence.js','arq-content.js','arq-plans.js','arq-referrals.js','arq-organization.js','arq-catalog-import.js','arq-export.js','arq-webhooks.js','arq-recent.js','arq-map.js','arq-product-intelligence.js','arq-mobile-app.js','sw.js'];
for(const f of jsFiles){
  try{new vm.Script(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});}
  catch(e){fail.push('JS inválido '+f+': '+e.message);}
}

const version=fs.readFileSync('VERSION.txt','utf8');
if(!version.includes('6.3.0'))fail.push('VERSION.txt não está em 6.3.0');

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

const mobileHtml=fs.readFileSync('app-mobile.html','utf8');
if(!mobileHtml.includes('rel="manifest"'))fail.push('App móvel sem manifesto PWA');
if(!mobileHtml.includes('arq-mobile-app.js'))fail.push('App móvel sem controlador de navegação');
const mobileManifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
if(mobileManifest.start_url!=='./app-mobile.html')fail.push('Manifesto não abre o app móvel');
if(mobileManifest.scope!=='./')fail.push('Manifesto PWA sem escopo da plataforma');
for(const route of ['ARQSELECT_LOGIN_ARQUITETO.html','ARQSELECT_LOGIN_FORNECEDOR.html','ARQSELECT_LOGIN_PRESTADOR.html','ARQSELECT_DASHBOARD_ARQUITETO.html','ARQSELECT_DASHBOARD_FORNECEDOR.html','dashboard-prestador.html','admin-commerce.html','admin-qualidade.html','solicitar-orcamento.html','comparar-propostas.html','chat.html','explorar.html','feed.html','networking.html','agenda.html','notificacoes.html','suporte.html']){
  if(!fs.existsSync(path.join(root,route)))fail.push('App móvel referencia página ausente: '+route);
}
const mobileSw=fs.readFileSync('sw.js','utf8');
for(const asset of ['./app-mobile.html','./arq-mobile-app.css','./arq-mobile-app.js'])if(!mobileSw.includes(asset))fail.push('Service worker sem recurso do app: '+asset);

const cfg=fs.readFileSync('arq-config.js','utf8');
if(!cfg.includes('6.3.0'))fail.push('Configuração não está em 6.3.0');

const design=fs.readFileSync('arq-design-system.css','utf8');
const opens=(design.match(/{/g)||[]).length,closes=(design.match(/}/g)||[]).length;
if(opens!==closes)fail.push('CSS com chaves desbalanceadas');
if(!design.includes('ARQSELECT 6.3 — SCALE / REVENUE / INTEGRATIONS'))fail.push('Design System sem camada 6.3');

const audit=fs.readFileSync('docs/ARQSELECT_AUDITORIA_ROADMAP_6_3.md','utf8');
const rows=(audit.match(/^\|\s*\d+\s*\|/gm)||[]).length;
if(rows!==127)fail.push('Roadmap não contém os 127 itens: '+rows);

if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log('ARQSELECT 6.3 full platform smoke: OK');