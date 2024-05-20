// import React, { useEffect, useState } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Checkbox, Typography, Button, } from '@mui/material';
// // import DynamicInputFieldHeader from '../HeaderComponents/HeaderInputType';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { buttonColor1 } from '../../config';
// import AddIcon from '@mui/icons-material/Add';
// import SalesManAuto from './AutoComplete/SalesManAuto';
// import AutoComplete3 from './AutoComplete/AutocmpltWarehouse';
// import ProductAuto from './TableAuto/ProductAuto';
// import UnitAutocomplete from './TableAuto/unitAuto';
// import Quantity from './TableAuto/Quantity';
// import Swal from "sweetalert2";
// import { GetSalesBal_Qty, GetSalesBatch } from '../../api/Api';
// import { Label } from '@mui/icons-material';
// import Modal from './Modals';
// import { MDBInput } from 'mdb-react-ui-kit';



// const EditableCell = ({ value, onChange }) => (
//     <TextField
//         variant="outlined"
//         value={value}
//         onChange={e => onChange(e.target.value)}
//         size="small"
//     />
// );

// const initialRows = [
//     { id: 1,iProduct: '', iUnit: '', fQty: '', Batch: '', fFreeQty: '', iBatch: '',TotalQty:'',fRate:'',fExciseTaxPer:'',Gross:'',fDiscPerc:'',fDiscAmt:'',fAddCharges:'',fVatPer:'',fVAT:'', sRemarks:'',fNet:''}
// ];

// const MuiEditableTable = ({ bodyData, outlet, warehouseId, setProductIds }) => {
//     const [rows, setRows] = useState(initialRows);
//     const [selected, setSelected] = useState([]);
//     const [formData, setformData] = useState({})
//     const [hoveredRow, setHoveredRow] = useState(null);
//     const [Product, setProduct] = useState(null);
//     const [ProductId, setProductId] = useState(null);
//     const [unit, setUnit] = useState(null);
//     const [Qty, setQty] = useState(0)
//     const [freeQty, setFreeQty] = useState(0)
//     const [iTransId, setTransId] = useState(0)
//     const [Batch, setBatch] = useState(null)
//     const [isModalOpen, setIsModalOpen] = useState(false);  
//     const [newOpen, setnewOpen] = React.useState(false); //new modal
//     const [mode, setMode] = React.useState("new");
//     const [totalQuantity, setTotalQuantity] = useState(null)


//     useEffect(() => {
//         setProductIds(ProductId)
//     }, [ProductId,])




//     const handleAddRow = (rowIndex) => {
//         const newRow = { id: generateNewId(),iProduct: '', iUnit: '', fQty: '', Batch: '', fFreeQty: '', iBatch: '',TotalQty:'',fRate:'',fExciseTaxPer:'',Gross:'',fDiscPerc:'',fDiscAmt:'',fAddCharges:'',fVatPer:'',fVAT:'', sRemarks:'',fNet:'' };
//         const newRows = [...rows.slice(0, rowIndex + 1), newRow, ...rows.slice(rowIndex + 1)];
//         setRows(newRows);
//     };

//     const handleDeleteRow = (rowId) => {
//         if (rows.length > 1) {
//             setRows(rows.filter(row => row.id !== rowId));
//         } else {
//             // Optionally, you can alert the user that they cannot delete the last row.
//             alert("At least one row must remain.");
//         }
//     };

//     const generateNewId = () => {
//         // Generate a new unique ID for the new row
//         return rows.length > 0 ? Math.max(...rows.map(row => row.id)) + 1 : 1;
//     };

//     const handleSelectAllClick = (event) => {
//         if (event.target.checked) {
//             const newSelecteds = rows.map((n) => n.id);
//             setSelected(newSelecteds);
//             return;
//         }
//         setSelected([]);
//     };
//     const handleClick = (event, id) => {
//         const selectedIndex = selected.indexOf(id);
//         let newSelected = [];


//         if (selectedIndex === -1) {
//             newSelected = newSelected.concat(selected, id);
//         } else if (selectedIndex === 0) {
//             newSelected = newSelected.concat(selected.slice(1));
//         } else if (selectedIndex === selected.length - 1) {
//             newSelected = newSelected.concat(selected.slice(0, -1));
//         } else if (selectedIndex > 0) {
//             newSelected = newSelected.concat(
//                 selected.slice(0, selectedIndex),
//                 selected.slice(selectedIndex + 1),
//             );
//         }



//         setSelected(newSelected);
//     };

//     const handleDelete = () => {
//         if (rows.length > selected.length) {
//             setRows(rows.filter(row => !selected.includes(row.id)));
//             setSelected([]);
//         } else {
//             // Optionally, alert the user that they cannot delete all rows.
//             alert("At least one row must remain.");
//         }
//     };
//     const isSelected = (id) => selected.indexOf(id) !== -1;

//     const HeaderInputValue = (key, value) => {
//         setformData({
//             ...formData,
//             [key]: value
//         })

//     }
//     const handleCellChange = (value, rowIndex, columnId) => {
//         // Create a new array with the updated row
//         const newRows = rows.map((row, index) => {
//             if (index === rowIndex) {
//                 return { ...row, [columnId]: value };
//             }
//             return row;
//         });
//         setRows(newRows);
//     };


