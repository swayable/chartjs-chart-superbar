# Contributing to Bar+

## Dev environment setup

Make sure you have installed the correct versions of Node.js and npm (see `engines` property of `package.json`).

We use [nvm](https://github.com/creationix/nvm) for Node version management, with the version specified in `.nvmrc`. If you have nvm installed, just run `nvm use` in the project directory (after installing the version of Node specified).

## Making changes

We use [commitizen](http://commitizen.github.io/cz-cli/) to keep commit messages consistent and well-structured.

Use `npm run commit` or `git cz` to commit changes in place of `git commit`.

All features should be introduced into `master` via pull requests that are approved by at least 1 core contributor.

## Versioning

We follow [SemVer](https://semver.org/) loosely. More important past v1.0.0, less strict for all v0.x.x releases.

If you follow the [commitizen](http://commitizen.github.io/cz-cli/) pattern, there is a utility script that will (1) create a new production build and (2) bump the version automatically.

```
$ npm run release
```

## Bugs & issues

Use [GitHub issues](https://github.com/swayable/chartjs-chart-superbar/issues) to track stories, bugs, and issues. This is where work is organized and prioritized.

## Pull requests

Some requirements for pull requests:

- Always make pull requests into the `master` branch using rebase.
- Make sure code follows the style guide (i.e. is linted).
- Use the pull request template.
- Squash commits when more concision can be achieved.

## Style guide

We use [Prettier](https://prettier.io/docs/en/install.html) for enforcing consistent code formatting and capturing certain errors.

Use `npm run lint` to lint your code manually (note that this will overwrite all `src` and `test` files using the prettier styles).
