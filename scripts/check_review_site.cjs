// Functional smoke check of generated page routes in a minimal browser environment.
// Real browser/layout QA is still required; this catches render failures and broken internal refs.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root=path.resolve(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'dist/data.json'),'utf8'));
const elements = new Map();
function element(key){if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',style:{},hidden:true,value:'',addEventListener(){},focus(){},setAttribute(){},classList:{toggle(){return true}},showModal(){},close(){}});return elements.get(key);}
const context={console,Set,JSON,String,Object,Array,clearTimeout,setTimeout,location:{hash:''},localStorage:{getItem(){return '[]'},setItem(){}},document:{querySelector:element,querySelectorAll(){return []},addEventListener(){},getElementById(){return {scrollIntoView(){}}}},window:{scrollTo(){},addEventListener(){}},fetch:async()=>({ok:true,json:async()=>data})};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'web/app.js'),'utf8'),context);
setImmediate(()=>{
 let checked=0;
 for(const route of ['', '#learn','#explore','#gallery','#saved','#about','#credits','#search/paint',...data.chapters.map(x=>'#entry/'+x.id),...data.places.map(x=>'#entry/'+x.id),...data.details.map(x=>'#entry/'+x.id),...data.lessons.map(x=>'#entry/'+x.id)]){
  context.location.hash=route;vm.runInContext('route()',context);const html=element('#main').innerHTML;
  if(!html || /undefined|\[object Object\]/.test(html))throw new Error('Invalid rendered route: '+route);
  checked++;
 }
 const allRecords=new Set(['chapters','places','details','lessons'].flatMap(k=>data[k].map(r=>r.id)));
 for(const c of data.chapters){if(c.heroMediaId&&!data.media.some(m=>m.id===c.heroMediaId))throw new Error('Missing chapter hero: '+c.id);for(const id of c.relatedDetailIds)if(!allRecords.has(id))throw new Error('Missing related detail: '+id);}
 for(const m of data.media){if(!fs.existsSync(path.join(root,'dist',m.webPath)))throw new Error('Missing built image: '+m.id);if(!m.creator||!m.license||!m.sourcePage)throw new Error('Missing credit: '+m.id);}
 console.log(`Rendered ${checked} routes without errors; checked ${data.media.length} local images and chapter links. Browser layout remains unverified.`);
});
