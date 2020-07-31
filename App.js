import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NewJourney from './screens/NewJourney.js';
import MyJourneys from './screens/MyJourneys.js';

import NewJourneyDetails from './screens/NewJourneyDetails.js';
import EditJourneyScreen from './screens/EditJourneyScreen.js';

const App = () => {

  const Stack = createStackNavigator();


  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName={"MyJourneys"}>
        <Stack.Screen
          name="MyJourneys"
          component={MyJourneys}
          options={{
            title: 'Favorittreiser',
          }}
        />
        <Stack.Screen
          name="NewJourney"
          component={NewJourney}
          options={{
            title: 'Ny Reise',
            headerBackTitle: 'Avbryt'
          }}
        />
        <Stack.Screen
          name="NewJourneyDetails"
          component={NewJourneyDetails}
          options={{
            title: 'Detaljer',
            headerBackTitle: 'Tilbake',
          }}
        />
        <Stack.Screen
          name="EditJourney"
          component={EditJourneyScreen}
          options={{
            title: '',
            headerBackTitle: 'Avbryt',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 26,
    marginRight: 10,
  }
});


export default App;
