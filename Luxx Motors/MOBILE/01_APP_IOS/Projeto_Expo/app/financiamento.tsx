import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useLuxx } from '../src/context/LuxxContext';
import { api } from '../src/lib/api';
import { brl, onlyDigits, parcelaPrice } from '../src/lib/utils';
import { C } from '../src/theme';
import { Campo, Botao, DemoAviso } from '../src/components/Common';
import { ContatoForm, contatoInicial, validarContato } from '../src/components/ContatoForm';

export default function Financiamento(){
  const {id}=useLocalSearchParams<{id?:string}>();
  const {veiculos,demo}=useLuxx();
  const [idVeiculo,setIdVeiculo]=useState(Number(id)||0);
  const [entrada,setEntrada]=useState('');
  const [parcelas,setParcelas]=useState(48);
  const [taxa,setTaxa]=useState('1.5');
  const [contato,setContato]=useState(contatoInicial);
  const [sending,setSending]=useState(false);
  const v=veiculos.find(x=>x.id===idVeiculo);
  const valorEntrada=Number(entrada.replace(',','.'))||0;
  const taxaMes=Number(taxa.replace(',','.'));
  const prestacao=useMemo(()=>parcelaPrice(v?.preco||0,valorEntrada,taxaMes,parcelas),[v,valorEntrada,taxaMes,parcelas]);
  const precoDisponivel=!!v?.preco&&v.preco>0;
  const calculavel=precoDisponivel&&Number.isFinite(taxaMes)&&taxaMes>=0&&taxaMes<=10&&valorEntrada>=0&&valorEntrada<(v?.preco||0);
  async function enviar(){
    if(demo||!v||!calculavel) return Alert.alert('Simulação indisponível','Selecione um veículo com preço válido e revise a entrada e a taxa.');
    const erro=validarContato(contato);
    if(erro) return Alert.alert('Verifique seus dados',erro);
    setSending(true);
    try {
      const resp=await api.proposta({...contato,cpf:onlyDigits(contato.cpf),telefone:onlyDigits(contato.telefone),idVeiculo:v.id,entrada:valorEntrada,parcelas,taxaMensal:taxaMes});
      Alert.alert('Proposta recebida',`Protocolo #${resp.protocolo}. Nossa equipe entrará em contato com você.`,[{text:'Concluir',onPress:()=>router.replace('/')}]);
    }catch(e){Alert.alert('Erro ao enviar',e instanceof Error?e.message:'Tente novamente.');}
    finally{setSending(false);}
  }
  return <ScrollView style={{backgroundColor:C.bg}} contentContainerStyle={{padding:20,paddingBottom:45}} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>Seu carro, seu plano.</Text><Text style={styles.desc}>Faça uma estimativa de parcelas. Não constitui oferta de crédito ou aprovação.</Text>
    {demo&&<DemoAviso/>}
    <Text style={styles.label}>Selecione o veículo</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>{veiculos.map(car=><Pressable key={car.id} onPress={()=>setIdVeiculo(car.id)} style={[styles.chip,idVeiculo===car.id&&styles.active]}><Text style={{color:idVeiculo===car.id?'white':C.navy,fontSize:12,fontWeight:'800'}}>{car.marca} {car.modelo}</Text></Pressable>)}</ScrollView>
    {v&&<View style={styles.priceBox}><Text style={{color:C.muted}}>Valor do veículo</Text><Text style={{fontSize:24,fontWeight:'900',color:C.navy}}>{brl(v.preco)}</Text></View>}
    <Campo rotulo="Valor de entrada (R$)" valor={entrada} onChange={setEntrada} placeholder="Exemplo: 20000" keyboardType="decimal-pad"/>
    <Text style={styles.label}>Número de parcelas</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:15}}>{[12,24,36,48,60].map(p=><Pressable key={p} onPress={()=>setParcelas(p)} style={[styles.chip,parcelas===p&&styles.active]}><Text style={{color:parcelas===p?'white':C.navy,fontWeight:'800'}}>{p}x</Text></Pressable>)}</View>
    <Campo rotulo="Juros estimados ao mês (%)" valor={taxa} onChange={setTaxa} keyboardType="decimal-pad" placeholder="1,5" />
    <View style={styles.total}><Text style={{color:'#D8E3F2',fontSize:13}}>Parcela mensal estimada</Text><Text style={{fontWeight:'900',color:'white',fontSize:30,marginTop:5}}>{calculavel?brl(prestacao):'Indisponível'}</Text><Text style={{fontSize:11,color:'#D8E3F2',marginTop:7}}>Sistema Price. Taxas reais, IOF e CET podem alterar o valor final.</Text></View>
    {!demo&&calculavel&&<ContatoForm contato={contato} onChange={setContato}/>}
    <Botao titulo="Enviar proposta" onPress={()=>void enviar()} loading={sending} disabled={demo||!calculavel} icon="send-outline"/>
  </ScrollView>;
}
const styles=StyleSheet.create({title:{fontSize:28,fontWeight:'900',color:C.navy,marginBottom:7},desc:{fontSize:13,color:C.muted,lineHeight:21,marginBottom:20},label:{fontWeight:'800',fontSize:14,color:C.text,marginBottom:9},chip:{backgroundColor:'white',borderWidth:1,borderColor:C.border,borderRadius:10,paddingVertical:11,paddingHorizontal:13,marginRight:6},active:{backgroundColor:C.navy,borderColor:C.navy},priceBox:{backgroundColor:'white',borderRadius:14,padding:17,marginBottom:18},total:{backgroundColor:C.navy,borderRadius:16,padding:22,marginBottom:20}});
