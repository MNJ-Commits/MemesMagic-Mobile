// Libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

// Constants
export const userKey = 'userKey';
export const verifyPaymentKey = 'verifyPaymentKey';
export const requestPaymentKey = 'requestPaymentKey';
export const accessTokenKey = 'accessTokenKey';

// Interfaces
export interface IUserState {
  userData: IUserSessionData | null
  isLoggedIn: boolean;
  isLoadingStorageData: boolean;
}

export interface IUserSessionData {
  identity_token: string
  user_id: string
}

export interface IRequestPayment {
  accessTokenData: IAccessToken | null 
  one_time: boolean
  subcription: boolean
}

export interface IAccessToken {
  access_token:string
  expire: string
}

// Initial States
const userInitialState: IUserState = {
  userData: null,
  isLoggedIn: false,
  isLoadingStorageData: true,
};

const accessTokenInitialState: IAccessToken = {
  access_token: '', 
  expire: ' '
}

const requestPaymentInitialState: IRequestPayment = {
  accessTokenData: accessTokenInitialState, 
  one_time: false,
  subcription: false
}

// Load Storage 

// const loadPaymentAccessFromStorage:any = createAsyncThunk('payment/access-payment/loadFromStorage', () => {
//   return AsyncStorage.getItem(requestPaymentKey);
// });

// const loadVerifyPaymentFromStorage:any = createAsyncThunk('payment/verify-payment/loadFromStorage', () => {
//   return AsyncStorage.getItem(verifyPaymentKey);
// });
const loadUserFromStorage:any = createAsyncThunk('user/loadFromStorage', () => {
  return AsyncStorage.getItem(userKey);
});

// Set Storage 
const loginUser = createAsyncThunk('auth/sso/apple',
  async (data: IUserSessionData) => {
    await AsyncStorage.setItem(userKey, JSON.stringify(data));
    return data;
  },
);

const accessTokenRequest = createAsyncThunk('payment/access-token',
  async (data: IAccessToken) => {
    await AsyncStorage.setItem(accessTokenKey, JSON.stringify(data));
    return data;
  },
);

const paymentAccessRequest = createAsyncThunk('payment/request-payment',
  async (data: IRequestPayment) => {
    await AsyncStorage.setItem(requestPaymentKey, JSON.stringify(data));
    return data;
  },
);


// Remove Storage 
const removePayment = createAsyncThunk('user/subscrition/inactive', () => {
  return AsyncStorage.removeItem(verifyPaymentKey);
});

// Data Slices
const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {},
  // use the builder pattern its easier to understand
  extraReducers: builder => {
    builder
    .addCase(loginUser.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        const {payload} = action;
        const user = JSON.parse(payload);
        console.log('loginUser fulfilled : ', payload);
        // if (payload) {
        // state.isLoadingStorageData = false;
        // state.isLoggedIn = true;
        // state.userData = user;
        // } 
      })
    .addCase(loginUser.rejected,
      (state: any, action: PayloadAction<any>) => {
      // state.MSstatus = false;
      const {payload} = action;
        console.log('loginUser rejected : ', payload);
      })
    .addCase(loadUserFromStorage.fulfilled, 
      (state: any, action: PayloadAction<any>) => {
       const {payload} = action;
       const user = JSON.parse(payload);
       console.log('loadUserFromStorage fulfilled : ', user);
        if (user) {
          state.userData = user;
          state.isLoggedIn = true;
          state.isLoadingStorageData = false;
        } 
    })
    .addCase(loadUserFromStorage.rejected,
      state => {
      state.isLoadingStorageData = false;
    })
  },
});

const paymentSlice = createSlice({
  name: 'payment',
  initialState: requestPaymentInitialState,
  reducers: {},
  // use the builder pattern its easier to understand
  extraReducers: builder => {
    builder
    .addCase(paymentAccessRequest.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        const {payload} = action;
        console.log('paymentAccessRequest fulfilled: ', payload);
        // if (payload) {
        //   state.isLoggedIn = true;
        // } 
      })
    .addCase(paymentAccessRequest.rejected,
      (state: any, action: PayloadAction<any>) => {
        const {payload} = action;
        console.log('paymentAccessRequest rejected: ', payload);
      // state.MSstatus = false;
    })
  },
});


// State Reducers
const userSliceReducer = userSlice.reducer;
const paymentSliceReducer = paymentSlice.reducer;

export {
  userSliceReducer,
  paymentSliceReducer,
  loginUser,
  loadUserFromStorage,
  paymentAccessRequest,
  accessTokenRequest,
  removePayment
};
