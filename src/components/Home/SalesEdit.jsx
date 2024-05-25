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
                setdocNum(docNo)
            } catch (error) {
                console.log("GetNextDocNums", error);

            }
        }
        GetNextDocNums()
    }, [])

    // const getInitialFormData = () => {




    //     return {
    //         DisplayLength: displayLength,
    //         DisplayStart: displayStart,
    //         FromDate: formattedTenDaysAgoDate,
    //         ToDate: formattedCurrentDate,
    //         iProject: 0,
    //         initiatedBy: 0,
    //         iActionBy: 0,
    //         iRisklevel: 0,
    //         istatus: 0,
    //         Search: ""
    //     }
    // };


    // useEffect(() => {
    //     handleOpen()
    //     const newFormdata = {
    //         DisplayLength: displayLength,
    //         DisplayStart: displayStart,
    //         FromDate: FromDate,
    //         ToDate: TODate,
    //         iProject: iProjects,
    //         initiatedBy: intiate,
    //         iActionBy: Action,
    //         iRisklevel: riskLevel,
    //         istatus: istatus,
    //         Search: searchQuery,
    //     }
    //     handleClose()
    //     // fetchData(newFormdata)
    // }, [displayLength, displayStart, searchQuery])



    // initialData SETTING FUNCTION-------------------------------------------
    // const fetchData = async (initialData) => {
    //     handleOpen()
    //     try {
    //         const res = await HSEReactReport({
    //             DisplayLength: displayLength,
    //             DisplayStart: displayStart,
    //             FromDate: initialData.FromDate,
    //             ToDate: initialData.ToDate,
    //             iProject: initialData.iProject,
    //             initiatedBy: initialData.initiatedBy,
    //             iActionBy: initialData.iActionBy,
    //             iRisklevel: initialData.iRisklevel,
    //             istatus: initialData.istatus,
    //             Search: initialData.Search,
    //         });
    //         setProjectLists(res);
    //         handleClose()
    //     } catch (error) {
    //         console.log(error);
    //         handleClose()
    //     }
    // }



    //FORM SUBMIT HANDLE SAVE FUNCTION-------------------------------
    // const handleSave = async (e) => {
    //     e.preventDefault();
    //     const fromDate = new Date(FromDate);
    //     const toDate = new Date(TODate);
    //     const timeDiff = toDate.getTime() - fromDate.getTime();
    //     const dayDiff = timeDiff / (1000 * 3600 * 24);

    //     const today = new Date();
    //     today.setHours(23, 59, 59, 999); // Set to the last moment of today

    //     // Check if dates are in the future
    //     if (fromDate > today || toDate > today) {
    //         Swal.fire({
    //             title: "Error!",
    //             text: "Dates cannot be in the future",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         });
    //         return; // Stop execution if the date is in the future
    //     }
    //     if (!FromDate || !TODate) {
    //         Swal.fire({
    //             title: "Error!",
    //             text: "Please Enter From Date & To Date",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         });
    //         return; // Stop execution if the date range is invalid
    //     }
    //     if (dayDiff < 0) {
    //         Swal.fire({
    //             title: "Error!",
    //             text: "To Date should be greater than or equal to From Date",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         });
    //         return; // Stop execution if the date range is invalid
    //     }


    //     handleOpen()
    //     try {
    //         const res = await HSEReactReport({
    //             DisplayLength: displayLength,
    //             DisplayStart: displayStart,
    //             FromDate: FromDate,
    //             ToDate: TODate,
    //             iProject: iProjects,
    //             initiatedBy: intiate,
    //             iActionBy: Action,
    //             iRisklevel: riskLevel,
    //             istatus: istatus,
    //             Search: searchQuery
    //         });
    //         setProjectLists(res);

    //         handleClose()
    //     } catch (error) {
    //         console.log(error);
    //         handleClose()
    //     }
    // };



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
        console.log(id,trnsId, "typess");
        try {
            const response = await GetPrev_NextDocNo({
                iTransId: trnsId,
                iDoctype: 2,
                iType: id,
            })
            const data = JSON.parse(response?.data.ResultData).Table
            console.log(data, "=======GetPrev_NextDocNos ============================================== ");
            const docNo = data.map((item) => item.sDocNo)
            const iTransId = data.map((item) => item.iTransId)
            if (data.length > 0) {
                setdocNum(docNo.join())
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
                // Add success message here if needed
                Swal.fire('Deleted!', 'The profile has been deleted.', 'success');
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
                setTableData(body)
                console.log(head, "--------", body, "--------------", batch, "respons");
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
        try {
            const formData = {
                // iTransId: selected,
                iTransId: trnsId,
                sDocNo: docNum.join(''),
                sDate: curDates,
                iDocType: 2,
                iOutlet: outletid,
                sNarration: narration,
                iWarehouse: warehouseId,
                iUser: Number(userId),
                iType_Sale: Number(typess),
                iDriver: saleManeId,
                Body: 
                    bodyData.map(item => ({
                        iProduct: item.iProduct,
                        fQty: item.fQty,
                        fFreeQty: item.fFreeQty,
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
                            iCondition: batchItem.iCondition,
                            bFoc: batchItem.bFoc
                        }))
                    }))
            };

            // Now you can use the formData variable to access or manipulate this data.

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
            console.log("PostSales", error);
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
                                    startIcon={<PrintIcon />}
                                    style={buttonStyle}
                                    //   onClick={handleExportToExcel}
                                    sx={{
                                        ...buttonStyle,
                                        fontSize: { xs: "0.60rem", sm: "0.75rem", md: "0.875rem" }, // Adjust font size based on screen size
                                        padding: { xs: "1px 2px", sm: "3px 6px", md: "6px 12px" }, // Adjust padding based on screen size
                                    }}
                                >
                                    Suspend
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
