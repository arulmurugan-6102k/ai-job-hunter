# Tracking Pixel Server

A simple Node.js server that captures headers, metadata, and query strings when a pixel is loaded.

## Setup

```bash
node server.js
```

## Usage

**Add to your README.md**
```markdown
![](http://YOUR_IP:3000/pixel.gif?from=github-readme)
```

**Tag different sources using query strings**
```markdown
![](http://YOUR_IP:3000/pixel.gif?from=github-readme)
![](http://YOUR_IP:3000/pixel.gif?from=email)
![](http://YOUR_IP:3000/pixel.gif?from=docs&repo=ai-job-hunter)
```

**Test from terminal with custom headers**
```bash
curl http://localhost:3000/pixel.gif?testtest \
  -H "Authorization: Bearer mytoken123" \
  -H "X-Api-Key: mykey123"
```

**View all captured visits**
```bash
curl http://localhost:3000/visits
```

## Endpoints

| Endpoint | Description |
|---|---|
| `/pixel.gif` | Tracking pixel — logs all headers + query |
| `/pixel.gif?foo=bar` | Same, with query string captured |
| `/visits` | Returns all visits as JSON |

## What gets captured

| Data | Source |
|---|---|
| Timestamp | Always |
| IP Address | From request / proxy |
| Referer | Which page triggered it |
| Device / OS / Browser | From User-Agent |
| Language | Accept-Language header |
| Query string | Whatever you pass after `?` in the URL |
| Authorization | Only if manually sent via curl/API |
| API Key | Only if manually sent via curl/API |
| All raw headers | Always |

> **Note:** GitHub proxies images through its camo service, so real user IP and browser info may be masked. Query strings and custom headers sent via `curl` are always captured fully.

Visits are saved to `visits.json`.
