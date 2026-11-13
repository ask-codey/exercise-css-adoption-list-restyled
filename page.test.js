// Checks the list rules in your styles.css: it reads index.html and styles.css the way a browser does, then asks each
// list and list item on the page for its markers, its padding and margins, its display value and its box. It doesn't
// measure anything on screen, so look at the page too: the README's checklist covers that.
// Run it with: npm test (run npm install once first). You don't need to change this file.
const { test } = require('node:test');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const read = (file) => (existsSync(path.join(__dirname, file)) ? readFileSync(path.join(__dirname, file), 'utf8') : '');
const html = read('index.html');
const css = read('styles.css');

// A browser loads styles.css through the link line. The checks have no web server, so they add the file to the page
// themselves, after checking that the link line is there. Before it, they add what every browser gives a list on its
// own (a marker, a 40px indent on the left, and a margin above and below), so your rules have something to take away.
const { window } = new JSDOM(html);
const { document } = window;
const browserDefaults = document.createElement('style');
browserDefaults.textContent = `
  ul, ol { margin-top: 16px; margin-bottom: 16px; padding-left: 40px;
    margin-block-start: 16px; margin-block-end: 16px; padding-inline-start: 40px; }
  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }
`;
document.head.append(browserDefaults);
const sheet = document.createElement('style');
sheet.textContent = css;
document.head.append(sheet);

const style = (element) => window.getComputedStyle(element);
const all = (selector) => [...document.querySelectorAll(selector)];
const one = (selector) => document.querySelector(selector);
const px = (value) => parseFloat(value) || 0;

// Fails a check with a plain message, so the output shows what to fix and no stack trace to scroll past.
function check(passed, message) {
  if (!passed) {
    const problem = new Error(message);
    problem.stack = `Not yet: ${message}`;
    throw problem;
  }
}

// The marker a list shows, whether it was set with list-style-type or with the list-style shorthand. A shorthand
// with no type in it sets the type back to disc, as it does in a browser.
const BULLETS = ['disc', 'circle', 'square'];
const NUMBERS = ['decimal', 'decimal-leading-zero', 'lower-alpha', 'upper-alpha', 'lower-latin', 'upper-latin',
  'lower-roman', 'upper-roman', 'lower-greek'];
