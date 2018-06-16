# Contributing to Bar+

## Making changes

We use [commitizen](http://commitizen.github.io/cz-cli/) to keep commit messages consistent and well-structured.

Use `npm run commit` or `git cz` to commit changes in place of `git commit`.

All features should be introduced into `master` via pull requests that are approved by at least 1 core contributor.

## Versioning

We follow [Semver](https://semver.org/) loosely. Use `npm version` to update the version # and tag key changes and releases.

More important past v1.0.0, less strict for all v0.x.x releases.

```
$ npm version major|minor|patch -m 'Release v%s'
$ git push
```

## Bugs & issues

Use [GitHub issues](https://github.com/swayable/chartjs-chart-bar-plus/issues) to track stories, bugs, and issues. This is where work is organized and prioritized.

## Pull requests

Some requirements for pull requests:

- Always make pull requests into the `master` branch using rebase.
- Make sure code follows the style guide (i.e. is linted).
- Use the pull request template.
- Squash commits when more concision can be achieved.

## Style guide

We use [Prettier](https://prettier.io/docs/en/install.html) for enforcing consistent code formatting and capturing certain errors.

Use `npm run lint` to lint your code manually (note that this will overwrite all `src` and `test` files using the prettier styles).
