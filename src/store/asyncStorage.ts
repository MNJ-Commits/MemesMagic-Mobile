import AsyncStorage from "@react-native-async-storage/async-storage";

// Constants
export const userKey = 'userKey';
export const accessKey = 'accessKey';
export const paymentKey = 'paymentKey';
export const individualGif = 'individualGif';



// Set Storage 
export const storeAppleAuth = async (data: { identity_token: string; user_id: string }) => {
    try {
      await AsyncStorage.setItem(userKey, JSON.stringify(data));
    } catch (error) {
      console.log( 'storeAppleAuth error: ',error);
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
export const loadAppleAuthFromStorage = async () => {
    try {
      const savedUser: any = await AsyncStorage.getItem(userKey);
      const currentUser = JSON.parse(savedUser);
      return currentUser
    } catch (error) {
      console.log('loadAppleAuthFromStorage error: ',error);
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