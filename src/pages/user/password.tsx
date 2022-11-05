import type { NextPage } from 'next';
import * as Container from '../../../styles/common/container';
import * as RegistStyle from '../../../styles/pages/users/regist';
import Header from '../../components/commonHeader';
import CustomBottomSheet from '../../components/customBottomSheet';
import { useState } from 'react';

const Password: NextPage = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [agency, setAgency] = useState<string>('');

    const setFalseOpen = () => {
        setOpen(false);
    };

    const agencyList = [
        'SKT',
        'KT',
        'LG',
        'SKT 알뜰폰',
        'KT 알뜰폰',
        'LG 알뜰폰',
    ];

    return (
        <>
            <Header title="비밀번호 찾기" url="/user/login" />
            <RegistStyle.SubTitle>
                입력한 정보가 맞다면 아래 확인 버튼을 눌러주세요.
            </RegistStyle.SubTitle>
            <Container.div
                direction="column"
                justifyContent="space-between"
                height="51px"
                marginBottom="30px"
            >
                <RegistStyle.Lable>아이디 (이메일)</RegistStyle.Lable>
                <RegistStyle.Input />
            </Container.div>

            <Container.div
                direction="column"
                justifyContent="space-between"
                height="51px"
                marginBottom="30px"
            >
                <RegistStyle.Lable>전화번호</RegistStyle.Lable>
                <RegistStyle.Input />
            </Container.div>

            <Container.div
                direction="column"
                justifyContent="space-between"
                height="51px"
                marginBottom="30px"
            >
                <RegistStyle.Lable>통신사</RegistStyle.Lable>
                <RegistStyle.SelectBox
                    onClick={() => setOpen(true)}
                    value={agency}
                ></RegistStyle.SelectBox>
            </Container.div>

            <Container.div
                direction="column"
                justifyContent="space-between"
                height="51px"
                marginBottom="30px"
            >
                <RegistStyle.Lable>성함</RegistStyle.Lable>
                <RegistStyle.Input />
            </Container.div>

            <Container.div
                direction="column"
                justifyContent="space-between"
                height="51px"
                marginBottom="30px"
            >
                <RegistStyle.button>비밀번호 찾기</RegistStyle.button>
            </Container.div>

            <CustomBottomSheet open={open} setOpen={setFalseOpen}>
                <Container.div
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <RegistStyle.BottomSheetTitle>
                        인증
                    </RegistStyle.BottomSheetTitle>
                    <RegistStyle.BottomSheetSubTitle>
                        입력하신 휴대폰으로 전송 된 인증번호를 입력해주세요.
                    </RegistStyle.BottomSheetSubTitle>
                    <Container.div
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        marginTop="10px"
                    >
                        {agencyList.map((item) => {
                            return (
                                <RegistStyle.BottomSheetContent
                                    key={item}
                                    onClick={() => {
                                        setAgency(item);
                                        setFalseOpen();
                                    }}
                                >
                                    {item}
                                </RegistStyle.BottomSheetContent>
                            );
                        })}
                    </Container.div>
                </Container.div>
            </CustomBottomSheet>
        </>
    );
};

export default Password;
