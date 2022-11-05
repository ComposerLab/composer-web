import styled from 'styled-components';

export const TopTitle = styled.div`
    font-size: 20px;
    font-weight: 800;
`;

export const Container = styled.div`
    width: 100%;
`;

export const bottomMusicButtonContainer = styled.div`
    width: 100%;
    height: 100px;
`;

export const bottomPaymentButtonContainer = styled.div`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0;
    padding: 10px;
    margin-bottom: 15px;
    border-top: 0.1px solid #eeeeee;
    background-color: white;
`;

export const InquiryButton = styled.button`
    width: 33%;
    height: 40px;
    background-color: #a8a7ee;
    color: white;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 5px;
    margin-right: 10px;

    -webkit-tap-highlight-color: transparent;
`;

export const ButtonInnerText = styled.div``;

export const PaymentButton = styled.button`
    width: 95%;
    height: 40px;
    background-color: #6562f6;
    color: white;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 5px;

    -webkit-tap-highlight-color: transparent;
`;

export const MusicTitle = styled.div`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 5px;
`;

export const MusicGroup = styled.div`
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 10px;
`;

export const MusicCost = styled.div`
    font-size: 12px;
    font-weight: 700;
`;