//     const handleProduct = async (obj) => {
//         setProduct(obj.sName)
//         setProductId(obj.iId)
//     }

//     const handleUnit = async (obj) => {
//         setUnit(obj.sName)

//     }

//     console.log(rows,'----');

//     //HANDLE QUANTITY CHECKING --------------------------------------------------------------------------------------------------
//     const handleQuantity = async (event) => {
//         const typedValue = event.target.value;
//         try {
//             const response = await GetSalesBal_Qty({
//                 iProduct: ProductId,
//                 iTransId: iTransId,
//             });
//             const data = JSON.parse(response?.data.ResultData).Table;
//             const fQty = data.map((item) => item.fQty).join();
//             //CONSOLING CHECKING WHICH TYPE VALUES ARE COMING USING typeof() 
//             console.log(typeof (fQty), fQty, "typoedddddddddddddd", data);
//             console.log(typeof (typedValue));


//             if (Batch && Batch.length > 0) {
//                 const fQtys = Batch.map((item) => item.fQty)
//                 const sum = fQtys.reduce((total, currentValue) => total + currentValue, 0);

//                 if (Number(typedValue) <= Number(sum)) {

//                     setQty(typedValue);
//                 } else {
//                     Swal.fire({
//                         icon: 'warning',
//                         title: 'Warning',
//                         text: `Should must be less than Balance  total Qty ${sum}`,
//                     });
//                 }

//             } else if (Number(typedValue) <= Number(fQty)) {
//                 setQty(typedValue);
//             } else {
//                 Swal.fire({
//                     icon: 'warning',
//                     title: 'Warning',
//                     text: `Should must be less than Balance Qty ${fQty}`,
//                 });
//             }


//         } catch (error) {
//             console.log("GetSalesBal_Qty", error);
//         }
//     }

//     // handleFreeQuantity==================================================================================================================
//     const handleFreeQuantity = async (event) => {
//         const typedValue = event.target.value;
//         if (Number(typedValue) <= Number(Qty)) {

//             const fQty = Batch.map((item) => item.fQty)
//             const sum = fQty.reduce((total, currentValue) => total + currentValue, 0);
//             if (Batch && Batch.length > 0) {
//                 if (Number(typedValue) <= Number(sum)) {
//                     setFreeQty(typedValue);
//                 } else {
//                     Swal.fire({
//                         icon: 'warning',
//                         title: 'Warning',
//                         text: `Should must be less than Balance Qty ${sum}`,
//                     });
//                 }

//             } else if (Number(typedValue) <= Number(fQty)) {
//                 setFreeQty(typedValue)
//             } else {
//                 Swal.fire({
//                     icon: 'warning',
//                     title: 'Warning',
//                     text: `Should must be less than Balance Qty ${fQty}`,
//                 });
//             }
//         } else {

//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Warning',
//                 text: `Should must be less than Balance Qty ${Qty}`,
//             });
//         }
//     }

//     // handleBatch-------------------------------------------------------------------------------------------------------------------
//     useEffect(() => {
//         const handleBatch = async () => {
//             try {
//                 const response = await GetSalesBatch({
//                     iProduct: ProductId,
//                     iTransId: iTransId,
//                     iWarehouse: warehouseId,
//                 })
//                 const data = JSON.parse(response?.data.ResultData)
//                 const fQty = data.map((item) => item.fQty)
//                 const sum = fQty.reduce((total, currentValue) => total + currentValue, 0);
//                 const updatedData = data.map((item) => ({
//                     ...item,
//                     ReqQty: "", // Set the initial value here, or leave it empty
//                 }));
//                 console.log(updatedData, "batch updatedData datsaa");
//                 setBatch(updatedData)
//             } catch (error) {
//                 console.log("GetSalesBatch", error);
//             }
//         }

//         handleBatch()
//     }, [ProductId,])

// //GetSalesDetails EDIT CASE================================================================================
// useEffect(()=>{
// try {
    
// } catch (error) {
//     console.log("GetSalesDetails",error);
// }
// },[])



//     //TOTAL QUANTITY CHECKING -----------------------------------------------------------------------------
//     useEffect(() => {
//         const newtotal = Qty + freeQty
//         setTotalQuantity(newtotal)
//         console.log(newtotal, "newtotal");
//     }, [Qty, freeQty])

//     // Function to handle button click and open modal
//     const handleButtonClick = () => {
//         // setIsModalOpen(true);
//         setnewOpen(true)
//         setMode("new")
//     };

//     // Function to close the modal
//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setnewOpen(false)

//     };
//     const handleNewClose = () => {
//         setnewOpen(false);
//         setSelected([])
//     };



