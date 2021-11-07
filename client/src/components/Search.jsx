import React,{useState, useEffect}  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core'
import {AiOutlineSearch} from 'react-icons/ai'
import List from '../images/list.json'
import Rent from './Cards/Rent.jsx'
import img from '../images/room.png'
const Search=()=>{

    const [search, setSearch]= useState("")
    const [searchList, setSearchList]= useState(List)
    const searchUpdate=(e)=>{
        e.preventDefault();
        setSearch(e.target.value)
    }
   const updateList=()=>{

    console.log(search)
   }
    useEffect(()=>
    {
       
        updateList();
        

    },[search])

    const useStyles = makeStyles({
        root: {
            marginTop:"60px",
            display: "flex",
            justifyContent:"center",
            flexDirection:"column",
            "alignItems":"center",
            backgroundColor:"#eaeaea",
        

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
          },
         searchList:
         {
             margin:"10px",
             display: "flex",
             justifyContent: "space-around",
             border: "1px solid red",
             flexWrap: "wrap",
         } 
 
       
       })

       const classes = useStyles();
    return (

        <>
        <div className={classes.root}>
        <div className={classes.searchBox}>
        <input placeholder="Search by City" value={search} onChange={searchUpdate} className={classes.input} />
        <Button type="submit" variant="contained" color="primary" style={{height:"52px",fontSize:"18px",width:"200px",textTransform: 'capitalize',display:"flex",justifyContent:"space-around",padding:" 0 50px",borderRadius:"0"}}><AiOutlineSearch/> Search</Button>
        </div>

        <div className={classes.searchList}>
        {searchList.map((ele, i) => {     
                  return <Rent image={ele.image} type={ele.type} city={ele.city} location={ele.location} bedrooms={ele.bedrooms} price={ele.price}/>    
          
        })}




        </div>
        </div>
        </>
    )

}
export default Search
