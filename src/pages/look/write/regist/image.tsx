import { NextPage } from 'next';
import * as Container from '../../../../../styles/common/container';
import BottomMenu from '../../../../components/bottomMenu';
import * as WriteStyle from '../../../../../styles/pages/look/write';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import leftBackButton from '../../../../../public/image/left_back_button.png';
import { ChangeEvent, useRef } from 'react';
import { dehydrate, QueryClient, useQuery, useQueryClient } from 'react-query';
import { deleteCookie, getCookies, setCookie } from 'cookies-next';
import { getKoreaTime, validCookie } from '../../../../utils';
import { reissue } from '../../../../apis/login';

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

const LookWriteRegistMusicPage: NextPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const imageInput = useRef<HTMLInputElement>(null);

    const onClick = () => {
        router.replace('/look/write/regist/music');
    };

    const onClickImageUpload = () => {
        if (imageInput.current) {
            imageInput.current.click();
        }
    };

    const onChangeImageForm = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const formData = e.target.files[0];
            queryClient.setQueryData(['writeFormImage'], formData);
        }
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
            <WriteStyle.RegistSubTitle>
                판매하실 사진을 업로드 해주세요.
            </WriteStyle.RegistSubTitle>

            <input
                type="file"
                style={{ display: 'none' }}
                ref={imageInput}
                onChange={(e) => onChangeImageForm(e)}
            />

            <WriteStyle.UploadButton onClick={() => onClickImageUpload()}>
                이미지 업로드
            </WriteStyle.UploadButton>

            <Container.div direction="column" marginBottom="20px">
                <WriteStyle.button onClick={() => onClick()}>
                    다음
                </WriteStyle.button>
            </Container.div>

            <BottomMenu />
        </>
    );
};

export default LookWriteRegistMusicPage;
