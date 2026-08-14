// O service worker que se mata.
//
// Este arquivo NÃO liga um PWA. Ele existe para DESLIGAR um: numa versão antiga
// o site registrou um service worker que ficou preso em alguns aparelhos,
// servindo página velha e não largando. Este é o antídoto, e nada além disso.
//
// Como funciona: o navegador que já tem um service worker registrado neste
// escopo volta a buscar este endereço sozinho (na navegação, e no máximo a cada
// 24 h). Ao achar um conteúdo diferente do que instalou, ele instala este, que
// se desregistra, manda as janelas recarregarem e apaga os caches. Quem nunca
// registrou nada não registra: não há código de registro em lugar nenhum do
// site, e é assim que tem de ser.
//
// Era gerado pelo `@vite-pwa/astro` com `selfDestroying: true`. A integração
// saiu do projeto em agosto de 2026, por dois motivos: o trabalho dela aqui
// eram estas vinte linhas, e o peer dela para no Astro 5, o que travava a
// subida de versão. O conteúdo abaixo é o que ela gerava, palavra por palavra.
//
// QUANDO APAGAR: quando não sobrar aparelho com o service worker antigo. Não há
// como saber isso ao certo; um arquivo de 20 linhas é barato demais para correr
// o risco. Se o site mudar de domínio (sair do GitHub Pages), o escopo antigo
// morre junto com o endereço antigo, e aí este arquivo pode ir embora.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.registration.unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach((client) => {
        if (client instanceof WindowClient) client.navigate(client.url);
      });
      return Promise.resolve();
    })
    .then(() => self.caches.keys())
    .then((nomes) => Promise.all(nomes.map((n) => self.caches.delete(n))));
});
