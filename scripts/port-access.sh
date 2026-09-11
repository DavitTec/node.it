#!/usr/bin/env bash
# Temporarily open or close a TCP port through ufw for LAN/WAN testing of
# staging/production modes run locally. The port should NOT stay open
# permanently — always pair `allow` with a matching `deny` once testing is
# done. Every action is appended to logs/port-access.log for a record of
# when and why the port was exposed.
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="$PROJECT_ROOT/logs/port-access.log"
mkdir -p "$(dirname "$LOG_FILE")"

ACTION="${1:-}"
PORT="${2:-}"

usage() {
  echo "Usage: $0 <allow|deny|status> [port]"
  echo "  Port defaults to the app's configured server.port (.env PORT / data/config.json)."
  exit 1
}

if [[ -z "$ACTION" ]]; then
  usage
fi

if [[ -z "$PORT" ]]; then
  PORT="$(node -e "console.log(require('$PROJECT_ROOT/src/config').server.port)" 2>/dev/null || true)"
fi

if [[ -z "$PORT" ]]; then
  echo "Could not resolve a port. Pass one explicitly: $0 $ACTION <port>"
  exit 1
fi

log() {
  printf '%s\t%s\tport=%s\t%s\n' "$(date -Iseconds)" "$ACTION" "$PORT" "$1" >>"$LOG_FILE"
}

# Warn if the port is unused, or used by something that isn't our own app —
# opening the firewall would expose whatever that turns out to be.
check_local_owner() {
  local listener
  listener="$(ss -tlnp 2>/dev/null | awk -v p=":$PORT " '$4 ~ p')"

  if [[ -z "$listener" ]]; then
    echo "Warning: nothing is currently listening on port $PORT on this machine."
    read -rp "Continue anyway? [y/N] " reply
    [[ "$reply" =~ ^[Yy]$ ]] || exit 1
  elif ! grep -q "node" <<<"$listener"; then
    echo "Warning: port $PORT is in use by a non-node process:"
    echo "$listener"
    read -rp "Continue anyway? [y/N] " reply
    [[ "$reply" =~ ^[Yy]$ ]] || exit 1
  fi
}

case "$ACTION" in
  allow)
    check_local_owner
    sudo ufw allow "$PORT"/tcp
    log "opened for testing"
    echo "Port $PORT allowed through ufw."
    echo "Remember: '$0 deny $PORT' when you're done testing."
    ;;
  deny)
    sudo ufw delete allow "$PORT"/tcp
    log "closed after testing"
    echo "Port $PORT access removed from ufw (default deny applies again)."
    ;;
  status)
    sudo ufw status verbose | grep -E "^(To|--|.*\b$PORT\b)" || echo "No explicit rule for $PORT (default: deny)."
    ;;
  *)
    usage
    ;;
esac
