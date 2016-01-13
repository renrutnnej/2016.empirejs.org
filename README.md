# 2016.empirejs.org

The public website for EmpireJS 2016.

## Getting started

```
git clone git@github.com/empirejs/2016.empirejs.org
cd 2016.empirejs.org
npm i
gulp watch

#
# Do work. See changes
#
```

## Site structure

This is a single-page site built with Handlebars and Stylus. Stylus files are laid out with Responsive Design in mind and are compiled with `gulp`.

#### Handlebars

There is a single include for all of the various section components in `views/index.hbs`. This is where you can enable or disable individual UI as we roll out the conference.

```
views/
  index.hbs
  components/
    hero.hbs
    tickets.hbs
    ...etc. etc.
```

#### Stylus

All of the `*.styl` files were rolled over from EmpireJS 2015 and are housed under `styles/components`. This is where most of the work will be done:

```
styles/
  components/
    hero/
      md.styl
      sm.styl
      xl.styl
      xs.styl
```

By convention each one of the stylus files for various breakpoints start with a CSS mediaquery. Since many of the stylus files are turned off for now since this is just a splashpage, it will also be necessary to turn them back on in `gulpfile.js` as we proceed with conference rollout.
