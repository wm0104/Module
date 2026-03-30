/**
 * 📅 传统节日倒计时小组件
 */

// ========== 只保留传统节日 ==========
const LUNAR_HOLIDAYS = {
  '1-1': '春节',
  '1-15': '元宵节',
  '5-5': '端午节',
  '7-7': '七夕节',
  '8-15': '中秋节',
  '9-9': '重阳节',
  '12-8': '腊八节',
  '12-30': '除夕'
};

// ========== 农历计算引擎 ==========
const Lunar = (function() {
  const lunarInfo = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
    0x14aa6,0x02b60,0x09570,0x04976,0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,
    0x02b60,0x09570,0x052f2,0x04970,0x06566,0x0d4a0,0x0ea50,0x16ea5,0x05ad0,0x02b60,
    0x186e3,0x092e0,0x1c8d7,0x0c950,0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,
    0x092d0,0x0d2b2,0x0a950,0x0b557,0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x145ad,
    0x052b0,0x0a9a8,0x0e950,0x06aa0,0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,
    0x0f263,0x0d950,0x05b57,0x056a0,0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250
  ];
  const Gan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const Zhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const Animals = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
  const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];

  function lYearDays(y) {
    let i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
    return sum + leapDays(y);
  }
  function leapDays(y) {
    if (leapMonth(y)) return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
    return 0;
  }
  function leapMonth(y) { return lunarInfo[y - 1900] & 0xf; }
  function monthDays(y, m) { return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29; }

  function solarToLunar(yy, mm, dd) {
    let baseDate = new Date(1900, 0, 31);
    let objDate = new Date(yy, mm - 1, dd);
    let offset = Math.floor((objDate - baseDate) / 86400000);
    let i, year = 1900, temp = 0;
    for (i = 1900; i < 2100 && offset > 0; i++) {
      temp = lYearDays(i); offset -= temp; year = i;
    }
    if (offset < 0) { offset += temp; year--; }
    let leap = leapMonth(year), isLeap = false;
    for (i = 1; i < 13 && offset > 0; i++) {
      if (leap > 0 && i === (leap + 1) && !isLeap) { --i; isLeap = true; temp = leapDays(year); }
      else { temp = monthDays(year, i); }
      if (isLeap && i === (leap + 1)) isLeap = false;
      offset -= temp;
      if (offset < 0) { offset += temp; i++; break; }
    }
    let ganIndex = (year - 4) % 10, zhiIndex = (year - 4) % 12;
    return {
      year, month: i, day: offset + 1, isLeap,
      ganZhi: Gan[ganIndex] + Zhi[zhiIndex],
      animal: Animals[zhiIndex],
      monthStr: lunarMonths[i - 1],
      dayStr: getDayString(offset + 1)
    };
  }
  function getDayString(day) {
    const strs = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
      '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
      '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
    return strs[day - 1] || '';
  }
  return {
    getLunarDate: (d) => solarToLunar(d.getFullYear(), d.getMonth() + 1, d.getDate()),
    solarToLunar
  };
})();

// ========== 工具函数 ==========
function daysDiff(from, to) {
  return Math.ceil((to - from) / (24 * 60 * 60 * 1000));
}

function getCountdowns() {
  const now = new Date(), year = now.getFullYear(), results = [];
  try {
    const lunar = Lunar.getLunarDate(now);
    for (const [k, name] of Object.entries(LUNAR_HOLIDAYS)) {
      const [lm, ld] = k.split('-').map(Number);
      let tm = (lunar.month > lm || (lunar.month === lm && lunar.day >= ld)) ? lm + 12 : lm;
      let t = new Date(year, tm - 1, ld);
      if (t < now) t = new Date(year + 1, tm - 1, ld);
      results.push({ name, days: daysDiff(now, t), type: 'lunar' });
    }
  } catch (e) {}
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
            { type: 'text', text: next ? `${next.name} ${next.days}天` : '节日倒计时', font: { size: 12, weight: 'medium' }, textColor: colors.text, flex: 1, maxLines: 1, textAlign: 'left' }
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