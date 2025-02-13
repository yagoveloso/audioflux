# AudioFlux API

AudioFlux is a Node.js API built with Fastify and fluent-ffmpeg that converts uploaded audio or video files into low-quality WEBM audio files. The API features token-based authentication and handles temporary file storage and cleanup automatically.

## Features

- **File Conversion:** Converts video/audio files to WEBM format with low-quality settings (e.g., reduced audio bitrate).
- **Token Authentication:** Secures the endpoint using a token provided in the `Authorization` header.
- **File Uploads:** Supports `multipart/form-data` uploads.
- **Temporary File Management:** Automatically cleans up temporary files after processing.
- **Development & Production Builds:** Easily switch between development mode with auto-reload and production builds.

## Prerequisites

- **Node.js** (v12+ recommended)
- **pnpm** or npm/yarn (the example uses pnpm)
- **FFmpeg:** Make sure FFmpeg is installed on your system.
  - **Linux:** `sudo apt install ffmpeg`
  - **Mac:** `brew install ffmpeg`
  - **Windows:** [Download from ffmpeg.org](https://ffmpeg.org/download.html)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/audioflux.git
   cd audioflux
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

## Configuration

Set up your environment variables. For example, create a `.env` file (if using a package like dotenv) with:

```
API_TOKEN=mysecrettoken
```

Alternatively, update the token value directly in the code if you’re not using environment variables.

## Usage

### Development Mode

Start the server in development mode with automatic restarts on file changes:

```bash
pnpm dev
```

### Build & Start

To build the project with TypeScript:

```bash
pnpm build
```

Then start the production server:

```bash
pnpm start
```

## API Endpoint

### POST /convert

**Description:**
Uploads a file (audio or video), converts it to a low-quality WEBM audio file, and returns the converted file.

**Headers:**

- `Authorization: Bearer <your_token>`

**Form Data:**

- `file: The file to upload.`

**Example using cURL:**

```bash
curl -X POST http://localhost:3000/convert \
   -H "Authorization: Bearer mysecrettoken" \
   -F "file=@path/to/your/video.mp4" \
   -o output.webm
```

## Project Structure

```
audioflux/
├── src/
│   └── server.ts       # Main server code
├── uploads/            # Directory for temporarily storing uploaded files
├── outputs/            # Directory for temporarily storing converted files
├── package.json        # Project configuration and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Technologies

- Node.js
- Fastify
- fluent-ffmpeg
- TypeScript

## License

This project is licensed under the ISC License.

## Author

Yago Veloso
