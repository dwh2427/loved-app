// pages/payment.js
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Modal from 'react-modal';
import useApiCaller from '@/hooks/useApiCaller';

export default function PaymentMethodModal({ isOpen, onRequestClose, setPaymentMethodId, setLast4 }) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const apiCaller = useApiCaller()

  useEffect(() => {
    const initializeStripe = async () => {
      // Fetch publishable key from your API
      const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
      setStripe(stripeInstance);
    };

    initializeStripe();
  }, []);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (!isOpen || !stripe) return; // Only fetch when the modal is open and Stripe is initialized

      // Fetch client secret from your API
      const { clientSecret, error: backendError } = await fetch('/send-love/confirm/api').then((res) => res.json());

      if (backendError) {
        setMessages((prevMessages) => [...prevMessages, backendError.message]);
        return;
      }
      setMessages((prevMessages) => [...prevMessages, 'Client secret returned.']);

      // Create Stripe elements
      const elementsInstance = stripe.elements({ clientSecret });
      setElements(elementsInstance);

      // Mount the elements
      const paymentElement = elementsInstance.create('payment');
      paymentElement.mount('#payment-element');
    };

    fetchPaymentIntent();
  }, [isOpen, stripe]); // Re-run effect when modal is open or Stripe is initialized

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
  
    setIsLoading(true);
  
    // Confirm the payment without redirecting
    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // No need for return_url, using redirect: 'if_required' instead
      },
      redirect: 'if_required',
    });
  
    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessages((prevMessages) => [...prevMessages, error.message]);
      } else {
        setMessages((prevMessages) => [...prevMessages, 'An unexpected error occurred.']);
      }
    } else {
      // If payment is confirmed, retrieve payment method details
      const paymentMethodId = paymentIntent.payment_method;
  
  
      // Here, you can make an API call to your server to store the payment method ID for future use

      const data = {  paymentMethodId} ;
  
      const res = await apiCaller.post("/send-love/confirm/api", data);
      const { last4, brand } = res.data;
      setPaymentMethodId(paymentMethodId);
      setLast4(last4);
      onRequestClose();
      // I want to close the popup here if there is res
      setMessages((prevMessages) => [...prevMessages, 'Payment method saved successfully!']);
    }
  
    setIsLoading(false);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Payment Method"
      className="payment-modal"
      overlayClassName="payment-modal-overlay"
    >
      {/* Close Button */}
      <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onRequestClose}>
        &times;
      </button>
  
      <div className="bg-white p-6 rounded-lg max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-center">Add Payment Method</h2>
  
        <form id="payment-form" onSubmit={handleSubmit}>
        {/* Card Payment Element */}
        <div id="payment-element" />
        {/* Submit Button */}
        <button id="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Submit'}
        </button>

        </form>
      </div>
    </Modal>
  );
  
}
