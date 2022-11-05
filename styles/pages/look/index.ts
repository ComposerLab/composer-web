import styled from 'styled-components';

export const TopTitle = styled.div`
    font-size: 24px;
    font-weight: 800;
`;

export const TitleButton = styled.button`
    border: none;
    padding: 5px 15px 5px 15px;
    border-radius: 20px;

    -webkit-tap-highlight-color: transparent;
`;

export const SelectedTitleButton = styled.button`
    border: none;
    padding: 5px 15px 5px 15px;
    border-radius: 20px;
    color: white;
    background-color: #6562f6;

    -webkit-tap-highlight-color: transparent;
`;

export const Title = styled.div`
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
`;

export const Box = styled.div`
    height: calc(100vh - 250px);
    background-color: rgba(2, 32, 71, 0.05);
    border-radius: 5px;
    padding: 15px 15px 15px 15px;
    margin-top: 10px;
    overflow: scroll;
    box-shadow: 0px 0px 50px -14px rgba(0, 0, 0, 0.1);
`;

export const SubTitle = styled.div`
    font-size: 14px;
    margin-top: 5px;
    margin-bottom: 15px;
    font-weight: 600;
`;

export const ImageContainer = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 5px;
    overflow: hidden;
`;

export const ListTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
`;

export const ListProducer = styled.div`
    font-size: 10px;
    font-weight: 500;
    color: #9d9d9d;
`;

export const ListInnerBox = styled.div`
    display: flex;
    align-items: center;
    background-color: white;
    padding: 10px 10px 10px 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0px 0px 50px -14px rgba(0, 0, 0, 0.1);
`;
