import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router'
import { useChat } from '../hooks/useChat.js'
import { useAuth } from '../../hook/useAuth.js'

const Icon = ({ children, className = '' }) => (
  <span aria-hidden="true" className={`text-[18px] leading-none ${className}`}>{children}</span>
)

const themeOptions = [
  { id: 'dark', label: 'Dark', color: 'bg-[#111827]' },
  { id: 'light', label: 'Light', color: 'bg-[#f3f4f6]' },
  { id: 'midnight', label: 'Midnight', color: 'bg-[#0f172a]' },
  { id: 'sunset', label: 'Sunset', color: 'bg-[#7c2d12]' },
  { id: 'forest', label: 'Forest', color: 'bg-[#052e16]' },
  { id: 'violet', label: 'Violet', color: 'bg-[#4c1d95]' },
]

const Sidebar = ({ chats, activeChat, onNewChat, onSelectChat, onDeleteChat, accountName, isDarkMode, themeId, isThemeMenuOpen, onThemeToggle, onThemeChange }) => (
  <aside className={`flex w-[270px] shrink-0 flex-col border-r px-3 py-3 max-md:w-[68px] max-md:px-2 ${isDarkMode ? 'border-[#242424] bg-[#0b0b0b]' : 'border-[#e5e7eb] bg-[#f5f5f5]'}`}>
    <div className="flex items-center justify-between px-2 pb-5 max-md:justify-center">
      <span className={`text-[19px] font-semibold tracking-[-0.04em] max-md:hidden ${isDarkMode ? 'text-[#f5f5f5]' : 'text-[#111827]'}`}>Perplexity</span>
      <div className="relative">
        <button
          type="button"
          onClick={onThemeToggle}
          className={`grid h-9 w-9 place-items-center rounded-lg transition ${isDarkMode ? 'bg-[#1c1c1c] text-[#f5f5f5] hover:bg-[#2a2a2a]' : 'bg-[#e5e7eb] text-[#111827] hover:bg-[#d1d5db]'}`}
          aria-label="Choose theme"
        >
          {themeId === 'light' ? '☀️' : themeId === 'dark' ? '🌙' : '🎨'}
        </button>
        {isThemeMenuOpen && (
          <div className="absolute left-0 top-full z-20 mt-2 min-w-[170px] rounded-xl border border-white/10 bg-[#111827]/95 p-2 shadow-2xl">
            {themeOptions.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => onThemeChange(theme.id)}
                className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${themeId === theme.id ? 'bg-white/10 text-white' : 'text-gray-200 hover:bg-white/5'}`}
              >
                <span className={`h-3.5 w-3.5 rounded-full ${theme.color}`} />
                {theme.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

    <button
      onClick={onNewChat}
      className={`flex h-11 items-center gap-3 rounded-xl px-3 text-left text-[14px] font-medium transition max-md:justify-center max-md:px-0 ${isDarkMode ? 'bg-[#202020] text-white hover:bg-[#2a2a2a]' : 'bg-[#e5e7eb] text-[#111827] hover:bg-[#d1d5db]'}`}
      aria-label="New chat"
    >
      <Icon>{isDarkMode ? '✎' : '✦'}</Icon>
      <span className="max-md:hidden">New chat</span>
    </button>

    <div className="mt-7 flex-1 overflow-y-auto">
      <p className={`px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] max-md:hidden ${isDarkMode ? 'text-[#737373]' : 'text-[#6b7280]'}`}>Your chats</p>
      <nav className="space-y-1">
        {chats.map((chat) => (
          <div key={chat.id} className={`group flex w-full items-center gap-2 rounded-lg px-2 py-2.5 transition ${activeChat === chat.id ? (isDarkMode ? 'bg-[#202020] text-white' : 'bg-[#e5e7eb] text-[#111827]') : (isDarkMode ? 'text-[#c4c4c4] hover:bg-[#171717]' : 'text-[#374151] hover:bg-[#e5e7eb]')}`}>
            <button type="button" onClick={() => onSelectChat(chat.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <span className={`grid h-7 w-7 place-items-center rounded-md text-[12px] ${isDarkMode ? 'bg-[#2b2b2b] text-[#f5f5f5]' : 'bg-white text-[#111827] shadow-sm'}`}>
                💬
              </span>
              <span className="min-w-0 max-md:hidden"><span className="block truncate text-[13px]">{chat.title}</span><span className={`block pt-0.5 text-[11px] ${isDarkMode ? 'text-[#707070]' : 'text-[#6b7280]'}`}>{chat.time}</span></span>
            </button>
            <button
              type="button"
              aria-label={`Delete ${chat.title}`}
              onClick={(event) => {
                event.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className={`rounded-md p-1 transition ${isDarkMode ? 'text-[#8d8d8d] hover:bg-[#2a2a2a] hover:text-red-300' : 'text-[#6b7280] hover:bg-[#d1d5db] hover:text-red-500'}`}
            >
              🗑
            </button>
          </div>
        ))}
      </nav>
    </div>

    <div className={`border-t pt-3 ${isDarkMode ? 'border-[#242424]' : 'border-[#e5e7eb]'}`}>
      <button className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left ${isDarkMode ? 'text-[#bdbdbd] hover:bg-[#171717]' : 'text-[#111827] hover:bg-[#e5e7eb]'} max-md:justify-center`}>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-red-500 to-orange-400 text-[12px] font-bold text-white">
          {accountName?.charAt(0)?.toUpperCase() || 'A'}
        </span>
        <span className="min-w-0 max-md:hidden"><span className="block truncate text-[13px] font-medium">{accountName || 'Your account'}</span><span className={`block text-[11px] ${isDarkMode ? 'text-[#707070]' : 'text-[#6b7280]'}`}>My profile</span></span>
      </button>
    </div>
  </aside>
)

