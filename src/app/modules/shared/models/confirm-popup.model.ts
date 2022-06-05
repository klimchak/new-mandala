export interface ConfirmPopupEntriesModel {
  headerText: string;
  acceptText: boolean;
  noRemandAgain?: boolean;
  removeLatestVersion?: boolean;
}

export interface ConfirmPopupAnswerModel {
  answer: boolean;
  noRemandAgain?: boolean;
  removeLatestVersion?: boolean;
}
