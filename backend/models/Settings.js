import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  hospitalName: { type: String, default: 'CareFlow General Hospital' },
  timezone: { type: String, default: 'UTC' },
  dateFormat: { type: String, default: 'MM/DD/YYYY' },
  shiftTimes: {
    morning: { start: { type: String, default: '08:00' }, end: { type: String, default: '16:00' } },
    evening: { start: { type: String, default: '16:00' }, end: { type: String, default: '00:00' } },
    night: { start: { type: String, default: '00:00' }, end: { type: String, default: '08:00' } }
  },
  autoSchedule: { type: Boolean, default: true },
  refreshInterval: { type: Number, default: 30 }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
