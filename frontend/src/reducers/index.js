import { combineReducers } from 'redux'
import { LOAD_CATEGORIES,LOAD_POSTS,LOAD_COMMENTS,
         GET_POST, SET_SORT_TYPE, NEW_POST, 
         UP_COMMENT_COUNT,DOWN_COMMENT_COUNT, UPDATE_COMMENT } from '../actions'

function readable(state = {},action) {
    const { categories,posts,comments,selectedPost,sortBy,post,modifiedComment } = action
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
    case NEW_POST: 
        return {
            ...state,
            posts: state.posts.concat(post)
        }
    case SET_SORT_TYPE: 
        return {
            ...state,
            sortBy
        }
    case UP_COMMENT_COUNT: 
        return {
            ...state,
            selectedPost: {...state.selectedPost, 
                commentCount:state.selectedPost.commentCount+1},
            posts: state.posts.map(post => {
                    if(state.selectedPost.id === post.id) {
                        post.commentCount = post.commentCount+1
                    }
                    return post;
                   })    
        }
    case DOWN_COMMENT_COUNT: 
        return {
            ...state,
            selectedPost: {...state.selectedPost, 
                commentCount:state.selectedPost.commentCount-1},
            posts: state.posts.map(post => {
                    if(state.selectedPost.id === post.id) {
                        post.commentCount = post.commentCount-1
                    }
                    return post;
                   })    
        }
    case UPDATE_COMMENT:
        return {
            ...state,
            modifiedComment
        }
    default: 
        return state
    }
}

export default combineReducers({
    readable
})
