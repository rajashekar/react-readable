import React, { Component } from 'react';
import { Route,withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Categories from './Categories';
import Posts from './Posts';
import PostView from './PostView';
import CreatePost from './CreatePost'
import EditPost from './EditPost'

import { getCategories,onSelectCategory,
         onSelectPost, createPost, editPost, deletePost, 
         createComment, deleteComment, editComment, changeComment, editDone,
         sort, vote} from '../actions'

import '../App.css';

/*
 * Main component for this app
 */

class App extends Component {

   // Initially mount all Categories and all Posts
  componentDidMount() {
    const {getCategories, onSelectCategory, onSelectPost} = this.props
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

  // For rendering categories
  renderCategory = () => {
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
    const { posts,comments,selectedPost,sortBy,modifiedComment } = this.props.readable
    const { onSelectPost, vote, deletePost, 
            createComment, editComment, deleteComment,
            changeComment, editDone} = this.props
    return (
        <div>
            <PostView 
                posts={posts}
                post={selectedPost}
                comments={comments}
                sortBy={sortBy}
                vote={vote}
                onDeletePost={deletePost}
                onSelectPost={onSelectPost}
                onCreateComment={comment => createComment(comment,comments)}
                onDeleteComment={commentid => deleteComment(commentid,comments)}
                onEditComment={commentid => editComment(commentid,comments)}
                onChangeComment={changeComment}
                onEditDone={commentid => editDone(commentid,modifiedComment,comments)}
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
                    this.props.createPost(post)
                    history.push('/')
                }}
            />
        </div>
    )
  }

  // For rendering Edit post
  renderEditPost = (history) => {
    const { selectedPost,posts,sortBy } = this.props.readable
    return (
        <div>
            <EditPost
                post={selectedPost}
                onEditPost={(post) => {
                    this.props.editPost(post,posts,sortBy)
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
            <Route path="/newpost" render={({history}) => this.renderCreatePost(history)}/>
            <Route path="/post" render={({history}) => this.renderPost(history)}/>
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
    getCategories, onSelectCategory,
    onSelectPost, createPost, editPost, deletePost,
    createComment, deleteComment, editComment, changeComment, editDone,
    sort, vote
}

// withRouter is needed since some of the Route's are not working
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App))
