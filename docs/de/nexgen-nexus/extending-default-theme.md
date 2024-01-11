# Erweitern des Standard-Themas

Das Standardthema von NexGen-Nexus ist auf die Dokumentation optimiert und kann angepasst werden. Sieh dir die [Übersicht über die Konfiguration des Standardthemas](../reference/default-theme-config) für eine umfassende Liste der Optionen an.

Es gibt jedoch einige Fälle, in denen die Konfiguration allein nicht ausreicht. Zum Beispiel:

1. Du musst das CSS-Styling anpassen.
2. Du musst die Vue-App-Instanz ändern, zum Beispiel um globale Komponenten zu registrieren.
3. Du musst benutzerdefinierte Inhalte über Layout-Slots in das Thema einfügen.

Diese fortgeschrittenen Anpassungen erfordern die Verwendung eines benutzerdefinierten Themas, das das Standardthema "erweitert".

::: tip
Bevor du fortfährst, lies zuerst [Verwendung eines benutzerdefinierten Themas](./custom-theme), um zu verstehen, wie benutzerdefinierte Themen funktionieren.
:::

## Anpassung von CSS

Das CSS des Standardthemas kann angepasst werden, indem man CSS-Variablen auf der Root-Ebene überschreibt:

```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
```

```css
/* .vitepress/theme/custom.css */
:root {
  --vp-c-brand-1: #646cff;
  --vp-c-brand-2: #747bff;
}
```

