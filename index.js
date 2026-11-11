/* Floresta Web — generated UI, no authored HTML/CSS files beyond bootstrap. */
'use strict';
class FlorestaSystem {
  constructor() {
    this.registry={state:{mode:'',windows:[],active:0,next:1,theme:'dark',menuOpen:false,popped:false},functions:{},apps:{}};
    this.apps=[
      {id:'welcome',name:'Welcome',icon:'🌲',description:'Floresta Web operating environment'},
      {id:'files',name:'Files',icon:'📁',description:'Local workspace overview'},
      {id:'terminal',name:'Terminal',icon:'⌘',description:'Read-only demonstration console'},
      {id:'settings',name:'Settings',icon:'⚙',description:'Display and environment preferences'},
      {id:'markets',name:'Market Tree',icon:'📈',description:'Stocks, currencies and bonds statistics hierarchy'},
      {id:'telegram',name:'Telegram',icon:'✈',description:'Telegram integration and secure configuration'},
      {id:'about',name:'About',icon:'◈',description:'Runtime and browser capabilities'}
    ];
    this.registry.apps=Object.fromEntries(this.apps.map(a=>[a.id,a]));
    this.audit=new FlorestaAudit(this);this.runtime=new FlorestaRuntime(this);this.ean=new FlorestaEAN(this);this.motion=new FlorestaMotion(this);this.hardware=new FlorestaHardware(this);this.monitor=new FlorestaMonitor(this);
    this.market=new FlorestaMarketTree(this);this.popouts=new Map();this.popoutId=new URLSearchParams(location.search).get('floresta-popout');
    this.detect();this.style();this.render();this.events();this.runtime.start();this.ean.start();this.ean.openFromURL();this.audit.initialize();this.hardware.initialize();this.monitor.start();this.market.start();
    window.addEventListener('resize',()=>this.onResize());
    if(this.popoutId)this.initializePopout();
  }
  detect() {
    const ua=navigator.userAgent, touch=navigator.maxTouchPoints>0;
    this.registry.state.platform=/Android/i.test(ua)?'Android':/iPad|iPhone/i.test(ua)?'iOS':/Windows/i.test(ua)?'Windows':/Mac/i.test(ua)?'macOS':/Linux/i.test(ua)?'Linux':'Unknown';
    this.registry.state.browser=/Edg\//.test(ua)?'Edge':/Firefox\//.test(ua)?'Firefox':/Chrome\//.test(ua)?'Chrome':/Safari\//.test(ua)?'Safari':'Browser';
    this.registry.state.touch=touch;
    this.registry.state.mode=this.mode();
  }
  mode(){
    const w=window.innerWidth;
    return w<680?'mobile':w<1100&&(this.registry.state.touch||w<900)?'tablet':'desktop';
  }
  onResize(){
    const next=this.mode();
    if(next!==this.registry.state.mode){this.registry.state.mode=next;this.render();}
  }
  style(){
    const el=document.createElement('style');
    el.textContent=`
      .market-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin:0 0 20px}.market-provider{min-width:0;border:1px solid var(--line);border-radius:14px;padding:13px;background:#ffffff07}.market-provider h2{font-size:16px;margin:0 0 6px}.market-provider [data-twelve-quotes]{min-height:330px}.market-provider .action{margin-top:10px}@media(max-width:850px){.market-split{grid-template-columns:1fr}}

      .market-head{display:flex;justify-content:space-between;gap:15px;align-items:start;flex-wrap:wrap}.market-tree{margin-top:18px}.market-tree details{border-left:2px solid #68bb8155;margin:9px 0 9px 10px;padding:4px 0 4px 13px}.market-tree summary{cursor:pointer;padding:10px;border-radius:10px;background:#ffffff0b;font-weight:650}.market-tree summary small{font-weight:400;color:var(--muted);margin-left:8px}.market-leaves{margin:9px 0}.market-leaf{display:flex;justify-content:space-between;gap:10px;padding:11px 12px;border-bottom:1px solid #ffffff15;font-size:13px}.market-leaf strong{font-variant-numeric:tabular-nums}.market-note{font-size:12px!important;color:var(--muted);line-height:1.5}

      @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
      :root{font-family:'Quicksand',system-ui,-apple-system,sans-serif;color-scheme:dark;--bg:#071711;--panel:#12251e;--panel2:#1a3329;--line:#335647;--text:#e9f7ee;--muted:#a5c3b1;--accent:#8de6a7;--shadow:0 24px 80px #0008}
      *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);overflow:hidden}button,input{font:inherit}button{cursor:pointer;color:inherit}button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
      #root{height:100dvh;min-height:380px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 70% 10%,#25513b 0,transparent 52%),linear-gradient(145deg,#071711,#0d2920 65%,#061610)}
      .wallpaper{position:absolute;inset:0;pointer-events:none;opacity:1;background:repeating-radial-gradient(circle at 65% 65%,transparent 0 42px,#83bd9b0a 43px 44px)}
      .wallpaper::after{content:'';position:absolute;inset:0;background:url('./floresta-logo.png') center center / min(58vmin,560px) auto no-repeat;opacity:.25;pointer-events:none}
      .topbar{height:46px;display:flex;align-items:center;gap:14px;padding:0 17px;background:#071811c9;border-bottom:1px solid #ffffff18;backdrop-filter:blur(20px);position:relative;z-index:100}
      .brand{font-weight:750;letter-spacing:.2px}.brand em{font-style:normal;color:var(--accent)}.topbar .spacer{flex:1}.hint{font-size:12px;color:var(--muted)}
      .brand-button{border:0;background:transparent;color:inherit;font-weight:750;letter-spacing:.2px;padding:9px 12px;border-radius:10px;display:flex;align-items:center;gap:8px}.brand-button:hover,.brand-button[aria-expanded=true]{background:#ffffff16}.brand-button{padding:3px 7px;min-width:44px;min-height:40px;justify-content:center}.brand-button img{width:36px;height:36px;object-fit:contain;display:block;pointer-events:none}
      .floresta-menu{position:absolute;top:48px;left:14px;width:min(320px,calc(100vw - 28px));padding:9px;border:1px solid var(--line);border-radius:16px;background:#10291f;box-shadow:var(--shadow);z-index:200;transform-origin:top left}.floresta-menu[hidden]{display:none}.floresta-menu button{display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;text-align:left;background:transparent;border:0;border-radius:10px;color:var(--text)}.floresta-menu button:hover,.floresta-menu button:focus-visible{background:#ffffff18}.floresta-menu .menu-caption{padding:9px 14px;color:var(--muted);font-size:12px}
      .clock{font-size:13px;font-variant-numeric:tabular-nums}.workspace{position:absolute;inset:46px 0 0}.desktop-icons{position:absolute;top:24px;left:22px;display:grid;gap:13px}
      .desktop-icon{width:100px;display:grid;justify-items:center;gap:7px;padding:12px 5px;border:0;border-radius:15px;background:transparent;font-size:12px}
      .desktop-icon:hover,.desktop-icon:focus-visible{background:#ffffff15}.app-symbol{font-size:30px;display:grid;place-items:center;width:58px;height:58px;background:linear-gradient(145deg,#24513a,#163326);border:1px solid #ffffff24;border-radius:18px}
      .taskbar{position:absolute;bottom:0;left:0;right:0;height:65px;display:flex;justify-content:center;align-items:center;gap:10px;background:#06150fd9;border-top:1px solid #ffffff1c;backdrop-filter:blur(22px);z-index:100}
      .dock-btn{height:46px;min-width:46px;border:1px solid #ffffff20;border-radius:15px;background:#ffffff0b;font-size:24px}.dock-btn:hover,.dock-btn.selected{background:#357d52}
      .station-label{font-size:12px;font-weight:600;letter-spacing:.03em;color:var(--muted);white-space:nowrap}.runtime-info{font-size:11px;color:var(--text);display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap;text-align:right}.runtime-info span{white-space:nowrap}.runtime-dot{width:7px;height:7px;border-radius:50%;background:#7ef0aa;display:inline-block}.runtime-info .runtime-muted{color:var(--muted)}@media(max-width:750px){.station-label{font-size:10px;white-space:normal}.runtime-info{font-size:10px}.runtime-info .runtime-extra{display:none}}@media(max-width:430px){.station-label{display:none}}
      .ean-code{width:92px!important;height:33px!important;min-width:92px;flex:0 0 92px;border:0!important;background:transparent!important;border-radius:0;padding:0;display:inline-flex;align-items:center;cursor:pointer;flex-shrink:0}.ean-code svg{display:block;width:92px;height:33px;background:transparent;overflow:hidden}.ean-code:hover{background:transparent;opacity:.75}.ean-code:focus-visible{outline:2px solid var(--accent);outline-offset:3px}.handoff-dialog{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.5);display:grid;place-items:center;padding:16px}.handoff-dialog[hidden]{display:none}.handoff-panel{width:min(440px,100%);max-height:90dvh;overflow:auto;border-radius:20px;background:rgba(17,42,32,.93);backdrop-filter:blur(24px);padding:22px;box-shadow:0 20px 70px #0009}.handoff-panel h2{margin:0 0 14px}.handoff-panel p{color:var(--muted);font-size:13px;line-height:1.5}.handoff-panel input{width:100%;padding:12px;background:#ffffff14;border:0;border-radius:10px;color:inherit}.handoff-panel button{background:#ffffff16;border:0;border-radius:10px;padding:10px 14px;margin:5px 4px 5px 0}.handoff-panel video{width:100%;max-height:180px;border-radius:10px}.handoff-panel .barcode-large svg{width:100%;height:110px;background:transparent}
      .topbar{border:0;background:rgba(7,24,17,.4)}.floresta-menu{border:0;background:rgba(16,41,31,.4);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px)}
      .window.external-popout{display:none!important}body.popout-view .workspace{inset:0}body.popout-view .topbar,body.popout-view .floresta-menu{display:none!important}body.popout-view .window{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;border-radius:0!important}body.popout-view .window.external-popout{display:flex!important}
      .window{border:0!important;background:transparent!important;backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px)}.window-title{background:rgba(16,36,29,.4)!important;border:0!important;backdrop-filter:blur(25px)}.window-body{background:rgba(16,36,29,.6)!important}.window-title button{border:0!important;background:rgba(255,255,255,.05)!important;color:inherit}.window-title button:hover{background:rgba(255,255,255,.17)!important}.window.popped{position:fixed;inset:55px 24px 24px!important;width:auto!important;height:auto!important;z-index:90!important}
      .window{position:absolute;top:10%;left:18%;width:min(690px,75vw);height:min(500px,75vh);min-width:300px;min-height:230px;border:1px solid #729c8050;border-radius:17px;background:#10241deF;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column;backdrop-filter:blur(30px)}
      .window.maximized{inset:8px!important;width:auto!important;height:auto!important}.window.minimized{display:none}
      .window-title{height:48px;display:flex;align-items:center;gap:10px;padding:0 13px;background:#ffffff09;border-bottom:1px solid #ffffff14;cursor:grab;user-select:none;touch-action:none}
      .window-title strong{font-size:14px;flex:1;min-width:0;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.window-title button{border:0;background:#ffffff13;border-radius:9px;width:30px;height:30px}.window-title button:hover{background:#ffffff2c}.window-title .ean-code,.window-title .ean-code:hover,.window-title .ean-code:active,.window-title .ean-code:focus{background:none!important;background-color:transparent!important;box-shadow:none!important;border:0!important;outline-offset:3px}.window-title .ean-code:hover{opacity:.75}
      .window-body{overflow:auto;flex:1;padding:25px}.window-body h1,.sheet h1{font-size:clamp(23px,3vw,32px);margin:0 0 8px}.window-body p,.sheet p{color:var(--muted);line-height:1.6}
      .pill{display:inline-block;border:1px solid #7edda44a;background:#2d674236;color:#a8f1bf;border-radius:30px;padding:6px 12px;font-size:12px}
      .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px;margin-top:20px}.tile{background:#ffffff0a;border:1px solid #ffffff19;border-radius:15px;padding:17px;text-align:left}.tile b{display:block;margin-bottom:8px}.tile span{font-size:12px;color:var(--muted)}
      .action{background:#287e4d;border:1px solid #ffffff1e;border-radius:12px;padding:10px 16px}.action:hover{background:#389e62}
      .terminal{background:#07130e;border:1px solid #325442;padding:18px;border-radius:12px;color:#9bffc2;font:13px/1.9 ui-monospace,monospace;white-space:pre-wrap}
      .mobile-home{position:absolute;inset:42px 0 0;display:flex;flex-direction:column;align-items:center;padding:26px 16px 95px}
      .mobile-clock{font-size:clamp(45px,9vw,74px);font-weight:250;margin:16px 0 0}.mobile-date{color:#c4e0ce}.search{margin:25px 0;width:min(550px,100%);padding:14px 20px;border-radius:40px;background:#e3f4e8;color:#20442f;text-align:left;border:0}
      .app-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px 10px;width:min(570px,100%);margin-top:auto;margin-bottom:auto}.app-launch{display:grid;justify-items:center;gap:7px;border:0;background:none;font-size:12px;text-align:center}.app-launch .app-symbol{width:64px;height:64px;border-radius:22px;font-size:29px}
      .android-nav{position:absolute;bottom:0;left:0;right:0;height:32px;display:grid;place-items:center;z-index:105}.android-nav button{border:0;background:#d5eadb;width:105px;height:5px;border-radius:10px}
      .sheet{position:absolute;inset:42px 0 27px;background:#10271e;border-radius:25px 25px 0 0;z-index:60;overflow:auto;padding:24px;box-shadow:0 -15px 55px #0008}
      .sheet-header{display:flex;align-items:center;gap:12px;margin-bottom:24px}.sheet-header b{flex:1}.sheet-header button{background:#ffffff16;border:0;border-radius:12px;padding:10px 15px}
      .tablet .mobile-home{padding-top:45px}.tablet .app-grid{grid-template-columns:repeat(5,minmax(0,1fr));gap:25px}.tablet .sheet{inset:65px 8% 32px;border-radius:25px}
      .mobile .topbar,.tablet .topbar{height:42px;background:transparent;border:0}.mobile .hint,.tablet .hint{display:none}
      .light{--bg:#d7eadd;--panel:#e9f5eb;--text:#173426;--muted:#466654;--accent:#167a42;color-scheme:light}
      .light #root{background:linear-gradient(140deg,#b5d7bd,#d7eadd)}.light .topbar{color:#173426}.light .window,.light .sheet{background:#f1faf3;color:#173426}.light .tile{background:#d6ebdc;border-color:#b6d2bf}.light .window-body p,.light .sheet p{color:#466654}
      @media(max-width:680px){.app-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.app-launch .app-symbol{width:57px;height:57px}.tiles{grid-template-columns:1fr 1fr}.sheet{padding:18px}}
    `;
    document.head.appendChild(el);
  }
  node(tag,attrs={},children=[]){
    const el=document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>{if(k==='class')el.className=v;else if(k==='text')el.textContent=v;else if(k==='html')el.innerHTML=v;else if(k==='style')Object.assign(el.style,v);else el.setAttribute(k,v);});
    children.forEach(c=>el.append(c));return el;
  }
  appContent(id){
    const s=this.registry.state;
    if(id==='welcome')return '<span class="pill">● Runtime ready</span><h1>Welcome to Floresta Web</h1><p>A browser-based environment with three adaptive operating systems: desktop windows, Android-inspired tablet and mobile.</p><div class="tiles"><div class="tile"><b>Desktop</b><span>Movable, maximizable windows and taskbar</span></div><div class="tile"><b>Tablet</b><span>Touch-first launcher and large application sheets</span></div><div class="tile"><b>Mobile</b><span>Compact launcher and gesture-style navigation</span></div></div>';
    if(id==='files')return '<h1>Files</h1><p>This is a frontend workspace shell. Browser file access will require explicit user selection and permission.</p><div class="tiles"><div class="tile"><b>📂 Workspace</b><span>No files loaded</span></div><div class="tile"><b>📦 Packages</b><span>Not connected</span></div></div>';
    if(id==='terminal')return '<h1>Terminal</h1><p>Demonstration console — no operating system commands are executed.</p><div class="terminal">floresta@web:~$ system info\nPlatform: '+s.platform+'\nBrowser: '+s.browser+'\nDisplay: '+s.mode+'\nJavaScript: active\nfloresta@web:~$ _</div>';
    if(id==='markets')return this.market.content();
    if(id==='telegram')return '<h1>Telegram integration</h1><p>The bot token and usernames are GitHub Actions secrets. Bot identity verification has succeeded. Group discovery and invite approval still require setup.</p><button class="action" data-action="telegram-setup">Configure Telegram group</button><p><a href="https://github.com/Floresta-Web/floresta-web.github.io/actions/workflows/telegram-verify.yml" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">Bot verification workflow</a></p><p>Credentials are never entered into or transmitted through this public page.</p>';
    if(id==='settings')return '<h1>Settings</h1><p>Appearance and display profile</p><button class="action" data-action="theme">Toggle light / dark theme</button><div class="tiles"><div class="tile"><b>Automatic display</b><span>'+s.mode+'</span></div><div class="tile"><b>Touch support</b><span>'+(s.touch?'Available':'Not detected')+'</span></div></div>';
    return '<h1>About Floresta Web</h1><p>JavaScript-generated user interface on GitHub Pages.</p><div class="tiles"><div class="tile"><b>Browser</b><span>'+s.browser+'</span></div><div class="tile"><b>Platform</b><span>'+s.platform+'</span></div><div class="tile"><b>WebAssembly</b><span>'+(typeof WebAssembly!=='undefined'?'Supported':'Unavailable')+'</span></div><div class="tile"><b>WebGPU</b><span>'+(navigator.gpu?'Available':'Unavailable')+'</span></div></div>';
  }
  // Session pool: one persistent desktop window, switching its content without replacing the page.
  open(id){this.audit.record('shell.open',{id});if(!this.registry.apps[id])return;
    const state=this.registry.state;state.menuOpen=false;this.toggleMenu(false);
    if(state.mode!=='desktop'){state.active=id;this.render();return;}
    let w=state.windows.find(item=>item.id===state.active)||state.windows[0];
    if(!w){w={id:state.next++,app:id,max:false,pop:false,ean:this.ean.create(id),x:Math.max(16,Math.min(220,innerWidth-380)),y:75};state.windows.push(w);state.active=w.id;
      const space=document.querySelector('.workspace');if(space){const el=this.windowNode(w);space.append(el);this.motion.enter(el);}return;}
    w.app=id;state.active=w.id;w.ean=this.ean.create(id);this.ean.publish(w);
    const el=document.querySelector('.window[data-window-id="'+w.id+'"]');
    if(w.pop){this.restorePopout(w.id);}
    if(el){const app=this.registry.apps[id];el.querySelector('.window-title strong').textContent=app.name.toUpperCase();const barcode=el.querySelector('.ean-code');if(barcode){barcode.replaceChildren(this.ean.barcode(w.ean));barcode.setAttribute('aria-label','Show window EAN '+w.ean);}
      const body=el.querySelector('.window-body');this.motion.swap(body,()=>{body.innerHTML=this.appContent(id);if(id==='markets'){this.market.mount(body);this.market.paintQuotes();}});}
  }
  focus(id){this.registry.state.active=id;const el=document.querySelector('.window[data-window-id="'+id+'"]');if(el)el.style.zIndex='50';}
  close(id){if(this.popoutId){this.popIn();return;}this.restorePopout(id);this.audit.record('shell.close',{id});const el=document.querySelector('.window[data-window-id="'+id+'"]');
    const done=()=>{this.ean.unpublish(this.registry.state.windows.find(w=>w.id===id));el?.remove();this.registry.state.windows=this.registry.state.windows.filter(w=>w.id!==id);this.registry.state.active=0;};
    if(el)this.motion.leave(el,done);else done();
  }
  newWindow(){const state=this.registry.state;if(state.mode!=='desktop')return;const offset=state.windows.length*28;const w={id:state.next++,app:'welcome',max:false,pop:false,ean:this.ean.create('welcome'),x:Math.min(220+offset,Math.max(16,innerWidth-380)),y:75+offset};state.windows.push(w);state.active=w.id;const space=document.querySelector('.workspace');if(space){const el=this.windowNode(w);space.append(el);this.motion.enter(el);}this.audit.record('shell.newWindow',{id:w.id});}
  toggleMenu(open){const state=this.registry.state;state.menuOpen=open;const menu=document.querySelector('#floresta-menu'),button=document.querySelector('.brand-button');if(menu){menu.hidden=!open;if(open)this.motion.enter(menu);}if(button)button.setAttribute('aria-expanded',String(open));}
  // Pop-out moves a window into a separate browser window; it never maximizes the panel.
  togglePop(w){
    this.audit.record('shell.popToggle',{id:w.id});
    if(this.popoutId){this.popIn();return;}
    if(w.pop){this.restorePopout(w.id);return;}
    const url=new URL(location.href);url.searchParams.set('floresta-popout',String(w.id));url.searchParams.set('app',w.app);
    const popup=window.open(url.href,'floresta-window-'+w.id,'popup=yes,width=780,height=560,resizable=yes,scrollbars=yes');
    if(!popup){this.audit.record('shell.popBlocked',{id:w.id});return;}
    w.pop=true;this.popouts.set(w.id,popup);
    const el=document.querySelector('.window[data-window-id="'+w.id+'"]');
    if(el)el.classList.add('external-popout');
    this.updatePopButton(w);
    const watcher=setInterval(()=>{if(popup.closed){clearInterval(watcher);this.restorePopout(w.id,false);}},700);
    this.popoutWatchers??=new Map();this.popoutWatchers.set(w.id,watcher);
  }
  updatePopButton(w){const el=document.querySelector('.window[data-window-id="'+w.id+'"]');const button=el?.querySelector('[data-action=pop]');if(button){button.textContent=w.pop?'↙':'↗';button.setAttribute('aria-label',w.pop?'Pop in':'Pop out');}}
  restorePopout(id,close=true){const w=this.registry.state.windows.find(item=>item.id===id);if(!w)return;
    const popup=this.popouts.get(id);if(close&&popup&&!popup.closed)popup.close();
    this.popouts.delete(id);clearInterval(this.popoutWatchers?.get(id));this.popoutWatchers?.delete(id);
    w.pop=false;const el=document.querySelector('.window[data-window-id="'+id+'"]');el?.classList.remove('external-popout');this.updatePopButton(w);
    if(el)this.motion.enter(el);this.audit.record('shell.popIn',{id});
  }
  initializePopout(){const app=new URLSearchParams(location.search).get('app');const id=Number(this.popoutId);
    if(!this.registry.apps[app]||!Number.isSafeInteger(id))return;
    this.registry.state.mode='desktop';this.registry.state.windows=[{id,app,max:false,pop:true,x:0,y:0}];this.registry.state.active=id;
    this.render();document.body.classList.add('popout-view');
    window.addEventListener('pagehide',()=>{try{window.opener?.postMessage({type:'floresta-popin',id},location.origin);}catch(_){}});
    window.addEventListener('message',event=>{if(event.origin===location.origin&&event.data?.type==='floresta-close-popout'&&event.data.id===id)window.close();});
  }
  popIn(){const id=Number(this.popoutId);if(window.opener&&!window.opener.closed){window.opener.postMessage({type:'floresta-popin',id},location.origin);window.close();}else window.close();}
  toggleMax(w){w.max=!w.max;const el=document.querySelector('.window[data-window-id="'+w.id+'"]');if(el){el.classList.toggle('maximized',w.max);el.querySelector('[data-action=max]').textContent=w.max?'❐':'□';this.motion.pulse(el);}}
  windowNode(w){
    w.ean??=this.ean.create(w.app);this.ean.publish(w);
    const a=this.registry.apps[w.app],active=this.registry.state.active===w.id;
    const win=this.node('section',{ 'data-window-id':String(w.id),class:'window'+(w.max?' maximized':'')+(w.pop?' popped':''),style:{left:w.x+'px',top:w.y+'px',zIndex:active?'50':String(10+w.id)}});
    const bar=this.node('header',{class:'window-title','data-drag':String(w.id)},[
      this.node('button',{class:'ean-code','data-action':'show-ean','data-id':w.id,'aria-label':'Show window EAN '+w.ean},[this.ean.barcode(w.ean)]),this.node('strong',{text:a.name.toUpperCase()}),
      this.node('button',{'data-action':'pop','data-id':w.id,'aria-label':this.popoutId?'Pop in':w.pop?'Pop in':'Pop out',text:this.popoutId?'↙':w.pop?'↙':'↗'}),
      this.node('button',{'data-action':'max','data-id':w.id,'aria-label':'Maximize or restore',text:w.max?'❐':'□'}),
      this.node('button',{'data-action':'close','data-id':w.id,'aria-label':'Close',text:'×'})
    ]);
    win.append(bar,this.node('article',{class:'window-body',html:this.appContent(w.app)}));if(w.app==='markets')queueMicrotask(()=>{this.market.mount(win);this.market.paintQuotes();});
    win.addEventListener('pointerdown',()=>{if(this.registry.state.active!==w.id){this.registry.state.active=w.id;document.querySelectorAll('.window').forEach(el=>el.style.zIndex='10');win.style.zIndex='50';}});
    return win;
  }
  render(){
    const s=this.registry.state;
    document.title='Floresta Web';
    document.body.className=(s.theme==='light'?'light ':'')+s.mode;
    document.body.replaceChildren();
    const root=this.node('main',{id:'root',class:s.mode});
    root.append(this.node('div',{class:'wallpaper'}));
    const top=this.node('header',{class:'topbar'},[
      this.node('button',{class:'brand-button','data-action':'menu','aria-label':'Floresta Web applications','aria-haspopup':'menu','aria-expanded':String(s.menuOpen),'title':'Floresta Web applications'},[this.node('img',{src:'./floresta-logo.png',alt:''})]),
      this.node('span',{class:'station-label',text:'Browser/Reactive Based Web Station'}),
      this.node('span',{class:'spacer'}),
      this.node('div',{class:'runtime-info',id:'runtime-info',role:'status','aria-live':'off',text:'Runtime starting…'})
    ]);root.append(top);
    if(s.mode==='desktop'){const menu=this.node('div',{class:'floresta-menu',id:'floresta-menu',role:'menu',hidden:s.menuOpen?null:''});if(s.menuOpen)menu.removeAttribute('hidden');menu.append(this.node('div',{class:'menu-caption',text:'Applications'}));menu.append(this.node('button',{'data-action':'new-window',role:'menuitem',text:'＋  New window'}));this.apps.forEach(a=>menu.append(this.node('button',{role:'menuitem','data-open':a.id,text:a.icon+'  '+a.name})));root.append(menu);}
    if(s.mode==='desktop'){
      const space=this.node('div',{class:'workspace'});
      s.windows.forEach(w=>space.append(this.windowNode(w)));root.append(space);
    }else{
      const home=this.node('div',{class:'mobile-home'});
      home.append(this.node('div',{class:'mobile-clock',id:'bigclock'}),this.node('div',{class:'mobile-date',id:'date'}));
      home.append(this.node('button',{class:'search','data-open':'files',text:'⌕  Search apps and files'}));
      const grid=this.node('div',{class:'app-grid'});
      this.apps.forEach(a=>grid.append(this.node('button',{class:'app-launch','data-open':a.id},[this.node('span',{class:'app-symbol',text:a.icon}),this.node('span',{text:a.name})])));
      home.append(grid);home.append(this.node('button',{class:'action','data-action':'scan-ean',text:'▥  Scan window EAN'}));root.append(home);
      if(s.active&&typeof s.active==='string'){
        const a=this.registry.apps[s.active];
        root.append(this.node('section',{class:'sheet'},[
          this.node('div',{class:'sheet-header'},[this.node('span',{text:a.icon}),this.node('b',{text:a.name}),this.node('button',{'data-action':'home',text:'✕ Close'})]),
          this.node('article',{html:this.appContent(a.id)})
        ]));
      }
      root.append(this.node('nav',{class:'android-nav'},[this.node('button',{'data-action':'home','aria-label':'Go home'})]));
    }
    root.append(this.ean.dialog());document.body.append(root);if(s.active==='markets'||s.windows.some(w=>w.app==='markets'))queueMicrotask(()=>this.market.paint());if(this.popoutId)document.body.classList.add('popout-view');this.clock();this.runtime.render();this.motion.morph(root);this.audit.record("shell.render",{mode:s.mode});
  }
  clock(){
    const now=new Date();
    const c=document.querySelector('#clock');if(c)c.textContent=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    const b=document.querySelector('#bigclock');if(b)b.textContent=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    const d=document.querySelector('#date');if(d)d.textContent=now.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric'});
  }
  telegramSetup(){document.querySelector('#telegram-setup-dialog')?.remove();const modal=this.node('div',{id:'telegram-setup-dialog',class:'handoff-dialog'});const panel=this.node('section',{class:'handoff-panel',role:'dialog','aria-modal':'true','aria-label':'Telegram group setup'});panel.append(this.node('h2',{text:'Telegram group setup'}),this.node('p',{text:'Required GitHub Actions secret: TELEGRAM_GROUP_CHAT_ID (numeric ID, typically starts with -100). Never enter a bot token into this public page.'}),this.node('p',{text:'1. Add @FlorestaOS_bot to the Telegram group and grant the required administrator rights. 2. Send a new message in the group mentioning the bot. 3. Run the group discovery workflow in GitHub Actions. 4. Copy the reported group ID into the GitHub repository Actions secret settings. 5. Run bot verification again.'}),this.node('p',{},[this.node('a',{href:'https://github.com/Floresta-Web/floresta-web.github.io/actions/workflows/telegram-discover.yml',target:'_blank',rel:'noopener noreferrer',text:'Open group discovery workflow'})]),this.node('p',{},[this.node('a',{href:'https://github.com/Floresta-Web/floresta-web.github.io/settings/secrets/actions',target:'_blank',rel:'noopener noreferrer',text:'Open GitHub secret settings'})]),this.node('button',{'data-action':'telegram-close',text:'Close'}));modal.append(panel);document.body.append(modal);}
  events(){
    window.addEventListener('message',event=>{if(event.origin===location.origin&&event.data?.type==='floresta-popin')this.restorePopout(event.data.id,false);});
    document.addEventListener('click',e=>{
      const target=e.target.closest('[data-open],[data-action]');if(!target)return;
      if(target.dataset.action==='telegram-setup'){this.telegramSetup();return;}
      if(target.dataset.action==='telegram-close'){document.querySelector('#telegram-setup-dialog')?.remove();return;}
      if(target.dataset.action==='market-tv-preference'){this.market.saveTradingViewPreference();return;}
      if(target.dataset.action==='market-connect-key'){this.market.connectUserKey();return;}
      if(target.dataset.action==='market-disconnect-key'){this.market.disconnectUserKey();return;}
      if(target.dataset.action==='market-save-gateway'){try{this.market.saveGateway();}catch(e){alert(e.message);}return;}
      if(target.dataset.action==='market-refresh'){this.market.refresh();return;}
      if(target.dataset.open){this.registry.state.menuOpen=false;this.open(target.dataset.open);return;}
      const s=this.registry.state,id=Number(target.dataset.id),w=s.windows.find(w=>w.id===id);
      switch(target.dataset.action){
        case 'menu':this.toggleMenu(!s.menuOpen);break;
        case 'new-window':this.toggleMenu(false);this.newWindow();break;
        case 'show-ean':if(w)this.ean.show(w);break;
        case 'scan-ean':this.ean.showScanner();break;
        case 'ean-close':this.ean.hide();break;
        case 'ean-submit':this.ean.resolveInput();break;
        case 'ean-copy':this.ean.copyLink();break;
        case 'ean-uri':this.ean.copyURI();break;
        case 'ean-dialog-code':this.ean.showDialogCode();break;
        case 'ean-camera':this.ean.camera();break;
        case 'home':s.active=0;this.render();break;
        case 'theme':s.theme=s.theme==='dark'?'light':'dark';this.render();break;
        case 'close':this.close(id);break;
        case 'pop':if(w)this.togglePop(w);break;
        case 'max':if(w)this.toggleMax(w);break;
      }
    });
    document.addEventListener('pointerdown',e=>{
      if(this.registry.state.menuOpen&&!e.target.closest('#floresta-menu,.brand-button')){this.toggleMenu(false);}
      const bar=e.target.closest('[data-drag]');if(!bar||e.target.closest('button'))return;
      const id=Number(bar.dataset.drag),w=this.registry.state.windows.find(w=>w.id===id);
      if(!w||w.max)return;
      const sx=e.clientX,sy=e.clientY,ox=w.x,oy=w.y,win=bar.parentElement;
      const move=ev=>{w.x=Math.max(0,Math.min(window.innerWidth-100,ox+ev.clientX-sx));w.y=Math.max(0,Math.min(window.innerHeight-140,oy+ev.clientY-sy));win.style.left=w.x+'px';win.style.top=w.y+'px';};
      const end=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);};
      window.addEventListener('pointermove',move);window.addEventListener('pointerup',end,{once:true});
    });
    window.setInterval(()=>this.clock(),15000);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.registry.state.menuOpen){this.toggleMenu(false);return;}if(e.key==='Escape'&&this.registry.state.mode!=='desktop'){this.registry.state.active=0;this.render();}});
  }
}

