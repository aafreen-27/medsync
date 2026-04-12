import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Divider, Chip } from '@mui/material';
import { Warning as WarningIcon, People as PeopleIcon } from '@mui/icons-material';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';

const mockLineData = [
  { time: '08:00', inflow: 40, outflow: 10 },
  { time: '10:00', inflow: 10, outflow: 5 },
  { time: '12:00', inflow: 5, outflow: 20 },
  { time: '14:00', inflow: 30, outflow: 15 },
  { time: '16:00', inflow: 50, outflow: 40 },
];

const mockBarData = [
  { name: 'Doctors', available: 12, total: 15 },
  { name: 'Nurses', available: 45, total: 50 },
  { name: 'Paramedics', available: 8, total: 10 },
];

const initialWards = [
  { id:1,  name:"Ward 1",  staff:4,  patients:16 },
  { id:2,  name:"Ward 2",  staff:3,  patients:7  },
  { id:3,  name:"Ward 3",  staff:3,  patients:8  },
  { id:4,  name:"Ward 4",  staff:2,  patients:12 },
  { id:5,  name:"Ward 5",  staff:8,  patients:20 },
  { id:6,  name:"Ward 6",  staff:1,  patients:5  },
  { id:7,  name:"Ward 7",  staff:1,  patients:17 },
  { id:8,  name:"Ward 8",  staff:7,  patients:19 },
  { id:9,  name:"Ward 9",  staff:4,  patients:10 },
  { id:10, name:"Ward 10", staff:4,  patients:24 },
];

const getWardStatus = (staff, patients) => {
  const ratio = patients / staff;
  if (ratio <= 4) return "balanced";
  if (ratio <= 6) return "busy";
  return "overloaded";
};

const statusStyle = {
  balanced:  { bg:"#f0faf4", border:"#22c55e", label:"Balanced", color:"#15803d" },
  busy:      { bg:"#fffbeb", border:"#f59e0b", label:"Busy",     color:"#92600a" },
  overloaded:{ bg:"#fef2f2", border:"#ef4444", label:"Overloaded", color:"#b91c1c" },
};

