import {timingSafeEqual} from 'node:crypto';
const equal=(a,b)=>{const x=Buffer.from(String(a||'')),y=Buffer.from(String(b||''));return x.length===y.length&&timingSafeEqual(x,y)};
const bot=process.env.TELEGRAM_BOT_TOKEN;
const secret=process.env.TELEGRAM_WEBHOOK_SECRET;
const group=process.env.TELEGRAM_GROUP_CHAT_ID;
const githubBot=String(process.env.TELEGRAM_BOT_USERNAME||'').replace(/^@/,'');
const contexts={github:{name:'Floresta GitHub',help:'I handle GitHub repository notifications and workflow questions.'},floresta:{name:'Floresta Web',help:'I help with Floresta Web services and their status.'},general:{name:'Floresta Assistant',help:'I can help you navigate Floresta services.'}};
function route(chat,text){if(/^\/github(?:@\w+)?\b/i.test(text)||/\bgithub\b/i.test(text))return 'github';if(/^\/floresta(?:@\w+)?\b/i.test(text)||/\bfloresta\b/i.test(text))return 'floresta';return 'general'}
export default async function handler(req,res){
 if(req.method==='GET')return res.status(200).json({service:'floresta-telegram',configured:!!(bot&&secret&&group),mode:'webhook'});
 if(req.method!=='POST')return res.status(405).end();
 if(!bot||!secret||!group)return res.status(503).json({error:'not configured'});
 if(!equal(req.headers['x-telegram-bot-api-secret-token'],secret))return res.status(403).end();
 const update=req.body||{};const message=update.message||update.edited_message;const chat=message?.chat;
 if(!chat||String(chat.id)!==String(group))return res.status(200).json({ok:true,ignored:true});
 const text=String(message.text||'').slice(0,1000);if(!text)return res.status(200).json({ok:true});
 const isCommand=/^\/(start|help|github|floresta)(?:@([\w]+))?\b/i.exec(text);
 if(isCommand?.[2]&&isCommand[2].toLowerCase()!==githubBot.toLowerCase())return res.status(200).json({ok:true});
 const mentioned=githubBot&&text.toLowerCase().includes('@'+githubBot.toLowerCase());
 if(!isCommand&&!mentioned&&chat.type!=='private')return res.status(200).json({ok:true,ignored:true});
 const source=route(chat,text);const ctx=contexts[source];
 const answer=`${ctx.name} • ${ctx.help}\nSource: Telegram (verified webhook)\nContext: ${source}\nCommands: /github, /floresta, /help`;
 const response=await fetch(`https://api.telegram.org/bot${bot}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chat.id,text:answer,reply_parameters:{message_id:message.message_id,allow_sending_without_reply:true}}),signal:AbortSignal.timeout(8000)});
 if(!response.ok)return res.status(502).json({error:'Telegram send failed'});
 return res.status(200).json({ok:true});
}
