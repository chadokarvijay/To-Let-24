import React  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, AppBar, Toolbar} from '@material-ui/core';

import img from '../images/icon.jpg'

const Navbar=()=>{
  const useStyles = makeStyles({

    imgBox:
    {
        width: '180px',
        height : '60px',
        display: 'flex',
        alignItems: 'flex-end',
        position: 'relative',
         border: '1px solid black',
       
    },
    img:
  {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },

 
   toolbar:
   {
    backgroundColor:'#4d4d4d',
    display: 'flex',
    justifyContent: 'space-between',
    
   },
   options: {
     display: 'flex',
     justifyContent: 'space-around',
     flexGrow: '0.1',
     fontSize: '20px'
   },

  
  })
    const classes = useStyles();
return(
<>


<AppBar className={classes.appBar} elevation={0}>

<Toolbar className={classes.toolbar}>
<div className={classes.imgBox}>
  <img src={img} alt="CAR" className={classes.img} ></img>
</div>
<div className={classes.options}>
<Button style={{color: '#ffd54f'}}>
<a href='/search' style={{color: 'inherit', textDecoration:'none'}}>  SEARCH
</a>

</Button>
<Button style={{color: '#ffd54f'}}>
<a href='/post' style={{color: 'inherit', textDecoration:'none'}}>  POST
</a>
</Button>
<Button style={{color: '#ffd54f'}}>
<a href='/login' style={{color: 'inherit', textDecoration:'none'}}>  LOG IN
</a>
</Button>
<Button variant="contained" style={{color: '#ffd54f', backgroundColor: 'black'}}>
<a href='/signup' style={{color: 'inherit', textDecoration:'none'}}>  SIGN UP
</a>
</Button>

</div>
</Toolbar>

</AppBar>

</>)

}

export default Navbar
