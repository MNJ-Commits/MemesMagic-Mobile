// Libraries
import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, Image, } from 'react-native';
import {getProducts, getSubscriptions, getPurchaseHistory, purchaseUpdatedListener, requestPurchase, requestSubscription, useIAP, validateReceiptIos, finishTransaction, getAvailablePurchases, initConnection, endConnection, getPendingPurchasesIOS} from 'react-native-iap';
import { getUniqueId } from 'react-native-device-info';
import { RFValue } from 'react-native-responsive-fontsize';
import { PaymentsReceiptInfo, loadPaymentsReceiptInfo, loadVerifyPaymentFromStorage, storeAppleAccessToken, storePaymentsReceiptInfo, storeVerifyPayment } from '../store/asyncStorage';
import * as RNFS from 'react-native-fs';

// SVG's
import AppLogo from "../assets/svgs/app-logo.svg";
import BackButton from "../assets/svgs/back-button.svg";
import Subcribe from "../assets/svgs/subcribe.svg";
import ArrowDown from "../assets/svgs/arrow-down.svg";
import GifsMemes from "../assets/svgs/gifs-memes.svg";
import NoAds from "../assets/svgs/no-ad's.svg";
import Information from "../assets/svgs/information.svg";
import Cross from "../assets/svgs/cross.svg";

// Hooks
import { usePostAppleAccessToken } from '../hooks/usePostAppleAccessToken';

// Components
import { AppModal } from '../components/AppModal';
import RNFetchBlob from 'rn-fetch-blob';
import { openLink } from '../utils/openLink';


