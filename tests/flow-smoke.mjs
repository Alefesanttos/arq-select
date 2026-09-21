import { chromium } from 'playwright';
const base='http://127.0.0.1:4173/';
const results=[];
function ok(name,detail=''){results.push({name,ok:true,detail});console.log('PASS',name,detail)}
function fail(name,e){results.push({name,ok:false,detail:String(e?.message||e)});console.error('FAIL',name,e)}
function actionFrom(req){try{const u=new URL(req.url()),q=u.searchParams.get('acao')||u.searchParams.get('action');if(q)return q;const d=req.postDataJSON?.();return d?.acao||d?.action||''}catch{return''}}
function responseFor(a,req){
 const baseR={sucesso:true,autorizado:true,build:'TEST-6.0'};
 const map={
  login_arquiteto:{...baseR,token:'TOK-TEST',perfil:{id:'ARQ-1',nome:'Arquiteto Teste',email:'arq@test.local'}},
  portal_sessao:{...baseR,perfil:{id:'ARQ-1',tipo:'ARQUITETO',nome:'Arquiteto Teste'}},
  portal_projetos:{...baseR,projetos:[{id:'P1',projeto:'Casa Campinas',tipo:'Residencial alto padrão',cidade:'Campinas',estado:'SP',status:'Cotação'}],statusValidos:['Novo','Cotação','Negociação']},
  portal_projeto_hub:{...baseR,projeto:{id:'P1',projeto:'Casa Campinas',tipo:'Residencial alto padrão',cidade:'Campinas',estado:'SP',area:'450',status:'Cotação',cliente:'Cliente Teste',orcamento:350000,prazo:'90 dias'},metricas:{especificacoes:1,propostas:1,fornecedores:1,oportunidades:1,arquivos:1,equipe:1},equipe:[{ID:'E1',NOME:'Arquiteto Teste',PAPEL:'ADMINISTRADOR',STATUS:'ATIVO'}],oportunidades:[],timeline:[{id:'T1',data:new Date().toISOString(),tipo:'PROPOSTA',titulo:'Proposta recebida',texto:'Fornecedor Teste'}]},
  portal_sala_projeto:{...baseR,projeto:{id:'P1',projeto:'Casa Campinas',cidade:'Campinas',estado:'SP',status:'Cotação'},metricas:{especificacoes:1,propostas:1,fornecedores:1},fornecedores:[{'FORNECEDOR ID':'F1','FORNECEDOR NOME':'Fornecedor Teste',STATUS:'VINCULADO'}],amostras:[],aprovacoes:[]},
  portal_especificacoes:{...baseR,especificacoes:[{ID:'S1',NOME:'Piso Carvalho Natural',CATEGORIA:'Pisos',AMBIENTE:'Sala',QUANTIDADE:'80',UNIDADE:'m²',STATUS:'ATIVO'}]},
  portal_especificacoes_cotar:{...baseR,mensagem:'Solicitações criadas.',total:1},
  portal_propostas_comparar:{...baseR,propostas:[{id:'PROP1',fornecedor:'Fornecedor Teste',produto:'Piso Carvalho Natural',valorTotal:12000,frete:500,prazo:'20 dias',condicao:'10x',nota:4.8,avaliacoes:12,status:'ACEITA'}]},
  portal_matching_projeto:{...baseR,metodo:'Compatibilidade por projeto',recomendados:[{id:'F1',nome:'Fornecedor Teste',categoria:'Pisos',cidade:'Campinas',estado:'SP',score:94,motivos:['categoria compatível','mesma cidade'],selos:'VERIFICADO'}]},
  portal_pedido_criar:{...baseR,id:'PED1',mensagem:'Pedido criado.'},
  portal_amostras:{...baseR,amostras:[]},
  portal_documentos_tecnicos:{...baseR,documentos:[]},
  portal_documento_tecnico_upload:{...baseR,id:'DOC1',mensagem:'Documento publicado.'},
  portal_documento_tecnico_salvar:{...baseR,id:'DOC1',mensagem:'Documento publicado.'},
  portal_clientes_projeto:{...baseR,clientes:[],aprovacoes:[]},
  portal_pedidos:{...baseR,pedidos:[]},
  portal_favoritos:{...baseR,favoritos:[]},
  portal_vistos_recentemente:{...baseR,itens:[]},
  portal_preferencias_notificacao:{...baseR,preferencias:[]},
  portal_perfil_completude:{...baseR,completude:80,faltando:['Telefone']},
  public_busca_inteligente:{...baseR,resultados:[],metodo:'teste'},
  public_web_vitals:{...baseR},
  portal_evento_analytics:{...baseR},
  portal_registrar_visualizacao:{...baseR},
  portal_monitor_evento:{...baseR},
  portal_rascunho_obter:{...baseR,rascunho:null},
  portal_rascunho_salvar:{...baseR},
  portal_rascunho_excluir:{...baseR},
  portal_conversas:{...baseR,conversas:[]},
  portal_mensagens:{...baseR,mensagens:[]},
  portal_contatos:{...baseR,contatos:[]},
  admin_v4_conversas:{...baseR,conversas:[]},
  admin_v4_mensagens:{...baseR,mensagens:[]},
  portal_notificacoes:{...baseR,notificacoes:[]},
  arq4_boards:{...baseR,boards:[]},
  public_feed:{...baseR,posts:[],tendencias:[]}
 };
 return map[a]||baseR;
}
async function setup(page,role='ARQUITETO'){
 await page.addInitScript(({role})=>{localStorage.setItem('ARQSELECT_PORTAL_TOKEN','TOK-TEST');localStorage.setItem('ARQSELECT_PORTAL_TIPO',role);localStorage.setItem('ARQSELECT_PORTAL_ID',role+'-1');localStorage.setItem('ARQSELECT_PORTAL_EMAIL','test@arq.local')},{role});
 await page.route('https://script.google.com/**',async route=>{const a=actionFrom(route.request());await route.fulfill({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(responseFor(a,route.request()))})});
}
async function noOverflow(page,label,tolerance=6){const d=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:window.innerWidth}));if(d.sw>d.iw+tolerance)throw new Error(label+' overflow '+d.sw+'>'+d.iw)}
const browser=await chromium.launch({headless:true});
async function newPage(options){const p=await browser.newPage(options);p.setDefaultTimeout(5000);p.setDefaultNavigationTimeout(8000);return p}
try{
 // Login
 try{const p=await newPage({viewport:{width:1366,height:768}});await p.route('https://script.google.com/**',async r=>r.fulfill({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(responseFor(actionFrom(r.request()),r.request()))}));await p.goto(base+'ARQSELECT_LOGIN_ARQUITETO.html');await p.fill('#email','arq@test.local');await p.fill('#senha','senha123');await p.getByRole('button',{name:/ENTRAR NO PAINEL/i}).click();await p.waitForURL(/ARQSELECT_DASHBOARD_ARQUITETO\.html/,{timeout:5000});const tok=await p.evaluate(()=>localStorage.getItem('ARQSELECT_PORTAL_TOKEN'));if(tok!=='TOK-TEST')throw new Error('token não persistido');ok('login');await p.close()}catch(e){fail('login',e)}

 // Project hub
 try{const p=await newPage({viewport:{width:1366,height:768}});await setup(p);await p.goto(base+'sala-projeto.html?projectId=P1');await p.waitForFunction(()=>document.querySelector('#projectHubTitle')?.textContent.includes('Casa Campinas'));if(await p.locator('#projectTabs a').count()<10)throw new Error('abas incompletas');await noOverflow(p,'project desktop');ok('projeto/hub');await p.close()}catch(e){fail('projeto/hub',e)}

 // Quotation
 try{const p=await newPage({viewport:{width:1280,height:800}});await setup(p);await p.goto(base+'especificacoes.html?projectId=P1');await p.waitForTimeout(600);console.log('DIAG specs',JSON.stringify(await p.evaluate(()=>({A:!!window.ARQSELECT6,W:!!window.ARQWorkspace6,module:document.body.dataset.module,text:document.querySelector('#moduleContent')?.innerText,token:localStorage.getItem('ARQSELECT_PORTAL_TOKEN'),role:localStorage.getItem('ARQSELECT_PORTAL_TIPO')}))));await p.waitForFunction(()=>document.body.textContent.includes('Piso Carvalho Natural'));await p.locator('#quoteSpecs').click();await p.locator('#quoteForm input[name="cidade"]').fill('Campinas');await p.locator('#quoteForm input[name="prazo"]').fill('30 dias');await p.locator('#quoteForm button[type="submit"]').click();await p.waitForURL(/comparar-propostas\.html/,{timeout:5000});ok('cotação');await p.close()}catch(e){fail('cotação',e)}

 // Matching
 try{const p=await newPage({viewport:{width:1280,height:800}});await setup(p);await p.goto(base+'matching.html?projectId=P1');await p.waitForTimeout(600);console.log('DIAG matching',JSON.stringify(await p.evaluate(()=>({A:!!window.ARQSELECT6,W:!!window.ARQWorkspace6,module:document.body.dataset.module,text:document.querySelector('#moduleContent')?.innerText}))));await p.waitForFunction(()=>document.body.textContent.includes('Fornecedor Teste'));if(!(await p.textContent('body')).includes('94%'))throw new Error('score não renderizado');ok('matching');await p.close()}catch(e){fail('matching',e)}

 // Proposal
 try{const p=await newPage({viewport:{width:1280,height:800}});await setup(p);await p.goto(base+'comparar-propostas.html?projectId=P1');await p.waitForTimeout(600);console.log('DIAG compare',JSON.stringify(await p.evaluate(()=>({A:!!window.ARQSELECT6,W:!!window.ARQWorkspace6,module:document.body.dataset.module,text:document.querySelector('#moduleContent')?.innerText}))));await p.waitForFunction(()=>document.body.textContent.includes('Fornecedor Teste'));await p.getByRole('button',{name:/Emitir pedido/i}).click();await p.waitForURL(/pedidos\.html/,{timeout:5000});ok('proposta/pedido');await p.close()}catch(e){fail('proposta/pedido',e)}

 // Chat
 try{const p=await newPage({viewport:{width:1280,height:800}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await setup(p);await p.goto(base+'chat.html');await p.waitForSelector('#composerWrap');await noOverflow(p,'chat desktop',12);if(errors.length)throw new Error(errors.join('; '));ok('chat');await p.close()}catch(e){fail('chat',e)}

 // Favorites
 try{const p=await newPage({viewport:{width:1280,height:800}});await setup(p);await p.goto(base+'favoritos.html');await p.waitForLoadState('domcontentloaded');if(!(await p.textContent('body')).match(/favorit/i))throw new Error('conteúdo de favoritos ausente');ok('favoritos');await p.close()}catch(e){fail('favoritos',e)}

 // Upload
 try{const p=await newPage({viewport:{width:1280,height:800}});await setup(p,'FORNECEDOR');await p.goto(base+'biblioteca-tecnica.html');await p.waitForTimeout(600);console.log('DIAG docs',JSON.stringify(await p.evaluate(()=>({A:!!window.ARQSELECT6,W:!!window.ARQWorkspace6,module:document.body.dataset.module,text:document.querySelector('#moduleContent')?.innerText}))));await p.waitForSelector('#newDoc');await p.locator('#newDoc').click();const input=p.locator('input[type=file]');await input.setInputFiles({name:'ficha.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4 test')});await p.locator('#docForm input[name="titulo"]').fill('Ficha técnica teste');await p.locator('#docForm input[name="direitos"]').check();await p.locator('#docForm button[type="submit"]').click();await p.waitForTimeout(350);ok('upload');await p.close()}catch(e){fail('upload',e)}

 // Mobile key pages
 for(const [w,h] of [[360,800],[390,844],[768,1024]]){
  for(const target of ['index.html','sala-projeto.html?projectId=P1','chat.html','explorar.html']){
   const name='mobile '+w+' '+target.split('?')[0];try{const p=await newPage({viewport:{width:w,height:h}});await setup(p);await p.goto(base+target);await p.waitForLoadState('domcontentloaded');await p.waitForTimeout(300);await noOverflow(p,name,14);ok(name);await p.close()}catch(e){fail(name,e)}
  }
 }
}finally{await browser.close()}
const failed=results.filter(x=>!x.ok);console.log(JSON.stringify({total:results.length,passed:results.length-failed.length,failed:failed.length,results},null,2));if(failed.length)process.exit(1);
