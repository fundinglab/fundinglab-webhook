# fundinglab-webhook
# MetaApi Copy-Trading mit Whop Integration

Ein Node.js API-Projekt, das Zahlungsverarbeitung über Whop.com mit MetaApi Copy-Trading verbindet. Diese Anwendung ermöglicht das automatische Erstellen und Löschen von MetaApi Copy-Trading-Subscribern basierend auf Whop-Abonnementstatus.

## Features

- Serverless API mit Vercel-Kompatibilität
- Whop Webhook-Verarbeitung (`subscription.started`, `subscription.cancelled`, `subscription.expired`)
- MetaApi CopyFactory2 Integration für Copy-Trading
- Sichere Verarbeitung von Webhook-Payloads
- ESM (ES Modules) Struktur

## Technologie-Stack

- Node.js mit ES Modules
- Vercel Serverless Functions
- MetaApi REST API
- Whop Webhook API

## Installation

1. Forke dieses Repository
2. Verknüpfe es mit deinem Vercel-Konto
3. Setze die erforderlichen Umgebungsvariablen (siehe unten)
4. Deploye das Projekt

## Erforderliche Umgebungsvariablen

In deinem Vercel-Projekt musst du folgende Umgebungsvariablen einrichten:

- `METAAPI_TOKEN`: Dein MetaApi API-Token
- `METAAPI_MASTER_ID`: Die ID deines Master-Kontos in MetaApi
- `WHOP_SECRET`: Dein Whop-Webhook Secret (optional für Webhook-Signaturprüfung)

## Webhooks einrichten

### Whop Webhook

Füge in deinem Whop-Dashboard einen neuen Webhook mit folgender URL hinzu:
