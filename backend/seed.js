import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js';

dotenv.config();

const sampleEmployees = [
  { staffId: 'EMP001', name: 'Dr. Arjun Mehta', role: 'Doctor', department: 'Cardiology', ward: 'Ward 4', shift: 'Morning', status: 'Active', contact: '123-456-7890', email: 'arjun.m@ihrms.com' },
  { staffId: 'EMP002', name: 'Nurse Priya Rajan', role: 'Nurse', department: 'ICU', ward: 'Ward 2', shift: 'Evening', status: 'Active', contact: '234-567-8901', email: 'priya.r@ihrms.com' },
  { staffId: 'EMP003', name: 'Dr. Sneha Pillai', role: 'Doctor', department: 'Neurology', ward: 'Ward 6', shift: 'Night', status: 'On Leave', contact: '345-678-9012', email: 'sneha.p@ihrms.com' },
  { staffId: 'EMP004', name: 'Ramesh Kumar', role: 'Paramedic', department: 'Emergency', ward: 'Ward 1', shift: 'Morning', status: 'Active', contact: '456-789-0123', email: 'ramesh.k@ihrms.com' },
  { staffId: 'EMP005', name: 'Nurse Divya Nair', role: 'Nurse', department: 'Pediatrics', ward: 'Ward 3', shift: 'Morning', status: 'Active', contact: '567-890-1234', email: 'divya.n@ihrms.com' },
  { staffId: 'EMP006', name: 'Dr. Karthik Subramanian', role: 'Doctor', department: 'Orthopedics', ward: 'Ward 5', shift: 'Evening', status: 'Off Duty', contact: '678-901-2345', email: 'karthik.s@ihrms.com' },
  { staffId: 'EMP007', name: 'Anitha Selvam', role: 'Admin', department: 'Administration', ward: '', shift: 'Morning', status: 'Active', contact: '789-012-3456', email: 'anitha.s@ihrms.com' },
  { staffId: 'EMP008', name: 'Nurse Fatima Begum', role: 'Nurse', department: 'Oncology', ward: 'Ward 8', shift: 'Night', status: 'Active', contact: '890-123-4567', email: 'fatima.b@ihrms.com' },
  { staffId: 'EMP009', name: 'Dr. Vikram Srinivas', role: 'Doctor', department: 'General Surgery', ward: 'Ward 7', shift: 'Morning', status: 'Active', contact: '901-234-5678', email: 'vikram.s@ihrms.com' },
  { staffId: 'EMP010', name: 'Suresh Babu', role: 'Paramedic', department: 'Emergency', ward: 'Ward 1', shift: 'Evening', status: 'On Leave', contact: '012-345-6789', email: 'suresh.b@ihrms.com' },
  { staffId: 'EMP011', name: 'Nurse Lakshmi Devi', role: 'Nurse', department: 'Cardiology', ward: 'Ward 4', shift: 'Morning', status: 'Active', contact: '112-233-4455', email: 'lakshmi.d@ihrms.com' },
  { staffId: 'EMP012', name: 'Dr. Meena Krishnan', role: 'Doctor', department: 'Gynecology', ward: 'Ward 9', shift: 'Evening', status: 'Active', contact: '223-344-5566', email: 'meena.k@ihrms.com' }
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ihrms';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding...');
    
    // Check if empty
    const currentCount = await Employee.countDocuments();
    if (currentCount === 0) {
      console.log('Database empty, inserting 12 sample employees...');
      await Employee.insertMany(sampleEmployees);
      console.log('Data successfully inserted');
    } else {
      console.log('Database already has data. Creating missing samples if needed or overwriting if you run drop.');
      // Actually, for this update, let's just wipe and recreate the 12 samples to ensure accuracy
      await Employee.deleteMany({});
      await Employee.insertMany(sampleEmployees);
      console.log('Old data wiped, 12 fresh samples inserted!');
    }
    
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    mongoose.connection.close();
  });
