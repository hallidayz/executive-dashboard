import React from 'react';
import { Bell, AlertTriangle, CheckCircle, MessageSquare, Mail, ExternalLink, Shield } from 'lucide-react';
import { PriorityAlert } from '../types';

interface PriorityAlertsProps {
  alerts: PriorityAlert[];
  onToggleHandled: (id: string) => void;
}

export const PriorityAlertsView: React.FC<PriorityAlertsProps> = ({ alerts, onToggleHandled }) => {
  const unhandledAlerts = alerts.filter((a) => !a.handled);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Teams & Priority Email Alerts</h2>
            <p className="text-xs text-slate-400">
              Live feed of VIP messages and critical action requests requiring executive attention.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
            {unhandledAlerts.length} Unhandled Priority Items
          </span>
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`glass-panel p-5 rounded-2xl border transition-all space-y-3 ${
              alert.handled
                ? 'border-slate-800/50 opacity-60'
                : alert.urgency === 'Critical'
                ? 'border-rose-500/50 bg-rose-950/20'
                : 'border-amber-500/30 bg-amber-950/10'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {alert.source === 'Teams' ? (
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Mail className="w-4 h-4 text-cyan-400" />
                )}
                <span className="font-bold text-sm text-slate-100">{alert.sender}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    alert.urgency === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {alert.urgency}
                </span>
                <span className="text-xs text-slate-400">via {alert.source}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{alert.timestamp}</span>
                <button
                  onClick={() => onToggleHandled(alert.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    alert.handled
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{alert.handled ? 'Handled' : 'Mark Handled'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans">{alert.message}</p>

            {alert.actionUrl && (
              <div className="pt-2 border-t border-slate-800/60 flex justify-end">
                <a
                  href={alert.actionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <span>Open in {alert.source}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
