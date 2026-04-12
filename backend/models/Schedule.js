import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  ward: { type: String, required: true },
  shiftStart: { type: Date, required: true },
  shiftEnd: { type: Date, required: true },
  status: { type: String, enum: ['scheduled', 'in-progress', 'completed'], default: 'scheduled' }
}, { timestamps: true });

export default mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);
