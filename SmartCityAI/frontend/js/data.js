/**
 * data.js — City Database & Fallback ML Engine
 * SmartCity AI · India Urban Intelligence
 *
 * Exports (global): CITIES, ZONES, fb(), greenIdx()
 */

/* ══════════════ CITY DATABASE ══════════════ */
const CITIES = {
  Mumbai:       {lat:19.076, lng:72.877, p0:18.4, t0:68, a0:148, pr:.38, tr:.31, ar:.72},
  Delhi:        {lat:28.614, lng:77.209, p0:28.5, t0:82, a0:198, pr:.45, tr:.40, ar:1.05},
  Bangalore:    {lat:12.971, lng:77.594, p0:8.4,  t0:58, a0:62,  pr:.52, tr:.35, ar:.42},
  Hyderabad:    {lat:17.385, lng:78.486, p0:7.7,  t0:62, a0:75,  pr:.42, tr:.33, ar:.55},
  Chennai:      {lat:13.082, lng:80.270, p0:7.1,  t0:55, a0:78,  pr:.35, tr:.28, ar:.48},
  Kolkata:      {lat:22.572, lng:88.363, p0:14.8, t0:72, a0:145, pr:.22, tr:.25, ar:.85},
  Pune:         {lat:18.520, lng:73.856, p0:3.1,  t0:52, a0:68,  pr:.58, tr:.38, ar:.45},
  Ahmedabad:    {lat:23.022, lng:72.571, p0:6.0,  t0:60, a0:92,  pr:.40, tr:.32, ar:.62},
  Jaipur:       {lat:26.912, lng:75.787, p0:3.1,  t0:48, a0:88,  pr:.38, tr:.28, ar:.55},
  Surat:        {lat:21.170, lng:72.831, p0:4.6,  t0:50, a0:80,  pr:.50, tr:.30, ar:.50},
  Lucknow:      {lat:26.847, lng:80.947, p0:3.2,  t0:55, a0:140, pr:.40, tr:.32, ar:.90},
  Kanpur:       {lat:26.449, lng:80.331, p0:2.9,  t0:60, a0:155, pr:.28, tr:.30, ar:.95},
  Nagpur:       {lat:21.145, lng:79.088, p0:2.4,  t0:50, a0:78,  pr:.35, tr:.28, ar:.52},
  Bhopal:       {lat:23.259, lng:77.413, p0:1.9,  t0:48, a0:72,  pr:.38, tr:.26, ar:.48},
  Patna:        {lat:25.594, lng:85.137, p0:2.1,  t0:65, a0:165, pr:.42, tr:.35, ar:1.10},
  Vadodara:     {lat:22.307, lng:73.181, p0:1.7,  t0:46, a0:68,  pr:.42, tr:.28, ar:.44},
  Coimbatore:   {lat:11.001, lng:76.965, p0:1.1,  t0:44, a0:55,  pr:.35, tr:.24, ar:.38},
  Visakhapatnam:{lat:17.686, lng:83.218, p0:2.0,  t0:52, a0:72,  pr:.38, tr:.30, ar:.48},
  Indore:       {lat:22.719, lng:75.857, p0:2.2,  t0:54, a0:82,  pr:.45, tr:.32, ar:.55},
  Chandigarh:   {lat:30.733, lng:76.779, p0:1.1,  t0:42, a0:62,  pr:.28, tr:.22, ar:.40},
};

const ZONES=[
  {n:'Central Business', lo:.00, go:.00, tm:1.00,am:1.00,pm:1.00},
  {n:'North Residential', lo:.07, go:-.04, tm:.72,am:.78,pm:.85},
  {n:'Industrial Zone', lo:-.06,go:.08, tm:.65,am:1.40,pm:.55},
  {n:'South Area', lo:-.09,go:-.02, tm:.60,am:.72,pm:.70},
  {n:'East Tech Park', lo:.04, go:.11, tm:.82,am:.58,pm:1.10},
  {n:'West Suburbs', lo:.05, go:-.12,tm:.50,am:.48,pm:1.15},
  {n:'Airport Corridor', lo:.10, go:.09, tm:1.12,am:1.22,pm:.45},
  {n:'University Area', lo:-.04,go:-.10,tm:.78,am:.52,pm:.88},
  {n:'Medical Hub', lo:.02, go:-.07,tm:.88,am:.62,pm:.75},
  {n:'Heritage Zone', lo:-.03,go:.05, tm:.95,am:.85,pm:.92},
];


/* ══════════════ FALLBACK ML ══════════════ */
function fb(city,year,feat,model){
  const c=CITIES[city]||CITIES.Hyderabad, t=year-2000;
  let base,rate;
  if(feat==='traffic'){base=c.t0;rate=c.tr;}
  else if(feat==='aqi'){base=c.a0;rate=c.ar;}
  else{base=c.p0;rate=c.pr;}
  const n=(Math.random()-.5)*(model==='LR'?.015:.055);
  let v;
  if(model==='LR')v=base+rate*t+.002*t*t;
  else if(model==='RF'){const s=[1,1.2,1.5,1.3,1.1];v=base+rate*t*s[Math.min(4,Math.floor(t/20))]+.003*t*t;}
  else{const sig=1/(1+Math.exp(-.03*(t-40)));v=base+rate*t*(1+.4*sig)+.004*t*t;}
  return Math.max(0,v*(1+n));
}
function greenIdx(city,year){const c=CITIES[city];return Math.max(5,Math.min(65,38-(c.a0/10)-(Math.max(0,c.ar*.15)*(year-2000)/100)+(Math.random()*3)));}

