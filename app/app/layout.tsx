import type { ReactNode } from 'react';
export default function Layout({children}:{children:ReactNode}){return <html lang="en"><body style={{fontFamily:'system-ui',maxWidth:800,margin:'3rem auto',padding:'0 1rem'}}>{children}</body></html>}
