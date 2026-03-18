import { createTransport } from 'nodemailer';

const TOEGESTANE_ADRESSEN = [
  'info@hekwerk-partners.nl',
  'joris@hekwerk-partners.nl',
  'maarten@hekwerk-partners.nl',
  'richard@hekwerk-partners.nl'
];

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const data = await req.json();
  const { naar, onderwerp, inhoud } = data;

  if (!TOEGESTANE_ADRESSEN.includes(naar)) {
    return new Response(JSON.stringify({ ok: false, fout: 'Ongeldig e-mailadres' }), { status: 400 });
  }

  const transporter = createTransport({
    host: 'hekwerkpartners-nl01i.mail.protection.outlook.com',
    port: 25,
    secure: false,
    tls: { rejectUnauthorized: false },
    ignoreTLS: true
  });

  try {
    await transporter.sendMail({
      from: 'Terugbelformulier <info@hekwerk-partners.nl>',
      to: naar,
      subject: onderwerp,
      text: inhoud
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, fout: err.message }), { status: 500 });
  }
};

export const config = {
  path: '/stuur-mail'
};
