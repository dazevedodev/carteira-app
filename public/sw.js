// Service worker mínimo: existe para o Chrome/Edge oferecerem "Instalar aplicativo".
// Não guarda nada em cache de propósito (os dados financeiros sempre vêm do servidor),
// então nunca mostra informação velha.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
