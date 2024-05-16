import React, { useState, useEffect } from 'react';
import { landingStyle } from './landing_tailwind';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { CONSTANTS } from '@/constants/constants';
import toast from 'react-hot-toast';
import { fetchProfileDetailsAction } from '@/store/actions/profileAction';
import DashboardHeader from '../Layout/DashboardHeader';
import { checkRole } from '@/store/actions/authenticationAction';
import moment from 'moment';
import { displayLoader } from '@/store/actions/commonAction';
import { fetchSiteMeticAction } from '@/store/actions/siteMetricAction';


function LandingPage() {
    const router = useRouter();
    const dispatch: any = useDispatch();

    const { accounts } = useMsal();

    const userRole = useSelector((state: any) => state.authenticationState.userRole);
    const userRoleMessage = useSelector((state: any) => state.authenticationState.message);
    const filterEle = useSelector((state: any) => state.siteMetricState.unitEle);
    const filterElePTManager = useSelector((state: any) => state.siteMetricState.unitElePrincetonManager);

    const handleRouting = (url: string, persona: string, location: string) => {
        router.push(url);
        if (userRole?.persona === 'team_member') {
            //load profile data -- call DASHBOARD API
            dispatch(displayLoader(true))
            if (userRole?.location === 'LB') {
                dispatch(fetchProfileDetailsAction(persona, location, "", moment.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss'), []));
            } else if (userRole?.location === 'PR') {
                dispatch(fetchProfileDetailsAction(persona, location, "", moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), []));
            }
        }
        else if (userRole?.persona === 'manager') {
            dispatch(displayLoader(true));
            if (userRole?.location === 'LB') {
                let selectedFilterValue = filterEle && filterEle?.filter((item: any) => item.isActive)[0].name;
                // LB - (PST)
                if (selectedFilterValue === 'today') {
                    dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/Los_Angeles').format('YYYY-MM-DD'), moment.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss'), ''))
                }
                else if (selectedFilterValue === 'yesterday') {
                    dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/Los_Angeles').subtract(1, "day").format('YYYY-MM-DD'), moment.tz('America/Los_Angeles').startOf('day').subtract('minute', 1).format('YYYY-MM-DDTHH:mm:ss'), ''))
                }
            }
            else if (userRole?.location === 'PR') {

                let selectedFilterValue = filterElePTManager && filterElePTManager?.filter((item: any) => item.isActive)[0].value;
                // Princeton - New_York (CST)
                if (selectedFilterValue === '1') {
                    dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/New_York').format('YYYY-MM-DD'), moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), selectedFilterValue))
                }
                else if (selectedFilterValue === '2') {
                    dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/New_York').format('YYYY-MM-DD'), moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), selectedFilterValue))
                }
                else if (selectedFilterValue === 'today') {
                    dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/New_York').format('YYYY-MM-DD'), moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), ''))
                }
                else if (selectedFilterValue === 'yesterday') {
                    // if (moment(moment.tz('America/New_York')).day() === 1) {
                    //     dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/New_York').subtract(3, "day").format('YYYY-MM-DD'), moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss'), ''))
                    // } else {
                    dispatch(fetchSiteMeticAction(userRole?.location, moment.tz('America/New_York').subtract(1, "day").format('YYYY-MM-DD'), moment.tz('America/New_York').subtract(1, "day").format('YYYY-MM-DDTHH:mm:ss'), ''))
                    // }
                }
            }
        }
    }

    const lb_manager_tiles = [
        {
            id: 'lb_site_metrics',
            label: 'Site Metrics',
            url: '/Manager',
            location: 'LB',
            persona: 'manager'
        },
        {
            id: 'lb_production_line_metrics',
            label: 'Production Line Metrics',
            url: '/Manager/ProductionLineMetrics',
            location: 'LB',
            persona: 'manager'
        },
        {
            id: 'lb_vptb',
            label: 'Vehicle Progress Tracking Board',
            url: '/Manager/VPTB',
            location: 'LB',
            persona: 'manager'
        },
    ];

    const pr_manager_tiles = [
        {
            id: 'pr_site_metrics',
            label: 'Site Metrics',
            url: '/Manager',
            location: 'PR',
            persona: 'manager'
        },
        {
            id: 'pr_production_line_metrics',
            label: 'Production Line Metrics',
            url: '/Manager/ProductionLineMetrics',
            location: 'PR',
            persona: 'manager'
        },
        {
            id: 'pr_vptb',
            label: 'Vehicle Progress Tracking Board',
            url: '/Manager/VPTB',
            location: 'PR',
            persona: 'manager'
        },
    ];

    useEffect(() => {
        if (sessionStorage.getItem('tlslo_idToken')) {
            dispatch(checkRole())
       }
    }, [])

    return (
        <>
            <DashboardHeader sectionHeader={CONSTANTS.SITEHOME} />
            {userRole === 'error' && (
                <div className={landingStyle.userRoleStatus}>
                    <p>{userRoleMessage}</p>
                </div>
            )}
            {userRole?.status === 'N' && (
                <div className={landingStyle.userRoleStatus}>
                    <p>{`${accounts[0]?.username} is inactive.`}</p><br />
                    <p>Kindly contact your supervisor.</p>
                </div>
            )}
            {userRole?.status === 'Y' && (
                <div className='m-8'>
                    {userRole?.persona === 'team_member' && (
                        <>
                            {/* Team Member Heading */}
                            <div className={landingStyle.teamMemberHeading}>Team Member</div>
                            <div className={landingStyle.navWrapper}>
                                {userRole?.persona === 'team_member' && (
                                    <div
                                        className={landingStyle.navLink}
                                        onClick={() => handleRouting(userRole?.url, userRole?.persona, userRole?.location)}
                                    >
                                        <div className={landingStyle.label}>{userRole?.label}</div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {
                        userRole?.persona === 'manager' && (
                            <>
                                {/*  Manager Heading */}
                                <div className={landingStyle.managerHeading}>Manager</div>
                                {/* Manager Long beach Tiles  */}
                                <div className={landingStyle.managerLocationHeading}>{userRole?.location === 'LB' ? CONSTANTS.LONGBEACH : CONSTANTS.PRINCETON}</div>
                                <div className={landingStyle.navWrapper}>
                                    {userRole?.persona === 'manager' && userRole?.location === 'LB' && (
                                        lb_manager_tiles.map((item: any) => {
                                            return (
                                                <div
                                                    key={item.id} className={landingStyle.navLink}
                                                    onClick={() => handleRouting(item.url, item.persona, item.location)}
                                                >
                                                    <div className={landingStyle.label}>{item.label}</div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                                {/* Manager Princeton Tiles */}
                                <div className={landingStyle.navWrapper}>
                                    {userRole?.persona === 'manager' && userRole?.location === 'PR' && (
                                        pr_manager_tiles.map((item: any) => {
                                            return (
                                                <div
                                                    key={item.id} className={landingStyle.navLink}
                                                    onClick={() => handleRouting(item.url, item.persona, item.location)}
                                                >
                                                    <div className={landingStyle.label}>{item.label}</div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </>
                        )
                    }
                </div>
            )}

        </>

    )
}

export default LandingPage