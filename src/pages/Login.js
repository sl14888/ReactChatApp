import React, { useContext, useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import { Grid } from '@mui/material';

import { NavLink, useNavigate } from 'react-router-dom';
import { REG_ROUTE } from '../utils/consts';

import { Context } from '../firebase';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const Login = () => {
  // получаю данные через контекст
  const { auth, firestore } = useContext(Context);

  const history = useNavigate();

  const signIn = async () => {
    //Авторизация по google через popup
    const provider = new firebase.auth.GoogleAuthProvider();
    const { user } = await auth.signInWithPopup(provider);
    console.log(user);
  };
  // данные для регистрации
  const [data, setData] = useState({
    email: '',
    password: '',
    error: null,
    loading: false,
  });
  // достаю из даты данные через деструктуризацию
  const { email, password, error, loading } = data;
  // делаю инпут управляемым
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  // асинхронная функция при нажатии на кнопку
  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    // валидация на пустоту
    if (!email || !password) {
      setData({ ...data, error: 'Заполнить все поля' });
    }

    try {
      // регистрация по почте
      const result = await signInWithEmailAndPassword(auth, email, password);

      // создаю колекцию в дб
      await updateDoc(doc(firestore, 'users', result.user.uid), {
        isOnline: true,
      });
      // очещаю поля
      setData({ email: '', password: '', error: null, loading: false });
      history('/');
    } catch (error) {
      // вывожу ошибку
      setData({ ...data, error: error.message, loading: false });
    }
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
            Авторизация
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={handleChange}
              value={email}
              id="email"
              label="Почта"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={handleChange}
              value={password}
              name="password"
              label="Пароль"
              type="password"
              id="password"
            />
            {/* вывод ошибки */}
            {error ? (
              <Typography align="center" color="error">
                {error}
              </Typography>
            ) : null}

            <Button
              disabled={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Загрузка...' : 'Войти'}
            </Button>
            <Button disabled={loading} fullWidth variant="contained" sx={{ mb: 2 }}>
              {loading ? 'Загрузка...' : 'Войти через Google'}
              <GoogleIcon />
            </Button>
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <NavLink to={REG_ROUTE}>
                <Link href="#">{'Нет аккаунта? Зарегистрироваться'}</Link>
              </NavLink>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
