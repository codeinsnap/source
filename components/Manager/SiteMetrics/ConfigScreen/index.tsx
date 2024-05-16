import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import penIcon from '../../../../../public/images/icons/penIcon.svg';
import SettingsTable from './SettingsTable';
import { clearEffectiveDateTimeFormValues, setDeleteLineErrors, setLineErrors, setShowDeleteLineModal, setShowNewLineModal, setShowNewStallModal, setSiteConfigTab, setStallErrors } from '@/store/actions/siteConfigAction';
import { useDispatch, useSelector } from 'react-redux';
import AddNewProductionLine from '../AddNewProductionLine';
import AddNewStall from '../AddNewStall';
import DeleteLine from '../DeleteLine';
import { configScreenStyle } from './config_table_tailwind';

export default function ConfigScreen() {
  const dispatch: any = useDispatch();
  const siteConfigTabs = useSelector((state: any) => state.siteConfigState?.siteConfigTabs);
  let selectedConfigTab = siteConfigTabs?.filter((item: any) => item.isActive)[0].name;
  const site_config_table_data = useSelector((state: any) => state.siteConfigState.site_config_table_data);
  const [isAddNewStallDisabled, setIsAddNewStallDisabled]: any = useState(false);

  const setConfigTab = (selectedValue: any) => {
    dispatch(setSiteConfigTab(selectedValue))
  }

  useEffect(() => {
    let filterInactiveStatus = site_config_table_data?.filter((i: any) => i['status'] === 'INACTIVE');
    let index = filterInactiveStatus && filterInactiveStatus.findIndex((s: any) => s['flag'] === 'Y'); //any Y --> disabled
    //if any entry is Y then disabled the Add New Stall btn
    console.log(filterInactiveStatus,"index")
    if (index > -1) {
      setIsAddNewStallDisabled(true);
    } else { //if there are no Y entries then enable the Add New Stall btn
      setIsAddNewStallDisabled(false);
    }
  }, [site_config_table_data])

  return (
    <>
      <div className={configScreenStyle.mainWrapper}>
        {/* Navigation */}
        <div className={configScreenStyle.navBar} >
          {siteConfigTabs && siteConfigTabs.map((item: any) => {
            return (
              <button
                key={item.name}
                name={item.name}
                value={item.value}
                className={item.isActive ? configScreenStyle.btnActive : configScreenStyle.btnInactive}
                onClick={() => setConfigTab(item.value)}
              >
                <div className={configScreenStyle.btnMargin}>{item.label}</div>
                <Image src={penIcon} alt='pen Icon' />
              </button>
            )
          })}
        </div>

        {/* Delete Line, Add New Line and New Stall Btn */}
        {selectedConfigTab === 'configuration_line' && (
          <div className={configScreenStyle.btnWrapper}>
            <button
              type="button"
              className={configScreenStyle.crudBtn}
              onClick={() => {
                dispatch(setShowDeleteLineModal(true));
                dispatch(clearEffectiveDateTimeFormValues())
                dispatch(setDeleteLineErrors(false))
              }}
            >
              Remove Line -
            </button>
            <button
              type="button"
              className={configScreenStyle.crudBtn}
              onClick={() => {
                dispatch(setShowNewLineModal(true));
                dispatch(clearEffectiveDateTimeFormValues())
                dispatch(setLineErrors(false))
              }}
            >
              Add New Line +
            </button>
            <button
              type="button"
              className={isAddNewStallDisabled ? 'py-2 px-4 bg-grey text-black rounded mr-2' : 'py-2 px-4 bg-black text-white rounded hover:bg-blue-700 mr-2'}
              // className='py-2 px-4 bg-black text-white rounded hover:bg-blue-700 mr-2'
              // className={configScreenStyle.newStallBtn}
              onClick={() => {
                dispatch(setShowNewStallModal(true));
                dispatch(clearEffectiveDateTimeFormValues())
                dispatch(setStallErrors(false))
              }}
            disabled={isAddNewStallDisabled}
            >
              Add New Stall +
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      {selectedConfigTab === 'configuration_line' && (
        <SettingsTable />
      )}
      {selectedConfigTab === 'history' && (
        <div className={configScreenStyle.comingSoon}>Coming Soon ...</div>
      )}

      {/* Delete Line Modal */}
      <DeleteLine />
      {/* Add New Line Modal */}
      <AddNewProductionLine />
      {/* Add New Stall Modal  */}
      <AddNewStall />
    </>
  )
}
