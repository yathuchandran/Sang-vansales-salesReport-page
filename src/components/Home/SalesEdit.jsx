import React, { useEffect, useState } from 'react'
import Header from "../Header/Header";
import { Box, Paper } from '@mui/material';
import { buttonColors, secondaryColorTheme } from "../../config";
import Stack from "@mui/material/Stack";
import { Button, ButtonGroup, TextField } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import {
    FormControl,

} from "@mui/material";

import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCard,
    MDBCardBody,

} from "mdb-react-ui-kit";

import { useLocation, useNavigate } from 'react-router-dom';
import { DeleteAllTransactions, GetNextDocNo, GetPrev_NextDocNo, GetSalesDetails, GetWarehouse, PostSales } from '../../api/Api';
import AutoComplete3 from './AutoComplete/AutocmpltWarehouse';
import SalesManAuto from './AutoComplete/SalesManAuto';
import OutletAuto from './AutoComplete/outlet';
import EnhancedTable from './Table';


function HSEreport({ data }) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedCurrentDate = `${year}-${month}-${day}`;

   






    //new====================================================================================================================
    const [curDates, setDate] = useState(formattedCurrentDate)
    const location = useLocation();
    const navigates = useNavigate()
    const PageName = location.state?.sName
    const selected = location.state ? location.state : 0;

    const [trnsId,setTransId] = useState(selected )
    const [selectTransid, setSlctTransId] = useState(selected)

    const userId = localStorage.getItem("userId");
    const [docNum, setdocNum] = useState(null)
    const [warehouse, setWarehouse] = useState(0)
    const [saleMane, setsaleMane] = useState(0)
    const [saleManeId, setsaleManeId] = useState(0)
    const [outletid, setoutletid] = useState(0)
    const [outlet, setoutlet] = useState(0)
    const [narration, setNarration] = useState('')
    const [typess, setTypes] = useState(null)
    const [warehouseId, setWarehouseId] = useState(0)
    const [productIDs, setProductIds] = useState(0);
    const [bodyData, setBodyData] = useState("")
    const [batchData, setBatchData] = useState("")
    const [tableData, setTableData] = useState('')
    const [newValue, setNewValue] = useState(false)

    const buttonStyle = {
        textTransform: "none", // Set text transform to none for normal case
        color: `${secondaryColorTheme}`, // Set text color
        backgroundColor: `${buttonColors}`, // Set background color
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    };



    //API DATA CALLING USEEFECT-------------------------------------------------------------------------------------
    useEffect(() => {

        const GetNextDocNums = async () => {
            try {
                const response = await GetNextDocNo({
                    iUser: userId,
                    iDocType: 2
                })
                const data = JSON.parse(response?.data.ResultData)
                const docNo = data.map((item) => item.DocNo)
                setdocNum(docNo.join())
            } catch (error) {
                console.log("GetNextDocNums", error);

            }
        }
        GetNextDocNums()
    }, [newValue])





    //FORM INPUT FIELD DATA SETTING FUNCTIONS-------------------------------------
    const hndlPrjctChange = async (obj) => {
        if (obj) {
            setWarehouseId(obj.iId)
            setWarehouse(obj.sName)
        } else {
            setWarehouseId(0)
            setWarehouse(0)

        }
    }
    const handleInitiate = async (obj) => {
        if (obj) {
            setsaleManeId(obj.iId)
            setsaleMane(obj.sName)
        } else {
            setsaleMane(0)
            setsaleManeId(0)
        }
    }
    const hndleAction = async (obj) => {
        if (obj) {
            setoutletid(obj.iId)
            setoutlet(obj.sName)
        } else {
            setoutlet(0)
            setoutletid(0)
        }
    }

    const handleRadioChange = (event) => {
        setTypes(event.target.value);
    };



    const clickClose = () => {
        navigates("/Sales");
    }

    //GetPrev_NextDocNo================================================================
    const GetPrev_NextDocNos = async (id) => {
        try {
            const response = await GetPrev_NextDocNo({
                iTransId: trnsId,
                iDoctype: 2,
                iType: id,
            })
            const data = JSON.parse(response?.data.ResultData).Table
            const docNo = data.map((item) => item.sDocNo)
            const singleString = docNo.join();

            const iTransId = data.map((item) => item.iTransId)
            if (data.length > 0) {
                setdocNum(singleString)
                setSlctTransId(iTransId.join())
                setTransId(iTransId.join())
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'End of  Data  ',
                });
            }


        } catch (error) {
            console.log("GetPrev_NextDocNos", error);
        }
    }

    const handleDelete = async () => {
        const data12 = selected

        try {
            const shouldDelete = await Swal.fire({
                title: 'Are you sure?',
                text: "You are about to delete .",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel it'
            });
            if (shouldDelete.isConfirmed) {
                const res = await DeleteAllTransactions({
                    // iTransId: data12,
                    iTransId:trnsId,
                    iUser: userId,
                    iMaster: 17,
                    iDocType: 2
                });
                Swal.fire('Deleted!', 'The profile has been deleted.', 'success');

                if (res.data.MessageDescription==="Deleted") {
                    GetPrev_NextDocNos(1)
                }
                // Add success message here if needed
            }
            // fetchData(); // Initial data fetch
            // setchangesTriggered(true);
        } catch (error) {
            // Add error message here if needed
            Swal.fire('Error', `${error.message}`, 'error');
            // setchangesTriggered(true);
            // fetchData(); // Initial data fetch
        }

    }


    useEffect(() => {
        const details = async () => {
            try {
                const response = await GetSalesDetails({
                    // iTransId: 
                    iTransId:trnsId,
                })
                const head = JSON.parse(response.data.ResultData).Table
                const body = JSON.parse(response.data.ResultData).Table1
                const batch = JSON.parse(response.data.ResultData).Table2
                console.log(head, "--------", body, "--------------", batch, "respons");


          

                    const updatedFormData = body.map(bodyItem => {
                        const batchItems = batch.filter(batchItem => batchItem.iProduct === bodyItem.iProduct);
                        const updatedBatchPop = batchItems.map(batchItem => ({
                          sBatchNo: batchItem.sBatch,
                          fQty: batchItem.fQty,
                          iExpDate: '31-05-2024', // Example expiration date, set accordingly
                          ReqQty: batchItem.fQty, // Initialize as empty
                          bFoc: batchItem.bFoc,
                          iProduct: batchItem.iProduct,
                          iTransDtId: batchItem.iTransDtId,
                          ibatch: batchItem.ibatch,
                        }));

                        return {
                          Batch: "", 
                          Gross: bodyItem.fQty *bodyItem.fRate, // Set this based on your logic
                          Product: bodyItem.sProduct,
                          fTotalQty: bodyItem.fQty + bodyItem.fFoc, // Set this based on your logic
                          Unit: bodyItem.Unit,
                          fAddCharges: bodyItem.fAddCharges,
                          fDiscAmt: bodyItem.fDiscAmt,
                          fDiscPerc: bodyItem.fDiscPerc,
                          fExciseTaxPer: bodyItem.fExciseTaxPer,
                          fFreeQty: bodyItem.fFoc, // Set this based on your logic
                          fNet: bodyItem.fNet,
                          fQty: bodyItem.fQty,
                          fRate: bodyItem.fRate,
                          fVAT: bodyItem.fVAT,
                          fVatPer: bodyItem.fVatPer,
                          iBatch: batchItems.length > 0 ? batchItems[0].ibatch : "", // Assuming you have a way to determine the batch id
                          iProduct: bodyItem.iProduct,
                          iUnit: bodyItem.iUnit,
                          id: bodyItem.iTransDtId, // Or another unique identifier
                          sRemarks: bodyItem.sRemarks,
                          bBatch: bodyItem.bBatch,
                          batch: updatedBatchPop // Store the entire batch data if needed
                        };
                      });
                  
                setTableData(updatedFormData)
                const headData = head[0];
                const [day, month, year] = headData.sDate.split('-');
                const formattedDate = `${year}-${month}-${day}`;

                setDate(formattedDate);

                setoutlet(headData.Outlet)
                setoutletid(headData.iOutlet)
                setWarehouseId(headData.iWarehouse)
                setWarehouse(headData.Warehouse)
                setsaleMane(headData.sDriver)
                setsaleManeId(headData.iDriver)
                setTypes(headData.iType_Sale)
                setNarration(headData.sNarration)
                setTransId(headData.iTransId)
                setdocNum(headData.sDocNo)
            } catch (error) {
                console.log(error);
            }
        }
        details()
    }, [selectTransid, selected ,trnsId])

    const handleNew = async () => {
        setBatchData("")
        setBodyData("")
        setWarehouseId('')
        // setdocNum('')
        setWarehouse('')
        setsaleMane('')
        setoutlet('')
        setNarration('')
        setTypes('')
        setProductIds('')
        setoutletid('')

        setNewValue(true)
        setTransId(0)
    }


    const handleSave = async () => {
//WARNGING ALERT MESSAGES----------------------------------------------------------
console.log(bodyData);
        if (saleManeId===0) {
            Swal.fire({
                            title: "Error!",
                            text: "Select a  Driver",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        return;
        }
        if (warehouseId===0) {
            Swal.fire({
                            title: "Error!",
                            text: "Select a  Warehouse",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        return;
        }
        if (outletid===0) {
            Swal.fire({
                            title: "Error!",
                            text: "Select a  outlet",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        return;
        }
        if (Number(typess)===0) {
            Swal.fire({
                            title: "Error!",
                            text: "Select a payment type Cash or Credit",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                        return;
        }
        if (bodyData.length > 0) {
            for (let i = 0; i < bodyData.length; i++) {
                const item = bodyData[i];
        
                if (!item.iProduct || item.iProduct === 0) {
                    Swal.fire({
                        title: "Error!",
                        text: "Please select a product",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    return;
                }
        
                if (!item.fQty || item.fQty === 0) {
                    Swal.fire({
                        title: "Error!",
                        text: "Please enter a quantity",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    return;
                }
        
                if (!item.iUnit||item.iUnit===0) {
                    Swal.fire({
                        title: "Error!",
                        text: "Please select a unit",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    return;
                }

                if (!item.fRate||item.fRate===0) {
                    Swal.fire({
                        title: "Error!",
                        text: "Please enter a Rate",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    return;
                }
            }
        }
        try {
            const formData = {
                // iTransId: selected,
                iTransId: trnsId,
                sDocNo: docNum,
                sDate: curDates,
                iDocType: 2,
                iOutlet: outletid,
                sNarration: narration,
                iWarehouse: warehouseId,
                iUser: Number(userId),
                iType_Sale: Number(typess),
                iDriver: saleManeId,
                Body: 
                    bodyData?.map(item => ({
                        iProduct: item.iProduct,
                        fQty: item.fQty,
                        fFreeQty: item.fFreeQty,
                        // fFreeQty: 4,
                        fRate: item.fRate,
                        fDiscPerc: item.fDiscPerc,
                        fDiscAmt: item.fDiscAmt,
                        fAddCharges: item.fAddCharges,
                        fVatPer: item.fVatPer,
                        fVAT: item.fVAT,
                        fExciseTaxPer: item.fExciseTaxPer,
                        sRemarks: item.sRemarks,
                        iUnit: item.iUnit,
                        fNet: item.fNet,
                        Batch: item.batch.map(batchItem => ({
                            iBatch: batchItem.iBatch,
                            sBatch: batchItem.sBatchNo,
                            fQty: batchItem.fQty,
                            // fQty: batchItem.ReqQty,
                            iCondition: batchItem.iCondition,
                            bFoc: batchItem.bFoc
                        })) 

                
                    }))
            };

            console.log(formData,"handleSave");

            const res = await PostSales(formData)

            console.log(res.data.MessageDescription, "res===============================");
            if (res.data.Status === "Success") {
                Swal.fire({
                    title: `${res.data.MessageDescription}`,
                    // text: "Dates cannot be in the future",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                setBatchData("")
        setBodyData("")
        setWarehouseId('')
        // setdocNum('')
        setWarehouse('')
        setsaleMane('')
        setoutlet('')
        setNarration('')
        setTypes('')
        setProductIds('')
        setoutletid('')
        setTransId(0)
        setNewValue(true)
            } else {
                Swal.fire({
                    title: `${res.data.MessageDescription}`,
                    // text: "Dates cannot be in the future",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }


        } catch (error) {
            console.log("PostSales---", error);
        }
    }

    return (
        <div>
            <>
                <Header />
                <Box
                    sx={{
                        margin: 0,
                        background: `${secondaryColorTheme}`,
                        height: "200px",
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <Box
                        sx={{
                            width: "auto",
                            paddingLeft: 2,
                            paddingRight: 2,
                            zIndex: 1,
                        }}
                    >
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            padding={1}
                            justifyContent="space-between"
                        >
                            <Box >
                                <Typography
                                    style={{
                                        color: `${buttonColors}`,
                                        margin: 3,
                                    }}
                                    sx={{
                                        fontSize: {
                                            xs: "0.875rem", // smaller font size on extra-small devices
                                            sm: "1.25rem", // default h6 font size on small devices and above
                                        },
                                    }}
                                    variant="h6"
                                    component="h2"
                                >
                                    {PageName}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: '9px' }}>
                                <Button
                                    onClick={handleNew}
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    style={buttonStyle}
                                >
                                    New
                                </Button>

                                <Button
                                    onClick={handleSave}
                                    variant="contained"
                                    style={buttonStyle}
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    variant="contained"
                                    startIcon={<DeleteIcon />}
                                    style={buttonStyle}
                                    sx={{
                                        ...buttonStyle,
                                        fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                                        padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                                    }}
                                >
                                    Delete
                                </Button>
                                <Button
                                    onClick={() => GetPrev_NextDocNos(1)}
                                    variant="contained"
                                    startIcon={<ArrowBackIcon />}
                                    style={buttonStyle}
                                    sx={{
                                        ...buttonStyle,
                                        fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                                        padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                                    }}
                                >
                                    Prev
                                </Button>
                                <Button
                                    onClick={() => GetPrev_NextDocNos(2)}
                                    variant="contained"
                                    startIcon={<ArrowForwardIcon />}
                                    style={buttonStyle}
                                    sx={{
                                        ...buttonStyle,
                                        fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                                        padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                                    }}
                                >
                                    Next
                                </Button>
                               
                                <Button
                                    variant="contained"
                                    startIcon={<CloseIcon />}
                                    style={buttonStyle}
                                    onClick={clickClose}
                                    sx={{
                                        ...buttonStyle,
                                        fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                                        padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                                    }}
                                >
                                    Close
                                </Button>
                            </Box>
                        </Stack>

                        <form     >
                            <MDBCard
                                className="text-center "
                                style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", zIndex: 1 }}
                            >
                                <MDBCardBody>
                                    <MDBRow>
                                        <MDBCol lg="3" md="4" sm="6" xs="12">
                                            <div className="mb-3">
                                                <MDBInput
                                                    required
                                                    id={`form3Example`}
                                                    size="small"
                                                    label="Document No"
                                                    value={docNum}
                                                    readonly  // Add the readonly attribute to make it non-editable
                                                    labelStyle={{
                                                        fontSize: '15px',
                                                    }}
                                                    inputStyle={{  // Add CSS styles to make it look like a text field
                                                        border: 'none',
                                                        backgroundColor: 'transparent',
                                                        fontSize: '15px',
                                                        paddingLeft: '8px',
                                                        outline: 'none',
                                                        width: '100%',
                                                    }}
                                                />

                                            </div>
                                        </MDBCol>
                                        <MDBCol lg="3" md="4" sm="6" xs="12">
                                            <div className="mb-3">
                                                <MDBInput
                                                    required
                                                    id={`form3Example`}
                                                    type="date"
                                                    size="small"

                                                    label="Date"
                                                    value={curDates}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    onKeyDown={(e) => e.preventDefault()}
                                                    onClick={(e) => e.target.showPicker?.()} // This line is for modern browsers
                                                    onFocus={(e) => e.target.showPicker?.()} // Fallback for when the field is focused
                                                    labelStyle={{
                                                        fontSize: '15px',
                                                        backgroundColor: "white"
                                                    }}
                                                    style={{
                                                        border: '2px solid #FF5000',
                                                        // outline: 'none', // Optional: Removes the default outline
                                                    }}

                                                />

                                            </div>
                                        </MDBCol>
                                        <MDBCol lg="3" md="4" sm="6" xs="12">
                                            <div className="mb-3">
                                                <div className="mb-3">
                                                    <SalesManAuto
                                                        value={saleMane}
                                                        onChangeName={handleInitiate}
                                                    />
                                                </div>
                                            </div>
                                        </MDBCol>
                                        <MDBCol lg="3" md="4" sm="6" xs="12">
                                            <div className="mb-3">
                                                <div className="mb-3">
                                                    <AutoComplete3
                                                        value={warehouse}
                                                        onChangeName={hndlPrjctChange}
                                                    />
                                                </div>
                                            </div>
                                        </MDBCol>
                                        <MDBCol lg="3" md="4" sm="6" xs="12">
                                            <div className="mb-3">
                                                <div className="mb-3">
                                                    <OutletAuto
                                                        value={outlet}
                                                        onChangeName={hndleAction}
                                                    />
                                                </div>
                                            </div>
                                        </MDBCol>
                                        <MDBCol lg="3" md="4" sm="6" xs="12">
                                            <TextField
                                                label="Narration"
                                                variant="outlined"
                                                size="small"
                                                type="text"
                                                value={narration}
                                                onChange={(e) => setNarration(e.target.value)} // Update the narration state on input change
                                                sx={{
                                                    '& input': {
                                                        padding: '5px 75px', // Adjust padding for input text
                                                    },

                                                }}
                                            />
                                        </MDBCol>
                                        <MDBCol lg="3" md="4" sm="6" xs="12">
                                            <div className="mb-3">
                                                <FormControl alignItems="start">
                                                   
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                                        name="row-radio-buttons-group"
                                                        value={typess}
                                                        onChange={handleRadioChange}
                                                    >
                                                         <FormLabel alignItems="start" id="demo-row-radio-buttons-group-label"
                                                    >Types</FormLabel>
                                                        <FormControlLabel value="1" control={<Radio />} label="Cash" />
                                                        <FormControlLabel value="2" control={<Radio />} label="Credit" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>
                                        </MDBCol>

                                    </MDBRow>
                                </MDBCardBody>
                            </MDBCard>
                        </form>
                    </Box>

                    <EnhancedTable outlet={outlet}
                        warehouseId={warehouseId}
                        setProductIds={setProductIds}
                        outletid={outletid}
                        setBodyData={setBodyData}
                        setBatchData={setBatchData}
                        tableData={tableData}
                        newValue={newValue}
                        setNewValue={setNewValue}
                        trnsId={trnsId}
                    />


                </Box>
            </>
        </div >
    )
}


export default HSEreport
