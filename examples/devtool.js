var Introspection;

var enterFlushScope;
var enterComponentScope;
var flushScopes;
var reconcilerScopes;
var componentScope;

var WTF = window.wtf && window.wtf.trace;
if (WTF) {
  enterFlushScope = WTF.events.createScope('flush()');
  enterComponentScope = {};
  flushScopes = [];
  reconcilerScopes = [];
  componentScope = null;
}

var ReactWebTracingFrameworkDevtool = {
  injection: {
    injectIntrospection(Injected) {
      Introspection = Injected;
    },
  },
  onBeginFlush() {
    if (!WTF) {
      return;
    }

    flushScopes.push(enterFlushScope());
  },
  onEndFlush() {
    if (!WTF) {
      return;
    }

    WTF.leaveScope(flushScopes.pop());
  },
  onBeginLifeCycleTimer(instanceID, timerType) {
    if (!WTF) {
      return;
    }

    var displayName = Introspection.getDisplayName(instanceID);
    displayName = displayName.replace(/\W/g,'_');

    if (!enterComponentScope[displayName]) {
      enterComponentScope[displayName] = WTF.events.createScope(
        displayName + '(ascii type)'
      );
    }

    componentScope = enterComponentScope[displayName](timerType)
  },
  onEndLifeCycleTimer(instanceID, timerType) {
    if (!WTF) {
      return;
    }

    WTF.leaveScope(componentScope);
  },
  onBeginReconcilerTimer(instanceID, timerType) {
    if (!WTF) {
      return;
    }

    var displayName = Introspection.getDisplayName(instanceID);
    displayName = displayName.replace(/\W/g,'_');

    if (!enterComponentScope[displayName]) {
      enterComponentScope[displayName] = WTF.events.createScope(
        displayName + '(ascii type)'
      );
    }

    reconcilerScopes.push(enterComponentScope[displayName](timerType))
  },
  onEndReconcilerTimer(instanceID, timerType) {
    if (!WTF) {
      return;
    }

    WTF.leaveScope(reconcilerScopes.pop());
  },
};

module.exports = ReactWebTracingFrameworkDevtool;
