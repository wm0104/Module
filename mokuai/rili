/**
 * 📅 自定义倒计时小组件
 */

// ========== 只留空配置 ==========
const HOLIDAYS = {};
const LUNAR_HOLIDAYS = {};
const SOLAR_TERMS = {};
const FLOATING_HOLIDAYS = {};

// ========== 工具函数 ==========
function daysDiff(from, to) {
  return Math.ceil((to - from) / (24 * 60 * 60 * 1000));
}

function getCountdowns() {
  const now = new Date();
  const year = now.getFullYear();
  const results = [];

  // 公历节日
  for (const [k, v] of Object.entries(HOLIDAYS)) {
    const [m, d] = k.split('-').map(Number);
    let t = new Date(year, m - 1, d);
    if (t < now) t = new Date(year + 1, m - 1, d);
    results.push({ name: v.name, days: daysDiff(now, t) });
  }

  results.sort((a, b) => a.days - b.days);
  return results;
}

// ========== 🎯 核心渲染 ==========
export default async function(ctx) {
  try {
    const env = ctx.env || {};
    const widgetFamily = ctx.widgetFamily || 'systemMedium';

    const CONFIG = {
      padding: 8,
      itemGap: 6,
      minCols: 2,
      maxRows: 6,
      fontSize: { small: 9, medium: 10, large: 11 },
      maxNameLength: 4,
      warningDays: 7,
      urgentDays: 3
    };

    const truncateName = (name) => {
      if (name.length <= CONFIG.maxNameLength) return name;
      return name.slice(0, CONFIG.maxNameLength);
    };

    const getCapsuleColor = (days) => {
      if (days <= CONFIG.urgentDays) {
        return {
          bg: { light: "#FF3B3015", dark: "#FF453A20" },
          border: { light: "#FF3B3050", dark: "#FF453A60" },
          text: { light: "#D43028", dark: "#FF5E56" }
        };
      }
      if (days <= CONFIG.warningDays) {
        return {
          bg: { light: "#FF950015", dark: "#FF9F0A20" },
          border: { light: "#FF950050", dark: "#FF9F0A60" },
          text: { light: "#D47D00", dark: "#FFB340" }
        };
      }
      return {
        bg: { light: "#34C75915", dark: "#30D15820" },
        border: { light: "#34C75950", dark: "#30D15860" },
        text: { light: "#2E8B57", dark: "#4CD964" }
      };
    };

    const renderGrid = (items, maxColumns, fontSize) => {
      if (!items?.length) return [];
      const columns = maxColumns;
      const totalItems = Math.min(items.length, CONFIG.maxRows * columns);
      const displayItems = items.slice(0, totalItems);

      const rows = [];
      for (let i = 0; i < displayItems.length; i += columns) {
        const rowItems = displayItems.slice(i, i + columns);
        const rowChildren = rowItems.map((c) => {
          const displayName = truncateName(c.name);
          const colors = getCapsuleColor(c.days);
          return {
            type: 'stack',
            direction: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: [5, 8, 5, 8],
            backgroundColor: colors.bg,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            children: [
              {
                type: 'text',
                text: `${displayName} ${c.days}天`,
                font: { size: fontSize, weight: 'medium' },
                textColor: colors.text,
                textAlign: 'center',
                maxLines: 1,
                minScale: 0.7
              }
            ]
          }
        });
        rows.push({
          type: 'stack',
          direction: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: CONFIG.itemGap,
          children: rowChildren
        });
      }
      return rows;
    };

    // 锁屏圆形
    if (widgetFamily === 'accessoryCircular') {
      const countdowns = getCountdowns();
      const next = countdowns[0];
      const colors = getCapsuleColor(next?.days || 999);
      return {
        type: 'widget',
        padding: 6,
        children: [{
          type: 'stack', direction: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
          children: [
            { type: 'image', src: 'sf-symbol:calendar.circle.fill', width: 22, height: 22, color: colors.text },
            { type: 'text', text: next ? String(next.days) : '--', font: { size: 16, weight: 'bold' }, textColor: colors.text, textAlign: 'center' }
          ]
        }]
      };
    }

    // 锁屏矩形 / Inline
    if (widgetFamily === 'accessoryRectangular' || widgetFamily === 'accessoryInline') {
      const countdowns = getCountdowns();
      const next = countdowns[0];
      const colors = getCapsuleColor(next?.days || 999);
      return {
        type: 'widget',
        padding: 8,
        children: [{
          type: 'stack', direction: 'row', alignItems: 'center', gap: 6,
          children: [
            { type: 'image', src: 'sf-symbol:calendar', width: 18, height: 18, color: colors.text },
            { type: 'text', text: next ? `${next.name} ${next.days}天` : '自定义倒计时', font: { size: 12, weight: 'medium' }, textColor: colors.text, flex: 1, maxLines: 1, textAlign: 'left' }
          ]
        }]
      };
    }

    // 小尺寸
    if (widgetFamily === 'systemSmall') {
      const countdowns = getCountdowns();
      return {
        type: 'widget',
        padding: CONFIG.padding,
        children: renderGrid(countdowns, 4, CONFIG.fontSize.small)
      };
    }

    // 中尺寸
    if (widgetFamily === 'systemMedium') {
      const countdowns = getCountdowns();
      return {
        type: 'widget',
        padding: CONFIG.padding,
        children: renderGrid(countdowns, 5, CONFIG.fontSize.medium)
      };
    }

    // 大尺寸
    {
      const countdowns = getCountdowns();
      return {
        type: 'widget',
        padding: CONFIG.padding,
        children: renderGrid(countdowns, 6, CONFIG.fontSize.large)
      };
    }

  } catch (error) {
    return {
      type: 'widget',
      padding: 12,
      children: [{
        type: 'stack', direction: 'column', alignItems: 'center', gap: 8,
        children: [
          { type: 'image', src: 'sf-symbol:exclamationmark.triangle.fill', color: { light: '#FF9500', dark: '#FF9F0A' }, width: 22, height: 22 },
          { type: 'text', text: '加载失败', font: { size: 12, weight: 'medium' }, textColor: { light: '#FF3B30', dark: '#FF453A' } }
        ]
      }]
    };
  }
}