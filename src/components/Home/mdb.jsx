import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Appsssss = () => {
  const [batchData, setBatchData] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [product, setProduct] = useState('');
  const [iproduct, setIProduct] = useState('');
  const [iunit, setIUnit] = useState('');
  const [fQty, setFQty] = useState('');
  const [qtyFillFlag, setQtyFillFlag] = useState(true);
  const [updateMode, setUpdateMode] = useState(0);
  const [batchDataLoad, setBatchDataLoad] = useState([]);
  const [error, setError] = useState('');

  const hdnRowIdRef = useRef();
  const tBatchQtyRef = useRef();
  const tBatchBalQtyRef = useRef();
  const tBatchAllocQtyRef = useRef();

  const handleQtyBatchPopup = async (id) => {
    const product = document.getElementById(`ProductSelect${id}`).value;
    const iproduct = document.getElementById(`ProductSelect${id}-id`).value;
    const iunit = document.getElementById(`UnitSelect${id}`).value;

    if (iproduct !== 0 && iunit !== "") {
      setRowId(id);
      hdnRowIdRef.current.value = id;

      let fQty = document.getElementById(`fQty${id}`).value;
      if (fQty === "" || fQty === 0) {
        setError("Please fill quantity");
        setQtyFillFlag(false);
      } else {
        setQtyFillFlag(true);
      }

      if (qtyFillFlag) {
        tBatchQtyRef.current.value = fQty;

        let iTransId = 0;
        if (updateMode === 1) {
          iTransId = document.getElementById("hdn_iTransId").value;
        }

        try {
          const response = await axios.get('/Ducon/GetBatch', {
            params: { api_name: "GetBatch", iProduct: iproduct, iTransId: iTransId }
          });
          setBatchData(response.data.record);
          if (response.data.record.length > 0) {
            buildPopUp(response.data);
          } else {
            setError("Batch is empty");
          }
        } catch (error) {
          setError("Error fetching batch data");
        }
      }
    } else {
      setError("Please fill product, unit, qty");
    }
  };

  const buildPopUp = (data) => {
    const tb_rowID = hdnRowIdRef.current.value;
    const iProduct = document.getElementById(`ProductSelect${tb_rowID}-id`).value;
    const iUnit = document.getElementById(`UnitSelect${tb_rowID}`).value;
    let GfQty = 0;
    let freeQtyExistFlg = 0;
    let enteredBatchQty = 0;
    let batchCreatedFlg = 0;
    let result = 0;

    const bindDataElement = document.getElementById("binddata");
    bindDataElement.innerHTML = "";

    data.record.forEach((batch, index) => {
      const batchdataLoadFilteredProd = batchDataLoad.filter(x => (x.iProduct === iProduct) && (x.iUnit === iUnit) && (x.iBatch === batch.batchNo));

      if (batchdataLoadFilteredProd.length > 0) {
        GfQty = batchdataLoadFilteredProd.reduce((acc, curr) => acc + parseFloat(curr.fQty), 0);
        result = parseFloat(batch.qty) - GfQty;

        const batchdataLoadEditMode = batchdataLoadFilteredProd.filter(x => (x.iRow === tb_rowID));
        if (batchdataLoadEditMode.length > 0) {
          freeQtyExistFlg = 1;
          batchCreatedFlg = 1;
          result = (parseFloat(batch.qty) - GfQty) + parseFloat(batchdataLoadEditMode[0].fQty);
          enteredBatchQty = parseFloat(batchdataLoadEditMode[0].fQty);
        }

        if (freeQtyExistFlg === 1) {
          createBatch(data, index, result, enteredBatchQty);
        } else {
          createBatch(data, index, result, 0);
        }
      } else {
        createBatch(data, index, parseFloat(batch.qty), 0);
      }
    });

    const tableLen = document.getElementById("binddata").rows.length;
    if (tableLen > 0) {
      document.getElementById("GetMasterListfQtyBatch").style.display = 'block';
    } else {
      document.getElementById("GetMasterListfQtyBatch").style.display = 'none';
      setError("Batch is empty");
    }
  };

  const createBatch = (data, id, batchBalQty, allocatedQty) => {
    let expiry = 0;
    if (allocatedQty === 0) allocatedQty = "";

    if (parseFloat(batchBalQty) > 0) {
      if (data.record[id].expiry === "00-00-1950") {
        expiry = "";
      } else {
        expiry = data.record[id].expiry;
      }

      const newBatchRow = (
        <tr id={id}>
          <td id={`tdsBatch${id}`}>{data.record[id].batchNo}</td>
          <td id={`tdexpDate${id}`}>{expiry}</td>
          <td id={`tdBalQty${id}`}>{batchBalQty}</td>
          <td>
            <input type="text" className="form-control" id={`t_ReqQty${id}`} value={allocatedQty} autoFocus autoComplete="off" onBlur={() => availableQtyCheck(id)} />
          </td>
        </tr>
      );

      document.getElementById("binddata").appendChild(newBatchRow);

      if (batchCreatedFlg === 1) {
        calcValues_PopUpBatch_Batch();
      }
    }
  };

  const clearBatch = (tb_rowID, check) => {
    let batchdataLoadFiltered = batchDataLoad.filter(x => (x.iRow === tb_rowID));

    if (batchdataLoadFiltered.length > 0) {
      setBatchDataLoad(prevState => prevState.filter(x => (x.iRow !== tb_rowID)));
    }

    if (check === 1) {
      document.getElementById(`UnitSelect${tb_rowID}`).value = "";
      document.getElementById(`fQty${tb_rowID}`).value = "";
      document.getElementById(`t_fQtyBatch${tb_rowID}`).value = "";
    }
  };

  const calcValues_PopUpBatch = () => {
    let totalAllQty = 0;
    const totalQty = parseFloat(tBatchQtyRef.current.value);

    if (batchData.length > 0) {
      totalAllQty = batchData.reduce((acc, curr, index) => {
        if (parseFloat(document.getElementById(`t_ReqQty${index}`).value) > 0) {
          return acc + parseFloat(document.getElementById(`t_ReqQty${index}`).value);
        }
        return acc;
      }, 0);

      if (totalQty >= totalAllQty) {
        tBatchBalQtyRef.current.value = totalQty - totalAllQty;
        tBatchAllocQtyRef.current.value = totalAllQty;
        return true;
      } else {
        return false;
      }
    }
  };

  const calcValues_PopUpBatch_Batch = () => {
    let totalAllQty = 0;
    const totalQty = parseFloat(tBatchQtyRef.current.value);

    if (batchData.length > 0) {
      totalAllQty = batchData.reduce((acc, curr, index) => {
        if (parseFloat(document.getElementById(`t_ReqQty${index}`).value) > 0) {
          return acc + parseFloat(document.getElementById(`t_ReqQty${index}`).value);
        }
        return acc;
      }, 0);

      if (totalQty >= totalAllQty) {
        tBatchBalQtyRef.current.value = totalQty - totalAllQty;
      } else {
        tBatchBalQtyRef.current.value = totalAllQty - totalQty;
      }
      tBatchAllocQtyRef.current.value = totalAllQty;
    }
  };

  const availableQtyCheck = (index) => {
    let flag = true;
    let tot_ReqQty = 0;
    const tQty = parseFloat(tBatchQtyRef.current.value);
    const rQty = document.getElementById(`t_ReqQty${index}`).value;
    const rbalQty = parseFloat(document.getElementById(`tdBalQty${index}`).textContent);

    if (!(tQty > 0)) {
      document.getElementById(`t_ReqQty${index}`).value = "";
      tBatchQtyRef.current.value = 0;
      flag = false;
      setError("Enter Total Quantity..!!");
    } else if (rQty > rbalQty) {
      document.getElementById(`t_ReqQty${index}`).value = "";
      flag = false;
      setError("Quantity Not Available..!!");
    }

    if (!calcValues_PopUpBatch()) {
      document.getElementById(`t_ReqQty${index}`).value = "";
      const expiry = batchData[index].expiry === "00-00-1950" ? "" : batchData[index].expiry;
      setError(`Batch ${batchData[index].batchNo} of date ${expiry} allocated quantity is greater than total..!!`);
    }
  };

  const handleLoadPopup = () => {
    const tb_rowID = hdnRowIdRef.current.value;

    if (parseFloat(tBatchBalQtyRef.current.value) === 0) {
      document.getElementById(`fQty${tb_rowID}`).value = tBatchQtyRef.current.value;

      if (batchData.length > 0) {
        const iproduct = document.getElementById(`ProductSelect${tb_rowID}-id`).value;
        const iunit = document.getElementById(`UnitSelect${tb_rowID}`).value;

        setBatchDataLoad([]);
        dynamicArrayfQty(batchData);
      }
    } else {
      setError("Balance Quantity should be Zero..!!");
    }
  };

  const dynamicArrayfQty = (_batchdata) => {
    const tb_rowID = hdnRowIdRef.current.value;
    const iProduct = document.getElementById(`ProductSelect${tb_rowID}-id`).value;
    const iUnit = document.getElementById(`UnitSelect${tb_rowID}`).value;

    clearBatch(tb_rowID, 2);

    _batchdata.forEach((batch, index) => {
      if (parseFloat(document.getElementById(`t_ReqQty${index}`).value) > 0) {
        const v = {
          iRow: tb_rowID,
          iProduct,
          iUnit,
          iBatch: batch.batchNo,
          sBatch: `Batch${index + 1}`,
          fQty: document.getElementById(`t_ReqQty${index}`).value
        };
        setBatchDataLoad(prevState => [...prevState, v]);
      }
    });

    const batchdataLoadFiltered = batchDataLoad.filter(x => (x.iRow === tb_rowID) && (x.iProduct === iProduct));
    if (batchdataLoadFiltered.length > 0) {
      let sBatch = batchdataLoadFiltered.map(x => x.iBatch).join(',');
      document.getElementById(`t_fQtyBatch${tb_rowID}`).value = sBatch;
      document.getElementById("GetMasterListfQtyBatch").style.display = 'none';
    }
  };

  const handleClosePopup = () => {
    document.getElementById("GetMasterListfQtyBatch").style.display = 'none';
  };

  const handleLoadFIFO = () => {
    if (batchData.length > 0) {
      let flag = 0;
      let totalQty = parseFloat(tBatchQtyRef.current.value);
      let _fQty = 0;

      batchData.forEach((batch, index) => {
        if (parseFloat(document.getElementById(`tdBalQty${index}`).textContent) > 0) {
          if (totalQty > 0) {
            _fQty = parseFloat(document.getElementById(`tdBalQty${index}`).textContent);
            if (_fQty < totalQty) {
              document.getElementById(`t_ReqQty${index}`).value = _fQty;
              flag = 1;
              totalQty -= _fQty;
            } else {
              document.getElementById(`t_ReqQty${index}`).value = totalQty;
              totalQty = 0;
            }
          } else {
            document.getElementById(`t_ReqQty${index}`).value = "";
          }
        }
      });
      calcValues_PopUpBatch();
    }
  };

  return (
    <div>
      <button id="btnLoadPopup" onClick={handleLoadPopup}>Load Popup</button>
      <div id="binddata"></div>
      <div id="GetMasterListfQtyBatch" style={{ display: 'none' }}>
        <input ref={tBatchQtyRef} type="text" id="tBatchQty" />
        <input ref={tBatchBalQtyRef} type="text" id="tBatchBalQty" />
        <input ref={tBatchAllocQtyRef} type="text" id="tBatchAlloc_Qty" />
      </div>
      <button id="btnClosePopup" onClick={handleClosePopup}>Close Popup</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Appsssss;
