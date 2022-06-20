import {CoreService} from '../services/core/core.service';
import {toDOM, toJSON} from 'dom-to-json';
import {MandalaParamsModel} from './mandala-params.model';

// primary models

export interface MandalaModel {
  id?: number;
  personalInfo?: PersonalInfo;
  rayA: RayModel;
  rayB: RayModel;
  rayC: RayModel;
  rayA2: RayModel;
  rayB2: RayModel;
  rayC2: RayModel;
  source: SourceForModelMandala;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  patronymic?: string;
  description?: string;
  createDate: Date;
}

export interface Source {
  word: string;
  wordInInt: string;
  countWord: number;
  colorWord: string;
  rangeMm: number;
  rangeFontSize: number;
  pageSize: {
    width: number;
    height: number;
  };
  mandalaVersion: number;
}

export interface SourceForModelMandala extends Source {
  mandalaVersion: number;
  gridThisFigure: any;
  drawThisFigure: any;
  drawForBase: any;
}

export interface RayModel {
  rayCoord: any[];
  sector: any[];
}

// database models

export interface MandalaModelDB {
  id: number;
  createDate: Date;
  personalInfo: string;
  rayA?: string;
  rayB?: string;
  rayC?: string;
  rayA2?: string;
  rayB2?: string;
  rayC2?: string;
  imageData?: string;
  source: string;
  drawForBase?: string;
  gridThisFigure?: string;
  drawThisFigure?: string;
  mandalaParamsObj?: string;
}

export interface DBCallbackAbbreviated {
  id: number;
  personalInfo: string;
  source: string;
}

export const selectALLRows = [
  'id', 'createDate', 'personalInfo', 'rayA',
  'rayB', 'rayC', 'rayA2', 'rayB2',
  'rayC2', 'imageData', 'source', 'drawForBase',
  'gridThisFigure', 'drawThisFigure', 'mandalaParamsObj'
];
export const selectTableRows = ['id', 'createDate', 'personalInfo', 'source'];

// table models

export interface MandalaTableModel extends Source, PersonalInfo {
  id?: number;
}

export class MandalaTableModelClass implements MandalaTableModel {
  id?: number;

  firstName: string;
  lastName: string;
  patronymic?: string;
  createDate: Date;
  description?: string;

  word: string;
  wordInInt: string;
  countWord: number;
  colorWord: string;
  rangeMm: number;
  rangeFontSize: number;
  pageSize: {
    width: number;
    height: number;
  };
  mandalaVersion: number;

  constructor(id: number, personalInfo: string, source?: string) {
    this.id = id;

    const personalInfoObj = JSON.parse(personalInfo) as PersonalInfo;
    this.firstName = personalInfoObj.firstName;
    this.lastName = personalInfoObj.lastName;
    this.patronymic = personalInfoObj.patronymic;
    this.description = personalInfoObj.description;
    this.createDate = new Date(personalInfoObj.createDate);

    const sourceObj = JSON.parse(source) as Source;
    this.word = sourceObj.word;
    this.wordInInt = sourceObj.wordInInt;
    this.countWord = sourceObj.countWord;
    this.colorWord = sourceObj.colorWord;
    this.rangeMm = sourceObj.rangeMm;
    this.rangeFontSize = sourceObj.rangeFontSize;
    this.pageSize = sourceObj.pageSize;
    this.mandalaVersion = sourceObj.mandalaVersion;
  }

  public getDataForDB(): MandalaModelDB {
    return {
      id: this.id,
      createDate: this.createDate,
      personalInfo: JSON.stringify({
        firstName: this.firstName,
        lastName: this.lastName,
        patronymic: this.patronymic,
        description: this.description,
        createDate: this.createDate
      }),
      source: JSON.stringify({
        word: this.word,
        wordInInt: this.wordInInt,
        countWord: this.countWord,
        colorWord: this.colorWord,
        rangeMm: this.rangeMm,
        rangeFontSize: this.rangeFontSize,
        pageSize: {
          width: this.pageSize.width,
          height: this.pageSize.height,
        },
        mandalaVersion: this.mandalaVersion,
      })
    } as MandalaModelDB;
  }
}


export class MandalaModelUtility {
  // for work
  public mandala: MandalaModel;
  public mandalaParamsObjModel: MandalaParamsModel;
  public image: string;

  // for base
  private databaseInterimData = {
    id: null,
    createDate: null,
    personalInfo: null,
    rayA: null,
    rayB: null,
    rayC: null,
    rayA2: null,
    rayB2: null,
    rayC2: null,
    imageData: null,
    source: null,
    drawForBase: null,
    gridThisFigure: null,
    drawThisFigure: null,
    mandalaParamsObj: null,
  };

  private coreService;

