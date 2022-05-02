export interface ModelMandala{
  rayA: {
    rayCoord: any[],
    sector: any[]
  },
  rayB: {
    rayCoord: any[],
    sector: any[]
  },
  rayC: {
    rayCoord: any[],
    sector: any[]
  },
  rayA2: {
    rayCoord: any[],
    sector: any[]
  },
  rayB2: {
    rayCoord: any[],
    sector: any[]
  },
  rayC2: {
    rayCoord: any[],
    sector: any[]
  },
  source: {
    word: string,
    wordInInt: string,
    countWord: number,
    colorWord: string,
    rangeMm: number,
    rangeFontSize: number,
    pageSize: {width: number, height: number},
    mandalaVersion: number,
    gridThisFigure: any,
    drawThisFigure: any,
    drawForBase: any
  }
}