class FlorestaModule {
 constructor(name,system){this.name=name;this.system=system;this.registry=Object.create(null);this.register('constructor');}
 register(fn,data={}){const x=this.registry[fn]??={calls:0,history:[],children:Object.create(null)};x.calls++;x.history.push({time:Date.now(),data});if(x.history.length>64)x.history.shift();}
}
class FlorestaMotion extends FlorestaModule {
 constructor(system){super('Motion',system);this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;}
 enter(el){this.register('enter');if(!this.reduced)el.animate([{opacity:0,transform:'scale(.93) translateY(12px)'},{opacity:1,transform:'scale(1) translateY(0)'}],{duration:280,easing:'ease-out'});}
 leave(el,done){this.register('leave');if(this.reduced){done();return;}const animation=el.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.92) translateY(12px)'}],{duration:240,easing:'ease-in'});animation.onfinish=done;animation.oncancel=done;}
 swap(el,update){this.register('swap');if(this.reduced){update();return;}const a=el.animate([{opacity:1},{opacity:0}],{duration:110});a.onfinish=()=>{update();el.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:210,easing:'ease-out'});};}
 pulse(el){this.register('pulse');if(!this.reduced)el.animate([{opacity:.78},{opacity:1}],{duration:250});}
 morph(root){this.register('morph');if(this.reduced)return;
  root.animate([{opacity:.7,filter:'blur(3px)'},{opacity:1,filter:'blur(0)'}],{duration:320,easing:'ease-out'});
  root.querySelectorAll('.window,.sheet,.app-launch,.desktop-icon').forEach((el,i)=>el.animate([{opacity:0,transform:'translateY(14px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:320+Math.min(i,10)*35,easing:'cubic-bezier(.2,.8,.2,1)'}));
 }
}
class FlorestaAudit extends FlorestaModule {
 constructor(system){super('Audit',system);this.events=[];this.ready=false;this.stats=null;}
 record(action,data={}){this.register('record',{action});this.events.push({action,timestamp:Date.now(),data});if(this.events.length>500)this.events.shift();}
 async initialize(){this.register('initialize');try{
  const {WebR}=await import('https://webr.r-wasm.org/latest/webr.mjs');this.webR=new WebR();await this.webR.init();
  const response=await fetch('./index.R',{cache:'no-store'});if(!response.ok)throw Error('index.R '+response.status);
  await this.webR.evalR(await response.text());this.ready=true;await this.analyse();setInterval(()=>this.analyse(),15000);
 }catch(e){this.record('webr.error',{message:String(e)});}}
 async analyse(){this.register('analyse');if(!this.ready)return;try{
  const payload=JSON.stringify(JSON.stringify(this.events.map(({action,timestamp})=>({action,timestamp}))));
  const result=await this.webR.evalR('local({if(!requireNamespace("jsonlite",quietly=TRUE))stop("jsonlite missing");floresta_audit(jsonlite::fromJSON('+payload+',simplifyVector=FALSE))})');
  this.stats=await result.toJs();
 }catch(e){this.record('audit.error',{message:String(e)});}}
}
class FlorestaHardware extends FlorestaModule {
 constructor(system){super('Hardware',system);this.state={};}
 async initialize(){this.register('initialize');this.state={wasm:!!window.WebAssembly,webgpu:!!navigator.gpu,svg:!!document.createElementNS,audio:!!window.AudioContext,bluetooth:!!navigator.bluetooth,usb:!!navigator.usb};
 try{const b=new Uint8Array([0,97,115,109,1,0,0,0,1,7,1,96,2,127,127,1,127,3,2,1,0,7,7,1,3,97,100,100,0,0,10,9,1,7,0,32,0,32,1,106,11]);const {instance}=await WebAssembly.instantiate(b);this.state.wasmResult=instance.exports.add(20,26);}catch(e){this.state.wasmError=String(e);}
 if(navigator.gpu)try{const a=await navigator.gpu.requestAdapter();this.gpu=a&&await a.requestDevice();}catch(e){this.state.gpuError=String(e);}
 this.system.audit.record('hardware.initialized',this.state);
 }
 async sound(){this.register('sound');const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C();await c.resume();const o=c.createOscillator(),g=c.createGain();g.gain.value=.05;o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.3);o.onended=()=>c.close();}
 async bluetooth(){this.register('bluetooth');return navigator.bluetooth?.requestDevice({acceptAllDevices:true});}
 async usb(){this.register('usb');return navigator.usb?.requestDevice({filters:[]});}
 vector(){this.register('vector');return document.createElementNS('http://www.w3.org/2000/svg','svg');}
}
class FlorestaMonitor extends FlorestaModule {
 constructor(system){super('Monitor',system);this.hashes=new Map();this.busy=false;}
 async check(){this.register('check');if(this.busy||document.hidden)return;this.busy=true;try{
 for(const file of ['index.js','index.R']){const u=new URL(file,location.href);u.searchParams.set('_check',Date.now());const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error(file+' HTTP '+r.status);const h=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await r.arrayBuffer())),v=>v.toString(16).padStart(2,'0')).join('');const old=this.hashes.get(file);if(old&&old!==h){this.system.audit.record('monitor.updateAvailable',{file});this.pendingUpdates??=new Set();this.pendingUpdates.add(file);this.notify();}this.hashes.set(file,h);}
 }catch(e){this.system.audit.record('monitor.error',{message:String(e)});}finally{this.busy=false;}}
 notify(){const banner=document.querySelector('#runtime-info');if(!banner)return;banner.title='Update available ('+[...this.pendingUpdates].join(', ')+'). Current session preserved; refresh manually when ready.';banner.dataset.updateAvailable='true';}
 start(){this.register('start');this.check();setInterval(()=>this.check(),60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)this.check();});}
}