function markerType(list) {
  const shorthand = style(list).listStyle;
  if (shorthand) {
    const parts = shorthand.match(/"[^"]*"|'[^']*'|url\([^)]*\)|\S+/g) || [];
    const type = parts.find((part) => /^["']/.test(part) || BULLETS.includes(part) || NUMBERS.includes(part));
    if (type) return type;
    if (parts.includes('none')) return 'none';
    return 'disc';
  }
  return style(list).listStyleType || 'disc';
}

// The indent and the margins, whether they were set with padding and margin or with the names the developer tools
// show (padding-inline-start, margin-block-start and margin-block-end). On an English page they're the same sides,
// so whichever of the two you set to 0 counts.
const either = (list, physical, logical) => Math.min(px(style(list)[physical]), px(style(list).getPropertyValue(logical)));
const indent = (list) => either(list, 'paddingLeft', 'padding-inline-start');
const topMargin = (list) => either(list, 'marginTop', 'margin-block-start');
const bottomMargin = (list) => either(list, 'marginBottom', 'margin-block-end');

function checkStripped(list, name) {
  check(markerType(list) === 'none',
    `${name} still shows its markers (list-style-type: ${markerType(list)}). Take them away with list-style: none on that list.`);
  check(indent(list) === 0,
    `${name} still has the browser's ${indent(list)}px indent on its left. It's padding, so padding: 0 on that list takes it away.`);
  check(topMargin(list) === 0 && bottomMargin(list) === 0,
    `${name} still has a margin above or below it (${topMargin(list)}px above, ${bottomMargin(list)}px below). margin: 0 on that list takes it away.`);
}

// Is there space between each item and the next one: a margin below the first, or a margin above the second?
function spaced(items) {
  for (let i = 1; i < items.length; i++) {
    if (px(style(items[i - 1]).marginBottom) <= 0 && px(style(items[i]).marginTop) <= 0) return i;
  }
  return 0;
}

const transparent = (color) => !color || color === 'transparent' || /^rgba\(.*,\s*0\)$/.test(color);
const rounded = (element) => px(style(element).borderRadius) > 0 || px(style(element).borderTopLeftRadius) > 0;

// The ::marker rules in your stylesheet that reach a list item. A browser keeps these apart from the item's own
// styles, so the checks read them from the stylesheet.
function markerRulesFor(item) {
  const found = [];
  for (const rule of sheet.sheet.cssRules) {
    if (!rule.selectorText || !rule.selectorText.includes('::marker')) continue;
    for (const part of rule.selectorText.split(',')) {
      if (!part.includes('::marker')) continue;
      let base = part.replace('::marker', '');
      if (!base.trim() || /\s$/.test(base)) base += '*';
      try {
        if (item.matches(base.trim())) found.push(rule);
      } catch {
        // A selector the checks can't read: skip it.
      }
    }
  }
  return found;
}

const navList = one('.site-nav ul');
const navItems = all('.site-nav li');
const navLinks = all('.site-nav a');
const petList = one('.pet-list');
const pets = all('.pet');
const tagLists = all('.tags');
const tags = all('.tags li');
const steps = one('.adoption-steps');
const stepItems = all('.adoption-steps li');
const nameOf = (element) => element.closest('.pet').querySelector('h2').textContent;

test('1) index.html links styles.css, and has the menu, the pets and the adoption steps', () => {
  check(html, 'There is no index.html in this folder. Check that you opened the exercise folder, the one with package.json in it.');
  const link = one('link[rel="stylesheet"]');
  check(link && link.getAttribute('href') === 'styles.css',
    'index.html no longer links styles.css. Put this line back inside <head>: <link rel="stylesheet" href="styles.css">');
  check(navList && navLinks.length === 3 && petList && pets.length === 6 && tagLists.length === 6 && steps && stepItems.length === 4,
    'index.html has changed: it should have a menu list with three links, a pet list with six pets, a list of tags for each pet and four adoption steps. Download a fresh copy of index.html if you need to.');
});

test('2) the menu\'s list has no bullets, no indent and no margins', () => {
  checkStripped(navList, 'The menu\'s list (.site-nav ul)');
});

test('3) the menu\'s items sit side by side, and each link fills its item like a button', () => {
  for (const item of navItems) {
    check(style(item).display === 'inline-block',
      `The menu item "${item.textContent.trim()}" has display: ${style(item).display}, so the items stack. Which display value puts them side by side in a line, and lets them take padding that pushes?`);
  }
  for (const link of navLinks) {
    const name = link.textContent.trim();
    check(['block', 'inline-block'].includes(style(link).display),
      `The "${name}" link has display: ${style(link).display}: only its words can be clicked. display: block on the link makes it fill its item.`);
    check(px(style(link).paddingTop) > 0 && px(style(link).paddingLeft) > 0,
      `The "${name}" link has no padding yet (top: ${style(link).paddingTop || '0'}, left: ${style(link).paddingLeft || '0'}). Put the padding on the link, so the whole button can be clicked.`);
  }
});

test('4) the pet list has no bullets, no indent and no margins', () => {
  checkStripped(petList, 'The pet list (.pet-list)');
});

test('5) every pet is a card with padding, a background and rounded corners', () => {
  for (const pet of pets) {
    const name = pet.querySelector('h2').textContent;
    const s = style(pet);
    check(px(s.paddingTop) > 0 && px(s.paddingRight) > 0 && px(s.paddingBottom) > 0 && px(s.paddingLeft) > 0,
      `${name}'s card has no padding on every side yet (${s.paddingTop || '0'} ${s.paddingRight || '0'} ${s.paddingBottom || '0'} ${s.paddingLeft || '0'}). Give .pet padding, so the text doesn't touch the card's edges.`);
    check(!transparent(s.backgroundColor),
      `${name}'s card has no background color yet, so it doesn't look like a card. Give .pet a white background, #ffffff.`);
    check(rounded(pet),
      `${name}'s card has square corners. Give .pet a border-radius, such as 12px.`);
  }
});

test('6) there is space between one card and the next', () => {
  const gap = spaced(pets);
  if (gap === 0) return;
  check(false,
    `${nameOf(pets[gap - 1])}'s card and ${nameOf(pets[gap])}'s card touch: neither has a margin between them. Give the cards a margin below, or a margin above every card that follows another (.pet + .pet).`);
});

test('7) every list of tags has no bullets, no indent and no margins', () => {
  for (const list of tagLists) {
    checkStripped(list, `${nameOf(list)}'s tags (.tags)`);
  }
});

test('8) every tag is a pill, side by side with the others, with room below it', () => {
  for (const tag of tags) {
    const what = `The "${tag.textContent.trim()}" tag on ${nameOf(tag)}'s card`;
    const s = style(tag);
    check(s.display === 'inline-block',
      `${what} has display: ${s.display}. Which display value puts the tags side by side, and lets their padding push the lines around them?`);
    check(px(s.paddingLeft) > 0 && px(s.paddingRight) > 0,
      `${what} has no padding on its sides yet, so its color would hug the word. Give .tags li padding, such as 4px 12px.`);
    check(!transparent(s.backgroundColor),
      `${what} has no background color yet, so it doesn't look like a pill. Give .tags li a background color, such as #a8dadc.`);
    check(rounded(tag),
      `${what} has square corners. A border-radius bigger than the pill, such as 999px, makes both ends fully round.`);
    check(px(s.marginBottom) > 0,
      `${what} has no margin below it, so when the tags wrap onto a second line the lines touch. Give .tags li a margin below, such as 6px.`);
  }
});

test('9) the adoption steps keep their numbers, with space between the steps', () => {
  const type = markerType(steps);
  check(NUMBERS.includes(type),
    type === 'none'
      ? 'The adoption steps lost their numbers (list-style-type: none). The order of the steps matters, so they keep their numbers. Is a rule taking the markers off every list, instead of off one list by its class?'
      : `The adoption steps show "${type}" instead of numbers. The order matters, so keep a numbered type, such as decimal. (A list-style shorthand with no type in it sets the type back to disc.)`);
  check(indent(steps) > 0,
    'The adoption steps lost their indent, so their numbers have no room to hang in. Is a rule taking the padding off every list, instead of off one list by its class?');
  const gap = spaced(stepItems);
  check(gap === 0,
    `Step ${gap} and step ${gap + 1} touch: neither has a margin between them. Give the steps space, for example with .adoption-steps li + li and a margin above.`);
});

test('10) the step numbers are the shelter\'s red, and bigger, with ::marker', () => {
  const rules = markerRulesFor(stepItems[0]);
  check(rules.length > 0,
    'No ::marker rule reaches the adoption steps yet. A selector such as .adoption-steps li::marker styles the number of each step, and only the number.');
  const color = rules.map((rule) => rule.style.color).filter(Boolean).pop();
  const size = rules.map((rule) => rule.style.fontSize).filter(Boolean).pop();
  check(color && color !== style(stepItems[0]).color,
    `The step numbers ${color ? `are ${color}, the same color as the step text` : 'have no color of their own yet'}. Give them the shelter's red, #e63946, in the ::marker rule.`);
  check(Boolean(size),
    'The step numbers are the same size as the step text. Give them a font-size in the ::marker rule, such as 1.25rem.');
});
