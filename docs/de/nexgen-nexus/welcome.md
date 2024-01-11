# Willkommen bei der NexGen-Nexus Dokumentation

## Was wir tun und wer wir sind?

Bei NexGen-Nexus sind wir stolz darauf, ein vielseitiger Game Hosting Service zu sein, der eine breite Palette von Bedürfnissen abdeckt. Unsere Angebote umfassen:

**Game Hosting Service:**
Wir sind darauf spezialisiert, erstklassige Hosting-Services für verschiedene Gaming-Plattformen anzubieten. Egal, ob Sie Minecraft, Discord mögen oder zuverlässiges Voice Hosting benötigen - wir haben Sie abgedeckt.

**Minecraft-Server:**
Tauchen Sie ein in die kantige Welt von Minecraft mit unserem dedizierten Server-Hosting. Genießen Sie nahtlose Mehrspielererfahrungen mit Freunden und anderen Gamern.

**Discord-Bots:**
Verbessern Sie Ihren Discord-Server mit leistungsstarken Bots, die darauf abzielen, Ihre Community-Interaktionen zu optimieren und zu bereichern. Von Moderation bis Unterhaltung haben wir einen Bot für jeden Zweck.

**Voice Hosting:**
Erleben Sie kristallklare Sprachkommunikation in Ihren Gaming-Sessions. Unsere Voice Hosting-Services gewährleisten geringe Latenzzeiten und hochwertigen Ton, was das gesamte Spielerlebnis verbessert.

**Und viele andere Services:**
Entdecken Sie unser vielfältiges Angebot an Services, die darauf zugeschnitten sind, den sich wandelnden Bedürfnissen der Gaming-Community gerecht zu werden. Wir erweitern ständig unser Angebot, um Ihnen innovative Lösungen zu bieten.

**Kostenlose Tools:**
Zusätzlich zu unseren Premium-Services verpflichten wir uns, der Gemeinschaft etwas zurückzugeben. Nutzen Sie kostenlose Tools wie einen Passwortgenerator, um Ihre Online-Sicherheit zu stärken, und greifen Sie auf kostenlose öffentliche Bots für verschiedene Zwecke zu.

Erleben Sie den Unterschied von NexGen-Nexus, während wir daran arbeiten, eine umfassende und unterstützende Gaming-Umgebung für unsere Benutzer zu schaffen.

<div class="tip custom-block" style="padding-top: 8px">

Möchten Sie es einfach ausprobieren? Springen Sie zum [Schnellstart](../public-bot/vortex.md).

</div>

## Was ist NexGen-Nexus | Docs?

[NexGen-Nexus](https://en.wikipedia.org/wiki/Static_site_generator) ist ein Static Site Generator (SSG), der darauf ausgelegt ist, schnelle, inhaltszentrierte Websites zu erstellen. Im Wesentlichen nimmt NexGen-Nexus Ihren Quellinhalt, der in [Markdown](https://en.wikipedia.org/wiki/Markdown) verfasst ist, wendet ein Theme darauf an und generiert statische HTML-Seiten, die problemlos überall bereitgestellt werden können.

## Entwicklererfahrung

NexGen-Nexus zielt darauf ab, eine großartige Entwicklererfahrung (DX) beim Arbeiten mit Markdown-Inhalten zu bieten.

- **[Vite-Powered:](https://vitejs.dev/)** Sofortiger Serverstart, mit sofortiger Aktualisierung von Änderungen (<100ms) ohne Seitenneuladung.
- **[Eingebaute Markdown-Erweiterungen:](./markdown)** Frontmatter, Tabellen, Syntaxhervorhebung... Sie nennen es. NexGen-Nexus bietet fortschrittliche Funktionen für die Arbeit mit Codeblöcken und eignet sich ideal für hochtechnische Dokumentation.
- **[Vue-Verbessertes Markdown:](./using-vue)** Jede Markdown-Seite ist auch eine Vue [Single-File Component](https://vuejs.org/guide/scaling-up/sfc.html), dank der 100%igen Syntaxkompatibilität von Vue-Templates mit HTML. Binden Sie Interaktivität in Ihren statischen Inhalt ein, indem Sie Vue-Templatfunktionen oder importierte Vue-Komponenten verwenden.

## Leistung

Im Gegensatz zu vielen traditionellen SSGs ist eine von NexGen-Nexus generierte Website tatsächlich eine [Single Page Application](https://en.wikipedia.org/wiki/Single-page_application) (SPA).

- **Schnelle initiale Ladezeit**
  - Der erste Besuch auf einer Seite wird mit dem statischen, vorgerenderten HTML für extrem schnelle Ladezeiten und optimale SEO bedient.
  - Die Seite lädt dann ein JavaScript-Bündel, das die Seite in eine Vue SPA umwandelt ("Hydratisierung"). Der Hydratisierungsprozess ist äußerst schnell und erreicht auf [PageSpeed Insights](https://pagespeed.web.dev/report?url=https%3A%2F%2Fvitepress.dev%2F) auch auf Mobilgeräten mit langsamer Netzwerkverbindung nahezu perfekte Leistungswerte.
- **Schnelle Navigation nach dem Laden**
  - Nachfolgende Navigation innerhalb der Website führt nicht mehr zu einer vollständigen Seitenneuladung. Stattdessen wird der Inhalt der eingehenden Seite abgerufen und dynamisch aktualisiert.
  - NexGen-Nexus prefetcht automatisch Seitenteile für Links, die im Viewport liegen. In den meisten Fällen wird die Navigation nach dem Laden sofort erscheinen.
- **Interaktivität ohne Nachteile**
  - Um die dynamischen Vue-Teile, die in statisches Markdown eingebettet sind, hydratisieren zu können, wird jede Markdown-Seite als Vue-Komponente verarbeitet und in JavaScript kompiliert.
  - Der Vue-Compiler ist intelligent genug, um die statischen und dynamischen Teile zu trennen und sowohl die Hydratisierungskosten als auch die Nutzlastgröße zu minimieren. Für die initiale Seitenladung werden die statischen Teile automatisch aus der JavaScript-Nutzlast entfernt und während der Hydratisierung übersprungen.
