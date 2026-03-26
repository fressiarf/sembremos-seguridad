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

    const genericError = 'Las credenciales son incorrectas';

    // 1. Validación de campos vacíos (Activa burbuja personalizada)
    if (!formData.usuario.trim() || !formData.password.trim()) {
      if (!formData.usuario.trim()) newErrors.usuario = 'campo-vacio';
      if (!formData.password.trim()) newErrors.password = 'campo-vacio';
      setErrors(newErrors);
      return false;
    }

    // 2. Validación de signo @ (Muestra error genérico)
    if (formData.usuario && !formData.usuario.includes('@')) {
      newErrors.usuario = genericError;
      newErrors.password = genericError;
      setErrors(newErrors);
      return false;
    }

    // Se eliminó la validación estricta de dominio para permitir @gmail.com y otros dominios


    // 3. Validación de formato general y presencia (Genérica)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isFormatInvalid = !formData.usuario || !emailRegex.test(formData.usuario) || 
                            !formData.password || formData.password.length < 8;

    if (isFormatInvalid) {
      newErrors.usuario = genericError;
      newErrors.password = genericError;
      setErrors(newErrors);
      return false;
    }

    // 2. Verificación contra la base de datos
    const usuarioEncontrado = mockData.usuarios.find(
      (u) => u.usuario === formData.usuario && u.password === formData.password
    );

    if (!usuarioEncontrado) {
      newErrors.usuario = genericError;
      newErrors.password = genericError;
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
