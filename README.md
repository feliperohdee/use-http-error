# Use HTTP Error

A TypeScript library that provides a robust and type-safe way to handle HTTP errors in modern JavaScript applications.

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/-Vitest-729B1B?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🚀 Features

- ✅ Type-safe HTTP error handling
- 🔍 Built-in support for common HTTP status codes
- 📦 Stack trace parsing and formatting
- 🔄 Easy conversion between different formats (JSON, Response, String)
- 🔒 Context and custom headers support
- 🎯 Error wrapping and type checking
- 🔗 Fully compatible with Web API Response interface

## 📦 Installation

```bash
yarn add use-http-error
```

## 🛠️ Usage

### Basic Usage

```typescript
import HttpError from 'use-http-error';

// Create a basic HTTP error
const error = new HttpError(404);
console.log(error.message); // "Not Found"
console.log(error.status); // 404

// Create an error with custom message
const customError = new HttpError(400, 'Invalid input parameters');
```

### Advanced Configuration

```typescript
// Create error with context and headers
const error = new HttpError(500, 'Internal Server Error', {
    context: { errorCode: 'DB_CONNECTION_FAILED' },
    headers: new Headers({
        'retry-after': '30'
    })
});
```

### Error Conversion

```typescript
// Convert to JSON
const jsonError = error.toJson();
/*
{
  context: { errorCode: 'DB_CONNECTION_FAILED' },
  message: 'Internal Server Error',
  stack: [...],
  status: 500
}
*/

// Convert to Response
const response = error.toResponse();
// Returns Web API Response object

// Convert to string
console.log(error.toString()); // "500 - Internal Server Error"
```

### Static Methods

#### Error Wrapping

```typescript
// Wrap number status
const numberError = HttpError.wrap(404);

// Wrap string message
const messageError = HttpError.wrap('Not Found', 404);

// Wrap regular Error
const regularError = new Error('Database connection failed');
const wrappedError = HttpError.wrap(regularError, 500);
```

#### Type Checking

```typescript
const error = new HttpError(404);
const regularError = new Error('Regular error');

console.log(HttpError.is(error)); // true
console.log(HttpError.is(regularError)); // false
```

#### JSON Conversion

```typescript
// Create from JSON
const json = {
    context: { foo: 'bar' },
    message: 'Unauthorized Access',
    stack: [],
    status: 401
};

const error = HttpError.fromJson(json);
```

#### Quick Conversions

```typescript
// Convert to JSON directly
const jsonError = HttpError.json(404);
// or
const jsonError = HttpError.json('Not Found', 404);
// or
const jsonError = HttpError.json(new Error('Custom error'), 500);

// Convert to Response directly
const response = HttpError.response(404);
// or with custom message and status
const response = HttpError.response('Service unavailable', 503);

// Convert to string directly
const errorString = HttpError.string(404); // "404 - Not Found"
// or with custom message
const errorString = HttpError.string('Invalid input', 400);
```

### Stack Trace Control

```typescript
// Disable stack traces globally
HttpError.includeStack = false;

const error = new HttpError(500);
console.log(error.toJson().stack); // []

// Re-enable stack traces
HttpError.includeStack = true;
```

## 🧪 Testing

```bash
# Run tests
yarn test
```

## 📄 Types

### Error Types

```typescript
type Context = Record<string, any> | null;

type Json = {
    context: Context;
    message: string;
    stack: ErrorStackParser.StackFrame[];
    status: number;
};
```

### Constructor Options

```typescript
type HttpErrorOptions = {
    context?: Context;
    headers?: Headers;
};
```

## 📝 Notes

- Status codes are automatically clamped between 400 and 599
- Default messages are provided for common HTTP status codes
- Stack traces can be globally enabled/disabled
- All instances include a `httpError: true` property for type checking
- Headers are automatically merged when converting to Response

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

## 📝 License

MIT © [Felipe Rohde](mailto:feliperohdee@gmail.com)

## ⭐ Show your support

Give a ⭐️ if this project helped you!

## 👨‍💻 Author

**Felipe Rohde**

- Twitter: [@felipe_rohde](https://twitter.com/felipe_rohde)
- Github: [@feliperohdee](https://github.com/feliperohdee)
- Email: feliperohdee@gmail.com