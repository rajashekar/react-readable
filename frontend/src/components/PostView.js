import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Timestamp from 'react-timestamp'
import { connect } from 'react-redux'

import Comments from './Comments';
import CreateComment from './CreateComment';
import NotFound from './NotFound';

import { onSelectPost, createPost, editPost, deletePost, 
         createComment, deleteComment, editComment, changeComment, editDone,
         sort, vote} from '../actions'

/*
 * To show complete post with details
 */
class PostView extends Component {

  componentDidMount() {
    var postid = this.props.match.params.post_id
    this.props.onSelectPost(postid)
  }

  doPostExists(post) {
    return (
        post!==undefined && 
        post.id!==undefined && 
        post.error===undefined
    )
  }

    render() {

        const { posts,comments,selectedPost,sortBy,modifiedComment } = this.props.readable
        const { onSelectPost, vote, deletePost, 
                createComment, editComment, deleteComment,
                changeComment, editDone} = this.props

        return (
            <div className="postdetail">
                {(this.doPostExists(selectedPost)) ? <div>
                    <Link className='button' to='/'>Back</Link>
                    <Link className='button' onClick={() => onSelectPost(selectedPost.id)} to={'/editpost/'+selectedPost.id}>Edit</Link>
                    <Link className='button' onClick={() => deletePost(selectedPost.id,posts,sortBy)} to='/'>Delete</Link>
                    <div className="post-view-vote">
                        <div className="midcol">
                            <div className="arrow up" onClick={() => vote("posts","upVote",selectedPost.id,posts,sortBy)}></div>
                            <div className="score">{selectedPost.voteScore}</div>
                            <div className="arrow down" onClick={() => vote("posts","downVote",selectedPost.id,posts,sortBy)}></div>
                        </div>
                    </div>
                    <h1>{selectedPost.title}</h1>
                    <div>Author: {selectedPost.author}</div>
                    <div>Posted: <Timestamp time={selectedPost.timestamp/1000}/></div>
                    <div>Category: {selectedPost.category}</div>
                    <div>Vote Score: {selectedPost.voteScore}</div>
                    <div>{selectedPost.body}</div>
                    <div><b>{selectedPost.commentCount} comments : </b></div>
                    <div>
                        <Comments
                            parentId={selectedPost.id}
                            comments={comments}
                            sortBy={sortBy}
                            vote={vote}
                            onDeleteComment={commentid => deleteComment(commentid,comments)}
                            onEditComment={commentid => editComment(commentid,comments)}
                            onChangeComment={changeComment}
                            onEditDone={commentid => editDone(commentid,modifiedComment,comments)}
                        />
                    </div>
                    <div>
                        <CreateComment
                            parentId={selectedPost.id}
                            onCreateComment={comment => createComment(comment,comments)}
                        />
                    </div>
                </div>
                : 
                <NotFound />
                }
            </div>
        )
    }
}

function mapStateToProps({readable}) {
    return {
        readable
    }
}

const mapDispatchToProps =  {
    onSelectPost, createPost, editPost, deletePost,
    createComment, deleteComment, editComment, changeComment, editDone,
    sort, vote
}

export default connect(mapStateToProps,mapDispatchToProps)(PostView)
