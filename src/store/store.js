import {configureStore} from '@reduxjs/toolkit';
import auth from './slices/auth';
import selectPrestataires from './slices/selectPrestataires';
import searchBarValue from './slices/searchBarValue';
import selectClients from './slices/selectClients';
import selectCategories from "@/store/slices/selectCategories.js";
import selectServices from "@/store/slices/selectServices.js";
import selectCommandes from "@/store/slices/selectCommandes.js";
import selectStats from "@/store/slices/selectStats.js";
import waiting from './slices/waiting';

const store = configureStore({
    reducer: {
        auth,
        selectPrestataires,
        searchBarValue,
        selectClients,
        selectCategories,
        selectServices,
        selectCommandes,
        selectStats,
        waiting,
    }
});
export default store;