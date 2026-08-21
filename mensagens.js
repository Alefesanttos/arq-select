function loadMessagesV2(id=""){return apiGet("mensagens",{token:getSession().token,projeto_id:id})}function sendMessageV2(data){return apiPost("enviar_mensagem",{token:getSession().token,...data})}
