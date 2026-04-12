import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

// GET all employees with optional search and filter
router.get('/', async (req, res) => {
  try {
    const { search, role, department, status, shift } = req.query;
    let query = {};
    if (search) query.name = new RegExp(search, 'i');
    if (role && role !== 'All Roles') query.role = role;
    if (department && department !== 'All Departments') query.department = department;
    if (status && status !== 'All') query.status = status;
    if (shift && shift !== 'All') query.shift = shift;

    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new employee
router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update employee
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE deactivate/delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST bulk import
router.post('/bulk', async (req, res) => {
  try {
    const employees = await Employee.insertMany(req.body);
    res.status(201).json({ message: `${employees.length} employees imported successfully` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
