import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Veiculo } from '../types';
import { fotoLocal } from '../data/vehicles';
import { urlImagem } from '../lib/api';
import { brl, km } from '../lib/utils';
import { C, shadow } from '../theme';

export function FotoVeiculo({ veiculo, height = 178 }: {veiculo: Veiculo; height?: number}) {
  const uri = urlImagem(veiculo.imagemUrl);
  const local = fotoLocal(veiculo);
  return <View style={{ height, backgroundColor:'#EEF1F5', alignItems:'center', justifyContent:'center' }}>
    {uri || local
      ? <Image source={uri ? { uri } : local} style={{ width:'100%', height:'100%' }} resizeMode="cover" />
      : <Ionicons name="car-sport-outline" size={60} color={C.muted} />}
  </View>;
}

type Props = {veiculo: Veiculo; onOpen: () => void; favorito: boolean; onFavorito: () => void};
export function CarCard({ veiculo, onOpen, favorito, onFavorito }: Props) {
  return <Pressable onPress={onOpen} style={styles.card} accessibilityRole="button" accessibilityLabel={`Ver ${veiculo.marca} ${veiculo.modelo}`}>
    <View>
      <FotoVeiculo veiculo={veiculo} />
      <Pressable onPress={onFavorito} accessibilityRole="button" accessibilityLabel={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} style={styles.heart}>
        <Ionicons name={favorito ? 'heart' : 'heart-outline'} size={23} color={favorito ? C.red : C.navy} />
      </Pressable>
    </View>
    <View style={styles.body}>
      <Text style={styles.marca}>{veiculo.marca.toUpperCase()}</Text>
      <Text style={styles.modelo} numberOfLines={1}>{veiculo.modelo}</Text>
      <Text style={styles.meta}>{[veiculo.ano || '', veiculo.cambio, veiculo.quilometragem != null ? km(veiculo.quilometragem) : ''].filter(Boolean).join('  ·  ') || `${veiculo.cor} · Consulte detalhes`}</Text>
      <View style={styles.bottom}>
        <Text style={styles.preco}>{brl(veiculo.preco)}</Text>
        <Ionicons name="arrow-forward-circle" size={27} color={C.gold} />
      </View>
    </View>
  </Pressable>;
}
const styles = StyleSheet.create({
  card: { borderRadius: 18, backgroundColor:C.surface, overflow:'hidden', marginBottom:16, ...shadow },
  heart: { position:'absolute', top:12, right:12, height:38, width:38, borderRadius:22, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(255,255,255,.95)' },
  body: { padding:17 },
  marca: { fontSize:10, fontWeight:'800', color:C.gold, letterSpacing:2, marginBottom:4 },
  modelo: { fontSize:20, fontWeight:'800', color:C.text, marginBottom:5 },
  meta: { fontSize:12, color:C.muted, minHeight:17 },
  bottom: { borderTopWidth:1, borderTopColor:C.border, paddingTop:14, marginTop:13, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  preco: { fontWeight:'900', fontSize:20, color:C.navy },
});
