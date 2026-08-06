'use client'

import Sidebar from '@/features/rest-client/components/Sidebar'
import RequestPanel from '@/features/rest-client/components/RequestPanel'
import ResponsePanel from '@/features/rest-client/components/ResponsePanel'
import SplitPane from '@/components/layout/SplitPane'

const PanelHeader = ({ label }: { label: string }) => (
  <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-zinc-50/70 dark:bg-zinc-950/70 backdrop-blur-sm">
    <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">{label}</span>
  </div>
)


export default function RestPage() {
  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SplitPane
          left={
            <>
              <PanelHeader label="Request" />
              <div className="flex-1 overflow-hidden"><RequestPanel /></div>
            </>
          }
          right={
            <>
              <PanelHeader label="Response" />
              <div className="flex-1 overflow-hidden"><ResponsePanel /></div>
            </>
          }
        />
      </div>
    </>
  )
}