Siehe [CSS-Variablen des Standardthemas](https://github.com/XSaitoKungX/vitepress/blob/main/src/client/theme-default/styles/vars.css), die überschrieben werden können.

## Verwendung unterschiedlicher Schriftarten

NexGen-Nexus verwendet [Inter](https://rsms.me/inter/) als die Standard-Schriftart und wird die Schriften im Build-Ausgabeverzeichnis einschließen. Die Schriftart wird auch in der Produktion automatisch vorab geladen. Dies ist jedoch möglicherweise nicht erwünscht, wenn du eine andere Hauptschriftart verwenden möchtest.

Um zu verhindern, dass Inter in der Build-Ausgabe enthalten ist, importiere das Thema stattdessen aus `vitepress/theme-without-fonts`:

```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme-without-fonts'
import './my-fonts.css'

export default DefaultTheme
```

```css
/* .vitepress/theme/custom.css */
:root {
  --vp-font-family-base: /* normale Textschriftart */
  --vp-font-family-mono: /* Code-Schriftart */
}
```

::: warning
Wenn du optionale Komponenten wie die [Team Page](../reference/default-theme-team-page)-Komponenten verwendest, stelle sicher, dass du sie auch aus `vitepress/theme-without-fonts` importierst!
:::

Wenn deine Schriftart eine lokale Datei ist, die über `@font-face` referenziert wird, wird sie als Asset verarbeitet und unter `.vitepress/dist/assets` mit einem gehashten Dateinamen eingefügt. Um diese Datei vorab zu laden, verwende den [transformHead](../reference/site-config#transformhead)-Build-Hook:

```js
// .vitepress/config.js
export default {
  transformHead({ assets }) {
    // Passe das Regex entsprechend an, um deine Schriftart anzupassen
    const myFontFile = assets.find(file => /font-name\.\w+\.woff2/)
    if (myFontFile) {
      return [
        [
          'link',
          {
            rel: 'preload',
            href: myFontFile,
            as: 'font',
            type: 'font/woff2',
            crossorigin: ''
          }
        ]
      ]
    }
  }
}
```

## Registrierung globaler Komponenten

```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Registriere deine benutzerdefinierten globalen Komponenten
    app.component('MyGlobalComponent' /* ... */)
  }
}
```

Wenn du TypeScript verwendest:
```ts
// .vitepress/theme/index.ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Registriere deine benutzerdefinierten globalen Komponenten
    app.component('MyGlobalComponent' /* ... */)
  }
} satisfies Theme
```

Da wir Vite verwenden, kannst du auch von Vites [Importieren per Glob-Funktion](https://vitejs.dev/guide/features.html#glob-import) profitieren, um automatisch ein Verzeichnis von Komponenten zu registrieren.

## Layout-Slots

Das `<Layout/>`-Komponente des Standardthemas verfügt über einige Slots, die verwendet werden können, um Inhalte an bestimmten Stellen der Seite einzufügen. Hier ist ein Beispiel zum Einfügen einer Komponente vor der Gliederung:

```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'

export default {
  extends: DefaultTheme,
  // Überschreibe das Layout mit einer Wrapper-Komponente, die
  // die Slots einfügt
  Layout: MyLayout
}
```

```vue
<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #aside-outline-before>
      Mein benutzerdefinierter oberer Seitenleisteninhalt
    </template>
  </Layout>
</template>
```

Oder du könntest auch die Render-Funktion verwenden.

```js
// .vitepress/theme/index.js
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import MyComponent from './MyComponent.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-before': () => h(MyComponent)
    })
  }
}
```

Vollständige Liste der verfügbaren Slots im Standard-Layout des Themas:

- Wenn `layout: 'doc'` (standardmäßig) über Frontmatter aktiviert ist:
  - `doc-top`
  - `doc-bottom`
  - `doc-footer-before`
  - `doc-before`
  - `doc-after`
  - `sidebar-nav-before`
  - `sidebar-nav-after`
  - `aside-top`
  - `aside-bottom`
  - `aside-outline-before`
  - `aside-outline-after`
  - `aside-ads-before`
  - `aside-ads-after`
- Wenn `layout: 'home'` über Frontmatter aktiviert ist:
  - `home-hero-before`
  - `home-hero-info`
  - `home-hero-image`
  - `home-hero-after`
  - `home-features-before`
  - `home-features-after`
- Wenn `layout: 'page'` über Frontmatter aktiviert ist:
  - `page-top`
  - `page-bottom`
- Auf der Seite "nicht gefunden" (404):
  - `not-found`
- Immer:
  - `layout-top`
  - `layout-bottom`
  - `nav-bar-title-before`
  - `nav-bar-title-after`
  - `nav-bar-content-before`
  - `nav-bar-content-after`
  - `nav-screen-content-before`
  - `nav-screen-content-after`

## Verwendung der View-Transitions-API

### Bei Erscheinung umschalten

Du kannst das Standardthema erweitern, um einen benutzerdefinierten Übergang zu bieten, wenn der Farbmodus umgeschaltet wird. Ein Beispiel:

```vue
<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, provide } from 'vue'

const { isDark } = useData()

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})
</script>

<template>
  <DefaultTheme.Layout />
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
```

Ergebnis (**Warnung!**: Blinkende Farben, plötzliche Bewegungen, helle Lichter):

<details>
<summary>Demo</summary>

![Erscheinungsumschaltungsübergangsdemo](/appearance-toggle-transition.webp)

</details>

Siehe [Chrome Docs](https://developer.chrome.com/docs/web-platform/view-transitions/) für weitere Details zu Übergängen zwischen Ansichten.

### Bei Routenänderung

Kommt bald.

## Überschreiben interner Komponenten

Sie können Vites [Aliases](https://vitejs.dev/config/shared-options.html#resolve-alias) verwenden, um Standardthemenkomponenten durch Ihre eigenen zu ersetzen:

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPNavBar\.vue$/,
          replacement: fileURLToPath(
            new URL('./components/CustomNavBar.vue', import.meta.url)
          )
        }
      ]
    }
  }
})
```

Um den genauen Namen der Komponente herauszufinden, siehe [unseren Quellcode](https://github.com/XSaitoKungX/vitepress/tree/main/src/client/theme-default/components). Da es sich um interne Komponenten handelt, besteht eine geringe Chance, dass ihr Name zwischen kleinen Veröffentlichungen aktualisiert wird.
