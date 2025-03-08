'use client'

import { useChat } from '@ai-sdk/react'
import MarkdownContent from './MarkdownContent'

// import TextareaAutosize from 'react-textarea-autosize'
import {
  createContext,
  memo,
  // startTransition,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

import Icon from './Icon'
import messages from './messages'

const AssistantMessage = memo(
  function AssistantMessageInner(props: {
    message: ReturnType<typeof useChat>['messages'][number]
    isLoading?: boolean
  }) {
    const { message, isLoading } = props

    const parts = message.parts.map((part, index) => {
      if (part.type === 'reasoning') {
        return (
          <p key={index} className="text-sm opacity-60 italic">
            Reasoning: {part.reasoning.substring(0, 100)}
          </p>
        )
      }
      if (part.type === 'text') {
        return <MarkdownContent key={index}>{part.text}</MarkdownContent>
      }
      if (part.type === 'tool-invocation') {
        const callId = part.toolInvocation.toolCallId
        // if (part.toolInvocation.toolName === 'codeRunner') {
        //   // if (part.toolInvocation.state === 'result') {
        //   console.log('state', part.toolInvocation.state)
        //   const { code = '', language = '' } = part.toolInvocation.args || {}
        //   return (
        //     <MarkdownContent key={callId}>{`\`\`\`${language}\n${code}\n\n/**\n${
        //       part.toolInvocation.result ?? ''
        //     }\n*/\`\`\``}</MarkdownContent>
        //   )
        //   // }
        //   // return <pre key={callId}>{JSON.stringify(part.toolInvocation)}</pre>
        // }
        if (part.toolInvocation.toolName === 'searchWeb') {
          const { query } = part.toolInvocation.args || {}
          return (
            <div
              key={callId}
              className="collapse  collapse-arrow bg-base-100 border-base-300 border"
            >
              <input type="checkbox" />
              <div className="collapse-title  font-semibold">🔍🌐：{query}</div>
              <div className="collapse-content text-sm">
                <p>
                  {'result' in part.toolInvocation
                    ? part.toolInvocation.result
                    : part.toolInvocation.state + '...'}
                </p>
              </div>
            </div>
          )
        }
        return (
          <div key={callId} className="text-sm opacity-60 italic border-l-2 pl-3 border-info">
            Tool call: &quot;{part.toolInvocation.toolName}&quot; {part.toolInvocation.state}
          </div>
        )
      }
      return null
    })
    return (
      <div className="chat chat-start my-3">
        <div className="chat-bubble py-4 w-[96%] max-w-none">
          {parts}
          {isLoading && <div className="skeleton bg-neutral-content h-5 w-full mt-4"></div>}
        </div>
      </div>
    )
  },
  (p, c) => {
    if (p.isLoading) {
      return false
    }
    return p.message.id === c.message.id
  }
)

const StreamingMessage = memo(function StreamingMessageInner() {
  console.log('StreamingMessage render')
  const chat = useContext(ChatContext)
  const messagesRef = useRef(chat?.messages || [])
  messagesRef.current = chat?.messages || []
  // const streamingMessage = useMemo(() => {
  if (chat.status === 'submitted') {
    return (
      <div className="chat chat-start my-3">
        <div className="chat-bubble py-4 w-[96%] max-w-none">
          <div className="skeleton bg-neutral-content h-5 w-full"></div>
        </div>
      </div>
    )
  }
  const message = messagesRef.current.at(-1)
  if (!message || message.role !== 'assistant') {
    return null
  }
  if (chat.status === 'streaming') {
    return <AssistantMessage message={message} isLoading />
  }

  if (chat.status === 'error') {
    return (
      <div className="chat chat-start my-3">
        <div className="chat-bubble py-4 w-[96%] max-w-none">
          <p className="text-error">出错了</p>
        </div>
      </div>
    )
  }
  return null
  // }, [chat.status])

  // return streamingMessage
})

const TextInput = memo(function TextInputInner() {
  console.log('TextInput render')
  const chat = useContext(ChatContext)
  // const [input, setInput] = useState(chat?.input || '')

  const isLoading = chat?.status === 'submitted' || chat?.status === 'streaming'

  return (
    <div>
      <input
        className="w-full p-2 h-24 rounded-t-none   !outline-none focus:border-primary pr-15"
        // style={{
        //   height: isHigher ? '4em' : '2em',
        // }}
        value={chat.input}
        placeholder="Say something..."
        // minRows={2}
        // maxRows={4}
        onChange={evt => {
          // chat?.handleInputChange(evt)
          // setInput(evt.target.value)
          // startTransition(() => {
          // chat?.handleInputChange(evt)
          chat?.setInput(evt.target.value)
          // })
        }}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key !== 'Enter') {
            return
          }
          if (e.shiftKey && !isLoading) {
            e.preventDefault()
            // @ts-expect-error ignore this
            e.target.closest('form')?.requestSubmit()
          }
        }}
      />
      <div className="absolute bottom-1 right-1">
        <button
          type="button"
          hidden={!isLoading}
          className="btn btn-md btn-secondary btn-soft"
          onClick={chat?.stop}
        >
          <Icon icon="lucide:stop-circle" width="20" height="20" />
        </button>

        <button type="submit" hidden={isLoading} className="btn  btn-md btn-primary  btn-soft">
          <Icon icon="lucide:send" width="20" height="20" />
        </button>
      </div>
    </div>
  )
})

