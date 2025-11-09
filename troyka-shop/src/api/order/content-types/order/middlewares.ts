import {
	homeType,
	officeType,
	paymentArrive,
	paymentCard,
	selectSubject,
	selectTemplateId,
} from '../../../../utils/mailLocales'

export default {
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
}
