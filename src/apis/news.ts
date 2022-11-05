import axios from 'axios';

export const getNews = async (accessToken: String) => {
    const { data } = await axios.get(`/be/news/latest`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Access-Control-Allow-Origin': '*',
        },
    });
    console.log(data);
    return data;
};
