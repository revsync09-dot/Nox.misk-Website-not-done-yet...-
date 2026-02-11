# No.misk – Website (HTML/CSS/JS)

Statische, professionelle Demo-Website für **No.misk** inkl.:
- Kategorien/Produkte (Demo-Daten, Filter + Sortierung)
- Newsletter-Anmeldung (speichert lokal im Browser)
- Login (Demo, ohne Backend)
- Cookie-Banner (Akzeptieren / Nur notwendig)
- Rechtstexte: Nutzungsbedingungen, Datenschutzerklärung, Rechtinformationen
- Google-Maps-Karte: Humboldtstraße 48, 4020 Linz
- Social Links (TikTok/Snapchat) + klickbare Thumbnails

## Starten
Einfach `index.html` im Browser öffnen.

Optional (empfohlen): lokalen Server starten, damit alle Assets sauber geladen werden:

```powershell
cd "c:\Users\subha\Downloads\Nox.misk"
python -m http.server 5500
```

Dann im Browser `http://localhost:5500` öffnen.

## Bilder/Produkte ersetzen
- Die Produktkarten nutzen aktuell Platzhalter. Du kannst später echte Bilder/Produkte einpflegen.
- Social Links anpassen in `js/main.js` (Objekt `SOCIAL_LINKS`).

