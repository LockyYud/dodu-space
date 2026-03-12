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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="opacity-0"
    >
      {children}
    </motion.section>
  );
}
