## [0.8.3](https://github.com/event-store/event-store/compare/v0.8.2...v0.8.3) (2021-06-17)


### Bug Fixes

* **types:** createStore type to receive generic ([78a90d4](https://github.com/event-store/event-store/commit/78a90d47682fb7f93bccd15dfc6d338292814401))



## [0.8.2](https://github.com/event-store/event-store/compare/v0.8.1...v0.8.2) (2021-06-09)


### Bug Fixes

* **types:** store type defined as IStore and exported ([56580a4](https://github.com/event-store/event-store/commit/56580a4d4fa071fe2fcc50e89735e8135c05efbb))



## [0.8.1](https://github.com/event-store/event-store/compare/v0.8.0...v0.8.1) (2021-04-03)


### Bug Fixes

* **virtual event:** unsubscribe from virtual event was not working ([25ce555](https://github.com/event-store/event-store/commit/25ce555e9150bd52f7469879f7dabf77fae1ea9b))



# [0.8.0](https://github.com/event-store/event-store/compare/v0.7.2...v0.8.0) (2021-03-18)


### Features

* **store:** adding async publish support ([c012b93](https://github.com/event-store/event-store/commit/c012b93894311541e2931e0938b20af8ea459f05))



## [0.7.2](https://github.com/event-store/event-store/compare/v0.7.0...v0.7.2) (2021-03-18)


### Bug Fixes

* **store:** subscribers reassignment must be allowed ([f364a05](https://github.com/event-store/event-store/commit/f364a054478fecf9be637a62152e56483bf0e8e1))



# [0.7.0](https://github.com/event-store/event-store/compare/v0.6.1...v0.7.0) (2021-01-31)


### Bug Fixes

* **history:** collectState util to local api ([2c65ed9](https://github.com/event-store/event-store/commit/2c65ed9a14c698af2b77cddd1d1bc72c7b5acfb1))
* **types:** change virtual model method's types ([af7dbfd](https://github.com/event-store/event-store/commit/af7dbfd46772b84c6e696dbb46baa084edf71e99))
* **virtual model:** model handler is out of any parameter ([27521c6](https://github.com/event-store/event-store/commit/27521c6c82a76ee609f8b988527ca3099f91c727))


### Features

* **createstore:** adding a createStore method ([ebcbcf0](https://github.com/event-store/event-store/commit/ebcbcf0db9ac91bab5320060a81ebadd226919e0))
* **pubsub:** add ability to change the event configs in runtime ([2a48612](https://github.com/event-store/event-store/commit/2a48612542f9732b4e41a75f3037514225103a27))



## [0.6.1](https://github.com/event-store/event-store/compare/v0.6.0...v0.6.1) (2021-01-30)


### Bug Fixes

* **types:** addMiddleware type was incorrect(any[]) ([ef4aed8](https://github.com/event-store/event-store/commit/ef4aed8a08fb475445cc06e8377d0ae93ff2958c))



# [0.6.0](https://github.com/event-store/event-store/compare/v0.5.0...v0.6.0) (2021-01-30)


### Features

* **api:** create history ([edef680](https://github.com/event-store/event-store/commit/edef680eadaf05dfb5710e4f091b76a7e441b781))
* **publishmodel:** async callback handling ([c8d88ac](https://github.com/event-store/event-store/commit/c8d88ac03d264d49c72b039f9903ffff4bde4485))



# [0.5.0](https://github.com/event-store/event-store/compare/v0.4.0...v0.5.0) (2021-01-28)


### Features

* **pubsub:** add middlewares hook into publishment process ([4cb3173](https://github.com/event-store/event-store/commit/4cb317304f085e4a96044881d15d66e47f5a9b32))



# [0.4.0](https://github.com/event-store/event-store/compare/v0.3.1...v0.4.0) (2021-01-27)


### Bug Fixes

* **logger:** still one log in production. conditioned with config ([9125cc5](https://github.com/event-store/event-store/commit/9125cc5cef4b1fefe20c677ae1f35810fad41fa8))


### Features

* **testing:** add testing tool jest ([cc48382](https://github.com/event-store/event-store/commit/cc483829eae1232d9f0d9024709459edddc614af))



## [0.3.1](https://github.com/event-store/event-store/compare/v0.3.0...v0.3.1) (2021-01-27)


### Bug Fixes

* **types:** virtualModel event field type ([cf29132](https://github.com/event-store/event-store/commit/cf29132564cc8d1f2411cda920be8a898ad254ad))



# [0.3.0](https://github.com/event-store/event-store/compare/v0.2.3...v0.3.0) (2021-01-26)


### Features

* **types:** add typescript support ([8bd8f8d](https://github.com/event-store/event-store/commit/8bd8f8dd90626aca7ac87f0cb787e96c24bdd5de))
* **types:** add typescript support, build step ([e5f8f3f](https://github.com/event-store/event-store/commit/e5f8f3f56e01e25d530c7ebd8c8071edb9138a8d))



## [0.2.3](https://github.com/event-store/event-store/compare/v0.2.2...v0.2.3) (2021-01-25)


### Bug Fixes

* **virtualmodel:** info clearance wrong line ([626b66a](https://github.com/event-store/event-store/commit/626b66ac7f3fbd3992fbd4ce6fc5af3a78a0dd89))



## [0.2.2](https://github.com/event-store/event-store/compare/v0.2.1...v0.2.2) (2021-01-25)


### Bug Fixes

* **createevent:** missing attribute ([66a02d0](https://github.com/event-store/event-store/commit/66a02d08c6236ac5d049522c93c2781e4e35f603))



## [0.2.1](https://github.com/event-store/event-store/compare/v0.2.0...v0.2.1) (2021-01-25)


### Bug Fixes

* **pubsub:** createEvent was not returning the created event ([b3dfae0](https://github.com/event-store/event-store/commit/b3dfae0919033c8bac4f95285ee7a3073cc76704))



# [0.2.0](https://github.com/event-store/event-store/compare/v0.1.1...v0.2.0) (2021-01-25)


### Bug Fixes

* **pubsub:** register returns wrong type ([e0cd9c9](https://github.com/event-store/event-store/commit/e0cd9c921352efb3f3b8d7c9993fffa657143e06))


### Features

* **types:** add a typescript declaration file ([0f7ac67](https://github.com/event-store/event-store/commit/0f7ac67de266d35573aa89bffa5bb165b2d04691))



## [0.1.1](https://github.com/event-store/event-store/compare/v0.1.0...v0.1.1) (2021-01-25)


### Bug Fixes

* **actions:** fix syntax yml ([290c320](https://github.com/event-store/event-store/commit/290c320df233b8d35ebeaeaa4cff08766ff12f6f))



# [0.1.0](https://github.com/event-store/event-store/compare/v0.0.8...v0.1.0) (2021-01-25)


### Bug Fixes

* **actions:** workflow step order fixed ([d12dbe4](https://github.com/event-store/event-store/commit/d12dbe4b00e29b60aade25f5177dacf2e5de9fd6))


### Features

* **models:** add an option to fire duplicates ([7904425](https://github.com/event-store/event-store/commit/79044257b4fd7b0b5f7233179be7c4637bbc3bb2))



## [0.0.8](https://github.com/event-store/event-store/compare/v0.0.7...v0.0.8) (2021-01-25)



## [0.0.7](https://github.com/event-store/event-store/compare/v0.0.6...v0.0.7) (2021-01-25)


### Bug Fixes

* **relase action:** adding a registry to package manager ([cb553f7](https://github.com/event-store/event-store/commit/cb553f76a33604752d88eec4824637a7171ee40b))



## [0.0.6](https://github.com/event-store/event-store/compare/v0.0.5...v0.0.6) (2021-01-25)



## [0.0.5](https://github.com/event-store/event-store/compare/3fb8c551e9784e82b2c41f07d3df87ade949509b...v0.0.5) (2021-01-25)


### Bug Fixes

* **ci:** change npm to yarn ([77040af](https://github.com/event-store/event-store/commit/77040af1878dc11f115f7fd6f0bce7286d279699))
* creating new model from virtual model causes an issue with event firing. The last one registered only was executed ([3fb8c55](https://github.com/event-store/event-store/commit/3fb8c551e9784e82b2c41f07d3df87ade949509b))



