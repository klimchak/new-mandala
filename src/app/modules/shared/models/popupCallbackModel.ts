export interface PopupCallbackModel {
  action: PopupActionsEnum;
  body: any;
  changed: boolean;
}

export enum PopupActionsEnum {
  NONE = 1,
  CREATE,
  UPDATE,
  DELETE,
}
