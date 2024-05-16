import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { commonTableMetricStyle } from './table_tailwind';
import { trimDownOneDecimal, trimUpOneDecimal } from '@/utility/formattingFunctions';


function Table(props: any) {
    const [headers, setHeaders] = useState<any>();
    const { tableData, isStallStatusData, tableDataVehicles, tableHeaders, isExceptionSummaryData, isProgessSummaryData } = props;
    // useEffect(() => { 
    //     if(tableData && tableData.length > 0)
    //         setHeaders(Object.keys(tableData[0]));
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const renderHeaders = () => {
        if (tableHeaders) {
            return (tableHeaders && tableHeaders.map((header: any, index: any) => {
                if (header !== 'Remaining' && header !== 'PlannedToTime' && header !== 'CompletedToTime')
                    return (
                        <>
                           {isStallStatusData && <th key={header} scope="col" className={"pr-3.5 py-4 text-grey4 font-normal"}>{header}</th>}
                           {isProgessSummaryData && <th key={header} scope="col" className={index === 0 ? "pl-4 py-4 text-grey4 font-normal" : "py-4 text-grey4 font-normal"}>{header}</th>}
                           {isExceptionSummaryData && <th key={header} scope="col" className={index === 0 ? "pl-4 py-4 text-grey4 font-normal" : "py-4 text-grey4 font-normal w-20"}>{header}</th>}
                        </>
                    )
            }));
        }
    };

    return (
        <div>
            <div className={commonTableMetricStyle.outerContainer}>
                <div className={commonTableMetricStyle.outerContainerOverflow}>
                    <div className={commonTableMetricStyle.containerWidth}>
                        <div className={commonTableMetricStyle.wrapperOverflow}>
                            <table className={commonTableMetricStyle.tableWrapper}>
                                <thead
                                    className={commonTableMetricStyle.tableHead}>
                                    <tr className={commonTableMetricStyle.tBodyTr}>
                                        {renderHeaders()}
                                    </tr>
                                </thead>
                                <tbody className={isStallStatusData ? commonTableMetricStyle.tableBodyStallStatus : commonTableMetricStyle.tableBody}>
                                    {isExceptionSummaryData && tableData && tableData.map((data: any, index: any) => {
                                        return (
                                            //  <div  className={`${buildingCardStyle.card} ${Number(completed) >= Number(marker) ? buildingCardStyle.cardGreyBorder : buildingCardStyle.cardRedBorder}`}></div>
                                            <tr
                                                key={data.Asset}
                                                className={`${commonTableMetricStyle.tBodyTr} ${index % 2 === 0 ? "bg-grey3" : "bg-white"}`}

                                            >
                                                <td className={commonTableMetricStyle.exceptionSummaryReasonTableData}>{data.description}</td>
                                                <td className={commonTableMetricStyle.exceptionSummaryCountTableData}>{data.count}</td>
                                            </tr>
                                        )
                                    })}
                                    {isStallStatusData && tableDataVehicles && tableDataVehicles.map((data: any, index: any) => {
                                        return (
                                            <tr
                                                key={data.Asset}
                                                className={`${commonTableMetricStyle.tBodyTr} ${index % 2 === 0 ? "bg-grey3" : "bg-white"}`}
                                            >
                                                <td className={commonTableMetricStyle.tableData}>
                                                    {data['Asset']}
                                                    <div className={commonTableMetricStyle.flagMargin}>
                                                        {data['ColorStatusFlag'] === 'Y' ?
                                                            (
                                                                <>
                                                                    <Image
                                                                        src='/images/green.png'
                                                                        width={80}
                                                                        height={50}
                                                                        alt="stall_status"
                                                                    />
                                                                </>
                                                            ) :
                                                            <>
                                                                <Image
                                                                    src='/images/red.png'
                                                                    width={80}
                                                                    height={50}
                                                                    alt="stall_status"
                                                                />
                                                            </>

                                                        }
                                                    </div>
                                                    <span className={commonTableMetricStyle.flagMargin}>
                                                        {data['Vin'].substring(data['Vin'].length - 8)}
                                                    </span>
                                                </td>
                                                <td className={commonTableMetricStyle.tableData}>{data['StartTime']}</td>
                                                <td className={commonTableMetricStyle.tableData}>{data['TimeElapsed']}</td>
                                                <td className={commonTableMetricStyle.tableData}>{data['ExpInstallTime']}</td>
                                            </tr>
                                        )
                                    })
                                    }

                                    {isProgessSummaryData && <>
                                        {tableData && tableData.map((data: any, index: any) => {
                                            return (
                                                //  <div  className={`${buildingCardStyle.card} ${Number(completed) >= Number(marker) ? buildingCardStyle.cardGreyBorder : buildingCardStyle.cardRedBorder}`}></div>
                                                <tr
                                                    key={data.Asset}
                                                    className={`${commonTableMetricStyle.tBodyTr} ${index % 2 === 0 ? "bg-grey3" : "bg-white"}`}

                                                >
                                                    <td className={commonTableMetricStyle.tableDataAsset}>{data.Asset}</td>
                                                    <td className={commonTableMetricStyle.tableData}>{trimUpOneDecimal(data.Planned)}</td>
                                                    <td className={commonTableMetricStyle.tableData}>{trimUpOneDecimal(data.Completed)}</td>
                                                    {/* <td className={commonTableMetricStyle.tableData}>{trimUpOneDecimal(data.Remaining)}</td> */}
                                                    <td className={commonTableMetricStyle.tableData}>
                                                        <div className={commonTableMetricStyle.flagMargin}>
                                                            {trimDownOneDecimal(data.Progress)} %
                                                            {data.Progress < 100 ?
                                                                (
                                                                    <>
                                                                        <Image
                                                                            src='/images/icons/redTick.svg'
                                                                            width={18}
                                                                            height={18}
                                                                            alt="stall_status"
                                                                            style={{ marginLeft: 10, marginTop: 2 }}
                                                                        />
                                                                    </>
                                                                ) :
                                                                <>
                                                                    <Image
                                                                        src='/images/icons/greenTick.svg'
                                                                        width={18}
                                                                        height={18}
                                                                        alt="stall_status"
                                                                        style={{ marginLeft: 10, marginTop: 2 }}
                                                                    />
                                                                </>

                                                            }
                                                        </div>

                                                    </td>
                                                </tr>
                                            )
                                        })}

                                    </>}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Table
