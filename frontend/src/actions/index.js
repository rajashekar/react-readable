import * as ReadableAPI from '../api/ReadableAPI'

export const LOAD_CATEGORIES = 'LOAD_CATEGORIES'
export const LOAD_POSTS = 'LOAD_POSTS'
export const LOAD_COMMENTS = 'LOAD_COMMENTS'

export const GET_POST = 'GET_POST'
export const SET_SORT_TYPE = 'SET_SORT_TYPE'

export const CREATE_POST = 'CREATE_POST'
export const EDIT_POST = 'EDIT_POST'
export const REMOVE_POST = 'REMOVE_POST'
export const VOTE_POST = 'VOTE_POST'

export const ADD_COMMENT = 'ADD_COMMENT'
export const EDIT_COMMENT = 'EDIT_COMMENT'
export const REMOVE_COMMENT = 'REMOVE_COMMENT'
export const VOTE_COMMENT = 'VOTE_COMMENT'

export const loadCategories = categories => ({
    type: LOAD_CATEGORIES,
    categories
})

export const loadPosts = posts => ({
    type: LOAD_POSTS,
    posts
})

export const loadComments = comments => ({
    type: LOAD_COMMENTS,
    comments
})

export const getPost = selectedPost => ({
    type: GET_POST,
    selectedPost
})

export const setSortType = sortBy => ({
    type: SET_SORT_TYPE,
    sortBy
})
    
export const getCategories = () => dispatch => (
    ReadableAPI.getCategories().then(categories => dispatch(loadCategories(categories)))
)

  // on select category get all posts of category
export const onSelectCategory = (category,sortBy) => dispatch => (
// if category is all get all posts
(category === "all") ? 
    ReadableAPI.getPosts().then((posts) => dispatch(sort("posts", posts, sortBy)))
:
    ReadableAPI.getCategoryPosts(category).then((posts) => dispatch(sort("posts", posts, sortBy)))
)

  // on select post get all post details of that post
export const  onSelectPost = (postid) => dispatch => {
    ReadableAPI.getPost(postid).then((post) => dispatch(getPost(post)))
    ReadableAPI.getComments(postid).then((comments) => {
        comments.map(c => {c.edit=false;return c;})
        dispatch(sort("comments", comments,"votes"))
    })
}

// for sorting based on votes or date
export const  sort = (type, posts, sortBy) => dispatch => {
    // sort before to set state
    if(type === 'posts') {
        if(sortBy === 'votes') {
            dispatch(loadPosts(posts.sort((a,b) => b.voteScore-a.voteScore)));
        } else {
            dispatch(loadPosts(posts.sort((a,b) => b.timestamp-a.timestamp)));
        }
    } else {
        dispatch(loadComments(posts.sort((a,b) => b.voteScore-a.voteScore)));
    }
    dispatch(setSortType(sortBy))
}

// for voting both posts & comments
export const vote = (type,option,id,items,sortBy) => dispatch => {
    if(type === 'posts') {
        ReadableAPI.vote(type,option,id).then((result) => dispatch(setUpdatedResults(type,items,result,sortBy)))
    } else {
        ReadableAPI.vote(type,option,id).then((result) => dispatch(setUpdatedResults(type,items,result,"votes")))
    }
}

// update the results
export const setUpdatedResults = (type, items, item, sortBy) => dispatch => {
    if(items!==undefined) {
        dispatch(sort(type, items.reduce(updateResults(item),[]),sortBy))
    }
}
export const updateResults = (updatedPost) => (
    (allPosts,post) => {
        if(post.id === updatedPost.id) {
            post.title = updatedPost.title
            post.body = updatedPost.body
            post.voteScore = updatedPost.voteScore
            post.deleted = updatedPost.deleted
            post.commentCount = updatedPost.commentCount
        }
        allPosts.push(post)
        return allPosts
    }
)
