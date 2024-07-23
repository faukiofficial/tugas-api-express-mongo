const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('eduwork_cruds_v2', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection success');
    } catch (error) {
        console.error('Unable to connect:', error);
    }
})();

module.exports = sequelize;