export interface Screen {
  id?: string;
  name: string;
  solutionId: string;
  layout: {
    columns: number;
    rows: number;
  };
  widgetIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}