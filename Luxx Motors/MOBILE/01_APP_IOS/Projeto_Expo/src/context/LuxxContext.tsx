import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';
import { PREVIEW } from '../data/vehicles';
import type { Veiculo } from '../types';

type LuxxState = {
  veiculos: Veiculo[];
  demo: boolean;
  erro: string | null;
  loading: boolean;
  atualizar: () => Promise<void>;
  favoritos: number[];
  alternarFavorito: (id: number) => void;
};
const Ctx = createContext<LuxxState | null>(null);
const STORAGE = '@luxx:favoritos-v1';

export function LuxxProvider({ children }: { children: React.ReactNode }) {
  const [veiculos, setVeiculos] = useState<Veiculo[]>(PREVIEW);
  const [demo, setDemo] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState<number[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE).then(s => {
      if (s) { const ids = JSON.parse(s); if (Array.isArray(ids)) setFavoritos(ids.filter(Number.isInteger)); }
    }).catch(() => {});
  }, []);

  const atualizar = useCallback(async () => {
    setLoading(true);
    try {
      const novos = await api.veiculos();
      setVeiculos(novos);
      setDemo(false);
      setErro(null);
    } catch (e) {
      setVeiculos(PREVIEW);
      setDemo(true);
      setErro(e instanceof Error ? e.message : 'Não foi possível acessar a API.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void atualizar(); }, [atualizar]);

  const alternarFavorito = useCallback((id: number) => {
    setFavoritos(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      void AsyncStorage.setItem(STORAGE, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(() => ({ veiculos, demo, erro, loading, atualizar, favoritos, alternarFavorito }), [veiculos, demo, erro, loading, atualizar, favoritos, alternarFavorito]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useLuxx = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('LuxxProvider ausente.');
  return ctx;
};