  constructor(
    coreService: CoreService,
    forBaseOptions?: { mandala: MandalaModel; mandalaParamsObj: MandalaParamsModel },
    databaseInfo?: any
  ) {
    this.coreService = coreService;
    if (typeof forBaseOptions !== 'undefined') {
      this.setAllData(forBaseOptions.mandala, forBaseOptions.mandalaParamsObj);
    } else if (databaseInfo) {
      this.setAllBaseDataInMandalaModel(databaseInfo);
    }
  }

  public get paramsForCreateRecord(): MandalaModelDB[] {
    return [
      {
        id: this.databaseInterimData.id || Date.now(),
        createDate: this.databaseInterimData.personalInfo.createDate,
        personalInfo: JSON.stringify(this.databaseInterimData.personalInfo),
        rayA: JSON.stringify(this.databaseInterimData.rayA),
        rayB: JSON.stringify(this.databaseInterimData.rayB),
        rayC: JSON.stringify(this.databaseInterimData.rayC),
        rayA2: JSON.stringify(this.databaseInterimData.rayA2),
        rayB2: JSON.stringify(this.databaseInterimData.rayB2),
        rayC2: JSON.stringify(this.databaseInterimData.rayC2),
        imageData: this.databaseInterimData.imageData,
        source: JSON.stringify(this.databaseInterimData.source),
        drawForBase: this.databaseInterimData.drawForBase,
        gridThisFigure: JSON.stringify(this.databaseInterimData.gridThisFigure),
        drawThisFigure: JSON.stringify(this.databaseInterimData.drawThisFigure),
        mandalaParamsObj: JSON.stringify(this.databaseInterimData.mandalaParamsObj),
      }
    ];
  }

  public setMandalaModel(): void {
    this.coreService.modelMandala = this.mandala;
    this.coreService.mandalaParamsObj = this.mandalaParamsObjModel;
    this.coreService.image = this.image;
  }

  public setAllData(mandala: MandalaModel, mandalaParamsObj: MandalaParamsModel): void {
    this.databaseInterimData.id = mandala.id;
    this.databaseInterimData.createDate = mandala.personalInfo.createDate;
    this.databaseInterimData.personalInfo = mandala.personalInfo;
    this.databaseInterimData.rayA = mandala.rayA;
    this.databaseInterimData.rayB = mandala.rayB;
    this.databaseInterimData.rayC = mandala.rayC;
    this.databaseInterimData.rayA2 = mandala.rayA2;
    this.databaseInterimData.rayB2 = mandala.rayB2;
    this.databaseInterimData.rayC2 = mandala.rayC2;
    this.databaseInterimData.source = {
      word: mandala.source.word,
      wordInInt: mandala.source.wordInInt,
      countWord: mandala.source.countWord,
      colorWord: mandala.source.colorWord,
      rangeMm: mandala.source.rangeMm,
      rangeFontSize: mandala.source.rangeFontSize,
      pageSize: mandala.source.pageSize,
      mandalaVersion: mandala.source.mandalaVersion,
    };
    this.databaseInterimData.drawForBase = mandala.source?.drawForBase;
    this.databaseInterimData.gridThisFigure = mandala.source?.gridThisFigure;
    this.databaseInterimData.drawThisFigure = toJSON(mandala.source?.drawThisFigure.node);

    this.databaseInterimData.mandalaParamsObj = JSON.stringify(mandalaParamsObj);

    this.databaseInterimData.imageData = this.coreService.image;
  }

  public setAllBaseDataInMandalaModel(databaseInfo: MandalaModelDB): void {
    const source = JSON.parse(databaseInfo.source) as Source;
    this.mandala = {
      id: databaseInfo.id,
      personalInfo: JSON.parse(databaseInfo.personalInfo) as PersonalInfo,
      rayA: JSON.parse(databaseInfo.rayA) as RayModel,
      rayB: JSON.parse(databaseInfo.rayB) as RayModel,
      rayC: JSON.parse(databaseInfo.rayC) as RayModel,
      rayA2: JSON.parse(databaseInfo.rayA2) as RayModel,
      rayB2: JSON.parse(databaseInfo.rayB2) as RayModel,
      rayC2: JSON.parse(databaseInfo.rayC2) as RayModel,
      source: {
        word: source.word,
        wordInInt: source.wordInInt,
        countWord: source.countWord,
        colorWord: source.colorWord,
        rangeMm: source.rangeMm,
        rangeFontSize: source.rangeFontSize,
        pageSize: source.pageSize,
        mandalaVersion: source.mandalaVersion,
        gridThisFigure: JSON.parse(databaseInfo.gridThisFigure),
        drawThisFigure: toDOM(databaseInfo.drawThisFigure),
        drawForBase: databaseInfo.drawForBase,
      } as SourceForModelMandala,
    };
    this.mandalaParamsObjModel = JSON.parse(databaseInfo.mandalaParamsObj) as MandalaParamsModel;
    this.coreService.image = databaseInfo.imageData;
  }
}
