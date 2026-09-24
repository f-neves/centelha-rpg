// Gancho UserPromptSubmit: quem digita /arquiteto recebe a sessão já nomeada "Arquiteto (RPG)".
// O campo sessionTitle tem o mesmo efeito do /rename (code.claude.com/docs/en/hooks,
// "UserPromptSubmit decision control"). Qualquer outra mensagem passa sem saída nenhuma.
// Ligado em .claude/settings.json. Pedido do humano em 24/09/2026.

let entrada = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (pedaco) => { entrada += pedaco; });
process.stdin.on('end', () => {
  let prompt = '';
  try {
    prompt = String(JSON.parse(entrada).prompt ?? '');
  } catch {
    process.exit(0); // entrada ilegível: não atrapalha a mensagem
  }
  if (!/^\s*\/arquiteto(\s|$)/.test(prompt)) process.exit(0);
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      sessionTitle: 'Arquiteto (RPG)',
    },
  }));
});
