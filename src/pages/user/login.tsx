import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
    dehydrate,
    QueryClient,
    useMutation,
    useQueryClient,
} from 'react-query';
import * as Container from '../../../styles/common/container';
import * as Login from '../../../styles/pages/users/login';
import { loginWithEmailAndPassword, reissue } from '../../apis/login';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { getKoreaTime } from '../../utils';

export const getServerSideProps = async ({ req, res }: any) => {
    const queryClient = new QueryClient();

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

const LoginPage: NextPage = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const [auth, setAuth] = useState({
        email: '',
        password: '',
    });

    const { mutate, isLoading } = useMutation(loginWithEmailAndPassword, {
        onSuccess: (data) => {
            console.log();
            queryClient.setQueryData('login', data);
            setCookie('accessToken', data.accessToken, {
                expires: getKoreaTime(data.accessTokenExpiresIn),
            });
            setCookie('refreshToken', data.refreshToken);
            setCookie('grantType', data.grantType);
            setCookie('accessTokenExpiresIn', data.accessTokenExpiresIn);
            router.push('/');
        },
        onError: (e) => {
            console.log(e);
        },
        onSettled: () => {
            queryClient.invalidateQueries('login');
        },
    });

    const onSubmit = (data: object) => {
        mutate(data);
    };

    useEffect(() => {
        const user = localStorage.getItem('login') || '';
        const jsonUser = user ? JSON.parse(user) : {};

        console.log(jsonUser.accessTokenExpiresIn);

        if (jsonUser?.accessTokenExpiresIn !== undefined) {
            router.push('/');
        }
    }, [router]);

    return (
        <Container.div direction="column">
            <Login.Title>Composer</Login.Title>

            <Container.div
                direction="column"
                justifyContent="space-between"
                height="51px"
                marginBottom="30px"
            >
                <Login.idLable>아이디</Login.idLable>
                <Login.idInput
                    onChange={(e) =>
                        setAuth({ ...auth, email: e.target.value })
                    }
                />
            </Container.div>

            <Container.div
                direction="column"
                justifyContent="space-between"
                height="51px"
                marginBottom="30px"
            >
                <Login.passwordLabel>비밀번호</Login.passwordLabel>
                <Login.passwordInput
                    onChange={(e) =>
                        setAuth({ ...auth, password: e.target.value })
                    }
                />
            </Container.div>

            <Login.button onClick={() => onSubmit(auth)}>로그인</Login.button>

            <Container.div justifyContent="space-between">
                <Link href="/user/regist" passHref>
                    <Login.regist>회원가입</Login.regist>
                </Link>
                <Link href="/user/password" passHref>
                    <Login.findPassword>비밀번호 찾기</Login.findPassword>
                </Link>
            </Container.div>
        </Container.div>
    );
};

export default LoginPage;
