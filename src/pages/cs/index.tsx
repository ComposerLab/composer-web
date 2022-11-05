import { NextPage, NextPageContext } from 'next';
import BottomMenu from '../../components/bottomMenu';
import * as Container from '../../../styles/common/container';
import { dehydrate, QueryClient } from 'react-query';
import { deleteCookie, getCookie, getCookies, setCookie } from 'cookies-next';
import { getKoreaTime, validCookie } from '../../utils';
import { reissue } from '../../apis/login';
import * as CsStyle from '../../../styles/pages/cs';
import { useEffect, useState } from 'react';
import { postCs } from '../../apis/cs';
import { useRouter } from 'next/router';

export const getServerSideProps = async (context: NextPageContext) => {
    const queryClient = new QueryClient();

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

const CsPage: NextPage = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        title: '',
        content: '',
    });

    const accessToken = getCookie('accessToken') as string;

    const onClickForm = async (e: any) => {
        e.preventDefault();

        if (
            form.name !== '' &&
            form.email !== '' &&
            form.title !== '' &&
            form.content !== ''
        ) {
            await postCs(accessToken, form).then(() => {
                router.replace('/');
            });
        }
    };

    useEffect(() => {
        console.log(form);
    }, [form]);

    return (
        <>
            <CsStyle.Title>고객센터</CsStyle.Title>
            <Container.div
                justifyContent="center"
                width="100%"
                marginTop="20px"
            >
                <Container.div
                    alignItems="center"
                    justifyContent="flex-start"
                    width="30%"
                >
                    <CsStyle.Label>이름</CsStyle.Label>
                </Container.div>
                <Container.div
                    alignItems="center"
                    justifyContent="flex-end"
                    width="100%"
                >
                    <CsStyle.TitleInput
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value,
                            })
                        }
                    />
                </Container.div>
            </Container.div>
            <Container.div
                justifyContent="center"
                width="100%"
                marginTop="20px"
            >
                <Container.div
                    alignItems="center"
                    justifyContent="flex-start"
                    width="30%"
                >
                    <CsStyle.Label>이메일</CsStyle.Label>
                </Container.div>
                <Container.div
                    alignItems="center"
                    justifyContent="flex-end"
                    width="100%"
                >
                    <CsStyle.TitleInput
                        onChange={(e) =>
                            setForm({
                                ...form,
                                email: e.target.value,
                            })
                        }
                    />
                </Container.div>
            </Container.div>
            <Container.div
                justifyContent="center"
                width="100%"
                marginTop="20px"
            >
                <Container.div
                    alignItems="center"
                    justifyContent="flex-start"
                    width="30%"
                >
                    <CsStyle.Label>제목</CsStyle.Label>
                </Container.div>
                <Container.div
                    alignItems="center"
                    justifyContent="flex-end"
                    width="100%"
                >
                    <CsStyle.TitleInput
                        onChange={(e) =>
                            setForm({
                                ...form,
                                title: e.target.value,
                            })
                        }
                    />
                </Container.div>
            </Container.div>
            <Container.div
                justifyContent="center"
                width="100%"
                marginTop="20px"
            >
                <Container.div
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    width="30%"
                    marginTop="10px"
                >
                    <CsStyle.Label>문의 내용</CsStyle.Label>
                </Container.div>
                <Container.div
                    alignItems="center"
                    justifyContent="flex-end"
                    width="100%"
                >
                    <CsStyle.ContentInput
                        type="text"
                        onChange={(e) =>
                            setForm({
                                ...form,
                                content: e.target.value,
                            })
                        }
                    />
                </Container.div>
            </Container.div>
            <Container.div marginTop="20px">
                <CsStyle.SubmitButton onClick={(e) => onClickForm(e)}>
                    작성 완료
                </CsStyle.SubmitButton>
            </Container.div>
            <BottomMenu />
        </>
    );
};

export default CsPage;
