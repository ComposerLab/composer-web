import type { NextPage } from 'next';
import * as Container from '../../../../styles/common/container';
import * as RegistStyle from '../../../../styles/pages/users/regist';
import Header from '../../../components/commonHeader';
import CustomBottomSheet from '../../../components/customBottomSheet';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { signup } from '../../../apis/regist';
import { IProps } from '../../../types/regist';

const Regist: NextPage = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [agency, setAgency] = useState<string>('');
    const [role, setRole] = useState({
        user: true,
        seller: false,
    });
    const [regist, setRegist] = useState({
        email: '',
        password: '',
        name: '',
        phoneNumber: '',
        agency: '',
        roles: '',
    });

    const setFalseOpen = () => {
        setOpen(false);
    };

    const setClickAgency = (item: string) => {
        setAgency(item);
        setRegist({ ...regist, agency: item });
    };

    const setRoles = (key: string) => {
        if (key === 'user') {
            setRole({ user: true, seller: false });
            setRegist({ ...regist, roles: 'USER' });
        }

        if (key === 'seller') {
            setRole({ user: false, seller: true });
            setRegist({ ...regist, roles: 'SELLER' });
        }
    };

    const { mutate, isLoading } = useMutation(signup, {
        onSuccess: (data) => {
            queryClient.setQueryData('signup', data);
            router.replace('/');
        },
        onError: (e) => {
            console.log(e);
        },
        onSettled: () => {
            queryClient.invalidateQueries('signup');
        },
    });

    const onSubmit = (data: IProps) => {
        mutate(data);
    };

    const agencyList = [
        'SKT',
        'KT',
        'LG',
        'SKT 알뜰폰',
        'KT 알뜰폰',
        'LG 알뜰폰',
    ];

    useEffect(() => {
        console.log(regist);
    }, [regist]);

    return (
        <>
            <Header title="회원가입" url="/user/login" />
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
                <RegistStyle.Input
                    onChange={(e) =>
                        setRegist({ ...regist, email: e.target.value })
                    }
                />
            </Container.div>

            <Container.div
                direction="column"
                justifyContent="space-between"
                height="51px"
                marginBottom="30px"
            >
                <RegistStyle.Lable>비밀번호</RegistStyle.Lable>
                <RegistStyle.Input
                    onChange={(e) =>
                        setRegist({ ...regist, password: e.target.value })
                    }
                />
            </Container.div>

            <Container.div
                direction="column"
                justifyContent="space-between"
                height="51px"
                marginBottom="30px"
            >
                <RegistStyle.Lable>전화번호</RegistStyle.Lable>
                <RegistStyle.Input
                    onChange={(e) =>
                        setRegist({ ...regist, phoneNumber: e.target.value })
                    }
                />
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
                <RegistStyle.Input
                    onChange={(e) =>
                        setRegist({ ...regist, name: e.target.value })
                    }
                />
            </Container.div>

            <Container.div
                justifyContent="space-between"
                height="51px"
                marginBottom="30px"
            >
                {role.user ? (
                    <RegistStyle.RoleButton onClick={() => setRoles('user')}>
                        구매자
                    </RegistStyle.RoleButton>
                ) : (
                    <RegistStyle.DisableRoleButton
                        onClick={() => setRoles('user')}
                    >
                        구매자
                    </RegistStyle.DisableRoleButton>
                )}
                {role.seller ? (
                    <RegistStyle.RoleButton onClick={() => setRoles('seller')}>
                        판매자
                    </RegistStyle.RoleButton>
                ) : (
                    <RegistStyle.DisableRoleButton
                        onClick={() => setRoles('seller')}
                    >
                        판매자
                    </RegistStyle.DisableRoleButton>
                )}
            </Container.div>

            {[regist].every((item) => !Object.values(item).includes('')) ? (
                <Container.div
                    direction="column"
                    justifyContent="space-between"
                >
                    <RegistStyle.button onClick={() => onSubmit(regist)}>
                        다음
                    </RegistStyle.button>
                </Container.div>
            ) : (
                <Container.div
                    direction="column"
                    justifyContent="space-between"
                >
                    <RegistStyle.disableButton
                        disabled
                        onClick={() => onSubmit(regist)}
                    >
                        다음
                    </RegistStyle.disableButton>
                </Container.div>
            )}

            <CustomBottomSheet open={open} setOpen={setFalseOpen}>
                <Container.div
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <RegistStyle.BottomSheetTitle>
                        통신사
                    </RegistStyle.BottomSheetTitle>
                    <RegistStyle.BottomSheetSubTitle>
                        사용하고 계신 통신사를 선택 해주세요.
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
                                        setClickAgency(item);
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

export default Regist;
