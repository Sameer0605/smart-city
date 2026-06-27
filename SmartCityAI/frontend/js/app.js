/**
 * app.js — Main Application Controller
 * SmartCity AI · India Urban Intelligence
 *
 * Handles everything that ties the app together:
 *   setTab(tab)        — sidebar navigation + SPA transitions
 *   runPredict()       — city+year prediction flow
 *   onCityChange()     — city dropdown change handler
 *   onSlider(y)        — year slider drag handler
 *   setModel(m)        — ML model switch
 *   setDarkMode()      — switch to dark theme
 *   setLightMode()     — switch to light theme
 *   toggleProfile()    — profile dropdown open/close
 *   updateClock()      — topbar clock update
 *   finishBoot()       — called after boot animation completes
 *   doExport()         — download prediction report as .txt
 *   showNoCityToast()  — toast when navigating without city
 */

/* ══════════════ CONTROLS ══════════════ */
const PREDICTION_YEAR_START = 2026;
const PREDICTION_YEAR_END = 2100;

function setupPredictionYears(){
  const yearInput = document.getElementById('yearInput');
  const yearSlider = document.getElementById('yearSlider');
  const yearChip = document.getElementById('yearChip');

  if(yearInput){
    const current = Math.max(PREDICTION_YEAR_START, Math.min(PREDICTION_YEAR_END, parseInt(yearInput.value) || PREDICTION_YEAR_START));
    yearInput.innerHTML = '';
    for(let year = PREDICTION_YEAR_START; year <= PREDICTION_YEAR_END; year++){
      const option = document.createElement('option');
      option.value = String(year);
      option.textContent = String(year);
      yearInput.appendChild(option);
    }
    yearInput.value = String(current);
  }

  if(yearSlider){
    yearSlider.min = String(PREDICTION_YEAR_START);
    yearSlider.max = String(PREDICTION_YEAR_END);
    if(!yearSlider.value || parseInt(yearSlider.value) < PREDICTION_YEAR_START){
      yearSlider.value = String(PREDICTION_YEAR_START);
    }
  }

  if(yearChip){
    yearChip.textContent = String(Math.max(PREDICTION_YEAR_START, parseInt(yearChip.textContent) || PREDICTION_YEAR_START));
  }
}

setupPredictionYears();

