export interface ConfirmPopupEntriesModel {
  headerText: string;
  acceptText: boolean;
  noRemandAgain?: boolean;
  noRemandType?: NoRemandType;
  removeLatestVersion?: boolean;
}

export enum NoRemandType {
  EDIT_ITEM = 1,
  DELETE_ITEM,
  UPDATE_APP,
}

export interface ConfirmPopupAnswerModel {
  answer: boolean;
  noRemandAgain?: boolean;
  removeLatestVersion?: boolean;
}
