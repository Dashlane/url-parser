CHANGELOG.md
============
3.5.0
-----
* Add support for url without extension

3.4.0
-----
* Add additional validations for a secure URL : `urlContainsProtocol`, `omitCredentialsFromUrl` and `omitQueryStringFromUrl` 
* Improve `isUrl`

3.3.0
-----
* Add `urlHash` to `ParsedUrl` interface

3.2.2
-----
* Handle null or empty url

3.2.1
-----
* Add `extractNakedDomain` utils function to strip the `www` subdomain
* Handle properly rootDomain, fulDomain and rootDomainName for `localhost`

3.1.0
-----
* Add tldts to handle our public suffix and way more

3.0.0
------
* Added `gob` to multiextensions
* Add `isUrl` utils functions to know if a given string is a URL
* Add `subDomainName` to `ParsedUrl` interface

2.0.0
------
* breaking changes to `extractFilepathFromUrl`, added new `extractFullFilepathFromUrl` method

1.1.1
------
* handle domains with IPs


1.0.2
------
* Added unit test (imported from Maverick).

1.0.1
------
* Missing shipped files.


1.0.0
------
* Initial commit.
