"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51OD7X2SGxfAbFy2L9HhqRfde5HzpY5pAb1LsDvgWMfNOyCjh9djhd8Me7TFODBFP7HArIWdBkDwNHvaHLpCxhsI300zZDZU0MO"
);

interface Tier {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  description: string;
  features: string[];
  plan: string;
}

const tiers: Tier[] = [
  {
    name: "Basic",
    monthlyPrice: "$9.99",
    annualPrice: "$95.90",
    description: "Essential AI coaching for individuals",
    features: ["1 AI Coach", "5 coaching sessions/month", "Basic reporting"],
    plan: "basic",
  },
  {
    name: "Pro",
    monthlyPrice: "$29.99",
    annualPrice: "$287.90",
    description: "Advanced coaching for professionals",
    features: [
      "3 AI Coaches",
      "Unlimited sessions",
      "Advanced analytics",
      "Priority support",
    ],
    plan: "pro",
  },
  {
    name: "Business",
    monthlyPrice: "$99.99",
    annualPrice: "$959.90",
    description: "Comprehensive solution for teams",
    features: [
      "10 AI Coaches",
      "Team collaboration features",
      "Custom integrations",
      "Dedicated success manager",
    ],
    plan: "business",
  },
  {
    name: "Enterprise",
    monthlyPrice: "Contact us",
    annualPrice: "Contact us",
    description: "Tailored solutions for organizations",
    features: [
      "Custom AI Coaches",
      "Team management",
      "API access",
      "Dedicated account manager",
    ],
    plan: "enterprise",
  },
];

const featureComparison = [
  {
    feature: "Capture video based guides",
    free: true,
    pro: true,
    business: true,
    enterprise: true,
  },
  {
    feature: "Drag-and-drop video editor",
    free: false,
    pro: true,
    business: true,
    enterprise: true,
  },
  {
    feature: "Quick search",
    free: true,
    pro: true,
    business: false,
    enterprise: true,
  },
  {
    feature: "Record voiceovers",
    free: false,
    pro: true,
    business: true,
    enterprise: true,
  },
  {
    feature: "Motion and Transitions",
    free: false,
    pro: true,
    business: true,
    enterprise: true,
  },
  {
    feature: "Auto Subtitles",
    free: false,
    pro: true,
    business: false,
    enterprise: true,
  },
];

const faqs = [
  {
    question: "What is AgentCoach.AI?",
    answer:
      "AgentCoach.AI is an advanced AI-powered coaching platform designed to help individuals and organizations improve their skills and performance through personalized AI coaching sessions.",
  },
  {
    question: "How does the AI coaching work?",
    answer:
      "Our AI coaches use advanced natural language processing and machine learning algorithms to analyze your inputs, provide personalized feedback, and guide you through tailored coaching sessions to help you achieve your goals.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "We offer a 7-day free trial for our Basic plan. You can experience the power of AI coaching without any commitment.",
  },
];

export default function PricingPage(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubscribe = async (plan: string): Promise<void> => {
    if (plan === "enterprise") {
      alert("Please contact us to subscribe to the Enterprise plan.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3001/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan }),
        }
      );

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error("Error:", error);
        }
      } else {
        console.error("Stripe not loaded");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a2035] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
          AgentCoach.AI Pricing
        </h1>
        <p className="text-xl text-center mb-12 text-gray-400">
          Choose the perfect plan for your coaching needs
        </p>

        <Tabs defaultValue="monthly" className="mb-12">
          <TabsList className="bg-[#232b3e] grid w-full grid-cols-2 max-w-[400px] mx-auto my-10 h-fit">
            <TabsTrigger
              value="monthly"
              className="p-2 data-[state=active]:bg-[#4a90e2] data-[state=active]:text-white"
            >
              Monthly Billing
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              className="p-2 data-[state=active]:bg-[#4a90e2] data-[state=active]:text-white"
            >
              Annual Billing
            </TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tiers.map((tier) => (
                <PricingCard
                  key={tier.name}
                  tier={tier}
                  price={tier.monthlyPrice}
                  billingPeriod="month"
                  onSubscribe={handleSubscribe}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="annual">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tiers.map((tier) => (
                <PricingCard
                  key={tier.name}
                  tier={tier}
                  price={tier.annualPrice}
                  billingPeriod="year"
                  onSubscribe={handleSubscribe}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Plans Comparison
          </h2>
          <div className="bg-[#232b3e] rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-[#3a4358]">
              <div className="font-semibold">Feature</div>
              <div className="font-semibold text-center">Free</div>
              <div className="font-semibold text-center">Pro</div>
              <div className="font-semibold text-center">Business</div>
              <div className="font-semibold text-center">Enterprise</div>
            </div>
            {featureComparison.map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-5 gap-4 p-4 ${
                  index % 2 === 0 ? "bg-[#2a3346]" : ""
                }`}
              >
                <div>{row.feature}</div>
                <div className="text-center flex justify-center items-center">
                  {renderFeatureValue(row.free)}
                </div>
                <div className="text-center flex justify-center items-center">
                  {renderFeatureValue(row.pro)}
                </div>
                <div className="text-center flex justify-center items-center">
                  {renderFeatureValue(row.business)}
                </div>
                <div className="text-center flex justify-center items-center">
                  {renderFeatureValue(row.enterprise)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-[#3a4358]"
              >
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

interface PricingCardProps {
  tier: Tier;
  price: string;
  billingPeriod: string;
  onSubscribe: (plan: string) => Promise<void>;
  isLoading: boolean;
}

function PricingCard({
  tier,
  price,
  billingPeriod,
  onSubscribe,
  isLoading,
}: PricingCardProps) {
  return (
    <Card className="bg-[#232b3e] border-[#3a4358] flex flex-col text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#4a90e2]">
          {tier.name}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {tier.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold mb-4">
          {price}
          {tier.plan !== "enterprise" && (
            <span className="text-sm font-normal">/{billingPeriod}</span>
          )}
        </p>
        <ul className="space-y-2">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-[#4a90e2]" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full bg-[#4a90e2] hover:bg-[#3a7bc8]"
          onClick={() => onSubscribe(tier.plan)}
          disabled={isLoading}
        >
          {tier.plan === "enterprise" ? "Contact Us" : "Choose Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function renderFeatureValue(value: string | boolean) {
  if (typeof value === "boolean") {
    return value ? (
      <CheckCircle2 className="text-green-500" />
    ) : (
      <XCircle className="text-red-500" />
    );
  }
  return value;
}
