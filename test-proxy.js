const http = require('http');

// Тестируем прокси через localhost:3000
function testProxy() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'admin@homemanager.com',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
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
        console.log('Status:', res.statusCode);
        console.log('Headers:', res.headers);
        console.log('Response:', data);
        resolve({ status: res.statusCode, data: data });
      });
    });

    req.on('error', (e) => {
      console.error('Request error:', e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

console.log('🔍 Testing proxy through localhost:3000...');
testProxy().catch(console.error);
