import * as ColumnItemsStyle from '../../../styles/components/columnItems';
import * as Container from '../../../styles/common/container';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getNews } from '../../apis/news';

export interface Props {
    data: {
        image: string;
        title: string;
        subTitle: string;
    }[];
}

export const getServerSideProps = async ({ req, res }: any) => {
    const queryClient = new QueryClient();

    const accessToken = getCookie('accessToken', { req, res });

    if (accessToken && typeof accessToken === 'string') {
        await queryClient.prefetchQuery(
            'articals',
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

interface News {
    id: number;
    title: string;
    subTitle: string;
    content: string;
    image: string;
}

const ColumnItems = () => {
    const accessToken = getCookie('accessToken');

    const { isLoading, error, data } = useQuery('news', () =>
        getNews(accessToken as String),
    );

    return (
        <>
            {data &&
                data?.data.map((item: News) => {
                    return (
                        <div key={item.title}>
                            <Container.div
                                justifyContent="space-between"
                                marginBottom="20px"
                            >
                                <Container.div
                                    direction="column"
                                    justifyContent="space-between"
                                    width="265px"
                                >
                                    <ColumnItemsStyle.Title>
                                        {item.title}
                                    </ColumnItemsStyle.Title>
                                    <ColumnItemsStyle.SubTitle>
                                        {item.subTitle}
                                    </ColumnItemsStyle.SubTitle>
                                </Container.div>
                                <ColumnItemsStyle.ImageContainer>
                                    <Image
                                        src={item.image}
                                        width={56}
                                        height={56}
                                        objectFit="cover"
                                        alt={item.title}
                                    />
                                </ColumnItemsStyle.ImageContainer>
                            </Container.div>
                        </div>
                    );
                })}
        </>
    );
};

export default ColumnItems;
