import { configureStore } from '@reduxjs/toolkit'
import memberDetailsSlice from './memberDetailsSlice';

const store = configureStore ({
    reducer: {
        member : memberDetailsSlice,
    }
});

export default store;