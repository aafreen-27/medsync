import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Tooltip,
  Card, CardContent, Avatar, Drawer, Divider, List, ListItem, ListItemText
} from '@mui/material';
import { 
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon,
  GetApp as DownloadIcon, UploadFile as UploadIcon, Block as BlockIcon, Clear as ClearIcon,
  Group as GroupIcon, CheckCircle as CheckCircleIcon, FlightTakeoff as FlightIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

const mockEmployees = [
  { staffId:"EMP001", name:"Dr. Arjun Mehta",         role:"Doctor",    department:"Cardiology",     ward:"Ward 4",  shift:"Morning", status:"Active"   },
  { staffId:"EMP002", name:"Nurse Priya Rajan",        role:"Nurse",     department:"ICU",            ward:"Ward 2",  shift:"Evening", status:"Active"   },
  { staffId:"EMP003", name:"Dr. Sneha Pillai",         role:"Doctor",    department:"Neurology",      ward:"Ward 6",  shift:"Night",   status:"On Leave" },
  { staffId:"EMP004", name:"Ramesh Kumar",             role:"Paramedic", department:"Emergency",      ward:"Ward 1",  shift:"Morning", status:"Active"   },
  { staffId:"EMP005", name:"Nurse Divya Nair",         role:"Nurse",     department:"Pediatrics",     ward:"Ward 3",  shift:"Morning", status:"Active"   },
  { staffId:"EMP006", name:"Dr. Karthik Subramanian",  role:"Doctor",    department:"Orthopedics",    ward:"Ward 5",  shift:"Evening", status:"Off Duty" },
  { staffId:"EMP007", name:"Anitha Selvam",            role:"Admin",     department:"Administration", ward:"—",       shift:"Morning", status:"Active"   },
  { staffId:"EMP008", name:"Nurse Fatima Begum",       role:"Nurse",     department:"Oncology",       ward:"Ward 8",  shift:"Night",   status:"Active"   },
  { staffId:"EMP009", name:"Dr. Vikram Srinivas",      role:"Doctor",    department:"General Surgery",ward:"Ward 7",  shift:"Morning", status:"Active"   },
  { staffId:"EMP010", name:"Suresh Babu",              role:"Paramedic", department:"Emergency",      ward:"Ward 1",  shift:"Evening", status:"On Leave" },
  { staffId:"EMP011", name:"Nurse Lakshmi Devi",       role:"Nurse",     department:"Cardiology",     ward:"Ward 4",  shift:"Morning", status:"Active"   },
  { staffId:"EMP012", name:"Dr. Meena Krishnan",       role:"Doctor",    department:"Gynecology",     ward:"Ward 9",  shift:"Evening", status:"Active"   }
];

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees);
  
  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All');
  const [shiftFilter, setShiftFilter] = useState('All');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Modals/Drawers
  const [openForm, setOpenForm] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [profileDrawer, setProfileDrawer] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const initialFormState = {
    name: '', staffId: '', role: 'Nurse', department: '', ward: '', shift: '', specialization: '', 
    contact: '', email: '', status: 'Active', joiningDate: new Date().toISOString().split('T')[0]
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    let result = employees;
    if (search) result = result.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter !== 'All Roles') result = result.filter(e => e.role === roleFilter);
    if (deptFilter !== 'All Departments') result = result.filter(e => e.department === deptFilter);
    if (statusFilter !== 'All') result = result.filter(e => e.status === statusFilter);
    if (shiftFilter !== 'All') result = result.filter(e => e.shift === shiftFilter);
    setFilteredEmployees(result);
    setPage(0);
  }, [search, roleFilter, deptFilter, statusFilter, shiftFilter, employees]);

  const handleClearFilters = () => {
    setSearch(''); setRoleFilter('All Roles'); setDeptFilter('All Departments'); 
    setStatusFilter('All'); setShiftFilter('All');
  };

  const handleOpenForm = (emp = null) => {
    if (emp && emp.name) {
      setIsEditing(true);
      setFormData({
        ...emp,
        joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setIsEditing(false);
      setFormData({...initialFormState, staffId: `EMP${Math.floor(Math.random() * 900) + 13}`.padStart(6, '0')});
    }
    setOpenForm(true);
  };
  const handleCloseForm = () => setOpenForm(false);

  const handleOpenProfile = (emp) => {
    setSelectedProfile(emp);
    setProfileDrawer(true);
  };

  const handleSubmit = () => {
    if (isEditing) {
      setEmployees(employees.map(e => e.staffId === formData.staffId ? formData : e));
    } else {
      setEmployees([...employees, { ...formData }]);
    }
    handleCloseForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter(e => e.staffId !== id));
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEmployees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "employees_export.xlsx");
  };

  // KPIs
  const totalEmp = employees.length;
  const activeEmp = employees.filter(e => e.status === 'Active').length;
  const leaveEmp = employees.filter(e => e.status === 'On Leave').length;
  const offDutyEmp = employees.filter(e => e.status === 'Off Duty').length;

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const getRoleColor = (role) => {
    switch(role) {
      case 'Doctor': return 'info'; // blue
      case 'Nurse': return 'success'; // teal/green
      case 'Paramedic': return 'warning'; // orange
      case 'Admin': return 'secondary'; // purple
      default: return 'default';
    }
  };

  const getShiftBadge = (shift) => {
    let color = '#f5f5f5';
    if (shift === 'Morning') color = '#fff9c4'; // light yellow
    if (shift === 'Evening') color = '#ffe0b2'; // light orange
    if (shift === 'Night') color = '#bbdefb';   // light blue
    return <Chip label={shift || 'N/A'} size="small" sx={{ backgroundColor: color, fontWeight: 'bold' }} />;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="#0d47a1">Employee Management</Typography>
        <Box>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport} sx={{ mr: 1, backgroundColor: '#fff' }}>Export</Button>
          <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => setOpenImport(true)} sx={{ mr: 1, backgroundColor: '#fff' }}>Import CSV</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>Add Employee</Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} mb={3}>
        {[
          { title: 'Total Employees', value: totalEmp, icon: <GroupIcon color="primary" />, color: '#1976d2' },
          { title: 'Active Staff', value: activeEmp, icon: <CheckCircleIcon color="success" />, color: '#2e7d32' },
          { title: 'On Leave', value: leaveEmp, icon: <FlightIcon color="warning" />, color: '#ed6c02' },
          { title: 'Off Duty', value: offDutyEmp, icon: <BlockIcon color="error" />, color: '#d32f2f' }
        ].map((kpi, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderLeft: `4px solid ${kpi.color}`, boxShadow: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: `${kpi.color}15`, mr: 2 }}>{kpi.icon}</Box>
                <Box>
                  <Typography color="textSecondary" variant="body2" fontWeight="medium">{kpi.title}</Typography>
                  <Typography variant="h5" fontWeight="bold">{kpi.value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter Bar */}
      <Paper sx={{ p: 2, borderRadius: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField size="small" label="Search by Name" value={search} onChange={e => setSearch(e.target.value)} sx={{ minWidth: 200 }} />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select value={roleFilter} label="Role" onChange={e => setRoleFilter(e.target.value)}>
            {['All Roles', 'Doctor', 'Nurse', 'Paramedic', 'Admin'].map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Department</InputLabel>
          <Select value={deptFilter} label="Department" onChange={e => setDeptFilter(e.target.value)}>
            {['All Departments', 'Cardiology', 'ICU', 'Neurology', 'Emergency', 'Pediatrics', 'Orthopedics', 'Oncology', 'General Surgery', 'Gynecology', 'Administration'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
            {['All', 'Active', 'On Leave', 'Off Duty'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Shift</InputLabel>
          <Select value={shiftFilter} label="Shift" onChange={e => setShiftFilter(e.target.value)}>
            {['All', 'Morning', 'Evening', 'Night'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="text" startIcon={<ClearIcon />} onClick={handleClearFilters}>Clear</Button>
      </Paper>

      {/* Main Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table size="medium">
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell><b>Staff ID</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Department</b></TableCell>
                <TableCell><b>Ward</b></TableCell>
                <TableCell><b>Shift</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((emp) => (
                <TableRow key={emp.staffId} hover>
                  <TableCell>{emp.staffId}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: 14, bgcolor: 'primary.light' }}>
                        {getInitials(emp.name)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">{emp.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Chip label={emp.role} size="small" color={getRoleColor(emp.role)} variant="outlined" /></TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.ward || '—'}</TableCell>
                  <TableCell>{getShiftBadge(emp.shift)}</TableCell>
                  <TableCell>
                    <Chip size="small" label={emp.status} 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#fff',
                        backgroundColor: emp.status === 'Active' ? '#4caf50' : emp.status === 'On Leave' ? '#ff9800' : '#9e9e9e'
                      }} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Profile"><IconButton color="info" onClick={() => handleOpenProfile(emp)}><ViewIcon /></IconButton></Tooltip>
                    <Tooltip title="Edit Employee"><IconButton color="primary" onClick={() => handleOpenForm(emp)}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(emp.staffId)}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEmployees.length === 0 && (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 3 }}>No employees found matching criteria.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredEmployees.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPageOptions={[10, 25, 50]}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          labelDisplayedRows={({ from, to, count }) => `Showing ${from}–${to} of ${count !== -1 ? count : `more than ${to}`} employees`}
        />
      </Paper>

      {/* Add / Edit Form Modal */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{isEditing ? 'Edit Employee Details' : 'Add New Employee'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Staff ID" value={formData.staffId} onChange={e=>setFormData({...formData, staffId: e.target.value})} size="small" sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} size="small" sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select value={formData.role} label="Role" onChange={e=>setFormData({...formData, role: e.target.value})}>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="HR Staff">HR Staff</MenuItem>
                  <MenuItem value="Doctor">Doctor</MenuItem>
                  <MenuItem value="Nurse">Nurse</MenuItem>
                  <MenuItem value="Paramedic">Paramedic</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Specialization (Optional)" value={formData.specialization} onChange={e=>setFormData({...formData, specialization: e.target.value})} size="small" sx={{ mb: 2 }} /></Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Department</InputLabel>
                <Select value={formData.department} label="Department" onChange={e=>setFormData({...formData, department: e.target.value})}>
                  {['Cardiology', 'ICU', 'Neurology', 'Emergency', 'Pediatrics', 'Orthopedics', 'Oncology', 'General Surgery', 'Gynecology', 'Administration'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Ward (Optional)</InputLabel>
                <Select value={formData.ward} label="Ward" onChange={e=>setFormData({...formData, ward: e.target.value})}>
                  <MenuItem value="">— None —</MenuItem>
                  {[...Array(10)].map((_, i) => <MenuItem key={`Ward ${i+1}`} value={`Ward ${i+1}`}>{`Ward ${i+1}`}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Shift</InputLabel>
                <Select value={formData.shift} label="Shift" onChange={e=>setFormData({...formData, shift: e.target.value})}>
                  <MenuItem value="">— None —</MenuItem>
                  {['Morning', 'Evening', 'Night'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}><TextField fullWidth label="Phone Number" value={formData.contact} onChange={e=>setFormData({...formData, contact: e.target.value})} size="small" sx={{ mb: 2 }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email Address" type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} size="small" sx={{ mb: 2 }} /></Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={formData.status} label="Status" onChange={e=>setFormData({...formData, status: e.target.value})}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="On Leave">On Leave</MenuItem>
                  <MenuItem value="Off Duty">Off Duty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Joining Date" type="date" InputLabelProps={{ shrink: true }} value={formData.joiningDate} onChange={e=>setFormData({...formData, joiningDate: e.target.value})} size="small" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button fullWidth variant="outlined" component="label" startIcon={<CloudUploadIcon />} sx={{ height: '40px' }}>
                Upload Credentials
                <input type="file" hidden accept=".pdf,image/*" />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseForm} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save Employee</Button>
        </DialogActions>
      </Dialog>

      {/* CSV Import Modal */}
      <Dialog open={openImport} onClose={() => setOpenImport(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Import CSV</DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center', py: 5 }}>
          <Box sx={{ border: '2px dashed #90caf9', borderRadius: 2, p: 4, backgroundColor: '#f5faff', cursor: 'pointer' }}>
            <CloudUploadIcon color="primary" sx={{ fontSize: 50, mb: 1 }} />
            <Typography variant="h6">Drag and drop CSV file here</Typography>
            <Typography variant="body2" color="textSecondary">or click to browse local files</Typography>
          </Box>
          <Typography variant="body2" color="primary" sx={{ mt: 3, cursor: 'pointer', textDecoration: 'underline' }}>
            Download Sample CSV Template
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImport(false)}>Cancel</Button>
          <Button variant="contained" color="secondary">Confirm Import</Button>
        </DialogActions>
      </Dialog>

      {/* View Profile Drawer */}
      <Drawer anchor="right" open={profileDrawer} onClose={() => setProfileDrawer(false)}>
        <Box sx={{ width: 400, p: 3 }}>
          {selectedProfile && (
            <>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main', fontSize: 24 }}>
                  {getInitials(selectedProfile.name)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">{selectedProfile.name}</Typography>
                  <Typography color="textSecondary">{selectedProfile.role} • {selectedProfile.staffId}</Typography>
                </Box>
              </Box>
              
              <Chip size="small" label={selectedProfile.status} sx={{ mb: 3, backgroundColor: selectedProfile.status === 'Active' ? '#4caf50' : selectedProfile.status === 'On Leave' ? '#ff9800' : '#9e9e9e', color: '#fff', fontWeight: 'bold' }} />
              
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={1}>Current Assignment</Typography>
              <List dense>
                <ListItem><ListItemText primary="Department" secondary={selectedProfile.department} /></ListItem>
                <ListItem><ListItemText primary="Specialization" secondary={selectedProfile.specialization || 'N/A'} /></ListItem>
                <ListItem><ListItemText primary="Ward" secondary={selectedProfile.ward || 'Unassigned'} /></ListItem>
                <ListItem><ListItemText primary="Shift" secondary={selectedProfile.shift || 'Unassigned'} /></ListItem>
              </List>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={1}>Contact Information</Typography>
              <List dense>
                <ListItem><ListItemText primary="Phone" secondary={selectedProfile.contact || 'N/A'} /></ListItem>
                <ListItem><ListItemText primary="Email" secondary={selectedProfile.email || 'N/A'} /></ListItem>
              </List>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={1}>Records</Typography>
              <List dense>
                <ListItem><ListItemText primary="Joined Date" secondary={selectedProfile.joiningDate ? new Date(selectedProfile.joiningDate).toLocaleDateString() : new Date().toLocaleDateString()} /></ListItem>
                <ListItem><ListItemText primary="Shifts Completed" secondary={Math.floor(Math.random() * 50) + 1} /></ListItem>
                <ListItem><ListItemText primary="Leave History" secondary={`${Math.floor(Math.random() * 5)} Days Taken (Mock)`} /></ListItem>
              </List>

              <Box mt={4} textAlign="center">
                <Button variant="outlined" fullWidth onClick={() => { setProfileDrawer(false); handleOpenForm(selectedProfile); }}>
                  Edit Profile Information
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default EmployeeManagement;
