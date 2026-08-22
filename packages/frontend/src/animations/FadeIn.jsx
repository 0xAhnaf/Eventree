import { motion } from "framer-motion";

function FadeIn({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      viewport={{
        once: true,
      }}

      transition={{
        duration: 0.7,
      }}
    >
      {children}
    </motion.div>
  );
}

export default FadeIn;
