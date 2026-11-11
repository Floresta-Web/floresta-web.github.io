/* Floresta Web — generated UI, no authored HTML/CSS files beyond bootstrap. */
'use strict';
class FlorestaSystem {
  constructor() {
    this.registry={state:{mode:'',windows:[],active:0,next:1,theme:'dark',menuOpen:false},functions:{},apps:{}};
    this.apps=[
      {id:'welcome',name:'Welcome',icon:'🌲',description:'Floresta Web operating environment'},
      {id:'files',name:'Files',icon:'📁',description:'Local workspace overview'},
      {id:'terminal',name:'Terminal',icon:'⌘',description:'Read-only demonstration console'},
      {id:'settings',name:'Settings',icon:'⚙',description:'Display and environment preferences'},
      {id:'about',name:'About',icon:'◈',description:'Runtime and browser capabilities'}
    ];
    this.registry.apps=Object.fromEntries(this.apps.map(a=>[a.id,a]));
    this.audit=new FlorestaAudit(this);this.motion=new FlorestaMotion(this);this.hardware=new FlorestaHardware(this);this.monitor=new FlorestaMonitor(this);
    this.detect();this.style();this.render();this.events();this.audit.initialize();this.hardware.initialize();this.monitor.start();
    window.addEventListener('resize',()=>this.onResize());
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
      :root{font-family:Inter,system-ui,-apple-system,sans-serif;color-scheme:dark;--bg:#071711;--panel:#12251e;--panel2:#1a3329;--line:#335647;--text:#e9f7ee;--muted:#a5c3b1;--accent:#8de6a7;--shadow:0 24px 80px #0008}
      *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);overflow:hidden}button,input{font:inherit}button{cursor:pointer;color:inherit}button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
      #root{height:100dvh;min-height:380px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 70% 10%,#25513b 0,transparent 52%),linear-gradient(145deg,#071711,#0d2920 65%,#061610)}
      .wallpaper{position:absolute;inset:0;pointer-events:none;opacity:.3;background:repeating-radial-gradient(circle at 65% 65%,transparent 0 42px,#83bd9b0a 43px 44px)}
      .topbar{height:46px;display:flex;align-items:center;gap:14px;padding:0 17px;background:#071811c9;border-bottom:1px solid #ffffff18;backdrop-filter:blur(20px);position:relative;z-index:100}
      .brand{font-weight:750;letter-spacing:.2px}.brand em{font-style:normal;color:var(--accent)}.topbar .spacer{flex:1}.hint{font-size:12px;color:var(--muted)}
      .brand-button{border:0;background:transparent;color:inherit;font-weight:750;letter-spacing:.2px;padding:9px 12px;border-radius:10px;display:flex;align-items:center;gap:8px}.brand-button:hover,.brand-button[aria-expanded=true]{background:#ffffff16}
      .floresta-menu{position:absolute;top:48px;left:14px;width:min(320px,calc(100vw - 28px));padding:9px;border:1px solid var(--line);border-radius:16px;background:#10291f;box-shadow:var(--shadow);z-index:200;transform-origin:top left}.floresta-menu[hidden]{display:none}.floresta-menu button{display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;text-align:left;background:transparent;border:0;border-radius:10px;color:var(--text)}.floresta-menu button:hover,.floresta-menu button:focus-visible{background:#ffffff18}.floresta-menu .menu-caption{padding:9px 14px;color:var(--muted);font-size:12px}
      .clock{font-size:13px;font-variant-numeric:tabular-nums}.workspace{position:absolute;inset:46px 0 0}.desktop-icons{position:absolute;top:24px;left:22px;display:grid;gap:13px}
      .desktop-icon{width:100px;display:grid;justify-items:center;gap:7px;padding:12px 5px;border:0;border-radius:15px;background:transparent;font-size:12px}
      .desktop-icon:hover,.desktop-icon:focus-visible{background:#ffffff15}.app-symbol{font-size:30px;display:grid;place-items:center;width:58px;height:58px;background:linear-gradient(145deg,#24513a,#163326);border:1px solid #ffffff24;border-radius:18px}
      .taskbar{position:absolute;bottom:0;left:0;right:0;height:65px;display:flex;justify-content:center;align-items:center;gap:10px;background:#06150fd9;border-top:1px solid #ffffff1c;backdrop-filter:blur(22px);z-index:100}
      .dock-btn{height:46px;min-width:46px;border:1px solid #ffffff20;border-radius:15px;background:#ffffff0b;font-size:24px}.dock-btn:hover,.dock-btn.selected{background:#357d52}
      .window{position:absolute;top:10%;left:18%;width:min(690px,75vw);height:min(500px,75vh);min-width:300px;min-height:230px;border:1px solid #729c8050;border-radius:17px;background:#10241deF;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column;backdrop-filter:blur(30px)}
      .window.maximized{inset:8px!important;width:auto!important;height:auto!important}.window.minimized{display:none}
      .window-title{height:48px;display:flex;align-items:center;gap:10px;padding:0 13px;background:#ffffff09;border-bottom:1px solid #ffffff14;cursor:grab;user-select:none;touch-action:none}
      .window-title strong{font-size:14px;flex:1}.window-title button{border:0;background:#ffffff13;border-radius:9px;width:30px;height:30px}.window-title button:hover{background:#ffffff2c}
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
    if(id==='settings')return '<h1>Settings</h1><p>Appearance and display profile</p><button class="action" data-action="theme">Toggle light / dark theme</button><div class="tiles"><div class="tile"><b>Automatic display</b><span>'+s.mode+'</span></div><div class="tile"><b>Touch support</b><span>'+(s.touch?'Available':'Not detected')+'</span></div></div>';
    return '<h1>About Floresta Web</h1><p>JavaScript-generated user interface on GitHub Pages.</p><div class="tiles"><div class="tile"><b>Browser</b><span>'+s.browser+'</span></div><div class="tile"><b>Platform</b><span>'+s.platform+'</span></div><div class="tile"><b>WebAssembly</b><span>'+(typeof WebAssembly!=='undefined'?'Supported':'Unavailable')+'</span></div><div class="tile"><b>WebGPU</b><span>'+(navigator.gpu?'Available':'Unavailable')+'</span></div></div>';
  }
  open(id){this.audit.record("shell.open",{id});
    if(!this.registry.apps[id])return;
    const s=this.registry.state;
    if(s.mode!=='desktop'){s.active=id;this.render();return;}
    const existing=s.windows.find(w=>w.app===id);
    if(existing){existing.min=false;this.focus(existing.id);}else{
      const w={id:s.next++,app:id,min:false,max:false,x:Math.min(220+30*s.windows.length,window.innerWidth-400),y:Math.min(75+25*s.windows.length,window.innerHeight-330)};
      s.windows.push(w);this.focus(w.id);
    }
  }
  focus(id){this.registry.state.active=id;this.render();}
  close(id){this.audit.record("shell.close",{id});const s=this.registry.state;s.windows=s.windows.filter(w=>w.id!==id);s.active=s.windows.at(-1)?.id||0;this.render();}
  windowNode(w){
    const a=this.registry.apps[w.app],active=this.registry.state.active===w.id;
    const win=this.node('section',{class:'window'+(w.max?' maximized':'')+(w.min?' minimized':''),style:{left:w.x+'px',top:w.y+'px',zIndex:active?'50':String(10+w.id)}});
    const bar=this.node('header',{class:'window-title','data-drag':String(w.id)},[
      this.node('span',{text:a.icon}),this.node('strong',{text:a.name}),
      this.node('button',{'data-action':'min','data-id':w.id,'aria-label':'Minimize',text:'−'}),
      this.node('button',{'data-action':'max','data-id':w.id,'aria-label':'Maximize',text:'□'}),
      this.node('button',{'data-action':'close','data-id':w.id,'aria-label':'Close',text:'×'})
    ]);
    win.append(bar,this.node('article',{class:'window-body',html:this.appContent(w.app)}));
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
      this.node('button',{class:'brand-button','data-action':'menu','aria-label':'Floresta Web applications','aria-haspopup':'menu','aria-expanded':String(s.menuOpen),html:'🌲 Floresta Web ▾'}),
      this.node('span',{class:'hint',text:s.mode==='desktop'?'Desktop window system':'Android-inspired '+s.mode+' system'}),
      this.node('span',{class:'spacer'}),this.node('span',{class:'clock',id:'clock'})
    ]);root.append(top);
    if(s.mode==='desktop'){const menu=this.node('div',{class:'floresta-menu',id:'floresta-menu',role:'menu',hidden:s.menuOpen?null:''});if(s.menuOpen)menu.removeAttribute('hidden');menu.append(this.node('div',{class:'menu-caption',text:'Applications'}));this.apps.forEach(a=>menu.append(this.node('button',{role:'menuitem','data-open':a.id,text:a.icon+'  '+a.name})));root.append(menu);}
    if(s.mode==='desktop'){
      const space=this.node('div',{class:'workspace'});
      s.windows.forEach(w=>space.append(this.windowNode(w)));root.append(space);
    }else{
      const home=this.node('div',{class:'mobile-home'});
      home.append(this.node('div',{class:'mobile-clock',id:'bigclock'}),this.node('div',{class:'mobile-date',id:'date'}));
      home.append(this.node('button',{class:'search','data-open':'files',text:'⌕  Search apps and files'}));
      const grid=this.node('div',{class:'app-grid'});
      this.apps.forEach(a=>grid.append(this.node('button',{class:'app-launch','data-open':a.id},[this.node('span',{class:'app-symbol',text:a.icon}),this.node('span',{text:a.name})])));
      home.append(grid);root.append(home);
      if(s.active&&typeof s.active==='string'){
        const a=this.registry.apps[s.active];
        root.append(this.node('section',{class:'sheet'},[
          this.node('div',{class:'sheet-header'},[this.node('span',{text:a.icon}),this.node('b',{text:a.name}),this.node('button',{'data-action':'home',text:'✕ Close'})]),
          this.node('article',{html:this.appContent(a.id)})
        ]));
      }
      root.append(this.node('nav',{class:'android-nav'},[this.node('button',{'data-action':'home','aria-label':'Go home'})]));
    }
    document.body.append(root);this.clock();this.motion.morph(root);this.audit.record("shell.render",{mode:s.mode});
  }
  clock(){
    const now=new Date();
    const c=document.querySelector('#clock');if(c)c.textContent=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    const b=document.querySelector('#bigclock');if(b)b.textContent=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    const d=document.querySelector('#date');if(d)d.textContent=now.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric'});
  }
  events(){
    document.addEventListener('click',e=>{
      const target=e.target.closest('[data-open],[data-action]');if(!target)return;
      if(target.dataset.open){this.registry.state.menuOpen=false;this.open(target.dataset.open);return;}
      const s=this.registry.state,id=Number(target.dataset.id),w=s.windows.find(w=>w.id===id);
      switch(target.dataset.action){
        case 'menu':s.menuOpen=!s.menuOpen;this.render();break;
        case 'home':s.active=0;this.render();break;
        case 'theme':s.theme=s.theme==='dark'?'light':'dark';this.render();break;
        case 'close':this.close(id);break;
        case 'min':if(w){w.min=true;this.render();}break;
        case 'max':if(w){w.max=!w.max;this.focus(id);}break;
      }
    });
    document.addEventListener('pointerdown',e=>{
      if(this.registry.state.menuOpen&&!e.target.closest('#floresta-menu,.brand-button')){this.registry.state.menuOpen=false;this.render();return;}
      const bar=e.target.closest('[data-drag]');if(!bar||e.target.closest('button'))return;
      const id=Number(bar.dataset.drag),w=this.registry.state.windows.find(w=>w.id===id);
      if(!w||w.max)return;
      const sx=e.clientX,sy=e.clientY,ox=w.x,oy=w.y,win=bar.parentElement;
      const move=ev=>{w.x=Math.max(0,Math.min(window.innerWidth-100,ox+ev.clientX-sx));w.y=Math.max(0,Math.min(window.innerHeight-140,oy+ev.clientY-sy));win.style.left=w.x+'px';win.style.top=w.y+'px';};
      const end=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);};
      window.addEventListener('pointermove',move);window.addEventListener('pointerup',end,{once:true});
    });
    window.setInterval(()=>this.clock(),15000);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.registry.state.menuOpen){this.registry.state.menuOpen=false;this.render();return;}if(e.key==='Escape'&&this.registry.state.mode!=='desktop'){this.registry.state.active=0;this.render();}});
  }
}

class FlorestaModule {
 constructor(name,system){this.name=name;this.system=system;this.registry=Object.create(null);this.register('constructor');}
 register(fn,data={}){const x=this.registry[fn]??={calls:0,history:[],children:Object.create(null)};x.calls++;x.history.push({time:Date.now(),data});if(x.history.length>64)x.history.shift();}
}
class FlorestaMotion extends FlorestaModule {
 constructor(system){super('Motion',system);this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;}
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
 for(const file of ['index.js','index.R']){const u=new URL(file,location.href);u.searchParams.set('_check',Date.now());const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error(file+' HTTP '+r.status);const h=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await r.arrayBuffer())),v=>v.toString(16).padStart(2,'0')).join('');const old=this.hashes.get(file);if(old&&old!==h){location.reload();return;}this.hashes.set(file,h);}
 }catch(e){this.system.audit.record('monitor.error',{message:String(e)});}finally{this.busy=false;}}
 start(){this.register('start');this.check();setInterval(()=>this.check(),5000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)this.check();});}
}
new FlorestaSystem();
