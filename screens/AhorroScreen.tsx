import { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, Alert, Modal,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { useFinanzas } from '../context/FinanzasContext';

type Meta = {
  id: string;
  nombre: string;
  objetivo: number;
  actual: number;
};

export default function AhorroScreen() {
  const { movimientos } = useFinanzas();
  const [metas, setMetas] = useState<Meta[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeposito, setModalDeposito] = useState(false);
  const [metaSeleccionada, setMetaSeleccionada] = useState<Meta | null>(null);
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [deposito, setDeposito] = useState('');

  const totalIngresos = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((a, m) => a + m.monto, 0);

  const totalGastos = movimientos
    .filter(m => m.tipo === 'gasto')
    .reduce((a, m) => a + m.monto, 0);

  const balance = totalIngresos - totalGastos;

  const totalAhorrado = metas.reduce((a, m) => a + m.actual, 0);
  const disponible = balance - totalAhorrado;

  const formatear = (n: number) =>
    n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  const agregarMeta = () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    if (!objetivo || isNaN(Number(objetivo)) || Number(objetivo) <= 0) {
      Alert.alert('Error', 'El objetivo debe ser un número mayor a cero');
      return;
    }
    const nueva: Meta = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      objetivo: Number(objetivo),
      actual: 0,
    };
    setMetas(prev => [...prev, nueva]);
    setNombre('');
    setObjetivo('');
    setModalVisible(false);
  };

  const abrirDeposito = (meta: Meta) => {
    setMetaSeleccionada(meta);
    setDeposito('');
    setModalDeposito(true);
  };

  const hacerDeposito = () => {
    if (!deposito || isNaN(Number(deposito)) || Number(deposito) <= 0) {
      Alert.alert('Error', 'Ingresá un monto válido');
      return;
    }
    const monto = Number(deposito);
    if (monto > disponible) {
      Alert.alert('Error', `No tenés suficiente saldo disponible. Máximo: ${formatear(disponible)}`);
      return;
    }
    setMetas(prev => prev.map(m =>
      m.id === metaSeleccionada?.id
        ? { ...m, actual: Math.min(m.actual + monto, m.objetivo) }
        : m
    ));
    setModalDeposito(false);
  };

  const eliminarMeta = (id: string) => {
    Alert.alert(
      'Eliminar meta',
      '¿Querés eliminar esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => setMetas(prev => prev.filter(m => m.id !== id)) },
      ]
    );
  };

  const renderMeta = ({ item }: { item: Meta }) => {
    const porcentaje = Math.min(Math.round((item.actual / item.objetivo) * 100), 100);
    const completada = porcentaje >= 100;

    return (
      <View style={styles.metaCard}>
        <View style={styles.metaHeader}>
          <Text style={styles.metaNombre}>{completada ? '✅' : '🎯'} {item.nombre}</Text>
          <TouchableOpacity onPress={() => eliminarMeta(item.id)}>
            <Text style={{ fontSize: 18 }}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.barraCont}>
          <View style={[styles.barra, {
            width: `${porcentaje}%`,
            backgroundColor: completada ? '#2d6a4f' : '#4361ee'
          }]} />
        </View>

        <View style={styles.metaInfo}>
          <Text style={styles.metaProgreso}>{formatear(item.actual)} / {formatear(item.objetivo)}</Text>
          <Text style={styles.metaPorcentaje}>{porcentaje}%</Text>
        </View>

        {completada ? (
          <Text style={styles.metaCompletada}>¡Meta alcanzada! 🎉</Text>
        ) : (
          <TouchableOpacity style={styles.btnDeposito} onPress={() => abrirDeposito(item)}>
            <Text style={styles.btnDepositoTexto}>+ Depositar dinero</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.resumenCont}>
        <View style={styles.resumenItem}>
          <Text style={styles.resumenLabel}>Saldo disponible</Text>
          <Text style={[styles.resumenMonto, { color: disponible >= 0 ? '#2d6a4f' : '#e63946' }]}>
            {formatear(disponible)}
          </Text>
        </View>
        <View style={styles.separador} />
        <View style={styles.resumenItem}>
          <Text style={styles.resumenLabel}>Total ahorrado</Text>
          <Text style={[styles.resumenMonto, { color: '#4361ee' }]}>
            {formatear(totalAhorrado)}
          </Text>
        </View>
      </View>

      <FlatList
        data={metas}
        keyExtractor={item => item.id}
        renderItem={renderMeta}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListHeaderComponent={
          metas.length > 0
            ? <Text style={styles.listaTitulo}>Tus metas de ahorro</Text>
            : null
        }
        ListEmptyComponent={
          <Text style={styles.vacio}>No tenés metas aún.{'\n'}Tocá + para crear una.</Text>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      {/* Modal nueva meta */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Nueva meta de ahorro</Text>

            <Text style={styles.label}>¿Para qué querés ahorrar?</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: Viaje, Auto, Fondo de emergencia..."
            />

            <Text style={styles.label}>¿Cuánto necesitás?</Text>
            <TextInput
              style={styles.input}
              value={objetivo}
              onChangeText={setObjetivo}
              placeholder="Ej: 500000"
              keyboardType="numeric"
            />

            <View style={styles.modalBotones}>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardar} onPress={agregarMeta}>
                <Text style={styles.btnGuardarTexto}>Crear meta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal depositar */}
      <Modal visible={modalDeposito} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>💰 Depositar en "{metaSeleccionada?.nombre}"</Text>
            <Text style={styles.disponibleTexto}>
              Saldo disponible: {formatear(disponible)}
            </Text>

            <Text style={styles.label}>¿Cuánto querés depositar?</Text>
            <TextInput
              style={styles.input}
              value={deposito}
              onChangeText={setDeposito}
              placeholder="Ej: 50000"
              keyboardType="numeric"
              autoFocus
            />

            <View style={styles.modalBotones}>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalDeposito(false)}>
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardar} onPress={hacerDeposito}>
                <Text style={styles.btnGuardarTexto}>Depositar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  resumenCont: {
    backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  resumenItem: { flex: 1, alignItems: 'center' },
  resumenLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  resumenMonto: { fontSize: 18, fontWeight: 'bold' },
  separador: { width: 1, height: 40, backgroundColor: '#eee' },
  listaTitulo: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  metaCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  metaHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  metaNombre: { fontSize: 15, fontWeight: '600', color: '#333' },
  barraCont: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginBottom: 8 },
  barra: { height: 8, borderRadius: 4 },
  metaInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  metaProgreso: { fontSize: 12, color: '#666' },
  metaPorcentaje: { fontSize: 12, fontWeight: '700', color: '#333' },
  metaCompletada: { fontSize: 13, color: '#2d6a4f', fontWeight: '600', textAlign: 'center' },
  btnDeposito: {
    backgroundColor: '#eef2ff', borderRadius: 10,
    padding: 10, alignItems: 'center',
  },
  btnDepositoTexto: { color: '#4361ee', fontWeight: '600', fontSize: 13 },
  vacio: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16, lineHeight: 26 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#4361ee', width: 56, height: 56,
    borderRadius: 28, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
  fabTexto: { color: '#fff', fontSize: 32, lineHeight: 36 },
  modalContenido: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  disponibleTexto: { fontSize: 13, color: '#2d6a4f', fontWeight: '600', marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 4, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
    padding: 12, fontSize: 15, backgroundColor: '#fafafa',
  },
  modalBotones: { flexDirection: 'row', gap: 10, marginTop: 24 },
  btnCancelar: {
    flex: 1, padding: 14, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  btnCancelarTexto: { color: '#666', fontWeight: '600' },
  btnGuardar: {
    flex: 1, padding: 14, borderRadius: 10,
    backgroundColor: '#4361ee', alignItems: 'center',
  },
  btnGuardarTexto: { color: '#fff', fontWeight: '600' },
});