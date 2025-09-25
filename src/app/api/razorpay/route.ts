import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import shortid from 'shortid';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
    const { amount } = await req.json();

    const payment_capture = 1;
    const totalAmount = amount * 100; // Amount in smallest currency unit
    const currency = 'INR';

    const options = {
        amount: totalAmount.toString(),
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };

    try {
        const response = await razorpay.orders.create(options);
        return NextResponse.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating Razorpay order' }, { status: 500 });
    }
}
