function loadRequestV2(id){return apiGet("solicitacao_v2",{token:getSession().token,id})}function createRequestV2(data){return apiPost("criar_solicitacao",{token:getSession().token,...data})}
