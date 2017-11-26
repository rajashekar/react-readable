import React, { Component } from 'react';
import { Switch,Route,withRouter } from 'react-router-dom'

import Categories from './Categories';
import PostView from './PostView';
import CreatePost from './CreatePost'
import EditPost from './EditPost'

import '../App.css';

/*
 * Main component for this app
 */

class App extends Component {

  // Main render method
  render() {
    return (
        <div className='ContentWrapper'>
            <Switch>
                <Route exact path="/newpost" component={CreatePost}/>
                <Route exact path="/editpost/:post_id" component={EditPost}/>
                <Route exact path="/" component={Categories}/>
                <Route exact path="/:category" component={Categories}/>
                <Route exact path="/:category/:post_id" component={PostView}/>
            </Switch>
        </div>
    );
  }
}

// withRouter is needed since some of the Route's are not working
export default withRouter(App)
