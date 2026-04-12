import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Divider, Chip } from '@mui/material';
import { Warning as WarningIcon, People as PeopleIcon } from '@mui/icons-material';
import { io } from 'socket.io-client';
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

const RealTimeMonitoring = () => {
  const [wards, setWards] = useState([]);
  const [alerts, setAlerts] = useState([
    "Ward 7 is approaching threshold — 1 staff for 7 patients",
    "Dr. Ahmed went off-duty — ICU needs reassignment"
  ]);

  useEffect(() => {
    // Connect to websocket backend
    const socket = io('http://localhost:5000');
    
    socket.on('heatmap-update', (data) => {
      setWards(data);
      // Auto-generate an alert if a ward becomes overloaded
      const critical = data.filter(w => w.status === 'overloaded');
      if (critical.length > 0 && Math.random() > 0.5) {
        setAlerts(prev => [`CRITICAL: ${critical[0].name} requires immediate assistance.`, ...prev].slice(0, 8));
      }
    });

    return () => socket.disconnect();
  }, []);

  const getTileColor = (status) => {
    if (status === 'overloaded') return '#ffebee'; // red
    if (status === 'busy') return '#fff8e1';       // amber 
    return '#e8f5e9'; // green (balanced)
  };

  const getBorderColor = (status) => {
    if (status === 'overloaded') return '#ef5350';
    if (status === 'busy') return '#ffca28';
    return '#66bb6a';
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Real-Time Monitoring</Typography>
      
      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {[
          { title: 'Total Staff On Duty', value: 65, color: '#2196f3' },
          { title: 'Total Patients', value: 142, color: '#9c27b0' },
          { title: 'Avg Staff Ratio', value: '1:4', color: '#00bcd4' },
          { title: 'Overloaded Wards', value: wards.filter(w => w.status === 'overloaded').length || 0, color: '#f44336' }
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
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">Live Hospital Wing Heat Map</Typography>
            <Grid container spacing={2}>
              {wards.length === 0 ? (
                <Grid item xs={12}><Typography color="textSecondary">Waiting for live socket data...</Typography></Grid>
              ) : wards.map(ward => (
                <Grid item xs={6} sm={4} md={3} key={ward.id}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: getTileColor(ward.status),
                    border: `1px solid ${getBorderColor(ward.status)}`,
                    position: 'relative'
                  }}>
                    {ward.status === 'overloaded' && (
                      <WarningIcon color="error" sx={{ position: 'absolute', top: 5, right: 5, fontSize: 18 }} />
                    )}
                    <Typography fontWeight="bold" noWrap>{ward.name}</Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <PeopleIcon fontSize="small" color="action" />
                      <Typography variant="body2" ml={1}>{ward.staffCount} Staff</Typography>
                    </Box>
                    <Typography variant="caption" display="block">Patients: {ward.patientLoad}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 300, borderRadius: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Staff Inflow vs Outflow</Typography>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={mockLineData}>
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
                  <BarChart data={mockBarData}>
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
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', borderRadius: 3, maxHeight: 800, overflowY: 'auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">Live Alert Feed</Typography>
              <Chip label={`${alerts.length} New`} color="error" size="small" />
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
