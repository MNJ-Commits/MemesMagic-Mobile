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
import { clearTransactionIOS, finishTransaction, getAvailablePurchases, getReceiptIOS, validateReceiptIos } from 'react-native-iap';
import { PaymentsReceiptInfo, loadAppRestartCount, loadFreeGifAccess, loadPaymentsReceiptInfo, loadVerifyPaymentFromStorage, storeAppRestartCount, storeFreeGifAccess, storePaymentsReceiptInfo, storeVerifyPayment } from './store/asyncStorage';
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
  const [verifyPayment, setVerifyPayment] = useState<any>({})
  const [appRestartCount, setAppRestartCount] = useState<number>(1)
  const [rateStatus, setRateStatus] = useState<any>({})
  const [freeGifAccess, setFreeGifAccess] = useState<string>("Denied")
  const isAvailable = InAppReview.isAvailable();

  useFocusEffect(
    React.useCallback(() => {
      console.log("clearTransactionIOS");
      void clearTransactionIOS();
    }, []),
  );

  // useEffect(()=>{  
  //   storeVerifyPayment(verifyPayment)
  //   return()=>{}
  // },[verifyPayment])

  
  useEffect(()=>{
    // getter()
    getAvailableSubscription()
  },[])

  useEffect(()=>{
    if(rateAppStatus?.data)
      getter()
  },[rateStatus])

    useEffect(()=>{
      setTimeout(() => {
        if(rateAppStatus?.data)
          requestReview()
      }, 5000);
    },[appRestartCount])

  const getter = async () =>{

    // await loadPaymentsReceiptInfo().then((receipt_info_res:PaymentsReceiptInfo)=>{

    //   const expiration = receipt_info_res?.expires_date_ms
    //   let is_expired = expiration ? Date.now() > Number(expiration) : false
    //   // console.log("receipt_info_res: ", receipt_info_res);
    //   // console.log("is_expired: ", is_expired, Date.now(), expiration);
    //   if (is_expired && paymentStatus !== undefined || paymentStatus !== null) { 
    //     setVerifyPayment({ one_time: paymentStatus?.one_time, subcription: false, is_trial_period: paymentStatus?.trial_period  })
    //   }
    // }).catch((error:any)=>{
    //   console.log('loadPaymentsReceiptInfo Error: ', error);
    // })
     
    await loadAppRestartCount().then((resp)=>{
      // console.log("resp: ", resp, rateStatus.show_popup);
      if ((resp===undefined || resp===null) && rateStatus.show_popup===0){
        storeAppRestartCount( { count: 1 })
      }
      else if ((resp !==undefined || resp !==null) && rateStatus.show_popup===0){
        storeAppRestartCount({ count: resp.count+1 }) 
        setAppRestartCount(resp.count+1)
      } 
      else if (rateStatus.show_popup===1 && resp.count>1 ){
        storeAppRestartCount({ count: 0 })
        setAppRestartCount(0)
      }
    }).catch((error:any)=>{
      console.log('loadAppRestartCount Error: ', error);
    })
 
    // console.log( 'active',  AppState.currentState);
    
    await loadFreeGifAccess().then((resp:any)=>{
      // console.log('loadFreeGifAccess resp: ', resp);
      if (resp===undefined || resp===null){
        storeFreeGifAccess({access:"Denied", uid:0})
      }
      // // if (resp !==undefined && resp !==null && AppState.currentState==='active'){
      // if (resp !==undefined && resp !==null){
      //     setFreeGifAccess(resp.access) 
      //   }
      // else{
      //   console.log("I deny");
        
      //   storeFreeGifAccess({access:"Denied"})
      //   setFreeGifAccess("Denied")
      // }   
      
      
    }).catch((error:any)=>{
        console.log('loadFreeGifAccess Error: ', error);
    })
 
  }

  const rateAppStatus: any = usePostRateAppStatus({
    onSuccess: async (res: any) => {
      // console.log("forceAppStatus: ", res[0]);
      setRateStatus(res[0])
    },
    onError: (res: any) => console.log('onError: ',res),
  });
  
  const requestReview = ()=> {            
    // if(isAvailable && rateStatus.show_popup===0 && freeGifAccess==="Denied" && (appRestartCount===3|| appRestartCount===7 || appRestartCount===15)){
    if(isAvailable && rateStatus.show_popup===0 && (appRestartCount===3|| appRestartCount===7 || appRestartCount===15)){
      Alert.alert("Rate Us", "This is a locked feature. To unlock it once for free, please leave a 5-star review",
        [
          { text: 'Maybe Later', onPress: () => { navigation.navigate('SubscriptionScreen') } },
          {
            text: 'Rate Now', onPress: () => {
              // if(freeGifAccess==="Denied"){
              //   setFreeGifAccess("Granted")
              //   storeFreeGifAccess({access:"Granted"})
              // }
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

  const getAvailableSubscription = async ()=>{
    
    console.log("getAvailableSubscription"); 
    // forceRefresh only makes sense when testing an app not downloaded from the Appstore.
    // And only afer a direct user action.
    const latestAvailableReceipt = await getReceiptIOS({forceRefresh: true}).catch((error)=>{
      // console.log("getReceiptIOS error: ", error);
    })
    if(latestAvailableReceipt){
      await validateReceiptIos({ receiptBody: {"receipt-data": latestAvailableReceipt, password: '8397e848fdbf458c9d81f1b742105789'}, isTest: true })
      .then( async (validationReponse)=>{ 
        const paymentStatus = await loadVerifyPaymentFromStorage().catch((error:any)=>{ console.log('loadVerifyPaymentFromStorage Error: ', error) })
        const renewal_history = validationReponse.latest_receipt_info
        // console.log("paymentStatus: ", paymentStatus);     
        // console.log("renewal_history: ", renewal_history);
        let trial_period: Boolean  
        let is_expired: boolean
        // Find Subscription
        const subscriptionObject = renewal_history?.find((item: { product_id: string; }) => item.product_id === "MonthlySubscription")
        trial_period = JSON.parse(subscriptionObject.is_trial_period)
        const expiration_time = subscriptionObject.expires_date_ms
        is_expired = expiration_time ? Date.now() > expiration_time : false
        // console.log("subscriptionObject: ", subscriptionObject);
        // console.log("is_expired: ", expiration_time, Date.now(), is_expired);        
        // console.log("trialPeriod: ", trial_period, typeof trial_period);
        
        if(is_expired){
          storePaymentsReceiptInfo({...subscriptionObject})
          setVerifyPayment({ 
                            subcription: !is_expired,
                            one_time: paymentStatus?.one_time, 
                            is_trial_period: trial_period 
                          })
        }
      })
      .catch((validationError)=>{ 
        console.log('validationError: ', validationError)
      })   
    }
  }

  console.log("appRestartCount: ",appRestartCount, rateStatus.show_popup);
  // console.log("freeGifAccess: ", appRestartCount);

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