//     return (
//         <div>
//             <IconButton sx={{
//                 width: "90%", display: "flex", flexDirection: "row", justifyContent: "right", margin: "auto",
//                 "&:hover": { // This targets the hover state
//                     backgroundColor: "transparent", // Set the background color to transparent
//                     // If there's a ripple effect on hover that you want to remove, you can add:
//                     "& .MuiTouchRipple-root": {
//                         display: "none"
//                     }
//                 }
//             }} onClick={handleDelete} disabled={selected.length === 0}>
//                 <DeleteIcon sx={{ color: buttonColor1 }} />
//             </IconButton>
//             <TableContainer component={Paper} sx={{ maxHeight: "40vh" }} style={{
//                 width: "96%",
//                 margin: "auto",
//             }}>
//                 <Table stickyHeader aria-label="editable table">
//                     <TableHead>
//                         <TableRow >
//                             <TableCell sx={{ backgroundColor: buttonColor1, border: '1px solid rgba(224, 224, 224, 1)' }} padding="checkbox">
//                                 <Checkbox sx={{ padding: "0px 0px", }}
//                                     //indeterminate={selected.length > 0 && selected.length < rows.length}
//                                     checked={selected.length === rows.length}
//                                     onChange={handleSelectAllClick}
//                                     inputProps={{ 'aria-label': 'select all desserts' }}
//                                 />
//                             </TableCell>
//                             <TableCell sx={{ padding: "0px 0px", border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: buttonColor1, color: 'white' }}>SI No.</TableCell> {/* Serial Number Header */}
//                             {bodyData.map((field, index) => (
//                                 <TableCell sx={{ padding: "0px 0px", height: "40px", border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: buttonColor1, color: 'white' }}>{field.sFieldName}</TableCell>
//                             ))}


//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {rows.map((row, rowIndex) => {
//                             const isItemSelected = isSelected(row.id);


//                             return (
//                                 <TableRow

//                                     role="checkbox"
//                                     aria-checked={isItemSelected}
//                                     tabIndex={-1}
//                                     key={row.id}
//                                     selected={isItemSelected}

//                                 >
//                                     <TableCell padding="checkbox" sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}  >
//                                         <Checkbox sx={{ padding: "0px 0px", }}
//                                             checked={isItemSelected}
//                                             onChange={(event) => handleClick(event, row.id)}
//                                             inputProps={{ 'aria-labelledby': `checkbox-${row.id}` }}
//                                         />
//                                     </TableCell>
//                                     <TableCell sx={{ minWidth: "100px", padding: "0px 0px", border: '1px solid rgba(224, 224, 224, 1)' }}
//                                         onMouseEnter={() => setHoveredRow(row.id)}
//                                         onMouseLeave={() => setHoveredRow(null)}
//                                     > <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>{rowIndex + 1}
//                                             {hoveredRow === row.id && selected.length === 0 && (
//                                                 <div style={{ display: 'inline-flex', marginLeft: '10px' }}>
//                                                     <IconButton size="small" onClick={() => handleAddRow(rowIndex)}>
//                                                         <AddIcon fontSize="inherit" />
//                                                     </IconButton>
//                                                     <IconButton size="small" onClick={() => handleDeleteRow(row.id)}>
//                                                         <DeleteIcon fontSize="inherit" />
//                                                     </IconButton>
//                                                 </div>
//                                             )}</span>
//                                     </TableCell> {/* Serial Number */}
//                                     {bodyData.map((field, index) => (
//                                         <TableCell
//                                             sx={{ padding: "0px 0px", border: '1px solid rgba(224, 224, 224, 1)' }}
//                                             style={{ minWidth: "150px", maxWidth: "300px" }}
//                                         >
//                                             {field.sFieldCaption === "Product" ? (
//                                                 outlet ? (
//                                                     <ProductAuto
//                                                         value={Product}
//                                                         onChangeName={handleProduct}
//                                                     />
//                                                 ) : (
//                                                     <div style={{ color: 'red' }}>Please select an outlet</div>
//                                                 )
//                                             ) : field.sFieldCaption === "Unit" ? (
//                                                 <UnitAutocomplete
//                                                     ProductId={ProductId}
//                                                     value={unit}
//                                                     onChangeName={handleUnit}
//                                                 />
//                                             ) : field.sFieldCaption === "Qty" ? (
//                                                 ProductId && unit ? (
//                                                     <TextField
//                                                         label="Quantity"
//                                                         variant="outlined"
//                                                         size="small"
//                                                         type="text"
//                                                         value={Qty}
//                                                         onChange={(event) => handleQuantity(event)}
//                                                         InputLabelProps={{
//                                                             style: {
//                                                                 fontSize: '15px',
//                                                                 backgroundColor: "white"
//                                                             }
//                                                         }}
//                                                         InputProps={{
//                                                             style: {
//                                                                 border: '1px solid #FF5000',
//                                                                 borderRadius: '2px',
//                                                                 height: '35px'
//                                                             }
//                                                         }}
//                                                     />
//                                                 ) : (
//                                                     <div style={{ color: 'red' }}>Please select a product and unit</div>
//                                                 )
//                                             ) : field.sFieldCaption === "Batch" ? (
//                                                 Batch && Batch.length > 0 ? (
//                                                     <Button onClick={handleButtonClick}>
//                                                         Select Batch
//                                                     </Button>
//                                                 ) : (
//                                                     <Typography>NA</Typography>
//                                                 )
//                                             ) : field.sFieldCaption === "Free Qty" ? (
//                                                 // <Typography> hello</Typography>
//                                                 ProductId && unit ? (
//                                                     <TextField
//                                                         // label="Quantity"
//                                                         variant="outlined"
//                                                         size="small"
//                                                         type="text"
//                                                         value={freeQty}
//                                                         onChange={(event) => handleFreeQuantity(event)}
//                                                         InputLabelProps={{
//                                                             style: {
//                                                                 fontSize: '15px',
//                                                                 backgroundColor: "white"
//                                                             }
//                                                         }}
//                                                         InputProps={{
//                                                             style: {
//                                                                 border: '1px solid #FF5000',
//                                                                 borderRadius: '2px',
//                                                                 height: '35px'
//                                                             }
//                                                         }}
//                                                     />
//                                                 ) : (
//                                                     <div style={{ color: 'red' }}>Please select a product and unit</div>
//                                                 )
//                                             ) : field.sFieldCaption === "iBatch" ? (
//                                                 // <Typography> hello</Typography>
//                                                 Batch && Batch.length > 0 ? (
//                                                     <Button onClick={handleButtonClick}>
//                                                         Select Batch
//                                                     </Button>
//                                                 ) : (
//                                                     <Typography>NA</Typography>
//                                                     // <Button onClick={handleButtonClick}>
//                                                     //     Select Batch
//                                                     // </Button>
//                                                 )
//                                             ) : field.sFieldCaption === "Total Qty" ? (
//                                                 // <Typography> {totalQuantity}</Typography>
//                                                 <MDBInput
//                                                     required
//                                                     id={`form3Example`}
//                                                     size="small"
//                                                     value={totalQuantity}
//                                                     readonly  // Add the readonly attribute to make it non-editable
//                                                     labelStyle={{
//                                                         fontSize: '15px',
//                                                     }}
//                                                     inputStyle={{  // Add CSS styles to make it look like a text field
//                                                         border: 'none',
//                                                         backgroundColor: 'transparent',
//                                                         fontSize: '15px',
//                                                         paddingLeft: '8px',
//                                                         outline: 'none',
//                                                         width: '100%',
//                                                     }}
//                                                     InputLabelProps={{
//                                                         style: {
//                                                             fontSize: '15px',
//                                                             backgroundColor: "white"
//                                                         }
//                                                     }}
//                                                     InputProps={{
//                                                         style: {
//                                                             border: '1px solid #FF5000',
//                                                             borderRadius: '2px',
//                                                             height: '35px'
//                                                         }
//                                                     }}
//                                                 />
//                                             ) : field.sFieldCaption === "Rate" ? (
//                                                 <Typography> hello</Typography>
//                                             ) : field.sFieldCaption === "Excise Tax%" ? (
//                                                 <Typography> hello</Typography>
//                                             ) : null}
//                                             {newOpen && (
//                                                 <Modal isOpen={newOpen} onClose={handleCloseModal}
//                                                     handleNewClose={handleNewClose}
//                                                     Product={Product}
//                                                     Qty={Qty}
//                                                     ProductId={ProductId}
//                                                     Batch={Batch}
//                                                     setBatch={setBatch}
//                                                     mode={mode}
//                                                     formDataEdit={
//                                                         mode === "edit" ? selected[0] : 0
//                                                     }

