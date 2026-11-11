import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useLuxx } from '../../src/context/LuxxContext';
import { FotoVeiculo } from '../../src/components/CarCard';
import { Botao, DemoAviso, Vazio } from '../../src/components/Common';
import { brl, km } from '../../src/lib/utils';
import { C } from '../../src/theme';

export default function Detalhe(){
  const {id}=useLocalSearchParams<{id:string}>();
  const {veiculos, favoritos, alternarFavorito, demo}=useLuxx();
  const v=veiculos.find(x=>x.id===Number(id));
  if (!v) return <Vazio titulo="Veículo indisponível" detalhe="O veículo pode ter saído do estoque. Volte ao catálogo e atualize a lista."/>;
  const caracteristicas=[['Ano',v.ano||'Não informado'],['Câmbio',v.cambio||'Não informado'],['Quilometragem',km(v.quilometragem)],['Cor',v.cor||'Não informada'],['Categoria',v.categoria||'Não informada'],['Status',v.status||'Sob consulta']];
  return <ScrollView style={{backgroundColor:C.bg}} contentContainerStyle={{paddingBottom:35}}>
    <FotoVeiculo veiculo={v} height={265}/>
    <View style={styles.body}>
      {demo&&<DemoAviso/>}
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}><View style={{flex:1}}><Text style={styles.brand}>{v.marca.toUpperCase()}</Text><Text style={styles.name}>{v.modelo}</Text></View><Pressable style={styles.heart} onPress={()=>alternarFavorito(v.id)}><Ionicons name={favoritos.includes(v.id)?'heart':'heart-outline'} size={24} color={favoritos.includes(v.id)?C.red:C.navy}/></Pressable></View>
      <Text style={styles.price}>{brl(v.preco)}</Text>
      <Text style={{color:C.muted,fontSize:13,marginBottom:22}}>Um veículo escolhido para sua próxima jornada.</Text>
      <Text style={styles.subtitle}>Informações do veículo</Text>
      <View style={styles.specs}>{caracteristicas.map(([k,valor])=><View key={k} style={styles.specRow}><Text style={{color:C.muted}}>{k}</Text><Text style={{fontWeight:'700',color:C.text}}>{String(valor)}</Text></View>)}</View>
      <View style={{height:20}}/>
      <Botao titulo="Quero fazer um test-drive" icon="calendar-outline" disabled={demo||v.status.toLowerCase().includes('vendido')} onPress={()=>router.push({pathname:'/test-drive',params:{id:String(v.id)}})}/>
      <View style={{height:10}}/><Botao titulo="Simular financiamento" icon="calculator-outline" outline onPress={()=>router.push({pathname:'/financiamento',params:{id:String(v.id)}})}/>
      <Text style={{textAlign:'center',color:C.muted,marginTop:14,fontSize:11}}>Valores e disponibilidade sujeitos à confirmação pela concessionária.</Text>
    </View>
  </ScrollView>;
}
const styles=StyleSheet.create({body:{padding:20},brand:{color:C.gold,fontSize:11,fontWeight:'900',letterSpacing:2},name:{color:C.navy,fontSize:31,fontWeight:'900',marginTop:3},heart:{padding:8,backgroundColor:'white',borderRadius:25},price:{color:C.navy,fontSize:29,fontWeight:'900',marginTop:10,marginBottom:8},subtitle:{color:C.text,fontWeight:'900',fontSize:18,marginBottom:13},specs:{backgroundColor:'white',borderRadius:16,paddingHorizontal:18,paddingVertical:6},specRow:{minHeight:47,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}});
