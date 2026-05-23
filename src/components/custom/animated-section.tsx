"use client";

import { motion, useReducedMotion } from "framer-motion";

type AnimatedSectionProps = Readonly<{
  children: React.ReactNode;
}>;

export function AnimatedSection({ children }: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <section className="opacity-100">{children}</section>;
  }

  return (
    <motion.section
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
