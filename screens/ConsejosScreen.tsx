import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFinanzas } from '../context/FinanzasContext';

type Consejo = {
  id: string;
  icono: string;
  titulo: string;
  descripcion: string;
  color: string;
};

export default function ConsejosScreen() {
  const { movimientos } = useFinanzas();

  const totalIngresos = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((acc, m) => acc + m.monto, 0);

  const totalGastos = movimientos
    .filter(m => m.tipo === 'gasto')
    .reduce((acc, m) => acc + m.monto, 0);

  const balance = totalIngresos - totalGastos;
  const porcentajeAhorro = totalIngresos > 0 ? (balance / totalIngresos) * 100 : 0;
  const gastosVariables = movimientos
    .filter(m => m.tipo === 'gasto' && m.frecuencia === 'variable')
    .reduce((acc, m) => acc + m.monto, 0);

  const consejos: Consejo[] = [];

  if (movimientos.length === 0) {
    consejos.push({
      id: '1',
      icono: '👋',
      titulo: 'Bienvenida a Cashflor',
      descripcion: 'Empezá agregando tus ingresos y gastos en la sección Movimientos para recibir consejos personalizados.',
      color: '#2d6a4f',
    });
  } else {
    if (balance < 0) {
      consejos.push({
        id: '2',
        icono: '🚨',
        titulo: 'Estás gastando más de lo que ganás',
        descripcion: `Tu déficit actual es de $${Math.abs(balance).toLocaleString('es-AR')}. Revisá tus gastos variables y evaluá cuáles podés reducir esta semana.`,
        color: '#e63946',
      });
    }

    if (porcentajeAhorro >= 20) {
      consejos.push({
        id: '3',
        icono: '🌟',
        titulo: '¡Excelente capacidad de ahorro!',
        descripcion: `Estás ahorrando el ${Math.round(porcentajeAhorro)}% de tus ingresos. La regla 50/30/20 recomienda ahorrar al menos el 20%. ¡Lo estás cumpliendo!`,
        color: '#2d6a4f',
      });
    } else if (porcentajeAhorro > 0) {
      consejos.push({
        id: '4',
        icono: '💡',
        titulo: 'Podés mejorar tu ahorro',
        descripcion: `Actualmente ahorrás el ${Math.round(porcentajeAhorro)}% de tus ingresos. Intentá llegar al 20% reduciendo gastos variables.`,
        color: '#f4a261',
      });
    }

    if (gastosVariables > totalIngresos * 0.4) {
      consejos.push({
        id: '5',
        icono: '⚠️',
        titulo: 'Tus gastos variables son altos',
        descripcion: 'Tus gastos variables superan el 40% de tus ingresos. Revisá en qué estás gastando y si podés recortar algo.',
        color: '#f4a261',
      });
    }

    if (totalIngresos > 0 && balance > 0) {
      consejos.push({
        id: '6',
        icono: '🐷',
        titulo: 'Reserva de emergencia',
        descripcion: 'Con tu saldo positivo, considerá armar un fondo de emergencia equivalente a 3 meses de tus gastos fijos.',
        color: '#2d6a4f',
      });
    }

    consejos.push({
      id: '7',
      icono: '📅',
      titulo: 'Regla 50/30/20',
      descripcion: '50% de tus ingresos para necesidades (gastos fijos), 30% para deseos (gastos variables) y 20% para ahorro e inversión.',
      color: '#4361ee',
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      <Text style={styles.titulo}>Consejos financieros</Text>
      <Text style={styles.subtitulo}>Basados en tu situación actual</Text>

      {consejos.map(consejo => (
        <View key={consejo.id} style={[styles.card, { borderLeftColor: consejo.color }]}>
          <Text style={styles.cardIcono}>{consejo.icono}</Text>
          <View style={styles.cardTexto}>
            <Text style={[styles.cardTitulo, { color: consejo.color }]}>{consejo.titulo}</Text>
            <Text style={styles.cardDescripcion}>{consejo.descripcion}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contenido: { padding: 20, paddingBottom: 40 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  subtitulo: { fontSize: 13, color: '#999', marginBottom: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, borderLeftWidth: 4, flexDirection: 'row',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardIcono: { fontSize: 28, marginRight: 12, marginTop: 2 },
  cardTexto: { flex: 1 },
  cardTitulo: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardDescripcion: { fontSize: 13, color: '#666', lineHeight: 20 },
});