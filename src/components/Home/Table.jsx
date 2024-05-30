import React, { useEffect, useState } from 'react'

import MuiEditableTable from './MuiEditableTable';

function Body({outlet,warehouseId,setProductIds,outletid,setBodyData,tableData,newValue,setNewValue,trnsId}) {

    
    const [selectedHeaderMain, setselectedHeaderMain] = useState("Main")
    const [formData, setformData] = useState({
        
    })

    const fixedFields = [
        {
      sFieldName:"Product",
      sFieldCaption:"Product",
     
   },
   {
    sFieldName:"Unit",
    sFieldCaption:"Unit",
   
 },
 {
  sFieldName:"Qty",
  sFieldCaption:"Qty",
  
},
{
  sFieldName:"Batch",
  sFieldCaption:"Batch",
 
},
{
  sFieldName:"Free Qty",
  sFieldCaption:"Free Qty",
 
},

{
  sFieldName:"Batch",
  sFieldCaption:"iBatch",
 
},
{
  sFieldName:"Total Qty",
  sFieldCaption:"Total Qty",

},{
    sFieldName:"Rate",
    sFieldCaption:"Rate",
   
  },
  {
    sFieldName:"Excise Tax%",
    sFieldCaption:"Excise Tax%",
  
  },
  {
    sFieldName:"Gross",
    sFieldCaption:"Gross",
   
  },
  {
    sFieldName:"Discount%",
    sFieldCaption:"Discount",
 
  },
  {
    sFieldName:"Dis Amount",
    sFieldCaption:"DisAmount",
 
 },
 {
  sFieldName:"Add Charges",
  sFieldCaption:"AddCharges",

},
{
  sFieldName:"Vat%",
  sFieldCaption:"Vat",

},
{
  sFieldName:"Net",
  sFieldCaption:"Net",
  
},
{
  sFieldName:"Remarks",
  sFieldCaption:"Remarks",

},
  ]
  
const combinedBody = [...fixedFields]
 
  return (
    <div className="BodyMain" 
    style={{justifyContent: "center", 
    alignItems: "center" 
}}>
   
    {
      selectedHeaderMain ==="Main" &&
      <div >
       
      {
        <MuiEditableTable bodyData={combinedBody} outlet={outlet} warehouseId={warehouseId} setProductIds={setProductIds}   outletid={outletid} setBodyData={setBodyData}  tableData={tableData}  newValue={newValue} setNewValue={setNewValue} trnsId={trnsId} />
        // <RoleSummary />
      }
      
      </div>
      
    }
    
    </div>
  )
}

export default Body



















