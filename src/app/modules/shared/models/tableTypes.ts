export class TableConfigModel {
  header: TableHeaderModel[];
  globalFilter: string[];
  defaultSort?: {
    columnName: string;
    sortType: SortType;
  };
  anotherParams?: {
    paged?: boolean;
    filtersInHeader?: true;
  };
}

export class TableHeaderModel {
  title: string;
  columnName: string;
  dataField: string;
  sort?: boolean;
  sortActive?: boolean;
  sortType?: SortType;
  sortVariant?: SortOrFilterVariant;
  filter?: boolean;
  filterActive?: boolean;
  filterType?: FieldFilterType;
  filterVariant?: SortOrFilterVariant;
  filterFieldRelated?: string;
  filterRelatedOrder?: FilterRelatedOrder;
  multiple?: boolean;
  search?: boolean;
  searchActive?: boolean;
  searchVariant?: SortOrFilterVariant;
  open?: boolean;
}

export interface LastSort {
  columnName: string;
  index: number;
  sort_type: number;
}

export interface SearchData {
  search: { searchValue: string, fields: string[] };
  filter?: { value: string, field: string }[];
}

export enum SortType {
  DESC = -1,
  NONE,
  ASC
}

export enum SortOrFilterVariant {
  BACKEND = 1,
  FRONTEND
}


export enum FilterRelatedOrder {
  START_DATE = 1,
  FINISH_DATE = 2,
  RANGE = 3
}

export enum FieldFilterType {
  DATE = 1,
  WORD,
  NAME,
  IS_ACTIVE,
  IS_COMPLETE,
  PROJECT_TYPE,
  PROJECT_POSITION,
  TEAM
}

export interface TableActionValue {
  actionVariant: TableActionVariant;
  data?: any;
}

export enum TableActionVariant {
  INIT_TABLE = 1,
  GET_TABLE_DATA,
  SORT_TABLE_ON_FRONTEND,
  GET_VALUE_IN_OBJECT,
  GET_FILTER_VALUE_FOR_FORM,
  ADD_ORDER_VALUE,
  REMOVE_ORDER_VALUE,
  ADD_FILTER_VALUE_WORD,
  ADD_FILTER_VALUE_DATE,
  ADD_FILTER_SEARCH,
  REMOVE_FILTER,
  GET_PROJECT_TYPE_STRING,
  GET_PROJECT_TYPE,
  GET_PROJECT_POSITION_STRING,
  GET_PROJECT_POSITION,
  GET_ITEMS_PER_PAGE_COUNT,
  SET_ITEMS_PER_PAGE_COUNT,
  GET_CURRENT_PAGE,
  SET_CURRENT_PAGE,
}
