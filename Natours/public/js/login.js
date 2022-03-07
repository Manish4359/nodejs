import axios from 'axios';
import {showAlert} from './alerts'

export const login = async (email, password) => {
    console.log(email,password);
    try {
        const result = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            },
            Credential: 'include'
        });
        console.log(result)
        
        
        if (result.data.status === 'success') {
            showAlert('success',result.data.message)
            window.setTimeout(() => location.assign("/"), 500);
        }
    } catch (err) {
        showAlert('error',err.response.data.message)
    }
}

