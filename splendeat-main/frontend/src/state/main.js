import { combineReducers } from 'redux';
import themeReducer from './theme';
import userReducer from './user';

const mainReducer = combineReducers({
    themeIsDark: themeReducer,
    user: userReducer,
})

export default mainReducer;