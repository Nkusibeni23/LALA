import { iconMap, ValidationCardProps } from "@/types/Validation";
import { motion, AnimatePresence } from "framer-motion";

const colors = {
  success: "bg-green-100 text-green-800 border-green-400",
  error: "bg-red-100 text-red-800 border-red-400",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
};

const ValidationCard: React.FC<ValidationCardProps> = ({ type, message }) => {
  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-4 right-4 z-50 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-4 border rounded-lg shadow-lg ${colors[type]} transition-all duration-300 flex items-center`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-lg md:text-2xl mr-4">{iconMap[type]}</div>
        <p className="text-sm flex-1">{message}</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default ValidationCard;