function onCityChange(){
  const v = document.getElementById('citySelect').value;
  S.city = v || '';
  // If results were shown before, hide them again when city changes
  if(!v) {
    const results = document.getElementById('dashResults');
    const empty   = document.getElementById('dashEmpty');
    if(results){ results.style.display='none'; results.style.opacity='0'; }
    if(empty)  { empty.style.display='flex'; empty.style.opacity='1'; }
    resetDisplayToZero();
  }
}
function resetDisplayToZero(){
  ['kv-pop','kv-veh','kv-gc','kv-ti'].forEach(id=>{
    const e=document.getElementById(id);if(e){e.textContent='—';e.dataset.raw='0';}
  });
  ['ks-pop','ks-veh','ks-ti'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent='—';});
  // Reset gauges
  ['g-pop','g-veh','g-gc','g-ti'].forEach(id=>{
    const e=document.getElementById(id);
    if(e){e.setAttribute('stroke-dashoffset',2*Math.PI*27+'');e.setAttribute('stroke','#e2e8f0');}
  });
  ['gp-pop','gp-veh','gp-gc','gp-ti'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent='0%';});
  // Reset AI panel bars
  ['aip-tb','aip-ab','aip-pb'].forEach(id=>{const e=document.getElementById(id);if(e)e.style.width='0%';});
  ['aip-t','aip-a','aip-p'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent='—';});
  // Reset HUD
  ['ghud-pop','ghud-traf','ghud-aqi'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent='—';});
}
// Map city/year selectors removed — controlled from Dashboard only
function onMapCityChange(v){ if(v){ S.city=v; loadGmap(v); buildExplorer(v); } }
function onMapYearChange(v){ if(v){ S.year=parseInt(v); loadGmap(S.city); updateAIPanel(); } }
function onSlider(y){
  S.year=y;
  const yc=document.getElementById('yearChip'); if(yc) yc.textContent=y;
  // Sync year select to nearest option
  const yi=document.getElementById('yearInput');
  if(yi){ const opts=[...yi.options].map(o=>parseInt(o.value)); const closest=opts.reduce((a,b)=>Math.abs(b-y)<Math.abs(a-y)?b:a); yi.value=closest; }
  // Only update if results are already showing (city was already predicted)
  const results = document.getElementById('dashResults');
  if(results && results.style.display !== 'none') {
    runPredict();
  }
}
async function runPredict(){
  const cityVal = document.getElementById('citySelect').value;
  if(!cityVal){
    // Shake the select
    const sel = document.getElementById('citySelect');
    sel.classList.add('ppc-shake');
    setTimeout(()=>sel.classList.remove('ppc-shake'),600);
    showNoCityToast('predict');
    return;
  }
  const btn = document.getElementById('btnPredict');
  btn.classList.add('loading');
  btn.querySelector('.ppc-btn-text').textContent = 'Predicting…';
  // Update status to loading
  setPpcStatus('loading', cityVal);
  S.city  = cityVal;
  S.year  = Math.min(PREDICTION_YEAR_END,Math.max(PREDICTION_YEAR_START,parseInt(document.getElementById('yearInput').value)||PREDICTION_YEAR_START));
  document.getElementById('yearSlider').value  = S.year;
  document.getElementById('yearChip').textContent = S.year;
  document.getElementById('yearInput').value   = S.year;
  const{t,a,p} = await fetchPred(S.city, S.year, S.model);
  updateDisplay(t,a,p);
  // Update predictor status panel
  setPpcStatus('done', cityVal, t, a, p);
  // Show results section
  const empty   = document.getElementById('dashEmpty');
  const results = document.getElementById('dashResults');
  if(empty)  { empty.style.opacity='0'; empty.style.transform='scale(.96)'; setTimeout(()=>empty.style.display='none',350); }
  if(results){
    results.style.display = 'block';
    results.style.opacity = '0';
    results.style.transform = 'translateY(20px)';
    requestAnimationFrame(()=>{
      results.style.transition = 'opacity .5s cubic-bezier(.16,1,.3,1), transform .5s cubic-bezier(.16,1,.3,1)';
      results.style.opacity = '1';
      results.style.transform = 'translateY(0)';
    });
  }
  setTimeout(()=>{ try{refreshCharts();}catch(e){} }, 80);
  setTimeout(()=>{ try{refreshAI();}catch(e){} }, 200);
  refreshMap(); buildExplorer(S.city);
  btn.classList.remove('loading');
  btn.querySelector('.ppc-btn-text').textContent = 'Re-Predict';
}

function setPpcStatus(state, city, t, a, p){
  const panel = document.getElementById('ppcStatus');
  if(!panel) return;
  if(state==='loading'){
    panel.innerHTML = `<div class="ppc-status-loading">
      <div class="ppc-spinner"></div>
      <div class="ppc-status-text">Running ML models for <b>${city}</b>…</div>
      <div class="ppc-status-sub">LSTM · Random Forest · Linear Regression</div>
    </div>`;
  } else {
    const risk = t>90?'CRITICAL':t>65?'HIGH':t>45?'MEDIUM':'LOW';
    const rc   = {CRITICAL:'#dc2626',HIGH:'#f97316',MEDIUM:'#f59e0b',LOW:'#22c55e'}[risk];
    panel.innerHTML = `<div class="ppc-status-done">
      <div class="ppc-status-city">${city}</div>
      <div class="ppc-status-year">${S.year} · ${S.model}</div>
      <div class="ppc-mini-grid">
        <div class="ppc-mini-item"><div class="ppc-mini-val" style="color:#7c3aed">${p.toFixed(1)}M</div><div class="ppc-mini-lbl">Population</div></div>
        <div class="ppc-mini-item"><div class="ppc-mini-val" style="color:#6366f1">${t.toFixed(0)}</div><div class="ppc-mini-lbl">Traffic Idx</div></div>
        <div class="ppc-mini-item"><div class="ppc-mini-val" style="color:#f97316">${a.toFixed(0)}</div><div class="ppc-mini-lbl">AQI</div></div>
      </div>
      <div class="ppc-risk-badge" style="background:${rc}22;color:${rc};border-color:${rc}44">⚠ ${risk} RISK</div>
    </div>`;
  }
}

