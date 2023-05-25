import React, { Fragment, useEffect, useState } from 'react';
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, useWindowDimensions, Keyboard, } from 'react-native';
import AppLogo from "../assets/svgs/app-logo.svg";
import BackButton from "../assets/svgs/back-button.svg";
import Subcribe from "../assets/svgs/subcribe.svg";
import ArrowDown from "../assets/svgs/arrow-down.svg";
import GifsMemes from "../assets/svgs/gifs-memes.svg";
import NoAds from "../assets/svgs/no-ad's.svg";
import Information from "../assets/svgs/information.svg";
import Cross from "../assets/svgs/cross.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import { storeAppleAccessToken, storePaymentsReceipt, storeVerifyPayment } from '../store/asyncStorage';
import { usePostAppleAccessToken } from '../hooks/usePostAppleAccessToken';
import { AppModal } from '../iComponents/AppModal';

import {getProducts, getSubscriptions, getPurchaseHistory, purchaseUpdatedListener, requestPurchase, requestSubscription, useIAP, validateReceiptIos, finishTransaction, getAvailablePurchases, initConnection, endConnection} from 'react-native-iap';
import { getUniqueId } from 'react-native-device-info';


const SubscriptionScreen = ({navigation, route}:any) => {

  const returnScreen = route.params?.returnScreen
  // console.log('route.params: ',route.params);

  const [viewHeight, setViewHeight] = useState<number>(0)
  const [ratio, setRatio] = useState<number>(0)
  const { height } = useWindowDimensions()
  
  const Services =[
    {Label: "All gifs and memes!", SVG: <GifsMemes width={40*ratio} height={40*ratio} style={{marginRight:10*ratio}} /> },
    {Label: "No ads!", SVG: <NoAds width={40*ratio} height={40*ratio} style={{marginRight:10*ratio}} />  },
  ]


  // const { connected, initConnectionError } = useIAP();

  const [products, setProducts] = useState<any>([])
  const [subscriptions, setSubscriptions] = useState<any>([])
  const [connected, setConnected] = useState<boolean>(false)
  const [checkingSubscriptions, setCheckingSubscriptions] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)
  const [UUID, setUUID] = useState<string>('')
  const [isVerifyPayments, setVerifyPayments] = useState<any>({})
  const [isVisibleModal, setVisibleModal] = useState(false);

  let purchaseUpdated: any

  const getInitials = async () =>{

  await initConnection()
    .then(()=>{
      setConnected(true)
      getProducts({skus:["NoWatermarks"]})
        .then((productsResponse)=>{ 
          setProducts(productsResponse) 
        }).catch((currentPurchaseError)=>{ 
          console.log('getProductsError: ', currentPurchaseError) 
        })
    
      getSubscriptions({skus:["MonthlySubscription"]})
        .then((getSubscriptionsResponse)=>{ 
          setSubscriptions(getSubscriptionsResponse) 
        }).catch((currentPurchaseError)=>{ 
          console.log('getSubscriptionsError: ', currentPurchaseError) 
        })
      setLoading(false)
    }).catch((error)=>{
      setLoading(false)
      console.log('Not connected: ', error);
      getInitials()
    })
  }

  useEffect( ()=>{
    getInitials().catch((error)=>{
      console.log("getInitials: ", JSON.stringify(error))
    })
    return () => {
      purchaseUpdated?.remove()
      endConnection()
    };
  },[])
  
  useEffect(()=>{
  if(connected){
    getPurchaseHistory().then((purchases)=>{
      console.log('purchases: ', purchases.length); 
      const receipt = purchases[0].transactionReceipt
      if(receipt)
        validateReceipt(receipt)
      }).catch(()=>{
        setCheckingSubscriptions(false)
      })

    // getAvailablePurchases()
    //   .then((availableResponse)=>{
    //     console.log('availableResponse: ',availableResponse.length);   
    //   }).catch((availableError)=>{
    //     console.log('availableError: ', availableError);
    //   })

    purchaseUpdated = purchaseUpdatedListener((purchase)=>{
      try{
        const receipt = purchase?.transactionReceipt
        if(receipt){
          finishTransaction({purchase: purchase})
          .then((AckResult)=>{
            console.log('AckResult: ', AckResult);
            validateReceipt(receipt)    
          }).catch((AckResultError)=>{
            console.log('AckResultError: ', AckResultError);
          })
        }
      }
      catch{
        console.log('purchaseListener error');
      }
    })
  }
  else{
    console.log('Not connected')
  }
  },[connected])

  
  const validateReceipt = async (receipt: string)=>{

    await validateReceiptIos({ receiptBody: {"receipt-data": receipt, password: '8397e848fdbf458c9d81f1b742105789'}, isTest: true })
    .then((validationReponse)=>{ 
      // console.log("validationReponse: ", validationReponse.latest_receipt_info);
      
      // validationReponse.latest_receipt_info.map((data: any)=>{
      //   console.log(data?.product_id);
      // }) 
      storePaymentsReceipt({receipt: validationReponse.latest_receipt})
      getAppleAccessToken.mutate({receipt: validationReponse.latest_receipt})
      const renewal_history = validationReponse?.latest_receipt_info
      const expiration = renewal_history[1].expires_date_ms
      // console. log('expired: ', Date.now(), expiration);
      // console.log('renewal_history: ', renewal_history);
            
      // Apple expires subscription after 6 attempts in sandbox automatically
      // if (expired)
      // { console.log('expired');
      
      //   // Alert.alert("Purchased Expired", "Your monthly subscription has expired")
      // }
      // else{
          console.log(renewal_history[0]?.product_id, renewal_history[1]?.product_id);
          
          if(renewal_history[0]?.product_id === "NoWatermarks" && renewal_history[1]?.product_id ===  "MonthlySubscription")
            setVerifyPayments({ one_time: true, subcription: true })
          else if( renewal_history[0]?.product_id ===  "MonthlySubscription" && renewal_history[1]?.product_id === "NoWatermarks")
            setVerifyPayments({ one_time: true, subcription: true })
          else if(renewal_history[0]?.product_id === "NoWatermarks")
            setVerifyPayments({ one_time: true, subcription: false })
          else if (renewal_history[0]?.product_id ===  "MonthlySubscription")
            setVerifyPayments({ one_time: false, subcription: true })
      // }

      setCheckingSubscriptions(false)
    })
    .catch((validationError)=>{ 
      setCheckingSubscriptions(false)
      console.log('validationError: ', validationError)
    })    
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
        setLoading(false)
        console.log("purchaseReponse: ", purchaseReponse);
      })
      .catch((purchaseError)=>{
        setLoading(false)
        console.log('purchaseError: ', purchaseError);
      })
    }
  };

  const handleSubscription = async (sku: string) => {
    setLoading(true)
    if(subscriptions[0].productId = 'MonthlySubscription')
    {
      await requestSubscription({sku, appAccountToken: UUID})
      .then((subscriptionReponse)=>{
        setLoading(false)
        console.log("subscriptionReponse: ", subscriptionReponse);
      })
      .catch((subscriptionError)=>{
        setLoading(false)
        console.log('subscriptionError: ', subscriptionError);
      })
    }
  };  
 
  // const getter = async () =>{
    
  //   const receipt = await loadPaymentsReceipt().catch((error:any)=>{
  //     console.log('loadAppleAccessTokenFromStorage Error: ', error);
  //   })
  // }
  // useFocusEffect(
  //   React.useCallback(() => {
  //     getter()
  //   }, []),
  // );

  getUniqueId()
  .then((uniqueId) => {
    setUUID(uniqueId)
  })
  .catch((error) => {
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

  useEffect(()=>{
    let denomi = height-(height*0.15)
    setRatio(viewHeight/denomi)
  },[viewHeight])


  
  return (
    <Fragment >
      {/* <SafeAreaView style= {{flex:0, backgroundColor:'#FF439E' }} /> */}
      <SafeAreaView 
        onLayout={(event) => {
          var {x, y, width, height} = event.nativeEvent.layout;
          setViewHeight(height)
        }}
        style= {{flex:1, backgroundColor:'#3386FF' }} >
        
        <View style={{ flex:1, backgroundColor:'#FF439E',}} >
          {/* Body */}
          <ScrollView 
            contentContainerStyle={{ marginTop:10, paddingBottom:20, width:'100%' }}
            showsVerticalScrollIndicator={false}  
          >
            
            <View style={{flexDirection:'row', justifyContent:'space-between', alignSelf:'center', width:`${85}%`,  paddingHorizontal:20*ratio }} >
              <TouchableOpacity onPress={()=>{
                navigation.canGoBack() ? navigation.pop() :
                returnScreen ? navigation.push(returnScreen) :
                navigation.push('CustomScreen')
              }} 
              >
                <BackButton width={RFValue(25*ratio)} height={RFValue(25*ratio)}/>
              </TouchableOpacity>
              
              <View style={{flexDirection:'row', alignItems:'center', }}  >
                <TouchableOpacity onPress={()=>{ setVisibleModal(!isVisibleModal) }} >
                  <Information width={RFValue(22*ratio)} height={RFValue(22*ratio)}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{ 
                  // deepLinkToSubscriptions({sku:subscriptions[0].productId, isAmazonDevice:false})
                  // .then((response)=>{ console.log('SubResp: ', response) })
                  // .catch((error)=>{ 
                  //   console.log('SubError: ', error)
                  //   openLink('https://apps.apple.com/account/subscriptions')
                  // })
                 }}>
                  <Text style={{color:'#ffffff', fontSize:RFValue(14*ratio), fontWeight:'400', marginLeft:RFValue(10*ratio), fontFamily:'Lucita-Regular', }} >Restore</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ alignItems:'center', marginTop:30*ratio }}>
              <AppLogo width={RFValue(250*ratio)} height={RFValue(130*ratio)} />
              <View style={{ marginTop:40*ratio }} >
                { Services.map((data:any, index:number)=>{
                    return(
                    <TouchableOpacity key={index} style={{flexDirection:'row', alignItems:'center', marginVertical:RFValue(10*ratio)  }}  >
                      {data.SVG}
                      <Text style={{color:'white', fontFamily:'Lucita-Regular', fontSize:RFValue(18*ratio), paddingVertical: RFValue(10*ratio) }} >{data.Label}</Text>
                    </TouchableOpacity>
                    )
                  })
                }
              </View>
              {(loading || checkingSubscriptions) && <ActivityIndicator size={'small'} color={'blue'} style={{marginTop:10*ratio, }} />}
              <Subcribe width={RFValue(230*ratio)} height={RFValue(30*ratio)} style={{marginTop:RFValue(20*ratio)}}/>
              <ArrowDown width={RFValue(30*ratio)} height={RFValue(30*ratio)} style={{alignSelf:'center', marginTop:-2*ratio}} />
              <TouchableOpacity onPress={() => {
                // isVerifyPayments?.subcription ? 
                // Alert.alert("Auto-renewable subscription is active") :
                handleSubscription(subscriptions[0]?.productId) }}  
                style={{ borderWidth:4, borderColor:'#ffffff', backgroundColor:'#622FAE', padding:RFValue(15*ratio), borderRadius:RFValue(15), marginTop:RFValue(10*ratio) }} 
                disabled={(subscriptions.length <1 || loading) ? true : false}  
              >
                <Text style={{color:'#ffffff', fontSize:RFValue(20*ratio), fontFamily:'Lucita-Regular' }} >Try Free & Subscribe</Text>
              </TouchableOpacity>
              <Text style={{color:'white', fontSize:RFValue(10*ratio), paddingTop:RFValue(5*ratio), fontFamily:'Lucita-Regular', alignSelf:'center' }} >3 day free trial. Then {subscriptions[0]?.localizedPrice} monthly</Text>
            </View> 
          </ScrollView>  

          {/* Footer */}
          <View style={{ alignItems:'center', backgroundColor:'#3386FF', }} >
            <TouchableOpacity 
              onPress={() =>{ 
                // isVerifyPayments?.one_time ? 
                // Alert.alert("No Watermarks already purchased") :
                handlePurchase(products[0]?.productId) 
              }} 
              style={{flexDirection:'row', alignItems:'center', backgroundColor:'#ffffff', padding:RFValue(12*ratio), borderRadius:RFValue(15), marginTop:RFValue(20*ratio) }} 
              disabled={(products.length <1 || loading) ? true : false}    
            >
              <Text style={{color:'#622FAE', fontSize:RFValue(12*ratio),  fontFamily:'Lucita-Regular', }} >No Watermarks   </Text>
              <Text style={{color:'#622FAE', fontSize:RFValue(12*ratio), fontFamily:'Lucita-Regular', }} >{products[0]?.localizedPrice}</Text>
            </TouchableOpacity>
            <Text style={{color:'#ffffff', fontSize:RFValue(10*ratio), fontFamily:'Lucita-Regular', alignSelf:'center', paddingTop: RFValue(5*ratio) }} >one time purchase</Text>
          </View>
        </View>

      {/* Subscription Information Modal */}
      <AppModal isVisible={isVisibleModal} setModalVisible = {setVisibleModal} >
        <AppModal.Container >
          <AppLogo width={RFValue(150*ratio)} height={RFValue(60*ratio)} style={{alignSelf:'center', marginVertical:20*ratio}} />
          <TouchableOpacity onPress={()=>setVisibleModal(false)}  style={{ position:'absolute', right:RFValue(10*ratio), top:RFValue(10*ratio) }}  >
            <Cross width={RFValue(22*ratio)} height={RFValue(22*ratio)} style={{alignSelf:'flex-end'}}/>
          </TouchableOpacity>
          <AppModal.Header title="Terms and Conditions" ratio={ratio}  />
          <AppModal.Body ratio={ratio} >
            <View style={{ margin:10*ratio }} >
              <Text style={{ fontFamily:'Lucita-Regular', color:'#ffffff', fontSize: RFValue(12*ratio), textAlign:'justify', lineHeight:20*ratio }}>
              Subscription renews monthly or annually. Payment will be charged to iTunes account at confirmation of purchase. Subscription automaticlaly renews unless the automatic-renew is turned off at least 24 hours before the end of the current period. Account will be charged for renewal within 24 hours prior to the end of the current period, and identify the cost of the renewal subscription may be managed by the user and auto-renewal may be turned off by going to the user’s Account Settings after purchase. Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that application. By signing up for subscription, you agree to our <Text style={{fontFamily:'Lucita-Regular', fontSize: RFValue(12*ratio), color:'#FEB720'}}>terms and conditions</Text> and  <Text style={{fontFamily:'Lucita-Regular', fontSize: RFValue(12*ratio), color:'#FEB720'}}>privacy policy</Text>.
              </Text>
            </View>
          </AppModal.Body>
        </AppModal.Container>
      </AppModal>
      </SafeAreaView>
    </Fragment>    
  );
};

 

export default SubscriptionScreen;
