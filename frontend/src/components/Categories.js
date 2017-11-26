import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import Posts from './Posts';
import { connect } from 'react-redux'

import { getCategories, onSelectCategory, 
         onSelectPost, deletePost, 
         sort, vote} from '../actions'

/**
 * This component will show categories on right side.
 * on select will redirect to appropriate category
 */
class Categories extends Component {

  componentDidMount() {
    var category;
    const {sortBy} = this.props.readable
    const {getCategories, onSelectCategory} = this.props
    if(this.props.match.params.category!==undefined) {
        category = this.props.match.params.category
    } else {
        category = "all"
    }
    getCategories()
    onSelectCategory(category,sortBy!==undefined?sortBy:"votes")
  }

  render() {

    const { categories,posts,sortBy } = this.props.readable
    const { onSelectCategory, onSelectPost, deletePost, sort, vote} = this.props

    return (
        <div>
            <div className="layout_3col_left">
                <div><b>Categories</b></div>
                <div className="category">
                    <div>
                        <Link to='/' onClick={e => onSelectCategory(e.target.innerText)}>all</Link>
                    </div>
                    {categories!==undefined && categories.map(category => (
                    <div key={category.name}>
                        <Link to={`/${category.name}`} onClick={e => onSelectCategory(e.target.innerText)}>
                            {category.name}
                        </Link>
                    </div>
                    ))}
                </div>
            </div>
            <div className='grid_page'>
                    <Posts 
                        posts={posts} 
                        sort={sort}
                        sortBy={sortBy}
                        vote={vote} 
                        onSelectPost={onSelectPost}
                        onDeletePost={deletePost}
                    />
            </div>
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
     getCategories, onSelectCategory, onSelectPost, deletePost, sort, vote
}

export default connect(mapStateToProps,mapDispatchToProps)(Categories)
