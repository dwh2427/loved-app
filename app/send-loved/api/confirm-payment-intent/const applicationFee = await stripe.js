    const applicationFee = await stripe.charges.create({
      amount: applicationAmountFeeInCents,
      currency: currency,
      description: comments,
      card:{
        'token' : token
      },
    },{
          stripeAccount: connectedAccountId,
    });

    