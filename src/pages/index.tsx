import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { dehydrate, QueryClient, useQuery, useQueryClient } from 'react-query';

import * as HomeStyle from '../../styles/pages/index/index';
import BottomMenu from '../components/bottomMenu';
import ColumnItems from '../components/columnItems';
import MultipleItemsSlick from '../components/multipleItemsSlick';

import {
    getCookies,
    getCookie,
    setCookies,
    removeCookies,
    setCookie,
    deleteCookie,
} from 'cookies-next';
import { getArtical } from '../apis/artical';
import { getNews } from '../apis/news';
import { getKoreaTime, validCookie } from '../utils';
import { reissue } from '../apis/login';

export const getServerSideProps = async ({ req, res }: any) => {
    const queryClient = new QueryClient();

    const { accessToken, refreshToken, grantType, accessTokenExpiresIn } =
        getCookies({ req, res });

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

        deleteCookie('accessToken', { req, res });
        deleteCookie('refreshToken', { req, res });
        deleteCookie('grantType', { req, res });
        deleteCookie('accessTokenExpiresIn', { req, res });

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

    if (accessToken && typeof accessToken === 'string') {
        await queryClient.prefetchQuery(
            'articals',
            () => getArtical(accessToken as String),
            {
                staleTime: 5000,
            },
        );

        await queryClient.prefetchQuery(
            'news',
            () => getNews(accessToken as String),
            {
                staleTime: 5000,
            },
        );
    }

    return {
        props: {
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
    };
};

const Home: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        const { accessToken, refreshToken, grantType, accessTokenExpiresIn } =
            getCookies();

        const cookieStatus = validCookie({
            accessToken,
            refreshToken,
            grantType,
            accessTokenExpiresIn,
        });

        if (cookieStatus === 'EXPIRED') {
            router.replace('/user/login');
        }
    }, [router]);

    return (
        <>
            <div style={{ overflow: 'scroll' }}>
                <HomeStyle.Title>최신 아티클</HomeStyle.Title>
                <MultipleItemsSlick />
                <ColumnItems />
                <BottomMenu />
            </div>
        </>
    );
};

export default Home;
