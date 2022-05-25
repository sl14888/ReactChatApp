import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import GoogleIcon from '@mui/icons-material/Google';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import { LOGIN_ROUTE } from '../utils/consts';
import { Context } from '../firebase';
import firebase from 'firebase/compat/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const SignUp = () => {
  const { auth } = React.useContext(Context);

  const signUp = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const { user } = await auth.signInWithPopup(provider);
    console.log(user);
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     name: data.get('firstName'),
  //     lastName: data.get('lastName'),
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  // };

  const [data, setData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    error: null,
    loading: false,
  });
  const { name, lastName, email, password, error, loading } = data;
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!name || !lastName || !email || !password) {
      setData({ ...data, error: 'Заполнить все поля' });
    }
    try {
      const result = await auth().createUserWithEmailAndPassword(auth, email, password);
      console.log(result);
    } catch (error) {}
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={handleChange}
                  value={name}
                  name="name"
                  required
                  fullWidth
                  id="firstName"
                  label="Имя"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  onChange={handleChange}
                  value={lastName}
                  id="lastName"
                  label="Фамилия"
                  name="lastName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  onChange={handleChange}
                  value={email}
                  id="email"
                  label="Почта"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  onChange={handleChange}
                  value={password}
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            {error ? (
              <Typography align="center" color="error">
                {error}
              </Typography>
            ) : null}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Зарегистрироваться
            </Button>
            <Button onClick={signUp} fullWidth variant="contained" sx={{ mb: 2 }}>
              Войти через Google
              <GoogleIcon />
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <NavLink to={LOGIN_ROUTE}>
                  <Link variant="body2">Уже есть аккаунт? Войти.</Link>
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
