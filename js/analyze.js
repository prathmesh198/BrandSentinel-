// Analyze screen. `AnalysisService` is the only place to swap for a FastAPI call later.
const AnalysisService={async analyze({label,type,seed}){await new Promise(r=>setTimeout(r,900)); // simulated latency
 let h=0;for(const c of seed)h=(h*31+c.charCodeAt(0))%997;const score=55+h%43;
 const F=[['Terminology','Old product name used','Terminology',80,'Use the approved product name from the glossary.','Replace "Brand X Pro" with "BrandSentinel".'],['Brand Tone','Tone is too casual','Tone of Voice',75,'Formal brands should avoid slang.','Rewrite the opening in a confident, professional voice.'],['Promotional Claims','Unsupported claim','Promotional Claims',88,'Superlatives need approved proof.','Remove "Best in India" or cite an approved source.'],['Logo & Visuals','Logo appears modified','Logo Guidelines',70,'Use the approved logo asset without changes.','Replace the modified logo with the official file.'],['Accessibility','Low colour contrast','Accessibility',82,'Text must meet WCAG AA contrast.','Darken the text colour; add image alt text.']];
 return{label,type,score,findings:F.map(f=>({cat:f[0],title:score>=f[3]?'Check passed':f[1],severity:score>=f[3]?'Passed':score<f[3]-12?'High':'Medium',why:score>=f[3]?'No issue found (demo check).':f[4],rule:f[2],fix:score>=f[3]?'None needed.':f[5]}))}}};
let aMode='file',aFile=null,aRec=null;
function analyzeInit(){
 $$('#modes button').forEach(b=>b.addEventListener('click',()=>{aMode=b.dataset.mode;$$('#modes button').forEach(x=>x.classList.toggle('on',x===b));['file','text','url'].forEach(m=>$('#m-'+m).hidden=m!==aMode)}));
 const drop=$('#drop'),pick=f=>{if(!f)return;if(!/\.(pdf|docx|txt|png|jpe?g|webp)$/i.test(f.name)){$('#aErr').textContent='Unsupported format. Use PDF, DOCX, TXT, PNG, JPG or WEBP.';return}aFile=f;$('#aErr').textContent='';$('#fname').textContent='Selected: '+f.name};
 const open=()=>$('#file').click();drop.addEventListener('click',open);drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});$('#browse').addEventListener('click',open);
 $('#file').addEventListener('change',e=>pick(e.target.files[0]));
 ['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('over');BS.anim({targets:drop,scale:1.02,duration:150})}));
 ['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('over');BS.anim({targets:drop,scale:1,duration:150})}));
 drop.addEventListener('drop',e=>pick(e.dataTransfer.files[0]));
 $('#runBtn').addEventListener('click',async()=>{let label,seed;const er=$('#aErr');er.textContent='';
  if(aMode==='file'){if(!aFile)return er.textContent='Please choose a file first.';label=aFile.name;seed=aFile.name+aFile.size}
  else if(aMode==='text'){const t=$('#txt').value.trim();if(t.length<10)return er.textContent='Enter at least 10 characters of text.';label=t.slice(0,28)+'…';seed=t}
  else{const u=$('#url').value.trim();try{label=new URL(u).hostname}catch{return er.textContent='Enter a valid URL (https://…).'}seed=u}
  const btn=$('#runBtn');btn.disabled=true;btn.textContent='Analyzing (demo)…';
  const res=await AnalysisService.analyze({label,type:$('#ctype').value,seed});btn.disabled=false;btn.textContent='Analyze Content →';
  const recs=BS.records();aRec={id:Date.now(),name:label,type:res.type,score:res.score,status:BS.statusOf(res.score),reviewer:'You',date:new Date().toISOString().slice(0,10)};
  recs.unshift(aRec);BS.saveRecords(recs);renderResults(res)});
}
function renderResults(r){
 $('#results').innerHTML=`<div class="row"><h3>Analysis Results</h3><span id="rStat"></span></div><div class="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" class="trk"/><circle id="rBar" cx="50" cy="50" r="42" class="bar" stroke-dasharray="264" stroke-dashoffset="264"/></svg><span id="rNum">0</span></div><p class="muted" style="text-align:center">${esc(r.label)} · simulated demo result</p>
 ${r.findings.map((f,i)=>`<div class="finding"><div class="row" style="margin:0"><b>${f.cat}: ${esc(f.title)}</b><span class="badge ${f.severity==='Passed'?'ok':f.severity==='High'?'bad':'warn'}">${f.severity}</span></div><div class="d" hidden>${f.why}<br><b>Guideline:</b> ${f.rule}<br><b>Suggested correction:</b> ${f.fix}</div></div>`).join('')}
 <div class="acts"><button class="btn primary" data-a="Approved">Approve</button><button class="btn outline" data-a="Warning">Request Changes</button><button class="btn outline" data-a="Disapproved">Reject</button><button class="btn ghost" id="vd">View Details</button></div>`;
 $('#rStat').innerHTML=BS.badge(aRec.status);
 const num=$('#rNum'),bar=$('#rBar'),off=264-264*r.score/100;
 if(typeof anime==='undefined'||BS.reduce){num.textContent=r.score;bar.style.strokeDashoffset=off}else{const o={v:0};anime({targets:o,v:r.score,round:1,duration:1100,easing:'easeOutQuad',update:()=>num.textContent=o.v});anime({targets:bar,strokeDashoffset:off,duration:1100,easing:'easeOutQuad'})}
 $$('[data-a]',$('#results')).forEach(b=>b.addEventListener('click',()=>{const recs=BS.records(),x=recs.find(y=>y.id===aRec.id);x.status=aRec.status=b.dataset.a;BS.saveRecords(recs);$('#rStat').innerHTML=BS.badge(x.status);BS.toast('Status updated: '+x.status)}));
 $('#vd').addEventListener('click',()=>$$('#results .d').forEach(d=>d.hidden=!d.hidden));
}
