function dashboardInit(){
 BS.hooks.dashboard=()=>{const r=BS.records(),n=s=>r.filter(x=>x.status===s).length;
  const C=[['Total Analyses',r.length,'▦','+12%'],['Approved',n('Approved'),'✔','+6%'],['Warnings',n('Warning'),'⚠','+3%'],['Disapproved',n('Disapproved'),'✖','-1%']];
  $('#stats').innerHTML=C.map(c=>`<div class="card stat"><span class="gi">${c[2]}</span><small> ${c[0]}</small><b data-n="${c[1]}">0</b><span class="pct">${c[3]} vs last month</span></div>`).join('');
  $$('#stats b').forEach(b=>{const v=+b.dataset.n;if(typeof anime==='undefined'||BS.reduce)return b.textContent=v;const o={x:0};anime({targets:o,x:v,round:1,duration:900,easing:'easeOutQuad',update:()=>b.textContent=o.x})});
  BS.anim({targets:'#stats .card',opacity:[0,1],translateY:[16,0],delay:BS.stagger(80)});
  $('#recent').innerHTML=r.slice(0,5).map(x=>`<tr><td>${esc(x.name)}</td><td>${x.type}</td><td>${x.score}</td><td>${BS.badge(x.status)}</td><td>${x.date}</td><td><button class="btn outline sm" data-view="${x.id}">View</button></td></tr>`).join('');
  $$('[data-view]').forEach(b=>b.addEventListener('click',()=>{const x=r.find(y=>y.id==b.dataset.view);BS.modal(x.name,`<p>Score ${x.score}/100 · ${x.status}<br>Reviewer: ${x.reviewer} · ${x.date}</p>`)}))};
}
