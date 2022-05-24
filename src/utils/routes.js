import { CHAT_ROUTE, LOGIN_ROUTE, REG_ROUTE } from './consts';
import Login from '../pages/Login';
import Register from '../pages/SignUp';
import Chat from '../pages/Chat';

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
];
