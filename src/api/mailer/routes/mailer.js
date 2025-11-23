"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/mailer/send',
            handler: 'mailer.send',
            config: {
                auth: false,
            },
        },
    ],
};
