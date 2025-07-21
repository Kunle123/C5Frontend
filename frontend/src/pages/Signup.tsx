import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    // ...signup logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md bg-card shadow-card rounded-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-card-foreground mb-2">Create your account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
            <Input id="name" type="text" autoComplete="name" required value={name} onChange={e => setName(e.target.value)} className="w-full" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email address</label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <Input id="password" type="password" autoComplete="new-password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full" />
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <Button type="submit" className="w-full mt-2">Sign up</Button>
        </form>
        <div className="flex justify-center items-center mt-4">
          <span className="text-sm text-muted-foreground">Already have an account?</span>
          <Link to="/login" className="ml-2 text-sm text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
} 