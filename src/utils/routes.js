import { CHAT_ROUTE, LOGIN_ROUTE, REG_ROUTE, PROFILE_ROUTE } from './consts';
import Login from '../pages/Login';
import Register from '../pages/SignUp';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: <Login />,
  },
  {
    path: REG_ROUTE,
    Component: <Register />,
  },
];

export const privateRoutes = [
  {
    path: CHAT_ROUTE,
    Component: <Chat />,
  },
  {
    path: PROFILE_ROUTE,
    Component: <Profile />,
  },
];
