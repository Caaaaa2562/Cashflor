import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TipoMovimiento = 'ingreso' | 'gasto';
export type Frecuencia = 'fijo' | 'variable';

export type Movimiento = {
  id: string;
  descripcion: string;
  monto: number;
  tipo: TipoMovimiento;
  frecuencia: Frecuencia;
  fecha: string;
};

type FinanzasContextType = {
  movimientos: Movimiento[];
  agregarMovimiento: (m: Omit<Movimiento, 'id'>) => void;
  editarMovimiento: (id: string, m: Omit<Movimiento, 'id'>) => void;
  eliminarMovimiento: (id: string) => void;
};

const FinanzasContext = createContext<FinanzasContextType | null>(null);

export function FinanzasProvider({ children }: { children: React.ReactNode }) {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  useEffect(() => {
    const cargar = async () => {
      const datos = await AsyncStorage.getItem('movimientos');
      if (datos) setMovimientos(JSON.parse(datos));
    };
    cargar();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('movimientos', JSON.stringify(movimientos));
  }, [movimientos]);

  const agregarMovimiento = (m: Omit<Movimiento, 'id'>) => {
    const nuevo: Movimiento = { ...m, id: Date.now().toString() };
    setMovimientos(prev => [...prev, nuevo]);
  };

  const editarMovimiento = (id: string, m: Omit<Movimiento, 'id'>) => {
    setMovimientos(prev =>
      prev.map(mov => (mov.id === id ? { ...m, id } : mov))
    );
  };

  const eliminarMovimiento = (id: string) => {
    setMovimientos(prev => prev.filter(mov => mov.id !== id));
  };

  return (
    <FinanzasContext.Provider value={{ movimientos, agregarMovimiento, editarMovimiento, eliminarMovimiento }}>
      {children}
    </FinanzasContext.Provider>
  );
}

export function useFinanzas() {
  const context = useContext(FinanzasContext);
  if (!context) throw new Error('useFinanzas debe usarse dentro de FinanzasProvider');
  return context;
}