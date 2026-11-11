import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useLuxx } from '../../src/context/LuxxContext';
import { CarCard } from '../../src/components/CarCard';
import { Vazio } from '../../src/components/Common';
import { C } from '../../src/theme';
export default function Favoritos(){
  const {veiculos,favoritos,alternarFavorito}=useLuxx();
  const itens=veiculos.filter(v=>favoritos.includes(v.id));
  return <FlatList style={{backgroundColor:C.bg}} contentContainerStyle={{padding:18,paddingBottom:32,flexGrow:1}} data={itens} keyExtractor={v=>String(v.id)} ListHeaderComponent={<View style={{marginBottom:20}}><Text style={{fontSize:27,fontWeight:'900',color:C.navy}}>Seus preferidos</Text><Text style={{color:C.muted,marginTop:5}}>Acompanhe os veículos que mais gostou.</Text></View>} renderItem={({item})=><CarCard veiculo={item} favorito onFavorito={()=>alternarFavorito(item.id)} onOpen={()=>router.push(`/veiculo/${item.id}`)}/>} ListEmptyComponent={<Vazio titulo="Sem favoritos ainda" detalhe="Toque no coração de um veículo para encontrá-lo aqui." icon="heart-outline"/>}/>;
}
