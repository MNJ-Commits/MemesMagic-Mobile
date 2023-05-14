import React, { Fragment, useEffect, useState } from 'react';
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity, Linking, Alert, } from 'react-native';
import AppLogo from "../assets/svgs/app-logo.svg";
import BackButton from "../assets/svgs/back-button.svg";
import Subcribe from "../assets/svgs/subcribe.svg";
import ArrowDown from "../assets/svgs/arrow-down.svg";
import GifsMemes from "../assets/svgs/gifs-memes.svg";
import NoAds from "../assets/svgs/no-ad's.svg";
import Information from "../assets/svgs/information.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { loadAppleAccessTokenFromStorage, loadAppleAuthFromStorage, loadVerifyPaymentFromStorage, storeAppleAccessToken, storeAppleAuth, storeVerifyPayment } from '../store/asyncStorage';
import { usePostAppleAccessToken } from '../hooks/usePostAppleAccessToken';
import { usePostAppleSubcribe } from '../hooks/usePostAppleSubcribe';
import { usePostAppleOneTime } from '../hooks/usePostAppleOneTime';
import { useFocusEffect } from '@react-navigation/native';
// import { useGetPaymentVerification } from '../hooks/useGetPaymentVerification';



const SubcriptionScreen = ({navigation, route}:any) => {

  const returnScreen = route.params?.returnScreen
  // console.log('route.params: ',route.params);
  
  const [authData, setAuthData] = useState<any>({})
  const [appleAccessToken, setAppleAccessToken] = useState<string>('')
  
  const Services =[
    {Label: "All gifs and memes!", SVG: <GifsMemes width={40} height={40} style={{marginRight:10}} /> },
    {Label: "No ads!", SVG: <NoAds width={40} height={40} style={{marginRight:10}} />  },
  ]

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
    console.log('verifyPayment: ', verifyPayment);
  };
 
  useFocusEffect(
    React.useCallback(() => {
      getter().catch((error:any)=>{
        console.log('getter Error: ', error);
      })
      // console.log(authData ? authData : null);
      // console.log('appleAccessToken: ', appleAccessToken);
    }, [appleAccessToken]),
  );

  async function onAppleButtonPress() {
    // console.log('appleAuth.isSupported: ', appleAuth.isSupported);    
    if( appleAuth.isSupported){
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      }).then((performLoginResponse:any)=>{
        storeAppleAuth({identity_token: performLoginResponse.identityToken, user_id: performLoginResponse.user})
        getAppleAccessToken.mutate({identity_token: performLoginResponse.identityToken, user_id: performLoginResponse.user})
      }).catch((performLoginrror:any)=>{
        console.log('performLoginError: ', performLoginrror);
      });
      console.log('appleAuthRequestResponse: ', appleAuthRequestResponse);
    } 
  }

  const getAppleAccessToken: any = usePostAppleAccessToken({
    onSuccess(res) { 
      // console.log('getAppleAccessToken: ', res.access_token);
     storeAppleAccessToken(res.access_token)
     setAppleAccessToken(res.accessToken) 
    },
    onError(error) {
      console.log(error);
    },
  }); 
   
  const getAppleSubcribe: any = usePostAppleSubcribe({
    onSuccess(res) { 
      console.log('getAppleSubcribe: ', res);
      openURL(encodeURIComponent(res.redirect))
    },
    onError(error) {
      console.log('getAppleSubcribe error: ', error);
    },
  });  
  const getAppleOneTime: any = usePostAppleOneTime({
    onSuccess(res) { 
      console.log('getAppleOneTime: ', res);
      openURL(encodeURIComponent(res.redirect))
    },
    onError(error) {
      console.log(error);
    },
  });  

  // Open Redirect Link
  const openURL = (redirect: string) => {

    Linking.canOpenURL(redirect).then(async supported => {
      if (supported) {
        await Linking.openURL(redirect)
        .catch((error)=>{
          console.log('Linking openURL error: ', error);
        });
      }
      else {
        console.log("Don't know how to open URI: " + redirect);
      }
    })
    .catch((error)=>{
      console.log('Linking canOpenURL error: ', error);
    })
  }

  // Open Deep Link
  useEffect(() => {
    console.log(authData);
    getUrlAsync();
  }, [])
  const getUrlAsync = async () => {

    // Get the deep link used to open the app
    await Linking.getInitialURL().then((url) => {
      console.log('getInitialURL: ',url) 
      if(url?.includes('paymentType=subcribed') ){ 
        storeVerifyPayment({one_time: false, subcription: true }) 
      }
      else if(url?.includes("paymentType=oneTime") ){
        storeVerifyPayment({one_time: true, subcription: false })
      }
    })

    // Listen to the deep link if app it is already open
    Linking.addEventListener('url',(url)=>{ 
      if(url.url?.includes("paymentType=oneTime") )
        { 
          storeVerifyPayment({one_time:true, subcription: false })
        }
      else if(url.url?.includes('paymentType=subcribed')){
        storeVerifyPayment({one_time: false, subcription: true })
      }
    });
  }  

  if(!authData)
    onAppleButtonPress()

    
  return (
    <Fragment >
      <SafeAreaView style= {{flex:0, backgroundColor:'#FF439E' }} />
      <SafeAreaView style= {{flex:1, backgroundColor:'#3386FF' }} >
        <View style={{ flex:1, backgroundColor:'#FF439E',}} >
          <ScrollView contentContainerStyle={{ marginTop:10 }} >
            
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',  paddingHorizontal:20 }} >
              <TouchableOpacity onPress={()=>{
                // navigation.goBack()

                navigation.navigate(returnScreen ? returnScreen : 'CustomScreen')

                // navigation.navigate(returnScreen ? returnScreen : 'CustomScreen', 
                // route.params?.giphy ? {src:route.params.src, width:route.params?.width, height:route.params.height, giphy: route.params.giphy, src2: route.params?.scr2, returnScreen:'BannerScreen'} 
                // : route.params?.defaultText ? {src:route.params?.src, width:route.params?.width, height:route.params?.height, uid: route.params.uid, defaultText: route.params?.defaultText, returnScreen:'CustomScreen'} 
                // : null
                // )
              }} 
              >
                <BackButton width={RFValue(25)} height={RFValue(25)}/>
              </TouchableOpacity>
              <View style={{flexDirection:'row', alignItems:'center', }}  >
                <TouchableOpacity onPress={()=>{ }} >
                  <Information width={RFValue(22)} height={RFValue(22)}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{ }} >
                  <Text style={{color:'#ffffff', fontSize:RFValue(14), fontWeight:'400', marginLeft:RFValue(10) }} >Restore</Text>
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
              <TouchableOpacity onPress={() => {
                authData && appleAccessToken ?
                  getAppleSubcribe.mutate({access_token: appleAccessToken}) :
                authData ? 
                  getAppleAccessToken.mutate({ ...authData}) :
                onAppleButtonPress()
              }}  style={{ borderWidth:4, borderColor:'#ffffff', backgroundColor:'#622FAE', padding:RFValue(15), borderRadius:RFValue(15), marginTop:RFValue(10)    }} >
                <Text style={{color:'#ffffff', fontSize:RFValue(20), fontWeight:'bold' }} >Try Free & Subscribe</Text>
              </TouchableOpacity>
              <Text style={{color:'white', fontSize:RFValue(12), marginTop:RFValue(2), fontWeight:'bold', alignSelf:'center' }} >3 day free trial. Then $9.99 monthly</Text>
            </View> 
          </ScrollView>  
          <View style={{ alignItems:'center', backgroundColor:'#3386FF', paddingVertical:20 }} >
            <TouchableOpacity 
              onPress={() => {
                authData && appleAccessToken ?
                  getAppleOneTime.mutate({access_token: appleAccessToken}) :
                authData ? 
                  getAppleAccessToken.mutate({ ...authData}) :
                onAppleButtonPress()
              }} 
              style={{flexDirection:'row', alignItems:'center', backgroundColor:'#ffffff', padding:RFValue(12), borderRadius:RFValue(15), marginTop:RFValue(20)    }} >
              <Text style={{color:'#622FAE', fontSize:RFValue(12),  fontFamily:'Lucita-Regular', }} >No Watermarks   </Text>
              <Text style={{color:'#622FAE', fontSize:RFValue(8), fontWeight:'bold' }} >$19.99</Text>
            </TouchableOpacity>
            <Text style={{color:'#ffffff', fontSize:RFValue(8), fontWeight:'bold', alignSelf:'center' }} >one time purchase</Text>
          </View>
        </View>
      </SafeAreaView>
    </Fragment>    
  );
};

 

export default SubcriptionScreen;
