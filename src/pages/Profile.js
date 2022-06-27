import React, { useContext, useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  Avatar,
  Container,
  createTheme,
  InputAdornment,
  TextField,
  ThemeProvider,
} from '@mui/material';

import { Context } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const Profile = () => {
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    getDoc(doc(firestore, 'users', user.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUserData(docSnap.data());
      }
    });
  }, []);
  console.log(userData);

  return (
    <ThemeProvider theme={darkTheme}>
      <Container
        maxWidth="xs"
        sx={{
          marginTop: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography gutterBottom variant="h5" component="div">
          МОЙ ПРОФИЛЬ
        </Typography>
        <Card
          sx={{
            maxWidth: '100%',
            width: 900,
            borderRadius: '15px',
            backgroundColor: '#111022',
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', padding: '30px' }}>
            <Avatar
              sx={{ alignSelf: 'center', width: 96, height: 96 }}
              alt="?"
              src="/static/images/avatar/2.jpg"
            />
            <Typography gutterBottom variant="h6" component="div">
              Имя
            </Typography>
            <TextField
              id="outlined-basic"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              value={userData.name}
              sx={{ marginBottom: 2 }}
            />
            <Typography gutterBottom variant="h6" component="div">
              Почта
            </Typography>
            <TextField
              id="outlined-basic"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              value={userData.email}
              sx={{ marginBottom: 2 }}
            />
            <Typography gutterBottom variant="h6" component="div">
              Пароль
            </Typography>
            <TextField
              id="outlined-basic"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              value={userData.password}
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" size="large">
              ИЗМЕНИТЬ ДАННЫЕ
            </Button>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default Profile;
