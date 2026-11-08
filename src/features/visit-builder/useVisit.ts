import { useEffect, useRef, useState } from 'react';
import { packages, services, specialists } from '../../data/content';
import type { DemoFormState, LeadFormData, VisitSelection } from '../../types';
export const blankContact: LeadFormData = {name:'',phone:'',note:'',demoConsent:false};
export function useVisit() {
 const [selection,setSelection] = useState<VisitSelection|null>(null);
 const [form,setForm] = useState<DemoFormState>({step:0,status:'idle',contact:blankContact});
 const [notice,setNotice] = useState('');
 const pending = useRef(false);
 const timer = useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current!==null)clearTimeout(timer.current);},[]);
 const item = selection ? (selection.kind === 'service' ? services : packages).find(s=>s.id===selection.itemId) : undefined;
 const compatible = specialists.filter(s=>item?.specialistIds.includes(s.id));
 function select(kind: 'service'|'package', id: string) {
  const next=(kind==='service'?services:packages).find(s=>s.id===id);
  if(!next || pending.current) return;
  if(selection?.itemId===id && selection.kind===kind) return;
  const oldSpecialist=selection?.specialistId;
  const valid=oldSpecialist==='any'||(oldSpecialist && next.specialistIds.includes(oldSpecialist));
  setSelection({kind,itemId:id,specialistId:valid?oldSpecialist:null,date:null,time:null});
  setNotice(`${next.name} выбрана.${oldSpecialist && !valid ? ' Предыдущий специалист не подходит и сброшен.' : ''} Дата и время требуют нового выбора.`);
  setForm(f=>({...f,step:0,status:'idle'}));
 }
 function specialist(id:string) {
  if(!selection || (id!=='any'&&!compatible.some(s=>s.id===id))) return;
  setSelection({...selection,specialistId:id,date:null,time:null});
  setNotice(id==='any'?'Выбран любой подходящий специалист.':`Выбран специалист: ${specialists.find(s=>s.id===id)?.name}.`);
 }
 function go(step:number){setForm(f=>({...f,step}));}
 function reset(){if(timer.current!==null){clearTimeout(timer.current);timer.current=null;}pending.current=false;setSelection(null);setForm({step:0,status:'idle',contact:{...blankContact}});setNotice('Выбор и введённые данные сброшены.');}
 function submit(){if(pending.current)return;pending.current=true;setForm(f=>({...f,status:'submitting'}));timer.current=setTimeout(()=>{timer.current=null;setForm(f=>({...f,status:'success'}));pending.current=false;},800);}
 return {selection,setSelection,form,setForm,item,compatible,notice,select,specialist,go,reset,submit};
}
export type Visit = ReturnType<typeof useVisit>;
