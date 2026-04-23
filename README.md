# Arbetslivserfarenhet - REST API

Detta repository innehåller Frontend-kod för ett enklare REST API byggt med Express. API:et är skapat för att hantera en databas över arbetslivserfarenheter. Grundläggande funktionalitet för CRUD (Create, Read, Update, Delete) är implementerad för att kunna administrera poster via en extern klient.

## Live-version

En liveversion av API:et finns tillgänglig på följande URL: [Frontend](https://backend-baserad-wu-lab2-fe.onrender.com/)

## Installation och databas

API:et använder en SQLite-databas. Klona ner källkodsfilerna, kör kommando **npm install** för att installera nödvändiga npm-paket. Kör installations-skriptet **install.js** för att initiera databasen. Installations-skriptet skapar databastabellen enligt nedanstående:

| Tabell-namn | Fält |
| :--- | :--- |
| **jobs** | **id** (int, PK), **companyname** (varchar), **jobtitle** (varchar), **location** (varchar), **startdate** (date), **enddate** (date), **description** (text) |

## Användning

Nedan finns beskrivet hur man når API:et på olika vis:

| Metod | Ändpunkt | Beskrivning |
| :--- | :--- | :--- |
| GET | /jobs | Hämtar alla lagrade arbetslivserfarenheter. |
| GET | /jobs/:id | Hämtar en specifik post med angivet **id**. |
| POST | /jobs | Lagrar en ny post. Kräver att ett jobb-objekt skickas med i JSON-format. |
| PUT | /jobs/:id | Uppdaterar en existerande post med angivet **id**. Kräver att ett jobb-objekt skickas med. |
| DELETE | /jobs/:id | Raderar en post med angivet **id**. |

Ett jobb-objekt returneras/skickas som JSON med följande struktur:

```json
{
   "companyname": "Företaget AB",
   "jobtitle": "Webbutvecklare",
   "location": "Sundsvall",
   "startdate": "2023-01-01",
   "enddate": "2023-12-31",
   "description": "Beskrivning av arbetsuppgifter."
}