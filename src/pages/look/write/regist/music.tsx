import { NextPage } from 'next';
import * as Container from '../../../../../styles/common/container';
import BottomMenu from '../../../../components/bottomMenu';
import * as WriteStyle from '../../../../../styles/pages/look/write';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import leftBackButton from '../../../../../public/image/left_back_button.png';
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import {
    dehydrate,
    QueryClient,
    useMutation,
    useQueryClient,
} from 'react-query';
import { postWrite } from '../../../../apis/write';
import { deleteCookie, getCookie, getCookies, setCookie } from 'cookies-next';
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
    const imageInput = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<FormData>();

    const accessToken = getCookie('accessToken') as string;

    const onClick = async (e: any) => {
        e.preventDefault();

        const form = queryClient.getQueryState<{
            title: string;
            artist: string;
            cost: string;
        }>(['writeForm']);
        const image = queryClient.getQueryState(['writeFormImage']);
        const music = queryClient.getQueryState(['writeFormMusic']);

        console.log('form : ', form?.data);
        console.log('image : ', image?.data);
        console.log('music : ', music?.data);

        const frm = new FormData();

        frm.append('image', image?.data as Blob);
        frm.append('music', music?.data as Blob);
        frm.append('title', form?.data?.title || '');
        frm.append('artist', form?.data?.artist || '');
        frm.append('cost', form?.data?.cost || '');

        console.log('accessToken : ', accessToken);

        const write = await postWrite(accessToken, frm);
        console.log(write.id);
        router.replace(`/detail/${write.id}`);
    };

    const onClickMusicUpload = () => {
        if (imageInput.current) {
            imageInput.current.click();
        }
    };

    const onChangeMusicForm = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const formData = e.target.files[0];
            queryClient.setQueryData(['writeFormMusic'], formData);
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
                판매하실 음원을 업로드 해주세요.
            </WriteStyle.RegistSubTitle>

            <input
                type="file"
                style={{ display: 'none' }}
                ref={imageInput}
                onChange={(e) => onChangeMusicForm(e)}
            />

            <WriteStyle.UploadButton onClick={() => onClickMusicUpload()}>
                음원 업로드
            </WriteStyle.UploadButton>

            <Container.div direction="column" marginBottom="20px">
                <WriteStyle.button onClick={(e) => onClick(e)}>
                    등록하기
                </WriteStyle.button>
            </Container.div>

            <BottomMenu />
        </>
    );
};

export default LookWriteRegistMusicPage;
