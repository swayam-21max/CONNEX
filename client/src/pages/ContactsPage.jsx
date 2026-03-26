import { useState, useEffect } from 'react';
import { useContacts } from '../context/ContactContext';
import ContactCard from '../components/ContactCard';
import ContactForm from '../components/ContactForm';
import ConfirmModal from '../components/ConfirmModal';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsBar from '../components/StatsBar';

const ContactsPage = () => {
  const {
    contacts, loading, error, viewMode, 
    loadContacts, addContact, editContact, removeContact, 
    toggleViewMode, showToast, stats
  } = useContacts();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleOpenCreate = () => { setEditTarget(null); setFormOpen(true); };
  const handleOpenEdit = (contact) => { setEditTarget(contact); setFormOpen(true); };
  
  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    const result = editTarget 
      ? await editContact(editTarget._id, data)
      : await addContact(data);
    
    setFormLoading(false);
    if (result.success) setFormOpen(false);
  };

  const handleDeleteConfirm = async () => {
    await removeContact(deleteTargetId);
    setDeleteTargetId(null);
  };

  return (
    <div className="container">
      <header className="page-header">
        <div className="header-top">
          <div>
            <h1 style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>Contacts</h1>
            <p>Manage your professional network with precision.</p>
          </div>
          
          <div className="header-controls">
            <div className="control-group">
              <button 
                className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={toggleViewMode}
                title="Grid View"
              >
                ⊞ Grid
              </button>
              <button 
                className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                onClick={toggleViewMode}
                title="List View"
              >
                ≡ List
              </button>
            </div>
            
            <button className="btn btn-primary" onClick={handleOpenCreate}>
              + Add Contact
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <StatsBar />
          <SearchBar />
        </div>
      </header>

      {error && (
        <div className="toast toast-error" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', marginBottom: '20px' }}>
          <span>⚠ {error}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : contacts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={viewMode === 'grid' ? 'contacts-grid' : 'contacts-list'}>
          {contacts.map((contact) => (
            <ContactCard
              key={contact._id}
              contact={contact}
              onEdit={() => handleOpenEdit(contact)}
              onDelete={setDeleteTargetId}
            />
          ))}
        </div>
      )}

      <ContactForm
        isOpen={formOpen}
        contact={editTarget}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
        loading={formLoading}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Contact"
        message="Are you sure you want to remove this contact? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

export default ContactsPage;
