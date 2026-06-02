'use client'

import { motion } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import RequestPanel from '@/components/RequestPanel'
import ResponsePanel from '@/components/ResponsePanel'
import SplitPane from '@/components/SplitPane'
import { useUIStore } from '@/store/useUIStore'

const PanelHeader = ({ label }: { label: string }) => (
  <div className="px-4 py-2.5 border-b border-zinc-800 shrink-0">
    <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">{label}</span>
  </div>
)

export default function Home() {
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-screen overflow-hidden"
    >
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800 shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="text-zinc-600 hover:text-zinc-300 transition-colors text-lg leading-none"
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </motion.button>

          {!sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center text-xs text-white font-bold">
                ⚡
              </div>
              <span className="font-bold text-zinc-400 text-sm">API Forge</span>
            </motion.div>
          )}
        </div>

        {/* Main split pane */}
        <SplitPane
          left={
            <>
              <PanelHeader label="Request" />
              <div className="flex-1 overflow-hidden">
                <RequestPanel />
              </div>
            </>
          }
          right={
            <>
              <PanelHeader label="Response" />
              <div className="flex-1 overflow-hidden">
                <ResponsePanel />
              </div>
            </>
          }
        />
      </div>
    </motion.div>
  )
}
