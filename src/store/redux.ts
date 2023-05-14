import {configureStore} from '@reduxjs/toolkit';
import { paymentSliceReducer, userSliceReducer } from './userSlice';

const store = configureStore({
  reducer: {
    user: userSliceReducer,
    payment: paymentSliceReducer,
  },
});

// https://redux-toolkit.js.org/tutorials/typescript#define-root-state-and-dispatch-types
// Infer the `RootState` and `AppDispatch` types from the store itself
export type IRootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type IAppDispatch = typeof store.dispatch;

export {store};
