import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomScreen from './iScreens/CustomScreen';
import BannerScreen from './iScreens/BannerScreen';
import SubscriptionScreen from './iScreens/SubscriptionScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const Stack = createNativeStackNavigator(); 
// Create a client
const queryClient = new QueryClient()


const iApp = () => {
  
  return (
      <QueryClientProvider client={queryClient}>
        <IAppBootStrap />
      </QueryClientProvider>
  );
};


const IAppBootStrap = React.memo(function () {
  
  return(
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="CustomScreen" component={CustomScreen} />
          <Stack.Screen name="BannerScreen" component={BannerScreen} />
          <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  )
})

export default iApp
