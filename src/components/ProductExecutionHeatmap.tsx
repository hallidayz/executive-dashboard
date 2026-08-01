import React from 'react';
import {
  Rocket,
  AlertOctagon,
  TrendingUp,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { ProductLine } from '../types';

interface ProductExecutionHeatmapProps {
  products: ProductLine[];
  onNavigateTab: (tab: any) => void;
}

export const ProductExecutionHeatmap: React.FC<ProductExecutionHeatmapProps> = ({ products, onNavigateTab }) => {
  const avgReadiness = Math.round(products.reduce((acc, p) => acc + p.readinessScore, 0) / products.length);
  const totalBlockers = products.reduce((acc, p) => acc + p.activeBlockers, 0);

  return (
    <div className="space-y-4">
      {/* Top Banner KPI Summary */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-obsidian-900 via-indigo-950/60 to-purple-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-lg">Product Execution & Delivery Portfolio</h3>
          </div>
          <p className="text-xs text-slate-300">
            Real-time launch readiness, sprint velocity, and blocker tracking across all product lines you oversee as Head of Product.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="glass-card p-3 rounded-xl border border-indigo-500/30 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Avg Readiness</span>
            <p className="text-xl font-black text-indigo-400">{avgReadiness}%</p>
          </div>
          <div className="glass-card p-3 rounded-xl border border-rose-500/30 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Blockers</span>
            <p className="text-xl font-black text-rose-400">{totalBlockers}</p>
          </div>
          <div className="glass-card p-3 rounded-xl border border-emerald-500/30 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Avg Velocity</span>
            <p className="text-xl font-black text-emerald-400">89%</p>
          </div>
        </div>
      </div>

      {/* Product Lines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((prod) => {
          const isAtRisk = prod.status === 'At Risk' || prod.activeBlockers > 0;
          return (
            <div
              key={prod.id}
              className={`glass-panel p-5 rounded-2xl border transition-all space-y-4 ${
                isAtRisk
                  ? 'border-rose-500/40 bg-rose-950/10 hover:border-rose-500/70'
                  : 'border-slate-800 hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        prod.status === 'Launching Soon'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : prod.status === 'At Risk'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {prod.status}
                    </span>
                    <span className="text-xs text-slate-400">Target: {prod.targetReleaseDate}</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-base">{prod.name}</h4>
                  <p className="text-xs text-slate-400">Lead: <strong className="text-slate-200">{prod.lead}</strong></p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-400 block">Readiness</span>
                  <span
                    className={`text-xl font-extrabold ${
                      prod.readinessScore >= 90
                        ? 'text-emerald-400'
                        : prod.readinessScore >= 80
                        ? 'text-indigo-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {prod.readinessScore}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <span>Launch Progress</span>
                  <span>{prod.readinessScore}% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-obsidian-950 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      prod.readinessScore >= 90
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                        : prod.readinessScore >= 80
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        : 'bg-gradient-to-r from-amber-500 to-rose-500'
                    }`}
                    style={{ width: `${prod.readinessScore}%` }}
                  />
                </div>
              </div>

              {/* Key Deliverable & Blocker Warning */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-[260px]">{prod.keyDeliverable}</span>
                </div>

                {prod.activeBlockers > 0 ? (
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold flex items-center gap-1">
                    <AlertOctagon className="w-3 h-3 text-rose-400" />
                    <span>{prod.activeBlockers} Blocker</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Clean Path</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
