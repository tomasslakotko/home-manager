const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('../models/User');
const Calendar = require('../models/Calendar');

// Праздники Латвии 2024-2025
const latvianHolidays = [
  {
    title: { lv: 'Jaunais Gads', en: 'New Year' },
    description: { lv: 'Jaunā gada sākums', en: 'Beginning of the new year' },
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-01'),
    allDay: true,
    type: 'holiday',
    category: 'latvian_holiday',
    color: '#dc2626',
    isPublic: true
  },
  {
    title: { lv: 'Latvijas Republikas proklamēšanas diena', en: 'Proclamation Day of the Republic of Latvia' },
    description: { lv: 'Latvijas valsts neatkarības atjaunošana', en: 'Restoration of Latvian independence' },
    startDate: new Date('2024-05-04'),
    endDate: new Date('2024-05-04'),
    allDay: true,
    type: 'holiday',
    category: 'latvian_holiday',
    color: '#dc2626',
    isPublic: true
  },
  {
    title: { lv: 'Līgo un Jāņu diena', en: 'Midsummer Day' },
    description: { lv: 'Tradicionālā latviešu svētku diena', en: 'Traditional Latvian celebration day' },
    startDate: new Date('2024-06-23'),
    endDate: new Date('2024-06-24'),
    allDay: true,
    type: 'holiday',
    category: 'latvian_holiday',
    color: '#dc2626',
    isPublic: true
  },
  {
    title: { lv: 'Latvijas Republikas proklamēšanas diena', en: 'Proclamation Day of the Republic of Latvia' },
    description: { lv: 'Latvijas valsts neatkarības atjaunošana', en: 'Restoration of Latvian independence' },
    startDate: new Date('2024-11-18'),
    endDate: new Date('2024-11-18'),
    allDay: true,
    type: 'holiday',
    category: 'latvian_holiday',
    color: '#dc2626',
    isPublic: true
  },
  {
    title: { lv: 'Ziemassvētki', en: 'Christmas' },
    description: { lv: 'Kristus dzimšanas diena', en: 'Birth of Christ' },
    startDate: new Date('2024-12-25'),
    endDate: new Date('2024-12-26'),
    allDay: true,
    type: 'holiday',
    category: 'latvian_holiday',
    color: '#dc2626',
    isPublic: true
  }
];

async function initializeDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Подключение к базе данных
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Очистка существующих данных (опционально)
    console.log('🧹 Cleaning existing data...');
    await User.deleteMany({});
    await Calendar.deleteMany({ category: 'latvian_holiday' });
    
    // Создание первого суперадминистратора
    console.log('👤 Creating super admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const superAdmin = new User({
      apartment: 'ADMIN',
      firstName: 'Super',
      lastName: 'Administrator',
      email: 'admin@homemanager.com',
      phone: '+37120000000',
      password: hashedPassword,
      role: 'superadmin',
      language: 'lv',
      isActive: true
    });
    
    await superAdmin.save();
    console.log('✅ Super admin created successfully!');
    console.log('📧 Email: admin@homemanager.com');
    console.log('🔑 Password: admin123');
    
    // Добавление праздников Латвии
    console.log('🇱🇻 Adding Latvian holidays...');
    
    for (const holiday of latvianHolidays) {
      const calendarEvent = new Calendar({
        ...holiday,
        createdBy: superAdmin._id,
        updatedBy: superAdmin._id
      });
      await calendarEvent.save();
    }
    
    console.log(`✅ Added ${latvianHolidays.length} Latvian holidays!`);
    
    // Создание тестового жильца
    console.log('🏠 Creating test resident...');
    const residentPassword = await bcrypt.hash('resident123', 10);
    
    const testResident = new User({
      apartment: '1A',
      firstName: 'Jānis',
      lastName: 'Bērziņš',
      email: 'janis@example.com',
      phone: '+37120000001',
      password: residentPassword,
      role: 'resident',
      language: 'lv',
      isActive: true
    });
    
    await testResident.save();
    console.log('✅ Test resident created successfully!');
    console.log('📧 Email: janis@example.com');
    console.log('🔑 Password: resident123');
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('👑 Super Admin: admin@homemanager.com / admin123');
    console.log('🏠 Test Resident: janis@example.com / resident123');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Запуск инициализации
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
