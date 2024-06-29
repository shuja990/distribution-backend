const recoveryService = require('../services/recovery.service');

const createRecovery = async (req, res) => {
    try {
        const recovery = await recoveryService.createRecovery({ ...req.body, createdBy: req.user.id });
        res.status(201).json({ message: 'Recovery created successfully', recovery });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRecovery = async (req, res) => {
    try {
        const recovery = await recoveryService.getRecoveryById(req.params.id);
        if (recovery) {
            res.json({ message: 'Recovery found', recovery });
        } else {
            res.status(404).json({ message: 'Recovery not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllRecoveries = async (req, res) => {
    try {
        const filters = req.query;
        const recoveries = await recoveryService.getAllRecoveries(req.user.id, filters);
        if (recoveries) {
            res.json({ message: 'Recoveries found', recoveries });
        } else {
            res.status(404).json({ message: 'Recoveries not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateRecovery = async (req, res) => {
    try {
        const result = await recoveryService.updateRecovery(req.params.id, req.body);
        if (result.message === 'Recovery not found') {
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

const deleteRecovery = async (req, res) => {
    try {
        const result = await recoveryService.deleteRecovery(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createRecovery,
    getRecovery,
    getAllRecoveries,
    updateRecovery,
    deleteRecovery
};
