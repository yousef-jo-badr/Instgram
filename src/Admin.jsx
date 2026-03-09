import React, { useState, useEffect } from 'react';
import { 
  Home, Users, PlusSquare, LogOut, Heart, 
  MessageSquare, Palette, Search, 
  Settings, User, ChevronDown, ChevronUp,
  Trash2, Share2, Repeat, ArrowLeft, Terminal, Bell,
  EyeOff, Camera, Check, UserPlus, UserCheck, Grid, X
} from 'lucide-react';
import "./Admin.css"; 
import ChittyAuth from './Logtochit';
import ChittyFriends from './Freinds';
import FavoritePage from './Favorite';
import Set from './Set';
import Profile from './Profile'; 

const DefaultAvatar = ({ src, size = 44, borderColor = 'transparent' }) => {
  const containerStyle = {
    width: size, height: size, backgroundColor: '#dbdbdb', borderRadius: '50%',
    position: 'relative', overflow: 'hidden', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
    border: borderColor !== 'transparent' ? `2px solid ${borderColor}` : 'none', flexShrink: 0
  };

  if (src) {
    return <img src={src} alt="profile" style={{...containerStyle, objectFit: 'cover'}} />;
  }

  return (
    <div style={containerStyle}>
      <div style={{width: '35%', height: '35%', backgroundColor: '#ffffff', borderRadius: '50%', position: 'absolute', top: '20%', zIndex: 2}} />
      <div style={{width: '70%', height: '70%', backgroundColor: '#ffffff', borderRadius: '50%', position: 'absolute', bottom: '-35%', zIndex: 1}} />
    </div>
  );
};

