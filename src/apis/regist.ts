import axios from 'axios';
import { IProps } from '../types/regist';

export const signup = async (data: IProps) => {
    console.log(data);
    const { data: response1 } = await axios.post(`/be/auth/signup`, data);
    const { data: response2 } = await axios.post(`/be/auth/login`, {
        email: data.email,
        password: data.password,
    });
    console.log('response : ', response2);
    return response2;
};
