import { NextPage } from 'next';
import BottomMenu from '../../components/bottomMenu';
import * as Container from '../../../styles/common/container';
import * as LookStyle from '../../../styles/pages/look';
import * as MatterStyle from '../../../styles/pages/matter';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { useQuery } from 'react-query';
import { getPaymentMine } from '../../apis/payment';

const PaymentPage: NextPage = () => {
    const router = useRouter();

    const accessToken = getCookie('accessToken');

    const { isLoading, error, data } = useQuery('payment', () =>
        getPaymentMine(accessToken as String),
    );

    return (
        <>
            <Container.div
                alignItems="center"
                justifyContent="space-between"
                marginTop="28px"
                marginBottom="30px"
            >
                <LookStyle.TopTitle>내가 구매한 목록</LookStyle.TopTitle>
            </Container.div>
            <div style={{ height: 'calc(100vh - 160px)', overflow: 'scroll' }}>
                {data?.data.map((item: any) => {
                    return (
                        <>
                            <MatterStyle.DateTitle>
                                {`${new Date(item.createDt).getMonth() + 1}월 ${
                                    new Date(item.createDt).getDay() - 1
                                }일`}
                            </MatterStyle.DateTitle>
                            {data?.data.map((innerItem: any) => {
                                return (
                                    <>
                                        <Container.div
                                            direction="column"
                                            marginBottom="25px"
                                        >
                                            <Container.div
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Container.div alignItems="center">
                                                    <MatterStyle.ImageContainer>
                                                        <Image
                                                            src={`${process.env.S3URL}/${innerItem.lookAround.image}`}
                                                            width={40}
                                                            height={40}
                                                            objectFit="cover"
                                                            alt=""
                                                        />
                                                    </MatterStyle.ImageContainer>
                                                    <Container.div
                                                        direction="column"
                                                        height="30px"
                                                        alignItems="flex-start"
                                                        justifyContent="space-between"
                                                    >
                                                        <MatterStyle.Title>
                                                            {
                                                                innerItem
                                                                    .lookAround
                                                                    .title
                                                            }
                                                        </MatterStyle.Title>
                                                        <MatterStyle.SubTitle>
                                                            {`${new Date(
                                                                item.createDt,
                                                            ).getHours()}:${new Date(
                                                                item.createDt,
                                                            ).getMinutes()}`}
                                                        </MatterStyle.SubTitle>
                                                    </Container.div>
                                                </Container.div>
                                                <MatterStyle.Cost>
                                                    {String(
                                                        innerItem.amount,
                                                    ).replace(
                                                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                                        ',',
                                                    )}{' '}
                                                    원
                                                </MatterStyle.Cost>
                                            </Container.div>
                                        </Container.div>
                                    </>
                                );
                            })}
                        </>
                    );
                })}
            </div>

            <BottomMenu />
        </>
    );
};

export default PaymentPage;
