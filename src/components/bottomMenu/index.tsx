import * as Container from '../../../styles/common/container';
import * as BottomMenuStyle from '../../../styles/components/bottomMenu';

import HomeButton from '../../../public/image/Vector.png';
import workflowButton from '../../../public/image/bi_vinyl-fill.png';
import matterButton from '../../../public/image/bi_music-note-list.png';
import support from '../../../public/image/support.png';
import Image from 'next/image';
import Link from 'next/link';

const buttonList = {
    data: [
        {
            image: HomeButton,
            title: '홈',
            path: '/',
        },
        {
            image: workflowButton,
            title: '둘러보기',
            path: '/look',
        },
        {
            image: matterButton,
            title: '내가 구매한 목록',
            path: '/payment',
        },
        {
            image: support,
            title: '고객센터',
            path: '/cs',
        },
    ],
};

const BottomMenu = () => {
    return (
        <>
            <BottomMenuStyle.Container>
                <Container.div
                    height="72px"
                    justifyContent="space-around"
                    alignItems="center"
                >
                    {buttonList.data.map((item) => {
                        return (
                            <div key={item.title}>
                                <Link
                                    href={{ pathname: item.path }}
                                    passHref
                                    key={item.title}
                                >
                                    <Container.div
                                        direction="column"
                                        width="70px"
                                        alignItems="center"
                                        height="30px"
                                        justifyContent="space-between"
                                        paddingRight="10px"
                                        paddingLeft="10px"
                                    >
                                        <Image
                                            src={item.image}
                                            objectFit="contain"
                                            alt=""
                                        />
                                        <BottomMenuStyle.Title>
                                            {item.title}
                                        </BottomMenuStyle.Title>
                                    </Container.div>
                                </Link>
                            </div>
                        );
                    })}
                </Container.div>
            </BottomMenuStyle.Container>
        </>
    );
};

export default BottomMenu;
