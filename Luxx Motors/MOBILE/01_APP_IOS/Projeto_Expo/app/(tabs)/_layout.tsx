import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../../src/theme';

export default function TabsLayout() {
  const icon = (name: React.ComponentProps<typeof Ionicons>['name'], focused:boolean) => <Ionicons name={name} size={23} color={focused ? C.gold : '#AAB4C3'} />;
  return <Tabs screenOptions={{ headerStyle:{backgroundColor:C.navy}, headerTintColor:'white', headerTitleStyle:{fontWeight:'800'}, tabBarActiveTintColor:C.gold, tabBarInactiveTintColor:'#AAB4C3', tabBarStyle:{backgroundColor:C.navy,height:63,paddingTop:4,paddingBottom:9}, tabBarLabelStyle:{fontSize:11,fontWeight:'700'} }}>
    <Tabs.Screen name="index" options={{title:'Início', headerShown:false, tabBarIcon:({focused})=>icon(focused?'home':'home-outline',focused)}} />
    <Tabs.Screen name="catalogo" options={{title:'Veículos',headerTitle:'Catálogo LUXX',tabBarIcon:({focused})=>icon(focused?'car-sport':'car-sport-outline',focused)}} />
    <Tabs.Screen name="favoritos" options={{title:'Favoritos',headerTitle:'Meus favoritos',tabBarIcon:({focused})=>icon(focused?'heart':'heart-outline',focused)}} />
    <Tabs.Screen name="mais" options={{title:'Serviços',headerTitle:'Serviços LUXX',tabBarIcon:({focused})=>icon(focused?'grid':'grid-outline',focused)}} />
  </Tabs>;
}
