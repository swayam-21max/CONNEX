import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContactProvider, useContacts } from './context/ContactContext';
import ContactsPage from './pages/ContactsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

/**
 * Navbar — responsive to auth state.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <div className="logo-icon">C</div>
          <span className="brand-name">CONNEX</span>
        </Link>

        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link to="/dashboard" className="nav-link" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Dashboard</Link>
              <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user.name}</div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px' }}>Sign In</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px' }}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

/**
 * ToastContainer — renders the global toast notification.
 */
const ToastContainer = () => {
  const { toast, dispatch } = useContacts();
  if (!toast) return null;
  return (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => dispatch({ type: 'CLEAR_TOAST' })}
    />
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ContactProvider>
        <div className="connex-app">
          <Navbar />
          <ToastContainer />
          
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <ContactsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                  <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>404</h2>
                  <p style={{ marginBottom: '40px' }}>Lost in space? Let's get you back.</p>
                  <Link to="/" className="btn btn-primary">Return Home</Link>
                </div>
              } />
            </Routes>
          </main>

          <footer className="container" style={{ borderTop: '1px solid var(--border-color)', marginTop: '80px', padding: '40px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              CONNEX &copy; {new Date().getFullYear()} &bull; Built with MERN Stack
            </p>
          </footer>
        </div>
      </ContactProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
