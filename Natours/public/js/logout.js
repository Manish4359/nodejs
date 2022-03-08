import axios from 'axios';
import {showAlert} from './alerts'

export const logout=async ()=>{
    try{
        const result = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout',
            Credential: 'include'
        });

        if(result.data.status === 'success'){
            location.assign('/');

        }
    }catch(err){
        showAlert('error','Error occured while logging Out');
    }
}