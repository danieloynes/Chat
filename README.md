# Firebase Sanntids-Chat

En enkel chat-applikasjon som lar brukere sende og motta meldinger i sanntid ved hjelp av Firebase.

## Funksjoner

- Brukerautentisering (registrering, innlogging, utlogging)
- Sanntids meldingsoppdatering med Firebase Firestore
- Redigering og sletting av egne meldinger
- Tidsstempel på alle meldinger
- Forskjellig visning av egne og andres meldinger
- Send meldinger med Enter-tasten
- Mørk modus / lys modus
- Responsivt design for alle enheter

## Skjermbilder

![Innloggingsskjerm](https://preview.redd.it/9aj5d7fp5tte1.png?width=1919&format=png&auto=webp&s=67a9eed18a50e1317de5d1e1bf4c0bdc7c74cc9b) 
![Chat-grensesnitt](https://preview.redd.it/aqsac3fp5tte1.png?width=1918&format=png&auto=webp&s=62430a073ec06df4aa78c467d74f924eebe6967d) 
![Mobil visning](https://preview.redd.it/fufkf3fp5tte1.png?width=523&format=png&auto=webp&s=b7656214eee1c8914ba8a86bd0a554bacdbe6014)

## Teknologier

- HTML5 og CSS3
- JavaScript (ES6+)
- Firebase Authentication
- Firebase Firestore Database
- Firebase v11.6.0 SDK

## Installasjon og Oppsett

1. Klon repositoriet:
   ```
   git clone https://github.com/ditt-brukernavn/firebase-chat.git
   ```

2. Åpne `index.html` i en nettleser eller bruk en lokal utviklingsserver

3. Firebase-konfigurasjonen er allerede satt opp i `script.js`

## Firebase-oppsett

Applikasjonen bruker følgende Firebase-tjenester:

- **Authentication**: For brukerregistrering og innlogging med e-post/passord
- **Firestore Database**: For å lagre og synkronisere meldinger i sanntid

Firebase-konfigurasjonen er allerede inkludert i koden. For å bruke din egen Firebase-instans, erstatt konfigurasjonsobjektet i `script.js` med ditt eget.

## Bruk

1. Registrer en ny bruker med e-post og passord, eller logg inn med en eksisterende konto
2. Skriv meldinger i inndatafeltet og klikk på send-knappen eller trykk Enter
3. Meldinger vises i sanntid for alle tilkoblede brukere
4. Du kan redigere eller slette dine egne meldinger
5. Bruk tema-knappen for å veksle mellom lys og mørk modus

## Struktur

- `index.html`: Applikasjonens struktur og UI-elementer
- `style.css`: Stilsetting inkludert responsivt design og mørk modus
- `script.js`: All JavaScript-funksjonalitet og Firebase-integrasjon

## Fremtidige forbedringer

- Mulighet for private chatter mellom brukere
- Bildeopplasting og fildeling
- Brukerstatus (online/offline)
- Emojis og formatering av meldinger
- Meldingsvarsler

## Sikkerhet

Applikasjonen bruker Firebase Authentication for sikker brukerautentisering. Firestore-databasen er konfigurert med sikkerhetsregler som sikrer at:

- Kun autentiserte brukere kan lese meldinger
- Brukere kan bare redigere og slette sine egne meldinger

## Lisens

Dette prosjektet er lisensiert under MIT-lisensen.