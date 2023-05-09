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
const loadMSFromStorage:any = createAsyncThunk('MS/loadFromStorage', () => {
  return AsyncStorage.getItem(MSKey);
});
const loadOTFromStorage = createAsyncThunk('OnetimePayment/loadFromStorage', () => {
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
const removeMonthlySubscription = createAsyncThunk('MS/user/inactive', () => {
  return AsyncStorage.removeItem(MSKey);
});


// Data Slices
const themeSlice = createSlice({
  name: 'theme',
  initialState: initialThemeState,
  reducers: {},
  // use the builder pattern its easier to understand
  extraReducers: builder => {

    builder.addCase(
      loadMSFromStorage.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        const {payload} = action;
        if (payload) {
          state.theme = payload;
        } else {
          state.theme = payload;
        }
      },
    );

  },
});

const languageSlice = createSlice({
  name: 'language',
  initialState: initialLanguageState,
  reducers: {},
  // use the builder pattern its easier to understand
  extraReducers: builder => {

    builder
    .addCase(setLanguageToStorage.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        const {payload} = action;                 
        state.lang = payload;        
      },
    )
    .addCase(setLanguageToStorage.rejected, 
      state => {
      console.log('payload: ',state.lang);
      state.lang = 'en';
    })
    .addCase(loadLanguageFromStorage.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        const {payload} = action;
        if (payload) {
          state.lang = payload;
        } else {
          state.lang = 'en';
        }
      },
    )
    .addCase(loadLanguageFromStorage.rejected, 
      state => {
      state.lang = 'en';
    })
  },
});
 const filterSlice = createSlice({
  name: 'filter',
  initialState: initialFilterState,
  reducers: {
      setFilter: (state, action: PayloadAction<any>) => {
        state.filterArray  = action?.payload
        },
      deleteFilter: (state) => {
          state.filterArray = []
      }
  },
});

// State Reducers
const userReducer = userSlice.reducer;
const themeReducer = themeSlice.reducer;
const languageReducer = languageSlice.reducer;
const filterReducer = filterSlice.reducer;
export const {setFilter, deleteFilter} = filterSlice?.actions




export {
  setThemeToStorage,
  loadThemeFromStorage,
  userReducer,
  themeReducer,
  loadUserFromStorage,
  logOutUser,
  loginUser,
  filterSlice,
  filterReducer,
  setLanguageToStorage,
  loadLanguageFromStorage,
  languageReducer
};
