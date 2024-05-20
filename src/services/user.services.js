const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const createUser = async (userData) => {
    return await User.create(userData);
};

const getUserById = async (id) => {
    return await User.findByPk(id, {
        attributes: { exclude: ['password'] }, // Excluding password from the results
        include: [
            { model: User, as: 'creator', attributes: ['id', 'username', 'email', 'role'] }
        ]
    });
};

const getAllUsers = async (currentUserId, condition = {}) => {
    const users = await User.findAll({
        where: {
            ...condition, // Apply additional conditions
            id: {
                [Op.ne]: currentUserId // Exclude current user
            }
        },
        attributes: { exclude: ['password'] }, // Exclude password from the results
        include: [
            { model: User, as: 'creator', attributes: ['id', 'username', 'email', 'role'] }
        ]
    });
    return users;
};

const getUserByEmail = async (email) => {
    return await User.findOne({
        where: { email },
        attributes: ['id'] // Selecting only the id field
    });
};

const updateUser = async (id, userData) => {
    try {
        // Check if the user exists
        const user = await User.findByPk(id);
        if (!user) {
            return { message: 'User not found' };
        }

        // Attempt to update the user
        const [updatedRowsCount, updatedRows] = await User.update(userData, {
            where: { id },
            returning: true, // This ensures the updated rows are returned
            plain: true // Ensures that only the first updated row is returned
        });

        // Check if any rows were updated
        if (updatedRowsCount === 0) {
            return { message: 'No changes made' };
        }

        // Get the updated user details
        const updatedUser = updatedRows.get({ plain: true }); // Get plain data object
        delete updatedUser.password; // Exclude password from the response
        return { message: 'User updated successfully', user: updatedUser };
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteUser = async (id) => {
    const result = await User.destroy({
        where: { id }
    });
    if (result === 1) {
        return { message: 'User deleted successfully' };
    }
    return { message: 'User not found' };
};

const authenticateUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '72h' });
        return { token };
    }
    throw new Error('Invalid credentials');
};

module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    authenticateUser,
    getAllUsers
};
