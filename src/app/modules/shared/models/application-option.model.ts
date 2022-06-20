export interface ApplicationOptionModel {
  id?: number;
  noRemandDelete?: boolean;
  noRemandEdit?: boolean;
  noRemandUpdate?: boolean;
}

export const selectOptionRows = ['id', 'noRemandDelete', 'noRemandEdit', 'noRemandUpdate'];
