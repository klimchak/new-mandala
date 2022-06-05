export interface DatabaseMandalaMadel {
  // id?: number;
  jsonData: string;
  xmlData: string;
  firstName: string;
  lastName: string;
  createDate: Date;
  imageData?: string;
}

export interface DatabaseServiceMadel {
  // id?: number;
  noRemandAgain: boolean;
  lastUpdate?: Date;
  sessionStart: Date;
  sessionStop?: Date;
}
