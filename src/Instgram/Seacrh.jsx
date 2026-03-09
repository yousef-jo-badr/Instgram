import React, { useState } from 'react';
import { Search as SearchIcon, User, Heart, MessageSquare } from 'lucide-react';

const SearchPage = ({ directory, posts, themeColor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering Logic
  const filteredUsers = searchTerm 
    ? directory.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const filteredPosts = searchTerm 
    ? posts.filter(p => p.caption.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const styles = {
    container: { width: '100%' },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      background: '#efefef',
      padding: '10px 15px',
      borderRadius: '10px',
      marginBottom: '30px'
    },
    input: {
      background: 'none',
      border: 'none',
      outline: 'none',
      marginLeft: '10px',
      width: '100%',
      fontSize: '16px'
    },
    sectionTitle: { fontSize: '14px', fontWeight: 'bold', color: '#8e8e8e', margin: '20px 0 10px' },
    userResult: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 0',
      borderBottom: '1px solid #f0f0f0'
    },
    postResult: {
      padding: '12px',
      border: '1px solid #dbdbdb',
      borderRadius: '8px',
      marginBottom: '10px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchBar}>
        <SearchIcon size={20} color="#8e8e8e" />
        <input 
          style={styles.input} 
          placeholder="Search for people or posts..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      </div>

      {searchTerm && (
        <>
          {/* Users Results */}
          <h3 style={styles.sectionTitle}>PEOPLE</h3>
          {filteredUsers.length > 0 ? filteredUsers.map(u => (
            <div key={u.name} style={styles.userResult}>
              <img src={u.avatar} style={{width: 40, height: 40, borderRadius: '50%'}} alt="" />
              <span style={{fontWeight: '600'}}>{u.name}</span>
            </div>
          )) : <p style={{color: '#999', fontSize: '14px'}}>No users found.</p>}

          {/* Posts Results */}
          <h3 style={styles.sectionTitle}>POSTS</h3>
          {filteredPosts.length > 0 ? filteredPosts.map(p => (
            <div key={p.id} style={styles.postResult}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <img src={p.avatar} style={{width: 24, height: 24, borderRadius: '50%'}} alt="" />
                <small><strong>{p.username}</strong></small>
              </div>
              <p style={{margin: '5px 0', fontSize: '14px'}}>{p.caption}</p>
              <div style={{display: 'flex', gap: '10px', color: '#666'}}>
                 <small><Heart size={14} /> {p.likes?.length || 0}</small>
                 <small><MessageSquare size={14} /> {p.replies?.length || 0}</small>
              </div>
            </div>
          )) : <p style={{color: '#999', fontSize: '14px'}}>No posts found matching that word.</p>}
        </>
      )}
    </div>
  );
};

export default SearchPage;