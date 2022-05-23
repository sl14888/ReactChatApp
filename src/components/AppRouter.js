import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '../utils/routes';

const AppRouter = () => {
  const user = false;
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
