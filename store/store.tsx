import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import thunk from "redux-thunk";
import { composeWithDevTools } from '@redux-devtools/extension';
import rootReducer from "./reducers/rootReducer";

const persistConfig = {
  key: 'root',
  storage
}

// initial states here
const initalState = {};

// middleware
const middleware = [thunk];

const persistedReducer = persistReducer(persistConfig, rootReducer)

// creating store
export const store = createStore(
  persistedReducer,
  initalState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// creating persistor
export const persistor=persistStore(store)
