"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const stripeConfig = {
    apiVersion: '2022-11-15',
};
const stripe = new stripe_1.default(process.env.NODE_ENV === 'development'
    ? process.env.STRIPE_SK_KEY_TEST
    : process.env.STRIPE_SK_KEY_LIVE, stripeConfig);
const endpointSecret = process.env.WEBHOOK_SECRET;
exports.default = {
    async handler(ctx) {
        let event;
        const raw = ctx.request.body[Symbol.for('unparsedBody')];
        try {
            const sig = ctx.request.headers['stripe-signature'];
            if (sig) {
                event = stripe.webhooks.constructEvent(raw, sig, endpointSecret);
            }
            else {
                ctx.response.status = 400;
                ctx.body = { error: 'Missing stripe-signature header' };
                return;
            }
        }
        catch (err) {
            console.log(err, 'Webhook signature verification failed');
            ctx.response.status = 400;
            ctx.body = { error: `Webhook Error: ${err.message}` };
            return;
        }
        console.log('✅ Webhook received:', event.type);
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const sessionId = session.id;
                console.log(`💳 Checkout completed for session: ${sessionId}`);
                try {
                    // Find the order by session ID (stripeId)
                    const itemToUpdate = await strapi.db.query('api::order.order').findOne({
                        where: { stripeId: sessionId },
                    });
                    if (!itemToUpdate) {
                        console.log(`⚠️  No order found with stripeId: ${sessionId}`);
                        ctx.response.status = 200;
                        ctx.body = { received: true };
                        return;
                    }
                    console.log('📦 Updating order:', itemToUpdate.id);
                    // Update order with payment intent and mark as paid
                    const entry = await strapi.db.query('api::order.order').update({
                        where: { id: itemToUpdate.id },
                        data: {
                            isPaid: true,
                            paymentIntentId: session.payment_intent, // Optionally store payment intent too
                        },
                    });
                    console.log('✅ Order updated successfully:', entry.id);
                }
                catch (error) {
                    console.error('❌ Error processing webhook:', error);
                    ctx.response.status = 200;
                    ctx.body = { received: true, error: 'Processing failed' };
                    return;
                }
                break;
            }
            // You can remove the payment_intent.succeeded case if you don't need it
            default:
                console.log(`ℹ️  Unhandled event type: ${event.type}`);
        }
        ctx.response.status = 200;
        ctx.body = { received: true };
    },
};
