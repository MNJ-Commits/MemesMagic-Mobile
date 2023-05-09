import React, { Fragment } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, } from 'react-native';
import AppLogo from "../assets/svgs/app-logo.svg";
import BackButton from "../assets/svgs/back-button.svg";
import Subcribe from "../assets/svgs/subcribe.svg";
import ArrowDown from "../assets/svgs/arrow-down.svg";
import GifsMemes from "../assets/svgs/gifs-memes.svg";
import NoWatermarks from "../assets/svgs/no-watermarks.svg";
import NoAds from "../assets/svgs/no-ad's.svg";
import Information from "../assets/svgs/information.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import ApplePay, { MethodData, DetailsData, ShippingDetails, TransactionIdentifier } from "react-native-apple-payment";



const SubcriptionScreen = ({navigation}:any) => {

  
  const Services =[
    {Label: "All gifs and memes!", SVG: <GifsMemes width={40} height={40} style={{marginRight:10}} /> },
    {Label: "No ads!", SVG: <NoAds width={40} height={40} style={{marginRight:10}} />  },
  ]

  const Method: MethodData = {
    countryCode: 'US',
    currencyCode: 'USD',
    merchantIdentifier: 'merchant.com.MemesWork',
    supportedNetworks: ['Visa', 'MasterCard', 'AmEx'],
  };
  
  const DataDetails: DetailsData = {
    total: {
      label: 'Memes Magic',
      amount: 19.99,
    },
  };

  const payment: any = new ApplePay(Method, DataDetails, );

  const pay = () => {
    payment.canMakePayments().then(async (canMakePayment: any) => {
      if (canMakePayment) {
        console.log('Can Make Payment')
        await payment.initApplePay()
          .then((paymentResponse: any) => {
            // Your payment processing code goes here
            () => navigation.navigate('ApplePayScreen')
            console.log('paymentResponse: ', paymentResponse);
          }).catch((e:any)=>{
            console.log('error 1: ', e);
          });
      }
      else {
        console.log('Cant Make Payment')
      }
    }).catch((e:any)=>{
      console.log('error 2: ', e);
      
    })
  }
  return (
    <Fragment >
      <SafeAreaView style= {{flex:0, backgroundColor:'#FF439E' }} />
      <SafeAreaView style= {{flex:1, backgroundColor:'#3386FF' }} >
        <View style={{ flex:1, backgroundColor:'#FF439E',}} >
          <ScrollView contentContainerStyle={{ marginTop:10 }} >
            
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',  paddingHorizontal:20 }} >
              <TouchableOpacity onPress={()=>{navigation.goBack()}} >
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
              
              <TouchableOpacity onPress={() => {pay
              // navigation.navigate('ApplePayScreen')
              }}  style={{ borderWidth:4, borderColor:'#ffffff', backgroundColor:'#622FAE', padding:RFValue(15), borderRadius:RFValue(15), marginTop:RFValue(10)    }} >
                <Text style={{color:'#ffffff', fontSize:RFValue(20), fontWeight:'bold' }} >Try Free & Subscribe</Text>
              </TouchableOpacity>
              <Text style={{color:'white', fontSize:RFValue(12), marginTop:RFValue(2), fontWeight:'bold', alignSelf:'center' }} >3 day free trial. Then $9.99 monthly</Text>
            </View> 
          </ScrollView>  
          <View style={{ alignItems:'center', backgroundColor:'#3386FF', paddingVertical:20 }} >
            <TouchableOpacity 
              onPress={pay} 
              style={{flexDirection:'row', alignItems:'center', backgroundColor:'#ffffff', padding:RFValue(12), borderRadius:RFValue(15), marginTop:RFValue(20)    }} >
              <Text style={{color:'#622FAE', fontSize:RFValue(12), fontWeight:'bold' }} >No Watermarks   </Text>
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




// <View style={{alignSelf:'center', width:"70%", }} > 
//   <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:RFValue(50)}} >
//     <TouchableOpacity style={{borderWidth:RFValue(3), borderColor:'#ffffff', backgroundColor:'#FEB720', padding:RFValue(15), borderRadius:RFValue(15)  }} >
//       <Text style={{color:'white', fontSize:RFValue(12), fontWeight:'normal' }} >19.99/ year</Text>
//     </TouchableOpacity>
//     <SaveBig width={RFValue(50)} height={RFValue(50)} style={{position:'absolute', top:RFValue(-20), left:RFValue(-10) }} />
//     <TouchableOpacity style={{borderWidth:RFValue(3), borderColor:'#ffffff', backgroundColor:'#FEB720', padding:RFValue(15), borderRadius:RFValue(15)  }} >
//       <Text style={{color:'white', fontSize:RFValue(12), fontWeight:'normal' }} >4.99/ month</Text>
//     </TouchableOpacity>
//   </View>
//   <TouchableOpacity onPress={() => navigation.navigate('CustomScreen')} style={{alignItems:'center', borderWidth:4, borderColor:'#ffffff', backgroundColor:'#FEB720', padding:RFValue(8), borderRadius:RFValue(15), marginTop:RFValue(20)    }} >
//     <Text style={{color:'#8733FF', fontSize:RFValue(20), fontWeight:'400' }} >Subscribe Now!</Text>
//     <Text style={{color:'white', fontSize:RFValue(10), fontWeight:'normal' }} >With 3days FREE TRIAL!</Text>
//   </TouchableOpacity>
// </View>