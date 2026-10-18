# RachaMix

Aplicação web para cadastrar jogadores e sortear times de futebol de forma rápida. Os dados do racha são armazenados no `localStorage` do navegador.

## Requisitos

- Node.js 20.19 ou superior (ou uma versão compatível com o Angular 19)
- npm

## Instalação

```bash
npm install
```

## Desenvolvimento

Inicie o servidor local:

```bash
npm start
```

Acesse `http://localhost:4200/` no navegador. O comando `npm run watch` também pode ser usado para recompilar automaticamente sem iniciar o servidor.

## Build de produção

```bash
npm run build
```

Os arquivos compilados são gerados em `dist/rachamix/browser`.

## Publicação no IIS

1. Instale o IIS e o módulo [URL Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite).
2. Execute `npm run build`.
3. Copie todo o conteúdo de `dist/rachamix/browser` para a pasta física configurada no site do IIS.
4. O `web.config` é copiado automaticamente para a raiz publicada, ao lado do `index.html`, durante o build.
5. No IIS, aponte o site para essa pasta e habilite o conteúdo estático.

O `web.config` redireciona as URLs que não correspondem a arquivos ou diretórios existentes para o `index.html`, permitindo o funcionamento de rotas de uma SPA após atualizar a página ou acessar uma URL diretamente.

> Se o módulo URL Rewrite não estiver instalado, o IIS pode retornar erro 500.19 ao carregar o `web.config`.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm test` | Executa os testes automatizados |
| `npm run lint` | Verifica problemas de lint |
| `npm run format` | Formata o código |
| `npm run format:check` | Verifica a formatação |

## Tecnologias

- Angular 19
- TypeScript
- Bootstrap 5
- SCSS
