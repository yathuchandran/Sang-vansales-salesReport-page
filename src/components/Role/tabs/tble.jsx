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
// import { GetEntryRestriction } from "../../../api/Api";
// import AutoComplete3 from "./AutoComplete";
// import Swal from "sweetalert2";

// const columns = [
//     { id: "sMaster", sName: "Master", minWidth: 120 },
//     { id: "Master", sName: "Master", minWidth: 50, isChecked: false },
//     { id: "Transaction", sName: "Transaction", minWidth: 50, isChecked: false },
//     { id: "Report", sName: "Report", minWidth: 50, isChecked: false },
//     { id: "View", sName: "View", minWidth: 50, isChecked: false },
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

// export default function EnhancedTable({ masteriId, setMasters, formDataEdit, mode1, setNewState, newState, masterData }) {
//     const [selectedRow, setSelectedRow] = useState(null);
//     const [autocompleteOpen, setAutocompleteOpen] = useState({});
//     const [formData, setFormData] = useState([]);
//     const [Data, setData] = useState(Array.from({ length: 30 }, () => ([]))); // Initialize Data with 30 empty objects
//     const [loading, setLoading] = useState(false);
//     const [MasterDatas, setMasterDatas] = useState([]);

//     //     useEffect(() => {
//     //     const endData = Array.isArray(masterData) ? masterData.filter(row => row && (row.iMasterTypeId === masteriId )).map((row, index) => {
//     //         return row
//     //     })
    
//     //     setMasterDatas(endData ||Array.from({ length: 30 }, () => ([])))
//     // }, [masteriId])
    

//     useEffect(() => {

//         setMasters(formData)
//     }, [formData])

// console.log(Data,"Data===============================",masteriId);


//     useEffect(() => {
//         if (masterData.length === 0) {
//             const newRow = Array.from({ length: 30 }, () => ({
//                 Master: false,
//                 Report: false,
//                 Transaction: false,
//                 View: false,
//                 TagName: "",
//                 iTagId: 0,
//                 iMasterTypeId:masteriId,
//             }));
//             setData(newRow);
//         } else {
//             const initialFormData = {};
//             masterData.forEach((data, index) => {
//                 initialFormData[index] = { ...data };
//             });
//             setFormData(initialFormData);
//             setData(masterData);

//         }
//     }, [masteriId]);






//     React.useEffect(() => {
//         if (newState === true) {
//             setFormData([]);
//             setData({})
//             setNewState(false); // Move this line before the return statement
//             return; // Make sure to have a return statement here
//         }
//     }, [newState]);



//     useEffect(() => {
//         if (mode1 === "edit" && formDataEdit > 0 && masteriId > 0) {
//             const getEntry = async () => {
//                 try {
//                     setLoading(true)

//                     const res = await GetEntryRestriction({
//                         roleId: formDataEdit,
//                     });
//                     const data = JSON.parse(res.result);
//                     const formattedData = data.map(item => ({
//                         Master: item.bMaster,
//                         Report: item.bReport,
//                         TagName: item.sName,
//                         Transaction: item.bTransaction,
//                         iTagId: item.iTagId,
//                         iMasterTypeId: item.iMasterTypeId
//                     }));


//                     setData(formattedData);
//                     setFormData(formattedData)
//                     setLoading(false)
//                 } catch (error) {
//                     console.log("GetEntryRestriction", error);
//                     if (error.response.data.message) {
//                         Swal.fire({
//                             title: "Error!",
//                             text: `${error.response.data.message}`,
//                             icon: "error",
//                             showConfirmButton: false,
//                             timer: 1500,
//                         });
//                     } else {
//                         Swal.fire({
//                             title: "Error!",
//                             text: `${error.message}`,
//                             icon: "error",
//                             showConfirmButton: false,
//                             timer: 1500,
//                         });
//                     }
//                 }
//             };
//             getEntry();
//         }
//     }, [formDataEdit, masteriId]);


//     const handleAddRow = () => {
//         const newRow = {
//             Master: false,
//             Report: false,
//             Transaction: false,
//             View: false,
//             TagName: "",
//             iTagId: 0,
//         };
//         const newData = Array.isArray(Data) ? [...Data, newRow] : [newRow];

//         setData(newData);

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
//         setFormData((prevData) => {
//             const newData = [...prevData];
//             newData[index] = {
//                 ...newData[index],
//                 iTagId: value ? value.iId : '',
//                 TagName: value ? value.sName : '',
//                 iMasterTypeId: masteriId,
//             };
//             return newData;
//         });
//     };


//     const handleCheckboxChange = (isChecked, index, fieldName) => {
//         setFormData((prevData) => {
//             const newData = [...prevData];
//             newData[index] = {
//                 ...newData[index],
//                 [fieldName]: isChecked === undefined ? false : isChecked,
//             };
//             return newData;
//         });
//     };

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
//                                             <TableCell ></TableCell>
//                                         )}

