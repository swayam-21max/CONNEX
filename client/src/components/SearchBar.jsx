/**
 * SearchBar Component
 * Controlled input for filtering contacts by name, email, or company.
 * Debouncing is handled by the parent (useDebounce hook).
 *
 * Props:
 *   value    {string}
 *   onChange {function}
 */
import { useContacts } from '../context/ContactContext';

/**
 * SearchBar Component — CONNEX Edition
 * Provides a sleek search input with a clear button and a dedicated
 * toggle for filtering favorite contacts.
 */
const SearchBar = () => {
  const { searchQuery, setSearch, showFavorites, toggleFavoritesFilter } = useContacts();

  return (
    <div className="header-controls">
      <div className="control-group">
        <div className="input-wrapper" style={{ minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="btn-clear" 
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <button 
        className={`favorite-toggle ${showFavorites ? 'active' : ''}`}
        onClick={toggleFavoritesFilter}
      >
        {showFavorites ? '★ Favorites' : '☆ All Contacts'}
      </button>
    </div>
  );
};

export default SearchBar;
