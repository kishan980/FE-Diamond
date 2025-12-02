// ==============================|| TYPES - DROPZONE  ||============================== //

export enum DropzopType {
  default = 'DEFAULT',
  standard = 'STANDARD',
}

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}
