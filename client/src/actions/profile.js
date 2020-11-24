import api from '../utils/api'
import {setAlert} from './alert'
import { GET_PROFILE, GET_PROFILES,PROFILE_ERROR,UPDATE_PROFILE,ACCOUNT_DELETED, CLEAR_PROFILE,GET_REPOS } from './types'

//Get Current Profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await api.get('/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload:res.data
        })
       
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}

//Get All profiles 
export const getProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    try {
        const res = await api.get('/profile');
        dispatch({
            type: GET_PROFILES,
            payload:res.data.profiles
        })
       
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}

//Get a profile by id
export const getProfileById = (userId) => async dispatch => {
    try {
        const res = await api.get(`/profile/user/${userId}`);
        dispatch({
            type: GET_PROFILE,
            payload:res.data
        })
       
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}

//Get githubRepos
export const getGithubRepos = (username) => async dispatch => {
    try {
        const res = await api.get(`/profile/github/${username}`);
        dispatch({
            type: GET_REPOS,
            payload:res.data
        })
       
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}


// Create or Update Profile 

export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const res = await api.post('/profile', formData);
        dispatch({
            type: GET_PROFILE,
            payload:res.data
        })
        dispatch(setAlert(edit ? 'profile Updated' : 'profile created', 'success'))
        if (!edit) {
            history.push('/dashboard')
        }
    } catch (err) {
        const errors = err.response.data.errors;
  
         if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}

//Add Experience

export const addExperience = (formData, history) => async dispatch => {
    try {
        const res = await api.put('/profile/experience', formData);
        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Experience Added to the profile', 'success'))
        
        history.push('/dashboard')
        
    } catch (err) {
        const errors = err.response.data.errors;
  
         if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}


//Add Education

export const addEducation = (formData, history) => async dispatch => {
    try {
        const res = await api.put('/profile/education', formData);
        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Education Added to the profile', 'success'))
        
        history.push('/dashboard')
        
    } catch (err) {
        const errors = err.response.data.errors;
  
         if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}

//delete Experience
export const deleteExperience = (id) => async dispatch => {
    try {
        const res = await api.delete(`/profile/experience/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Experience removed','success'))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}

//delete Education
export const deleteEducation = (id) => async dispatch => {
    try {
        const res = await api.delete(`/profile/education/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Education removed','success'))
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
    }
}

//delete Account
export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure ? This can NOT be undone!')) {
        try {
             await api.delete(`/profile/`)
            dispatch({
                type: ACCOUNT_DELETED,
             })
            dispatch(setAlert('Your Account has been permanently deleted.'))
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload:{msg:err.response.statusText,status:err.response.status}
            })
        }
    }
}