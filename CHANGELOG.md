## [5.0.6](https://github.com/event-storm/event-storm/compare/v5.0.5...v5.0.6) (2022-08-27)



## [5.0.5](https://github.com/event-storm/event-storm/compare/v5.0.4...v5.0.5) (2022-08-27)



## [5.0.4](https://github.com/event-storm/event-storm/compare/v5.0.3...v5.0.4) (2022-08-22)


### Bug Fixes

* **storm:** primitive values handling has issues ([7ab7cd1](https://github.com/event-storm/event-storm/commit/7ab7cd13692998c5b35a0a48dfe45eff4cc731a8))



## [5.0.3](https://github.com/event-storm/event-storm/compare/v5.0.2...v5.0.3) (2022-08-22)


### Bug Fixes

* **types:** createModel must have optional types ([45c9c25](https://github.com/event-storm/event-storm/commit/45c9c25ea84777bf166352bde2c7b1ae76af7e1e))



## [5.0.2](https://github.com/event-storm/event-storm/compare/v5.0.1...v5.0.2) (2022-08-21)



## [5.0.1](https://github.com/event-storm/event-storm/compare/v5.0.0...v5.0.1) (2022-08-21)


### Bug Fixes

* **storm:** multiple subscriptions at a time must not depend on order ([184d705](https://github.com/event-storm/event-storm/commit/184d7055a5f8a7a909de411f80ff4a9895d3f1fb))



# [5.0.0](https://github.com/event-storm/event-storm/compare/v2.0.0...v5.0.0) (2022-08-21)


### Bug Fixes

* **build:** build was failing because of third party library ([070c159](https://github.com/event-storm/event-storm/commit/070c159f180cf4c009a4ac72b9276c46bca4a406))
* **dependencies:** remove package-lock add to yarn ([99b9ce1](https://github.com/event-storm/event-storm/commit/99b9ce110ae8df989ff13520386b108747d6e874))
* **deps:** remove pakage lock file ([8e7ef42](https://github.com/event-storm/event-storm/commit/8e7ef4230604ad4d3901597829cb93e78e1f2d7d))
* **deps tree:** remove dependency section from the package json ([479d47f](https://github.com/event-storm/event-storm/commit/479d47f2b8f0492aed74f0a6fa7181df81fad259))
* **dispatch:** updater fix ([758ef07](https://github.com/event-storm/event-storm/commit/758ef071aaf53a90f1fedb7d7da708c5e0706b3b))
* **docs:** Readme syntax issue ([962a9f8](https://github.com/event-storm/event-storm/commit/962a9f8e81e1b1db5c9714f37c82cb73d4660d31))
* **env:** update node version ([d9dd9f3](https://github.com/event-storm/event-storm/commit/d9dd9f3a1af4ff7e45f198ad794c1560be0d98ef))
* **eslint:** remove jest staff from linter config ([c1eac60](https://github.com/event-storm/event-storm/commit/c1eac6015de6693e27bebcc685ee762ca9813077))
* **publishing:** fix the publish configuration ([356b534](https://github.com/event-storm/event-storm/commit/356b5342a96395709ab1e49a58acc9678b3d9d64))
* **remove middlewares:** removing middlewares on models ([d9bea99](https://github.com/event-storm/event-storm/commit/d9bea99f5aa9f02de83fff44a4378b4b20e52bd9))
* **storm:** hide the proxy object ([0923ad0](https://github.com/event-storm/event-storm/commit/0923ad096b01513158bcc0f6672d7f360efe6f5a))
* **storm:** select to fragment return value was wrong ([f4128f6](https://github.com/event-storm/event-storm/commit/f4128f6f665b128ae9e46f3d0d68931163d5787b))
* **storm:** updating reported bugs regarding the middlewares ([602a6c4](https://github.com/event-storm/event-storm/commit/602a6c40f760d1b60776d1038aadd53cfd5e02f1))
* **types:** gap between the source and the types is filled ([7c4f944](https://github.com/event-storm/event-storm/commit/7c4f944d7035fea98982550460e6ec04e5c070a1))
* **types:** update types ([879bdf2](https://github.com/event-storm/event-storm/commit/879bdf26f98eb96c9a95c85e10904f234937dea1))
* **yarn:** remove dependency ([9fed10b](https://github.com/event-storm/event-storm/commit/9fed10b78efb3cb922d68bfc9624e00f05a50089))


### Features

* **build:** adding covergae information to codecov ([1a25574](https://github.com/event-storm/event-storm/commit/1a25574f7533860ad7439059a895c134c5023e51))
* **models:** add custom equality function ([0a35375](https://github.com/event-storm/event-storm/commit/0a35375c08ee560f4ac8cb378e22ad6dda1b62e2))
* **pubsub:** adding a check for duplicated subscriber callbacks ([49a746d](https://github.com/event-storm/event-storm/commit/49a746d7a106e8660944a20437944d976c768d7a))
* **store:** changing the store creation strategy ([bf74687](https://github.com/event-storm/event-storm/commit/bf746876672c90b59a395a194f223b7c02663902))
* **storm:** add creation configs support ([f4c4111](https://github.com/event-storm/event-storm/commit/f4c411108eb583c6897502eff9f5ed5f36ec6b23))
* **storm:** adding value virtualization ([d996869](https://github.com/event-storm/event-storm/commit/d996869accf5f2ffcfd8ee5f455807692125452e))
* **storm:** change storm implementation ([4b2e04e](https://github.com/event-storm/event-storm/commit/4b2e04e9cb7dc5856fb55f0dda98609f9b02db6c))
* **storm:** fragmental selection of storm ([7f5bec8](https://github.com/event-storm/event-storm/commit/7f5bec8f0d10f8381a5120aa4e5e37163246dad9))
* **storm:** subscribe storm fragmentalu with a util ([aedb1c7](https://github.com/event-storm/event-storm/commit/aedb1c741a4f3fb3c9372b1f1e8a144745675787))
* **virtualmodel:** making virtual object more generic ([ebd3974](https://github.com/event-storm/event-storm/commit/ebd39744b982ff10e7b0c9c01ff473380ed42af1))


### Performance Improvements

* **diffs:** update the publish logic to make it mor performant ([d5fcd92](https://github.com/event-storm/event-storm/commit/d5fcd92af8d721a2b155354a8ab4f4d4837b5950))
* **utils:** change the comparison algorythm ([94563c6](https://github.com/event-storm/event-storm/commit/94563c6460402791ad937079f412cd41370ff222))


### BREAKING CHANGES

* **store:** The store is fully changed. It is based only on virtualModels without defining any
new concept. Depp update strategy is fixed.
* **virtualmodel:** createVirtualModel API is changed, pls see the docs for more details



# [2.0.0](https://github.com/event-storm/event-storm/compare/v1.4.1...v2.0.0) (2021-12-08)


### Bug Fixes

* **store:** defaultValues null|undefined were causing errors ([a362add](https://github.com/event-storm/event-storm/commit/a362add4b55790a4828548b87e2cb9597d92c54e))
* **types:** add missing types ([fea683f](https://github.com/event-storm/event-storm/commit/fea683fb6c249b5489e35359b488b11506d80e79))


### Code Refactoring

* **history:** remove history middleware ([57dee82](https://github.com/event-storm/event-storm/commit/57dee82d57647d0db6dbeb3fa316e0db72ce9256))


### Performance Improvements

* **cleanup:** code cleanup mainly about code reusability and reducing string usage ([d5694f8](https://github.com/event-storm/event-storm/commit/d5694f80ddb85c69595df831d25dcb8e1a7078ed))


### BREAKING CHANGES

* **history:** History implementation is removed(createHistory is removed from API)



## [1.4.1](https://github.com/event-storm/event-storm/compare/v1.4.0...v1.4.1) (2021-11-15)


### Bug Fixes

* **store:** update arrays ([93466ad](https://github.com/event-storm/event-storm/commit/93466adabce75c8fcd6f480afc844dddf3605d85))



# [1.4.0](https://github.com/event-storm/event-storm/compare/v1.3.0...v1.4.0) (2021-11-15)


### Bug Fixes

* **store:** updating non existing key must be allowed ([9361bbf](https://github.com/event-storm/event-storm/commit/9361bbf9ac337301353af2a9067684d12841df06))


### Features

* **logger:** ability  to configure logger manually ([cd537fb](https://github.com/event-storm/event-storm/commit/cd537fb591b6e694259d20f6cd98f151e772bdb4))



# [1.3.0](https://github.com/event-storm/event-storm/compare/v1.2.2...v1.3.0) (2021-11-15)


### Features

* **store:** nested store create ([aba42e2](https://github.com/event-storm/event-storm/commit/aba42e28554b2ad38e8b845e7fb52799e196fd95))



## [1.2.2](https://github.com/event-storm/event-storm/compare/v1.2.1...v1.2.2) (2021-11-10)


### Bug Fixes

* **types:** addMiddleware typing has syntax error ([8370e02](https://github.com/event-storm/event-storm/commit/8370e02444b09cec78ef576e2b064562ef25ed84))



## [1.2.1](https://github.com/event-storm/event-storm/compare/v1.2.0...v1.2.1) (2021-10-25)



# [1.2.0](https://github.com/event-storm/event-storm/compare/v1.1.3...v1.2.0) (2021-08-19)


### Features

* **persistancy:** adding a function to allow to persist store segment ([f56652b](https://github.com/event-storm/event-storm/commit/f56652b3b256ecb4e54386e779eabcfdfac923a6))



## [1.1.3](https://github.com/event-storm/event-storm/compare/v1.1.2...v1.1.3) (2021-08-19)


### Bug Fixes

* **pubsub:** not fire on duplicates ([4ea54a8](https://github.com/event-storm/event-storm/commit/4ea54a8c2ba80719fa53e128b72fee3b97bc304d))



## [1.1.2](https://github.com/event-storm/event-storm/compare/v1.1.1...v1.1.2) (2021-08-15)


### Bug Fixes

* **store:** non predefined value must throw an error ([a8fb483](https://github.com/event-storm/event-storm/commit/a8fb48358dacf352deb1200aa4eb9f3cb9d4d5bd))



## [1.1.1](https://github.com/event-storm/event-storm/compare/v1.1.0...v1.1.1) (2021-08-11)


### Bug Fixes

* **store:** missing defualt state fragment crashes on publish ([07d1dbc](https://github.com/event-storm/event-storm/commit/07d1dbc891a21ff89d7353d8e8a580ac9c891895))



# [1.1.0](https://github.com/event-storm/event-storm/compare/v1.0.0...v1.1.0) (2021-07-10)


### Features

* **internals:** add library internals ([baf7cb7](https://github.com/event-storm/event-storm/commit/baf7cb7dd7d63c15616cbea6c3762a39fbfd0d48))



# [1.0.0](https://github.com/event-storm/event-storm/compare/v0.9.2...v1.0.0) (2021-07-05)


### Bug Fixes

* **types:** update middleware related types ([6fa1a99](https://github.com/event-storm/event-storm/commit/6fa1a9995fce613d7713fd58c5ef83bcf3396c58))


### Features

* **middlewares:** change middlewares to become stateless ([78b8d21](https://github.com/event-storm/event-storm/commit/78b8d212fcfd33203df20811e285598082df1ecb))


### BREAKING CHANGES

* **middlewares:** The middlewares api is totally changed



## [0.9.2](https://github.com/event-storm/event-storm/compare/v0.9.1...v0.9.2) (2021-06-22)



## [0.9.1](https://github.com/event-storm/event-storm/compare/v0.9.0...v0.9.1) (2021-06-22)


### Bug Fixes

* **types:** types for store publish: functional publish is not type correct ([0a69a7d](https://github.com/event-storm/event-storm/commit/0a69a7d55d0a839deaf74f5863947e32d4b46299))



# [0.9.0](https://github.com/event-storm/event-storm/compare/v0.8.4...v0.9.0) (2021-06-21)


### Bug Fixes

* **types:** add specific type for virtual model ([7da6faf](https://github.com/event-storm/event-storm/commit/7da6faf93c1dbf2ab1449d1a31db9e64bfde1358))
* **types:** change virtual model type changes to store declaration part ([0ba896b](https://github.com/event-storm/event-storm/commit/0ba896b85abd8f5db944789e0f3c630ba4a28739))
* **types:** createStore return types ([0227e1b](https://github.com/event-storm/event-storm/commit/0227e1bfae0e91b75b8a278a9b89d650dc4e02a9))
* **types:** more specific types ([6b93ab9](https://github.com/event-storm/event-storm/commit/6b93ab97547c45d77749c0dc43f504f30985c3b8))
* **types:** more specific types ([c37539a](https://github.com/event-storm/event-storm/commit/c37539ab9f7e7df8ea45a6323cba63135f756782))
* **types:** virtual model return type is wrong ([52f7824](https://github.com/event-storm/event-storm/commit/52f78243e67352904ae5b0d51d1c09a5fbfa9e29))


### Features

* **types:** exporting all the utils from types ([510a390](https://github.com/event-storm/event-storm/commit/510a3901d3dc3753a4373080ca9bcb19e5294b57))
* **types:** exporting all the utils from types ([342af08](https://github.com/event-storm/event-storm/commit/342af08e40a95b947b5a1a6740e5e895a591d7c8))



## [0.8.4](https://github.com/event-storm/event-storm/compare/v0.8.3...v0.8.4) (2021-06-21)


### Bug Fixes

* **types:** store types fixed: invalid signature ([033f1cd](https://github.com/event-storm/event-storm/commit/033f1cd2655ad236690dcf7f8b8e262475af33c7))



## [0.8.3](https://github.com/event-storm/event-storm/compare/v0.8.2...v0.8.3) (2021-06-17)


### Bug Fixes

* **types:** createStore type to receive generic ([78a90d4](https://github.com/event-storm/event-storm/commit/78a90d47682fb7f93bccd15dfc6d338292814401))



## [0.8.2](https://github.com/event-storm/event-storm/compare/v0.8.1...v0.8.2) (2021-06-09)


### Bug Fixes

* **types:** store type defined as IStore and exported ([56580a4](https://github.com/event-storm/event-storm/commit/56580a4d4fa071fe2fcc50e89735e8135c05efbb))



## [0.8.1](https://github.com/event-storm/event-storm/compare/v0.8.0...v0.8.1) (2021-04-03)


### Bug Fixes

* **virtual event:** unsubscribe from virtual event was not working ([25ce555](https://github.com/event-storm/event-storm/commit/25ce555e9150bd52f7469879f7dabf77fae1ea9b))



# [0.8.0](https://github.com/event-storm/event-storm/compare/v0.7.2...v0.8.0) (2021-03-18)


### Features

* **store:** adding async publish support ([c012b93](https://github.com/event-storm/event-storm/commit/c012b93894311541e2931e0938b20af8ea459f05))



## [0.7.2](https://github.com/event-storm/event-storm/compare/v0.7.0...v0.7.2) (2021-03-18)


### Bug Fixes

* **store:** subscribers reassignment must be allowed ([f364a05](https://github.com/event-storm/event-storm/commit/f364a054478fecf9be637a62152e56483bf0e8e1))



# [0.7.0](https://github.com/event-storm/event-storm/compare/v0.6.1...v0.7.0) (2021-01-31)


### Bug Fixes

* **history:** collectState util to local api ([2c65ed9](https://github.com/event-storm/event-storm/commit/2c65ed9a14c698af2b77cddd1d1bc72c7b5acfb1))
* **types:** change virtual model method's types ([af7dbfd](https://github.com/event-storm/event-storm/commit/af7dbfd46772b84c6e696dbb46baa084edf71e99))
* **virtual model:** model handler is out of any parameter ([27521c6](https://github.com/event-storm/event-storm/commit/27521c6c82a76ee609f8b988527ca3099f91c727))


### Features

* **createstore:** adding a createStore method ([ebcbcf0](https://github.com/event-storm/event-storm/commit/ebcbcf0db9ac91bab5320060a81ebadd226919e0))
* **pubsub:** add ability to change the event configs in runtime ([2a48612](https://github.com/event-storm/event-storm/commit/2a48612542f9732b4e41a75f3037514225103a27))



## [0.6.1](https://github.com/event-storm/event-storm/compare/v0.6.0...v0.6.1) (2021-01-30)


### Bug Fixes

* **types:** addMiddleware type was incorrect(any[]) ([ef4aed8](https://github.com/event-storm/event-storm/commit/ef4aed8a08fb475445cc06e8377d0ae93ff2958c))



# [0.6.0](https://github.com/event-storm/event-storm/compare/v0.5.0...v0.6.0) (2021-01-30)


### Features

* **api:** create history ([edef680](https://github.com/event-storm/event-storm/commit/edef680eadaf05dfb5710e4f091b76a7e441b781))
* **publishmodel:** async callback handling ([c8d88ac](https://github.com/event-storm/event-storm/commit/c8d88ac03d264d49c72b039f9903ffff4bde4485))



# [0.5.0](https://github.com/event-storm/event-storm/compare/v0.4.0...v0.5.0) (2021-01-28)


### Features

* **pubsub:** add middlewares hook into publishment process ([4cb3173](https://github.com/event-storm/event-storm/commit/4cb317304f085e4a96044881d15d66e47f5a9b32))



# [0.4.0](https://github.com/event-storm/event-storm/compare/v0.3.1...v0.4.0) (2021-01-27)


### Bug Fixes

* **logger:** still one log in production. conditioned with config ([9125cc5](https://github.com/event-storm/event-storm/commit/9125cc5cef4b1fefe20c677ae1f35810fad41fa8))


### Features

* **testing:** add testing tool jest ([cc48382](https://github.com/event-storm/event-storm/commit/cc483829eae1232d9f0d9024709459edddc614af))



## [0.3.1](https://github.com/event-storm/event-storm/compare/v0.3.0...v0.3.1) (2021-01-27)


### Bug Fixes

* **types:** virtualModel event field type ([cf29132](https://github.com/event-storm/event-storm/commit/cf29132564cc8d1f2411cda920be8a898ad254ad))



# [0.3.0](https://github.com/event-storm/event-storm/compare/v0.2.3...v0.3.0) (2021-01-26)


### Features

* **types:** add typescript support ([8bd8f8d](https://github.com/event-storm/event-storm/commit/8bd8f8dd90626aca7ac87f0cb787e96c24bdd5de))
* **types:** add typescript support, build step ([e5f8f3f](https://github.com/event-storm/event-storm/commit/e5f8f3f56e01e25d530c7ebd8c8071edb9138a8d))



## [0.2.3](https://github.com/event-storm/event-storm/compare/v0.2.2...v0.2.3) (2021-01-25)


### Bug Fixes

* **virtualmodel:** info clearance wrong line ([626b66a](https://github.com/event-storm/event-storm/commit/626b66ac7f3fbd3992fbd4ce6fc5af3a78a0dd89))



## [0.2.2](https://github.com/event-storm/event-storm/compare/v0.2.1...v0.2.2) (2021-01-25)


### Bug Fixes

* **createevent:** missing attribute ([66a02d0](https://github.com/event-storm/event-storm/commit/66a02d08c6236ac5d049522c93c2781e4e35f603))



## [0.2.1](https://github.com/event-storm/event-storm/compare/v0.2.0...v0.2.1) (2021-01-25)


### Bug Fixes

* **pubsub:** createEvent was not returning the created event ([b3dfae0](https://github.com/event-storm/event-storm/commit/b3dfae0919033c8bac4f95285ee7a3073cc76704))



# [0.2.0](https://github.com/event-storm/event-storm/compare/v0.1.1...v0.2.0) (2021-01-25)


### Bug Fixes

* **pubsub:** register returns wrong type ([e0cd9c9](https://github.com/event-storm/event-storm/commit/e0cd9c921352efb3f3b8d7c9993fffa657143e06))


### Features

* **types:** add a typescript declaration file ([0f7ac67](https://github.com/event-storm/event-storm/commit/0f7ac67de266d35573aa89bffa5bb165b2d04691))



## [0.1.1](https://github.com/event-storm/event-storm/compare/v0.1.0...v0.1.1) (2021-01-25)


### Bug Fixes

* **actions:** fix syntax yml ([290c320](https://github.com/event-storm/event-storm/commit/290c320df233b8d35ebeaeaa4cff08766ff12f6f))



# [0.1.0](https://github.com/event-storm/event-storm/compare/v0.0.8...v0.1.0) (2021-01-25)


### Bug Fixes

* **actions:** workflow step order fixed ([d12dbe4](https://github.com/event-storm/event-storm/commit/d12dbe4b00e29b60aade25f5177dacf2e5de9fd6))


### Features

* **models:** add an option to fire duplicates ([7904425](https://github.com/event-storm/event-storm/commit/79044257b4fd7b0b5f7233179be7c4637bbc3bb2))



## [0.0.8](https://github.com/event-storm/event-storm/compare/v0.0.7...v0.0.8) (2021-01-25)



## [0.0.7](https://github.com/event-storm/event-storm/compare/v0.0.6...v0.0.7) (2021-01-25)


### Bug Fixes

* **relase action:** adding a registry to package manager ([cb553f7](https://github.com/event-storm/event-storm/commit/cb553f76a33604752d88eec4824637a7171ee40b))



## [0.0.6](https://github.com/event-storm/event-storm/compare/v0.0.5...v0.0.6) (2021-01-25)



## [0.0.5](https://github.com/event-storm/event-storm/compare/3fb8c551e9784e82b2c41f07d3df87ade949509b...v0.0.5) (2021-01-25)


### Bug Fixes

* **ci:** change npm to yarn ([77040af](https://github.com/event-storm/event-storm/commit/77040af1878dc11f115f7fd6f0bce7286d279699))
* creating new model from virtual model causes an issue with event firing. The last one registered only was executed ([3fb8c55](https://github.com/event-storm/event-storm/commit/3fb8c551e9784e82b2c41f07d3df87ade949509b))



