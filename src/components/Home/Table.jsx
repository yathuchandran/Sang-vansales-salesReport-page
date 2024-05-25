import React, { useEffect, useState } from 'react'

import MuiEditableTable from './MuiEditableTable';

function Body({outlet,warehouseId,setProductIds,outletid,setBodyData,setBatchData,tableData,newValue,setNewValue,trnsId}) {

    
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
        <MuiEditableTable bodyData={combinedBody} outlet={outlet} warehouseId={warehouseId} setProductIds={setProductIds}   outletid={outletid} setBodyData={setBodyData} setBatchData={setBatchData} tableData={tableData}  newValue={newValue} setNewValue={setNewValue} trnsId={trnsId} />
        // <RoleSummary />
      }
      
      </div>
      
    }
    
    </div>
  )
}

export default Body






























// import React, { useState, useEffect } from "react";
// import {
//     Autocomplete,
//     Box,
//     Button,
//     Checkbox,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
// } from "@mui/material";
// import { GetEntryRestriction } from "../../api/Api";
// import AutoComplete3 from "../Role/tabs/AutoComplete";
// import Swal from "sweetalert2";

// const columns = [
//     { id: "SlNo", sName: "SlNo", minWidth: 120, name: "Sl No." },
//     { id: "Product", sName: "Product", minWidth: 50,  name: "Product" },
//     { id: "Unit", sName: "Unit", minWidth: 50,  name: "Unit" },
//     { id: "Qty", sName: "Qty", minWidth: 50,  name: "Qty" },
//     { id: "Batch", sName: "Batch", minWidth: 50, name: "Batch" },
//     { id: "Total Qty", sName: "Total Qty", minWidth: 50,  name: "Total Qty" },
//     { id: "Rate", sName: "Rate", minWidth: 50,  name: "Rate" },
//     { id: "Excise Tax", sName: "Excise Tax", minWidth: 50,  name: "Excise Tax%" },
//     { id: "Batch", sName: "Batch", minWidth: 50,  name: "Gross" },
//     { id: "Discount", sName: "Discount", minWidth: 50,  name: "Discount%" },
//     { id: "Dis Amount", sName: "Dis Amount", minWidth: 50, name: "Dis Amount" },
//     { id: "Add Charges", sName: "Add Charges", minWidth: 50,  name: "Add Charges" },
//     { id: "	Vat", sName: "	Vat", minWidth: 50,  name: "	Vat%" },
//     { id: "Net", sName: "Net", minWidth: 50,  name: "Net" },
//     { id: "Remarks", sName: "Remarks", minWidth: 50,  name: "Remarks" },
// ];


// const EnhancedCheckbox = ({ isChecked, onChange }) => {
//     return (
//         <Checkbox
//             checked={isChecked}
//             onChange={onChange}
//             inputProps={{ "aria-label": "checkbox" }}
//             sx={{ transform: "scale(0.7)" }} // Adjust checkbox size with scale transformation
//         />
//     );
// };

// export default function EnhancedTable({ masteriId, setMasters, formDataEdit, mode1, setNewState, newState, masterData,}) {
//     const [selectedRow, setSelectedRow] = useState(null);
//     const [autocompleteOpen, setAutocompleteOpen] = useState({});
//     const [formData, setFormData] = useState([]);
//     const [Data, setData] = useState(Array.from({ length: 1 }, () => ([]))); // Initialize Data with 30 empty objects
//     const [loading, setLoading] = useState(false);
  

//     React.useEffect(() => {
//         if (newState === true) {
//             setFormData([]);
//             setData({})
//             setNewState(false); // Move this line before the return statement
//             return; // Make sure to have a return statement here
//         }
//     }, [newState]);



//     useEffect(() => {
//         if (mode1 === "edit" && formDataEdit > 0) {
//             const getEntry = async () => {
//                 try {
//                     setLoading(true);
        
//                     const res = await GetEntryRestriction({
//                         roleId: formDataEdit,
//                     });
//                     const data = JSON.parse(res.result);
                    
                    
//                     // Create a map to hold the data grouped by iMasterTypeId
//                     const groupedData = data.reduce((acc, item) => {
//                         const typeId = item.iMasterTypeId; // identifier for grouping
//                         if (!acc[typeId]) {
//                             acc[typeId] = []; // Initialize an empty array for this type ID if it doesn't already exist
//                         }
//                         // Push the current item into the correct type ID array
//                         acc[typeId].push({
//                             bMaster: item.bMaster,
//                             bReport: item.bReport,
//                             TagName: item.sName,
//                             bTransaction: item.bTransaction,
//                             bView:item.bView,
//                             iTagId: item.iTagId,
//                             iMasterTypeId: typeId
//                         });
//                         return acc;
//                     }, {});
        
