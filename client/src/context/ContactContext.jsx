import { createContext, useContext, useReducer, useCallback } from 'react';
import * as service from '../api/contactService';

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  contacts: [],
  selectedContact: null,
  loading: false,
  error: null,
  toast: null,
  searchQuery: '',
  viewMode: localStorage.getItem('connex_view_mode') || 'grid',
  showFavorites: false,
};

// ─── Action Types ──────────────────────────────────────────────────────────────
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CONTACTS: 'SET_CONTACTS',
  SET_SELECTED: 'SET_SELECTED',
  ADD_CONTACT: 'ADD_CONTACT',
  UPDATE_CONTACT: 'UPDATE_CONTACT',
  DELETE_CONTACT: 'DELETE_CONTACT',
  SET_TOAST: 'SET_TOAST',
  CLEAR_TOAST: 'CLEAR_TOAST',
  SET_SEARCH: 'SET_SEARCH',
  TOGGLE_VIEW: 'TOGGLE_VIEW',
  TOGGLE_FAVORITES: 'TOGGLE_FAVORITES',
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
const contactReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ACTIONS.SET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
        loading: false,
        error: null,
      };

    case ACTIONS.SET_SELECTED:
      return { ...state, selectedContact: action.payload };

    case ACTIONS.ADD_CONTACT:
      return {
        ...state,
        contacts: [action.payload, ...state.contacts],
      };

    case ACTIONS.UPDATE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.map((c) =>
          c._id === action.payload._id ? action.payload : c
        ),
        selectedContact:
          state.selectedContact?._id === action.payload._id
            ? action.payload
            : state.selectedContact,
      };

    case ACTIONS.DELETE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.filter((c) => c._id !== action.payload),
        selectedContact:
          state.selectedContact?._id === action.payload ? null : state.selectedContact,
      };

    case ACTIONS.SET_TOAST:
      return { ...state, toast: action.payload };

    case ACTIONS.CLEAR_TOAST:
      return { ...state, toast: null };

    case ACTIONS.SET_SEARCH:
      return { ...state, searchQuery: action.payload };

    case ACTIONS.TOGGLE_VIEW:
      const newMode = state.viewMode === 'grid' ? 'list' : 'grid';
      localStorage.setItem('connex_view_mode', newMode);
      return { ...state, viewMode: newMode };

    case ACTIONS.TOGGLE_FAVORITES:
      return { ...state, showFavorites: !state.showFavorites };

    default:
      return state;
  }
};

// ─── Context ───────────────────────────────────────────────────────────────────
const ContactContext = createContext(null);

export const ContactProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  /** Show a toast notification */
  const showToast = useCallback((message, type = 'success') => {
    dispatch({ type: ACTIONS.SET_TOAST, payload: { message, type } });
    setTimeout(() => dispatch({ type: ACTIONS.CLEAR_TOAST }), 4000);
  }, []);

  /** Load all contacts from API */
  const loadContacts = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await service.fetchContacts();
      dispatch({ type: ACTIONS.SET_CONTACTS, payload: res.data });
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
    }
  }, []);

  /** Add a new contact */
  const addContact = useCallback(async (contactData) => {
    try {
      const res = await service.createContact(contactData);
      dispatch({ type: ACTIONS.ADD_CONTACT, payload: res.data });
      showToast('Contact created!', 'success');
      return { success: true, data: res.data };
    } catch (err) {
      showToast(err.message || 'Failed to create contact', 'error');
      return { success: false, error: err.message };
    }
  }, [showToast]);

  /** Edit an existing contact */
  const editContact = useCallback(async (id, contactData) => {
    try {
      const res = await service.updateContact(id, contactData);
      dispatch({ type: ACTIONS.UPDATE_CONTACT, payload: res.data });
      showToast('Changes saved!', 'success');
      return { success: true, data: res.data };
    } catch (err) {
      showToast(err.message || 'Failed to update contact', 'error');
      return { success: false, error: err.message };
    }
  }, [showToast]);

  /** Toggle favorite status */
  const toggleFavorite = useCallback(async (id) => {
    const contact = state.contacts.find(c => c._id === id);
    if (!contact) return;
    return editContact(id, { favorite: !contact.favorite });
  }, [state.contacts, editContact]);

  /** Remove a contact */
  const removeContact = useCallback(async (id) => {
    try {
      await service.deleteContact(id);
      dispatch({ type: ACTIONS.DELETE_CONTACT, payload: id });
      showToast('Contact removed.', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Failed to delete contact', 'error');
      return { success: false, error: err.message };
    }
  }, [showToast]);

  const setSearch = useCallback((query) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: query });
  }, []);

  const toggleViewMode = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_VIEW });
  }, []);

  const toggleFavoritesFilter = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_FAVORITES });
  }, []);

  // Computed Stats & Filtering
  const filteredContacts = state.contacts.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(state.searchQuery.toLowerCase()));
    
    const matchesFavorite = !state.showFavorites || c.favorite;
    return matchesSearch && matchesFavorite;
  });

  const stats = {
    total: state.contacts.length,
    favorites: state.contacts.filter(c => c.favorite).length,
    showing: filteredContacts.length
  };

  return (
    <ContactContext.Provider
      value={{
        ...state,
        contacts: filteredContacts, // Provide filtered list to UI
        stats,
        loadContacts,
        addContact,
        editContact,
        toggleFavorite,
        removeContact,
        toggleViewMode,
        toggleFavoritesFilter,
        setSearch,
        showToast,
        dispatch,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

// ─── Custom Hook ───────────────────────────────────────────────────────────────
export const useContacts = () => {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error('useContacts must be used within a ContactProvider');
  return ctx;
};
