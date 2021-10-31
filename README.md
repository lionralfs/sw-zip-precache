### Chrome traces

```json
{
  "cacheRejected": false,
  "columnNumber": 1,
  "consumedCacheSize": 28456,
  "lineNumber": 1,
  "notStreamedReason": "script has code-cache available",
  "streamed": false,
  "url": "http://localhost:8080/dummy-assets/react.production.min.js"
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
  "url": "http://localhost:8080/dummy-assets/react-dom.production.min.js"
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
- meta.json (only for zip) - 1158 B
- react-dom.production.min.js - 120585 B
- react.production.min.js - 11440 B
- roboto-v29-latin-700.woff2 - 15828 B
- roboto-v29-latin-regular.woff2 - 15688 B
- tailwind.min.css - 2934019 B
- offline.html - 1584 B

#### Compression

brotli with --best:

- arrow-up-svgrepo-com.svg.br - 179 B
- attachment-svgrepo-com.svg.br - 319 B
- backspace-svgrepo-com.svg.br - 277 B
- ban-svgrepo-com.svg - 193 B
- bar-chart-alt-svgrepo-com.svg - 155 B
- bar-chart-svgrepo-com.svg - 199 B
- board-svgrepo-com.svg - 164 B
- meta.json (only for zip) - 246 B
- react-dom.production.min.js - 34550 B
- react.production.min.js - 4019 B
- roboto-v29-latin-700.woff2 - 15828 B (unchanged)
- roboto-v29-latin-regular.woff2 - 15688 B (unchanged)
- tailwind.min.css - 72895 B
- offline.html - 446 B

--> zipped (store-only): 147668 B

#### Compared size (raw transferred bytes)

- zip of brotlis: 147668 B
- sum of individual brotlis: 145158 B

obviously they are simuliar, cause zip is no-store, otherwise same files

overhead of individual http requests?