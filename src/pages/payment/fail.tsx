import axios from 'axios';
import { getCookie } from 'cookies-next';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { dehydrate, QueryClient, useQueryClient } from 'react-query';
import { getPayFail } from '../../apis/billing';

export const getServerSideProps = async (context: any) => {
    const queryClient = new QueryClient();
    console.log(context.query.orderId);

    queryClient.setQueryData('paymentFail', context.query);

    return {
        props: {
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
    };
};

interface Query {
    code: string;
    message: string;
    orderId: string;
}

const SuccessPage: NextPage = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const accessToken = getCookie('accessToken');
    const paymentData = queryClient.getQueryData<Query>('paymentFail');
    const paymentAttempt = queryClient.getQueryData('paymentAttemptFail');

    useEffect(() => {
        if (paymentAttempt !== true) {
            const payment = async () => {
                await axios
                    .get(
                        `/be/payment/fail?code=${paymentData?.code}&message=${paymentData?.message}&orderId=${paymentData?.orderId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Access-Control-Allow-Origin': '*',
                            },
                        },
                    )
                    .catch((error) => {
                        console.log(error);
                    });

                queryClient.setQueryData('paymentAttemptFail', true);
            };

            payment();

            router.replace('/look');
        }
    }, []);

    return <></>;
};

export default SuccessPage;
