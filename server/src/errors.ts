export class ValidationError extends Error {
  public code: string;

  constructor() {
    super();
    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
  }
}

export class InputError extends TypeError {
  public code: string;

  constructor(message: string) {
    super(message);
    this.name = 'InputError';
    this.code = 'INPUT_ERROR';
  }
}

export class DatabaseError extends TypeError {
  public code: string;

  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
    this.code = 'DATABASE_ERROR';
  }
}
