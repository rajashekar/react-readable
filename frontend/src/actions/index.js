import * as ReadableAPI from '../api/ReadableAPI'

export const LOAD_CATEGORIES = 'LOAD_CATEGORIES'
export const LOAD_POSTS = 'LOAD_POSTS'
export const LOAD_COMMENTS = 'LOAD_COMMENTS'

export const GET_POST = 'GET_POST'
export const SET_SORT_TYPE = 'SET_SORT_TYPE'

export const NEW_POST = 'NEW_POST'
export const UP_COMMENT_COUNT = 'UP_COMMENT_COUNT'
export const DOWN_COMMENT_COUNT = 'DOWN_COMMENT_COUNT'

export const UPDATE_COMMENT = 'UPDATE_COMMENT'
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

export const newPost = post => ({
    type: NEW_POST,
    post
})

export const upCommentCount = () => ({
    type: UP_COMMENT_COUNT
})

export const downCommentCount = () => ({
    type: DOWN_COMMENT_COUNT
})

export const updatedComment = (modifiedComment) => ({
    type: UPDATE_COMMENT,
    modifiedComment
})
    
export const getCategories = () => dispatch => 
    ReadableAPI.getCategories().then(categories => dispatch(loadCategories(categories)))


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
export const  sort = (type, items, sortBy) => dispatch => {
    // sort before to set state
    if(type === 'posts') {
        if(sortBy === 'votes') {
            dispatch(loadPosts(items.sort((a,b) => b.voteScore-a.voteScore)));
        } else {
            dispatch(loadPosts(items.sort((a,b) => b.timestamp-a.timestamp)));
        }
    } else {
        dispatch(loadComments(items.sort((a,b) => b.voteScore-a.voteScore)));
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

// to create post
export const createPost = (post) => dispatch => 
    ReadableAPI.createPost(post).then((post) => dispatch(newPost(post)))

// to delete post
export const deletePost = (postid,posts,sortBy) => dispatch => 
    ReadableAPI.deletePost(postid).then((result) => dispatch(setUpdatedResults("posts",posts,result,sortBy)))

// to edit post 
export const  editPost = (post,posts,sortBy) => dispatch =>
    ReadableAPI.editPost(post).then((result) => dispatch(setUpdatedResults("posts",posts,result,sortBy)))

// to create comment
export const createComment = (comment,comments) => dispatch => {
    ReadableAPI.createComment(comment).then((result) => {
        // first set comments & sort
        dispatch(sort("comments", [...comments,result],"votes"))
        //  increment comment count at selected post & posts
        dispatch(upCommentCount())        
    })
}

// to delete comment
export const  deleteComment = (commentid,comments) => dispatch => {
    ReadableAPI.deleteComment(commentid).then((result) => {
        dispatch(setUpdatedResults("comments",comments,result,"votes"))
        //  decrement comment count at selected post & posts
        dispatch(downCommentCount())        
    })
}

// to edit comment
export const editComment = (commentid,comments) => dispatch => {
    dispatch(loadComments(comments.map(comment => {
        if(comment.id === commentid) {
            comment.edit = !comment.edit
        }
        return comment;
    })))
}

export const  changeComment = (e) => dispatch => {
    dispatch(updatedComment(e.target.value))
}

export const  editDone = (commentid,modifiedComment,comments) => dispatch => {
    var comment = {id:commentid, body:modifiedComment, timestamp: Date.now()}
    ReadableAPI.editComment(comment).then((result) => dispatch(setUpdatedResults("comments",comments,result,"votes")))
    dispatch(editComment(commentid,comments))
}
