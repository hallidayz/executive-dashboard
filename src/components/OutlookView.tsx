import React, { useState } from 'react';
import {
  Mail,
  Calendar,
  Clock,
  User,
  Star,
  Tag,
  Search,
  Plus,
  Check,
  Globe,
  Lock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
  X,
  Filter,
} from 'lucide-react';
import { EmailMessage, CalendarEvent, AppSettings, ConnectedAccount } from '../types';

interface UniversalEmailCalViewProps {
  emails: EmailMessage[];
  calendar: CalendarEvent[];
  settings?: AppSettings;
  onUpdateSettings?: (settings: AppSettings) => void;
  onToggleEmailFlag?: (id: string) => void;
  onMarkRead?: (id: string) => void;
}

export const INITIAL_CONNECTED_ACCOUNTS: ConnectedAccount[] = [
  {
    id: 'acc-1',
    name: 'Executive Work (Outlook)',
    email: 'alex.halliday@enterprise.com',
    provider: 'Microsoft Outlook 365',
    color: '#0078D4',
    unreadEmailsCount: 4,
    eventsTodayCount: 4,
    connected: true,
    isDefault: true,
  },
  {
    id: 'acc-2',
    name: 'Personal & Strategy (Gmail)',
    email: 'ahalliday@gmail.com',
    provider: 'Gmail / Google Workspace',
    color: '#EA4335',
    unreadEmailsCount: 2,
    eventsTodayCount: 2,
    connected: true,
    isDefault: false,
  },
  {
    id: 'acc-3',
    name: 'Advisory & Board (iCloud)',
    email: 'ahalliday@icloud.com',
    provider: 'Apple iCloud Mail',
    color: '#007AFF',
    unreadEmailsCount: 1,
    eventsTodayCount: 1,
    connected: true,
    isDefault: false,
  },
];

