import * as Container from '../../../styles/common/container';
import * as CommonHeaderStyle from '../../../styles/components/commonHeader';
import Image from 'next/image';

import leftBackButton from '../../../public/image/left_back_button.png';
import Link from 'next/link';

export interface Props {
    title?: string;
    url: string;
}

const CommonHeader = ({ title, url }: Props) => {
    return (
        <Container.div
            justifyContent="space-between"
            alignItems="center"
            height="20px"
            paddingTop="17px"
        >
            <Link href={url} passHref>
                <Container.div justifyContent="center" width="auto">
                    <Image src={leftBackButton} alt="뒤로가기 버튼" />
                </Container.div>
            </Link>

            <Container.div justifyContent="center" width="auto">
                <CommonHeaderStyle.Title>{title}</CommonHeaderStyle.Title>
            </Container.div>

            <Container.div></Container.div>
        </Container.div>
    );
};

export default CommonHeader;