//                                         {columns.map((column) => (
//                                             <TableCell
//                                                 key={column.id}
//                                                 align="center"
//                                                 style={{ minWidth: column.minWidth }}
//                                             >
//                                                 {column.sName}
//                                             </TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 {mode1 === "new" ? (
//                                     <TableBody>
//                                         {Array.isArray(Data) &&(
//                                             Data.filter(row => row.iMasterTypeId === masteriId).length > 0 ? (
//                                                 Data.filter(row => row.iMasterTypeId === masteriId).map((row, index) => {

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
//                                                                             value={formData[index]?.TagName || ''}
//                                                                             onChangeName={(value) => handleAutocompleteChange(value, index)}
//                                                                             masterId={masteriId}
//                                                                             open={true} // Always show the Autocomplete for the selected row
//                                                                             formData={formData}
//                                                                             setFormData={setFormData}
//                                                                             onClose={() => handleAutocompleteClose(row.id)}
//                                                                         />
//                                                                     ) : (
//                                                                         <EnhancedCheckbox
//                                                                             isChecked={formData[index]?.[column.sName]}
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
//                                          })
//                                             ) : (
//                                                 <TableRow>
//                                                     <TableCell colSpan={columns.length}>
//                                                         No data available.
//                                                     </TableCell>
//                                                 </TableRow>
//                                             )
//                                         )}
//                                     </TableBody>
//                                 ) : (
//                                     <TableBody>
//                                         {Array.isArray(Data) && (
//                                             Data.filter(row => row.iMasterTypeId === masteriId).length > 0 ? (
//                                                 Data.filter(row => row.iMasterTypeId === masteriId).map((row, index) => {
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
//                                                                                 value={formData[index]?.TagName || ''}
//                                                                                 onChangeName={(value) => handleAutocompleteChange(value, index)}
//                                                                                 masterId={masteriId}
//                                                                                 open={true} // Always show the Autocomplete for the selected row
//                                                                                 formData={formData}
//                                                                                 setFormData={setFormData}
//                                                                                 onClose={() => handleAutocompleteClose(row.id)}
//                                                                             />
//                                                                         ) : (
//                                                                             <EnhancedCheckbox
//                                                                                 isChecked={formData[index]?.[column.sName]}
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




















import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  ListSubheader,
  Paper,
} from "@mui/material";
import { secondryColor } from "../../config";

