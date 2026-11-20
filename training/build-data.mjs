import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');

function read(rel){return fs.readFileSync(path.join(root,rel),'utf8')}
function readConst(rel,name){
  const context={};
  vm.runInNewContext(`${read(rel)}\n;globalThis.__value=${name};`,context,{filename:rel});
  return context.__value;
}
function readArray(rel,marker){
  const src=read(rel),start=src.indexOf(marker);
  if(start<0)throw new Error(`${marker} not found in ${rel}`);
  const open=src.indexOf('[',start);
  let depth=0,quote='',escaped=false,end=-1;
  for(let i=open;i<src.length;i++){
    const ch=src[i];
    if(quote){
      if(escaped)escaped=false;
      else if(ch==='\\')escaped=true;
      else if(ch===quote)quote='';
      continue;
    }
    if(ch==='\''||ch==='"'||ch==='`'){quote=ch;continue}
    if(ch==='[')depth++;
    if(ch===']'&&--depth===0){end=i+1;break}
  }
  if(end<0)throw new Error(`array end not found in ${rel}`);
  return vm.runInNewContext(`(${src.slice(open,end)})`,{}, {filename:rel});
}
function markerWords(paragraphs=[]){
  const words=[];
  for(const p of paragraphs){
    for(const m of p.matchAll(/\[\[([^\]]+)\]\]|\{\{([^}|]+)(?:\|[^}]+)?\}\}/g))words.push((m[1]||m[2]).trim());
  }
  return [...new Set(words)];
}
function normalize(c,topic){
  const paragraphs=(c.paragraphs||[c.story]).filter(Boolean);
  const source=(c.sources?.[0]||{});
  const images=[];
  if(c.image)images.push({src:`../${topic.slug}/${c.image}`,alt:c.imageAlt||c.articleTitle||c.title,caption:c.imageCaption||''});
  for(const [src,caption] of c.photos||[])images.push({src:`../${topic.slug}/${src}`,alt:caption.split('·')[0].trim(),caption});
  return {
    id:c.id||String(c.number||''),
    number:String(c.number||'').padStart(2,'0'),
    title:c.articleTitle||c.title,
    meta:c.meta||[c.publisher,c.date].filter(Boolean).join(' · ')||source.publisher||'',
    paragraphs,
    evidence:[...new Set([...(c.evidence||[]),...Object.keys(c.evidenceCues||{}),...markerWords(paragraphs)])],
    glossary:(c.glossary||[]).map(([word,meaning])=>[word,meaning]),
    note:c.caution||c.note||'',
    sourceUrl:c.source||c.url||source.url||'',
    sourceLabel:c.sourceTitle||source.label||c.publisher||'원문 기사',
    images,
    keyword:c.keyword||c.predictKeyword||'',
    question:c.question||c.predictionQuestion||'기사에서 어떤 사회 변화를 발견할 수 있을까요?'
  };
}

const topics=[
  {slug:'low-birth',folder:'',title:'저출산',color:'#e9ae32',cases:readConst('cases.js','CASES')},
  {slug:'aging',folder:'aging/',title:'고령화',color:'#5f75b8',cases:readConst('aging/cases.js','CASES')},
  {slug:'one-person-household',folder:'one-person-household/',title:'1인 가구',color:'#bd6b8f',cases:readConst('one-person-household/lesson-data.js','LESSON').cases},
  {slug:'pet-culture',folder:'pet-culture/',title:'반려동물 문화',color:'#6c985c',cases:readConst('pet-culture/lesson-data.js','LESSON').cases},
  {slug:'migrant-culture',folder:'migrant-culture/',title:'외국인 이주민 문화',color:'#bf684b',cases:readArray('migrant-culture/app.js','const CASES=')}
].map(topic=>({
  slug:topic.slug,title:topic.title,color:topic.color,
  appUrl:`../${topic.folder}`,
  cases:topic.cases.map(c=>normalize(c,topic))
}));

fs.writeFileSync(path.join(here,'data.js'),`const TRAINING_DATA=${JSON.stringify(topics,null,2)};\n`,'utf8');
console.log(`Wrote ${topics.reduce((n,t)=>n+t.cases.length,0)} article activities to training/data.js`);
