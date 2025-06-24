require('dotenv').config({ path: '.env.local' });
const http = require('http');
const app = require('./app');
// const { setupSocket } = require('./socket');
const connectDB = require('./config/db');

const server = http.createServer(app);
// setupSocket(server);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
