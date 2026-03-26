import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/contacts`
  : "http://localhost:5001/api/contacts";

/**
 * Axios instance pre-configured with base URL and default headers.
 * Makes direct requests to the backend — no Vite proxy involved.
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Request interceptor — attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("connex_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — unwrap data or throw a clean error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    const enriched = new Error(message);
    enriched.status = error.response?.status;
    enriched.errors = error.response?.data?.errors;
    return Promise.reject(enriched);
  },
);

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Fetch all contacts, optionally filtered by search term.
 * @param {string} search - Optional search query
 */
export const fetchContacts = async (search = "") => {
  const params = search ? { search } : {};
  const res = await api.get("/", { params });
  return res.data;
};

/**
 * Fetch a single contact by ID.
 * @param {string} id - MongoDB ObjectId
 */
export const fetchContact = async (id) => {
  const res = await api.get(`/${id}`);
  return res.data;
};

/**
 * Create a new contact.
 * @param {Object} contactData - { name, email, phone, company, role, avatar }
 */
export const createContact = async (contactData) => {
  const res = await api.post("/", contactData);
  return res.data;
};

/**
 * Update an existing contact.
 * @param {string} id - MongoDB ObjectId
 * @param {Object} contactData - Fields to update
 */
export const updateContact = async (id, contactData) => {
  const res = await api.put(`/${id}`, contactData);
  return res.data;
};

/**
 * Delete a contact by ID.
 * @param {string} id - MongoDB ObjectId
 */
export const deleteContact = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};
