import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../styles/common/theme';
import { GlobalFont } from '../../styles/fonts/global-font';
import GlobalStyle from '../../styles/global-style';

function MyApp({ Component, pageProps }: AppProps) {
    // 동적 화면 사이즈 계산
    const setScreenSize = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    useEffect(() => {
        setScreenSize();
    });

    const [queryClient] = useState(() => new QueryClient());

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <GlobalFont />
                    <GlobalStyle />
                    <Head>
                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1"
                        />
                        <title>Composer</title>
                    </Head>
                    <ThemeProvider theme={theme}>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </Hydrate>
            </QueryClientProvider>
        </>
    );
}

export default MyApp;
