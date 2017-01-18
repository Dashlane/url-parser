Releasing `url-parser`
==================

`url-parser` uses `npm` to publish and distribute new versions.

Publishing a new version
-------------------------


### Before merging into master

Please update `CHANGELOG.md` by write changes introduced.

### After merging into master

Once your Pull Request has been merged, you can pull the latest `master` on your machine
and run `npm version major|minor|patch`.

- `patch`: bugfix
- `minor`: new feature
- `major`: api breaking


Running this npm task will bump the `package.json` version and create `git` tag.

Then you can push and publish the update :

`git push --tags && git push`
`npm publish`