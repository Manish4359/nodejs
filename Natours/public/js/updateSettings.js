import axios from 'axios';

import { showAlert } from './alerts'

export const updateSettings = async (data, type) => {

    try {

        const updatePassUrl = 'http://127.0.0.1:3000/api/v1/users/update-password';
        const updateDataUrl = 'http://127.0.0.1:3000/api/v1/users/update-profile';
        const url = type === 'password' ? updatePassUrl : updateDataUrl;

        const updatedData = await axios({
            method: 'PATCH',
            url,
            data,
            Credential: 'include'
        });

        console.log(updatedData);

        if (updatedData.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} Data Updated Successfully!!`)
            window.setTimeout(() => location.assign("/about"), 500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
    //res.locals.user=updatedData;
} 