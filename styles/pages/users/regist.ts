import styled, { createGlobalStyle } from 'styled-components';

export const SubTitle = styled.div`
    font-weight: 800;
    font-size: 18px;
    line-height: 21px;
    margin-top: 40px;
    margin-bottom: 35px;
    width: 205px;
`;

export const Lable = styled.label`
    font-size: 12px;
    font-weight: 500;
    color: #88888e;
`;

export const Input = styled.input`
    height: 30px;
    border: none;
    border-bottom: 1px solid #ededef;
`;

export const SelectBox = styled.input`
    height: 30px;
    border: none;
    border-bottom: 1px solid #ededef;
`;

export const BottomSheetTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
    margin-top: 12px;
`;

export const BottomSheetSubTitle = styled.div`
    font-size: 14px;
    font-weight: 400;
    margin-top: 12px;
`;

export const BottomSheetContent = styled.div`
    font-size: 18px;
    font-weight: 400;
    padding-top: 16px;
    padding-bottom: 16px;
`;

export const button = styled.button`
    background-color: #6562f6;
    height: 40px;
    border-radius: 3px;
    color: white;
    border: none;

    -webkit-tap-highlight-color: transparent;
`;

export const disableButton = styled.button`
    background-color: gray;
    height: 40px;
    border-radius: 3px;
    color: white;
    border: none;

    -webkit-tap-highlight-color: transparent;
`;

export const RoleButton = styled.button`
    width: 50%;
    height: 40px;
    border: none;
    background-color: #6562f6;
    color: white;
`;

export const DisableRoleButton = styled.button`
    width: 50%;
    height: 40px;
    border: none;
    background-color: #white;
    color: black;
`;
