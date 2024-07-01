import { errorResponse } from "@/lib/server-error";
import connectDB from "@/mongodb.config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

connectDB();

export async function POST(req) {
  try {
    const {
      cardNumberElement,
      tokenId,
      comments,
      name,
      email,
      amount,
      currency,
      application_amount_fee,
      connectedAccountId,
    } = await req.json();
    
    const token = cardNumberElement.id;

    //const tokenObject =JSON.stringify(cardNumberElement);
    const customer = await stripe.customers.create({
      email: email,
      name: name,
    }, {
      stripeAccount: connectedAccountId,
    });

    const source = await stripe.customers.createSource(customer.id, {
      source: token,
    }, {
      stripeAccount: connectedAccountId,
    });


    const amountInCents = Math.round(Number(amount) * 100);
    const applicationAmountFeeInCents = Math.round(Number(application_amount_fee) * 100);
    const confirmIntent = await stripe.charges.create({
      amount: amountInCents,
      currency: currency,
      customer: customer.id,
      description: comments,
      source: source.id,
    },{
          stripeAccount: connectedAccountId,
    });

    
    if(applicationAmountFeeInCents> 0){
      const customerMain = await stripe.customers.create({
        email: email,
        name: name,
      });

      const source2 = await stripe.customers.createSource(customerMain.id, {
        source: tokenId.token.id,
      });
      const Fee = await stripe.charges.create({
        amount: applicationAmountFeeInCents,
        customer:customerMain.id,
        currency: 'usd',
        source: source2.id,
        description: comments,
      });

    }



    return new Response(JSON.stringify(confirmIntent), { status: 200 });
  } catch (error) {
    // If an error occurs, return an error response
    return errorResponse(error.message);
  }
}
