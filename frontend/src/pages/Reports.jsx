import React, { useState, useRef } from 'react';
import { 
  Box, Typography, Paper, Grid, Tabs, Tab, Card, CardContent, Button, Divider, 
  Table, TableBody, TableCell, TableHead, TableRow, LinearProgress, Chip
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Download as DownloadIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const [activeRange, setActiveRange] = useState('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const pageRef = useRef(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const shiftDataObj = {
    today: [
      { name:"Today", Morning:8, Evening:7, Night:4, Total:19, Coverage:95 }
    ],
    week: [
      { name:"Mon", Morning:8, Evening:6, Night:4, Total:18, Coverage:90 },
      { name:"Tue", Morning:7, Evening:7, Night:5, Total:19, Coverage:95 },
      { name:"Wed", Morning:9, Evening:8, Night:4, Total:21, Coverage:100},
      { name:"Thu", Morning:6, Evening:5, Night:4, Total:15, Coverage:75 },
      { name:"Fri", Morning:8, Evening:7, Night:3, Total:18, Coverage:90 },
      { name:"Sat", Morning:5, Evening:4, Night:3, Total:12, Coverage:60 },
      { name:"Sun", Morning:4, Evening:3, Night:2, Total:9,  Coverage:45 },
    ],
    month: [
      { name:"Week 1", Morning:42, Evening:35, Night:22, Total:99,  Coverage:88 },
      { name:"Week 2", Morning:45, Evening:38, Night:25, Total:108, Coverage:92 },
      { name:"Week 3", Morning:40, Evening:33, Night:20, Total:93,  Coverage:84 },
      { name:"Week 4", Morning:44, Evening:36, Night:23, Total:103, Coverage:90 },
    ],
  };

  const ratioDataObj = {
    today: {
      trend: [
        { time:"08:00", ratio:3.8, safe:5.0 }, { time:"10:00", ratio:4.1, safe:5.0 },
        { time:"12:00", ratio:4.9, safe:5.0 }, { time:"14:00", ratio:5.2, safe:5.0 },
        { time:"16:00", ratio:4.4, safe:5.0 },
      ],
      byWard: [ {name:"Ward 1", ratio:3.2}, {name:"Ward 2", ratio:2.8}, {name:"Ward 3", ratio:4.1}, {name:"Ward 4", ratio:3.5}, {name:"Ward 5", ratio:4.8}, {name:"Ward 6", ratio:5.2}, {name:"Ward 7", ratio:2.1}, {name:"Ward 8", ratio:4.6}, {name:"Ward 9", ratio:3.9}, {name:"Ward 10", ratio:6.8} ],
    },
    week: {
      trend: [
        { time:"Mon", ratio:3.8, safe:5.0 }, { time:"Tue", ratio:4.1, safe:5.0 }, { time:"Wed", ratio:4.9, safe:5.0 },
        { time:"Thu", ratio:5.2, safe:5.0 }, { time:"Fri", ratio:4.4, safe:5.0 }, { time:"Sat", ratio:3.9, safe:5.0 }, { time:"Sun", ratio:3.5, safe:5.0 }
      ],
      byWard: [ {name:"Ward 1", ratio:3.0}, {name:"Ward 2", ratio:2.6}, {name:"Ward 3", ratio:3.9}, {name:"Ward 4", ratio:3.3}, {name:"Ward 5", ratio:4.5}, {name:"Ward 6", ratio:5.0}, {name:"Ward 7", ratio:2.0}, {name:"Ward 8", ratio:4.3}, {name:"Ward 9", ratio:3.7}, {name:"Ward 10", ratio:6.5} ],
    },
    month: {
      trend: [
        { time:"Wk 1", ratio:3.9, safe:5.0 }, { time:"Wk 2", ratio:4.3, safe:5.0 }, { time:"Wk 3", ratio:4.7, safe:5.0 }, { time:"Wk 4", ratio:4.1, safe:5.0 }
      ],
      byWard: [ {name:"Ward 1", ratio:3.1}, {name:"Ward 2", ratio:2.7}, {name:"Ward 3", ratio:4.0}, {name:"Ward 4", ratio:3.4}, {name:"Ward 5", ratio:4.6}, {name:"Ward 6", ratio:5.1}, {name:"Ward 7", ratio:2.0}, {name:"Ward 8", ratio:4.4}, {name:"Ward 9", ratio:3.8}, {name:"Ward 10", ratio:6.6} ],
    },
  };

  const overtimeDataObj = {
    today: {
      kpi: { total:"6h", topStaff:"Dr. Vikram Srinivas", avgHours:"5.2h", burnoutCount:1 },
      byStaff: [ { name:"Dr. Vikram Srinivas", hours:3 }, { name:"Nurse Priya Rajan", hours:2 }, { name:"Ramesh Kumar", hours:1 } ],
    },
    week: {
      kpi: { total:"48h", topStaff:"Dr. Vikram Srinivas", avgHours:"46h", burnoutCount:3 },
      byStaff: [
        { name:"Dr. Vikram Srinivas", hours:18 }, { name:"Nurse Priya Rajan", hours:14 }, { name:"Ramesh Kumar", hours:12 },
        { name:"Nurse Divya Nair", hours:10 }, { name:"Dr. Arjun Mehta", hours:8 }, { name:"Nurse Lakshmi Devi", hours:7 },
        { name:"Dr. Meena Krishnan", hours:6 }, { name:"Nurse Fatima Begum", hours:5 },
      ],
    },
    month: {
      kpi: { total:"192h", topStaff:"Dr. Vikram Srinivas", avgHours:"182h", burnoutCount:4 },
      byStaff: [
        { name:"Dr. Vikram Srinivas", hours:58 }, { name:"Nurse Priya Rajan", hours:51 }, { name:"Ramesh Kumar", hours:44 },
        { name:"Nurse Divya Nair", hours:39 }, { name:"Dr. Arjun Mehta", hours:35 }, { name:"Nurse Lakshmi Devi", hours:32 },
        { name:"Dr. Meena Krishnan", hours:28 }, { name:"Nurse Fatima Begum", hours:24 },
      ],
    },
  };

  const leaveDataObj = {
    today: {
      kpi: { total:0, onLeave:2, pending:1, approvalRate:"87%" },
      byType: [ { name:"Sick Leave", value:40 }, { name:"Annual Leave", value:35 }, { name:"Emergency", value:15 }, { name:"Unpaid", value:10 } ],
      trend: [{ name:"Today", days:0 }],
      table: [
        { name:"Dr. Sneha Pillai", type:"Sick Leave", from:"08 Apr", to:"12 Apr", days:5, status:"Approved" },
        { name:"Suresh Babu", type:"Annual Leave", from:"10 Apr", to:"14 Apr", days:5, status:"Approved" },
        { name:"Nurse Divya Nair", type:"Sick Leave", from:"15 Apr", to:"15 Apr", days:1, status:"Pending" },
      ],
    },
    week: {
      kpi: { total:11, onLeave:2, pending:1, approvalRate:"87%" },
      byType: [ { name:"Sick Leave", value:40 }, { name:"Annual Leave", value:35 }, { name:"Emergency", value:15 }, { name:"Unpaid", value:10 } ],
      trend: [ { name:"Mon", days:2 }, { name:"Tue", days:3 }, { name:"Wed", days:1 }, { name:"Thu", days:2 }, { name:"Fri", days:2 }, { name:"Sat", days:1 }, { name:"Sun", days:0 } ],
      table: [
        { name:"Dr. Sneha Pillai", type:"Sick Leave", from:"08 Apr", to:"12 Apr", days:5, status:"Approved" },
        { name:"Suresh Babu", type:"Annual Leave", from:"10 Apr", to:"14 Apr", days:5, status:"Approved" },
        { name:"Nurse Divya Nair", type:"Sick Leave", from:"15 Apr", to:"15 Apr", days:1, status:"Pending" },
      ],
    },
    month: {
      kpi: { total:39, onLeave:2, pending:1, approvalRate:"87%" },
      byType: [ { name:"Sick Leave", value:45 }, { name:"Annual Leave", value:30 }, { name:"Emergency", value:15 }, { name:"Unpaid", value:10 } ],
      trend: [ { name:"Wk 1", days:8  }, { name:"Wk 2", days:11 }, { name:"Wk 3", days:9  }, { name:"Wk 4", days:11 } ],
      table: [
        { name:"Dr. Sneha Pillai", type:"Sick Leave", from:"08 Apr", to:"12 Apr", days:5, status:"Approved" },
        { name:"Suresh Babu", type:"Annual Leave", from:"10 Apr", to:"14 Apr", days:5, status:"Approved" },
        { name:"Nurse Divya Nair", type:"Sick Leave", from:"15 Apr", to:"15 Apr", days:1, status:"Pending" },
        { name:"Ramesh Kumar", type:"Emergency Leave", from:"02 Apr", to:"03 Apr", days:2, status:"Approved" },
      ],
    },
  };

  const kbiDataObj = {
    today: {
      coverageRate:    { value:95, target:'95%', status:"success" },
      schedCompliance: { value:98, target:'90%', status:"success" },
      responseTime:    { value:100, customVal:"3m40s", target:"<5m", status:"success" },
      burnoutRisk:     { value:10, target:'<15%', status:"success" },
      understaffed:    { value:10, raw: 1, target:'0', status:"error" },
      careScore:       { value:90, customVal:"4.5/5", target:'4.0/5', status:"success" },
    },
    week: {
      coverageRate:    { value:87, target:'95%', status:"warning" },
      schedCompliance: { value:92, target:'90%', status:"success" },
      responseTime:    { value:84, customVal:"4m12s", target:"<5m", status:"success" },
      burnoutRisk:     { value:12, target:'<15%', status:"success" },
      understaffed:    { value:10, raw: 3, target:'0', status:"error" },
      careScore:       { value:86, customVal:"4.3/5", target:'4.0/5', status:"success" },
    },
    month: {
      coverageRate:    { value:82, target:'95%', status:"warning" },
      schedCompliance: { value:89, target:'90%', status:"warning" },
      responseTime:    { value:75, customVal:"4m55s", target:"<5m", status:"warning" },
      burnoutRisk:     { value:18, target:'<15%', status:"error" },
      understaffed:    { value:10, raw: 9, target:'0', status:"error" },
      careScore:       { value:82, customVal:"4.1/5", target:'4.0/5', status:"success" },
    },
  };

  const dataKey = activeRange === 'custom' ? 'week' : activeRange;
  const shiftData = shiftDataObj[dataKey];
  const ratioData = ratioDataObj[dataKey];
  const overtimeData = overtimeDataObj[dataKey];
  const leaveData = leaveDataObj[dataKey];
  const kbiData = kbiDataObj[dataKey];

  const exportPDF = async () => {
    if (!pageRef.current) return;
    const canvas = await html2canvas(pageRef.current, { scale: 1.5 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, 10, 277, (canvas.height * 277) / canvas.width);
    pdf.save(`medsync_report_${activeRange}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportExcel = () => {
    let tableData = [];
    let filename = `medsync_${activeRange}_report.xlsx`;
    if (tabValue === 0) tableData = shiftData;
    else if (tabValue === 1) tableData = ratioData.byWard;
    else if (tabValue === 2) tableData = overtimeData.byStaff;
    else if (tabValue === 3) tableData = leaveData.table;
    else if (tabValue === 4) tableData = Object.entries(kbiData).map(([k, v]) => ({ Metric: k, Value: v.customVal || v.value, Target: v.target, Status: v.status }));
    
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report Data");
    XLSX.writeFile(wb, filename);
  };

  return (
    <Box ref={pageRef} p={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="#0d47a1">Reports & Analytics</Typography>
        <Box display="flex" gap={1}>
          <Box bgcolor="#e3f2fd" p={0.5} borderRadius={2} display="flex" gap={0.5} position="relative">
            <Button variant={activeRange==='today'?'contained':'text'} disableElevation size="small" onClick={()=>setActiveRange('today')}>Today</Button>
            <Button variant={activeRange==='week'?'contained':'text'} disableElevation size="small" onClick={()=>setActiveRange('week')}>This Week</Button>
            <Button variant={activeRange==='month'?'contained':'text'} disableElevation size="small" onClick={()=>setActiveRange('month')}>This Month</Button>
            <Button variant={activeRange==='custom'?'contained':'text'} disableElevation size="small" onClick={()=>setShowCustomPicker(!showCustomPicker)}>
              {activeRange==='custom' && customFrom ? `${customFrom} to ${customTo}` : 'Custom Range'}
            </Button>
            {showCustomPicker && (
              <Paper sx={{ position: 'absolute', top: 40, right: 0, p: 2, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200, boxShadow: 3 }}>
                <Typography variant="caption">From Date</Typography>
                <input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)} style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <Typography variant="caption">To Date</Typography>
                <input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)} style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <Box display="flex" gap={1} mt={1}>
                  <Button size="small" fullWidth onClick={()=>setShowCustomPicker(false)}>Cancel</Button>
                  <Button size="small" fullWidth variant="contained" onClick={()=>{setActiveRange('custom'); setShowCustomPicker(false);}}>Apply</Button>
                </Box>
              </Paper>
            )}
          </Box>
          <Button variant="outlined" startIcon={<PdfIcon />} sx={{ bgcolor: 'white' }} onClick={exportPDF}>Export PDF</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ bgcolor: 'white' }} onClick={exportExcel}>Export Excel</Button>
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
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Average Coverage</Typography><Typography variant="h4">{shiftData.reduce((acc, curr)=>acc+curr.Coverage,0)/shiftData.length | 0}%</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Most Active Shift</Typography><Typography variant="h4">Morning</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Total Staff Deployed</Typography><Typography variant="h4">{shiftData.reduce((acc, curr)=>acc+curr.Total,0)}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Understaffed Incidents</Typography><Typography variant="h4" color="error">{activeRange === 'today'?0:activeRange==='week'?3:8}</Typography></CardContent></Card></Grid>
          </Grid>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>Shift Distribution ({activeRange})</Typography>
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
              <TableHead><TableRow><TableCell><b>Period</b></TableCell><TableCell><b>Morning</b></TableCell><TableCell><b>Evening</b></TableCell><TableCell><b>Night</b></TableCell><TableCell><b>Total</b></TableCell><TableCell><b>Coverage %</b></TableCell></TableRow></TableHead>
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
                <Typography variant="h6" mb={2}>Ratio Trend ({activeRange})</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ratioData.trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
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
                  <BarChart data={ratioData.byWard}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="ratio">
                      {ratioData.byWard.map((entry, index) => (
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
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Total Overtime</Typography><Typography variant="h4">{overtimeData.kpi.total}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Most Overworked</Typography><Typography variant="body1" fontWeight="bold">{overtimeData.kpi.topStaff}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Avg Hours/Staff</Typography><Typography variant="h4">{overtimeData.kpi.avgHours}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Burnout Risk</Typography><Typography variant="h4" color="warning.main">{overtimeData.kpi.burnoutCount} staff</Typography></CardContent></Card></Grid>
          </Grid>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" mb={2}>Overtime Hours by Employee</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={overtimeData.byStaff} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <RechartsTooltip />
                <Bar dataKey="hours">
                   {overtimeData.byStaff.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hours > (activeRange==='month'?45:10) ? '#ef6c00' : '#4caf50'} />
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
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Total Leave Days</Typography><Typography variant="h4">{leaveData.kpi.total}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Staff On Leave</Typography><Typography variant="h4">{leaveData.kpi.onLeave}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Pending Requests</Typography><Typography variant="h4" color="primary">{leaveData.kpi.pending}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography color="textSecondary">Approval Rate</Typography><Typography variant="h4">{leaveData.kpi.approvalRate}</Typography></CardContent></Card></Grid>
          </Grid>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>Leave by Type</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={leaveData.byType} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {leaveData.byType.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
             <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>Leave Trend</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leaveData.trend}>
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
                {leaveData.table.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.name}</TableCell><TableCell>{row.type}</TableCell><TableCell>{row.from}</TableCell><TableCell>{row.to}</TableCell><TableCell>{row.days}</TableCell>
                    <TableCell><Chip label={row.status} size="small" color={row.status==='Approved'?'success':'warning'} /></TableCell>
                  </TableRow>
                ))}
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
              { label: 'Staff Coverage Rate', key: 'coverageRate' },
              { label: 'Schedule Compliance', key: 'schedCompliance' },
              { label: 'Avg Response Time', key: 'responseTime' },
              { label: 'Burnout Risk Index', key: 'burnoutRisk' },
              { label: 'Understaffed Incidents', key: 'understaffed' },
              { label: 'Patient Care Score', key: 'careScore' },
            ].map((kbiInfo, idx) => {
              const kbi = kbiData[kbiInfo.key];
              return (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card sx={{ borderLeft: `6px solid ${kbi.status === 'success' ? '#4caf50' : kbi.status === 'warning' ? '#ff9800' : '#f44336'}`}}>
                    <CardContent>
                      <Typography color="textSecondary" variant="body2">{kbiInfo.label}</Typography>
                      <Typography variant="h4" my={1}>{kbi.customVal || (kbi.raw !== undefined ? kbi.raw : `${kbi.value}%`)}</Typography>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="textSecondary">Target ({kbi.target})</Typography>
                        <Chip label={kbi.status.toUpperCase()} size="small" color={kbi.status} sx={{ height: 16, fontSize: '0.6rem' }}/>
                      </Box>
                      <LinearProgress variant="determinate" value={kbi.raw !== undefined ? 10 : kbi.value} color={kbi.status} />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Reports;
