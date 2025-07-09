# Deployment-Anleitung für Jimmy's Tapas Bar Website

## Option 1: Deployment im Hauptverzeichnis (empfohlen)

Wenn Sie alle Dateien direkt im Hauptverzeichnis Ihres Webservers ablegen möchten:

### 1. Dateistruktur anpassen

Kopieren Sie alle Dateien aus dem `Fertige-Webseite` Ordner direkt in Ihr Hauptverzeichnis:

```
/httpdocs/ (oder /public_html/)
├── index.html
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── css/
│   ├── styles.css
│   ├── speisekarte.css
│   └── ...
├── js/
│   ├── main.js
│   ├── speisekarte.js
│   ├── menu-data.js
│   └── ...
├── images/
│   └── ...
├── config/
│   └── menu.ini
├── pages/
│   ├── speisekarte.html
│   ├── kontakt.html
│   └── ...
```

### 2. HTML-Dateien anpassen

**WICHTIG**: Wenn Sie die Dateien direkt ins Hauptverzeichnis kopieren, müssen Sie die folgenden Pfade in allen HTML-Dateien im `pages/` Ordner anpassen:

#### In `pages/speisekarte.html`, `pages/kontakt.html`, etc.:

**Ändern Sie:**
```html
<!-- Von: -->
<link rel="stylesheet" href="../css/styles.css">
<link rel="stylesheet" href="../css/speisekarte.css">
<script src="../js/menu-data.js"></script>
<script src="../js/main.js"></script>
<script src="../js/speisekarte.js"></script>

<!-- Zu: -->
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/speisekarte.css">
<script src="js/menu-data.js"></script>
<script src="js/main.js"></script>
<script src="js/speisekarte.js"></script>
```

**Und Navigation-Links:**
```html
<!-- Von: -->
<a href="../index.html" class="nav-link">Startseite</a>

<!-- Zu: -->
<a href="index.html" class="nav-link">Startseite</a>
```

**Und Bild-Pfade:**
```html
<!-- Von: -->
<img src="../images/paella-specialty.jpg" alt="Speisekarte Jimmy's Tapas Bar">

<!-- Zu: -->
<img src="images/paella-specialty.jpg" alt="Speisekarte Jimmy's Tapas Bar">
```

## Option 2: Deployment mit Unterordner-Struktur (aktuelle Struktur)

Falls Sie die aktuelle Struktur beibehalten möchten, können Sie einfach den kompletten `Fertige-Webseite` Ordner hochladen.

## Automatisches Deployment-Script

Für die einfache Umstellung können Sie dieses Script verwenden:

```bash
#!/bin/bash
# deployment-fix.sh

# Ersetze Pfade in pages/*.html Dateien für Hauptverzeichnis-Deployment
find pages/ -name "*.html" -type f -exec sed -i 's|href="../css/|href="css/|g' {} \;
find pages/ -name "*.html" -type f -exec sed -i 's|src="../js/|src="js/|g' {} \;
find pages/ -name "*.html" -type f -exec sed -i 's|src="../images/|src="images/|g' {} \;
find pages/ -name "*.html" -type f -exec sed -i 's|href="../index.html"|href="index.html"|g' {} \;

echo "Pfade für Hauptverzeichnis-Deployment angepasst!"
```

## Testen

Nach dem Deployment testen Sie:
1. Homepage: `https://ihre-domain.de/`
2. Speisekarte: `https://ihre-domain.de/pages/speisekarte.html`
3. Prüfen Sie, dass alle Menü-Items korrekt angezeigt werden
4. Testen Sie die Kategorie-Filter
5. Prüfen Sie die Navigation zwischen den Seiten

## Support

Falls Probleme auftreten, prüfen Sie:
1. Browser-Konsole auf JavaScript-Fehler
2. Pfade in den HTML-Dateien
3. Datei-Berechtigungen auf dem Server