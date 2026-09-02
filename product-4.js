(function () {
  "use strict";
  const id = new URLSearchParams(location.search).get("id") || "";
  if (!id) return;
  const esc4 = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  const values = value => { try { const parsed=JSON.parse(value);return Array.isArray(parsed)?parsed:[]; } catch (_) { return String(value||"").split(/\n/).map(x=>x.trim()).filter(Boolean); } };
  const safeUrl = value => { try { const parsed=new URL(value,location.href);return parsed.protocol==="https:"?parsed.href:""; } catch (_) { return ""; } };

  async function enhance() {
    const result = await ARQSELECT4.api("portal_produto", {id});
    if (!result.sucesso || !result.produto) return;
    const product = result.produto;
    const app = document.getElementById("app");
    if (!app) return;
    const mainImage = app.querySelector(".thumb img");
    const thumbnails = [...app.querySelectorAll('img[style*="width:82px"]')];
    if (mainImage) {
      mainImage.style.cursor = "zoom-in";
      mainImage.alt = product.NOME || "Produto";
      mainImage.addEventListener("click", () => openZoom(mainImage.src, product.NOME));
      thumbnails.forEach(thumbnail => { thumbnail.style.cursor="pointer"; thumbnail.alt=`Visualização de ${product.NOME||"produto"}`; thumbnail.onclick=()=>{mainImage.src=thumbnail.src;}; });
    }
    const videos = values(product.VIDEOS);
    const documents = [["Ficha técnica",product["FICHA TECNICA"]],["Catálogo PDF",product["CATALOGO PDF"]],["Site do produto",product.LINK]].map(item=>[item[0],safeUrl(item[1])]).filter(item=>item[1]);
    const details = document.createElement("section");
    details.className = "arq4-section";
    details.innerHTML = `<div class="arq4-grid two">
      <article class="arq4-card"><div class="ey">CONFIANÇA</div><h2>Informações do cadastro</h2><div class="arq4-list"><div class="arq4-list-item"><span class="arq4-list-icon">✓</span><span><b>Produto ${["APROVADO","PUBLICADO","ATIVO"].includes(String(product.STATUS).toUpperCase())?"aprovado":"em análise"}</b><br><span class="muted">Status registrado na ARQSELECT.</span></span></div><a class="arq4-list-item" href="fornecedor.html?id=${encodeURIComponent(product["FORNECEDOR ID"]||"")}"><span class="arq4-list-icon">F</span><span><b>${esc4(product.FORNECEDOR||"Fornecedor ARQSELECT")}</b><br><span class="muted">Abrir perfil público do fornecedor.</span></span></a></div></article>
      <article class="arq4-card"><div class="ey">DOCUMENTOS E MÍDIA</div><h2>Materiais disponíveis</h2><div class="arq4-actions">${documents.map(item=>`<a class="btn light" href="${esc4(item[1])}" target="_blank" rel="noopener">${esc4(item[0])}</a>`).join("")||'<span class="muted">Nenhum documento público cadastrado.</span>'}</div>${videos.length?`<div class="arq4-list" style="margin-top:12px">${videos.map((url,index)=>`<a class="arq4-list-item" href="${esc4(url)}" target="_blank" rel="noopener"><span class="arq4-list-icon">▶</span><span><b>Vídeo ${index+1}</b><br><span class="muted">Abrir mídia do produto</span></span></a>`).join("")}</div>`:""}</article>
    </div>`;
    app.appendChild(details);
  }

  function openZoom(src, title) {
    const overlay = document.createElement("div");
    overlay.className = "arq4-command open";
    overlay.setAttribute("role","dialog");
    overlay.setAttribute("aria-modal","true");
    overlay.setAttribute("aria-label",`Imagem ampliada de ${title||"produto"}`);
    overlay.innerHTML = `<div class="arq4-command-panel" style="width:min(1000px,96vw);max-height:90vh;padding:14px"><button class="btn light" style="float:right;margin-bottom:10px">Fechar</button><img src="${esc4(src)}" alt="${esc4(title||"Produto")}" style="width:100%;max-height:78vh;object-fit:contain;border-radius:14px"></div>`;
    document.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector("button").onclick=close;
    overlay.onclick=event=>{if(event.target===overlay)close();};
  }

  setTimeout(enhance, 120);
})();
