import React from "react";
import { Zap, MousePointerClick, ShieldCheck, Gift } from "lucide-react";

const FEATURES = [
  {
    name: "Fast & Reliable",
    description: "Our tools are optimized for speed and accuracy.",
    icon: Zap,
    colorClass: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    name: "Easy to Use",
    description: "Clean interface, no learning curve. Get things done.",
    icon: MousePointerClick,
    colorClass: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
  },
  {
    name: "Privacy First",
    description: "Your data stays on your device. We respect your privacy.",
    icon: ShieldCheck,
    colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    name: "Always Free",
    description: "100% free tools with no hidden costs or sign-ups.",
    icon: Gift,
    colorClass: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-muted/30 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Title */}
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Why choose InfoLoads?
        </h2>
        <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
          We build tools that save you time, run entirely in your browser, and respect your privacy.
        </p>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center p-4 hover:scale-[1.02] transition-transform"
              >
                {/* Icon Box */}
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ${feature.colorClass}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                {/* Content */}
                <h3 className="mt-6 text-lg font-bold text-foreground">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
