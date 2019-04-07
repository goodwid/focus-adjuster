#!/usr/bin/env node

const readline = require('readline');
const { execSync } = require('child_process');
const Counter = require('./lib/counter');
const Preferences = require('preferences');
const prefs = new Preferences('focus-adjuster', {}, {
  encrypt: false,
  format: 'json',
});

function execFocus(value) {
  execSync(`v4l2-ctl -c focus_absolute=${value}`); 
}

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);

const options = {
  min: 0,
  max: 32,
  initialValue: 20,
  rollover: false
}

if(prefs.focus) options.initialValue = prefs.focus;

const focus = new Counter(options);

function init() {
  try {
    execFocus(prefs.focus)
  }
  catch(e) {
    console.log('Unable to set focus.  Setting camera to manual focus.');
    execSync('v4l2-ctl -c focus_auto=0');
  }
  console.log(`
Current focus value is ${focus.get()}
Press Q to exit, j and k to adjust focus up/down.

`);

}

function completeAction() {
  const f = focus.get();
  prefs.focus = f
  process.stdout.moveCursor(-40);
  process.stdout.clearLine(0);
  process.stdout.write(`Focus value: ${f}`)
}

process.stdin.on('keypress', e => {
  switch(e) {
    case 'q': process.stdout.write('\n\nExiting\n'), process.exit(0);
    case 'j': {
      execFocus(focus.decrement());
      completeAction();
      break;
    }
    case 'k': {
      execFocus(focus.increment());
      completeAction();
      break;
    }
    
  }
});

init();