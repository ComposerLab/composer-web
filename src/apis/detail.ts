import axios from 'axios';

export const getDetail = async (accessToken: String, id: String) => {
    const { data } = await axios.get(`/be/look/detail/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Access-Control-Allow-Origin': '*',
        },
    });
    console.log(data);
    return data;
};
