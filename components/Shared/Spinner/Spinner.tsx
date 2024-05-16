import React from 'react'
import { useSelector } from 'react-redux';

function Spinner() {
    const displayloading = useSelector((state: any) => state.commonState.displayLoader);
    return (
        <>
            {displayloading && (
                <>
                    <div className='pos-center'>
                        <div className="loader"></div>
                    </div>
                </>
            )
            }
        </>
    )
}

export default Spinner
    