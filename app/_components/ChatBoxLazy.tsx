'use client'
import dynamic from 'next/dynamic'
import Loading from './Loading'

const ChatBoxLazy = dynamic(() => import('./ChatBox'), {
  loading: () => <Loading />,
})

export default ChatBoxLazy
