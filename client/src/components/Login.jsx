import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField ,Typography} from '@material-ui/core'
import axios from 'axios'


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

       const [formDetails, updateformDetails] = useState({username:"",password:""})
        const update=(e)=>{
    
    
            let cName= e.target.name;
            let cValue= e.target.value;
            updateformDetails({...formDetails,[cName]:cValue})
            console.log(formDetails)
            
        }
        const Submit = async (e)=>{
            e.preventDefault();
            
           
             axios.post('/login',
            
            {
                username: formDetails.username,
                password: formDetails.password,
            }).then(function(res){
                console.log(res.data);
            })
        
        }

    return (
        <>
        <div className= {classes.root}>
        <form className={classes.form} onSubmit={Submit}>
                <Typography variant="h4"> 
                Log In
                </Typography>

                <TextField   id="name" label="Username" variant='outlined' onChange={update} name="username" required style={{width:'95%'}}/>
                <TextField   id="password" label="Password" variant='outlined' onChange={update} name="password" type="password" required style={{width:'95%'}}/>


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