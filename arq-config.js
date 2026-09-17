(function(){
  "use strict";
  const DEFAULT_API_URL = "https://script.google.com/macros/s/AKfycbz_jLzNa87U_himraaCczzqGpQdq63AyIVogQ9-YGnqXuQYl3OSJfV4E7xYfPdnv8-d/exec";
  const KEY = "ARQSELECT_API_URL";
  function clean(value){
    return String(value || "").trim().replace(/\/+$/, "");
  }
  function valid(value){
    const url=clean(value);
    return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/i.test(url);
  }
  const stored = clean(localStorage.getItem(KEY));
  const active = valid(stored) ? stored : DEFAULT_API_URL;
  window.ARQSELECT_API_URL = active;
  window.ARQSELECT_CONFIG = Object.freeze({
    version: "5.5.1",
    SYSTEM_NAME: "ARQSELECT", VERSION: "5.5.1", API_URL: active, WHATSAPP: "5519981655013", SITE_URL: "https://arqselect.com.br/",
    systemName: "ARQSELECT", siteUrl: "https://arqselect.com.br/", mediaBaseUrl: "",
    build: "2026.09.16.551-CARGA-INTEGRADA",
    apiUrl: active,
    defaultApiUrl: DEFAULT_API_URL,
    apiStorageKey: KEY,
    whatsapp: "5519981655013",
    setApiUrl(value){
      const url=clean(value);
      if(!valid(url)) throw new Error("Informe uma URL válida do Web App terminando em /exec.");
      localStorage.setItem(KEY,url);
      return url;
    },
    clearApiUrl(){ localStorage.removeItem(KEY); },
    isValidApiUrl: valid
  });
})();