//                     // Convert the groupedData map back to an array format suitable for your state
//                     const formattedData = Object.keys(groupedData).map(key => ({
//                         [key]: groupedData[key]
//                     }));
        
//                     setMasters(formattedData);
//                     setLoading(false);
//                 } catch (error) {
//                     console.log("Error fetching entry restrictions:", error);
//                     setLoading(false);
//                 }
//             };
        
//             getEntry();
//         }
        
//     }, [formDataEdit]);

//     const handleAddRow = () => {
//         const newRow = {
//             bMaster: false,
//             bReport: false,
//             bTransaction: false,
//             bView: false,
//             TagName: "",
//             iTagId: 0,
//             iMasterTypeId: masteriId,

//         };
//         const newData = Array.isArray(Data) ? [...Data, newRow] : [newRow];
//         const newFormData = Array.isArray(formData) ? [...formData, newRow] : [newRow];
//         // Update the Data state with the new row
//         setData(newData);
//         setFormData(newFormData)
//     }





//     const handleRowClick = (row) => {
//         setSelectedRow(row);
//         setAutocompleteOpen((prevState) => ({
//             ...prevState,
//             [row.id]: true,
//         }));
//     };

//     const handleAutocompleteClose = (id) => {
//         setAutocompleteOpen((prevState) => ({
//             ...prevState,
//             [id]: false,
//         }));
//     };

//     const handleAutocompleteChange = (value, index) => {
      
//         const updatedFormData = [...formData];
//         if (updatedFormData[index]) {
//             updatedFormData[index].iTagId = value.iId;
//             updatedFormData[index].TagName = value.sName;
//         }
//         setFormData(updatedFormData);
        
//     };

 
//     const handleCheckboxChange = (isChecked, index, fieldName) => {
//     const updatedFormData = [...formData];
//     if (updatedFormData[index]) {
//         updatedFormData[index][fieldName] = isChecked;
//     }
//     setFormData(updatedFormData);
    
// };
    





//     return (
//         <Box sx={{ width: "95%", margin: "auto", marginTop: "30px" }}>
//             <div
//                 style={{
//                     display: "flex",
//                     flexDirection: "row",
//                     width: "100%",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                 }}
//             >

//                 <Paper sx={{ width: "100%", mb: 2 }}>
//                     <TableContainer sx={{ maxHeight: "40vh", overflow: "scroll" }}>
//                         {!loading && (
//                             <Table stickyHeader sx={{ minWidth: 700 }}>
//                                 <TableHead>
//                                     <TableRow>

//                                         {mode1 === "edit" && (
//                                             <Button onClick={handleAddRow}>Add Row</Button>
//                                         )}
//                                         {mode1 === "new" && (
//                                             <Button onClick={handleAddRow}>Add Row</Button>
//                                         )}

//                                         {columns.map((column) => (
//                                             <TableCell
//                                                 key={column.id}
//                                                 align="center"
//                                                 style={{ minWidth: column.minWidth }}
//                                             >
//                                                 {column.name}
//                                             </TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 {mode1 === "new" ? (
//                                     <TableBody>
//                                         {Array.isArray(formData) && formData.map((row, index) => {
//                                             return (
//                                                 <React.Fragment key={index}>
//                                                     <TableRow
//                                                         key={index}
//                                                         onClick={() => handleRowClick(row)}
//                                                         selected={selectedRow && selectedRow.id === row.id}
//                                                     >
//                                                         <TableCell>{index + 1}</TableCell>
//                                                         {columns.map((column) => (
//                                                             <TableCell key={column.id}
//                                                                 sx={{
//                                                                     padding: "4px",
//                                                                     height: "1px",
//                                                                     // border: "1px solid #ddd",
//                                                                     whiteSpace: "nowrap",
//                                                                     overflow: "hidden",
//                                                                     textOverflow: "ellipsis",
//                                                                     width: "calc(100% / 5)",
//                                                                     minWidth: "100px",
//                                                                     maxWidth: 170,

//                                                                 }}
//                                                                 component="th"
//                                                                 scope="row"
//                                                                 padding="normal"
//                                                                 align="center"
//                                                             >
//                                                                 {selectedRow && selectedRow.id === row.id && (
//                                                                     column.id === 'sMaster' ? (
//                                                                         <AutoComplete3
//                                                                             value={formData[index]?.iMasterTypeId === masteriId ? formData[index]?.TagName : ''}
//                                                                             // value={formData.iMasterTypeId === masteriId ? row.TagName : ''}

