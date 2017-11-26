import React, { Component } from 'react';
import serializeForm from 'form-serialize'

/*
 * To create comment
    id: Any unique ID. As with posts, UUID is probably the best here.
    timestamp: timestamp. Get this however you want.
    body: String
    author: String
    parentId: Should match a post id in the database.
 */ 
class CreateComment extends Component {
    handleSubmit = (e) => {
        e.preventDefault()
		const values = serializeForm(e.target, { hash: true })
        const comment = {...values,
            id: Math.random().toString(36).substr(-8)+
                Math.random().toString(36).substr(-8)+
                Math.random().toString(36).substr(-8),
            timestamp: Date.now(),
            voteScore: 1,
            parentId: this.props.parentId
        }
        this.props.onCreateComment(comment)
        // to clear the form values
        this.commentFormRef.reset(); 
    }
    render() {
        return (
            <div className="container">
                <form ref={(el) => this.commentFormRef = el} onSubmit={this.handleSubmit} className='create-post-form'>
                    <div className="row"><div className="col-25">Author</div>
                        <div className="col-75">
                            <input type="text"  name="author" placeholder="Author.."/>
                        </div>
                    </div>
                    <div className="row"><div className="col-25">Comment: </div>
                        <div className="col-75">
                            <textarea className="text-area" name="body" placeholder="Add comment.."></textarea>
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

export default CreateComment;
