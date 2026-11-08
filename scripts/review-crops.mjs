import sharp from 'sharp';
for(const width of [390,768,1024,1280,1440]){
 const input=`qa/screenshots/mira-${width}.png`;
 const {height}=await sharp(input).metadata();
 await sharp(input).extract({left:0,top:0,width,height:Math.min(height,1150)}).png().toFile(`qa/screenshots/hero-${width}.png`);
 if(width===1440){for(const [name,top] of [['gallery',4700],['booking',10500]])await sharp(input).extract({left:0,top,width,height:Math.min(height-top,1600)}).png().toFile(`qa/screenshots/${name}-1440.png`);}
}
console.log('Prepared review crops');
