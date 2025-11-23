import { Resend } from 'resend';
import { Order } from '../src/models/order';

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

const adminRecipients = [
  'pilyovmartin20@gmail.com',
  'georgi.yankov.24@gmail.com',
  'tsvetomir.uzunoff@gmail.com',
];


export const sendAdminMail = async (order: Order) => {
  const from = process.env.RESEND_FROM || 'info.troyka@gmail.com';

  const { error } = await resend.emails.send({
    from,
    to: adminRecipients,
    subject: 'Нова поръчка',
    html: `<div>
          <h1>Нова поръчка</h1>
    <h2>Поръка №: ${order.orderId}</h2></br>
    <h3>Адрес:</h3></br>
    <div>Град: ${order.addressInfo.city}</div></br>
    <div>Улица: ${order.addressInfo.street}</div></br>
    <div>Номер на вход/сграда: ${order.addressInfo?.houseNumber}</div></br>
    <div>Пощенски код: ${order.addressInfo?.postalCode}</div></br>
    <h3>Контакти:</h3></br>
            <div>Име: ${order.credentialsInfo?.firstName}</div></br>
            <div>Фамилия: ${order.credentialsInfo?.secondName}</div></br>
            <div>Мобилен: ${order.credentialsInfo?.phoneNumber}</div></br>
            <div>Акаунт: ${order?.user}</div></br>
            <div>Имейл: ${order.credentialsInfo?.email}</div></br>
            <div>Офис адрес: ${order.addressInfo?.officeAddress}</div>
            <h3>Стойност на поръчка: ${order.totalPrice} ЛВ}</h3></div>`,
  });

  if (error) {
    console.error('Resend admin email error', error);
  }
};