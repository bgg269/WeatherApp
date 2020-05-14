import React from 'react';
import Cities from './components/Cities';
import Weather from './components/Weather';
import CurrentWeather from './components/CurrentWeather';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Saved Locations" component={Cities}/>
      <Stack.Screen name="Weather" component={Weather} />
    </Stack.Navigator>
  );
}
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
  return(
    <NavigationContainer>
      <Tab.Navigator
                tabBarOptions={{
                    activeTintColor: '#00bfff',
                    style: {
                        height: 60,
                        shadowColor: '#DEDDDD',
                        shadowOpacity: 2,
                        shadowOffset: {
                            height: 2,
                            width: 2
                        },
                    },
                }}
            >
        <Tab.Screen name="Current" component={CurrentWeather}
          options={{
            tabBarLabel: 'Current Location',
            tabBarIcon: ({ color }) => (
                <Ionicons name="ios-pin" color={color} size={40} />
            )
          }}
        />
        <Tab.Screen name="Saved Locations" component={Root} 
          options={{
            tabBarLabel: 'Saved Locations',
            tabBarIcon: ({ color }) => (
                <Ionicons name="ios-list" color={color} size={40} />
            )
          }}/>
      </Tab.Navigator>
    </NavigationContainer>
    );
}