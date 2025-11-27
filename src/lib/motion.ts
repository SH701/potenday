import { Variants } from "framer-motion";

export const FadeLeft: Variants = {
  init: {
    x: -100,
    opacity: 0,
  },
  on: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};
