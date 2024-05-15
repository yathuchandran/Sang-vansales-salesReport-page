import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Checkbox, Typography, Button, } from '@mui/material';
// import DynamicInputFieldHeader from '../HeaderComponents/HeaderInputType';
import DeleteIcon from '@mui/icons-material/Delete';
import { buttonColor1 } from '../../config';
import AddIcon from '@mui/icons-material/Add';
import SalesManAuto from './AutoComplete/SalesManAuto';
import AutoComplete3 from './AutoComplete/AutocmpltWarehouse';
import ProductAuto from './TableAuto/ProductAuto';
import UnitAutocomplete from './TableAuto/unitAuto';
import Quantity from './TableAuto/Quantity';
import Swal from "sweetalert2";
import { GetSalesBal_Qty, GetSalesBatch } from '../../api/Api';
import { Label } from '@mui/icons-material';
import Modal from './Modals';



const EditableCell = ({ value, onChange }) => (
    <TextField
        variant="outlined"
        value={value}
        onChange={e => onChange(e.target.value)}
        size="small"
    />
);

const initialRows = [
    { id: 1, employee: '', project: '', company: '', warehouse: '', item: '', description: '', }
];

const MuiEditableTable = ({ bodyData, outlet, warehouseId }) => {
    const [rows, setRows] = useState(initialRows);
    const [selected, setSelected] = useState([]);
    const [formData, setformData] = useState({})
    const [hoveredRow, setHoveredRow] = useState(null);
    const [Product, setProduct] = useState(null);
    const [ProductId, setProductId] = useState(null);
    const [unit, setUnit] = useState(null);
    const [Qty, setQty] = useState(0)
    const [freeQty, setFreeQty] = useState(0)
    const [iTransId, setTransId] = useState(0)
    const [Batch, setBatch] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newOpen, setnewOpen] = React.useState(false); //new modal
    const [mode, setMode] = React.useState("new");


    const handleAddRow = (rowIndex) => {
        const newRow = { id: generateNewId(), employee: '', project: '', company: '', warehouse: '', item: '', description: '' };
        const newRows = [...rows.slice(0, rowIndex + 1), newRow, ...rows.slice(rowIndex + 1)];
        setRows(newRows);
    };

    const handleDeleteRow = (rowId) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== rowId));
        } else {
            // Optionally, you can alert the user that they cannot delete the last row.
            alert("At least one row must remain.");
        }
    };

    const generateNewId = () => {
        // Generate a new unique ID for the new row
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
            setSelected([]);
        } else {
            // Optionally, alert the user that they cannot delete all rows.
            alert("At least one row must remain.");
        }
    };
    const isSelected = (id) => selected.indexOf(id) !== -1;

    const HeaderInputValue = (key, value) => {
        setformData({
            ...formData,
            [key]: value
        })

    }
    const handleCellChange = (value, rowIndex, columnId) => {
        // Create a new array with the updated row
        const newRows = rows.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [columnId]: value };
            }
            return row;
        });
        setRows(newRows);
    };


    const handleProduct = async (obj) => {
        setProduct(obj.sName)
        setProductId(obj.iId)
    }

    const handleUnit = async (obj) => {
        setUnit(obj.sName)

    }
    //HANDLE QUANTITY CHECKING --------------------------------------------------------------------------------------------------
    const handleQuantity = async (event) => {
        const typedValue = event.target.value;
        try {
            const response = await GetSalesBal_Qty({
                iProduct: ProductId,
                iTransId: iTransId,
            });
            const data = JSON.parse(response?.data.ResultData).Table;
            const fQty = data.map((item) => item.fQty).join();
            //CONSOLING CHECKING WHICH TYPE VALUES ARE COMING USING typeof() 
            console.log(typeof (fQty) ,fQty,"typoedddddddddddddd",data);
            console.log(typeof (typedValue));
            

            if (Batch && Batch.length>0) {
                const fQtys = Batch.map((item) => item.fQty)
                const sum = fQtys.reduce((total, currentValue) => total + currentValue, 0);

                if (Number(typedValue) <= Number(sum)) {

                    setQty(typedValue);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: `Should must be less than Balance  total Qty ${sum}`,
                    });
                }

            } else if (Number(typedValue) <= Number(fQty)) {
                setQty(typedValue);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: `Should must be less than Balance Qty ${fQty}`,
                });
            }


        } catch (error) {
            console.log("GetSalesBal_Qty", error);
        }
    }

    // handleFreeQuantity==================================================================================================================
    const handleFreeQuantity = async (event) => {
        const typedValue = event.target.value;
        if (Number(typedValue) <=Number(Qty)) {

            const fQty = Batch.map((item) => item.fQty)
            const sum = fQty.reduce((total, currentValue) => total + currentValue, 0);
            if (Batch && Batch.length>0) {
                if (Number(typedValue) <= Number(sum)) {
                    setFreeQty(typedValue);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: `Should must be less than Balance Qty ${sum}`,
                    });
                }

            } else if (Number(typedValue) <= Number(fQty)) {
                setFreeQty(typedValue)
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: `Should must be less than Balance Qty ${fQty}`,
                });
            }
        } else {

            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: `Should must be less than Balance Qty ${Qty}`,
            });
        }
    }

    // handleBatch-------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const handleBatch = async () => {
            try {
                const response = await GetSalesBatch({
                    iProduct: ProductId,
                    iTransId: iTransId,
                    iWarehouse: warehouseId,
                })
                const data = JSON.parse(response?.data.ResultData)
                const fQty = data.map((item) => item.fQty)
                const sum = fQty.reduce((total, currentValue) => total + currentValue, 0);
                const updatedData = data.map((item) => ({
                    ...item,
                    ReqQty: "", // Set the initial value here, or leave it empty
                }));
                console.log(updatedData, "batch updatedData datsaa");
                setBatch(updatedData)
            } catch (error) {
                console.log("GetSalesBatch", error);
            }
        }

        handleBatch()
    }, [ProductId,])



    // Function to handle button click and open modal
    const handleButtonClick = () => {
        // setIsModalOpen(true);
        setnewOpen(true)
        setMode("new")
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setnewOpen(false)

    };
    const handleNewClose = () => {
        setnewOpen(false);
        setSelected([])
    };



    return (
        <div>
            <IconButton sx={{
                width: "90%", display: "flex", flexDirection: "row", justifyContent: "right", margin: "auto",
                "&:hover": { // This targets the hover state
                    backgroundColor: "transparent", // Set the background color to transparent
                    // If there's a ripple effect on hover that you want to remove, you can add:
                    "& .MuiTouchRipple-root": {
                        display: "none"
                    }
                }
            }} onClick={handleDelete} disabled={selected.length === 0}>
                <DeleteIcon sx={{ color: buttonColor1 }} />
            </IconButton>
            <TableContainer component={Paper} sx={{ maxHeight: "40vh" }} style={{
                width: "96%",
                margin: "auto",
            }}>
                <Table stickyHeader aria-label="editable table">
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{ backgroundColor: buttonColor1, border: '1px solid rgba(224, 224, 224, 1)' }} padding="checkbox">
                                <Checkbox sx={{ padding: "0px 0px", }}
                                    //indeterminate={selected.length > 0 && selected.length < rows.length}
                                    checked={selected.length === rows.length}
                                    onChange={handleSelectAllClick}
                                    inputProps={{ 'aria-label': 'select all desserts' }}
                                />
                            </TableCell>
                            <TableCell sx={{ padding: "0px 0px", border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: buttonColor1, color: 'white' }}>SI No.</TableCell> {/* Serial Number Header */}
                            {bodyData.map((field, index) => (
                                <TableCell sx={{ padding: "0px 0px", height: "40px", border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: buttonColor1, color: 'white' }}>{field.sFieldName}</TableCell>
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
                                    <TableCell padding="checkbox" sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}  >
                                        <Checkbox sx={{ padding: "0px 0px", }}
                                            checked={isItemSelected}
                                            onChange={(event) => handleClick(event, row.id)}
                                            inputProps={{ 'aria-labelledby': `checkbox-${row.id}` }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ minWidth: "100px", padding: "0px 0px", border: '1px solid rgba(224, 224, 224, 1)' }}
                                        onMouseEnter={() => setHoveredRow(row.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    > <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>{rowIndex + 1}
                                            {hoveredRow === row.id && selected.length === 0 && (
                                                <div style={{ display: 'inline-flex', marginLeft: '10px' }}>
                                                    <IconButton size="small" onClick={() => handleAddRow(rowIndex)}>
                                                        <AddIcon fontSize="inherit" />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => handleDeleteRow(row.id)}>
                                                        <DeleteIcon fontSize="inherit" />
                                                    </IconButton>
                                                </div>
                                            )}</span>
                                    </TableCell> {/* Serial Number */}
                                    {bodyData.map((field, index) => (
                                        <TableCell
                                            sx={{ padding: "0px 0px", border: '1px solid rgba(224, 224, 224, 1)' }}
                                            style={{ minWidth: "150px", maxWidth: "300px" }}
                                        >
                                            {field.sFieldCaption === "Product" ? (
                                                outlet ? (
                                                    <ProductAuto
                                                        value={Product}
                                                        onChangeName={handleProduct}
                                                    />
                                                ) : (
                                                    <div style={{ color: 'red' }}>Please select an outlet</div>
                                                )
                                            ) : field.sFieldCaption === "Unit" ? (
                                                <UnitAutocomplete
                                                    ProductId={ProductId}
                                                    value={unit}
                                                    onChangeName={handleUnit}
                                                />
                                            ) : field.sFieldCaption === "Qty" ? (
                                                ProductId && unit ? (
                                                    <TextField
                                                        label="Quantity"
                                                        variant="outlined"
                                                        size="small"
                                                        type="text"
                                                        value={Qty}
                                                        onChange={(event) => handleQuantity(event)}
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
                                            ) :field.sFieldCaption === "Batch" ? (
                                                Batch&& Batch.length > 0 ? (
                                                    <Button onClick={handleButtonClick}>
                                                        Select Batch
                                                    </Button>
                                                ) : (
                                                    <Typography>NA</Typography>
                                                )
                                            ): field.sFieldCaption === "Free Qty" ? (
                                                // <Typography> hello</Typography>
                                                ProductId && unit ? (
                                                    <TextField
                                                        // label="Quantity"
                                                        variant="outlined"
                                                        size="small"
                                                        type="text"
                                                        value={freeQty}
                                                        onChange={(event) => handleFreeQuantity(event)}
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
                                                // <Typography> hello</Typography>
                                                Batch&& Batch.length > 0  ? (
                                                    <Button onClick={handleButtonClick}>
                                                        Select Batch
                                                    </Button>
                                                ) : (
                                                    <Typography>NA</Typography>
                                                    // <Button onClick={handleButtonClick}>
                                                    //     Select Batch
                                                    // </Button>
                                                )
                                            ) : field.sFieldCaption === "Total Qty" ? (
                                                <Typography> hello</Typography>
                                            ) : field.sFieldCaption === "Rate" ? (
                                                <Typography> hello</Typography>
                                            ) : field.sFieldCaption === "Excise Tax%" ? (
                                                <Typography> hello</Typography>
                                            ) : null}
                                            {newOpen && (
                                                <Modal isOpen={newOpen} onClose={handleCloseModal}
                                                    handleNewClose={handleNewClose}
                                                    Product={Product}
                                                    Qty={Qty}
                                                    ProductId={ProductId}
                                                    Batch={Batch}
                                                    setBatch={setBatch}
                                                    mode={mode}
                                                    formDataEdit={
                                                        mode === "edit" ? selected[0] : 0
                                                    }

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
