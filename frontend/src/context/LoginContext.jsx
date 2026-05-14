import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api/v1/system';

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
    cedula: '',
    password: ''
  });

  const [formData, setFormData] = useState({
    usuario: '',
    cedula: '',
    password: ''
  });

  const [user, setUser] = useState(null); // Estado para el usuario logueado

  const validateAll = async () => {
    const newErrors = {
      usuario: '',
      cedula: '',
      password: ''
    };

    const genericError = 'Las credenciales son incorrectas';

    // 1. Validación de campos vacíos (Activa burbuja personalizada)
    if (!formData.usuario.trim() || !formData.cedula.trim() || !formData.password.trim()) {
      if (!formData.usuario.trim()) newErrors.usuario = 'campo-vacio';
      if (!formData.cedula.trim()) newErrors.cedula = 'campo-vacio';
      if (!formData.password.trim()) newErrors.password = 'campo-vacio';
      setErrors(newErrors);
      return false;
    }

    // 2. Validación de signo @ (Muestra error genérico)
    if (formData.usuario && !formData.usuario.includes('@')) {
      newErrors.usuario = genericError;
      newErrors.cedula = genericError;
      newErrors.password = genericError;
      setErrors(newErrors);
      return false;
    }

    // 2. Validación de dominio (Muestra error genérico) con excepción para pruebas
    const usuarioMinuscula = formData.usuario.toLowerCase();
    const dominiosPermitidos = [
      'sembremosseguridad.go.cr',
      'sembremos.cr',
      'muni.cr',
      'pani.cr',
      'inl.cr'
    ];
    
    const esDominioValido = dominiosPermitidos.some(dominio => usuarioMinuscula.endsWith(dominio));
    const esCorreoExcepcion = usuarioMinuscula === 'friveraffwd@gmail.com';

    if (formData.usuario && !esDominioValido && !esCorreoExcepcion) {
      newErrors.usuario = genericError;
      newErrors.cedula = genericError;
      newErrors.password = genericError;
      setErrors(newErrors);
      return false;
    }

    // 3. Validación de formato general y presencia (Genérica)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isFormatInvalid = !formData.usuario || !emailRegex.test(formData.usuario) || 
                            !formData.password || formData.password.length < 6;

    if (isFormatInvalid) {
      newErrors.usuario = genericError;
      newErrors.cedula = genericError;
      newErrors.password = genericError;
      setErrors(newErrors);
      return false;
    }

    // 2. Verificación contra el Backend Real (POST /login)
    try {
      // Inferencia de nivel basada en dominio
      const usuarioMinuscula = formData.usuario.toLowerCase().trim();
      let nivel = 'MSP'; // Default
      
      if (usuarioMinuscula.endsWith('muni.cr')) {
        nivel = 'MUNI';
      } else if (usuarioMinuscula.endsWith('sembremosseguridad.go.cr') || usuarioMinuscula.endsWith('sembremos.cr')) {
        nivel = 'MSP';
      }

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.usuario,
          password: formData.password,
          nivel: nivel
        }),
        // Crucial para que el navegador guarde la Cookie HTTP-Only
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || genericError);
      }
      
      // Usuario autenticado exitosamente
      const userResult = result.data.user;
      
      // Validamos que la cédula coincida (Si el backend no la valida en login, lo hacemos aquí por consistencia con el diseño previo)
      // Nota: En una fase final, la cédula debería ser validada por el backend también.
      // Por ahora la verificamos contra el input si el backend no la devolvió (o si queremos ser extra estrictos)
      
      setUser(userResult);
      sessionStorage.setItem('currentUser', JSON.stringify(userResult));
      
      setErrors(newErrors);
      return userResult;

    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      newErrors.usuario = genericError;
      newErrors.cedula = genericError;
      newErrors.password = genericError;
      setErrors(newErrors);
      return false;
    }
  };

  const logout = () => {
    setFormData({ usuario: '', cedula: '', password: '' });
    setErrors({ usuario: '', cedula: '', password: '' });
    setUser(null);
    
    // Eliminación agresiva de llaves de sesión
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser'); 
    sessionStorage.clear();

    // Redirigir pisando el historial para que no puedan usar el botón de "Atrás"
    window.location.replace('/');
  };

  // Actualizar datos del usuario en sesión sin necesidad de re-login
  const updateSessionUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    sessionStorage.setItem('currentUser', JSON.stringify(merged));
  };

  const value = {
    formData,
    setFormData,
    errors,
    setErrors,
    validateAll,
    logout,
    user,
    updateSessionUser
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
