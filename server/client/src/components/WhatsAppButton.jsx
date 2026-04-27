import { motion } from 'framer-motion';
import { FiMessageCircle } from 'react-icons/fi';

const PHONE = '919529882920';

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: 'spring' }}>
        <a
          href={`https://wa.me/${PHONE}`}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-11 items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
          style={{ background: 'var(--color-brand)' }}
          aria-label="Live chat"
        >
          <FiMessageCircle className="h-5 w-5" style={{ color: 'var(--color-cyan)' }} />
          <span className="leading-tight">
            Chat · <span style={{ color: 'var(--color-green)' }}>{'Avg wait time: < 1 min'}</span>
          </span>
        </a>
      </motion.div>
    </div>
  );
}
