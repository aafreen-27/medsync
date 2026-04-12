import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  currentPatientCount: { type: Number, default: 0 },
  requiredStaffToPatientRatio: { type: Number, default: 5 }, // e.g. 1 staff per 5 patients
  currentAssignedStaff: { type: Number, default: 0 },
  status: { type: String, enum: ['Safe', 'Warning', 'Critical'], default: 'Safe' }
}, { timestamps: true });

export default mongoose.models.Ward || mongoose.model('Ward', wardSchema);
