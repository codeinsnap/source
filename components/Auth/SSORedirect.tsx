import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';

const SSORedirect = () => {
  const { instance } = useMsal();

  useEffect(() => {
    const fetchData = async () => {
      await instance.loginRedirect();
    };

    fetchData().catch((e) => {
      console.error(e);
    });
  }, [instance]);

  return <div></div>;
};

export default SSORedirect;