const EASTERN_TIME_ZONE = 'America/New_York';

const easternMidnightInUtc = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const utcNoon = new Date(Date.UTC(year, month - 1, day, 12));
  const zoneName = new Intl.DateTimeFormat('en-US', {
    timeZone: EASTERN_TIME_ZONE,
    timeZoneName: 'shortOffset',
  }).formatToParts(utcNoon).find((part) => part.type === 'timeZoneName')?.value || 'GMT-5';
  const match = zoneName.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  const offsetMinutes = match
    ? (match[1] === '+' ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3] || 0))
    : -300;
  return Math.floor((Date.UTC(year, month - 1, day) - offsetMinutes * 60_000) / 1000);
};

const nextDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + 1));
  return date.toISOString().slice(0, 10);
};

const paymentMethodLabel = (paymentMethod) => {
  if (!paymentMethod) return 'Unknown';
  if (paymentMethod.card) {
    const brand = paymentMethod.card.brand
      ? paymentMethod.card.brand.charAt(0).toUpperCase() + paymentMethod.card.brand.slice(1)
      : 'Card';
    return `${brand} •••• ${paymentMethod.card.last4 || ''}`.trim();
  }
  return paymentMethod.type
    ? paymentMethod.type.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
    : 'Unknown';
};

export async function getSucceededStripePayments(stripe, dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString || '')) {
    const error = new Error('A valid date in YYYY-MM-DD format is required.');
    error.statusCode = 400;
    throw error;
  }

  const start = easternMidnightInUtc(dateString);
  const end = easternMidnightInUtc(nextDate(dateString));
  const payments = [];
  let startingAfter;

  do {
    const page = await stripe.paymentIntents.list({
      created: { gte: start, lt: end },
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
      expand: ['data.customer', 'data.payment_method', 'data.latest_charge'],
    });

    for (const intent of page.data) {
      if (intent.status !== 'succeeded') continue;
      const charge = typeof intent.latest_charge === 'object' ? intent.latest_charge : null;
      const method = typeof intent.payment_method === 'object' ? intent.payment_method : null;
      const customer = typeof intent.customer === 'object' ? intent.customer : null;
      const billing = charge?.billing_details || method?.billing_details || {};
      const customerDetails = charge?.customer_details || {};
      // Payment Links store collected contact details on the Checkout Session,
      // not consistently on the resulting PaymentIntent, Charge, or Customer.
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: intent.id,
        limit: 1,
      });
      const checkoutDetails = sessions.data[0]?.customer_details || {};

      payments.push({
        id: intent.id,
        customer: billing.name || customerDetails.name || checkoutDetails.name || customer?.name || '—',
        email: billing.email || customerDetails.email || checkoutDetails.email || intent.receipt_email || customer?.email || '—',
        phone: billing.phone || customerDetails.phone || checkoutDetails.phone || customer?.phone || '—',
        amountPaid: intent.amount_received,
        currency: intent.currency,
        paymentMethod: paymentMethodLabel(method),
      });
    }

    startingAfter = page.has_more ? page.data.at(-1)?.id : undefined;
  } while (startingAfter);

  return { payments, date: dateString, timeZone: EASTERN_TIME_ZONE };
}
