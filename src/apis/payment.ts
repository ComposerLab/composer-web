import axios from 'axios';

export const getPaymentMine = async (accessToken: String) => {
    const { data } = await axios.get(`/be/payment/mine`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Access-Control-Allow-Origin': '*',
        },
    });
    console.log(data);
    return data;
};
