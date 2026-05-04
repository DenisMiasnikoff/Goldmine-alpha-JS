// src/app/_components/MainContent/MainContent.js
"use client";
import { useState } from 'react';
import CreatePostForm from '../CreatePostForm/CreatePostForm';
import styles from './MainContent.module.scss';
import PostCard from '../PostCard/PostCard';

export default function MainContent({ posts, dungeonId, token }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
<main className={styles.main}>
<section className={styles.inputZone}>
  {!isFormOpen ? (
    <div className={styles.fakeInputBar} onClick={() => setIsFormOpen(true)}>
       <div className={styles.avatarCircle} /> {/* Placeholder for user icon */}
       <div className={styles.innerBar}>Create Post</div>
       <div className={styles.iconButtons}>
         <span>🖼️</span>
         <span>🔗</span>
       </div>
    </div>
  ) : (
    <div className={styles.realFormCard}>
      <header>
        <h3>Make a post</h3>
        <button onClick={() => setIsFormOpen(false)}>✕</button>
      </header>
      <CreatePostForm dungeonId={dungeonId} token={token} />
    </div>
  )}
</section>

<section className={styles.feedZone}>
        {posts && posts.length > 0 ? (
       
          posts.map((post) => (
            <PostCard key={post._id} post={post} token={token} />
          ))
        ) : (
          // IF THE MINE IS EMPTY: Show this instead
          <div className={styles.emptyState}>
            <div className={styles.icon}>⛏️</div>
            <h2>The mines run silent</h2>
            <p>No one posted in this Dungeon yet.</p>
            <button 
              className={styles.ctaBtn} 
              onClick={() => setIsFormOpen(true)}
            >
              Create post
            </button>
          </div>
        )}
      </section>

      {/* Post feed goes here */}
    </main>
  );
}