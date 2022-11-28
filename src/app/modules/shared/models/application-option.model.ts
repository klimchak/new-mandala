export interface ApplicationOptionModel {
  id?: number;
  noRemandDelete?: boolean;
  noRemandEdit?: boolean;
  noRemandUpdate?: boolean;
  openRecent?: boolean;
  autoSaveEditor?: boolean;
  darkMode?: boolean;
}

export const selectOptionRows = [
  'id',
  'noRemandDelete', 'noRemandEdit', 'noRemandUpdate',
  'openRecent', 'autoSaveEditor', 'darkMode'
];
