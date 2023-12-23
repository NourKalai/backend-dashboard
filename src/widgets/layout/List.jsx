import { Input, Typography } from "@material-tailwind/react";
import { ListItem } from "@mui/material";
import { useState } from "react";

/**
 * @param {array} array[{
 * title: string,
 * subtitle: string,
 * key: string,}]
 * @param {function} action
 */
export default function List({array,action}){
   const [inputValue,setInputValue]=useState("");
   const [list,setList]=useState(array);
   if(array.length===0){
      return (
         <div className="flex flex-col p-2 shadow-md shadow-blue-gray-200 w-[200px] xs:w-[250px] sm:w-[400px]">
            <Typography className="text-xs font-semibold gray">
               Rien Pour Le Moment
            </Typography>
         </div>
      )
   }
   return (
      <div className="flex flex-col p-2 shadow-md shadow-blue-gray-200 w-[200px] xs:w-[250px] sm:w-[400px]">
         <Input label="Search here" className="w-[95%] xs:w-full" value={inputValue} onInput={(e)=>{
            setInputValue(e.target.value)
            setList(array.filter((el)=>el.title.startsWith(e.target.value)));
         }}/>

         <ul className="h-[90px] overflow-auto w-full mt-4">
            { list.map(item=>{
               return (
                  <ListItem key={item.key} onClick={()=> {action(item.key)}}>
                     <Typography className="text-xs font-semibold text-blue-300 underline underline-offset-2 cursor-pointer hover:text-blue-500">
                        {item.title}
                     </Typography>
                  </ListItem>
               )
            })}
         </ul>
      </div>
   )
}