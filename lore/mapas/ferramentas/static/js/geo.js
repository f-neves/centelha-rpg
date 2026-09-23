// Distância real sobre Uldun (grande círculo, haversine), do lado do navegador.
//
// Arquivo próprio desde a etapa 9 (2026-09-23): a régua (regua.js) mede com esta
// função, e o servidor mede com backend/geo.py (é com ela que a atração das estradas
// decide os 5 km; a tela da Estrada só MOSTRA os km que o servidor devolve, e não
// mede nada). Quem mais precisar medir no navegador usa esta, e não uma cópia.
// As duas implementações são conferidas uma contra a outra, nos mesmos pontos, por
// tests/test_haversine.py, que roda ESTE arquivo no node (não uma cópia colada no
// teste). Mudou uma, o teste acusa.
//
// O raio vem de fora (PARAMETROS_LEAFLET.raio_km, injetado de dados/coordenadas.json)
// e nunca é digitado aqui. O Math.min(1, ...) é o mesmo do servidor: perto do
// antípoda o arredondamento pode deixar `a` um fio acima de 1, e asin daria NaN.

function haversineKm(lat1, lon1, lat2, lon2, raioKm) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * raioKm * Math.asin(Math.min(1, Math.sqrt(a)));
}
