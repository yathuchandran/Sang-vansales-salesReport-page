import axios, { Axios } from "axios"
import { baseUrlWEB } from "../config";


const api = axios.create({
    baseURL: baseUrlWEB,
    headers: {
      "Content-Type": "application/json",
    },
  });

  
export const getLogin=async(payload)=>{
    try {
        const response = await api.get("UserLogin", {
          params: payload,
        });
        return response;
    } catch (error) {
        console.log( "login api",error);
        throw error;
    }
}


export const GetMenuData= async(payload)=>{
  try {
    const response = await api.get("GetMenu", {
      params: payload,
    });
    return response;
  } catch (error) {
    console.error("GetMenu", error);
    throw error;
  }}



export const GetAllTransactionSummarys= async(payload)=>{
try {
  const response = await api.get("GetAllTransactionSummary", {
    params: payload,
  });
  return response;
} catch (error) {
  console.error("GetAllTransactionSummarys", error);
}
}

export const GetNextDocNo= async(payload)=>{
  try {
    const response = await api.get("GetNextDocNo", {
      params: payload,
    });
    return response;
  } catch (error) {
    console.error("GetNextDocNo", error);
  }
  }

  
export const GetWarehouse= async(payload)=>{
  try {
    const response = await api.get("GetWarehouse", {
      params: payload,
    });
    return response;
  } catch (error) {
    console.error("GetWarehouse", error);
  }
  }

    
export const GetDriver= async(payload)=>{
  try {
    const response = await api.get("GetDriver", {
      params: payload,
    });
    return response;
  } catch (error) {
    console.error("GetDriver", error);
  }
  }
    
  export const GetOutlet= async(payload)=>{
    try {
      const response = await api.get("GetOutlet", {
        params: payload,
      });
      return response;
    } catch (error) {
      console.error("GetOutlet", error);
    }
    }
    
    
  export const GetPrev_NextDocNo= async(payload)=>{
    try {
      const response = await api.get("GetPrev_NextDocNo", {
        params: payload,
      });
      return response;
    } catch (error) {
      console.error("GetPrev_NextDocNo", error);
    }
    }



      
  export const GetProduct= async(payload)=>{
    try {
      const response = await api.get("GetProduct", {
        params: payload,
      });
      return response;
    } catch (error) {
      console.error("GetProduct", error);
    }
    }


      
    export const GetUnit= async(payload)=>{
      try {
        const response = await api.get("GetUnit", {
          params: payload,
        });
        return response;
      } catch (error) {
        console.error("GetUnit", error);
      }
      }
  
     
      export const GetSalesBal_Qty= async(payload)=>{
        try {
          const response = await api.get("GetSalesBal_Qty", {
            params: payload,
          });
          return response;
        } catch (error) {
          console.error("GetSalesBal_Qty", error);
        }
        }

        
     
      export const GetSalesBatch= async(payload)=>{
        try {
          const response = await api.get("GetSalesBatch", {
            params: payload,
          });
          return response;
        } catch (error) {
          console.error("GetSalesBatch", error);
        }
        }

        export const GetSalesDetails= async(payload)=>{
          try {
            const response = await api.get("GetSalesDetails", {
              params: payload,
            });
            return response;
          } catch (error) {
            console.error("GetSalesDetails", error);
          }
          }
    
//POST METHORD LIKE THIS----------------------------------------------------------------------------------------------------------------------------
export const DeleteAllTransactions= async(payload)=>{
try {
  const response = await api.post("DeleteAllTransactions",payload);
  return response;
} catch (error) {
  console.error("DeleteAllTransactions", error);
}
}

export const SuspendAllTransactions= async(payload)=>{
try {
  const response = await api.post("SuspendAllTransactions", payload);
  return response;
} catch (error) {
  console.error("SuspendAllTransactions", error);
}
}


export const PostSales= async(payload)=>{
  try {
    const response = await api.post("PostSales", payload);
    return response;
  } catch (error) {
    console.error("PostSales", error);
  }
  }












  //----------------------------------------------------------------
export const GetActions= async(payload)=>{
   return makeAuthorizedRequest("get","Profile/GetActions",payload );
  }

  
export const UpsertProfile= async(data,payload)=>{
  return makeAuthorizedRequest("post",`Profile/UpsertProfile?profileId=${data.profileId}&profileName=${data.profileName}`,payload);

 }

 export const GetProfileDetails= async(payload)=>{
   return makeAuthorizedRequest("get","Profile/GetProfileDetails",payload);
  }

  
 export const DeleteProfile= async(payload)=>{
  return makeAuthorizedRequest("delete","Profile/DeleteProfile",payload);
 }



///ROLE API HERE----------------------------------------------------------------------------------------------------------------------------------------
 
 export const GetRoleSummary= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetRoleSummary",payload);
 }

 
 export const GetProfiles= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetProfiles",payload);
 }

 
 export const GetRoleProfile= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetRoleProfile",payload);
 }
 export const GetRoleDetails= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetRoleDetails",payload);
 }
 
 export const GetRoleActions= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetActions",payload);
 }

 
 export const GetMasters= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetMasters",payload);
 } 
 export const GetMasterData= async(data)=>{
  return makeAuthorizedRequest("get",`Role/GetMasterData?masterId=${data.masterId}&searchCondition=${data.searchCondition}&typeId=${data.typeId}`);
 }

 export const GetEntryRestriction= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetEntryRestriction",payload);
 }

 export const GetTransactionRights= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetTransactionRights",payload);
 }

 export const UpsertRole= async(payload)=>{
  return makeAuthorizedRequest("post","Role/UpsertRole",payload);
 }
 export const DeleteRole= async(payload)=>{
  return makeAuthorizedRequest("get","Role/DeleteRole",payload);
 }
 


//Users------------------------------------------------------------------------------------------
export const GetUserSummary= async(payload)=>{
  return makeAuthorizedRequest("get","Users/GetUserSummary",payload);
 }
 export const GetRoles= async(payload)=>{
  return makeAuthorizedRequest("get","Users/GetRoles",payload);
 }
 export const DeleteUser= async(payload)=>{
  return makeAuthorizedRequest("delete","Users/DeleteUser",payload);
 }

 export const UpsertUser= async(payload)=>{
  return makeAuthorizedRequest("post","Users/UpsertUser",payload);
 }

 export const GetUserDetails= async(payload)=>{
  return makeAuthorizedRequest("get","Users/GetUserDetails",payload);
 }