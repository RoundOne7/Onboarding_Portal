import React, { ReactNode } from "react";
import { motion } from "framer-motion";

// Define the interface for the component props
interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div
    //   whileHover={{
    //     scale: 1.03,
    //     y: -5,
    //   }}
    //   transition={{
    //     type: "spring",
    //     stiffness: 200,
    //     damping: 15,
    //   }}
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-gray-700/90
        backdrop-blur-2xl
        p-6
        shadow-2xl
        cursor-pointer
        group
        before:absolute
        before:inset-0
        before:bg-linear-to-br before:from-white/8 before:to-transparent
        hover:scale-110
        transition
        duration-300
      "
    >
      {/* GLOW EFFECT */}
      <div
        className="
          absolute
          inset-0
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-500
          bg-linear-to-b from-blue-500/40 via-gray-700/90 to-blue-500/50
        "
      />

      {/* CONTENT */}
      <div className="relative z-10">
        {/* ICON */}
        <div className="text-5xl text-white mb-5">
          {icon}
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-white mb-3">
          {title}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-white leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;