// Build 32: deterministic, local-only presentation ranking of Qloo candidates.
// No Qloo API calls or claims about pet-entry approval are made by this module.
export const MEMORY_KEY='carli-taste-feedback-v1';
export const JOURNEY_KEY='carli-taste-journey-v1';
const TAGS=['music','outdoors','dining','social','novelty'];
const ALIASES={
 music:/\b(music|jazz|song|concert|band|record|vinyl|live)\b/i,
 outdoors:/\b(park|garden|trail|nature|walk|outdoor|hike)\b/i,
 dining:/\b(food|restaurant|cafe|coffee|dining|dessert|eat|bakery)\b/i,
 social:/\b(community|group|market|event|festival|meet)\b/i,
 novelty:/\b(museum|gallery|exhibition|art|craft|theatre|theater)\b/i
};
export function safeFeedback(input){
 if(!input || typeof input!=='object'||Array.isArray(input))return {};
 const out={};
 for(const [key,val] of Object.entries(input).slice(0,100)){
  if(key.length<=100 && (val==='liked'||val==='disliked'))out[key]=val;
 }
 return out;
}
export function journeySignal(entries){
 if(!Array.isArray(entries)||entries.length!==7)return {};
 const map=[[0,null],[1,'music'],[2,'outdoors'],[3,'dining'],[4,'social'],[5,'novelty'],[6,null]];
 const out={};
 for(const [i,tag] of map){
  const e=entries[i];if(!tag||!e||e.done!==true)continue;
  if(e.rating==='liked')out[tag]=1;
  if(e.rating==='disliked')out[tag]=-1;
 }
 return out;
}
export function rankLocal(candidates,{feedback={},journey=[]}={}){
 if(!Array.isArray(candidates))return [];
 const votes=safeFeedback(feedback), signal=journeySignal(journey);
 return candidates.map((item,index)=>{
  const hay=`${item?.name||''} ${item?.category||''}`;
  const tags=TAGS.filter(t=>ALIASES[t].test(hay));
  const journeyAdjustment=tags.reduce((acc,t)=>acc+(signal[t]||0),0);
  const rating=votes[item?.id]||null;
  const score=(rating==='liked'?10:rating==='disliked'?-10:0)+journeyAdjustment;
  const reasons=[];
  if(rating==='liked')reasons.push('You previously liked this candidate');
  if(rating==='disliked')reasons.push('You previously passed on this candidate');
  for(const tag of tags){if(signal[tag]===1)reasons.push(`Your day activity favored ${tag}`);if(signal[tag]===-1)reasons.push(`Your day activity did not favor ${tag}`)}
  return {...item,localScore:score,localReasons:reasons,originalQlooPosition:index+1,_index:index};
 }).sort((a,b)=>b.localScore-a.localScore||a._index-b._index).map(({_index,...item})=>item);
}
