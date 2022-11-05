import { deleteCookie, getCookie, setCookie, getCookies } from 'cookies-next';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import editIcon from '../../../public/image/edit.png';
import * as Container from '../../../styles/common/container';
import * as LookStyle from '../../../styles/pages/look';
import { reissue } from '../../apis/login';
import { getLook } from '../../apis/look';
import { getMemberInfo } from '../../apis/member';
import BottomMenu from '../../components/bottomMenu';
import { getKoreaTime } from '../../utils';
import { validCookie } from '../../utils/index';

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
            'looks',
            () => getLook(accessToken as String),
            {
                staleTime: 5000,
            },
        );

        await queryClient.prefetchQuery(
            'member',
            () => getMemberInfo(accessToken as String),
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

const LookPage: NextPage = () => {
    const [selected, setSelected] = useState(true);

    const accessToken = getCookie('accessToken');

    const { data: lookData } = useQuery('looks', () =>
        getLook(accessToken as String),
    );

    const { data: memberData } = useQuery('member', () =>
        getMemberInfo(accessToken as String),
    );

    console.log(memberData);

    console.log(lookData);

    return (
        <>
            <Container.div
                alignItems="center"
                justifyContent="space-between"
                marginTop="20px"
            >
                <LookStyle.TopTitle>둘러보기</LookStyle.TopTitle>
                {memberData?.roles === 'SELLER' && (
                    <Link href={{ pathname: '/look/write' }} passHref>
                        <Container.div
                            height="100%"
                            alignItems="center"
                            paddingBottom="10px"
                            paddingRight="10px"
                            paddingLeft="10px"
                            paddingTop="10px"
                        >
                            <Image
                                src={editIcon}
                                width={20}
                                height={20}
                                objectFit="cover"
                                alt=""
                            />
                        </Container.div>
                    </Link>
                )}
            </Container.div>

            <Container.div direction="column">
                <Container.div
                    width="100%"
                    marginTop="20px"
                    marginBottom="10px"
                >
                    {selected ? (
                        <LookStyle.SelectedTitleButton>
                            목록
                        </LookStyle.SelectedTitleButton>
                    ) : (
                        <LookStyle.TitleButton>목록</LookStyle.TitleButton>
                    )}
                </Container.div>
                {/* <LookStyle.Title>목록</LookStyle.Title> */}
                <LookStyle.Box>
                    <Container.div direction="column">
                        <LookStyle.SubTitle>Composer 목록</LookStyle.SubTitle>
                        {lookData?.data.map((item: any) => {
                            return (
                                <>
                                    <LookStyle.ListInnerBox key={item.title}>
                                        <Link
                                            href={{
                                                pathname: `/detail/${item.id}`,
                                            }}
                                            passHref
                                        >
                                            <Container.div
                                                width="100%"
                                                height="56px"
                                                justifyContent="space-between"
                                            >
                                                <Container.div
                                                    width="100%"
                                                    height="100%"
                                                    marginBottom="20px"
                                                >
                                                    <LookStyle.ImageContainer>
                                                        <Image
                                                            src={`${process.env.S3URL}/${item.image}`}
                                                            width={56}
                                                            height={56}
                                                            objectFit="cover"
                                                            alt=""
                                                        />
                                                    </LookStyle.ImageContainer>

                                                    <Container.div
                                                        direction="column"
                                                        justifyContent="center"
                                                        alignItems="start"
                                                        paddingLeft="20px"
                                                    >
                                                        <LookStyle.ListTitle>
                                                            {item.title}
                                                        </LookStyle.ListTitle>
                                                        <LookStyle.ListProducer>
                                                            {item.artist}
                                                        </LookStyle.ListProducer>
                                                    </Container.div>
                                                </Container.div>
                                                {/* <Container.div
                                                    alignItems="center"
                                                    paddingBottom="10px"
                                                    paddingRight="10px"
                                                    paddingLeft="10px"
                                                    paddingTop="10px"
                                                >
                                                    <Image
                                                        src={playButton}
                                                        width={20}
                                                        height={20}
                                                        objectFit="cover"
                                                        alt=""
                                                    />
                                                </Container.div> */}
                                            </Container.div>
                                        </Link>
                                    </LookStyle.ListInnerBox>
                                </>
                            );
                        })}
                    </Container.div>
                </LookStyle.Box>
            </Container.div>
            <BottomMenu />
        </>
    );
};

export default LookPage;
