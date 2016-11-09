import React from 'react'
import { render } from 'react-dom'

// First we import some modules...
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'


const About = React.createClass({
  render() {
    return (
      <h2>About</h2>
    )
  }

})
const Loans = React.createClass({
  render() {
    return (
        <h2>Loans</h2>
    )
  }
})
const Home = React.createClass({
  render() {
    return (
        <h2>Home</h2>
    )
  }
})
const Account = React.createClass({
  render() {
    return (
        <h2>My Account</h2>
    )
  }
})

// Then we delete a bunch of code from App and
// add some <Link> elements...
const App = React.createClass({
  render() {
    return (
      <div>
        <h1>App</h1>
        {/* change the <a>s to <Link>s */}
        <ul>
          <li><Link to="/loans">Loans</Link></li>
          <li><Link to="/account">My Account</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

        {/*
          next we replace `<Child>` with `this.props.children`
          the router will figure out the children for us
        */}
        {this.props.children}
      </div>
    )
  }
})

// Finally, we render a <Router> with some <Route>s.
// It does all the fancy routing stuff for us.
render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path="loans" component={Loans} />
      <Route path="account" component={Account} />
    </Route>
  </Router>
), document.body)
