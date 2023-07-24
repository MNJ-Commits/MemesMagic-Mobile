import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomScreen from './screens/CustomScreen';
import BannerScreen from './screens/BannerScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import IndividualGiphScreen from './screens/IndividualGiphScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ApplePayScreen from './screens/ApplePayScreen';
import { ActivityIndicator, Alert } from 'react-native';
import { endConnection, finishTransaction, getPendingPurchasesIOS, getReceiptIOS, initConnection, purchaseUpdatedListener, validateReceiptIos } from 'react-native-iap';
import { storeAppleAccessToken, storePaymentsReceiptInfo, storeVerifyPayment } from './store/asyncStorage';
import { usePostAppleAccessToken } from './hooks/usePostAppleAccessToken';


const Stack = createNativeStackNavigator(); 
// Create a client
const queryClient = new QueryClient()


const App = ({route}:any) => {

  // console.log('route: ', route);
  
  return (
      <QueryClientProvider client={queryClient}>
        <AppBootStrap />
      </QueryClientProvider>
  );
};


const AppBootStrap = React.memo(function () {

  const linking = {
    prefixes: ['memeswork://SubscriptionScreen', 'https://memeswork.com'],
    screens:{
      SubscriptionScreen:"SubscriptionScreen",
    }
  };

  // const getAppleAccessToken: any = usePostAppleAccessToken({
  //   onSuccess(res) { 
  //     // console.log('getAppleAccessToken: ', res);
  //     storeAppleAccessToken(res.access_token)
  //   },
  //   onError(error) {
  //     console.log(error);
  //   },
  // });

  // useEffect(()=>{

  //   let TransactionArray: any = []
  //   initConnection()
  //   .then(async ()=>{ 
  //     console.log('connected')    
  //     const pendingPurchases = await getPendingPurchasesIOS()
  //     console.log("App pendingPurchases: ", pendingPurchases.length);
  //   })
    
  //   const purchaseUpdatedListenser = purchaseUpdatedListener( async(purchaseUpdated:any)=>{
  //     TransactionArray.push(purchaseUpdated)
  //   })


  //   console.log("App TransactionArray: ", TransactionArray.length);
    
  //   setTimeout(async () => {
  //     if(TransactionArray.length > 0 ){
  //       const sortedTransactionArray:any  = TransactionArray.sort( (a, b) => b.transactionDate - a.transactionDate ); 
  //         await finishTransaction({purchase: sortedTransactionArray[0]})
  //           .then(async (AckResult)=>{
  //             let receipt = sortedTransactionArray[0].transactionReceipt
  //             if(receipt){
  //               {
  //                 await validateReceiptIos({ receiptBody: {"receipt-data": receipt, password: '8397e848fdbf458c9d81f1b742105789'}, isTest: true })
  //                 .then( (validationReponse)=>{ 
                    
  //                   // Store Receipt
  //                   getAppleAccessToken.mutate({receipt: validationReponse.latest_receipt})
                    
  //                   // Extract Purchase Records
  //                   let purchaseType:any = []
  //                   const renewal_history = validationReponse.latest_receipt_info
                   
  //                   // Find Subscription
  //                   const subscriptionObject = renewal_history?.find((item: { product_id: string; }) => item.product_id === "MonthlySubscription")
  //                   const expiration = subscriptionObject.expires_date_ms
  //                   let not_expired = expiration && Date.now() < expiration
  //                   if(subscriptionObject !== undefined)
  //                     {
  //                       // console.log("subscriptionObject: ", subscriptionObject);
  //                       if (not_expired){
  //                         storePaymentsReceiptInfo({...subscriptionObject, subscribed: true})
  //                         !purchaseType.includes(subscriptionObject.product_id) ? purchaseType.push(subscriptionObject.product_id) : null
  //                       } 
  //                     }   
              
  //                   // Find Purchases
  //                   const purchaseObject = renewal_history?.find((item: { product_id: string; }) => item?.product_id === "NoWatermarks");
  //                   if (purchaseObject !== undefined) { purchaseType.push(purchaseObject.product_id) } 
                    
  //                   // Store Purchase Records
  //                   console.log("purchaseType: ", purchaseType);
  //                   if(purchaseType.length == 1){
  //                     if(purchaseType[0] === "NoWatermarks")
  //                       storeVerifyPayment({ one_time: true, subcription: false })
  //                     else if (purchaseType[0] ===  "MonthlySubscription")
  //                       storeVerifyPayment({ one_time: false, subcription: true })
  //                   } 
  //                   else if(purchaseType.length == 2){
  //                     storeVerifyPayment({ one_time: true, subcription: true })
  //                   }   
  //                 })
  //                 .catch((validationError)=>{ 
  //                   console.log('validationError: ', validationError)
  //                 })  
  //               }
  //             }
  //           })
  //           .catch((AckResultError)=>{
  //             console.log('finishTransaction Error: ', AckResultError);
  //           }) 
  //     }
      
  //   }, 1500);

  //   return()=>{
  //     purchaseUpdatedListenser.remove()
  //     endConnection()
  //   }
  // },[])

  // let purchaseUpdatedListenser: any
  // useEffect(()=>{
  //   purchaseUpdatedListenser = purchaseUpdatedListener(async (pendingPurchases)=>{
  //     console.log("purchaseUpdatedListener");
  //     await finishTransaction({purchase: pendingPurchases})
  //   })
  //   return()=>{
  //     purchaseUpdatedListenser?.remove()
  //   }
  // },[])
  
  return(
    <NavigationContainer 
      linking={linking}
      fallback={<ActivityIndicator color="blue" size="large" />}
    >
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </NavigationContainer>
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