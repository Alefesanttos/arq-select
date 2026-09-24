(function(){
  'use strict';
  const A=window.ARQ,$=id=>document.getElementById(id),token=localStorage.getItem('ARQSELECT_ADMIN_TOKEN');
  if(!token)return;
  const button=document.createElement('button');
  button.type='button';button.className='arq-btn arq-btn--gold';button.textContent='Adicionar catálogo de fornecedor';
  $('grid').before(button);
  button.onclick=async()=>{
    button.disabled=true;
    try{
      const j=await A.api('admin_v4_usuarios',{token,tipo:'FORNECEDOR',busca:''},'POST');
      if(!j.sucesso)throw new Error(j.mensagem||'Não foi possível carregar os fornecedores.');
      const suppliers=(j.usuarios||[]).filter(u=>String(u.STATUS).toUpperCase()==='ATIVO'&&String(u['STATUS APROVACAO']).toUpperCase()==='APROVADO');
      if(!suppliers.length)throw new Error('Nenhum fornecedor ativo e aprovado para vincular o catálogo.');
      const d=A.dialog('catalogAdminUpload','Adicionar catálogo de fornecedor',`<form>
        <label>Fornecedor<select name="fornecedorId" required><option value="">Selecione...</option>${suppliers.map(u=>`<option value="${A.esc(u.ID)}">${A.esc(u.EMPRESA||u.NOME||u.ID)} (${A.esc(u['E-MAIL']||'')})</option>`).join('')}</select></label>
        <label>Título<input name="titulo" maxlength="180" required></label>
        <label>Marca<input name="marca" maxlength="150"></label>
        <label>Linha<input name="linha" maxlength="150"></label>
        <label>Categorias<input name="categorias" maxlength="500" required></label>
        <label>Descrição<textarea name="descricao" maxlength="4000"></textarea></label>
        <label>Arquivo PDF ou imagem (até 8 MB)<input name="arquivo" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" required></label>
        <label><input name="direitosAutorizados" type="checkbox" required> Tenho autorização do fornecedor para publicar este arquivo.</label>
        <p>O envio fica pendente até você revisar e aprovar o catálogo.</p>
        <button class="arq-btn arq-btn--gold" type="submit">Enviar para revisão</button><p role="status" aria-live="polite"></p>
      </form>`);
      d.querySelector('form').onsubmit=async e=>{
        e.preventDefault();const form=e.currentTarget,send=form.querySelector('[type=submit]'),status=form.querySelector('[role=status]'),file=form.elements.arquivo.files[0];
        if(!file||file.size>8*1024*1024){status.textContent='Selecione um arquivo de até 8 MB.';return;}
        send.disabled=true;status.textContent='Enviando catálogo…';
        try{
          const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Não foi possível ler o arquivo.'));reader.readAsDataURL(file);});
          const values=Object.fromEntries(new FormData(form));
          const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),90000);
          let result;
          try{
            const response=await fetch(window.ARQSELECT_ADMIN_API_URL,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({acao:'admin_catalogo_publicar',token,...values,direitosAutorizados:true,arquivo:{nome:file.name,mimeType:file.type,base64:String(dataUrl).split(',')[1]}}),signal:controller.signal});
            result=await response.json();
          }finally{clearTimeout(timer);}
          if(!result?.sucesso)throw new Error(result?.mensagem||'Não foi possível salvar o catálogo. Confira a instalação do Apps Script build 633.');
          d.close();A.toast(result.mensagem);await window.load();
        }catch(error){status.textContent=error.name==='AbortError'?'O envio demorou. Atualize a lista antes de tentar outra vez.':error.message;send.disabled=false;}
      };
    }catch(error){A.toast(error.message||'Não foi possível abrir o envio.');}
    finally{button.disabled=false;}
  };
})();
