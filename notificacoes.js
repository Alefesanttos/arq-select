function loadNotificationsV2(){return apiGet("notificacoes",{token:getSession().token})}function markNotificationV2(id){return apiPost("marcar_notificacao",{token:getSession().token,id})}
