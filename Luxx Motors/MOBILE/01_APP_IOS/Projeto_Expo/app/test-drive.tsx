import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useLuxx } from '../src/context/LuxxContext';
import { api } from '../src/lib/api';
import { onlyDigits, dataISOValida, formatarDataISO } from '../src/lib/utils';
import { C } from '../src/theme';
import { Campo, Botao, DemoAviso, Vazio } from '../src/components/Common';
import { ContatoForm, contatoInicial, validarContato } from '../src/components/ContatoForm';

const HORARIOS=['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'];
export default function TestDrive(){
  const {id}=useLocalSearchParams<{id?:string}>();
  const {veiculos,demo}=useLuxx();
  const [idVeiculo,setIdVeiculo]=useState(Number(id)||0);
  const [contato,setContato]=useState(contatoInicial);
  const [data,setData]=useState(''); const [horario,setHorario]=useState('10:00');
  const [sending,setSending]=useState(false);
  const v=veiculos.find(x=>x.id===idVeiculo);
  async function enviar(){
    if(demo) return Alert.alert('Conexão necessária','Configure a API antes de registrar um agendamento.');
    if(!v) return Alert.alert('Veículo','Selecione um veículo válido.');
    const erro=validarContato(contato);
    if(erro) return Alert.alert('Verifique os dados',erro);
    if(!dataISOValida(data) || data < new Date().toISOString().slice(0,10)) return Alert.alert('Data inválida','Informe uma data válida, no formato AAAA-MM-DD, que não esteja no passado.');
    setSending(true);
    try {
      const resp=await api.testDrive({...contato,cpf:onlyDigits(contato.cpf),telefone:onlyDigits(contato.telefone),idVeiculo:v.id,dataAgendamento:data,horario});
      Alert.alert('Solicitação enviada',`Protocolo #${resp.protocolo}. A equipe LUXX entrará em contato para confirmar a disponibilidade.`,[{text:'Concluir',onPress:()=>router.replace('/')}]);
    } catch(e) {Alert.alert('Não foi possível enviar',e instanceof Error?e.message:'Tente novamente.');}
    finally{setSending(false);}
  }
  return <ScrollView style={{backgroundColor:C.bg}} keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:20,paddingBottom:45}}>
    <Text style={styles.title}>Sinta a experiência LUXX.</Text><Text style={styles.desc}>Escolha o carro, o dia e o horário de preferência. A equipe confirmará o agendamento.</Text>
    {demo&&<DemoAviso/>}
    <Text style={styles.label}>Escolha seu veículo</Text>
    {veiculos.length===0?<Vazio titulo="Sem veículos disponíveis" detalhe="Atualize o catálogo para continuar."/>:
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:18}}>
      {veiculos.filter(x=>!x.status.toLowerCase().includes('vendido')).map(car=><Pressable key={car.id} onPress={()=>setIdVeiculo(car.id)} style={[styles.choice,idVeiculo===car.id&&styles.selected]}><Text style={{color:idVeiculo===car.id?'white':C.text,fontWeight:'800',fontSize:12}}>{car.marca} {car.modelo}</Text></Pressable>)}
    </ScrollView>}
    <Campo rotulo="Data desejada" valor={data} onChange={(valor)=>setData(formatarDataISO(valor))} placeholder="AAAA-MM-DD" keyboardType="numeric" maxLength={10}/>
    <Text style={styles.label}>Horário desejado</Text><View style={styles.hours}>{HORARIOS.map(h=><Pressable key={h} onPress={()=>setHorario(h)} style={[styles.hour,horario===h&&styles.selected]}><Text style={{color:horario===h?'white':C.navy,fontWeight:'800'}}>{h}</Text></Pressable>)}</View>
    <ContatoForm contato={contato} onChange={setContato}/>
    <Botao titulo="Solicitar test-drive" onPress={()=>void enviar()} loading={sending} disabled={demo||!v} icon="checkmark-circle-outline"/>
  </ScrollView>;
}
const styles=StyleSheet.create({title:{fontSize:27,fontWeight:'900',color:C.navy,marginBottom:8},desc:{fontSize:13,color:C.muted,lineHeight:21,marginBottom:20},label:{fontSize:14,fontWeight:'800',color:C.text,marginBottom:10},choice:{borderRadius:9,backgroundColor:'white',padding:12,marginRight:8,borderWidth:1,borderColor:C.border},selected:{backgroundColor:C.navy,borderColor:C.navy},hours:{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:8},hour:{borderRadius:9,backgroundColor:'white',paddingHorizontal:13,paddingVertical:11,borderWidth:1,borderColor:C.border}});
