import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Mail,
  Clock,
  User,
  ExternalLink,
  Star,
  CheckCircle,
  AlertCircle,
  Filter,
  Plus,
  Video,
  FileCheck,
} from 'lucide-react';
import { CalendarEvent, EmailMessage } from '../types';

interface OutlookViewProps {
  calendar: CalendarEvent[];
  emails: EmailMessage[];
  onToggleEmailFlag: (id: string) => void;
  onMarkRead: (id: string) => void;
}

export const OutlookView: React.FC<OutlookViewProps> = ({
  calendar,
  emails,
  onToggleEmailFlag,
  onMarkRead,
}) => {
  const [emailFilter, setEmailFilter] = useState<'All' | 'VIP Sender' | 'Action Required' | 'Urgent' | 'Read Later'>('All');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(calendar[0] || null);

  const filteredEmails = emails.filter((e) => {
    if (emailFilter === 'All') return true;
    return e.category === emailFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Outlook Calendar Stream (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-slate-100 text-base">Outlook Day Plan</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
              Today ({calendar.length} Events)
            </span>
          </div>

          {/* Calendar List */}
          <div className="space-y-3">
            {calendar.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400/50 shadow-glow-indigo'
                      : 'glass-card border-slate-800/80 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-400">
                          {evt.startTime} - {evt.endTime}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                            evt.status === 'Needs Prep'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-100 text-sm">{evt.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.attendees.join(', ')}</span>
                      </p>
                    </div>

                    {evt.isVirtual && evt.meetingLink && (
                      <a
                        href={evt.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-all shrink-0"
                        title="Join Teams Meeting"
                      >
                        <Video className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Event Executive Notes & Prep */}
        {selectedEvent && (
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <FileCheck className="w-4 h-4" />
              <span>Meeting Briefing & Prep Notes</span>
            </div>
            <h4 className="font-bold text-slate-100 text-sm">{selectedEvent.title}</h4>
            {selectedEvent.agenda && (
              <div className="p-3 rounded-xl bg-obsidian-950/80 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Agenda</span>
                <p className="text-xs text-slate-200">{selectedEvent.agenda}</p>
              </div>
            )}
            {selectedEvent.prepNotes && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase">Executive Notes</span>
                <p className="text-xs text-amber-200">{selectedEvent.prepNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Outlook Priority Inbox (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-base">Outlook Priority Email Stream</h3>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto bg-obsidian-900 p-1 rounded-xl border border-slate-800">
              {(['All', 'VIP Sender', 'Action Required', 'Urgent', 'Read Later'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEmailFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    emailFilter === cat
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Email Stream List */}
          <div className="space-y-3">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => onMarkRead(email.id)}
                className={`glass-card p-4 rounded-xl border transition-all space-y-2 ${
                  !email.isRead
                    ? 'border-indigo-500/40 bg-indigo-950/20'
                    : 'border-slate-800/80 opacity-90'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{email.sender}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        email.category === 'VIP Sender'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : email.category === 'Urgent'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {email.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{email.receivedTime}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleEmailFlag(email.id);
                      }}
                      className={`p-1.5 rounded-lg transition-all ${
                        email.flagged ? 'text-amber-400 bg-amber-500/20' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-indigo-200">{email.subject}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{email.preview}</p>

                <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-800/60">
                  <span className="text-slate-400">{email.senderEmail}</span>
                  <div className="flex items-center gap-2">
                    <button className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                      <span>Draft AI Reply</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
