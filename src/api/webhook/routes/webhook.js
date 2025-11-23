"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/webhook',
            handler: 'webhook.handler',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