const RealTimeMonitoring = () => {
  const [wards, setWards] = useState(initialWards);
  const [alerts, setAlerts] = useState([
    "Ward 7 is approaching threshold — 1 staff for 7 patients",
    "Dr. Ahmed went off-duty — ICU needs reassignment"
  ]);
  const [lineData, setLineData] = useState(mockLineData);
  const [barData, setBarData] = useState(mockBarData);
  const [newAlertCount, setNewAlertCount] = useState(2);

  useEffect(() => {
    const wardInterval = setInterval(() => {
      setWards(prev => {
        const nextWards = prev.map(ward => {
          const nextPatients = Math.max(1, ward.patients + Math.floor(Math.random() * 7) - 3);
          const nextStaff = Math.max(1, ward.staff + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0));
          return { ...ward, patients: nextPatients, staff: nextStaff };
        });

        // Gen alerts
        const newAlerts = [];
        nextWards.forEach((ward, i) => {
          const oldStatus = getWardStatus(prev[i].staff, prev[i].patients);
          const newStatus = getWardStatus(ward.staff, ward.patients);
          if (newStatus === 'overloaded' && oldStatus !== 'overloaded') {
            newAlerts.unshift(`CRITICAL: ${ward.name} is OVERLOADED — Staff: ${ward.staff} | Patients: ${ward.patients}`);
          } else if (newStatus === 'busy' && oldStatus === 'balanced') {
            newAlerts.unshift(`🟡 ${ward.name} approaching threshold — Staff: ${ward.staff} | Patients: ${ward.patients}`);
          }
          if (ward.staff < prev[i].staff) {
            newAlerts.unshift(`⚠ Staff reduced on ${ward.name} — now ${ward.staff} staff for ${ward.patients} patients`);
          }
        });

        if (newAlerts.length > 0) {
          setAlerts(old => [...newAlerts, ...old].slice(0, 8));
          setNewAlertCount(prevC => prevC + newAlerts.length);
        }

        return nextWards;
      });
    }, 15000);

    const chartInterval = setInterval(() => {
      setLineData(prev => {
        const d = new Date();
        const timeStr = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
        const newIn = prev[prev.length - 1].inflow + Math.floor(Math.random() * 11) - 5;
        const newOut = prev[prev.length - 1].outflow + Math.floor(Math.random() * 11) - 5;
        const pts = [...prev, { time: timeStr, inflow: Math.max(0, newIn), outflow: Math.max(0, newOut) }];
        return pts.slice(-8);
      });
      
      setBarData(prev => prev.map(r => {
        const diff = Math.random() > 0.5 ? 1 : -1;
        return { ...r, available: Math.max(0, Math.min(r.total, r.available + diff)) };
      }));
    }, 60000);

    return () => {
      clearInterval(wardInterval);
      clearInterval(chartInterval);
    };
  }, []);

  const totalStaff = wards.reduce((sum, w) => sum + w.staff, 0);
  const totalPatients = wards.reduce((sum, w) => sum + w.patients, 0);
  const avgRatio = totalStaff === 0 ? 0 : (totalPatients / totalStaff).toFixed(1);
  const overloadedCount = wards.filter(w => getWardStatus(w.staff, w.patients) === 'overloaded').length;

  return (
    <Box>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Real-Time Monitoring</Typography>
      
      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {[
          { title: 'Total Staff On Duty', value: totalStaff, color: '#2196f3' },
          { title: 'Total Patients', value: totalPatients, color: '#9c27b0' },
          { title: 'Avg Staff Ratio', value: `1:${avgRatio}`, color: '#00bcd4' },
          { title: 'Overloaded Wards', value: overloadedCount, color: '#f44336' }
        ].map((kpi, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderLeft: `5px solid ${kpi.color}`, boxShadow: 2 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>{kpi.title}</Typography>
                <Typography variant="h4" component="div" fontWeight="bold">{kpi.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Left Side: Heatmap & Charts */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">Live Hospital Wing Heat Map</Typography>
            <Grid container spacing={1.5}>
              {wards.map(ward => {
                const status = getWardStatus(ward.staff, ward.patients);
                const style = statusStyle[status];
                return (
                  <Grid item xs={12} sm={6} md={4} key={ward.id} sx={{ flexBasis: { lg: '20%' }, maxWidth: { lg: '20%' } }}>
                    <Box sx={{ 
                      p: 1.5,
                      borderRadius: 2, 
                      backgroundColor: style.bg,
                      borderLeft: `4px solid ${style.border}`,
                      position: 'relative',
                      transition: 'background 0.8s',
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 }
                    }} title={`${ward.name} — Ratio: 1:${(ward.patients/ward.staff).toFixed(1)} ${status==='overloaded'?'⚠':''}`}>
                      <Chip label={style.label} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: style.border, color: 'white', fontWeight: 'bold', fontSize: '0.6rem', height: 20 }} />
                      <Typography fontWeight="bold" noWrap color={style.color} pr={7}>{ward.name}</Typography>
                      <Box mt={1.5}>
                        <Typography variant="body2" color="textSecondary">Staff: <b>{ward.staff}</b></Typography>
                        <Typography variant="body2" color="textSecondary">Patients: <b>{ward.patients}</b></Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                        <Typography variant="caption" fontWeight="bold">Ratio: 1:{(ward.patients/ward.staff).toFixed(1)}</Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#f44336', animation: 'pulse 1.5s infinite' }} />
                          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.6rem' }}>Live</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 300, borderRadius: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Staff Inflow vs Outflow</Typography>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="inflow" stroke="#4caf50" strokeWidth={2} />
                    <Line type="monotone" dataKey="outflow" stroke="#f44336" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 300, borderRadius: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Availability per Role</Typography>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="available" fill="#2196f3" />
                    <Bar dataKey="total" fill="#cfd8dc" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Side: Alerts */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, height: '100%', borderRadius: 3, maxHeight: 800, overflowY: 'auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">Live Alert Feed</Typography>
              <Chip label={`${newAlertCount} New`} color="error" size="small" onClick={() => setNewAlertCount(0)} sx={{ cursor: 'pointer' }} />
            </Box>
            <Divider sx={{ mb: 2 }} />
            {alerts.map((alert, idx) => (
              <Box key={idx} sx={{ p: 1.5, mb: 2, borderRadius: 2, backgroundColor: alert.includes('CRITICAL') ? '#ffebee' : '#f5f5f5', borderLeft: alert.includes('CRITICAL') ? '4px solid #f44336' : '4px solid #ff9800' }}>
                <Typography variant="body2" fontWeight={alert.includes('CRITICAL') ? 'bold' : 'normal'}>
                  {alert}
                </Typography>
                <Typography variant="caption" color="textSecondary" mt={1} display="block">
                  Just now
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealTimeMonitoring;
