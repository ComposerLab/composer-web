import axios from 'axios';

export const getMemberInfo = async (accessToken: String) => {
    const { data } = await axios.get(`/be/member/info`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Access-Control-Allow-Origin': '*',
        },
    });
    console.log(data);
    return data;
};
