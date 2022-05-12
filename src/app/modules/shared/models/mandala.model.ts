export interface MandalaModel {
  rayA: RayModel;
  rayB: RayModel;
  rayC: RayModel;
  rayA2: RayModel;
  rayB2: RayModel;
  rayC2: RayModel;
  source: {
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
    gridThisFigure: any;
    drawThisFigure: any;
    drawForBase: any;
  }
}

export interface RayModel {
  rayCoord: any[];
  sector: any[];
}
