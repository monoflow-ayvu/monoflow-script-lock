import * as MonoUtils from '@fermuch/monoutils';
const read = require('fs').readFileSync;
const join = require('path').join;

function loadScript() {
  // import global script
  const script = read(join(__dirname, '..', 'dist', 'bundle.js')).toString('utf-8');
  eval(script);
}

describe("onInit", () => {
  afterEach(() => {
    // clean listeners
    messages.removeAllListeners();
  });

  it('by default sets MONOFLOW_RELAY_1 as unlocked onInit', () => {
    platform.log = jest.fn();
    loadScript();
    
    messages.emit('onInit');

    expect(platform.log).toHaveBeenCalledWith('Lock/unlock script: Unlocked');
    expect(env.data['MONOFLOW_RELAY_1']).toBe(false);
    expect(env.data['MONOFLOW_RELAY_2']).toBeUndefined();
    expect(env.data['MONOFLOW_BUZ_1']).toBeUndefined();
  });

  it('sets by multiple targets to unlocked onInit if configured', () => {
    platform.log = jest.fn();
    getSettings = () => ({
      target: ['MONOFLOW_RELAY_1', 'MONOFLOW_RELAY_2', 'MONOFLOW_BUZ_1', 'TELTONIKA_OUTPUT_3']
    });

    loadScript();
    messages.emit('onInit');
    expect(platform.log).toHaveBeenCalledWith('Lock/unlock script: Unlocked');
    expect(env.data['MONOFLOW_RELAY_1']).toBe(false);
    expect(env.data['MONOFLOW_RELAY_2']).toBe(false);
    expect(env.data['MONOFLOW_BUZ_1']).toBe(false);
    expect(env.data['TELTONIKA_OUTPUT_3']).toBe(false);
  })

  it('reacts to lock-request event', () => {
    platform.log = jest.fn();
    getSettings = () => ({
      target: ['MONOFLOW_RELAY_1']
    });
    loadScript();
    messages.emit('onInit');

    const lock = new MonoUtils.wk.lock.LockEvent(true);
    const unlock = new MonoUtils.wk.lock.LockEvent(false);

    messages.emit('onEvent', lock);
    expect(env.data['MONOFLOW_RELAY_1']).toBe(true);
    expect(env.data['MONOFLOW_RELAY_2']).toBeFalsy();
    expect(env.data['MONOFLOW_BUZ_1']).toBeFalsy();

    messages.emit('onEvent', unlock);
    expect(env.data['MONOFLOW_RELAY_1']).toBe(false);
    expect(env.data['MONOFLOW_RELAY_2']).toBeFalsy();
    expect(env.data['MONOFLOW_BUZ_1']).toBeFalsy();
  });
});