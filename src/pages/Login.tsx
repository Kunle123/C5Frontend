import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login({ email, password });
    localStorage.setItem('token', res.token);
    navigate('/dashboard');
  };

  return (
    <div>Login component</div>
  );
};

export default Login; 