// Build 33: browser-local event evidence and portable opt-in profile.
// No automatic network transport. Metric denominators remain strictly local.
export const EVENT_KEY='carli-taste-events-v1';
export const PROFILE_SCHEMA='carli-taste-portable-profile-v1';
export const EVENT_TYPES=['discovery_completed','candidate_feedback','candidate_opened','journey_completed'];
const FEEDBACK_KEY='carli-taste-feedback-v1';
const JOURNEY_KEY='carli-taste-journey-v1';
const OPTIN_KEY='carli-taste-adaptive-opt-in';
const RE='^[a-zA-Z0-9_:-]{1,100}$';

export function validateEvents(raw){
 if(!Array.isArray(raw))return [];
 return raw.filter(e=>e&&typeof e==='object'&&EVENT_TYPES.includes(e.type)&&
 Number.isFinite(e.at)&&e.at>=0&&e.at<=4102444800000&&
 (e.candidateId===undefined||(typeof e.candidateId==='string'&&e.candidateId.length<=100)))
 .slice(-300).map(e=>({type:e.type,at:e.at,...(e.candidateId?{candidateId:e.candidateId}:{})}));
}
export function appendEvent(raw,type,at=Date.now(),candidateId){
 if(!EVENT_TYPES.includes(type)||!Number.isFinite(at))return validateEvents(raw);
 return validateEvents([...validateEvents(raw),{type,at,...(typeof candidateId==='string'?{candidateId:candidateId.slice(0,100)}:{})}]);
}
export function localMetrics(raw){
 const events=validateEvents(raw);
 const count=type=>events.filter(e=>e.type===type).length;
 const searches=count('discovery_completed');
 const opened=count('candidate_opened');
 // 'opened' denotes an explicit details action, not verified real-world visit.
 return {searches,opened,feedbackActions:count('candidate_feedback'),journeyCompletions:count('journey_completed'),
  openPerSearch:searches?opened/searches:null,retention7Day:null,scope:'THIS_BROWSER_ONLY'};
}
export function portableProfile(feedback,journey,adaptive){
 const validFeedback={};
 if(feedback&&typeof feedback==='object'&&!Array.isArray(feedback))
  for(const [id,rating] of Object.entries(feedback).slice(0,100))
   if(new RegExp(RE).test(id)&&(rating==='liked'||rating==='disliked'))validFeedback[id]=rating;
 const safeJourney=Array.isArray(journey)&&journey.length===7?journey.map(e=>({
  done:e?.done===true,
  rating:['liked','neutral','disliked'].includes(e?.rating)?e.rating:null,
  note:typeof e?.note==='string'?e.note.slice(0,300):''
 })):Array.from({length:7},()=>({done:false,rating:null,note:''}));
 return {schema:PROFILE_SCHEMA,exportedAt:new Date().toISOString(),adaptive:adaptive===true,feedback:validFeedback,journey:safeJourney};
}
export function parsePortableProfile(raw){
 if(typeof raw!=='string'||raw.length>20000)throw Error('PROFILE_SIZE_INVALID');
 let candidate;try{candidate=JSON.parse(raw)}catch{throw Error('PROFILE_JSON_INVALID')}
 if(!candidate||candidate.schema!==PROFILE_SCHEMA||typeof candidate.adaptive!=='boolean'||
 !Array.isArray(candidate.journey)||candidate.journey.length!==7||
 candidate.journey.some(e=>!e||typeof e.done!=='boolean'||!(e.rating===null||['liked','neutral','disliked'].includes(e.rating))||typeof e.note!=='string'||e.note.length>300)||
 !candidate.feedback||typeof candidate.feedback!=='object'||Array.isArray(candidate.feedback)||
 Object.keys(candidate.feedback).length>100||
 Object.entries(candidate.feedback).some(([id,rating])=>!new RegExp(RE).test(id)||!['liked','disliked'].includes(rating))
 )throw Error('PROFILE_SCHEMA_INVALID');
 return portableProfile(candidate.feedback,candidate.journey,candidate.adaptive);
}
export function browserKeys(){return {feedback:FEEDBACK_KEY,journey:JOURNEY_KEY,optin:OPTIN_KEY,events:EVENT_KEY}}
