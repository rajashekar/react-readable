import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Timestamp from 'react-timestamp'

import Comments from './Comments';
import CreateComment from './CreateComment';

/*
 * To show complete post with details
 */
class PostView extends Component {

    render() {
        const { posts,post,comments,vote,onDeletePost,onSelectPost,sortBy,
                onCreateComment,onDeleteComment,onEditComment,
                onEditDone,onChangeComment } = this.props
        return (
            <div className="postdetail">
                {post!==undefined && <div>
                    <Link className='button' to='/'>Back</Link>
                    <Link className='button' onClick={() => onSelectPost(post.id)} to={'/editpost/'+post.id}>Edit</Link>
                    <Link className='button' onClick={() => onDeletePost(post.id,posts,sortBy)} to='/'>Delete</Link>
                    <h1>{post.title}</h1>
                    <div>Author: {post.author}</div>
                    <div>Posted: <Timestamp time={post.timestamp/1000}/></div>
                    <div>Category: {post.category}</div>
                    <div>Vote Score: {post.voteScore}</div>
                    <div>{post.body}</div>
                    <div><b>{post.commentCount} comments : </b></div>
                    <div>
                        <Comments
                            parentId={post.id}
                            comments={comments}
                            sortBy={sortBy}
                            vote={vote}
                            onDeleteComment={onDeleteComment}
                            onEditComment={onEditComment}
                            onChangeComment={onChangeComment}
                            onEditDone={onEditDone}
                        />
                    </div>
                    <div>
                        <CreateComment
                            parentId={post.id}
                            onCreateComment={onCreateComment}
                        />
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default PostView;
