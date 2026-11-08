import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import sharp from 'sharp';
import type { Page } from '@playwright/test';
async function fullCapture(page:Page,width:number){
 if(width!==390){await page.screenshot({path:`qa/screenshots/mira-${width}.png`,fullPage:true});return;}
 const height=await page.evaluate(()=>document.documentElement.scrollHeight);
 const viewport=page.viewportSize()!;
 const tiles:{input:Buffer;left:number;top:number}[]=[];
 for(let y=0;y<height;y+=viewport.height){await page.evaluate(top=>window.scrollTo({top,behavior:'instant'}),y);const top=await page.evaluate(()=>window.scrollY);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));tiles.push({input:await page.screenshot(),left:0,top});}
 await sharp({create:{width,height,channels:3,background:'#f5f3f1'}}).composite(tiles).png().toFile(`qa/screenshots/mira-${width}.png`);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
}
test('responsive render, semantic accessibility, image loading',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [390,768,1024,1280,1440]){
  await page.setViewportSize({width,height:1000});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:'section{content-visibility:visible !important}'});
  await expect(page.locator('h1')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,100));}window.scrollTo({top:0,behavior:'instant'});});
  await expect(page.locator('img').first()).toBeVisible();
  await expect.poll(()=>page.locator('img:visible').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src))).toEqual([]);
  await fullCapture(page,width);
  const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(a11y.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 }
 expect(errors).toEqual([]);
});
test('filters preserve selection and incompatible specialist resets',async({page})=>{
 await page.goto('/');
 const catalog=page.locator('#services');
 for(const category of ['Все','Волосы','Ногти','Брови и макияж','Уход']){await catalog.getByRole('button',{name:new RegExp(`^${category}\\s*\\d`)}).click();await expect(catalog.locator('li')).toHaveCount(category==='Все'?12:category==='Волосы'?4:category==='Уход'?2:3);}
 await catalog.getByRole('button',{name:/^Ногти\s*\d/}).click();await catalog.getByRole('button',{name:'Выбрать: Маникюр с покрытием',exact:true}).click();
 await catalog.getByRole('button',{name:/Продолжить запись/}).click();await page.getByRole('radio',{name:/Мария Белова/}).check();
 await catalog.getByRole('button',{name:/^Волосы\s*\d/}).click();await expect(page.getByText(/Выбранная услуга «Маникюр с покрытием»/)).toBeVisible();
 await catalog.getByRole('button',{name:'Выбрать: Окрашивание тон в тон',exact:true}).click();await expect(page.getByRole('status').filter({hasText:/Предыдущий специалист не подходит и сброшен/})).toHaveCount(1);
 await catalog.getByRole('button',{name:/Продолжить запись/}).click();await expect(page.getByRole('radio',{name:/Алиса Воронова/})).toBeVisible();await expect(page.getByRole('radio',{name:/Мария Белова/})).toHaveCount(0);
 const gallery=page.locator('#gallery');for(const category of ['Все','Волосы','Ногти','Брови и макияж','Уход']){await gallery.getByRole('button',{name:new RegExp(`^${category}\\s*\\d`)}).click();await expect(gallery.locator('figure')).toHaveCount(category==='Все'?8:category==='Волосы'?3:category==='Уход'?1:2);}
});
test('booking validation, review, local success and full reset',async({page})=>{
 await page.goto('/');const booking=page.locator('#booking');
 await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await expect(page.locator('#booking-service')).toBeFocused();
 await page.locator('#booking-service').selectOption('service:hair-cut-style');await booking.getByRole('button',{name:'Продолжить',exact:true}).click();
 await page.getByRole('radio',{name:/Алиса Воронова/}).check();await booking.getByRole('button',{name:'Продолжить',exact:true}).click();
 await page.getByRole('radio',{name:'13 ноября'}).check();await expect(page.getByRole('radio',{name:'10:00',exact:true})).toBeDisabled();await page.getByRole('radio',{name:'9 ноября',exact:true}).check();await page.getByRole('radio',{name:'12:30',exact:true}).check();await booking.getByRole('button',{name:'Продолжить',exact:true}).click();
 await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await expect(page.locator('#name')).toBeFocused();await expect(page.locator('[aria-invalid=true]')).toHaveCount(3);
 await page.locator('#name').fill('А');await page.locator('#phone').fill('+7 900');await page.locator('#note').fill('я'.repeat(301));await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await expect(page.locator('[aria-invalid=true]')).toHaveCount(4);
 await page.locator('#name').fill('А'.repeat(61));await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await expect(page.locator('#name-error')).toBeVisible();
 await page.locator('#name').fill('Анна-Мария');await page.locator('#phone').fill('8 (900) 123-45-67');await page.locator('#note').fill('Хочу обсудить форму стрижки');await page.locator('#consent').check();await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await expect(booking.getByText('+7 900 ***-**-67',{exact:false})).toBeVisible();
 await booking.getByRole('button',{name:'Изменить контакты',exact:true}).click();await expect(page.locator('#name')).toHaveValue('Анна-Мария');await booking.getByRole('button',{name:'Продолжить',exact:true}).click();
 const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 await booking.getByRole('button',{name:'Подтвердить демозапись',exact:true}).dblclick();await expect(booking.getByRole('heading',{name:'Демозапись собрана'})).toBeVisible();expect(requests).toEqual([]);
 expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length,cookies:document.cookie}))).toEqual({local:0,session:0,cookies:''});
 await booking.getByRole('button',{name:'Начать заново'}).click();await expect(page.locator('#booking-service')).toHaveValue('');await page.locator('#booking-service').selectOption('service:nail-manicure');await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await page.getByRole('radio',{name:/Любой подходящий/}).check();await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await page.getByRole('radio',{name:'10 ноября',exact:true}).check();await page.getByRole('radio',{name:'15:00',exact:true}).check();await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await expect(page.locator('#name')).toHaveValue('');await expect(page.locator('#phone')).toHaveValue('');await expect(page.locator('#consent')).not.toBeChecked();
});
test('mobile menu, keyboard, dock, reduced motion, gift and 200% text',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.locator('h1')).toBeVisible();await page.keyboard.press('Tab');await expect(page.getByText('Перейти к содержанию')).toBeFocused();await page.keyboard.press('Enter');
 const menu=page.getByRole('button',{name:'Открыть меню'});await menu.focus();await page.keyboard.press('Enter');await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(menu).toBeFocused();
 const choose=page.getByRole('button',{name:'Выбрать: Стрижка и укладка',exact:true});await choose.focus();await page.keyboard.press('Enter');await expect(page.getByRole('complementary',{name:'Ваш визит'})).toBeVisible();
 await page.getByRole('button',{name:'Цены окончательные?'}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('button',{name:'Цены окончательные?'})).toHaveAttribute('aria-expanded','true');
 await expect(page.getByRole('complementary',{name:'Ваш визит'})).toHaveCount(0);
 await page.getByRole('button',{name:'Посмотреть сертификат'}).click();await page.getByRole('radio',{name:'Своя сумма'}).check();await page.locator('#custom-gift').fill('2000');await expect(page.locator('#custom-gift')).toHaveAttribute('aria-invalid','true');await page.locator('#custom-gift').fill('12000');await expect(page.locator('#custom-gift')).toHaveAttribute('aria-invalid','false');
 expect(await page.locator('html').evaluate(e=>getComputedStyle(e).scrollBehavior)).toBe('auto');
 await page.evaluate(()=>{const elements=Array.from(document.querySelectorAll<HTMLElement>('body *')).filter(e=>e instanceof HTMLElement).map(e=>({e,size:parseFloat(getComputedStyle(e).fontSize)}));elements.forEach(({e,size})=>e.style.setProperty('font-size',`${size*2}px`,'important'));});
 const overflow=await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)&&getComputedStyle(e).position!=='absolute';}).slice(0,12).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent?.slice(0,70),width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right})));
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))console.log('Text zoom overflow',overflow);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('reset cancels pending local confirmation',async({page})=>{
 await page.goto('/');const booking=page.locator('#booking');
 await page.locator('#booking-service').selectOption('service:hair-cut-style');
 await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await page.getByRole('radio',{name:/Любой подходящий/}).check();
 await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await page.getByRole('radio',{name:'9 ноября',exact:true}).check();await page.getByRole('radio',{name:'10:00',exact:true}).check();
 await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await page.locator('#name').fill('Анна');await page.locator('#phone').fill('+79001234567');await page.locator('#consent').check();
 await booking.getByRole('button',{name:'Продолжить',exact:true}).click();await booking.getByRole('button',{name:'Подтвердить демозапись',exact:true}).click();
 await page.locator('#services').getByRole('button',{name:'Сбросить',exact:true}).evaluate(button=>(button as HTMLButtonElement).click());
 await page.locator('#booking-service').selectOption('service:nail-manicure');await page.waitForTimeout(1000);
 await expect(page.locator('#booking-service')).toHaveValue('service:nail-manicure');await expect(booking.getByRole('heading',{name:'Демозапись собрана'})).toHaveCount(0);
});
test('keyboard booking and missing secondary image fallback',async({page})=>{
 await page.route('**/images/nails-*.webp',route=>route.abort());await page.goto('/');
 const booking=page.locator('#booking');
 await page.getByRole('button',{name:'Выбрать: Стрижка и укладка',exact:true}).focus();await page.keyboard.press('Enter');
 await page.locator('#services').getByRole('button',{name:/Продолжить запись/}).focus();await page.keyboard.press('Enter');
 await page.getByRole('radio',{name:/Любой подходящий/}).focus();await page.keyboard.press('Space');await booking.getByRole('button',{name:'Продолжить',exact:true}).focus();await page.keyboard.press('Enter');
 await page.getByRole('radio',{name:'9 ноября',exact:true}).focus();await page.keyboard.press('Space');await page.getByRole('radio',{name:'10:00',exact:true}).focus();await page.keyboard.press('Space');await booking.getByRole('button',{name:'Продолжить',exact:true}).focus();await page.keyboard.press('Enter');
 await page.locator('#name').focus();await page.keyboard.type('Anna');await page.keyboard.press('Tab');await page.keyboard.type('+79001234567');await page.keyboard.press('Tab');await page.keyboard.type('Consultation');await page.keyboard.press('Tab');await page.keyboard.press('Space');await page.keyboard.press('Tab');await page.keyboard.press('Tab');
 await booking.getByRole('button',{name:'Продолжить',exact:true}).focus();await page.keyboard.press('Enter');await booking.getByRole('button',{name:'Подтвердить демозапись',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(booking.getByRole('heading',{name:'Демозапись собрана'})).toBeFocused();
 const gallery=page.locator('#gallery');await gallery.scrollIntoViewIfNeeded();await expect(gallery.getByText('Фотография недоступна')).toBeVisible();
});
