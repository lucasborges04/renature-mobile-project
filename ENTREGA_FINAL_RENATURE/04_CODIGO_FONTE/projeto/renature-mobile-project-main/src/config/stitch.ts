export const stitchConfig = {
  endpoint: 'https://stitch.googleapis.com/mcp',
  projectId: '10009437640300007829',
  projectTitle: 'Renature: Eco-Learning & Gamification App',
  appIntegrationReady: true,
};

export function getStitchStatusLabel() {
  return stitchConfig.appIntegrationReady
    ? 'Telas implementadas a partir do projeto Stitch'
    : 'MCP conectado no Codex; integração mobile pendente';
}