export const Dashboard = () => {
  const chat = useChat()
  const { user } = useSelector(state => state.auth)
  const { isLoading, error } = useSelector(state => state.chat)
  const { handleLogout } = useAuth()
  const navigate = useNavigate()
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([])
  const [themeId, setThemeId] = useState('dark')
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const isDarkMode = themeId !== 'light'

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
  const accountName = user?.username || user?.name || user?.email?.split('@')[0] || 'Your account'

  const handleThemeChange = (nextThemeId) => {
    setThemeId(nextThemeId)
    setIsThemeMenuOpen(false)
  }

  const handleThemeToggle = () => {
    setIsThemeMenuOpen(current => !current)
  }

  const handleSignOut = () => {
    handleLogout()
    navigate('/login', { replace: true })
  }

  const deleteChatById = async (chatId) => {
    const shouldDelete = window.confirm('Delete this chat?')
    if (!shouldDelete) return

    try {
      await chat.handleDeleteChat(chatId)
      setChats(current => current.filter(item => item.id !== chatId))

      if (activeChat === chatId) {
        setActiveChat(null)
        setMessages([])
      }
    } catch {
      // Error is already surfaced in chat state
    }
  }

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

  const themeStyles = {
    dark: {
      page: 'bg-[#121212] text-[#f5f5f5]',
      section: 'bg-[#121212]',
      headerText: 'text-[#858585]',
      headerButton: 'text-[#dedede] hover:text-white',
      inputWrap: 'border-[#393939] bg-[#202020] focus-within:border-[#5a5a5a]',
      inputText: 'text-white placeholder:text-[#858585]',
      secondaryText: 'text-[#858585]',
      promptNote: 'text-[#6f6f6f]',
      assistantBubble: 'bg-[#1b1b1b] text-[#e1e1e1]',
      userBubble: 'bg-[#2b5c9a] text-white',
      featureBadge: 'bg-[#f1f1f1] text-[#111]',
      lightTitle: 'text-[#f3f3f3]',
    },
    light: {
      page: 'bg-[#f5f5f5] text-[#111827]',
      section: 'bg-[#f5f5f5]',
      headerText: 'text-[#4b5563]',
      headerButton: 'text-[#1f2937] hover:text-black',
      inputWrap: 'border-[#d1d5db] bg-white focus-within:border-[#9ca3af]',
      inputText: 'text-[#111827] placeholder:text-[#6b7280]',
      secondaryText: 'text-[#4b5563]',
      promptNote: 'text-[#6b7280]',
      assistantBubble: 'bg-[#f3f4f6] text-[#111827]',
      userBubble: 'bg-[#2563eb] text-white',
      featureBadge: 'bg-[#111827] text-white',
      lightTitle: 'text-[#111827]',
    },
    midnight: {
      page: 'bg-[#020817] text-[#e2e8f0]',
      section: 'bg-[#020817]',
      headerText: 'text-[#94a3b8]',
      headerButton: 'text-[#e2e8f0] hover:text-white',
      inputWrap: 'border-[#1e293b] bg-[#0f172a] focus-within:border-[#475569]',
      inputText: 'text-white placeholder:text-[#94a3b8]',
      secondaryText: 'text-[#94a3b8]',
      promptNote: 'text-[#64748b]',
      assistantBubble: 'bg-[#0f172a] text-[#e2e8f0]',
      userBubble: 'bg-[#312e81] text-white',
      featureBadge: 'bg-[#e2e8f0] text-[#020817]',
      lightTitle: 'text-[#f8fafc]',
    },
    sunset: {
      page: 'bg-[#1f110d] text-[#fef3c7]',
      section: 'bg-[#1f110d]',
      headerText: 'text-[#fdba74]',
      headerButton: 'text-[#fef3c7] hover:text-white',
      inputWrap: 'border-[#7c2d12] bg-[#3b1d14] focus-within:border-[#f59e0b]',
      inputText: 'text-[#fff7ed] placeholder:text-[#fdba74]',
      secondaryText: 'text-[#fdba74]',
      promptNote: 'text-[#fbbf24]',
      assistantBubble: 'bg-[#3b1d14] text-[#ffedd5]',
      userBubble: 'bg-[#ea580c] text-white',
      featureBadge: 'bg-[#fed7aa] text-[#7c2d12]',
      lightTitle: 'text-[#fff7ed]',
    },
    forest: {
      page: 'bg-[#04130b] text-[#dcfce7]',
      section: 'bg-[#04130b]',
      headerText: 'text-[#86efac]',
      headerButton: 'text-[#dcfce7] hover:text-white',
      inputWrap: 'border-[#14532d] bg-[#052e16] focus-within:border-[#4ade80]',
      inputText: 'text-[#f0fdf4] placeholder:text-[#86efac]',
      secondaryText: 'text-[#86efac]',
      promptNote: 'text-[#bbf7d0]',
      assistantBubble: 'bg-[#052e16] text-[#dcfce7]',
      userBubble: 'bg-[#16a34a] text-white',
      featureBadge: 'bg-[#dcfce7] text-[#052e16]',
      lightTitle: 'text-[#f0fdf4]',
    },
    violet: {
      page: 'bg-[#140b2d] text-[#ede9fe]',
      section: 'bg-[#140b2d]',
      headerText: 'text-[#c4b5fd]',
      headerButton: 'text-[#ede9fe] hover:text-white',
      inputWrap: 'border-[#4c1d95] bg-[#2e1065] focus-within:border-[#a78bfa]',
      inputText: 'text-[#f5f3ff] placeholder:text-[#c4b5fd]',
      secondaryText: 'text-[#c4b5fd]',
      promptNote: 'text-[#ddd6fe]',
      assistantBubble: 'bg-[#2e1065] text-[#f5f3ff]',
      userBubble: 'bg-[#7c3aed] text-white',
      featureBadge: 'bg-[#ddd6fe] text-[#4c1d95]',
      lightTitle: 'text-[#f5f3ff]',
    },
  }

  const themeClasses = themeStyles[themeId] || themeStyles.dark

  return (
    <main className={`flex h-dvh w-full overflow-hidden font-sans ${themeClasses.page}`}>
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={newChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChatById}
        accountName={accountName}
        isDarkMode={isDarkMode}
        themeId={themeId}
        isThemeMenuOpen={isThemeMenuOpen}
        onThemeToggle={handleThemeToggle}
        onThemeChange={handleThemeChange}
      />
      <section className={`relative flex min-w-0 flex-1 flex-col ${themeClasses.section}`}>
        <header className="flex h-14 shrink-0 items-center justify-between px-5 max-md:px-4">
          <button onClick={newChat} className={`flex items-center gap-2 text-sm font-medium md:hidden ${themeClasses.headerButton}`}><Icon>＋</Icon>New chat</button>
          <span className={`text-sm max-md:hidden ${themeClasses.headerText}`}>Perplexity</span>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleSignOut}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${isDarkMode ? 'bg-[#1f2937] text-white hover:bg-[#374151]' : 'bg-[#e5e7eb] text-[#111827] hover:bg-[#d1d5db]'}`}
            >
              Sign out
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center overflow-y-auto px-4">
          <div className="flex w-full max-w-[720px] flex-1 flex-col justify-center pb-28 pt-10">
            {error && <p role="alert" className="mb-5 rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-2 text-sm text-red-300">{error}</p>}
            {messages.length === 0 ? <div className="text-center"><div className={`mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl text-2xl ${themeClasses.featureBadge}`}>✦</div><h1 className={`text-3xl font-semibold tracking-[-0.04em] ${themeClasses.lightTitle}`}>What can I help with, {displayName}?</h1><p className={`mt-3 text-[15px] ${themeClasses.secondaryText}`}>Ask anything. Search, understand, and create with Perplexity.</p></div> : <div className="space-y-7 self-stretch">{messages.map((message) => message.role === 'assistant' ? <article key={message.id} className={`max-w-[92%] rounded-2xl px-4 py-3 text-[15px] leading-7 ${themeClasses.assistantBubble}`}><div className="mb-2 flex items-center gap-2 text-[13px] font-medium"><span className={`grid h-6 w-6 place-items-center rounded-md text-sm ${themeClasses.featureBadge}`}>✦</span>Perplexity</div><div className="prose prose-invert max-w-none prose-p:my-2 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:bg-[#1b1b1b] prose-code:text-[#e6c07b]"><ReactMarkdown>{message.text}</ReactMarkdown></div><div className={`mt-3 flex items-center gap-3 ${themeClasses.secondaryText}`}><button type="button" aria-label="Copy answer" className="hover:opacity-80">□</button><button type="button" aria-label="Like answer" className="hover:opacity-80">♡</button><button type="button" aria-label="Dislike answer" className="hover:opacity-80">♧</button></div></article> : <div key={message.id} className={`ml-auto max-w-[80%] rounded-2xl rounded-br-md px-4 py-3 text-[15px] leading-6 ${themeClasses.userBubble}`}>{message.text}</div>)}</div>}
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 w-full max-w-[760px] -translate-x-1/2 px-4"><p className={`mb-2 text-center text-[11px] ${themeClasses.promptNote}`}>Perplexity can make mistakes. Check important info.</p><form onSubmit={submitPrompt} className={`flex min-h-[58px] items-center gap-2 rounded-2xl border px-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${themeClasses.inputWrap}`}><button type="button" aria-label="Attach file" className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-2xl ${isDarkMode ? 'text-[#a8a8a8] hover:bg-[#303030]' : 'text-[#4b5563] hover:bg-[#e5e7eb]'}`}>＋</button><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={isLoading ? 'Perplexity is thinking...' : 'Ask anything'} className={`min-w-0 flex-1 bg-transparent text-[15px] outline-none ${themeClasses.inputText}`} disabled={isLoading} /><button type="button" className={`hidden items-center gap-1 rounded-lg px-2 py-2 text-sm sm:flex ${isDarkMode ? 'text-[#a8a8a8] hover:bg-[#303030]' : 'text-[#374151] hover:bg-[#e5e7eb]'}`}><Icon className="text-[16px]">✧</Icon>Think</button><button type="submit" aria-label="Send message" className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition disabled:opacity-40 ${isDarkMode ? 'bg-[#f5f5f5] text-[#151515] hover:bg-white' : 'bg-[#111827] text-white hover:bg-[#1f2937]'}`} disabled={!prompt.trim() || isLoading}>↑</button></form></div>
      </section>
    </main>
  )
}

export default Dashboard
