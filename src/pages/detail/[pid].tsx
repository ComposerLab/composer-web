import { NextPage, NextPageContext } from 'next';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import * as Container from '../../../styles/common/container';
import * as DetailStyle from '../../../styles/pages/look/detail';
import Image from 'next/image';

import ex from '../../../public/image/ex1.png';
import Link from 'next/link';
import leftBackButton from '../../../public/image/left_back_button.png';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { deleteCookie, getCookie, getCookies, setCookie } from 'cookies-next';
import { getDetail } from '../../apis/detail';
import { useRouter } from 'next/router';
import { Billing } from '../../apis/billing';
import { getKoreaTime, validCookie } from '../../utils';
import { reissue } from '../../apis/login';

export const getServerSideProps = async (context: NextPageContext) => {
    const { pid } = context.query;

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

    if (accessToken && typeof accessToken === 'string') {
        await queryClient.prefetchQuery(
            'detail',
            () => getDetail(accessToken as String, pid as String),
            {
                staleTime: 1000,
            },
        );
    }

    return {
        props: {
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
    };
};

const LookDetailPage: NextPage = () => {
    const router = useRouter();
    const { pid } = router.query;

    const accessToken = getCookie('accessToken');

    const { isLoading, error, data } = useQuery('detail', () =>
        getDetail(accessToken as String, pid as String),
    );

    const onClickBilling = async () => {
        Billing(data?.data);
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
                <DetailStyle.TopTitle>상세정보</DetailStyle.TopTitle>
                <div style={{ width: '12px' }}></div>
            </Container.div>

            {!isLoading && (
                <Image
                    src={`${process.env.S3URL}/${data?.data.image}`}
                    width={500}
                    height={500}
                    object-fit="cover"
                    alt=""
                    loading="lazy"
                />
            )}

            <Container.div
                width="100%"
                direction="column"
                justifyContent="center"
                alignItems="center"
                marginTop="20px"
                marginBottom="20px"
            >
                <DetailStyle.MusicTitle>
                    {data?.data.title}
                </DetailStyle.MusicTitle>
                <DetailStyle.MusicGroup>
                    {data?.data.artist}
                </DetailStyle.MusicGroup>
                <DetailStyle.MusicCost>
                    {data?.data.cost?.replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ',',
                    )}
                    원
                </DetailStyle.MusicCost>
            </Container.div>

            <DetailStyle.bottomMusicButtonContainer>
                <AudioPlayer
                    src={`${process.env.S3URL}/${data?.data.music}`}
                    volume={0.3}
                ></AudioPlayer>
            </DetailStyle.bottomMusicButtonContainer>

            <DetailStyle.bottomPaymentButtonContainer>
                {/* <Container.div>
                    <DetailStyle.InquiryButton>
                        <DetailStyle.ButtonInnerText>
                            문의하기
                        </DetailStyle.ButtonInnerText>
                    </DetailStyle.InquiryButton>
                </Container.div> */}
                <DetailStyle.PaymentButton>
                    <DetailStyle.ButtonInnerText
                        onClick={() => onClickBilling()}
                    >
                        구매하기
                    </DetailStyle.ButtonInnerText>
                </DetailStyle.PaymentButton>
            </DetailStyle.bottomPaymentButtonContainer>

            {/* <BottomMenu /> */}
        </>
    );
};

export default LookDetailPage;
