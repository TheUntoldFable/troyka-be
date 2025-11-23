import type { Context } from 'koa';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

type SendBody = {
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
};

export default {
  async send(ctx: Context) {
    const { to, subject, text, html } = (ctx.request.body || {}) as SendBody;

    if (!to || !subject || (!text && !html)) {
      // Strapi helper, available on ctx
      // 400 Bad Request
      // @ts-ignore if TS complains about badRequest
      return ctx.badRequest(
        'Missing "to", "subject" or email content ("text" or "html").'
      );
    }

    try {
      const from = process.env.RESEND_FROM || 'no-reply@example.com';

      const { error } = await resend.emails.send({
        from,
        to,
        subject,
        text: text || undefined,
        html: html || undefined,
      });

      if (error) {
        // global strapi object, provided by Strapi at runtime
        // @ts-ignore if TS complains about strapi
        strapi.log.error('Resend error', error);
        // @ts-ignore
        return ctx.internalServerError('Failed to send email');
      }

      ctx.body = { ok: true };
    } catch (err) {
      // @ts-ignore
      strapi.log.error('Unexpected error sending email via Resend', err);
      // @ts-ignore
      return ctx.internalServerError('Failed to send email');
    }
  },
};