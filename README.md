# Composer Web

가천대학교 졸업 프로젝트

## Stacks

-   yarn berry
-   Nextjs
-   react-query
-   styled-components
-   git action
-   docker

## 개발 환경 설정

```
- ./env/env
S3URL=${S3URL}

- ./next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [${S3URL}],
  },
  async rewrites() {
    return [
      {
        source: '/be/:path*',
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig

```

## 설치 방법

OS X & 리눅스:

```sh
yarn set version berry
yarn install
```

윈도우:

```sh
yarn set version berry
yarn install
```

## 업데이트 내역

-   0.0.1
    -   작업 진행 중
-   1.0.0
    -   졸업프로젝트 종료

## 정보

박경열 – a1061602@gmail.com

MIT 라이센스를 준수하며 `LICENSE`에서 자세한 정보를 확인할 수 있습니다.

[https://github.com/ComposerLab/composer-web/blob/master/License](https://github.com/ComposerLab/composer-web/blob/master/License)

[wiki]: https://github.com/ComposerLab/composer-web/wiki
