const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '127.0.0.1',
  username: 'root',
  password: 'rootroot',
  database: 'ecommerce_db',
  dialectOptions: {
    decimalNumbers: true,
  },
});

module.exports = sequelize;
