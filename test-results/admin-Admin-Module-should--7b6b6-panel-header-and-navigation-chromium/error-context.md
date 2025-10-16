# Page snapshot

```yaml
- generic [active]:
  - alert [ref=e1]
  - dialog "Failed to compile" [ref=e4]:
    - generic [ref=e5]:
      - heading "Failed to compile" [level=4] [ref=e7]
      - generic [ref=e8]:
        - generic [ref=e10]: "./src/app/(admin)/admin/page.tsx ReactServerComponentsError: You're importing a component that needs useEffect. It only works in a Client Component but none of its parents are marked with \"use client\", so they're Server Components by default. Learn more: https://nextjs.org/docs/getting-started/react-essentials ,-[/home/ubuntu/moeen/src/app/(admin)/admin/page.tsx:11:1] 11 | 12 | \"use client\"; 13 | 14 | import React, { useState, useEffect } from \"react\"; : ^^^^^^^^^ 15 | import { 16 | Card, 17 | CardContent, `---- Maybe one of these should be marked as a client entry with \"use client\": ./src/app/(admin)/admin/page.tsx"
        - contentinfo [ref=e11]:
          - paragraph [ref=e12]: This error occurred during the build process and can only be dismissed by fixing the error.
```