import { CHAT_ROUTE, LOGIN_ROUTE } from './consts';
import Login from '../pages/Login';
import Chat from '../pages/Chat';

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: <Login />,
  },
];

export const privateRoutes = [
  {
    path: CHAT_ROUTE,
    Component: <Chat />,
  },
];
