function loadProposalV2(id){return apiGet("proposta_v2",{token:getSession().token,id})}function createProposalV2(data){return apiPost("criar_proposta",{token:getSession().token,...data})}
