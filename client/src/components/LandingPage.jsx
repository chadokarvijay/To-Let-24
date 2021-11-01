import React  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography} from '@material-ui/core'

const LandingPage=()=>{
    const useStyles = makeStyles({
       root: {
           marginTop:"70px",
           border: "1px solid black",
       }

      
      })
      const classes = useStyles();

    return(
        <>
        <div className={classes.root}>
        <Typography variant='h4'>
           HOME
        </Typography>
        </div>
        </>
    )
}
export default LandingPage