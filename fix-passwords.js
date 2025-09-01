const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixPasswords() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    const User = require('./models/User');
    
    // Исправляем пароль администратора
    console.log('\n👑 Fixing admin password...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.updateOne(
      { email: 'admin@homemanager.com' },
      { password: adminPassword }
    );
    console.log('✅ Admin password fixed!');
    
    // Исправляем пароль жильца
    console.log('\n🏠 Fixing resident password...');
    const residentPassword = await bcrypt.hash('resident123', 10);
    await User.updateOne(
      { email: 'janis@example.com' },
      { password: residentPassword }
    );
    console.log('✅ Resident password fixed!');
    
    // Проверяем результат
    console.log('\n🔍 Verifying passwords...');
    const users = await User.find({}).select('+password');
    
    users.forEach((user) => {
      const testPassword = user.email === 'admin@homemanager.com' ? 'admin123' : 'resident123';
      const isMatch = bcrypt.compareSync(testPassword, user.password);
      console.log(`${user.email}: ${isMatch ? '✅ Correct' : '❌ Incorrect'}`);
    });
    
    console.log('\n🎉 Password fix completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

fixPasswords();
