export interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface IUseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}
