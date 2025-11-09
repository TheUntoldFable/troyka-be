
/*
 *
 * ============================================================
 * WARNING: THIS FILE HAS BEEN COMMENTED OUT
 * ============================================================
 *
 * CONTEXT:
 *
 * The lifecycles.js file has been commented out to prevent unintended side effects when starting Strapi 5 for the first time after migrating to the document service.
 *
 * STRAPI 5 introduces a new document service that handles lifecycles differently compared to previous versions. Without migrating your lifecycles to document service middlewares, you may experience issues such as:
 *
 * - `unpublish` actions triggering `delete` lifecycles for every locale with a published entity, which differs from the expected behavior in v4.
 * - `discardDraft` actions triggering both `create` and `delete` lifecycles, leading to potential confusion.
 *
 * MIGRATION GUIDE:
 *
 * For a thorough guide on migrating your lifecycles to document service middlewares, please refer to the following link:
 * [Document Services Middlewares Migration Guide](https://docs.strapi.io/dev-docs/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service)
 *
 * IMPORTANT:
 *
 * Simply uncommenting this file without following the migration guide may result in unexpected behavior and inconsistencies. Ensure that you have completed the migration process before re-enabling this file.
 *
 * ============================================================
 */

// 
// export default {
// 	async afterCreate(event) {
// 		const { result } = event
// 
// 		const locale = result.products.find((item) => item?.attributes?.locale)
// 			.attributes?.locale
// 
// 		const calculateDelivery = () => {
// 			if (result.totalPrice >= 50) {
// 				return 0
// 			}
// 			if (result.totalPrice < 50) {
// 				return result.addressInfo?.officeAddress ? 5 : 7.5
// 			}
// 		}
// 
// 		await new Promise((resolve) => {
// 			resolve(true)
// 		})
// 
// 		// await Promise.all([
// 		// 	sendMailTo('pilyovmartin20@gmail.com', result),
// 		// 	sendMailTo('georgi.yankov.24@gmail.com', result),
// 		// 	sendMailTo('tsvetomir.uzunoff@gmail.com', result),
// 		// ])
// 
// 		// try {
// 		// 	await strapi.plugins['email'].services.email.send({
// 		// 		to: result?.credentialsInfo?.email,
// 		// 		from: 'info.troyka@gmail.com',
// 		// 		subject: selectSubject[locale],
// 		// 		template_id: selectTemplateId[locale],
// 		// 		content: [],
// 		// 		dynamic_template_data: {
// 		// 			order_id: result.orderId.toUpperCase(),
// 		// 			address: result.addressInfo,
// 		// 			office_address: result.addressInfo?.officeAddress,
// 		// 			payment_option: result.payment_method,
// 		// 			payment_method:
// 		//     result.paymentMethod === 'arrive' ? paymentArrive[locale]: paymentCard[locale],
// 		// 			delivery_option: result.addressInfo?.officeAddress
// 		// 				? officeType[locale]
// 		// 				: homeType[locale],
// 		// 			subtotal: result.totalPrice - calculateDelivery(),
// 		// 			total: result.totalPrice - calculateDelivery(),
// 		// 			delivery_price: calculateDelivery(),
// 		// 			billing_address: result?.billingAddressInfo,
// 		// 			products: result.products,
// 		// 		},
// 		// 	})
// 		// } catch (error) {
// 
// 		// 	console.log(JSON.stringify(error), 'Error when sending email.')
// 		// }
// 	},
// }
// 