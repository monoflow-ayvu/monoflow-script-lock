import * as MonoUtils from "@fermuch/monoutils";
import { getBoolean } from "@fermuch/monoutils/build/types/tools/storage";

// based on settingsSchema @ package.json
type Config = Record<string, unknown> & {
  target: ('MONOFLOW_RELAY_1' | 'MONOFLOW_RELAY_2' | 'MONOFLOW_BUZ_1')[];
}
const conf = new MonoUtils.config.Config<Config>();

function setLock(state: boolean) {
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
  platform.log('keys', Object.keys(ev), ev, ev.getData, ev.getData?.());
  const locked = (ev as never as {data: {lock: boolean}}).data?.lock;
  platform.log('Lock/unlock script: ' + (locked ? 'Locked' : 'Unlocked'));
  setLock(locked);
})