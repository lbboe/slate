# docs.cloudant.com

[![Build Status](https://travis-ci.org/cloudant-labs/slate.png?branch=master)](https://travis-ci.org/cloudant-labs/slate)

The Cloudant documentation, built using [slate](https://github.com/tripit/slate). Check it out [here](https://docs-testb.cloudant.com/content-review/_design/couchapp/_rewrite).

For more info on how the documentation works, see the [Slate wiki][].

## Install

If you want to work on the docs locally, install [Ruby](https://www.ruby-lang.org/en/) and [bundler](http://bundler.io/), then do this:

    git clone git@github.com:cloudant-labs/slate.git
    cd slate
    bundle install
    bundle exec middleman server

Alternatively, you can use Vagrant and Virtualbox to set up a development environment. Once Vagrant and Virtualbox have been installed, run

    git clone git@github.com:cloudant-labs/slate.git
    cd slate
    sudo vagrant up

In both cases, your docs site will be reachable at <http://localhost:4567/>.

Note that the search bar will not work locally because it uses Cloudant's search handler.

## Contribute

The Cloudant documentation is updated whenever the master branch of this repository sees a new commit, thanks to Travis and CouchApp. So, to contribute changes to the docs, just make a pull request! You can find all the copy in the [intro][] or in the [includes directory][]. 

For more details on what we expect from contributions, see [CONTRIBUTING.MD](https://github.com/cloudant-labs/slate/blob/master/CONTRIBUTING.md).

Happy hacking!

## License

[MIT](http://opensource.org/licenses/MIT), yo.

[intro]: https://github.com/cloudant-labs/slate/blob/master/source/index.md
[includes directory]: https://github.com/cloudant-labs/slate/tree/master/source/includes
[Slate wiki]: https://github.com/tripit/slate/wiki
