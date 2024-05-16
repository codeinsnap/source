import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FetchUsersAction, removeUserAction, removeItemId, searchTextAction, selectedUserAction } from "@/store/actions/usersAction";
import { mutiselect } from "./multiselect_dropdown_tailwind";
import { CONSTANTS } from "@/constants/constants";

const Icon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20">
      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
    </svg>
  );
};

const CloseIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20">
      <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
    </svg>
  );
};

const TeamMemberDropdown = (props: any) => {
  const { placeHolder, isMulti, isSearchable, isDisabled, setShowModal } = props;
  const [showMenu, setShowMenu] = useState(false);
  const searchRef = useRef<any>();
  const inputRef = useRef<any>();

  const dispatch: any = useDispatch();
  const users = useSelector((state: any) => state.usersState.users) || [];
  const searchValue = useSelector((state: any) => state.usersState.searchText);
  const selectedValue = useSelector((state: any) => state.usersState.selectedUsers);
  const selectedInitalValue = useSelector((state: any) => state.profileState.profileData?.workdayIds);
  const profileData = useSelector((state: any) => state.profileState.profileData);
  const userRole = useSelector((state: any) => state.authenticationState.userRole);

  useEffect(() => {
    if(profileData && selectedInitalValue) {
      selectedInitalValue?.map((item: any) => {
          let index = selectedValue.findIndex((el: any) => el.code === item.code);
          if(index === -1) {
            dispatch(selectedUserAction(item))
          }
        }
      )
    }
  }, [profileData]);

  useEffect(() => {
    dispatch(searchTextAction(""));
    if (showMenu && searchRef.current) {
      searchRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMenu]);

  useEffect(() => {
    const handler = (e: any) => {
      if (inputRef.current && !inputRef.current?.contains(e.target)) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });
  
  const handleInputClick = (e: any) => {
    if(selectedValue.length < 6) { 
      !isDisabled && setShowMenu(!showMenu);
    }
  };

  const getDisplay = () => {
    if (!selectedValue || selectedValue.length === 0) {
      return placeHolder;
    }
    if (isMulti) {
      return (
        <div className="multi-dropdown-tags overflow-y-auto max-h-16">
          <div className="flex justify-center items-center p-1 bg-black text-white rounded text-xs font-semibold">
            {selectedValue?.length} OF 6
          </div>
          {selectedValue && selectedValue.map((option: any) => {
            return (
              <div key={option?.code} className="multi-dropdown-tag-item">
                {`${option?.code} - ${option?.names} `}
                {!isDisabled && (
                  <span
                    onClick={(e) => onTagRemove(e, option)}
                    className="multi-dropdown-tag-close"
                  >
                    <CloseIcon />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      );
    }
    return (selectedValue && selectedValue.code);
  };

  const onTagRemove = (e: any, option: any) => {
    e.stopPropagation();

    if (!isDisabled) {
      //open the confirm modal
      setShowModal(true);

      //save the id to be remove in redux 
      dispatch(removeItemId(option?.code));
    }
  };

  const onItemClick = (option: any) => {
    if (selectedValue && selectedValue.findIndex((o: any) => o.code === option.code) >= 0) {
     // dispatch(removeUserAction(option.code))
    } else {
      dispatch(selectedUserAction(option));
    }
  }

  const isSelected = (option: any) => {
    if (isMulti) {
      return (selectedValue && selectedValue?.filter((o: any) => o?.code === option.code).length > 0);
    }

    if (!selectedValue) {
      return false;
    }
    return (selectedValue && (selectedValue?.code === option.code));
  };

  const onSearch = (e: any) => {
    dispatch(searchTextAction(e.target.value));
  };

  //API - fetch users once searchValue is available
  useEffect(() => {
    if (searchValue) {
      dispatch(FetchUsersAction(searchValue, userRole?.location));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  const getOptions = () => {
    if (!searchValue) {
      return [];
    }

    return users;
  };

  return (
    <div className={`${mutiselect.mainwrapper} ${!selectedValue || selectedValue.length === 0 ? mutiselect.selectBorder : ''} `}>
      <div ref={inputRef} onClick={handleInputClick} className="multi-dropdown-input">
        <div className="multi-dropdown-selected-value">{getDisplay()}</div>
        {!isDisabled && (
          <div className="multi-dropdown-tools">
            <div className="multi-dropdown-tool">
              <Icon />
            </div>
          </div>
        )}
      </div>
      {showMenu && (
        <div className="multi-dropdown-menu">
          {isSearchable && (
            <div className="search-box">
              <input className='w-full p-2' placeholder={CONSTANTS.SEARCH_WORKDAY_ID} onChange={onSearch} value={searchValue} ref={searchRef} />
            </div>
          )}
          {getOptions().map((option: any) => (
            <div
              onClick={() => onItemClick(option)}
              key={option.code}
              className={`multi-dropdown-item ${isSelected(option) && "selected"}`}
            >
              {`${option?.code} - ${option?.names}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMemberDropdown;
