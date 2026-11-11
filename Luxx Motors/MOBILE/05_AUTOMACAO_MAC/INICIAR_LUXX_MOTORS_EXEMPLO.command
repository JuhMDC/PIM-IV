#!/bin/bash
# LUXX MOTORS - inicializacao privada no macOS
# Projetado para Mac Intel / macOS Monterey. Nao remove nem recria dados.

export PATH="/usr/local/bin:/opt/homebrew/bin:/Applications/Docker.app/Contents/Resources/bin:$HOME/.docker/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

API_DIR="$HOME/Downloads/PIM/PIM-ATUALIZADO/LuxxMotorsAPI"
MOBILE_DIR="$HOME/Downloads/LUXX_MOTORS_Entrega/mobile"
CONTAINER="luxx-sql-2025"
TAILSCALE_APP="/Applications/Tailscale.app"
TAILSCALE_CLI="$TAILSCALE_APP/Contents/MacOS/Tailscale"
API_TEST_URL="http://127.0.0.1:5107/api/mobile/veiculos"
HTTPS_TEST_URL="https://SEU-MAC.SUA-REDE.ts.net/api/mobile/veiculos"

header() {
  printf '\n====================================================\n'
  printf ' %s\n' "$1"
  printf '====================================================\n'
}
info() { printf '\n[INFO] %s\n' "$1"; }
ok() { printf '[OK] %s\n' "$1"; }
warn() { printf '[ATENCAO] %s\n' "$1"; }
stop_with_message() {
  printf '\n[ERRO] %s\n' "$1"
  printf '\nNenhum arquivo do banco de dados foi removido ou modificado.\n'
  printf 'Pressione Enter para fechar esta janela... '
  read -r _
  exit 1
}

# Executa uma linha de comando em uma NOVA janela do Terminal.
# Assim API e Expo continuam ativos mesmo apos o iniciador terminar.
start_terminal_window() {
  /usr/bin/osascript - "$1" <<'APPLESCRIPT'
on run argv
    set cmdText to item 1 of argv
    tell application "Terminal"
        activate
        do script cmdText
    end tell
end run
APPLESCRIPT
}

run_tailscale() {
  TAILSCALE_BE_CLI=1 "$TAILSCALE_CLI" "$@"
}

api_online() {
  /usr/bin/curl --silent --show-error --fail --max-time 4 "$API_TEST_URL" >/dev/null 2>&1
}

expo_online() {
  local value
  value="$(/usr/bin/curl --silent --max-time 3 http://127.0.0.1:8081/status 2>/dev/null || true)"
  [ "$value" = "packager-status:running" ]
}

header "LUXX MOTORS - INICIAR SISTEMA"
printf 'Banco: %s | API: 127.0.0.1:5107 | Expo: 8081\n' "$CONTAINER"
printf 'Conexao remota: Tailscale Serve com HTTPS privado.\n'

# Verificar as pastas sem tentar restaurar backups ou criar bancos novos.
[ -d "$API_DIR" ] || stop_with_message "Pasta da API nao encontrada: $API_DIR. Se mudou o projeto de lugar, precisamos ajustar este arquivo."
[ -f "$API_DIR/bin/Debug/net8.0/LuxxMotorsAPI.dll" ] || stop_with_message "Arquivo compilado da API nao encontrado. Nao vou recompilar nem alterar seu projeto automaticamente."
[ -d "$MOBILE_DIR" ] && [ -f "$MOBILE_DIR/package.json" ] || stop_with_message "Projeto Expo nao encontrado: $MOBILE_DIR"

header "1 de 4 - DOCKER E SQL SERVER"
if ! command -v docker >/dev/null 2>&1; then
  stop_with_message "Comando docker nao encontrado. Confirme que o Docker Desktop esta instalado."
fi

if ! docker info >/dev/null 2>&1; then
  info "Abrindo Docker Desktop..."
  /usr/bin/open -a Docker || stop_with_message "Nao consegui abrir o Docker Desktop."
fi

ready=0
for ((i=1; i<=40; i++)); do
  if docker info >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 3
done
[ "$ready" -eq 1 ] || stop_with_message "Docker nao ficou pronto. Abra o Docker Desktop, verifique os avisos e tente novamente."
ok "Docker Desktop pronto."

if ! docker container inspect "$CONTAINER" >/dev/null 2>&1; then
  stop_with_message "Container $CONTAINER nao encontrado. Nao vou criar um novo SQL Server automaticamente."
fi

running="$(docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null || true)"
if [ "$running" != "true" ]; then
  info "Iniciando o SQL Server existente ($CONTAINER)..."
  docker start "$CONTAINER" >/dev/null || stop_with_message "Nao consegui iniciar o container $CONTAINER."
fi
ok "SQL Server $CONTAINER ligado."
# O banco pode levar alguns instantes para ficar pronto apos o container iniciar.
sleep 3

header "2 de 4 - TAILSCALE (REDE PRIVADA)"
[ -d "$TAILSCALE_APP" ] && [ -x "$TAILSCALE_CLI" ] || stop_with_message "Tailscale nao encontrado em /Applications/Tailscale.app."
/usr/bin/open -a Tailscale >/dev/null 2>&1 || stop_with_message "Nao consegui abrir o Tailscale."

