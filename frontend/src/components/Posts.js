import React from 'react';
import {Link} from 'react-router-dom'
import Timestamp from 'react-timestamp'

/*
 * For showing post details
 * Gives option for voting & sorting
 */
const Posts = (props) => {
    const { posts, sort, sortBy ,vote,onSelectPost,onDeletePost } = props
    return (
        <div className="layout_3col_center">
            <div>
                <Link className="button" to={`/newpost`}>Create Post</Link>
                <b className="sortby">Posts</b> sort by : &nbsp;
                <select onChange={e => sort("posts", posts, e.target.value)}>
                    <option value="votes">votes</option>
                    <option value="date">date</option>
                </select>
            </div>
            { posts!==undefined && posts.map(post => (
            !post.deleted && <div key={post.id}>
                <div className="midcol">
                    <div className="arrow up" onClick={() => vote("posts","upVote",post.id,posts,sortBy)}></div>
                    <div className="score">{post.voteScore}</div>
                    <div className="arrow down" onClick={() => vote("posts","downVote",post.id,posts,sortBy)}></div>
                </div>
                <div className="post">
                    <Link to={`/${post.category}/${post.id}`} className="post-title" key={post.id}>
                        <div>
                            <b className="posttitle" onClick={() => onSelectPost(post.id)}>{post.title}</b> by <i>{post.author}</i>
                            &nbsp; (posted on <Timestamp time={post.timestamp/1000}/>)
                        </div>
                    </Link>
                    <div className="post-detail">
                        <div>{post.body}</div>
                        <div>{post.commentCount} comments</div>
                        <Link className='button' onClick={() => onSelectPost(post.id)} to={'/editpost/'+post.id}>Edit</Link>
                        <Link className='button' onClick={() => onDeletePost(post.id,posts,sortBy)} to='/'>Delete</Link>
                    </div>
                </div>
                </div> 
            ))}
        </div>
    )
}

export default Posts;
