/**
 * map.js — Google Maps Embed + Explorer
 * SmartCity AI · India Urban Intelligence
 *
 * Features: City map, overlays (traffic/AQI/street view/transit),
 *           Explorer bar with Wikipedia photos, Place modal
 *
 * CITY_COORDS — city centre lat/lng
 * PLACE_DB    — famous places with Wikipedia photos
 */

/* ══════════════ MAP — REAL GOOGLE MAPS ══════════════ */

// City centre coordinates
const CITY_COORDS = {
  Mumbai:{la:19.0760,lo:72.8777},Delhi:{la:28.6139,lo:77.2090},
  Bangalore:{la:12.9716,lo:77.5946},Hyderabad:{la:17.3850,lo:78.4867},
  Chennai:{la:13.0827,lo:80.2707},Kolkata:{la:22.5726,lo:88.3639},
  Pune:{la:18.5204,lo:73.8567},Ahmedabad:{la:23.0225,lo:72.5714},
  Jaipur:{la:26.9124,lo:75.7873},Surat:{la:21.1702,lo:72.8311},
  Lucknow:{la:26.8467,lo:80.9462},Nagpur:{la:21.1458,lo:79.0882},
};

// Famous places with Wikipedia Commons images
const PLACE_DB = {
  Mumbai:[
    {n:'Gateway of India',t:'Monument',e:'🏛️',c:'#1a73e8',la:18.9220,lo:72.8347,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Gateway_of_India_2019.jpg/400px-Gateway_of_India_2019.jpg'},
    {n:'Marine Drive',t:'Promenade',e:'🌊',c:'#0891b2',la:18.9438,lo:72.8231,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Marine_Drive%2C_Mumbai.jpg/400px-Marine_Drive%2C_Mumbai.jpg'},
    {n:'CST Station',t:'Heritage',e:'🚂',c:'#d97706',la:18.9398,lo:72.8354,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Mumbai_CST_%28Victoria_Terminus%29.jpg/400px-Mumbai_CST_%28Victoria_Terminus%29.jpg'},
    {n:'Elephanta Caves',t:'UNESCO',e:'🗿',c:'#7c3aed',la:18.9633,lo:72.9315,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Elephanta_Caves_-_Maharashtra_-_India.jpg/400px-Elephanta_Caves_-_Maharashtra_-_India.jpg'},
    {n:'Siddhivinayak',t:'Temple',e:'🛕',c:'#dc2626',la:19.0170,lo:73.0283,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Siddhivinayak_Temple%2C_Mumbai_%28cropped%29.jpg/400px-Siddhivinayak_Temple%2C_Mumbai_%28cropped%29.jpg'},
    {n:'Haji Ali Dargah',t:'Mosque',e:'🕌',c:'#16a34a',la:18.9823,lo:72.8092,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Haji_Ali_Dargah_Mumbai.jpg/400px-Haji_Ali_Dargah_Mumbai.jpg'},
  ],
  Delhi:[
    {n:'Red Fort',t:'Heritage',e:'🏰',c:'#dc2626',la:28.6562,lo:77.2410,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/India_-_Delhi_-_049_-_Red_Fort_%283783953088%29.jpg/280px-India_-_Delhi_-_049_-_Red_Fort_%283783953088%29.jpg'},
    {n:'India Gate',t:'Monument',e:'🏛️',c:'#1a73e8',la:28.6129,lo:77.2295,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/India_Gate_in_New_Delhi_03-2016.jpg/400px-India_Gate_in_New_Delhi_03-2016.jpg'},
    {n:'Qutub Minar',t:'UNESCO',e:'🗼',c:'#d97706',la:28.5245,lo:77.1855,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Qtub1.jpg/400px-Qtub1.jpg'},
    {n:'Lotus Temple',t:'Temple',e:'🌸',c:'#ec4899',la:28.5535,lo:77.2588,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Lotus_temple%2C_Delhi.jpg/400px-Lotus_temple%2C_Delhi.jpg'},
    {n:"Humayun's Tomb",t:'UNESCO',e:'🕌',c:'#7c3aed',la:28.5933,lo:77.2507,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Humayuns_Tomb_2.jpg/400px-Humayuns_Tomb_2.jpg'},
    {n:'Akshardham',t:'Temple',e:'🛕',c:'#f59e0b',la:28.6127,lo:77.2773,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Akshardham_temple.jpg/400px-Akshardham_temple.jpg'},
  ],
  Hyderabad:[
    {n:'Charminar',t:'Monument',e:'🕌',c:'#dc2626',la:17.3616,lo:78.4747,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Charminar%2C_Hyderabad.jpg/400px-Charminar%2C_Hyderabad.jpg'},
    {n:'Golconda Fort',t:'Heritage',e:'🏰',c:'#d97706',la:17.3833,lo:78.4011,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Golkonda_fort.jpg/400px-Golkonda_fort.jpg'},
    {n:'Hussain Sagar',t:'Lake',e:'🌊',c:'#0891b2',la:17.4260,lo:78.4740,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Buddha_Statue%2C_Hussain_Sagar%2C_Hyderabad.jpg/400px-Buddha_Statue%2C_Hussain_Sagar%2C_Hyderabad.jpg'},
    {n:'Ramoji Film City',t:'Studio',e:'🎬',c:'#7c3aed',la:17.2533,lo:78.6803,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Ramoji_Film_City.jpg/400px-Ramoji_Film_City.jpg'},
    {n:'Salar Jung Museum',t:'Museum',e:'🏛️',c:'#1a73e8',la:17.3700,lo:78.4800,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Salar_Jung_Museum_Hyderabad.jpg/400px-Salar_Jung_Museum_Hyderabad.jpg'},
    {n:'Birla Mandir',t:'Temple',e:'🛕',c:'#16a34a',la:17.4100,lo:78.4560,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Birla_Mandir%2C_Hyderabad.jpg/400px-Birla_Mandir%2C_Hyderabad.jpg'},
  ],
  Bangalore:[
    {n:'Lalbagh Garden',t:'Garden',e:'🌸',c:'#16a34a',la:12.9500,lo:77.5850,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Lalbagh_Botanical_Garden_Bangalore.jpg/280px-Lalbagh_Botanical_Garden_Bangalore.jpg'},
    {n:'Bangalore Palace',t:'Heritage',e:'🏰',c:'#d97706',la:12.9990,lo:77.5920,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bangalore_palace_front.jpg/280px-Bangalore_palace_front.jpg'},
    {n:'Vidhana Soudha',t:'Govt',e:'🏛️',c:'#1a73e8',la:12.9790,lo:77.5910,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Vidhana_Soudha_Bangalore.jpg/280px-Vidhana_Soudha_Bangalore.jpg'},
    {n:'Cubbon Park',t:'Park',e:'🌳',c:'#16a34a',la:12.9770,lo:77.5960,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Cubbon_park_bangalore_2007.jpg/280px-Cubbon_park_bangalore_2007.jpg'},
    {n:'ISKCON Temple',t:'Temple',e:'🛕',c:'#dc2626',la:13.0100,lo:77.5500,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/ISKCON_temple_Bangalore.jpg/280px-ISKCON_temple_Bangalore.jpg'},
  ],
  Chennai:[
    {n:'Marina Beach',t:'Beach',e:'🏖️',c:'#0891b2',la:13.0500,lo:80.2820,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Marina_Beach_2_pjt.jpg/280px-Marina_Beach_2_pjt.jpg'},
    {n:'Kapaleeshwarar Temple',t:'Temple',e:'🛕',c:'#dc2626',la:13.0330,lo:80.2690,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Kapaleeshwarar_temple.jpg/280px-Kapaleeshwarar_temple.jpg'},
    {n:'Fort St George',t:'Heritage',e:'🏰',c:'#d97706',la:13.0800,lo:80.2870,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Fort_Saint_George%2C_Chennai.jpg/280px-Fort_Saint_George%2C_Chennai.jpg'},
    {n:'Government Museum',t:'Museum',e:'🏛️',c:'#7c3aed',la:13.0640,lo:80.2540,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Government_Museum_Chennai.jpg/280px-Government_Museum_Chennai.jpg'},
  ],
  Kolkata:[
    {n:'Victoria Memorial',t:'Monument',e:'🏛️',c:'#1a73e8',la:22.5448,lo:88.3426,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/The_Victoria_Memorial%2C_Kolkata.jpg/280px-The_Victoria_Memorial%2C_Kolkata.jpg'},
    {n:'Howrah Bridge',t:'Bridge',e:'🌉',c:'#d97706',la:22.5855,lo:88.3463,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Howrah_bridge_from_bow.jpg/280px-Howrah_bridge_from_bow.jpg'},
    {n:'Dakshineswar Temple',t:'Temple',e:'🛕',c:'#dc2626',la:22.6550,lo:88.3578,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Dakshineswar_Kali_Temple.jpg/280px-Dakshineswar_Kali_Temple.jpg'},
    {n:'Indian Museum',t:'Museum',e:'🏛️',c:'#7c3aed',la:22.5584,lo:88.3522,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Indian_Museum_Kolkata.jpg/280px-Indian_Museum_Kolkata.jpg'},
  ],
  Pune:[
    {n:'Shaniwar Wada',t:'Fort',e:'🏰',c:'#dc2626',la:18.5190,lo:73.8550,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Shaniwar_Wada_Gate.jpg/280px-Shaniwar_Wada_Gate.jpg'},
    {n:'Aga Khan Palace',t:'Heritage',e:'🏛️',c:'#d97706',la:18.5520,lo:73.9020,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Aga_Khan_Palace_Pune.jpg/280px-Aga_Khan_Palace_Pune.jpg'},
    {n:'Sinhagad Fort',t:'Fort',e:'⛰️',c:'#16a34a',la:18.3660,lo:73.7550,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sinhagad.jpg/280px-Sinhagad.jpg'},
  ],
  Ahmedabad:[
    {n:'Sabarmati Ashram',t:'Heritage',e:'🏛️',c:'#1a73e8',la:23.0620,lo:72.5800,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Sabarmati_Ashram.jpg/280px-Sabarmati_Ashram.jpg'},
    {n:'Adalaj Stepwell',t:'Heritage',e:'🏰',c:'#d97706',la:23.1680,lo:72.5800,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Adalaj_vav_%2810%29.jpg/280px-Adalaj_vav_%2810%29.jpg'},
    {n:'Kankaria Lake',t:'Lake',e:'🌊',c:'#0891b2',la:22.9890,lo:72.6000,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Kankaria_Ahmedabad_Lake.jpg/280px-Kankaria_Ahmedabad_Lake.jpg'},
  ],
  Jaipur:[
    {n:'Hawa Mahal',t:'Monument',e:'🏰',c:'#ea580c',la:26.9239,lo:75.8267,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Hawa_Mahal_Jaipur.jpg/280px-Hawa_Mahal_Jaipur.jpg'},
    {n:'Amber Fort',t:'Fort',e:'🏰',c:'#d97706',la:26.9855,lo:75.8513,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Amer_Fort%2C_Jaipur%2C_India.jpg/280px-Amer_Fort%2C_Jaipur%2C_India.jpg'},
    {n:'City Palace',t:'Palace',e:'👑',c:'#dc2626',la:26.9258,lo:75.8237,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/City_Palace_Jaipur.jpg/280px-City_Palace_Jaipur.jpg'},
    {n:'Jantar Mantar',t:'UNESCO',e:'⭐',c:'#1a73e8',la:26.9247,lo:75.8247,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Jantar_Mantar%2C_Jaipur.jpg/280px-Jantar_Mantar%2C_Jaipur.jpg'},
  ],
  Surat:[
    {n:'Surat Castle',t:'Heritage',e:'🏰',c:'#d97706',la:21.1950,lo:72.8240,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Surat_Castle.jpg/280px-Surat_Castle.jpg'},
    {n:'Dumas Beach',t:'Beach',e:'🏖️',c:'#0891b2',la:21.0590,lo:72.7080,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Dumas_Beach%2C_Surat.jpg/280px-Dumas_Beach%2C_Surat.jpg'},
    {n:'Gopi Talav',t:'Lake',e:'🌊',c:'#16a34a',la:21.1700,lo:72.8310,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Gopi_Talav.jpg/280px-Gopi_Talav.jpg'},
  ],
  Lucknow:[
    {n:'Bara Imambara',t:'Heritage',e:'🕌',c:'#d97706',la:26.8699,lo:80.9122,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Lucknow_bara_imambara.jpg/280px-Lucknow_bara_imambara.jpg'},
    {n:'Rumi Darwaza',t:'Monument',e:'🏛️',c:'#dc2626',la:26.8697,lo:80.9102,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Rumi_Gate.jpg/280px-Rumi_Gate.jpg'},
    {n:'Hazratganj',t:'Market',e:'🛍️',c:'#ea580c',la:26.8502,lo:80.9489,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Hazratganj.jpg/280px-Hazratganj.jpg'},
  ],
  Nagpur:[
    {n:'Deekshabhoomi',t:'Monument',e:'🏛️',c:'#1a73e8',la:21.1367,lo:79.0760,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Deekshabhoomi.jpg/280px-Deekshabhoomi.jpg'},
    {n:'Ambazari Lake',t:'Lake',e:'🌊',c:'#0891b2',la:21.1400,lo:79.0300,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Ambazari_lake.jpg/280px-Ambazari_lake.jpg'},
    {n:'Sitabulldi Fort',t:'Heritage',e:'🏰',c:'#d97706',la:21.1458,lo:79.0882,img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Sitabuldi_Fort.jpg/280px-Sitabuldi_Fort.jpg'},
  ],
};

// Current map state
let gmapType = 'default';        // default | satellite | terrain
let gmapOverlays = new Set();    // active overlays

// Build Google Maps embed URL
// Google Maps embed pb format: typeCode 0=roads 1=satellite 2=terrain
function buildGmapURL(la, lo, zoom, type) {
  zoom = zoom || 13;
  const typeCode = type==='satellite' ? 1 : type==='terrain' ? 2 : 0;
  const d = Math.round(14000 / (zoom / 12));
  const ts = Date.now();
  return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${d}!2d${lo}!3d${la}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e${typeCode}!3m2!1sen!2sin!4v${ts}!5m2!1sen!2sin`;
}

function buildGmapURLForPlace(la, lo) {
  const d = 1800;
  const ts = Date.now();
  return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${d}!2d${lo}!3d${la}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v${ts}!5m2!1sen!2sin`;
}

// Street View URL — uses Google Maps /maps?q= format which opens in street view mode
function buildStreetViewURL(la, lo, heading) {
  heading = heading || 0;
  const ts = Date.now();
  // The !5e4 flag activates Street View panorama mode in Google embed
  return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${lo}!3d${la}!2m3!1f${heading}!2f10!3f0!3m2!1i1024!2i768!4f90!5e4!3m2!1sen!2sin!4v${ts}!5m2!1sen!2sin`;
}

function loadGmap(city) {
  const c = CITY_COORDS[city] || CITY_COORDS.Hyderabad;
  const sub = document.getElementById('loadingCitySub');
  if(sub) sub.textContent = 'Opening ' + city + ' map…';
  const ld = document.getElementById('gmapLoading');
  if(ld) ld.classList.remove('hidden');
  const el = document.getElementById('gmap-iframe');
  if(!el) return;
  if(gmapOverlays.has('streetview')) {
    el.src = buildStreetViewURL(c.la, c.lo, 0);
  } else {
    el.src = buildGmapURL(c.la, c.lo, 13, gmapType);
  }
  buildExplorer(city);
  updateAIPanel();
}

function onGmapLoad() {
  const ld = document.getElementById('gmapLoading');
  if(ld) ld.classList.add('hidden');
}

// Switch map type (Default/Satellite/Terrain)
function switchMapType(type) {
  gmapType = type;
  document.querySelectorAll('.mtype-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('mt-' + type);
  if(btn) btn.classList.add('active');
  // If street view is active, keep it — otherwise switch base map
  if(!gmapOverlays.has('streetview')) {
    const c = CITY_COORDS[S.city] || CITY_COORDS.Hyderabad;
    const ld = document.getElementById('gmapLoading');
    if(ld) ld.classList.remove('hidden');
    const el = document.getElementById('gmap-iframe');
    if(el) el.src = buildGmapURL(c.la, c.lo, 13, type);
  }
}

// Toggle overlay — reloads map and shows info panel
function toggleMapOverlay(ovId) {
  const btn = document.getElementById('ov-' + ovId);
  const statusEl = document.getElementById('ov-' + ovId + '-s');
  if(gmapOverlays.has(ovId)) {
    // Turn OFF
    gmapOverlays.delete(ovId);
    if(btn) btn.classList.remove('active');
    if(statusEl) statusEl.textContent = 'OFF';
    closeOverlayInfo();
    // Return to normal map
    const c = CITY_COORDS[S.city] || CITY_COORDS.Hyderabad;
    const el = document.getElementById('gmap-iframe');
    const ld = document.getElementById('gmapLoading');
    if(ld) ld.classList.remove('hidden');
    if(el) el.src = buildGmapURL(c.la, c.lo, 13, gmapType);
  } else {
    // Turn OFF other exclusive overlays (traffic <-> airquality exclusive)
    if(ovId === 'traffic' || ovId === 'airquality') {
      ['traffic','airquality'].forEach(id => {
        if(id !== ovId && gmapOverlays.has(id)) {
          gmapOverlays.delete(id);
          const b = document.getElementById('ov-' + id);
          const s = document.getElementById('ov-' + id + '-s');
          if(b) b.classList.remove('active');
          if(s) s.textContent = 'OFF';
        }
      });
    }
    // Turn ON
    gmapOverlays.add(ovId);
    if(btn) btn.classList.add('active');
    if(statusEl) statusEl.classList.add('on');
    showOverlayInfo(ovId);
    // Load appropriate map view
    const c = CITY_COORDS[S.city] || CITY_COORDS.Hyderabad;
    const el = document.getElementById('gmap-iframe');
    const ld = document.getElementById('gmapLoading');
    if(ld) ld.classList.remove('hidden');
    if(!el) return;
    if(ovId === 'streetview') {
      el.src = buildStreetViewURL(c.la, c.lo, 0);
    } else if(ovId === 'satellite') {
      el.src = buildGmapURL(c.la, c.lo, 14, 'satellite');
    } else {
      // For traffic/airquality/transit — use satellite base at higher zoom to see roads clearly
      el.src = buildGmapURL(c.la, c.lo, 14, ovId==='transit'?gmapType:'satellite');
    }
  }
}

// Show overlay info panel at bottom
function showOverlayInfo(ovId) {
  const panel = document.getElementById('overlay-info');
  const iconEl = document.getElementById('oi-icon');
  const titleEl = document.getElementById('oi-title-text');
  const legendEl = document.getElementById('oi-legend');
  const toggleLbl = document.getElementById('oi-toggle-label');
  if(!panel) return;
  const t = fb(S.city, S.year, 'traffic', S.model);
  const a = fb(S.city, S.year, 'aqi', S.model);
  const configs = {
    traffic: {
      icon:'🚦', title:'Live Traffic',
      legend:[
        {c:'#27ae60',w:true,l:'Free Flow (< 40 index)'},
        {c:'#f1c40f',w:true,l:'Slow (40–65 index)'},
        {c:'#e67e22',w:true,l:'Congested (65–85)'},
        {c:'#c0392b',w:true,l:'Standstill (> 85)'},
      ],
      extra:`<div style="margin-top:8px;padding:8px 10px;background:#f8fafc;border-radius:6px;font-size:11.5px;">
        <b>Current forecast:</b> Traffic index <b style="color:${t>80?'#dc2626':t>55?'#e67e22':'#16a34a'}">${t.toFixed(0)}</b> — ${t>80?'Heavy traffic expected':'Moderate flow'}<br/>
        Peak hours: 8–10 AM &amp; 5–8 PM | <b>${Math.round(t*0.6)}% roads</b> above normal load
      </div>`,
      toggle:'Real-time traffic data active'
    },
    airquality: {
      icon:'💨', title:'Air Quality Index',
      legend:[
        {c:'#00e400',b:true,l:'Good — AQI 0–50'},
        {c:'#ffff00',b:true,l:'Moderate — AQI 51–100'},
        {c:'#ff7e00',b:true,l:'Unhealthy (Sensitive) 101–150'},
        {c:'#ff0000',b:true,l:'Unhealthy — AQI 151–200'},
        {c:'#8f3f97',b:true,l:'Very Unhealthy 201–300'},
        {c:'#7e0023',b:true,l:'Hazardous — AQI 300+'},
      ],
      extra:`<div style="margin-top:8px;padding:8px 10px;background:#f8fafc;border-radius:6px;font-size:11.5px;">
        <b>Predicted AQI ${S.year}:</b> <b style="color:${a>200?'#8f3f97':a>150?'#ff0000':a>100?'#ff7e00':a>50?'#ca8a04':'#16a34a'}">${a.toFixed(0)}</b> 
        — ${a>200?'Hazardous':a>150?'Very Unhealthy':a>100?'Unhealthy':a>50?'Moderate':'Good'}<br/>
        Primary sources: vehicles, industry, construction dust
      </div>`,
      toggle:'Air quality layer active'
    },
    streetview: {
      icon:'🧍', title:'Street View',
      legend:[
        {c:'#1a73e8',w:true,l:'Street View coverage'},
        {c:'#9aa0a6',w:true,b:false,l:'Photo Path (dashed)'},
        {c:'#60a5fa',b:true,l:'360° Photo Sphere'},
      ],
      extra:`<div style="margin-top:8px;padding:8px 10px;background:#eff6ff;border-radius:6px;font-size:11.5px;color:#1e3a8a;">
        📍 Street View loaded for <b>${S.city} city centre</b>.<br/>
        Click <b>Explorer cards below</b> to visit famous places in Street View.
      </div>`,
      toggle:'Street View imagery active'
    },
    transit: {
      icon:'🚇', title:'Public Transit',
      legend:[
        {c:'#1a73e8',w:true,l:'Metro / Subway Line'},
        {c:'#f59e0b',w:true,l:'Bus Rapid Transit'},
        {c:'#6b7280',w:true,l:'Suburban Rail'},
        {c:'#16a34a',b:true,l:'Station / Stop'},
      ],
      extra:`<div style="margin-top:8px;padding:8px 10px;background:#f8fafc;border-radius:6px;font-size:11.5px;">
        Click on station markers for departure times &amp; route info.
      </div>`,
      toggle:'Transit layer active'
    },
  };
  const cfg = configs[ovId];
  if(!cfg) return;
  if(iconEl) iconEl.textContent = cfg.icon;
  if(titleEl) titleEl.textContent = cfg.title;
  if(legendEl) legendEl.innerHTML = cfg.legend.map(item =>
    item.w
      ? `<div class="oi-legend-item"><div class="oi-swatch" style="background:${item.c}"></div>${item.l}</div>`
      : `<div class="oi-legend-item"><div class="oi-badge" style="background:${item.c}"></div>${item.l}</div>`
  ).join('') + (cfg.extra||'');
  if(toggleLbl) toggleLbl.textContent = cfg.toggle;
  const sw = document.getElementById('oi-switch');
  if(sw) sw.classList.remove('off');
  panel.classList.add('visible');
}

function closeOverlayInfo() {
  const panel = document.getElementById('overlay-info');
  if(panel) panel.classList.remove('visible');
}

function toggleOiSwitch() {
  const sw = document.getElementById('oi-switch');
  if(sw) sw.classList.toggle('off');
}

// Update AI prediction panel
function updateAIPanel() {
  const t = fb(S.city, S.year, 'traffic',    S.model);
  const a = fb(S.city, S.year, 'aqi',        S.model);
  const p = fb(S.city, S.year, 'population', S.model);
  const tP = Math.min(100, t/1.5).toFixed(0);
  const aP = Math.min(100, a/3.5).toFixed(0);
  const pP = Math.min(100, p*3).toFixed(0);
  const _s = (id, v) => { const e=document.getElementById(id); if(e) e.textContent=v; };
  const _w = (id, v) => { const e=document.getElementById(id); if(e) e.style.width=v+'%'; };
  _s('ghud-city',S.city); _s('ghud-year',S.year); _s('ghud-model',S.model);
  _s('ghud-pop',p.toFixed(2)+'M'); _s('ghud-traf',t.toFixed(1)); _s('ghud-aqi',a.toFixed(0));
  _s('aip-year',S.year);
  _s('aip-t', tP+'%');  _w('aip-tb', tP);
  _s('aip-a', aP+'%');  _w('aip-ab', aP);
  _s('aip-p', pP+'%');  _w('aip-pb', pP);
  ['lstm','rf','lr'].forEach(m => {
    const e = document.getElementById('aip-'+m);
    if(e) e.classList.toggle('active', m.toUpperCase()===S.model);
  });
  // Update sidebar KPIs (null-safe)
  const gi = Math.max(5,Math.min(65,38-a/10)).toFixed(0);
  const fI = v => Math.round(v*1e6).toLocaleString('en-IN');
  [['kv-pop',fI(p)],['kv-veh',Math.round(t*18000).toLocaleString('en-IN')],['kv-gc',gi],['kv-ti',a.toFixed(0)]].forEach(([id,v])=>_s(id,v));
  const _se=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  _se('mhud-city',S.city);_se('mhud-year',S.year);_se('mhud-model',S.model);
  _se('mhud-pop',p.toFixed(2)+'M');_se('mhud-traf',t.toFixed(1));_se('mhud-aqi',a.toFixed(0));
  // Status bar
  [['st-city',S.city],['st-year',S.year],['st-model',S.model]].forEach(([id,v])=>_s(id,v));
  // Refresh overlay info if open
  const activeOv = [...gmapOverlays][0];
  if(activeOv && document.getElementById('overlay-info')?.classList.contains('visible')) {
    showOverlayInfo(activeOv);
  }
}

// Explorer bar — famous places with real images
function buildExplorer(city) {
  const wrap  = document.getElementById('expScroll');
  const title = document.getElementById('expTitle');
  if(!wrap) return;
  if(title) title.textContent = (city||'City') + ' Explorer';
  const places = PLACE_DB[city] || [];
  wrap.innerHTML = '';
  if(!places.length) {
    wrap.innerHTML = `<div style="color:#8e8e93;font-size:12px;padding:0 20px;white-space:nowrap;align-self:center;">No places for ${city}</div>`;
    return;
  }
  places.forEach(p => {
    const card = document.createElement('div');
    card.className = 'exp-card';
    card.title = p.n + ' — click to visit on map';
    card.onclick = () => visitPlace(p);
    // Use a <div> background-image instead of <img> — avoids CORS/crossorigin block
    // Fallback to emoji+color if image fails
    const safeImg = p.img.replace(/'/g,"\\'");
    const safeColor = p.c;
    card.innerHTML = `
      <div class="exp-card-img" id="expimg-${p.n.replace(/\W/g,'')}"
        style="background-image:url('${safeImg}');background-size:cover;background-position:center;width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
        <span class="exp-card-emoji" style="display:none;font-size:40px">${p.e}</span>
      </div>
      <div class="exp-card-type">📷 ${p.t}</div>
      <div class="exp-card-lbl">${p.n}</div>`;
    // Test if image loads — if not, show emoji
    const tester = new Image();
    tester.onload = () => {}; // image loads fine, background-image will show it
    tester.onerror = () => {
      const bg = card.querySelector('.exp-card-img');
      const emoji = card.querySelector('.exp-card-emoji');
      if(bg) { bg.style.backgroundImage = 'none'; bg.style.background = `linear-gradient(135deg,${safeColor},${safeColor}88)`; }
      if(emoji) emoji.style.display = 'block';
    };
    tester.src = p.img;
    wrap.appendChild(card);
  });
}

// Visit a place — zooms Google Map to that place
function visitPlace(p) {
  const ld = document.getElementById('gmapLoading');
  const el = document.getElementById('gmap-iframe');
  if(!el) return;
  if(ld) ld.classList.remove('hidden');
  const sub = document.getElementById('loadingCitySub');
  if(sub) sub.textContent = 'Opening ' + p.n + '…';
  if(gmapOverlays.has('streetview')) {
    // Show Street View at this specific place location
    el.src = buildStreetViewURL(p.la, p.lo, 90);
  } else {
    el.src = buildGmapURLForPlace(p.la, p.lo);
  }
}

function expL() { const e=document.getElementById('expScroll'); if(e) e.scrollBy({left:-360,behavior:'smooth'}); }
function expR() { const e=document.getElementById('expScroll'); if(e) e.scrollBy({left:360, behavior:'smooth'}); }

function initMap() {
  // Don't load map until city is selected
  const ld = document.getElementById('gmapLoading');
  if(ld) ld.classList.add('hidden');
  // Show empty state
  const iframe = document.getElementById('gmap-iframe');
  if(iframe) iframe.src = '';
}
async function refreshMap() { loadGmap(S.city); updateAIPanel(); }

// Stubs for removed Leaflet functions
function setBaseMap(){}
function toggleOverlay(){}
function toggleLayersPanel(){}
function toggleLabels(){}
function applyHudStyle(){}
function updateLegend(){}
function updateOverlayInfo(){}
function redrawOverlays(){}
function riskClr(s){return s>75?'#dc2626':s>55?'#d97706':s>35?'#1a56db':'#16a34a';}

