import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { IRootState, IAppDispatch } from './redux';

// https://redux-toolkit.js.org/tutorials/typescript#define-root-state-and-dispatch-types
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<IAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;
