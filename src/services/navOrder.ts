import type { SidebarNavId, WidgetConfig } from '../types';

export const DEFAULT_SIDEBAR_NAV_ORDER: SidebarNavId[] = [
  'command-center',
  'product-portfolio',
  'chief-of-staff',
  'outlook',
  'notion-krisp',
  'app-launcher',
  'priority-alerts',
  'knowledge-clone',
];

export const SIDEBAR_NAV_LABELS: Record<SidebarNavId, string> = {
  'command-center': 'Command Center',
  'product-portfolio': 'Product Delivery',
  'chief-of-staff': 'Chief of Staff',
  outlook: 'Outlook & Calendar',
  'notion-krisp': 'Tools & Connectors',
  'app-launcher': 'App Launcher',
  'priority-alerts': 'Priority Alerts',
  'knowledge-clone': 'KB & AI Clone',
};

/**
 * Left-nav modules → Command Center workspace panel widget ids.
 * `command-center` is the home shell (no exclusive widget).
 */
export const NAV_TO_WIDGET_IDS: Record<SidebarNavId, string[]> = {
  'command-center': [],
  'product-portfolio': ['w-heatmap'],
  'chief-of-staff': ['w-chief'],
  outlook: ['w-outlook'],
  'notion-krisp': ['w-notion', 'w-krisp'],
  'app-launcher': ['w-apps'],
  'priority-alerts': ['w-triage'],
  'knowledge-clone': ['w-clone'],
};

/** Merge saved order with any newly added nav ids; drop unknowns. */
export function normalizeSidebarNavOrder(order?: SidebarNavId[] | null): SidebarNavId[] {
  const incoming = Array.isArray(order) ? order : [];
  const seen = new Set<SidebarNavId>();
  const result: SidebarNavId[] = [];

  for (const id of incoming) {
    if (DEFAULT_SIDEBAR_NAV_ORDER.includes(id) && !seen.has(id)) {
      result.push(id);
      seen.add(id);
    }
  }
  for (const id of DEFAULT_SIDEBAR_NAV_ORDER) {
    if (!seen.has(id)) result.push(id);
  }
  return result;
}

export function moveItemInList<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const next = index + direction;
  if (next < 0 || next >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  return copy;
}

/** Move an item from one index to another (drag-and-drop). */
export function reorderListByIndex<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }
  const copy = [...list];
  const [item] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, item);
  return copy;
}

export function reindexWidgetOrders<T extends { order: number }>(widgets: T[]): T[] {
  return widgets.map((w, i) => ({ ...w, order: i + 1 }));
}

/**
 * Align workspace panel widget.order with the single module/nav order.
 * Keeps enabled/size/etc. from existing widgets.
 */
export function syncWidgetsToNavOrder(
  widgets: WidgetConfig[],
  navOrder: SidebarNavId[]
): WidgetConfig[] {
  const order = normalizeSidebarNavOrder(navOrder);
  const byId = new Map(widgets.map((w) => [w.id, w]));
  const placed = new Set<string>();
  const ordered: WidgetConfig[] = [];

  for (const navId of order) {
    for (const widgetId of NAV_TO_WIDGET_IDS[navId] || []) {
      const widget = byId.get(widgetId);
      if (widget && !placed.has(widgetId)) {
        ordered.push(widget);
        placed.add(widgetId);
      }
    }
  }

  // Preserve any unexpected widgets at the end
  for (const widget of widgets) {
    if (!placed.has(widget.id)) ordered.push(widget);
  }

  return reindexWidgetOrders(ordered);
}
