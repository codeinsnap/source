export const jwtConfig = {
    headers: {"Authorization" : `Bearer ${sessionStorage.getItem("tlslo_idToken")}`} 
  };
