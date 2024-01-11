# Datenladen zur Build-Zeit

NexGen-Nexus bietet eine Funktion namens **Datenlader**, mit der du beliebige Daten laden und sie von Seiten oder Komponenten aus importieren kannst. Das Laden der Daten erfolgt **nur zur Build-Zeit**: Die resultierenden Daten werden als JSON im endgültigen JavaScript-Bundle serialisiert.

Datenlader können verwendet werden, um Remote-Daten abzurufen oder Metadaten basierend auf lokalen Dateien zu generieren. Zum Beispiel kannst du Datenlader verwenden, um alle deine lokalen API-Seiten zu analysieren und automatisch einen Index aller API-Einträge zu generieren.

## Grundlegende Verwendung

Eine Datenladerdatei muss entweder mit `.data.js` oder `.data.ts` enden. Die Datei sollte einen Standardexport eines Objekts mit der `load()`-Methode bereitstellen:

```js
// beispiel.data.js
export default {
  load() {
    return {
      hello: 'world'
    }
  }
}
```

Das Loader-Modul wird nur in Node.js ausgewertet, sodass du nach Bedarf Node-APIs und npm-Abhängigkeiten importieren kannst.

Du kannst dann Daten aus dieser Datei in `.md`-Seiten und `.vue`-Komponenten unter Verwendung des benannten Exports `data` importieren:

```vue
<script setup>
import { data } from './beispiel.data.js'
</script>

<pre>{{ data }}</pre>
```

Ausgabe:

```json
{
  "hello": "world"
}
```

Du wirst bemerken, dass der Datenlader selbst die `data` nicht exportiert. NexGen-Nexus ruft die Methode `load()` im Hintergrund auf und stellt das Ergebnis implizit über den benannten Export `data` zur Verfügung.

Dies funktioniert auch, wenn der Loader asynchron ist:

```js
export default {
  async load() {
    // Remote-Daten abrufen
    return (await fetch('...')).json()
  }
}
```

## Daten aus lokalen Dateien

Wenn du Daten basierend auf lokalen Dateien generieren musst, solltest du die `watch`-Option im Datenlader verwenden, damit Änderungen an diesen Dateien Hot-Updates auslösen können.

