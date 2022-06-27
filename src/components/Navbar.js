import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from '@mui/material';

import { NavLink } from 'react-router-dom';
import { CHAT_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from '../utils/consts';

import { useAuthState } from 'react-firebase-hooks/auth';
import { Context } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const Navbar = () => {
  const { auth, firestore } = React.useContext(Context);
  const [user] = useAuthState(auth);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // выход из аккаунта
  const handleSignOut = async () => {
    // обновление коллекции (Пользователь вышел из сети)
    await updateDoc(doc(firestore, 'users', user.uid), {
      isOnline: false,
    });
    await auth.signOut();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="primary" sx={{ bgcolor: '#0d0c22' }} position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <NavLink to={CHAT_ROUTE}>
              <Typography
                variant="h6"
                noWrap
                component="p"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                🔥 CHATAPP KUBSU
              </Typography>
            </NavLink>
            <Typography
              variant="h5"
              noWrap
              component="p"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              🔥 CHATAPP
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>
            {user ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Открыть">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="?" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      <NavLink to={PROFILE_ROUTE}>Профиль</NavLink>
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>
                    <Typography textAlign="center">Выйти</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <NavLink to={LOGIN_ROUTE}>
                  <Button
                    variant={'contained'}
                    sx={{ color: 'white', bgcolor: '#275ce8' }}
                  >
                    Логин
                  </Button>
                </NavLink>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
