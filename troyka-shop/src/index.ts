import { Core } from "@strapi/strapi";
import { sendMailTo } from "../helpers/mailer";
import { homeType, officeType, paymentArrive, paymentCard, selectSubject, selectTemplateId } from "./utils/mailLocales";
const sgMail = require('@sendgrid/mail')


export default {
	/**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
	register({ strapi }: { strapi: Core.Strapi }) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
   },

	/**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
	bootstrap({ strapi }: { strapi: Core.Strapi }) {
		strapi.db.lifecycles.subscribe({
         models: ['api::order.order'],
    async afterCreate(event) {
         const { result } = event
         const order = result
    
         const locale = order.products?.find((item) => item?.attributes?.locale)
            ?.attributes?.locale
    
         const calculateDelivery = () => {
            if (order.totalPrice >= 50) {
               return 0
            }
            if (order.totalPrice < 50) {
               return order.addressInfo?.officeAddress ? 5 : 7.5
            }
            return 0
         }

    
         try {
    		await Promise.all([
			sendMailTo('pilyovmartin20@gmail.com', order),
			sendMailTo('georgi.yankov.24@gmail.com', order),
			sendMailTo('tsvetomir.uzunoff@gmail.com', order),
		])
            await strapi.plugins['email'].services.email.send({
               to: order?.credentialsInfo?.email,
               from: 'info.troyka@gmail.com',
               subject: selectSubject[locale],
               template_id: selectTemplateId[locale],
               dynamic_template_data: {
                  order_id: order.orderId?.toUpperCase(),
                  address: order.addressInfo,
                  office_address: order.addressInfo?.officeAddress,
                  payment_option: order.paymentMethod,
                  payment_method:
                     order.paymentMethod === 'arrive'
                        ? paymentArrive[locale]
                        : paymentCard[locale],
                  delivery_option: order.addressInfo?.officeAddress
                     ? officeType[locale]
                     : homeType[locale],
                  subtotal: order.totalPrice - calculateDelivery(),
                  total: order.totalPrice - calculateDelivery(),
                  delivery_price: calculateDelivery(),
                  billing_address: order?.billingAddressInfo,
                  products: order.products,
               },
            })
         } catch (error) {
            console.log(JSON.stringify(error), 'Error when sending email.')
         }
      },
      })
	},
}
