# Umgang mit Ressourcen

## Verweis auf statische Ressourcen

Alle Markdown-Dateien werden in Vue-Komponenten kompiliert und von [Vite](https://vitejs.dev/guide/assets.html) verarbeitet. Du kannst, **und solltest**, alle Ressourcen mit relativen URLs referenzieren:

```md
![Ein Bild](./image.png)
```

Du kannst statische Ressourcen in deinen Markdown-Dateien, deinen `*.vue`-Komponenten im Theme, Styles und einfachen `.css`-Dateien entweder mit absoluten öffentlichen Pfaden (basierend auf dem Projektstamm) oder relativen Pfaden (basierend auf deinem Dateisystem) referenzieren. Letzteres verhält sich ähnlich wie bei Vite, Vue CLI oder dem `file-loader` von webpack.

Gängige Bild-, Medien- und Schriftdateitypen werden automatisch erkannt und als Ressourcen eingebunden.

Alle referenzierten Ressourcen, einschließlich solcher mit absoluten Pfaden, werden im Produktionsbuild in das Ausgabeverzeichnis mit einem gehashten Dateinamen kopiert. Ressourcen, die nie referenziert werden, werden nicht kopiert. Bildressourcen kleiner als 4 KB werden base64-inline eingefügt - dies kann über die [`vite`](../reference/site-config#vite)-Konfigurationsoption konfiguriert werden.

Alle **statischen** Pfadverweise, einschließlich absoluter Pfade, sollten auf deiner Verzeichnisstruktur basieren.

## Das öffentliche Verzeichnis

Manchmal musst du statische Ressourcen bereitstellen, die nicht direkt in deinen Markdown- oder Theme-Komponenten referenziert werden, oder du möchtest bestimmte Dateien mit dem Originaldateinamen bereitstellen. Beispiele für solche Dateien sind `robots.txt`, Favicons und PWA-Icons.

Du kannst diese Dateien im `public`-Verzeichnis unter dem [Quellverzeichnis](./routing#source-directory) platzieren. Wenn sich beispielsweise dein Projektstamm in `./docs` befindet und du den Standardort des Quellverzeichnisses verwendest, wird dein öffentliches Verzeichnis `./docs/public` sein.

Im `public`-Verzeichnis platzierte Ressourcen werden eins zu eins in das Stammverzeichnis des Ausgabeverzeichnisses kopiert.

Beachte, dass du auf Dateien im `public`-Verzeichnis mit dem absoluten Wurzelpfad verweisen solltest - zum Beispiel sollte `public/icon.png` im Quellcode immer als `/icon.png` referenziert werden.

## Basis-URL

Wenn deine Website auf einer URL, die nicht der Wurzel entspricht, bereitgestellt wird, musst du die `base`-Option in `.vitepress/config.js` festlegen. Wenn du beispielsweise deine Website unter `https://foo.github.io/bar/` bereitstellen möchtest, sollte `base` auf `'/bar/'` gesetzt werden (es sollte immer mit einem Schrägstrich beginnen und enden).

Alle Pfade zu deinen statischen Ressourcen werden automatisch so verarbeitet, dass sie sich an verschiedene `base`-Konfigurationswerte anpassen. Wenn du beispielsweise eine absolute Referenz zu einer Ressource unter `public` in deinem Markdown hast:

```md
![Ein Bild](/bild-in-public.png)
```

Musst du dies in diesem Fall **nicht** aktualisieren, wenn du den `base`-Konfigurationswert änderst.

Wenn du jedoch eine Theme-Komponente erstellst, die dynamisch auf Ressourcen verweist, z.B. ein Bild, dessen `src` auf einem Theme-Konfigurationswert basiert:

```vue
<img :src="theme.logoPath" />
```

In diesem Fall wird empfohlen, den Pfad mit dem [`withBase`-Helfer](../reference/runtime-api#withbase) von NexGen-Nexus zu umschließen:

```vue
<script setup>
import { withBase, useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
  <img :src="withBase(theme.logoPath)" />
</template>
```