class FlorestaRuntime extends FlorestaModule {
 constructor(system){super('Runtime',system);this.started=performance.now();this.state={phase:'starting'};this.timer=null;}
 start(){this.register('start');this.collect();this.timer=setInterval(()=>this.collect(),5000);window.addEventListener('online',()=>this.collect());window.addEventListener('offline',()=>this.collect());document.addEventListener('visibilitychange',()=>this.collect());window.addEventListener('resize',()=>this.collect());}
 collect(){this.register('collect');const state=this.system.registry.state;
  const language=navigator.language||'unknown',locale=language.split('-')[0];
  const zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'local';
  const screenSize=window.innerWidth+'×'+window.innerHeight;
  const connection=navigator.onLine?'Online':'Offline';
  this.state={phase:'local',browser:state.browser,os:state.platform,mode:state.mode,screen:screenSize,language:locale,zone,connection,uptime:Math.floor((performance.now()-this.started)/1000),touch:state.touch,cores:navigator.hardwareConcurrency||null,memory:navigator.deviceMemory||null};
  this.render();
 }
 render(){this.register('render');const el=document.querySelector('#runtime-info');if(!el)return;const s=this.state;
  if(s.phase!=='local'){el.textContent='Runtime starting…';return;}
  el.replaceChildren();
  const mem=performance.memory;const ram=mem&&Number.isFinite(mem.usedJSHeapSize)&&Number.isFinite(mem.jsHeapSizeLimit)?'RAM* '+Math.round(mem.usedJSHeapSize/1048576)+'/'+Math.round(mem.jsHeapSizeLimit/1048576)+' MB':'RAM n/a';const cpu='CPU n/a';const parts=[[ram,''],['|',''],[cpu,''],['|',''],['↑ '+Math.floor(s.uptime/60)+'m '+s.uptime%60+'s','']];
  for(const [value,cls] of parts){const span=document.createElement('span');span.className=cls;span.textContent=value;el.append(span);}
  el.title='RAM* is browser JavaScript heap usage when supported, not physical system RAM. Browsers do not expose reliable system-wide CPU utilization. Uptime is current page session.';
 }
}