const AutoComplete2 = ({
  formData,
  setFormData,
  autoId,
  autoLabel,
  isMandatory,
  disabled,
 
}) => {

  const [iTypeF2, setiTypeF2] = useState(1);
  const [AutoMenu, setAutoMenu] = useState([]);
  const [autoSearchKey, setautoSearchKey] = useState("");
  const [sCodeReq, setsCodeReq] = useState(false);
  const [error, setError] = useState({ isError: false, message: "" });

  const CustomListBox = React.forwardRef((props, ref) => {
    const { children, ...other } = props;

    return (
      <ul style={{ paddingTop: 0 }} ref={ref} {...other}>
        <ListSubheader
          style={{ backgroundColor: secondryColor, padding: "5px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography style={{ marginRight: "auto" }}>Name</Typography>
            {sCodeReq && (
              <Typography style={{ marginLeft: "auto" }}>Code</Typography>
            )}
          </div>
        </ListSubheader>
        {children}
      </ul>
    );
  });
  // Effect to sync state with prop changes
  useEffect(() => {
    setautoSearchKey(formData?.sName || "");
    if(formData?.sName)
    setFormData({
      ...formData,
      sName: formData?.sName ?? null,
      iId: formData?.iId ?? null,
    });
  }, []);
 
  const handleAutocompleteChange = (event, newValue) => {
    const updatedFormData = {
      ...formData,
      sName: newValue ? newValue.sName : null, //"" was replaced by null
      iId: newValue ? newValue.iId : null, //"" was replaced by null
    };

    setFormData(updatedFormData); // This will now update the parent's state
    setiTypeF2(1);
    // if (isMandatory && !newValue) {
    //   setError({ isError: true, message: 'This field is required.' });
    // } else {
    //   setError({ isError: false, message: '' });
    // }
  };
  // const validateInput = (newValue) => {
  //   if (isMandatory && !newValue) {
  //     setError({ isError: true, message: 'This field is required.' });
  //   } else {
  //     setError({ isError: false, message: '' });
  //   }
  // };

  const fetchSelectedItem = async (fieldName) => {
    try {
      const encodedSearchkey = encodeURIComponent(fieldName);
           
         
       const response =await  fetch(http://103.120.178.195/Sang.Ray.Web.Api/Ray/GetProject?iStatus=1&sSearch=${encodedSearchkey})
       
        const data = await response.json();
       
        if(data.Status ==="Success"){
          
        
          setAutoMenu(JSON.parse(data.ResultData));
        }
        
      if (response?.status === "Success") {
          const myObject = JSON.parse(response?.result);
          setAutoMenu(myObject);
      } else if (response?.status === "Failure") {
          setAutoMenu([]);
      }
    } catch (error) {
      console.error("Failed to fetch selected item:", error);
    }
    return null; // Return null if no item is found or in case of an error
  };

  //get AutoMenu
  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const encodedSearchkey = encodeURIComponent(autoSearchKey);
           
         
       const response =await  fetch(http://103.120.178.195/Sang.Ray.Web.Api/Ray/GetProject?iStatus=1&sSearch=${encodedSearchkey})
       
        const data = await response.json();
       
        if(data.Status ==="Success"){
          const results = JSON.parse(data.ResultData)
          const currentSelection = results.find(
            (option) => option.sName === formData?.sName
          );

          // Ensure the current selection is always in the menu
          if (!currentSelection && formData?.sName) {
            const selectedItem = await fetchSelectedItem(
              formData?.sName
            );
            if (selectedItem) {
              results.unshift(selectedItem); // Add to the start of the list
            }
          }
        
          setAutoMenu(JSON.parse(data.ResultData));
        }
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [iTypeF2, autoSearchKey]);
  
  useEffect(() => {
    if (AutoMenu && AutoMenu[1]?.sCode) {
      setsCodeReq(true);
    }
  }, [AutoMenu]);
  // useEffect(() => {//for edit case
  //   console.log(formDataHeader);
  //   const matchingItem = AutoMenu.find(item => item.Id.toString() === formDataHeader[key1]?.toString());
  //   if (matchingItem) {
  //     setFormData({
  //       ...formData,
  //       sName: matchingItem.Name,
  //       sCode: matchingItem.Code,
  //       iId: matchingItem.Id,
  //       [sFieldName]: matchingItem.Id // assuming sFieldName is the field to store the iId
  //     });
  //   }
  // }, [formDataHeader[key1],AutoMenu])

  //  useEffect(() => {
  //   if(triggerValidation){
  //     validateInput(formDataHeader[key1])
  //   }

  //   resetTriggerVAlidation()
  //  }, [triggerValidation])

  return (
    <Autocomplete
      disabled={disabled}
      PaperComponent={({ children }) => (
        <Paper style={{ minWidth: "150px", maxWidth: "300px" }}>
          {children}
        </Paper>
      )}
      
      id={autoId}
      options={AutoMenu}
      getOptionLabel={(option) => option?.sName ?? ""}
      value={
        AutoMenu.find((option) => option?.sName.trim() === formData?.sName) ||
        null
      }
      onChange={handleAutocompleteChange}
      filterOptions={(options, { inputValue }) => {
        return options.filter(
          (option) =>
            option.sName?.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.sCode?.toLowerCase().includes(inputValue.toLowerCase())
        );
      }}
      onInputChange={(event, newInputValue) => {
        setautoSearchKey(newInputValue);
      }}
      renderOption={(props, option) => (
        <li {...props}>
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography style={{ marginRight: "auto", fontSize: "12px" }}>
              {option.sName}
            </Typography>
            {option.sCode && (
              <Typography style={{ marginLeft: "auto", fontSize: "12px" }}>
                {option.sCode}
              </Typography>
            )}
          </div>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={autoLabel}
          // variant="standard"
          error={error.isError}
          helperText={error.isError ? error.message : null}
          InputProps={{
            ...params.InputProps,
            autoComplete: "off",
            // disableUnderline: true, // Disables the underline on the standard variant
            style: {
              // Overrides default styles
             
              borderColor: "transparent",
              borderStyle: "solid",
              
              fontSize: "12px",
              height: "36px",
              padding: "0px",
              margin:0,
              
            },
            inputProps: {
              ...params.inputProps,
              autoComplete: "off",
              //maxLength: iMaxSize,
              onKeyDown: (event, newValue) => {
                if (event.key === "F2") {
                  // Clear selected option and search key before handling F2 press
                  const updatedFormData = {
                    ...formData,
                    sName: newValue ? newValue?.sName : "",
                    iId: newValue ? newValue?.iId : 0,
                  };
                  setFormData(updatedFormData);

                  setautoSearchKey("");

                  setiTypeF2((prevType) => (prevType === 1 ? 2 : 1));

                  // Prevent default F2 key action
                  event.preventDefault();
                }
              },
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: "16px",
              padding: '0 0px',
              zIndex:1,
              backgroundColor: '#fff',
            },
          }}
          sx={{paddingTop:"13px",
            "& .MuiOutlinedInput-input": {
              padding: "8px 14px", // Reduce padding to decrease height
              transform: "translate(10px, 0px) scale(1)",
            },
            "& .MuiInputBase-input": {
              zIndex:2,
              fontSize: '0.75rem', // Adjust the font size of the input text
            },
            "& .MuiInputLabel-outlined": {
              transform: "translate(14px, 22px) scale(0.85)", // Adjust the label position
            },
            "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
              transform: "translate(14px, 6px) scale(0.75)",
              // backgroundColor: "#fff",
              padding: "0px 2px",
            },
            
            
            // "& .MuiInputLabel-outlined.Mui-focused": {
            //   color: "currentColor", // Keeps the current color of the label
            // },
            // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            //   {
            //     borderColor: "currentColor", // Keeps the current border color
            //   },
          }}
        />
      )}
      ListboxComponent={CustomListBox}
      style={{ width: 250 }}
    />
  );
};

export default AutoComplete2;