import React  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, TextField } from '@material-ui/core'


const Login =()=>{
    const useStyles = makeStyles({
         root:{

            width:"100%",
            height:"100vh",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            flexDirection:"column",
            
         },
         form: {

            width: "390px",
            height:"330px",
            border:"2px solid black",
            display:"flex",
            alignItems:"center",
            justifyContent:"space-around",
            flexDirection:"column",
         },
         signup:{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily:  "sans-serif",
            fontSize: "14px",
            marginTop: "23px"
            },
       })
       const classes = useStyles();

    return (
        <>
        <div className= {classes.root}>
        <form className={classes.form}>
                <Typography variant="h4"> 
                Log In
                </Typography>

                <TextField   id="name" label="Username" variant='outlined' name="username" required style={{width:'95%'}}/>
                <TextField   id="password" label="Password" variant='outlined' name="password" type="password" required style={{width:'95%'}}/>


                <Button variant="contained" type="submit" style={{backgroundColor:"#56baed",color:"white",width:"45%"}}>Submit</Button>
                <div className={classes.signup}>
                  <div>
                  New here? Don't worry we got you.

                  </div>
                  <div>
                  <a href='/signup'>Register now</a>
                     
                  </div>
                </div>
            </form>

         </div>   
        </>
    )
}
export default Login