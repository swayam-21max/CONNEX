const express = require('express');
const router = express.Router();

const {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');

const { protect } = require('../middleware/auth');

const {
  createContactRules,
  updateContactRules,
  handleValidationErrors,
} = require('../middleware/validate');

// Protect all routes
router.use(protect);

// Base: /api/contacts
router
  .route('/')
  .get(getAllContacts)                              // GET /api/contacts?search=
  .post(createContactRules, handleValidationErrors, createContact); // POST /api/contacts

router
  .route('/:id')
  .get(getContactById)                             // GET  /api/contacts/:id
  .put(updateContactRules, handleValidationErrors, updateContact)   // PUT  /api/contacts/:id 
  .delete(deleteContact);                          // DELETE /api/contacts/:id

module.exports = router;
