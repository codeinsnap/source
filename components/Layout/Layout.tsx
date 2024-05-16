import React, { useEffect, useState } from 'react'
import TopBar from './TopBar/TopBar'
import DashboardNavigation from './DashboardNavigation';
import DashboardHeader from './DashboardHeader';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { CONSTANTS } from '@/constants/constants';
import toast from 'react-hot-toast';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import Spinner from '../Shared/Spinner/Spinner';
import { landingStyle } from '../LandingPage/landing_tailwind';
import { displayLoader, setLastActivityTime } from '@/store/actions/commonAction';
import jwtDecode from 'jwt-decode';
import { checkRole, logoutAction } from '@/store/actions/authenticationAction';
import { resetAction } from '@/store/actions/rootAction';

export default function Layout({ children }: any) {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const profileData = useSelector((state: any) => state.profileState.profileData);
  const teamMemberRoutes = useSelector((state: any) => state.config.teamMemberRoutes);
  const managerRoutes = useSelector((state: any) => state.config.managerRoutes);
  const userRole = useSelector((state: any) => state.authenticationState.userRole);
  const lastActivityTime = useSelector((state: any) => state.commonState.lastActivityTime);

  const [routes, setRoutes] = useState<any>([]);
  const [renderEle, setRenderEle] = useState('');
  const [sectionHeader, setSectionHeader] = useState('');

  // fetch refreshIDToken to renew session
  const refreshIDToken = () => {
    const request = {
      scopes: ['User.Read'],
      account: accounts[0],
      forceRefresh: true
    }
    instance?.acquireTokenSilent(request).then((response: any) => {
      sessionStorage.setItem('tlslo_idToken', response?.idToken)
    }).catch((err: any) => {
      console.log(err)
    })
  }

  const sessionExpiryLogout = async () => {
    if (sessionStorage.getItem('tlslo_idToken')) {
      let token: any = sessionStorage.getItem('tlslo_idToken')
      const { exp }: any = jwtDecode(token);
      const expirationTime = (exp * 1000);
      if (Date.now() >= expirationTime) {
        await instance.logoutRedirect().then((response: any) => {
          dispatch(displayLoader(false))
          dispatch(logoutAction(userRole?.location)); //logout api call
          localStorage.clear();
          sessionStorage.clear();
          dispatch(resetAction())
        })
          .catch((_e: any) => {
            dispatch(displayLoader(false))
          });
      }
    }
  };

  useEffect(() => {
    if (userRole?.persona === 'team_member') {
      setRoutes(teamMemberRoutes);
      setRenderEle('showCancel');

      (isAuthenticated && profileData && profileData?.username) &&
        toast.success(`${CONSTANTS.WELCOME} ${profileData?.username.slice(0, 2).toUpperCase()}`, {
          position: 'top-right',
          duration: 5000,
          style: {
            width: '12em',
            borderRadius: '4px',
            backgroundColor: 'white',
            color: 'black',
            fontWeight: '600',
            marginTop: '1.6em',
          }
        })
    }
    else if (userRole?.persona === 'manager') {
      setRoutes(managerRoutes);
      setRenderEle('showFilter');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, profileData]);

  // This useEffect is only to set headers
  useEffect(() => {
    if (userRole?.persona === 'team_member') {
      if (userRole?.location === 'LB') {
        setSectionHeader(`${profileData?.shop || CONSTANTS.LOADING} - ${profileData?.shop_name || CONSTANTS.LOADING} | `);
      } else if (userRole?.location === 'PR') {
        setSectionHeader(`${profileData?.shop || CONSTANTS.LOADING} - ${profileData?.shop_name || CONSTANTS.LOADING} | `);
      }
    } else if (userRole?.persona === 'manager') {
      if (userRole?.location === 'LB') {
        setSectionHeader(`${managerRoutes.filter((item: any) => item.isActive)[0]?.label} (Long Beach)`);
      } else if (userRole?.location === 'PR') {
        setSectionHeader(`${managerRoutes.filter((item: any) => item.isActive)[0]?.label} (Princeton)`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, profileData, teamMemberRoutes, managerRoutes]);

  useEffect(() => {
    if (isAuthenticated && router.pathname === '/') {
      router.push('/Dashboard')
    } else if (isAuthenticated && router.pathname !== '/') {
      if (profileData?.persona === 'team_member') {
        window.history.pushState(null, '', '/TeamMember');
      } else if (profileData?.persona === 'manager') {
        window.history.pushState(null, '', managerRoutes.filter((item: any) => item.isActive)[0].path);
      }
      window.onpopstate = function (event) {
        history.go(1);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, isAuthenticated]);

  // first time login to fetch ID Token from AD
  useEffect(() => {
    const request = {
      scopes: ['User.Read'],
      account: accounts[0]
    };
    if (isAuthenticated) {
      instance?.acquireTokenSilent(request).then((response: any) => {
        sessionStorage.setItem("tlslo_idToken", response?.idToken);
        dispatch(checkRole())
      })
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (lastActivityTime && sessionStorage.getItem('tlslo_idToken')) {
      let token: any = sessionStorage.getItem('tlslo_idToken')
      const { exp }: any = jwtDecode(token);
      const expirationTime = (exp * 1000);
      if (lastActivityTime < expirationTime) {
        refreshIDToken();
      }
    }
  }, [lastActivityTime])

  useEffect(() => {
    const timerID = setInterval(() => sessionExpiryLogout(), 60000);
    return () => {
      clearInterval(timerID);
    };
  }, [])

  return (
    <div className={(!isAuthenticated && router.pathname !== '/Dashboard') ? 'min-h-screen  bg-gray-100 content_bg font-toyota' : ''}>
      {/* fixed topbar */}
      <TopBar />
      <Spinner />
      {!isAuthenticated && router.pathname !== '/Dashboard' && (
        <div className='w-[40%] my-52 mx-auto flex flex-col drop-shadow-xl p-16 rounded bg-white cursor-pointer' onClick={() => instance.loginRedirect()}>
          <div className='text-2xl'>Welcome to Logistics Orchestration | TLS</div><br />
          <div className='w-20 mt-4 focus:outline-none text-white text-sm bg-blue-600 hover:bg-blue-700 rounded py-2 pl-5'>Login</div>
        </div>
      )}
      {/* fixed navigation & header */}
      {isAuthenticated && (
        <>
          {router.pathname !== '/' && router.pathname !== '/Dashboard' && (routes.length !== 0) && (
            <>
              <DashboardNavigation />
              <DashboardHeader sectionHeader={sectionHeader} stall={profileData?.stall} renderEle={renderEle} showToggle />
            </>
          )}
          {children}
        </>
      )}
    </div>
  )
}