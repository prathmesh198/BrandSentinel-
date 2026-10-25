const DEF={company:'Acme Corporation',strict:'Strict',auto:true,human:false,name:'Sarah Johnson',email:'sarah@acme.com',logo:''};
function settingsInit(){
 const S=Object.assign({},DEF,store.get('bs_settings',{})),apply=()=>{$('#co').value=S.company;$('#nm').value=S.name;$('#em').value=S.email;$('#auto').checked=S.auto;$('#human').checked=S.human;$$('[name=st]').forEach(r=>r.checked=r.value===S.strict);
  $('#uName').textContent=S.name;$('#av').textContent=S.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();$('#logoPrev').innerHTML=S.logo?`<img src="${S.logo}" alt="Company logo">`:esc(S.company.slice(0,4).toUpperCase())};
 apply();
 $('#chLogo').addEventListener('click',()=>$('#logoF').click());
 $('#logoF').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;if(!f.type.startsWith('image/')||f.size>500000)return BS.toast('Choose an image under 500 KB');const r=new FileReader();r.onload=()=>{S.logo=r.result;apply()};r.readAsDataURL(f)});
 $$('.save').forEach(b=>b.addEventListener('click',()=>{const em=$('#em').value.trim();if(!$('#co').value.trim()||!$('#nm').value.trim())return BS.toast('Name fields cannot be empty');if(!/^\S+@\S+\.\S+$/.test(em))return BS.toast('Enter a valid email');
  Object.assign(S,{company:$('#co').value.trim(),name:$('#nm').value.trim(),email:em,auto:$('#auto').checked,human:$('#human').checked,strict:($('[name=st]:checked')||{}).value||'Strict'});store.set('bs_settings',S);apply();BS.toast('Settings saved')}));
 $('#chPw').addEventListener('click',()=>BS.toast('Demo only: password changes are not available'));
}
