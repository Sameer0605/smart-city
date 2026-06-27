/**
 * display.js — KPI Cards & Animated Gauges
 * SmartCity AI · India Urban Intelligence
 *
 * setGauge(arcId, pctId, pct, color) — animate SVG circular gauge
 * animateVal(id, target, fmt)         — animated number counter
 * updateDisplay(t, a, p)              — update all dashboard KPIs
 * fmtIN(v)                            — Indian locale number format
 */

/* ══════════════ DISPLAY ══════════════ */
function setGauge(arcId,pctId,pct,color){
  const r=27,c=2*Math.PI*r,el=document.getElementById(arcId);
  if(!el)return;
  el.setAttribute('stroke',color);
  el.setAttribute('stroke-dasharray',c.toFixed(1));
  el.setAttribute('stroke-dashoffset',(c*(1-Math.min(100,pct)/100)).toFixed(1));
  document.getElementById(pctId).textContent=Math.round(Math.min(100,pct))+'%';
}
const fmtIN=v=>Math.round(v*1e6).toLocaleString('en-IN');

function updateDisplay(t,a,p){
  S.pred={t,a,p};
  const gi=greenIdx(S.city,S.year);
  // KPIs
  animateVal('kv-pop',p,v=>fmtIN(v));
  document.getElementById('ks-pop').textContent=p.toFixed(2)+' Million';
  setGauge('g-pop','gp-pop',Math.min(100,p*3.5),'#7c3aed');

  animateVal('kv-veh',t*18000,v=>Math.round(v).toLocaleString('en-IN'));
  document.getElementById('ks-veh').textContent='Index: '+t.toFixed(1);
  setGauge('g-veh','gp-veh',Math.min(100,t),'#1a56db');

  animateVal('kv-gc',gi,v=>v.toFixed(0));
  setGauge('g-gc','gp-gc',gi,'#16a34a');

  animateVal('kv-ti',a,v=>v.toFixed(0));
  document.getElementById('ks-ti').textContent=a>200?'Hazardous':a>150?'Unhealthy':a>100?'Moderate':'Good';
  setGauge('g-ti','gp-ti',Math.min(100,a/3),'#d97706');

  // map hud - null-safe (elements differ between map modes)
  const _se=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  _se('mhud-city',S.city);_se('mhud-year',S.year);_se('mhud-model',S.model);
  _se('mhud-pop',p.toFixed(2)+'M');_se('mhud-traf',t.toFixed(1));_se('mhud-aqi',a.toFixed(0));
  _se('ghud-city',S.city);_se('ghud-year',S.year);_se('ghud-model',S.model);
  _se('ghud-pop',p.toFixed(2)+'M');_se('ghud-traf',t.toFixed(1));_se('ghud-aqi',a.toFixed(0));

  // status
  document.getElementById('st-city').textContent=S.city;
  document.getElementById('st-year').textContent=S.year;
  document.getElementById('st-model').textContent=S.model;
  document.getElementById('an-city').textContent=S.city+', '+S.year;
  document.getElementById('rep-city').textContent=S.city;
  document.getElementById('rep-year').textContent=S.year;
  document.getElementById('yearChip').textContent=S.year;
  document.getElementById('yearSlider').value=S.year;
  document.getElementById('yearInput').value=S.year;
}

// Animated counter
function animateVal(id,target,fmt){
  const el=document.getElementById(id);if(!el)return;
  const start=parseFloat(el.dataset.raw||0)||0;
  el.dataset.raw=target;
  const dur=800,step=16,steps=dur/step;
  let i=0;
  const iv=setInterval(()=>{
    i++;
    const progress=i/steps;
    const ease=1-Math.pow(1-progress,3);
    const cur=start+(target-start)*ease;
    el.textContent=fmt(cur);
    if(i>=steps){el.textContent=fmt(target);clearInterval(iv);}
  },step);
}