export const OutlookView: React.FC<UniversalEmailCalViewProps> = ({
  emails,
  calendar,
  settings = {} as any,
  onUpdateSettings = () => {},
}) => {
  // Connected Accounts State
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(
    settings.connectedAccounts && settings.connectedAccounts.length > 0
      ? settings.connectedAccounts
      : INITIAL_CONNECTED_ACCOUNTS
  );

  const [selectedAccountFilter, setSelectedAccountFilter] = useState<string>('All');
  const [emailCategoryFilter, setEmailCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(emails[0] || null);

  // Add Account Modal State
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [newAccountProvider, setNewAccountProvider] = useState<ConnectedAccount['provider']>('Microsoft Outlook 365');
  const [isConnectingAccount, setIsConnectingAccount] = useState(false);

  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountEmail) return;

    setIsConnectingAccount(true);

    setTimeout(() => {
      setIsConnectingAccount(false);

      const colorMap: Record<ConnectedAccount['provider'], string> = {
        'Microsoft Outlook 365': '#0078D4',
        'Gmail / Google Workspace': '#EA4335',
        'Apple iCloud Mail': '#007AFF',
        'Yahoo Mail': '#6001D2',
        'ProtonMail': '#6D4AFF',
        'IMAP / CalDAV Custom': '#10B981',
      };

      const newAccount: ConnectedAccount = {
        id: `acc-${Date.now()}`,
        name: newAccountName || newAccountEmail.split('@')[0],
        email: newAccountEmail,
        provider: newAccountProvider,
        color: colorMap[newAccountProvider],
        unreadEmailsCount: 2,
        eventsTodayCount: 1,
        connected: true,
        isDefault: false,
      };

      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      onUpdateSettings({ ...settings, connectedAccounts: updatedAccounts });

      setNewAccountName('');
      setNewAccountEmail('');
      setShowAddAccountModal(false);
    }, 700);
  };

  // Filter Emails
  const filteredEmails = emails.filter((em) => {
    const matchesAccount =
      selectedAccountFilter === 'All' ||
      (em.accountEmail && em.accountEmail === selectedAccountFilter) ||
      selectedAccountFilter === 'Work' ||
      selectedAccountFilter === 'All';
    const matchesCategory = emailCategoryFilter === 'All' || em.category === emailCategoryFilter;
    const matchesSearch =
      em.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      em.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      em.preview.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesAccount && matchesCategory && matchesSearch;
  });

  // Filter Events
  const filteredEvents = calendar.filter((ev) => {
    if (selectedAccountFilter === 'All') return true;
    return ev.accountEmail === selectedAccountFilter;
  });

  const totalUnread = accounts.reduce((sum, acc) => sum + acc.unreadEmailsCount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-obsidian-900 via-cyan-950/40 to-indigo-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">Universal Email & Calendar Hub (EMAIL & CAL)</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                {accounts.length} Active Accounts Connected
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Unified inbox & multi-calendar engine for Outlook 365, Gmail, iCloud, Yahoo, Proton, & IMAP/CalDAV.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddAccountModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Email & Cal Account</span>
          </button>
        </div>
      </div>

      {/* Connected Accounts Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto bg-obsidian-900/90 p-2 rounded-2xl border border-slate-800">
        <button
          onClick={() => setSelectedAccountFilter('All')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedAccountFilter === 'All'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Inboxes & Calendars ({totalUnread} Unread)</span>
        </button>

        {accounts.map((acc) => (
          <button
            key={acc.id}
            onClick={() => setSelectedAccountFilter(acc.email)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
              selectedAccountFilter === acc.email
                ? 'bg-slate-800 text-white border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: acc.color }} />
            <span>{acc.name}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-obsidian-950 text-[10px] text-cyan-300 font-mono">
              {acc.unreadEmailsCount}
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: Multi-Calendar (Left 1/3) & Multi-Inbox Stream (Right 2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: MULTI-CALENDAR TIMELINE */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100 text-base">Executive Calendar Stream</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Today</span>
            </div>

            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl glass-card border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        event.status === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-100 text-sm">{event.title}</h4>
                  <p className="text-xs text-slate-400">{event.location}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <span className="text-slate-400">{event.attendees.length} Attendees</span>
                    {event.meetingLink && (
                      <a
                        href={event.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
                      >
                        <span>Join</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MULTI-INBOX EMAIL STREAM */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            {/* Inbox Search & Filter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search emails across all accounts..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto bg-obsidian-900 p-1 rounded-xl border border-slate-800">
                {(['All', 'Urgent', 'Action Required', 'VIP Sender'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEmailCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      emailCategoryFilter === cat ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Stream List */}
            <div className="space-y-3">
              {filteredEmails.map((em) => {
                const isSelected = selectedEmail?.id === em.id;
                return (
                  <div
                    key={em.id}
                    onClick={() => setSelectedEmail(em)}
                    className={`p-4 rounded-xl glass-card border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-cyan-500/50 bg-cyan-950/20 shadow-glow-cyan'
                        : 'border-slate-800 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">{em.sender}</span>
                        <span className="text-[11px] text-slate-500">&lt;{em.senderEmail}&gt;</span>
                      </div>
                      <span className="text-xs text-slate-400">{em.receivedTime}</span>
                    </div>

                    <h4 className="font-bold text-slate-200 text-sm">{em.subject}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{em.preview}</p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                        {em.category}
                      </span>
                      {em.isPriority && (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>VIP Priority</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 1-CLICK ADD EMAIL & CALENDAR ACCOUNT MODAL */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-cyan-500/40 p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100 text-base">Add Email & Calendar Account</h3>
              </div>
              <button onClick={() => setShowAddAccountModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAccountSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Select Provider</label>
                <select
                  value={newAccountProvider}
                  onChange={(e: any) => setNewAccountProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-obsidian-950 text-slate-100"
                >
                  <option value="Microsoft Outlook 365">Microsoft Outlook 365 / Exchange</option>
                  <option value="Gmail / Google Workspace">Gmail / Google Workspace</option>
                  <option value="Apple iCloud Mail">Apple iCloud Mail & Calendar</option>
                  <option value="Yahoo Mail">Yahoo Mail</option>
                  <option value="ProtonMail">ProtonMail Bridge</option>
                  <option value="IMAP / CalDAV Custom">IMAP / CalDAV Custom Server</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Account Label / Name</label>
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="e.g. Work Outlook, Personal Gmail..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAccountEmail}
                  onChange={(e) => setNewAccountEmail(e.target.value)}
                  placeholder="user@domain.com"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-obsidian-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-cyan-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>1-Click IDP OAuth Authentication</span>
                </span>
                <p>Authenticates securely with {newAccountProvider}. Zero credentials stored in cleartext.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConnectingAccount}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30"
                >
                  {isConnectingAccount ? 'Connecting Account...' : 'Connect Account & Sync'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
