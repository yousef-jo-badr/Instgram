import React, { useState } from 'react';
import { Heart, MessageSquare } from 'lucide-react';

const Favorite = ({ posts = [], currentUser, handleLike, handleReply, themeColor, getRelativeTime }) => {
  const [replyInput, setReplyInput] = useState({ postId: null, text: '' });

  // Safety check: Filter posts only if they exist, otherwise use empty array
  const favoritePosts = posts.filter(p => p.likes?.includes(currentUser?.name));

  const styles = {
    card: { border: '1px solid #dbdbdb', borderRadius: '8px', marginBottom: '25px', background: '#fff', overflow: 'hidden' },
    cardHead: { padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' },
    miniAv: { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' },
    cardImg: { width: '100%', maxHeight: '500px', objectFit: 'cover' },
    info: { padding: '15px' },
    empty: { textAlign: 'center', marginTop: '100px', color: '#999' },
    replyInput: { flex: 1, padding: '8px', border: '1px solid #dbdbdb', borderRadius: '20px', fontSize: '13px' },
    btnPrimarySm: { background: themeColor, color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }
  };

  const onReplySubmit = (postId) => {
    // Check if handleReply exists before calling (safety)
    if (handleReply) {
      handleReply(postId, replyInput.text);
    }
    setReplyInput({ postId: null, text: '' });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>Your Favorites</h2>
      {favoritePosts.length === 0 ? (
        <div style={styles.empty}>
          <Heart size={48} style={{ margin: '0 auto 10px', opacity: 0.2 }} />
          <p>No favorite posts yet.</p>
        </div>
      ) : (
        favoritePosts.map(p => (
          <div key={p.id} style={styles.card}>
            <div style={styles.cardHead}>
              <img src={p.avatar} style={styles.miniAv} alt="" />
              <span style={{ fontWeight: 'bold' }}>{p.username}</span>
            </div>
            
            {p.image && <img src={p.image} style={styles.cardImg} alt="" />}
            
            <div style={styles.info}>
              <p style={{ margin: 0 }}><strong>{p.username}</strong> {p.caption}</p>
              
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#ff4d4d' }} 
                  onClick={() => handleLike(p.id)} 
                >
                  <Heart size={20} fill="#ff4d4d" />
                  <small>{p.likes?.length || 0}</small>
                </div>
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#666' }}
                  onClick={() => setReplyInput({ postId: p.id, text: '' })}
                >
                  <MessageSquare size={20} />
                  <small>{p.replies?.length || 0}</small>
                </div>
              </div>

              {p.replies?.length > 0 && (
                <div style={{ marginTop: '10px', paddingLeft: '10px', borderLeft: `2px solid ${themeColor}44` }}>
                  {p.replies.map(r => (
                    <p key={r.id} style={{ fontSize: '12px', margin: '4px 0' }}>
                      <strong>{r.user}</strong> {r.text}
                    </p>
                  ))}
                </div>
              )}

              {replyInput.postId === p.id && (
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                  <input 
                    style={styles.replyInput} 
                    placeholder="Write a reply..." 
                    value={replyInput.text} 
                    onChange={e => setReplyInput({ ...replyInput, text: e.target.value })} 
                  />
                  <button style={styles.btnPrimarySm} onClick={() => onReplySubmit(p.id)}>Post</button>
                </div>
              )}

              <small style={{ color: '#888', display: 'block', marginTop: '10px' }}>
                {getRelativeTime ? getRelativeTime(p.id) : ''}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Favorite;