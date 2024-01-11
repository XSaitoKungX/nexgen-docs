---
outline: deep
---

# Deploy Deine Docs-Website

Die folgenden Anleitungen basieren auf einigen gemeinsamen Annahmen:

- Die Docs-Website befindet sich im `docs-Verzeichnis` deines Projekts.
- Du verwendest das Standardausgabeverzeichnis (`.vitepress/dist`).
- Docs ist als lokale Abhängigkeit in deinem Projekt installiert, und du hast die folgenden Skripte in deiner `package.json` eingerichtet:

  ```json
  {
    "scripts": {
      "docs:build": "vitepress build docs",
      "docs:preview": "vitepress preview docs"
    }
  }
  ```

## Lokales Builden und Testen

1. Führe diesen Befehl aus, um die Dokumentation zu erstellen:

   ```sh
   $ npm run docs:build
   ```

2. Sobald es erstellt wurde, kannst du es lokal vorab anzeigen, indem du ausführst:

   ```sh
   $ npm run docs:preview
   ```

   Der Befehl `preview` startet einen lokalen statischen Webserver, der das Ausgabeverzeichnis `.vitepress/dist` unter `http://localhost:4173` bereitstellt. Du kannst dies verwenden, um sicherzustellen, dass alles gut aussieht, bevor du es in die Produktion schickst.

3. Du kannst den Port des Servers konfigurieren, indem du `--port` als Argument übergibst.

   ```json
   {
     "scripts": {
       "docs:preview": "vitepress preview docs --port 8080"
     }
   }
   ```

   Nun wird die Methode `docs:preview` den Server unter `http://localhost:8080` starten.

## Festlegen eines öffentlichen Basispfads

Wenn du die HTTP-Header auf deinem Produktionsserver kontrollieren kannst, kannst du `cache-control`-Header konfigurieren, um bessere Leistung bei wiederholten Besuchen zu erzielen.

Das Produktionsbuild verwendet gehashte Dateinamen für statische Ressourcen (JavaScript, CSS und andere importierte Ressourcen, die nicht in `public` sind). Wenn du die Produktionsvorschau mit dem Netzwerktab deiner Browser-Entwicklertools inspizierst, siehst du Dateien wie `app.4f283b18.js`.

Dieser Hash `4f283b18` wird aus dem Inhalt dieser Datei generiert. Die gleiche gehashte URL dient dazu, den gleichen Dateiinhalt zu bedienen - wenn sich der Inhalt ändert, ändern sich auch die URLs. Das bedeutet, dass du sicher die stärksten Cache-Header für diese Dateien verwenden kannst. Alle solchen Dateien werden im Ausgabeverzeichnis unter `assets/` platziert, sodass du den folgenden Header für sie konfigurieren kannst:

```
Cache-Control: max-age=31536000,immutable
```

::: details Beispiel Netlify `_headers`-Datei

```
/assets/*
  cache-control: max-age=31536000
  cache-control: immutable
```

