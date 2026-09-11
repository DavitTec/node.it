# Local Network Testing (Staging / Production)

Testing staging or production builds against real devices — a phone, another
computer, a device outside the LAN — instead of only via GitHub Pages. The
machine running the server should **not** stay exposed to the network
permanently; this is a temporary, test-only exposure with an explicit
open/close step and a log of when it happened.

## Modes

- `development` — `pnpm web`. Serves `./dist`. `.env` HOST/PORT/DEBUG are
  ignored; always `localhost:3000`.
- `staging` — `pnpm build:staging && pnpm web:staging`. Serves `./stage`.
  `.env` HOST/PORT/DEBUG apply.
- `production` — `pnpm web:production`. Live dynamic app (`app.js`).
  `.env` HOST/PORT/DEBUG apply.

Set `PROJECT_STATUS` in `.env` to switch modes for a plain `pnpm web` run, or
use the `:staging`/`:production` script variants to override it for one
command without editing the file.

## Testing from another device on the same LAN

1. Set `.env`'s `HOST`/`PORT` to this machine's LAN IP and the port you want
   to test on.
2. Start the server in the mode being tested.
3. Open the port through the local firewall (see below).
4. From another device on the same Wi-Fi, browse to `http://<HOST>:<PORT>/`.

## Opening the port temporarily (ufw)

This machine denies incoming connections by default (`ufw`, default policy
`deny (incoming)`). Testing from another device requires the port to be
explicitly allowed — and closed again once the test is done.

```
pnpm port:allow      # opens the app's configured port through ufw
pnpm port:status     # check whether it's currently open
pnpm port:deny       # closes it again
```

`scripts/port-access.sh` warns before opening the firewall if the port is
unused, or already owned by something other than this app — that would
expose whatever that other thing is, not this app. Every allow/deny is
appended to `logs/port-access.log` (timestamp, action, port) as a record of
when the machine was exposed and why. That log is git-ignored, same as the
rest of `logs/`.

**Always pair `port:allow` with `port:deny`.** Don't leave a port open past
the test session.

## Testing from outside the LAN (via the internet)

This additionally requires forwarding the port on the router (Fritz!Box) to
this machine. Treat it the same way as the `ufw` rule: temporary, test-only,
removed immediately after. This is a manual router step, not scripted here —
automating it would mean storing router admin credentials in this project,
which hasn't been set up.

### Fritz!Box port forward (temporary — remove after testing)

1. **Internet → Freigaben → Portfreigaben**
2. Add a device/application share for this device. Give it a reserved/static
   LAN IP lease first (**Heimnetz → Netzwerk**) — a plain DHCP lease can
   change on reboot and silently break the rule.
3. Protocol TCP, port at device = the configured `PORT`, external port = same
   (or a different one, your choice).
4. Save.
5. Test from a device outside the LAN (e.g. a phone on mobile data):
   `http://<public-ip>:<port>/`.
6. **Delete the port-forward rule when done.** Don't leave it active.

### Known gotcha: CGNAT

If the ISP doesn't hand out a real public IPv4, no forwarding configuration
will ever make this reachable. Compare the WAN IPv4 the Fritz!Box reports on
its own overview page against what an external "what's my IP" site shows
from a device on the same network — if they don't match, it's Carrier-Grade
NAT, and port forwarding can't work regardless of configuration. A tunnel
(Tailscale, Cloudflare Tunnel) is the workaround in that case, not a router
setting.

## Checklist for a test session

- [ ] `PROJECT_STATUS` in `.env` set to the mode being tested
- [ ] `pnpm build:staging` (staging only)
- [ ] Server started (`pnpm web` / `web:staging` / `web:production`)
- [ ] `pnpm port:allow`
- [ ] Fritz!Box port-forward added (WAN test only)
- [ ] Tested from the other device(s)
- [ ] Fritz!Box port-forward removed (WAN test only)
- [ ] `pnpm port:deny`
- [ ] `PROJECT_STATUS` back to `development` in `.env`
