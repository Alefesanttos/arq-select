function loadAdminV2(){const s=requireAuth("ADMIN");return s?apiGet("admin_v2",{token:s.token}):Promise.resolve({sucesso:false})}
