import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useEffect, useState } from "react";

export default function PaymentInfo({ clientSecret, setIsPaymentProccess, isSubmitPayment, setPaymentConfirm, setPaymentIntentId, setIsSubmitPayment }) {
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
        setIsSubmitPayment(false); // Notify parent of successful payment
        setIsPaymentProccess(false); // Notify parent of successful payment
        return;
      }

      setIsPaymentProccess(true); // Notify parent of successful payment
      setIsProcessing(true);

      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // You can include additional parameters here if needed
        },
        redirect: 'if_required', // Handle the redirection only if necessary
      });
      
      if (error) {
        setMessage(error.message);
        setIsPaymentProccess(false);
        setIsSubmitPayment(false);
        setPaymentConfirm(false);
      } else if (paymentIntent) {
       
        if (paymentIntent.status === 'succeeded') {
          const paymentIntentId = paymentIntent.id;
          setMessage('Payment successful!');
          setPaymentConfirm(true); // Notify parent of successful payment
          setIsPaymentProccess(true); // Notify parent of successful payment
          // Access the charge ID from the paymentIntent object
          setPaymentIntentId(paymentIntentId);
  
        } else {
          console.error("Payment did not succeed. Status:", paymentIntent.status);
        }

      }
    
      setIsProcessing(false);
      setIsPaymentProccess(false);
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
