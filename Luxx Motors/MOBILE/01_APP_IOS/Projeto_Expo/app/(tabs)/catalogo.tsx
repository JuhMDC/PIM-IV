import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLuxx } from '../../src/context/LuxxContext';
import { C } from '../../src/theme';
import { CarCard } from '../../src/components/CarCard';
import { DemoAviso, Vazio } from '../../src/components/Common';
import { cleanKey } from '../../src/lib/utils';

export default function Catalogo(){
  const {veiculos,favoritos,alternarFavorito,demo,loading,atualizar}=useLuxx();
  const [busca,setBusca]=useState(''); const [marca,setMarca]=useState('Todas');
  const marcas=useMemo(()=>['Todas',...new Set(veiculos.map(v=>v.marca))].sort((a,b)=>a==='Todas'?-1:b==='Todas'?1:a.localeCompare(b)),[veiculos]);
  const lista=useMemo(()=>veiculos.filter(v=>{
    const matchMarca=marca==='Todas'||v.marca===marca;
    const termo=cleanKey(busca);
    return matchMarca&&(!termo||cleanKey(`${v.marca} ${v.modelo} ${v.cor} ${v.ano||''}`).includes(termo));
  }),[veiculos,marca,busca]);
  return <FlatList style={{backgroundColor:C.bg}} contentContainerStyle={{padding:17,paddingBottom:32}} data={lista} keyExtractor={v=>String(v.id)} renderItem={({item})=><CarCard veiculo={item} onOpen={()=>router.push(`/veiculo/${item.id}`)} favorito={favoritos.includes(item.id)} onFavorito={()=>alternarFavorito(item.id)}/>} refreshControl={<RefreshControl refreshing={loading} onRefresh={atualizar}/>} ListHeaderComponent={<View>
    <Text style={styles.caption}>ENCONTRE SEU PRÓXIMO CARRO</Text><Text style={styles.title}>Escolha sem limites.</Text>
    {demo&&<DemoAviso/>}
    <View style={styles.inputRow}><Ionicons name="search-outline" size={20} color={C.muted}/><TextInput value={busca} onChangeText={setBusca} placeholder="Modelo, marca, cor ou ano" placeholderTextColor="#99A4B3" style={styles.input} clearButtonMode="while-editing" /></View>
    <FlatList horizontal showsHorizontalScrollIndicator={false} data={marcas} keyExtractor={v=>v} style={{marginVertical:15}} renderItem={({item})=><Pressable onPress={()=>setMarca(item)} style={[styles.chip,marca===item&&styles.active]}><Text style={[styles.chipText,marca===item&&{color:'white'}]}>{item}</Text></Pressable>}/>
    <Text style={styles.count}>{lista.length} veículo(s) encontrado(s)</Text>
  </View>} ListEmptyComponent={<Vazio titulo="Nenhum veículo encontrado" detalhe="Tente outra marca ou termo de pesquisa." icon="search-outline"/>} />;
}
const styles=StyleSheet.create({
  caption:{color:C.gold,fontWeight:'900',letterSpacing:2,fontSize:10,marginTop:6},title:{color:C.navy,fontWeight:'900',fontSize:25,marginTop:5,marginBottom:20},
  inputRow:{height:52,flexDirection:'row',alignItems:'center',backgroundColor:'white',borderColor:C.border,borderWidth:1,borderRadius:13,paddingHorizontal:14},
  input:{height:52,flex:1,marginLeft:9,color:C.text,fontSize:14},chip:{borderWidth:1,borderColor:C.border,backgroundColor:'white',paddingVertical:9,paddingHorizontal:15,borderRadius:22,marginRight:8},
  active:{backgroundColor:C.navy,borderColor:C.navy},chipText:{fontSize:12,fontWeight:'800',color:C.text},count:{fontSize:12,fontWeight:'700',color:C.muted,marginBottom:15},
});
