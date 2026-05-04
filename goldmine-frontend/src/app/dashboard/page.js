import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("jwt");
  const token = tokenCookie ? tokenCookie.value : null;

 
  const REAL_DUNGEON_ID = '69f77476c742faaab1610988'; 

 
  const res = await fetch(`http://localhost:5000/api/v1/dungeons/${REAL_DUNGEON_ID}/posts`, {
    cache: 'no-store'
  });
  
  let posts = [];
  if (res.ok) {
    const data = await res.json();
    posts = data.data?.posts || []; 
  }

 
  return (
    <DashboardClient 
      posts={posts} 
      dungeonId={REAL_DUNGEON_ID} 
      token={token} 
    />
  );
}