import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, DefaultTheme } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NewJourney from './screens/NewJourney.js';
import MyJourneys from './screens/MyJourneys.js';

const App = () => {

  const Tab = createBottomTabNavigator();


  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Mine Reiser') {
              iconName = 'bus';
            }
            else if (route.name === 'Ny Reise') {
              iconName = 'plus';
            }
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#a2ad00',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Mine Reiser" component={MyJourneys} />
        <Tab.Screen name="Ny Reise" component={NewJourney} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};


export default App;
