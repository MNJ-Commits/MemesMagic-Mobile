// Libraries
import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, Image, } from 'react-native';
import {getProducts, getSubscriptions, getPurchaseHistory, purchaseUpdatedListener, requestPurchase, requestSubscription, useIAP, validateReceiptIos, finishTransaction, getAvailablePurchases, initConnection, endConnection, getPendingPurchasesIOS, purchaseErrorListener, clearTransactionIOS} from 'react-native-iap';
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
  const [loading, setLoading] = useState<boolean>(true)
  const [backBlocked, setBackBlocked] = useState<boolean>(false)
  const [restore, setRestore] = useState<boolean>(false)
  const [UUID, setUUID] = useState<string>('')
  const [isVerifyPayments, setVerifyPayments] = useState<any>({})
  const [isVisibleModal, setVisibleModal] = useState(false);

  // Clears Penfding Queue
  useLayoutEffect(() => {
    void clearTransactionIOS();
    console.log("clearTransactionIOS");
    return()=>{}
  }, [])

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
        // setLoading(false)
        setVerifyPayments({ one_time: paymentStatus.one_time, subcription: false })
        // SubscriptionAlert("Subscription Expired", "Your monthly subscription has expired. Would you like to re-subcribe")  
      }else{
        // setLoading(false)
      }
    })
    .catch((error:any)=>{
      console.log('loadPaymentsReceiptInfo Error: ', error);
    })

  }

  const PendingTransaction=async ()=>{
    
    // Get Pending Purchases
    let pendingPurchases = await getPendingPurchasesIOS()

    setTimeout(async () => {
      pendingPurchases = await getPendingPurchasesIOS()
        if(pendingPurchases.length!==0){
          console.log("Pending");
          PendingTransaction()
        }else{
          console.log("finished");
          setLoading(false)
        }
    },2000);

  }

  useEffect( ()=>{
    
    let purchaseUpdatedListenser: any
    // Local Storage
    getter()

    // Initialize Connection
    initConnection()
    .then(async ()=>{ 
      console.log('connected') 

      // Get Products from Store
      getInventory()  

      // Check Pending Purchases
      let pendingPurchases = await getPendingPurchasesIOS()
      console.log("length: ", pendingPurchases.length);
      if(pendingPurchases.length!==0)
        PendingTransaction()
      else
        setLoading(false)
    })
    .catch((error: any)=>{ 
      setLoading(false)
      console.log('Not connected: ', error) 
    })
  
    const purchaseErrorListenser = purchaseErrorListener( (error)=>{
      console.log("purchaseErrorListener: ", error)
      setBackBlocked(false)
      setLoading(false)
    })
 

    //  Unmount
    return () => {
      purchaseUpdatedListenser?.remove()
      purchaseErrorListenser?.remove()
      endConnection()
    };

  },[])

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
  }

  const restorePurchases = async ()=>{
    console.log("Restore Purchase History"); 
    getAvailablePurchases()
    .then(async (availablePurchasesRes: any)=>{
      console.log('availablePurchasesRes: ', availablePurchasesRes.length); 
      if(availablePurchasesRes.length>0){
        const sortedAvailablePurchases = availablePurchasesRes.sort( (a, b) => b.transactionDate - a.transactionDate );
        const latestAvailableReceipt = sortedAvailablePurchases[0].transactionReceipt;
        // console.log("sortedAvailablePurchases[0]: ", sortedAvailablePurchases[0]);
        await finishTransaction({purchase: sortedAvailablePurchases[0]})
          .then((AckResult)=>{
            console.log('finishTransaction Acknowledged: ', AckResult);  
            if(latestAvailableReceipt)
              validateReceipt(latestAvailableReceipt)
          }).catch((AckResultError)=>{
            setLoading(false)
            console.log('finishTransaction Error: ', AckResultError);
          })
      }
    }).catch((error: any)=>{
      setLoading(false)
      console.log("getAvailablePurchases error: ", JSON.stringify(error))
    })
  }

  // Restore Purchases
  useEffect(()=>{
    if (restore){
      restorePurchases()
    }
    return()=>{}
  },[restore])


  // Apple expires subscription after 6 attempts or 5 minutes in sandbox automatically

  const SubscriptionAlert = (alertType: string, msg: string) => {
    Alert.alert(alertType, msg,
    [
      {
        text: 'Yes', onPress: () => handleSubscription() 
      },
      {
        text: 'No'
      }
    ] )
  }
  
  const handlePurchase = async (productId: string) => {

    console.log("productId: ", productId);
    setLoading(true)
    setBackBlocked(true)
    await requestPurchase({ sku: productId, appAccountToken: UUID })
      .then(async (purchaseResponse: any)=>{
        // console.log("purchaseResponse: ", purchaseResponse);
        await finishTransaction({purchase: purchaseResponse})
        .then((AckResult)=>{
            setBackBlocked(false)
            console.log('finishTransaction Acknowledged: ', AckResult);  
            let receipt = purchaseResponse.transactionReceipt
            if(AckResult && receipt)
              validateReceipt(receipt)
          }).catch((AckResultError)=>{
            setLoading(false)
            setBackBlocked(false)
            console.log('finishTransaction Error: ', AckResultError);
          })
      })
      .catch((purchaseError)=>{
        setLoading(false)
        console.log('purchaseError: ', purchaseError);
      })
  };

  const handleSubscription = async () => {
   
    setLoading(true)
    setBackBlocked(true)
    const productId = subscription[0]?.productId ? subscription[0]?.productId : "MonthlySubscription"
    await requestSubscription({ sku: productId, appAccountToken: UUID }) 
    .then(async (subscriptionResponse: any)=>{ 
      // console.log("subscriptionResponse: ", subscriptionResponse);
      await finishTransaction({purchase: subscriptionResponse})
      .then((AckResult)=>{
        setBackBlocked(false)
        console.log('finishTransaction Acknowledged: ', AckResult);  
        let receipt = subscriptionResponse.transactionReceipt
        if(receipt)
          validateReceipt(receipt)
      }).catch((AckResultError)=>{
        setLoading(false)
        setBackBlocked(false)
        console.log('finishTransaction Error: ', AckResultError);
      })
    })
    .catch(async (subscriptionError)=>{
      setLoading(false)
      console.log('subscriptionError: ', subscriptionError);
    })
  };  
 
  const validateReceipt = async (receipt: string)=>{
    
    await validateReceiptIos({ receiptBody: {"receipt-data": receipt, password: '8397e848fdbf458c9d81f1b742105789'}, isTest: true })
    .then( async (validationReponse)=>{ 
      
      // Store Receipt
      getAppleAccessToken.mutate({receipt: validationReponse.latest_receipt})
      
      // Extract Purchase Records
      let purchaseType:any = []
      const renewal_history = validationReponse.latest_receipt_info
      // console.log("renewal_history: ", renewal_history);
      
      // Find Subscription
      const subscriptionObject = renewal_history?.find((item: { product_id: string; }) => item.product_id === "MonthlySubscription")
      const expiration = subscriptionObject.expires_date_ms
      let not_expired = expiration && Date.now() < expiration
      if(subscriptionObject !== undefined)
        {
          // console.log("subscriptionObject: ", subscriptionObject);
          if (not_expired){
            storePaymentsReceiptInfo({...subscriptionObject, subscribed: true})
            !purchaseType.includes(subscriptionObject.product_id) ? purchaseType.push(subscriptionObject.product_id) : null
          } 
          else { 
            // console.log(Date.now() > expiration, Date.now(), expiration);
            setLoading(false)
            SubscriptionAlert("Subscription Expired", "Your monthly subscription has expired. Would you like to re-subcribe")
          }
        }   

      // Find Purchases
      const purchaseObject = renewal_history?.find((item: { product_id: string; }) => item?.product_id === "NoWatermarks");
      if (purchaseObject !== undefined) { purchaseType.push(purchaseObject.product_id) } 
      
      // Store Purchase Records
      console.log("purchaseType: ", purchaseType);
      if (purchaseType.length==0){
        setVerifyPayments({ one_time: false, subcription: false })
        SubscriptionAlert("Payments Alert", "Your have no active payments. Would you like to subcribe")
      } 
      else if(purchaseType.length == 1){
        if(purchaseType[0] === "NoWatermarks")
          setVerifyPayments({ one_time: true, subcription: false })
        else if (purchaseType[0] ===  "MonthlySubscription")
          setVerifyPayments({ one_time: false, subcription: true })
      } 
      else if(purchaseType.length == 2){
        setVerifyPayments({ one_time: true, subcription: true })
      } 

      if(restore) {
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
      else if ( not_expired ){
        // reRender() create store to record refresh status for each screen after Purchase i.e
        // once purchase is made set status for each screen seperatly
        // onNavigation Back refresh and reset status for each screen seperatly
        setTimeout(() => {
          navigation.canGoBack() ? navigation.pop() :
          returnScreen ? navigation.push(returnScreen) :
          navigation.push('CustomScreen')
        }, 2000);
      }

      setLoading(false)  

    })
    .catch((validationError)=>{ 
      setLoading(false)
      console.log('validationError: ', validationError)
    })    
   
  }
  
  getUniqueId().then((uniqueId) => {
    setUUID(uniqueId)
  }).catch((error) => {
  console.log('UUID: ', JSON.stringify(error))
  });

  useEffect(()=>{  
    if(Object.keys(isVerifyPayments).length > 0)
      storeVerifyPayment(isVerifyPayments)
    return()=>{}
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

  // console.log("loading: ",  loading);
  

  return (
    <Fragment >
      <SafeAreaView style= {{flex:0, backgroundColor:'#FF439E' }} />
      <SafeAreaView style= {{flex:1, backgroundColor:'#3386FF' }} >
        <View style={{ flex:1, backgroundColor:'#FF439E',}} >
          <ScrollView contentContainerStyle={{ marginTop:10 }} >
            
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',  paddingHorizontal:20 }} >
              <TouchableOpacity
                disabled={backBlocked}
                onPress={()=>{
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
                    disabled={ loading || products?.length==0 || subscription?.length==0 ? true : false}    
                    onPress={()=>{ setLoading(true); setRestore(true) }}>
                    <Text style={{color:'#ffffff', fontSize:RFValue(14), fontWeight:'400', marginLeft:RFValue(10), fontFamily:'Lucita-Regular', }} >Restore</Text>
                  </TouchableOpacity>
              </View>
            </View>
            <View style={{ alignItems:'center', marginTop:30 }}>
              <AppLogo width={RFValue(250)} height={RFValue(130)} />
              <View style={{ marginTop:40 }} >
                { Services.map((data:any, index:number)=>{
                    return(
                    <TouchableOpacity key={index} style={{flexDirection:'row', alignItems:'center', marginVertical:RFValue(5)  }}  >
                      {data.SVG}
                      <Text style={{color:'white', fontFamily:'Lucita-Regular', fontSize:RFValue(18), fontWeight:'900', paddingVertical:10 }} >{data.Label}</Text>
                    </TouchableOpacity>
                    )
                  })
                }
              </View>

              {/* Subscribe */}
              <View style={{alignItems:"center"}} >
                <Subcribe width={RFValue(250)} height={RFValue(35)} style={{marginTop:RFValue(20)}}/>
                <ArrowDown width={RFValue(30)} height={RFValue(30)} style={{alignSelf:'center', marginTop:-2}} />
                <TouchableOpacity 
                  disabled={(subscription?.length <1 || loading) ? true : false}  
                  onPress={() => {  if(subscription[0]?.productId){ handleSubscription()} }}  
                    style={{ borderWidth:4, borderColor:'#ffffff', backgroundColor:'#622FAE', padding:RFValue(15), borderRadius:RFValue(15), marginTop:RFValue(10) }} 
                
                >
                  <Text style={{color:'#ffffff', fontSize:RFValue(16), fontFamily:'Lucita-Regular' }} >Try Free & Subscribe</Text>
                </TouchableOpacity>
                <Text style={{color:'white', fontSize:RFValue(10), paddingTop:RFValue(5), fontFamily:'Lucita-Regular', alignSelf:'center' }} >3 day free trial. Then {subscription[0]?.localizedPrice} monthly</Text>
              </View>
            </View> 
            {(loading || products?.length==0 || subscription?.length==0) && 
              <ActivityIndicator size={'large'} color={'grey'} style={{position:'relative', top: RFValue(10), alignSelf:'center'}} />
            } 
          </ScrollView>  

          {/* Purchase */}
          <View style={{ alignItems:'center', backgroundColor:'#3386FF' }} >
            <TouchableOpacity 
              disabled={(products?.length <1 || loading) ? true : false}    
              onPress={() =>{ handlePurchase(products[0]?.productId) }} 
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


