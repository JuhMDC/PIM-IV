import React from 'react';
import { Text, View } from 'react-native';
import { Campo } from './Common';
import type { Contato } from '../types';
import { cpfValido, dataISOValida, onlyDigits, formatarDataISO } from '../lib/utils';
import { C } from '../theme';

export const contatoInicial: Contato = { nome:'', email:'', telefone:'', cpf:'', dataNascimento:'' };
export function validarContato(c: Contato): string | null {
  if (c.nome.trim().length < 3) return 'Informe seu nome completo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) return 'Informe um e-mail válido.';
  if (onlyDigits(c.telefone).length < 10) return 'Informe um telefone com DDD.';
  if (!cpfValido(c.cpf)) return 'Informe um CPF válido.';
  if (!dataISOValida(c.dataNascimento)) return 'Informe a data de nascimento no formato AAAA-MM-DD.';
  if (c.dataNascimento >= new Date().toISOString().slice(0,10)) return 'A data de nascimento deve ser anterior a hoje.';
  return null;
}
export function ContatoForm({ contato, onChange }: {contato: Contato; onChange:(c: Contato)=>void}) {
  const upd = (key:keyof Contato) => (v:string) => onChange({...contato, [key]:v});
  return <View>
    <Text style={{fontSize:17, fontWeight:'800', color:C.navy, marginVertical:16}}>Seus dados para contato</Text>
    <Campo rotulo="Nome completo" valor={contato.nome} onChange={upd('nome')} placeholder="Seu nome" />
    <Campo rotulo="E-mail" valor={contato.email} onChange={upd('email')} keyboardType="email-address" placeholder="voce@email.com" />
    <Campo rotulo="Celular com DDD" valor={contato.telefone} onChange={upd('telefone')} keyboardType="phone-pad" placeholder="(11) 99999-9999" maxLength={20} />
    <Campo rotulo="CPF" valor={contato.cpf} onChange={upd('cpf')} keyboardType="numeric" placeholder="000.000.000-00" maxLength={14} />
    <Campo rotulo="Data de nascimento" valor={contato.dataNascimento} onChange={(valor)=>upd('dataNascimento')(formatarDataISO(valor))} keyboardType="numeric" placeholder="AAAA-MM-DD" maxLength={10} />
    <Text style={{fontSize:12, color:C.muted, marginBottom:18, lineHeight:18}}>Ao enviar, seus dados serão usados para responder a esta solicitação e registrados no banco da concessionária. Utilize somente uma conexão HTTPS em produção.</Text>
  </View>;
}
