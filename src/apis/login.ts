import axios from 'axios';

export const loginWithEmailAndPassword = async (data: object) => {
    const { data: response } = await axios.post(`/be/auth/login`, data);
    console.log(response);
    return response;
};

export const reissue = async (data: object) => {
    const { data: response } = await axios.post(`/be/auth/reissue`, data);
    console.log(response);
    return response;
};
