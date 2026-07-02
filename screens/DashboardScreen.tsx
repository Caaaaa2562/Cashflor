import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFinanzas } from '../context/FinanzasContext';

export default function DashboardScreen({ usuario }: { usuario: string }) {
  const { movimientos } = useFinanzas();

  const totalIngresos = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((acc, m) => acc + m.monto, 0);

  const totalGastos = movimientos
    .filter(m => m.tipo === 'gasto')
    .reduce((acc, m) => acc + m.monto, 0);

  const balance = totalIngresos - totalGastos;

  const porcentajeAhorro = totalIngresos > 0
    ? Math.round(((balance) / totalIngresos) * 100)
    : 0;

  const formatear = (n: number) =>
    n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  const getEstadoColor = () => {
    if (balance > 0) return '#2d6a4f';
    if (balance === 0) return '#f4a261';
    return '#e63946';
  };

  const getEstadoMensaje = () => {
    if (movimientos.length === 0) return '👋 Agregá movimientos para ver tu resumen';
    if (balance > 0) return '✅ Vas bien, tenés saldo positivo';
    if (balance === 0) return '⚠️ Tus ingresos y gastos están empatados';
    return '🚨 Cuidado, estás gastando más de lo que ganás';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      <Text style={styles.saludo}>👋 Hola, {usuario}</Text>
      <Text style={styles.subtitulo}>Este es tu resumen financiero</Text>

      <View style={[styles.balanceCard, { borderLeftColor: getEstadoColor() }]}>
        <Text style={styles.balanceLabel}>Balance actual</Text>
        <Text style={[styles.balanceMonto, { color: getEstadoColor() }]}>
          {formatear(balance)}
        </Text>
        <Text style={styles.balanceEstado}>{getEstadoMensaje()}</Text>
      </View>

      <View style={styles.fila}>
        <View style={[styles.tarjeta, styles.tarjetaVerde]}>
          <Text style={styles.tarjetaIcono}>📈</Text>
          <Text style={styles.tarjetaLabel}>Ingresos</Text>
          <Text style={styles.tarjetaMonto}>{formatear(totalIngresos)}</Text>
        </View>
        <View style={[styles.tarjeta, styles.tarjetaRoja]}>
          <Text style={styles.tarjetaIcono}>📉</Text>
          <Text style={styles.tarjetaLabel}>Gastos</Text>
          <Text style={styles.tarjetaMonto}>{formatear(totalGastos)}</Text>
        </View>
      </View>

      <View style={styles.ahorroCard}>
        <Text style={styles.ahorroTitulo}>🐷 Capacidad de ahorro</Text>
        <View style={styles.barraCont}>
          <View style={[styles.barra, { width: `${Math.max(0, Math.min(porcentajeAhorro, 100))}%` }]} />
        </View>
        <Text style={styles.ahorroTexto}>
          {porcentajeAhorro > 0
            ? `Podés ahorrar el ${porcentajeAhorro}% de tus ingresos`
            : 'Sin capacidad de ahorro por el momento'}
        </Text>
      </View>

      <View style={styles.resumenCont}>
        <Text style={styles.resumenTitulo}>📊 Desglose</Text>
        <View style={styles.resumenFila}>
          <Text style={styles.resumenLabel}>Ingresos fijos</Text>
          <Text style={styles.resumenValorVerde}>
            {formatear(movimientos.filter(m => m.tipo === 'ingreso' && m.frecuencia === 'fijo').reduce((a, m) => a + m.monto, 0))}
          </Text>
        </View>
        <View style={styles.resumenFila}>
          <Text style={styles.resumenLabel}>Ingresos variables</Text>
          <Text style={styles.resumenValorVerde}>
            {formatear(movimientos.filter(m => m.tipo === 'ingreso' && m.frecuencia === 'variable').reduce((a, m) => a + m.monto, 0))}
          </Text>
        </View>
        <View style={styles.resumenFila}>
          <Text style={styles.resumenLabel}>Gastos fijos</Text>
          <Text style={styles.resumenValorRojo}>
            {formatear(movimientos.filter(m => m.tipo === 'gasto' && m.frecuencia === 'fijo').reduce((a, m) => a + m.monto, 0))}
          </Text>
        </View>
        <View style={styles.resumenFila}>
          <Text style={styles.resumenLabel}>Gastos variables</Text>
          <Text style={styles.resumenValorRojo}>
            {formatear(movimientos.filter(m => m.tipo === 'gasto' && m.frecuencia === 'variable').reduce((a, m) => a + m.monto, 0))}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contenido: { padding: 20, paddingBottom: 40 },
  saludo: { fontSize: 28, fontWeight: 'bold', color: '#2d6a4f' },
  subtitulo: { fontSize: 14, color: '#999', marginBottom: 20 },
  balanceCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    marginBottom: 16, borderLeftWidth: 5,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  balanceLabel: { fontSize: 13, color: '#999', marginBottom: 4 },
  balanceMonto: { fontSize: 36, fontWeight: 'bold', marginBottom: 6 },
  balanceEstado: { fontSize: 13, color: '#666' },
  fila: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  tarjeta: {
    flex: 1, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  tarjetaVerde: { backgroundColor: '#d8f3dc' },
  tarjetaRoja: { backgroundColor: '#ffe5e7' },
  tarjetaIcono: { fontSize: 24, marginBottom: 6 },
  tarjetaLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  tarjetaMonto: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  ahorroCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  ahorroTitulo: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 12 },
  barraCont: {
    height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, marginBottom: 8,
  },
  barra: { height: 10, backgroundColor: '#2d6a4f', borderRadius: 5 },
  ahorroTexto: { fontSize: 13, color: '#666' },
  resumenCont: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  resumenTitulo: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 12 },
  resumenFila: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  resumenLabel: { fontSize: 14, color: '#666' },
  resumenValorVerde: { fontSize: 14, fontWeight: '600', color: '#2d6a4f' },
  resumenValorRojo: { fontSize: 14, fontWeight: '600', color: '#e63946' },
});