import { useContacts } from '../context/ContactContext';

/**
 * EmptyState Component — CONNEX Edition
 * Shown when no contacts match the current filters or search results.
 */
const EmptyState = ({ searchQuery }) => {
  const { showFavorites } = useContacts();

  return (
    <div className="container" style={{ textAlign: 'center', padding: '100px 24px' }}>
      <div 
        style={{ 
          fontSize: '4rem', 
          marginBottom: '24px', 
          opacity: 0.2,
          background: 'var(--accent-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {showFavorites ? '★' : '👤'}
      </div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
        {showFavorites ? 'No Favorites Yet' : 'No Contacts Found'}
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 32px' }}>
        {showFavorites 
          ? "Start starring your most important contacts to see them here." 
          : "Try adjusting your search or add a new contact to get started."}
      </p>
    </div>
  );
};

export default EmptyState;
