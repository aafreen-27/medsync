import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Tabs, Tab, Card, CardContent, Button, Divider, 
  Table, TableBody, TableCell, TableHead, TableRow, LinearProgress, Chip
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Download as DownloadIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const shiftData = [
    { name: 'Mon', Morning: 8, Evening: 6, Night: 4, Total: 18, Coverage: 90 },
    { name: 'Tue', Morning: 7, Evening: 7, Night: 5, Total: 19, Coverage: 95 },
    { name: 'Wed', Morning: 9, Evening: 8, Night: 4, Total: 21, Coverage: 100 },
    { name: 'Thu', Morning: 6, Evening: 5, Night: 4, Total: 15, Coverage: 75 },
    { name: 'Fri', Morning: 8, Evening: 7, Night: 3, Total: 18, Coverage: 90 },
  ];

  const ratioTrendData = [
    { name: 'Mon', ratio: 3.8, safe: 5.0 },
    { name: 'Tue', ratio: 4.1, safe: 5.0 },
    { name: 'Wed', ratio: 4.9, safe: 5.0 },
    { name: 'Thu', ratio: 5.2, safe: 5.0 },
    { name: 'Fri', ratio: 4.4, safe: 5.0 },
  ];

  const wardRatioData = [
    { name: 'Ward 1', ratio: 3.2 }, { name: 'Ward 2', ratio: 2.8 }, { name: 'Ward 3', ratio: 4.1 },
    { name: 'Ward 4', ratio: 3.5 }, { name: 'Ward 5', ratio: 4.8 }, { name: 'Ward 6', ratio: 5.2 },
    { name: 'Ward 7', ratio: 2.1 }, { name: 'Ward 8', ratio: 4.6 }, { name: 'Ward 9', ratio: 3.9 },
    { name: 'Ward 10', ratio: 6.8 }
  ];

  const overtimeData = [
    { name: 'Dr. V. Srinivas', hours: 18 }, { name: 'Nurse P. Rajan', hours: 14 },
    { name: 'R. Kumar', hours: 12 }, { name: 'Nurse D. Nair', hours: 10 },
    { name: 'Dr. A. Mehta', hours: 8 }, { name: 'Nurse L. Devi', hours: 7 },
    { name: 'Dr. M. Krishnan', hours: 6 }, { name: 'Nurse F. Begum', hours: 5 }
  ];

  const leavePieData = [
    { name: 'Sick Leave', value: 40 }, { name: 'Annual Leave', value: 35 },
    { name: 'Emergency', value: 15 }, { name: 'Unpaid', value: 10 }
  ];

  const leaveTrendData = [
    { name: 'Jan', days: 8 }, { name: 'Feb', days: 11 }, { name: 'Mar', days: 9 }, { name: 'Apr', days: 14 }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="#0d47a1">Reports & Analytics</Typography>
        <Box display="flex" gap={1}>
          <Box bgcolor="#e3f2fd" p={0.5} borderRadius={2} display="flex" gap={0.5}>
            <Button variant="contained" size="small" disableElevation>Today</Button>
            <Button variant="text" size="small">This Week</Button>
            <Button variant="text" size="small">This Month</Button>
            <Button variant="text" size="small">Custom Range</Button>
          </Box>
          <Button variant="outlined" startIcon={<PdfIcon />} sx={{ bgcolor: 'white' }}>Export PDF</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ bgcolor: 'white' }}>Export Excel</Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab label="Shift Utilization" />
          <Tab label="Staff-to-Patient Ratio" />
          <Tab label="Overtime & Workload" />
          <Tab label="Leave & Absence" />
          <Tab label="KBI Dashboard" />
        </Tabs>
      </Paper>

      {/* TAB 1: SHIFT UTILIZATION */}
      {tabValue === 0 && (
        <Box>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Average Coverage</Typography><Typography variant="h4">92%</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Most Active Shift</Typography><Typography variant="h4">Morning</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Total Staff Deployed</Typography><Typography variant="h4">112</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Understaffed Incidents</Typography><Typography variant="h4" color="error">3</Typography></CardContent></Card></Grid>
          </Grid>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>Weekly Shift Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={shiftData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="Morning" stackId="a" fill="#bbdefb" />
                    <Bar dataKey="Evening" stackId="a" fill="#ffe082" />
                    <Bar dataKey="Night" stackId="a" fill="#cfd8dc" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
               <Paper sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>Coverage % Trend</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={shiftData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="Coverage" stroke="#4caf50" fill="#c8e6c9" />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
          <Paper sx={{ p: 2, overflowX: 'auto' }}>
            <Typography variant="h6" mb={2}>Shift Details</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Day</b></TableCell>
                  <TableCell><b>Morning Shifts</b></TableCell>
                  <TableCell><b>Evening Shifts</b></TableCell>
                  <TableCell><b>Night Shifts</b></TableCell>
                  <TableCell><b>Total</b></TableCell>
                  <TableCell><b>Coverage %</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shiftData.map(row => (
                  <TableRow key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.Morning}</TableCell>
                    <TableCell>{row.Evening}</TableCell>
                    <TableCell>{row.Night}</TableCell>
                    <TableCell>{row.Total}</TableCell>
                    <TableCell><Chip label={`${row.Coverage}%`} color={row.Coverage < 80 ? 'error' : 'success'} size="small" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {/* TAB 2: STAFF-TO-PATIENT RATIO */}
      {tabValue === 1 && (
        <Box>
           <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Avg Ratio</Typography><Typography variant="h4">1:4.2</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Best Ward</Typography><Typography variant="h4" color="success.main">Ward 7 (1:2.1)</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Worst Ward</Typography><Typography variant="h4" color="error.main">Ward 10 (1:6.8)</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Safe Threshold</Typography><Typography variant="h4" color="primary">1:5</Typography></CardContent></Card></Grid>
          </Grid>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>Ratio Trend This Week</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ratioTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ratio" stroke="#8884d8" name="Actual Ratio" strokeWidth={2} />
                    <Line type="monotone" dataKey="safe" stroke="#f44336" strokeDasharray="5 5" name="Safe Threshold (1:5)" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>Ratio by Ward</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={wardRatioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="ratio">
                      {wardRatioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.ratio > 5.0 ? '#f44336' : '#2196f3'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 3: OVERTIME & WORKLOAD */}
      {tabValue === 2 && (
        <Box>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Total Overtime Hours</Typography><Typography variant="h4">48h</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Most Overworked</Typography><Typography variant="body1" fontWeight="bold">Dr. Vikram Srinivas</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Avg Hours/Staff</Typography><Typography variant="h4">46h</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Burnout Risk</Typography><Typography variant="h4" color="warning.main">3 staff</Typography></CardContent></Card></Grid>
          </Grid>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" mb={2}>Overtime Hours by Employee</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={overtimeData} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <RechartsTooltip />
                <Bar dataKey="hours">
                   {overtimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hours > 10 ? '#ef6c00' : '#4caf50'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      )}

      {/* TAB 4: LEAVE & ABSENCE */}
      {tabValue === 3 && (
        <Box>
           <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Total Leave Days</Typography><Typography variant="h4">14</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Staff On Leave</Typography><Typography variant="h4">2</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Pending Requests</Typography><Typography variant="h4" color="primary">1</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Approval Rate</Typography><Typography variant="h4">87%</Typography></CardContent></Card></Grid>
          </Grid>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>Leave by Type</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={leavePieData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {leavePieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
             <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>Monthly Leave Trend (Jan–Apr)</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leaveTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="days" fill="#9c27b0" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Leave Requests</Typography>
            <Table size="small">
              <TableHead><TableRow><TableCell><b>Employee</b></TableCell><TableCell><b>Type</b></TableCell><TableCell><b>From</b></TableCell><TableCell><b>To</b></TableCell><TableCell><b>Days</b></TableCell><TableCell><b>Status</b></TableCell></TableRow></TableHead>
              <TableBody>
                <TableRow><TableCell>Dr. Sneha Pillai</TableCell><TableCell>Sick Leave</TableCell><TableCell>08 Apr</TableCell><TableCell>12 Apr</TableCell><TableCell>5</TableCell><TableCell><Chip label="Approved" size="small" color="success" /></TableCell></TableRow>
                <TableRow><TableCell>Suresh Babu</TableCell><TableCell>Annual Leave</TableCell><TableCell>10 Apr</TableCell><TableCell>14 Apr</TableCell><TableCell>5</TableCell><TableCell><Chip label="Approved" size="small" color="success" /></TableCell></TableRow>
                <TableRow><TableCell>Nurse Divya Nair</TableCell><TableCell>Sick Leave</TableCell><TableCell>15 Apr</TableCell><TableCell>15 Apr</TableCell><TableCell>1</TableCell><TableCell><Chip label="Pending" size="small" color="warning" /></TableCell></TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {/* TAB 5: KBI DASHBOARD */}
      {tabValue === 4 && (
        <Box>
          <Grid container spacing={3} mb={4}>
            {[
              { label: 'Staff Coverage Rate', target: '95%', value: 87, color: 'warning' },
              { label: 'Schedule Compliance', target: '90%', value: 92, color: 'success' },
              { label: 'Avg Response to Alert', target: '<5m', value: 84, customVal: '4m12s', color: 'success' },
              { label: 'Burnout Risk Index', target: '<15%', value: 12, color: 'success' },
              { label: 'Understaffed Incidents', target: '0', value: 3, raw: 3, color: 'error' },
              { label: 'Patient Care Score', target: '4.0/5', value: 86, customVal: '4.3/5', color: 'success' },
            ].map((kbi, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ borderLeft: `6px solid ${kbi.color === 'success' ? '#4caf50' : kbi.color === 'warning' ? '#ff9800' : '#f44336'}`}}>
                  <CardContent>
                    <Typography color="textSecondary" variant="body2">{kbi.label}</Typography>
                    <Typography variant="h4" my={1}>{kbi.customVal || (kbi.raw !== undefined ? kbi.raw : `${kbi.value}%`)}</Typography>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption" color="textSecondary">Target ({kbi.target})</Typography>
                      <Chip label={kbi.color === 'success' ? 'ON TRACK' : kbi.color === 'warning' ? 'AT RISK' : 'FAILING'} size="small" color={kbi.color} sx={{ height: 16, fontSize: '0.6rem' }}/>
                    </Box>
                    <LinearProgress variant="determinate" value={kbi.raw !== undefined ? 10 : kbi.value} color={kbi.color} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Reports;
