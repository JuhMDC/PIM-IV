import React from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLuxx } from '../../src/context/LuxxContext';
import { C } from '../../src/theme';
import { CarCard } from '../../src/components/CarCard';
import { DemoAviso, Botao } from '../../src/components/Common';

export default function Inicio() {
  const {veiculos, favoritos, alternarFavorito, demo, loading, atualizar} = useLuxx();
  return <ScrollView style={{backgroundColor:C.bg}} refreshControl={<RefreshControl refreshing={loading} onRefresh={atualizar} tintColor={C.gold} />}>
    <View style={styles.hero}>
      <View style={styles.head}><Image source={require('../../assets/logo-luxx.jpg')} style={styles.logo} resizeMode="contain" /><View style={{alignItems:'flex-end'}}><Text style={styles.headSmall}>PREMIUM AUTOMOTIVE</Text><View style={styles.dot}/></View></View>
      <Text style={styles.eyebrow}>A EXPERIÊNCIA LUXX</Text>
      <Text style={styles.headline}>Seu próximo carro, uma nova história.</Text>
      <Text style={styles.heroDesc}>Explore nossa seleção de veículos e encontre o modelo ideal para você.</Text>
      <Pressable onPress={()=>router.push('/catalogo')} style={styles.heroButton}><Text style={{color:C.navy,fontWeight:'900'}}>EXPLORAR VEÍCULOS</Text><Ionicons name="arrow-forward" size={19} color={C.navy}/></Pressable>
      <View style={styles.heroLine}/>
    </View>
    <View style={styles.inner}>
      {demo && <DemoAviso />}
      <View style={styles.heading}><View><Text style={styles.small}>ESCOLHAS ESPECIAIS</Text><Text style={styles.section}>Em destaque</Text></View><Pressable onPress={()=>router.push('/catalogo')}><Text style={styles.ver}>Ver todos →</Text></Pressable></View>
      {veiculos.slice(0,4).map(v => <CarCard key={v.id} veiculo={v} onOpen={()=>router.push(`/veiculo/${v.id}`)} favorito={favoritos.includes(v.id)} onFavorito={()=>alternarFavorito(v.id)} />)}
      <View style={styles.services}>
        <Text style={{fontWeight:'900',fontSize:22,color:C.navy,marginBottom:5}}>Uma experiência completa</Text>
        <Text style={{color:C.muted,fontSize:13,lineHeight:19,marginBottom:18}}>Da escolha do veículo até a proposta, tudo em um só lugar.</Text>
        <Botao titulo="Agendar um test-drive" icon="calendar-outline" onPress={()=>router.push('/test-drive')} disabled={demo} />
        <View style={{height:9}}/><Botao titulo="Simular financiamento" icon="calculator-outline" outline onPress={()=>router.push('/financiamento')} />
      </View>
    </View>
  </ScrollView>;
}
const styles=StyleSheet.create({
  hero:{backgroundColor:C.navy,paddingHorizontal:26,paddingTop:54,paddingBottom:34,overflow:'hidden'},
  head:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:28},
  logo:{width:112,height:71},headSmall:{fontSize:8,color:'#C9A969',letterSpacing:1.3,fontWeight:'800'},
  dot:{backgroundColor:C.gold,width:24,height:2,marginTop:9},
  eyebrow:{color:C.gold,fontSize:11,fontWeight:'800',letterSpacing:2.7,marginBottom:13},
  headline:{color:'white',fontSize:35,lineHeight:41,fontWeight:'900',maxWidth:340},
  heroDesc:{color:'#C6CDD8',fontSize:14,lineHeight:23,marginTop:15,marginBottom:25,maxWidth:310},
  heroButton:{backgroundColor:'#E7CD90',borderRadius:12,padding:15,flexDirection:'row',alignItems:'center',justifyContent:'space-between',maxWidth:260},
  heroLine:{height:1,backgroundColor:'#435067',marginTop:33},
  inner:{padding:18,paddingTop:23}, heading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginVertical:14},
  small:{fontWeight:'900',color:C.gold,fontSize:9,letterSpacing:2},section:{color:C.navy,fontSize:25,fontWeight:'900'},ver:{color:C.navy,fontWeight:'800',fontSize:13},
  services:{backgroundColor:'white',borderRadius:18,padding:20,marginTop:8,marginBottom:32},
});
