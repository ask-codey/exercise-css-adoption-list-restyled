# Exercise: The Adoption List, Restyled

Exercise code for the lesson **Exercise: The Adoption List, Restyled** in the CSS in Depth course on [ask-codey.com](https://www.ask-codey.com).

Paws & Whiskers, a pet adoption shelter, has a "Meet the pets" page with its colors and fonts chosen, but every list on it still looks the way the browser draws a list: the menu is a bulleted column, the six pets are bullets with their names as big headings, each pet's tags are a small bulleted list inside that, and the steps to adopt are plain numbers crammed together. You'll write the rules in `styles.css` that turn the menu into a row of buttons, the pets into cards, the tags into pills, and the steps into a numbered list the shelter would be proud of, and ten checks tell you when each part is doing its job.

## Before you start

You need VS Code with the Live Server extension, a current Chrome, Edge or Firefox, and Node.js 24 or newer, set up as in the lesson *Setup: VS Code, a Browser and Node.js*.

## What's here

- `index.html`: the page: a header with the shelter's name and its menu (a list of three links), a list of six pets (each with a name, a few words about them and a list of tags), the four steps to adopt in a numbered list, and a footer. Ready to use: don't change it.
- `styles.css`: Part 1 holds the colors, fonts and spacing, ready to use. Part 2 is empty except for a comment that lists the rules to write. For you to finish.
- `page.test.js`: the ten checks. You don't need to change this file.
- `package.json`: tells npm what the checks need (`jsdom`, which reads your page and stylesheet the way a browser does). Ready to use.
- `.gitignore`: keeps the `node_modules` folder that `npm install` makes out of Git. Ready to use.

## What to do

Open this folder in VS Code, right-click `index.html` and choose **Open with Live Server**. Then write each part in Part 2 of `styles.css`, save, and look at the page:

1. **The menu becomes a row of buttons.** Take the list look off the menu's list (`.site-nav ul`): no bullets, no indent, no margins. Put its items (`.site-nav li`) side by side, and make each link (`.site-nav a`) fill its item, with padding all the way around, so the whole button can be clicked.
2. **The pets become cards.** Take the list look off the pet list (`.pet-list`). Make each pet (`.pet`) a card: padding, a white background (`#ffffff`), a border if you like (the page uses `#a8dadc` for borders) and rounded corners. Put space between one card and the next.
3. **The tags become pills.** Take the list look off every list of tags (`.tags`). Make each tag (`.tags li`) a pill: side by side with the others, with padding, a background color (try `#a8dadc`) and fully round ends, and a little room below it for when the tags wrap onto a second line.
4. **The steps keep their numbers.** The order of the adoption steps matters, so `.adoption-steps` stays a numbered list. Put space between the steps, and with `::marker` make the numbers the shelter's red, `#e63946`, and bigger than the text: `1.25rem`.

Take the list look off each list by its class, never with a rule for every `ul` or `ol`: that would take the numbers off the adoption steps too.

## Check your work

Open the terminal in VS Code (**Terminal > New Terminal**). Run this once, to install what the checks need:

```bash
npm install
```

Then run the checks whenever you like:

```bash
npm test
```

Each check prints one line: ✔ when it passes, ✖ when it doesn't yet. Before you write any rules, the first check passes (the page and its link line are already there) and the other nine fail. That's expected. Under **failing tests**, each one has a message that starts **Not yet:** and says what it found and what to look at, for example *The pet list (.pet-list) still shows its markers (list-style-type: disc).* When the last lines say `pass 10` and `fail 0`, you're done.

## The checklist the checks can't do

The checks read your rules; they don't look at the screen. So look at the page in the browser, and make the window narrow and wide again:

- The menu's three links sit in one row under the shelter's name, each one a button with room around its words, and the whole button is clickable, not only the words.
- No bullet shows anywhere except where it should: the menu, the cards and the tags have none, and their left edges line up with the page's heading.
- The pets are white cards with rounded corners, stacked down the page with a gap between each pair.
- The tags sit side by side as rounded pills. Make the window narrow: they wrap onto a new line, and the lines don't touch.
- The adoption steps still show 1 to 4, in red and a little bigger than the text, with room between the steps.

## Tips

- A list's indent is padding, not part of the bullets, so `list-style: none` alone leaves the items 40 pixels in. *Lists as Containers: Strip the Defaults, Style the Items* takes the whole look away in three lines.
- Two `display` values put boxes side by side. Only one of them lets padding push the lines around it. *Lists Side by Side, by Hand* compares them.
- A small gap between the menu buttons and between the pills, that you never wrote, is the space between the `<li>` tags in the HTML. It's expected: *Lists Side by Side, by Hand* explains it.
- `.pet + .pet` picks every card that comes right after another card, so a margin above it goes *between* the cards.
- `list-style` goes on the list, and `::marker` goes on the list item. *Styling a List That Stays a List* shows both.
- Right-click any part of the page and choose **Inspect** to see which rules the browser used. A declaration with a line through it lost to another rule, and the browser's own list rules are at the bottom, labeled *user agent stylesheet*.
- `npm test` checks the files you saved. A white dot on a file's tab in VS Code means it has changes you haven't saved yet.

## Hand it in

When it works, put your solution in a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. You don't need Git: create the repo on GitHub, choose **Add file**, then **Upload files**, and upload everything in this folder except `node_modules` (it's the files `npm install` downloaded, far too many for GitHub's upload, and `npm install` makes it again). The lesson page shows each step, and the lesson *Put Your Page Online for Free* walks through every screen.
