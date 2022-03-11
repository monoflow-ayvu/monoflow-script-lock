import * as MonoUtils from "@fermuch/monoutils";

// based on settingsSchema @ package.json
type Config = Record<string, unknown> & {
  nome: string;
}

const conf = new MonoUtils.config.Config<Config>();

messages.on('onInit', function() {
  platform.log('Lock/unlock script installed.');
});

messages.on('onEvent', (event: any) => {
  if (event?.kind === 'lock-request') {
    const ev = event as MonoUtils.wk.lock.LockEvent;
    const locked = ev.getData()?.lock || true;
    platform.log('Lock/unlock (messages) script: ' + (locked ? 'Locked' : 'Unlocked'));
  } else {
    platform.log('received message onEvent: ' + JSON.stringify(event));
  }
})

MonoUtils.wk.event.subscribe<MonoUtils.wk.lock.LockEvent>('lock-request', (ev) => {
  const locked = ev.getData()?.lock || true;
  platform.log('Lock/unlock script: ' + (locked ? 'Locked' : 'Unlocked'));
})