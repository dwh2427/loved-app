import getDateParts from "./getDateParts";
// Initialize Stripe with secret key from environment variables
import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export default async function createStripeAccount({
  page,

  user,
  ip,
  user_agent,
}) {
  try {
    const {
      date_of_birth,
      city,
      street_address,
      state,
      postal_code,
      phone,
      country,
    } = user.additional_info;
    const { day, month, year } = getDateParts(date_of_birth);

    const accountDetails = {
      type: "custom",
      country,
      business_type: "individual",
      email: user.email,
      default_currency: page.currency,
      business_profile: {
        mcc: "5734",
        name: `${page.first_name} ${page.last_name}`,
        url: process.env.NEXT_BUSENESS_URL,
      },
      individual: {
        email: user.email,
        phone: `+${phone}`,
        first_name: page.first_name,
        last_name: page.last_name,

        dob: {
          day: day,
          month: month,
          year: year,
        },
        registered_address: {
          city: city,
          state: state,
          country,
          line1: street_address,
          postal_code: postal_code,
        },
        address: {
          city,
          state,
          country,
          line1: street_address,
          postal_code,
        },
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: ip,
        user_agent: user_agent,
      },
    };

    const account = await stripe.accounts.create(accountDetails);
    return account;
  } catch (error) {
    throw error;
  }
}
