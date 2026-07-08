export type SubmissionFormValues = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
};

export type SubmissionRecord = SubmissionFormValues & {
  id: number;
  attachmentFileName: string;
  attachmentPath: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
  meta?: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type SubmissionListResponse = ApiResponse<SubmissionRecord[]>;
