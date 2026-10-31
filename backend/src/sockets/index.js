const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:4200', 'http://localhost:4300'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join trip room for targeted updates
    socket.on('join:trip', ({ tripId }) => {
      socket.join(`trip:${tripId}`);
      console.log(`Socket ${socket.id} joined trip:${tripId}`);
    });

    // Leave trip room
    socket.on('leave:trip', ({ tripId }) => {
      socket.leave(`trip:${tripId}`);
      console.log(`Socket ${socket.id} left trip:${tripId}`);
    });

    // Handle vehicle location update
    socket.on('vehicle:location-update', (data) => {
      // Broadcast to all clients
      io.emit('vehicle:location-update', data);
    });

    // Handle telemetry alert
    socket.on('telemetry:alert', (data) => {
      io.emit('telemetry:alert', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };
