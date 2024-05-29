



import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Checkbox, Typography, Button, Box, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SalesManAuto from './AutoComplete/SalesManAuto';
import AutoComplete3 from './AutoComplete/AutocmpltWarehouse';
import ProductAuto from './TableAuto/ProductAuto';
import UnitAutocomplete from './TableAuto/unitAuto';
import Swal from "sweetalert2";
import { GetProductRate, GetProduct_vat, GetSalesBal_Qty, GetSalesBatch } from '../../api/Api';
import Modals from './Modals';
import { MDBInput } from 'mdb-react-ui-kit';
import { buttonColor1 } from '../../config';

const initialRows = [
    { id: 1, Product: '', iProduct: '', Unit: '', iUnit: '', fQty: '', Batch: '', fFreeQty: '', iBatch: '', TotalQty: '', fRate: '', fExciseTaxPer: '', Gross: '', fDiscPerc: '', fDiscAmt: '', fAddCharges: '', fVatPer: '', fVAT: '', sRemarks: '', fNet: '', fTotalQty: '' }
];

const MuiEditableTable = ({ bodyData, outlet, warehouseId, setProductIds, outletid, setBodyData, setBatchData, tableData, newValue, setNewValue, trnsId }) => {
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
    const [gross, setGross] = useState(null);
    const [DiscountAmount, setDiscountAmount] = useState(null);
    const [Discount, setDiscount] = useState(null);
    const [availqty, setAvailqty] = useState(0)
const [selectedField,setSelectedField]= useState(null);

    const [nonbatchableProduct, setNonbatchableProduct] = useState([]);

    useEffect(() => {
        if (newValue === true) {
            setFormData(initialRows)
        }
        setNewValue(false)
    }, [newValue])

// EDIT CASE DATA FETCHING ---------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        if (Array.isArray(tableData) && tableData.length > 0) {
            const updatedFormData = tableData.map(data => ({
                Batch: data.bBatch ? "BatchValue" : "", // Assuming you have a way to determine the batch value
                Gross: "", // Set this based on your logic
                Product: data.sProduct,
                TotalQty: "", // Set this based on your logic
                Unit: data.Unit,
                fAddCharges: data.fAddCharges,
                fDiscAmt: data.fDiscAmt,
                fDiscPerc: data.fDiscPerc,
                fExciseTaxPer: data.fExciseTaxPer,
                fFreeQty: "", // Set this based on your logic
                fNet: data.fNet,
                fQty: data.fQty,
                fRate: data.fRate,
                fVAT: data.fVAT,
                fVatPer: data.fVatPer,
                iBatch: "", // Assuming you have a way to determine the batch id
                iProduct: data.iProduct,
                iUnit: data.iUnit,
                id: data.iTransDtId, // Or another unique identifier
                sRemarks: data.sRemarks,
                bBatch: data.bBatch
            }));
            setFormData(updatedFormData);

        }
    }, [tableData]);

    useEffect(() => {
        setProductIds(formData.ProductId || null);
        setBodyData(formData || null)
    }, [formData.ProductId, formData]);


    const handleAddRow = (rowIndex) => {
        const newRow = { id: generateNewId(), iProduct: '', iUnit: '', fQty: '', Batch: '', fFreeQty: '', iBatch: '', TotalQty: '', fRate: '', fExciseTaxPer: '', Gross: '', fDiscPerc: '', fDiscAmt: '', fAddCharges: '', fVatPer: '', fVAT: '', sRemarks: '', fNet: '', fTotalQty: '' };
        const newRows = [...rows.slice(0, rowIndex + 1), newRow, ...rows.slice(rowIndex + 1)];
        const newFormData = [...formData.slice(0, rowIndex + 1), newRow, ...formData.slice(rowIndex + 1)];
        setFormData(newFormData);
        setRows(newRows);
    };

    const handleDeleteRow = (rowId) => {
        console.log(rowId,"handleDeleteRow",rows,formData);

        if (formData.length > 1) {
            setRows(rows.filter(row => row.id !== rowId));
            setFormData(formData.filter(row => row.id !== rowId));
        } else {
            alert("At least one row must remain.");
        }
        // if (rows.length > 1) {
        //     setRows(rows.filter(row => row.id !== rowId));
        //     setFormData(formData.filter(row => row.id !== rowId));
        // } else {
        //     alert("At least one row must remain.");
        // }
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

//handle Product auto commplete -------------------------------------------------------------------------------------------------
    const handleProduct = async (obj, rowIndex) => {
        const prdctid = obj.iId

        // console.log(prdctid, obj, rowIndex);
        // const newFormData = formData.map((row, index) => {
        //     if (index === rowIndex) {
        //         return { ...row, iProduct: obj.iId, Product: obj.sName };
        //     }
        //     return row;
        // });
        // setFormData(newFormData);
     
    // Check if the product already exists in the formData
    const productExists = formData.some(row => row.iProduct === prdctid);

    if (productExists) {
        Swal.fire({
            icon: 'warning',
            title: 'Duplicate Product',
            text: 'Product is already exist. Please select a unique product.',
        });
    }
        const newFormData = formData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, iProduct: obj.iId, Product: obj.sName };
            }
            return row;
        });
        setFormData(newFormData);
    

        //handle batch--------------------------------------

        try {
            const res = await GetSalesBatch({
                iProduct: obj.iId,
                iTransId: trnsId,
                iWarehouse: warehouseId,
            });
            const datas = JSON.parse(res?.data.ResultData);
            console.log(res);

            const updatedData = datas.map((item) => ({
                ...item,
                ReqQty: "", // Set the initial value here, or leave it empty
            }));
            // Update the formData with the batch data for the corresponding row index
            const updatedFormData = newFormData.map((row, index) => {
                if (index === rowIndex) {
                    return { ...row, batch: updatedData }; // Store the batch data in the corresponding row
                }
                return row;
            });
            setFormData(updatedFormData);


 //handle PRODUCT RATE API FETCHING--------------------------------------

            const response = await GetProduct_vat({
                iProduct: prdctid
            })
            const ProductEXR = JSON.parse(response?.data.ResultData);
            const fVatPer = ProductEXR.map((item) => (item.fVatPer)).join()
            const fExciseTaxPer = ProductEXR.map((item) => (item.fTaxper)).join()
            const updatedFormDataS = updatedFormData.map((row, index) => {
                if (index === rowIndex) {
                    return { ...row, fVatPer: fVatPer, fExciseTaxPer: fExciseTaxPer };
                }
                return row;
            });
            setFormData(updatedFormDataS);

        } catch (error) {
            console.log(error);
        }


    };




    const handleUnit = async (obj, rowIndex) => {
        const newFormData = formData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, Unit: obj.sName, iUnit: obj.iId };
            }
            return row;
        });
        setFormData(newFormData);
        try {
            const response = await GetProductRate({
                iProductId: newFormData[rowIndex].iProduct,
                iUnitId: newFormData[rowIndex].iUnit,
                iOutletId: outletid,
            })

            if (response === "Failure") {
                // Swal.fire({
                //     icon: 'warning',
                //     title: 'Warning',
                //     text: 'no Data here ',
                // });
            } else {
                const datas = JSON.parse(response?.data.ResultData);
                const updatedFormData = newFormData.map((row, index) => {
                    var gross = row.fQty * datas[0].fRate
                    if (index === rowIndex) {
                        return { ...row, fRate: datas[0].fRate, Gross: gross };
                    }
                    return row;
                });
                setFormData(updatedFormData); // Set updated formData with rate
            }
        } catch (error) {
            console.log("GetProductRate", error);

        }
    };

    const handleBlur = (event, rowIndex) => {
        const qty = event.target.value
        const newFormData = formData.map((row, index) => {

            const gross = qty * row.fRate

            if (index === rowIndex) {
                return { ...row, Gross: gross };
            }
            return row;
        });
        setFormData(newFormData);
    }

    // const handleQuantity = async (event, rowIndex) => {
    //     const typedValue = event.target.value;
    //     console.log(typedValue, "typedValue-------------------------", formData[rowIndex].fQty);

    //     try {
    //         const response = await GetSalesBal_Qty({
    //             iProduct: formData[rowIndex].iProduct,
    //             // iTransId: iTransId,
    //             iTransId: trnsId,
    //         });
    //         const data = JSON.parse(response?.data.ResultData).Table;
    //         // const fQty = data.map((item) => item.fQty).join();
    //         const fQty = data.map((item) => item.fQty).reduce((acc, val) => acc + Number(val), 0); // Summing up all fQty values

    //         console.log(fQty, data, "fQty===========================================");
    //         const Batchs = formData[rowIndex].batch

    //         if (Batchs && Batchs.length > 0) {
    //             const fQtys = Batchs.map((item) => item.fQty);
    //             const sum = fQtys.reduce((total, currentValue) => total + currentValue, 0);
    //             setAvailqty(Number(sum))

    //             if (fQty === 0) {
    //                 Swal.fire({
    //                     icon: 'warning',
    //                     title: 'Warning',
    //                     text: 'No Balance Qty',
    //                 });
    //             }
    //             if (Number(typedValue) <= Number(sum)) {
    //                 setFormData(formData.map((row, index) => {
    //                     if (index === rowIndex) {
    //                         return { ...row, fQty: typedValue };
    //                     }
    //                     return row;
    //                 }));
    //             } else {
    //                 Swal.fire({
    //                     icon: 'warning',
    //                     title: 'Warning',
    //                     text: `Should be less than total balance Qty ${sum}`,
    //                 });
    //             }
    //         } else if (fQty === 0) {
    //             Swal.fire({
    //                 icon: 'warning',
    //                 title: 'Warning',
    //                 text: 'No Balance Qty',
    //             });
    //         } else if (Number(typedValue) <= Number(fQty)) {


    //                 setFormData(formData.map((row, index) => {
    //                     if (index === rowIndex) {
    //                         return { ...row, fQty: typedValue };
    //                     }
    //                     return row;
    //                 }));
    //             } else {
    //                 Swal.fire({
    //                     icon: 'warning',
    //                     title: 'Warning',
    //                     text: `Should be less than balance Qty ${fQty}`,
    //                 });
    //             }
    //     } catch (error) {
    //         console.log("GetSalesBal_Qty", error);
    //     }
    // };


    const handleQuantity = async (event, rowIndex) => {
        const typedValue = event.target.value;
        const iProduct = formData[rowIndex].iProduct;

        // Check if the product already exists in nonbatchableProduct
        const existingProduct = nonbatchableProduct.find(item => item.iProduct === iProduct);

        if (existingProduct) {
            // Use the existing fQty value
            const fQty = existingProduct.freeQty;

            // Rest of the logic remains the same
            updateFormData(fQty, typedValue, rowIndex,iProduct);
        } else {
            try {
                const response = await GetSalesBal_Qty({
                    iProduct: iProduct,
                    iTransId: trnsId,
                });
                const data = JSON.parse(response?.data.ResultData).Table;
                const fQty = data.map((item) => item.fQty).reduce((acc, val) => acc + Number(val), 0);

                // Store the fQty value in nonbatchableProduct
                setNonbatchableProduct(prevState => [
                    ...prevState,
                    { iProduct: iProduct, fQty: fQty ,reqQty:0,freeQty :fQty,}
                ]);

                // Rest of the logic remains the same
                updateFormData(fQty, typedValue, rowIndex,iProduct);
            } catch (error) {
                console.log("GetSalesBal_Qty", error);
            }
        }
    };

    const updateFormData = (fQty, typedValue, rowIndex,iProduct) => {
        const Batchs = formData[rowIndex].batch;

        if (Batchs && Batchs.length > 0) {
            const fQtys = Batchs.map((item) => item.fQty);
            const sum = fQtys.reduce((total, currentValue) => total + currentValue, 0);
            setAvailqty(Number(sum));

            if (fQty === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'No Balance Qty',
                });
            }
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
        } else if (fQty === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'No Balance Qty',
            });
        } else if (Number(typedValue) <= Number(fQty)) {

            // Update the fQty for the existing iProduct
            setNonbatchableProduct(prevState => prevState.map(item => 
                item.iProduct === iProduct 
                ? { ...item, reqQty:typedValue,freeQty :item.fQty -typedValue} 
                : item
            ));


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
    };


    const handleFreeQuantity = (event, rowIndex) => {
        const typedValue = event.target.value;
        const iProduct = formData[rowIndex].iProduct;

        // Check if the product already exists in nonbatchableProduct
        const existingProduct = nonbatchableProduct.find(item => item.iProduct === iProduct);
        let freeQty        //     const fQty = existingProduct.fQty;


        if (existingProduct) {
            // Use the existing fQty value
            freeQty = existingProduct.fQty-existingProduct.reqQty;
        } 


        if (Number(typedValue) <= Number(formData[rowIndex].fQty)) {

            const checkValue = Number(typedValue) + Number(formData[rowIndex]?.fQty || 0);
            console.log( Number(typedValue),Number(formData[rowIndex]?.fQty), freeQty,"formData[rowIndex");

            if (Number(typedValue) <= freeQty) {

                  // Update the fQty for the existing iProduct
            setNonbatchableProduct(prevState => prevState.map(item => 
                item.iProduct === iProduct 
                ? { ...item, freeQty: freeQty - typedValue ,} 
                : item
            ));

                const newFormData = formData.map((row, index) => {
                    if (index === rowIndex) {
                        return { ...row, fFreeQty: typedValue };
                    }
                    return row;
                });


                // Calculate the new total quantity
                const newTotal = newFormData.reduce((total, row, index) => {
                    const rowQty = Number(row.fQty) || 0;
                    const rowFreeQty = Number(row.fFreeQty) || 0;
                    return total + rowQty + rowFreeQty;
                }, 0);


                const updatedFormData = newFormData.map((row, index) => {
                    if (index === rowIndex) {
                        return { ...row, fTotalQty: newTotal };
                    }
                    return row;
                });

                setFormData(updatedFormData);
            }
            else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: `Should be less than Qty ${availqty}`,
                });
            }

        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: `Should be less than Qty ${formData[rowIndex].fQty}`,
            });
        }


    };


    //Handle Rate--------------------------------------------------------------------------------------------------------------------------
    const handleRate = async (event, rowIndex) => {
        const typedValue = event.target.value;

        var grs = formData[rowIndex].fQty * typedValue;
        setGross(grs)
        setFormData(formData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, fRate: typedValue, Gross: grs };
            }
            return row;
        }));
    }
    //HANDLE DISC%------------------------------------------------------------------------------------------------------------
    const handlefDiscPerc = async (event, rowIndex) => {
        const typedValue = event.target.value;
        setFormData(formData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, fDiscPerc: typedValue };
            }
            return row;
        }));

    }
    // fDiscAmt handlefDiscAmt-------------------------------------------------
    const handlefDiscAmt = async (event, rowIndex) => {
        const typedValue = event.target.value;
        setFormData(formData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, fDiscAmt: typedValue };
            }
            return row;
        }));

    }
    //handlefAddCharges-----------------------------------------------------------------
    const handlefAddCharges = async (event, rowIndex) => {
        const typedValue = event.target.value;
        var vatPercentage = Number(formData[rowIndex].fVatPer) || 0;
        var exVatPercentage = Number(formData[rowIndex].fExciseTaxPer) || 0;

        var Gross1 = Number(formData[rowIndex].Gross) || 0;
        var discountPercentage = Number(formData[rowIndex].fDiscPerc) || 0;


        var calculatedDiscountAmount = Gross1 * (discountPercentage / 100);
        var fDiscAmt = Number(formData[rowIndex].fDiscAmt) || 0;
        var calculatedDiscountAmount = Number(calculatedDiscountAmount) || 0;
        setDiscountAmount(calculatedDiscountAmount)

        var totalDiscount = fDiscAmt + calculatedDiscountAmount;
        setDiscount(totalDiscount)

        var vat = (Gross1 + fDiscAmt - totalDiscount) * (vatPercentage / 100);
        var net = Gross1 - totalDiscount + fDiscAmt + vat + exVatPercentage;

        // var vat = (formData[rowIndex].Gross + fDiscAmt - totalDiscount)
        // var net = formData[rowIndex].Gross - totalDiscount + fDiscAmt + vat
        setFormData(formData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, fAddCharges: typedValue, fNet: net, fVatPer: vat };
            }
            return row;
        }));


    }
    //handlesRemarks---------------------------------------------------------------------------------
    const handlesRemarks = async (event, rowIndex) => {
        const typedValue = event.target.value;
        setFormData(formData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, sRemarks: typedValue };
            }
            return row;
        }));

    }
    
