import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    // ...login logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md bg-card shadow-card rounded-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-card-foreground mb-2">Sign in to your account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email address</label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full" />
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <Button type="submit" className="w-full mt-2">Sign in</Button>
        </form>
        <div className="flex justify-between items-center mt-4">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
          <span className="text-sm text-muted-foreground">or</span>
          <Link to="/signup" className="text-sm text-primary hover:underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
} 