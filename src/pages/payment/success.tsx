import axios from 'axios';
import { deleteCookie, getCookie, getCookies, setCookie } from 'cookies-next';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { dehydrate, QueryClient, useQueryClient } from 'react-query';
import { reissue } from '../../apis/login';
import { getKoreaTime, validCookie } from '../../utils';
// import { getPaySuccess } from '../../apis/billing';

export const getServerSideProps = async (context: any) => {
    const queryClient = new QueryClient();
    console.log(context.query);

    queryClient.setQueryData('paymentSuccess', context.query);

    const { accessToken, refreshToken, grantType, accessTokenExpiresIn } =
        getCookies({ req: context.req, res: context.res });

    const cookieStatus = validCookie({
        accessToken,
        refreshToken,
        grantType,
        accessTokenExpiresIn,
    });

    if (cookieStatus === 'EXPIRED') {
        return {
            redirect: {
                permanent: false,
                destination: '/user/login',
            },
        };
    }

    // 인증 재발급
    if (cookieStatus === 'RENEWAL') {
        await queryClient.prefetchQuery(
            'login',
            () => reissue({ accessToken, refreshToken }),
            {
                staleTime: 1000,
            },
        );

        deleteCookie('accessToken', { req: context.req, res: context.res });
        deleteCookie('refreshToken', { req: context.req, res: context.res });
        deleteCookie('grantType', { req: context.req, res: context.res });
        deleteCookie('accessTokenExpiresIn', {
            req: context.req,
            res: context.res,
        });

        setCookie('accessToken', accessToken, {
            expires: getKoreaTime(Number(accessTokenExpiresIn)),
        });
        setCookie('refreshToken', refreshToken);
        setCookie('grantType', grantType);
        setCookie(
            'accessTokenExpiresIn',
            getKoreaTime(Number(accessTokenExpiresIn)),
        );
    }

    return {
        props: {
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
    };
};

interface Query {
    paymentKey: string;
    amount: number;
    orderId: string;
}

const SuccessPage: NextPage = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const accessToken = getCookie('accessToken');
    const paymentData = queryClient.getQueryData<Query>('paymentSuccess');
    const paymentAttempt = queryClient.getQueryData('paymentAttempt');

    useEffect(() => {
        if (paymentAttempt !== true) {
            const payment = async () => {
                await axios
                    .get(
                        `/be/payment/success?paymentKey=${paymentData?.paymentKey}&orderId=${paymentData?.orderId}&amount=${paymentData?.amount}`,
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

                queryClient.setQueryData('paymentAttempt', true);
            };

            payment();

            router.replace('/payment');
        }
    }, []);

    return <></>;
};

export default SuccessPage;
