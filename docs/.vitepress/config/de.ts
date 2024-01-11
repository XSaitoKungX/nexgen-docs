import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export const de = defineConfig({
  lang: 'de-DE',
  description: 'Mit Vite & Vue erstellt',

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/de/nexgen-nexus/': { base: '/de/nexgen-nexus/', items: sidebarGuide() },
    },

    /*
    editLink: {
      pattern: 'https://github.com/XSaitoKungX/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    */

    footer: {
      message: 'Veröffentlicht unter der MIT-Lizenz.',
      copyright: 'Copyright © 2019-heute Evan You. Anpassungen von <a href="https://nexgen-nexus.net" target="_blank">NexGen-Nexus Hosting</a>'
    }
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Dokumentation',
      link: '/de/nexgen-nexus/welcome',
      activeMatch: '/de/nexgen-nexus/'
    },
    {
      text: "Änderungsprotokolle",
      items: [
        {
          text: 'Änderungsprotokoll',
          link: 'https://github.com/XSaitoKungX/vitepress/blob/main/CHANGELOG.md'
        },
        {
          text: 'Mitwirkende',
          link: 'https://github.com/XSaitoKungX/vitepress/blob/main/.github/contributing.md'
        }
      ]
    }
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Einführung',
      collapsed: false,
      items: [
        { text: 'Willkommen in unserer Dokumentation', link: 'welcome' },
        { text: 'Erste Schritte', link: 'getting-started' },
        { text: 'Routing', link: 'routing' },
        { text: 'Bereitstellen', link: 'deploy' }
      ]
    },    {
      text: 'Schreiben',
      collapsed: false,
      items: [
        { text: 'Markdown-Erweiterungen', link: 'markdown' },
        { text: 'Umgang mit Ressourcen', link: 'asset-handling' },
        { text: 'Frontmatter', link: 'frontmatter' },
        { text: 'Verwendung von Vue in Markdown', link: 'using-vue' },
        { text: 'Internationalisierung', link: 'i18n' }
      ]
    },
    {
      text: 'Anpassung',
      collapsed: false,
      items: [
        { text: 'Verwendung eines benutzerdefinierten Themes', link: 'custom-theme' },
        {
          text: 'Erweitern des Standardthemes',
          link: 'extending-default-theme'
        },
        { text: 'Datenladen zur Build-Zeit', link: 'data-loading' },
        { text: 'SSR-Kompatibilität', link: 'ssr-compat' },
        { text: 'Verbindung zu einem CMS', link: 'cms' }
      ]
    },
    {
      text: 'Experimentell',
      collapsed: false,
      items: [
        { text: 'MPA-Modus', link: 'mpa-mode' },
        { text: 'Generierung einer Sitemap', link: 'sitemap-generation' }
      ]
    },
    { text: 'Öffentliche Bots', base: '/public-bot/', link: 'vortex' }
  ]
}

function sidebarReference(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Referenz',
      items: [
        { text: 'Site-Konfiguration', link: 'site-config' },
        { text: 'Frontmatter-Konfiguration', link: 'frontmatter-config' },
        { text: 'Laufzeit-API', link: 'runtime-api' },
        { text: 'CLI', link: 'cli' },
        {
          text: 'Standardthema',
          base: '/reference/default-theme-',
          items: [
            { text: 'Übersicht', link: 'config' },
            { text: 'Nav', link: 'nav' },
            { text: 'Seitenleiste', link: 'sidebar' },
            { text: 'Startseite', link: 'home-page' },
            { text: 'Fußzeile', link: 'footer' },
            { text: 'Layout', link: 'layout' },
            { text: 'Abzeichen', link: 'badge' },
            { text: 'Teamseite', link: 'team-page' },
            { text: 'Vorherige / Nächste Links', link: 'prev-next-links' },
            { text: 'Bearbeitungslink', link: 'edit-link' },
            { text: 'Letztes Aktualisierungsdatum', link: 'last-updated' },
            { text: 'Suche', link: 'search' },
            { text: 'Carbon Ads', link: 'carbon-ads' }
          ]
        }
      ]
    }
  ]
}

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
    de: {
      placeholder: 'Dokumente durchsuchen',
      translations: {
        button: {
          buttonText: 'Dokumente durchsuchen',
          buttonAriaLabel: 'Dokumente durchsuchen'
        },
        modal: {
          searchBox: {
            resetButtonTitle: 'Suchkriterien zurücksetzen',
            resetButtonAriaLabel: 'Suchkriterien zurücksetzen',
            cancelButtonText: 'Abbrechen',
            cancelButtonAriaLabel: 'Abbrechen'
          },
          startScreen: {
            recentSearchesTitle: 'Letzte Suchen',
            noRecentSearchesText: 'Keine letzten Suchen',
            saveRecentSearchButtonTitle: 'Zu den letzten Suchen hinzufügen',
            removeRecentSearchButtonTitle: 'Aus den letzten Suchen entfernen',
            favoriteSearchesTitle: 'Favoriten',
            removeFavoriteSearchButtonTitle: 'Aus Favoriten entfernen'
          },
          errorScreen: {
            titleText: 'Ergebnisse konnten nicht abgerufen werden',
            helpText: 'Bitte überprüfen Sie Ihre Netzwerkverbindung.'
          },
          footer: {
            selectText: 'Auswählen',
            navigateText: 'Wechseln',
            closeText: 'Schließen',
            searchByText: 'Suchanbieter durchsuchen'
          },
          noResultsScreen: {
            noResultsText: 'Keine relevanten Ergebnisse gefunden',
            suggestedQueryText: 'Sie können versuchen zu suchen',
            reportMissingResultsText: 'Glauben Sie, dass es Ergebnisse für diese Anfrage geben sollte?',
            reportMissingResultsLinkText: 'Feedback geben'
          }
        }
      }
    }
  }
  