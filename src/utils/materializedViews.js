const { sequelize } = require('../models');

const createMaterializedView = async () => {
    await sequelize.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS transaction_summary AS
        SELECT 
            "salesmanId",
            "distributionId",
            COUNT(*) AS total_transactions,
            SUM("amount") AS total_amount,
            SUM(CASE WHEN "paymentStatus" = 'paid' THEN "amount" ELSE 0 END) AS total_paid,
            SUM(CASE WHEN "paymentStatus" != 'paid' THEN "amount" ELSE 0 END) AS total_outstanding
        FROM 
            "Transactions"
        GROUP BY 
            "salesmanId", "distributionId";
    `);
};

const refreshMaterializedView = async () => {
    await sequelize.query('REFRESH MATERIALIZED VIEW transaction_summary;');
};

module.exports = {
    createMaterializedView,
    refreshMaterializedView
};
