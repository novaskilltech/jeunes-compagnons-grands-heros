// Génération A5 autonome depuis le manuscrit Markdown. Aucun service externe.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { deflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const text = readFileSync(join(root, 'manuscrit.md'), 'utf8');
const dest = join(root, 'dist', 'assets', 'livre.pdf');
const W = 419.528, H = 595.276, ML = 37, MR = 36, MT = 43, MB = 42;
const GREEN = [0.047,0.185,0.164], GOLD = [0.77,0.58,0.32], INK=[0.12,0.17,0.16];
let pages=[], page=null, y=H-MT;
const fmt=n=>Number(n).toFixed(2);
function mapLatin(s){return s.replaceAll('ﷺ','(paix et salut sur lui)').replaceAll('ā','a').replaceAll('ī','i').replaceAll('ū','u').replaceAll('ʿ',"'").replaceAll('ʾ',"'").replaceAll('–','-').replaceAll('—',' - ').replaceAll('→',' -> ').replaceAll('✅','•').replaceAll('📖','').replaceAll('📚','').replaceAll('·','·');}
const special = {'€':128,'‚':130,'ƒ':131,'„':132,'…':133,'†':134,'‡':135,'ˆ':136,'‰':137,'Š':138,'‹':139,'Œ':140,'Ž':142,'‘':145,'’':146,'“':147,'”':148,'•':149,'–':150,'—':151,'˜':152,'™':153,'š':154,'›':155,'œ':156,'ž':158,'Ÿ':159};
function pdfStr(s){s=mapLatin(s);let out=''; for(const ch of s){const c=ch.codePointAt(0), k=c<128?c:c>=160&&c<=255?c:special[ch]; if(k===undefined){out+='?';continue;} if(k===40||k===41||k===92)out+='\\'+String.fromCharCode(k);else if(k<32||k>=127)out+='\\'+k.toString(8).padStart(3,'0');else out+=String.fromCharCode(k);} return out;}
function rgb(c){return c.map(fmt).join(' ')+' rg';}
function draw(s,x,y,sz=9.5,bold=false,color=INK){page.commands.push(`BT ${rgb(color)} /F${bold?2:1} ${fmt(sz)} Tf 1 0 0 1 ${fmt(x)} ${fmt(y)} Tm (${pdfStr(s)}) Tj ET`);}
function rect(x,y,w,h,c){page.commands.push(`${rgb(c)} ${fmt(x)} ${fmt(y)} ${fmt(w)} ${fmt(h)} re f`);}
function line(x,y,x2,y2,c=GOLD,thick=0.75){page.commands.push(`${c.map(fmt).join(' ')} RG ${fmt(thick)} w ${fmt(x)} ${fmt(y)} m ${fmt(x2)} ${fmt(y2)} l S`)}
function newPage(isCover=false){page={commands:[],isCover}; pages.push(page);y=H-MT;if(!isCover){line(ML,H-30,W-MR,H-30); draw('INSTITUT DE L\'EXCELLENCE',ML,H-23,7,false,GREEN);}}
function weighted(s,sz){let v=0;for(const c of mapLatin(s)){ if(' il.,:;!|\'`'.includes(c))v+=.27; else if('mwMW%QO'.includes(c))v+=.82; else if(c===' ')v+=.29;else if(c===c.toUpperCase())v+=.65;else v+=.49; }return v*sz}
function linesOf(str,maxW,sz){let words=str.trim().split(/\s+/), lines=[],current='';for(const w of words){let test=current?current+' '+w:w;if(weighted(test,sz)<=maxW){current=test;continue;}if(current)lines.push(current);current=w;while(weighted(current,sz)>maxW&&current.length>1){let cut=Math.max(1,Math.floor(current.length*maxW/weighted(current,sz)));lines.push(current.slice(0,cut));current=current.slice(cut);}}if(current)lines.push(current);return lines;}
function ensure(height){if(y-height<MB)newPage();}
function paragraph(s,{size=9.6,leading=13.6,color=INK,bold=false,indent=0,above=0,below=8}={}){ if(!s.trim())return; y-=above;const width=W-ML-MR-indent;for(const l of linesOf(s,width,size)){ensure(leading);draw(l,ML+indent,y,size,bold,color);y-=leading;}y-=below;}
function title(s,level){let size=level===1?17:level===2?12.3:10.5;let leading=size+4;let above=level===1?12:level===2?10:6;let below=level===1?14:7; if(level===1&&pages.length>2&&y<H-MT-30) newPage(); ensure(size*3); y-=above;for(const l of linesOf(s,W-ML-MR,size)){draw(l,ML,y,size,true,GREEN);y-=leading;}if(level===1)line(ML,y+5,ML+135,y+5);y-=below;}
function cover(){newPage(true);rect(0,0,W,H,GREEN);line(25,H-26,W-25,H-26,GOLD,1.3);line(25,26,W-25,26,GOLD,1.3);draw('INSTITUT DE L\'EXCELLENCE',72,H-85,14,true,[0.96,0.82,0.55]);draw('JEUNES COMPAGNONS,',39,H-215,22,true,[1,1,1]);draw('GRANDS HÉROS',54,H-255,28,true,[0.96,0.82,0.55]);line(45,H-278,W-45,H-278,GOLD);draw('Huit parcours de foi, de science',77,H-324,11,false,[1,1,1]);draw('et de caractère',163,H-344,11,false,[1,1,1]);draw('Nouvelle édition commentée et enrichie',66,H-442,11,true,[0.96,0.82,0.55]);draw('Novembre 2026  •  Collection « Héritages et modèles »',42,52,7.8,false,[0.9,0.89,0.78]);}
cover();newPage(); title('Sommaire',1);
for (const m of text.matchAll(/^# ([1-8]) — (.+)$/gm)) {paragraph(`${m[1]} — ${m[2]}`,{size:10.4,leading:16,bold:true,below:6})}
paragraph('Avant-propos • Huit portraits • Commentaires et exercices • Bibliographie et lexique',{size:8.5,color:GREEN,above:14});
newPage();
let inQuote=false;
for(const rawLine of text.split(/\r?\n/)){
 const raw=rawLine.trim(); if(!raw){inQuote=false; y-=3;continue;}
 const cleaned = raw.replace(/\*\*(.*?)\*\*/g,'$1').replace(/\*(.*?)\*/g,'$1').replace(/`([^`]+)`/g,'$1').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1').replace(/#+\s*$/,'').replaceAll('&amp;','&');
 const h=cleaned.match(/^(#{1,4})\s+(.+)$/);
 if(h){const heading=h[2];if(/^\d\s+—/.test(heading)||heading==='Lexique des premiers repères'||heading==='Colophon'||heading==='Références principales')newPage();title(heading,Math.min(3,h[1].length));continue;}
 if(cleaned.startsWith('>')){paragraph(cleaned.replace(/^>\s*/,''),{size:9.5,color:GREEN,indent:12,above:2,below:8});continue;}
 if(/^[-*]\s+/.test(cleaned)){paragraph('•  '+cleaned.replace(/^[-*]\s+/,''),{size:9.3,leading:13.5,indent:10,below:3});continue;}
 paragraph(cleaned,{size:9.4,leading:13.4,below:6});
}
// Pieds de page
for(let i=1;i<pages.length;i++){
 page=pages[i];line(ML,28,W-MR,28,[.74,.72,.62],.35);draw('Jeunes Compagnons, grands héros  •  Institut de l’Excellence',ML,18,6.5,false,GREEN);
 draw(String(i),W-MR-8,18,7,false,GREEN);
}
const objects=[null,'<< /Type /Catalog /Pages 2 0 R >>',null,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
let kids=[];
for(const pg of pages){const streamNo=objects.length;const data=deflateSync(Buffer.from(pg.commands.join('\n')+'\n','ascii'));objects.push(Buffer.concat([Buffer.from(`<< /Length ${data.length} /Filter /FlateDecode >>\nstream\n`),data,Buffer.from('\nendstream')]));const pageNo=objects.length;objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${fmt(W)} ${fmt(H)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamNo} 0 R >>`);kids.push(`${pageNo} 0 R`);}
objects[2]=`<< /Type /Pages /Count ${pages.length} /Kids [${kids.join(' ')}] >>`;
let chunks=[Buffer.from('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n','binary')],offsets=[0],total=chunks[0].length;
for(let i=1;i<objects.length;i++){offsets.push(total);const obj=Buffer.concat([Buffer.from(`${i} 0 obj\n`),Buffer.isBuffer(objects[i])?objects[i]:Buffer.from(objects[i]),Buffer.from('\nendobj\n')]);chunks.push(obj);total+=obj.length;}
const xref=total;const footer=Buffer.from(`xref\n0 ${objects.length}\n0000000000 65535 f \n`+offsets.slice(1).map(n=>`${String(n).padStart(10,'0')} 00000 n \n`).join('')+`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);chunks.push(footer);
mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,Buffer.concat(chunks));console.log(`PDF A5 généré: ${pages.length} pages, ${total+footer.length} octets`);
