import Image from 'next/image';

import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';

import * as MultipleItemsSlickStyle from '../../../styles/components/multipleItemsSlick';
import * as Container from '../../../styles/common/container';
import useDrag from '../../hooks/useDrag';
import { getArtical } from '../../apis/artical';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getCookie } from 'cookies-next';

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
            () => getArtical(accessToken as String),
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

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

const MultipleItemsSlick = () => {
    const accessToken = getCookie('accessToken');

    const { isLoading, error, data } = useQuery('articals', () =>
        getArtical(accessToken as String),
    );

    const { dragStart, dragStop, dragMove, dragging } = useDrag();

    const handleDrag =
        ({ scrollContainer }: scrollVisibilityApiType) =>
        (ev: React.MouseEvent) =>
            dragMove(ev, (posDiff) => {
                if (scrollContainer.current) {
                    scrollContainer.current.scrollLeft += posDiff;
                }
            });

    return (
        <>
            <div
                onMouseLeave={dragStop}
                style={{ marginTop: '18px', marginBottom: '85px' }}
            >
                <ScrollMenu
                    onMouseDown={() => dragStart}
                    onMouseUp={() => dragStop}
                    onMouseMove={handleDrag}
                >
                    {data &&
                        data?.data?.map((item: any) => {
                            return (
                                <div key={item.title}>
                                    <MultipleItemsSlickStyle.Container>
                                        <Image
                                            src={item.image ? item.image : ''}
                                            objectFit="cover"
                                            width={150}
                                            height={195}
                                            alt={item.title}
                                        />
                                    </MultipleItemsSlickStyle.Container>
                                    <Container.div
                                        direction="column"
                                        marginTop="10px"
                                    >
                                        <MultipleItemsSlickStyle.Title>
                                            {item.title}
                                        </MultipleItemsSlickStyle.Title>
                                        <MultipleItemsSlickStyle.SubTitle>
                                            {item.subTitle}
                                        </MultipleItemsSlickStyle.SubTitle>
                                    </Container.div>
                                </div>
                            );
                        })}
                </ScrollMenu>
            </div>
        </>
    );
};

export default MultipleItemsSlick;
