import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseError extends Error {
  @ApiProperty({
    type: 'string',
    default: 'Unauthorized',
  })
  readonly message: string;

  @ApiProperty({
    type: 'HttpStatus',
    default: 401,
  })
  protected statusCode: number;

  @ApiProperty({
    type: 'string',
    default: 'UNAUTHORIZED_ERROR',
  })
  readonly code: string;

  @ApiProperty({
    type: 'string',
    default: '401',
  })
  readonly errorCode: string;

  protected customStack: Record<string, unknown>;
  public data: any;

  constructor(message, customStack = {}) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.customStack = customStack;
  }

  public addCustomStack(customStack: Record<string, unknown>) {
    this.customStack = { ...this.customStack, ...customStack };
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  /*
   * Get data suitable to debug / log
   */
  public getDebugData() {
    return {
      statusCode: this.statusCode,
      name: this.name,
      message: this.message,
      customStack: this.customStack,
    };
  }

  /*
   * Get data suitable to be returned as http response body
   */
  public getHttpData() {
    return {
      statusCode: this.statusCode,
      // code: this.errorCode,
      name: this.name,
      message: this.fullMessage,
    };
  }

  public get fullMessage() {
    return this.message || 'Unknown error';
  }
}
