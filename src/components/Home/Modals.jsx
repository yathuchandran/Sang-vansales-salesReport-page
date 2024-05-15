import React, { useEffect, useState } from "react";
import { Button, Stack, Box, Zoom, Typography, FormGroup, FormControlLabel, Checkbox, MenuItem, Menu } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton } from '@mui/material';
import { MDBRow, MDBCol, MDBInput, MDBCardBody, MDBCard } from "mdb-react-ui-kit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../Loader/Loader";
import { DeleteUser, GetMenuData, GetRoles, GetUserDetails, UpsertUser } from "../../api/Api";
import { buttonColor1 } from '../../config';
import Swal from 'sweetalert2';



import ErrorMessage from "../ErrorMessage/ErrorMessage";


const buttonStyle = {
    textTransform: "none",
    color: `#fff`,
    backgroundColor: `#1976d2`,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
};

const customFormGroupStyle1 = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    maxHeight: '550px', // Adjust as needed
    overflowY: 'auto', // Hide vertical overflow
    overflowX: 'auto', // Allow horizontal scrolling
    padding: '10px',
    width: '472px',
    height: '450px'

};

const bodyData = [
    {
        sFieldName: "Batch",
        sFieldCaption: "Batch",

    },
    {
        sFieldName: "Exp.Date",
        sFieldCaption: "Exp.Date",

    },
    {
        sFieldName: "Avail.Qty",
        sFieldCaption: "Avail.Qty",

    },
    {
        sFieldName: "Req.Qty",
        sFieldCaption: "Req.Qty",

    },

]





