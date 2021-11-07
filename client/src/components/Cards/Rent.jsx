import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core'
import {AiFillEnvironment} from 'react-icons/ai'
import {GiPersonInBed} from "react-icons/gi";
import { FaRupeeSign } from "react-icons/fa";


const Rent=(props)=>
{
    const useStyles = makeStyles({
        box:
        {
            height:"500px",
            width:"420px",
           
            margin: "10px",
            display: "flex",
            justifyContent: "flex-start",
            backgroundColor: "white",
            flexDirection:"column",
            borderRadius: "5px"
            
        },
        imgBox:
        {
            width: '100%',
            height : '240px',
            position: 'relative',
            
            borderRadius: "5px"
           
        },
        img:
        {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          borderRadius: "5px"
        },
        content:
        {
            margin: "10px",
            
        
        },
        box1:
        {
            height: "75%",
            display: "flex",
            justifyContent: "space-around",
            flexDirection:"column",
            margin: "10px 0",
            borderBottom: "1px solid gray",
        },
        box2:
        {
            height: "60%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection:"column",
        },
        price:{

            display: "flex",
            justifyContent: "space-between",
        }
    
 
       
       })
       const classes = useStyles();
    
    return (
        <>
        <div className={classes.box}>
            <div className={classes.imgBox}>
                <img className={classes.img} src={props.image} alt={"vjbjhk"}></img>
                
            </div>
            <div className={classes.content}>
                <div className={classes.box1}>
                    <Typography variant="h5" className={classes.type}>
                    {props.type}
                    </Typography>
                
                    <Typography variant="h7" style={{color: "gray",fontWeight:"bold",fontSize:"18px",marginBottom:"20px"}}>
                    <AiFillEnvironment/>  {props.location}, {props.city}
                    </Typography> 
                </div>
                <div className={classes.box2}>
                    <div>
                        <Typography variant="p" style={{color: "gray",fontSize:"18px"}}>
                        <GiPersonInBed  style={{fontSize:"16px"}}/> {props.bedrooms} Bedrooms
                        </Typography>
                    </div>    

                    <div className={classes.price}>
                        <Typography style={{fontSize:"24px"}} >
                        <FaRupeeSign style={{fontSize:"20px"}}/> {props.price}
                        </Typography>

                        <Button variant="contained" color="primary"> See More Details</Button>
                        


                    </div> 
                </div>

                 


            </div>







        </div>


    
    

        </>

    )
}

export default Rent
