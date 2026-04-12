import React, { useState, useEffect, useRef } from 'react';
import { 
  AppBar, Toolbar, IconButton, Typography, Avatar, Box, Badge, Menu, MenuItem, 
  Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  Switch, FormControlLabel, InputAdornment, LinearProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const initialNotifications = [
  { id: 1, type: "danger", title: "Ward 10 is OVERLOADED", body: "Staff: 4 | Patients: 24", time: "2 min ago", read: false, link: "/monitoring?ward=10" },
  { id: 2, type: "warning", title: "Ward 7 approaching threshold", body: "Staff: 1 | Patients: 17", time: "8 min ago", read: false, link: "/monitoring?ward=7" },
  { id: 3, type: "warning", title: "Dr. Sneha Pillai is on leave", body: "Ward 6 may be understaffed", time: "15 min ago", read: false, link: "/schedule" },
  { id: 4, type: "info", title: "PSO Auto-Schedule completed", body: "52 shifts optimized successfully", time: "1 hr ago", read: false, link: "/schedule" }
];

const notificationPool = [
  { type: "danger", title: "Emergency ward surge detected", body: "Patient count jumped to 31", link: "/monitoring" },
  { type: "warning", title: "Ward 3 ratio exceeded 1:5", body: "Staff: 2 | Patients: 11", link: "/monitoring" },
  { type: "warning", title: "Suresh Babu shift in 30 minutes", body: "Ward 1 Evening shift — confirm attendance", link: "/schedule" },
  { type: "info", title: "Nurse Priya Rajan clocked out early", body: "Ward 2 Evening shift now uncovered", link: "/employees" },
  { type: "danger", title: "Ward 5 staff-to-patient critical", body: "Ratio now 1:6.8 — immediate action needed", link: "/monitoring" },
  { type: "info", title: "Weekly schedule not published", body: "Next week's shifts are unassigned", link: "/schedule" },
  { type: "success", title: "Dr. Arjun Mehta clocked in", body: "Ward 4 Morning shift now covered", link: "/monitoring" },
  { type: "warning", title: "Nurse Fatima Begum on overtime", body: "Worked 14h — burnout risk flagged", link: "/reports" },
  { type: "info", title: "New employee registered", body: "Dr. Meena Krishnan added to Gynecology", link: "/employees" },
  { type: "danger", title: "ICU understaffed", body: "1 doctor for 9 patients — reassign now", link: "/monitoring" }
];

const Topbar = ({ handleDrawerToggle }) => {
  const navigate = useNavigate();
  
  // Real-time Clock
  const [time, setTime] = useState(new Date());
  
  // Notifications
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  // Admin Profile
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [adminUser, setAdminUser] = useState({ name: "Admin User", title: "HR Administrator", email: "admin@medsync.in" });
  
  // Modals
  const [modals, setModals] = useState({ profile: false, password: false, preferences: false, logout: false });

  // Password fields
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const notifTimer = setInterval(() => {
      const randomNotif = notificationPool[Math.floor(Math.random() * notificationPool.length)];
      const newNotif = {
        ...randomNotif,
        id: Date.now(),
        time: "Just now",
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }, 45000); 

    return () => { 
      clearInterval(timer); 
      clearInterval(notifTimer); 
    };
  }, []);

  const openModal = (key) => { setModals({ ...modals, [key]: true }); setProfileAnchor(null); };
  const closeModal = (key) => setModals({ ...modals, [key]: false });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotifClick = (notif) => {
    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
    navigate(notif.link);
    setNotifAnchor(null);
  };

  const dismissNotif = (e, id) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'danger': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      case 'success': return '🟢';
      default: return '🔵';
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: '0px 1px 10px rgba(0,0,0,0.05)' }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#0d47a1', display: { xs: 'none', lg: 'block' } }}>
          Medical Staff Synchronization & Scheduling System
        </Typography>

        <Box display="flex" alignItems="center" gap={3}>
          {/* Live Date/Time */}
          <Box display={{ xs: 'none', md: 'flex' }} alignItems="center" gap={2} bgcolor="#f5f5f5" px={2} py={0.5} borderRadius={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <CalendarMonthIcon fontSize="small" color="primary" />
              <Typography variant="body2" fontWeight="bold">
                {time.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTimeIcon fontSize="small" color="primary" />
              <Typography variant="body2" fontWeight="bold">
                {time.toLocaleTimeString('en-GB')}
              </Typography>
            </Box>
          </Box>

          {/* Notifications */}
          <IconButton color="inherit" onClick={(e) => setNotifAnchor(e.currentTarget)}>
            <Badge badgeContent={unreadCount > 0 ? unreadCount : 0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Menu 
            anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)}
            PaperProps={{ sx: { width: 380, maxHeight: 500 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1.5}>
              <Typography fontWeight="bold">Notifications ({unreadCount} unread)</Typography>
              <Button size="small" onClick={markAllRead}>Mark all read</Button>
            </Box>
            <Divider />
            {notifications.length === 0 && <Box p={3} textAlign="center"><Typography color="textSecondary">No notifications</Typography></Box>}
            <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
              {notifications.map((n, i) => (
                <Box key={n.id} sx={{ animation: 'slideIn 0.3s ease-out' }}>
                  <MenuItem 
                    sx={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5,
                      bgcolor: n.read ? 'white' : '#f0f7ff',
                      '&:hover': { bgcolor: n.read ? '#f5f5f5' : '#e3f2fd' }
                    }} 
                    onClick={() => handleNotifClick(n)}
                  >
                    <Box display="flex" gap={1.5} alignItems="flex-start" width="100%">
                      <Typography>{getIcon(n.type)}</Typography>
                      <Box flexGrow={1}>
                        <Typography variant="body2" fontWeight={n.read ? 'normal' : 'bold'} sx={{ lineHeight: 1.2, mb: 0.5 }}>{n.title}</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>{n.body}</Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>{n.time}</Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={(e) => dismissNotif(e, n.id)} sx={{ mt: -1, mr: -1, color: 'text.secondary' }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </MenuItem>
                  {i < notifications.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
            <Divider />
            <Box textAlign="center" py={1}>
              <Button size="small" onClick={() => { navigate('/settings'); setNotifAnchor(null); }}>View all activity</Button>
            </Box>
          </Menu>

          {/* Admin Profile */}
          <Box 
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.5, borderRadius: 2, '&:hover': { bgcolor: '#f5f5f5' } }}
            onClick={(e) => setProfileAnchor(e.currentTarget)}
          >
            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>{adminUser.name[0]}</Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" fontWeight="bold">{adminUser.name}</Typography>
              <Typography variant="caption" color="text.secondary">{adminUser.title}</Typography>
            </Box>
          </Box>
          
          <Menu 
            anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)}
            PaperProps={{ sx: { width: 260 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box px={2} py={1.5} mb={1} bgcolor="#f8f9fa">
              <Typography variant="subtitle2" fontWeight="bold">{adminUser.name}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>{adminUser.title}</Typography>
              <Typography variant="caption" color="primary">{adminUser.email}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => openModal('profile')}><PersonIcon fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} /> Edit Profile</MenuItem>
            <MenuItem onClick={() => openModal('password')}><LockIcon fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} /> Change Password</MenuItem>
            <MenuItem onClick={() => openModal('preferences')}><SettingsIcon fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} /> Preferences</MenuItem>
            <Divider />
            <MenuItem onClick={() => openModal('logout')} sx={{ color: 'error.main' }}><LogoutIcon fontSize="small" sx={{ mr: 2 }} /> Logout</MenuItem>
          </Menu>

        </Box>
      </Toolbar>

      {/* Modals */}
      <Dialog open={modals.profile} onClose={() => closeModal('profile')} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar sx={{ width: 80, height: 80, mb: 1, bgcolor: 'secondary.main', fontSize: 32 }}>{adminUser.name[0]}</Avatar>
            <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>Change Photo</Typography>
          </Box>
          <TextField fullWidth label="Full Name" size="small" margin="normal" defaultValue={adminUser.name} onChange={(e) => setAdminUser({...adminUser, name: e.target.value})}/>
          <TextField fullWidth label="Job Title" size="small" margin="normal" defaultValue={adminUser.title} onChange={(e) => setAdminUser({...adminUser, title: e.target.value})}/>
          <TextField fullWidth label="Email" size="small" margin="normal" defaultValue={adminUser.email} onChange={(e) => setAdminUser({...adminUser, email: e.target.value})}/>
          <TextField fullWidth label="Phone" size="small" margin="normal" defaultValue="+91 98765 43210"/>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => closeModal('profile')}>Cancel</Button>
          <Button variant="contained" onClick={() => closeModal('profile')}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modals.password} onClose={() => closeModal('password')} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Change Password</DialogTitle>
        <DialogContent dividers>
          {['Current Password', 'New Password', 'Confirm New Password'].map((label, idx) => (
            <TextField 
              key={idx} fullWidth label={label} size="small" margin="normal" type={showPwd ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPwd(!showPwd)}>
                      {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          ))}
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between"><Typography variant="caption">Strength</Typography><Typography variant="caption" color="success.main">Strong</Typography></Box>
            <LinearProgress variant="determinate" value={80} color="success" sx={{ mt: 0.5, height: 6, borderRadius: 3 }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => closeModal('password')}>Cancel</Button>
          <Button variant="contained" onClick={() => closeModal('password')}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modals.preferences} onClose={() => closeModal('preferences')} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Preferences</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography>Theme</Typography>
            <FormControlLabel control={<Switch />} label="Dark Mode" />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography>Dashboard Refresh</Typography>
            <select style={{ padding: '6px', borderRadius: '4px' }}>
              <option>15s</option>
              <option selected>30s</option>
              <option>60s</option>
            </select>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>Notification Sound</Typography>
            <FormControlLabel control={<Switch defaultChecked />} label="On" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => closeModal('preferences')}>Cancel</Button>
          <Button variant="contained" onClick={() => closeModal('preferences')}>Save Preferences</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modals.logout} onClose={() => closeModal('logout')} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Confirm Logout</DialogTitle>
        <DialogContent dividers>
          <Typography>Are you sure you want to securely log out of the MedSync platform?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => closeModal('logout')}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => { closeModal('logout'); navigate('/login'); }}>Logout</Button>
        </DialogActions>
      </Dialog>
      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </AppBar>
  );
};

export default Topbar;
