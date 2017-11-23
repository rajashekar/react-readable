import React, { Component } from 'react';
import {Link} from 'react-router-dom'

/**
 * This component will show categories on right side.
 * on select will redirect to appropriate category
 */
class Categories extends Component {
  render() {
    const { categories, onSelectCategory } = this.props
    return (
      <div className="layout_3col_left">
          <div><b>Categories</b></div>
          <div className="category">
            <div>
                <Link to='/' onClick={e => onSelectCategory(e.target.innerText)}>all</Link>
            </div>
            {categories!==undefined && categories.map(category => (
            <div key={category.name}>
                <Link to={`/category/${category.name}`} onClick={e => onSelectCategory(e.target.innerText)}>
                    {category.name}
                </Link>
            </div>
            ))}
          </div>
      </div>
    );
  }
}

export default Categories;
