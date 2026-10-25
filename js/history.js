let hF='All',hP=1;const PS=5;
const hList=()=>{const q=$('#hSearch').value.trim().toLowerCase();return BS.records().filter(r=>(hF==='All'||r.status===hF)&&r.name.toLowerCase().includes(q))};
function renderHistory(){const l=hList(),pages=Math.max(1,Math.ceil(l.length/PS));hP=Math.min(hP,pages);const s=l.slice((hP-1)*PS,hP*PS);
 $('#hBody').innerHTML=s.length?s.map(r=>`<tr><td>${esc(r.name)}</td><td>${r.score}</td><td>${BS.badge(r.status)}</td><td>${r.reviewer}</td><td>${r.date}</td><td><button class="btn outline sm" data-r="${r.id}">View</button></td></tr>`).join(''):'<tr><td colspan="6" class="empty">No matching analyses.</td></tr>';
 $('#hInfo').textContent=l.length?`Showing ${(hP-1)*PS+1}-${(hP-1)*PS+s.length} of ${l.length} results`:'0 results';
 $('#pager').innerHTML=Array.from({length:pages},(_,i)=>`<button class="${i+1===hP?'on':''}" data-p="${i+1}">${i+1}</button>`).join('');
 $$('[data-p]').forEach(b=>b.addEventListener('click',()=>{hP=+b.dataset.p;renderHistory()}));
 $$('[data-r]').forEach(b=>b.addEventListener('click',()=>{const r=BS.records().find(x=>x.id==b.dataset.r);BS.modal(r.name,`<p>Type: ${r.type}<br>Score: ${r.score}/100<br>Status: ${r.status}<br>Reviewer: ${r.reviewer}<br>Date: ${r.date}</p>`)}))}
function historyInit(){
 BS.hooks.history=()=>{const q=store.get('bs_q','');if(q){$('#hSearch').value=q;store.set('bs_q','')}renderHistory()};
 $$('#filters button').forEach(b=>b.addEventListener('click',()=>{hF=b.dataset.f;hP=1;$$('#filters button').forEach(x=>x.classList.toggle('on',x===b));renderHistory()}));
 $('#hSearch').addEventListener('input',()=>{hP=1;renderHistory()});
 $('#csv').addEventListener('click',()=>{const l=hList();if(!l.length)return BS.toast('Nothing to export');
  const rows=[['Content','Type','Score','Status','Reviewer','Date'],...l.map(r=>[r.name,r.type,r.score,r.status,r.reviewer,r.date])];
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')],{type:'text/csv'}));a.download='analysis-history.csv';a.click();URL.revokeObjectURL(a.href);BS.toast('CSV exported')});
}
