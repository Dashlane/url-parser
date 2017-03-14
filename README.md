`simple-url-parser` [![Build Status](https://travis-ci.org/Dashlane/url-parser.svg?branch=master)](https://travis-ci.org/Dashlane/url-parser)
===========

Lightweight module used to parse URLs,
so that information such as the domain can be easily extracted.

### Install

`npm i [--save] simple-url-parser`

### API


- `function extractFilepathFromUrl(url: string): string;`
- `function extractFullFilepathFromUrl(url: string): string;`
- `function extractFullDomain(url: string): string;`
- `function extractRootDomain(url: string): string;`
- `function extractRootDomainName(url: string): string;`
- `function getParsedUrl(url: string): ParsedUrl;`

```typescript
export interface ParsedUrl {
    url: string;
    fullDomain: string;
    rootDomain: string;
    rootDomainName: string;
}
```


### Examples


```typescript
import * as UrlUtils from './url-parser';

UrlUtils.extractFilepathFromUrl(`http://toto.com/my/toto/images/latete.jpg`); // -> /my/toto/images/latete.jpg
UrlUtils.extractFilepathFromUrl(`https://toto.com/my/toto/images/latete.jpg`); // -> /my/toto/images/latete.jpg
UrlUtils.extractFilepathFromUrl(`ftp://toto.com/my/toto/images/latete.jpg`); // -> /my/toto/images/latete.jpg
UrlUtils.extractFilepathFromUrl(`file://toto.com/my/toto/images/latete.jpg`); // -> /my/toto/images/latete.jpg
UrlUtils.extractFilepathFromUrl(`afp://toto.com/my/toto/images/latete.jpg`); // -> /my/toto/images/latete.jpg
UrlUtils.extractFilepathFromUrl(`smb://toto.com/my/toto/images/latete.jpg`); // -> /my/toto/images/latete.jpg

UrlUtils.extractFilepathFromUrl(`http://toto.com/index.html?query=string&param=1`); // -> /index.html


var url = 'https://s3-eu-west-1.toto.com/signin_prompt.html';
UrlUtils.extractRootDomain(url); // -> toto.com

var url = 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xpa1/t39.2365-6/_n.png';
UrlUtils.extractRootDomainName(url); // -> akamaihd



var url = 'https://s3-eu-west-1.amazonaws.com:9090/signin_prompt.html';
var parsedUrl = UrlUtils.getParsedUrl(url);
parsedUrl.url; // -> https://s3-eu-west-1.amazonaws.com:9090/signin_prompt.html
parsedUrl.fullDomain; // -> s3-eu-west-1.amazonaws.com
parsedUrl.rootDomain; // -> amazonaws.com
parsedUrl.rootDomainName; // -> amazonaws

```



### Maintainers

- [Damien Rajon](https://github.com/pyrho)
- [Loïc Guychard](https://github.com/lguychard)
- [Charly Poly](https://github.com/wittydeveloper)