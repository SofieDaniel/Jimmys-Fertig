# 🚀 PLESK DEPLOYMENT ANLEITUNG - Jimmy's Tapas Bar

## 📋 ÜBERSICHT
Diese Anleitung zeigt Ihnen, wie Sie die Jimmy's Tapas Bar Website auf Ihr Plesk Hosting deployen.

## 📦 WEBSITE-PAKET
**Datei:** `jimmys-tapasbar-website.tar.gz` (2.6 MB)
**Inhalt:** Komplette statische Website mit allen Dateien

## 🎯 DEPLOYMENT-OPTIONEN

### **OPTION 1: Upload Files (EMPFOHLEN - EINFACHSTE METHODE)**

#### Schritt 1: Website-Paket herunterladen
1. Laden Sie die Datei `jimmys-tapasbar-website.tar.gz` herunter
2. Entpacken Sie die Datei auf Ihrem Computer
3. Sie erhalten einen Ordner mit allen Website-Dateien

#### Schritt 2: In Plesk hochladen
1. **Klicken Sie auf "Upload Files"** in Ihrem Plesk Panel
2. **Navigieren Sie zum Webroot-Verzeichnis** (meist `httpdocs/` oder `public_html/`)
3. **Löschen Sie alle vorhandenen Dateien** im Webroot (falls vorhanden)
4. **Laden Sie alle Dateien hoch:**
   - `index.html` → in das Hauptverzeichnis
   - `pages/` Ordner → komplett hochladen
   - `css/` Ordner → komplett hochladen
   - `js/` Ordner → komplett hochladen
   - `images/` Ordner → komplett hochladen
   - `config/` Ordner → komplett hochladen
   - `sitemap.xml` → in das Hauptverzeichnis
   - `robots.txt` → in das Hauptverzeichnis
   - `favicon.svg` → in das Hauptverzeichnis

#### Schritt 3: Verzeichnis-Struktur prüfen
Nach dem Upload sollte Ihr Webroot so aussehen:
```
httpdocs/
├── index.html
├── sitemap.xml
├── robots.txt
├── favicon.svg
├── pages/
│   ├── speisekarte.html
│   ├── kontakt.html
│   ├── bewertungen.html
│   ├── standorte.html
│   ├── ueber-uns.html
│   ├── datenschutz.html
│   └── impressum.html
├── css/
│   ├── styles.css
│   ├── speisekarte.css
│   ├── kontakt.css
│   └── [weitere CSS-Dateien]
├── js/
│   ├── main.js
│   └── speisekarte.js
├── images/
│   ├── hero-tapas-background.jpg
│   ├── paella-specialty.jpg
│   └── [weitere Bilder]
└── config/
    └── menu.ini
```

---

### **OPTION 2: Deploy using Git (FÜR FORTGESCHRITTENE)**

#### Voraussetzungen:
- Git Repository mit der Website
- GitHub/GitLab Account

#### Schritt 1: Repository erstellen
1. Erstellen Sie ein neues Repository auf GitHub/GitLab
2. Laden Sie alle Website-Dateien hoch

#### Schritt 2: Git Deployment in Plesk
1. **Klicken Sie auf "Deploy using Git"**
2. **Repository URL eingeben:** `https://github.com/IHR-USERNAME/jimmys-tapasbar`
3. **Branch:** `main` oder `master`
4. **Deployment Key:** Falls privat, SSH-Key hinzufügen
5. **Deploy** klicken

---

### **OPTION 3: FTP/SFTP Upload**

#### Schritt 1: FTP-Zugangsdaten aus Plesk
1. Gehen Sie zu **"FTP Access"** in Plesk
2. Notieren Sie sich: Host, Username, Passwort

#### Schritt 2: FTP-Client verwenden
1. **Empfohlene Clients:** FileZilla, WinSCP
2. **Verbinden Sie sich** mit Ihren FTP-Daten
3. **Navigieren Sie** zum Webroot-Verzeichnis
4. **Laden Sie alle Dateien hoch** (wie bei Option 1)

---

## ⚙️ PLESK-SPEZIFISCHE EINSTELLUNGEN

### **1. PHP-Einstellungen (OPTIONAL)**
Da es eine statische Website ist, sind keine besonderen PHP-Einstellungen nötig.

### **2. SSL-Zertifikat aktivieren**
1. Gehen Sie zu **"SSL/TLS Certificates"**
2. **Let's Encrypt aktivieren** für kostenlose SSL
3. **"Secure your site with SSL"** aktivieren
4. **HTTP zu HTTPS Weiterleitung** aktivieren

### **3. Apache/Nginx Einstellungen**
Standard-Einstellungen sind ausreichend. Keine Änderungen nötig.

---

## 🧪 TESTING NACH DEPLOYMENT

### **1. Grundfunktionen testen:**
- ✅ **Startseite laden:** `https://jimmys-tapasbar.webvision-nord.de`
- ✅ **Navigation testen:** Alle Menüpunkte klicken
- ✅ **Speisekarte testen:** Kategorien filtern
- ✅ **Kontaktformular testen:** E-Mail-Links

### **2. SEO-Features prüfen:**
- ✅ **Sitemap:** `https://jimmys-tapasbar.webvision-nord.de/sitemap.xml`
- ✅ **Robots.txt:** `https://jimmys-tapasbar.webvision-nord.de/robots.txt`
- ✅ **Favicon:** Sollte im Browser-Tab erscheinen

### **3. Performance testen:**
- ✅ **Ladezeiten:** Sollten unter 3 Sekunden sein
- ✅ **Mobile Ansicht:** Responsive Design testen
- ✅ **Bilder:** Alle Bilder sollten laden

---

## 🔧 HÄUFIGE PROBLEME UND LÖSUNGEN

### **Problem: Seite zeigt 404 Error**
**Lösung:** 
- Prüfen Sie, ob `index.html` im Hauptverzeichnis liegt
- Prüfen Sie die Verzeichnis-Struktur

### **Problem: CSS/JavaScript lädt nicht**
**Lösung:**
- Prüfen Sie, ob alle Ordner (`css/`, `js/`) hochgeladen wurden
- Überprüfen Sie die Dateiberechtigungen (755 für Ordner, 644 für Dateien)

### **Problem: Speisekarte zeigt keine Daten**
**Lösung:**
- Prüfen Sie, ob `config/menu.ini` vorhanden ist
- Browser-Konsole öffnen (F12) und Fehler prüfen

### **Problem: Bilder laden nicht**
**Lösung:**
- Prüfen Sie, ob `images/` Ordner komplett hochgeladen wurde
- Überprüfen Sie Dateiberechtigungen

---

## 📞 SUPPORT

Bei Problemen:
1. **Browser-Konsole prüfen** (F12 → Console)
2. **Plesk Error-Logs** überprüfen
3. **Verzeichnis-Struktur** kontrollieren

---

## ✅ DEPLOYMENT CHECKLIST

### Vor dem Upload:
- [ ] Website-Paket heruntergeladen
- [ ] Dateien entpackt
- [ ] Plesk Panel geöffnet

### Upload-Prozess:
- [ ] Webroot-Verzeichnis geleert
- [ ] Alle Dateien hochgeladen
- [ ] Verzeichnis-Struktur geprüft

### Nach dem Upload:
- [ ] Website aufgerufen
- [ ] Navigation getestet
- [ ] Speisekarte getestet
- [ ] SSL aktiviert
- [ ] SEO-Dateien geprüft

---

**🎉 Ihre Website ist bereit für den Live-Betrieb!**