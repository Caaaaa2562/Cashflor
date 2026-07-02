import { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, Alert, Modal,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useFinanzas, Movimiento, TipoMovimiento, Frecuencia } from '../context/FinanzasContext';

export default function MovimientosScreen() {
  const { movimientos, agregarMovimiento, editarMovimiento, eliminarMovimiento } = useFinanzas();

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Movimiento | null>(null);

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState<TipoMovimiento>('ingreso');
  const [frecuencia, setFrecuencia] = useState<Frecuencia>('fijo');

  const abrirModalNuevo = () => {
    setEditando(null);
    setDescripcion('');
    setMonto('');
    setTipo('ingreso');
    setFrecuencia('fijo');
    setModalVisible(true);
  };

  const abrirModalEditar = (mov: Movimiento) => {
    setEditando(mov);
    setDescripcion(mov.descripcion);
    setMonto(mov.monto.toString());
    setTipo(mov.tipo);
    setFrecuencia(mov.frecuencia);
    setModalVisible(true);
  };

  const guardar = () => {
    if (!descripcion.trim()) {
      Alert.alert('Error', 'La descripción no puede estar vacía');
      return;
    }
    if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
      Alert.alert('Error', 'El monto debe ser un número mayor a cero');
      return;
    }
    const datos = {
      descripcion: descripcion.trim(),
      monto: Number(monto),
      tipo,
      frecuencia,
      fecha: new Date().toLocaleDateString('es-AR'),
    };
    if (editando) {
      editarMovimiento(editando.id, datos);
    } else {
      agregarMovimiento(datos);
    }
    setModalVisible(false);
  };

  const confirmarEliminar = (id: string) => {
    Alert.alert(
      'Eliminar movimiento',
      '¿Estás segura de que querés eliminarlo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminarMovimiento(id) },
      ]
    );
  };

  const renderItem = ({ item }: { item: Movimiento }) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemDescripcion}>{item.descripcion}</Text>
        <Text style={styles.itemDetalle}>
          {item.frecuencia === 'fijo' ? '🔒 Fijo' : '🔄 Variable'} · {item.fecha}
        </Text>
      </View>
      <Text style={[styles.itemMonto, { color: item.tipo === 'ingreso' ? '#2d6a4f' : '#e63946' }]}>
        {item.tipo === 'ingreso' ? '+' : '-'}${item.monto.toLocaleString('es-AR')}
      </Text>
      <View style={styles.itemBotones}>
        <TouchableOpacity onPress={() => abrirModalEditar(item)} style={styles.btnEditar}>
          <Text style={styles.btnEditarTexto}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmarEliminar(item.id)} style={styles.btnEliminar}>
          <Text style={styles.btnEliminarTexto}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={movimientos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay movimientos aún.{'\n'}Tocá + para agregar uno.</Text>
        }
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      />

      <TouchableOpacity style={styles.fab} onPress={abrirModalNuevo}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
  >
    <View style={styles.modalContenido}>
      <Text style={styles.modalTitulo}>
        {editando ? 'Editar movimiento' : 'Nuevo movimiento'}
      </Text>

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Ej: Sueldo, Alquiler, Supermercado..."
      />

      <Text style={styles.label}>Monto ($)</Text>
      <TextInput
        style={styles.input}
        value={monto}
        onChangeText={setMonto}
        placeholder="Ej: 50000"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.opciones}>
        <TouchableOpacity
          style={[styles.opcion, tipo === 'ingreso' && styles.opcionActiva]}
          onPress={() => setTipo('ingreso')}
        >
          <Text style={[styles.opcionTexto, tipo === 'ingreso' && styles.opcionTextoActivo]}>
            💰 Ingreso
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.opcion, tipo === 'gasto' && styles.opcionActivaRoja]}
          onPress={() => setTipo('gasto')}
        >
          <Text style={[styles.opcionTexto, tipo === 'gasto' && styles.opcionTextoActivo]}>
            💸 Gasto
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Frecuencia</Text>
      <View style={styles.opciones}>
        <TouchableOpacity
          style={[styles.opcion, frecuencia === 'fijo' && styles.opcionActiva]}
          onPress={() => setFrecuencia('fijo')}
        >
          <Text style={[styles.opcionTexto, frecuencia === 'fijo' && styles.opcionTextoActivo]}>
            🔒 Fijo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.opcion, frecuencia === 'variable' && styles.opcionActiva]}
          onPress={() => setFrecuencia('variable')}
        >
          <Text style={[styles.opcionTexto, frecuencia === 'variable' && styles.opcionTextoActivo]}>
            🔄 Variable
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.modalBotones}>
        <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
          <Text style={styles.btnCancelarTexto}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGuardar} onPress={guardar}>
          <Text style={styles.btnGuardarTexto}>Guardar</Text>
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
  vacio: { textAlign: 'center', color: '#999', marginTop: 60, fontSize: 16, lineHeight: 26 },
  item: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 10, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  itemInfo: { flex: 1 },
  itemDescripcion: { fontSize: 15, fontWeight: '600', color: '#333' },
  itemDetalle: { fontSize: 12, color: '#999', marginTop: 2 },
  itemMonto: { fontSize: 15, fontWeight: 'bold', marginHorizontal: 8 },
  itemBotones: { flexDirection: 'row', gap: 6 },
  btnEditar: { padding: 6 },
  btnEditarTexto: { fontSize: 18 },
  btnEliminar: { padding: 6 },
  btnEliminarTexto: { fontSize: 18 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#2d6a4f', width: 56, height: 56,
    borderRadius: 28, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
  fabTexto: { color: '#fff', fontSize: 32, lineHeight: 36 },
  
 modalContenido: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: 24,
  paddingBottom: 40,
},
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 4, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
    padding: 12, fontSize: 15, backgroundColor: '#fafafa',
  },
  opciones: { flexDirection: 'row', gap: 10 },
  opcion: {
    flex: 1, padding: 10, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  opcionActiva: { backgroundColor: '#2d6a4f', borderColor: '#2d6a4f' },
  opcionActivaRoja: { backgroundColor: '#e63946', borderColor: '#e63946' },
  opcionTexto: { fontSize: 14, color: '#666' },
  opcionTextoActivo: { color: '#fff', fontWeight: '600' },
  modalBotones: { flexDirection: 'row', gap: 10, marginTop: 24 },
  btnCancelar: {
    flex: 1, padding: 14, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  btnCancelarTexto: { color: '#666', fontWeight: '600' },
  btnGuardar: {
    flex: 1, padding: 14, borderRadius: 10,
    backgroundColor: '#2d6a4f', alignItems: 'center',
  },
  btnGuardarTexto: { color: '#fff', fontWeight: '600' },
});