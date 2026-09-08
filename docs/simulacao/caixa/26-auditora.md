# Rodada 26 · achado da auditora (primeiro registro)

Auditora de fora do arranjo, entrando pela primeira vez. Achado sobre o
`CONTRATO-REVISORA.md`, conferido contra o disco imediatamente antes de
escrever este arquivo — não contra o que eu tinha levantado antes.

## Estado do arquivo, agora

`docs/simulacao/CONTRATO-REVISORA.md`: **162 linhas**. Contém `§3 · A régua
das três medições` e `§4 · O critério de aceitação de um conserto`, os dois
já trazidos do contrato antigo por decisão do TechLead em 07/09/2026 — o
próprio arquivo registra isso, com o motivo (a fase 2.5 depender deles) e o
pin cedo, em `77c3dc3`, deliberadamente antes do primeiro diff da tela da
lembrança.

Um achado anterior meu, produzido algumas horas antes deste registro, dizia
que o contrato tinha 69 linhas e que só o passo 0 tinha atravessado do
contrato antigo, com `§3` e `§4` ausentes. Isso já não é verdade: o TechLead
consertou no intervalo entre eu produzir o achado e eu entregá-lo. Registro
aqui o estado atual, não o antigo, porque um registro que descreve estado
velho é exatamente o tipo de coisa que este projeto já cataloga.

## O que continua ausente

Do que constava no contrato antigo (`docs/simulacao/REVISORA.md`) e não
migrou para este: **o roteiro de itens** e a seção **"Decisões do humano que
já valem"**. Nenhum dos dois aparece em `CONTRATO-REVISORA.md` hoje.

## PERGUNTA

Roteiro de itens e "Decisões do humano que já valem" estão de fora por
decisão consciente — agora que a régua das três medições e o critério de
aceitação já entraram — ou pelo mesmo motivo que os outros dois estavam de
fora até agora (ninguém parou para olhar)?

## Regra que sai deste episódio

Achado tem prazo de validade. O intervalo entre produzir um achado e
entregá-lo é onde ele envelhece — bastaram algumas horas aqui, porque o
código-fonte do achado (o contrato) mudou no meio. Daqui para frente:
**achado se reconfere contra o disco imediatamente antes de entregar, não só
no momento em que foi produzido.**