//                                                                             onChangeName={(value) => handleAutocompleteChange(value, index)}
//                                                                             masterId={masteriId}
//                                                                             open={true} // Always show the Autocomplete for the selected row
//                                                                             formData={formData}
//                                                                             setFormData={setFormData}
//                                                                             onClose={() => handleAutocompleteClose(row.id)}
//                                                                         />
//                                                                     ) : (
//                                                                         <EnhancedCheckbox
//                                                                             // isChecked={formData[index]?.[column.sName]}
//                                                                             isChecked={formData[index]?.iMasterTypeId === masteriId ? formData[index]?.[column.sName] : false}

//                                                                             onChange={(e) =>
//                                                                                 handleCheckboxChange(
//                                                                                     !formData[index]?.[column.sName],
//                                                                                     index,
//                                                                                     column.sName
//                                                                                 )
//                                                                             }
//                                                                         />
//                                                                     )
//                                                                 )}
//                                                             </TableCell>
//                                                         ))}

//                                                     </TableRow>

//                                                 </React.Fragment>
//                                             );
//                                         })}
//                                     </TableBody>
//                                 ) : (
//                                     <TableBody>
//                                         {Array.isArray(formData) && (
//                                             formData.filter(row => row.iMasterTypeId === masteriId).length > 0 ? (
//                                                 formData.filter(row => row.iMasterTypeId === masteriId).map((row, index) => {
//                                                     return (
//                                                         <React.Fragment key={index}>
//                                                             <TableRow
//                                                                 key={index}
//                                                                 onClick={() => handleRowClick(row)}
//                                                                 selected={selectedRow && selectedRow.id === row.id}
//                                                             >
//                                                                 <TableCell>{index + 1}</TableCell>
//                                                                 {columns.map((column) => (
//                                                                     <TableCell key={column.id}
//                                                                         sx={{
//                                                                             padding: "4px",
//                                                                             height: "1px",
//                                                                             whiteSpace: "nowrap",
//                                                                             overflow: "hidden",
//                                                                             textOverflow: "ellipsis",
//                                                                             width: "calc(100% / 5)",
//                                                                             minWidth: "100px",
//                                                                             maxWidth: 150,
//                                                                         }}
//                                                                         component="th"
//                                                                         scope="row"
//                                                                         padding="normal"
//                                                                         align="left">
//                                                                         {column.id === 'sMaster' ? (
//                                                                             <AutoComplete3
//                                                                                 // value={formData[index]?.TagName || ''}
//                                                                                 value={formData[index]?.iMasterTypeId === masteriId ? formData[index]?.TagName : ''}
//                                                                                 onChangeName={(value) => handleAutocompleteChange(value, index)}
//                                                                                 masterId={masteriId}
//                                                                                 open={true} // Always show the Autocomplete for the selected row
//                                                                                 formData={formData}
//                                                                                 setFormData={setFormData}
//                                                                                 onClose={() => handleAutocompleteClose(row.id)}
//                                                                             />
//                                                                         ) : (
//                                                                             <EnhancedCheckbox
//                                                                                 // isChecked={formData[index]?.[column.sName]}
//                                                                                 isChecked={formData[index]?.iMasterTypeId === masteriId ? formData[index]?.[column.sName] : false}

//                                                                                 onChange={(e) =>
//                                                                                     handleCheckboxChange(
//                                                                                         !formData[index]?.[column.sName],
//                                                                                         index,
//                                                                                         column.sName
//                                                                                     )
//                                                                                 }
//                                                                             />
//                                                                         )}
//                                                                     </TableCell>
//                                                                 ))}
//                                                             </TableRow>
//                                                         </React.Fragment>
//                                                     );
//                                                 })
//                                             ) : (
//                                                 <TableRow>
//                                                     <TableCell colSpan={columns.length}>
//                                                         No data available.
//                                                     </TableCell>
//                                                 </TableRow>
//                                             )
//                                         )}


//                                     </TableBody>
//                                 )}
//                             </Table>
//                         )}
//                         {loading && <div>loading...</div>} {/* Display loading indicator */}
//                         {(!loading && Data.length === 0) && <div>No data available.</div>} {/* Display message for empty data */}
//                     </TableContainer>
//                 </Paper>

//             </div>
//         </Box>
//     );
// }
