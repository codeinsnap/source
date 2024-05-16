import toast from 'react-hot-toast';
import moment from 'moment';
import { CONSTANTS } from '@/constants/constants';

export const toastSuccess = () => {
    toast.success('Submitted Successfully', {
        position: 'top-right',
        duration: 4000,
        icon: '😃',
        style: {
            borderRadius: '4px',
            backgroundColor: '#22A63E',
            color: 'white',
            fontWeight: '600'
        }
    });
}

export const toastError = (errorMsg: string = CONSTANTS.NETWORK_ERROR) => {
    toast.error(errorMsg, {
        position: 'top-right',
        duration: 4000,
        icon: '😞',
        style: {
            borderRadius: '4px',
            backgroundColor: 'red',
            color: 'white',
            fontWeight: '600'
        }
    });
}

export const getCurrentTimeByLocation = (location: any) => {
    if (location === 'LB') {
        return moment.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss');
    } else if (location === 'PR') {
        return moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss');
    }
}

