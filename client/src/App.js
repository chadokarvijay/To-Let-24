import React  from 'react';
import {Route, Switch} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LandingPage  from './components/LandingPage.jsx';
import Login from './components/Login.jsx';
import Signup  from './components/Signup.jsx';
function App() {
  return (
  <>
  <Switch>
      <Route path="/login">
          <Login/>
      </Route>
      <Route path="/signup">
           <Signup/>
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
