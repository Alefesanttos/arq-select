const ARQSELECT_CONFIG={API_URL:localStorage.getItem("ARQSELECT_API_URL")||"https://script.google.com/macros/s/AKfycbz_jLzNa87U_himraaCczzqGpQdq63AyIVogQ9-YGnqXuQYl3OSJfV4E7xYfPdnv8-d/exec",POLL_MS:15000,TIMEOUT_MS:25000};
const qs=new URLSearchParams(location.search);
async function arqRequest(action,data={},method="GET"){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),ARQSELECT_CONFIG.TIMEOUT_MS);let response;
  try{if(method==="POST"){response=await fetch(ARQSELECT_CONFIG.API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8","Accept":"application/json"},body:JSON.stringify({acao:action,...data}),signal:controller.signal});}else{const url=new URL(ARQSELECT_CONFIG.API_URL);url.searchParams.set("acao",action);Object.entries(data).forEach(([key,value])=>{if(value!=null)url.searchParams.set(key,Array.isArray(value)?value.join(","):String(value))});response=await fetch(url,{cache:"no-store",headers:{"Accept":"application/json"},signal:controller.signal});}}
  catch(error){if(error?.name==="AbortError")return {sucesso:false,mensagem:"O servidor demorou para responder. Tente novamente."};return {sucesso:false,mensagem:"Não foi possível conectar ao servidor ARQSELECT."};}
  finally{clearTimeout(timer)}
  const text=await response.text();try{return JSON.parse(text)}catch(error){return {sucesso:false,mensagem:"A implantação do servidor retornou uma resposta inválida.",httpStatus:response.status};}
}
function apiGet(action,params={}){return arqRequest(action,params,"GET")}
function apiPost(action,data={}){return arqRequest(action,data,"POST")}
function getSession(){try{return JSON.parse(localStorage.getItem("ARQSELECT_SESSION")||"null")}catch(error){return null}}
function setSession(session){localStorage.setItem("ARQSELECT_SESSION",JSON.stringify(session))}
function clearSession(){localStorage.removeItem("ARQSELECT_SESSION")}
function sessionRole(session){return String(session?.perfil||session?.usuario?.PERFIL||session?.usuario?.perfil||"").toUpperCase()}
function requireAuth(role){const session=getSession();if(!session?.token||(Number(session.expiraEm||0)&&Date.now()>Number(session.expiraEm))){clearSession();location.href="login.html";return null}const current=sessionRole(session);if(role&&current!==String(role).toUpperCase()&&current!=="ADMIN"){location.href="login.html";return null}return session}
function fmtBRL(value){return Number(value||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function esc(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]))}
function toast(message){let element=document.querySelector(".toast");if(!element){element=document.createElement("div");element.className="toast";document.body.appendChild(element)}element.textContent=message;element.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>element.classList.remove("show"),3000)}
async function logout(){const session=getSession();if(session?.token)await apiPost("logout_v2",{token:session.token});clearSession();location.href="login.html"}
function bindLogout(){document.querySelectorAll("[data-logout]").forEach(element=>element.onclick=event=>{event.preventDefault();logout()})}
function layout(title,role){document.title=title+" • ARQSELECT";const session=requireAuth(role);if(!session)return null;document.querySelectorAll("[data-user]").forEach(element=>element.textContent=session.usuario?.NOME||session.usuario?.LOGIN||session.usuario||"");bindLogout();return session}
window.addEventListener("offline",()=>toast("Você está sem conexão. Os dados serão atualizados quando a internet voltar."));