connected=0
for ((i=1; i<=15; i++)); do
  ts_output="$(run_tailscale status 2>&1)"
  ts_result=$?
  if [ "$ts_result" -eq 0 ] && printf '%s\n' "$ts_output" | /usr/bin/grep -E -q '100\.110\.205\.92|lab-academico'; then
    connected=1
    break
  fi
  sleep 2
done

if [ "$connected" -ne 1 ]; then
  warn "Nao consegui confirmar a conexao do Tailscale."
  printf 'Clique no icone do Tailscale na barra do Mac e confirme CONNECTED.\n'
  printf 'Depois pressione Enter para conferir novamente... '
  read -r _
  ts_output="$(run_tailscale status 2>&1)"
  ts_result=$?
  if [ "$ts_result" -ne 0 ] || ! printf '%s\n' "$ts_output" | /usr/bin/grep -E -q '100\.110\.205\.92|lab-academico'; then
    stop_with_message "Tailscale ainda nao esta conectado. Entre na sua conta e tente novamente."
  fi
fi
ok "Mac conectado ao Tailscale."

serve_status="$(run_tailscale serve status 2>&1 || true)"
if ! printf '%s\n' "$serve_status" | /usr/bin/grep -Fq 'http://127.0.0.1:5107'; then
  info "Ativando Tailscale Serve PRIVADO para a API local na porta 5107..."
  if ! run_tailscale serve --bg 5107; then
    stop_with_message "Nao consegui ativar o Tailscale Serve. Nao habilite Funnel: ele e publico."
  fi
fi
ok "HTTPS privado pelo Tailscale Serve configurado."

header "3 de 4 - API ASP.NET CORE"
if api_online; then
  ok "API ja estava funcionando; nao vou abrir uma segunda copia."
else
  if /usr/sbin/lsof -nP -iTCP:5107 -sTCP:LISTEN 2>/dev/null | /usr/bin/grep -q LISTEN; then
    stop_with_message "Porta 5107 ocupada, mas nao responde como a API. Verifique o outro Terminal antes de tentar novamente."
  fi

  command -v dotnet >/dev/null 2>&1 || stop_with_message "dotnet nao encontrado no PATH. Confira a instalacao do .NET 8."
  info "Abrindo nova janela do Terminal para a API..."
  api_dir_escaped="$(printf '%q' "$API_DIR")"
  api_cmd="cd $api_dir_escaped && ASPNETCORE_ENVIRONMENT=Development dotnet bin/Debug/net8.0/LuxxMotorsAPI.dll --urls http://127.0.0.1:5107"
  start_terminal_window "$api_cmd" >/dev/null || stop_with_message "Nao consegui abrir o Terminal da API. Veja as permissoes de Automacao do macOS."

  online=0
  for ((i=1; i<=30; i++)); do
    if api_online; then
      online=1
      break
    fi
    sleep 2
  done
  [ "$online" -eq 1 ] || stop_with_message "API ainda nao respondeu. Veja o erro na nova janela do Terminal da API (por exemplo CoreCLR ou conexao SQL)."
  ok "API funcionando e consultando os veiculos."
fi

header "4 de 4 - EXPO GO"
if [ -f "$MOBILE_DIR/.env" ]; then
  if ! /usr/bin/grep -Fxq 'EXPO_PUBLIC_API_URL=https://SEU-MAC.SUA-REDE.ts.net' "$MOBILE_DIR/.env"; then
    warn "Confira mobile/.env: o endereco HTTPS privado pode estar diferente do esperado."
  fi
else
  warn "Arquivo mobile/.env nao encontrado; o aplicativo pode entrar em modo demonstracao."
fi

if expo_online; then
  ok "Expo ja esta rodando na porta 8081. Nao vou abrir outra sessao."
else
  if /usr/sbin/lsof -nP -iTCP:8081 -sTCP:LISTEN 2>/dev/null | /usr/bin/grep -q LISTEN; then
    stop_with_message "Porta 8081 em uso por outro processo. Verifique as janelas antigas do Expo antes de tentar novamente."
  fi
  command -v node >/dev/null 2>&1 && command -v npx >/dev/null 2>&1 || stop_with_message "Node.js ou npx nao encontrado."
  info "Abrindo nova janela do Terminal para o Expo; o QR Code aparecera nela."
  mobile_dir_escaped="$(printf '%q' "$MOBILE_DIR")"
  expo_cmd="cd $mobile_dir_escaped && npx expo start --lan"
  start_terminal_window "$expo_cmd" >/dev/null || stop_with_message "Nao consegui abrir a janela do Expo."
fi

header "PRONTO - PROJETO INICIADO"
printf '1. Deixe Docker, Tailscale e os Terminais da API e do Expo funcionando.\n'
printf '2. No iPhone, conecte o Tailscale e abra LUXX MOTORS no Expo Go.\n'
printf '3. Se precisar, escaneie o QR Code da janela do Expo (mesmo Wi-Fi para carregar).\n'
printf '4. API HTTPS privada: %s\n' "$HTTPS_TEST_URL"
printf '\nSe houver problema, veja primeiro o Terminal da API.\n'
printf 'O Mac precisa permanecer ligado e sem repouso.\n'
printf '\nPressione Enter para finalizar SOMENTE esta janela do iniciador... '
read -r _
exit 0
