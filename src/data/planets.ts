import type { Planet } from '@/types'

/** 八大行星数据 */
export const planets: Planet[] = [
  {
    id: 'mercury',
    name: '水星',
    nameEn: 'Mercury',
    order: 1,
    color: '#B0B0B0',
    icon: '☿',
    description: '水星是距离太阳最近的行星，也是太阳系中最小的行星。它没有大气层保护，表面布满了陨石坑，看起来和月球很像。',
    facts: [
      { title: '🚀 最快行星', content: '水星绕太阳公转的速度是所有行星中最快的，只需要88个地球日就能绕太阳一圈！' },
      { title: '🌡️ 温差巨大', content: '水星白天温度可达430°C，晚上却降到-180°C，温差超过600°C！' },
      { title: '🌑 没有大气', content: '水星几乎没有大气层，所以无法留住热量，也没有风和天气变化。' },
      { title: '📏 最小行星', content: '水星的直径只有4879公里，比木星的卫星甘尼米德还要小！' }
    ],
    diameter: '4,879 km',
    distanceFromSun: '5,790万 km',
    orbitalPeriod: '88 天',
    moons: 0,
    temperature: '-180°C ~ 430°C',
    unlocked: false
  },
  {
    id: 'venus',
    name: '金星',
    nameEn: 'Venus',
    order: 2,
    color: '#E8CDA0',
    icon: '♀',
    description: '金星是太阳系中最热的行星，厚厚的云层包裹着它。金星的自转方向和其他行星相反，太阳从西边升起！',
    facts: [
      { title: '🔥 最热行星', content: '金星表面温度高达465°C，比离太阳更近的水星还要热，因为厚厚的二氧化碳大气层产生了温室效应。' },
      { title: '🔄 倒转自转', content: '金星是唯一一颗逆向自转的行星，在金星上太阳从西边升起、东边落下！' },
      { title: '☁️ 厚云层', content: '金星被厚厚的硫酸云层包裹，从太空中看去就像一颗明亮的珍珠。' },
      { title: '⏰ 一天比一年长', content: '金星自转一圈需要243个地球日，但公转一圈只要225天，所以金星的一天比一年还长！' }
    ],
    diameter: '12,104 km',
    distanceFromSun: '1.082亿 km',
    orbitalPeriod: '225 天',
    moons: 0,
    temperature: '平均 465°C',
    unlocked: false
  },
  {
    id: 'earth',
    name: '地球',
    nameEn: 'Earth',
    order: 3,
    color: '#4FC3F7',
    icon: '🌍',
    description: '地球是我们的家园，也是目前已知唯一存在生命的星球。它拥有液态水和适宜的大气层，是太阳系中最特别的行星。',
    facts: [
      { title: '💧 蓝色星球', content: '地球表面约71%被水覆盖，从太空中看去就像一颗蓝色的弹珠，所以被称为"蓝色星球"。' },
      { title: '🧬 生命摇篮', content: '地球是太阳系中唯一已知存在生命的星球，拥有数百万种不同的生物。' },
      { title: '🌙 一颗卫星', content: '地球只有一颗天然卫星——月球，它影响着地球的潮汐和气候。' },
      { title: '🛡️ 磁场保护', content: '地球有强大的磁场，能保护我们免受太阳风和宇宙射线的伤害。' }
    ],
    diameter: '12,756 km',
    distanceFromSun: '1.496亿 km',
    orbitalPeriod: '365.25 天',
    moons: 1,
    temperature: '平均 15°C',
    unlocked: false
  },
  {
    id: 'mars',
    name: '火星',
    nameEn: 'Mars',
    order: 4,
    color: '#E57373',
    icon: '♂',
    description: '火星被称为"红色星球"，因为表面富含氧化铁（铁锈）。科学家们正在研究火星，希望有一天人类能移居那里！',
    facts: [
      { title: '🔴 红色星球', content: '火星表面富含氧化铁，看起来是红色的，所以被称为"红色星球"。' },
      { title: '🌋 奥林帕斯山', content: '火星上有太阳系最高的山——奥林帕斯山，高度约21公里，是珠穆朗玛峰的近3倍！' },
      { title: '🕳️ 水手号峡谷', content: '火星上有巨大的水手号峡谷，长度超过4000公里，如果放在地球上，能横跨整个美国！' },
      { title: '🤖 探测器最多', content: '人类已经向火星发射了很多探测器，比如中国的"祝融号"火星车。' }
    ],
    diameter: '6,792 km',
    distanceFromSun: '2.279亿 km',
    orbitalPeriod: '687 天',
    moons: 2,
    temperature: '平均 -63°C',
    unlocked: false
  },
  {
    id: 'jupiter',
    name: '木星',
    nameEn: 'Jupiter',
    order: 5,
    color: '#D4A574',
    icon: '♃',
    description: '木星是太阳系中最大的行星，体积是地球的1300多倍！它著名的大红斑其实是一个持续了数百年的巨大风暴。',
    facts: [
      { title: '📏 最大行星', content: '木星是太阳系中最大的行星，直径约14万公里，能装下1300多个地球！' },
      { title: '🌀 大红斑', content: '木星上有一个巨大的风暴叫"大红斑"，它的面积比整个地球还大，已经持续了至少350年！' },
      { title: '🛰️ 卫星众多', content: '木星拥有至少95颗已知卫星，其中最大的四颗被称为"伽利略卫星"。' },
      { title: '💨 自转最快', content: '木星虽然最大，但自转速度最快，一天只有不到10个小时！' }
    ],
    diameter: '142,984 km',
    distanceFromSun: '7.786亿 km',
    orbitalPeriod: '11.86 年',
    moons: 95,
    temperature: '平均 -110°C',
    unlocked: false
  },
  {
    id: 'saturn',
    name: '土星',
    nameEn: 'Saturn',
    order: 6,
    color: '#F0D68A',
    icon: '♄',
    description: '土星以其壮观的光环闻名于世。这些光环主要由冰块和岩石碎片组成，非常美丽但非常稀薄。',
    facts: [
      { title: '💍 壮观光环', content: '土星的光环主要由冰块和岩石碎片组成，宽度超过28万公里，但厚度只有约10米！' },
      { title: '🎈 密度最小', content: '土星的密度比水还小，如果有一个足够大的浴缸，土星能浮在水面上！' },
      { title: '🛰️ 卫星众多', content: '土星拥有至少146颗已知卫星，其中"土卫六"是太阳系第二大卫星，还有大气层！' },
      { title: '💨 六边形风暴', content: '土星北极有一个巨大的六边形风暴，边长约1.3万公里，科学家至今无法完全解释。' }
    ],
    diameter: '120,536 km',
    distanceFromSun: '14.34亿 km',
    orbitalPeriod: '29.46 年',
    moons: 146,
    temperature: '平均 -140°C',
    unlocked: false
  },
  {
    id: 'uranus',
    name: '天王星',
    nameEn: 'Uranus',
    order: 7,
    color: '#80DEEA',
    icon: '⛢',
    description: '天王星是一颗蓝绿色的冰巨星，最特别的是它"横躺"着自转，就像一个滚动的球！',
    facts: [
      { title: '🔄 横躺自转', content: '天王星的自转轴倾斜了约98度，几乎是"躺着"绕太阳转的，可能是被一颗巨大的天体撞歪了！' },
      { title: '💎 冰巨星', content: '天王星内部主要由水、甲烷和氨的冰组成，所以被称为"冰巨星"。' },
      { title: '🟢 蓝绿色', content: '天王星呈现美丽的蓝绿色，这是因为大气中的甲烷吸收了红色光线。' },
      { title: '🧊 极度寒冷', content: '天王星是太阳系中最冷的行星之一，最低温度可达-224°C！' }
    ],
    diameter: '51,118 km',
    distanceFromSun: '28.71亿 km',
    orbitalPeriod: '84.01 年',
    moons: 27,
    temperature: '平均 -195°C',
    unlocked: false
  },
  {
    id: 'neptune',
    name: '海王星',
    nameEn: 'Neptune',
    order: 8,
    color: '#5C6BC0',
    icon: '♆',
    description: '海王星是距离太阳最远的行星，也是太阳系中风速最快的行星。它深蓝色的外观非常迷人。',
    facts: [
      { title: '💨 风速最快', content: '海王星上的风速可达每小时2100公里，是太阳系中风速最快的行星！' },
      { title: '🔵 深蓝色', content: '海王星呈现深蓝色，比天王星的蓝绿色更深，是因为大气中含有更多的甲烷。' },
      { title: '📏 最远行星', content: '海王星距离太阳约45亿公里，阳光到达海王星需要4个多小时！' },
      { title: '🔮 数学预测', content: '海王星是第一颗通过数学计算预测出来的行星，而不是通过望远镜直接发现的！' }
    ],
    diameter: '49,528 km',
    distanceFromSun: '45.04亿 km',
    orbitalPeriod: '164.8 年',
    moons: 16,
    temperature: '平均 -200°C',
    unlocked: false
  }
]

/** 根据ID获取行星 */
export function getPlanetById(id: string): Planet | undefined {
  return planets.find(p => p.id === id)
}

/** 获取已解锁的行星 */
export function getUnlockedPlanets(unlockedIds: string[]): Planet[] {
  return planets.filter(p => unlockedIds.includes(p.id))
}
