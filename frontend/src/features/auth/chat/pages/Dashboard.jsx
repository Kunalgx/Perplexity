import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat.js'

const Icon = ({ children, className = '' }) => (
  <span aria-hidden="true" className={`text-[18px] leading-none ${className}`}>{children}</span>
)

const Sidebar = ({ chats, activeChat, onNewChat, onSelectChat }) => (
  <aside className="flex w-[270px] shrink-0 flex-col border-r border-[#242424] bg-[#0b0b0b] px-3 py-3 max-md:w-[68px] max-md:px-2">
    <div className="flex items-center justify-between px-2 pb-5 max-md:justify-center">
      <span className="text-[19px] font-semibold tracking-[-0.04em] text-[#f5f5f5] max-md:hidden">Perplexity</span>
      <button className="grid h-9 w-9 place-items-center rounded-lg text-[#a6a6a6] transition hover:bg-[#1c1c1c] hover:text-white" aria-label="Collapse sidebar">
        <Icon>◧</Icon>   
      </button>
    </div>
    <button onClick={onNewChat} className="flex h-11 items-center gap-3 rounded-xl bg-[#202020] px-3 text-left text-[14px] font-medium text-white transition hover:bg-[#2a2a2a] max-md:justify-center max-md:px-0" aria-label="New chat">
      <Icon>＋</Icon><span className="max-md:hidden">New chat</span>
    </button>
    <div className="mt-7 flex-1 overflow-y-auto">
      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#737373] max-md:hidden">Your chats</p>
      <nav className="space-y-1">
        {chats.map((chat) => (
          <button key={chat.id} onClick={() => onSelectChat(chat.id)} className={`group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition ${activeChat === chat.id ? 'bg-[#202020] text-white' : 'text-[#c4c4c4] hover:bg-[#171717]'}`}>
            <Icon className="text-[15px] text-[#8c8c8c]">□</Icon>
            <span className="min-w-0 max-md:hidden"><span className="block truncate text-[13px]">{chat.title}</span><span className="block pt-0.5 text-[11px] text-[#707070]">{chat.time}</span></span>
          </button>
        ))}
      </nav>
    </div>
    <div className="border-t border-[#242424] pt-3">
      <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[#bdbdbd] hover:bg-[#171717] max-md:justify-center">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d45638] text-[11px] font-bold text-white">K</span>
        <span className="min-w-0 max-md:hidden"><span className="block truncate text-[13px] text-white">{userName()}</span><span className="block text-[11px] text-[#707070]">Free plan</span></span>
      </button>
    </div>
  </aside>
)

const userName = () => 'Your account'

export const Dashboard = () => {
  const chat = useChat()
  const { user } = useSelector(state => state.auth)
  const { isLoading, error } = useSelector(state => state.chat)
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    let isMounted = true

    chat.handleGetChats()
      .then(savedChats => {
        if (!isMounted) return
        const formattedChats = savedChats.map(savedChat => ({
          id: savedChat._id,
          title: savedChat.title || 'New conversation',
          time: new Date(savedChat.updatedAt || savedChat.createdAt).toLocaleDateString(),
        }))
        setChats(formattedChats)
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  const displayName = user?.name || user?.username || user?.email?.split('@')[0] || 'there'

  const selectChat = async (chatId) => {
    setActiveChat(chatId)
    setMessages([])

    try {
      const savedMessages = await chat.handleGetMessages(chatId)
      setMessages(savedMessages.map(message => ({
        id: message._id,
        role: message.role === 'ai' ? 'assistant' : 'user',
        text: message.content,
      })))
    } catch {
      setMessages([])
    }
  }

  const submitPrompt = async (event) => {
    event.preventDefault()
    const text = prompt.trim()
    if (!text) return

    const messageId = Date.now()
    setMessages(current => [...current, { id: `${messageId}-user`, role: 'user', text }])
    setPrompt('')

    try {
      const chatId = typeof activeChat === 'string' && activeChat.length === 24 ? activeChat : null
      const data = await chat.handleSendMessage({ message: text, chatId })
      setActiveChat(data.chat._id)
      setMessages(current => [...current, {
        id: `${messageId}-assistant`,
        role: 'assistant',
        text: data.aimessage.content,
      }])
      setChats(current => {
        const existingChat = current.some(item => item.id === data.chat._id)
        if (existingChat) {
          return current.map(item => item.id === data.chat._id ? { ...item, title: data.chat.title || text } : item)
        }
        return [{ id: data.chat._id, title: data.chat.title || data.title || text, time: 'Just now' }, ...current]
      })
    } catch {
      setMessages(current => current.filter(message => message.id !== `${messageId}-user`))
    }
  }

  const newChat = () => {
    const id = Date.now()
    setChats(current => [{ id, title: 'New conversation', time: 'Just now' }, ...current])
    setActiveChat(id)
    setMessages([])
  }

  return (
    <main className="flex h-dvh w-full overflow-hidden bg-[#121212] font-sans text-[#f5f5f5]">
      <Sidebar chats={chats} activeChat={activeChat} onNewChat={newChat} onSelectChat={selectChat} />
      <section className="relative flex min-w-0 flex-1 flex-col bg-[#121212]">
        <header className="flex h-14 shrink-0 items-center justify-between px-5 max-md:px-4">
          <button onClick={newChat} className="flex items-center gap-2 text-sm font-medium text-[#dedede] hover:text-white md:hidden"><Icon>＋</Icon>New chat</button>
          <span className="text-sm text-[#858585] max-md:hidden">Perplexity</span>
          <div className="ml-auto flex items-center gap-2"><button className="rounded-lg px-3 py-2 text-sm text-[#bdbdbd] hover:bg-[#222] hover:text-white">Share</button><button aria-label="More options" className="rounded-lg px-2 py-2 text-xl leading-none text-[#aaa] hover:bg-[#222]">···</button></div>
        </header>
        <div className="flex flex-1 flex-col items-center overflow-y-auto px-4">
          <div className="flex w-full max-w-[720px] flex-1 flex-col justify-center pb-28 pt-10">
            {error && <p role="alert" className="mb-5 rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-2 text-sm text-red-300">{error}</p>}
            {messages.length === 0 ? <div className="text-center"><div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#f1f1f1] text-2xl text-[#111]">✦</div><h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#f3f3f3]">What can I help with, {displayName}?</h1><p className="mt-3 text-[15px] text-[#858585]">Ask anything. Search, understand, and create with Perplexity.</p></div> : <div className="space-y-7 self-stretch">{messages.map((message) => message.role === 'assistant' ? <article key={message.id} className="max-w-[92%] text-[15px] leading-7 text-[#e1e1e1]"><div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-[#f5f5f5]"><span className="grid h-6 w-6 place-items-center rounded-md bg-[#f1f1f1] text-sm text-[#111]">✦</span>Perplexity</div><div className="prose prose-invert max-w-none prose-p:my-2 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:bg-[#1b1b1b] prose-code:text-[#e6c07b]"><ReactMarkdown>{message.text}</ReactMarkdown></div><div className="mt-3 flex items-center gap-3 text-[#737373]"><button type="button" aria-label="Copy answer" className="hover:text-white">□</button><button type="button" aria-label="Like answer" className="hover:text-white">♡</button><button type="button" aria-label="Dislike answer" className="hover:text-white">♧</button></div></article> : <div key={message.id} className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-[#2b5c9a] px-4 py-3 text-[15px] leading-6 text-white">{message.text}</div>)}</div>}
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 w-full max-w-[760px] -translate-x-1/2 px-4"><p className="mb-2 text-center text-[11px] text-[#6f6f6f]">Perplexity can make mistakes. Check important info.</p><form onSubmit={submitPrompt} className="flex min-h-[58px] items-center gap-2 rounded-2xl border border-[#393939] bg-[#202020] px-3 shadow-[0_8px_30px_rgba(0,0,0,0.25)] focus-within:border-[#5a5a5a]"><button type="button" aria-label="Attach file" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-2xl text-[#a8a8a8] hover:bg-[#303030]">＋</button><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={isLoading ? 'Perplexity is thinking...' : 'Ask anything'} className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-[#858585]" disabled={isLoading} /><button type="button" className="hidden items-center gap-1 rounded-lg px-2 py-2 text-sm text-[#a8a8a8] hover:bg-[#303030] sm:flex"><Icon className="text-[16px]">✧</Icon>Think</button><button type="submit" aria-label="Send message" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f5f5f5] text-[#151515] transition hover:bg-white disabled:opacity-40" disabled={!prompt.trim() || isLoading}>↑</button></form></div>
      </section>
    </main>
  )
}

export default Dashboard
