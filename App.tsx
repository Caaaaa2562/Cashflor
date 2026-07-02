import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import DashboardScreen from './screens/DashboardScreen';
import MovimientosScreen from './screens/MovimientosScreen';
import AhorroScreen from './screens/AhorroScreen';
import ConsejosScreen from './screens/ConsejosScreen';
import BienvenidaScreen from './screens/BienvenidaScreen';
import { FinanzasProvider } from './context/FinanzasContext';

const Tab = createBottomTabNavigator();

export default function App() {
  const [usuario, setUsuario] = useState<string | null>(null);

  if (!usuario) {
    return <BienvenidaScreen onIngresar={(nombre) => setUsuario(nombre)} />;
  }

  return (
    <FinanzasProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#2d6a4f',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e0e0e0' },
            headerStyle: { backgroundColor: '#2d6a4f' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Tab.Screen
            name="Dashboard"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
            }}
          >
          {() => <DashboardScreen usuario={usuario} />}
          </Tab.Screen>
          <Tab.Screen
            name="Movimientos"
            component={MovimientosScreen}
            options={{
              title: 'Movimientos',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
            }}
          />
          <Tab.Screen
            name="Ahorro"
            component={AhorroScreen}
            options={{
              title: 'Ahorro',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🐷</Text>,
            }}
          />
          <Tab.Screen
            name="Consejos"
            component={ConsejosScreen}
            options={{
              title: 'Consejos',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💡</Text>,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </FinanzasProvider>
  );
}