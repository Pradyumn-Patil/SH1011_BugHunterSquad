const app = require('express')();
const http = require('http').Server(app);
const market = require('./lib/market');
const io = require('socket.io')(http);

const hostname = 'localhost';
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/market', (req, res) => {
  res.send(market.marketPositions);
});

// Hardcoded example - Have the server invoke the updateMarket method periodically to add more data points
setInterval(function () {
  market.updateMarket();
  io.sockets.emit('market', market.marketPositions[0]);
}, 1000);

// Socket.IO events
io.on('connection', function (socket) {
  console.log('a user connected');
});

http.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});