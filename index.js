/* Floresta Web OS: index.js is the only JS source; R source is index.R.
 * All application DOM, CSS, modes, runtime and controls are generated here.
 * Web Bluetooth/USB are permission-gated, never silently accessed.
 */
class FlorestaBase {
  constructor(name, app) {
    this.name=name; this.app=app;
    this.registry=Object.create(null);
    this.register('constructor',{created:Date.now()});
  }
  register(fn,data={}) {
    const bucket=this.registry[fn] ||= {calls:0,history:[],children:Object.create(null)};
    bucket.calls++;bucket.history.push({at:Date.now(),...data});
    if(bucket.history.length>64)bucket.history.shift();
    return bucket;
  }
  action(fn,data={}) {this.register(fn,data);this.app?.audit?.record(this.name+'.'+fn,data);}
}
class FlorestaAudit extends FlorestaBase {
  constructor(app){super('Audit',app);this.events=[];this.summary=null;this.ready=false;}
  record(action,data={}) {
    this.register('record',{action});
    this.events.push({action,timestamp:Date.now(),data});
    if(this.events.length>500)this.events.shift();
    this.render();
  }
  async initialize() {
    this.register('initialize');
    try {
      // webR's official ES module distribution; R executes in a WebAssembly worker.
      const {WebR}=await import('https://webr.r-wasm.org/latest/webr.mjs');
      this.webR=new WebR();await this.webR.init();
      const response=await fetch(new URL('./index.R',import.meta.url),{cache:'no-store'});
      if(!response.ok)throw Error('index.R HTTP '+response.status);
      await this.webR.evalR(await response.text());
      this.ready=true;this.record('webr.ready');
      await this.analyse();
    } catch(error) {this.error=String(error);this.render();}
  }
  async analyse() {
    this.register('analyse');
    if(!this.ready)return;
    try {
      const payload=JSON.stringify(this.events.map(e=>({action:e.action,timestamp:e.timestamp})));
      // Parse JSON in R using the webR-shipped jsonlite package when available.
      const json=JSON.stringify(payload);
      const result=await this.webR.evalR(`local({ if(!requireNamespace("jsonlite",quietly=TRUE)) stop("jsonlite unavailable"); floresta_audit(jsonlite::fromJSON(${json},simplifyVector=FALSE)) })`);
      this.summary=await result.toJs();this.render();
    }catch(error){this.error=String(error);this.render();}
  }
  render() {
    const el=document.querySelector('#audit');if(!el)return;
    el.textContent=this.ready
      ? 'R / WASM active · '+this.events.length+' events · '+(this.summary?'statistics updated':'awaiting analysis')
      : 'R / WASM '+(this.error?'unavailable: '+this.error:'loading…');
  }
}
class FlorestaEnvironment extends FlorestaBase {
  constructor(app){super('Environment',app);this.info=this.detect();}
  detect() {
    this.register('detect');
    const ua=navigator.userAgent;
    const os=/Android/i.test(ua)?'Android':/iPhone|iPad|iPod/i.test(ua)?'iOS/iPadOS':/Windows/i.test(ua)?'Windows':/Mac OS/i.test(ua)?'macOS':/Linux/i.test(ua)?'Linux':'Unknown';
    const browser=/Firefox\//.test(ua)?'Firefox':/Edg\//.test(ua)?'Edge':/Chrome\//.test(ua)?'Chrome':/Safari\//.test(ua)?'Safari':'Other';
    const width=window.innerWidth,height=window.innerHeight;
    const coarse=matchMedia('(pointer:coarse)').matches;
    // Modes respond to viewport size, not OS alone: desktop windows only above 1024px.
    const mode=width>=1024&&!coarse?'desktop':width>=600?'tablet':'mobile';
    return {os,browser,mode,width,height,dpr:devicePixelRatio,orientation:width>=height?'landscape':'portrait',
      touch:navigator.maxTouchPoints>0,standalone:matchMedia('(display-mode:standalone)').matches};
  }
  refresh() {
    const previous=this.info.mode;this.info=this.detect();this.action('refresh',this.info);
    if(previous!==this.info.mode)this.app.render();
    else this.app.updateEnvironment();
  }
}
class FlorestaCapabilities extends FlorestaBase {
  constructor(app){super('Capabilities',app);this.state={};}
  async initialize(){
    this.register('initialize');
    this.state={wasm:typeof WebAssembly==='object',gpu:!!navigator.gpu,audio:!!(window.AudioContext||window.webkitAudioContext),
      bluetooth:!!navigator.bluetooth,usb:!!navigator.usb,svg:!!document.createElementNS};
    if(this.state.wasm){
      try{
        const bytes=new Uint8Array([0,97,115,109,1,0,0,0,1,7,1,96,2,127,127,1,127,3,2,1,0,7,7,1,3,97,100,100,0,0,10,9,1,7,0,32,0,32,1,106,11]);
        const {instance}=await WebAssembly.instantiate(bytes);
        this.state.wasm='active: 20+26='+instance.exports.add(20,26);
      }catch(e){this.state.wasm=String(e);}
    }
    this.app.audit.record('capabilities.initialized',this.state);
    this.render();
    await this.initializeGPU();
  }
  async initializeGPU(){
    this.register('initializeGPU');
    const canvas=document.querySelector('#gpu');if(!canvas||!navigator.gpu)return;
    try{
      const adapter=await navigator.gpu.requestAdapter();if(!adapter)throw Error('adapter unavailable');
      const device=await adapter.requestDevice(),context=canvas.getContext('webgpu');
      const format=navigator.gpu.getPreferredCanvasFormat();
      context.configure({device,format,alphaMode:'opaque'});
      const shader=device.createShaderModule({code:`
        @vertex fn vs(@builtin(vertex_index) i:u32)->@builtin(position) vec4f {
          var p=array<vec2f,3>(vec2f(0.,.8),vec2f(-.8,-.7),vec2f(.8,-.7));
          return vec4f(p[i],0.,1.);
        }
        @fragment fn fs()->@location(0) vec4f{return vec4f(.14,.78,.43,1.);}
      `});
      const pipeline=device.createRenderPipeline({layout:'auto',vertex:{module:shader,entryPoint:'vs'},fragment:{module:shader,entryPoint:'fs',targets:[{format}]}});
      const encoder=device.createCommandEncoder();
      const pass=encoder.beginRenderPass({colorAttachments:[{view:context.getCurrentTexture().createView(),loadOp:'clear',clearValue:{r:.02,g:.12,b:.08,a:1},storeOp:'store'}]});
      pass.setPipeline(pipeline);pass.draw(3);pass.end();device.queue.submit([encoder.finish()]);
      this.state.gpu='active';this.action('gpu.render');this.render();
    }catch(e){this.state.gpu='unavailable: '+e.message;this.render();}
  }
  render(){
    const el=document.querySelector('#capabilities');if(!el)return;
    el.textContent=Object.entries(this.state).map(([key,value])=>key+': '+value).join(' · ');
  }
  async sound(){
    this.action('sound');
    try{
      const Context=window.AudioContext||window.webkitAudioContext;
      if(!Context)throw Error('unsupported');
      const ctx=new Context();await ctx.resume();
      const osc=ctx.createOscillator(),gain=ctx.createGain();
      osc.frequency.setValueAtTime(220,ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440,ctx.currentTime+.5);
      gain.gain.setValueAtTime(.001,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.1,ctx.currentTime+.05);
      gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.8);
      osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.85);
      osc.onended=()=>ctx.close();
    }catch(e){this.app.notice('Audio: '+e.message);}
  }
  async bluetooth(){
    this.action('bluetooth.request');
    try{
      if(!navigator.bluetooth)throw Error('not supported');
      const device=await navigator.bluetooth.requestDevice({acceptAllDevices:true});
      this.app.notice('Bluetooth: '+(device.name||device.id));
    }catch(e){this.app.notice('Bluetooth: '+e.message);}
  }
  async usb(){
    this.action('usb.request');
    try{
      if(!navigator.usb)throw Error('not supported');
      const device=await navigator.usb.requestDevice({filters:[]});
      this.app.notice('USB: '+(device.productName||'device selected'));
    }catch(e){this.app.notice('USB: '+e.message);}
  }
}
class FlorestaShell extends FlorestaBase {
  constructor(app){super('Shell',app);this.windows=new Map();}
  element(tag,attrs={},children=[]){
    this.register('element',{tag});
    const node=document.createElement(tag);
    for(const [key,value] of Object.entries(attrs)){
      if(key==='class')node.className=value;
      else if(key==='text')node.textContent=value;
      else node.setAttribute(key,value);
    }
    for(const child of children)node.append(child);
    return node;
  }
  svg(){
    this.register('svg');
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 300 120');svg.setAttribute('role','img');svg.setAttribute('aria-label','Forest vector graphic');
    for(const [x,y,s] of [[55,8,1],[145,0,1.25],[235,12,.9]]){
      const path=document.createElementNS(svg.namespaceURI,'path');
      path.setAttribute('d',`M ${x} ${y} l ${-42*s} ${90*s} h ${84*s} Z`);
      path.setAttribute('fill','#2dbb71');svg.append(path);
    }
    return svg;
  }
  stylesheet(){
    this.register('stylesheet');
    const style=this.element('style');
    style.textContent=`
      :root{color-scheme:dark;font-family:system-ui,sans-serif;background:#061711;color:#d9f9e5}
      *{box-sizing:border-box}body{margin:0}button{cursor:pointer;border:0;background:#228b58;color:white;padding:12px;border-radius:12px}
      button:hover{background:#32a76d}header{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:16px 22px;background:#103626}
      h1{margin:0;font-size:1.3rem}h2{font-size:1.05rem}.sub{color:#9ac9af;font-size:.82rem}
      .workspace{min-height:calc(100dvh - 120px);padding:18px;position:relative;overflow:hidden}
      .dock{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;padding:14px;background:#103626}
      .tile{background:#123c2c;border:1px solid #2e694a;border-radius:18px;padding:18px;min-width:210px;max-width:100%;overflow-wrap:anywhere}
      .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:16px}
      .tile svg{width:100%;height:120px}.tile canvas{width:100%;height:120px}
      .window{position:absolute;top:22px;left:22px;width:min(560px,calc(100% - 44px));background:#0d2b20;border:1px solid #3b8c60;border-radius:14px;box-shadow:0 12px 35px #0008;overflow:hidden}
      .window-title{display:flex;justify-content:space-between;align-items:center;padding:9px 14px;background:#1c5138;cursor:move}
      .window-body{padding:18px}.window-body canvas{width:100%;height:120px}
      .mobile-nav{display:flex;justify-content:space-around;padding:12px;background:#103626;position:sticky;bottom:0}
      .mobile-nav button{border-radius:22px}.status{padding:10px 18px;color:#a5d3b8;font-size:.8rem}
      body[data-mode=mobile] .workspace{padding:12px}body[data-mode=mobile] header{padding:12px}
      body[data-mode=mobile] .tiles{grid-template-columns:repeat(2,minmax(0,1fr))}
      body[data-mode=mobile] .tile{min-width:0;padding:12px}
      body[data-mode=tablet] .tiles{grid-template-columns:repeat(3,minmax(0,1fr))}
      @media(max-width:400px){body[data-mode=mobile] .tiles{grid-template-columns:1fr}}
    `;
    return style;
  }
  tile(title,description,action){
    this.register('tile',{title});
    const button=this.element('button',{text:title});
    button.addEventListener('click',action);
    return this.element('section',{class:'tile'},[this.element('h2',{text:title}),this.element('p',{class:'sub',text:description}),button]);
  }
  content(){
    this.register('content');
    const wrapper=this.element('div');
    wrapper.append(this.svg());
    wrapper.append(this.element('p',{id:'capabilities',class:'sub',text:'Detecting capabilities…'}));
    wrapper.append(this.element('canvas',{id:'gpu',width:'480',height:'220'}));
    wrapper.append(this.element('p',{id:'audit',class:'sub',text:'R audit initializing…'}));
    return wrapper;
  }
  openWindow(){
    this.action('openWindow');
    if(this.app.environment.info.mode!=='desktop')return;
    const area=document.querySelector('.workspace');
    if(this.windows.has('system')){this.windows.get('system').remove();this.windows.delete('system');}
    const close=this.element('button',{text:'×','aria-label':'Close window'});
    const title=this.element('div',{class:'window-title'},[this.element('strong',{text:'Floresta System Monitor'}),close]);
    const win=this.element('article',{class:'window'},[title,this.element('div',{class:'window-body'},[this.content()])]);
    close.addEventListener('click',()=>{this.action('closeWindow');win.remove();this.windows.delete('system');});
    area.append(win);this.windows.set('system',win);
    let drag=null;
    title.addEventListener('pointerdown',e=>{if(e.target===close)return;drag={x:e.clientX,y:e.clientY,left:win.offsetLeft,top:win.offsetTop};title.setPointerCapture(e.pointerId);});
    title.addEventListener('pointermove',e=>{if(!drag)return;win.style.left=Math.max(0,drag.left+e.clientX-drag.x)+'px';win.style.top=Math.max(0,drag.top+e.clientY-drag.y)+'px';});
    title.addEventListener('pointerup',()=>{drag=null;});
    this.app.capabilities.render();this.app.audit.render();this.app.capabilities.initializeGPU();
  }
  render(){
    this.action('render');
    this.windows.clear();
    const info=this.app.environment.info;
    document.body.replaceChildren();
    document.body.dataset.mode=info.mode;
    document.head.querySelector('#floresta-style')?.remove();
    const style=this.stylesheet();style.id='floresta-style';document.head.append(style);
    const header=this.element('header',{},[this.element('h1',{text:'Floresta Web OS'}),this.element('span',{id:'environment',class:'sub'})]);
    const area=this.element('main',{class:'workspace'});
    const controls=[
      this.tile('System','Runtime and capabilities',()=>info.mode==='desktop'?this.openWindow():this.app.showPanel()),
      this.tile('Web Audio','Play a generated tone',()=>this.app.capabilities.sound()),
      this.tile('Web Bluetooth','Request a device with permission',()=>this.app.capabilities.bluetooth()),
      this.tile('WebUSB','Request a device with permission',()=>this.app.capabilities.usb()),
      this.tile('R Audit','Analyse JavaScript events using webR',()=>this.app.audit.analyse())
    ];
    area.append(this.element('div',{class:'tiles'},controls));
    if(info.mode!=='desktop'){
      area.append(this.element('section',{class:'tile',id:'panel'},[this.content()]));
    }
    const footer=this.element('footer',{class:info.mode==='desktop'?'dock':'mobile-nav'},[
      this.element('button',{text:'Home'}),this.element('button',{text:'System'}),this.element('button',{text:'Audit'})
    ]);
    footer.children[0].addEventListener('click',()=>this.app.render());
    footer.children[1].addEventListener('click',()=>info.mode==='desktop'?this.openWindow():this.app.showPanel());
    footer.children[2].addEventListener('click',()=>this.app.audit.analyse());
    document.body.append(header,area,this.element('div',{class:'status',id:'notice',text:'Floresta Web OS ready'}),footer);
    this.app.updateEnvironment();this.app.capabilities.render();this.app.audit.render();
    if(info.mode==='desktop')this.openWindow();
    else this.app.capabilities.initializeGPU();
  }
}
class FlorestaSourceMonitor extends FlorestaBase {
  constructor(app){super('SourceMonitor',app);this.hashes=new Map();this.busy=false;}
  async check(){
    this.register('check');
    if(this.busy||document.hidden)return;
    this.busy=true;
    try{
      for(const file of ['index.js','index.R']){
        const url=new URL('./'+file,import.meta.url);url.searchParams.set('_check',String(Date.now()));
        const response=await fetch(url,{cache:'no-store'});
        if(!response.ok)throw Error(file+': HTTP '+response.status);
        const bytes=await response.arrayBuffer();
        const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
        const old=this.hashes.get(file);
        if(old&&old!==hash){location.reload();return;}
        this.hashes.set(file,hash);
      }
    }catch(e){this.app.notice('Source monitor: '+e.message);}
    finally{this.busy=false;}
  }
  start(){
    this.register('start');this.check();
    setInterval(()=>this.check(),5000);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)this.check();});
  }
}
class FlorestaApp extends FlorestaBase {
  constructor(){
    super('App',null);
    this.audit=new FlorestaAudit(this);
    this.environment=new FlorestaEnvironment(this);
    this.capabilities=new FlorestaCapabilities(this);
    this.shell=new FlorestaShell(this);
    this.monitor=new FlorestaSourceMonitor(this);
  }
  start(){
    this.register('start');
    document.title='Floresta Web OS';
    this.render();
    this.capabilities.initialize();
    this.audit.initialize();
    this.monitor.start();
    let resizeHandle;
    window.addEventListener('resize',()=>{clearTimeout(resizeHandle);resizeHandle=setTimeout(()=>this.environment.refresh(),120);});
    window.addEventListener('orientationchange',()=>this.environment.refresh());
    setInterval(()=>this.audit.analyse(),15000);
  }
  render(){this.register('render');this.shell.render();}
  updateEnvironment(){
    this.register('updateEnvironment');
    const info=this.environment.info;
    const el=document.querySelector('#environment');
    if(el)el.textContent=[info.os,info.browser,info.mode,info.width+'×'+info.height,info.orientation,'DPR '+info.dpr].join(' · ');
  }
  showPanel(){
    this.register('showPanel');
    document.querySelector('#panel')?.scrollIntoView({behavior:'smooth',block:'center'});
  }
  notice(message){
    this.register('notice',{message});
    const el=document.querySelector('#notice');if(el)el.textContent=message;
  }
}
new FlorestaApp().start();
