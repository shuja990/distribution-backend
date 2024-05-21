const distributionService = require('../services/distribution.services');

const createDistribution = async (req, res) => {
    try {
        const distribution = await distributionService.createDistribution({ ...req.body, createdBy: req.user.id });
        res.status(201).json({ message: 'Distribution created successfully', distribution });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDistribution = async (req, res) => {
    try {
        const distribution = await distributionService.getDistributionById(req.params.id);
        if (distribution) {
            res.json({ message: 'Distribution found', distribution });
        } else {
            res.status(404).json({ message: 'Distribution not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllDistributions = async (req, res) => {
    try {
        const distributions = await distributionService.getAllDistributions();
        if (distributions) {
            res.json({ message: 'Distributions found', distributions });
        } else {
            res.status(404).json({ message: 'Distributions not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDistribution = async (req, res) => {
    try {
        const result = await distributionService.updateDistribution(req.params.id, req.body);
        if (result.message === 'Distribution not found') {
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

const deleteDistribution = async (req, res) => {
    try {
        const result = await distributionService.deleteDistribution(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createDistribution,
    getDistribution,
    getAllDistributions,
    updateDistribution,
    deleteDistribution
};