Die `watch`-Option ist auch praktisch, da du [Glob-Muster](https://github.com/mrmlnc/fast-glob#pattern-syntax) verwenden kannst, um mehrere Dateien abzugleichen. Die Muster können relativ zur Loader-Datei selbst sein, und die `load()`-Funktion erhält die abgeglichenen Dateien als absolute Pfade.

Das folgende Beispiel zeigt das Laden von CSV-Dateien und deren Umwandlung in JSON unter Verwendung von [csv-parse](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse/). Da diese Datei nur zur Build-Zeit ausgeführt wird, wird der CSV-Parser nicht an den Client versandt!

```js
import fs from 'node:fs'
import { parse } from 'csv-parse/sync'

export default {
  watch: ['./data/*.csv'],
  load(watchedFiles) {
    // watchedFiles wird ein Array von absoluten Pfaden der abgeglichenen Dateien sein.
    // Generiere ein Array von Metadaten für Blogbeiträge, das zur Anzeige
    // in der Layoutvorlage des Themes verwendet werden kann
    return watchedFiles.map((file) => {
      return parse(fs.readFileSync(file, 'utf-8'), {
        columns: true,
        skip_empty_lines: true
      })
    })
  }
}
```

## `createContentLoader`

Beim Erstellen einer inhaltsorientierten Website müssen wir oft eine "Archiv" oder "Index" Seite erstellen: eine Seite, auf der alle verfügbaren Einträge in unserer Inhaltskollektion aufgelistet sind, zum Beispiel Blogbeiträge oder API-Seiten. Wir **können** dies direkt mit der Datenlader-API implementieren, aber da dies ein so häufiger Anwendungsfall ist, bietet NexGen-Nexus auch einen `createContentLoader`-Helper zur Vereinfachung:

```js
// beitraege.data.js
import { createContentLoader } from 'vitepress'

export default createContentLoader('beitraege/*.md', /* Optionen */)
```

Der Helper nimmt ein Glob-Muster relativ zum [Quellverzeichnis](./routing#source-directory) entgegen und gibt ein `{ watch, load }`-Datenladerobjekt zurück, das als Standardexport in einer Datenladerdatei verwendet werden kann. Es implementiert auch Caching basierend auf den Änderungszeitstempeln der Dateien, um die Entwicklungsleistung zu verbessern.

Beachte, dass der Loader nur mit Markdown-Dateien funktioniert - abgeglichene Nicht-Markdown-Dateien werden übersprungen.

Die geladenen Daten werden ein Array vom Typ `ContentData[]` sein:

```ts
interface ContentData {
  // zugeordnete URL für die Seite, z.B. /beitraege/hallo.html (ohne Basis)
  // manuell iterieren oder benutzerdefinierte `transform`-Funktion verwenden, um die Pfade zu normalisieren
  url: string
  // Frontmatter-Daten der Seite
  frontmatter: Record<string, any>

  // die folgenden sind nur vorhanden, wenn relevante Optionen aktiviert sind
  // wir werden sie weiter unten besprechen
  src: string | undefined
  html: string | undefined
  excerpt: string | undefined
}
```

Standardmäßig werden nur `url` und `frontmatter` bereitgestellt. Dies liegt daran, dass die geladenen Daten als JSON im Client-Bundle inline geschaltet werden, daher müssen wir vorsichtig mit ihrer Größe umgehen. Hier ist ein Beispiel, wie die Daten verwendet werden können, um eine minimale Blog-Indexseite zu erstellen:

```vue
<script setup>
import { data as beitraege } from './beitraege.data.js'
</script>

<template>
  <h1>Alle Blogbeiträge</h1>


  <ul>
    <li v-for="beitrag of beitraege">
      <a :href="beitrag.url">{{ beitrag.frontmatter.title }}</a>
      <span>von {{ beitrag.frontmatter.author }}</span>
    </li>
  </ul>
</template>
```

### Optionen

Die Standarddaten entsprechen möglicherweise nicht allen Anforderungen - du kannst die Daten mit Optionen transformieren:

```js
// beitraege.data.js
import { createContentLoader } from 'vitepress'

export default createContentLoader('beitraege/*.md', {
  includeSrc: true, // Rohen Markdown-Quellcode einbeziehen?
  render: true,     // Gerenderten vollständigen Seiten-HTML-Code einbeziehen?
  excerpt: true,    // Ausschnitt einbeziehen?
  transform(rohDaten) {
    // Die Rohdaten können nach Belieben gemappt, sortiert oder gefiltert werden.
    // Das endgültige Ergebnis ist das, was an den Client versendet wird.
    return rohDaten.sort((a, b) => {
      return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
    }).map((seite) => {
      seite.src     // Roh-Markdown-Quelle
      seite.html    // Gerendertes vollständiges Seiten-HTML
      seite.excerpt // Gerendertes Ausschnitts-HTML (Inhalt über der ersten `---`)
      return {/* ... */}
    })
  }
})
```

Schau dir an, wie es im [Vue.js-Blog](https://github.com/vuejs/blog/blob/main/.vitepress/theme/beitraege.data.ts) verwendet wird.

Die `createContentLoader`-API kann auch innerhalb von [Build-Hooks](../reference/site-config#build-hooks) verwendet werden:

```js
// .vitepress/config.js
export default {
  async buildEnd() {
    const beitraege = await createContentLoader('beitraege/*.md').load()
    // Generiere Dateien basierend auf Beitragsmetadaten, z. B. RSS-Feed
  }
}
```

**Typen**

```ts
interface ContentOptions<T = ContentData[]> {
  /**
   * Roh-Markdown-Quelle einbeziehen?
   * @default false
   */
  includeSrc?: boolean

  /**
   * Render src zu HTML und in Daten einbeziehen?
   * @default false
   */
  render?: boolean

  /**
   * Wenn `boolean`, ob der Ausschnitt geparsed und einbezogen werden soll? (als HTML gerendert)
   *
   * Wenn `function`, steuern Sie, wie der Ausschnitt aus dem Inhalt extrahiert wird.
   *
   * Wenn `string`, definieren Sie einen benutzerdefinierten Trenner, der für das Extrahieren des
   * Ausschnitts verwendet werden soll. Der Standardtrenner ist `---`, wenn `excerpt` `true` ist.
   *
   * @see https://github.com/jonschlinkert/gray-matter#optionsexcerpt
   * @see https://github.com/jonschlinkert/gray-matter#optionsexcerpt_separator
   *
   * @default false
   */
  excerpt?:
    | boolean
    | ((datei: { daten: { [schlüssel: string]: any }; inhalt: string; ausschnitt?: string }, optionen?: any) => void)
    | string

  /**
   * Transformieren Sie die Daten. Beachten Sie, dass die Daten im Client-Bundle als JSON
   * inline geschaltet werden, wenn sie aus Komponenten oder Markdown-Dateien importiert werden.
   */
  transform?: (daten: ContentData[]) => T | Promise<T>
}
```

## Typisierte Datenlader

Bei Verwendung von TypeScript kannst du deinen Loader und den Export von `data` folgendermaßen typisieren:

```ts
import { defineLoader } from 'vitepress'

export interface Data {
  // Datentyp
}

declare const data: Data
export { data }

export default defineLoader({
  // Typgeprüfte Loader-Optionen
  watch: ['...'],
  async load(): Promise<Data> {
    // ...
  }
})
```

## Konfiguration

Um die Konfigurationsinformationen innerhalb eines Loaders zu erhalten, kannst du folgenden Code verwenden:

```ts
import type { SiteConfig } from 'vitepress'

const konfiguration: SiteConfig = (globalThis as any).VITEPRESS_CONFIG
```