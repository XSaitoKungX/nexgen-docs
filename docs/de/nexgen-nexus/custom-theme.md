# Verwendung eines benutzerdefinierten Themes

## Theme-Auflösung

Du kannst ein benutzerdefiniertes Theme aktivieren, indem du eine Datei `.vitepress/theme/index.js` oder `.vitepress/theme/index.ts` (die "Theme-Eingabedatei") erstellst:

```
.
├─ docs                # Projektstammverzeichnis
│  ├─ .vitepress
│  │  ├─ theme
│  │  │  └─ index.js   # Theme-Eingabe
│  │  └─ config.js     # Konfigurationsdatei
│  └─ index.md
└─ package.json
```

NexGen-Nexus verwendet immer das benutzerdefinierte Theme anstelle des Standardthemes, wenn es das Vorhandensein einer Theme-Eingabedatei erkennt. Du kannst jedoch auch das [Standardtheme erweitern](./extending-default-theme), um fortgeschrittene Anpassungen vorzunehmen.

## Theme-Schnittstelle

Ein benutzerdefiniertes NexGen-Nexus-Theme ist als Objekt mit folgender Schnittstelle definiert:

```ts
interface Theme {
  /**
   * Wurzel-Layoutkomponente für jede Seite
   * @required
   */
  Layout: Component
  /**
   * Verbessert die Vue-App-Instanz
   * @optional
   */
  enhanceApp?: (ctx: EnhanceAppContext) => Awaitable<void>
  /**
   * Erweitert ein anderes Theme und ruft sein `enhanceApp` vor unserem auf
   * @optional
   */
  extends?: Theme
}

interface EnhanceAppContext {
  app: App // Vue-App-Instanz
  router: Router // NexGen-Nexus Router-Instanz
  siteData: Ref<SiteData> // Metadaten auf Seitenlevel
}
```

Die Theme-Eingabedatei sollte das Theme als ihren Standardexport exportieren:

```js
// .vitepress/theme/index.js

// Du kannst Vue-Dateien direkt in der Theme-Eingabedatei importieren
// NexGen-Nexus ist bereits mit @vitejs/plugin-vue vorconfiguriert.
import Layout from './Layout.vue'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}
```

Der Standardexport ist der einzige Vertrag für ein benutzerdefiniertes Theme, und nur die Eigenschaft `Layout` ist erforderlich. Technisch gesehen kann ein NexGen-Nexus-Theme so einfach sein wie eine einzelne Vue-Komponente.

Innerhalb deiner Layout-Komponente funktioniert es wie eine normale Vite + Vue 3-Anwendung. Beachte jedoch, dass das Theme auch [SSR-kompatibel](./ssr-compat) sein muss.

## Erstellung eines Layouts

