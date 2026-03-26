import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Enter your credentials to access your dashboard</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@company.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create account</Link>
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: calc(100vh - 160px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 40px;
          box-shadow: var(--shadow-lg);
        }
        .auth-header { text-align: center; margin-bottom: 32px; }
        .auth-header h1 { font-size: 2rem; margin-bottom: 8px; letter-spacing: -0.5px; }
        .auth-header p { font-size: 0.95rem; color: var(--text-secondary); }
        
        .auth-error {
          padding: 12px;
          background: rgba(255, 68, 68, 0.1);
          color: var(--danger-color);
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 0.9rem;
          text-align: center;
          border: 1px solid rgba(255, 68, 68, 0.2);
        }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .w-100 { width: 100%; height: 48px; }

        .auth-footer {
          margin-top: 32px;
          text-align: center;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .auth-footer a {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
