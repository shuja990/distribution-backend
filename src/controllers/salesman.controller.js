const salesmanService = require('../services/salesman.services');

const createSalesman = async (req, res) => {
    try {
        const salesman = await salesmanService.createSalesman({ ...req.body, createdBy: req.user.id });
        res.status(201).json({ message: 'Salesman created successfully', salesman });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSalesman = async (req, res) => {
    try {
        const salesman = await salesmanService.getSalesmanById(req.params.id);
        if (salesman) {
            res.json({ message: 'Salesman found', salesman });
        } else {
            res.status(404).json({ message: 'Salesman not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllSalesmen = async (req, res) => {
    try {
        const salesmen = await salesmanService.getAllSalesmen();
        if (salesmen) {
            res.json({ message: 'Salesmen found', salesmen });
        } else {
            res.status(404).json({ message: 'Salesmen not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSalesman = async (req, res) => {
    try {
        const result = await salesmanService.updateSalesman(req.params.id, req.body);
        if (result.message === 'Salesman not found') {
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

const deleteSalesman = async (req, res) => {
    try {
        const result = await salesmanService.deleteSalesman(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const activateSalesman = async (req, res) => {
    try {
        const result = await salesmanService.updateSalesmanStatus(req.params.id, true);
        if (result.message === 'Salesman not found') {
            return res.status(404).json(result);
        }
        return res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deactivateSalesman = async (req, res) => {
    try {
        const result = await salesmanService.updateSalesmanStatus(req.params.id, false);
        if (result.message === 'Salesman not found') {
            return res.status(404).json(result);
        }
        return res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createSalesman,
    getSalesman,
    getAllSalesmen,
    updateSalesman,
    activateSalesman,
    deactivateSalesman,
    deleteSalesman
};
