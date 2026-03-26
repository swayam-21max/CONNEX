import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="landing-badge">v1.0 is now live</div>
        <h1 className="landing-title">
          Professional Contact <br />
          Management for <span className="gradient-text">Elite Teams.</span>
        </h1>
        <p className="landing-subtitle">
          Elevate your professional network with CONNEX. A premium, secure, and 
          sophisticated platform designed for rapid contact organization.
        </p>
        <div className="landing-actions">
          <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
          <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
        </div>
      </div>
      
      <div className="landing-visual">
        <div className="visual-card-1"></div>
        <div className="visual-card-2"></div>
        <div className="visual-glow"></div>
      </div>

      <style>{`
        .landing-page {
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 80px 24px;
          gap: 60px;
          overflow: hidden;
        }
        .landing-content {
          max-width: 600px;
          flex: 1;
        }
        .landing-badge {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(0, 229, 160, 0.1);
          color: var(--accent-primary);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 24px;
          border: 1px solid rgba(0, 229, 160, 0.2);
        }
        .landing-title {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -2px;
        }
        .gradient-text {
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .landing-subtitle {
          font-size: 1.25rem;
          margin-bottom: 40px;
          color: var(--text-secondary);
        }
        .landing-actions {
          display: flex;
          gap: 20px;
        }
        .btn-lg {
          padding: 16px 32px;
          font-size: 1.1rem;
        }

        .landing-visual {
          flex: 1;
          position: relative;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .visual-card-1 {
          width: 320px;
          height: 180px;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          transform: rotate(-12deg) translateX(-40px);
          position: relative;
          z-index: 2;
          box-shadow: var(--shadow-lg);
        }
        .visual-card-2 {
          width: 320px;
          height: 180px;
          background: var(--accent-gradient);
          opacity: 0.1;
          border: 1px solid var(--accent-primary);
          border-radius: 20px;
          position: absolute;
          transform: rotate(8deg) translateX(40px);
          z-index: 1;
        }
        .visual-glow {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(0, 229, 160, 0.1) 0%, transparent 70%);
          z-index: 0;
        }

        @media (max-width: 992px) {
          .landing-page { flex-direction: column; text-align: center; padding: 40px 24px; }
          .landing-title { font-size: 3rem; }
          .landing-actions { justify-content: center; }
          .landing-visual { width: 100%; height: 300px; margin-top: 40px; }
          .visual-card-1, .visual-card-2 { width: 240px; height: 140px; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