function setModelChip(m){
  S.model = m;
  document.querySelectorAll('.ppc-chip').forEach(b=>{
    b.classList.toggle('active', b.id==='ppc-'+m.toLowerCase());
  });
  // Keep legacy model buttons in sync
  document.querySelectorAll('.m-btn').forEach(b=>b.className='m-btn');
  const el=document.getElementById('mb-'+m);
  if(el)el.className='m-btn a-'+m.toLowerCase();
  document.getElementById('st-model').textContent=m;
  // Auto re-predict if city already selected
  if(S.city){ runPredict(); }
}

function setModel(m){ setModelChip(m); }

const TAB_META={
  dashboard:['Smart City Dashboard','AI-powered urban prediction system · India'],
  map:['Map View','Interactive city risk heatmap · India'],
  analytics:['Analytics','Historical + AI forecast analysis'],
  forecast:['ML Forecast','Machine learning prediction engine'],
  ai:['AI Advisor','Smart recommendations & risk assessment'],
  reports:['Reports','Export prediction reports'],
};
function setTab(tab){
  // Gate: if no city selected, redirect to dashboard with a prompt
  const restrictedTabs = ['analytics','forecast','ai','map'];
  if(S.booted && restrictedTabs.includes(tab) && !S.city){
    showNoCityToast(tab);
    return;
  }
  // Deactivate all
  document.querySelectorAll('.pane').forEach(p=>p.classList.remove('active'));
  document.getElementById('pane-map').classList.remove('active');
  document.querySelectorAll('.nav-item').forEach((n,i)=>{
    const tabs=['dashboard','map','analytics','forecast','ai','reports',''];
    n.classList.toggle('active',tabs[i]===tab);
  });
  const pEl=document.getElementById('pane-'+tab);if(pEl)pEl.classList.add('active');

  const meta=TAB_META[tab]||['SmartCity AI',''];
  document.getElementById('tbTitle').textContent=meta[0];
  document.getElementById('tbSub').textContent=meta[1];

  if(tab==='map'){
    setTimeout(()=>{ try{refreshMap();}catch{} try{buildExplorer(S.city);}catch{}; },80);
  }
  if(tab==='analytics'||tab==='forecast') refreshCharts();
  if(tab==='ai') refreshAI();
}

