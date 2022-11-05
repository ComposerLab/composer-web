import axios from 'axios';

export const postWrite = async (
    accessToken: String,
    body: FormData | undefined,
) => {
    console.log(body);
    const { data } = await axios.post(`/be/look/write`, body, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
            'Access-Control-Allow-Origin': '*',
        },
    });
    console.log(data);
    return data;
};
