
import api from '../utils/api'
import { GET_POSTS, POST_ERROR, UPDATE_LIKES,DELETE_POST, ADD_POST,GET_POST,ADD_COMMENT,DELETE_COMMENT } from './types'
import { setAlert } from './alert'

// get all posts
export const getPosts = () => async dispatch => {
    try {
        const res = await api.get('/posts')
        dispatch({
            type: GET_POSTS,
            payload: res.data.posts
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}


// add Like 

export const addLike = (postId) => async dispatch => {
    try {
        const res = await api.put(`/posts/like/${postId}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: {postId, likes:res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}


// remove Like 

export const removeLike = (postId) => async dispatch => {
    try {
        const res = await api.put(`/posts/unlike/${postId}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: {postId, likes:res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}

// Delete post 

export const deletePost = (postId) => async dispatch => {
    try {
        await api.delete(`/posts/${postId}`)
        dispatch({
            type: DELETE_POST,
            payload: postId
        })
        dispatch(setAlert('Post has been removed', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}


// Add post 

export const addPost = (formData) => async dispatch => {
    try {
        const res = await api.post(`/posts`,formData)
        dispatch({
            type: ADD_POST,
            payload: res.data
        })
        dispatch(setAlert('Post has been added', 'success'));
    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}

// get  post By Id
export const getPostById = (id) => async dispatch => {
    try {
        const res = await api.get(`/posts/${id}`)
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}

//Add Comment
export const addComment = (postId,formData) => async dispatch => {
    try {
        const res = await api.post(`/posts/comment/${postId}`,formData)
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })
        dispatch(setAlert('Comment has been added', 'success'));
    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}

//Delete Comment
export const deleteComment = (postId,commentId) => async dispatch => {
    try {
         await api.delete(`/posts/comment/${postId}/${commentId}`)
        dispatch({
            type: DELETE_COMMENT ,
            payload: commentId
        })
        dispatch(setAlert('Comment has been removed', 'success'));
    } catch (err) {

        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}