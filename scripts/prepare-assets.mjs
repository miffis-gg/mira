import fs from 'node:fs/promises';
import sharp from 'sharp';
const assets = [
 ['hero',11054049,'Портрет с короткой стрижкой','Christina Chekhomova'],
 ['ritual',3992863,'Консультация и работа с волосами','cottonbro studio'],
 ['hair-long',13357094,'Длинные волосы в студийном свете','Serch Arafat'],
 ['hair-color',36288118,'Оттенок и форма длинных волос','El gringo photo'],
 ['nails',3997391,'Маникюр крупным планом','cottonbro studio'],
 ['hands',3997379,'Уход за руками','cottonbro studio'],
 ['brows',9775109,'Укладка бровей щёточкой','SHVETS production'],
 ['makeup',36524051,'Вечерний макияж','Inna Mykytas'],
 ['care',3762879,'Косметический уход','Polina Tankilevitch'],
 ['alice',774909,'Иллюстративный портрет Алисы','Andrea Piacquadio'],
 ['maria',415829,'Иллюстративный портрет Марии','Pixabay'],
 ['sofia',1239291,'Иллюстративный портрет Софии','Daniel Xavier'],
 ['elena',733872,'Иллюстративный портрет Елены','Pixabay'],
];
await fs.mkdir('public/images',{recursive:true});
const manifest=[];
for(const [name,id,purpose,author] of assets){
 const url=`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;
 const res=await fetch(url); if(!res.ok) throw Error(`${name}: ${res.status}`);
 const input=Buffer.from(await res.arrayBuffer());
 for(const width of [480,960]) await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:80}).toFile(`public/images/${name}-${width}.webp`);
 manifest.push({name,id,author,purpose,source:`https://www.pexels.com/photo/${id}/`,license:'https://www.pexels.com/license/',origin:'Лицензированная стоковая фотография; учебная иллюстрация, не работа MIRA и не реальный сотрудник',crop:'object-fit: cover; центр, hero: 50% 35%',alt:purpose});
 console.log(`Prepared ${name}`);
}
await fs.writeFile('public/images/sources.json',JSON.stringify(manifest,null,2));
const thumbs=await Promise.all(assets.map(async([name])=>({input:await sharp(`public/images/${name}-480.webp`).resize(180,220,{fit:'cover'}).png().toBuffer(),left:(assets.findIndex(a=>a[0]===name)%5)*180,top:Math.floor(assets.findIndex(a=>a[0]===name)/5)*220})));
await fs.mkdir('qa/assets',{recursive:true});
await sharp({create:{width:900,height:660,channels:3,background:'#ded9e0'}}).composite(thumbs).png().toFile('qa/assets/contact-sheet.png');
