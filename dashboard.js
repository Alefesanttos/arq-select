function loadDashboardV2(){const s=getSession();return apiGet("dashboard_v2",{token:s.token}).then(r=>{if(!r.sucesso)throw Error(r.mensagem);return r.dashboard})}
