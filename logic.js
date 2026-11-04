(function(root,factory){
  if(typeof module==='object'&&module.exports) module.exports=factory();
  else root.SPTLogic=factory();
})(typeof self!=='undefined'?self:this,function(){
  const ROUNDING=30;
  const mins=t=>{let[a,b]=t.split(':').map(Number);return a*60+b};
  const fmt=m=>`${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}`;
  const roundTime=(h,m)=>`${String((h+(m>=ROUNDING?1:0))%24).padStart(2,'0')}:00`;
  function duration(x){return mins(x.end)-mins(x.start)}
  function overtime(x,os='08:00',oe='17:00',weekend=true){let wd=new Date(x.date+'T12:00:00').getDay();if(weekend&&(wd===0||wd===6))return duration(x);return Math.max(0,Math.min(mins(x.end),mins(os))-mins(x.start))+Math.max(0,mins(x.end)-Math.max(mins(x.start),mins(oe)))}
  function totals(works,abs,os='08:00',oe='17:00',weekend=true){let worked=works.reduce((a,x)=>a+duration(x),0),extra=works.reduce((a,x)=>a+overtime(x,os,oe,weekend),0),absence={ferie:0,permessi:0,malattia:0};abs.forEach(x=>{const key=x.type==='Permesso'?'permessi':x.type.toLowerCase();absence[key]=(absence[key]||0)+(x.type==='Permesso'?x.hours*60:480)});return{worked,overtime:extra,...absence}}
  function sortDay(works,abs){return [...works.map(entry=>({kind:'work',entry})),...abs.map(entry=>({kind:'absence',entry}))].sort((a,b)=>{if(a.kind!==b.kind)return a.kind==='work'?-1:1;const as=a.kind==='work'?mins(a.entry.start):Infinity,bs=b.kind==='work'?mins(b.entry.start):Infinity;if(as!==bs)return as-bs;const ae=a.kind==='work'?mins(a.entry.end):Infinity,be=b.kind==='work'?mins(b.entry.end):Infinity;return ae-be})}
  function dayTotal(works,date){return works.filter(x=>x.date===date).reduce((a,x)=>a+duration(x),0)}
  return{ROUNDING,mins,fmt,roundTime,duration,overtime,totals,sortDay,dayTotal};
});