//                                                 />
//                                             )}

//                                         </TableCell>
//                                     ))}

//                                 </TableRow>
//                             );
//                         })}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </div>
//     );
// };

// export default MuiEditableTable;







//=======================================================================================================================================================================================================================================================================================================================================
//=======================================================================================================================================================================================================================================================================================================================================
//=======================================================================================================================================================================================================================================================================================================================================





import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Checkbox, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SalesManAuto from './AutoComplete/SalesManAuto';
import AutoComplete3 from './AutoComplete/AutocmpltWarehouse';
import ProductAuto from './TableAuto/ProductAuto';
import UnitAutocomplete from './TableAuto/unitAuto';
import Swal from "sweetalert2";
import { GetProductRate, GetSalesBal_Qty, GetSalesBatch } from '../../api/Api';
import Modal from './Modals';
import { MDBInput } from 'mdb-react-ui-kit';
import { buttonColor1 } from '../../config';

const initialRows = [
    { id: 1,Product:'', iProduct: '',Unit: '', iUnit: '', fQty: '', Batch: '', fFreeQty: '', iBatch: '', TotalQty: '', fRate: '', fExciseTaxPer: '', Gross: '', fDiscPerc: '', fDiscAmt: '', fAddCharges: '', fVatPer: '', fVAT: '', sRemarks: '', fNet: '' }
];

