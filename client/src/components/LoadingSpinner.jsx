/**
 * LoadingSpinner Component
 * Full-viewport centered spinner for initial load states.
 */
const LoadingSpinner = ({ message = 'Loading contacts...' }) => (
  <div className="loading-overlay">
    <div className="spinner" role="status" aria-label={message}>
      <div className="spinner-ring" />
    </div>
    <p className="loading-text">{message}</p>
  </div>
);

export default LoadingSpinner;
