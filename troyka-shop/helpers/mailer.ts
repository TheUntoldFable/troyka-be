import sgMail from '@sendgrid/mail'
import { Order } from '../src/models/order'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendMailTo = async (recipient: string, order: Order) => {
	await sgMail.send({
		to: recipient,
		from: 'info.troyka@gmail.com',
		subject: 'Нова поръчка',
		html: `<div><h2>Поръка №: ${order.orderId}</h2></br>
            <div>Адрес:</div></br>
            <div>Град: ${order.addressInfo.city}</div></br>
            <div>Улица: ${order.addressInfo.street}</div></br>
            <div>Номер на вход/сграда: ${order.addressInfo?.houseNumber}</div></br>
            <div>Пощенски код: ${order.addressInfo?.postalCode}</div></br>
            <div>Име: ${order.credentialsInfo?.firstName}</div></br>
            <div>Фамилия: ${order.credentialsInfo?.secondName}</div></br>
            <div>Мобилен: ${order.credentialsInfo?.phoneNumber}</div></br>
            <div>Акаунт: ${order?.user}</div></br>
            <div>Имейл: ${order.credentialsInfo?.email}</div></br>
            <div>Офис адрес: ${order.addressInfo?.officeAddress}</div>
            <h3>Стойност на поръчка: ${order.totalPrice} ЛВ}</h3></div>`,
	})
}
