import * as MonoUtils from "@fermuch/monoutils";

// based on settingsSchema @ package.json
type Config = Record<string, unknown> & {
  nome: string;
}

const conf = new MonoUtils.config.Config<Config>();

messages.on('onInit', function() {
  platform.log('Lock/unlock script installed.');
});

const dummyEvent = new MonoUtils.wk.lock.LockEvent(true);
MonoUtils.wk.event.subscribe<MonoUtils.wk.lock.LockEvent>(dummyEvent.kind, (ev) => {
  const locked = ev.getData()?.lock || true;
  platform.log('Lock/unlock script: ' + (locked ? 'Locked' : 'Unlocked'));
})