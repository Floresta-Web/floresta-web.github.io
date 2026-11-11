'use strict';
/* Floresta Market Gateway: Node.js 22+ native WebSocket, no dependencies.
   TWELVEDATA_API_KEY is required; never place it in the public site.
   Set MARKET_ORIGIN=https://floresta-web.github.io and MARKET_PORT=8787.
   Put behind HTTPS reverse proxy for public use. */
const http=require('node:http');
class FlorestaMarketGateway {
  constructor(){
    this.registry={functions:{},state:{clients:new Set(),socket:null,retry:1000,lastPrice:new Map(),connected:false}};
    this.key=process.env.TWELVEDATA_API_KEY||'';
    this.origin=process.env.MARKET_ORIGIN||'https://floresta-web.github.io';
    this.port=Number(process.env.MARKET_PORT||8787);
    this.symbols=(process.env.MARKET_SYMBOLS||'EUR/USD,GBP/USD,USD/JPY,USD/CHF,AUD/USD,USD/CAD').split(',').map(s=>s.trim()).filter(Boolean);
    if(!this.key)throw Error('TWELVEDATA_API_KEY must be set on the server');
    if(typeof WebSocket==='undefined')throw Error('Node.js 22+ native WebSocket required');
    this.server=http.createServer((req,res)=>this.handle(req,res));
    this.server.listen(this.port,'127.0.0.1',()=>console.log('Market gateway on localhost:'+this.port));
    this.connect();
    setInterval(()=>this.heartbeat(),10000);
  }
  handle(req,res){
    if(req.url!=='/market/stream'){res.writeHead(404);res.end();return;}
    if(req.method!=='GET'){res.writeHead(405);res.end();return;}
    if(req.headers.origin!==this.origin){res.writeHead(403);res.end('Origin not allowed');return;}
    res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','Access-Control-Allow-Origin':this.origin,'Vary':'Origin','X-Accel-Buffering':'no'});
    res.write(': Floresta market stream\n\n');
    this.registry.state.clients.add(res);
    for(const value of this.registry.state.lastPrice.values())res.write('event: price\ndata: '+JSON.stringify(value)+'\n\n');
    req.on('close',()=>this.registry.state.clients.delete(res));
  }
  connect(){
    const ws=new WebSocket('wss://ws.twelvedata.com/v1/quotes/price?apikey='+encodeURIComponent(this.key));
    this.registry.state.socket=ws;
    ws.addEventListener('open',()=>{this.registry.state.connected=true;this.registry.state.retry=1000;ws.send(JSON.stringify({action:'subscribe',params:{symbols:this.symbols.join(',')}}));});
    ws.addEventListener('message',event=>{
      try{const msg=JSON.parse(String(event.data));if(msg.event!=='price'||!this.symbols.includes(msg.symbol)||!Number.isFinite(Number(msg.price)))return;
        const safe={event:'price',symbol:msg.symbol,price:Number(msg.price),timestamp:Number(msg.timestamp)||Math.floor(Date.now()/1000)};
        this.registry.state.lastPrice.set(msg.symbol,safe);
        for(const client of this.registry.state.clients)client.write('event: price\ndata: '+JSON.stringify(safe)+'\n\n');
      }catch(e){console.error('Bad market message',e.message);}
    });
    const reconnect=()=>{if(this.registry.state.socket!==ws)return;this.registry.state.connected=false;const wait=this.registry.state.retry;this.registry.state.retry=Math.min(wait*2,60000);setTimeout(()=>this.connect(),wait);};
    ws.addEventListener('close',reconnect);
    ws.addEventListener('error',()=>{try{ws.close();}catch(_){}});
  }
  heartbeat(){
    const ws=this.registry.state.socket;
    if(ws?.readyState===WebSocket.OPEN)ws.send(JSON.stringify({action:'heartbeat'}));
    for(const client of this.registry.state.clients)client.write(': heartbeat\n\n');
  }
}
new FlorestaMarketGateway();
