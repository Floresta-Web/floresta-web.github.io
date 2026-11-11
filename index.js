/* Floresta Web: standalone, dependency-free browser monolith. */
(() => {
  'use strict';
  const SCRIPT = new URL(document.currentScript?.src || 'index.js', location.href);
  const style = document.createElement('style');
  style.textContent = `
    :root{color-scheme:dark;font-family:system-ui,sans-serif;background:#071a14;color:#d8f8e3}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center}
    main{width:min(860px,94vw);padding:32px;border:1px solid #285c45;border-radius:22px;background:#0b251c}
    h1{font-size:clamp(2rem,5vw,4rem);margin:0}p{line-height:1.6;color:#a4d5b9}
    .panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px;margin-top:24px}
    section{border:1px solid #285c45;padding:18px;border-radius:14px}canvas,svg{width:100%;height:160px}
    button{background:#2c9962;border:0;color:white;padding:12px 18px;border-radius:9px;cursor:pointer}
    small{color:#a4d5b9}
  `;
  document.head.append(style);
  document.title = 'Floresta Web';
  document.body.innerHTML = `<main><h1>Floresta Web</h1><p>Single-file JavaScript runtime · WebAssembly · WebGPU · SVG vectors · Web Audio</p>
    <div class="panel">
      <section><h2>Vector graphics</h2><svg viewBox="0 0 320 160" role="img" aria-label="Animated forest">
        <defs><linearGradient id="leaf" x2="0" y2="1"><stop stop-color="#65db8a"/><stop offset="1" stop-color="#146b48"/></linearGradient></defs>
        <circle cx="265" cy="32" r="20" fill="#d5c77a" opacity=".85"/>
        <path d="M0 150 Q80 100 160 150 T320 150V160H0Z" fill="#164d37"/>
        <g fill="url(#leaf)"><path d="M70 18 20 125H120Z"/><path d="M160 4 105 140H215Z"/><path d="M245 27 196 130H294Z"/></g>
        <g stroke="#714b2d" stroke-width="9"><path d="M70 120v35M160 135v20M245 125v30"/></g></svg><small>Native scalable SVG</small></section>
      <section><h2>WebGPU</h2><canvas id="gpu" width="480" height="300"></canvas><small id="gpu-status">Initializing…</small></section>
      <section><h2>WebAssembly</h2><p id="wasm-status">Initializing…</p><small>Embedded WASM module, no extra file</small></section>
      <section><h2>Web Audio</h2><p>Sound is enabled by user interaction.</p><button id="sound">Play forest tone</button><p id="audio-status"></p></section>
    </div><p><small id="reload-status">Checking index.js for changes every 5 seconds.</small></p></main>`;
  // WASM binary: exported add(i32,i32)->i32.
  const wasm = new Uint8Array([0,97,115,109,1,0,0,0,1,7,1,96,2,127,127,1,127,3,2,1,0,7,7,1,3,97,100,100,0,0,10,9,1,7,0,32,0,32,1,106,11]);
  WebAssembly.instantiate(wasm).then(({instance}) => {
    document.querySelector('#wasm-status').textContent = 'WASM active: 20 + 26 = ' + instance.exports.add(20,26);
  }).catch(e => document.querySelector('#wasm-status').textContent = 'WASM unavailable: ' + e.message);
  async function gpu() {
    const canvas = document.querySelector('#gpu'), label = document.querySelector('#gpu-status');
    if (!navigator.gpu) { label.textContent = 'WebGPU unavailable in this browser'; return; }
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) throw Error('No GPU adapter');
      const device = await adapter.requestDevice();
      const context = canvas.getContext('webgpu');
      const format = navigator.gpu.getPreferredCanvasFormat();
      context.configure({device,format,alphaMode:'opaque'});
      const shader = device.createShaderModule({code:`
        @vertex fn vs(@builtin(vertex_index) i:u32)->@builtin(position) vec4f {
          var pos=array<vec2f,3>(vec2f(0.,.8),vec2f(-.8,-.7),vec2f(.8,-.7));
          return vec4f(pos[i],0.,1.);
        }
        @fragment fn fs()->@location(0) vec4f {return vec4f(.16,.75,.43,1.);}
      `});
      const pipeline = device.createRenderPipeline({layout:'auto',vertex:{module:shader,entryPoint:'vs'},fragment:{module:shader,entryPoint:'fs',targets:[{format}]} ,primitive:{topology:'triangle-list'}});
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginRenderPass({colorAttachments:[{view:context.getCurrentTexture().createView(),loadOp:'clear',clearValue:{r:.03,g:.12,b:.09,a:1},storeOp:'store'}]});
      pass.setPipeline(pipeline);pass.draw(3);pass.end();device.queue.submit([encoder.finish()]);
      label.textContent = 'GPU render pipeline active';
    } catch(e) {label.textContent = 'WebGPU initialization failed: ' + e.message;}
  }
  gpu();
  document.querySelector('#sound').addEventListener('click', async () => {
    const label=document.querySelector('#audio-status');
    try {
      const AudioContextClass=window.AudioContext||window.webkitAudioContext;
      if (!AudioContextClass) throw Error('Web Audio unsupported');
      const ctx=new AudioContextClass(); await ctx.resume();
      const oscillator=ctx.createOscillator(),gain=ctx.createGain();
      oscillator.type='sine';oscillator.frequency.setValueAtTime(220,ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440,ctx.currentTime+0.6);
      gain.gain.setValueAtTime(.0001,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.12,ctx.currentTime+.05);
      gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+1);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start();oscillator.stop(ctx.currentTime+1.05);
      oscillator.onended=()=>ctx.close();
      label.textContent='Tone played';
    } catch(e) {label.textContent=e.message;}
  });
  // GitHub Pages is static: poll this script, compare SHA-256 of bytes, reload on change.
  // Hashes avoid false positives from ETag or Last-Modified behavior.
  const digest = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
  let lastHash=null,checking=false;
  async function checkSource() {
    if(checking || document.hidden) return;
    checking=true;
    try {
      const url=new URL(SCRIPT);url.searchParams.set('_check',Date.now().toString());
      const response=await fetch(url,{cache:'no-store'});
      if(!response.ok) throw Error('HTTP '+response.status);
      const hash=await digest(await response.arrayBuffer());
      if(lastHash!==null && lastHash!==hash) {location.reload();return;}
      lastHash=hash;
      document.querySelector('#reload-status').textContent='Live update monitor active · index.js SHA-256 '+hash.slice(0,12);
    } catch(e) {
      document.querySelector('#reload-status').textContent='Update check failed: '+e.message;
    } finally {checking=false;}
  }
  checkSource();
  setInterval(checkSource,5000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkSource();});
})();
