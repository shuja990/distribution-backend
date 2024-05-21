const { Distribution } = require('../models');

const createDistribution = async (data) => {
  return await Distribution.create(data);
};

const getDistributionById = async (id) => {
  return await Distribution.findByPk(id, {
    include: [
      { model: Distribution.associations.creator.target, as: 'creator', attributes: ['id', 'username', 'email', 'role'] }
    ]
  });
};

const getAllDistributions = async () => {
  return await Distribution.findAll({
    include: [
      { model: Distribution.associations.creator.target, as: 'creator', attributes: ['id', 'username', 'email', 'role'] }
    ]
  });
};

const updateDistribution = async (id, data) => {
  const [updatedRowsCount, updatedRows] = await Distribution.update(data, {
    where: { id },
    returning: true,
    plain: true
  });

  if (updatedRowsCount === 0) {
    return { message: 'No changes made' };
  }

  const updatedDistribution = updatedRows.get({ plain: true });
  return { message: 'Distribution updated successfully', distribution: updatedDistribution };
};

const deleteDistribution = async (id) => {
  const result = await Distribution.destroy({
    where: { id }
  });

  if (result === 1) {
    return { message: 'Distribution deleted successfully' };
  }

  return { message: 'Distribution not found' };
};

module.exports = {
  createDistribution,
  getDistributionById,
  getAllDistributions,
  updateDistribution,
  deleteDistribution
};
