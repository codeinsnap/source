import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image';
import { settingsTableLayoutStyle } from "./setting_table_layout-tailwind";
import { useEffect, useState } from "react";
import { deleteEntryAction, updateSettingsTablePayloadAction } from "@/store/actions/siteConfigAction";
import upwardArrow from '../../../../../../../public/images/icons/upwardArrow.svg';
import backwardArrow from '../../../../../../../public/images/icons/backwardArrow.svg';

export const config_table_headers = [
    { id: 'stall_id', label: 'Stall ID' },
    { id: 'prod_line', label: "Production Line", },
    { id: 'line_name', label: "Line Name" },
    { id: 'location', label: "Location" },
    { id: 'status', label: "Status" }
];


export default function SettingsTableLayout(props: any) {
    const [sorting, setSorting] = useState<any>({
        status: {
            ascending: true
        },
        prod_line: {
            ascending: true
        }
    });
    const dispatch: any = useDispatch();
    const userRole = useSelector((state: any) => state.authenticationState.userRole);
    const { dictionary, payload } = useSelector((state: any) => state.siteConfigState);

    const PQAStallBuildingLineOptions: string[] = dictionary.filter((dic: any) => dic.location === 'PQA Stalls').map((item: any) => item.prod_line);
    const PQAConveyorsLineOptions: string[] = dictionary.filter((dic: any) => dic.location === 'PQA Conveyors').map((item: any) => item.prod_line);
    const FQAConveyorsStallLineOptions: string[] = dictionary.filter((dic: any) => dic.location === 'FQA Conveyors & Stalls').map((item: any) => item.prod_line);
    const unassignedOptions: string[] = ["Unassigned"];

       {/* Princeton Manager Production Lines */ }
       const prodLineOptionsPR: string[] = dictionary.map((item: any) => item.prod_line);


    // -------------------- Sorting Logic ----------------------
    const applySorting = (key: any, ascending: any) => {
        setSorting({
            ...sorting,
            [key]: {
                ascending: ascending
            }
        });

        let sortedCurrentUsers = [];

        if (key === 'status') {
            sortedCurrentUsers = props.tableData.sort((a: any, b: any) => {
                return a['status'].localeCompare(b['status']) || a['prod_line'].localeCompare(b['prod_line']);
            })
        } else {
            sortedCurrentUsers = props.tableData.sort((a: any, b: any) => {
                return (a[key].localeCompare(b[key]));
            })
        }
        props.onTableDataChange(ascending ? [...sortedCurrentUsers] : [...sortedCurrentUsers.reverse()])
    }

    const renderSortingArrow = (key: any) => {
        if (sorting[key].ascending) {
            return <Image src={upwardArrow} alt="upward arrow" />
        } else {
            return <Image src={backwardArrow} alt="downward arrow" />
        }
    }
    
    //On the Site Config Table USer has the capability to change prod line using the dropdown in column 2
    const handleProdLineChange = (prod_line: string, stall_id: string) => {
        const index = props.tableData?.findIndex((item: any) => item.stall_id === stall_id);
        let arr: any = props.tableData;
        const filteredDictionary: any = dictionary.filter((item: any) => item.prod_line === prod_line)[0];
        //if you select "Unassigned" option change the "prod_line_name & prod_line_location to "Unassigned" and "status" to "Inactive"
        if (index > -1) {
            if (prod_line === "Unassigned") {
                arr[index].prod_line = prod_line;
                arr[index].line_name = "Unassigned";
                // arr[index].location = (userRole?.location === 'LB' || userRole?.location === 'PR') ? arr[index].location : '';
                arr[index].location = (userRole?.location === 'LB' || userRole?.location === 'PR') ? "Unassigned" : '';
                arr[index].status = "INACTIVE"
            } else {
                arr[index].prod_line = prod_line;
                arr[index].line_name = filteredDictionary?.line_name;
                arr[index].location = (userRole?.location === 'LB') ? filteredDictionary?.location : arr[index].location;
                arr[index].status = "ACTIVE"
            }
        }
        //Set the table Data once the row is identified and its data is modified
        props.onTableDataChange([...arr]);
        //Entry already exists?
        let deleteIndex = payload.findIndex((i: any) => i.stall_id === arr[index].stall_id);
        if (deleteIndex > -1) {
            //delete entry 
            dispatch(deleteEntryAction(deleteIndex));
        }
        //Push this updated Array Item to Payload to redux. this will
        dispatch(updateSettingsTablePayloadAction([...payload, arr[index]]));
    }

    return (
        <table className={settingsTableLayoutStyle.table}>
        <thead className={settingsTableLayoutStyle.thead}>
            <tr>
                {config_table_headers.map((tableHeaders: { id: string; label: string }) => {
                    return (
                        <th
                            key={tableHeaders.id}
                            scope="col"
                            className={settingsTableLayoutStyle.th}
                        >
                            <div
                                className={settingsTableLayoutStyle.sortingArrow}
                                onClick={() => applySorting(tableHeaders.id, !sorting[tableHeaders.id].ascending)}
                            >
                                {tableHeaders.label}
                                {(tableHeaders.id === "prod_line" || tableHeaders.id === "status") && 
                                    renderSortingArrow(tableHeaders.id)}
                            </div>

                        </th>
                    )
                })}
            </tr>
        </thead>
        <tbody className={settingsTableLayoutStyle.tbody}>
            {props.tableData?.slice(props.startIndex, props.startIndex + 10)?.map((row: any, index: number) => {
                return (
                    <tr
                        key={'row_'+index}
                        className={`${settingsTableLayoutStyle.tr} ${index % 2 !== 0 ? settingsTableLayoutStyle.trIndexGrey : settingsTableLayoutStyle.trIndexWhite}`}
                    >
                        {Object.keys(row).map((item, tdIndex) => {
                            if (item === 'flag') {
                                return null
                            }
                            return (
                                <td
                                    key={'row_'+index+'col_'+tdIndex}
                                    className={settingsTableLayoutStyle.td}
                                >
                                    {item === 'status' && (
                                        <div className={`${row[item] === 'ACTIVE' ? settingsTableLayoutStyle.statusBlack : settingsTableLayoutStyle.statusGrey} ${settingsTableLayoutStyle.status}`}>
                                            {row[item]}
                                        </div>
                                    )}
                                    {item === 'prod_line' && (
                                        <select
                                            disabled={row['flag'] === 'N'}
                                            className={settingsTableLayoutStyle.item}
                                            value={row[item]}
                                            onChange={(e) => handleProdLineChange(e.target.value, row.stall_id)}
                                        >                                   
                                            {userRole?.location === 'LB' && (
                                                <>
                                                    {row['location'] === 'PQA Stalls' && [...PQAStallBuildingLineOptions, ...unassignedOptions].map((line: any, index: number) =>
                                                        <option key={'option_'+index}>{line}</option>
                                                    )}
                                                    {row['location'] === 'PQA Conveyors' && [...PQAConveyorsLineOptions, ...unassignedOptions].map((fqaLine: any) =>
                                                        <option key={fqaLine}>{fqaLine}</option>
                                                    )}
                                                    {row['location'] === 'FQA Conveyors & Stalls' && [...FQAConveyorsStallLineOptions, ...unassignedOptions].map((fqaLine: any) =>
                                                        <option key={fqaLine}>{fqaLine}</option>
                                                    )}
                                                    {row['location'] === 'Unassigned' && (
                                                        [...PQAStallBuildingLineOptions, ...PQAConveyorsLineOptions, ...FQAConveyorsStallLineOptions, ...unassignedOptions].map((unassignedLine: any) =>
                                                            <option key={unassignedLine}>{unassignedLine}</option>
                                                        )
                                                    )}
                                                </>
                                            )}
                   
                                            {userRole?.location === 'PR' && (
                                                <>
                                                    {[...prodLineOptionsPR, ...unassignedOptions].map((line: any) =>
                                                        <option key={line}>{line}</option>
                                                    )}
                                                </>
                                            )}
                                        </select>
                                    )}
                                    {
                                        ((item !== 'status') && (item !== 'prod_line') && (item !== 'flag')) && (
                                            row[item])
                                    }
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
        </tbody>
    </table>
    );
} 