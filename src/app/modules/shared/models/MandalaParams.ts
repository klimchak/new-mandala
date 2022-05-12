import {MandalaVariant, PaperSize} from "../../../constants";

export interface MandalaParams {
  id: number;
  baseWord: string;
  generationVariant: MandalaVariant;
  double: boolean;
  abbreviation: boolean
  landscape: boolean;
  paperVariant: PaperSize;
  marginSize: number;
  fontSize: number;
  numberColor: string;
}
