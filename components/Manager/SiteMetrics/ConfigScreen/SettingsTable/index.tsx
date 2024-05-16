import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import firstPage from '../../../../../../public/images/icons/firstPage.svg';
import prevPage from '../../../../../../public/images/icons/prevPage.svg';
import nextPage from '../../../../../../public/images/icons/nextPage.svg';
import lastPage from '../../../../../../public/images/icons/lastPage.svg';
import MultiSelect from '@/components/Shared/MultiSelect';
import { useDispatch, useSelector } from 'react-redux';
import { FetchSiteConfigTableDataAction } from '@/store/actions/siteConfigAction';
import { displayLoader } from '@/store/actions/commonAction';
import { settingsTableStyle } from './setting_table_tailwind';
import { getCurrentTimeByLocation } from '@/utility/commonFunctions';
import SettingsTableLayout from './SettingsTableLayout';



export default function SettingsTable() {
    const [tableData, setTableData] = useState<any>([]);
    const [startIndex, setStartIndex] = useState<any>(0);
    const [currentPage, setCurrentPage] = useState<any>(1);
    const [totalPageCount, setTotalPageCount] = useState<any>();
    const [paginationDropdownArr, setPaginationDropdownArr] = useState<any[]>([]);
    const [filterArr, setFilterArr] = useState<any>({ stall_id: [], prod_line: [], status_filter: [] });
    const dispatch: any = useDispatch();

    const userRole = useSelector((state: any) => state.authenticationState.userRole);
    const { site_config_table_data, dictionary} = useSelector((state: any) => state.siteConfigState);

    // -----------------------------------Filtering Logic Starts here -----------------------------------------
    //Initialize Filter Array using the Site Config API Data
    useEffect(() => {
        const stallIds: string[] = site_config_table_data.map((item: any) => item.stall_id); //["LB_0001", "LB_0002", "LB_0003", "LB_0004", "LB_0005", "LB_0006"]
        const stallIdOptions: string[] = Array.from(new Set(stallIds)).sort(); // ["LB_0001", "LB_0002", "LB_0003", "LB_0003"] Reduce it to a Unique Set
        const stallIdFilter: any[] = [];
        stallIdOptions.forEach((stId: any) => stallIdFilter.push({ val: stId, checked: true })); //Change the structure of above array -> { val: "LB_0001", checked: true }

        //Create the Production Lines Filter
        const prodLineOptionsDictionary: string[] = dictionary.map((item: any) => item.prod_line);
        const unassignedOptions: string[] = ["Unassigned"];
        const prodLineOptionsLBPR = [...prodLineOptionsDictionary, ...unassignedOptions];
        const prodLineOptions: string[] = Array.from(new Set(prodLineOptionsLBPR)).sort(); // [D, A,B,C] //Unique Set 

        const prodLineFilter: any[] = [];

        prodLineOptions.forEach((prdLn: any) => prodLineFilter.push({ val: prdLn, checked: true })); //Change the structure of above array -> { val: "A1", checked: true }

        //Create the Status Filter Options 
        const statusOptions = ["ACTIVE", "INACTIVE"];
        const statusFilter: any[] = [];
        statusOptions.forEach((statusOp: any) => statusFilter.push({ val: statusOp, checked: true }));

        setFilterArr({
            ...filterArr,
            stall_id: stallIdFilter,
            prod_line: prodLineFilter,
            status_filter: statusFilter
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [site_config_table_data]);

    //Handle Filtering here. Filter Chaining of Stall_Id, Prod_Line, Status
    const handleFiltering = (e: any, name: string) => {
        const stall_id_filter_copy = filterArr["stall_id"];
        const prod_line_filter_copy = filterArr["prod_line"];
        const status_filter_copy = filterArr["status_filter"];

        if (name === 'stall_id') {
            const stall_id_filter_index = stall_id_filter_copy.find((item: any) => item.val === e.target.value);
            stall_id_filter_index.checked = !stall_id_filter_index.checked;
        }

        if (name === "prod_line") {
            const prod_line_filter_index = prod_line_filter_copy.find((item: any) => item.val === e.target.value);
            prod_line_filter_index.checked = !prod_line_filter_index.checked;
        }

        if (name === 'status_filter') {
            const status_filter_index = status_filter_copy.find((item: any) => item.val === e.target.value);
            status_filter_index.checked = !status_filter_index.checked;
        }

        //once user has clicked on the checkbox update the filter arr
        setFilterArr({
            ...filterArr,
            stall_id: stall_id_filter_copy,
            prod_line: prod_line_filter_copy,
            status_filter: status_filter_copy
        });

        setCurrentPage(1);
    }

    //Handle Select All or Deselect All 
    const handleSelectDeselectAll = (e: any, name: string) => {
        const updatedFilterArr = filterArr[name]?.map((item: any) => {
            return {
                ...item,
                checked: e.target.checked
            }
        })

        //once user has clicked on the checkbox update the filter arr
        setFilterArr({
            ...filterArr,
            [name]: updatedFilterArr,
        });
    }

    //When the filter array is changed, trigger useeffect, update table data with filteredData
    useEffect(() => {
        let filteredData = site_config_table_data.filter((item: any) => {
            return ((
                filterArr['stall_id'].filter((s: any) => {
                    return s.checked && (item["stall_id"] === s.val)
                })[0]?.checked)
                && (
                    filterArr['prod_line'].filter((prod: any) => {
                        return prod.checked && (item["prod_line"] === prod.val)
                    })[0]?.checked)
                && (
                    filterArr['status_filter'].filter((s: any) => {
                        return s.checked && (item["status"] === s.val)
                    })[0]?.checked)
            );
        })
        //Once the filter chaining is done set tableData to filteredData 
        setTableData([...filteredData]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterArr]);
    // -----------------------------------Filtering Logic Ends here -----------------------------------------

    // -------------------- Pagination Logic ----------------------
    //Step6 - When ever current page changes update Start Index so we can render only req data 
    useEffect(() => {
        setStartIndex(10 * (Number(currentPage) - 1));
    }, [currentPage]);

    //Step5 - Change Current Page number when pagination left right arrow is clicked
    const changePage = (i: number) => {
        if (i > 0 && i <= totalPageCount) {
            setCurrentPage(i);
        }
    }

    //Step4 - set pagination dropdown arr once total page count is available to us
    useEffect(() => {
        let arr: any[] = []; //if page count is 7 then build arr like this [1, 2, 3, 4, 5, 6, 7]
        for (let i = 1; i <= totalPageCount; i++) {
            arr.push(i);
        }
        setPaginationDropdownArr([...arr]);
    }, [totalPageCount]);

    //Step3 - Once local copy of table Data is available -> set total page count
    //Bonus - Also, when Filter is Applied -> table data changes -> change the totalPage Count according to new filtered data
    useEffect(() => {
        // setCurrentPage(1);
        setTotalPageCount(Math.ceil(tableData?.length / 10));
    }, [tableData]);

    //Step2 - Once Site Config API data is available, set it to a local useState for filtering, pagination and sorting purpose
    useEffect(() => {
        setTableData(site_config_table_data);
        dispatch(displayLoader(false))
    }, [site_config_table_data]);

    //Step1 - Once this component is mounted call "Site Config API" 
    useEffect(() => {
        dispatch(FetchSiteConfigTableDataAction(userRole?.location, getCurrentTimeByLocation(userRole?.location)));
    }, []);

    const onTableDataChange = (tableData: any) => {
        setTableData(tableData);
    }


    {/* Long Beach Manager Production Lines */ }
    // const opsBuildingProdLineOptions: string[] = dictionary.filter((dic: any) => dic.location === 'Ops Building').map((item: any) => item.prod_line);
    // const fqaBuildingProdLineOptions: string[] = dictionary.filter((dic: any) => dic.location === 'FQA Building').map((item: any) => item.prod_line);

    return (
        <>
            {/* <div className={settingsTableStyle.comingSoon}>Coming Soon ...</div> */}
            {/* Filters starts here*/}
            <div className={settingsTableStyle.mainWrapper}>
                <div className={settingsTableStyle.multiSelectWrapper}>
                    <MultiSelect
                        name="stall_id"
                        option={filterArr["stall_id"]}
                        placeholder='Stall Id'
                        handleChange={handleFiltering}
                        handleSelectDeselectAll={handleSelectDeselectAll}
                        showCount
                        count={filterArr['stall_id'].findIndex((i: any) => i.checked === false) > -1 ? filterArr['stall_id'].filter((f: any) => f.checked).length : 'All'}
                    />
                </div>
                <div className={settingsTableStyle.multiSelectWrapper}>
                    <MultiSelect
                        name="prod_line"
                        option={filterArr["prod_line"]}
                        placeholder='Production Line'
                        handleChange={handleFiltering}
                        handleSelectDeselectAll={handleSelectDeselectAll}
                        showCount
                        count={filterArr['prod_line'].findIndex((i: any) => i.checked === false) > -1 ? filterArr['prod_line'].filter((f: any) => f.checked).length : 'All'}
                    />
                </div>
                <div className={settingsTableStyle.multiSelectWrapper}>
                    <MultiSelect
                        name="status_filter"
                        option={filterArr["status_filter"]}
                        placeholder='Status'
                        handleChange={handleFiltering}
                        handleSelectDeselectAll={handleSelectDeselectAll}
                        showCount
                        count={filterArr['status_filter'].findIndex((i: any) => i.checked === false) > -1 ? filterArr['status_filter'].filter((f: any) => f.checked).length : 'All'}
                    />
                </div>
            </div>
            {/* Table */}
            {/* Show 10 data at a time in a sinlge page, hence (startIndex, startIndex + 10) */}
            <SettingsTableLayout 
            tableData={tableData} 
            onTableDataChange={onTableDataChange}
            startIndex={startIndex}
            />
            {/* Pagination */}
            <div className={settingsTableStyle.paginationWrapper}>
                <Image src={firstPage} alt="first page" className={settingsTableStyle.marginRight} onClick={() => changePage(1)} />
                <Image src={prevPage} alt="prev page" className={settingsTableStyle.marginRight} onClick={() => changePage(currentPage - 1)} />
                <div className={settingsTableStyle.marginRight}>
                    <select
                        className={settingsTableStyle.selectformElement} 
                        value={currentPage}
                        onChange={(e) => changePage(Number(e.target.value))}
                    >
                        {paginationDropdownArr.map((item: number) =>
                            <option key={item}>{item}</option>
                        )}
                    </select>
                    <span>of {totalPageCount} Pages</span>
                </div>
                <Image src={nextPage} alt="next page" className={settingsTableStyle.marginRight} onClick={() => changePage(currentPage + 1)} />
                <Image src={lastPage} alt="last Page" onClick={() => changePage(totalPageCount)} />
            </div>
        </>
    )
}