**Hinweis**: Die `_headers`-Datei sollte im [public-Verzeichnis](https://chat.openai.com/c/asset-handling#the-public-directoty) platziert werden - in unserem Fall `docs/public/_headers` -, damit sie unverändert ins Ausgabeverzeichnis kopiert wird.

[Netlify-Benutzerdefinierte Header-Dokumentation](https://docs.netlify.com/routing/headers/)

:::

::: details Beispiel Vercel-Konfiguration in `vercel.json`

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

Hinweis: Die Datei `vercel.json` sollte sich im Stammverzeichnis deines **Repositorys** befinden.
[Vercel-Dokumentation zu Header-Konfigurationen](https://vercel.com/docs/concepts/projects/project-configuration#headers)

:::

## Plattformanleitungen

### Netlify / Vercel / Cloudflare Pages / AWS Amplify / Render

Richte ein neues Projekt ein und ändere diese Einstellungen über dein Dashboard:

- **Build-Befehl**: `npm run docs:build`
- **Ausgabeverzeichnis**: `docs/.vitepress/dist`
- **Node Version:** `18` (oder höher)

::: warning
Aktiviere keine Optionen wie *Auto Minify* für HTML-Code. Es entfernt Kommentare aus der Ausgabe, die für Vue Bedeutung haben. Du könntest Hydratationsfehler sehen, wenn sie entfernt werden.
:::

### GitHub Pages

1. Erstelle eine Datei namens `deploy.yml` im Verzeichnis `.github/workflows` deines Projekts mit einem Inhalt wie diesem:

   ```yaml
   # Beispiel-Workflow zum Erstellen und Bereitstellen einer Docs-Website auf GitHub Pages
   #
   name: Docs-Website auf Pages bereitstellen

   on:
     # Wird bei Pushes auf den Branch "main" ausgeführt. Ändere dies auf "master", wenn du
     # den Branch "master" als Standardbranch verwendest.
     push:
       branches: [main]

     # Ermöglicht das manuelle Ausführen dieses Workflows über das Aktions-Tab
     workflow_dispatch:

   # Setzt die Berechtigungen des GITHUB_TOKEN, um die Bereitstellung auf GitHub Pages zu ermöglichen
   permissions:
     contents: read
     pages: write
     id-token: write

   # Erlaubt nur eine gleichzeitige Bereitstellung und überspringt Läufe, die zwischen dem gerade laufenden und dem zuletzt gestarteten in der Warteschlange stehen.
   # Läuft jedoch nicht abgeschlossene Läufe ab, da wir möchten, dass diese Produktionsbereitstellungen abgeschlossen werden.
   concurrency:
     group: pages
     cancel-in-progress: false

   jobs:
     # Build-Job
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
           with:
             fetch-depth: 0 # Nicht erforderlich, wenn lastUpdated nicht aktiviert ist
         # - uses: pnpm/action-setup@v2 # Entkommentiere dies, wenn du pnpm verwendest
         # - uses: oven-sh/setup-bun@v1 # Entkommentiere dies, wenn du Bun verwendest
         - name: Node einrichten
           uses: actions/setup-node@v3
           with:
             node-version: 18
             cache: npm # oder pnpm / yarn
         - name: Pages einrichten
           uses: actions/configure-pages@v3
         - name: Abhängigkeiten installieren
           run: npm ci # oder pnpm install / yarn install / bun install
         - name: Mit Docs erstellen
           run: |
             npm run docs:build # oder pnpm docs:build / yarn docs:build / bun run docs:build
             touch docs/.vitepress/dist/.nojekyll
         - name: Artefakt hochladen
           uses: actions/upload-pages-artifact@v2
           with:
             path: docs/.vitepress/dist

     # Bereitstellungs-Job
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       needs: build
       runs-on: ubuntu-latest
       name: Bereitstellen
       steps:
         - name: Auf GitHub Pages bereitstellen
           id: deployment
           uses: actions/deploy-pages@v2
   ```

   ::: warning
   Stelle sicher, dass die `base`-Option in deinen Docs richtig konfiguriert ist. Siehe [Öffentlichen Basispfad festlegen](#setting-a-public-base-path) für weitere Details.
   :::

2. Wähle in den Einstellungen deines Repositories im Menü "Pages" unter "Build and deployment > Source" "GitHub Actions" aus.

3. Pushe deine Änderungen zum Branch `main` und warte auf den Abschluss des GitHub Actions-Workflows. Du solltest deine Website unter `https://<username>.github.io/[repository]/` oder `https://<custom-domain>/` je nach deinen Einstellungen bereitgestellt sehen. Deine Website wird automatisch bei jedem Push zum Branch `main` bereitgestellt.

### GitLab Pages

1. Setze `outDir` in der Docs-Konfiguration auf `../public`. Konfiguriere die `base`-Option auf `'/<repository>/'`, wenn du zu `https://<username>.gitlab.io/<repository>/` bereitstellen möchtest.

2. Erstelle eine Datei namens `.gitlab-ci.yml` im Stammverzeichnis deines Projekts mit dem folgenden Inhalt. Dadurch wird deine Website jedes Mal erstellt und bereitgestellt, wenn du Änderungen an deinem Inhalt vornimmst:

   ```yaml
   image: node:18
   pages:
     cache:
       paths:
         - node_modules/
     script:
       # - apk add git # Entkommentiere dies, wenn du kleine Docker-Images wie Alpine verwendest und lastUpdated aktiviert hast
       - npm install
       - npm run docs:build
     artifacts:
       paths:
         - public
     only:
       - main
   ```

### Azure Static Web Apps

1. Befolge die [offizielle Dokumentation](https://docs.microsoft.com/en-us/azure/static-web-apps/build-configuration).

2. Setze diese Werte in deiner Konfigurationsdatei und entferne die, die du nicht benötigst, wie `api_location`:

   - **`app_location`**: `/`
   - **`output_location`**: `docs/.vitepress/dist`
   - **`app_build_command`**: `npm run docs:build`

### Firebase

1. Erstelle `firebase.json` und `.firebaserc` im Stammverzeichnis deines Projekts:

   `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "docs/.vitepress/dist",
       "ignore": []
     }
   }
   ```

   `.firebaserc`:

   ```json
   {
     "projects": {
       "default": "<DEINE_FIREBASE-ID>"
     }
   }
   ```

2. Nachdem du `npm run docs:build` ausgeführt hast, führe diesen Befehl aus, um zu deployen:

   ```sh
   firebase deploy
   ```

### Surge

1. Nachdem du `npm run docs:build` ausgeführt hast, führe diesen Befehl aus, um zu deployen:

   ```sh
   npx surge docs/.vitepress/dist
   ```

### Heroku

1. Befolge die Dokumentation und Anleitung im [`heroku-buildpack-static`](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-static).

2. Erstelle eine Datei namens `static.json` im Stammverzeichnis deines Projekts mit dem folgenden Inhalt:

   ```json
   {
     "root": "docs/.vitepress/dist"
   }
   ```

### Edgio

Siehe [Erstellen und Bereitstellen einer Docs-App auf Edgio](https://docs.edg.io/guides/vitepress).

### Kinsta Static Site Hosting

Du kannst deine Vitepress-Website auf [Kinsta](https

://kinsta.com/static-site-hosting/) deployen, indem du diesen [Anweisungen](https://kinsta.com/docs/vitepress-static-site-example/) folgst.
