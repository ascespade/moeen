# Page snapshot

```yaml
- generic [active]:
  - img [ref=e3]
  - alert [ref=e6]
  - dialog "Failed to compile" [ref=e9]:
    - generic [ref=e10]:
      - heading "Failed to compile" [level=4] [ref=e12]
      - generic [ref=e13]:
        - generic [ref=e15]: "./src/app/(admin)/admin/page.tsx Error: x the name `useEffect` is defined multiple times ,-[/home/ubuntu/moeen/src/app/(admin)/admin/page.tsx:4:1] 4 | 5 | \"use client\"; 6 | 7 | import { useEffect } from \"react\"; : ^^^^|^^^^ : `-- previous definition of `useEffect` here 8 | 9 | import React, { useState, useEffect } from \"react\"; : ^^^^|^^^^ : `-- `useEffect` redefined here 10 | import { 11 | Card, 12 | CardContent, `----"
        - contentinfo [ref=e16]:
          - paragraph [ref=e17]: This error occurred during the build process and can only be dismissed by fixing the error.
```