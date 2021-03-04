# SASS

## Simple Sass project with npm

Project structure:

```
css/       # where css files are produced
scss/      # where all scss files go
index.html
```

Note: `npm help <term>` is your freind.

- Step 1: Create project and install Sass:

```bash
npm init
npm install sass -D # only install sass as a dev dependency
```

- Step 2: Set up directories:

```

```

- Step 3: Edit `package.json`:

```json
{
  ...
  "scripts": {
    "sass": "node-sass -w scss -o /dist/scss/ --"
  },
  ...
}
...
```
