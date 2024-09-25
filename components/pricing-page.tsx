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
// import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Star, XCircle } from "lucide-react";
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
    name: "Free",
    monthlyPrice: "$0",
    annualPrice: "$0",
    description: "Essential AI coaching for individuals",
    features: ["General AI Coach only, Usage limits"],
    plan: "free",
  },
  {
    name: "Individual",
    monthlyPrice: "$29.95",
    annualPrice: "$285",
    description: "Advanced coaching for professionals",
    features: [
      "General AI Coach ",
      "Access to all specialized coaches",
      "No usage limits",
      "Single user access",
    ],
    plan: "individual",
  },
  {
    name: "Team",
    monthlyPrice: "$49.95",
    annualPrice: "$445",
    description: "Comprehensive solution for teams",
    features: [
      "General AI Coach ",
      "Access to all specialized coaches",
      "No usage limits",
      "Access for upto 5 users",
    ],
    plan: "team",
  },
  {
    name: "Organization",
    monthlyPrice: "Contact us",
    annualPrice: "Contact us",
    description: "Tailored solutions for organizations",
    features: [
      "Custom AI Coaches",
      "Team management",
      "API access",
      "Dedicated account manager",
    ],
    plan: "organization",
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

export default function PricingPage(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [billingPeriod, setBillingPeriod] = useState<string>("monthly");

  const handleSubscribe = async (plan: string): Promise<void> => {
    if (plan === "free") {
      alert("Please sign up for the free plan directly from the app.");
      return;
    }

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
          body: JSON.stringify({ plan, billingPeriod }),
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
              onClick={() => setBillingPeriod("monthly")}
              className="p-2 data-[state=active]:bg-[#4a90e2] data-[state=active]:text-white"
            >
              Monthly Billing
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              onClick={() => setBillingPeriod("annual")}
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
        <div className="mb-16">
          <Card className="bg-[#3a4358] border-0 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <div className="bg-white text-[#1a2035] px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  {/* <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="High Performer"
                    width={24}
                    height={24}
                    className="mr-2"
                  /> */}
                  High Performer Spring 2023
                </div>
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-white">
                &quot;Truly a game changer for documentation across all
                functions&quot;
              </h3>
              <p className="text-center text-gray-300 mb-6 lg:w-1/2 mx-auto">
                &quot;AgentCoach.AI is easy to use and powerful. Ever had a
                situation where you need to schedule time with a colleague to
                show them how to do something, but schedules don&apos;t align?
                Make a quick AgentCoach.AI in these cases, creating can take as
                little as a minute (seriously).&quot;
              </p>
              <div className="text-center mb-6">
                <p className="font-semibold text-white">Chris Widner</p>
                <p className="text-sm text-gray-400">
                  Business Operations Automation Lead
                </p>
                <p className="text-sm text-gray-400">IDK</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Still Have Questions?
          </h2>
          <Link href="/contact" className="text-[#4a90e2]">
            Reach Out
          </Link>
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
