import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MedSync Backend is running' });
});

// Import Routes
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import scheduleRoutes from './routes/schedules.js';
import settingsRoutes from './routes/settings.js';
import reportRoutes from './routes/reports.js';

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reports', reportRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// For simulating heatmap live updates
setInterval(() => {
  const wardsData = Array.from({ length: 10 }, (_, i) => ({
    id: `ward-${i+1}`,
    name: `Ward ${i+1}`,
    staffCount: Math.floor(Math.random() * 8) + 1,
    patientLoad: Math.floor(Math.random() * 20) + 5,
    status: Math.random() > 0.8 ? 'overloaded' : (Math.random() > 0.5 ? 'busy' : 'balanced')
  }));
  io.emit('heatmap-update', wardsData);
}, 5000);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ihrms';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB local connection successful');
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('Warning: Database not connected. Running server anyway for static routes.');
    // Run server even if DB connection fails for demo purposes
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
