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
import { PaymentsReceiptInfo, loadPaymentsReceiptInfo, loadVerifyPaymentFromStorage } from './store/asyncStorage';


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

  const getter = async () =>{

    const paymentStatus = await loadVerifyPaymentFromStorage().catch((error:any)=>{
      console.log('loadVerifyPaymentFromStorage Error: ', error);
    })

    await loadPaymentsReceiptInfo().then((receipt_info_res:PaymentsReceiptInfo)=>{
      
      // console.log("receipt_info_res: ", receipt_info_res);
      const expiration = receipt_info_res?.expires_date_ms
      let expired = expiration && Date.now() > Number(expiration)
      // console.log("here: ", expired, Date.now(), expiration);
      if (expired) { 
        setVerifyPayments({ one_time: paymentStatus.one_time, subcription: false })
      }
    })
    .catch((error:any)=>{
      console.log('loadAppleAccessTokenFromStorage Error: ', error);
    })
  }
  
  useEffect(()=>{
    getter()
  },[])
  
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




function setVerifyPayments(arg0: { one_time: any; subcription: boolean; }) {
  throw new Error('Function not implemented.');
}
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