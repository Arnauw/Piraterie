console.log("index.js loaded successfully.");
// You should see this in the console,
// it's just to check if the js file is loaded correctly.

document.addEventListener("DOMContentLoaded", function () {
  /**
   * All config. options available here:
   * https://cookieconsent.orestbida.com/reference/configuration-reference.html
   */
  CookieConsent.run({
    // root: 'body',
    // autoShow: true,
    // disablePageInteraction: true,
    // hideFromBots: true,
    // mode: 'opt-in',
    // revision: 0,

    cookie: {
      name: "cc_cookie_fr", // Consider a different name if you run multiple languages
      // domain: location.hostname,
      // path: '/',
      // sameSite: "Lax",
      // expiresAfterDays: 182,
    },

    // https://cookieconsent.orestbida.com/reference/configuration-reference.html#guioptions
    guiOptions: {
      consentModal: {
        layout: "cloud inline",
        position: "bottom center",
        equalWeightButtons: true,
        flipButtons: false,
      },
      preferencesModal: {
        layout: "box",
        equalWeightButtons: true,
        flipButtons: false,
      },
    },

    onFirstConsent: ({ cookie }) => {
      console.log("onFirstConsent fired (FR)", cookie);
    },

    onConsent: ({ cookie }) => {
      console.log("onConsent fired! (FR)", cookie);
    },

    onChange: ({ changedCategories, changedServices }) => {
      console.log("onChange fired! (FR)", changedCategories, changedServices);
    },

    onModalReady: ({ modalName }) => {
      console.log("ready (FR):", modalName);
    },

    onModalShow: ({ modalName }) => {
      console.log("visible (FR):", modalName);
    },

    onModalHide: ({ modalName }) => {
      console.log("hidden (FR):", modalName);
    },

    categories: {
      necessary: {
        enabled: true, // this category is enabled by default
        readOnly: true, // this category cannot be disabled
      },
      analytics: {
        autoClear: {
          cookies: [
            {
              name: /^_ga/, // regex: match all cookies starting with '_ga'
            },
            {
              name: "_gid", // string: exact cookie name
            },
          ],
        },
        services: {
          ga: {
            label: "Google Analytics", // Brand name, often kept
            onAccept: () => {},
            onReject: () => {},
          },
          youtube: {
            label: "Intégration YouTube", // YouTube Embed
            onAccept: () => {},
            onReject: () => {},
          },
        },
      },
      ads: {},
    },

    language: {
      default: "fr", // Set default language to French
      translations: {
        fr: {
          // Changed 'en' to 'fr'
          consentModal: {
            title: "Nous utilisons des cookies",
            description:
              'Ce site web utilise des cookies pour améliorer votre expérience utilisateur. En cliquant sur "Tout accepter", vous consentez à notre utilisation des cookies et aux pratiques décrites dans notre politique.',
            acceptAllBtn: "Tout accepter",
            acceptNecessaryBtn: "Tout refuser", // This usually means "accept necessary only" or "reject optional"
            showPreferencesBtn: "Gérer les préférences",
            // closeIconLabel: 'Rejeter tout et fermer', // Example if you use it
            footer: `
                        <a href="#path-to-mentions-legales.html" target="_blank">Mentions Légales</a>
                        <a href="#path-to-politique-de-confidentialite.html" target="_blank">Politique de Confidentialité</a>
                    `,
          },
          preferencesModal: {
            title: "Gérer les préférences des cookies",
            acceptAllBtn: "Tout accepter",
            acceptNecessaryBtn: "Tout refuser",
            savePreferencesBtn: "Enregistrer les préférences", // Changed from 'Accept current selection' for clarity
            closeIconLabel: "Fermer",
            serviceCounterLabel: "Service|Services", // Assumes library handles singular/plural
            sections: [
              {
                title: "Vos Choix de Confidentialité",
                description:
                  'Dans ce panneau, vous pouvez exprimer vos préférences concernant le traitement de vos informations personnelles. Vous pouvez consulter et modifier vos choix à tout moment en réaffichant ce panneau via le lien fourni. Pour refuser votre consentement aux activités de traitement spécifiques décrites ci-dessous, désactivez les interrupteurs ou utilisez le bouton "Tout refuser" et confirmez votre sélection.',
              },
              {
                title: "Strictement Nécessaires",
                description:
                  "Ces cookies sont essentiels au bon fonctionnement du site web et ne peuvent pas être désactivés.",
                linkedCategory: "necessary",
              },
              {
                title: "Performance et Analytique",
                description:
                  "Ces cookies collectent des informations sur la manière dont vous utilisez notre site web. Toutes les données sont anonymisées et ne peuvent pas être utilisées pour vous identifier directement.",
                linkedCategory: "analytics",
                cookieTable: {
                  caption: "Tableau des cookies",
                  headers: {
                    name: "Cookie",
                    domain: "Domaine",
                    desc: "Description",
                  },
                  body: [
                    {
                      name: "_ga",
                      domain: location.hostname,
                      desc: "Cookie utilisé par Google Analytics pour distinguer les utilisateurs.",
                    },
                    {
                      name: "_gid",
                      domain: location.hostname,
                      desc: "Cookie utilisé par Google Analytics pour distinguer les utilisateurs (durée plus courte).",
                    },
                  ],
                },
              },
              {
                title: "Ciblage et Publicité",
                description:
                  "Ces cookies sont utilisés pour rendre les messages publicitaires plus pertinents pour vous et vos intérêts. L'intention est d'afficher des publicités pertinentes et engageantes pour l'utilisateur individuel et donc plus précieuses pour les éditeurs et les annonceurs tiers.",
                linkedCategory: "ads",
              },
              {
                title: "Plus d'informations",
                description:
                  'Pour toute question relative à notre politique en matière de cookies et à vos choix, veuillez <a href="#page-contact">nous contacter</a>.',
              },
            ],
          },
        },
      },
    },
  });
});
