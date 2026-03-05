require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Admin = require('../models/admin');
const User = require('../models/user');

const demoAdmin = {
  email: 'admin@gmail.com',
  username: 'Admin',
  password: 'Admin@123',
};

const demoClient = {
  Username: 'Demo User',
  email: 'user@gmail.com',
  Mobile: '9999999999',
  password: 'Client@123',
  isBlocked: false,
  Wallet: 0,
};

async function seedDemoUsers() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in .env');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Clean up previously seeded recruiter demo accounts.
    await Admin.deleteOne({ email: 'recruiter.admin@mooncart.local' });
    await User.deleteOne({ email: 'recruiter.client@mooncart.local' });

    await Admin.updateOne(
      { email: demoAdmin.email },
      { $set: demoAdmin },
      { upsert: true }
    );

    const hashedPassword = await bcrypt.hash(demoClient.password, 10);
    await User.updateOne(
      { email: demoClient.email },
      { $set: { ...demoClient, password: hashedPassword } },
      { upsert: true }
    );

    console.log('Demo users seeded successfully.');
    console.log('Admin: admin@gmail.com / Admin@123');
    console.log('Client: user@gmail.com / Client@123');
  } finally {
    await mongoose.connection.close();
  }
}

seedDemoUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to seed demo users:', error.message);
    process.exit(1);
  });
