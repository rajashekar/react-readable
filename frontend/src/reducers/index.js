import { combineReducers } from 'redux'
import { LOAD_CATEGORIES,LOAD_POSTS,LOAD_COMMENTS,
         GET_POST, SET_SORT_TYPE } from '../actions'

function readable(state = {},action) {
    const { categories,posts,comments,selectedPost,sortBy } = action
    switch(action.type) {
    case LOAD_CATEGORIES: 
        return {
            ...state,
            categories
        }
    case LOAD_POSTS: 
        return {
            ...state,
            posts
        }
    case LOAD_COMMENTS: 
        return {
            ...state,
            comments
        }
    case GET_POST: 
        return {
            ...state,
            selectedPost
        }
    case SET_SORT_TYPE: 
        return {
            ...state,
            sortBy
        }
    default: 
        return state
    }
}

export default combineReducers({
    readable
})