Die einfachste Layout-Komponente muss eine [`<Content />`](../reference/runtime-api#content)-Komponente enthalten:

```vue
<!-- .vitepress/theme/Layout.vue -->
<template>
  <h1>Benutzerdefiniertes Layout!</h1>

  <!-- Hier wird der Markdown-Inhalt gerendert -->
  <Content />
</template>
```

Das obige Layout rendert einfach den Markdown-Inhalt jeder Seite als HTML. Die erste Verbesserung, die wir hinzufügen können, besteht darin, 404-Fehler zu behandeln:

```vue{1-4,9-12}
<script setup>
import { useData } from 'vitepress'
const { page } = useData()
</script>

<template>
  <h1>Benutzerdefiniertes Layout!</h1>

  <div v-if="page.isNotFound">
    Benutzerdefinierte 404-Seite!
  </div>
  <Content v-else />
</template>
```

Der [`useData()`](../reference/runtime-api#usedata)-Helfer bietet uns alle Laufzeitdaten, die wir benötigen, um unterschiedliche Layouts bedingt zu rendern. Eine der anderen Daten, auf die wir zugreifen können, sind die Frontmatter-Daten der aktuellen Seite. Wir können dies nutzen, um es dem Endbenutzer zu ermöglichen, das Layout auf jeder Seite zu steuern. Zum Beispiel kann der Benutzer angeben, dass die Seite ein spezielles Layout für die Startseite verwenden soll:

```md
---
layout: home
---
```

Und wir können unser Theme anpassen, um dies zu behandeln:

```vue{3,12-14}
<script setup>
import { useData } from 'vitepress'
const { page, frontmatter } = useData()
</script>

<template>
  <h1>Benutzerdefiniertes Layout!</h1>

  <div v-if="page.isNotFound">
    Benutzerdefinierte 404-Seite!
  </div>
  <div v-if="frontmatter.layout === 'home'">
    Benutzerdefinierte Startseite!
  </div>
  <Content v-else />
</template>
```

Du kannst das Layout natürlich auch in mehrere Komponenten aufteilen:

```vue{3-5,12-15}
<script setup>
import { useData } from 'vitepress'
import NotFound from './NotFound.vue'
import Home from './Home.vue'
import Page from './Page.vue'

const { page, frontmatter } = useData()
</script>

<template>
  <h1>Benutzerdefiniertes Layout!</h1>

  <NotFound v-if="page.isNotFound" />
  <Home v-if="frontmatter.layout === 'home'" />
  <Page v-else /> <!-- <Page /> rendert <Content /> -->
</template>
```

Konsultiere die [Runtime API-Referenz](../reference/runtime-api) für alles, was in Theme-Komponenten verfügbar ist. Darüber hinaus kannst du [Datenladen zur Build-Zeit](./data-loading) nutzen, um ein datengesteuertes Layout zu generieren, z. B. eine Seite, die alle Blogbeiträge im aktuellen Projekt auflistet.

## Verteilung eines benutzerdefinierten Themes

Die einfachste Möglichkeit, ein benutzerdefiniertes Theme zu verteilen, besteht darin, es als [Vorlagen-Repository auf GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository) bereitzustellen.

Wenn du das Theme als npm-Paket verteilen möchtest, befolge diese Schritte:

1. Exportiere das Theme-Objekt als Standardexport in deiner Paketeingabe.

2. Exportiere, falls

 zutreffend,

 deine Typdefinition für die Theme-Konfiguration als `ThemeConfig`.

3. Wenn dein Theme eine Anpassung der NexGen-Nexus-Konfiguration erfordert, exportiere diese Konfiguration unter einem Paket-Unterpfad (z. B. `my-theme/config`), damit der Benutzer sie erweitern kann.

4. Dokumentiere die Optionen der Theme-Konfiguration (sowohl über die Konfigurationsdatei als auch über Frontmatter).

5. Gib klare Anweisungen zur Verwendung deines Themes an (siehe unten).

## Verwendung eines benutzerdefinierten Themes

Um ein externes Theme zu verwenden, importiere es und exportiere es erneut aus der benutzerdefinierten Theme-Eingabe:

```js
// .vitepress/theme/index.js
import Theme from 'awesome-vitepress-theme'

export default Theme
```

Wenn das Theme erweitert werden muss:

```js
// .vitepress/theme/index.js
import Theme from 'awesome-vitepress-theme'

export default {
  extends: Theme,
  enhanceApp(ctx) {
    // ...
  }
}
```

Wenn das Theme eine spezielle NexGen-Nexus-Konfiguration erfordert, musst du diese auch in deiner eigenen Konfiguration erweitern:

```ts
// .vitepress/theme/config.ts
import baseConfig from 'awesome-vitepress-theme/config'

export default {
  // Erweitere die Basis-Konfiguration des Themes (falls erforderlich)
  extends: baseConfig
}
```

Schließlich, wenn das Theme Typen für seine Theme-Konfiguration bereitstellt:

```ts
// .vitepress/theme/config.ts
import baseConfig from 'awesome-vitepress-theme/config'
import { defineConfigWithTheme } from 'vitepress'
import type { ThemeConfig } from 'awesome-vitepress-theme'

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,
  themeConfig: {
    // Der Typ ist `ThemeConfig`
  }
})
```