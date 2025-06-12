const sequelize = require('./database');
const models = require('../models');

async function initDb() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Remove explicit table dropping for persistence in development
    // await sequelize.queryInterface.dropTable('Matches').catch(() => {});
    // await sequelize.queryInterface.dropTable('Teams').catch(() => {});

    // Sync all models (does NOT drop existing tables, ideal for persistence)
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

    // Upsert admin user
    const { User } = models;
    const adminUsername = 'admin';
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    const [admin, created] = await User.findOrCreate({
      where: { username: adminUsername },
      defaults: {
        email: adminEmail,
        password: adminPassword,
        isAdmin: true
      }
    });
    if (!created) {
      // Update admin user if already exists
      admin.email = adminEmail;
      admin.password = adminPassword;
      admin.isAdmin = true;
      await admin.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log('Admin user created successfully.');
    }

  } catch (error) {
    console.error('Unable to initialize database:', error);
    process.exit(1);
  }
}

module.exports = initDb; 