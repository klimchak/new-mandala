import {MandalaModel} from './modules/shared/models/mandala.model';

// export const dataTablePath = '../src/assets/database/db.db';
export const dataTablePath = '\\assets\\database\\db.db';

export enum Tab {
  editor,
  dbPage,
}

export enum PaperSize {
  A4 = 1,
  A3,
  A2,
  A1
}

export enum MandalaVariant {
  LIGHT_FROM_CENTER_MAND = 1,
  LIGHT_IN_CENTER_MAND,
  LIGHT_IN_CENTER_LIGHT,
  LIGHT_FROM_CENTER_LIGHT,
  MARGIN_FROM_APEX_TO_CENTER,
  MARGIN_FROM_CENTER_TO_APEX,
}

export const MANDALA_VARIANTS = [
  {value: MandalaVariant.LIGHT_FROM_CENTER_MAND, title: 'По лучам от центра мандалы', inactive: false},
  {value: MandalaVariant.LIGHT_IN_CENTER_MAND, title: 'По лучам к центру мандалы', inactive: false},
  {value: MandalaVariant.LIGHT_FROM_CENTER_LIGHT, title: 'По лучам от центра луча', inactive: true},
  {value: MandalaVariant.LIGHT_IN_CENTER_LIGHT, title: 'По лучам к центру луча', inactive: true},
  {value: MandalaVariant.MARGIN_FROM_CENTER_TO_APEX, title: 'По грани от центра к вершине', inactive: true},
  {value: MandalaVariant.MARGIN_FROM_APEX_TO_CENTER, title: 'По грани от вершины к центру', inactive: true},
];

export const PAPER_VARIANTS = [
  {value: PaperSize.A4, title: 'А4'},
  {value: PaperSize.A3, title: 'А3'},
  {value: PaperSize.A2, title: 'А2'},
  {value: PaperSize.A1, title: 'А1'},
];

export const arr_ru = {
  а: 1, б: 2, в: 3, г: 4,
  д: 5, е: 6, ё: 7, ж: 8, з: 9,
  и: 10, й: 11, к: 12, л: 13,
  м: 14, н: 15, о: 16, п: 17,
  р: 18, с: 19, т: 20, у: 21,
  ф: 22, х: 23, ц: 24, ч: 25,
  ш: 26, щ: 27, ь: 28, ы: 29,
  ъ: 30, э: 31, ю: 32, я: 33
};

export const defaultModel: MandalaModel = {
  rayA: {
    rayCoord: [],
    sector: []
  },
  rayB: {
    rayCoord: [],
    sector: []
  },
  rayC: {
    rayCoord: [],
    sector: []
  },
  rayA2: {
    rayCoord: [],
    sector: []
  },
  rayB2: {
    rayCoord: [],
    sector: []
  },
  rayC2: {
    rayCoord: [],
    sector: []
  },
  source: {
    word: '',
    wordInInt: '',
    countWord: 0,
    colorWord: '',
    rangeMm: 0,
    strokeWidth: 0.5,
    rangeFontSize: 0,
    pageSize: {width: 0, height: 0},
    mandalaVersion: 0,
    gridThisFigure: {},
    drawThisFigure: {},
  }
};
