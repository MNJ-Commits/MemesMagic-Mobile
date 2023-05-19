import React, { Fragment, useEffect, useState } from 'react';
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity, Linking, Alert, } from 'react-native';
import AppLogo from "../assets/svgs/app-logo.svg";
import BackButton from "../assets/svgs/back-button.svg";
import Subcribe from "../assets/svgs/subcribe.svg";
import ArrowDown from "../assets/svgs/arrow-down.svg";
import GifsMemes from "../assets/svgs/gifs-memes.svg";
import NoAds from "../assets/svgs/no-ad's.svg";
import Information from "../assets/svgs/information.svg";
import Cross from "../assets/svgs/cross.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { loadAppleAccessTokenFromStorage, loadAppleAuthFromStorage, loadVerifyPaymentFromStorage, storeAppleAccessToken, storeAppleAuth, storeVerifyPayment } from '../store/asyncStorage';
import { usePostAppleAccessToken } from '../hooks/usePostAppleAccessToken';
import { usePostAppleSubcribe } from '../hooks/usePostAppleSubcribe';
import { usePostAppleOneTime } from '../hooks/usePostAppleOneTime';
import { useFocusEffect } from '@react-navigation/native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { AppModal } from '../components/AppModal';


// import * as RNIap from 'react-native-iap'
import {requestPurchase, requestSubscription, useIAP} from 'react-native-iap';


