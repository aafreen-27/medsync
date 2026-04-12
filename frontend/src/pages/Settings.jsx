import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Tabs, Tab, TextField, Switch, Button, 
  FormControlLabel, Divider, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
  Checkbox, Card, CardContent
} from '@mui/material';

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="#0d47a1">Platform Settings</Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab label="System Settings" />
          <Tab label="User & Role Management" />
          <Tab label="Notifications" />
          <Tab label="Audit Log" />
          <Tab label="Integrations" />
        </Tabs>
      </Paper>

      {/* TAB 1: SYSTEM SETTINGS */}
      {tabValue === 0 && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" mb={3}>General Preferences</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Hospital Name" defaultValue="MedSync Central" sx={{ mb: 3 }} />
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Date Format</InputLabel>
                <Select defaultValue="DD/MM/YYYY" label="Date Format">
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth label="Staff-to-Patient Warning Threshold" type="number" defaultValue={5} sx={{ mb: 3 }} />
              <TextField fullWidth label="Staff-to-Patient Critical Threshold" type="number" defaultValue={7} sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button variant="outlined" component="label" fullWidth sx={{ mb: 3, height: 56, textTransform: 'none' }}>
                Upload Healthcare Facility Logo (PNG/JPG)
                <input type="file" hidden accept="image/*" />
              </Button>
              <Box mb={3}>
                <Typography variant="subtitle2" color="textSecondary" mb={1}>Default Shift Windows</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}><TextField size="small" label="Morning" defaultValue="06:00 - 14:00" /></Grid>
                  <Grid item xs={4}><TextField size="small" label="Evening" defaultValue="14:00 - 22:00" /></Grid>
                  <Grid item xs={4}><TextField size="small" label="Night" defaultValue="22:00 - 06:00" /></Grid>
                </Grid>
              </Box>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Real-Time Monitoring Refresh Rate</InputLabel>
                <Select defaultValue="30s" label="Real-Time Monitoring Refresh Rate">
                  <MenuItem value="15s">Every 15 Seconds</MenuItem>
                  <MenuItem value="30s">Every 30 Seconds</MenuItem>
                  <MenuItem value="60s">Every 60 Seconds</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" mb={2}>Advanced</Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="Enable AI Auto-Scheduling Constraints" />
          <FormControlLabel control={<Switch defaultChecked />} label="Enable Real-Time Floor Heatmap" />
          
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button variant="contained" size="large">SAVE SETTINGS</Button>
          </Box>
        </Paper>
      )}

      {/* TAB 2: USER & ROLE MANAGEMENT */}
      {tabValue === 1 && (
        <Box>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">System Accounts</Typography>
              <Button variant="contained" size="small">+ Add User</Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Email</b></TableCell>
                    <TableCell><b>Role</b></TableCell>
                    <TableCell><b>Last Login</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    <TableCell><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Admin User</TableCell><TableCell>admin@medsync.in</TableCell>
                    <TableCell><Chip size="small" label="Admin" color="secondary" /></TableCell><TableCell>Today 3:07 PM</TableCell>
                    <TableCell><Chip size="small" label="Active" color="success" /></TableCell><TableCell><Button size="small">Edit</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>HR Manager</TableCell><TableCell>hr@medsync.in</TableCell>
                    <TableCell><Chip size="small" label="HR Staff" color="primary" /></TableCell><TableCell>Yesterday</TableCell>
                    <TableCell><Chip size="small" label="Active" color="success" /></TableCell><TableCell><Button size="small">Edit</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dr. Arjun Mehta</TableCell><TableCell>arjun@medsync.in</TableCell>
                    <TableCell><Chip size="small" label="Doctor" color="info" /></TableCell><TableCell>2 days ago</TableCell>
                    <TableCell><Chip size="small" label="Active" color="success" /></TableCell><TableCell><Button size="small">Edit</Button></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Role Permissions Matrix</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Role</b></TableCell>
                    <TableCell align="center"><b>Dashboard</b></TableCell>
                    <TableCell align="center"><b>Employees</b></TableCell>
                    <TableCell align="center"><b>Scheduler</b></TableCell>
                    <TableCell align="center"><b>Monitoring</b></TableCell>
                    <TableCell align="center"><b>Reports</b></TableCell>
                    <TableCell align="center"><b>Settings</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><b>Admin</b></TableCell><TableCell align="center"><Checkbox checked disabled/></TableCell><TableCell align="center"><Checkbox checked disabled/></TableCell><TableCell align="center"><Checkbox checked disabled/></TableCell><TableCell align="center"><Checkbox checked disabled/></TableCell><TableCell align="center"><Checkbox checked disabled/></TableCell><TableCell align="center"><Checkbox checked disabled/></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>HR Staff</b></TableCell><TableCell align="center"><Checkbox defaultChecked/></TableCell><TableCell align="center"><Checkbox defaultChecked/></TableCell><TableCell align="center"><Checkbox defaultChecked/></TableCell><TableCell align="center"><Checkbox defaultChecked/></TableCell><TableCell align="center"><Checkbox defaultChecked/></TableCell><TableCell align="center"><Checkbox /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Doctor/Nurse</b></TableCell><TableCell align="center"><Checkbox defaultChecked/></TableCell><TableCell align="center"><Checkbox /></TableCell><TableCell align="center"><Checkbox /></TableCell><TableCell align="center"><Checkbox defaultChecked/></TableCell><TableCell align="center"><Checkbox /></TableCell><TableCell align="center"><Checkbox /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button variant="outlined">Save Permissions</Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {tabValue === 2 && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" mb={3}>Alert Triggers</Typography>
          <Box mb={4} display="flex" flexDirection="column" gap={1}>
            <FormControlLabel control={<Switch defaultChecked />} label="Ward understaffing alert (when threshold exceeded)" />
            <FormControlLabel control={<Switch defaultChecked />} label="Shift conflict detected" />
            <FormControlLabel control={<Switch defaultChecked />} label="Unapproved leave during critical shift" />
            <FormControlLabel control={<Switch defaultChecked />} label="Staff burnout risk exceeded" />
            <FormControlLabel control={<Switch />} label="New employee registered" />
            <FormControlLabel control={<Switch defaultChecked />} label="Schedule auto-generated by PSO" />
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" mb={3}>Notification Channels</Typography>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
               <FormControlLabel control={<Checkbox defaultChecked />} label="In-App Notification Bell" />
            </Grid>
            <Grid item xs={12} md={4}>
               <FormControlLabel control={<Checkbox defaultChecked />} label="Email Alerts" />
               <TextField size="small" fullWidth placeholder="admin@medsync.in" sx={{ mt: 1 }} />
            </Grid>
            <Grid item xs={12} md={4}>
               <FormControlLabel control={<Checkbox disabled />} label="SMS Alerts (Twilio)" />
               <Chip label="Coming Soon" color="primary" size="small" sx={{ ml: 1 }} />
            </Grid>
          </Grid>
          <Button variant="contained">Save Notification Rules</Button>
        </Paper>
      )}

      {/* TAB 4: AUDIT LOG */}
      {tabValue === 3 && (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" gap={2} mb={3}>
            <TextField size="small" label="Search Actions" />
            <TextField size="small" label="Filter by User" />
            <TextField size="small" type="date" InputLabelProps={{ shrink: true }} label="From" />
            <Button variant="outlined">Export CSV</Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Timestamp</b></TableCell>
                  <TableCell><b>User</b></TableCell>
                  <TableCell><b>Action</b></TableCell>
                  <TableCell><b>Module</b></TableCell>
                  <TableCell><b>Details</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>11 Apr 3:07 PM</TableCell><TableCell>Admin User</TableCell><TableCell><Chip size="small" label="LOGIN" color="info" /></TableCell><TableCell>Auth</TableCell><TableCell>Logged in successfully</TableCell></TableRow>
                <TableRow><TableCell>11 Apr 3:05 PM</TableCell><TableCell>Admin User</TableCell><TableCell><Chip size="small" label="UPDATED SETTING" /></TableCell><TableCell>Settings</TableCell><TableCell>Changed hospital name</TableCell></TableRow>
                <TableRow><TableCell>11 Apr 2:30 PM</TableCell><TableCell>HR Manager</TableCell><TableCell><Chip size="small" label="ADDED EMPLOYEE" color="success" /></TableCell><TableCell>Employees</TableCell><TableCell>Added Dr. Meena Krishnan</TableCell></TableRow>
                <TableRow><TableCell>11 Apr 2:15 PM</TableCell><TableCell>HR Manager</TableCell><TableCell><Chip size="small" label="EDITED EMPLOYEE" color="warning" /></TableCell><TableCell>Employees</TableCell><TableCell>Updated EMP003 status</TableCell></TableRow>
                <TableRow><TableCell>11 Apr 1:45 PM</TableCell><TableCell>Admin User</TableCell><TableCell><Chip size="small" label="EXPORT" /></TableCell><TableCell>Employees</TableCell><TableCell>Exported employees.xlsx</TableCell></TableRow>
                <TableRow><TableCell>10 Apr 5:10 PM</TableCell><TableCell>Admin User</TableCell><TableCell><Chip size="small" label="AUTO-SCHEDULE" color="secondary" /></TableCell><TableCell>Scheduler</TableCell><TableCell>PSO algorithm triggered</TableCell></TableRow>
                <TableRow><TableCell>10 Apr 4:55 PM</TableCell><TableCell>HR Manager</TableCell><TableCell><Chip size="small" label="APPROVED LEAVE" color="success" /></TableCell><TableCell>Scheduler</TableCell><TableCell>Approved Suresh Babu leave</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* TAB 5: INTEGRATIONS */}
      {tabValue === 4 && (
        <Box>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Hospital Information System (HIS)</Typography>
                    <Chip label="Connected" color="success" size="small" />
                  </Box>
                  <TextField fullWidth size="small" label="API Endpoint" defaultValue="https://api.medsync.in/his/v1" sx={{ mb: 2 }} />
                  <TextField fullWidth size="small" type="password" label="API Key" defaultValue="****************" sx={{ mb: 2 }} />
                  <Button variant="outlined" color="error">Disconnect</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Electronic Health Records (EHR)</Typography>
                    <Chip label="Not Connected" color="default" size="small" />
                  </Box>
                  <TextField fullWidth size="small" label="API Endpoint" sx={{ mb: 2 }} />
                  <TextField fullWidth size="small" type="password" label="API Key" sx={{ mb: 2 }} />
                  <Button variant="contained">Connect</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Payroll System</Typography>
                    <Chip label="Not Connected" color="default" size="small" />
                  </Box>
                  <TextField fullWidth size="small" label="API Endpoint" sx={{ mb: 2 }} />
                  <TextField fullWidth size="small" type="password" label="API Key" sx={{ mb: 2 }} />
                  <Button variant="contained">Connect</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ backgroundColor: '#f9f9f9' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" color="textSecondary">IoT Wearables (Staff Tracking)</Typography>
                    <Chip label="Coming Soon" color="info" size="small" />
                  </Box>
                  <Typography variant="body2" color="textSecondary">Real-time staff location via wearables — available in next release.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Settings;