const UserMessage = memo(
  function UserMessageInner(props: { message: ReturnType<typeof useChat>['messages'][number] }) {
    const { message } = props
    return (
      <div className="chat chat-end my-3">
        <div className="chat-bubble chat-bubble-success text-sm">{message.content}</div>
      </div>
    )
  },
  (p, c) => {
    return p.message.id === c.message.id
  }
)

const Messages = memo(function MessagesInner() {
  const chat = useContext(ChatContext)
  const messagesRef = useRef(chat?.messages || [])
  messagesRef.current = chat?.messages || []
  const historyMessages = useMemo(() => {
    const _messages = [...messagesRef.current]
    if (chat?.status === 'streaming') {
      _messages.pop()
    }
    return _messages.map(m => {
      if (m.role !== 'user') {
        return <AssistantMessage key={m.id} message={m} />
      }
      return <UserMessage key={m.id} message={m} />
    })
  }, [chat?.status, chat?.messages.length])

  return (
    <>
      {historyMessages}
      <StreamingMessage />
      {!chat?.messages.length && (
        <div className="flex flex-col items-center justify-center h-[90%]">
          <p>开始对话</p>
        </div>
      )}
      {chat?.error ? <p className="text-error indent-4">Error: {chat?.error.message}</p> : null}
    </>
  )
})

function ChatInner() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const chat = useContext(ChatContext)
  const [webSearchChecked, setWebSearchChecked] = useState(false)
  const isLoading = chat?.status === 'submitted' || chat?.status === 'streaming'

  const messages = useMemo(() => <Messages />, [])
  return (
    <div className="flex flex-col h-full w-full max-w-screen-lg relative mx-auto">
      <div
        ref={scrollRef}
        className="flex-grow overflow-auto border-base-300 border border-b-0 pb-6"
        data-style-anchor-container
      >
        {messages}
        <div data-style-anchor></div>
      </div>
      <form
        onSubmit={evt => {
          chat?.handleSubmit(evt, {
            body: {
              enableWebSearch: webSearchChecked,
            },
          })
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
          }
        }}
        className="w-full relative rounded-b-sm"
      >
        <div className="justify-end p-2 flex gap-4 border-base-300 border-l border-r">
          <button
            className="btn btn-circle btn-warning btn-soft border border-[initial]"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              const userMsgs = scrollRef.current?.querySelectorAll('.chat.chat-end')
              const last = userMsgs && userMsgs[userMsgs.length - 1]
              last?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <Icon icon="lucide:arrow-up-narrow-wide" width="24" height="24" />
          </button>
          <label
            className="btn btn-circle swap swap-rotate"
            title={webSearchChecked ? '开启网络搜索' : '未开启网络搜索'}
          >
            <input
              type="checkbox"
              checked={webSearchChecked}
              onChange={e => {
                setWebSearchChecked(e.target.checked)
              }}
            />
            <Icon
              icon="lucide:globe"
              className="swap-on fill-current text-success"
              width="24"
              height="24"
            />
            <Icon
              icon="lucide:globe-lock"
              className="swap-off fill-current"
              width="24"
              height="24"
            />
          </label>
          <button
            disabled={isLoading}
            className="btn btn-md btn-circle btn-accent btn-soft border-[initial]"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              navigator.clipboard.readText().then(text => {
                if (text) {
                  chat?.append({
                    content: text,
                    role: 'user',
                  })
                  if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
                  }
                }
              })
            }}
            title="发送粘贴板"
          >
            <Icon icon="lucide:clipboard-paste" width="24" height="24" />
          </button>
          <button
            disabled={isLoading}
            className="btn btn-md btn-circle btn-info btn-soft border-[initial]"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              chat?.reload()
            }}
            title="重新回答"
          >
            <Icon icon="lucide:refresh-ccw" width="24" height="24" />{' '}
          </button>
          <button
            disabled={isLoading}
            className="btn btn-md btn-circle btn-secondary btn-soft border-[initial]"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              chat?.setMessages([])
            }}
            title="清空对话记录"
          >
            <Icon icon="lucide:message-circle-x" width="24" height="24" />
          </button>
        </div>
        <TextInput />
      </form>
    </div>
  )
}

const ChatComp = memo(ChatInner)

// @ts-expect-error ignore this
const ChatContext = createContext<ReturnType<typeof useChat>>(null)

export default function Chat() {
  console.log('Chat render')
  const chat = useChat({
    maxSteps: 10,
    id: 'chat',
    initialMessages: messages,
    // experimental_throttle: 3000,
  })
  return (
    <ChatContext.Provider value={chat}>
      <ChatComp />
    </ChatContext.Provider>
  )
}
