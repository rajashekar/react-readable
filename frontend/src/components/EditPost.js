import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import serializeForm from 'form-serialize'

/*
 * To edit Post
 */ 
class EditPost extends Component {
	handleSubmit = (e) => {
		e.preventDefault()
		const values = serializeForm(e.target, { hash: true })
        console.log(values)
        this.props.onEditPost(values)
    }

    render() {
        const {post} = this.props
        return (
            <div className="container">
                <Link className='text-left' to='/'>Back</Link>
                <div className="text-center">Edit Post Form</div>
                {post!==undefined && 
				<form onSubmit={this.handleSubmit} className='create-post-form'>
                    <input type="hidden" name="id" value={post.id}/>
                    <div className="row"><div className="col-25"><label>Title</label></div>
                        <div className="col-75">
                            <input type="text" name="title" defaultValue={post.title} placeholder="Title.."/>
                        </div>
                    </div>
                    <div className="row"><div className="col-25">Body</div>
                        <div className="col-75">
                            <textarea className="text-area" name="body" defaultValue={post.body} placeholder="Write something.."></textarea>
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
}

export default EditPost;
