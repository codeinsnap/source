import React, { useEffect, useState } from "react";
import apps_logo from "../../../../public/images/icons/apps_logo.svg";
import questionMark from "../../../../public/images/icons/questionMark.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { checkRole, logoutAction } from "@/store/actions/authenticationAction";
import { resetAction } from "@/store/actions/rootAction";
import toast from "react-hot-toast";
import { CONSTANTS } from "@/constants/constants";
import { useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Router, useRouter } from "next/router";
import { topBarStyle } from "./topbar_tailwind";
import { displayLoader } from "@/store/actions/commonAction";
import axios from "axios";
import { environment as env } from '@/config/env';
 
export default function TopBar() {
  const [showMenu, setShowMenu] = useState(false);
 
  const [showContactMenu, setShowContactMenu] = useState(false);
  const router = useRouter();
  const dispatch: any = useDispatch();
  const { accounts, instance } = useMsal();
 
  const isAuthenticated = useIsAuthenticated();
  const profileData = useSelector(
    (state: any) => state.profileState.profileData
  );
  const userRole = useSelector(
    (state: any) => state.authenticationState.userRole
  );
 
  const fetchData = async () => {
    await instance
      .logoutRedirect()
      .then((response: any) => {
        console.log("response");
        dispatch(displayLoader(false));
      })
      .catch((_e: any) => {
        console.log("error");
        dispatch(displayLoader(false));
      });
  };
 
  const logout = () => {
    fetchData();
    dispatch(displayLoader(false));
    dispatch(logoutAction(userRole?.location)); //logout api call
    localStorage.clear();
    sessionStorage.clear();
    dispatch(resetAction());
    toast.success(CONSTANTS.LOGOUT_MESSAGE, {
      position: "top-right",
      duration: 4000,
      style: {
        borderRadius: "4px",
        backgroundColor: "white",
        color: "black",
        fontWeight: "600",
      },
    });
  };
 
  const redirectHome = () => {
    if (isAuthenticated) {
      router.push("/Dashboard");
      if (userRole?.persona === "team_member") {
        dispatch(logoutAction(userRole?.location)); //logout api call
        dispatch(displayLoader(false));
      }
      dispatch(checkRole());
    }
    dispatch(resetAction());
  };
 
  const openMenu = (event: any) => {
    event.stopPropagation();
    setShowMenu(!showMenu);
    setShowContactMenu(false)
  };
 
  const openContactMenu = (event: any) => {
    event.stopPropagation();
    setShowContactMenu(!showContactMenu);
    setShowMenu(false);
  };
 
  window.onclick = function() {
    setShowContactMenu(false);
    setShowMenu(false);
  }
  
  const envName = () => {
    if (env.NEXT_PUBLIC_REACT_APP_ENV) {
      return `(${env.NEXT_PUBLIC_REACT_APP_ENV})`;
    }
  };
 
  return (
    <div className={topBarStyle.topBarWrapper}>
      <div className={topBarStyle.topBarLink} onClick={redirectHome}>
        <span className={topBarStyle.topBarHeadingFont}>
          Logistics Orchestration{" "}
        </span>
        | TLS {envName()}
      </div>
      <div className={topBarStyle.logoutWrapper}>
        {/* {isAuthenticated && (
          <div className={topBarStyle.topBarMargin} onClick={logout}>
            <strong className={topBarStyle.topBarLink}>Logout</strong>
          </div>
        )} */}
        <div className={topBarStyle.topBarMargin}>
          <Image src={apps_logo} alt="" />
        </div>
       
        <div className={topBarStyle.topBarMargin} onClick={openContactMenu}>
          <div className={topBarStyle.questionMark}>?</div>
          {/* <Image src={questionMark} alt="" /> */}
        </div>
        {showContactMenu && (
          <div className={topBarStyle.supportWrapper}>
            <div className={topBarStyle.contactUsWrapper}>
              <a href="mailto:TLSLO-Alerts-LB@toyota.com?subject=" className={topBarStyle.contactUs}>
                Contact Us
              </a>
              <span className={topBarStyle.contactUsTooltip}>TLSLO-Alerts-LB@toyota.com</span>
            </div>
          </div>
        )}
 
        {isAuthenticated && (
          <div className={topBarStyle.username}>
            <div className={topBarStyle.usernameMargin} onClick={openMenu}>
              {instance && instance.getAllAccounts()[0]?.name?.slice(0, 2).toUpperCase()}
            </div>
            {showMenu && (
              <div className={topBarStyle.usernameWrapper}>
                <div className={topBarStyle.contactUsWrapper}>
                  <div className={topBarStyle.topBarMargin} onClick={logout}>
                    <strong className={topBarStyle.topBarLink}>Logout</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}