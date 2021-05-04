Releasing `url-parser`
==================

`url-parser` uses `npm` to publish and distribute new versions.

Publishing a new version
-------------------------


### 1- Update the CHANGELOG.md

The `CHANGELOG.md` is not automatically updated.
You need to manually rename the WIP section into the version you are going to release. 

### 2- Create the release

Once your Pull Request has been merged, you can pull the latest `master` on your machine
and run `npm version major|minor|patch`.

- `patch`: bugfix
- `minor`: new feature
- `major`: api breaking


Running this npm task will bump the `package.json` version and create `git` tag.

### 3- Push and publish the release

Then you can push and publish the update :

`git push --tags && git push`
`npm publish`