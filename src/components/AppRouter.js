import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '../utils/routes';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Context } from '../index';

const AppRouter = () => {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);
  // Проверка входа
  return user ? (
    <Routes>
      {privateRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={Component} exact />
      ))}
      {/* Редирект в новой версии роутера */}
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  ) : (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={Component} exact />
      ))}
      {/* Редирект в новой версии роутера */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