const MuiEditableTable = ({ bodyData, outlet, warehouseId, setProductIds,outletid }) => {
    const [rows, setRows] = useState(initialRows);
    const [selected, setSelected] = useState([]);
    const [formData, setFormData] = useState(initialRows);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [Batch, setBatch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newOpen, setnewOpen] = useState(false); // new modal
    const [mode, setMode] = useState("new");
    const [totalQuantity, setTotalQuantity] = useState(null);
    const [iTransId, setTransId] = useState(0)

    console.log(formData,"formData======================================================");
    useEffect(() => {
        setProductIds(formData.ProductId || null);
    }, [formData.ProductId]);

    const handleAddRow = (rowIndex) => {
        const newRow = { id: generateNewId(), iProduct: '', iUnit: '', fQty: '', Batch: '', fFreeQty: '', iBatch: '', TotalQty: '', fRate: '', fExciseTaxPer: '', Gross: '', fDiscPerc: '', fDiscAmt: '', fAddCharges: '', fVatPer: '', fVAT: '', sRemarks: '', fNet: '' };
        const newRows = [...rows.slice(0, rowIndex + 1), newRow, ...rows.slice(rowIndex + 1)];
        const newFormData = [...formData.slice(0, rowIndex + 1), newRow, ...formData.slice(rowIndex + 1)];
        setFormData(newFormData);

        console.log(newRows,"newRows",);
        setRows(newRows);
    };

    const handleDeleteRow = (rowId) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== rowId));
            setFormData(formData.filter(row => row.id !== rowId));
        } else {
            alert("At least one row must remain.");
        }
    };

    const generateNewId = () => {
        return rows.length > 0 ? Math.max(...rows.map(row => row.id)) + 1 : 1;
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleDelete = () => {
        if (rows.length > selected.length) {
            setRows(rows.filter(row => !selected.includes(row.id)));
            setFormData(formData.filter(row => !selected.includes(row.id)));

            setSelected([]);
        } else {
            alert("At least one row must remain.");
        }
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // const handleCellChange = (value, rowIndex, columnId) => {
    //     const newRows = rows.map((row, index) => {
    //         if (index === rowIndex) {
    //             return { ...row, [columnId]: value };
    //         }
    //         return row;
    //     });
    //     setRows(newRows);
    //     setFormData({
    //         ...formData,
    //         [columnId]: value
    //     });
    // };
    const handleCellChange = (value, rowIndex, columnId) => {
        const newRows = rows.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [columnId]: value };
            }
            return row;
        });
        const newFormData = formData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [columnId]: value };
            }
            return row;
        });
        setRows(newRows);
        setFormData(newFormData);
    };


    // const handleProduct = (obj) => {
    //     setFormData({
    //         ...formData,
    //         Product: obj.sName,
    //         iProduct: obj.iId
    //     });
    // };

    // const handleUnit = (obj) => {
    //     setFormData({
    //         ...formData,
    //         Unit: obj.sName,
    //         iUnit:obj.iId
    //     });
    // };

    const handleProduct = (obj, rowIndex) => {
        console.log(obj,rowIndex);
        const newFormData = formData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row,  iProduct: obj.iId,Product: obj.sName };
            }
            return row;
        });
        setFormData(newFormData);
    };

    const handleUnit = async(obj, rowIndex) => {
        const newFormData = formData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, Unit: obj.sName, iUnit: obj.iId };
            }
            return row;
        });
        setFormData(newFormData);
            //handle batch--------------------------------------

        try {
            
            const res = await GetSalesBatch({
                iProduct: formData[rowIndex].iProduct,
                iTransId: iTransId,
                iWarehouse: warehouseId,
            });
            const datas = JSON.parse(res?.data.ResultData);
            const updatedData = datas.map((item) => ({
                ...item,
                ReqQty: "", // Set the initial value here, or leave it empty
            }));
            setBatch(updatedData);
            //----------------------------------------------------------------

            
        } catch (error) {
            console.log("GetSalesBatch", error);
        }

        try {
            const  response=await GetProductRate({
                iProductId:formData[rowIndex].iProduct,
                iUnitId:formData[rowIndex].iUnit,
                iOutletId:outletid,
              })

              console.log(response,"GetProductRate"); 
              if (response==="Failure") {
                setRate([])
              }else{
                setRate(response)
              }
        } catch (error) {
            
        }
    };


    // const handleQuantity = async (event) => {
    //     const typedValue = event.target.value;
    //     try {
    //         const response = await GetSalesBal_Qty({
    //             iProduct: formData.iProduct,
    //             iTransId: iTransId,
    //         });
    //         const data = JSON.parse(response?.data.ResultData).Table;
    //         const fQty = data.map((item) => item.fQty).join();

    //         if (Batch && Batch.length > 0) {
    //             const fQtys = Batch.map((item) => item.fQty);
    //             const sum = fQtys.reduce((total, currentValue) => total + currentValue, 0);

    //             if (Number(typedValue) <= Number(sum)) {
    //                 setFormData({ ...formData, fQty: typedValue });
    //             } else {
    //                 Swal.fire({
    //                     icon: 'warning',
    //                     title: 'Warning',
    //                     text: `Should be less than total balance Qty ${sum}`,
    //                 });
    //             }
    //         } else if (Number(typedValue) <= Number(fQty)) {
    //             setFormData({ ...formData, fQty: typedValue });
    //         } else {
    //             Swal.fire({
    //                 icon: 'warning',
    //                 title: 'Warning',
    //                 text: `Should be less than balance Qty ${fQty}`,
    //             });
    //         }
    //     } catch (error) {
    //         console.log("GetSalesBal_Qty", error);
    //     }
    // };

    const handleQuantity = async (event, rowIndex) => {
        const typedValue = event.target.value;
        try {
            const response = await GetSalesBal_Qty({
                iProduct: formData[rowIndex].iProduct,
                iTransId: iTransId,
            });
            const data = JSON.parse(response?.data.ResultData).Table;
            const fQty = data.map((item) => item.fQty).join();

            if (Batch && Batch.length > 0) {
                const fQtys = Batch.map((item) => item.fQty);
                const sum = fQtys.reduce((total, currentValue) => total + currentValue, 0);

                if (Number(typedValue) <= Number(sum)) {
                    setFormData(formData.map((row, index) => {
                        if (index === rowIndex) {
                            return { ...row, fQty: typedValue };
                        }
                        return row;
                    }));
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: `Should be less than total balance Qty ${sum}`,
                    });
                }
            } else if (Number(typedValue) <= Number(fQty)) {
                setFormData(formData.map((row, index) => {
                    if (index === rowIndex) {
                        return { ...row, fQty: typedValue };
                    }
                    return row;
                }));
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: `Should be less than balance Qty ${fQty}`,
                });
            }
        } catch (error) {
            console.log("GetSalesBal_Qty", error);
        }
    };


    const handleFreeQuantity = (event, rowIndex) => {
        const typedValue = event.target.value;
        if (Number(typedValue) <= Number(formData[rowIndex].fQty)) {
            setFormData(formData.map((row, index) => {
                if (index === rowIndex) {
                    return { ...row, fFreeQty: typedValue };
                }
                return row;
            }));
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: `Should be less than Qty ${formData[rowIndex].fQty}`,
            });
        }
    };

    //HANDLE BATCH===================================================================================

    // useEffect(() => {
    //     const handleBatch = async () => {
    //         try {
    //             const response = await GetSalesBatch({
    //                 iProduct: formData[rowIndex].iProduct,
    //                 iTransId: iTransId,
    //                 iWarehouse: warehouseId,
    //             });
    //             const data = JSON.parse(response?.data.ResultData);
    //             const updatedData = data.map((item) => ({
    //                 ...item,
    //                 ReqQty: "", // Set the initial value here, or leave it empty
    //             }));
    //             setBatch(updatedData);
    //         } catch (error) {
    //             console.log("GetSalesBatch", error);
    //         }
    //     };

    //     handleBatch();
    // }, [formData[rowIndex].iProduct, warehouseId]);

    //===================================================================================

    // useEffect(() => {
    //     const newTotal = Number(formData.fQty || 0) + Number(formData.fFreeQty || 0);
    //     setTotalQuantity(newTotal);
    // }, [formData.fQty, formData.fFreeQty]);

    useEffect(() => {
        const newTotal = Number(formData.reduce((total, row) => total + (Number(row.fQty) || 0), 0)) +
                         Number(formData.reduce((total, row) => total + (Number(row.fFreeQty) || 0), 0));
        setTotalQuantity(newTotal);
    }, [formData]);


    //Handle Rate--------------------------------------------------------------------------------------------------------------------------