const SubscriptionScreen = ({navigation, route}:any) => {

  const returnScreen = route.params?.returnScreen
  const reRender = route.params?.reRender
  // console.log('route.params: ', route.params)

  const Services =[
    {Label: "All gifs and memes!", SVG: <GifsMemes width={40} height={40} style={{marginRight:10}} /> },
    {Label: "No ads!", SVG: <NoAds width={40} height={40} style={{marginRight:10}} />  },
  ]

  const [products, setProducts] = useState<any>([])
  const [subscription, setSubscription] = useState<any>([])
  const [connected, setConnected] = useState<boolean>(false)
  const [checkingSubscriptions, setCheckingSubscriptions] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [restore, setRestore] = useState<boolean>(false)
  const [UUID, setUUID] = useState<string>('')
  const [isVerifyPayments, setVerifyPayments] = useState<any>({})
  const [isVisibleModal, setVisibleModal] = useState(false);

  let purchaseUpdated: any

  const getter = async () =>{

    await loadPaymentsReceiptInfo().then((receipt_info_res:PaymentsReceiptInfo)=>{
      
      // console.log("receipt_info_res: ", receipt_info_res);
      const expiration = receipt_info_res?.expires_date_ms
      let expired = Date.now() > Number(expiration)
      // console.log("here: ", expired, Date.now(), expiration);
      if (expired) { 
        setLoading(false)
        SubscriptionAlert("Subscription Expired", "Your monthly subscription has expired. Would you like to re-subcribe")
      }else{
        setCheckingSubscriptions(true)
        setLoading(false)
      }
    })
    .catch((error:any)=>{
      console.log('loadAppleAccessTokenFromStorage Error: ', error);
    })

  }

  useLayoutEffect( ()=>{

    getter()
    connection().catch((error)=>{ console.log("connection error: ", JSON.stringify(error))})
    //  Unmount
    return () => {
      purchaseUpdated?.remove()
      endConnection()
    };
  },[])

  const connection = async () =>{

    await initConnection()
    .then(()=>{
      setConnected(true)
    }).catch((error)=>{
      console.log('Not connected: ', error);
      connection()
    })
  }

  const getInventory = async () =>{

    getProducts({skus:["NoWatermarks"]}).then((productsResponse)=>{ 
      setProducts(productsResponse) 
    }).catch((currentPurchaseError)=>{ 
      setLoading(false)
      console.log('getProductsError: ', currentPurchaseError) 
    })

    getSubscriptions({skus:["MonthlySubscription"]}).then((getSubscriptionsResponse)=>{ 
      setSubscription(getSubscriptionsResponse) 
    }).catch((currentPurchaseError)=>{ 
      setLoading(false)
      console.log('getSubscriptionsError: ', currentPurchaseError) 
    })
    // console.log("Inventory loaded");
    
    setLoading(false)
  }

  useEffect(()=>{
    // console.log("Restored", restore);
    if(connected){
      // console.log('Connected')
      getInventory()
      // purchaseUpdated = purchaseUpdatedListener((purchase)=>{
      //   try{     
      //     const receipt = purchase?.transactionReceipt
      //     if(receipt){
      //       finishTransaction({purchase: purchase})
      //       .then((AckResult)=>{
      //         console.log('Purchase Acknowledged: ', AckResult);
      //         validateReceipt(receipt)    
      //       }).catch((AckResultError)=>{
      //         console.log('Purchase Acknowledgement Error: ', AckResultError);
      //       })
      //     }
      //   }
      //   catch{
      //     console.log('purchaseListener error');
      //   }
      // })
    }
    if (restore){
      setLoading(true);
      getMyPurchases()
    }

  },[connected, restore])


  const getMyPurchases = ()=>{
    // console.log("Restore Purchase History"); 
    getAvailablePurchases().then((purchases)=>{
      console.log('purchases: ', purchases.length); 
      if(purchases.length>0){
        const sortedAvailablePurchases = purchases.sort( (a, b) => b.transactionDate - a.transactionDate );
        const latestAvailableReceipt = sortedAvailablePurchases[0].transactionReceipt;
        validateReceipt(latestAvailableReceipt)
      }
    }).catch((error: any)=>{
      setLoading(false)
      console.log("getAvailablePurchases error: ", JSON.stringify(error))
    })
  }

  // Apple expires subscription after 6 attempts or 5 minutes in sandbox automatically
  const validateReceipt = async (receipt: string)=>{

    await validateReceiptIos({ receiptBody: {"receipt-data": receipt, password: '8397e848fdbf458c9d81f1b742105789'}, isTest: true })
    .then((validationReponse)=>{ 
      
      const renewal_history = validationReponse.latest_receipt_info
      console.log("latest_receipt: ", validationReponse.latest_receipt);
      getAppleAccessToken.mutate({receipt: validationReponse.latest_receipt})

      let purchaseType:any = []
      // Find Subscription
      if(renewal_history[0]?.product_id == "MonthlySubscription"){
        const expiration = renewal_history[0].expires_date_ms
        let expired = Date.now() > expiration
        // console.log("Index 0",  expired, Date.now(), expiration);
        if (expired) { 
          setLoading(false)
          SubscriptionAlert("Subscription Expired", "Your monthly subscription has expired. Would you like to re-subcribe")
        }
        else{
          // console.log("Subscription Expiration in DB: ", renewal_history[0].expires_date_ms);
          storePaymentsReceiptInfo(renewal_history[0])
          !purchaseType.includes(renewal_history[0].product_id) ? purchaseType.push(renewal_history[0].product_id) : null
        }
      }
      else if(renewal_history[1]?.product_id=="MonthlySubscription"){
        const expiration = renewal_history[1].expires_date_ms
        let expired = Date.now() > expiration
        // console.log("Index 1",  expired, Date.now(), expiration);

        if (expired) { 
          setLoading(false)
          SubscriptionAlert("Subscription Expired", "Your monthly subscription has expired. Would you like to re-subcribe")
        }
        else{
          // console.log("Subscription Expiration in DB: ", renewal_history[1].expires_date_ms);
          storePaymentsReceiptInfo(renewal_history[1])
          !purchaseType.includes(renewal_history[1].product_id) ? purchaseType.push(renewal_history[1].product_id) : null
        }
      }      

      // Find Purchases
      for (let purchaseNo = 0; purchaseNo < renewal_history.length; purchaseNo++) {
        if(renewal_history[purchaseNo].product_id == "NoWatermarks")
          purchaseType.push(renewal_history[purchaseNo].product_id)
      }

      // Store Payments
      console.log("purchaseType: ", purchaseType);
      if(purchaseType.length == 1){
        if(purchaseType[0] === "NoWatermarks")
          setVerifyPayments({ one_time: true, subcription: false })
        else if (purchaseType[0] ===  "MonthlySubscription")
          setVerifyPayments({ one_time: false, subcription: true })
      } 
      else if(purchaseType.length == 2){
        setVerifyPayments({ one_time: true, subcription: true })
      } 
      else{
        setVerifyPayments({ one_time: false, subcription: false })
        SubscriptionAlert("Payments Expired", "Your have no active payments. Would you like to subcribe")
      }

      const expiration = renewal_history[0].expires_date_ms
      let not_expired = Date.now() > expiration
      
      // No paymrnts found
      if (purchaseType.length==0)
        SubscriptionAlert("Payments Alert", "No payment record found. Would you like to subcribe.")
      else if(restore) {
        Alert.alert("Payments Alert", "Payments restored successfully",
          [{
              text: 'Ok',
               onPress: () => { 
                setRestore(false)
                if(not_expired) {
                  navigation.canGoBack() ? navigation.pop() :
                  returnScreen ? navigation.push(returnScreen) :
                  navigation.push('CustomScreen')
                }
              }
          }]
        )
      }
        // move this else-if to verifyPayments dependent useEffect
      else if ( returnScreen !== "IndividualGiphScreen" && not_expired ){
        reRender() 
        setTimeout(() => {
          navigation.canGoBack() ? navigation.pop() :
          returnScreen ? navigation.push(returnScreen) :
          navigation.push('CustomScreen')
        }, 2000);
      }
      // setLoading(false)
      console.log("I am done");
      
    })
    .catch((validationError)=>{ 
      setLoading(false)
      console.log('validationError: ', validationError)
    })    
  }

  const SubscriptionAlert = (alertType: string, msg: string) => {
    Alert.alert(alertType, msg,
    [
      {
        text: 'Yes', onPress: () => { handleSubscription(subscription[0]?.productId) }
      },
      {
        text: 'No'
      }
    ] )
  }
  
  const handlePurchase = async (sku: string) => {
    setLoading(true)
    if(products[0].productId=='NoWatermarks')
    {
      await requestPurchase({
        sku,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
        appAccountToken: UUID
      })
      .then((purchaseReponse)=>{
        // console.log("purchaseReponse: ", purchaseReponse);
        const receipt = purchaseReponse?.transactionReceipt
          if(receipt){
            finishTransaction({purchase: purchaseReponse})
            .then((AckResult)=>{
              // console.log('Purchase Acknowledged: ', AckResult);
              validateReceipt(receipt)    
            }).catch((AckResultError)=>{
              setLoading(false)
              console.log('Purchase Acknowledgement Error: ', AckResultError);
            })
          }
      })
      .catch((purchaseError)=>{
        setLoading(false)
        console.log('purchaseError: ', purchaseError);
      })
    }
  };

  const handleSubscription = async (sku: string) => {
    setLoading(true)
    // console.log("handleSubscription");
    if(subscription[0].productId = 'MonthlySubscription')
    {
      await requestSubscription({sku, appAccountToken: UUID})
      .then((subscriptionReponse: any)=>{
        // console.log("subscriptionReponse: ", subscriptionReponse);
        const receipt = subscriptionReponse?.transactionReceipt
        if(receipt){
          finishTransaction({purchase: subscriptionReponse})
          .then((AckResult)=>{
            // console.log('Subscription Acknowledged: ', AckResult);
            validateReceipt(receipt)    
          }).catch((AckResultError)=>{
            console.log('Subscription Acknowledgement Error: ', AckResultError);
          })
        }

      })
      .catch((subscriptionError)=>{
        setLoading(false)
        console.log('subscriptionError: ', subscriptionError);
      })
    }
  };  
 
  getUniqueId().then((uniqueId) => {
    setUUID(uniqueId)
  }).catch((error) => {
  console.log('UUID: ', JSON.stringify(error))
  });

  useEffect(()=>{  
    storeVerifyPayment(isVerifyPayments)
  },[isVerifyPayments])

  const getAppleAccessToken: any = usePostAppleAccessToken({
    onSuccess(res) { 
      // console.log('getAppleAccessToken: ', res);
      storeAppleAccessToken(res.access_token)
    },
    onError(error) {
      console.log(error);
    },
  });


console.log("loading: ",loading);
console.log("restore: ",restore);

  return (
    <Fragment >
      <SafeAreaView style= {{flex:0, backgroundColor:'#FF439E' }} />
      <SafeAreaView style= {{flex:1, backgroundColor:'#3386FF' }} >
        <View style={{ flex:1, backgroundColor:'#FF439E',}} >
          <ScrollView contentContainerStyle={{ marginTop:10 }} >
            
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',  paddingHorizontal:20 }} >
              <TouchableOpacity onPress={()=>{
                navigation.canGoBack() ? navigation.pop() :
                returnScreen ? navigation.push(returnScreen) :
                navigation.push('CustomScreen')
              }} 
              >
                <BackButton width={RFValue(25)} height={RFValue(25)}/>
              </TouchableOpacity>
              
              <View style={{flexDirection:'row', alignItems:'center', }}  >
                <TouchableOpacity onPress={()=>{ setVisibleModal(!isVisibleModal) }} >
                  <Information width={RFValue(22)} height={RFValue(22)}/>
                </TouchableOpacity>
                <TouchableOpacity 
                  disabled={ loading ? true : false}    
                  onPress={()=>{ setRestore(true) }}>
                  <Text style={{color:'#ffffff', fontSize:RFValue(14), fontWeight:'400', marginLeft:RFValue(10), fontFamily:'Lucita-Regular', }} >Restore</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ alignItems:'center', marginTop:30 }}>
              <AppLogo width={RFValue(250)} height={RFValue(130)} />
              <View style={{ marginTop:40 }} >
                { Services.map((data:any, index:number)=>{
                    return(
                    <TouchableOpacity key={index} style={{flexDirection:'row', alignItems:'center', marginVertical:RFValue(10)  }}  >
                      {data.SVG}
                      <Text style={{color:'white', fontFamily:'Lucita-Regular', fontSize:RFValue(18), fontWeight:'900', paddingVertical:10 }} >{data.Label}</Text>
                    </TouchableOpacity>
                    )
                  })
                }
              </View>

              {/* Subscribe */}
              <View>
                <Subcribe width={RFValue(230)} height={RFValue(30)} style={{marginTop:RFValue(30)}}/>
                <ArrowDown width={RFValue(30)} height={RFValue(30)} style={{alignSelf:'center', marginTop:-2}} />
                <TouchableOpacity 
                  disabled={(subscription?.length <1 || loading) ? true : false}  
                  onPress={() => {
                  // isVerifyPayments?.subcription ? 
                  // Alert.alert("Auto-renewable subscription is active") :
                  handleSubscription(subscription[0]?.productId) }}  
                  style={{ borderWidth:4, borderColor:'#ffffff', backgroundColor:'#622FAE', padding:RFValue(15), borderRadius:RFValue(15), marginTop:RFValue(10) }} 
              
                >
                  <Text style={{color:'#ffffff', fontSize:RFValue(20), fontFamily:'Lucita-Regular' }} >Try Free & Subscribe</Text>
                </TouchableOpacity>
                <Text style={{color:'white', fontSize:RFValue(10), paddingTop:RFValue(5), fontFamily:'Lucita-Regular', alignSelf:'center' }} >3 day free trial. Then {subscription[0]?.localizedPrice} monthly</Text>
              </View>
            </View> 
            {(loading || products?.length==0 || subscription?.length==0) && 
              <ActivityIndicator size={'large'} color={'grey'} style={{position:'relative', top: RFValue(20), alignSelf:'center'}} />
            } 
          </ScrollView>  

          {/* Purchase */}
          <View style={{ alignItems:'center', backgroundColor:'#3386FF' }} >
            <TouchableOpacity 
              disabled={(products?.length <1 || loading) ? true : false}    
              onPress={() =>{ 
                // isVerifyPayments?.one_time ? 
                // Alert.alert("No Watermarks already purchased") :
                handlePurchase(products[0]?.productId) 
              }} 
              style={{flexDirection:'row', alignItems:'center', backgroundColor:'#ffffff', padding:RFValue(12), borderRadius:RFValue(15), marginTop:RFValue(20) }} 
             
            >
              <Text style={{color:'#622FAE', fontSize:RFValue(12),  fontFamily:'Lucita-Regular', }} >No Watermarks   </Text>
              <Text style={{color:'#622FAE', fontSize:RFValue(12), fontFamily:'Lucita-Regular', }} >{products[0]?.localizedPrice}</Text>
            </TouchableOpacity>
            <Text style={{color:'#ffffff', fontSize:RFValue(10), fontFamily:'Lucita-Regular', alignSelf:'center', paddingTop: RFValue(5) }} >one time purchase</Text>
          </View>
        </View>

      {/* Subscription Information Modal */}
      <AppModal isVisible={isVisibleModal} setModalVisible = {setVisibleModal}  >
        <AppModal.Container >
          <AppLogo width={RFValue(150)} height={RFValue(60)} style={{alignSelf:'center', marginVertical:20}} />
          <TouchableOpacity onPress={()=>setVisibleModal(false)} style={{ position:'absolute', right:RFValue(10), top:RFValue(10) }}  >
            <Cross width={RFValue(22)} height={RFValue(22)} style={{alignSelf:'flex-end'}}/>
          </TouchableOpacity>
          <AppModal.Header title="Terms and Conditions" />
          <AppModal.Body>
            <View style={{ marginTop:10 }} >
              <Text style={{ fontFamily:'Lucita-Regular', color:'#ffffff', fontSize: RFValue(12), textAlign:'justify', lineHeight:20 }}>
                Subscription renews monthly or annually. Payment will be charged to iTunes account at confirmation of purchase. Subscription automaticlaly renews unless the automatic-renew is turned off at least 24 hours before the end of the current period. Account will be charged for renewal within 24 hours prior to the end of the current period, and identify the cost of the renewal subscription may be managed by the user and auto-renewal may be turned off by going to the user’s Account Settings after purchase. Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that application. By signing up for subscription, you agree to our 
                <TouchableOpacity onPress={()=>openLink("https://www.grassapper.com/terms-and-conditions")} >
                  <Text style={{fontFamily:'Lucita-Regular', fontSize: RFValue(12), color:'#FEB720'}}>terms and conditions </Text> 
                </TouchableOpacity>
                and  
                <TouchableOpacity onPress={()=>openLink("https://www.grassapper.com/application-privacy-policy")} >
                  <Text style={{fontFamily:'Lucita-Regular', fontSize: RFValue(12), color:'#FEB720'}}> privacy policy.</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </AppModal.Body>
          <AppModal.Footer>
          </AppModal.Footer>
        </AppModal.Container>
      </AppModal>
      </SafeAreaView>
    </Fragment>    
  );
};

 

export default SubscriptionScreen;


