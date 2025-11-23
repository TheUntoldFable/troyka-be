"use strict";
/**
 * subscription controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::subscription.subscription', ({ strapi }) => ({
    async create(ctx) {
        const email = ctx.body.email;
        if (!email)
            return;
        try {
            const res = await strapi
                .service('api::subscription.subscription')
                .create({
                data: {
                    email,
                },
            });
            return { emailData: res };
        }
        catch (error) {
            return { error };
        }
    },
}));
