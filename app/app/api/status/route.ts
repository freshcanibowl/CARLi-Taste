import {NextResponse} from 'next/server';
export const runtime='nodejs';
export async function GET(){
 const revision=process.env.VERCEL_GIT_COMMIT_SHA||process.env.GITHUB_SHA||null;
 return NextResponse.json({
  app:'CARLi Taste',
  service:'ok',
  revision,
  revisionVerified:revision!==null,
  environment:process.env.VERCEL_ENV||'unknown',
  qlooConfigured:Boolean(process.env.QLOO_API_KEY),
  liveQlooVerified:false,
  petPoliciesVerified:false
 },{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
