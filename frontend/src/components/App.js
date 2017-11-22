import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Categories from './Categories';
import Posts from './Posts';
import PostView from './PostView';
import CreatePost from './CreatePost'
import EditPost from './EditPost'
import { connect } from 'react-redux'
import * as ReadableAPI from '../api/ReadableAPI'
import { getCategories,onSelectCategory,onSelectPost,sort,vote } from '../actions'
import '../App.css';

/*
 * Main component for this app
 */

class App extends Component {

  // State object
  state = {
    categories : [],
    posts : [],
    comments: [],
    selectedPost : {},
    sortBy : 'votes',
    modifiedComment : ""
  }

   // Initially mount all Categories and all Posts
  componentDidMount() {
    const {getCategories, onSelectCategory} = this.props
    const {sortBy} = this.props.readable
    var context = window.location.pathname === "/"? 
        "all": window.location.pathname.substr(1);
    if(context === "all" || context.startsWith('category'))  {
        var category = context.substring(context.indexOf("/")+1,context.length);
        getCategories()
        onSelectCategory(category,sortBy!==undefined?sortBy:"votes")
    } else if(context.startsWith('post')) {
        var postid = context.substring(context.indexOf("/")+1,context.length);
        onSelectPost(postid)
    }
  }

  // for voting both posts & comments
  vote = (type,option,id) => {
    if(type === 'posts') {
        ReadableAPI.vote(type,option,id).then((result) => {
            this.setUpdatedResults(type,this.state.posts,result,this.state.sortBy)
        });
    } else {
        ReadableAPI.vote(type,option,id).then((result) => {
            this.setUpdatedResults(type,this.state.comments,result,"votes")
        });
    }
  }

  // update the results
  setUpdatedResults = (type, currentPosts, post, sortBy) => {
    var posts = currentPosts.reduce(this.updateResults(post),[]);
    this.sort(type, posts,sortBy)
  }
  updateResults = (updatedPost) => (
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

  // for sorting based on votes or date
  sort = (type, posts, sortBy) => {
      // sort before to set state
      if(type === 'posts') {
        if(sortBy === 'votes') {
            this.setState({posts: posts.sort((a,b) => b.voteScore-a.voteScore)});
        } else {
            this.setState({posts: posts.sort((a,b) => b.timestamp-a.timestamp)});
        }
      } else {
        this.setState({comments: posts.sort((a,b) => b.voteScore-a.voteScore)});
      }
  }

  // to create post
  createPost = (post) => {
    ReadableAPI.createPost(post).then((posts) => {
        this.setState((state) => ({
            posts: state.posts.concat([post])
        }))
    })
  }

  // to delete post
  deletePost = (postid) => {
    ReadableAPI.deletePost(postid).then((result) => {
        this.setUpdatedResults("posts",this.state.posts,result,this.state.sortBy)
    })
  }

  editPost = (post) => {
    console.log(post)
    ReadableAPI.editPost(post).then((result) => {
        this.setUpdatedResults("posts",this.state.posts,result,this.state.sortBy)
    })
  }

  createComment = (comment) => {
    console.log(comment);
    ReadableAPI.createComment(comment).then((result) => {
        // first set comments & sort
        this.sort("comments", [...this.state.comments,result],"votes")
        //  increment comment count at selected post
        this.setState((state) => ({
            selectedPost: {...state.selectedPost,
                    commentCount:state.selectedPost.commentCount+1}
        }))
        // increment comment count at posts
        this.setUpdatedResults("posts",this.state.posts,this.state.selectedPost,this.state.sortBy)
    })
  }

  deleteComment = (commentid) => {
    ReadableAPI.deleteComment(commentid).then((result) => {
        this.setUpdatedResults("comments",this.state.comments,result,"votes")
        this.setState({selectedPost: {...this.state.selectedPost,
                commentCount:this.state.selectedPost.commentCount-1}});
        this.setUpdatedResults("posts",this.state.posts,this.state.selectedPost,this.state.sortBy)
    })
  }

  editComment = (commentid) => {
    this.setState((state) => ({
        comments: state.comments.map(comment => {
            if(comment.id === commentid) {
                comment.edit = !comment.edit
            }
            return comment;
        })
    }))
  }

  changeComment = (e) => {
    console.log(e.target.value)
    this.setState({ modifiedComment: e.target.value });
  }

  editDone = (commentid) => {
    var comment = {id:commentid, body:this.state.modifiedComment, timestamp: Date.now()}
    ReadableAPI.editComment(comment).then((result) => {
        this.setUpdatedResults("comments",this.state.comments,result,"votes")
    })
    this.editComment(commentid)
  }

  // For rendering categories
  renderCategory = () => {
    console.log(this.props.readable)
    const { categories,posts,sortBy } = this.props.readable
    const { onSelectCategory, onSelectPost, sort, vote} = this.props
    return (
        <div>
            <Categories categories={categories} onSelectCategory={onSelectCategory}/>
            <div className='grid_page'>
                <Posts 
                    posts={posts} 
                    sort={sort}
                    sortBy={sortBy}
                    vote={vote} 
                    onSelectPost={onSelectPost}
                />
            </div>
        </div>
    )
  }

  // For rendering Posts
  renderPost = (history) => {
    const { comments,selectedPost,sortBy } = this.props.readable
    const { onSelectPost, vote } = this.props
    return (
        <div>
            <PostView 
                post={selectedPost}
                comments={comments}
                sortBy={sortBy}
                vote={vote}
                onDeletePost={(postid) => {
                    this.deletePost(postid)
                }}
                onSelectPost={onSelectPost}
                onCreateComment={this.createComment}
                onDeleteComment={this.deleteComment}
                onEditComment={this.editComment}
                onEditDone={this.editDone}
                onChangeComment={this.changeComment}
                onClick={() => {
                    history.push('/')
                }}
            />
        </div>
    )
  }

  // For rendering create post
  renderCreatePost = (history) => {
    return (
        <div>
            <CreatePost
                onCreatePost={(post) => {
                    this.createPost(post)
                    history.push('/')
                }}
            />
        </div>
    )
  }

  // For rendering Edit post
  renderEditPost = (history) => {
    const { selectedPost } = this.state
    return (
        <div>
            <EditPost
                post={selectedPost}
                onEditPost={(post) => {
                    this.editPost(post)
                    history.push('/')
                }}
            />
        </div>
    )
  }

  // Main render method
  render() {
    return (
        <div className='ContentWrapper'>
            <Route exact path="/" render={() => this.renderCategory()}/>
            <Route path="/category" render={() => this.renderCategory()}/>
            <Route path="/post" render={({history}) => this.renderPost(history)}/>
            <Route path="/newpost" render={({history}) => this.renderCreatePost(history)}/>
            <Route path="/editpost" render={({history}) => this.renderEditPost(history)}/>
        </div>
    );
  }
}

function mapStateToProps({readable}) {
    return {
        readable
    }
}

const mapDispatchToProps =  {
    getCategories,
    onSelectCategory,
    onSelectPost,
    sort,
    vote
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
