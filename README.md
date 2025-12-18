# @blas0/upscaler

AI-powered image upscaler using Google's Gemini API.

## Installation

```bash
npx @blas0/upscaler
```

## Usage

1. Place images in `in/`
2. Run `npx @blas0/upscaler`
3. Select resolution (1K|2K|4K) and aspect ratio (AUTO|1:1|9:16|16:9|3:4|4:3|3:2)
4. Enter Gemini API key when prompted (saved to `.env`)
5. Upscaled images save to `out/`, originals move to `done/`

## Requirements

- Node.js 18+
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## License

MIT
