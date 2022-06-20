export interface SessionModel {
  id: number;
  sessionStart: string;
  sessionStop?: string;
}

export const fullUpdateAnswer = ['id', 'sessionStart', 'sessionStop'];
