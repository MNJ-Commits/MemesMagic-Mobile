import React, { useEffect, useState } from 'react';
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomScreen from './screens/CustomScreen';
import BannerScreen from './screens/BannerScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import IndividualGiphScreen from './screens/IndividualGiphScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ApplePayScreen from './screens/ApplePayScreen';
import { ActivityIndicator, Alert, AppState } from 'react-native';
import { clearTransactionIOS } from 'react-native-iap';
import { PaymentsReceiptInfo, loadAppRestartCount, loadFreeGifAccess, loadPaymentsReceiptInfo, loadVerifyPaymentFromStorage, storeAppRestartCount, storeFreeGifAccess } from './store/asyncStorage';
import InAppReview from 'react-native-in-app-review';
import { usePostRateAppStatus } from './hooks/usePostRateAppStatus';


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

  const navigation = useNavigation<any>();
  const [appRestartCount, setAppRestartCount] = useState<number>(0)
  const [rateStatus, setRateStatus] = useState<any>({})
  const [freeGifAccess, setFreeGifAccess] = useState<string>("Denied")
  const isAvailable = InAppReview.isAvailable();

  useFocusEffect(
    React.useCallback(() => {
      console.log("clearTransactionIOS");
      void clearTransactionIOS();
    }, []),
  );

  useEffect(()=>{
    getter()
  },[])

  useEffect(()=>{
    setTimeout(() => {
      if(rateAppStatus?.data)
        requestReview()
    }, 5000);
  },[rateStatus])

  const getter = async () =>{

    const paymentStatus = await loadVerifyPaymentFromStorage().catch((error:any)=>{
      console.log('loadVerifyPaymentFromStorage Error: ', error);
    })

    await loadPaymentsReceiptInfo().then((receipt_info_res:PaymentsReceiptInfo)=>{
      // console.log("receipt_info_res: ", receipt_info_res);
      const expiration = receipt_info_res?.expires_date_ms
      let expired = expiration && Date.now() > Number(expiration)
      // console.log("here: ", expired, Date.now(), expiration);
      if (expired && paymentStatus !== undefined || paymentStatus !== null) { 
        setVerifyPayments({ one_time: paymentStatus.one_time, subcription: false })
      }
    })
    .catch((error:any)=>{
      console.log('loadPaymentsReceiptInfo Error: ', error);
    })
     
    await loadAppRestartCount().then((resp)=>{
      console.log("resp: ", resp);
      if (resp !==undefined && resp !==null && AppState.currentState==='active'){
        storeAppRestartCount({ count: resp.count+1 }) 
        setAppRestartCount(resp.count+1)
      } 
      else if (rateStatus.show_popup===0 && freeGifAccess==="Denied"){
        storeAppRestartCount( { count: 1 })
        setAppRestartCount(1)
      }
    })
    .catch((error:any)=>{
      console.log('loadAppRestartCount Error: ', error);
    })
 
    await loadFreeGifAccess().then((resp:any)=>{
      // console.log('loadFreeGifAccess res: ', res);
      if (resp !==undefined && resp !==null && AppState.currentState==='active'){
          setFreeGifAccess(resp.access) 
        }
      else{
        storeFreeGifAccess({access:"Denied"})
        setFreeGifAccess("Denied")
      }    
    })
    .catch((error:any)=>{
        console.log('loadFreeGifAccess Error: ', error);
    })
 
  }

  console.log("freeGifAccess: ",freeGifAccess, appRestartCount);
  

  const rateAppStatus: any = usePostRateAppStatus({
    onSuccess: async (res: any) => {
      // console.log("forceAppStatus: ", res[0]);
      setRateStatus(res[0])
    },
    onError: (res: any) => console.log('onError: ',res),
  });
  
  const requestReview = ()=> {        
    if(isAvailable && rateStatus.show_popup===0 && freeGifAccess==="Denied" && (appRestartCount===3|| appRestartCount===7 || appRestartCount===15)){
      Alert.alert("Rate Us", "This is a locked feature. To unlock it once for free, please leave a 5-star review",
        [
          { text: 'Maybe Later', onPress: () => { navigation.navigate('SubscriptionScreen') } },
          {
            text: 'Rate Now', onPress: () => {
              if(freeGifAccess==="Denied"){
                setFreeGifAccess("Granted")
                storeFreeGifAccess({access:"Granted"})
              }
              InAppReview.RequestInAppReview()
              .then((hasFlowFinishedSuccessfully) => {
              console.log('InAppReview in ios has launched successfully', hasFlowFinishedSuccessfully);
              
                if (hasFlowFinishedSuccessfully) {
                    // do something for ios
                }
              })
              .catch((error) => { console.log("RequestInAppReview: ", error) });
            }
          }
        ])
    }
  }

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