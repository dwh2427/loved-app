import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import Modal from 'react-modal';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// Custom styles for the modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    borderRadius: '12px',
    padding: '20px',
  },
};

export default function PaymentMethodModal({ isOpen, onRequestClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState(null);

  // Initialize PaymentRequestButton for Apple Pay/Google Pay
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total',
          amount: 5000, // Example amount in cents ($50.00)
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return; // Ensure Stripe is loaded

    setLoading(true);

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    // Create payment method with individual elements
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: {
        number: cardNumberElement,
        exp_month: cardExpiryElement,
        exp_year: cardExpiryElement,
        cvc: cardCvcElement,
      },
    });

    if (error) {
      console.error('[error]', error);
      setLoading(false);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // Send paymentMethod.id to your server to attach it to a customer
      setLoading(false);
      onRequestClose(); // Close modal on success
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Add Payment Method"
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Add Payment Method</h2>

        {/* Apple Pay / Google Pay Button */}
        {paymentRequest && (
          <div className="mb-4">
            <PaymentRequestButtonElement options={{ paymentRequest }} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number Element */}
          <div className="border p-3 rounded-lg">
            <label>Card Number</label>
            <CardNumberElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>

          {/* Expiration Date Element */}
          <div className="border p-3 rounded-lg">
            <label>Expiration Date</label>
            <CardExpiryElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />

          </div>

          {/* CVC Element */}
          <div className="border p-3 rounded-lg">
            <label>CVC</label>

            <CardCvcElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 text-white bg-pink-400 rounded-lg font-semibold transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-500'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>
    </Modal>
  );
}
