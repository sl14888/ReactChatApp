import React, { useState, useContext } from 'react';
// MUI-UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import GoogleIcon from '@mui/icons-material/Google';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//Реакт роутер
import { NavLink, useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE } from '../utils/consts';
//База данныех firebase
import { Context } from '../firebase';
import firebase from 'firebase/compat/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
//Тема
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const SignUp = () => {
  // получаю данные через контекст
  const { auth, firestore } = useContext(Context);

  const history = useNavigate();

  const signUp = async () => {
    //Авторизация по google через popup
    const provider = new firebase.auth.GoogleAuthProvider();
    const { user } = await auth.signInWithPopup(provider);
    console.log(user);
  };
  // данные для регистрации
  const [data, setData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    error: null,
    loading: false,
  });
  // достаю из даты данные через деструктуризацию
  const { name, lastName, email, password, error, loading } = data;
  // делаю инпут управляемым
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  // асинхронная функция при нажатии на кнопку
  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    // валидация на пустоту
    if (!name || !lastName || !email || !password) {
      setData({ ...data, error: 'Заполнить все поля' });
    }

    try {
      // регистрация по почте
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // создаю колекцию в дб
      await setDoc(doc(firestore, 'users', result.user.uid), {
        uid: result.user.uid,
        name,
        password,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });
      // очещаю поля
      setData({ name: '', email: '', password: '', error: null, loading: false });
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
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </Button>
            <Button
              disabled={loading}
              onClick={signUp}
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
            >
              {loading ? 'Загрузка...' : 'Войти через Google'}
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
