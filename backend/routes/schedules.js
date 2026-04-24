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
    const response = await fetch('http://127.0.0.1:5001/optimize-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        num_staff: 12,
        num_shifts: 3
      })
    });

    if (!response.ok) {
      throw new Error(`PSO service responded with status ${response.status}`);
    }

    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error('Error generating schedule:', err);
    res.status(503).json({ error: 'PSO service is currently unavailable.' });
  }
});

export default router;
