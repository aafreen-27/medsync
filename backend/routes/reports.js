import express from 'express';
import Employee from '../models/Employee.js';
import Schedule from '../models/Schedule.js';

const router = express.Router();

// GET dashboard statistics
router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    const totalSchedules = await Schedule.countDocuments();
    
    // Aggregate role distribution
    const roleStats = await Employee.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalEmployees,
      activeEmployees,
      totalSchedules,
      roleStats: roleStats.map(r => ({ role: r._id, count: r.count }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
