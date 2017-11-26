import React from 'react';
import serializeForm from 'form-serialize'

/*
 * To create comment
 */ 
const handleSubmit = (e,props) => {
    e.preventDefault()
    const values = serializeForm(e.target, { hash: true })
    const comment = {...values,
        id: Math.random().toString(36).substr(-8)+
            Math.random().toString(36).substr(-8)+
            Math.random().toString(36).substr(-8),
        timestamp: Date.now(),
        voteScore: 1,
        parentId: props.parentId
    }
    props.onCreateComment(comment)
    // to clear the form values
    this.commentFormRef.reset(); 
}
const CreateComment = (props) => (
    <div className="container">
        <form ref={(el) => this.commentFormRef = el} onSubmit={(e) => handleSubmit(e, props)} className='create-post-form'>
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
)


export default CreateComment;
