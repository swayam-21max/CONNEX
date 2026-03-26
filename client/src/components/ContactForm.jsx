import { useState, useEffect, useRef } from 'react';
import { countries } from '../utils/countryData';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  role: '',
  country: 'US', // Default to US for dial code
  countryCode: '+1',
  favorite: false,
};

const ContactForm = ({ isOpen, contact = null, onSubmit, onClose, loading = false }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef(null);
  const isEdit = Boolean(contact);

  // Filter countries based on search
  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setForm(contact ? { ...EMPTY_FORM, ...contact } : EMPTY_FORM);
      setErrors({});
      setCountrySearch('');
    }
  }, [isOpen, contact]);

  // Handle outside click for country dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCountrySelect = (country) => {
    setForm(prev => ({ 
      ...prev, 
      country: country.code.toUpperCase(), 
      countryCode: country.dialCode 
    }));
    setShowCountryDropdown(false);
    setCountrySearch('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await onSubmit(form);
  };

  if (!isOpen) return null;

  const selectedCountry = countries.find(c => c.code.toUpperCase() === form.country.toUpperCase()) || countries[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Contact' : 'Create Contact'}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Name */}
              <div className="form-group span-full">
                <label>Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Rivera"
                  className={errors.name ? 'error' : ''}
                  autoFocus
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="form-group span-full">
                <label>Email Address *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              {/* Country & Phone */}
              <div className="form-group country-select-container" ref={dropdownRef}>
                <label>Country</label>
                <div className="country-trigger" onClick={() => setShowCountryDropdown(!showCountryDropdown)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={`https://flagcdn.com/w20/${selectedCountry.code}.png`} alt="" />
                    <span>{selectedCountry.name}</span>
                  </div>
                  <span>▾</span>
                </div>
                
                {showCountryDropdown && (
                  <div className="country-dropdown">
                    <input 
                      className="country-search"
                      placeholder="Search country..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                    {filteredCountries.map(c => (
                      <div key={c.code} className="country-option" onClick={() => handleCountrySelect(c)}>
                        <img src={`https://flagcdn.com/w20/${c.code}.png`} alt="" />
                        <span>{c.name}</span>
                        <span style={{ marginLeft: 'auto', opacity: 0.5 }}>{c.dialCode}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <div className="dial-code-badge">{form.countryCode}</div>
                  <input
                    name="phone"
                    className="phone-input"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="555-0123"
                  />
                </div>
              </div>

              {/* Company & Role */}
              <div className="form-group">
                <label>Company</label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Google"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="Senior Designer"
                />
              </div>

              {/* Favorite Toggle */}
              <div className="form-group span-full">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="favorite"
                    checked={form.favorite}
                    onChange={handleChange}
                    style={{ width: 'auto' }}
                  />
                  <span>Mark as favorite</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
