import { deleteCookie, setCookie, getCookies } from 'cookies-next';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQueryClient, dehydrate, QueryClient } from 'react-query';
import leftBackButton from '../../../../public/image/left_back_button.png';
import * as Container from '../../../../styles/common/container';
import * as WriteStyle from '../../../../styles/pages/look/write';
import { reissue } from '../../../apis/login';
import BottomMenu from '../../../components/bottomMenu';
import { getKoreaTime, validCookie } from '../../../utils';

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

    return {
        props: {
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
    };
};

const LookWritePage: NextPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        title: '',
        artist: '',
        cost: '',
    });

    const onClick = () => {
        queryClient.setQueryData(['writeForm'], form);
        router.replace('/look/write/regist/image');
    };

    const onChangeForm = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    return (
        <>
            <Container.div
                alignItems="center"
                justifyContent="space-between"
                marginTop="20px"
                marginBottom="20px"
            >
                <Link href="/look" passHref>
                    <Container.div
                        alignItems="center"
                        justifyContent="center"
                        width="auto"
                    >
                        <Image src={leftBackButton} alt="뒤로가기 버튼" />
                    </Container.div>
                </Link>
                <WriteStyle.TopTitle>판매하기</WriteStyle.TopTitle>
                <div style={{ width: '12px' }}></div>
            </Container.div>
            <WriteStyle.SubTitle>
                판매하실 음원에 대한 정보를 입력해주세요.
            </WriteStyle.SubTitle>
            <Container.div direction="column" marginBottom="20px">
                <WriteStyle.TitleLabel>곡 제목</WriteStyle.TitleLabel>
                <WriteStyle.TitleInput
                    name="title"
                    placeholder="It Was a Time"
                    onChange={onChangeForm}
                />
            </Container.div>

            <Container.div direction="column" marginBottom="20px">
                <WriteStyle.GroupLabel>아티스트</WriteStyle.GroupLabel>
                <WriteStyle.GroupInput
                    name="artist"
                    placeholder="TrackTribe"
                    onChange={onChangeForm}
                />
            </Container.div>

            <Container.div direction="column" marginBottom="20px">
                <WriteStyle.CostLabel>판매 가격</WriteStyle.CostLabel>
                <WriteStyle.CostInput
                    name="cost"
                    placeholder="100,000"
                    onChange={onChangeForm}
                />
            </Container.div>

            <Container.div direction="column" marginBottom="20px">
                <WriteStyle.button onClick={() => onClick()}>
                    다음
                </WriteStyle.button>
            </Container.div>
            <BottomMenu />
        </>
    );
};

export default LookWritePage;
