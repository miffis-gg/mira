import { useState } from 'react';
import type { CategoryId } from '../types';
import { categories } from '../data/content';
import s from '../app/App.module.css';
export function Arrow({diagonal=false}:{diagonal?:boolean}) {return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d={diagonal?'M5 19 19 5M5 5h14v14':'M4 12h15m-6-6 6 6-6 6'}/></svg>}
export function Photo({name,alt,hero=false,className=''}:{name:string;alt:string;hero?:boolean;className?:string}) {
 const [failed,setFailed]=useState(false);
 return failed ? <div className={`${s.imageFallback} ${className}`} role="img" aria-label={alt}>Фотография недоступна</div> : <img className={`${s.photo} ${className}`} src={`${import.meta.env.BASE_URL}images/${name}-960.webp`} srcSet={`${import.meta.env.BASE_URL}images/${name}-480.webp 480w, ${import.meta.env.BASE_URL}images/${name}-960.webp 960w`} sizes={hero?'(max-width: 767px) calc(100vw - 40px), 46vw':'(max-width: 767px) calc(100vw - 40px), 40vw'} width="960" height="1200" alt={alt} loading={hero?'eager':'lazy'} fetchPriority={hero?'high':'auto'} onError={()=>setFailed(true)}/>;
}
export function Filters({value,onChange,counts,label}:{value:CategoryId|'all';onChange:(id:CategoryId|'all')=>void;counts:(id:CategoryId|'all')=>number;label:string}) {
 return <div className={s.filters} role="group" aria-label={label}>{[{id:'all' as const,name:'Все'},...categories].map(c=><button key={c.id} type="button" aria-pressed={value===c.id} onClick={()=>onChange(c.id)}>{c.name}<span>{counts(c.id)}</span></button>)}</div>;
}
export function Accordion({title,children,id}:{title:string;children:React.ReactNode;id:string}) {
 const [open,setOpen]=useState(false);
 return <div className={s.accordion}><h3><button type="button" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}>{title}<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M5 12h14"/>{!open&&<path d="M12 5v14"/>}</svg></button></h3><div id={id} hidden={!open} className={s.accordionBody}>{children}</div></div>;
}
