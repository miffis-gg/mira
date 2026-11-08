export type CategoryId = 'hair' | 'nails' | 'brows-makeup' | 'care';
export interface ServiceCategory { id: CategoryId; name: string; description: string }
export interface Service { id: string; categoryId: CategoryId; name: string; description: string; durationMinutes: number; price: number; pricePrefix?: 'от'; specialistIds: string[] }
export interface Specialist { id: string; name: string; role: string; description: string; serviceIds: string[]; image: string; demo: true }
export interface GalleryItem { id: string; categoryId: CategoryId; image: string; caption: string; alt: string }
export interface PackageOffer { id: string; name: string; description: string; serviceIds: string[]; specialistIds: string[]; durationMinutes: number; price: number; pricePrefix?: 'от' }
export interface FAQItem { question: string; answer: string }
export interface TimeSlot { time: string; endMinutes: number }
export interface VisitSelection { kind: 'service' | 'package'; itemId: string; specialistId: string | null; date: string | null; time: string | null }
export interface LeadFormData { name: string; phone: string; note: string; demoConsent: boolean }
export interface DemoFormState { step: number; status: 'idle' | 'submitting' | 'success'; contact: LeadFormData }
