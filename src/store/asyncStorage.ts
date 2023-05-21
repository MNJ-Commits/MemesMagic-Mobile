import AsyncStorage from "@react-native-async-storage/async-storage";

// Constants
export const receiptKey = 'receiptKey';
export const accessKey = 'accessKey';
export const paymentKey = 'paymentKey';
export const individualGif = 'individualGif';



// Set Storage 
export const storePaymentsReceipt = async (data: { receipt: string }) => {
    try {
      await AsyncStorage.setItem(receiptKey, JSON.stringify(data));
    } catch (error) {
      console.log( 'storeTransactionsReceipt error: ',error);
    }
  };
export const storeAppleAccessToken = async (data: { access_token: string }) => {
    try {
      await AsyncStorage.setItem(accessKey, JSON.stringify(data));
    } catch (error) {
      console.log( 'storeAppleAccessToken error: ',error);
    }
  };
export const storeVerifyPayment = async (data: { one_time: boolean; subcription: boolean }) => {
    try {
      await AsyncStorage.setItem(paymentKey, JSON.stringify(data));
    } catch (error) {
      console.log( 'storeVerifyPayment error: ',error);
    }
  };
export const storeIndividualGifData = async (data: {src: string, width: number, height: number, uid?:number, defaultText?:string, giphy?: boolean, src2?: string, returnScreen: string}) => {
    try {
      await AsyncStorage.setItem(individualGif, JSON.stringify(data));
    } catch (error) {
      console.log( 'storeVerifyPayment error: ',error);
    }
  };

// Get Storage 
export const loadPaymentsReceipt = async () => {
    try {
      const savedReceipt: any = await AsyncStorage.getItem(receiptKey);
      return savedReceipt
    } catch (error) {
      console.log('loadPaymentsReceipt error: ',error);
    }
  };
export const loadAppleAccessTokenFromStorage = async () => {
    try {
      const savedAccessToken: any = await AsyncStorage.getItem(accessKey);
      const appleAccessToken = JSON.parse(savedAccessToken);
      return appleAccessToken
    } catch (error) {
      console.log('loadAppleAccessTokenFromStorage error: ',error);
    }
  };
export const loadVerifyPaymentFromStorage = async () => {
    try {
      const savedPaymentInfo: any = await AsyncStorage.getItem(paymentKey);
      const paymentInfo = JSON.parse(savedPaymentInfo);
      return paymentInfo
    } catch (error) {
      console.log('loadVerifyPaymentFromStorage error: ',error);
    }
  };
export const loadIndividualGifData = async () => {
    try {
      const savedGifData: any = await AsyncStorage.getItem(individualGif);
      const gifData = JSON.parse(savedGifData);
      return gifData
    } catch (error) {
      console.log('loadVerifyPaymentFromStorage error: ',error);
    }
  };