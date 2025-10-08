"use client";

import { useEffect } from "react";

export default function useBrandColorFromLogo(logoPath: string) {
  useEffect(() => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = logoPath;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        let r = 0,
          g = 0,
          b = 0,
          n = 0;
        for (let i = 0; i < data.length; i += 4) {
          const rr = data[i] ?? 0;
          const gg = data[i + 1] ?? 0;
          const bb = data[i + 2] ?? 0;
          const aa = data[i + 3] ?? 255;
          if (aa < 200) continue; // skip transparent
          // ignore very bright/very dark pixels
          const luma = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
          if (luma < 30 || luma > 230) continue;
          r += rr;
          g += gg;
          b += bb;
          n++;
        }
        if (n === 0) return;
        r = Math.round(r / n);
        g = Math.round(g / n);
        b = Math.round(b / n);
        // Slightly increase saturation for brand punch
        const toHex = (x: number) => x.toString(16).padStart(2, "0");
        const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        const root = document.documentElement;
        // Central brand palette
        root.style.setProperty("--brand-primary", hex);
        const darken = (c: number, pct = 0.12) =>
          Math.max(0, Math.round(c * (1 - pct)));
        const lighten = (c: number, pct = 0.12) =>
          Math.min(255, Math.round(c * (1 + pct)));
        const hexHover = `#${toHex(darken(r))}${toHex(darken(g))}${toHex(darken(b))}`;
        const hexAccent = `#${toHex(lighten(r))}${toHex(lighten(g))}${toHex(lighten(b))}`;
        root.style.setProperty("--brand-primary-hover", hexHover);
        root.style.setProperty("--brand-accent", hexAccent);
        // Update Tailwind theme alias colors
        root.style.setProperty("--focus-ring", hexAccent);
      };
    } catch {
      // no-op: keep defaults
    }
  }, [logoPath]);
}
