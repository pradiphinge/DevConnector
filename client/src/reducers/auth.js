import { REGISTER_FAIL, REGISTER_SUCCESS,AUTH_ERROR,USER_LOADED,LOGOUT,LOGIN_FAIL,LOGIN_SUCCESS, ACCOUNT_DELETED } from '../actions/types'

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user:null
}

const register = (state = initialState, action)=>{
    const { type, payload } = action
    switch (type) {
        case USER_LOADED: return {
            ...state,
            user: payload,
            isAuthenticated: true,
            loading:false
        }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS: return {
            ...state,
            ...payload,
            isAuthenticated: true,
            loading: false,
        } ;
        case REGISTER_FAIL:
        case AUTH_ERROR: 
        case LOGIN_FAIL:    
        case LOGOUT:
        case ACCOUNT_DELETED:    
            return {
            ...state,
            ...payload,
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null
        };
        default: return state;   
    }
}

export default register;