// Predefined demo replies. Replace `reply()` with a backend call later.
const QA=[[/logo/,'No. Per the guidelines the official logo must not be modified. Use the approved logo asset.'],[/tone|voice|social/,'Use a confident, clear and friendly tone. Avoid slang and exaggerated claims.'],[/claim|promo/,'Approved claims are those with documented proof. Superlatives like "best" need sign-off.'],[/colou?r|palette/,'Primary Indigo #4F46E5, Violet #8B5CF6 and Navy #0F1B3D.'],[/font|typo/,'Headings use Plus Jakarta Sans; body text uses Inter.']];
const reply=q=>(QA.find(x=>x[0].test(q.toLowerCase()))||[0,"I don't have a demo answer for that. Try asking about logo, tone, claims or colours."])[1];
function assistantInit(){
 const msgs=$('#msgs'),add=(t,w)=>{const d=document.createElement('div');d.className='b '+w;d.textContent=t;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;BS.anim({targets:d,opacity:[0,1],translateY:[8,0],duration:300});return d};
 add('Hi! I answer from demo guideline data (not live AI). What would you like to know?','a');
 const ask=q=>{q=q.trim();if(!q)return;add(q,'u');$('#chatIn').value='';const t=add('Typing…','a');setTimeout(()=>{t.remove();add(reply(q),'a')},800)};
 $('#sugg').innerHTML=['Can I use a modified version of our logo?','What tone should our social media posts use?','Which promotional claims are approved?','What are our brand colors?'].map(q=>`<button>${q}</button>`).join('');
 $$('#sugg button').forEach(b=>b.addEventListener('click',()=>ask(b.textContent)));
 $('#chatForm').addEventListener('submit',e=>{e.preventDefault();ask($('#chatIn').value)});
}
