/**
 * Avatar Component
 *
 * Displays a contact's profile photo if available, otherwise
 * renders a colored circle with the contact's initials.
 * 
 * Props:
 *   name     {string} — Contact's full name (used for initials fallback)
 *   avatar   {string} — Optional image URL
 *   color    {string} — Background color for initials circle
 *   size     {number} — Avatar size in pixels (default: 48)
 */
const Avatar = ({ name = '', avatar = '', color = '#6366f1', size = 48 }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || '')
    .join('');

  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    fontSize: size * 0.36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    letterSpacing: '0.5px',
    flexShrink: 0,
    overflow: 'hidden',
    userSelect: 'none',
  };

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        style={{ ...style, objectFit: 'cover' }}
        onError={(e) => {
          // Graceful fallback if image URL breaks
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div
      style={{ ...style, background: color, color: '#fff' }}
      aria-label={`Avatar for ${name}`}
    >
      {initials || '?'}
    </div>
  );
};

export default Avatar;