function Modals({ isOpen, handleNewClose, mode, Product, formDataEdit, Qty, Batch, setBatch,ProductId }) {
    const getInitialFormData = () => {
        return {
            id: 0,
            LoginName: "",
            UserName: "",
            Password: "",
            Phone: "",
            Email: "",
            iRole: 0,
            isWebUser: true,
            isMobileUser: true,

        }
    };

    console.log(Batch,ProductId,"ProductId");

    const [open, setOpen] = React.useState(false);
    const [warning, setWarning] = useState(false);
    const [message, setMessage] = useState("");
    const [mode1, setMode1] = useState("");

    const [formData, setFormData] = useState({});
    const [iIds, setIids] = useState()

    const [reqQty, setReqQty] = useState(null)
    const [allocatedValue, setAllocatedValue] = useState(null)
    const modalStyle = {
        display: isOpen ? "block" : "none",
    };


    useEffect(() => {
        if (reqQty) {
            setBatch(reqQty)
        }

    }, [reqQty])

    useEffect(() => {
        setMode1(mode);
        setIids(formDataEdit)
    }, [mode, formDataEdit]);

    useEffect(() => {




        const GetUserDetail = async () => {
            try {
                const response = await GetUserDetails({ userId: iIds })
                const data = JSON.parse(response.result)
                const id = data.map((item) => item.iId)
                const LoginName = data.map((item) => item.sLoginName)
                const UserName = data.map((item) => item.sUserName)
                const Password = data.map((item) => item.sPassword)
                const phoneNumber = data.map((item) => item.sPhoneNo)
                const Email = data.map((item) => item.sEmail)
                const role = data.map((item) => item.iRole)
                const sRoleName = data.map((item) => item.sRoleName)


                setFormData({
                    ...formData,
                    id: id.join(','),
                    LoginName: LoginName.join(','),
                    UserName: UserName.join(','),
                    Password: Password.join(','),
                    Phone: phoneNumber.join(','),
                    Email: Email.join(','),
                    iRole: role.join(','),
                    sRole: sRoleName.join(','),
                    isWebUser: true,
                    isMobileUser: true,
                    upsertUserId: 0
                })
            } catch (error) {
                console.log("GetUserDetails", error);
            }
        }
        if (iIds > 0) {
            GetUserDetail()

        }
        if (mode1 === "new") {
            setFormData(getInitialFormData());
        }
    }, [mode1, iIds])

    const handleCloseModal = () => {
        handleNewClose();
    }


    // HANDLE FIFO FUNCTIONS-------------------------------------------------------------------------------
    const handleFifo = () => {
        for (let i = 0; i < Batch.length; i++) {
            if (Batch[i].fQty <= Qty) {
                Batch[i].ReqQty=Batch[i].fQty
                Qty =Qty- Batch[i].fQty
                Batch[i].fQty=0
            } else {
                Batch[i].ReqQty=Qty
                Batch[i].fQty=Batch[i].fQty-Qty

                break;
            }
            setReqQty(Batch)
        }
    }

    // HANDLE CLEAR FUNCTIONS-------------------------------------------------------------------------------
    const handleAllClear = () => {
        const updatedReqQty = reqQty.map(item => {
            if (item.ReqQty) {
                return { ...item, ReqQty: '' };
            }
            return item;
        });
        console.log(updatedReqQty);
        setReqQty(updatedReqQty);
    };

    // HANDLE LOAD FUNCTIONS-------------------------------------------------------------------------------
    const handleLoad = (value, rowIndex) => {
        const updated = [...Batch]
        updated[rowIndex].ReqQty = value
        setReqQty(updated);

        const allcatevalue = updated.map((item) => item.ReqQty)
        console.log(allcatevalue);
        const totalSum = allcatevalue.reduce((acc, val) => {
            if (val.trim() !== '') {
                return acc + parseInt(val);
            } else {
                return acc;
            }
        }, 0);
        if (Number(value) > Qty) {
            Swal.fire({
                icon: 'warning',
                title: 'greater than the total',
                text: 'Batch   has an allocated quantity greater than the total..!!',
            });
        } else if (Number(value) > updated[rowIndex].fQty) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Stock',
                text: 'The requested quantity exceeds available stock.',
            });

        } else if (totalSum > Qty) {

            Swal.fire({
                icon: 'warning',
                title: 'greater than the total',
                text: 'Batch   has an allocated quantity greater than the total..!!',
            });


        }
        else {
            setReqQty(updated);
            setAllocatedValue(totalSum)
        }
    }

    const handleloads = () => {

        if (Qty != allocatedValue) {
            Swal.fire({
                icon: 'warning',
                text: `quantity ${Qty} and alocated ${allocatedValue} must be quals`,
            });
        }

    }
    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseAlert = () => {
        setWarning(false);
    };




    return (
        <div><div
            className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
            style={{
                display: isOpen ? "block" : "none",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
            }}
        ></div>
            <Zoom in={isOpen} timeout={isOpen ? 400 : 300}>
                <div
                    className={`modal ${isOpen ? "modal-open" : ""}`}
                    style={modalStyle}
                >
                    <div style={{ marginTop: "10%", width: "50%", marginLeft: "25%", height: "60%" }} >
                        <div className="modal-content">
                            <form>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    padding={2}
                                    justifyContent="flex-end"
                                >

                                    <Button
                                        onClick={handleFifo}
                                        variant="contained"
                                        style={buttonStyle}
                                    >
                                        FIFO
                                    </Button>
                                </Stack>

                                <Box
                                    sx={{
                                        width: "auto",
                                        marginTop: 1,
                                        padding: 3,
                                        zIndex: 1,
                                        backgroundColor: "#ffff",
                                        borderRadius: 2,
                                    }}
                                >

                                    <MDBCardBody>


                                        <MDBRow>
                                            <MDBCol lg="4" md="4" sm="6" xs="10">
                                                <div className="mb-3">
                                                    <MDBInput

                                                        label="item"
                                                        value={Product}
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
                                            <MDBCol lg="4" md="4" sm="6" xs="10">
                                                <div className="mb-3">
                                                    <MDBInput

                                                        label="Quantity"
                                                        value={Qty}
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
                                            <MDBCol lg="4" md="4" sm="6" xs="10">
                                                <div className="mb-3">
                                                    <MDBInput

                                                        label="Alocated"
                                                        value={allocatedValue}
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
                                            {/* <MDBCol lg="4" md="4" sm="6" xs="10">
                                                <div className="mb-3">
                                                    <MDBInput

                                                        label="Balance"
                                                        value={Product}
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

                                            </MDBCol> */}
                                        </MDBRow>
                                    </MDBCardBody>

                                    <TableContainer component={Paper} sx={{ maxHeight: "40vh" }} style={{
                                        width: "96%",
                                        margin: "auto",
                                    }}>
                                        <Table stickyHeader aria-label="editable table">
                                            <TableHead>
                                                <TableRow >

                                                    {bodyData.map((field, index) => (
                                                        <TableCell sx={{ padding: "0px 0px", height: "40px", border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: buttonColor1, color: 'white' }}>{field.sFieldCaption}</TableCell>
                                                    ))}


                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Batch.map((item, rowIndex) => (
                                                    <TableRow key={rowIndex} role="checkbox" tabIndex={-1}>
                                                        {bodyData.map((field, colIndex) => (
                                                            <TableCell key={colIndex} sx={{ padding: "0px 0px", border: '1px solid rgba(224, 224, 224, 1)' }} style={{ minWidth: "150px", maxWidth: "300px" }}>
                                                                {field.sFieldCaption === "Batch" ? (
                                                                    <Typography>{item.sBatchNo}</Typography>
                                                                ) : field.sFieldCaption === "Exp.Date" ? (
                                                                    <Typography>{item.iExpDate}</Typography>
                                                                ) : field.sFieldCaption === "Avail.Qty" ? (
                                                                    <Typography>{item.fQty}</Typography>
                                                                ) : field.sFieldCaption === "Req.Qty" ? (
                                                                    <MDBCol lg="3" md="4" sm="6" xs="12">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            type="text"
                                                                            value={item.ReqQty}
                                                                            onChange={(e) => handleLoad(e.target.value, rowIndex)}
                                                                            sx={{
                                                                                width: '100%', // Set width to 100%
                                                                                '& input': {
                                                                                    padding: '5px 10px', // Adjust padding for input text
                                                                                },
                                                                            }}
                                                                        />
                                                                    </MDBCol>

                                                                ) : null}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>


                                        </Table>
                                    </TableContainer>
                                </Box>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    padding={2}
                                    justifyContent="flex-end"
                                >

                                    <Button
                                        onClick={handleCloseModal}
                                        variant="contained"
                                        style={buttonStyle}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        onClick={handleloads}
                                        variant="contained"
                                        style={buttonStyle}
                                    >
                                        Load
                                    </Button>
                                    <Button
                                        onClick={handleAllClear}
                                        variant="contained"
                                        style={buttonStyle}
                                    >
                                        Clear
                                    </Button>
                                </Stack>
                            </form>
                        </div>
                    </div>
                </div>

            </Zoom >
            <Loader open={open} handleClose={handleClose} />
            <ErrorMessage
                open={warning}
                handleClose={handleCloseAlert}
                message={message}
            />
        </div>
    )
}

export default Modals