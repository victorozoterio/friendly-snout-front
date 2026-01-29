import { PaginationParams } from '../../utils';

export type CreateAttachmentRequest = {
  animalUuid: string;
  file: File;
};

export type GetAllAttachmentsParams = PaginationParams & {
  animalUuid: string;
  search?: string;
};

export type GetAttachmentResponse = {
  uuid: string;
  name: string;
  url: string;
  type: string;
  createdAt: Date;
};

export type DeleteAttachmentRequest = {
  uuid: string;
};
