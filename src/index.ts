import * as MonoUtils from "@fermuch/monoutils";

// based on settingsSchema @ package.json
type Config = Record<string, unknown> & {
  target: (
      'MONOFLOW_RELAY_1'
    | 'MONOFLOW_RELAY_2'
    | 'MONOFLOW_BUZ_1'
    | 'TELTONIKA_OUTPUT_0'
    | 'TELTONIKA_OUTPUT_1'
    | 'TELTONIKA_OUTPUT_2'
    | 'TELTONIKA_OUTPUT_3'
    | 'TELTONIKA_OUTPUT_4'
  )[];
}
const conf = new MonoUtils.config.Config<Config>();

function setLock(state: boolean) {
  platform.log('Lock/unlock script: ' + (state ? 'Locked' : 'Unlocked'));

  let targets = conf.get("target", ['MONOFLOW_RELAY_1']);
  if (!Array.isArray(targets)) {
    targets = [targets];
  }

  targets.forEach(target => {
    env.setData(target, Boolean(state));
  });
}

messages.on('onInit', function() {
  platform.log('Lock/unlock script installed. Applying current lock state...');

  const lastState = MonoUtils.wk.lock.getLockState();
  setLock(lastState);
});

MonoUtils.wk.event.subscribe<MonoUtils.wk.lock.LockEvent>('lock-request', (ev) => {
  const locked = ev.getData().lock;
  setLock(locked);
})