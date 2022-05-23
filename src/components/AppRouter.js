import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CHAT_ROUTE, LOGIN_ROUTE } from '../utils/consts';
import { privateRoutes, publicRoutes } from '../utils/routes';

const AppRouter = () => {
  const user = false;
  return user ? (
    <Routes>
      {privateRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={Component} exact />
      ))}
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  ) : (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={Component} exact />
      ))}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
