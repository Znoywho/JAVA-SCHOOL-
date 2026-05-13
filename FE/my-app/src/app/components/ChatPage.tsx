import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import {
  ChevronRight,
  Inbox,
  Loader2,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Store,
  UserRound,
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  createChatConversation,
  fetchChatContacts,
  fetchChatConversations,
  fetchChatMessages,
  sendChatMessage,
  type ChatContact,
  type ChatConversation,
  type ChatMessage,
  type ChatRole,
} from '../services/api';

const ROLE_META: Record<ChatRole, { label: string; badge: string; avatar: string; Icon: typeof UserRound }> = {
  BUYER: {
    label: 'Buyer',
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    avatar: 'bg-blue-100 text-blue-700',
    Icon: UserRound,
  },
  SELLER: {
    label: 'Seller',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    avatar: 'bg-emerald-100 text-emerald-700',
    Icon: Store,
  },
  INSPECTOR: {
    label: 'Inspector',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    avatar: 'bg-amber-100 text-amber-700',
    Icon: ShieldCheck,
  },
  ADMIN: {
    label: 'Admin',
    badge: 'bg-gray-50 text-gray-700 border-gray-100',
    avatar: 'bg-gray-100 text-gray-700',
    Icon: UserRound,
  },
};

function formatChatTime(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

function getOtherParticipant(conversation: ChatConversation, currentUserId: number) {
  if (conversation.userId1 === currentUserId) {
    return {
      id: conversation.userId2,
      name: conversation.user2Name,
      role: conversation.user2Role,
    };
  }

  return {
    id: conversation.userId1,
    name: conversation.user1Name,
    role: conversation.user1Role,
  };
}

function getContactSubtitle(userRole?: string): string {
  if (userRole === 'BUYER') return 'Chat voi seller hoac inspector';
  if (userRole === 'SELLER') return 'Tra loi va ho tro buyer';
  if (userRole === 'INSPECTOR') return 'Tu van kiem dinh cho buyer';
  return 'Hop thu chat';
}

export function ChatPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetParam = searchParams.get('with');
  const user = getCurrentUser();

  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [startingContactId, setStartingContactId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const selectedConversation = useMemo(
    () => conversations.find(conversation => conversation.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

  const selectedParticipant = useMemo(
    () => selectedConversation && user ? getOtherParticipant(selectedConversation, user.id) : null,
    [selectedConversation, user]
  );

  const conversationByUserId = useMemo(() => {
    const map = new Map<number, ChatConversation>();
    if (!user) return map;
    conversations.forEach(conversation => {
      const other = getOtherParticipant(conversation, user.id);
      map.set(other.id, conversation);
    });
    return map;
  }, [conversations, user]);

  const loadInbox = async (showSpinner = true) => {
    if (!user) return [];
    if (showSpinner) setLoadingInbox(true);
    setError(null);

    try {
      const [contactData, conversationData] = await Promise.all([
        fetchChatContacts(user.id),
        fetchChatConversations(user.id),
      ]);
      setContacts(contactData);
      setConversations(conversationData);

      if (!selectedConversationId && conversationData.length > 0) {
        setSelectedConversationId(conversationData[0].id);
      }

      return conversationData;
    } catch (err: any) {
      setError(err.message || 'Khong tai duoc hop thu chat');
      return [];
    } finally {
      if (showSpinner) setLoadingInbox(false);
    }
  };

  const loadMessages = async (conversationId: number, showSpinner = true) => {
    if (showSpinner) setLoadingMessages(true);
    try {
      setMessages(await fetchChatMessages(conversationId));
    } catch (err: any) {
      setError(err.message || 'Khong tai duoc tin nhan');
    } finally {
      if (showSpinner) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadInbox();
  }, [user?.id]);

  useEffect(() => {
    if (!user || !targetParam) return;

    const targetId = Number(targetParam);
    if (!Number.isFinite(targetId) || targetId <= 0 || targetId === user.id) {
      setSearchParams({}, { replace: true });
      return;
    }

    let cancelled = false;

    const openTargetConversation = async () => {
      setStartingContactId(targetId);
      setError(null);
      try {
        const conversation = await createChatConversation(user.id, targetId);
        if (cancelled) return;

        setConversations(prev => {
          const exists = prev.some(item => item.id === conversation.id);
          return exists
            ? prev.map(item => item.id === conversation.id ? conversation : item)
            : [conversation, ...prev];
        });
        setSelectedConversationId(conversation.id);
        setSearchParams({}, { replace: true });
        await loadMessages(conversation.id);
        await loadInbox(false);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Khong mo duoc hoi thoai');
        }
      } finally {
        if (!cancelled) setStartingContactId(null);
      }
    };

    openTargetConversation();

    return () => {
      cancelled = true;
    };
  }, [user?.id, targetParam]);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    loadMessages(selectedConversationId);
    const intervalId = window.setInterval(() => {
      loadMessages(selectedConversationId, false);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [selectedConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, selectedConversationId]);

  const filteredConversations = conversations.filter(conversation => {
    if (!user) return false;
    const other = getOtherParticipant(conversation, user.id);
    const keyword = query.trim().toLowerCase();
    return !keyword
      || other.name.toLowerCase().includes(keyword)
      || (conversation.lastMessage ?? '').toLowerCase().includes(keyword);
  });

  const filteredContacts = contacts.filter(contact => {
    const keyword = query.trim().toLowerCase();
    return !keyword
      || contact.name.toLowerCase().includes(keyword)
      || contact.role.toLowerCase().includes(keyword);
  });

  const startConversation = async (contact: ChatContact) => {
    if (!user) return;

    const existing = conversationByUserId.get(contact.id);
    if (existing) {
      setSelectedConversationId(existing.id);
      return;
    }

    setStartingContactId(contact.id);
    setError(null);
    try {
      const conversation = await createChatConversation(user.id, contact.id);
      setConversations(prev => [conversation, ...prev]);
      setSelectedConversationId(conversation.id);
      await loadMessages(conversation.id);
    } catch (err: any) {
      setError(err.message || 'Khong tao duoc hoi thoai');
    } finally {
      setStartingContactId(null);
    }
  };

  const handleSend = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!user || !selectedConversationId || sending) return;

    const content = draft.trim();
    if (!content) return;

    setSending(true);
    setError(null);
    try {
      const sentMessage = await sendChatMessage(selectedConversationId, user.id, content);
      setMessages(prev => [...prev, sentMessage]);
      setDraft('');
      await loadInbox(false);
    } catch (err: any) {
      setError(err.message || 'Khong gui duoc tin nhan');
    } finally {
      setSending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chu</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Tin nhan</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="text-blue-600" size={26} />
              Tin nhan
            </h1>
            <p className="text-sm text-gray-500 mt-1">{getContactSubtitle(user.role)}</p>
          </div>
          <button
            onClick={() => loadInbox()}
            disabled={loadingInbox}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-60 transition-colors"
          >
            <RefreshCw size={16} className={loadingInbox ? 'animate-spin' : ''} />
            Lam moi
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[330px_1fr] gap-5">
          <aside className="bg-white border border-gray-100 rounded-xl overflow-hidden h-[640px] flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Tim hoi thoai hoac lien he"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingInbox ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : (
                <>
                  <div className="px-4 pt-4 pb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                    Hoi thoai
                  </div>
                  {filteredConversations.length === 0 ? (
                    <div className="mx-4 mb-4 rounded-xl border border-dashed border-gray-200 p-4 text-center">
                      <Inbox size={24} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">Chua co hoi thoai phu hop</p>
                    </div>
                  ) : (
                    <div className="px-2 space-y-1">
                      {filteredConversations.map(conversation => {
                        const other = getOtherParticipant(conversation, user.id);
                        const role = other.role ?? 'BUYER';
                        const meta = ROLE_META[role] ?? ROLE_META.BUYER;

                        return (
                          <button
                            key={conversation.id}
                            onClick={() => setSelectedConversationId(conversation.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                              selectedConversationId === conversation.id
                                ? 'bg-blue-50'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${meta.avatar}`}>
                              {other.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-900 truncate">{other.name}</p>
                                <span className="text-[11px] text-gray-400 shrink-0">{formatChatTime(conversation.lastMessageTime)}</span>
                              </div>
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {conversation.lastMessage || 'Bat dau hoi thoai'}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="px-4 pt-5 pb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                    Danh ba
                  </div>
                  <div className="px-2 pb-4 space-y-1">
                    {filteredContacts.map(contact => {
                      const meta = ROLE_META[contact.role] ?? ROLE_META.BUYER;
                      const Icon = meta.Icon;
                      const isStarting = startingContactId === contact.id;
                      const existing = conversationByUserId.has(contact.id);

                      return (
                        <button
                          key={contact.id}
                          onClick={() => startConversation(contact)}
                          disabled={isStarting}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 disabled:opacity-60 transition-colors"
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${meta.avatar}`}>
                            {isStarting ? <Loader2 size={16} className="animate-spin" /> : <Icon size={17} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-bold ${meta.badge}`}>
                                {meta.label}
                              </span>
                              {existing && <span className="text-[10px] text-gray-400">Da co chat</span>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </aside>

          <section className="bg-white border border-gray-100 rounded-xl overflow-hidden h-[640px] flex flex-col">
            {selectedConversation && selectedParticipant ? (
              <>
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold ${
                      ROLE_META[selectedParticipant.role ?? 'BUYER']?.avatar ?? ROLE_META.BUYER.avatar
                    }`}>
                      {selectedParticipant.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-gray-900 truncate">{selectedParticipant.name}</h2>
                      <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                        ROLE_META[selectedParticipant.role ?? 'BUYER']?.badge ?? ROLE_META.BUYER.badge
                      }`}>
                        {ROLE_META[selectedParticipant.role ?? 'BUYER']?.label ?? 'User'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => selectedConversationId && loadMessages(selectedConversationId)}
                    disabled={loadingMessages}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    title="Lam moi tin nhan"
                  >
                    <RefreshCw size={17} className={loadingMessages ? 'animate-spin' : ''} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50/70 px-5 py-4">
                  {loadingMessages ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <Loader2 size={24} className="animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <MessageCircle size={34} className="mx-auto text-gray-300 mb-3" />
                        <p className="font-semibold text-gray-800">Bat dau tro chuyen</p>
                        <p className="text-sm text-gray-500 mt-1">Gui tin nhan dau tien de ket noi.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map(message => {
                        const mine = message.senderId === user.id;

                        return (
                          <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
                              mine
                                ? 'bg-blue-600 text-white rounded-br-md'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                            }`}>
                              {!mine && (
                                <p className="text-[11px] font-semibold text-gray-400 mb-1">{message.senderName}</p>
                              )}
                              <p className="text-sm leading-relaxed whitespace-pre-line break-words">{message.content}</p>
                              <p className={`text-[10px] mt-1 ${mine ? 'text-blue-100' : 'text-gray-400'}`}>
                                {formatChatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={bottomRef} />
                    </div>
                  )}
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex items-end gap-3">
                    <textarea
                      value={draft}
                      onChange={event => setDraft(event.target.value)}
                      onKeyDown={event => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Nhap tin nhan..."
                      rows={1}
                      className="min-h-[44px] max-h-32 flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400"
                    />
                    <button
                      type="submit"
                      disabled={sending || !draft.trim()}
                      className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                      title="Gui tin nhan"
                    >
                      {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={30} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Chon mot hoi thoai</h2>
                  <p className="text-sm text-gray-500 mt-2 max-w-sm">
                    Buyer co the chat voi seller hoac inspector. Seller va inspector co the tra loi buyer trong hop thu nay.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
