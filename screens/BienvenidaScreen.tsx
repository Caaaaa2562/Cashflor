import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  onIngresar: (nombre: string) => void;
};

export default function BienvenidaScreen({ onIngresar }: Props) {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificar = async () => {
      const usuarioGuardado = await AsyncStorage.getItem('usuario_registrado');
      if (usuarioGuardado) {
        setModo('login');
      } else {
        setModo('registro');
      }
      setCargando(false);
    };
    verificar();
  }, []);

  const handleRegistro = async () => {
    if (!nombre.trim() || !usuario.trim() || !contrasena.trim() || !confirmar.trim()) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    if (contrasena !== confirmar) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (contrasena.length < 4) {
      Alert.alert('Error', 'La contraseña debe tener al menos 4 caracteres');
      return;
    }
    await AsyncStorage.setItem('usuario_registrado', JSON.stringify({ nombre: nombre.trim(), usuario: usuario.trim().toLowerCase(), contrasena }));
    Alert.alert('¡Listo!', 'Cuenta creada correctamente', [
      { text: 'Ingresar', onPress: () => onIngresar(nombre.trim()) }
    ]);
  };

  const handleLogin = async () => {
    if (!usuario.trim() || !contrasena.trim()) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    const datos = await AsyncStorage.getItem('usuario_registrado');
    if (!datos) {
      Alert.alert('Error', 'No hay ninguna cuenta registrada');
      return;
    }
    const cuenta = JSON.parse(datos);
    if (usuario.trim().toLowerCase() !== cuenta.usuario || contrasena !== cuenta.contrasena) {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
      return;
    }
    onIngresar(cuenta.nombre);
  };

  if (cargando) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <Text style={styles.emoji}>💰</Text>
        <Text style={styles.titulo}>Cashflor</Text>
        <Text style={styles.subtitulo}>Tu asistente financiero personal</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>
            {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </Text>

          {modo === 'registro' && (
            <>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej: Carla Guisande"
                autoCapitalize="words"
              />
            </>
          )}

          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            value={usuario}
            onChangeText={setUsuario}
            placeholder="E-Mail"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputCont}>
            <TextInput
              style={styles.inputPassword}
              value={contrasena}
              onChangeText={setContrasena}
              placeholder="Mínimo 4 caracteres"
              secureTextEntry={!verContrasena}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setVerContrasena(!verContrasena)}>
              <Text style={styles.ojito}>{verContrasena ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {modo === 'registro' && (
            <>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput
                style={styles.input}
                value={confirmar}
                onChangeText={setConfirmar}
                placeholder="Repetí tu contraseña"
                secureTextEntry={!verContrasena}
                autoCapitalize="none"
              />
            </>
          )}

          <TouchableOpacity
            style={styles.btn}
            onPress={modo === 'login' ? handleLogin : handleRegistro}
          >
            <Text style={styles.btnTexto}>
              {modo === 'login' ? 'Ingresar →' : 'Registrarme →'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecundario}
            onPress={() => {
              setUsuario('');
              setContrasena('');
              setNombre('');
              setConfirmar('');
              setModo(modo === 'login' ? 'registro' : 'login');
            }}
          >
            <Text style={styles.btnSecundarioTexto}>
              {modo === 'login' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Tomá el control de tus finanzas</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2d6a4f' },
  contenido: {
    flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  emoji: { fontSize: 64, marginBottom: 12 },
  titulo: { fontSize: 42, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  subtitulo: { fontSize: 15, color: '#b7e4c7', marginBottom: 40, textAlign: 'center' },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 5,
  },
  cardTitulo: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    padding: 14, fontSize: 15, backgroundColor: '#fafafa',
  },
  inputCont: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    backgroundColor: '#fafafa', paddingRight: 12,
  },
  inputPassword: { flex: 1, padding: 14, fontSize: 15 },
  ojito: { fontSize: 20 },
  btn: {
    backgroundColor: '#2d6a4f', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 24,
  },
  btnTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnSecundario: { alignItems: 'center', marginTop: 16, padding: 8 },
  btnSecundarioTexto: { color: '#2d6a4f', fontSize: 13, fontWeight: '600' },
  footer: { color: '#b7e4c7', marginTop: 32, fontSize: 13 },
});