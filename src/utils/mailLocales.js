"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentArrive = exports.paymentCard = exports.homeType = exports.officeType = exports.selectTemplateId = exports.selectSubject = void 0;
exports.selectSubject = {
    it: 'Il tuo ordine!',
    en: 'Your order!',
    bg: 'Вашата поръчка!',
};
exports.selectTemplateId = {
    it: process.env.ORDER_TEMPLATE_IT,
    en: process.env.ORDER_TEMPLATE_EN,
    bg: process.env.ORDER_TEMPLATE_BG,
};
exports.officeType = {
    it: 'Ufficio',
    en: 'Office',
    bg: 'Офис',
};
exports.homeType = {
    it: 'Indirizzo personale',
    en: 'Personal Address',
    bg: 'Личен адрес',
};
exports.paymentCard = {
    it: 'Con carta',
    bg: 'С карта',
    en: 'With credit card',
};
exports.paymentArrive = {
    it: 'Pagamento alla consegna',
    bg: 'Наложен Платеж',
    en: 'Cash on Delivery',
};