// TABLE total ALL  value ---------------------------------------------------------------
    const sumFNet = formData.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue.fNet || 0);
    }, 0);

    const sumFQty = formData.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue.fQty);
    }, 0);

    const sumgross = formData.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue.Gross);
    }, 0);

    const sumAddchrg = formData.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue.fAddCharges);
    }, 0);
    const TotExcise = formData.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue.fExciseTaxPer);
    }, 0);
    const TotVat = formData.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue.fVAT);
    }, 0);

    const handleButtonClick = (batch) => {
        setBatch(batch)
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



    const [showData, setShowData] = useState(false);

    const handleButtonlist = () => {
        setShowData(!showData);
    };

    const [isModalOpens, setIsModalOpens] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleAddChargesClick = (field) => {
        console.log(field,"handleAddChargesClick");
        setIsModalOpens(true);
        setSelectedField(field); // Store the field value in state
    };

//     const handleLoadClick = (inputValue) => {
//         console.log(inputValue,selectedField, "------------input");
// if (selectedField=='Add Charges') {
    

// }

//         // const updated = formData.map((item) => {
//         //     console.log(item.Gross, "=");

//         //     let allocatedQty = 0;
//         //     if (remainingQty > item.Gross) {
//         //         Swal.fire({
//         //             icon: 'error',
//         //             title: 'Error',
//         //             text: 'The amount is not applicable to any row.',
//         //         });
//         //     } else
//         //         if (item.Gross <= remainingQty) {
//         //             allocatedQty = item.Gross;
//         //             remainingQty -= item.Gross;
//         //         } else {
//         //             allocatedQty = remainingQty;
//         //             remainingQty = 0;
//         //         }
//         //     console.log(allocatedQty);

//         //     return {
//         //         ...item,
//         //         fAddCharges: allocatedQty,
//         //         //   fQty: item.fQty - allocatedQty
//         //         //   fQty:  allocatedQty

//         //     };
//         // })
//         // console.log(updated, "updated--------------------------");
//         // Perform actions with inputValue
//         setIsModalOpens(false);
//     };

const handleLoadClick = (inputValue) => {
    console.log(inputValue, selectedField, "------------input");

              
//     const itemsGreaterThanInput = formData.filter(item => item.Gross > inputValue).length;

//     console.log(itemsGreaterThanInput,"itemsGreaterThanInput");

//   const updatedFormData1 = formData.map((item) => {
//     const newDivideValue =  inputValue / itemsGreaterThanInput

//     if (newDivideValue > item.Gross) {
//       console.log(newDivideValue,lowestGross,"lowestGross");
//       isValid = false;
//     }    


  
    if (selectedField === 'Add Charges') {
      if (formData.length > 0) {
        const updatedFormData1 = formData.map((item) => {
          const newAddCharges =  inputValue / formData.length
          return {
            ...item,
            fAddCharges: newAddCharges,
          };
        });
        setFormData(updatedFormData1);
      }

    }else if (selectedField === 'Dis Amount' ) {
        if (formData.length > 0) {
            let isValid = true;

            const lowestGross = formData.reduce((min, item) => {
                return item.Gross < min ? item.Gross : min;
              }, Infinity);
              
              

            const updatedFormData1 = formData.map((item) => {
              const newAddCharges =  inputValue / formData.length

              if (newAddCharges > lowestGross) {
                console.log(newAddCharges,lowestGross,"lowestGross");

    
                isValid = false;
              }    
              return {
                ...item,
                fDiscAmt: newAddCharges,
              };
            });
            console.log(newAddCharges,item.Gross,"newAddCharges");

            if (isValid) {
                console.log(updatedFormData1,"updatedFormData");
              setFormData(updatedFormData1);
            } else {
                console.log("updatedFormData--------------------");
    
              Swal.fire({
                title: 'Error!',
                text: 'Added charges value exceeds the Gross value.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          }
    }
  
    setIsModalOpens(false);
  };

    const handleDisAmountClick = (field) => {
        setSelectedField(field); // Store the field value in state
        setIsModalOpens(true);
    };
    const handleCloseModals = () => {
        setIsModalOpens(false);
    };
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
                                <TableCell
                                    key={index}
                                    sx={{ padding: '0px 0px', height: '40px', border: '1px solid rgba(224, 224, 224, 1)', backgroundColor: buttonColor1, color: 'white' }}
                                >
                                    {field.sFieldName === 'Add Charges' ? (
                                        <Button variant="contained" color="primary" onClick={() =>handleAddChargesClick(field.sFieldName)}>
                                            Add Charges
                                        </Button>
                                    ) : field.sFieldName === 'Dis Amount' ? (
                                        <Button variant="contained" color="primary" onClick={() => handleDisAmountClick(field.sFieldName)}>
                                            Dis Amount
                                        </Button>
                                    ) : (
                                        field.sFieldName
                                    )}
                                </TableCell>
                            ))}

                            <Modal open={isModalOpens} onClose={handleCloseModals}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
                                    <TextField
                                        id="input-value"
                                        label="Enter value"
                                        variant="outlined"
                                        value={inputValue}
                                        size='small'
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                    <Button variant="contained" color="primary" onClick={() => handleLoadClick(inputValue)}>
                                        Load
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={handleCloseModals}>
                                        Close
                                    </Button>
                                </div>

                            </Modal>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {rows.map((row, rowIndex) => { */}
                        {formData.map((row, rowIndex) => {
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

                                                        // value={formData[rowIndex].Product || ''}
                                                        value={row.Product || ''}
                                                        onChangeName={(obj) => handleProduct(obj, rowIndex)}
                                                    />
                                                ) : (
                                                    <div style={{ color: 'red' }}>Please select an outlet</div>
                                                )
                                            ) : field.sFieldCaption === "Unit" ? (
                                                <UnitAutocomplete

                                                    // ProductId={formData[rowIndex].iProduct}
                                                    // value={formData[rowIndex].Unit || ''}
                                                    ProductId={row.iProduct}
                                                    value={row.Unit || ''}
                                                    onChangeName={(obj) => handleUnit(obj, rowIndex)}
                                                />
                                            ) : field.sFieldCaption === "Qty" ? (
                                                formData[rowIndex].Product && formData[rowIndex].Unit ? (
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        type="text"

                                                        // value={formData[rowIndex].fQty || ''}
                                                        value={row.fQty || ''}
                                                        onChange={(event) => handleQuantity(event, rowIndex)}
                                                        onBlur={(event) => handleBlur(event, rowIndex)}
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
                                                // formData[rowIndex].batch &&formData[rowIndex].batch.length > 0 ? (
                                                row.batch && row.batch.length > 0 ? (
                                                    <Button onClick={(event) => handleButtonClick(row.batch)}>
                                                        Select Batch
                                                    </Button>
                                                ) : (
                                                    <Typography>NA</Typography>
                                                )
                                            ) : field.sFieldCaption === "Free Qty" ? (
                                                row.Product && row.Unit ? (
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        type="text"
                                                        value={row.fFreeQty || ''}

                                                        // value={formData[rowIndex].fFreeQty || ''}
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
                                                row.batch && row.batch.length > 0 ? (
                                                    <Button onClick={(event) => handleButtonClick(row.batch)}>
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
                                                    value={row.fTotalQty || ''}
                                                    // value={formData[rowIndex].fTotalQty || ''}

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
                                                    variant="outlined"
                                                    size="small"
                                                    type="text"

                                                    // value={formData[rowIndex].fRate || ''}
                                                    value={row.fRate || ''}
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
                                                <MDBInput
                                                    required
                                                    id="form3Example"
                                                    size="small"
                                                    value={row.fExciseTaxPer || ''}
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
                                            ) : field.sFieldCaption === "Gross" ? (
                                                <MDBInput
                                                    required
                                                    id="form3Example"
                                                    size="small"
                                                    value={row.Gross || ''}
                                                    // value={formData[rowIndex].Gross || ''}
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
                                                    value={row.fDiscPerc || ''}
                                                    // value={formData[rowIndex].fDiscPerc || ''}
                                                    onChange={(event) => handlefDiscPerc(event, rowIndex)}

                                                />
                                            ) : field.sFieldCaption === "DisAmount" ? (
                                                <MDBInput
                                                    required
                                                    id="form3Example"
                                                    size="small"
                                                    // value={formData[rowIndex].fDiscAmt || ''}
                                                    value={row.fDiscAmt || ''}
                                                    onChange={(event) => handlefDiscAmt(event, rowIndex)}
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
                                            ) : field.sFieldCaption === "AddCharges" ? (
                                                <MDBInput
                                                    required
                                                    id="form3Example"
                                                    size="small"
                                                    // value={formData[rowIndex].fAddCharges || ''}
                                                    value={row.fAddCharges || ''}
                                                    onChange={(event) => handlefAddCharges(event, rowIndex)}
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
                                                <MDBInput
                                                    required
                                                    id="form3Example"
                                                    size="small"
                                                    value={row.fVatPer || ''}
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
                                            ) : field.sFieldCaption === "Remarks" ? (
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    type="text"

                                                    value={row.sRemarks || ''}
                                                    onChange={(event) => handlesRemarks(event, rowIndex)}

                                                />
                                            ) : field.sFieldCaption === "Net" ? (
                                                <MDBInput
                                                    required
                                                    id="form3Example"
                                                    size="small"
                                                    // value={formData[rowIndex].fNet || ''}
                                                    value={row.fNet || ''}
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
                                            ) : null}
                                            {newOpen && (
                                                <Modals
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
                                                    setBatchData={setBatchData}
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
            <div
                style={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start",
                    margin: "1%",
                }}
            >
                <Button onClick={handleButtonlist}>
                    TO Net: {sumFNet}
                </Button>
                {showData && (
                    <Box
                        sx={{
                            marginLeft: "2%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >

                        <Typography variant="body1" sx={{ marginRight: "16px" }}>
                            Tot Qty: {sumFQty}
                        </Typography>
                        <Typography variant="body1" sx={{ marginRight: "16px" }}>
                            Tot Gross: {sumgross}
                        </Typography>
                        <Typography variant="body1" sx={{ marginRight: "16px" }}>
                            Tot Dis Amount: {DiscountAmount}
                        </Typography>
                        <Typography variant="body1" sx={{ marginRight: "16px" }}>
                            Tot Add Chrge: {sumAddchrg}
                        </Typography>
                        <Typography variant="body1" sx={{ marginRight: "16px" }}>
                            Tot Excise Tax: {TotExcise}
                        </Typography>
                        <Typography variant="body1" sx={{ marginRight: "16px" }}>
                            Tot Vat: {TotVat}
                        </Typography>
                    </Box>
                )}
            </div>
        </div>
    );
};

export default MuiEditableTable;













