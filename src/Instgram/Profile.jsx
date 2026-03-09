import React, { useState } from 'react';
import { Camera, Check, Grid, Users, UserPlus, UserCheck, MessageCircle, X } from 'lucide-react';

const Profile = ({ themeColor, onUpdate, onClose }) => {
  const [userData, setUserData] = useState(() => 
    JSON.parse(localStorage.getItem('chitty_user_db'))
  );
  
  // Database logic: Get fresh data from directory to ensure stats like followers are live
  const directory = JSON.parse(localStorage.getItem('chitty_directory_db')) || [];
  const liveUser = directory.find(u => u.name === userData?.name) || userData;

  const [tempName, setTempName] = useState(liveUser?.name || '');
  const [tempImg, setTempImg] = useState(liveUser?.profilePic || '');

  // Calculate Stats dynamically from the databases
  const allPosts = JSON.parse(localStorage.getItem('chitty_posts_db')) || [];
  const postCount = allPosts.filter(p => p.username === liveUser?.name).length;
  const friendCount = liveUser?.friends?.length || 0;
  const followerCount = liveUser?.followers?.length || 0; 

  const compressImage = (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
      };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result);
        setTempImg(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      const updated = { ...liveUser, name: tempName, profilePic: tempImg };
      localStorage.setItem('chitty_user_db', JSON.stringify(updated));
      
      const updatedDir = directory.map(u => u.name === liveUser.name ? updated : u);
      localStorage.setItem('chitty_directory_db', JSON.stringify(updatedDir));

      alert("Profile Updated Successfully!");
      onUpdate();
    } catch (error) {
      alert("Storage Full! Try a smaller image.");
    }
  };

  return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Profile Details</h2>
      
      <div style={{ position: 'relative', width: '120px', margin: '0 auto 20px' }}>
        {tempImg ? (
          <img src={tempImg} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${themeColor}` }} />
        ) : (
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={40} color="#ccc" />
          </div>
        )}
        <label style={{ position: 'absolute', bottom: '5px', right: '5px', backgroundColor: themeColor, padding: '8px', borderRadius: '50%', cursor: 'pointer', color: '#fff' }}>
          <Camera size={16} />
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>

      {/* STATS SECTION: Updated with dynamic variables */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '30px', padding: '15px', background: '#fff', borderRadius: '15px', border: '1px solid #eee' }}>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{postCount}</div>
          <div style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}><Grid size={12}/> Posts</div>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{friendCount}</div>
          <div style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12}/> Friends</div>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{followerCount}</div>
          <div style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}><UserCheck size={12}/> Followers</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '320px', margin: '0 auto 25px' }}>
        <button style={{ backgroundColor: themeColor, color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <UserPlus size={16} /> Add
        </button>
        <button style={{ backgroundColor: '#f0f0f0', color: '#333', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <UserCheck size={16} /> Follow
        </button>
        <button style={{ backgroundColor: '#f0f0f0', color: '#333', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <MessageCircle size={16} /> Message
        </button>
        <button onClick={onClose} style={{ backgroundColor: '#ffeded', color: '#ff4444', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <X size={16} /> Close
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '320px', margin: '0 auto', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <div style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#aaa', textTransform: 'uppercase' }}>Edit Display Name</label>
          <input 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dbdbdb', marginTop: '5px' }}
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
          />
        </div>
        <button onClick={handleSave} style={{ backgroundColor: themeColor, color: '#fff', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Check size={18} /> Update Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;