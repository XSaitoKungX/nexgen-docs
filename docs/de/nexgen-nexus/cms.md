---
Gliederung: tief
---

# Verbindung zu einem CMS

## Allgemeiner Ablauf

Die Verbindung von NexGen-Nexus zu einem CMS wird größtenteils um [Dynamische Routen](./routing#dynamic-routes) kreisen. Stell sicher, dass du verstehst, wie es funktioniert, bevor du weitermachst.

Da jedes CMS unterschiedlich funktioniert, können wir hier nur einen allgemeinen Ablauf bereitstellen, den du an dein spezifisches Szenario anpassen musst.

1. Falls dein CMS Authentifizierung erfordert, erstelle eine `.env`-Datei, um deine API-Token zu speichern, und lade sie wie folgt:

    ```js
    // posts/[id].paths.js
    import { loadEnv } from 'vitepress'

    const env = loadEnv('', process.cwd())
    ```

2. Hol die erforderlichen Daten vom CMS ab und formatiere sie in die richtigen Pfadinformationen:

    ```js
    export default {
      async paths() {
        // Verwende bei Bedarf die entsprechende CMS-Client-Bibliothek
        const data = await (await fetch('https://my-cms-api', {
          headers: {
            // Token, wenn notwendig
          }
        })).json()

        return data.map(entry => {
          return {
            params: { id: entry.id, /* Titel, Autoren, Datum usw. */ },
            content: entry.content
          }
        })
      }
    }
    ```

3. Rendere den Inhalt auf der Seite:

    ```md
    # {{ $params.title }}

    - von {{ $params.author }} am {{ $params.date }}

    <!-- @content -->
    ```

## Integrationsanleitungen

Wenn du eine Anleitung zur Integration von NexGen-Nexus mit einem bestimmten CMS verfasst hast, verwende bitte den Link "Diese Seite bearbeiten" unten, um sie hier einzureichen!
