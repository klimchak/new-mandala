export interface ElectronMessage {
  title: string;
  message: string;
  detail: string;
  buttons: string[];
  defaultId: number;
  type: 'none' | 'info' | 'error' | 'question' | 'warning';
  textWidth: number;
}
