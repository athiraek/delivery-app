import React, { useState } from 'react';
import { supabase } from '../../../../supabase-client';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css'; // optional custom styling

const AuthModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // ✅ new state for name
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    const { data, error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) return alert(error.message);

    if (isSignUp && data.user) {
      // ✅ store name along with user profile
      await supabase.from('profiles').insert([
        { id: data.user.id, name: name, is_admin: false }
      ]);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', data.user.id)
      .single();

    onClose(); // Close the modal after login/signup

    profile?.is_admin
      ? navigate('/admin')
      : navigate('/user-dashboard');
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{isSignUp ? 'Register' : 'Login'}</h2>

        {/* ✅ Show name field only during signup */}
        {isSignUp && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={handleAuth}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>

        <p onClick={() => setIsSignUp(!isSignUp)} style={{ cursor: 'pointer' }}>
          {isSignUp ? 'Already have an account? Login' : 'Don’t have an account? Sign up'}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
