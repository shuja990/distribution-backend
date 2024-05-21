const { Salesman } = require('../models');

const createSalesman = async (data) => {
  return await Salesman.create(data);
};

const getSalesmanById = async (id) => {
  return await Salesman.findByPk(id, {
    include: [
      { model: Salesman.associations.creator.target, as: 'creator', attributes: ['id', 'username', 'email', 'role'] }
    ]
  });
};

const getAllSalesmen = async () => {
  return await Salesman.findAll({
    include: [
      { model: Salesman.associations.creator.target, as: 'creator', attributes: ['id', 'username', 'email', 'role'] }
    ]
  });
};

const updateSalesman = async (id, data) => {
  const [updatedRowsCount, updatedRows] = await Salesman.update(data, {
    where: { id },
    returning: true,
    plain: true
  });

  if (updatedRowsCount === 0) {
    return { message: 'No changes made' };
  }

  const updatedSalesman = updatedRows.get({ plain: true });
  return { message: 'Salesman updated successfully', salesman: updatedSalesman };
};

const deleteSalesman = async (id) => {
  const result = await Salesman.destroy({
    where: { id }
  });

  if (result === 1) {
    return { message: 'Salesman deleted successfully' };
  }

  return { message: 'Salesman not found' };
};

const updateSalesmanStatus = async (id, isActive) => {
    const salesman = await Salesman.findByPk(id);
    if (!salesman) {
        return { message: 'Salesman not found' };
    }
    salesman.isActive = isActive;
    await salesman.save();
    return { message: `Salesman ${isActive ? 'activated' : 'deactivated'} successfully`, salesman };
};

module.exports = {
  createSalesman,
  getSalesmanById,
  getAllSalesmen,
  updateSalesman,
  deleteSalesman,
  updateSalesmanStatus
};
