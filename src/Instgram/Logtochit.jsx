import React, { useState } from 'react';

const ChittyAuth = ({ onSignIn }) => {
  const [step, setStep] = useState('login'); 
  const [form, setForm] = useState({ name: '', password: '' });

  const handleAction = (e) => {
    e.preventDefault();
    
    // THE SECRET CHECK
    const isSecretOwner = form.name === "yousef jo" && form.password === "the owner";

    if (isSecretOwner) {
      const ownerUser = {
        name: "Yousef Jo",
        password: "the owner",
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=yousef`,
        friends: [],
        isOwner: true // This flag unlocks the command bar later
      };
      onSignIn(ownerUser);
      return;
    }

    const directory = JSON.parse(localStorage.getItem('chitty_directory_db')) || [];
    
    if (step === 'login') {
      const existing = directory.find(u => u.name === form.name && u.password === form.password);
      if (existing) {
        onSignIn({ ...existing, isOwner: false });
      } else {
        alert("Wrong credentials!");
      }
    } else {
      const newUser = { 
        name: form.name, 
        password: form.password, 
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${form.name}`,
        friends: [],
        isOwner: false 
      };
      // Save to DB and sign in
      const updatedDir = [...directory, newUser];
      localStorage.setItem('chitty_directory_db', JSON.stringify(updatedDir));
      onSignIn(newUser);
    }
  };

  return (
    <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:'#f4f4f7'}}>
      <div style={{background:'#fff', padding:'30px', borderRadius:'12px', width:'300px', textAlign:'center', border:'1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
        <h2 style={{margin: '0 0 20px 0', color: '#333'}}>{step === 'login' ? 'Login' : 'Join'}</h2>
        <form onSubmit={handleAction} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <input 
            style={{padding:'12px', border:'1px solid #ddd', borderRadius:'8px', outline: 'none'}} 
            placeholder="Name" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
          />
          <input 
            style={{padding:'12px', border:'1px solid #ddd', borderRadius:'8px', outline: 'none'}} 
            type="password" 
            placeholder="Key" 
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})} 
            required 
          />
          <button 
            type="submit" 
            style={{background:'#007bff', color:'#fff', border:'none', padding:'12px', borderRadius:'8px', cursor:'pointer', fontWeight: 'bold', marginTop: '10px'}}
          >
            Continue
          </button>
        </form>
        <p 
          onClick={() => setStep(step === 'login' ? 'register' : 'login')} 
          style={{color:'#007bff', cursor:'pointer', marginTop:'20px', fontSize: '14px'}}
        >
          {step === 'login' ? "Don't have an account? Join" : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default ChittyAuth;