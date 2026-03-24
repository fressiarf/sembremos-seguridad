import React, { createContext, useContext, useState, useEffect } from 'react';
import mockData from '../../db.json';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {

  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const [errors, setErrors] = useState({
    usuario: '',
    password: ''
  });

  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });

  const [user, setUser] = useState(null); // Estado para el usuario logueado

  const validateAll = () => {
    const newErrors = {
      usuario: '',
      password: ''
    };

    // 1. Validación de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.usuario) newErrors.usuario = 'El correo es requerido';
    else if (!emailRegex.test(formData.usuario)) newErrors.usuario = 'Formato de correo inválido';

    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';

    // Si hay errores de formato, no seguimos
    if (newErrors.usuario || newErrors.password) {
      setErrors(newErrors);
      return false;
    }

    // 2. Verificación contra la base de datos
    // Primero buscamos si existe el usuario
    const usuarioEncontrado = mockData.usuarios.find(
      (u) => u.usuario === formData.usuario
    );

    if (!usuarioEncontrado) {
      newErrors.usuario = 'Este correo no está registrado en el sistema';
      setErrors(newErrors);
      return false;
    }

    // Si el usuario existe, verificamos la contraseña
    if (usuarioEncontrado.password !== formData.password) {
      newErrors.password = 'Contraseña incorrecta';
      setErrors(newErrors);
      return false;
    }

    if (usuarioEncontrado) {
      setUser(usuarioEncontrado);
      sessionStorage.setItem('currentUser', JSON.stringify(usuarioEncontrado));
    }

    setErrors(newErrors);
    return usuarioEncontrado;
  };

  const logout = () => {
    setFormData({ usuario: '', password: '' });
    setErrors({ usuario: '', password: '' });
    setUser(null);
    
    // Eliminación agresiva de llaves de sesión
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser'); 
    sessionStorage.clear();

    // Redirigir pisando el historial para que no puedan usar el botón de "Atrás"
    window.location.replace('/');
  };

  const value = {
    formData,
    setFormData,
    errors,
    setErrors,
    validateAll,
    logout,
    user
  };

  return (
    <LoginContext.Provider value={value}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin debe usarse dentro de un LoginProvider');
  }
  return context;
};
