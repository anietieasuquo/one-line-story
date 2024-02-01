import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const dispatchLater = (callback: () => void): void => {
    setTimeout(callback, 1500);
};

export { useAppDispatch, useAppSelector, dispatchLater };
