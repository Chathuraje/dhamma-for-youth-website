/**
 * UI STRINGS
 * ==========
 * Every piece of interface text lives here, so the site can be translated by
 * swapping one file rather than hunting through components.
 *
 * The interface is Sinhala, and only Sinhala. An earlier version paired every
 * label with a smaller English gloss; it doubled the reading load on the very
 * readers the site is written for, and made the chrome louder than the
 * teaching. Pāli stays in Latin script — that is the language, not a gloss.
 *
 * When English (or any other language) is added, this becomes `strings.si.ts` /
 * `strings.en.ts` behind a locale switch — the call sites do not change.
 *
 * Lesson *content* is not here. That lives in `src/content/` and is authored
 * per language.
 */

export const t = {
  /* -- navigation & chrome ------------------------------------------------ */
  nav: {
    chapters: "පරිච්ඡේද",
    reference: "යොමු",
    lessons: "පාඩම්",
    glossary: "පාරිභාෂික ශබ්දකෝෂය",
    about: "අපි ගැන",
    contact: "විමසීම්",
    blog: "ලිපි",
    home: "මුල් පිටුව",
    dashboard: "ඉගෙනුම් පුවරුව",
    openDashboard: "ඉගෙනුම් පුවරුව",
    backToSite: "වෙබ් අඩවියට",
    menuOpen: "මෙනුව විවෘත කරන්න",
    menuClose: "මෙනුව වසන්න",
    skipToContent: "අන්තර්ගතයට යන්න",
    breadcrumb: "පිහිටීම",
    mainNav: "ප්‍රධාන සංචලනය",
  },

  theme: {
    toLight: "ආලෝකමත් තේමාවට",
    toDark: "අඳුරු තේමාවට",
  },

  /* -- course structure --------------------------------------------------- */
  course: {
    chapter: "පරිච්ඡේදය",
    lesson: "පාඩම",
    lessons: "පාඩම්",
    section: "කොටස",
    sections: "කොටස්",
    minutes: "මිනිත්තු",
    hours: "පැය",
    inThisLesson: "මෙම පාඩමේ",
    inThisChapter: "මෙම පරිච්ඡේදයේ",
    contents: "අන්තර්ගතය",
    progress: "ප්‍රගතිය",
    read: "කියවා ඇත",
    level: "මට්ටම",
    begin: "පටන් ගන්න",
    resume: "දිගටම කරගෙන යන්න",
    review: "නැවත බලන්න",
    previous: "පෙර",
    next: "මීළඟ",
    previousLesson: "පෙර පාඩම",
    nextLesson: "මීළඟ පාඩම",
    nextChapter: "මීළඟ පරිච්ඡේදය",
    chapterDone: "මෙම පරිච්ඡේදයේ අවසන් පාඩම",
    allLessons: "සියලු පාඩම්",
    allChapters: "සියලු පරිච්ඡේද",
    sources: "මූලාශ්‍ර",
    updated: "යාවත්කාලීන කළේ",
    draft: "කෙටුම්පත",
    keyTerms: "ප්‍රධාන යෙදුම්",
    prerequisites: "පෙර දැනුම",
  },

  difficulty: {
    foundation: "මූලික",
    intermediate: "මධ්‍යම",
    deep: "ගැඹුරු",
    foundationHint: "පෙර දැනුමක් අවශ්‍ය නැත",
    intermediateHint: "පෙර පාඩම් මත පදනම් වේ",
    deepHint: "විස්තරාත්මක හා තාක්ෂණික",
  },

  /* -- block chrome ------------------------------------------------------- */
  block: {
    keyIdea: "ප්‍රධාන අදහස",
    inShort: "කෙටියෙන්",
    note: "සටහන",
    insight: "අවබෝධය",
    caution: "සැලකිලිමත් වන්න",
    tradition: "සම්ප්‍රදායේ",
    practice: "අත්හදා බලන්න",
    literally: "වචනාර්ථය",
  },

  quiz: {
    correct: "නිවැරදියි.",
    incorrect: "හරියටම නොවේ (හේතුව මෙන්න).",
    tryAgain: "නැවත උත්සාහ කරන්න",
  },

  sort: {
    heading: "වර්ග කරන්න",
    pickItem: "අයිතමයක් තෝරා, ඉන්පසු එහි ගණය තෝරන්න.",
    pickBucket: "දැන් ගණයක් තෝරන්න.",
    allPlaced: "සියල්ල තැන්පත් කර ඇත (පිළිතුරු පරීක්ෂා කරන්න).",
    allSorted: "වර්ග කර අවසන්.",
    check: "පරීක්ෂා කරන්න",
    reset: "යළි පිහිටුවන්න",
    placedCorrectly: "නිවැරදිව තැන්පත් කර ඇත",
    belongsIn: "අයත් වන්නේ",
    remove: "ඉවත් කරන්න",
    placeIn: "මෙහි තැන්පත් කරන්න",
    of: "න්",
  },

  reflect: {
    heading: "මෙනෙහි කරන්න",
    placeholder: "ඔබේ කාලය ගන්න...",
    private: "මෙය ඔබේ උපකරණයේ පමණක් ගබඩා වේ. කිසිවිටෙක උඩුගත නොවේ.",
    saved: "සුරකින ලදී",
  },

  flow: {
    heading: "පියවරෙන් පියවර",
    play: "ධාවනය",
    pause: "විරාමය",
    restart: "යළි ආරම්භය",
  },

  shelf: {
    heading: "ග්‍රන්ථ",
    volumes: "ග්‍රන්ථ",
    open: "ග්‍රන්ථයක් තට්ටු කර විවෘත කරන්න",
  },

  taxonomy: {
    heading: "වර්ගීකරණය",
    total: "එකතුව",
    expand: "විවෘත කරන්න",
    collapse: "වසන්න",
    countMismatch: "ගණන් එකතුව නොගැලපේ",
  },

  /* -- simulators --------------------------------------------------------- */
  timeConverter: {
    heading: "කාල ගණකය",
    humanRealm: "මනුෂ්‍ය ලෝකය",
    equals: "යනු",
    years: "අවුරුදු",
    days: "දින",
    hours: "පැය",
    minutes: "මිනිත්තු",
    seconds: "තත්පර",
    tryThese: "මේවා අත්හදා බලන්න",
    humanTime: "මනුලොව කාලය",
    realmTime: "දිව්‍ය ලෝකයේ කාලය",
  },

  octad: {
    heading: "ශුද්ධාෂ්ටකය",
    mahaBhuta: "සතර මහා ධාතු",
    upadaRupa: "උපාදා රූප",
    zoomIn: "විශාලනය",
    tapNode: "විස්තර සඳහා ඕනෑම අංගයක් තට්ටු කරන්න",
    simultaneity: "එකට ඉපදීම",
    showSimultaneity: "එකට ඉපදෙන ආකාරය බලන්න",
  },

  mixer: {
    heading: "ධාතු ප්‍රතිශත සිමියුලේටරය",
    result: "ප්‍රතිඵලය",
    balanced: "සමතුලිතයි",
    balancedNote: "කිසිදු ධාතුවක් ප්‍රමුඛ නොවේ. ධාතුවක් 40%ට වඩා වැඩි කර බලන්න.",
    reset: "යළි පිහිටුවන්න",
    puzzles: "ප්‍රශ්න",
  },

  slicer: {
    heading: "කැපුම් අනුකරණය",
    material: "ද්‍රව්‍යය",
    tool: "උපකරණය",
    cut: "කපන්න",
    reset: "යළි පිහිටුවන්න",
    magnified: "අන්වීක්ෂීය දර්ශනය",
    dragToCut: "කැපීමට තිරය හරහා ඇදගෙන යන්න හෝ බොත්තම ඔබන්න",
  },

  speech: {
    heading: "වාග් වේග සංසන්දනය",
    wordsPerSecond: "තත්පරයට වචන",
    timeToSay: "පැවසීමට ගතවන කාලය",
    words: "වචන",
  },

  ladder: {
    heading: "අනුපිළිවෙල",
    next: "ඊළඟට වඩා වේගවත් දේ",
    reset: "යළි පිහිටුවන්න",
  },

  moment: {
    heading: "චිත්තක්ෂණය",
    cittaTrack: "සිත් (චිත්තක්ෂණ)",
    rupaTrack: "රූපය (එක් ආයු කාලයක්)",
    momentLabel: "චිත්තක්ෂණය",
    rupaUppada: "රූපය උපදී",
    rupaThiti: "රූපය ජරාවට පත්වෙයි",
    rupaBhanga: "රූපය නිරුද්ධ වේ",
    cittaPerUnit: "සිත් ඉපදී නිරුද්ධ වන වාර",
    rupaPerUnit: "රූප ඉපදී නිරුද්ධ වන වාර",
  },

  spin: {
    heading: "අලාත චක්‍රය (ගිනි පන්දම)",
    speed: "වේගය",
    slow: "සෙමින්",
    fast: "වේගයෙන්",
    reducedMotionNote:
      "ඔබේ උපකරණයේ චලන අඩු කිරීම සක්‍රීයයි, එනිසා රෝදය කැරකෙන්නේ නැත. ස්ලයිඩරය චලනය කර තත්ත්ව දෙකේ විස්තර කියවන්න.",
  },

  hierarchy: {
    heading: "ධුරාවලිය",
    tapToInspect: "විස්තර සඳහා තට්ටු කරන්න",
  },

  deconstruct: {
    heading: "පදාර්ථය බිඳ දැක්වීම",
    chooseObject: "වස්තුවක් තෝරන්න",
    breakItDown: "බිඳ දමන්න",
    stage: "මට්ටම",
    again: "නැවත",
    dominant: "ප්‍රමුඛ ධාතුව",
    separation: "වෙන් වන ආකාරය",
    reachedEnd: "තවදුරටත් බෙදිය නොහැක",
  },

  paramattha: {
    heading: "පරමාර්ථ ධර්ම 82",
    unlocked: "විවෘත වූ",
    locked: "තවම විවෘත නොවූ",
    unlockedIn: "විවෘත වන පාඩම",
    progressNote: "පාඩම් සම්පූර්ණ කරන විට තව තවත් පරමාර්ථ විවෘත වේ.",
  },

  spine: {
    eyebrow: "අභිධර්ම පාඨමාලාව",
    headline: "සම්මුතියේ සිට පරමාර්ථය දක්වා",
    blurb:
      "පරිච්ඡේද හතරක්. අභිධර්මය යනු කුමක්ද යන්නෙන් පටන් ගෙන, පදාර්ථය බිඳ දැක්ම හරහා, සිතේ ක්ෂණිකත්වය සහ ලෝකයේ කෙළවර දක්වා.",
    study: "අධ්‍යයනය",
    again: "නැවත පටන් ගන්න",
    clear: "ප්‍රගතිය මකන්න",
  },

  reference: {
    heading: "යොමු මාතෘකා",
    label: "යොමුව",
    open: "විවෘත කරන්න",
    openHere: "මෙහිම කියවීමට තට්ටු කරන්න",
    back: "ආපසු",
    fullPage: "සම්පූර්ණ පිටුවෙහි කියවන්න",
    related: "සම්බන්ධ මාතෘකා",
    notRequired: "මේවා පාඩම් නොවේ (පසුබිම් තොරතුරු පමණි). කියවීම අනිවාර්ය නැත.",
  },

  /* -- glossary ----------------------------------------------------------- */
  glossary: {
    heading: "පාරිභාෂික ශබ්දකෝෂය",
    search: "යෙදුම් සොයන්න",
    searchHint: "දෙමළ/ඉංග්‍රීසි උච්චාරණයෙන් හෝ සිංහලෙන් සොයන්න",
    results: "ප්‍රතිඵල",
    of: "න්",
    terms: "යෙදුම්",
    noResults: "ගැලපෙන කිසිවක් හමු නොවීය",
    seeAlso: "මෙයද බලන්න",
    introducedIn: "හඳුන්වා දෙන පාඩම",
    clear: "හිස් කරන්න",
  },

  /* -- misc --------------------------------------------------------------- */
  empty: {
    noLessons: "තවම පාඩම් ප්‍රකාශයට පත් කර නැත.",
    noLessonsBody: "පාඨමාලා ව්‍යුහය සකස් කර ඇත. පළමු පාඩම ඉක්මනින්.",
    comingSoon: "ඉදිරියේදී",
  },

  notFound: {
    title: "හමු නොවීය",
    body: "මෙම පිටුව හට ගෙන, මොහොතක් පවතිමින්, නිරුද්ධ විය (නැතහොත් කිසිදා හට නොගත්තේය).",
  },

  footer: {
    study: "අධ්‍යයනය",
    freeNote: "අධ්‍යයනය සඳහා නොමිලේ පිරිනමා ඇත.",
    privacyNote: "ඔබේ ප්‍රගතිය ඔබේ බ්‍රව්සරයේ පමණි. කිසිවක් උඩුගත නොවේ.",
  },
  /* -- the learning app shell --------------------------------------------- */
  app: {
    /** Sidebar group headings. */
    groupCourse: "පාඨමාලාව",
    groupMine: "මගේ ඉගෙනුම",
    groupLibrary: "පුස්තකාලය",

    practice: "පුහුණුව සහ ප්‍රශ්න",
    community: "සමාජය",
    resources: "සම්පත්",
    myLearning: "මගේ ඉදිරි ගමන",
    notes: "සටහන්",
    bookmarks: "පිටු සලකුණු",
    settings: "සැකසුම්",

    search: "පරිච්ඡේද, පාඩම්, යෙදුම් සොයන්න...",
    searchLabel: "අඩවිය සොයන්න",
    searchEmpty: "ගැලපෙන කිසිවක් හමු නොවීය",
    searchHint: "සෙවීමට ටයිප් කරන්න",
    close: "වසන්න",
    railOpen: "පිටු තීරුව විවෘත කරන්න",
    railClose: "පිටු තීරුව වසන්න",
    railCollapse: "පිටු තීරුව හකුළන්න",
    railExpand: "පිටු තීරුව දිග හරින්න",
    comingSoon: "ඉදිරියේදී",
    comingSoonNote:
      "මෙම කොටස තවම සූදානම් නැත. ඇති දෙය පමණක් පෙන්වීම, නැති දෙයක් ඇති සේ පෙන්වීමට වඩා හොඳය.",
  },

  /* -- dashboard ----------------------------------------------------------- */
  dashboard: {
    heroPillOne: "ධර්මය දැනුම",
    heroPillTwo: "ජීවිතයට ආලෝකයක්",
    heroTitle: "පියවරෙන් පියවර අභිධර්මය ඉගෙන ගනිමු",
    heroBody:
      "පැහැදිලි වචනවලින්, නිවුණු මනසක්, කරුණාමය ජීවිතයක් සඳහා අභිධර්ම දර්ශනය ඔබ සමඟ.",
    start: "ඉගෙනීම ආරම්භ කරන්න",
    resume: "නැවතුණු තැනින් දිගටම",
    explorePath: "ඉගෙනුම් මාර්ගය බලන්න",

    yourProgress: "මගේ ඉගෙනීමේ ප්‍රගතිය",
    viewDetails: "විස්තර බලන්න",
    lessonsCompleted: "පාඩම් සම්පූර්ණයි",
    sectionsRead: "කොටස් කියවා ඇත",
    encouragement: "ධෛර්යයෙන් ඉගෙන යන්න. කුඩා පියවරක් වුව ප්‍රගතියකි.",

    continueHeading: "ඉගෙනීම දිගටම කරගෙන යන්න",
    continueCta: "දිගටම ඉගෙන ගන්න",
    currentLesson: "දැන් ඇති පාඩම",
    lessonsLeft: "පාඩම් ඉතිරිව ඇත",
    allDone: "සියලු පාඩම් සම්පූර්ණයි.",

    stateDone: "සම්පූර්ණයි",
    stateCurrent: "දැනට",
    stateNew: "නව",

    knowledgeMap: "අභිධර්ම දැනුම් සිතියම",
    fullMap: "සම්පූර්ණ සිතියම",

    conceptOfDay: "අද දින සංකල්පය",
    allConcepts: "සියලුම බලන්න",

    lessonsRemaining: "තවත් {n} පාඩම් ඉතිරිව ඇත",

    reference: "යොමු මාතෘකා",
    referenceNote: "පාඩම් නමින් යොමු කරන පසුබිම් තොරතුරු. කියවීම අනිවාර්ය නැත.",

    learningPath: "ඉගෙනුම් මාර්ගය",
    viewFullPath: "සම්පූර්ණ මාර්ගය",
    viewAll: "සියල්ල බලන්න",
    joinDiscussion: "සාකච්ඡාවට එක්වන්න",
    notStarted: "තවම පටන් ගෙන නැත",
    startFirst: "පළමු පාඩමෙන් පටන් ගන්න",
  },

  /* -- chapter page -------------------------------------------------------- */
  chapter: {
    about: "මෙම පරිච්ඡේදය ගැන",
    objectives: "ඉගෙනුම් අරමුණු",
    lessonsIn: "මෙම පරිච්ඡේදයේ පාඩම්",
    keyPoints: "ප්‍රධාන කරුණු",
    practice: "පුහුණුව",
    references: "මූලාශ්‍ර",
    overview: "දළ විශ්ලේෂණය",
    continue: "දිගටම ඉගෙන ගන්න",
    bookmark: "පරිච්ඡේදය සලකුණු කරන්න",
    bookmarked: "සලකුණු කර ඇත",
    thinkAbout: "මේ ගැන සිතන්න",
    viewAllLessons: "සියලු පාඩම් බලන්න",
    views: "පරිච්ඡේද දර්ශන",
    level: "මට්ටම",
    noKeyPoints: "මෙම පරිච්ඡේදයේ තවම ප්‍රධාන කරුණු සටහන් කර නැත.",
    noPractice: "මෙම පරිච්ඡේදයේ තවම ප්‍රශ්න නැත.",
    noSources: "මූලාශ්‍ර සඳහන් කර නැත.",
    practiceCount: "ප්‍රශ්න",
    fromLesson: "පාඩම",
  },

  /* -- lesson page --------------------------------------------------------- */
  lesson: {
    outline: "පාඩමේ කොටස්",
    summary: "කෙටි සාරාංශය",
    studyMode: "අධ්‍යයන ආකාරය",
    studyModeOn: "අධ්‍යයන ආකාරය සක්‍රීයයි",
    studyModeNote: "පැති තීරු සඟවා, පාඩම පමණක් පෙන්වයි.",
    bookmark: "සලකුණු කරන්න",
    bookmarked: "සලකුණු කර ඇත",
    minRead: "මිනිත්තු කියවීමක්",
    lessonOf: "පාඩම",
    of: "න්",
    markRead: "කියවා අවසන් ලෙස සලකුණු කරන්න",
    quickPractice: "කෙටි පුහුණුව",
    tryQuiz: "ප්‍රශ්නවලට යන්න",
  },

  /* -- practice ------------------------------------------------------------ */
  practice: {
    heading: "පුහුණුව සහ ප්‍රශ්න",
    intro:
      "පාඩම් හරහා විසිර ඇති ප්‍රශ්න එකට. ලකුණු නැත, පෙළක් නැත. ප්‍රශ්නය ඇත්තේ ඔබ පිළිතුරක් තෝරන තුරු පැහැදිලි කිරීම නොපෙන්වීමටයි.",
    answered: "පිළිතුරු දී ඇත",
    unanswered: "ඉතිරි",
    openLesson: "පාඩමට යන්න",
    empty: "තවම ප්‍රශ්න එකතු කර නැත.",
  },

  /* -- my learning / notes / bookmarks ------------------------------------- */
  mine: {
    learningHeading: "මගේ ඉදිරි ගමන",
    learningIntro:
      "ඔබ කියවා ඇති දේ, ඉතිරිව ඇති දේ. සියල්ල ඔබේ බ්‍රව්සරයේම ගබඩා වේ.",
    notesHeading: "සටහන්",
    notesIntro: "ඔබ පාඩම්වල ලියූ මෙනෙහි කිරීම්. මේවා ඔබට පමණි.",
    notesEmpty: "තවම සටහනක් ලියා නැත. පාඩමක 'මෙනෙහි කරන්න' කොටසින් පටන් ගන්න.",
    bookmarksHeading: "පිටු සලකුණු",
    bookmarksIntro: "ඔබ නැවතුණු තැන් — සෑම පාඩමකම අවසන් වරට කියවූ කොටස.",
    bookmarksEmpty: "තවම සලකුණක් නැත. පාඩමක් කියවීම පටන් ගත් විට මෙහි දිස්වේ.",
    learningEmpty: "තවම පාඩමක් පටන් ගෙන නැත.",
    continueFrom: "මෙතැනින් දිගටම",
    lastSection: "අවසන් වරට",
  },

  /* -- settings ------------------------------------------------------------ */
  settings: {
    heading: "සැකසුම්",
    appearance: "පෙනුම",
    theme: "තේමාව",
    themeLight: "ආලෝකමත්",
    themeDark: "අඳුරු",
    data: "ඔබේ දත්ත",
    dataNote:
      "ගිණුමක් නැත, ලොග් වීමක් නැත. ඔබේ ප්‍රගතිය, පිළිතුරු සහ සටහන් ඔබේම බ්‍රව්සරයේ ගබඩා වන අතර කිසිවිටෙක උඩුගත නොවේ.",
  },

  /* -- marketing pages ----------------------------------------------------- */
  contact: {
    heading: "විමසීම්",
    intro:
      "පාඩමක වරදක් හෝ පැහැදිලි නොවන තැනක් දුටුවොත්, කරුණාකර දන්වන්න. නිවැරදි කිරීම කවදත් පිළිගනිමු.",
    email: "විද්‍යුත් තැපෑල",
    formNote:
      "මෙහි පෝරමයක් නැත (එය ඔබේ පණිවිඩය තෙවන පාර්ශ්වයකට යැවීමක් වන බැවින්). කෙලින්ම ලියන්න.",
    corrections: "නිවැරදි කිරීම්",
    correctionsNote:
      "දෝෂයක් දන්වන විට පාඩමේ නම සහ කොටස සඳහන් කළොත් වේගයෙන් සොයාගත හැක.",
  },

  blog: {
    heading: "ලිපි",
    intro:
      "පාඩම් අතරට නොගැලපෙන එහෙත් ලිවීමට වටින කරුණු. පාඨමාලාවේ කොටසක් නොවේ.",
    empty: "තවම ලිපියක් ප්‍රකාශ කර නැත.",
    emptyBody: "ලිපි ලියන විට මෙහි දිස්වේ.",
    readingTime: "කියවීමට",
    published: "ප්‍රකාශිත",
    allPosts: "සියලු ලිපි",
    backToBlog: "ලිපි වෙත",
  },
} as const;
