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

`npm publish` (no need to build before publishing, it is done automatically with the `prepublish` npm script)

The `CHANGELOG.md` should be manually updated in order to replace `WIP` with the new created version

Note: if you are releasing/publishing `url-parser` for the first time, please make sure:
- to ask for temporary rights to push on master 
- to ask for adding your npm user in the Dashlane npm organization
- to activate [two-factor-authentication](https://docs.npmjs.com/configuring-two-factor-authentication) on your npm account  
- to be authenticated on npm cli using [`npm adduser` or `npm login`](https://docs.npmjs.com/cli/adduser)
