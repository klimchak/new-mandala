export namespace ToastNotificationsModel {
  export enum ToastVariant {
    SUCCESS = 1,
    INFO,
    WARN,
    ERROR
  }

  export const ToastVariantString = {
    [ToastVariant.SUCCESS]: 'success',
    [ToastVariant.INFO]: 'info',
    [ToastVariant.WARN]: 'warn',
    [ToastVariant.ERROR]: 'error'
  }

  export interface ToastOptions {
    message: string;
    summary?: string;
  }
}
