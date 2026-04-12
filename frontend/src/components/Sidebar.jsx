import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Employee Management', icon: <PeopleIcon />, path: '/employees' },
    { text: 'Shift Scheduler', icon: <AccessTimeIcon />, path: '/schedule' },
    { text: 'Real-Time Monitoring', icon: <AssessmentIcon />, path: '/monitoring' },
    { text: 'Reports', icon: <SupervisorAccountIcon />, path: '/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawerContent = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          MedSync
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <ListItem 
              button 
              component={Link} 
              to={item.path} 
              key={item.text} 
              onClick={handleDrawerToggle}
              sx={{ 
                my: 0.5, 
                mx: 1, 
                borderRadius: 2, 
                backgroundColor: isActive ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.12)' } 
              }}>
              <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 'bold' : 'normal', 
                  color: isActive ? 'primary.main' : 'inherit' 
                }} 
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', boxShadow: '1px 0px 15px rgba(0,0,0,0.05)' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
