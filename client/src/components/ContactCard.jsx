import { useContacts } from '../context/ContactContext';

/**
 * ContactCard Component — CONNEX Edition
 * Renders a contact with a premium glassmorphic feel, star toggle, 
 * and support for both Grid and List view layouts via CSS classes.
 */
const ContactCard = ({ contact, onEdit, onDelete }) => {
  const { toggleFavorite } = useContacts();
  const { 
    name, email, phone, company, role, country, countryCode, 
    favorite, avatarColor 
  } = contact;

  // Use name initials if no avatar
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="contact-card">
      <div 
        className={`card-favorite ${favorite ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(contact._id);
        }}
        title={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? '★' : '☆'}
      </div>

      <div className="card-main">
        <div className="avatar" style={{ backgroundColor: avatarColor || '#6366f1' }}>
          {initials}
          {country && (
            <img 
              src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`} 
              alt={country} 
              className="avatar-flag"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>
        
        <div className="card-info">
          <h3>{name}</h3>
          <p className="role">{role || 'Contact'}</p>
        </div>
      </div>

      <div className="card-details">
        <div className="detail-item" title="Email">
          <span className="detail-icon">✉</span>
          <span>{email}</span>
        </div>
        
        <div className="detail-item" title="Phone">
          <span className="detail-icon">📞</span>
          <span>{countryCode ? `${countryCode} ` : ''}{phone || 'No phone'}</span>
        </div>

        {company && (
          <div className="detail-item" title="Company">
            <span className="detail-icon">🏢</span>
            <span>{company}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button 
          className="icon-btn" 
          onClick={(e) => { e.stopPropagation(); onEdit(contact); }} 
          title="Edit"
        >
          ✎
        </button>
        <button 
          className="icon-btn" 
          onClick={(e) => { e.stopPropagation(); onDelete(contact._id); }} 
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
