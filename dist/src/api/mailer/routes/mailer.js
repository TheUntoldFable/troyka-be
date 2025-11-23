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
