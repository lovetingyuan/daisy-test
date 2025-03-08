import ChatBoxLazy from './_components/ChatBox'
import QuestionLibLazy from './_components/QuestionLibLazy'
import Tab from './_components/Tab'

export default function Home() {
  return (
    <main className="font-[family-name:var(--font-geist-sans)] h-dvh flex flex-col overflow-hidden">
      <div role="tablist" className="tabs tabs-border tabs-bottom flex-grow overflow-hidden">
        <Tab id={'q&a'} key={'q&a'} title={'Q&A'} Component={QuestionLibLazy} />
        <Tab id={'chat'} key={'chat'} title={'Chat'} defaultActive Component={ChatBoxLazy} />
      </div>
    </main>
  )
}
