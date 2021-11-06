import React  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core'
import {AiOutlineSearch} from 'react-icons/ai'

const Search=()=>{
    const useStyles = makeStyles({
        root: {
            marginTop:"60px",
    
            display: "flex",
            justifyContent:"center",
            backgroundColor:"#eaeaea"

        },
        searchBox:
        {
            marginTop:"40px",
            width:"70%",
            height:"120px",
            display: "flex",
            justifyContent:"center",
            alignItems: "center",
        },
        input:{
            width:"720px", 
            backgroundColor:"white",
            border:"none",
            height:"52px",
            padding:"0 12px",
            fontSize:"18px"
          }
 
       
       })
       const classes = useStyles();
    return (

        <>
        <div className={classes.root}>
        <div className={classes.searchBox}>
        <input placeholder="Search by City" className={classes.input} />
        <Button type="submit" variant="contained" color="primary" style={{height:"52px",fontSize:"18px",width:"200px",textTransform: 'capitalize',display:"flex",justifyContent:"space-around",padding:" 0 50px",borderRadius:"0"}}><AiOutlineSearch/> Search</Button>
        </div>
        </div>
        </>
    )

}
export default Search
