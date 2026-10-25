// Core helpers, storage, navigation, auth and shared UI (toast, modal, animations).
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store={get:(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch{return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const BS={reduce:matchMedia('(prefers-reduced-motion: reduce)').matches,hooks:{},pending:'dashboard'};
// Safe Anime.js wrapper: does nothing if the library failed to load or motion is reduced.
BS.anim=o=>{if(typeof anime==='undefined'||BS.reduce)return;anime(Object.assign({duration:450,easing:'easeOutQuad'},o))};
BS.stagger=ms=>typeof anime!=='undefined'?anime.stagger(ms):0;
BS.badge=s=>`<span class="badge ${{Approved:'ok',Warning:'warn',Disapproved:'bad'}[s]}">${s}</span>`;
BS.statusOf=s=>s>=85?'Approved':s>=70?'Warning':'Disapproved';
BS.toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(BS.tt);BS.tt=setTimeout(()=>t.classList.remove('show'),2200)};
BS.modal=(t,html)=>{$('#mT').textContent=t;$('#mB').innerHTML=html;$('#modal').hidden=false;BS.anim({targets:'.mbox',scale:[.95,1],opacity:[0,1],duration:250})};
BS.records=()=>{let r=store.get('bs_records',null);if(!r){const S=[['Instagram Campaign','Image',85],['Website Landing Page','Web',94],['Product PDF','PDF',61],['Social Media Post','Text',92],['Banner Advertisement','Image',78]];r=[];for(let i=0;i<23;i++){const b=S[i%5],sc=i<5?b[2]:Math.max(40,Math.min(98,b[2]+(i*7)%11-5));r.push({id:i+1,name:i<5?b[0]:`${b[0]} ${Math.floor(i/5)+1}`,type:b[1],score:sc,status:BS.statusOf(sc),reviewer:['Sarah J.','Mike R.'][i%2],date:new Date(Date.UTC(2025,3,26-i)).toISOString().slice(0,10)})}store.set('bs_records',r)}return r};
BS.saveRecords=r=>{store.set('bs_records',r);BS.refresh()};
BS.refresh=()=>['dashboard','history'].forEach(k=>BS.hooks[k]&&BS.hooks[k]());
BS.go=n=>{$$('.screen').forEach(s=>s.hidden=s.id!=='s-'+n);$$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.go===n));$('#side').classList.remove('open');$('#bellPop').hidden=$('#userPop').hidden=true;
BS.hooks[n]&&BS.hooks[n]();BS.anim({targets:'#s-'+n,opacity:[0,1],translateY:[10,0]});scrollTo(0,0)};
BS.enter=n=>{$('#landing').hidden=true;$('#app').hidden=false;BS.go(n||'dashboard');BS.anim({targets:'#side',translateX:[-20,0],opacity:[0,1]})};
BS.init=()=>{
 BS.records();
 BS.anim({targets:'#heroText > *',opacity:[0,1],translateY:[20,0],delay:BS.stagger(90)});BS.anim({targets:'#heroCard',opacity:[0,1],translateX:[30,0],delay:250});
 BS.anim({targets:'.bar',strokeDashoffset:[264,40],duration:1200});
 $$('[data-go]').forEach(b=>b.addEventListener('click',()=>BS.go(b.dataset.go)));
 const askLogin=t=>{BS.pending=t||'dashboard';$('#loginWrap').hidden=false;BS.anim({targets:'#loginWrap .login',opacity:[0,1],translateY:[16,0]});$('#email').focus()};
 $$('[data-login]').forEach(b=>b.addEventListener('click',()=>sessionStorage.bs_auth?BS.enter():askLogin()));
 $$('[data-target]').forEach(b=>b.addEventListener('click',()=>sessionStorage.bs_auth?BS.enter(b.dataset.target):askLogin(b.dataset.target)));
 $('#loginForm').addEventListener('submit',e=>{e.preventDefault();const em=$('#email').value.trim(),pw=$('#pw').value,er=$('#loginError');
  if(!/^\S+@\S+\.\S+$/.test(em))return er.textContent='Enter a valid email address.';if(pw.length<6)return er.textContent='Password must be at least 6 characters.';
  er.textContent='';sessionStorage.bs_auth='1';$('#pw').value='';BS.enter(BS.pending)}); // password is never stored
 $('#menuBtn').addEventListener('click',()=>$('#side').classList.toggle('open'));
 const pop=(btn,p)=>$(btn).addEventListener('click',e=>{e.stopPropagation();const o=$(p),was=o.hidden;$('#bellPop').hidden=$('#userPop').hidden=true;o.hidden=!was;if(was)BS.anim({targets:p,opacity:[0,1],translateY:[-6,0],duration:200})});
 pop('#bellBtn','#bellPop');pop('#userBtn','#userPop');addEventListener('click',()=>{$('#bellPop').hidden=$('#userPop').hidden=true});
 $('#bellPop').innerHTML='<b>Notifications</b><p>Product PDF scored 61 and needs changes.</p><p>Guideline document updated Apr 20.</p><p class="muted">Demo notifications.</p>';
 $('#logout').addEventListener('click',()=>{sessionStorage.removeItem('bs_auth');location.reload()});
 $('#mX').addEventListener('click',()=>$('#modal').hidden=true);$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')$('#modal').hidden=true});
 $('#gSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){store.set('bs_q',e.target.value);BS.go('history')}});
 [analyzeInit,guidelinesInit,assistantInit,historyInit,settingsInit,dashboardInit].forEach(f=>f());
 if(sessionStorage.bs_auth)BS.enter(); // after init so settings/hooks exist
};
