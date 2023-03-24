import "./styles.css";
import {useState} from 'react'

export default function App() {
  const [state,setState] = useState(1)
  const pgCount=13;
  function showPagination() {
    const pagination = [];
    var start,end;
if(state-2<=0){
 start=1;
 end=5; 
}
else if (state+2>pgCount){
  end=pgCount;
  start=pgCount-4
}
else{
  start=state-2;
  end=state+2
}
    for(var i = start ; i<= end; i ++)
    pagination.push(<div key={i} style={{width:'30px',height:'40px',backgroundColor:'lightgrey',display:'flex',justifyContent:'center',alignItems:'center'}} className={state==i ? 'active':''} onClick={(e)=>{
      setState(+e.target.innerHTML)
    }}>{i}</div>)
  return pagination;
  }
  return (
    <div className="App">
       <div style={{width:'70px',height:'40px',backgroundColor:'lightgrey',display:'flex',justifyContent:'center',alignItems:'center'}} onClick={()=>{
  if(state == 1)
  return;
  setState(+state - 1)
       }} className={state==1 ? 'disabled' : ''}>PREV</div>
       <div style={{width:'70px',height:'40px',backgroundColor:'lightgrey',display:'flex',justifyContent:'center',alignItems:'center'}} onClick={()=>{
         setState(1)
       }}>START</div>
       {showPagination()}
     <div style={{width:'70px',height:'40px',backgroundColor:'lightgrey',display:'flex',justifyContent:'center',alignItems:'center'}} onClick={()=>{
  if(state == pgCount)
  return
  setState(+state+1)
     }} className={state==pgCount ? 'disabled' : ''}>NEXT</div>
     <div style={{width:'70px',height:'40px',backgroundColor:'lightgrey',display:'flex',justifyContent:'center',alignItems:'center'}} onClick={()=>{
       setState(pgCount)
     }}>LAST</div>
    </div>
  );
}
