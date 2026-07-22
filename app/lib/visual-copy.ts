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
  projectName: string
  institutionalIntelligence: string
  projectContext: string
  panelAbout: string
  keyLinks: string
  dataYear: string
  noMappedLinks: string
  legend: string
  connectionStrength: string
  nodeSize: string
  interactionStates: string
  strong: string
  moderate: string
  weak: string
  strongConnection: string
  moderateConnection: string
  weakConnection: string
  selectedNode: string
  hoveredConnection: string
  filteredDimmed: string
  instructionOne: string
  instructionTwo: string
}

export const visualCopy: Record<Locale, VisualCopy> = {
  en: {
    gapTitle: 'Gap Matrix', gapDescription: 'Where technical knowledge is concentrated, and whether public authority and accountability keep pace.',
    frictionTitle: 'Friction Index', frictionDescription: 'Weight knowledge, authority, dependency, and coordination to see where fields are most misaligned.',
    linkTitle: 'Institutional Link Map', linkDescription: 'See how governments, companies, universities, and standards bodies connect across expertise, power, funding, and dependence.',
    about: 'About this tool',
    field: 'Field', layer: 'Layer', selectField: 'Select field', selectLayer: 'Select layer', timeRange: 'Time range', overTime: 'over time', institutions: 'Institutions', weights: 'Weight controls', totalWeight: 'Total weight', reset: 'Reset to default',
    filter: 'Filter relationships', lineStrength: 'Line strength', search: 'Search nodes', mainGap: 'Main gap', expertise: 'Expertise in', authorityOver: 'Authority over', reliesOn: 'Relies on', reliedOnBy: 'Relied on by', interfaces: 'Interfaces',
    projectName: 'Cepheus Project', institutionalIntelligence: 'Institutional Intelligence', projectContext: 'Cepheus Project, Institutional Intelligence', panelAbout: 'About', keyLinks: 'Key links', dataYear: 'Data year', noMappedLinks: 'No mapped links.', legend: 'Map legend', connectionStrength: 'Connection strength', nodeSize: 'Node size: influence', interactionStates: 'Interaction states', strong: 'Strong', moderate: 'Moderate', weak: 'Weak', strongConnection: 'Strong influence / control', moderateConnection: 'Moderate influence / information flow', weakConnection: 'Weak link / limited visibility', selectedNode: 'Selected node', hoveredConnection: 'Hovered connection', filteredDimmed: 'Filtered / dimmed', instructionOne: 'Select any node to explore how influence, information, and funding move through the network.', instructionTwo: 'Filter by field, layer, or institution to focus on specific relationships.',
  },
  ru: {
    gapTitle: 'Матрица разрывов', gapDescription: 'Где сосредоточены технические знания и успевают ли за ними публичные полномочия и подотчётность.',
    frictionTitle: 'Индекс трения', frictionDescription: 'Настройте вес знаний, полномочий, зависимости и координации, чтобы увидеть наиболее сильные расхождения.',
    linkTitle: 'Карта институциональных связей', linkDescription: 'Как государства, компании, университеты и органы стандартизации связаны через знания, власть, финансирование и зависимость.',
    about: 'Об инструменте',
    field: 'Область', layer: 'Слой', selectField: 'Выберите область', selectLayer: 'Выберите слой', timeRange: 'Период', overTime: 'во времени', institutions: 'Институты', weights: 'Настройка весов', totalWeight: 'Суммарный вес', reset: 'Сбросить',
    filter: 'Фильтр связей', lineStrength: 'Сила линии', search: 'Поиск узлов', mainGap: 'Главный разрыв', expertise: 'Компетенции', authorityOver: 'Полномочия', reliesOn: 'Зависит от', reliedOnBy: 'От него зависят', interfaces: 'Интерфейсы',
    projectName: 'Проект Cepheus', institutionalIntelligence: 'Институциональная аналитика', projectContext: 'Проект Cepheus, институциональная аналитика', panelAbout: 'Описание', keyLinks: 'Ключевые связи', dataYear: 'Год данных', noMappedLinks: 'Связи не отмечены.', legend: 'Легенда карты', connectionStrength: 'Сила связи', nodeSize: 'Размер узла: влияние', interactionStates: 'Состояния', strong: 'Сильная', moderate: 'Средняя', weak: 'Слабая', strongConnection: 'Сильное влияние / контроль', moderateConnection: 'Среднее влияние / обмен данными', weakConnection: 'Слабая связь / ограниченная видимость', selectedNode: 'Выбранный узел', hoveredConnection: 'Связь под указателем', filteredDimmed: 'Отфильтровано', instructionOne: 'Выберите узел, чтобы изучить движение влияния, информации и финансирования в сети.', instructionTwo: 'Фильтруйте по области, слою или институту, чтобы увидеть конкретные связи.',
  },
  ko: {
    gapTitle: '간극 매트릭스', gapDescription: '기술 지식이 어디에 집중되고 공적 권한과 책임성이 그 속도를 따라가는지 보여 줍니다.',
    frictionTitle: '마찰 지수', frictionDescription: '지식·권한·의존성·조정의 가중치를 바꾸어 분야별 불일치를 살펴봅니다.',
    linkTitle: '제도 연결 지도', linkDescription: '정부·기업·대학·표준 기관이 전문성, 권한, 자금, 의존성을 통해 어떻게 연결되는지 보여 줍니다.',
    about: '도구 소개',
    field: '분야', layer: '계층', selectField: '분야 선택', selectLayer: '계층 선택', timeRange: '기간', overTime: '시간에 따른 변화', institutions: '기관', weights: '가중치 조정', totalWeight: '총 가중치', reset: '기본값으로',
    filter: '관계 필터', lineStrength: '선 강도', search: '노드 검색', mainGap: '주요 간극', expertise: '전문 분야', authorityOver: '권한 범위', reliesOn: '의존 대상', reliedOnBy: '이 기관에 의존', interfaces: '연결 장치',
    projectName: 'Cepheus 프로젝트', institutionalIntelligence: '제도 인텔리전스', projectContext: 'Cepheus 프로젝트, 제도 인텔리전스', panelAbout: '소개', keyLinks: '주요 연결', dataYear: '데이터 연도', noMappedLinks: '표시된 연결이 없습니다.', legend: '지도 범례', connectionStrength: '연결 강도', nodeSize: '노드 크기: 영향력', interactionStates: '상호작용 상태', strong: '강함', moderate: '보통', weak: '약함', strongConnection: '강한 영향 / 통제', moderateConnection: '보통 영향 / 정보 흐름', weakConnection: '약한 연결 / 제한된 가시성', selectedNode: '선택된 노드', hoveredConnection: '가리킨 연결', filteredDimmed: '필터됨 / 흐리게', instructionOne: '노드를 선택해 영향력, 정보, 자금이 네트워크를 통해 이동하는 방식을 살펴보세요.', instructionTwo: '분야, 계층 또는 기관별로 필터링해 특정 관계에 집중하세요.',
  },
  fr: {
    gapTitle: 'Matrice des écarts', gapDescription: 'Où se concentre le savoir technique, et si l’autorité publique et la responsabilité suivent le même rythme.',
    frictionTitle: 'Indice de friction', frictionDescription: 'Pondérez savoir, autorité, dépendance et coordination pour repérer les désalignements.',
    linkTitle: 'Carte des liens institutionnels', linkDescription: 'Voyez comment gouvernements, entreprises, universités et organismes de normalisation sont reliés par l’expertise, le pouvoir, le financement et la dépendance.',
    about: 'À propos',
    field: 'Domaine', layer: 'Couche', selectField: 'Choisir un domaine', selectLayer: 'Choisir une couche', timeRange: 'Période', overTime: 'dans le temps', institutions: 'Institutions', weights: 'Pondérations', totalWeight: 'Poids total', reset: 'Réinitialiser',
    filter: 'Filtrer les relations', lineStrength: 'Intensité des liens', search: 'Rechercher un nœud', mainGap: 'Écart principal', expertise: 'Expertise en', authorityOver: 'Autorité sur', reliesOn: 'Dépend de', reliedOnBy: 'Soutient', interfaces: 'Interfaces',
    projectName: 'Projet Cepheus', institutionalIntelligence: 'Intelligence institutionnelle', projectContext: 'Projet Cepheus, intelligence institutionnelle', panelAbout: 'À propos', keyLinks: 'Liens clés', dataYear: 'Année des données', noMappedLinks: 'Aucun lien cartographié.', legend: 'Légende de la carte', connectionStrength: 'Force des liens', nodeSize: 'Taille du nœud : influence', interactionStates: 'États interactifs', strong: 'Fort', moderate: 'Modéré', weak: 'Faible', strongConnection: 'Influence forte / contrôle', moderateConnection: 'Influence modérée / flux d’information', weakConnection: 'Lien faible / visibilité limitée', selectedNode: 'Nœud sélectionné', hoveredConnection: 'Lien survolé', filteredDimmed: 'Filtré / atténué', instructionOne: 'Sélectionnez un nœud pour explorer la circulation de l’influence, de l’information et du financement dans le réseau.', instructionTwo: 'Filtrez par domaine, couche ou institution pour cibler des relations précises.',
  },
  'zh-CN': {
    gapTitle: '差距矩阵', gapDescription: '技术知识集中在哪里，以及公共权力与问责机制能否跟上。',
    frictionTitle: '摩擦指数', frictionDescription: '调整知识、权力、依赖与协调的权重，观察各领域错位最严重之处。',
    linkTitle: '制度连接图', linkDescription: '查看政府、企业、大学和标准机构如何通过专业知识、权力、资金与依赖相互连接。',
    about: '关于此工具',
    field: '领域', layer: '层面', selectField: '选择领域', selectLayer: '选择层面', timeRange: '时间范围', overTime: '随时间变化', institutions: '机构', weights: '权重控制', totalWeight: '总权重', reset: '恢复默认值',
    filter: '筛选关系', lineStrength: '连线强度', search: '搜索节点', mainGap: '主要差距', expertise: '专长领域', authorityOver: '权力范围', reliesOn: '依赖于', reliedOnBy: '被依赖方', interfaces: '接口',
    projectName: 'Cepheus 项目', institutionalIntelligence: '制度情报', projectContext: 'Cepheus 项目，制度情报', panelAbout: '关于', keyLinks: '关键连接', dataYear: '数据年份', noMappedLinks: '暂无映射连接。', legend: '地图图例', connectionStrength: '连接强度', nodeSize: '节点大小：影响力', interactionStates: '交互状态', strong: '强', moderate: '中', weak: '弱', strongConnection: '强影响 / 控制', moderateConnection: '中等影响 / 信息流', weakConnection: '弱连接 / 有限可见性', selectedNode: '已选节点', hoveredConnection: '悬停连接', filteredDimmed: '筛选 / 淡化', instructionOne: '选择任一节点，探索影响力、信息与资金如何在网络中流动。', instructionTwo: '按领域、层级或机构筛选，以聚焦特定关系。',
  },
}
