import StripeCheckout from 'react-stripe-checkout';

const STRIPE_PUBLISHABLE = 'pk_test_51JBbEHBhydgMPy6qXCKgxv0fhrYwSobugmQ1bcHXKbeHmXM8A1Zv6jByi6TKC67Ax9BHXsp50kSwrT6tjMiyRy1y008G0mKkkM';

const onToken = (user,checkout) => token => 
    checkout(user, token.id);

const Checkout = ({ amount, user, checkout }) => 
    <StripeCheckout
      amount={amount*100}
      token={onToken(user,checkout)}
      currency='INR'
      stripeKey={STRIPE_PUBLISHABLE}
/>

export default Checkout;
