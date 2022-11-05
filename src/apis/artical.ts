import axios from 'axios';

export const getArtical = async (accessToken: String) => {
    const { data } = await axios.get(`/be/artical/latest`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Access-Control-Allow-Origin': '*',
        },
    });
    console.log(data);
    return data;
};
