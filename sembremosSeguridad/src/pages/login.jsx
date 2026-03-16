import React from 'react';
import HeaderInstitucional from '../components/Login/HeaderInstitucional/HeaderInstitucional';
import CardAutenticacion from '../components/Login/CardAutenticacion/CardAutenticacion';
import SelectorMetodoModerno from '../components/Login/SelectorModerno/SelectorModerno';
import InputValidar from '../components/Login/InputValidar/InputValidar';
import BtnAcceso from '../components/Login/BtnAcceso/BtnAcceso';

import { User, Lock } from 'lucide-react';

const Login = () => {
  return (
    <CardAutenticacion>
      <HeaderInstitucional />
      
      <SelectorMetodoModerno />
      
      <InputValidar 
        id="EntradaUsuario"
        label="Correo Electrónico o Cédula"
        type="text"
        placeholder="Ej: usuario@seguridad.go.cr"
        Icon={User}
      />
      
      <InputValidar 
        id="EntradaPassword"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        Icon={Lock}
      />

      <BtnAcceso />
    </CardAutenticacion>
  );
};

export default Login;
