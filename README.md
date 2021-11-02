### Chrome traces

```json
{
  "cacheRejected": false,
  "columnNumber": 1,
  "consumedCacheSize": 28456,
  "lineNumber": 1,
  "notStreamedReason": "script has code-cache available",
  "streamed": false,
  "url": "http://localhost:8080/precache/react.production.min.js"
}
```

```json
{
  "cacheRejected": false,
  "columnNumber": 1,
  "consumedCacheSize": 216688,
  "lineNumber": 1,
  "notStreamedReason": "script has code-cache available",
  "streamed": false,
  "url": "http://localhost:8080/precache/react-dom.production.min.js"
}
```

### Parameters

#### Precache assets

- arrow-up-svgrepo-com.svg - 269 B
- attachment-svgrepo-com.svg - 616 B
- backspace-svgrepo-com.svg - 556 B
- ban-svgrepo-com.svg - 295 B
- bar-chart-alt-svgrepo-com.svg - 290 B
- bar-chart-svgrepo-com.svg - 376 B
- board-svgrepo-com.svg - 247 B
- meta.json (only for zip) - 1119 B
- react-dom.production.min.js - 120585 B
- react.production.min.js - 11440 B
- roboto-v29-latin-700.woff2 - 15828 B
- roboto-v29-latin-regular.woff2 - 15688 B
- tailwind.min.css - 2934019 B
- offline.html - 1550 B

#### Compression

brotli with --best:

- arrow-up-svgrepo-com.svg.br - 179 B
- attachment-svgrepo-com.svg.br - 319 B
- backspace-svgrepo-com.svg.br - 277 B
- ban-svgrepo-com.svg.br - 193 B
- bar-chart-alt-svgrepo-com.svg.br - 155 B
- bar-chart-svgrepo-com.svg.br - 199 B
- board-svgrepo-com.svg.br - 164 B
- meta.json.br (only for zip) - 250 B
- react-dom.production.min.js.br - 34550 B
- react.production.min.js.br - 4019 B
- roboto-v29-latin-700.woff2 - 15828 B (unchanged)
- roboto-v29-latin-regular.woff2 - 15688 B (unchanged)
- tailwind.min.css.br - 72895 B
- offline.html.br - 439 B

--> zipped (store-only): TODO

#### Compared size (raw transferred bytes)

- zip of brotlis: 147665 B
- sum of individual brotlis: 145155 B
- cookbook zip size: 374628 B

obviously they are similar, cause zip is no-store, otherwise same files (2510 B store-only zip overhead)

overhead of individual http requests?