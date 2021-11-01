import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField ,Typography} from '@material-ui/core'
import axios from 'axios'

const Signup =()=>{
   const useStyles= makeStyles({
    form:
    {
        width: '100%',
        height:'700px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        border: '1px solid black'
    }
   })
   const classes=useStyles();
   const [formDetails, updateformDetails] = useState({
    firstname:"",lastname:"",username:"",password:"",email:"",mobileno:""})
    const update=(e)=>{


        let cName= e.target.name;
        let cValue= e.target.value;
        updateformDetails({...formDetails,[cName]:cValue})
        console.log(formDetails)
        
    }
    const Submit = async (e)=>{
        e.preventDefault();
        
       
         axios.post('/signup',
        
        {
            firstname: formDetails.firstname,
            lastname: formDetails.lastname,
            username: formDetails.username,
            password: formDetails.password,
            email: formDetails.email,
            mobileno: formDetails.mobileno,
        }).then(function(res){
            console.log(res.data);
        })
    
    }
     

    return (
        <>
    <form className={classes.form} onSubmit={Submit}  method = "POST">
        <Typography variant='h3'>
          Join our Family!
        </Typography>

        <TextField  label="First Name" variant='outlined' name="firstname" onChange={update}  value={formDetails.firstname} required style={{width:'65%'}}/>

        <TextField  label="Last Name" variant='outlined' name="lastname" onChange={update} value={formDetails.lastname} required style={{width:'65%'}}/>

        <TextField  label="Mobile No." variant='outlined' name="mobileno" onChange={update} value={formDetails.mobileno} required style={{width:'65%'}}/>

        <TextField  label="Email-Id" variant='outlined' name="email" onChange={update} value={formDetails.email} required style={{width:'65%'}}/>

        <TextField  label="Username" variant='outlined' name="username" onChange={update} value={formDetails.username} required style={{width:'65%'}}/>

        <TextField type="password" name="password" onChange={update} value={formDetails.password} label="Password" variant='outlined' required style={{width:'65%'}}/>
      
        <TextField type="password" name="repassword" label="Re-enter password" variant='outlined' required style={{width:'65%'}}/>
        
        <Button variant="contained" type="submit" style={{backgroundColor:"#56baed",color:"white",width:"45%"}}>Submit</Button>
    </form>
          
        </>
    )
}
export default Signup
