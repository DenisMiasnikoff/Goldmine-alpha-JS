"use client";
import { useRef } from 'react';
import { createPost } from "../../_lib/actions" // Make sure this path matches your setup
// import styles from './CreatePostForm.module.scss'; // Uncomment if you have a CSS module for this

export default function CreatePostForm({ dungeonId, token }) {
  // We use a ref so we can easily clear the text inputs after a successful deposit
  const formRef = useRef(null);

  const handleAction = async (formData) => {
    // 1. Call the server action with our extra parameters
    await createPost(formData, dungeonId, token);
    
    // 2. Clear the form so the Miner can type a new post immediately
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <form ref={formRef} action={handleAction} /* className={styles.formContainer} */ style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
      <input 
        type="text" 
        name="title" 
        placeholder="Title of post" 
        required 
        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      
      <textarea 
        name="content" 
        placeholder="Describe the post" 
        required 
        rows="4"
        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      
      <button 
        type="submit"
        style={{ padding: '10px 15px', backgroundColor: '#ffd700', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Make a post
      </button>
    </form>
  );
}