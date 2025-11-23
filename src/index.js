"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resend_1 = require("resend");
const mailer_1 = require("../helpers/mailer");
const mailLocales_1 = require("./utils/mailLocales");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY ?? '');
exports.default = {
    /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
    register({ strapi }) {
    },
    /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
    bootstrap({ strapi }) {
        strapi.db.lifecycles.subscribe({
            models: ['api::order.order'],
            async afterCreate(event) {
                const { result } = event;
                const order = result;
                const locale = order.products?.find((item) => item?.attributes?.locale)
                    ?.attributes?.locale;
                const calculateDelivery = () => {
                    if (order.totalPrice >= 50) {
                        return 0;
                    }
                    if (order.totalPrice < 50) {
                        return order.addressInfo?.officeAddress ? 5 : 7.5;
                    }
                    return 0;
                };
                try {
                    await Promise.all([
                        (0, mailer_1.sendMailTo)('pilyovmartin20@gmail.com', order),
                        (0, mailer_1.sendMailTo)('georgi.yankov.24@gmail.com', order),
                        (0, mailer_1.sendMailTo)('tsvetomir.uzunoff@gmail.com', order),
                    ]);
                    const from = process.env.RESEND_FROM || 'info.troyka@gmail.com';
                    const deliveryPrice = calculateDelivery();
                    const subject = mailLocales_1.selectSubject[locale];
                    const { error } = await resend.emails.send({
                        from,
                        to: order?.credentialsInfo?.email,
                        subject,
                        html: `
              <div>
                <h2>Поръчка №: ${order.orderId?.toUpperCase()}</h2>
                <p>Адрес: ${order.addressInfo?.street}, ${order.addressInfo?.city}</p>
                <p>Офис адрес: ${order.addressInfo?.officeAddress || '-'}</p>
                <p>Метод на плащане: ${order.paymentMethod === 'arrive'
                            ? mailLocales_1.paymentArrive[locale]
                            : mailLocales_1.paymentCard[locale]}</p>
                <p>Тип доставка: ${order.addressInfo?.officeAddress
                            ? mailLocales_1.officeType[locale]
                            : mailLocales_1.homeType[locale]}</p>
                <p>Междинна сума: ${order.totalPrice - deliveryPrice} ЛВ</p>
                <p>Доставка: ${deliveryPrice} ЛВ</p>
                <p>Обща сума: ${order.totalPrice} ЛВ</p>
              </div>
            `,
                    });
                    if (error) {
                        strapi.log.error('Resend order confirmation error', error);
                    }
                }
                catch (error) {
                    console.log(JSON.stringify(error), 'Error when sending email.');
                }
            },
        });
    },
};
