async function doLogin(usuario,senha){const r=await apiPost("login_v2",{usuario,senha});if(!r.sucesso)throw Error(r.mensagem||"Falha no login");setSession(r);return r}
