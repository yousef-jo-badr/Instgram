import React, { useState, useEffect } from 'react';
import { Send, ExternalLink, Trash2, Copy, ShieldAlert, X, Ghost } from 'lucide-react';

const ChittyFriends = ({ currentUser, directory, forcedUser, onTeleport }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [msgText, setMsgText] = useState('');
  const [activeNotice, setActiveNotice] = useState(null); // For the Popup
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chitty_msgs_db');
    return saved ? JSON.parse(saved) : [];
  });

  // OWNER CHECK
  const isOwner = currentUser?.name?.toLowerCase() === "yousef jo" && currentUser?.password === "the owner";

  // --- EFFECT: Check for Admin Notices on Login/Refresh ---
  useEffect(() => {
    const allNotices = JSON.parse(localStorage.getItem('chitty_notices')) || [];
    const myNotice = allNotices.find(n => n.targetUser === currentUser.name);
    if (myNotice) {
      setActiveNotice(myNotice);
    }
  }, [currentUser.name]);

  useEffect(() => {
    localStorage.setItem('chitty_msgs_db', JSON.stringify(messages));
  }, [messages]);

  // --- SIDEBAR FILTER: Only show people you have messaged ---
  const messagedUserNames = messages.reduce((acc, m) => {
    if (m.from === currentUser.name) acc.add(m.to);
    if (m.to === currentUser.name) acc.add(m.from);
    return acc;
  }, new Set());

  const sidebarList = directory.filter(d => 
    messagedUserNames.has(d.name) || (forcedUser && d.name === forcedUser.name)
  );

  useEffect(() => {
    if (forcedUser) setActiveChat(forcedUser);
    else if (!activeChat && sidebarList.length > 0) setActiveChat(sidebarList[0]);
  }, [forcedUser, sidebarList.length]);

  // --- DELETE LOGIC: Admin creates a hidden notice for the victim ---
  const deleteMsg = (msg) => {
    const isMyOwn = msg.from === currentUser.name;

    if (isOwner && !isMyOwn) {
      if (window.confirm("Delete this and send a Login Alert to this user?")) {
        const notices = JSON.parse(localStorage.getItem('chitty_notices')) || [];
        const newNotice = {
          id: Date.now(),
          targetUser: msg.from,
          deletedText: msg.text,
          deletedImg: msg.postLink?.image || msg.image || null,
        };
        localStorage.setItem('chitty_notices', JSON.stringify([...notices, newNotice]));
        setMessages(prev => prev.filter(m => m.id !== msg.id));
      }
    } else {
      if (window.confirm("Delete your message?")) {
        setMessages(prev => prev.filter(m => m.id !== msg.id));
      }
    }
  };

  const closeNotice = () => {
    const allNotices = JSON.parse(localStorage.getItem('chitty_notices')) || [];
    const filtered = allNotices.filter(n => n.id !== activeNotice.id);
    localStorage.setItem('chitty_notices', JSON.stringify(filtered));
    setActiveNotice(null);
  };

  const sendMsg = (e) => {
    e.preventDefault();
    if (!msgText.trim() || !activeChat) return;
    const newMsg = {
      id: Date.now(),
      from: currentUser.name,
      to: activeChat.name,
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setMsgText('');
  };

  const currentConvo = messages.filter(m => 
    (m.from === currentUser.name && m.to === activeChat?.name) ||
    (m.to === currentUser.name && m.from === activeChat?.name)
  );

  return (
    <div style={s.container}>
      
      {/* --- THE COOL ADMIN ALERT MODAL --- */}
      {activeNotice && (
        <div style={s.alertOverlay}>
          <div style={s.alertBox}>
            <button onClick={closeNotice} style={s.closeX}><X size={20} /></button>
            <div style={s.alertHeader}>
              <ShieldAlert size={40} color="#ff4d4d" />
              <h2 style={{margin:'10px 0 5px'}}>Notice from the admin</h2>
            </div>
            
            <div style={s.evidenceContainer}>
              <p style={{fontSize:'11px', color:'#888', textTransform:'uppercase', marginBottom:'8px'}}>Deleted Content:</p>
              {activeNotice.deletedImg && <img src={activeNotice.deletedImg} style={s.alertImg} alt="" />}
              <p style={{fontSize:'14px', fontWeight:'500', marginTop:'10px'}}>"{activeNotice.deletedText}"</p>
            </div>

            <p style={s.warningText}>
              Your message got deleted from admin, respect the rules 😊
            </p>
            <button style={s.understandBtn} onClick={closeNotice}>I Understand</button>
          </div>
        </div>
      )}

      <div style={s.sidebar}>
        <h3 style={s.sidebarTitle}>CHATS</h3>
        {sidebarList.map(f => (
          <div key={f.name} onClick={() => setActiveChat(f)} 
            style={{...s.friendItem, background: activeChat?.name === f.name ? '#f0f2f5' : 'transparent'}}>
            <img src={f.avatar || 'https://via.placeholder.com/35'} style={s.av} alt="" />
            <span style={{fontSize:'13px', fontWeight: activeChat?.name === f.name ? 'bold' : 'normal'}}>{f.name}</span>
          </div>
        ))}
      </div>

      <div style={s.chatArea}>
        {activeChat ? (
          <>
            <div style={s.chatHeader}>
              <img src={activeChat.avatar || 'https://via.placeholder.com/35'} style={s.av} alt="" />
              <span style={{fontWeight:'bold'}}>{activeChat.name}</span>
            </div>

            <div style={s.msgList}>
              {currentConvo.map(m => {
                const isMyMessage = m.from === currentUser.name;
                return (
                  <div key={m.id} style={{
                    ...s.msgBubble, 
                    alignSelf: isMyMessage ? 'flex-end' : 'flex-start', 
                    background: isMyMessage ? '#007bff' : '#f0f0f0', 
                    color: isMyMessage ? '#fff' : '#000',
                  }}>
                    {m.postLink?.image && <img src={m.postLink.image} style={s.previewImg} alt="" />}
                    <div>{m.text}</div>
                    <div style={s.msgFooter}>
                      <div style={{display:'flex', gap:'10px'}}>
                        <Copy size={12} style={{cursor:'pointer'}} onClick={() => {navigator.clipboard.writeText(m.text); alert("Copied!")}} />
                        {(isMyMessage || isOwner) && (
                          <Trash2 size={12} style={{cursor:'pointer'}} onClick={() => deleteMsg(m)} />
                        )}
                      </div>
                      <span style={{fontSize:'8px'}}>{m.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendMsg} style={s.inputRow}>
              <input style={s.input} value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type a message..." />
              <button type="submit" style={s.sendBtn}><Send size={16}/></button>
            </form>
          </>
        ) : (
          <div style={s.emptyState}>
             <Ghost size={48} color="#ddd" />
             <p>Pick someone to talk to, bruh.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  container: { display:'flex', background:'#fff', height:'80vh', border:'1px solid #dbdbdb', borderRadius:'15px', overflow:'hidden', position:'relative' },
  sidebar: { width:'220px', borderRight:'1px solid #dbdbdb', padding:'15px', background:'#fafafa' },
  sidebarTitle: { fontSize:'11px', color:'#999', marginBottom:'15px', letterSpacing:'1px' },
  friendItem: { display:'flex', alignItems:'center', gap:'10px', padding:'10px', cursor:'pointer', borderRadius:'10px' },
  av: { width:'35px', height:'35px', borderRadius:'50%', objectFit:'cover' },
  chatArea: { flex:1, display:'flex', flexDirection:'column' },
  chatHeader: { padding:'15px', borderBottom:'1px solid #dbdbdb', display:'flex', alignItems:'center', gap:'10px' },
  msgList: { flex:1, padding:'20px', display:'flex', flexDirection:'column', gap:'12px', overflowY:'auto' },
  msgBubble: { padding:'12px', borderRadius:'15px', maxWidth:'70%', fontSize:'14px' },
  msgFooter: { display:'flex', justifyContent:'space-between', marginTop:'6px', opacity:0.6, paddingTop:'4px', borderTop:'1px solid rgba(0,0,0,0.05)' },
  previewImg: { width:'100%', borderRadius:'8px', marginBottom:'5px' },
  inputRow: { padding:'15px', borderTop:'1px solid #dbdbdb', display:'flex', gap:'10px' },
  input: { flex:1, border:'1px solid #ddd', borderRadius:'20px', padding:'10px 15px', outline:'none' },
  sendBtn: { background:'#007bff', color:'#fff', border:'none', borderRadius:'50%', width:'40px', height:'40px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' },
  emptyState: { margin:'auto', textAlign:'center', color:'#ccc' },

  // --- ALERT UI STYLES ---
  alertOverlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:9999 },
  alertBox: { background:'#fff', width:'380px', padding:'30px', borderRadius:'25px', textAlign:'center', position:'relative', boxShadow:'0 20px 50px rgba(0,0,0,0.5)' },
  closeX: { position:'absolute', top:'15px', right:'15px', background:'none', border:'none', cursor:'pointer', color:'#bbb' },
  alertHeader: { marginBottom:'20px' },
  evidenceContainer: { background:'#f8f9fa', padding:'15px', borderRadius:'15px', border:'1px solid #eee', marginBottom:'20px' },
  alertImg: { width:'100%', maxHeight:'180px', objectFit:'cover', borderRadius:'10px', filter:'grayscale(0.5)' },
  warningText: { fontSize:'15px', fontWeight:'700', color:'#333', marginBottom:'20px' },
  understandBtn: { width:'100%', padding:'15px', background:'linear-gradient(45deg, #ff4d4d, #f9cb28)', color:'#fff', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer', fontSize:'16px' }
};

export default ChittyFriends;