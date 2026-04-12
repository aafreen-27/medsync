import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  staffId: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Admin', 'HR Staff', 'Doctor', 'Nurse', 'Paramedic'], required: true },
  department: { type: String, required: true },
  ward: { type: String, default: '' },
  shift: { type: String, enum: ['Morning', 'Evening', 'Night', ''], default: '' },
  specialization: { type: String },
  contact: { type: String },
  email: { type: String },
  joiningDate: { type: Date, default: Date.now },
  availabilityDays: [{ type: String }],
  status: { type: String, enum: ['Active', 'On Leave', 'Off Duty'], default: 'Active' },
  credentialsUrl: { type: String },
  shiftsCompleted: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
