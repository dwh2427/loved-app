import { errorResponse } from "@/lib/server-error";
import connectDB from "@/mongodb.config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

connectDB();

export async function POST(req) {
  try {
    const {
      radarSession,
      cardNumberElement,
      tokenId,
      comments,
      name,
      email,
      amount,
      currency,
      application_amount_fee,
      connectedAccountId,
      inputValue
    } = await req.json();
    
    console.log(inputValue);

    const token = cardNumberElement.id;

    const amountInCents = Math.round(Number(amount) * 100);
    const applicationAmountFeeInCents = Math.round(Number(application_amount_fee) * 100);

    // Regular expressions to identify email and phone number
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+\d][\d\s-]+$/;  // Adjust this pattern according to the phone number formats you expect

    const isEmail = emailRegex.test(inputValue);
    const isPhone = phoneRegex.test(inputValue);

    if (applicationAmountFeeInCents > 0) {
      const customerMain = await stripe.customers.create({
        email: email,
        name: name,
      });

      const source2 = await stripe.customers.createSource(customerMain.id, {
        source: tokenId.token.id,
      });

      const Fee = await stripe.charges.create({
        amount: applicationAmountFeeInCents,
        customer: customerMain.id,
        currency: 'usd',
        source: source2.id,
        description: comments,
        radar_options: {
          session: radarSession.id,
        },
        metadata: {
          name: name,
          customer_email: email,
          comments: comments,
        },
      });
    }

    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });

    const source = await stripe.customers.createSource(customer.id, {
      source: token,
    });

    // If connectedAccountId is provided, continue with the existing functionality

      // If connectedAccountId is missing and inputValue is an email or phone number, process the payment for the owner
      if (isEmail || isPhone) {
        const confirmIntent = await stripe.charges.create({
          amount: amountInCents,
          currency: currency,
          customer: customer.id,
          description: comments,
          source: source.id,
          metadata: {
            name: name,
            customer_email: email,
            comments: comments,
          },
        });

        return new Response(JSON.stringify(confirmIntent), { status: 200 });
      }else{
        const confirmIntent = await stripe.charges.create({
          amount: amountInCents,
          currency: currency,
          customer: customer.id,
          description: comments,
          source: source.id,
          metadata: {
            name: name,
            customer_email: email,
            comments: comments,
          },
        }, {
          stripeAccount: connectedAccountId,
        });
  
        return new Response(JSON.stringify(confirmIntent), { status: 200 });
      }
    
  } catch (error) {
    return errorResponse(error.message);
  }
}
