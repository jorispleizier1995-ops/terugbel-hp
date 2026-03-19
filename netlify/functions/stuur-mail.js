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

  const apiKey = Netlify.env.get('RESEND_API_KEY');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Terugbelformulier HP <onboarding@resend.dev>',
      to: [naar],
      subject: onderwerp,
      text: inhoud
    })
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ ok: false, fout: err }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

export const config = {
  path: '/stuur-mail'
};