const SubscriptionScreen = ({navigation, route}:any) => {

  const returnScreen = route.params?.returnScreen
  // console.log('route.params: ',route.params);
  
  const [authData, setAuthData] = useState<any>({})
  const [appleAccessToken, setAppleAccessToken] = useState<string>('')
  const [isVerifyPayments, setVerifyPayments] = useState<any>({})
  const [termAndCond, setTermAndCond] = useState<boolean>(false)
  const [isVisibleModal, setVisibleModal] = useState(false);


  const Services =[
    {Label: "All gifs and memes!", SVG: <GifsMemes width={40} height={40} style={{marginRight:10}} /> },
    {Label: "No ads!", SVG: <NoAds width={40} height={40} style={{marginRight:10}} />  },
  ]



  const {
    connected,
    products,
    promotedProductsIOS,
    subscriptions,
    availablePurchases,
    currentPurchase,
    currentPurchaseError,
    initConnectionError,
    finishTransaction,
    getProducts,
    getSubscriptions,
    getAvailablePurchases,
  } = useIAP();

  // console.log('availablePurchases: ', currentPurchase, availablePurchases);
  
  useEffect(()=>{
  
  if(connected){
    console.log('Connected: ', connected);
    
    getProducts({skus:["NoWatermarks"]})
    .then(()=>{ console.log('getProductsReponse: ', products) })
    .catch((currentPurchaseError)=>{ console.log('getProductsError: ', currentPurchaseError) })
    
    getSubscriptions({skus:["MonthlySubscription"]})
    .then(()=>{ console.log('getSubscriptionsResponse: ', subscriptions) })
    .catch((currentPurchaseError)=>{ console.log('getSubscriptionsError: ', currentPurchaseError) })
    
    getAvailablePurchases()
    .then((availablePurchasesResponse)=>{ console.log('availablePurchasesResponse: ', availablePurchasesResponse) })
    .catch((availablePurchasesError)=>{ console.log('availablePurchasesError: ', availablePurchasesError) })
    
  } 
  else{
    console.log('Not connected: ', initConnectionError);
  }
},[connected])
  

  const handlePurchase = async (sku: string) => {
    console.log('handlePurchase: ');
    
    if(products[0].productId=='NoWatermarks')
    {
      await requestPurchase({
        sku,
        andDangerouslyFinishTransactionAutomaticallyIOS: false
      })
      .then((purchaseReponse)=>{
        console.log("purchaseReponse: ", purchaseReponse);
      })
      .catch((purchaseError)=>{
        console.log('purchaseError: ', purchaseError);
      })
    }
  };

  const handleSubscription = async (sku: string) => {
    console.log('handleSubscription');
    
    if(subscriptions[0].productId = 'MonthlySubscription')
    {
      await requestSubscription({sku})
      .then((subscriptionReponse)=>{
        console.log("subscriptionReponse: ", subscriptionReponse);
      })
      .catch((subscriptionError)=>{
        console.log('subscriptionError: ', subscriptionError);
      })
    }
  };

  const getter = async () => {
    
    const appleAuth = await loadAppleAuthFromStorage().catch((error:any)=>{
      console.log('loadAppleAuthFromStorage Error: ', error);
    })
    setAuthData(appleAuth)
    
    const accessToken = await loadAppleAccessTokenFromStorage().catch((error:any)=>{
      console.log('loadAppleAccessTokenFromStorage Error: ', error);
    })
    setAppleAccessToken(accessToken) 

    const verifyPayment = await loadVerifyPaymentFromStorage().catch((error:any)=>{
      console.log('loadVerifyPaymentFromStorage Error: ', error);
    })
    setVerifyPayments(verifyPayment)
    // console.log('verifyPayment: ', verifyPayment);
  };
 
  // useFocusEffect(
  //   React.useCallback(() => {
  //     getter().catch((error:any)=>{
  //       console.log('getter Error: ', error);
  //     })
  //     storeAppleAuth({identity_token: performLoginResponse.identityToken, user_id: performLoginResponse.user})
  //   }, [appleAccessToken]),
  // );


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
                <TouchableOpacity onPress={()=>{ }} >
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
              <Subcribe width={RFValue(230)} height={RFValue(30)} style={{marginTop:RFValue(30)}}/>
              <ArrowDown width={RFValue(30)} height={RFValue(30)} style={{alignSelf:'center', marginTop:-2}} />
              <TouchableOpacity onPress={() => { handleSubscription(subscriptions[0].productId) }}  style={{ borderWidth:4, borderColor:'#ffffff', backgroundColor:'#622FAE', padding:RFValue(15), borderRadius:RFValue(15), marginTop:RFValue(10)    }} >
                <Text style={{color:'#ffffff', fontSize:RFValue(20), fontFamily:'Lucita-Regular' }} >Try Free & Subscribe</Text>
              </TouchableOpacity>
              <Text style={{color:'white', fontSize:RFValue(10), paddingTop:RFValue(5), fontFamily:'Lucita-Regular', alignSelf:'center' }} >3 day free trial. Then $9.99 monthly</Text>
            </View> 
          </ScrollView>  
          <View style={{ alignItems:'center', backgroundColor:'#3386FF', paddingVertical:20 }} >
            <TouchableOpacity 
              onPress={() =>{ handlePurchase(products[0].productId) }} 
              style={{flexDirection:'row', alignItems:'center', backgroundColor:'#ffffff', padding:RFValue(12), borderRadius:RFValue(15), marginTop:RFValue(20)    }} >
              <Text style={{color:'#622FAE', fontSize:RFValue(12),  fontFamily:'Lucita-Regular', }} >No Watermarks   </Text>
              <Text style={{color:'#622FAE', fontSize:RFValue(12), fontFamily:'Lucita-Regular', }} >$19.99</Text>
            </TouchableOpacity>
            <Text style={{color:'#ffffff', fontSize:RFValue(10), fontFamily:'Lucita-Regular', alignSelf:'center', paddingTop: RFValue(5) }} >one time purchase</Text>
          </View>
        </View>

      {/* Subscription Information Modal */}
      <AppModal isVisible={isVisibleModal} setModalVisible = {setVisibleModal}  >
        <AppModal.Container >
          <AppLogo width={RFValue(150)} height={RFValue(60)} style={{alignSelf:'center', marginVertical:20}} />
          <TouchableOpacity onPress={()=>setVisibleModal(false)}  style={{ position:'absolute', right:RFValue(10), top:RFValue(10) }}  >
            <Cross width={RFValue(22)} height={RFValue(22)} style={{alignSelf:'flex-end'}}/>
          </TouchableOpacity>
          <AppModal.Header title="Terms and Conditions" />
          <AppModal.Body>
            <View style={{ marginTop:10 }} >
              <Text style={{ fontFamily:'Lucita-Regular', color:'#ffffff', fontSize: RFValue(12), textAlign:'justify', lineHeight:20 }}>
              Subscription renews monthly or annually. Payment will be charged to iTunes account at confirmation of purchase. Subscription automaticlaly renews unless the automatic-renew is turned off at least 24 hours before the end of the current period. Account will be charged for renewal within 24 hours prior to the end of the current period, and identify the cost of the renewal subscription may be managed by the user and auto-renewal may be turned off by going to the user’s Account Settings after purchase. Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that application. By signing up for subscription, you agree to our <Text style={{fontFamily:'Lucita-Regular', fontSize: RFValue(12), color:'#FEB720'}}>terms and conditions</Text> and  <Text style={{fontFamily:'Lucita-Regular', fontSize: RFValue(12), color:'#FEB720'}}>privacy policy</Text>.
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
