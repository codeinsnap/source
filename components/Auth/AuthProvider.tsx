import { useMsal } from '@azure/msal-react';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  accessToken: string;
  userRole: string[];
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

//@ts-ignore
export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [userRole, setUserRole] = useState<string[]>([]);

  const { accounts, instance } = useMsal();
  async function RequestAccessToken() {
    const request = {
      scopes: ['User.Read'],
      account: accounts[0],
    };
    //Using acquireTokenPopup
    // await instance.acquireTokenPopup(request).then((response:any) => {
    //   setAccessToken(response.accessToken);
    // })
    //   .catch((_e:any) => {
    //     console.log(_e)
    //   });

    await instance.loginRedirect(request).then((response: any) => {
      console.log('response')
    })
      .catch((_e: any) => {
        console.log('error')
      });
  }

  useEffect(() => {
    console.log('useEffectAuth')
    RequestAccessToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* {accessToken && ( */}
        {/* <AuthContext.Provider value={{ accessToken, userRole }}> */}
          {children}
        {/* </AuthContext.Provider> */}
      {/* )} */}
      {/* {!accessToken && <></>} */}
    </>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}