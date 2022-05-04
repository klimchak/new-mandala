import {MandalaVariant, PaperSize} from "../../../constants";

export interface MandalaParams {
  id: number;
  baseWord: string;
  generationVariant: MandalaVariant;
  double: boolean;
  split: boolean
  landscape: boolean;
  paperVariant: PaperSize;
  marginSize: number;
  fontSize: number;
  numberColor: string;
}
