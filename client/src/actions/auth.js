
import { REGISTER_FAIL, REGISTER_SUCCESS,LOGOUT,USER_LOADED,AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL } from './types'
import api from '../utils/api'
import {setAlert} from './alert'

//Authenticate and loadUser
export const loadUser = () => async dispatch => {
    try {
      const res = await api.get('/auth');
  
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR
      });
    }
  };

// register user 
export const register = ({ name, email, password }) => async dispatch => {

    const body  = JSON.stringify({name,email,password})
    try {
        const res = await api.post('/users', body)
        dispatch({
            type: REGISTER_SUCCESS,
            payload:res.data
        })
        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors;
        //display errors
        if (errors) {
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger')))
        }
        dispatch({
            type : REGISTER_FAIL
        })
    }
}

// Login User
export const login = (formData) => async dispatch => {
    const body = formData
  
    try {
      const res = await api.post('/auth', body);
  
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
  
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
  
      dispatch({
        type: LOGIN_FAIL
      });
    }
  };
  
  // Logout
export const logout = () => ({ type: LOGOUT });

