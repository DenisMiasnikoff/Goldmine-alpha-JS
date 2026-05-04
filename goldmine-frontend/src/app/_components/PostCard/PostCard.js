// _components/PostCard.js
'use client';
import { upvotePostAction } from "../../_lib/actions"

export default function PostCard({ post, token }) {
  const handleUpvote = async () => {
    const message = await upvotePostAction(post.id, token);
    if (message.includes('💎')) {
      alert(message); // You can replace this with a cool toast later!
    }
  };

  return (
    <div className="card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div className="stats">
        <button onClick={handleUpvote}>⛏️ {post.upvotes} Upvotes</button>
      </div>
    </div>
  );
}