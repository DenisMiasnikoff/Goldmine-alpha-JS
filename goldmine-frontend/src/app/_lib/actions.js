"use server"

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { login } from "@/services/apiAuth";
import { revalidatePath } from "next/cache";




const API_BASE = 'http://localhost:5000/api/v1'; // Adjust to your backend port

// 1. CREATE A POST
export async function createPost(formData, dungeonId, token) {
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    // photo: formData.get('photo'), // Optional for later
  };

  const res = await fetch(`${API_BASE}/dungeons/${dungeonId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Required for req.user.id in your controller
    },
    body: JSON.stringify(rawData),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ Backend Error:", data.message);
    return { error: data.message };
  }

  console.log("✅ Post Created Successfully:", data.data.post._id);

  if (res.ok) revalidatePath('/dashboard');
}

// 2. UPVOTE A POST
export async function upvotePostAction(postId, token) {
  const res = await fetch(`${API_BASE}/posts/${postId}/upvote`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  
  // If the milestone was hit, you might want to trigger a toast notification
  if (data.status === 'success') {
    revalidatePath('/dashboard');
    return data.data.message; // "Author earned a gemstone! 💎"
  }
}

// 3. CREATE A DUNGEON (FORGE)
export async function forgeDungeon(formData, token) {
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
  };

  const res = await fetch(`${API_BASE}/dungeons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(rawData),
  });

  if (res.ok) revalidatePath('/dashboard');
}


export async function loginAction(prevData,formData) {
  const email=formData.get("email");
  const password=formData.get("password");

  try {
    const data=await login({email,password});

    const cookieStore=await cookies();
     cookieStore.set("jwt",data.token,{
     httpOnly:true,
     secure:process.env.NODE_ENV==="production",
     maxAge:60*60*24*7,
     path:"/",
    })
  }
  catch(err) {
   return {error:err.message};
  }

  redirect("/dashboard")
}