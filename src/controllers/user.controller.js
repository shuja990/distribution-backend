const userService = require('../services/user.services');

const registerUser = async (req, res) => {
  try {
    const userExists = await userService.getUserByEmail(req.body.email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await userService.createUser({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ message: 'User created successfully', user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token } = await userService.authenticateUser(email, password);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.json({ message: 'User found', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.user.id);
    if (users) {
      res.json({ message: 'Users found', users });
    } else {
      res.status(404).json({ message: 'Users not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    if (result.message === 'User not found') {
      return res.status(404).json(result);
    } else if (result.message === 'No changes made') {
      return res.status(400).json(result);
    } else {
      return res.json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers
};
