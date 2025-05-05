import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard', protected: true },
  { label: 'Pricing', path: '/pricing', hideWhenLoggedIn: true },
  { label: 'Account', path: '/account', account: true },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  // Only show protected links if logged in
  const filteredLinks = navLinks.filter(link => {
    if (link.protected && !token) return false;
    if (link.account && !token) return false;
    if (link.hideWhenLoggedIn && token) return false;
    return true;
  });

  const handleDrawerToggle = () => setDrawerOpen((open) => !open);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              CandidateV
            </Typography>
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={drawerOpen}
                  onClose={handleDrawerToggle}
                >
                  <Box sx={{ width: 220 }} role="presentation" onClick={handleDrawerToggle}>
                    <List>
                      {filteredLinks.map((link) => (
                        <ListItem key={link.path} disablePadding>
                          <ListItemButton
                            component={Link}
                            to={link.path}
                            selected={location.pathname === link.path}
                          >
                            <ListItemText primary={link.label} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                      {/* Show Login if not logged in, in place of Account */}
                      {!token && (
                        <ListItem disablePadding>
                          <ListItemButton onClick={() => navigate('/login')} selected={location.pathname === '/login'}>
                            <ListItemText primary="Login" />
                          </ListItemButton>
                        </ListItem>
                      )}
                      {token && (
                        <ListItem disablePadding>
                          <ListItemButton onClick={handleLogout}>
                            <ListItemText primary="Log Out" />
                          </ListItemButton>
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </Drawer>
              </>
            ) : (
              <>
                {filteredLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    sx={{
                      ml: 1,
                      bgcolor: location.pathname === link.path ? 'common.white' : 'inherit',
                      color: location.pathname === link.path ? 'primary.main' : 'inherit',
                      fontWeight: location.pathname === link.path ? 700 : 400,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: location.pathname === link.path ? 'grey.100' : 'action.hover',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
                {/* Show Login if not logged in, in place of Account */}
                {!token && (
                  <Button color="inherit" onClick={() => navigate('/login')}
                    sx={{ ml: 1, fontWeight: location.pathname === '/login' ? 700 : 400, bgcolor: location.pathname === '/login' ? 'common.white' : 'inherit', color: location.pathname === '/login' ? 'primary.main' : 'inherit', borderRadius: 2 }}>
                    Login
                  </Button>
                )}
                {token && (
                  <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
                    Log Out
                  </Button>
                )}
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ minHeight: '80vh', py: 4 }}>{children}</Box>
      <Box component="footer" sx={{ bgcolor: 'grey.100', py: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} CandidateV. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Layout; 