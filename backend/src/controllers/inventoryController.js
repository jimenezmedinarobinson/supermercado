const { Inventory, Product, Branch } = require('../models');

exports.updateInventory = async (req, res) => {
  try {
    const { productId, branchId, quantity, minStock, maxStock } = req.body;

    let inventory = await Inventory.findOne({
      where: { productId, branchId },
    });

    if (!inventory) {
      inventory = await Inventory.create({
        productId,
        branchId,
        quantity: quantity || 0,
        minStock: minStock || 10,
        maxStock: maxStock || 100,
      });
    } else {
      await inventory.update({
        quantity: quantity !== undefined ? quantity : inventory.quantity,
        minStock: minStock !== undefined ? minStock : inventory.minStock,
        maxStock: maxStock !== undefined ? maxStock : inventory.maxStock,
      });
    }

    res.json({
      message: 'Inventory updated successfully',
      inventory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const { branchId } = req.query;
    const where = {};

    if (branchId) where.branchId = branchId;

    const inventory = await Inventory.findAll({
      where,
      include: [
        { model: Product, attributes: ['id', 'name', 'code', 'category'] },
        { model: Branch, attributes: ['id', 'name'] },
      ],
    });

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inventory = await Inventory.findByPk(id, {
      include: [
        { model: Product },
        { model: Branch },
      ],
    });

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLowStockItems = async (req, res) => {
  try {
    const { branchId } = req.query;
    const where = {
      raw: true,
      where: {
        '$Inventory.quantity$ < $Inventory.minStock$': true,
      },
    };

    if (branchId) where.where.branchId = branchId;

    const lowStockItems = await Inventory.findAll({
      where: branchId ? { branchId } : {},
      include: [{ model: Product }],
      raw: true,
    }).then(items => items.filter(item => item.quantity < item.minStock));

    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
