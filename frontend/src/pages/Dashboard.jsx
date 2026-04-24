import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, Chip, Tooltip as MuiTooltip, Link, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Dialog, DialogTitle, DialogContent, Button, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert
} from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';

// --- Animations
const pulseAnimation = `
  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
  }
`;

const flashAnimation = `
  @keyframes flash {
    0% { background-color: rgba(33, 150, 243, 0.2); }
    100% { background-color: transparent; }
  }
`;

// --- Initial Mock Data
const initialPatientData = [
  { time: '14:00', inflow: 12, outflow: 8 },
  { time: '14:01', inflow: 25, outflow: 15 },
  { time: '14:02', inflow: 45, outflow: 30 },
  { time: '14:03', inflow: 38, outflow: 42 },
  { time: '14:04', inflow: 20, outflow: 25 },
];

const initialStaffData = [
  { name: 'Doctors', available: 15, total: 20 },
  { name: 'Nurses', available: 32, total: 40 },
  { name: 'Paramedics', available: 9, total: 12 },
];

const baseWards = Array.from({ length: 10 }, (_, i) => ({
  id: `ward-${i+1}`, name: `Ward ${i+1}`, staffCount: 4, patientLoad: 16
}));

const activityPool = [
  { icon: '🟢', text: "Nurse Priya Rajan clocked in — Ward 2" },
  { icon: '🔴', text: "Ward 10 flagged as overloaded" },
  { icon: '🟡', text: "Leave approved — Suresh Babu" },
  { icon: '🔵', text: "PSO auto-schedule ran — 52 shifts set" },
  { icon: '🟢', text: "Dr. Arjun Mehta assigned to Ward 4" },
  { icon: '🔵', text: "New employee added — Dr. Meena" }
];

