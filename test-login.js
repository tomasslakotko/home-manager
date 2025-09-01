const http = require('http');

function testLogin(email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: email,
      password: password
    });

    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  try {
    console.log('🔐 Testing login API...');
    
    // Тест 1: Администратор
    console.log('\n👑 Testing admin login...');
    const adminResult = await testLogin('admin@homemanager.com', 'admin123');
    console.log('Status:', adminResult.status);
    console.log('Response:', adminResult.data);
    
    if (adminResult.status === 200) {
      console.log('✅ Admin login successful!');
    } else {
      console.log('❌ Admin login failed!');
    }
    
    // Тест 2: Жилец
    console.log('\n🏠 Testing resident login...');
    const residentResult = await testLogin('janis@example.com', 'resident123');
    console.log('Status:', residentResult.status);
    console.log('Response:', residentResult.data);
    
    if (residentResult.status === 200) {
      console.log('✅ Resident login successful!');
    } else {
      console.log('❌ Resident login failed!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Запускаем тесты
runTests();
