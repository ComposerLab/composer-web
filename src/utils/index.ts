export const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

export const getKoreaTime = (timestamp: number | null = null) => {
    const curr = timestamp ? new Date(timestamp) : new Date();
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
    const krCurr = new Date(utc + KR_TIME_DIFF);

    return krCurr;
};

interface Cookie {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    grantType: string | undefined;
    accessTokenExpiresIn: string | undefined;
}

// 쿠키 토큰 유효성 검사
export const validCookie = ({
    accessToken,
    refreshToken,
    grantType,
    accessTokenExpiresIn,
}: Cookie) => {
    /**
     * 조건 1 accessToken이 없을때 "EXPIRED"
     * 조건 2 refreshToken이 없을때 "EXPIRED"
     * 조건 3 accessTokenExpireIn이 10분 이하 남았을때 "RENEWAL"
     * 조건 4 그 외 "AVAILABLE"
     */

    const time = getKoreaTime(Number(accessTokenExpiresIn)).getTime();
    const now = getKoreaTime().getTime();
    const diffTime = new Date(time - now).getMinutes();

    console.log('diffTime : ', diffTime);

    if (
        accessToken === null ||
        accessToken === undefined ||
        accessToken === ''
    ) {
        return 'EXPIRED';
    }

    if (
        refreshToken === null ||
        refreshToken === undefined ||
        refreshToken === ''
    ) {
        return 'EXPIRED';
    }

    if (diffTime <= 10) {
        return 'RENEWAL';
    }

    return 'AVAILABLE';
};
