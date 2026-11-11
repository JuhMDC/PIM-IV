import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLuxx } from '../../src/context/LuxxContext';
import { API_BASE } from '../../src/lib/api';
import { Botao, DemoAviso } from '../../src/components/Common';
import { C } from '../../src/theme';
export default function Mais(){
  const {demo,erro,atualizar,loading}=useLuxx();
  return <ScrollView style={{backgroundColor:C.bg}} contentContainerStyle={{padding:20,paddingBottom:40}}>
    <Text style={styles.cap}>CONCIERGE AUTOMOTIVO</Text><Text style={styles.title}>Sempre com você.</Text>
    {demo&&<DemoAviso texto="A API ainda não está conectada. Você pode navegar no catálogo de demonstração e calcular parcelas, mas não enviar agendamentos ou propostas."/>}
    <View style={styles.block}>
      <View style={styles.line}><Ionicons name="calendar-outline" size={28} color={C.gold}/><View style={{flex:1}}><Text style={styles.h}>Agendar test-drive</Text><Text style={styles.desc}>Escolha seu modelo e venha experimentar.</Text></View></View>
      <Botao titulo="Agendar" onPress={()=>router.push('/test-drive')} disabled={demo}/>
    </View>
    <View style={styles.block}>
      <View style={styles.line}><Ionicons name="calculator-outline" size={28} color={C.gold}/><View style={{flex:1}}><Text style={styles.h}>Simulação de financiamento</Text><Text style={styles.desc}>Planeje valores, entrada e parcelas.</Text></View></View>
      <Botao titulo="Simular agora" onPress={()=>router.push('/financiamento')} outline/>
    </View>
    <View style={styles.block}>
      <View style={styles.line}><Ionicons name="cloud-outline" size={28} color={C.gold}/><View style={{flex:1}}><Text style={styles.h}>Conexão com a LUXX</Text><Text style={styles.desc}>{demo?'Demonstração offline':'Catálogo sincronizado com o servidor'}</Text></View></View>
      <Text style={{color:C.muted,fontSize:12,marginBottom:12}} selectable>{API_BASE||'Endereço da API ainda não configurado'}</Text>
      {!!erro&&<Text style={{color:C.red,fontSize:12,marginBottom:10}}>{erro}</Text>}
      <Botao titulo={loading?'Conectando...':'Atualizar catálogo'} onPress={()=>void atualizar()} loading={loading}/>
    </View>
    <Text style={{fontSize:12,color:C.muted,textAlign:'center',marginTop:10}}>LUXX MOTORS · Premium Automotive</Text>
  </ScrollView>;
}
const styles=StyleSheet.create({cap:{color:C.gold,fontSize:10,fontWeight:'900',letterSpacing:2},title:{fontSize:28,fontWeight:'900',color:C.navy,marginBottom:22,marginTop:5},block:{backgroundColor:'white',padding:20,borderRadius:16,marginBottom:14},line:{flexDirection:'row',alignItems:'center',gap:14,marginBottom:17},h:{color:C.navy,fontSize:17,fontWeight:'900',marginBottom:4},desc:{color:C.muted,fontSize:12,lineHeight:18}});
