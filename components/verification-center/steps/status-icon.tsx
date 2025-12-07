import { LuCheck, LuX, LuMinus } from 'react-icons/lu'
import { PiSpinner } from 'react-icons/pi'
import { motion, AnimatePresence } from 'framer-motion'

type StatusIconProps = {
  status: 'pending' | 'success' | 'error' | 'skipped'
}

export function StatusIcon({ status }: StatusIconProps) {
  return (
    <div className="relative h-[17.6px] w-[17.6px]">
      <AnimatePresence mode="wait">
        {status === 'success' && (
          <motion.div
            key="success"
            className="absolute inset-0 flex items-center justify-center rounded-full bg-emerald-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.05, duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
            >
              <LuCheck className="h-[8.8px] w-[8.8px] text-white" />
            </motion.div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            className="absolute inset-0 flex items-center justify-center rounded-full bg-red-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.05, duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
            >
              <LuX className="h-[8.8px] w-[8.8px] text-white" />
            </motion.div>
          </motion.div>
        )}

        {status === 'pending' && (
          <motion.div
            key="pending"
            className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-500"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
          >
            <PiSpinner className="h-[12px] w-[12px] text-white animate-spin" />
          </motion.div>
        )}

        {status === 'skipped' && (
          <motion.div
            key="skipped"
            className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
          >
            <LuMinus className="h-[8.8px] w-[8.8px] text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
