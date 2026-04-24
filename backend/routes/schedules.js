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
    const employees = await Employee.find();
    const numEmployees = employees.length || 0;

    const response = await fetch('http://localhost:5001/optimize-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        num_employees: numEmployees,
        num_shifts: 3
      })
    });

    if (!response.ok) {
      throw new Error(`PSO service responded with status ${response.status}`);
    }

    const data = await response.json();

    res.json({
      message: 'Optimal schedule generated successfully using AI rules.',
      schedules: data.data || []
    });
  } catch (err) {
    console.error('Error generating schedule:', err);
    res.status(503).json({ error: 'PSO service is currently unavailable.', details: err.message });
  }
});

export default router;
