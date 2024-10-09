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
          {/* Card Information Section */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Card information</label>
            <div className="mt-2 flex space-x-2 relative">
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
              <div className="flex items-center space-x-1 absolute right-2 bottom-2">
                <img src="../../assets/img/paymentCard/visa.svg" alt="Visa" className="h-6 w-6" />
                <img src="../../assets/img/paymentCard/mastercard.svg" alt="Mastercard" className="h-6 w-6" />
                <img src="../../assets/img/paymentCard/amex.svg" alt="aemx" className="h-6 w-6" />
                <img src="../../assets/img/paymentCard/jcb.svg" alt="jcb" className="h-6 w-6" />
              </div>
            </div>
          </div>
  
          <div className="mt-2 flex space-x-2 relative">
            <input
              type="text"
              placeholder="MM / YY"
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
            <input
              type="text"
              placeholder="CVC"
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
              <div className="flex items-center space-x-1 absolute right-2 bottom-3">
                <img src="../../assets/img/paymentCard/CVC.svg" alt="cvc" className="h-6 w-6" />
              </div>
          </div>
  
          {/* Cardholder Name Section */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Cardholder name</label>
            <input
              type="text"
              placeholder="Full name on card"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
  
          {/* Country or Region Section */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Country or region</label>
            <select
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            >
              <option>United States</option>
              {/* Add more options here */}
            </select>
            <input
              type="text"
              placeholder="ZIP"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
  
          {/* Save Information Section */}
          <div className="mt-4 p-4 bg-gray-100 rounded-md border border-gray-200">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Securely save my information for 1-click checkout</span>
              <label className="text-sm text-gray-500">Optional</label>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <img src="/path/to/flag-icon.png" alt="Flag" className="h-5 w-5" />
              <input
                type="text"
                placeholder="(201) 555-0123"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
  
          {/* Submit Button */}
          <div className="mt-6">
            <button
              id="submit"
              className="w-full px-4 py-3 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-500 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
  
}
