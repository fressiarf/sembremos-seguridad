import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api/v1/system';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/auth/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const result = await response.json();
          setUser(result.data.user);
          sessionStorage.setItem('currentUser', JSON.stringify(result.data.user));
        } else {
          // Si no hay sesión válida en el servidor, limpiamos local
          sessionStorage.removeItem('currentUser');
          setUser(null);
        }
      } catch (error) {
        console.error('Error sincronizando sesión:', error);
      }
    };

    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchUser(); // Sincronizar con el servidor para tener datos frescos
    }
  }, []);

  // Método de autenticación seleccionado: 'email' o 'cedula'
  const [loginMethod, setLoginMethod] = useState('email');

  const [errors, setErrors] = useState({
    identificador: '',
    password: ''
  });

  const [formData, setFormData] = useState({
    identificador: '',
    password: ''
  });

  const [user, setUser] = useState(null); // Estado para el usuario logueado

  const validateAll = async () => {
    const newErrors = {
      identificador: '',
      password: ''
    };

    const genericError = 'Las credenciales son incorrectas';

    // 1. Validación de campos vacíos (Activa burbuja personalizada)
    if (!formData.identificador.trim() || !formData.password.trim()) {
      if (!formData.identificador.trim()) newErrors.identificador = 'campo-vacio';
      if (!formData.password.trim()) newErrors.password = 'campo-vacio';
      setErrors(newErrors);
      return false;
    }

    // 2. Validaciones específicas según el método seleccionado
    if (loginMethod === 'email') {
      // Validación de signo @
      if (!formData.identificador.includes('@')) {
        newErrors.identificador = genericError;
        newErrors.password = genericError;
        setErrors(newErrors);
        return false;
      }

      // Validación de dominio con excepción para pruebas
      const usuarioMinuscula = formData.identificador.toLowerCase();
      const dominiosPermitidos = [
        'sembremosseguridad.go.cr',
        'sembremos.cr',
        'muni.cr',
        'pani.cr',
        'inl.cr'
      ];
      
      const esDominioValido = dominiosPermitidos.some(dominio => usuarioMinuscula.endsWith(dominio));
      const esCorreoExcepcion = usuarioMinuscula === 'friveraffwd@gmail.com';

      if (!esDominioValido && !esCorreoExcepcion) {
        newErrors.identificador = genericError;
        newErrors.password = genericError;
        setErrors(newErrors);
        return false;
      }

      // Validación de formato de email y longitud mínima de password
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.identificador) || formData.password.length < 6) {
        newErrors.identificador = genericError;
        newErrors.password = genericError;
        setErrors(newErrors);
        return false;
      }
    } else {
      // Método: cédula — validar formato numérico (9 a 12 dígitos)
      const cedulaRegex = /^[0-9]{9,12}$/;
      if (!cedulaRegex.test(formData.identificador.trim())) {
        newErrors.identificador = 'Formato inválido. La cédula debe tener entre 9 y 12 dígitos.';
        setErrors(newErrors);
        return false;
      }

      if (formData.password.length < 6) {
        newErrors.identificador = genericError;
        newErrors.password = genericError;
        setErrors(newErrors);
        return false;
      }
    }

    // 3. Verificación contra el Backend Real (POST /login)
    try {
      // Inferencia de nivel basada en dominio (solo para método email)
      let nivel = 'MSP'; // Default
      
      if (loginMethod === 'email') {
        const usuarioMinuscula = formData.identificador.toLowerCase().trim();
        if (usuarioMinuscula.endsWith('muni.cr')) {
          nivel = 'MUNI';
        }
      }
      // Para cédula, el nivel por defecto es MSP.
      // El backend buscará en la DB correspondiente.

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identificador: formData.identificador.trim(),
          password: formData.password,
          nivel: nivel,
          metodo: loginMethod
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
      
      setUser(userResult);
      sessionStorage.setItem('currentUser', JSON.stringify(userResult));
      
      setErrors(newErrors);
      return userResult;

    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      newErrors.identificador = genericError;
      newErrors.password = genericError;
      setErrors(newErrors);
      return false;
    }
  };

  const logout = () => {
    setFormData({ identificador: '', password: '' });
    setErrors({ identificador: '', password: '' });
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
    updateSessionUser,
    loginMethod,
    setLoginMethod
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
