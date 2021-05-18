import React from 'react';
import AppLoading from 'expo-app-loading';

import { useFonts, Jost_400Regular, Jost_600SemiBold } from '@expo-google-fonts/jost';

import Routes from './src/routes';



//obrigatorio usar o default
export default function App() {
  const [ fontsLoaded ] = useFonts ({
    Jost_400Regular,
    Jost_600SemiBold
  });

  if (!fontsLoaded) { //se a fonte não estiver carregada
    return <AppLoading /> // segura a tela de splash
  }

  return (
    <Routes />
  )
}