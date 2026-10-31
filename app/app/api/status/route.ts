import {NextResponse} from 'next/server';
export const runtime='nodejs';
export async function GET(){return NextResponse.json({app:'CARLi Taste',service:'ok',qlooConfigured:Boolean(process.env.QLOO_API_KEY),liveQlooVerified:false,petPoliciesVerified:false},{headers:{'Cache-Control':'no-store'}})}
