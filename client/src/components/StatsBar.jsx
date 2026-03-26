import { useContacts } from '../context/ContactContext';

/**
 * StatsBar Component
 * Displays real-time metrics for contacts: Total, Favorites, and current Search Results.
 */
const StatsBar = () => {
  const { stats } = useContacts();

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-label">Total</span>
        <span className="stat-value">{stats.total}</span>
      </div>
      <div className="divider" style={{ width: '1px', background: 'var(--border-color)' }} />
      <div className="stat-item">
        <span className="stat-label">Favorites</span>
        <span className="stat-value">{stats.favorites}</span>
      </div>
      <div className="divider" style={{ width: '1px', background: 'var(--border-color)' }} />
      <div className="stat-item">
        <span className="stat-label">Showing</span>
        <span className="stat-value">{stats.showing}</span>
      </div>
    </div>
  );
};

export default StatsBar;
