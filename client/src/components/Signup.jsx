import React  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField ,Typography} from '@material-ui/core'


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
    return (
        <>
    <form className={classes.form} action ="/signup" method = "POST" id ="form">
        <Typography variant='h3'>
          Join our Family!
        </Typography>

        <TextField  label="First Name" variant='outlined' name="firstname" required style={{width:'65%'}}/>

        <TextField  label="Last Name" variant='outlined' name="lastname" required style={{width:'65%'}}/>

        <TextField  label="Mobile No." variant='outlined' name="mobileno" required style={{width:'65%'}}/>

        <TextField  label="Email-Id" variant='outlined' name="email" required style={{width:'65%'}}/>

        <TextField  label="Username" variant='outlined' name="username" required style={{width:'65%'}}/>

        <TextField type="password" name="password"  label="Password" variant='outlined' required style={{width:'65%'}}/>
      
        <TextField type="password" name="repassword" label="Re-enter password" variant='outlined' required style={{width:'65%'}}/>
        
        <Button variant="contained" type="submit" style={{backgroundColor:"#56baed",color:"white",width:"45%"}}>Submit</Button>
    </form>
          
        </>
    )
}
export default Signup