import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import serializeForm from 'form-serialize'
import { connect } from 'react-redux'

import {createPost} from '../actions'

/*
  To create post
    id - UUID should be fine, but any unique id will work
    timestamp - timestamp in whatever format you like, you can use Date.now() if you like
    title - String
    body - String
    author - String
    category: Any of the categories listed in categories.js. Feel free to extend this list as you desire.
 */ 

class CreatePost extends Component {
	handleSubmit = (e) => {
		e.preventDefault()
		const values = serializeForm(e.target, { hash: true })
        console.log(values)
        const post = {...values,
            id: Math.random().toString(36).substr(-8)+
                Math.random().toString(36).substr(-8)+
                Math.random().toString(36).substr(-8),
            timestamp: Date.now(),
            deleted: false,
            voteScore: 1,
            commentCount: 0
        }
        this.props.createPost(post)
        this.props.history.push("/")
	}

    render() {
        console.log('Create post')
        return (
            <div className="container">
                <Link className='text-left' to='/'>Back</Link>
                <div className="text-center">New Post Form</div>
				<form onSubmit={this.handleSubmit} className='create-post-form'>
                    <div className="row"><div className="col-25"><label>Title</label></div>
                        <div className="col-75">
                            <input type="text" name="title" placeholder="Title.."/>
                        </div>
                    </div>
                    <div className="row"><div className="col-25">Author</div>
                        <div className="col-75">
                            <input type="text"  name="author" placeholder="Author.."/>
                        </div>
                    </div>
                    <div className="row"><div className="col-25">Category</div>
                        <div className="col-75">
                            <select name="category">
                                <option value="react">react</option>
                                <option value="redux">redux</option>
                                <option value="udacity">udacity</option>
                            </select>
                        </div>
                    </div>
                    <div className="row"><div className="col-25">Body</div>
                        <div className="col-75">
                            <textarea className="text-area" name="body" placeholder="Write something.."></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <input type="submit" value="Submit"/>
                    </div>
				</form>
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
    createPost
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost)