const handleRate=async(event, rowIndex)=>{
    const typedValue = event.target.value;
    setFormData(formData.map((row, index) => {
        if (index === rowIndex) {
            return { ...row, fRate: typedValue };
        }
        return row;
    }));
}

    const handleButtonClick = () => {
        setnewOpen(true);
        setMode("new");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setnewOpen(false);
    };

    const handleNewClose = () => {
        setnewOpen(false);
        setSelected([]);
    };

    useEffect(()=>{
const prdctRate=async()=>{
    try {
      const  res=await GetProductRate({
        iProductId:ProductId,
        iUnitId:iUnit,
        iOutletId:outletid,
      })
    } catch (error) {
        console.log(error);
    }
}
    },[])
console.log(formData.iUnit,formData,outletid,"=======================================================================================");
    return (
        <div>
            <IconButton
                sx={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "right",
                    margin: "auto",
                    "&:hover": {
                        backgroundColor: "transparent",
                        "& .MuiTouchRipple-root": {
                            display: "none"
                        }
                    }
                }}
                onClick={handleDelete}
                disabled={selected.length === 0}
            >
                <DeleteIcon sx={{ color: buttonColor1 }} />
            </IconButton>
            <TableContainer component={Paper} sx={{ maxHeight: "40vh" }} style={{ width: "96%", margin: "auto" }}>
                <Table stickyHeader aria-label="editable table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: buttonColor1, border: '1px solid rgba(224, 224, 224, 1)' }} padding="checkbox">
                                <Checkbox
                                    sx={{ padding: "0px 0px" }}
                                    checked={selected.length === rows.length}
                                    onChange={handleSelectAllClick}
                                    inputProps={{ 'aria-label': 'select all desserts' }}
                                />
                            </TableCell>
                            <TableCell sx={{ padding: "0px 0px", border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: buttonColor1, color: 'white' }}>SI No.</TableCell>
                            {bodyData.map((field, index) => (
                                <TableCell key={index} sx={{ padding: "0px 0px", height: "40px", border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: buttonColor1, color: 'white' }}>
                                    {field.sFieldName}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, rowIndex) => {
                            const isItemSelected = isSelected(row.id);

                            return (
                                <TableRow
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox" sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                        <Checkbox
                                            sx={{ padding: "0px 0px" }}
                                            checked={isItemSelected}
                                            onChange={(event) => handleClick(event, row.id)}
                                            inputProps={{ 'aria-labelledby': `checkbox-${row.id}` }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        sx={{ minWidth: "100px", padding: "0px 0px", border: '1px solid rgba(224, 224, 224, 1)' }}
                                        onMouseEnter={() => setHoveredRow(row.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                            {rowIndex + 1}
                                            {hoveredRow === row.id && selected.length === 0 && (
                                                <div style={{ display: 'inline-flex', marginLeft: '10px' }}>
                                                    <IconButton size="small" onClick={() => handleAddRow(rowIndex)}>
                                                        <AddIcon fontSize="inherit" />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => handleDeleteRow(row.id)}>
                                                        <DeleteIcon fontSize="inherit" />
                                                    </IconButton>
                                                </div>
                                            )}
                                        </span>
                                    </TableCell>
                                    {bodyData.map((field, index) => (
                                        <TableCell key={index} sx={{ padding: "0px 0px", border: '1px solid rgba(224, 224, 224, 1)' }} style={{ minWidth: "150px", maxWidth: "300px" }}>
                                            {field.sFieldCaption === "Product" ? (
                                                outlet ? (
                                                    <ProductAuto
                                                        // value={formData.Product || ''}
                                                        // onChangeName={handleProduct}
                                                        value={formData[rowIndex].Product || ''}
                                                        onChangeName={(obj) => handleProduct(obj, rowIndex)}
                                                    />
                                                ) : (
                                                    <div style={{ color: 'red' }}>Please select an outlet</div>
                                                )
                                            ) : field.sFieldCaption === "Unit" ? (
                                                <UnitAutocomplete
                                              
                                                    ProductId={formData[rowIndex].iProduct}
                                                    value={formData[rowIndex].Unit || ''}
                                                    onChangeName={(obj) => handleUnit(obj, rowIndex)}
                                                />
                                            ) : field.sFieldCaption === "Qty" ? (
                                                formData[rowIndex].Product  && formData[rowIndex].Unit ? (
                                                    <TextField
                                                        label="Quantity"
                                                        variant="outlined"
                                                        size="small"
                                                        type="text"
                                                     
                                                        value={formData[rowIndex].fQty || ''}
                                                        onChange={(event) => handleQuantity(event, rowIndex)}
                                                        InputLabelProps={{
                                                            style: {
                                                                fontSize: '15px',
                                                                backgroundColor: "white"
                                                            }
                                                        }}
                                                        InputProps={{
                                                            style: {
                                                                border: '1px solid #FF5000',
                                                                borderRadius: '2px',
                                                                height: '35px'
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{ color: 'red' }}>Please select a product and unit</div>
                                                )
                                            ) : field.sFieldCaption === "Batch" ? (
                                                Batch && Batch.length > 0 ? (
                                                    <Button onClick={(event) =>handleButtonClick(event, rowIndex)}>
                                                        Select Batch
                                                    </Button>
                                                ) : (
                                                    <Typography>NA</Typography>
                                                )
                                            ) : field.sFieldCaption === "Free Qty" ? (
                                                formData[rowIndex].Product  && formData[rowIndex].Unit  ? (
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        type="text"
                                                     
                                                        value={formData[rowIndex].fFreeQty || ''}
                                                        onChange={(event) => handleFreeQuantity(event, rowIndex)}
                                                        InputLabelProps={{
                                                            style: {
                                                                fontSize: '15px',
                                                                backgroundColor: "white"
                                                            }
                                                        }}
                                                        InputProps={{
                                                            style: {
                                                                border: '1px solid #FF5000',
                                                                borderRadius: '2px',
                                                                height: '35px'
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{ color: 'red' }}>Please select a product and unit</div>
                                                )
                                            ) : field.sFieldCaption === "iBatch" ? (
                                                Batch && Batch.length > 0 ? (
                                                    <Button onClick={(event) =>handleButtonClick(event, rowIndex)}>
                                                        Select Batch
                                                    </Button>
                                                ) : (
                                                    <Typography>NA</Typography>
                                                )
                                            ) : field.sFieldCaption === "Total Qty" ? (
                                                <MDBInput
                                                    required
                                                    id="form3Example"
                                                    size="small"
                                                    value={totalQuantity}
                                                    readOnly
                                                    labelStyle={{ fontSize: '15px' }}
                                                    inputStyle={{
                                                        border: 'none',
                                                        backgroundColor: 'transparent',
                                                        fontSize: '15px',
                                                        paddingLeft: '8px',
                                                        outline: 'none',
                                                        width: '100%',
                                                    }}
                                                    InputLabelProps={{
                                                        style: {
                                                            fontSize: '15px',
                                                            backgroundColor: "white"
                                                        }
                                                    }}
                                                    InputProps={{
                                                        style: {
                                                            border: '1px solid #FF5000',
                                                            borderRadius: '2px',
                                                            height: '35px'
                                                        }
                                                    }}
                                                />
                                            ) : field.sFieldCaption === "Rate" ? (
                                                <TextField
                                                label="Quantity"
                                                variant="outlined"
                                                size="small"
                                                type="text"
                                                
                                                value={formData[rowIndex].fRate || ''}
                                                onChange={(event) => handleRate(event, rowIndex)}
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: '15px',
                                                        backgroundColor: "white"
                                                    }
                                                }}
                                                InputProps={{
                                                    style: {
                                                        border: '1px solid #FF5000',
                                                        borderRadius: '2px',
                                                        height: '35px'
                                                    }
                                                }}
                                            />
                                            ) : field.sFieldCaption === "Excise Tax%" ? (
                                                // <Typography> hello</Typography>
                                                <MDBInput
                                                required
                                                id="form3Example"
                                                size="small"
                                                value=''
                                                readOnly
                                                labelStyle={{ fontSize: '15px' }}
                                                inputStyle={{
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    fontSize: '15px',
                                                    paddingLeft: '8px',
                                                    outline: 'none',
                                                    width: '100%',
                                                }}
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: '15px',
                                                        backgroundColor: "white"
                                                    }
                                                }}
                                                InputProps={{
                                                    style: {
                                                        border: '1px solid #FF5000',
                                                        borderRadius: '2px',
                                                        height: '35px'
                                                    }
                                                }}
                                            />
                                            ): field.sFieldCaption === "Gross" ? (
                                                <MDBInput
                                                required
                                                id="form3Example"
                                                size="small"
                                                value=''
                                                readOnly
                                                labelStyle={{ fontSize: '15px' }}
                                                inputStyle={{
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    fontSize: '15px',
                                                    paddingLeft: '8px',
                                                    outline: 'none',
                                                    width: '100%',
                                                }}
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: '15px',
                                                        backgroundColor: "white"
                                                    }
                                                }}
                                                InputProps={{
                                                    style: {
                                                        border: '1px solid #FF5000',
                                                        borderRadius: '2px',
                                                        height: '35px'
                                                    }
                                                }}
                                            />
                                            ) : field.sFieldCaption === "Discount" ? (
                                                <TextField
                                                variant="outlined"
                                                size="small"
                                                type="text"
                                                
                                                // value={formData[rowIndex].fRate || ''}
                                                // onChange={(event) => handleRate(event, rowIndex)}
                                                // InputLabelProps={{
                                                //     style: {
                                                //         fontSize: '15px',
                                                //         backgroundColor: "white"
                                                //     }
                                                // }}
                                                // InputProps={{
                                                //     style: {
                                                //         border: '1px solid #FF5000',
                                                //         borderRadius: '2px',
                                                //         height: '35px'
                                                //     }
                                                // }}
                                            />
                                             ) : field.sFieldCaption === "DisAmount" ? (
                                                  <MDBInput
                                                required
                                                id="form3Example"
                                                size="small"
                                                value=''
                                                readOnly
                                                labelStyle={{ fontSize: '15px' }}
                                                inputStyle={{
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    fontSize: '15px',
                                                    paddingLeft: '8px',
                                                    outline: 'none',
                                                    width: '100%',
                                                }}
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: '15px',
                                                        backgroundColor: "white"
                                                    }
                                                }}
                                                InputProps={{
                                                    style: {
                                                        border: '1px solid #FF5000',
                                                        borderRadius: '2px',
                                                        height: '35px'
                                                    }
                                                }}
                                            />
                                            ) : field.sFieldCaption === "Vat" ? (
                                                <TextField
                                                variant="outlined"
                                                size="small"
                                                type="text"
                                                
                                                // value={formData[rowIndex].fRate || ''}
                                                // onChange={(event) => handleRate(event, rowIndex)}
                                                // InputLabelProps={{
                                                //     style: {
                                                //         fontSize: '15px',
                                                //         backgroundColor: "white"
                                                //     }
                                                // }}
                                                // InputProps={{
                                                //     style: {
                                                //         border: '1px solid #FF5000',
                                                //         borderRadius: '2px',
                                                //         height: '35px'
                                                //     }
                                                // }}
                                            />
                                            )  : field.sFieldCaption === "Remarks" ? (
                                                <TextField
                                                variant="outlined"
                                                size="small"
                                                type="text"
                                                
                                                // value={formData[rowIndex].fRate || ''}
                                                // onChange={(event) => handleRate(event, rowIndex)}
                                                // InputLabelProps={{
                                                //     style: {
                                                //         fontSize: '15px',
                                                //         backgroundColor: "white"
                                                //     }
                                                // }}
                                                // InputProps={{
                                                //     style: {
                                                //         border: '1px solid #FF5000',
                                                //         borderRadius: '2px',
                                                //         height: '35px'
                                                //     }
                                                // }}
                                            />
                                             )  : field.sFieldCaption === "Net" ? (
                                                <MDBInput
                                              required
                                              id="form3Example"
                                              size="small"
                                              value=''
                                              readOnly
                                              labelStyle={{ fontSize: '15px' }}
                                              inputStyle={{
                                                  border: 'none',
                                                  backgroundColor: 'transparent',
                                                  fontSize: '15px',
                                                  paddingLeft: '8px',
                                                  outline: 'none',
                                                  width: '100%',
                                              }}
                                              InputLabelProps={{
                                                  style: {
                                                      fontSize: '15px',
                                                      backgroundColor: "white"
                                                  }
                                              }}
                                              InputProps={{
                                                  style: {
                                                      border: '1px solid #FF5000',
                                                      borderRadius: '2px',
                                                      height: '35px'
                                                  }
                                              }}
                                          />
                                          )  : null}
                                            {newOpen && (
                                                <Modal
                                                    isOpen={newOpen}
                                                    handleNewClose={handleNewClose}
                                                    Product={formData.Product}
                                                    Qty={formData.fQty}
                                                    ProductId={formData.iProduct}
                                                    formDatass={formData}
                                                    Batch={Batch}
                                                    setBatch={setBatch}
                                                    mode={mode}
                                                    formDataEdit={mode === "edit" ? selected[0] : 0}
                                                />
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default MuiEditableTable;
