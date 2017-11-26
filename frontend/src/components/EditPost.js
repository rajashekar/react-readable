import React from 'react';
import { Link } from 'react-router-dom'
import serializeForm from 'form-serialize'
import { connect } from 'react-redux'

import { editPost } from '../actions'

/*
 * To edit Post
 */ 
const handleSubmit = (e, props) => {
    const { posts,sortBy } = props.readable
    e.preventDefault()
    const post = serializeForm(e.target, { hash: true })
    props.editPost(post,posts,sortBy)
    props.history.push("/")
}

const EditPost = (props) => {
    const { selectedPost } = props.readable
    return (
        <div className="container">
            <Link className='text-left' to='/'>Back</Link>
            <div className="text-center">Edit Post Form</div>
            {selectedPost!==undefined && 
            <form onSubmit={(e) => handleSubmit(e, props)} className='create-post-form'>
                <input type="hidden" name="id" value={selectedPost.id}/>
                <div className="row"><div className="col-25"><label>Title</label></div>
                    <div className="col-75">
                        <input type="text" name="title" defaultValue={selectedPost.title} placeholder="Title.."/>
                    </div>
                </div>
                <div className="row"><div className="col-25">Body</div>
                    <div className="col-75">
                        <textarea className="text-area" name="body" defaultValue={selectedPost.body} placeholder="Write something.."></textarea>
                    </div>
                </div>
                <div className="row">
                    <input type="submit" value="Submit"/>
                </div>
            </form>
            }
        </div>
    );
}

function mapStateToProps({readable}) {
    return {
        readable
    }
}

const mapDispatchToProps =  {
    editPost
}

export default connect(mapStateToProps,mapDispatchToProps)(EditPost)
