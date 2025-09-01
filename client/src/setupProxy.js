const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': '/api' // Сохраняем /api в пути
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying:', req.method, req.path, '->', proxyReq.path);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
      }
    })
  );
};
