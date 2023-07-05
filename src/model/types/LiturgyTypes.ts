
export interface LiturgyData {
    uniqueId: string;
    name: string;
    dies: string;
    hora: string;
    parts: LiturgyPart[];
}

export const liturgyPartTypes = [
    { name: "Cantus", value: "cantus" },
    { name: "Rubric", value: "rubric" },
    { name: "Versicle", value: "versicle" },
    { name: "Dialog", value: "dialogus" },
    { name: "Psalm", value: "psalmus" },
    { name: "Text", value: "recitableText" },
] as const;

export interface LiturgyPart {
    cantusId?: string;
    uniqueId: string;
    codexSourceId?: string;
    genre?: Genre;
    notes?: string;
    bibleQuote?: BibleQuote[];
    title?: string;
    contents: any;
    type: typeof liturgyPartTypes[number]["value"];
}


export interface Rubric extends LiturgyPart {
    contents: string;
    type: "rubric";
}


export interface BibleQuote {
    book?: typeof BibleBooksWithLabels[number]["value"];
    startChapter?: number;
    startVerse?: number;
    endChapter?: number;
    endVerse?: number;
}

export const BibleBooksWithLabels = [
    { value: "Gen", label: "Genesis", hun: "Teremtés könyve", hunShort: "Ter", },
    { value: "Exod", label: "Exodus", hun: "Kivonulás könyve", hunShort: "Kiv", },
    { value: "Lev", label: "Leviticus", hun: "Leviták könyve", hunShort: "Lev", },
    { value: "Num", label: "Numeri", hun: "Számok könyve", hunShort: "Szám", },
    { value: "Deut", label: "Deuteronomium", hun: "Második Törvénykönyv", hunShort: "MTörv", },
    { value: "Ios", label: "Iosue", hun: "Józsue könyve", hunShort: "Józs", },
    { value: "Iud", label: "Iudicum", hun: "Bírák könyve", hunShort: "Bír", },
    { value: "Ruth", label: "Ruth", hun: "Rút könyve", hunShort: "Rút", },
    { value: "I Reg", label: "I Regum", hun: "Sámuel első könyve", hunShort: "1Sám", },
    { value: "II Reg", label: "II Regum", hun: "Sámuel második könyve", hunShort: "2Sám", },
    { value: "III Reg", label: "III Regum", hun: "Királyok első könyve", hunShort: "1Kir", },
    { value: "IV Reg", label: "IV Regum", hun: "Királyok második könyve", hunShort: "2Kir", },
    { value: "I Par", label: "I Paralipomenon", hun: "A krónikák első könyve", hunShort: "1Krón", },
    { value: "II Par", label: "II Paralipomenon", hun: "Krónikák második könyve", hunShort: "2Krón", },
    { value: "I Esd", label: "I Esdrae", hun: "Ezdrás könyve", hunShort: "Ezdr", },
    { value: "II Esd", label: "II Esdrae", hun: "Nehemiás könyve", hunShort: "Neh", },
    { value: "Tob", label: "Tobias", hun: "Tóbiás könyve", hunShort: "Tób", },
    { value: "Iudith", label: "Iudith", hun: "Judit könyve", hunShort: "Judit", },
    { value: "Esth", label: "Esther", hun: "Eszter könyve", hunShort: "Eszt", },
    { value: "Iob", label: "Iob", hun: "Jób könyve", hunShort: "Jób", },
    { value: "Ps", label: "Psalmi", hun: "A zsoltárok könyve", hunShort: "Zsolt", },
    { value: "Prov", label: "Proverbia", hun: "A példabeszédek könyve", hunShort: "Péld", },
    { value: "Eccl", label: "Ecclesiastes", hun: "A Prédikátor könyve", hunShort: "Préd", },
    { value: "Cant", label: "Canticum Canticorum", hun: "Az énekek éneke", hunShort: "Én", },
    { value: "Sap", label: "Sapientia", hun: "A bölcsesség könyve", hunShort: "Bölcs", },
    { value: "Eccli", label: "Ecclesiasticus", hun: "Jézus, Sirák fiának könyve", hunShort: "Sír", },
    { value: "Is", label: "Isaias", hun: "Izajás könyve", hunShort: "Iz", },
    { value: "Ier", label: "Ieremias", hun: "Jeremiás könyve", hunShort: "Jer", },
    { value: "Lam", label: "Lamentationes", hun: "Jeremiás siralmai", hunShort: "Siralm", },
    { value: "Bar", label: "Baruch", hun: "Báruk könyve", hunShort: "Bár", },
    { value: "Ez", label: "Ezechiel", hun: "Ezekiel jövendölése", hunShort: "Ez", },
    { value: "Dan", label: "Daniel", hun: "Dániel jövendölése", hunShort: "Dán", },
    { value: "Os", label: "Osee", hun: "Ózeás jövendölése", hunShort: "Óz", },
    { value: "Ioel", label: "Ioel", hun: "Joel jövendölése", hunShort: "Jo", },
    { value: "Am", label: "Amos", hun: "Ámosz jövendölése", hunShort: "Ám", },
    { value: "Abd", label: "Abdias", hun: "Abdiás jövendölése", hunShort: "Abd", },
    { value: "Ion", label: "Ionas", hun: "Jónás jövendölése", hunShort: "Jón", },
    { value: "Mich", label: "Michaeas", hun: "Mikeás jövendölése", hunShort: "Mik", },
    { value: "Nah", label: "Nahum", hun: "Náhum jövendölése", hunShort: "Náh", },
    { value: "Hab", label: "Habacuc", hun: "Habakuk jövendölése", hunShort: "Hab", },
    { value: "Soph", label: "Sophonias", hun: "Szofoniás jövendölése", hunShort: "Szof", },
    { value: "Agg", label: "Aggaeus", hun: "Aggeus jövendölése", hunShort: "Agg", },
    { value: "Zach", label: "Zacharias", hun: "Zakariás jövendölése", hunShort: "Zak", },
    { value: "Mal", label: "Malachias", hun: "Malakiás jövendölése", hunShort: "Mal", },
    { value: "I Mach", label: "I Machabaeorum", hun: "A Makkabeusok első könyve", hunShort: "1Makk", },
    { value: "II Mach", label: "II Machabaeorum", hun: "A Makkabeusok második könyve", hunShort: "2Makk", },
    { value: "Mt", label: "Matthaeus", hun: "Evangélium Máté szerint", hunShort: "Mt", },
    { value: "Mc", label: "Marcus", hun: "Evangélium Márk szerint", hunShort: "Mk", },
    { value: "Lc", label: "Lucas", hun: "Evangélium Lukács szerint", hunShort: "Lk", },
    { value: "Io", label: "Ioannes", hun: "Evangélium János szerint", hunShort: "Jn", },
    { value: "Act", label: "Actus Apostolorum", hun: "Az apostolok cselekedetei", hunShort: "Csel", },
    { value: "Rom", label: "Ad Romanos", hun: "A rómaiaknak írt levél", hunShort: "Róm", },
    { value: "I Cor", label: "Ad Corinthios I", hun: "Első levél a korintusiaknak", hunShort: "1Kor", },
    { value: "II Cor", label: "Ad Corinthios II", hun: "Második levél a korintusiaknak", hunShort: "2Kor", },
    { value: "Gal", label: "Ad Galatas", hun: "Levél a galatáknak", hunShort: "Gal", },
    { value: "Eph", label: "Ad Ephesios", hun: "Levél az efezusiaknak", hunShort: "Ef", },
    { value: "Phil", label: "Ad Philippenses", hun: "Levél a filippieknek", hunShort: "Fil", },
    { value: "Col", label: "Ad Colossenses", hun: "Levél a kolosszeieknek", hunShort: "Kol", },
    { value: "I Thess", label: "Ad Thessalonicenses I", hun: "Első levél a tesszalonikieknek", hunShort: "1Tessz", },
    { value: "II Thess", label: "Ad Thessalonicenses II", hun: "Második levél a tesszalonikieknek", hunShort: "2Tessz", },
    { value: "I Tim", label: "Ad Timotheum I", hun: "Első levél Timóteusnak", hunShort: "1Tim", },
    { value: "II Tim", label: "Ad Timotheum II", hun: "Második levél Timóteusnak", hunShort: "2Tim", },
    { value: "Tit", label: "Ad Titum", hun: "Levél Títusznak", hunShort: "Tít", },
    { value: "Phlm", label: "Ad Philemonem", hun: "Levél Filemonnak", hunShort: "Filem", },
    { value: "Heb", label: "Ad Hebraeos", hun: "Levél a zsidóknak", hunShort: "Zsid", },
    { value: "Iac", label: "Iacobi", hun: "Jakab levele", hunShort: "Jak", },
    { value: "I Pet", label: "I Petri", hun: "Péter első levele", hunShort: "1Pét", },
    { value: "II Pet", label: "II Petri", hun: "Péter második levele", hunShort: "2Pét", },
    { value: "I Io", label: "I Ioannes", hun: "János első levele", hunShort: "1Ján", },
    { value: "II Io", label: "II Ioannes", hun: "János második levele", hunShort: "2Ján", },
    { value: "III Io", label: "III Ioannes", hun: "János harmadik levele", hunShort: "3Ján", },
    { value: "Iudae", label: "Iudae", hun: "Júdás levele", hunShort: "Júd", },
    { value: "Apoc", label: "Apocalypsis Ioannes", hun: "János jelenései", hunShort: "Jel", }
] as const;

