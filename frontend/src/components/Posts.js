import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import Timestamp from 'react-timestamp'
import '../App.css';

/*
 * For showing post details
 * Gives option for voting & sorting
 */
class Posts extends Component {
  render() {
    const { posts, sort, sortBy ,vote,onSelectPost } = this.props
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
                <Link to={`/post/${post.id}`} className="post" key={post.id}>
                <div>
                    <div>
                        <b className="posttitle" onClick={() => onSelectPost(post.id)}>{post.title}</b> by <i>{post.author}</i>
                        &nbsp; (posted on <Timestamp time={post.timestamp/1000}/>)
                    </div>
                    <div>{post.body}</div>
                    <div>{post.commentCount} comments</div>
                </div>
                </Link>
             </div> 
          ))}
      </div>
    );
  }
}

export default Posts;
