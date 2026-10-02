/* Run against a local preview. External requests are blocked; this does not certify backend flows. */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.ARQ_AUDIT_URL||'http://127.0.0.1:8765/';
const output=process.env.ARQ_AUDIT_OUTPUT||'/tmp/arq-audit';fs.mkdirSync(output,{recursive:true});
const results={checks:[],pages:[],errors:[],externalServices:'Blocked deliberately; authentication, submissions and transactions are not tested.'};
const check=(name,test)=>{assert.ok(test,name);results.checks.push(name)};
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.ARQ_CHROME?{executablePath:process.env.ARQ_CHROME}:{}),args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:960},colorScheme:'light',hasTouch:true});
 await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
 const p=await context.newPage();p.on('pageerror',e=>results.errors.push(e.message));
 await p.goto(base,{waitUntil:'domcontentloaded'});await p.waitForTimeout(650);
 check('24 unique colored image logos',await p.locator('.hp-brand-group:first-child img').count()===24);
 check('24 unique assets',await p.locator('.hp-brand-group:first-child img').evaluateAll(imgs=>new Set(imgs.map(i=>i.src)).size===24));
 check('All logos load with no color filters',await p.locator('.hp-brand-item img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0&&getComputedStyle(i).filter==='none')));
 check('Marquee remains in document flow',await p.locator('.hp-brands').evaluate(e=>!['fixed','sticky'].includes(getComputedStyle(e).position)));
 const scroll=()=>p.locator('.hp-brand-viewport').evaluate(e=>e.scrollLeft);
 let before=await scroll();await p.waitForTimeout(500);check('Visible automatic horizontal movement',await scroll()>before+10);
 await p.locator('.hp-brand-pause').click();before=await scroll();await p.waitForTimeout(250);check('Pause control stops movement',Math.abs(await scroll()-before)<2);
 await p.locator('.hp-brand-viewport').focus();before=await scroll();await p.keyboard.press('ArrowRight');check('Keyboard advances logo strip',Math.abs(await scroll()-before)>100);
 await p.locator('.hp-brand-pause').click();await p.mouse.move(1400,500);
 const select=async theme=>{await p.locator('#arq-theme-trigger').click();await p.locator(`[data-theme-choice="${theme}"]`).click();await p.waitForTimeout(120)};
 await select('dark');check('Dark selected and persisted',await p.evaluate(()=>document.documentElement.dataset.theme==='dark'&&localStorage.getItem('ARQSELECT_THEME')==='dark'));
 await p.reload({waitUntil:'domcontentloaded'});check('Dark survives reload',await p.evaluate(()=>document.documentElement.dataset.theme==='dark'));
 await p.waitForTimeout(250);await select('light');check('Light selected',await p.evaluate(()=>document.documentElement.dataset.theme==='light'));
 await select('auto');await p.emulateMedia({colorScheme:'dark'});await p.waitForTimeout(80);check('System reacts live to dark',await p.evaluate(()=>document.documentElement.dataset.theme==='dark'));
 await p.emulateMedia({colorScheme:'light'});await p.waitForTimeout(80);check('System reacts live to light',await p.evaluate(()=>document.documentElement.dataset.theme==='light'));
 await select('dark');await p.emulateMedia({colorScheme:'light'});check('Explicit preference ignores OS changes',await p.evaluate(()=>document.documentElement.dataset.theme==='dark'));
 const tab=await context.newPage();await tab.goto(base,{waitUntil:'domcontentloaded'});await tab.evaluate(()=>localStorage.setItem('ARQSELECT_THEME','light'));await p.waitForTimeout(100);check('Preference synchronizes across tabs',await p.evaluate(()=>document.documentElement.dataset.theme==='light'));await tab.close();
 await p.locator('.hp-actions [data-open-access]').click();check('Access dialog opens',await p.locator('#access-modal').getAttribute('aria-hidden')==='false');await p.keyboard.press('Escape');check('Access dialog closes and returns focus',await p.evaluate(()=>document.getElementById('access-modal').getAttribute('aria-hidden')==='true'&&document.activeElement.hasAttribute('data-open-access')));
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(100);check('Reduced motion disables automatic animation',await p.locator('.hp-brand-pause').getAttribute('aria-pressed')==='true');before=await scroll();await p.waitForTimeout(220);check('Reduced motion strip stays still',Math.abs(await scroll()-before)<2);await p.emulateMedia({reducedMotion:'no-preference'});
 for(const width of [320,390,768,1440,1920]){
  await p.setViewportSize({width,height:900});await p.waitForTimeout(160);
  check(`No horizontal page overflow at ${width}px`,await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await p.locator('[data-home-menu]').click();check(`Menu opens at ${width}px`,await p.locator('#home-menu').evaluate(e=>e.classList.contains('open')));await p.keyboard.press('Escape');check(`Menu closes with Escape at ${width}px`,await p.locator('#home-menu').evaluate(e=>!e.classList.contains('open')));
 }
 await p.setViewportSize({width:390,height:844});await p.locator('.hp-brand-viewport').scrollIntoViewIfNeeded();
 const rect=await p.locator('.hp-brand-viewport').boundingBox();await p.mouse.move(rect.x+rect.width-25,rect.y+30);await p.mouse.down();before=await scroll();await p.mouse.move(rect.x+30,rect.y+30,{steps:8});await p.mouse.up();check('Drag moves logos on mobile layout',Math.abs(await scroll()-before)>70);
 const cdp=await context.newCDPSession(p);before=await scroll();
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+rect.width-25,y:rect.y+30}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:rect.x+35,y:rect.y+30}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 check('Touch swipe moves logos',Math.abs(await scroll()-before)>70);
 check('WhatsApp does not cover bottom navigation',await p.evaluate(()=>{const a=document.querySelector('.arq-global-wa')?.getBoundingClientRect(),b=document.querySelector('.arq4-bottom-nav')?.getBoundingClientRect();return !a||!b||a.bottom<b.top}));
 check('Category links select catalog filters',await p.locator('.hp-category-card').evaluateAll(links=>links.every(a=>a.search.includes('categoria='))));
 await p.locator('.hp-category-card').first().click();await p.waitForURL('**/explorar.html*');
 await p.locator('#category').waitFor({state:'attached'});await p.waitForTimeout(350);
 check('Category navigation applies the real catalog filter',await p.locator('#category').inputValue()==='Revestimentos');
 check('Filtered catalog displays products',await p.locator('#grid .arq-product-card').count()>0);
 await p.goto(base,{waitUntil:'domcontentloaded'});await p.waitForTimeout(350);
 // Whole-page rendering: neutralize offscreen content skipping only for screenshots.
 for(const [width,theme] of [[390,'light'],[390,'dark'],[1440,'light'],[1440,'dark']]){
  await p.setViewportSize({width,height:900});await p.evaluate(t=>window.ARQSELECT_THEME.set(t),theme);
  await p.addStyleTag({content:'*{content-visibility:visible!important}'});
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=650){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,50))}scrollTo({top:0,behavior:'instant'})});await p.waitForTimeout(650);
  await p.screenshot({path:path.join(output,`home-${width}-${theme}.png`),fullPage:true});
 }
 await p.close();await context.close();
 const files=fs.readdirSync('.').filter(f=>f.endsWith('.html')&&!/http-equiv=["']refresh/i.test(fs.readFileSync(f,'utf8')));
 const selectedFiles=process.env.ARQ_AUDIT_PAGES?files.filter(f=>process.env.ARQ_AUDIT_PAGES.split(',').includes(f)):files;
 for(const width of [390,1440]){
  let index=0;await Promise.all(Array.from({length:4},async()=>{
   const ctx=await browser.newContext({viewport:{width,height:900},colorScheme:'light'});await ctx.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
   while(index<selectedFiles.length){const file=selectedFiles[index++],errors=[];const page=await ctx.newPage();const listener=e=>errors.push(e.message);page.on('pageerror',listener);
    try{await page.goto(base+file,{waitUntil:'domcontentloaded',timeout:15000});await page.waitForTimeout(500);
     const data=await page.evaluate(async()=>{const api=window.ARQSELECT_THEME;if(!api)return {themeApi:false};api.set('dark',false);await new Promise(r=>setTimeout(r,300));const dark={theme:document.documentElement.dataset.theme,bg:getComputedStyle(document.body).backgroundColor};api.set('light',false);await new Promise(r=>setTimeout(r,300));return {themeApi:true,dark,light:{theme:document.documentElement.dataset.theme,bg:getComputedStyle(document.body).backgroundColor},overflow:document.documentElement.scrollWidth>innerWidth+2,url:location.pathname,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.getAttribute('src')).map(i=>i.getAttribute('src'))}});
     results.pages.push({file,width,errors,...data});
    }catch(e){results.pages.push({file,width,error:e.message})}page.off('pageerror',listener);await page.close();
   }await ctx.close();
  }));
 }
 await browser.close();fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));
 const issues=results.pages.filter(p=>p.error||p.errors.length||p.overflow||p.broken?.length||!p.themeApi);
 console.log(JSON.stringify({checks:results.checks.length,homeErrors:results.errors,pageLoads:results.pages.length,issues},null,2));
 if(issues.length||results.errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);fs.writeFileSync(path.join(output,'partial.json'),JSON.stringify(results,null,2));process.exit(1)});
