import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomScreen from './screens/CustomScreen';
import BannerScreen from './screens/BannerScreen';
import SubcriptionScreen from './screens/SubcriptionScreen';
import IndividualGiphScreen from './screens/IndividualGiphScreen';
import ActivityIndicator from './components/ActivityIndicator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator(); 
// Create a client
const queryClient = new QueryClient()


const App = () => {
  return (

    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <AppBootStrap />
      </QueryClientProvider>
    </NavigationContainer>
  );
};


const AppBootStrap = React.memo(function () {

  return(
    <SafeAreaProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* <Stack.Screen name="ActivityIndicator" component={ActivityIndicator} /> */}
        <Stack.Screen name="CustomScreen" component={CustomScreen} />
        <Stack.Screen name="BannerScreen" component={BannerScreen} />
        <Stack.Screen name="SubcriptionScreen" component={SubcriptionScreen} />
        <Stack.Screen name="IndividualGiphScreen" component={IndividualGiphScreen} />
      </Stack.Navigator>
    </SafeAreaProvider>
  )
})
export default App;



