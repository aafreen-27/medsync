import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Paper, Button, IconButton, CircularProgress,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, Drawer, LinearProgress, Divider, TextField
} from '@mui/material';
import {
  AutoGraph as AutoGraphIcon, ArrowBackIosNew as PrevIcon, ArrowForwardIos as NextIcon,
  Menu as MenuIcon, Edit as EditIcon, WarningAmber as WarningIcon, Close as CloseIcon, Note as NoteIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Hardcoded Data
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const wards = Array.from({ length: 10 }, (_, i) => `Ward ${i + 1}`);

const staffList = [
  { id: 'EMP001', name: 'Dr. Arjun Mehta', role: 'Doctor', onLeave: false },
  { id: 'EMP002', name: 'Nurse Priya Rajan', role: 'Nurse', onLeave: false },
  { id: 'EMP003', name: 'Dr. Sneha Pillai', role: 'Doctor', onLeave: true },
  { id: 'EMP004', name: 'Ramesh Kumar', role: 'Paramedic', onLeave: false },
  { id: 'EMP005', name: 'Nurse Divya Nair', role: 'Nurse', onLeave: false },
  { id: 'EMP006', name: 'Dr. Karthik Subramanian', role: 'Doctor', onLeave: false },
  { id: 'EMP007', name: 'Anitha Selvam', role: 'Admin', onLeave: false },
  { id: 'EMP008', name: 'Nurse Fatima Begum', role: 'Nurse', onLeave: false },
  { id: 'EMP009', name: 'Dr. Vikram Srinivas', role: 'Doctor', onLeave: false },
  { id: 'EMP010', name: 'Suresh Babu', role: 'Paramedic', onLeave: true },
  { id: 'EMP011', name: 'Nurse Lakshmi Devi', role: 'Nurse', onLeave: false },
  { id: 'EMP012', name: 'Dr. Meena Krishnan', role: 'Doctor', onLeave: false }
];

const generateWeekData = (mondayDate) => {
  const weekNum = Math.floor(mondayDate.getTime() / (7 * 24 * 60 * 60 * 1000));
  const result = {};

  for (let d = 0; d < 7; d++) {
    const date = new Date(mondayDate);
    date.setDate(mondayDate.getDate() + d);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    result[dateKey] = {};

    const wardsToday = wards.filter((_, i) => (i + d + weekNum) % 2 === 0);

    wardsToday.forEach((ward, i) => {
      const empIndex = (i + d + weekNum) % staffList.length;
      const emp = staffList[empIndex];
      if (emp.onLeave) return;

      const shiftType = ['Morning', 'Evening', 'Night'][empIndex % 3];

      result[dateKey][ward] = {
        staffId: emp.id,
        shift: shiftType,
      };
    });
  }
  return result;
};

const initializeAllShifts = () => {
  const shifts = {};
  const currentMonday = getMonday(new Date());

  for (let w = -4; w <= 4; w++) {
    const weekMonday = new Date(currentMonday);
    weekMonday.setDate(currentMonday.getDate() + w * 7);
    const weekData = generateWeekData(weekMonday);
    Object.assign(shifts, weekData);
  }

  return shifts;
};


const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getYMD = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const RoleStyles = { Doctor: { c: '#0d47a1', bg: '#e3f2fd' }, Nurse: { c: '#00695c', bg: '#e0f2f1' }, Paramedic: { c: '#e65100', bg: '#fff3e0' }, Admin: { c: '#6a1b9a', bg: '#f3e5f5' } };
const ShiftStyles = { Morning: { c: '#1a7fcf', bg: '#e6f1fb' }, Evening: { c: '#f59e0b', bg: '#fef9e7' }, Night: { c: '#4b5563', bg: '#f1f2f5' } };

const ShiftScheduler = () => {
  const [allShifts, setAllShifts] = useState(initializeAllShifts);
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [lastSaved, setLastSaved] = useState('Never');

  const [filters, setFilters] = useState({ Morning: true, Evening: true, Night: true, Conflict: true });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [toasts, setToasts] = useState([]); // Advanced stacking if needed, but going with single persistent toast for now

  // Modals
  const [openModal, setOpenModal] = useState(false);
  const [modalTarget, setModalTarget] = useState({ ward: '', dateStr: '', hasShift: false, currentStaffId: '' });
  const [formData, setFormData] = useState({ staffId: '', shift: 'Morning', note: '' });

  const [openPso, setOpenPso] = useState(false);
  const [isPsoLoading, setIsPsoLoading] = useState(false);
  const [psoResult, setPsoResult] = useState(null);
  const [psoError, setPsoError] = useState(null);
  const [openRemove, setOpenRemove] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [conflictBannerDismissed, setConflictBannerDismissed] = useState(false);

  const gridRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || openModal || openPso || openRemove) return;
      if (e.key === 'ArrowLeft') setWeekStart(prev => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; });
      if (e.key === 'ArrowRight') setWeekStart(prev => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; });
      if (e.key === 't' || e.key === 'T') setWeekStart(getMonday(new Date()));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openModal, openPso, openRemove]);

  useEffect(() => {
    const dateKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const endKey = `${weekEnd.getFullYear()}-${String(weekEnd.getMonth() + 1).padStart(2, '0')}-${String(weekEnd.getDate()).padStart(2, '0')}`;

    // Check if we have data for the start or end of this week
    const hasData = Object.keys(allShifts).some(k => k >= dateKey && k <= endKey);

    if (!hasData) {
      const newWeekData = generateWeekData(weekStart);
      setAllShifts(prev => ({ ...prev, ...newWeekData }));
    }
  }, [weekStart]);

  // Derived Logic
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const formatDate = (date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const activeDays = daysOfWeek.map((day, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return { label: day, dateStr: getYMD(d), displayDate: d.getDate() + ' ' + d.toLocaleString('default', { month: 'short' }) };
  });

  // Calculate Conflicts explicitly
  const dayConflicts = {};
  let totalConflicts = 0;
  let conflictMsg = null;

  activeDays.forEach(({ dateStr }) => {
    const daily = allShifts[dateStr] || {};
    const staffMap = {};
    Object.entries(daily).forEach(([w, data]) => {
      if (!staffMap[data.staffId]) staffMap[data.staffId] = [];
      staffMap[data.staffId].push(w);
    });

    Object.entries(staffMap).forEach(([sId, wArr]) => {
      if (wArr.length > 1) {
        if (!dayConflicts[dateStr]) dayConflicts[dateStr] = {};
        dayConflicts[dateStr][sId] = wArr;
        totalConflicts++;
        if (!conflictMsg) {
          const sName = staffList.find(s => s.id === sId)?.name || 'Staff';
          const dayName = new Date(dateStr).toLocaleString('default', { weekday: 'short' });
          conflictMsg = `${sName}: ${wArr.join(' & ')} on ${dayName}`;
        }
      }
    });
  });

  // Cell Interaction
  const openCellModal = (ward, dateStr, existingShift) => {
    setModalTarget({ ward, dateStr, hasShift: !!existingShift, currentStaffId: existingShift ? existingShift.staffId : null });
    setFormData({
      staffId: existingShift ? existingShift.staffId : '',
      shift: existingShift ? existingShift.shift : 'Morning',
      note: existingShift?.note || ''
    });
    setOpenModal(true);
  };

  const checkModalConflict = (staffId) => {
    if (!staffId) return false;
    const daily = allShifts[modalTarget.dateStr] || {};
    return Object.entries(daily).some(([w, data]) => w !== modalTarget.ward && data.staffId === staffId && modalTarget.currentStaffId !== staffId);
  };

  const handleAssignSave = () => {
    setAllShifts(prev => {
      const state = { ...prev };
      if (!state[modalTarget.dateStr]) state[modalTarget.dateStr] = {};
      state[modalTarget.dateStr][modalTarget.ward] = { staffId: formData.staffId, shift: formData.shift, note: formData.note };
      return state;
    });
    setOpenModal(false);
    setConflictBannerDismissed(false); // Reset banner visibility on new assignments
    const sName = staffList.find(s => s.id === formData.staffId)?.name;
    const dayName = new Date(modalTarget.dateStr).toLocaleString('default', { weekday: 'short' });
    showToast(`Shift assigned — ${sName} to ${modalTarget.ward} ${dayName} ${formData.shift}`);
  };

  const handleRemove = () => {
    setAllShifts(prev => {
      const state = { ...prev };
      if (state[modalTarget.dateStr] && state[modalTarget.dateStr][modalTarget.ward]) {
        delete state[modalTarget.dateStr][modalTarget.ward];
      }
      return state;
    });
    setOpenRemove(false);
    setOpenModal(false);
    const dayName = new Date(modalTarget.dateStr).toLocaleString('default', { weekday: 'short' });
    showToast(`Shift removed from ${modalTarget.ward} ${dayName}`);
  };

  const showToast = (msg, sev = 'success') => setToast({ open: true, message: msg, severity: sev });

  // Auto Schedule Logic
  const runPSO = async () => {
    setIsPsoLoading(true);
    setPsoError(null);
    setPsoResult(null);

    try {
      const response = await fetch('/api/schedules/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Failed with status ${response.status}`);
      }

      setPsoResult(data.schedules || []);
      showToast('✅ PSO Algorithm generated schedule successfully');
    } catch (err) {
      console.error(err);
      setPsoError(err.message);
      showToast('❌ PSO generation failed', 'error');
    } finally {
      setIsPsoLoading(false);
    }
  };

  const clearWeek = () => {
    if (!window.confirm(`Clear all shifts for ${formatDate(weekStart)} – ${formatDate(weekEnd)}?`)) return;
    setAllShifts(prev => {
      const state = { ...prev };
      activeDays.forEach(({ dateStr }) => delete state[dateStr]);
      return state;
    });
  };

  const exportPDF = async () => {
    if (!gridRef.current) return;
    showToast('Generating PDF...', 'info');
    const canvas = await html2canvas(gridRef.current, { scale: 1.5 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    pdf.setFontSize(16);
    pdf.text(`MedSync — Week of ${formatDate(weekStart)} - ${formatDate(weekEnd)}`, 14, 15);
    pdf.addImage(imgData, 'PNG', 14, 25, 270, (canvas.height * 270) / canvas.width);
    pdf.save(`schedule_${getYMD(weekStart)}.pdf`);
    showToast('Export successful!');
  };

  const saveBackend = () => {
    setLastSaved(`Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    showToast('Schedule saved successfully');
  };

  // Render Helpers
  const getStaff = id => staffList.find(s => s.id === id);

  // Ward Summary mapping
  const wardSummaries = wards.map(w => {
    let count = 0;
    activeDays.forEach(({ dateStr }) => { if (allShifts[dateStr]?.[w]) count++; });
    const cColor = count === 7 ? '#4caf50' : count > 3 ? '#ff9800' : '#f44336';
    return { name: w, count, cColor };
  });

  // Calculate workloads for Drawer
  const staffLoad = staffList.map(s => {
    let count = 0;
    activeDays.forEach(({ dateStr }) => {
      const daily = allShifts[dateStr] || {};
      Object.values(daily).forEach(d => { if (d.staffId === s.id) count++; });
    });
    return { ...s, count };
  }).sort((a, b) => b.count - a.count);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h4" fontWeight="bold" color="#0d47a1">Shift Scheduler</Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <Box display="flex" alignItems="center" bgcolor="#f5f5f5" borderRadius={3} p={0.5}>
            <IconButton size="small" onClick={() => setWeekStart(prev => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; })}>
              <PrevIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" sx={{ width: 170, textAlign: 'center', fontWeight: 'bold' }}>
              {formatDate(weekStart)} – {formatDate(weekEnd)}
            </Typography>
            <IconButton size="small" onClick={() => setWeekStart(prev => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; })}>
              <NextIcon fontSize="small" />
            </IconButton>
          </Box>
          <Button variant="outlined" size="small" onClick={() => setWeekStart(getMonday(new Date()))}>Today</Button>
        </Box>

        <Box display="flex" gap={2}>
          <Button variant="outlined" color="primary" startIcon={<MenuIcon />} onClick={() => setDrawerOpen(true)}>Staff Load</Button>
          <Button variant="contained" color="secondary" startIcon={<AutoGraphIcon />} onClick={() => { setPsoResult(null); setPsoError(null); setOpenPso(true); }}>Auto-Schedule (PSO)</Button>
        </Box>
      </Box>

      {/* Checkbox Legend */}
      <Box display="flex" gap={3} my={2}>
        {['Morning', 'Evening', 'Night', 'Conflict'].map((key) => (
          <Box key={key} display="flex" alignItems="center" gap={1}
            sx={{ opacity: filters[key] ? 1 : 0.4, textDecoration: filters[key] ? 'none' : 'line-through', cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setFilters(prev => ({ ...prev, [key]: !prev[key] }))}>
            <input type="checkbox" checked={filters[key]} readOnly style={{ accentColor: key === 'Conflict' ? '#ef4444' : ShiftStyles[key]?.c, width: 16, height: 16, cursor: 'pointer' }} />
            <Typography variant="body2" fontWeight="bold">{key === 'Conflict' ? 'Conflict ⚠' : key}</Typography>
          </Box>
        ))}
      </Box>

      {totalConflicts > 0 && filters.Conflict && !conflictBannerDismissed && (
        <Alert severity="error" sx={{ mb: 2, border: '1px solid #ef4444', alignItems: 'center' }}
          action={<Button color="inherit" size="small" onClick={() => setConflictBannerDismissed(true)}>Dismiss</Button>}
        >
          <Typography fontWeight="bold">⚠ {totalConflicts} scheduling conflict{totalConflicts > 1 ? 's' : ''} detected</Typography>
          <Typography variant="body2">{conflictMsg}</Typography>
        </Alert>
      )}

      {/* Ward Coverages Panel */}
      <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2, display: 'flex', gap: 2, overflowX: 'auto', bgcolor: '#fafafa' }}>
        {wardSummaries.map(w => (
          <Box key={w.name} sx={{ minWidth: 100, textAlign: 'center' }}>
            <Typography variant="caption" fontWeight="bold" display="block">{w.name}</Typography>
            <LinearProgress variant="determinate" value={(w.count / 7) * 100} sx={{ height: 6, borderRadius: 3, my: 0.5, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: w.cColor } }} />
            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>{w.count}/7 days</Typography>
          </Box>
        ))}
      </Paper>

      {/* Main Grid Payload */}
      <div ref={gridRef} style={{ background: '#fff' }}>
        <Paper sx={{ p: 2, borderRadius: 3, overflowX: 'auto' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: `90px repeat(${daysOfWeek.length}, minmax(135px, 1fr))`, gap: '4px' }}>
            <Box sx={{ p: 1, fontWeight: 'bold', borderBottom: '2px solid #ccc', pt: 3 }}>Wards</Box>
            {activeDays.map(dObj => (
              <Box key={dObj.label} sx={{ p: 1, borderBottom: '2px solid #ccc', textAlign: 'center' }}>
                <Typography fontWeight="bold" color="#333">{dObj.label}</Typography>
                <Typography variant="caption" color="textSecondary">{dObj.displayDate}</Typography>
              </Box>
            ))}

            {wards.map((ward) => (
              <React.Fragment key={ward}>
                <Box sx={{ p: 1.5, borderRight: '1px solid #eee', fontWeight: 'bold', display: 'flex', alignItems: 'center', backgroundColor: '#fafafa' }}>{ward}</Box>
                {activeDays.map(({ dateStr }) => {
                  const shiftData = allShifts[dateStr]?.[ward];
                  let isHidden = false;
                  let hasConflictRaw = false;

                  if (shiftData) {
                    hasConflictRaw = dayConflicts[dateStr]?.[shiftData.staffId]?.includes(ward);
                    if (!filters[shiftData.shift]) isHidden = true;
                  }

                  const displayConflict = hasConflictRaw && filters.Conflict;
                  const isEmpty = !shiftData || isHidden;
                  const renderCol = displayConflict ? '#fef2f2' : (isEmpty ? '#fff' : ShiftStyles[shiftData.shift].bg);
                  const borderCol = displayConflict ? '#ef4444' : (isEmpty ? '#e0e0e0' : ShiftStyles[shiftData.shift].c);

                  return (
                    <Box
                      key={`${ward}-${dateStr}`}
                      onClick={() => openCellModal(ward, dateStr, isEmpty ? null : shiftData)}
                      sx={{
                        position: 'relative', p: 1, minHeight: 90, border: `1px ${isEmpty ? 'dashed' : 'solid'} ${borderCol}`,
                        borderRadius: 2, cursor: 'pointer', display: 'flex', flexDirection: 'column',
                        backgroundColor: renderCol, '&:hover': { borderColor: '#424242', boxShadow: 'inset 0 0 0 1px #424242' },
                        '&:hover .hover-icon': { opacity: 1 }
                      }}
                    >
                      {!isEmpty && (
                        <Box className="hover-icon" sx={{ position: 'absolute', top: 4, right: 4, opacity: 0, transition: '0.2s', color: 'text.secondary' }}>
                          <EditIcon sx={{ fontSize: 14 }} />
                        </Box>
                      )}
                      {displayConflict && !isEmpty && (
                        <Box sx={{ position: 'absolute', top: 4, right: 4, color: '#ef4444' }}>
                          <WarningIcon sx={{ fontSize: 18 }} />
                        </Box>
                      )}

                      {isEmpty ? (
                        <Typography variant="caption" color="#aaa" sx={{ m: 'auto', fontWeight: 'bold' }}>Empty</Typography>
                      ) : (() => {
                        const st = getStaff(shiftData.staffId);
                        return (
                          <>
                            <Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: displayConflict ? '#b91c1c' : '#333', lineHeight: 1.2, mt: 0.5, pr: 1.5 }}>
                              {st?.name}
                            </Typography>
                            <Typography sx={{ fontSize: '11px', color: '#6b7280', mb: 1.5 }}>
                              {st?.role}
                            </Typography>

                            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt="auto">
                              <Box sx={{
                                display: 'inline-block', px: 1, py: 0.25, borderRadius: 4, fontSize: '10px', fontWeight: 'bold',
                                color: RoleStyles[st?.role]?.c || '#333', backgroundColor: RoleStyles[st?.role]?.bg || '#eee'
                              }}>
                                {st?.role}
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: ShiftStyles[shiftData.shift].c }}>
                                {shiftData.shift === 'Morning' ? '🌅' : shiftData.shift === 'Evening' ? '🌆' : '🌙'}
                                <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>{shiftData.shift}</Typography>
                              </Box>
                            </Box>
                          </>
                        )
                      })()}
                    </Box>
                  )
                })}
              </React.Fragment>
            ))}
          </Box>
        </Paper>
      </div>

      {/* Sticky Bottom Action Bar */}
      <Box sx={{
        position: 'sticky', bottom: 0, bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)',
        borderTop: '1px solid #e0e0e0', p: 2, mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2, boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="body2" color="textSecondary">Last saved: <b>{lastSaved}</b></Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" color="error" onClick={clearWeek}>🗑 Clear Week</Button>
          <Button variant="outlined" color="primary" onClick={exportPDF}>📄 Export PDF</Button>
          <Button variant="contained" color="primary" onClick={saveBackend}>💾 Save Schedule</Button>
        </Box>
      </Box>

      {/* Assign / Edit Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">
          {modalTarget.hasShift ? 'Edit Shift' : 'Assign Shift'} — {modalTarget.ward} | {new Date(modalTarget.dateStr).toLocaleString('default', { weekday: 'long' })}, {new Date(modalTarget.dateStr).getDate()} {new Date(modalTarget.dateStr).toLocaleString('default', { month: 'short' })}
        </DialogTitle>
        <DialogContent dividers>

          {checkModalConflict(formData.staffId) && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              ⚠ <b>{getStaff(formData.staffId)?.name}</b> is already assigned to another ward on {new Date(modalTarget.dateStr).toLocaleString('default', { weekday: 'long' })}. Assigning here will create a conflict.
            </Alert>
          )}

          <FormControl fullWidth size="small" sx={{ mb: 3, mt: 1 }}>
            <InputLabel>Select Staff</InputLabel>
            <Select value={formData.staffId} label="Select Staff" onChange={e => setFormData({ ...formData, staffId: e.target.value })}>
              {staffList.map(s => (
                <MenuItem key={s.id} value={s.id} disabled={s.onLeave}>
                  {s.name} — {s.role} {s.onLeave ? <Typography component="span" variant="caption" color="error" sx={{ ml: 1 }}> (On Leave)</Typography> : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mb: 3 }}>
            <InputLabel>Select Shift</InputLabel>
            <Select value={formData.shift} label="Select Shift" onChange={e => setFormData({ ...formData, shift: e.target.value })}>
              <MenuItem value="Morning">🌅 Morning (06:00 – 14:00)</MenuItem>
              <MenuItem value="Evening">🌆 Evening (14:00 – 22:00)</MenuItem>
              <MenuItem value="Night">🌙 Night (22:00 – 06:00)</MenuItem>
            </Select>
          </FormControl>

          <TextField fullWidth size="small" label="Note (optional)" multiline rows={2} placeholder="Any special instructions for this shift"
            value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} />

        </DialogContent>
        <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#f9f9f9' }}>
          {modalTarget.hasShift ? (
            <Button color="error" onClick={() => setOpenRemove(true)}>🗑 Remove Shift</Button>
          ) : <Box />}
          <Box>
            <Button onClick={() => setOpenModal(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" onClick={handleAssignSave} disabled={!formData.staffId}>{modalTarget.hasShift ? 'Save Changes' : 'Assign Shift →'}</Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Remove Confirm Modal */}
      <Dialog open={openRemove} onClose={() => setOpenRemove(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Remove Shift</DialogTitle>
        <DialogContent dividers>
          <Typography>Remove {getStaff(modalTarget.currentStaffId)?.name} from {modalTarget.ward} on {new Date(modalTarget.dateStr).toLocaleString('default', { weekday: 'long' })}?</Typography>
          <Typography color="error" variant="body2" mt={1}>This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRemove(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRemove}>Yes, Remove</Button>
        </DialogActions>
      </Dialog>

      {/* PSO Modal */}
      <Dialog open={openPso} onClose={() => { if (!isPsoLoading) setOpenPso(false) }} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Run PSO Auto-Scheduler</DialogTitle>
        <DialogContent dividers>
          {isPsoLoading ? (
            <Box py={4} display="flex" flexDirection="column" alignItems="center">
              <CircularProgress size={50} thickness={4} color="secondary" />
              <Typography mt={3} fontWeight="bold" color="secondary">Optimizing Shifts via Particle Swarm...</Typography>
            </Box>
          ) : psoResult ? (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>Optimised Schedule Output:</Typography>
              <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', p: 1 }}>
                {psoResult.length === 0 ? <Typography variant="body2" p={1}>No shifts assigned.</Typography> : null}
                {psoResult.map((emp, i) => (
                  <Box key={i} p={1} borderBottom={i < psoResult.length - 1 ? '1px solid #eee' : 'none'}>
                    <Typography variant="body2" fontWeight="bold">Employee ID: {emp.employeeId}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Assigned Shifts: {emp.assignedShifts && emp.assignedShifts.length > 0 ? emp.assignedShifts.join(', ') : 'None'}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Box>
          ) : psoError ? (
            <Alert severity="error">{psoError}</Alert>
          ) : (
            <Typography>
              Generate an optimized shift schedule using Particle Swarm Optimization (PSO) AI.
              <br /><br />
              <b>Continue?</b>
            </Typography>
          )}
        </DialogContent>
        {(!isPsoLoading && !psoResult) && (
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenPso(false)}>Cancel</Button>
            <Button variant="contained" color="secondary" onClick={runPSO}>Run PSO Algorithm →</Button>
          </DialogActions>
        )}
        {(psoResult || psoError) && (
          <DialogActions sx={{ p: 2 }}>
            <Button variant="contained" onClick={() => setOpenPso(false)}>Close</Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Workload Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 320 } }}>
        <Box p={2} mb={1} display="flex" justifyContent="space-between" alignItems="center" bgcolor="#f5f5f5">
          <Typography variant="h6" fontWeight="bold">Staff Workload</Typography>
          <IconButton size="small" onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <Typography variant="caption" color="textSecondary" sx={{ px: 2, display: 'block', mb: 2 }}>This week ({formatDate(weekStart)} – {formatDate(weekEnd)})</Typography>

        <Box px={2}>
          {staffLoad.map(s => (
            <Box key={s.id} mb={2} sx={{ opacity: s.onLeave ? 0.5 : 1, textDecoration: s.onLeave ? 'line-through' : 'none' }}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" fontWeight="bold">{s.name}</Typography>
                <Typography variant="caption" fontWeight="bold" color={s.onLeave ? 'textSecondary' : s.count >= 5 ? 'error.main' : 'primary'}>
                  {s.onLeave ? 'ON LEAVE' : `${s.count} shift${s.count !== 1 ? 's' : ''}`}
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={s.onLeave ? 0 : Math.min((s.count / 5) * 100, 100)}
                sx={{ height: 6, borderRadius: 3, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: s.count >= 5 ? '#ff9800' : '#2196f3' } }} />
            </Box>
          ))}
        </Box>
      </Drawer>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ShiftScheduler;
