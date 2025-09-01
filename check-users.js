const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    const User = require('./models/User');
    
    // Получаем всех пользователей
    const users = await User.find({}).select('+password');
    console.log(`\n👥 Found ${users.length} users:`);
    
    users.forEach((user, index) => {
      console.log(`\n--- User ${index + 1} ---`);
      console.log('ID:', user._id);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Password hash:', user.password ? '✅ Present' : '❌ Missing');
      console.log('Password length:', user.password ? user.password.length : 'N/A');
      console.log('Is Active:', user.isActive);
      
      // Тестируем пароль
      if (user.password) {
        const testPassword = user.email === 'admin@homemanager.com' ? 'admin123' : 'resident123';
        const isMatch = bcrypt.compareSync(testPassword, user.password);
        console.log('Password test:', isMatch ? '✅ Correct' : '❌ Incorrect');
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkUsers();
