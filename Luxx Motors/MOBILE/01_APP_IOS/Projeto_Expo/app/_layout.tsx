import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LuxxProvider } from '../src/context/LuxxContext';
import { C } from '../src/theme';

export default function RootLayout() {
  return <SafeAreaProvider><LuxxProvider>
    <StatusBar style="light" />
    <Stack screenOptions={{ headerStyle:{backgroundColor:C.navy}, headerTintColor:'white', headerTitleStyle:{fontWeight:'700'}, contentStyle:{backgroundColor:C.bg} }}>
      <Stack.Screen name="(tabs)" options={{headerShown:false}} />
      <Stack.Screen name="veiculo/[id]" options={{title:'Detalhes do veículo'}} />
      <Stack.Screen name="test-drive" options={{title:'Agendar test-drive'}} />
      <Stack.Screen name="financiamento" options={{title:'Simular financiamento'}} />
    </Stack>
  </LuxxProvider></SafeAreaProvider>;
}
