const ARQ3_API="https://script.google.com/macros/s/AKfycbz_jLzNa87U_himraaCczzqGpQdq63AyIVogQ9-YGnqXuQYl3OSJfV4E7xYfPdnv8-d/exec";
const ARQ3_TOKEN=localStorage.getItem("ARQSELECT_PORTAL_TOKEN")||"";
const ARQ3_TYPE=(localStorage.getItem("ARQSELECT_PORTAL_TIPO")||"").toUpperCase();
const arq3=id=>document.getElementById(id);
const arq3Esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
async function arq3Api(action,data={},method="GET") {const payload={acao:action,...data};if(ARQ3_TOKEN&&!payload.token)payload.token=ARQ3_TOKEN;if(method==="POST")return fetch(ARQ3_API,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)}).then(r=>r.json());const url=new URL(ARQ3_API);Object.entries(payload).forEach(([k,v])=>{if(v!==undefined&&v!==null)url.searchParams.set(k,v)});return fetch(url,{cache:"no-store"}).then(r=>r.json())}
function arq3Auth(){if(ARQ3_TOKEN)return true;location.href=ARQ3_TYPE==="FORNECEDOR"?"ARQSELECT_LOGIN_FORNECEDOR.html":"ARQSELECT_LOGIN_ARQUITETO.html";return false}
function arq3Toast(message){let el=arq3("toast");if(!el){el=document.createElement("div");el.id="toast";el.className="toast";document.body.appendChild(el)}el.textContent=message;el.classList.add("show");clearTimeout(arq3Toast.t);arq3Toast.t=setTimeout(()=>el.classList.remove("show"),3200)}
function arq3Panel(){return ARQ3_TYPE==="FORNECEDOR"?"ARQSELECT_DASHBOARD_FORNECEDOR.html":"ARQSELECT_DASHBOARD_ARQUITETO.html"}
document.addEventListener("DOMContentLoaded",()=>document.querySelectorAll("[data-panel]").forEach(a=>a.href=arq3Panel()));
