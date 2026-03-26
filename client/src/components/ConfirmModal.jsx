/**
 * ConfirmModal Component
 * A confirmation dialog for destructive actions (e.g., deleting a contact).
 *
 * Props:
 *   isOpen    {boolean}
 *   title     {string}
 *   message   {string}
 *   onConfirm {function}
 *   onCancel  {function}
 *   loading   {boolean}
 */
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">!</div>
        <div className="modal-header" style={{ border: 'none', paddingBottom: '0', textAlign: 'center' }}>
          <h2 style={{ width: '100%' }}>{title}</h2>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{message}</p>
        </div>

        <div className="modal-footer" style={{ border: 'none', justifyContent: 'center', gap: '16px' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel} 
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={onConfirm} 
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Contact'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
