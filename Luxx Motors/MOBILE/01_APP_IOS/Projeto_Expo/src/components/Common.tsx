import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';

export function Botao({ titulo, onPress, disabled=false, loading=false, outline=false, icon }: { titulo:string; onPress:()=>void; disabled?:boolean; loading?:boolean; outline?:boolean; icon?:React.ComponentProps<typeof Ionicons>['name'] }) {
  return <Pressable onPress={onPress} disabled={disabled || loading} accessibilityRole="button" style={[styles.btn, outline && styles.btnOutline, (disabled || loading) && {opacity:.45}]}>
    {loading ? <ActivityIndicator color={outline ? C.navy : 'white'} /> : <>
      {icon && <Ionicons name={icon} size={19} color={outline ? C.navy : 'white'} />}
      <Text style={[styles.btnText, outline && {color:C.navy}]}>{titulo}</Text>
    </>}
  </Pressable>;
}
export function Campo({ rotulo, valor, onChange, placeholder, keyboardType='default', secure=false, maxLength }: { rotulo:string; valor:string; onChange:(v:string)=>void; placeholder?:string; keyboardType?:'default'|'email-address'|'numeric'|'phone-pad'|'decimal-pad'; secure?:boolean; maxLength?:number }) {
  return <View style={{marginBottom:15}}>
    <Text style={styles.label}>{rotulo}</Text>
    <TextInput style={styles.input} value={valor} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#9BA5B6" autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'} keyboardType={keyboardType} secureTextEntry={secure} maxLength={maxLength} accessibilityLabel={rotulo} />
  </View>;
}
export function DemoAviso({ texto }: {texto?:string}) {
  return <View style={styles.warning}><Ionicons name="information-circle-outline" size={19} color="#795B27" /><Text style={styles.warningText}>{texto || 'Modo de demonstração: conecte a API para mostrar preços reais e enviar solicitações.'}</Text></View>;
}
export function Vazio({ titulo, detalhe, icon='car-outline' }: {titulo:string; detalhe:string; icon?:React.ComponentProps<typeof Ionicons>['name']}) {
  return <View style={{alignItems:'center', padding:36, gap:12}}><Ionicons name={icon} size={52} color={C.gold}/><Text style={{fontSize:19, color:C.text, fontWeight:'800', textAlign:'center'}}>{titulo}</Text><Text style={{color:C.muted, textAlign:'center', lineHeight:21}}>{detalhe}</Text></View>;
}
const styles = StyleSheet.create({
  btn: { backgroundColor:C.navy, minHeight:52, borderRadius:13, alignItems:'center', justifyContent:'center', flexDirection:'row', gap:10, paddingHorizontal:14 },
  btnOutline: { backgroundColor:'white', borderColor:C.navy, borderWidth:1.3 },
  btnText: {color:'#FFFFFF', fontSize:15, fontWeight:'800'},
  label: { fontWeight:'700', color:C.text, fontSize:13, marginBottom:7 },
  input: { height:51, borderColor:C.border, borderWidth:1.3, borderRadius:12, paddingHorizontal:14, fontSize:15, color:C.text, backgroundColor:'white' },
  warning: { backgroundColor:'#FFF4D9', borderWidth:1, borderColor:'#ECD9AB', padding:13, borderRadius:12, flexDirection:'row', alignItems:'flex-start', gap:9, marginBottom:17 },
  warningText: { color:'#795B27', flex:1, fontSize:12, lineHeight:18 },
});
