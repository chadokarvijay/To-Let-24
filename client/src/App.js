import React  from 'react';
import {Route, Switch} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LandingPage  from './components/LandingPage.jsx';
import Login from './components/Login.jsx';
import Signup  from './components/Signup.jsx';
import Search  from './components/Search.jsx';
function App() {
  return (
  <>
  <Switch>
      <Route exact path="/login">
          <Login/>
      </Route>
      <Route exact path="/signup">
           <Signup/>
      </Route>
      <Route exact path="/search">
          <Navbar/>
          <Search/>
      </Route>
      <Route path="/">
          <Navbar/>
          <LandingPage/>
      </Route>
      

  </Switch>
  </>
  );
}

export default App;
