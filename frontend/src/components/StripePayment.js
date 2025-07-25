import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import './StripePayment.css';

// Load Stripe with explicit configuration
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY, {
  locale: 'en'
});

console.log('Stripe publishable key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const StripePayment = ({ 
  totalAmount, 
  selectedBundles, 
  paymentMethod,
  onPaymentSuccess,
  onPaymentError,
  customerInfo,
  disabled = false
}) => {
  // Simple wrapper that ensures Stripe loads before rendering form
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    stripePromise.then(() => {
      setStripeLoaded(true);
      console.log('Stripe loaded successfully');
    }).catch((error) => {
      console.error('Stripe failed to load:', error);
    });
  }, []);

  if (!stripeLoaded) {
    return (
      <div className="stripe-payment-form">
        <div className="loading-stripe">
          <div className="spinner"></div>
          <p>Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        totalAmount={totalAmount}
        selectedBundles={selectedBundles}
        paymentMethod={paymentMethod}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        customerInfo={customerInfo}
        disabled={disabled}
      />
    </Elements>
  );
};

const PaymentForm = ({ 
  totalAmount, 
  selectedBundles, 
  paymentMethod,
  onPaymentSuccess,
  onPaymentError,
  customerInfo,
  disabled
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState(null);

  // Debug logging with better formatting
  useEffect(() => {
    console.log('PaymentForm initialized:');
    console.log('- Stripe instance:', !!stripe);
    console.log('- Elements instance:', !!elements);
    console.log('- Disabled state:', disabled);
  }, [stripe, elements, disabled]);

  const handleCardChange = (event) => {
    console.log('CardElement onChange event:', {
      empty: event.empty,
      complete: event.complete,
      error: event.error?.message || null,
      brand: event.brand || null
    });
    
    setCardError(event.error ? event.error.message : null);
    setCardComplete(event.complete);
    
    // Clear any existing payment errors when user starts typing
    if (paymentError && !event.empty) {
      setPaymentError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || disabled) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    
    // Check if card information is complete
    if (!cardComplete) {
      setPaymentError('Please complete all card information before submitting.');
      return;
    }

    setProcessing(true);
    setPaymentError('');
    
    // If this is a retry, increment the retry count
    if (paymentError) {
      setRetryCount(prev => prev + 1);
    }

    try {
      // Create payment method
      const { error: methodError, paymentMethod: method } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerInfo.name,
          email: customerInfo.email,
        },
      });

      if (methodError) {
        let errorMessage = methodError.message;
        
        // Provide user-friendly error messages for common card issues
        if (methodError.code === 'incomplete_number') {
          errorMessage = 'Your card number is incomplete. Please check and try again.';
        } else if (methodError.code === 'incomplete_cvc') {
          errorMessage = 'Your card security code is incomplete. Please check and try again.';
        } else if (methodError.code === 'incomplete_expiry') {
          errorMessage = 'Your card expiry date is incomplete. Please check and try again.';
        } else if (methodError.code === 'invalid_number') {
          errorMessage = 'Your card number is invalid. Please check and try again.';
        } else if (methodError.code === 'invalid_expiry_month' || methodError.code === 'invalid_expiry_year') {
          errorMessage = 'Your card expiry date is invalid. Please check and try again.';
        } else if (methodError.code === 'invalid_cvc') {
          errorMessage = 'Your card security code is invalid. Please check and try again.';
        }
        
        setPaymentError(errorMessage);
        setProcessing(false);
        if (onPaymentError) onPaymentError(methodError);
        return;
      }

      // Create subscription via backend
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/payments/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          payment_method_id: method.id,
          bundles: selectedBundles,
          payment_interval: paymentMethod, // 'monthly' or 'yearly'
          customer_info: customerInfo
        })
      });

      const subscriptionData = await response.json();

      if (response.ok) {
        if (subscriptionData.requires_action) {
          // Handle 3D Secure authentication
          const { error: confirmError } = await stripe.confirmCardPayment(
            subscriptionData.payment_intent_client_secret
          );

          if (confirmError) {
            let errorMessage = confirmError.message;
            // Provide user-friendly error messages
            if (confirmError.code === 'card_declined') {
              errorMessage = 'Your card was declined. Please try a different payment method or contact your bank.';
            } else if (confirmError.code === 'expired_card') {
              errorMessage = 'Your card has expired. Please use a different payment method.';
            } else if (confirmError.code === 'insufficient_funds') {
              errorMessage = 'Insufficient funds. Please try a different payment method.';
            } else if (confirmError.code === 'incorrect_cvc') {
              errorMessage = 'Your card security code is incorrect. Please check and try again.';
            } else if (confirmError.code === 'processing_error') {
              errorMessage = 'A temporary processing error occurred. Please try again in a few minutes.';
            }
            
            setPaymentError(errorMessage);
            if (onPaymentError) onPaymentError(confirmError);
          } else {
            setPaymentSuccess(true);
            if (onPaymentSuccess) onPaymentSuccess(subscriptionData);
          }
        } else {
          setPaymentSuccess(true);
          if (onPaymentSuccess) onPaymentSuccess(subscriptionData);
        }
      } else {
        let errorMessage = subscriptionData.message || 'Payment failed. Please try again.';
        
        // Handle common backend errors
        if (subscriptionData.message?.includes('Authentication')) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (subscriptionData.message?.includes('Card error')) {
          errorMessage = subscriptionData.message.replace('Card error: ', '');
        } else if (subscriptionData.message?.includes('Rate limit')) {
          errorMessage = 'Too many attempts. Please wait a moment and try again.';
        }
        
        setPaymentError(errorMessage);
        if (onPaymentError) onPaymentError(new Error(subscriptionData.message));
      }
    } catch (error) {
      console.error('Payment error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      // Handle network errors
      if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.message?.includes('Authentication')) {
        errorMessage = 'Session expired. Please log in again.';
      }
      
      setPaymentError(errorMessage);
      if (onPaymentError) onPaymentError(error);
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <div className="success-icon">✓</div>
        <h3>Payment Successful!</h3>
        <p>Your subscription has been activated. Welcome to MEWAYZ V2!</p>
      </div>
    );
  }

  return (
    <div className="stripe-payment-form">
      <div className="payment-summary">
        <h3>Payment Summary</h3>
        <div className="summary-row">
          <span>Total Amount:</span>
          <span>${totalAmount.toFixed(2)}/{paymentMethod === 'monthly' ? 'month' : 'year'}</span>
        </div>
        <div className="bundle-list">
          {selectedBundles.map((bundleId, index) => (
            <div key={index} className="bundle-item">
              {bundleId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Bundle
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="card-element-container">
          <label>Card Details</label>
          <CardElement
            onChange={handleCardChange}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  backgroundColor: '#18181b',
                  '::placeholder': {
                    color: '#a1a1aa',
                  },
                  iconColor: '#a1a1aa',
                },
                invalid: {
                  color: '#ef4444',
                  iconColor: '#ef4444',
                }
              },
              hidePostalCode: true,
            }}
            className="card-element"
          />
        </div>

        {(paymentError || cardError) && (
          <div className="payment-error">
            {paymentError || cardError}
            {retryCount > 0 && (
              <div className="retry-info">
                <small>Attempt {retryCount + 1}</small>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || processing || disabled || !cardComplete}
          className="payment-button"
        >
          {processing ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            `Subscribe for $${totalAmount.toFixed(2)}/${paymentMethod === 'monthly' ? 'mo' : 'yr'}`
          )}
        </button>
      </form>

      <div className="payment-security">
        <div className="security-badges">
          <span className="security-badge">🔒 SSL Secured</span>
          <span className="security-badge">💳 Stripe Protected</span>
          <span className="security-badge">🛡️ PCI Compliant</span>
        </div>
        <p className="security-text">
          Your payment information is encrypted and secure. We use Stripe for payment processing.
        </p>
      </div>
    </div>
  );
};

export default StripePayment;