const initialIdleStaff = [
  { id: 101, name: "Dr. Karthik Subramanian", role: "Doctor" },
  { id: 102, name: "Anitha Selvam", role: "Admin" },
  { id: 103, name: "Suresh Babu", role: "Paramedic" }
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  // States
  const [kpis, setKpis] = useState({ ratio: 4.2, shifts: 114, inflow: 24 });
  const [idlePerc, setIdlePerc] = useState(14); // Controlled natively instead of random fluctuation
  const [kpiUpdateFlag, setKpiUpdateFlag] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  const [patientData, setPatientData] = useState(initialPatientData);
  const [staffData, setStaffData] = useState(initialStaffData);
  const [wardsData, setWardsData] = useState(baseWards);
  
  const [activities, setActivities] = useState([
    { id: 1, time: "15:19", icon: '🟢', text: "Nurse Priya Rajan clocked in — Ward 2" },
    { id: 2, time: "15:10", icon: '🔴', text: "Ward 10 flagged as overloaded" },
    { id: 3, time: "15:05", icon: '🟡', text: "Leave approved — Suresh Babu (Apr 10–14)" },
    { id: 4, time: "14:52", icon: '🔵', text: "PSO auto-schedule ran — 52 shifts set" }
  ]);

  // Idle Modals & Assignment Logic
  const [idleStaff, setIdleStaff] = useState(initialIdleStaff);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null); // active assignment step
  const [assignForm, setAssignForm] = useState({ ward: '', shift: '' });
  const [toast, setToast] = useState({ open: false, message: '' });

  // Intervals
  useEffect(() => {
    const interval30s = setInterval(() => {
      setKpis(prev => ({
        ratio: parseFloat((Math.random() * (4.5 - 3.8) + 3.8).toFixed(1)),
        shifts: prev.shifts + Math.floor(Math.random() * 7) - 3,
        inflow: Math.floor(Math.random() * (31 - 18 + 1) + 18)
      }));
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setKpiUpdateFlag(true);
      setTimeout(() => setKpiUpdateFlag(false), 1000);

      setWardsData(prev => prev.map(w => {
        let sc = w.staffCount + (Math.random() > 0.5 ? 1 : -1);
        if (sc < 1) sc = 1;
        let pc = w.patientLoad + Math.floor(Math.random() * 5) - 2;
        if (pc < 5) pc = 5;
        return { ...w, staffCount: sc, patientLoad: pc };
      }));
    }, 30000);

    const interval60s = setInterval(() => {
      setPatientData(prev => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const last = prev[prev.length - 1];
        const newArr = [...prev, { time: timeStr, inflow: last.inflow + Math.floor(Math.random()*15)-5, outflow: last.outflow + Math.floor(Math.random()*15)-5 }];
        return newArr.length > 8 ? newArr.slice(newArr.length - 8) : newArr;
      });

      setActivities(prev => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const ev = activityPool[Math.floor(Math.random() * activityPool.length)];
        return [{ id: Math.random(), time: timeStr, ...ev }, ...prev].slice(0, 6);
      });
    }, 60000);

    return () => { clearInterval(interval30s); clearInterval(interval60s); };
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees');
        const data = await response.json();
        
        let doctors = 0, availableDoctors = 0;
        let nurses = 0, availableNurses = 0;
        let paramedics = 0, availableParamedics = 0;

        data.forEach(emp => {
          // Exclude admins from the chart mapping if they exist
          if (emp.role === 'Doctor') {
            doctors++;
            if (!emp.onLeave) availableDoctors++;
          } else if (emp.role === 'Nurse') {
            nurses++;
            if (!emp.onLeave) availableNurses++;
          } else if (emp.role === 'Paramedic') {
            paramedics++;
            if (!emp.onLeave) availableParamedics++;
          }
        });

        setStaffData([
          { name: 'Doctors', available: availableDoctors, total: doctors },
          { name: 'Nurses', available: availableNurses, total: nurses },
          { name: 'Paramedics', available: availableParamedics, total: paramedics }
        ]);
      } catch (error) {
        console.error('Failed to fetch employees', error);
      }
    };
    
    fetchEmployees();
  }, []);

  // Handlers
  const handleAssignClick = (staff) => {
    setSelectedStaff(staff);
    setAssignForm({ ward: '', shift: '' });
  };

  const confirmAssignment = () => {
    if (!assignForm.ward || !assignForm.shift) return;
    
    setIdleStaff(prev => prev.filter(s => s.id !== selectedStaff.id));
    setIdlePerc(prev => Math.max(prev - 2, 0)); // decrease by 2%
    
    setToast({ open: true, message: `${selectedStaff.name} assigned to ${assignForm.ward} — ${assignForm.shift} shift` });
    setSelectedStaff(null);
  };

  // Color logic mapping
  const getRatioColor = (r) => r > 5 ? '#f44336' : r < 4 ? '#4caf50' : '#ff9800';
  const getInflowColor = (i) => i > 30 ? '#f44336' : i > 20 ? '#ff9800' : '#4caf50';
  const getIdleColor = (i) => i > 12 ? '#f44336' : i < 8 ? '#4caf50' : '#ff9800';
  const getHeatmapColor = (r) => r > 6 ? '#f44336' : r > 4 ? '#ff9800' : '#4caf50';

  const StatCard = ({ title, value, subtitle, icon, valueColor, borderHighlight, liveDot, isFlashing, onAddClick }) => (
    <Card sx={{ height: '100%', borderRadius: 3, borderLeft: `6px solid ${borderHighlight || valueColor}`, animation: isFlashing ? 'flash 1s' : 'none', transition: 'background-color 0.3s' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" variant="subtitle2" fontWeight="bold" textTransform="uppercase">
              {title}
            </Typography>
            <Box display="flex" alignItems="center" my={1}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: valueColor || '#2c3e50' }}>{value}</Typography>
              {liveDot && <Box sx={{ ml: 1, width: 8, height: 8, bgcolor: '#4caf50', borderRadius: '50%', animation: 'pulse 2s infinite' }} />}
            </Box>
            <Typography variant="caption" color="textSecondary">{subtitle}</Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap={1} alignItems="flex-end">
            <Box sx={{ backgroundColor: `${borderHighlight || valueColor}15`, p: 1, borderRadius: 2, color: borderHighlight || valueColor }}>
              {icon}
            </Box>
            {onAddClick && (
              <IconButton size="small" onClick={onAddClick} sx={{ color: 'white', bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}>
                <AddIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <style>{pulseAnimation}{flashAnimation}</style>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Staff-to-Patient" value={`1 : ${kpis.ratio}`} subtitle="Optimal is 1:4" icon={<PeopleIcon />} valueColor={getRatioColor(kpis.ratio)} isFlashing={kpiUpdateFlag} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Shifts" value={kpis.shifts} subtitle="Currently running" icon={<AccessTimeIcon />} valueColor="#2c3e50" borderHighlight="#9c27b0" liveDot isFlashing={kpiUpdateFlag} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Patient Inflow" value={`+${kpis.inflow}%`} subtitle={`Last updated: ${lastUpdated}`} icon={<TrendingUpIcon />} valueColor={getInflowColor(kpis.inflow)} isFlashing={kpiUpdateFlag} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Idle Staff" value={`${idlePerc}%`} subtitle="Currently unassigned" icon={<LocalHospitalIcon />} valueColor={getIdleColor(idlePerc)} isFlashing={kpiUpdateFlag} onAddClick={() => setModalOpen(true)} />
        </Grid>

        {/* Charts Row */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: 420, borderRadius: 3 }}>
            <CardContent sx={{ height: '100%', position: 'relative' }}>
              <Box position="absolute" top={16} right={16} display="flex" alignItems="center" gap={0.5} bgcolor="#e8f5e9" px={1} py={0.5} borderRadius={1}>
                <Box sx={{ width: 6, height: 6, bgcolor: '#4caf50', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                <Typography variant="caption" fontWeight="bold" color="success.main">LIVE</Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>Patient Inflow vs Outflow</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={patientData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line isAnimationActive={true} type="monotone" dataKey="inflow" stroke="#2196f3" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line isAnimationActive={true} type="monotone" dataKey="outflow" stroke="#4caf50" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: 420, borderRadius: 3 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Staff Availability (By Role)</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={staffData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'transparent' }} formatter={(value, name, props) => [`${value} of ${props.payload.total} available`, 'Count']} />
                  <Legend />
                  <Bar isAnimationActive={true} dataKey="available" radius={[4, 4, 0, 0]}>
                    {staffData.map((entry, index) => {
                      const perc = entry.available / entry.total;
                      return <Cell key={`cell-${index}`} fill={perc < 0.5 ? '#f44336' : '#2196f3'} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Real-time Heatmap & Activity */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%', borderRadius: 3, background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Real-Time Hospital Wing Heat Map</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip size="small" label="Balanced (< 1:4)" sx={{ bgcolor: '#4caf50', color: 'white' }} />
                  <Chip size="small" label="Busy (1:4 - 1:6)" sx={{ bgcolor: '#ff9800', color: 'white' }} />
                  <Chip size="small" label="Overloaded (> 1:6)" sx={{ bgcolor: '#f44336', color: 'white' }} />
                </Box>
              </Box>

              <Grid container spacing={2}>
                {wardsData.map((ward) => {
                  const r = parseFloat((ward.patientLoad / ward.staffCount).toFixed(1));
                  const bg = getHeatmapColor(r);
                  return (
                    <Grid item xs={12} sm={6} md={2.4} key={ward.id}>
                      <MuiTooltip title={
                        <Box p={0.5}>
                          <Typography variant="subtitle2" fontWeight="bold">{ward.name} — Dr. Arjun Mehta on duty</Typography>
                          <Typography variant="caption">Shift: Morning | Next: Nurse Lakshmi</Typography>
                        </Box>
                      } arrow placement="top">
                        <Box sx={{ p: 2, borderRadius: 2, border: `2px solid ${bg}`, backgroundColor: `${bg}15`, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }} onClick={() => navigate(`/monitoring?ward=${ward.id.replace('ward-','')}`)}>
                          <Typography variant="subtitle1" fontWeight="bold">{ward.name}</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
                            <Typography variant="body2" color="textSecondary">Staff: <b>{ward.staffCount}</b></Typography>
                            <Typography variant="body2" color="textSecondary">Pat: <b>{ward.patientLoad}</b></Typography>
                          </Box>
                          <Typography variant="caption" sx={{ mt: 1, fontWeight: 'bold', color: bg }}>Ratio {1}:{r}</Typography>
                        </Box>
                      </MuiTooltip>
                    </Grid>
                  )
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">Recent Activity</Typography>
                <Link component="button" variant="caption" onClick={() => navigate('/settings')}>View all activity</Link>
              </Box>
              <List sx={{ pt: 0 }}>
                {activities.map((ev, i) => (
                  <ListItem key={ev.id} disablePadding sx={{ mb: 1, animation: i === 0 ? 'flash 1s' : 'none' }}>
                    <ListItemIcon sx={{ minWidth: 36, fontSize: '1.2rem' }}>{ev.icon}</ListItemIcon>
                    <ListItemText primary={<Typography variant="body2" fontWeight={i===0?'bold':'normal'}>{ev.time} — {ev.text}</Typography>} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* IDLE STAFF MODAL */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight="bold">Assign Idle Staff</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Current idle staff count: {idlePerc}% ({idleStaff.length} unassigned staff)
          </Typography>
          
          {idleStaff.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="success.main">All staff are currently assigned ✅</Typography>
            </Box>
          ) : !selectedStaff ? (
            <List>
              {idleStaff.map(staff => (
                <ListItem key={staff.id} disablePadding sx={{ border: '1px solid #eee', mb: 1, borderRadius: 2, p: 1 }}>
                  <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                  <ListItemText primary={<Typography fontWeight="bold">{staff.name}</Typography>} secondary={staff.role} />
                  <Button variant="outlined" size="small" onClick={() => handleAssignClick(staff)}>Assign</Button>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box py={2}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>Assign {selectedStaff.name} to:</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Ward</InputLabel>
                <Select value={assignForm.ward} label="Ward" onChange={(e) => setAssignForm({...assignForm, ward: e.target.value})}>
                  {Array.from({length:10}, (_,i)=> `Ward ${i+1}`).map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Shift</InputLabel>
                <Select value={assignForm.shift} label="Shift" onChange={(e) => setAssignForm({...assignForm, shift: e.target.value})}>
                  <MenuItem value="Morning">Morning</MenuItem>
                  <MenuItem value="Evening">Evening</MenuItem>
                  <MenuItem value="Night">Night</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={() => setSelectedStaff(null)}>Back</Button>
                <Button variant="contained" onClick={confirmAssignment} disabled={!assignForm.ward || !assignForm.shift}>Confirm Assignment</Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({...toast, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast({...toast, open: false})}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
