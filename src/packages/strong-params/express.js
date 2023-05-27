var Parameters = require("./parameters");

/**
 * Express middleware for strong params.
 *
 * @return {generator}
 * @api public
 */

module.exports = function() {
  return function(req, res, next) {
    /**
     * Params data.
     */

    var _params;

    /**
     * Params `getter` and `setter`.
     */

    Object.defineProperty(req, "parameters", {
      /**
       * Returns an extended data object of merged context params.
       *
       * @return {object}
       * @api public
       */

      get: function() {
        return _params.clone();
      },

      /**
       * Replaces the default params data.
       *
       * @param {object}
       * @api public
       */

      set: function(o) {
        _params = Parameters(o);
      }
    });

    /*
     * Populating params.
     *
     * NOTE: Use the `koa-qs` module to enable nested query string objects. To
     * enable body params, which are usually received over `post` or `put`
     * method, use `koa-bodyparser` middleware.
     */

    req.parameters = Object.assign({}, req.body, req.query, req.params);

    /*
     * Next middleware.
     */

    next();
  };
};
