import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
    ${reset}

    :root {
        --vh: 100%;
    }

    #__next {
        
    }

    body {
        padding-left: 21px;
        padding-right: 21px;
        -ms-overflow-style: none;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }

    ::-webkit-scrollbar {
        display: none;
    }
    
`;

export default GlobalStyle;
