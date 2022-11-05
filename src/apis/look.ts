import axios from 'axios';

export const getLook = async (accessToken: String) => {
    const { data } = await axios.get(`/be/look/latest`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Access-Control-Allow-Origin': '*',
        },
    });
    console.log(data);
    return data;
};
