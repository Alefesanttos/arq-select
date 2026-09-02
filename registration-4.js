(function () {
  "use strict";
  const box=document.getElementById("cadastro");
  if(!box)return;
  const steps=[["nome","empresa"],["cemail","telefone"],["documento","csenha"]],labels=["Identificação","Contato","Credenciais"],submit=[...box.querySelectorAll("button")].find(button=>/CRIAR MINHA CONTA/i.test(button.textContent));
  if(!submit)return;
  let current=0;
  const progress=document.createElement("div");progress.className="arq4-stepper";progress.setAttribute("aria-label","Etapas do cadastro");
  const actions=document.createElement("div");actions.className="arq4-actions";
  const back=document.createElement("button");back.type="button";back.className="btn light";back.textContent="Voltar";
  const next=document.createElement("button");next.type="button";next.className="btn gold";next.textContent="Continuar";
  actions.append(back,next);box.insertBefore(progress,box.querySelector("h2"));box.insertBefore(actions,submit);
  const fieldNodes={};
  steps.flat().forEach(id=>{const input=document.getElementById(id);if(!input)return;const label=input.previousElementSibling?.tagName==="LABEL"?input.previousElementSibling:null;fieldNodes[id]=[label,input].filter(Boolean);});
  function render(){
    progress.innerHTML=labels.map((label,index)=>`<span class="arq4-step${index===current?" active":""}${index<current?" done":""}">${index<current?"✓":index+1} ${label}</span>`).join("");
    steps.forEach((ids,index)=>ids.forEach(id=>(fieldNodes[id]||[]).forEach(node=>{node.hidden=index!==current;})));
    back.hidden=current===0;next.hidden=current===steps.length-1;submit.hidden=current!==steps.length-1;
    const first=document.getElementById(steps[current][0]);if(first)setTimeout(()=>first.focus(),20);
  }
  function valid(){
    const inputs=steps[current].map(id=>document.getElementById(id)).filter(Boolean);
    for(const input of inputs){if(!input.checkValidity()){input.reportValidity();return false;}}
    return true;
  }
  next.onclick=()=>{if(valid()){current=Math.min(steps.length-1,current+1);render();}};
  back.onclick=()=>{current=Math.max(0,current-1);render();};
  render();
})();