export type Genre = typeof GenreOptionsWithLabels[number]["value"];

export const GenreOptionsWithLabels = [
    { value: "Intr", label: "Introitus", partType: "cantus" }, //cantus
    { value: "IntrV", label: "Versus Introituum", partType: "cantus" }, // cantus
    { value: "Gr", label: "Graduale", partType: "cantus" },
    { value: "GrV", label: "Versus Gradualium", partType: "cantus" },
    { value: "Tr", label: "Tractus", partType: "cantus" },
    { value: "All", label: "Alleluia", partType: "cantus" },
    { value: "Seq", label: "Sequentia", partType: "cantus" },
    { value: "Off", label: "Offertorium", partType: "cantus" },
    { value: "OffV", label: "Versus Offertoriorum", partType: "cantus" },
    { value: "Comm", label: "Communio", partType: "cantus" },
    { value: "Comm", label: "Versus Communionum", partType: "cantus" },
    { value: "Inv", label: "Invitatorium", partType: "cantus" },
    { value: "Ant", label: "Antiphona", partType: "cantus" },
    { value: "Resp", label: "Responsorium", partType: "cantus" },
    { value: "RespV", label: "Responsorium verse", partType: "cantus" },
    { value: "Hymn", label: "Hymnus", partType: "cantus" },
    { value: "Psalm", label: "Psalmus", partType: "psalmus" },
    { value: "Cant", label: "Canticum", partType: "psalmus" },
    { value: "Cap", label: "Capitulum", partType: "recitableText" },
    { value: "LectBr", label: "Lectio Brevis", partType: "recitableText" },
    { value: "Lect", label: "Lectio", partType: "recitableText" },
    { value: "Oratio", label: "Oratio", partType: "recitableText" },
    { value: "Bened", label: "Benedictio", partType: "recitableText" },
    { value: "Versic", label: "Versiculus", partType: "versicle" },
    { value: "Prec", label: "Preces", partType: "dialogus" },
] as const;
