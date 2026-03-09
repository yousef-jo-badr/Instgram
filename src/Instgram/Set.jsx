import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Moon, ChevronRight } from 'lucide-react';
// 1. Import useNavigate
import { useNavigate } from 'react-router-dom';

const Set = ({ user: initialUser, themeColor = '#0095f6', onClose }) => {
  // 2. Initialize navigate
  const navigate = useNavigate();

  const [user, setUser] = useState(initialUser || { name: 'Chitty User', avatar: 'https://via.placeholder.com/150' });
  const [settings, setSettings] = useState({
    notifications: true,
    privateAccount: false,
    darkMode: false
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    const bg = settings.darkMode ? '#121212' : '#fafafa';
    const text = settings.darkMode ? '#ffffff' : '#262626';

    body.style.backgroundColor = bg;
    body.style.color = text;
    root.style.backgroundColor = bg; 
    
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    return () => {
      body.style.backgroundColor = '';
      body.style.color = '';
    };
  }, [settings.darkMode]);

  const handleEditName = () => {
    const newName = prompt("Enter your new name:", user.name);
    if (newName && newName.trim() !== "") {
      setUser({ ...user, name: newName });
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 3. Navigation handler
  const handleLogout = () => {
    navigate('/Logtochit');
  };

  const isDark = settings.darkMode;
  const cardColor = isDark ? '#1e1e1e' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#262626';
  const borderColor = isDark ? '#333' : '#dbdbdb';

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px', 
      color: textColor,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '15px' }}>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textColor }}
        >
          ←
        </button>
        <h2 style={{ margin: 0 }}>Settings</h2>
      </div>

      <div style={{ 
        background: cardColor, 
        borderRadius: '12px', 
        border: `1px solid ${borderColor}`, 
        overflow: 'hidden',
        boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        
        <div 
          onClick={handleEditName}
          style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            padding: '20px', borderBottom: `1px solid ${borderColor}`, cursor: 'pointer' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={user.avatar} 
              style={{ width: 55, height: 55, borderRadius: '50%', marginRight: '15px', border: `2px solid ${themeColor}`, objectFit: 'cover' }} 
              alt="Avatar" 
            />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: '#8e8e8e' }}>Tap to change name</div>
            </div>
          </div>
          <ChevronRight size={20} color="#ccc" />
        </div>

        <SettingItem 
          icon={Bell} 
          label="Notifications" 
          active={settings.notifications} 
          onClick={() => toggleSetting('notifications')}
          isDark={isDark}
        />
        <SettingItem 
          icon={Shield} 
          label="Private Account" 
          active={settings.privateAccount} 
          onClick={() => toggleSetting('privateAccount')}
          isDark={isDark}
        />
        <SettingItem 
          icon={Moon} 
          label="Dark Mode" 
          active={settings.darkMode} 
          onClick={() => toggleSetting('darkMode')}
          isDark={isDark}
        />
        
        {/* 4. Log Out button now calls handleLogout */}
        <SettingItem 
          icon={User} 
          label="Log Out" 
          onClick={handleLogout}
          isDark={isDark}
          destructive
        />
      </div>

      <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '30px' }}>
        Chitty Version 1.0.4 (2026)
      </p>
    </div>
  );
};

const SettingItem = ({ icon: Icon, label, active, onClick, isDark, destructive }) => {
  const [hover, setHover] = useState(false);

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '15px', borderBottom: isDark ? '1px solid #333' : '1px solid #efefef',
        cursor: 'pointer', 
        backgroundColor: hover ? (isDark ? '#2a2a2a' : '#fafafa') : 'transparent',
        transition: 'background-color 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          width: '36px', height: '36px', borderRadius: '10px', 
          backgroundColor: isDark ? '#333' : '#f5f5f5', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' 
        }}>
          <Icon size={18} color={destructive ? '#ff3b30' : (isDark ? '#bbb' : '#555')} />
        </div>
        <span style={{ 
          fontWeight: '500', 
          color: destructive ? '#ff3b30' : (isDark ? '#fff' : '#262626') 
        }}>
          {label}
        </span>
      </div>
      
      {active !== undefined ? (
        <div style={{ 
          width: '40px', height: '22px', borderRadius: '20px', 
          backgroundColor: active ? '#4cd964' : (isDark ? '#444' : '#ccc'),
          position: 'relative', transition: '0.3s'
        }}>
          <div style={{ 
            width: '18px', height: '18px', backgroundColor: '#fff', borderRadius: '50%',
            position: 'absolute', top: '2px', left: active ? '20px' : '2px', transition: '0.3s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }} />
        </div>
      ) : (
        <ChevronRight size={18} color="#ccc" />
      )}
    </div>
  );
};

export default Set;