# AgentCoach.AI Pricing Page Component

This React component implements a pricing page for AgentCoach.AI, displaying various subscription tiers, a feature comparison table, and customer testimonials.

## Dependencies

- React
- shadcn-ui
- @stripe/stripe-js (for Stripe integration)

## Stripe Integration

The component uses Stripe for handling payments. Ensure that the Stripe publishable key is correctly set and that the backend endpoint for creating checkout sessions is properly configured.

## Component Structure

- PricingPage (main component)
  - Tabs (for switching between monthly and annual billing)
  - PricingCard (sub-component for individual pricing tiers)
  - Testimonial Card
  - Contact Link

## Key Features

1. Toggle between monthly and annual billing
2. Display of multiple pricing tiers
3. Feature comparison table
4. Integration with Stripe for checkout
5. Responsive design for various screen sizes

## Props and Interfaces

### Tier Interface

```typescript
interface Tier {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  description: string;
  features: string[];
  plan: string;
}
```

### PricingCardProps Interface

```typescript
interface PricingCardProps {
  tier: Tier;
  price: string;
  billingPeriod: string;
  onSubscribe: (plan: string) => Promise<void>;
  isLoading: boolean;
}
```

## Main Component: PricingPage

The PricingPage component is the main container for the pricing page. It manages the state for:

- Loading state (`isLoading`)
- Billing period (`billingPeriod`)

Key functionalities:

- Renders pricing tiers using the `PricingCard` component
- Implements tab switching between monthly and annual billing
- Handles subscription process through the `handleSubscribe` function
- Displays feature comparison table
- Shows customer testimonial
- Provides a link for additional questions

## Sub-Component: PricingCard

The PricingCard component renders individual pricing tiers. It displays:

- Tier name
- Price
- Description
- Features
- Subscribe button

## Styling

The component uses Tailwind CSS for styling, with custom color schemes to match the AgentCoach.AI brand. Key color variables:

- Background: `#1a2035`
- Card Background: `#232b3e`
- Accent Color: `#4a90e2`

## Usage

To use this component, import it into your Next.js page or layout:

```jsx
import PricingPage from "@/components/PricingPage";

export default function Page() {
  return <PricingPage />;
}
```

Note: Ensure that all required dependencies are installed and that the Stripe publishable key is correctly set up in your environment.
