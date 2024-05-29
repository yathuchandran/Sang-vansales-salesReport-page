

import React, { useEffect, useState } from "react";
import { Button, Stack, Box, Zoom, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";
import { MDBRow, MDBCol, MDBInput, MDBCardBody } from "mdb-react-ui-kit";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Swal from 'sweetalert2';

const buttonStyle = {
    textTransform: "none",
    color: "#fff",
    backgroundColor: "#1976d2",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
};

const customFormGroupStyle1 = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    maxHeight: '550px',
    overflowY: 'auto',
    overflowX: 'auto',
    padding: '10px',
    width: '472px',
    height: '450px'
};

const bodyData = [
    { sFieldName: "Batch", sFieldCaption: "Batch" },
    { sFieldName: "Exp.Date", sFieldCaption: "Exp.Date" },
    { sFieldName: "Avail.Qty", sFieldCaption: "Avail.Qty" },
    { sFieldName: "Req.Qty", sFieldCaption: "Req.Qty" },
];

function Modals({ isOpen, handleNewClose, mode,  formDataEdit, setBatchData, Batch, setBatch,formDatass}) {
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
        };
    };


    const [open, setOpen] = useState(false);
    const [warning, setWarning] = useState(false);
    const [message, setMessage] = useState("");
    const [mode1, setMode1] = useState("");
    const [iIds, setIids] = useState();
    const [reqQty, setReqQty] = useState(null);
    const [allocatedValue, setAllocatedValue] = useState(null);
    const [fQuantity,setfQuantity] = useState(null);
    const [item,setItem] = useState(null);
    const [filteredReqQty, setFilteredReqQty] = useState([]);
console.log(filteredReqQty,"filteredReqQty");
   useEffect(()=>{
    setBatchData(filteredReqQty)
   },[filteredReqQty])

    const modalStyle = { display: isOpen ? "block" : "none" };
console.log(formDatass,"formDatass---------------------------------------------");

    useEffect(() => {
        if (reqQty) {
            setBatch(reqQty);
        }
    }, [reqQty]);

    useEffect(() => {
        setMode1(mode);
        setIids(formDataEdit);
    }, [mode, formDataEdit]);

   

    const handleCloseModal = () => {
        handleNewClose();
    };

  
    // FIFO stock allocation function
    const handleFifo = () => {
        formDatass.forEach((item) => {
            if (item.iProduct === item.iProduct) { // Assuming you meant to compare ProductId with iProduct

              let remainingQty = item.fQty; // Total quantity to be allocated

              const updatedBatch = Batch.map((item) => {
                  let allocatedQty = 0;
                  if (item.fQty <= remainingQty) {
                      allocatedQty = item.fQty;
                      remainingQty -= item.fQty;
                  } else {
                      allocatedQty = remainingQty;
                      remainingQty = 0;
                  }
                  return {
                      ...item,
                      ReqQty: allocatedQty,
                    //   fQty: item.fQty - allocatedQty
                    // fQty:  allocatedQty

                  };
              });
              const allocatedValues = updatedBatch.map((item) => item.ReqQty);
              const getTotalSum = (values) => {
                return values.reduce((acc, value) => acc + Number(value), 0);
              };
            
              const totalSum = getTotalSum(allocatedValues);

              setBatch(updatedBatch);
              setReqQty(updatedBatch)
              
              setAllocatedValue(totalSum);
            }
          });
       
    };

    useEffect(() => {
        formDatass.forEach((item) => {
             setfQuantity(item.fQty)
             setItem(item.Product)
        
        });
      }, []);


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

    const handleLoad = (value, rowIndex) => {
        const updated = [...Batch];
        updated[rowIndex].ReqQty = Number(value);

        setReqQty(updated);

        const allocatedValues = updated.map((item) => item.ReqQty);
        const getTotalSum = (values) => {
            return values.reduce((acc, value) => acc + Number(value), 0);
          };
        
          const totalSum = getTotalSum(allocatedValues);

        if (Number(value) > fQuantity) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Allocation',
                text: 'The requested quantity exceeds the total quantity.',
            });
        } else if (Number(value) > updated[rowIndex].fQty) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Stock',
                text: 'The requested quantity exceeds available stock.',
            });
        } else if (totalSum > fQuantity) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Allocation',
                text: 'The allocated quantity exceeds the total quantity.',
            });
        } else {
            setReqQty(updated);
            setAllocatedValue(totalSum);
        }
    };

    const handleloads = () => {
        console.log("hello handleloads ");
        //for posting values-----------------------------------------------------------
            const filtered = reqQty.filter(item => item.ReqQty > 0);
            const updatedData = filtered.map((item) => ({
                ...item,
                iBatch: 0, // Set the initial value here, or leave it empty
                iCondition:0,
                bFoc:0,
            }));
            setFilteredReqQty(updatedData);
        

        if (Number(fQuantity) !== Number(allocatedValue)) {
            Swal.fire({
                icon: 'warning',
                text: `Quantity ${fQuantity} and allocated ${allocatedValue} must be equal.`,
            });
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseAlert = () => {
        setWarning(false);
    };

    return (
        <div>
            <div
                className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
                style={{
                    display: isOpen ? "block" : "none",
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                }}
            ></div>
            <Zoom in={isOpen} timeout={isOpen ? 400 : 300}>
                <div
                    className={`modal ${isOpen ? "modal-open" : ""}`}
                    style={modalStyle}
                >
                    <div style={{ marginTop: "10%", width: "50%", marginLeft: "25%", height: "60%" }}>
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
                                                        label="Item"
                                                        value={item}
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
                                                    />
                                                </div>
                                            </MDBCol>
                                            <MDBCol lg="4" md="4" sm="6" xs="10">
                                                <div className="mb-3">
                                                    <MDBInput
                                                        label="Quantity"
                                                        value={fQuantity}
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
                                                    />
                                                </div>
                                            </MDBCol>
                                            <MDBCol lg="4" md="4" sm="6" xs="10">
                                                <div className="mb-3">
                                                    <MDBInput
                                                        label="Allocated"
                                                        value={allocatedValue}
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
                                                    />
                                                </div>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBCardBody>

                                    <TableContainer component={Paper} sx={{ maxHeight: "40vh" }} style={{ width: "96%", margin: "auto" }}>
                                        <Table stickyHeader aria-label="editable table">
                                            <TableHead>
                                                <TableRow>
                                                    {bodyData.map((field, index) => (
                                                        <TableCell
                                                            key={index}
                                                            sx={{ padding: "0px 0px", height: "40px", border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: "#1976d2", color: 'white' }}
                                                        >
                                                            {field.sFieldCaption}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Batch.map((item, rowIndex) => (
                                                    <TableRow key={rowIndex} role="checkbox" tabIndex={-1}>
                                                        {bodyData.map((field, colIndex) => (
                                                            <TableCell
                                                                key={colIndex}
                                                                sx={{ padding: "0px 0px", border: '1px solid rgba(224, 224, 224, 1)' }}
                                                                style={{ minWidth: "150px", maxWidth: "300px" }}
                                                            >
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
                                                                                width: '100%',
                                                                                '& input': {
                                                                                    padding: '5px 10px',
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
            </Zoom>
            <Loader open={open} handleClose={handleClose} />
            <ErrorMessage
                open={warning}
                handleClose={handleCloseAlert}
                message={message}
            />
        </div>
    );
}

export default Modals;
