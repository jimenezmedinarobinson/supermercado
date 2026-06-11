const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('employee', 'manager', 'admin'), invoiceController.createInvoice);
router.get('/', authMiddleware, invoiceController.getInvoices);
router.get('/:id', authMiddleware, invoiceController.getInvoiceById);
router.put('/:id/status', authMiddleware, roleMiddleware('manager', 'admin'), invoiceController.updateInvoiceStatus);
router.delete('/:id', authMiddleware, roleMiddleware('manager', 'admin'), invoiceController.cancelInvoice);

module.exports = router;