const User = require('./User');
const Branch = require('./Branch');
const Product = require('./Product');
const Inventory = require('./Inventory');
const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');

// Define associations
User.belongsTo(Branch, { foreignKey: 'branchId' });
Branch.hasMany(User, { foreignKey: 'branchId' });

Inventory.belongsTo(Product, { foreignKey: 'productId' });
Inventory.belongsTo(Branch, { foreignKey: 'branchId' });
Product.hasMany(Inventory, { foreignKey: 'productId' });
Branch.hasMany(Inventory, { foreignKey: 'branchId' });

Invoice.belongsTo(Branch, { foreignKey: 'branchId' });
Invoice.belongsTo(User, { foreignKey: 'userId' });
Branch.hasMany(Invoice, { foreignKey: 'branchId' });
User.hasMany(Invoice, { foreignKey: 'userId' });

InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId' });
InvoiceItem.belongsTo(Product, { foreignKey: 'productId' });
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId' });
Product.hasMany(InvoiceItem, { foreignKey: 'productId' });

module.exports = {
  User,
  Branch,
  Product,
  Inventory,
  Invoice,
  InvoiceItem,
};