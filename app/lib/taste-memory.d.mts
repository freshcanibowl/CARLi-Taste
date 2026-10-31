export const MEMORY_KEY:string;
export const JOURNEY_KEY:string;
export type Feedback=Record<string,'liked'|'disliked'>;
export type MemoryCandidate={id:string;name:string;category:string;petPolicy:string;actionable:boolean;localScore?:number;localReasons?:string[];originalQlooPosition?:number};
export function safeFeedback(input:unknown):Feedback;
export function journeySignal(entries:unknown):Record<string,number>;
export function rankLocal<T extends MemoryCandidate>(candidates:T[],options?:{feedback?:Feedback;journey?:unknown[]}):Array<T&{localScore:number;localReasons:string[];originalQlooPosition:number}>;
