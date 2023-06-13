import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PaymentsReceiptInfo {
  app_account_token: string
  expires_date: string
  expires_date_ms: string
  expires_date_pst: string
  in_app_ownership_type: string
  is_in_intro_offer_period: string
  is_trial_period: string
  original_purchase_date: string
  original_purchase_date_ms: string
  original_purchase_date_pst: string
  original_transaction_id: string
  product_id: string
  purchase_date: string
  purchase_date_ms: string
  purchase_date_pst: string
  quantity: string
  subscription_group_identifier: string
  transaction_id: string
  web_order_line_item_id: string
}

// Constants
export const receiptKey = 'receiptKey';
export const accessKey = 'accessKey';
export const paymentKey = 'paymentKey';
export const individualGif = 'individualGif';



// Set Storage 
export const storePaymentsReceiptInfo = async (data: PaymentsReceiptInfo) => {
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
export const storeVerifyPayment = async (data: { one_time?: boolean; subcription?: boolean }) => {
    try {
      await AsyncStorage.setItem(paymentKey, JSON.stringify(data));
    } catch (error) {
      console.log( 'storeVerifyPayment error: ',error);
    }
  };
export const storeIndividualGifData = async (data: {src: string, width: number, height: number, uid?:number, defaultText?:string, giphy?: boolean, src2?: string}) => {
    try {
      await AsyncStorage.setItem(individualGif, JSON.stringify(data));
    } catch (error) {
      console.log( 'storeVerifyPayment error: ',error);
    }
  };

// Get Storage 
export const loadPaymentsReceiptInfo = async () => {
    try {
      const savedReceipt: any = await AsyncStorage.getItem(receiptKey);
      const parsedReceipt = JSON.parse(savedReceipt);
      return parsedReceipt
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