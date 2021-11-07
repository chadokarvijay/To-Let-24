import React  from 'react';
import {Route, Switch} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LandingPage  from './components/LandingPage.jsx';
import Login from './components/Login.jsx';
import Signup  from './components/Signup.jsx';
import Search  from './components/Search.jsx';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
      fontFamily: [
        'Poppins', 'sans-serif'
      ].join(','),
    },});
    
function App() {
  return (
  <>
  <ThemeProvider theme={theme}>

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
  </ThemeProvider>
  </>
  );
}

export default App;
