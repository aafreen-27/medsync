import express from 'express';
import Schedule from '../models/Schedule.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// GET all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('employeeId');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST generate schedule dummy endpoint for PSO trigger
router.post('/generate', async (req, res) => {
  try {
    // In a real scenario, this would call the Python PSO microservice
    // For now, we return a mock success
    // Example: fetch('http://localhost:5001/optimize-schedule')
    
    // Marking active mock schedules
    res.json({ message: 'Optimal schedule generated successfully using AI rules.', schedules: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
