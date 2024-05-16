import { combineReducers } from "redux";
import VinReducer from "./vinReducer";
import VinTableReducer from "./vinTableReducer";
import UsersReducer from "./usersReducer";
import ProfileReducer from "./profileReducer";
import ReasonCodesReducer from "./reasonCodesReducer";
import ConfigReducer from "./configReducer";
import AuthenticationReducer from "./authenticationReducer";
import storage from 'redux-persist/lib/storage' 
import commonReducer from "./commonReducer";
import siteMetricReducer from "./siteMetricReducer";
import siteConfigReducer from "./siteConfigReducer";
import productionLineMetricReducer from "./productionLineMetricReducer";
import vehicleReducer from './vehicleProgressReducer'

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET') {
      // for all keys defined in your persistConfig(s)
      storage.removeItem('persist:root')

      return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const appReducer =  combineReducers({
  authenticationState: AuthenticationReducer,
  vinState: VinReducer,
  vinTableState: VinTableReducer,
  usersState: UsersReducer,
  profileState: ProfileReducer,
  reasonCodesState: ReasonCodesReducer, 
  config: ConfigReducer,
  commonState: commonReducer,
  siteMetricState: siteMetricReducer,
  siteConfigState: siteConfigReducer,
  productionLineMetricState: productionLineMetricReducer,
  vehilceProgress: vehicleReducer
});

export default rootReducer