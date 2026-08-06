'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { KeyValuePair, COMMON_HEADER_NAMES, COMMON_CONTENT_TYPES } from '@/types/rest'
import { generateId } from '@/features/rest-client/lib/request'

interface Props {
  pairs: KeyValuePair[]
  onChange: (pairs: KeyValuePair[]) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
  /** Show datalist suggestions for common header names + Content-Type values. */
  suggestHeaders?: boolean
}

export default function KeyValueEditor({
  pairs,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  suggestHeaders = false,
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
              className="w-4 h-4 shrink-0 cursor-pointer accent-violet-600"
            />
            <input
              type="text"
              value={pair.key}
              onChange={(e) => update(pair.id, 'key', e.target.value)}
              placeholder={keyPlaceholder}
              list={suggestHeaders ? 'header-name-options' : undefined}
              className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60 rounded-lg px-3 py-1.5 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-violet-400 dark:focus:border-violet-600/50 font-mono transition-colors"
            />
            <input
              type="text"
              value={pair.value}
              onChange={(e) => update(pair.id, 'value', e.target.value)}
              placeholder={valuePlaceholder}
              list={
                suggestHeaders && pair.key.trim().toLowerCase() === 'content-type'
                  ? 'content-type-options'
                  : undefined
              }
              className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/60 rounded-lg px-3 py-1.5 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-violet-400 dark:focus:border-violet-600/50 font-mono transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => remove(pair.id)}
              className="text-zinc-400 hover:text-red-500 dark:text-zinc-700 dark:hover:text-red-400 transition-colors px-1 shrink-0 text-lg leading-none"
            >
              ×
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ x: 2 }}
        onClick={add}
        className="self-start mt-1 text-xs text-zinc-400 hover:text-violet-600 dark:text-zinc-600 dark:hover:text-violet-400 transition-colors"
      >
        + Add row
      </motion.button>

      {suggestHeaders && (
        <>
          <datalist id="header-name-options">
            {COMMON_HEADER_NAMES.map((h) => (
              <option key={h} value={h} />
            ))}
          </datalist>
          <datalist id="content-type-options">
            {COMMON_CONTENT_TYPES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </>
      )}
    </div>
  )
}