const SearchPage = ({ 
  directory, posts, themeColor, onSelectUser, 
  currentUser, handleLike, handleReply, getRelativeTime, handleViewProfile 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = searchTerm ? directory.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];
  const filteredPosts = searchTerm ? posts.filter(p => p.caption.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  const styles = {
    searchBar: { display: 'flex', alignItems: 'center', background: '#f5f5f5', padding: '12px 15px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #eee' },
    input: { background: 'none', border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '16px' },
    sectionTitle: { fontSize: '13px', fontWeight: 'bold', color: '#8e8e8e', margin: '25px 0 10px', textTransform: 'uppercase' },
    userResult: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px', cursor: 'pointer', transition: '0.2s', background: '#fff', marginBottom: '5px' },
    postResult: { padding: '15px', border: '1px solid #dbdbdb', borderRadius: '10px', marginBottom: '15px', background: '#fff' }
  };

  return (
    <div className="fade-in">
      <div style={styles.searchBar}>
        <Search size={20} color={themeColor} />
        <input style={styles.input} placeholder="Search names or post keywords..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoFocus />
      </div>
      {searchTerm ? (
        <>
          <h3 style={styles.sectionTitle}>People</h3>
          {filteredUsers.map(u => (
            <div key={u.name} style={styles.userResult} onClick={() => handleViewProfile(u)} className="hover-lift">
              <DefaultAvatar size={44} src={u.profilePic} borderColor={themeColor} />
              <span style={{fontWeight: '600'}}>{u.name}</span>
            </div>
          ))}
          <h3 style={styles.sectionTitle}>Posts</h3>
          {filteredPosts.map(p => (
            <div key={p.id} style={styles.postResult}>
              <p><strong>{p.username}</strong> {p.caption}</p>
            </div>
          ))}
        </>
      ) : <p style={{textAlign:'center', color:'#999', marginTop: '20px'}}>Search for friends...</p>}
    </div>
  );
};

const Admin = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('chitty_user_db')));
  const [posts, setPosts] = useState(() => JSON.parse(localStorage.getItem('chitty_posts_db')) || []);
  const [directory, setDirectory] = useState(() => JSON.parse(localStorage.getItem('chitty_directory_db')) || []);
  const [view, setView] = useState('feed'); 
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null); 
  const [now, setNow] = useState(Date.now());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingPost, setSharingPost] = useState(null);
  const [postInput, setPostInput] = useState({ caption: '', img: '' });
  const [replyInput, setReplyInput] = useState({ postId: null, text: '' });
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('chitty_theme') || '#00d4ff');
  const [btnRadius, setBtnRadius] = useState(() => localStorage.getItem('chitty_radius') || '12px');
  const [expandedPosts, setExpandedPosts] = useState({});
  const [commandText, setCommandText] = useState('');
  const [adminNotice, setAdminNotice] = useState(false);
  
  const isOwner = user?.name?.toLowerCase() === "yousef jo" && user?.password === "the owner";
  const otherUsers = directory.filter(u => u.name !== user?.name);

  // Added Logic: Handle Database Social Actions
  const handleSocialAction = (targetName, actionType) => {
    const updatedDir = directory.map(u => {
      if (u.name === targetName) {
        const list = u[actionType] || [];
        const newList = list.includes(user.name) ? list.filter(n => n !== user.name) : [...list, user.name];
        return { ...u, [actionType]: newList };
      }
      return u;
    });
    setDirectory(updatedDir);
    localStorage.setItem('chitty_directory_db', JSON.stringify(updatedDir));
    if (viewingUser?.name === targetName) {
      setViewingUser(updatedDir.find(u => u.name === targetName));
    }
  };

  const refreshUserData = () => {
    const updated = JSON.parse(localStorage.getItem('chitty_user_db'));
    setUser(updated);
    setDirectory(JSON.parse(localStorage.getItem('chitty_directory_db')) || []);
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    const noticeKey = `notice_for_${user?.name}`;
    if (localStorage.getItem(noticeKey)) {
        setAdminNotice(true);
    }
    return () => clearInterval(timer);
  }, [user]);

  useEffect(() => {
    localStorage.setItem('chitty_theme', themeColor);
    localStorage.setItem('chitty_radius', btnRadius);
  }, [themeColor, btnRadius]);

  const toggleExpand = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleRunCommand = (e) => {
    e.preventDefault();
    const args = commandText.trim().split(' ');
    const cmd = args[0].toLowerCase();
    const target = args[1];

    if (cmd === 'help') {
      alert("COMMANDS:\n- purge all\n- purge [name]\n- message_all [text]\n- clear_posts\n- help");
    } 
    else if (cmd === 'purge') {
      if (target === 'all') {
        setDirectory([]);
        localStorage.setItem('chitty_directory_db', JSON.stringify([]));
        alert("CRITICAL: All users purged.");
      } else {
        const updated = directory.filter(u => u.name.toLowerCase() !== target.toLowerCase());
        setDirectory(updated);
        localStorage.setItem('chitty_directory_db', JSON.stringify(updated));
      }
    } 
    else if (cmd === 'message_all') {
      const msg = args.slice(1).join(' ');
      const allMsgs = JSON.parse(localStorage.getItem('chitty_msgs_db')) || [];
      const newMessages = directory.filter(u => u.name !== user.name).map(u => ({
          id: Date.now() + Math.random(),
          from: user.name,
          to: u.name,
          text: msg,
          time: "GLOBAL",
          seen: false
      }));
      localStorage.setItem('chitty_msgs_db', JSON.stringify([...allMsgs, ...newMessages]));
      alert(`Broadcast sent to ${newMessages.length} users.`);
    }
    else if (cmd === 'clear_posts') {
      setPosts([]);
      localStorage.setItem('chitty_posts_db', JSON.stringify([]));
    }
    setCommandText('');
  };

  const handleDeletePost = (post) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const updated = posts.filter(p => p.id !== post.id);
      setPosts(updated);
      localStorage.setItem('chitty_posts_db', JSON.stringify(updated));
      if (isOwner && post.username !== user.name) {
          localStorage.setItem(`notice_for_${post.username}`, "true");
      }
    }
  };

  const handleTeleport = (postId) => {
    setView('feed');
    setTimeout(() => {
      const el = document.getElementById(`post-${postId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const handleSendToFriend = (friend) => {
    if (!sharingPost) return;
    const allMsgs = JSON.parse(localStorage.getItem('chitty_msgs_db')) || [];
    const newMsg = {
      id: Date.now(), from: user.name, to: friend.name, text: "Check out this post!", postLink: sharingPost,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), seen: false
    };
    localStorage.setItem('chitty_msgs_db', JSON.stringify([...allMsgs, newMsg]));
    alert(`Post sent to ${friend.name}!`);
    setIsShareModalOpen(false);
  };

  const handleShare = async (post) => {
    try {
      if (navigator.share) await navigator.share({ title: 'Chitty', text: post.caption, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }
    } catch (err) { console.log(err); }
  };

  const handleRemix = (post) => {
    setPostInput({ img: post.image || '', caption: `Remixing @${post.username}: ` });
    setIsModalOpen(true);
  };

  const handleReplySubmit = (postId) => {
    if (!replyInput.text.trim()) return;
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, replies: [...(p.replies || []), { id: Date.now(), user: user.name, text: replyInput.text }] };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('chitty_posts_db', JSON.stringify(updated));
    setReplyInput({ postId: null, text: '' });
  };

  const handleLike = (postId) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const likes = p.likes || [];
        const hasLiked = likes.includes(user.name);
        return { ...p, likes: hasLiked ? likes.filter(l => l !== user.name) : [...likes, user.name] };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('chitty_posts_db', JSON.stringify(updated));
  };

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem('chitty_user_db', JSON.stringify(userData));
    const currentDir = JSON.parse(localStorage.getItem('chitty_directory_db')) || [];
    if (!currentDir.find(d => d.name === userData.name)) {
      const newDir = [...currentDir, userData];
      setDirectory(newDir);
      localStorage.setItem('chitty_directory_db', JSON.stringify(newDir));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chitty_user_db');
    setUser(null); 
  };

  const createPost = (e) => {
    e.preventDefault();
    const newP = { 
        id: Date.now(), 
        username: user.name, 
        image: postInput.img, 
        caption: postInput.caption, 
        likes: [], 
        replies: [] 
    };
    const updated = [newP, ...posts];
    setPosts(updated);
    localStorage.setItem('chitty_posts_db', JSON.stringify(updated));
    setIsModalOpen(false);
    setPostInput({ caption: '', img: '' });
  };

  const handleViewProfile = (targetUser) => {
    setViewingUser(targetUser);
    setView('user_preview'); 
  };

  const handleGoToChat = (targetUser) => {
    setActiveChatUser(targetUser);
    setView('friends');
    setViewingUser(null);
  };

  const closeNotice = () => {
      localStorage.removeItem(`notice_for_${user.name}`);
      setAdminNotice(false);
  };

  if (!user) return <ChittyAuth onSignIn={handleAuth} />;

  const dynamicBtn = { ...s.btnPrimary, background: `linear-gradient(45deg, ${themeColor}, #555)`, borderRadius: btnRadius };

  const NavItem = ({ icon: Icon, label, viewName, onClick }) => (
    <div 
      style={{...s.navItem, color: view === viewName ? themeColor : '#333', fontWeight: view === viewName ? 'bold' : 'normal', background: view === viewName ? '#f0f0f0' : 'transparent'}} 
      onClick={onClick || (() => { setView(viewName); setViewingUser(null); })}
      className="nav-hover"
    >
      <Icon size={24} />
      <span style={s.navLabel}>{label}</span>
    </div>
  );

  return (
    <div style={{background: '#fafafa', minHeight: '100vh', display: 'flex'}}>
      
      {adminNotice && (
          <div style={s.overlay}>
              <div style={{...s.modal, borderTop: `10px solid ${themeColor}`, textAlign:'center', animation: 'pop 0.3s ease'}}>
                  <Bell size={40} color={themeColor} style={{margin:'0 auto 15px'}} />
                  <h2 style={{color: themeColor, marginBottom:'10px'}}>Notice from the admin</h2>
                  <p style={{fontSize:'16px', color:'#444', lineHeight:'1.5'}}>Your post have got deleted. Please follow the community guidelines.</p>
                  <button style={{...dynamicBtn, marginTop:'20px', width:'100%'}} onClick={closeNotice}>I Understand</button>
              </div>
          </div>
      )}

      <nav style={s.sideNav}>
        <div style={{padding: '20px 0 30px 10px'}}>
            <div className="brand-container">
                <div className="brand-logo"><span className="logo-c">C</span></div>
                <h2 className="brand-text">chitty</h2> 
            </div>
        </div>
        <div style={s.navLinksGroup}>
          <NavItem icon={Home} label="Home" viewName="feed" />
          <NavItem icon={Search} label="Search" viewName="search" />
          <NavItem icon={MessageSquare} label="Messages" viewName="friends" onClick={() => {setView('friends'); setActiveChatUser(null);}} />
          <NavItem icon={LogOut} label="Log Out" onClick={handleLogout} />
          <NavItem icon={User} label="Profile" viewName="profile" />
          <NavItem icon={Heart} label="Favorites" viewName="favorites" />
          <NavItem icon={PlusSquare} label="Create" onClick={() => setIsModalOpen(true)} />
        </div>
        <div style={{marginTop: 'auto', paddingBottom: '20px'}}>
          <NavItem icon={Palette} label="Theme" onClick={() => setIsThemeOpen(true)} />
          <NavItem icon={Settings} label="Settings" viewName="settings" />
        </div>
      </nav>

      <main style={{...s.mainWrapper, paddingBottom: isOwner ? '80px' : '0'}}>
        <div style={s.contentContainer}>
          
          {view === 'profile' ? (
            <Profile themeColor={themeColor} onUpdate={refreshUserData} />
          ) : view === 'user_preview' && viewingUser ? (
            /* UPDATED USER PREVIEW SECTION */
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} className="fade-in">
              <DefaultAvatar size={120} src={viewingUser.profilePic} borderColor={themeColor} />
              <h2 style={{marginTop: '15px', marginBottom: '5px'}}>{viewingUser.name}</h2>
              <p style={{color: '#888', fontSize: '14px', marginBottom: '25px'}}>@{viewingUser.name.toLowerCase().replace(/\s/g, '')}</p>

              {/* NEW STATS BAR: Values calculated dynamically from database */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', padding: '15px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{posts.filter(p => p.username === viewingUser.name).length}</div>
                  <div style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}><Grid size={12}/> Posts</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{viewingUser.friends?.length || 0}</div>
                  <div style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12}/> Friends</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{viewingUser.followers?.length || 0}</div>
                  <div style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}><UserCheck size={12}/> Followers</div>
                </div>
              </div>

              {/* UPDATED BUTTON GRID: Actions now update the database */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '350px', margin: '0 auto' }}>
                <button 
                  style={{...dynamicBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}} 
                  onClick={() => handleSocialAction(viewingUser.name, 'friends')}
                >
                  <UserPlus size={18}/> {viewingUser.friends?.includes(user.name) ? "Unfriend" : "Add"}
                </button>
                <button 
                  style={{...s.btnPrimary, background: '#f0f0f0', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}} 
                  onClick={() => handleSocialAction(viewingUser.name, 'followers')}
                >
                  <UserCheck size={18}/> {viewingUser.followers?.includes(user.name) ? "Unfollow" : "Follow"}
                </button>
                <button style={{...s.btnPrimary, background: '#f0f0f0', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}} onClick={() => handleGoToChat(viewingUser)}>
                  <MessageSquare size={18}/> Message
                </button>
                <button style={{...s.btnPrimary, background: '#ffeded', color: '#ff4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}} onClick={() => setView('feed')}>
                  <X size={18}/> Close
                </button>
              </div>
            </div>
          ) : view === 'friends' ? (
            <ChittyFriends currentUser={user} directory={directory} forcedUser={activeChatUser} onTeleport={handleTeleport} />
          ) : view === 'feed' ? (
            <>
              <div style={s.discovery}>
                <p style={s.label}>Global Discovery</p>
                <div style={s.nodeScroll}>
                  {otherUsers.map(node => (
                    <div key={node.name} style={s.node} onClick={() => handleViewProfile(node)}>
                      <DefaultAvatar size={56} src={node.profilePic} borderColor={themeColor} />
                      <span style={{fontSize:'11px', display: 'block', marginTop: '5px', fontWeight:'bold'}}>{node.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {posts.map(p => {
                const isExpanded = expandedPosts[p.id];
                const repliesToShow = (p.replies || []).slice(0, isExpanded ? p.replies.length : 3);
                const hasMore = p.replies?.length > 3;

                const displayName = p.username === (JSON.parse(localStorage.getItem('chitty_user_db'))?.oldName || user.name) ? user.name : p.username;
                const displayPic = p.username === user.name ? user.profilePic : directory.find(u => u.name === p.username)?.profilePic;

                return (
                  <div key={p.id} id={`post-${p.id}`} style={s.card} className="post-card">
                    <div style={{...s.cardHead, justifyContent: 'space-between'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div onClick={() => handleViewProfile(directory.find(u => u.name === p.username) || {name: p.username, profilePic: displayPic})} style={{cursor: 'pointer'}}>
                           <DefaultAvatar size={32} src={displayPic} borderColor={p.username === "Yousef Jo" ? "#ffd700" : "transparent"} />
                        </div>
                        <span style={{fontWeight:'bold', cursor: 'pointer'}} onClick={() => handleViewProfile(directory.find(u => u.name === p.username) || {name: p.username, profilePic: displayPic})}>{displayName}</span>
                      </div>
                      {(p.username === user.name || isOwner) && 
                        <Trash2 size={20} color="#ff4d4d" style={{cursor:'pointer'}} onClick={() => handleDeletePost(p)} />
                      }
                    </div>

                    {p.video ? (
                      <video src={p.video} controls style={{...s.cardImg, backgroundColor:'#000'}} />
                    ) : (
                      p.image && <img src={p.image} style={s.cardImg} alt="" />
                    )}

                    <div style={{padding:'15px'}}>
                      <p><strong>{displayName}</strong> {p.caption}</p>
                      <div style={{display:'flex', gap:'20px', marginTop:'15px', alignItems: 'center'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                          <Heart size={22} style={{cursor:'pointer'}} fill={p.likes?.includes(user.name) ? '#ff4d4d' : 'none'} color={p.likes?.includes(user.name) ? '#ff4d4d' : '#333'} onClick={() => handleLike(p.id)} />
                          <span style={{fontSize: '14px', fontWeight: 'bold'}}>{p.likes?.length || 0}</span>
                        </div>
                        <MessageSquare size={22} style={{cursor:'pointer'}} onClick={() => setReplyInput({postId: p.id, text: ''})} />
                        <div onClick={() => { setSharingPost(p); setIsShareModalOpen(true); }}><Users size={22} style={{cursor:'pointer', color: themeColor}} /></div>
                        <Repeat size={22} style={{cursor:'pointer'}} onClick={() => handleRemix(p)} />
                        <Share2 size={22} style={{cursor:'pointer'}} onClick={() => handleShare(p)} />
                      </div>

                      <div style={{marginTop: '15px'}}>
                        {isExpanded && hasMore && (
                            <div 
                             style={{display:'flex', alignItems:'center', gap:'5px', color:'#8e8e8e', fontSize:'11px', cursor:'pointer', marginBottom:'8px'}}
                             onClick={() => toggleExpand(p.id)}
                            >
                              <EyeOff size={14} /> Hide all replies
                            </div>
                        )}

                        {repliesToShow.map(r => (
                          <div key={r.id} style={{fontSize:'12px', marginTop:'5px', padding:'4px 8px', background:'#f9f9f9', borderRadius:'5px'}}>
                            <strong>{r.user}</strong> {r.text}
                          </div>
                        ))}

                        {hasMore && !isExpanded && (
                          <div 
                            style={{color: themeColor, fontSize:'12px', fontWeight:'bold', cursor:'pointer', marginTop:'8px', display:'flex', alignItems:'center', gap:'4px'}}
                            onClick={() => toggleExpand(p.id)}
                          >
                            <ChevronDown size={14} /> Show more ({p.replies.length - 3} more)
                          </div>
                        )}
                      </div>

                      <input style={{...s.input, width:'100%', marginTop:'10px'}} placeholder="Add reply..." 
                        value={replyInput.postId === p.id ? replyInput.text : ''} 
                        onChange={e => setReplyInput({postId: p.id, text: e.target.value})}
                        onKeyDown={e => e.key === 'Enter' && handleReplySubmit(p.id)} />
                    </div>
                  </div>
                );
              })}
            </>
          ) : view === 'search' ? (
            <SearchPage directory={directory} posts={posts} themeColor={themeColor} handleViewProfile={handleViewProfile} />
          ) : view === 'favorites' ? (
            <FavoritePage posts={posts} currentUser={user} themeColor={themeColor} handleLike={handleLike} />
          ) : view === 'settings' ? (
            <Set themeColor={themeColor} user={user} setUser={setUser} />
          ) : null}
        </div>
      </main>

      {/* ADMIN COMMAND BAR */}
      {isOwner && (
        <div style={{...s.commandBar, borderTop: `2px solid ${themeColor}`}}>
          <Terminal size={18} color={themeColor} style={{marginRight: '12px'}} />
          <form onSubmit={handleRunCommand} style={{flex: 1}}>
            <input 
              style={{...s.commandInput, color: themeColor}} 
              placeholder="root@chitty:~$ type help" 
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
            />
          </form>
        </div>
      )}

      {/* THEME MODAL */}
      {isThemeOpen && (
        <div style={s.overlay} onClick={() => setIsThemeOpen(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{fontWeight:'bold', marginBottom:'10px'}}>Customize Theme</h3>
            <label style={{fontSize:'14px', display:'block', marginBottom:'10px'}}>Select your accent color:</label>
            <input type="color" style={{width:'100%', height:'40px', cursor:'pointer', border:'none', borderRadius:'8px'}} value={themeColor} onChange={e => setThemeColor(e.target.value)} />
            <button style={dynamicBtn} onClick={() => setIsThemeOpen(false)}>Apply Changes</button>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {isShareModalOpen && (
        <div style={s.overlay} onClick={() => setIsShareModalOpen(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{fontWeight:'bold', marginBottom:'10px'}}>Send to Friends</h3>
            <div style={{maxHeight:'300px', overflowY:'auto'}}>
              {otherUsers.map(f => (
                <div key={f.name} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px', cursor:'pointer', borderBottom:'1px solid #eee'}} onClick={() => handleSendToFriend(f)}>
                  <DefaultAvatar size={30} src={f.profilePic} /> <span>{f.name}</span>
                </div>
              ))}
            </div>
            <button style={{...s.btnPrimary, background:'#666', marginTop:'10px'}} onClick={() => setIsShareModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* CREATE POST MODAL */}
      {isModalOpen && (
        <div style={s.overlay} onClick={() => setIsModalOpen(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{fontWeight:'bold', marginBottom:'10px'}}>New Post</h3>
            <input style={s.input} placeholder="Image URL" value={postInput.img} onChange={e => setPostInput({...postInput, img: e.target.value})} />
            <textarea style={{...s.input, height:'80px', resize:'none'}} placeholder="Caption" value={postInput.caption} onChange={e => setPostInput({...postInput, caption: e.target.value})} />
            <button style={dynamicBtn} onClick={createPost}>Share with Friends</button>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  sideNav: { width: '240px', height: '100vh', position: 'fixed', left: 0, top: 0, borderRight: '1px solid #dbdbdb', display: 'flex', flexDirection: 'column', padding: '10px 15px', backgroundColor: '#fff', zIndex: 1000 },
  navItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 10px', margin: '4px 0', borderRadius: '10px', cursor: 'pointer', transition: '0.2s' },
  navLabel: { fontSize: '16px' },
  mainWrapper: { marginLeft: '240px', width: 'calc(100% - 240px)', display: 'flex', justifyContent: 'center' },
  contentContainer: { width: '100%', maxWidth: '600px', padding: '40px 20px' },
  discovery: { padding:'10px 0', marginBottom:'20px', borderBottom: '1px solid #efefef' },
  label: { fontSize:'12px', fontWeight:'bold', color:'#8e8e8e', marginBottom:'10px', textTransform:'uppercase' },
  nodeScroll: { display:'flex', gap:'15px', overflowX:'auto', paddingBottom:'5px' },
  node: { textAlign:'center', cursor:'pointer', minWidth:'65px' },
  card: { border:'1px solid #dbdbdb', borderRadius:'15px', marginBottom:'25px', background:'#fff', boxShadow: '0 2px 15px rgba(0,0,0,0.03)', overflow:'hidden' },
  cardHead: { padding:'12px', display:'flex', alignItems:'center', gap:'10px' },
  cardImg: { width:'100%', maxHeight:'600px', objectFit:'cover' },
  commandBar: { position: 'fixed', bottom: 0, left: '240px', right: 0, height: '60px', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', padding: '0 25px', zIndex: 5000 },
  commandInput: { background: 'transparent', border: 'none', width: '100%', outline: 'none', fontFamily: 'monospace', fontSize: '15px' },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:6000, backdropFilter: 'blur(3px)' },
  modal: { background:'#fff', padding:'25px', borderRadius:'18px', width:'400px', display:'flex', flexDirection:'column', gap:'15px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
  input: { padding:'12px', border:'1px solid #dbdbdb', borderRadius:'8px', background: '#fafafa' },
  btnPrimary: { color:'#fff', border:'none', padding:'12px', borderRadius:'10px', fontWeight:'bold', cursor:'pointer', transition:'0.3s' }
};
  
export default Admin;