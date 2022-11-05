import axios from 'axios';

export const postCs = async (accessToken: String, body: object) => {
    const { data } = await axios.post(`/be/cs/update`, body, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Access-Control-Allow-Origin': '*',
        },
    });
    console.log(data);
    return data;
};
