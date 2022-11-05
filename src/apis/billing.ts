import { loadTossPayments } from '@tosspayments/payment-sdk';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { getMemberInfo } from './member';

export const getPaymentInfo = async (accessToken: String, body: object) => {
    const { data } = await axios.post(`/be/payment/info`, body, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Access-Control-Allow-Origin': '*',
        },
    });
    console.log(data);
    return data;
};

interface Query {
    code: string;
    message: string;
    orderId: string;
}

export const getPayFail = async (accessToken: String, query: Query) => {
    const { data } = await axios.get(
        `/be/payment/success?code=${query.code}&message=${query.message}&orderId=${query.orderId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Access-Control-Allow-Origin': '*',
            },
        },
    );
    console.log(data);
    return data;
};

interface BillingData {
    cost: number;
    title: string;
    id: number;
}

export const Billing = async (data: BillingData) => {
    const clientKey = 'test_ck_YPBal2vxj812MvRwZxG35RQgOAND';

    const tossPayments = await loadTossPayments(clientKey);

    const accessToken = getCookie('accessToken');

    const member = await getMemberInfo(accessToken as String);

    const payment = await getPaymentInfo(accessToken as String, {
        payType: '카드',
        amount: Number(data?.cost),
        orderName: data?.title,
        customerEmail: member.email,
        customerName: member.name,
        lookAroundId: Number(data?.id),
    });

    console.log(member);
    console.log(payment);

    tossPayments.requestPayment('카드', {
        amount: payment.amount,
        orderId: payment.orderId,
        orderName: payment.orderName,
        customerName: payment.customerName,
        successUrl: payment.successUrl,
        failUrl: payment.failUrl,
    });
};
