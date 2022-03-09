import axios from 'axios';
import {showAlert} from './alerts'

export const signup = async (data) => {
    try {
        const result = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users//signup',
            data,
            Credential: 'include'
        });
        
        if (result.data.status === 'success') {
            showAlert('success',"Account Created Successfully!!")
            window.setTimeout(() => location.assign("/"), 500);
        }
    } catch (err) {
        showAlert('error',err.response.data.message)
    }
}

