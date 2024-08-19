import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useEffect, useState } from "react";

export default function PaymentInfo({ clientSecret, setIsPaymentProccess, isSubmitPayment, setPaymentConfirm }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!stripe || !elements || !clientSecret) {
      return;
    }
  }, [stripe, elements, clientSecret]);

  useEffect(() => {
    if (isSubmitPayment) {
      handlePaymentConfirmation(); // Trigger payment confirmation when isSubmitPayment is true
    }
  }, [isSubmitPayment]);

  const handlePaymentConfirmation = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
      },
      redirect: 'if_required', // Handle the redirection only if necessary
    });

    if (error) {
      setMessage(error.message);
      setPaymentConfirm(false);
    } else {
      setMessage('Payment successful!');
      setPaymentConfirm(true); // Notify parent of successful payment
      setIsPaymentProccess(true); // Notify parent of successful payment
    }
    setIsProcessing(false);
  };

  return (
    <div>
      <div id="payment-element">
        <PaymentElement />
      </div>
      {message && <div>{message}</div>}
    </div>
  );
}