// Toast notification when no city selected
function showNoCityToast(attemptedTab) {
  const existing = document.getElementById('noCityToast');
  if(existing) existing.remove();
  const tabNames = {analytics:'Analytics',forecast:'ML Forecast',ai:'AI Advisor',map:'Map View'};
  const toast = document.createElement('div');
  toast.id = 'noCityToast';
  toast.className = 'nc-toast';
  toast.innerHTML = `
    <div class="nc-toast-icon">🏙️</div>
    <div class="nc-toast-body">
      <div class="nc-toast-title">Select a City First</div>
      <div class="nc-toast-sub">${tabNames[attemptedTab]||attemptedTab} requires a city prediction. Go to Dashboard → select city → Predict.</div>
    </div>
    <button class="nc-toast-close" onclick="this.parentElement.remove()">✕</button>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(()=>{
    toast.classList.add('nc-toast-in');
    const card = document.getElementById('predictorCard');
    if(card){ card.classList.add('ppc-highlight'); setTimeout(()=>card.classList.remove('ppc-highlight'),1200); }
    // Navigate to dashboard safely
    if(attemptedTab !== 'predict') _origSetTab('dashboard');
  });
  setTimeout(()=>{
    if(toast.parentElement){ toast.classList.remove('nc-toast-in'); setTimeout(()=>{ if(toast.parentElement)toast.remove(); },400); }
  }, 4000);
}

function doExport(){
  const{t,a,p}=S.pred;
  const lines=[
    'SMARTCITY AI — INDIA URBAN INTELLIGENCE REPORT','═'.repeat(50),
    `Generated  : ${new Date().toLocaleString('en-IN')}`,
    `City       : ${S.city}`,
    `Year       : ${S.year}`,
    `ML Model   : ${S.model}`,
    `API Status : ${S.apiOk?'Connected':'Fallback Mode'}`,
    '',
    '── PREDICTIONS ──────────────────────────',
    `Population    : ${fmtIN(p)} (${p.toFixed(2)}M)`,
    `Traffic Index : ${t.toFixed(1)}`,
    `AQI           : ${a.toFixed(0)}`,
    `Green Cover   : ${greenIdx(S.city,S.year).toFixed(0)}`,
    '',
    '── FORECAST ─────────────────────────────',
    'Year   Traffic  AQI    Pop(M)',
    ...[2030,2040,2050,2060,2075,2100].map(y=>{
      const ft=fb(S.city,y,'traffic',S.model),fa=fb(S.city,y,'aqi',S.model),fp=fb(S.city,y,'population',S.model);
      return `${y}   ${ft.toFixed(1).padEnd(9)}${fa.toFixed(0).padEnd(7)}${fp.toFixed(2)}`;
    }),
    '','SmartCity AI · India Urban Intelligence · v4.0',
  ];
  const blob=new Blob([lines.join('\n')],{type:'text/plain'});
  const a2=document.createElement('a');a2.href=URL.createObjectURL(blob);a2.download=`SmartCity_${S.city}_${S.year}.txt`;a2.click();
}

/* CLOCK */
function updateClock(){
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const pad = n => String(n).padStart(2,'0');
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const timeEl = document.getElementById('clockTime');
  const dateEl = document.getElementById('clockDate');
  const ampmEl = document.getElementById('clockAmpm');
  if(timeEl) timeEl.textContent = pad(h12) + ':' + pad(m);
  if(ampmEl) ampmEl.textContent = ampm;
  if(dateEl) dateEl.textContent = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();
}
updateClock();
setInterval(updateClock, 30000);

// ── 2-Button Theme System ──
function setDarkMode(){
  document.documentElement.setAttribute('data-theme','dark');
  localStorage.setItem('sc-theme','dark');
  _syncThemeBtns('dark');
}
function setLightMode(){
  document.documentElement.setAttribute('data-theme','light');
  localStorage.setItem('sc-theme','light');
  _syncThemeBtns('light');
}
function _syncThemeBtns(theme){
  const bl=document.getElementById('btnLight');
  const bd=document.getElementById('btnDark');
  if(bl) bl.classList.toggle('active', theme==='light');
  if(bd) bd.classList.toggle('active', theme==='dark');
}
// Keep legacy toggleTheme for backward compat
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme')||'light';
  cur==='dark' ? setLightMode() : setDarkMode();
}
// Restore saved theme immediately
(function(){
  const saved=localStorage.getItem('sc-theme')||'light';
  document.documentElement.setAttribute('data-theme',saved);
  requestAnimationFrame(()=>_syncThemeBtns(saved));
})();


/* BOOT — bulletproof, never hangs */
const BOOT=['Loading city database...','Initialising ML models...','Ready ✓'];
let bi=0;
function finishBoot(){
  S.booted = true;
  // Hide boot screen first
  const boot = document.getElementById('boot');
  if(boot){
    boot.style.opacity = '0';
    boot.style.pointerEvents = 'none';
    setTimeout(()=>{ boot.style.display='none'; }, 500);
  }
  // Init map (safe - just clears iframe src)
  try{ initMap(); }catch(e){ console.warn('initMap',e); }
  // Init charts with a small delay to ensure DOM is visible
  setTimeout(()=>{
    try{ initCharts(); }catch(e){ console.warn('initCharts',e); }
  }, 100);
  // Reset all values to empty state
  resetDisplayToZero();
  // Check backend silently in background
  setTimeout(()=>{ apiFetch('/health').catch(()=>{}); }, 1500);
}
const bootTick=setInterval(()=>{
  const el=document.getElementById('bootLog');
  if(el) el.textContent=BOOT[bi]||'Ready ✓';
  bi++;
  if(bi>BOOT.length){ clearInterval(bootTick); finishBoot(); }
},380);

// ── Premium sidebar ripple effect ──
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = item.getBoundingClientRect();
    ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,.25);
      width:80px;height:80px;left:${e.clientX-rect.left-40}px;top:${e.clientY-rect.top-40}px;
      transform:scale(0);animation:rippleAnim .5s ease-out forwards;pointer-events:none;z-index:1;`;
    item.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleAnim{to{transform:scale(3);opacity:0;}}';
document.head.appendChild(rippleStyle);

// ── KPI card glow on hover ──
document.querySelectorAll('.kpi-card').forEach((card, i) => {
  const glows = ['rgba(124,58,237,.25)','rgba(99,102,241,.25)','rgba(34,197,94,.2)','rgba(249,115,22,.2)'];
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 16px 48px ${glows[i] || glows[0]}, inset 0 1px 0 rgba(255,255,255,.5)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

// ── SPA Tab transition — smooth fade+slide, zero flicker ──
let _lastTabIdx = 0;
const _tabOrder = ['dashboard','map','analytics','forecast','ai'];
const _origSetTab = setTab;
window.setTab = function(tab){
  const scroll = document.getElementById('scroll');
  const newIdx = _tabOrder.indexOf(tab);
  const dir    = newIdx > _lastTabIdx ? 1 : -1;
  const outEl  = document.querySelector('.pane.active, #pane-map.active');
  // Fade-out current pane
  if(outEl && outEl.id !== 'pane-map'){
    outEl.style.transition = 'opacity .18s ease, transform .18s ease';
    outEl.style.opacity    = '0';
    outEl.style.transform  = `translateY(${dir > 0 ? '-10px' : '10px'})`;
  }
  setTimeout(()=>{
    _lastTabIdx = newIdx;
    _origSetTab(tab);
    // Fade-in new pane
    requestAnimationFrame(()=>{
      const inEl = document.getElementById('pane-'+tab);
      if(inEl && tab !== 'map'){
        inEl.style.opacity   = '0';
        inEl.style.transform = `translateY(${dir > 0 ? '14px' : '-14px'})`;
        inEl.style.transition= 'none';
        requestAnimationFrame(()=>{
          inEl.style.transition = 'opacity .3s cubic-bezier(.16,1,.3,1), transform .3s cubic-bezier(.16,1,.3,1)';
          inEl.style.opacity    = '1';
          inEl.style.transform  = 'translateY(0)';
        });
      }
      if(scroll) scroll.scrollTop = 0;
    });
  }, outEl && outEl.id !== 'pane-map' ? 140 : 0);
};

// ── Smooth number counter for KPI values ──
function premiumCounter(el, target, formatter, dur) {
  if(!el) return;
  const start = parseFloat(el.getAttribute('data-raw') || '0') || 0;
  el.setAttribute('data-raw', target);
  const startTime = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - startTime) / dur);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = formatter(start + (target - start) * ease);
    if(p < 1) requestAnimationFrame(tick);
    else el.textContent = formatter(target);
  };
  requestAnimationFrame(tick);
}

// theme auto-applied above

// ── Profile dropdown ──
function toggleProfile(){
  const dd=document.getElementById('profileDropdown');
  const btn=document.getElementById('profileBtn');
  if(!dd)return;
  const open=dd.classList.toggle('open');
  if(btn){
    btn.classList.toggle('active',open);
  }
}
document.addEventListener('click',function(e){
  const wrap=document.getElementById('profileWrap');
  if(wrap&&!wrap.contains(e.target)){
    const dd=document.getElementById('profileDropdown');
    const btn=document.getElementById('profileBtn');
    if(dd) dd.classList.remove('open');
    if(btn) btn.classList.remove('active');
  }
});

