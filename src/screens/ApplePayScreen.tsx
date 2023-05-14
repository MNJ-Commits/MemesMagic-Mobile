import React, { Fragment, useEffect } from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, Alert, TouchableOpacity} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import BackButton from "../assets/svgs/back-button.svg";
import { RFValue } from 'react-native-responsive-fontsize';
// import ApplePay, { MethodData, DetailsData, ShippingDetails, TransactionIdentifier } from "react-native-apple-payment";

// // react-native-payments
// const PaymentRequest = require('react-native-payments').PaymentRequest;

// const METHOD_DATA = [{
//     supportedMethods: ['apple-pay'],
//     data: {
//       merchantIdentifier: 'merchant.com.MemesWork',
//       supportedNetworks: ['visa', 'mastercard', 'amex'],
//       countryCode: 'US',
//       currencyCode: 'USD'
//     }
//   }];
// const DETAILS = {
//   id: 'basic-example',
//   displayItems: [
//     {
//       label: 'Movie Ticket',
//       amount: { currency: 'USD', value: '15.00' }
//     },
//     {
//       label: 'Grocery',
//       amount: { currency: 'USD', value: '5.00' }
//     }
//   ],
//   shippingOptions: [{
//     id: 'economy',
//     label: 'Economy Shipping',
//     amount: { currency: 'USD', value: '0.00' },
//     detail: 'Arrives in 3-5 days' // `detail` is specific to React Native Payments
//   }],
//   total: {
//     label: 'Enappd Store',
//     amount: { currency: 'USD', value: '20.00' }
//   }
// };
// const OPTIONS = {
//     requestPayerName: true,
//     requestPayerPhone: true,
//     requestPayerEmail: true,
//     requestShipping: true
// };

// const paymentRequest:any = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);

// const check = () => {
//   paymentRequest.canMakePayments().then((canMakePayment:any) => {
//     if (canMakePayment) {
//       Alert.alert(
//         'Apple Pay',
//         'Apple Pay is available in this device'
//       );
//     }
//   })
// }

// const pay = () => {
//     paymentRequest.canMakePayments().then((canMakePayment:any) => {
//     if (canMakePayment) {
//       paymentRequest.show()
//         .then((paymentResponse:any)=> {
//           // Your payment processing code goes here
//           console.log('paymentResponse: ',paymentResponse);
          
//           // paymentResponse.complete('success');
//         }).catch((e:any)=>{
//           console.log('error show payment: ', e);
//         })
//     }
//     else {
//       console.log('Cant Make Payment')
//     }
//   }).catch((e:any)=>{
//     console.log('error can make payment: ', e);
//   });
// }



// react-native-apple-payment





// const Method: MethodData = {
//   countryCode: 'US',
//   currencyCode: 'USD',
//   merchantIdentifier: 'merchant.com.MemesWork',
//   supportedNetworks: ['Visa', 'MasterCard', 'AmEx'],
// };

// const DataDetails: DetailsData = {
//   total: {
//     label: 'Memes Magic',
//     amount: 19.99,
//   },
// };
 
// const ShipmentDetails: ShippingDetails = {
//   type: 'shipping',
//   contact: {
//     name: 'Yevhenii Onipko',
//     postalAddress: '01111',
//     phoneNumber: '380971234567',
//     emailAddress: 'dummy@gmail.com',
//   },
//   methods: {
//     identifier: 'merchant.com.MemesWork',
//     detail: 'Arrives, Friday 7 Apr.'
//   },
// }

// const payment: any = new ApplePay(Method, DataDetails, ShipmentDetails);


// const check = async () => {    
//   await payment.canMakePayments().then((canMakePayment: any) => {
//     if (canMakePayment) {
//       Alert.alert(
//         'Apple Pay',
//         'Apple Pay is available in this device'
//       );
//     }
//   })
// }

// const pay = () => {
//   payment.canMakePayments().then(async (canMakePayment: any) => {
//     if (canMakePayment) {
//       console.log('Can Make Payment')
//       await payment.initApplePay()
//         .then((paymentResponse: any) => {
//           // Your payment processing code goes here
//           console.log('paymentResponse: ', paymentResponse);
          
//           // paymentResponse.complete('success');
//         }).catch((e:any)=>{
//           console.log('error 1: ', e);
//         });
//     }
//     else {
//       console.log('Cant Make Payment')
//     }
//   }).catch((e:any)=>{
//     console.log('error 2: ', e);
    
//   })
// }


const ApplePayScreen = ({navigation}:any) => {

  
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView>
        <TouchableOpacity onPress={()=>{navigation.goBack()}} >
            <BackButton width={RFValue(25)} height={RFValue(25)}/>
        </TouchableOpacity>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Check</Text>
              <Text style={styles.sectionDescription}>
                Ideally, you should check if Apple Pay is enable in background, and then accordingly call the payment method.
                Showing here on button action for demo purpose.
              </Text>
              <Button
                // onPress={check}
                title="Check Apple Pay"
              />
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <View>
                <Text style={styles.sectionTitle}>Cart</Text>
                <Text style={styles.sectionDescription}>
                  Simulating your cart items in an app
              </Text>
              </View>
            </View>
            <View style={styles.itemContainer}>
              <View style={styles.itemDetail}>
                <Text style={styles.itemTitle}>Movie Ticket</Text>
                <Text style={styles.itemDescription}>
                  Some description
              </Text>
              </View>
              <View style={styles.itemPrice}>
                <Text>USD 15.00</Text>
              </View>
            </View>
            <View style={styles.itemContainer}>
              <View style={styles.itemDetail}>
                <Text style={styles.itemTitle}>Grocery</Text>
                <Text style={styles.itemDescription}>
                  Some description
              </Text>
              </View>
              <View style={styles.itemPrice}>
                <Text>USD 5.00</Text>
              </View>
            </View>
            <View style={styles.totalContainer}>
              <View style={styles.itemDetail}>
                <Text style={styles.itemTitle}>Total</Text>
              </View>
              <View style={styles.itemPrice}>
                <Text>USD 20.00</Text>
              </View>
            </View>
            <Button
              title="Pay with Apple Pay"
              // onPress={pay} 
              />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  scrollView: { backgroundColor: Colors.lighter},
  engine: { position: 'absolute', right: 0},
  body: {backgroundColor: Colors.white, borderBottomColor: "#cccccc", borderBottomWidth: 1, paddingBottom: 10},  
  sectionContainer: { marginTop: 32, paddingHorizontal: 24 },  
  itemContainer: {marginTop: 12,paddingHorizontal: 24,display: "flex",flexDirection: 'row'},
  totalContainer: {marginTop: 12,paddingHorizontal: 24,display: "flex",flexDirection: 'row',borderTopColor: "#cccccc",borderTopWidth: 1,paddingTop: 10,marginBottom: 20},
  itemDetail: {flex: 2},
  itemTitle: {fontWeight: '500',fontSize: 18},
  itemDescription: {fontSize: 12},
  itemPrice: {flex: 1},
  sectionTitle: {fontSize: 24,fontWeight: '600',color: Colors.black,},
  sectionDescription: {marginTop: 8,fontSize: 12,fontWeight: '400',color: Colors.dark,},
  highlight: {fontWeight: '700',},
  footer: {color: Colors.dark,fontSize: 12,fontWeight: '600',padding: 4,paddingRight: 12,textAlign: 'right',},
});

export default ApplePayScreen;