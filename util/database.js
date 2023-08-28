const Sequelize=require("sequelize")
require('dotenv').config();

const sequelize = new Sequelize('myowndatabase', 'root', '10509037@Niha', {
    host: 'localhost',
    dialect: 'mysql',
  });

  async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log('Database connection successful!');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
  
  testConnection();

module.exports=sequelize;