class FlorestaEAN extends FlorestaModule {
 constructor(system){super('EAN',system);this.pool=new Map();this.channel=null;this.stream=null;this.scanTimer=null;this.selected=null;this.active=false;this.L=['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];this.G=['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111','0010001'];this.R=this.L.map(x=>[...x].map(v=>v==='0'?'1':'0').join(''));this.parity=['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];}
 start(){this.register('start');if('BroadcastChannel' in window){this.channel=new BroadcastChannel('floresta-ean-v1');this.channel.onmessage=e=>this.receive(e.data);}this.active=true;}
 create(app){this.register('create');const entries=[...this.system.apps.map(a=>'window:'+a.id),'dialog:handoff','dialog:scanner'];const index=entries.indexOf(app.startsWith('dialog:')?app:'window:'+app);if(index<0)throw Error('Unknown shareable view');const base='290000000'+String(index+1).padStart(3,'0');const sum=[...base].reduce((acc,d,i)=>acc+Number(d)*(i%2?3:1),0);return base+((10-sum%10)%10);}
 valid(code){if(!/^\d{13}$/.test(code))return false;const sum=[...code.slice(0,12)].reduce((acc,d,i)=>acc+Number(d)*(i%2?3:1),0);return Number(code[12])===(10-sum%10)%10;}
 barcode(code){const bits='101'+[...code.slice(1,7)].map((d,i)=>(this.parity[Number(code[0])][i]==='L'?this.L:this.G)[Number(d)]).join('')+'01010'+[...code.slice(7)].map(d=>this.R[Number(d)]).join('')+'101';const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 113 34');svg.setAttribute('role','img');svg.setAttribute('aria-label','EAN-13 '+code);for(let i=0;i<bits.length;i++)if(bits[i]==='1'){const r=document.createElementNS(svg.namespaceURI,'rect');r.setAttribute('x',String(i+9));r.setAttribute('y','2');r.setAttribute('width','1');r.setAttribute('height','30');r.setAttribute('fill','#fff');svg.append(r);}return svg;}
 resolve(code){if(!this.valid(code))return null;for(const app of this.system.apps)if(this.create(app.id)===code)return {type:'window',app:app.id};for(const dialog of ['handoff','scanner'])if(this.create('dialog:'+dialog)===code)return {type:'dialog',dialog};return null;}
 shareURL(code){const route=this.resolve(code);if(!route)throw Error('Unknown Floresta EAN');const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('ean',code);url.searchParams.set('view',route.type==='window'?'window/'+route.app:'dialog/'+route.dialog);return url.href;}
 uri(code){const route=this.resolve(code);if(!route)throw Error('Unknown Floresta EAN');return 'floresta://view/'+route.type+'/'+(route.app||route.dialog)+'?ean='+code;}
 parse(input){const value=String(input).trim();if(this.valid(value))return this.resolve(value);try{const url=new URL(value,location.href);if(url.protocol==='floresta:'){const m=url.pathname.match(/^\/\/(window|dialog)\/([a-z-]+)$/)||('/'+url.hostname+url.pathname).match(/^\/view\/(window|dialog)\/([a-z-]+)$/);if(!m)return null;const code=url.searchParams.get('ean');const resolved=this.resolve(code);return resolved&&resolved.type===m[1]&&(resolved.app||resolved.dialog)===m[2]?resolved:null;}if(url.origin!==location.origin)return null;const code=url.searchParams.get('ean');const resolved=this.resolve(code);if(!resolved)return null;const view=url.searchParams.get('view');return !view||view===(resolved.type+'/'+(resolved.app||resolved.dialog))?resolved:null;}catch(_){return null;}}
 openFromURL(){const item=this.parse(location.href);if(!item)return;queueMicrotask(()=>this.navigate(item));window.addEventListener('popstate',()=>{const next=this.parse(location.href);if(next)this.navigate(next);});}
 navigate(item){if(item.type==='window')this.system.open(item.app);else this.showScanner(item.dialog);}
 publish(w){if(!w?.ean)return;this.pool.set(w.ean,{app:w.app,updated:Date.now()});this.channel?.postMessage({type:'advertise',code:w.ean,app:w.app});}
 unpublish(w){if(w?.ean)this.pool.delete(w.ean);}
 receive(msg){if(!msg||!this.valid(msg.code))return;if(msg.type==='advertise'&&this.system.registry.apps[msg.app])this.pool.set(msg.code,{app:msg.app,updated:Date.now()});if(msg.type==='request'){const entry=this.pool.get(msg.code);if(entry)this.channel?.postMessage({type:'transfer',code:msg.code,app:entry.app});}if(msg.type==='transfer'&&msg.code===this.selected&&this.system.registry.apps[msg.app])this.accept(msg.app);}
 dialog(){const outer=this.system.node('div',{class:'handoff-dialog',id:'ean-dialog',hidden:''});const panel=this.system.node('section',{class:'handoff-panel',role:'dialog','aria-modal':'true','aria-label':'Window transfer'});panel.append(this.system.node('h2',{text:'Window handoff'}),this.system.node('button',{'data-action':'ean-dialog-code','aria-label':'Show dialog EAN',text:'▥ Dialog EAN'}),this.system.node('div',{id:'ean-preview',class:'barcode-large'}),this.system.node('p',{id:'ean-description',text:'Scan an EAN-13 window code or enter its 13 digits.'}),this.system.node('input',{id:'ean-input',inputmode:'numeric',maxlength:'13',placeholder:'EAN-13, URL or floresta:// URI'}),this.system.node('div',{},[this.system.node('button',{'data-action':'ean-copy',text:'Copy share link'}),this.system.node('button',{'data-action':'ean-uri',text:'Copy URI'}),this.system.node('button',{'data-action':'ean-submit',text:'Open dialog'}),this.system.node('button',{'data-action':'ean-camera',text:'Scan camera'}),this.system.node('button',{'data-action':'ean-close',text:'Close'})]),this.system.node('video',{id:'ean-video',playsinline:'',muted:'',hidden:''}),this.system.node('p',{id:'ean-status',text:'Same-origin browser tabs can exchange window IDs locally. Cross-device transfer requires a paired relay service.'}));outer.append(panel);return outer;}
 show(w){this.register('show');this.selected=w.ean;this.reveal();const preview=document.querySelector('#ean-preview');preview.replaceChildren(this.barcode(w.ean));document.querySelector('#ean-input').value=w.ean;document.querySelector('#ean-description').textContent='EAN-13 for '+this.system.registry.apps[w.app].name+'. Scan it from another device to request this window.';}
 showScanner(kind='scanner'){this.register('showScanner');this.selected=this.create('dialog:'+kind);this.reveal();document.querySelector('#ean-preview').replaceChildren(this.barcode(this.selected));document.querySelector('#ean-input').value='';document.querySelector('#ean-description').textContent='Scan a window EAN or type its 13 digits. This dialog also has its own shareable EAN.';}
 reveal(){document.querySelector('#ean-dialog').hidden=false;}
 hide(){this.stopCamera();const el=document.querySelector('#ean-dialog');if(el)el.hidden=true;}
 resolveInput(){const code=document.querySelector('#ean-input').value.trim();const status=document.querySelector('#ean-status');const known=this.parse(code);if(known){this.selected=this.create(known.type==='window'?known.app:'dialog:'+known.dialog);if(known.type==='window')this.accept(known.app);else this.showScanner(known.dialog);return;}if(!this.valid(code)){status.textContent='Unknown EAN, URL or URI. Enter a recognized Floresta reference.';return;}this.selected=code;const entry=this.pool.get(code);if(entry){this.accept(entry.app);return;}this.channel?.postMessage({type:'request',code});status.textContent='EAN valid. Looking for a matching window in this browser profile. Other devices need a connected relay.';}
  copyLink(){const code=this.selected||this.create('dialog:handoff');const url=this.shareURL(code);if(navigator.clipboard?.writeText)navigator.clipboard.writeText(url).then(()=>{document.querySelector('#ean-status').textContent='Share link copied.';}).catch(()=>{document.querySelector('#ean-status').textContent=url;});else document.querySelector('#ean-status').textContent=url;}
  copyURI(){const code=this.selected||this.create('dialog:handoff');const value=this.uri(code);if(navigator.clipboard?.writeText)navigator.clipboard.writeText(value).then(()=>{document.querySelector('#ean-status').textContent='Floresta URI copied.';}).catch(()=>{document.querySelector('#ean-status').textContent=value;});else document.querySelector('#ean-status').textContent=value;}
  showDialogCode(){this.selected=this.create('dialog:handoff');this.reveal();document.querySelector('#ean-preview').replaceChildren(this.barcode(this.selected));document.querySelector('#ean-description').textContent='Stable EAN for the handoff dialog. Anyone with the same Floresta Web version can open this dialog.';}
  accept(app){this.stopCamera();this.hide();this.system.open(app);this.system.audit.record('ean.handoff',{app});}
 async camera(){const status=document.querySelector('#ean-status');if(!('BarcodeDetector' in window)){status.textContent='BarcodeDetector is unavailable here. Enter the EAN manually.';return;}try{const detector=new BarcodeDetector({formats:['ean_13']});this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});const video=document.querySelector('#ean-video');video.hidden=false;video.srcObject=this.stream;await video.play();const scan=async()=>{if(!this.stream)return;try{const found=await detector.detect(video);const code=found.find(item=>item.format==='ean_13')?.rawValue;if(code&&this.valid(code)){document.querySelector('#ean-input').value=code;this.stopCamera();this.resolveInput();return;}}catch(e){status.textContent=String(e);}this.scanTimer=setTimeout(scan,300);};scan();}catch(e){status.textContent='Camera unavailable: '+String(e);this.stopCamera();}}
 stopCamera(){clearTimeout(this.scanTimer);this.scanTimer=null;this.stream?.getTracks().forEach(track=>track.stop());this.stream=null;const video=document.querySelector('#ean-video');if(video){video.pause();video.srcObject=null;video.hidden=true;}}
}
class FlorestaMarketTree {
  constructor(shell){this.shell=shell;this.registry={functions:{},feeds:{},state:{updated:null,loading:false,fx:null,error:null,quotes:{},symbols:['EUR/USD','GBP/USD','USD/JPY','USD/CHF','AUD/USD','USD/CAD'],stream:null,streamError:null}};this.currencies=['EUR','GBP','JPY','CHF','INR','CAD','AUD'];}
  start(){this.registry.state.timer=null;this.registry.state.failures=0;this.registry.state.quoteTimer=null;document.addEventListener('visibilitychange',()=>{if(!document.hidden){this.schedule(500);this.queueQuotes();}else{clearTimeout(this.registry.state.timer);this.registry.state.timer=null;}});this.schedule(0);}
  async refresh(){
    const st=this.registry.state;if(st.loading||document.hidden)return;st.loading=true;this.paintFX();
    try{
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
      let response;
      try{response=await fetch('https://open.er-api.com/v6/latest/USD',{signal:controller.signal,cache:'no-store'});}finally{clearTimeout(timeout);}
      if(!response.ok)throw Error('FX feed HTTP '+response.status);
      const data=await response.json();if(data.result!=='success'||!data.rates)throw Error('Invalid FX response');
      st.fx=data;st.updated=new Date();st.error=null;st.failures=0;
    }catch(e){st.error=e.message;st.failures=Math.min(st.failures+1,5);}finally{st.loading=false;this.paintFX();this.schedule();}
  }
  schedule(delay){
    const st=this.registry.state;clearTimeout(st.timer);st.timer=null;
    if(document.hidden)return;
    const now=Date.now(),published=Number(st.fx?.time_next_update_unix)*1000;
    const next=Number.isFinite(published)&&published>now?published-now+5000:300000;
    const wait=delay===undefined?(st.failures?Math.min(300000*2**st.failures,1800000):Math.max(60000,Math.min(next,1800000))):delay;
    st.timer=setTimeout(()=>{st.timer=null;this.refresh();},wait);
  }
  paintFX(){
    const st=this.registry.state,fx=st.fx;
    document.querySelectorAll('[data-market-fx]').forEach(el=>{
      const fragment=document.createDocumentFragment();
      if(fx)for(const code of this.currencies){
        const row=document.createElement('div');row.className='market-leaf';
        const name=document.createElement('span');name.textContent='USD / '+code;
        const price=document.createElement('strong');price.textContent=Number(fx.rates[code]).toLocaleString(undefined,{maximumFractionDigits:5});
        row.append(name,price);fragment.append(row);
      }else{const p=document.createElement('p');p.textContent='Waiting for exchange-rate feed.';fragment.append(p);}
      el.replaceChildren(fragment);
    });
    document.querySelectorAll('[data-market-published]').forEach(el=>el.textContent=fx?.time_last_update_utc||'Not available');
    document.querySelectorAll('[data-market-fx-status]').forEach(el=>el.textContent=st.loading?'Refreshing…':st.error?'FX refresh error: '+st.error:st.updated?'Last checked: '+st.updated.toLocaleString():'Connecting…');
  }
  queueQuotes(){
    const st=this.registry.state;if(st.quoteTimer||document.hidden)return;
    st.quoteTimer=setTimeout(()=>{st.quoteTimer=null;this.paintQuotes();},250);
  }
  escape(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  content(){
    const st=this.registry.state,fx=st.fx;
    const rows=fx?this.currencies.map(code=>'<div class="market-leaf"><span>USD / '+code+'</span><strong>'+Number(fx.rates[code]).toLocaleString(undefined,{maximumFractionDigits:5})+'</strong></div>').join(''):'<p>Waiting for exchange-rate feed.</p>';
    const published=fx?.time_last_update_utc||'Not available';
    return '<div class="market-split"><section class="market-provider"><h2>TradingView · Forex Heatmap</h2><p class="market-note">Embedded TradingView market widget · source controls its own refresh and data delays.</p><div data-tradingview></div><details class="market-connection"><summary>TradingView account &amp; integration settings</summary><p class="market-note">TradingView personal subscriptions do not provide a general-purpose market-data API key. The public widget works without credentials.</p><p><a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer">Open TradingView to sign in</a></p><p class="market-note">For an organization-owned developer or broker integration, request its official API documentation, authorized scopes, and callback requirements. Never enter TradingView passwords or unverified API keys here.</p><p class="market-note" data-tv-status>Integration status: public widget only. No account connection configured.</p><label class="market-note" for="tv-integration-type">Integration type</label><select id="tv-integration-type" data-tv-integration style="width:100%;padding:10px;border-radius:8px;background:var(--panel2);color:var(--text);border:1px solid var(--line)"><option value="public">Public widget (no key)</option><option value="broker">Broker/developer integration (requires provider approval)</option><option value="custom">Authorized organization integration (requires documentation)</option></select><button class="action" data-action="market-tv-preference">Save integration preference</button><p class="market-note">This preference does not authenticate an account. Actual credential exchange must use a supported provider flow and secure backend.</p></details></section><section class="market-provider"><h2>Twelve Data · Live Prices</h2><p class="market-note" data-twelve-status>Enter your own Twelve Data API key to connect</p><div data-twelve-quotes></div><p class="market-note">Your personal API key is used directly in this browser session and is not stored or sent to Floresta servers. Provider entitlement limits apply.</p><label class="market-note" for="twelve-key">Personal Twelve Data API key</label><input id="twelve-key" type="password" data-twelve-key autocomplete="off" spellcheck="false" placeholder="Paste your personal API key" style="width:100%;padding:10px;border-radius:8px;background:var(--panel2);color:var(--text);border:1px solid var(--line)"><button class="action" data-action="market-connect-key">Connect my account</button> <button class="action" data-action="market-disconnect-key">Disconnect</button><details><summary>Advanced: trusted SSE gateway</summary><p class="market-note">Only use a gateway you control. Do not paste your key into a gateway URL.</p><label class="market-note" for="market-gateway">Secure SSE gateway URL</label><input id="market-gateway" data-market-gateway-input placeholder="https://your-host.example/market/stream" value="'+this.escape(localStorage.getItem('floresta-market-gateway')||'')+'" style="width:100%;padding:10px;border-radius:8px;background:var(--panel2);color:var(--text);border:1px solid var(--line)"><button class="action" data-action="market-save-gateway">Connect gateway</button></details></section></div><div class="market-head"><div><span class="pill">MARKET STATISTICS TREE</span><h1>Global Markets</h1><p>Stocks · Foreign exchange · Sovereign bonds</p></div><button class="action" data-action="market-refresh">↻ Refresh</button></div>'+
      '<div class="market-tree">'+
      '<details open><summary>🌍 Global Markets <small>3 branches</small></summary><div class="market-branches">'+
      '<details open><summary>💱 Currencies / FX <small>USD base · published reference rates</small></summary><div class="market-leaves" data-market-fx>'+rows+'</div><p class="market-note">Provider: ExchangeRate-API open endpoint. Last published: <span data-market-published>'+this.escape(published)+'</span>. These are periodically updated reference rates, not tick-by-tick FX prices.</p></details>'+
      '<details open><summary>📈 Stock Markets <small>Market data connection required</small></summary><div class="market-leaves"><div class="market-leaf"><span>US equities · NYSE / Nasdaq</span><strong>Not connected</strong></div><div class="market-leaf"><span>Indices · S&amp;P 500 / Nasdaq 100</span><strong>Not connected</strong></div><div class="market-leaf"><span>European equities</span><strong>Not connected</strong></div></div><p class="market-note">Live stock quotes require an authorized market-data API or a backend feed. No simulated prices are shown.</p></details>'+
      '<details open><summary>🏦 Government Bonds <small>Yield feed required</small></summary><div class="market-leaves"><div class="market-leaf"><span>US Treasury · 2Y / 10Y / 30Y</span><strong>Not connected</strong></div><div class="market-leaf"><span>Euro area · 10Y sovereign yields</span><strong>Not connected</strong></div></div><p class="market-note">Bond yield and price data require a licensed or public delayed feed with provenance and timestamps.</p></details>'+
      '</div></details></div>'+
      '<p class="market-note" data-market-fx-status role="status">'+(st.loading?'Refreshing…':st.error?'FX refresh error: '+this.escape(st.error):st.updated?'Last checked: '+st.updated.toLocaleString():'Connecting…')+'</p>';
  }
  paint(){
    document.querySelectorAll('.window-body,.sheet article').forEach(el=>{
      const win=el.closest('.window');
      const id=win?this.shell.registry.state.windows.find(w=>String(w.id)===win.dataset.windowId)?.app:this.shell.registry.state.active;
      if(id==='markets'){el.innerHTML=this.content();this.mount(el);this.paintQuotes();}
    });
  }
  saveTradingViewPreference(){
    const input=document.querySelector('[data-tv-integration]');if(!input)return;
    const value=input.value;
    if(!['public','broker','custom'].includes(value))return;
    localStorage.setItem('floresta-tv-integration-preference',value);
    document.querySelectorAll('[data-tv-status]').forEach(el=>el.textContent=value==='public'?'Integration status: public widget only.': 'Integration preference saved. Authorization and provider documentation required before connection.');
  }
  mount(root){
    const select=root.querySelector('[data-tv-integration]');
    if(select){const preference=localStorage.getItem('floresta-tv-integration-preference');if(['public','broker','custom'].includes(preference))select.value=preference;}
    const holder=root.querySelector('[data-tradingview]');
    if(holder&&!holder.firstElementChild){
      const widget=document.createElement('tv-forex-table');
      widget.setAttribute('displayed-value','dailyChange');
      widget.setAttribute('heatmap','');
      widget.setAttribute('theme',this.shell.registry.state.theme==='light'?'light':'dark');
      widget.style.cssText='display:block;width:100%;height:440px;min-height:380px';
      holder.append(widget);
      if(!document.querySelector('script[data-floresta-tv]')){
        const script=document.createElement('script');
        script.type='module';script.src='https://widgets.tradingview-widget.com/w/en/tv-forex-table.js';
        script.dataset.florestaTv='true';document.head.append(script);
      }
    }
  }
  connectGateway(){
    if(this.registry.state.stream)return;
    const gateway=localStorage.getItem('floresta-market-gateway')||'';
    if(!gateway)return;
    try{
      const url=new URL(gateway,location.href);
      if(url.protocol!=='https:'&&url.hostname!=='localhost')throw Error('HTTPS gateway required');
      const stream=new EventSource(url.href);this.registry.state.stream=stream;
      stream.addEventListener('price',event=>{
        try{const item=JSON.parse(event.data);if(item.event!=='price'||!Number.isFinite(Number(item.price)))return;
          this.registry.state.quotes[item.symbol]={price:Number(item.price),timestamp:Number(item.timestamp)||Date.now()/1000};
          this.queueQuotes();
        }catch(_){}
      });
      stream.onopen=()=>{this.registry.state.streamError=null;this.paintQuotes();};
      stream.onerror=()=>{this.registry.state.streamError='Gateway disconnected or reconnecting';this.paintQuotes();};
    }catch(e){this.registry.state.streamError=e.message;this.paintQuotes();}
  }
  paintQuotes(){
    document.querySelectorAll('[data-twelve-status]').forEach(el=>{
      const st=this.registry.state;
      el.textContent=st.streamError||(!st.stream?'Enter your own Twelve Data API key to connect':st.userSocket?'Personal WebSocket '+(st.userSocket.readyState===1?'connected':'connecting'):'Gateway connected');
    });
    document.querySelectorAll('[data-twelve-quotes]').forEach(el=>{
      const quotes=this.registry.state.quotes;
      el.replaceChildren();
      for(const symbol of this.registry.state.symbols){
        const quote=quotes[symbol],row=document.createElement('div');row.className='market-leaf';
        const label=document.createElement('span');label.textContent=symbol;
        const value=document.createElement('strong');
        value.textContent=quote?quote.price.toLocaleString(undefined,{maximumFractionDigits:6}):'Awaiting tick';
        row.append(label,value);el.append(row);
      }
    });
  }
  connectUserKey(){
    const input=document.querySelector('[data-twelve-key]'),key=input?.value.trim();
    if(!key)return;
    this.disconnectUserKey(false);
    this.registry.state.streamError='Connecting to Twelve Data…';
    this.registry.state.quotes={};
    const ws=new WebSocket('wss://ws.twelvedata.com/v1/quotes/price?apikey='+encodeURIComponent(key));
    if(input)input.value='';
    const st=this.registry.state;st.userSocket=ws;
    ws.addEventListener('open',()=>{
      if(st.userSocket!==ws)return;
      st.streamError=null;
      ws.send(JSON.stringify({action:'subscribe',params:{symbols:st.symbols.join(',')}}));
      st.heartbeat=setInterval(()=>{if(ws.readyState===1)ws.send(JSON.stringify({action:'heartbeat'}));},10000);
      this.paintQuotes();
    });
    ws.addEventListener('message',event=>{
      if(st.userSocket!==ws)return;
      try{
        const item=JSON.parse(event.data);
        if(item.event==='price'&&st.symbols.includes(item.symbol)&&Number.isFinite(Number(item.price))){
          st.quotes[item.symbol]={price:Number(item.price),timestamp:Number(item.timestamp)||Date.now()/1000};
          this.queueQuotes();
        }else if(item.event==='subscribe-status'&&item.status==='error'){
          st.streamError='Subscription unavailable for this key or plan';this.paintQuotes();
        }else if(item.event==='error'||item.status==='error'){
          st.streamError='Twelve Data reported an API or entitlement error';this.paintQuotes();
        }
      }catch(_){}
    });
    ws.addEventListener('error',()=>{if(st.userSocket===ws){st.streamError='Connection failed; verify key and streaming access';this.paintQuotes();}});
    ws.addEventListener('close',()=>{if(st.userSocket===ws){clearInterval(st.heartbeat);st.heartbeat=null;st.userSocket=null;st.streamError='Connection closed; reconnect with your key';this.paintQuotes();}});
    this.paintQuotes();
  }
  disconnectUserKey(paint=true){
    const st=this.registry.state;clearInterval(st.heartbeat);st.heartbeat=null;
    const ws=st.userSocket;st.userSocket=null;if(ws)ws.close();
    st.quotes={};st.streamError=null;if(paint)this.paintQuotes();
  }
  saveGateway(){
    const field=document.querySelector('[data-market-gateway-input]');
    if(!field)return;
    const value=field.value.trim();
    if(value){const url=new URL(value);if(url.protocol!=='https:'&&url.hostname!=='localhost')throw Error('Use HTTPS');}
    this.disconnectUserKey(false);this.registry.state.stream?.close();this.registry.state.stream=null;
    if(value)localStorage.setItem('floresta-market-gateway',value);
    else localStorage.removeItem('floresta-market-gateway');
    this.connectGateway();this.paint();
  }
}
new FlorestaSystem();

