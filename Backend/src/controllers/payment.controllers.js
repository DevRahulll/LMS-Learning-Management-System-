import { razorpay } from "../index.js";
import Payment from "../models/payment.model.js";
import User from "../models/user.models.js";
import AppError from "../utils/error.utils.js";
import crypto from 'crypto'




export const getRazorPayApiKey = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'RazorPay API Key',
            key: process.env.RAZORPAY_KEY_ID

        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
}
export const buySubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) {
            return next(
                new AppError('Unauthorized , please Login!!', 500)
            )
        }

        if (user.role === 'ADMIN') {
            return next(
                new AppError('Admin cannot purchased a subscription ', 400)
            )
        }

        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1
        });

        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Subscribed sucessfully!!",
            subscription_id: subscription.id
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
}
export const verifySubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return next(
                new AppError('Unauthorized , please Login !')
            )
        }

        const subscriptionId = user.subscription.id;

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id}|${subscriptionId}`)
            .digest('hex')

        if (generatedSignature !== razorpay_signature) {
            return next(
                new AppError('Payment not verified , please try again later', 500)
            )
        }

        await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
        });

        user.subscription.status = 'active';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully !!!'
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }


}
export const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id)

        if (!user) {
            return next(
                new AppError("Invalid user id", 500)
            )
        }

        if (user.role === 'ADMIN') {
            return next(
                new AppError('Admin cannot purchase a subscription ', 400)
            )
        }

        const subscriptionId = user.subscription.id;

        const subscription = await razorpay.subscriptions.cancel(subscriptionId)

        user.subscription.status = subscription.status;

        await user.save();

    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
}
export const allPayment = async (req, res, next) => {
    try {
        const { count } = req.query;

        const subscription = await razorpay.subscriptions.all({
            count: count || 10,
        });

        res.status(200).json({
            success: true,
            message: 'All payments are : ',
            subscription
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }

}