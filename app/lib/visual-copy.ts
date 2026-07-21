import type { Locale } from './i18n'

type VisualCopy = {
  gapTitle: string
  gapDescription: string
  frictionTitle: string
  frictionDescription: string
  linkTitle: string
  linkDescription: string
  about: string
  field: string
  layer: string
  selectField: string
  selectLayer: string
  timeRange: string
  overTime: string
  institutions: string
  weights: string
  totalWeight: string
  reset: string
  filter: string
  lineStrength: string
  search: string
  mainGap: string
  expertise: string
  authorityOver: string
  reliesOn: string
  reliedOnBy: string
  interfaces: string
}

export const visualCopy: Record<Locale, VisualCopy> = {
  en: {
    gapTitle: 'Gap Matrix', gapDescription: 'Where technical knowledge is concentrated, and whether public authority and accountability keep pace.',
    frictionTitle: 'Friction Index', frictionDescription: 'Weight knowledge, authority, dependency, and coordination to see where fields are most misaligned.',
    linkTitle: 'Institutional Link Map', linkDescription: 'See how governments, companies, universities, and standards bodies connect across expertise, power, funding, and dependence.',
    about: 'About this tool',
    field: 'Field', layer: 'Layer', selectField: 'Select field', selectLayer: 'Select layer', timeRange: 'Time range', overTime: 'over time', institutions: 'Institutions', weights: 'Weight controls', totalWeight: 'Total weight', reset: 'Reset to default',
    filter: 'Filter relationships', lineStrength: 'Line strength', search: 'Search nodes', mainGap: 'Main gap', expertise: 'Expertise in', authorityOver: 'Authority over', reliesOn: 'Relies on', reliedOnBy: 'Relied on by', interfaces: 'Interfaces',
  },
  ru: {
    gapTitle: 'Матрица разрывов', gapDescription: 'Где сосредоточены технические знания и успевают ли за ними публичные полномочия и подотчётность.',
    frictionTitle: 'Индекс трения', frictionDescription: 'Настройте вес знаний, полномочий, зависимости и координации, чтобы увидеть наиболее сильные расхождения.',
    linkTitle: 'Карта институциональных связей', linkDescription: 'Как государства, компании, университеты и органы стандартизации связаны через знания, власть, финансирование и зависимость.',
    about: 'Об инструменте',
    field: 'Область', layer: 'Слой', selectField: 'Выберите область', selectLayer: 'Выберите слой', timeRange: 'Период', overTime: 'во времени', institutions: 'Институты', weights: 'Настройка весов', totalWeight: 'Суммарный вес', reset: 'Сбросить',
    filter: 'Фильтр связей', lineStrength: 'Сила линии', search: 'Поиск узлов', mainGap: 'Главный разрыв', expertise: 'Компетенции', authorityOver: 'Полномочия', reliesOn: 'Зависит от', reliedOnBy: 'От него зависят', interfaces: 'Интерфейсы',
  },
  ko: {
    gapTitle: '간극 매트릭스', gapDescription: '기술 지식이 어디에 집중되고 공적 권한과 책임성이 그 속도를 따라가는지 보여 줍니다.',
    frictionTitle: '마찰 지수', frictionDescription: '지식·권한·의존성·조정의 가중치를 바꾸어 분야별 불일치를 살펴봅니다.',
    linkTitle: '제도 연결 지도', linkDescription: '정부·기업·대학·표준 기관이 전문성, 권한, 자금, 의존성을 통해 어떻게 연결되는지 보여 줍니다.',
    about: '도구 소개',
    field: '분야', layer: '계층', selectField: '분야 선택', selectLayer: '계층 선택', timeRange: '기간', overTime: '시간에 따른 변화', institutions: '기관', weights: '가중치 조정', totalWeight: '총 가중치', reset: '기본값으로',
    filter: '관계 필터', lineStrength: '선 강도', search: '노드 검색', mainGap: '주요 간극', expertise: '전문 분야', authorityOver: '권한 범위', reliesOn: '의존 대상', reliedOnBy: '이 기관에 의존', interfaces: '연결 장치',
  },
  fr: {
    gapTitle: 'Matrice des écarts', gapDescription: 'Où se concentre le savoir technique, et si l’autorité publique et la responsabilité suivent le même rythme.',
    frictionTitle: 'Indice de friction', frictionDescription: 'Pondérez savoir, autorité, dépendance et coordination pour repérer les désalignements.',
    linkTitle: 'Carte des liens institutionnels', linkDescription: 'Voyez comment gouvernements, entreprises, universités et organismes de normalisation sont reliés par l’expertise, le pouvoir, le financement et la dépendance.',
    about: 'À propos',
    field: 'Domaine', layer: 'Couche', selectField: 'Choisir un domaine', selectLayer: 'Choisir une couche', timeRange: 'Période', overTime: 'dans le temps', institutions: 'Institutions', weights: 'Pondérations', totalWeight: 'Poids total', reset: 'Réinitialiser',
    filter: 'Filtrer les relations', lineStrength: 'Intensité des liens', search: 'Rechercher un nœud', mainGap: 'Écart principal', expertise: 'Expertise en', authorityOver: 'Autorité sur', reliesOn: 'Dépend de', reliedOnBy: 'Soutient', interfaces: 'Interfaces',
  },
  'zh-CN': {
    gapTitle: '差距矩阵', gapDescription: '技术知识集中在哪里，以及公共权力与问责机制能否跟上。',
    frictionTitle: '摩擦指数', frictionDescription: '调整知识、权力、依赖与协调的权重，观察各领域错位最严重之处。',
    linkTitle: '制度连接图', linkDescription: '查看政府、企业、大学和标准机构如何通过专业知识、权力、资金与依赖相互连接。',
    about: '关于此工具',
    field: '领域', layer: '层面', selectField: '选择领域', selectLayer: '选择层面', timeRange: '时间范围', overTime: '随时间变化', institutions: '机构', weights: '权重控制', totalWeight: '总权重', reset: '恢复默认值',
    filter: '筛选关系', lineStrength: '连线强度', search: '搜索节点', mainGap: '主要差距', expertise: '专长领域', authorityOver: '权力范围', reliesOn: '依赖于', reliedOnBy: '被依赖方', interfaces: '接口',
  },
}
