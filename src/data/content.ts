import type { Service, ServiceCategory, Specialist, GalleryItem, PackageOffer, FAQItem, TimeSlot } from '../types';
export const categories: ServiceCategory[] = [
 {id:'hair',name:'Волосы',description:'Стрижки, укладки, окрашивание и уход.'},
 {id:'nails',name:'Ногти',description:'Маникюр, педикюр и уход за руками.'},
 {id:'brows-makeup',name:'Брови и макияж',description:'Архитектура, окрашивание и образ.'},
 {id:'care',name:'Уход',description:'Косметические ритуалы для лица.'},
];
export const services: Service[] = [
 {id:'hair-cut-style',categoryId:'hair',name:'Стрижка и укладка',description:'Консультация, форма и повседневная укладка',durationMinutes:90,price:4500,specialistIds:['alice']},
 {id:'hair-tone',categoryId:'hair',name:'Окрашивание тон в тон',description:'Подбор оттенка, окрашивание и базовый уход',durationMinutes:120,price:7500,pricePrefix:'от',specialistIds:['alice']},
 {id:'hair-complex-color',categoryId:'hair',name:'Сложное окрашивание',description:'Предварительная консультация и индивидуальная схема',durationMinutes:240,price:14000,pricePrefix:'от',specialistIds:['alice']},
 {id:'hair-care',categoryId:'hair',name:'Восстанавливающий уход',description:'Уход по состоянию волос и укладка',durationMinutes:75,price:4200,specialistIds:['alice']},
 {id:'nail-manicure',categoryId:'nails',name:'Маникюр с покрытием',description:'Маникюр, выравнивание и однотонное покрытие',durationMinutes:120,price:3500,specialistIds:['maria']},
 {id:'nail-manicure-clean',categoryId:'nails',name:'Маникюр без покрытия',description:'Форма, обработка и уход за кожей рук',durationMinutes:60,price:2200,specialistIds:['maria']},
 {id:'nail-pedicure',categoryId:'nails',name:'Педикюр с покрытием',description:'Обработка стопы и однотонное покрытие',durationMinutes:100,price:4200,specialistIds:['maria']},
 {id:'brow-shape',categoryId:'brows-makeup',name:'Архитектура бровей',description:'Форма, коррекция и укладка',durationMinutes:50,price:2200,specialistIds:['sofia']},
 {id:'brow-color',categoryId:'brows-makeup',name:'Брови: форма и цвет',description:'Коррекция, окрашивание и укладка',durationMinutes:70,price:2800,specialistIds:['sofia']},
 {id:'makeup-evening',categoryId:'brows-makeup',name:'Вечерний макияж',description:'Образ с учётом события и пожеланий',durationMinutes:90,price:5000,specialistIds:['sofia']},
 {id:'care-face',categoryId:'care',name:'Ритуал ухода для лица',description:'Мягкое очищение и косметический уход',durationMinutes:75,price:5500,specialistIds:['elena']},
 {id:'care-express',categoryId:'care',name:'Экспресс-уход',description:'Короткая косметическая программа перед событием',durationMinutes:45,price:3800,specialistIds:['elena']},
];
export const specialists: Specialist[] = [
 {id:'alice',name:'Алиса Воронова',role:'Стилист и колорист',description:'Работает с формой, естественными оттенками и повседневной укладкой.',serviceIds:services.filter(s=>s.specialistIds.includes('alice')).map(s=>s.id),image:'alice',demo:true},
 {id:'maria',name:'Мария Белова',role:'Nail-специалист',description:'Предпочитает чистую форму, тонкие покрытия и спокойную палитру.',serviceIds:services.filter(s=>s.specialistIds.includes('maria')).map(s=>s.id),image:'maria',demo:true},
 {id:'sofia',name:'София Лазарева',role:'Brow- и makeup-специалист',description:'Собирает образ вокруг особенностей лица и задачи визита.',serviceIds:services.filter(s=>s.specialistIds.includes('sofia')).map(s=>s.id),image:'sofia',demo:true},
 {id:'elena',name:'Елена Миронова',role:'Специалист косметического ухода',description:'Подбирает мягкий косметический ритуал и понятную домашнюю последовательность.',serviceIds:services.filter(s=>s.specialistIds.includes('elena')).map(s=>s.id),image:'elena',demo:true},
];
export const gallery: GalleryItem[] = [
 {id:'short',categoryId:'hair',image:'hero',caption:'Форма. Текстура. Характер.',alt:'Короткая текстурная стрижка в боковом свете'},
 {id:'nails',categoryId:'nails',image:'nails',caption:'Чистая линия',alt:'Работа над формой ногтей крупным планом'},
 {id:'long',categoryId:'hair',image:'hair-long',caption:'Естественное движение',alt:'Портрет модели с длинными волнистыми волосами'},
 {id:'makeup',categoryId:'brows-makeup',image:'makeup',caption:'Вечерний акцент',alt:'Портрет модели с выразительным вечерним макияжем'},
 {id:'color',categoryId:'hair',image:'hair-color',caption:'Внимание к оттенку',alt:'Волосы в нейтральном свете салона'},
 {id:'hands',categoryId:'nails',image:'hands',caption:'Время для себя',alt:'Руки во время маникюра'},
 {id:'brows',categoryId:'brows-makeup',image:'brows',caption:'Детали образа',alt:'Крупный план работы с бровями'},
 {id:'care',categoryId:'care',image:'care',caption:'Тихий ритуал',alt:'Косметическое масло в пипетке над ладонью'},
];
export const packages: PackageOffer[] = [
 {id:'event',name:'Перед событием',description:'Вечерний макияж и укладка',serviceIds:['makeup-evening','hair-cut-style'],specialistIds:['sofia'],durationMinutes:150,price:8500,pricePrefix:'от'},
 {id:'morning',name:'Спокойное утро',description:'Маникюр без покрытия и экспресс-уход',serviceIds:['nail-manicure-clean','care-express'],specialistIds:['maria'],durationMinutes:105,price:5700},
 {id:'shade',name:'Новый оттенок',description:'Консультация по цвету, окрашивание тон в тон и базовый уход',serviceIds:['hair-tone','hair-care'],specialistIds:['alice'],durationMinutes:150,price:9500,pricePrefix:'от'},
];
export const ritual = [
 ['Выбор','Вы отмечаете услугу и видите её длительность и стоимость.'],
 ['Согласование','Выбираете специалиста и доступное демонстрационное время.'],
 ['Встреча','Перед началом мастер уточняет пожелания и ограничения процедуры.'],
 ['Рекомендации','Понятные советы по домашнему уходу без навязывания товаров.'],
];
export const standards = ['Рабочая поверхность подготавливается перед каждым визитом.','Расходные материалы используются в соответствии с назначением процедуры.','Инструменты проходят предусмотренную для них обработку в рамках концепции сервиса.','Перед процедурой специалист уточняет пожелания и возможные ограничения.','Составы и материалы можно обсудить до начала услуги.'];
export const preparation = [
 ['Волосы','Сообщите мастеру об истории окрашивания. Принесите референсы формы или оттенка. Рекомендации по мытью головы уточняются заранее.'],
 ['Ногти','Заранее сообщите о чувствительности или повреждениях. Не снимайте стойкое покрытие самостоятельно непосредственно перед визитом.'],
 ['Брови и макияж','Расскажите о чувствительности кожи и известных реакциях. При необходимости принесите фотографию образа или одежды для события.'],
 ['Уход','Сообщите о чувствительности и используемых активных средствах. Эти рекомендации не заменяют консультацию врача.'],
];
export const faqs: FAQItem[] = [
 {question:'Цены окончательные?',answer:'В этом концептуальном проекте цены демонстрационные. В реальном сервисе итог для сложного окрашивания и комплексных процедур подтверждается после консультации.'},
 {question:'Можно выбрать конкретного специалиста?',answer:'Да. После выбора услуги интерфейс покажет совместимые демонстрационные профили специалистов.'},
 {question:'Что делать, если я не знаю, какая услуга нужна?',answer:'Начните с направления: в описаниях услуг указаны их состав, стоимость и продолжительность. Это демонстрационный путь без реального звонка или отправки данных.'},
 {question:'Можно записаться сразу на несколько услуг?',answer:'Для первой версии доступна одна основная услуга или готовый комплекс. Это сохраняет понятный расчёт длительности и стоимости.'},
 {question:'Как изменить или отменить запись?',answer:'Настоящие записи не создаются. В демосценарии выбор можно изменить или полностью сбросить до и после экрана успеха.'},
 {question:'Форма сохраняет мой номер телефона?',answer:'Нет. Данные не отправляются на сервер и не сохраняются в браузере.'},
 {question:'Можно ли прийти с ребёнком или сопровождающим?',answer:'Условия указаны только для демонстрации. В реальном салоне этот вопрос следует уточнить заранее.'},
 {question:'Есть ли подарочные сертификаты?',answer:'На сайте показан демонстрационный сценарий выбора номинала без оплаты и выпуска реального сертификата.'},
];
export const dates = Array.from({length:5},(_,i)=>`2026-11-${String(9+i).padStart(2,'0')}`);
export const slots: TimeSlot[] = [{time:'10:00',endMinutes:600},{time:'12:30',endMinutes:750},{time:'15:00',endMinutes:900},{time:'17:30',endMinutes:1050},{time:'19:00',endMinutes:1140}];
export const steps = ['Услуга','Специалист','Дата и время','Контакты','Проверка'];
export const navigation = [['Услуги','services'],['Работы','gallery'],['Специалисты','specialists'],['О салоне','about'],['Контакты','contacts']];
export const price = (item: {price: number; pricePrefix?: 'от'}) => `${item.pricePrefix ? 'от ' : ''}${item.price.toLocaleString('ru-RU')} ₽`;
export const formatDate = (date: string) => new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`));
