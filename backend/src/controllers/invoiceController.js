const { Invoice, InvoiceItem, Product, User, Branch, Inventory } = require('../models');
const sequelize = require('../database/connection');

exports.createInvoice = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { branchId, items, paymentMethod, notes } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Invoice must have items' });
    }

    let subtotal = 0;
    const processedItems = [];

    // Process each item
    for (const item of items) {
      const product = await Product.findByPk(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      const itemSubtotal = parseFloat(product.price) * parseInt(item.quantity);
      subtotal += itemSubtotal;

      processedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: itemSubtotal,
      });

      // Update inventory
      const inventory = await Inventory.findOne({
        where: { productId: item.productId, branchId },
      });

      if (inventory) {
        await inventory.update(
          { quantity: inventory.quantity - item.quantity },
          { transaction }
        );
      }
    }

    const tax = subtotal * 0.12; // 12% tax
    const total = subtotal + tax;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await Invoice.create(
      {
        invoiceNumber,
        branchId,
        userId,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        paymentMethod,
        status: 'pending',
        notes,
      },
      { transaction }
    );

    // Create invoice items
    for (const item of processedItems) {
      await InvoiceItem.create(
        {
          invoiceId: invoice.id,
          ...item,
        },
        { transaction }
      );
    }

    await transaction.commit();

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: {
        ...invoice.dataValues,
        items: processedItems,
      },
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const { branchId, status } = req.query;
    const where = {};

    if (branchId) where.branchId = branchId;
    if (status) where.status = status;

    const invoices = await Invoice.findAll({
      where,
      include: [
        { model: Branch, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'username', 'firstName', 'lastName'] },
        { model: InvoiceItem },
      ],
    });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id, {
      include: [
        { model: Branch },
        { model: User, attributes: { exclude: ['password'] } },
        {
          model: InvoiceItem,
          include: [{ model: Product }],
        },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await invoice.update({ status });

    res.json({
      message: 'Invoice status updated successfully',
      invoice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelInvoice = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id, {
      include: [{ model: InvoiceItem }],
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Restore inventory
    for (const item of invoice.InvoiceItems) {
      const inventory = await Inventory.findOne({
        where: { productId: item.productId, branchId: invoice.branchId },
      });

      if (inventory) {
        await inventory.update(
          { quantity: inventory.quantity + item.quantity },
          { transaction }
        );
      }
    }

    await invoice.update({ status: 'cancelled' }, { transaction });

    await transaction.commit();

    res.json({
      message: 'Invoice cancelled successfully',
      invoice,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};
