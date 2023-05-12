// Libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IUserSessionData} from '../interfaces/IAuthData';

// Note:
// MS: Monthly Subscription
// OTP: On-Time Payment

// Constants
export const MSKey = 'MSKey';
export const OTPKey = 'OTPKey';



// Interfaces
export interface IMS {
  MSstatus: boolean;
}
export interface IOTP {
  OTPstatus: boolean;
}

// Initial States
const MSinitialState: IMS = {
  MSstatus: false,
};
const OTPinitialState: IOTP = {
  OTPstatus: false,
};

// Load Storage 
const loadMSFromStorage:any = createAsyncThunk('MonthlySubscrition/loadFromStorage', () => {
  return AsyncStorage.getItem(MSKey);
});
const loadOTPFromStorage = createAsyncThunk('OnetimePayment/loadFromStorage', () => {
  return AsyncStorage.getItem(OTPKey);
});

// Set Storage 
const setMSToStorage = createAsyncThunk(
  'MS/setToStorage',
  async (MSData: IMS) => {
    await AsyncStorage.setItem(MSKey, JSON.stringify(MSData));
    return MSData;
  },
);

const setOTPToStorage = createAsyncThunk(
  'OTP/setToStorage',
  async (OTPData: IOTP) => {
    await AsyncStorage.setItem(MSKey, JSON.stringify(OTPData));
    return OTPData;
  },
);


// Remove Storage 
const removeMonthlySubscription = createAsyncThunk('MonthlySubscrition/user/inactive', () => {
  return AsyncStorage.removeItem(MSKey);
});


// Data Slices
const MonthlySubscriptionSlice = createSlice({
  name: 'MonthlySubscrition',
  initialState: MSinitialState,
  reducers: {},
  // use the builder pattern its easier to understand
  extraReducers: builder => {
    builder
    .addCase(loadMSFromStorage.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        const {payload} = action;
        if (payload) {
          state.MSstatus = true;
        } else {
          state.MSstatus = false;
        }
      })
    .addCase(loadMSFromStorage.rejected,
      (state: { MSstatus: boolean; }) => {
      state.MSstatus = false;
    })

  },
});

// State Reducers
const MonthlySubscriptionReducer = MonthlySubscriptionSlice.reducer;


export {
  MonthlySubscriptionReducer,
  removeMonthlySubscription
};
