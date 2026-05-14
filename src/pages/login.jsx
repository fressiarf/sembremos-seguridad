import React from 'react';
import HeaderInstitucional from '../components/Login/HeaderInstitucional/HeaderInstitucional';
import CardAutenticacion from '../components/Login/CardAutenticacion/CardAutenticacion';
import InputValidar from '../components/Login/InputValidar/InputValidar';
import BtnAcceso from '../components/Login/BtnAcceso/BtnAcceso';

const Login = () => {
  return (
    <CardAutenticacion>
      <HeaderInstitucional />
      <InputValidar/>
      <BtnAcceso />
    </CardAutenticacion>
  );
};

export default Login;
