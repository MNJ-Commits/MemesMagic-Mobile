import React, { useEffect } from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomScreen from './screens/CustomScreen';
import BannerScreen from './screens/BannerScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import IndividualGiphScreen from './screens/IndividualGiphScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ApplePayScreen from './screens/ApplePayScreen';
import { ActivityIndicator } from 'react-native';
import { clearTransactionIOS } from 'react-native-iap';


const Stack = createNativeStackNavigator(); 
// Create a client
const queryClient = new QueryClient()


const App = ({route}:any) => {

  
  const linking = {
    prefixes: ['memeswork://SubscriptionScreen', 'https://memeswork.com'],
    screens:{
      SubscriptionScreen:"SubscriptionScreen",
    }
  };
  
  return (
      <QueryClientProvider client={queryClient}>
        <NavigationContainer 
          linking={linking}
          fallback={<ActivityIndicator color="blue" size="large" />}
        >
        <SafeAreaProvider>
          <AppBootStrap />      
        </SafeAreaProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
};


const AppBootStrap = React.memo(function () {
  
  useFocusEffect(
    React.useCallback(() => {
      console.log("clearTransactionIOS");
      void clearTransactionIOS();
    }, []),
  );
  
  return(

        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="CustomScreen" component={CustomScreen} />
          <Stack.Screen name="BannerScreen" component={BannerScreen} />
          <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
          <Stack.Screen name="IndividualGiphScreen" component={IndividualGiphScreen} />
          <Stack.Screen name="ApplePayScreen" component={ApplePayScreen} />
        </Stack.Navigator>

  )
})

export default App



//       CustomScreen:{
//   screens:{
//     IndividualGiphScreen:"IndividualGiphScreen"
//     }
//   },
// BannerScreen:{
//   screens:{
//       IndividualGiphScreen:"IndividualGiphScreen"
//     }
//   },