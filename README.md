Mortar.works website
====================

Build status
------------

Draft: https://draft.mortar.works

[![Netlify Status](https://api.netlify.com/api/v1/badges/51d84db0-16b0-426d-8c5f-af26063d6ec0/deploy-status)](https://app.netlify.com/sites/condescending-yonath-768a35/deploys)

Live: https://mortar.works

[![Netlify Status](https://api.netlify.com/api/v1/badges/61d72b5d-f446-4b03-ade3-6300308af89d/deploy-status)](https://app.netlify.com/sites/hardcore-goldstine-1848a6/deploys)


Editing
--------

First of all, we always edit in `draft`, which comes on by default, and then preview in https://draft.mortar.works. You can view the progress


Everything happens under [`src/site`](https://github.com/mortar-works/mortar-website/tree/draft/src/site/)

To change bits on the homepage:
- [Use cases on the homepage](https://github.com/mortar-works/mortar-website/blob/draft/src/site/_data/usecases.yaml)
- [Features on the homepage](https://github.com/mortar-works/mortar-website/blob/draft/src/site/_data/features.yaml)

Adding a new `insight`:
- use this file as a template [template from here](https://github.com/mortar-works/mortar-website/tree/draft/templates/insight-template.md)
- add a new file to [this directory](https://github.com/mortar-works/mortar-website/tree/draft/src/site/insights) in the format `insight-name.md`

Adding a new `use case`:
- use this file as a template [template from here](https://github.com/mortar-works/mortar-website/tree/draft/templates/use-case-template.md)
- add a new file to [this directory](https://github.com/mortar-works/mortar-website/tree/draft/src/site/use-cases) in the format `use-case-name.md`
- add the filename back on the [homepage use cases data file]((https://github.com/mortar-works/mortar-website/blob/draft/src/site/_data/usecases.yaml))
