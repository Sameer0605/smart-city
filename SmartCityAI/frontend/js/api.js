/**
 * api.js — Backend Communication & Fallback
 * SmartCity AI · India Urban Intelligence
 *
 * apiFetch(path)              — fetch with 1.5s timeout
 * setApiStatus(ok, ms)        — update sidebar status dot
 * fetchPred(city,year,model)  — prediction (API or fallback)
 * fetchRange(city,feat,model) — time series for charts
 * fetchZones(city,year,model) — zone predictions
 */

/* ══════════════ API ══════════════ */
async function apiFetch(path){
  const t0=performance.now();
  try{
    const r=await fetch(API+path,{signal:AbortSignal.timeout(1500)});
    const ms=Math.round(performance.now()-t0);
    if(!r.ok)throw 0;
    const d=await r.json();
    setApiStatus(true,ms); return d;
  }catch{setApiStatus(false); return null;}
}
function setApiStatus(ok,ms){
  S.apiOk=ok;
  document.getElementById('apiDot').className='api-dot'+(ok?' ok':' err');
  document.getElementById('apiLabel').textContent=ok?'Backend: online':'Backend: offline';
  document.getElementById('apiMs').textContent=ok?ms+'ms':'';
  document.getElementById('st-api').textContent=ok?'API: online ✓':'API: fallback';
}
async function fetchPred(city,year,model){
  const d=await apiFetch(`/predict/all?city=${city}&year=${year}&model=${model}`);
  if(d&&d.predictions)return{t:d.predictions.traffic.value,a:d.predictions.aqi.value,p:d.predictions.population.value};
  return{t:fb(city,year,'traffic',model),a:fb(city,year,'aqi',model),p:fb(city,year,'population',model)};
}
async function fetchRange(city,feat,model){
  const d=await apiFetch(`/predict/range?city=${city}&year_start=2000&year_end=2100&step=5&feature=${feat}&model=${model}`);
  if(d&&d.series)return d.series;
  const o=[];for(let y=2000;y<=2100;y+=5)o.push({year:y,value:fb(city,y,feat,model)});return o;
}
async function fetchZones(city,year,model){
  const d=await apiFetch(`/predict/zones?city=${city}&year=${year}&model=${model}`);
  if(d&&d.zones)return d.zones;
  // Always compute fresh fallback values — never use S.pred (may be 0 on first load)
  const c=CITIES[city];
  const bt=fb(city,year,'traffic',model);
  const ba=fb(city,year,'aqi',model);
  const bp=fb(city,year,'population',model);
  const RISK_LEVELS=['LOW','MEDIUM','MEDIUM','HIGH','CRITICAL'];
  return ZONES.map(z=>{
    const zt=+(bt*z.tm*(1+(Math.random()-.5)*.06)).toFixed(1);
    const za=+(ba*z.am*(1+(Math.random()-.5)*.06)).toFixed(0);
    const zp=+(bp*z.pm*(1+(Math.random()-.5)*.04)).toFixed(3);
    const rs=+Math.min(100,(zt/1.5+za/3.5)/2).toFixed(1);
    const rl=rs>75?'CRITICAL':rs>55?'HIGH':rs>35?'MEDIUM':'LOW';
    return{name:z.n,lat:c.lat+z.lo,lng:c.lng+z.go,
      traffic:zt,aqi:za,population:zp,risk_score:rs,risk_level:rl};
  });
}

