'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { KeyValuePair } from '@/lib/types'
import { generateId } from '@/lib/request'

interface Props {
  pairs: KeyValuePair[]
  onChange: (pairs: KeyValuePair[]) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export default function KeyValueEditor({
  pairs,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}: Props) {
  const update = (id: string, field: keyof KeyValuePair, value: string | boolean) =>
    onChange(pairs.map((p) => (p.id === id ? { ...p, [field]: value } : p)))

  const remove = (id: string) => {
    const next = pairs.filter((p) => p.id !== id)
    onChange(next.length ? next : [{ id: generateId(), key: '', value: '', enabled: true }])
  }

  const add = () =>
    onChange([...pairs, { id: generateId(), key: '', value: '', enabled: true }])

  return (
    <div className="flex flex-col gap-1.5">
      <AnimatePresence initial={false}>
        {pairs.map((pair) => (
          <motion.div
            key={pair.id}
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 overflow-hidden"
          >
            <input
              type="checkbox"
              checked={pair.enabled}
              onChange={(e) => update(pair.id, 'enabled', e.target.checked)}
              className="w-4 h-4 shrink-0 cursor-pointer accent-orange-500"
            />
            <input
              type="text"
              value={pair.key}
              onChange={(e) => update(pair.id, 'key', e.target.value)}
              placeholder={keyPlaceholder}
              className="flex-1 bg-zinc-900 border border-zinc-700/60 rounded px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 font-mono transition-colors"
            />
            <input
              type="text"
              value={pair.value}
              onChange={(e) => update(pair.id, 'value', e.target.value)}
              placeholder={valuePlaceholder}
              className="flex-1 bg-zinc-900 border border-zinc-700/60 rounded px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 font-mono transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => remove(pair.id)}
              className="text-zinc-700 hover:text-red-400 transition-colors px-1 shrink-0 text-lg leading-none"
            >
              ×
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ x: 2 }}
        onClick={add}
        className="self-start mt-1 text-xs text-zinc-600 hover:text-orange-400 transition-colors"
      >
        + Add row
      </motion.button>
    </div>
  )
}
