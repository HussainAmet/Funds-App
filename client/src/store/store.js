import { configureStore } from '@reduxjs/toolkit'
import memberDetailsSlice from './memberDetailsSlice';
import authSlice from './authSlice';

const store = configureStore ({
    reducer: {
        auth : authSlice,
        member : memberDetailsSlice,
    }
});

export default store;