const Contact = require('../models/Contact');

/**
 * @desc    Get all contacts with optional search/filter
 * @route   GET /api/contacts?search=&page=&limit=
 * @access  Public
 */
const getAllContacts = async (req, res, next) => {
  try {
    const { search = '', favorite } = req.query;

    // Filter by authenticated user
    let filter = { user: req.user.id };

    // Search filter: name, email, or company
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    // Favorite filter
    if (favorite === 'true') {
      filter.favorite = true;
    }

    const contacts = await Contact.find(filter).sort({ favorite: -1, name: 1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single contact by ID
 * @route   GET /api/contacts/:id
 * @access  Private
 */
const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      const err = new Error('Contact not found');
      err.statusCode = 404;
      return next(err);
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      const err = new Error('Not authorized to access this contact');
      err.statusCode = 401;
      return next(err);
    }

    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new contact
 * @route   POST /api/contacts
 * @access  Private
 */
const createContact = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an existing contact
 * @route   PUT /api/contacts/:id
 * @access  Private
 */
const updateContact = async (req, res, next) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      const err = new Error('Contact not found');
      err.statusCode = 404;
      return next(err);
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      const err = new Error('Not authorized to access this contact');
      err.statusCode = 401;
      return next(err);
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a contact
 * @route   DELETE /api/contacts/:id
 * @access  Private
 */
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      const err = new Error('Contact not found');
      err.statusCode = 404;
      return next(err);
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      const err = new Error('Not authorized to access this contact');
      err.statusCode = 401;
      return next(err);
    }

    await contact.deleteOne();

    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
