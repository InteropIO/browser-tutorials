(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.browser = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest$2(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __awaiter$1(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const defaultConfig = {
        logger: "info",
        gateway: { webPlatform: {} },
        libraries: [],
        exposeAPI: true
    };
    const parseConfig = (config) => {
        var _a, _b, _c;
        const isPlatformInternal = !!((_b = (_a = config === null || config === void 0 ? void 0 : config.gateway) === null || _a === void 0 ? void 0 : _a.webPlatform) === null || _b === void 0 ? void 0 : _b.port);
        const combined = Object.assign({}, defaultConfig, config, { isPlatformInternal });
        if (combined.systemLogger) {
            combined.logger = (_c = combined.systemLogger.level) !== null && _c !== void 0 ? _c : "info";
        }
        return combined;
    };

    const checkSingleton = () => {
        const ioConnectBrowserNamespace = window.glue42core || window.iobrowser;
        if (ioConnectBrowserNamespace && ioConnectBrowserNamespace.webStarted) {
            throw new Error("IoConnect Browser has already been started for this application.");
        }
        if (!ioConnectBrowserNamespace) {
            window.iobrowser = { webStarted: true };
            return;
        }
        ioConnectBrowserNamespace.webStarted = true;
    };

    const enterprise = (config) => {
        var _a, _b, _c;
        const enterpriseConfig = {
            windows: true,
            layouts: "full",
            appManager: "full",
            channels: true,
            libraries: (_a = config === null || config === void 0 ? void 0 : config.libraries) !== null && _a !== void 0 ? _a : [],
            logger: (_c = (_b = config === null || config === void 0 ? void 0 : config.systemLogger) === null || _b === void 0 ? void 0 : _b.level) !== null && _c !== void 0 ? _c : "warn"
        };
        const injectedFactory = window.IODesktop || window.Glue;
        return injectedFactory(enterpriseConfig);
    };

    /**
     * Wraps values in an `Ok` type.
     *
     * Example: `ok(5) // => {ok: true, result: 5}`
     */
    var ok$1 = function (result) { return ({ ok: true, result: result }); };
    /**
     * Wraps errors in an `Err` type.
     *
     * Example: `err('on fire') // => {ok: false, error: 'on fire'}`
     */
    var err$1 = function (error) { return ({ ok: false, error: error }); };
    /**
     * Create a `Promise` that either resolves with the result of `Ok` or rejects
     * with the error of `Err`.
     */
    var asPromise$1 = function (r) {
        return r.ok === true ? Promise.resolve(r.result) : Promise.reject(r.error);
    };
    /**
     * Unwraps a `Result` and returns either the result of an `Ok`, or
     * `defaultValue`.
     *
     * Example:
     * ```
     * Result.withDefault(5, number().run(json))
     * ```
     *
     * It would be nice if `Decoder` had an instance method that mirrored this
     * function. Such a method would look something like this:
     * ```
     * class Decoder<A> {
     *   runWithDefault = (defaultValue: A, json: any): A =>
     *     Result.withDefault(defaultValue, this.run(json));
     * }
     *
     * number().runWithDefault(5, json)
     * ```
     * Unfortunately, the type of `defaultValue: A` on the method causes issues
     * with type inference on  the `object` decoder in some situations. While these
     * inference issues can be solved by providing the optional type argument for
     * `object`s, the extra trouble and confusion doesn't seem worth it.
     */
    var withDefault$1 = function (defaultValue, r) {
        return r.ok === true ? r.result : defaultValue;
    };
    /**
     * Return the successful result, or throw an error.
     */
    var withException$1 = function (r) {
        if (r.ok === true) {
            return r.result;
        }
        else {
            throw r.error;
        }
    };
    /**
     * Apply `f` to the result of an `Ok`, or pass the error through.
     */
    var map$1 = function (f, r) {
        return r.ok === true ? ok$1(f(r.result)) : r;
    };
    /**
     * Apply `f` to the result of two `Ok`s, or pass an error through. If both
     * `Result`s are errors then the first one is returned.
     */
    var map2$1 = function (f, ar, br) {
        return ar.ok === false ? ar :
            br.ok === false ? br :
                ok$1(f(ar.result, br.result));
    };
    /**
     * Apply `f` to the error of an `Err`, or pass the success through.
     */
    var mapError$1 = function (f, r) {
        return r.ok === true ? r : err$1(f(r.error));
    };
    /**
     * Chain together a sequence of computations that may fail, similar to a
     * `Promise`. If the first computation fails then the error will propagate
     * through. If it succeeds, then `f` will be applied to the value, returning a
     * new `Result`.
     */
    var andThen$1 = function (f, r) {
        return r.ok === true ? f(r.result) : r;
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */



    var __assign$2 = function() {
        __assign$2 = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign$2.apply(this, arguments);
    };

    function __rest$1(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function isEqual$1(a, b) {
        if (a === b) {
            return true;
        }
        if (a === null && b === null) {
            return true;
        }
        if (typeof (a) !== typeof (b)) {
            return false;
        }
        if (typeof (a) === 'object') {
            // Array
            if (Array.isArray(a)) {
                if (!Array.isArray(b)) {
                    return false;
                }
                if (a.length !== b.length) {
                    return false;
                }
                for (var i = 0; i < a.length; i++) {
                    if (!isEqual$1(a[i], b[i])) {
                        return false;
                    }
                }
                return true;
            }
            // Hash table
            var keys = Object.keys(a);
            if (keys.length !== Object.keys(b).length) {
                return false;
            }
            for (var i = 0; i < keys.length; i++) {
                if (!b.hasOwnProperty(keys[i])) {
                    return false;
                }
                if (!isEqual$1(a[keys[i]], b[keys[i]])) {
                    return false;
                }
            }
            return true;
        }
    }
    /*
     * Helpers
     */
    var isJsonArray$1 = function (json) { return Array.isArray(json); };
    var isJsonObject$1 = function (json) {
        return typeof json === 'object' && json !== null && !isJsonArray$1(json);
    };
    var typeString$1 = function (json) {
        switch (typeof json) {
            case 'string':
                return 'a string';
            case 'number':
                return 'a number';
            case 'boolean':
                return 'a boolean';
            case 'undefined':
                return 'undefined';
            case 'object':
                if (json instanceof Array) {
                    return 'an array';
                }
                else if (json === null) {
                    return 'null';
                }
                else {
                    return 'an object';
                }
            default:
                return JSON.stringify(json);
        }
    };
    var expectedGot$1 = function (expected, got) {
        return "expected " + expected + ", got " + typeString$1(got);
    };
    var printPath$1 = function (paths) {
        return paths.map(function (path) { return (typeof path === 'string' ? "." + path : "[" + path + "]"); }).join('');
    };
    var prependAt$1 = function (newAt, _a) {
        var at = _a.at, rest = __rest$1(_a, ["at"]);
        return (__assign$2({ at: newAt + (at || '') }, rest));
    };
    /**
     * Decoders transform json objects with unknown structure into known and
     * verified forms. You can create objects of type `Decoder<A>` with either the
     * primitive decoder functions, such as `boolean()` and `string()`, or by
     * applying higher-order decoders to the primitives, such as `array(boolean())`
     * or `dict(string())`.
     *
     * Each of the decoder functions are available both as a static method on
     * `Decoder` and as a function alias -- for example the string decoder is
     * defined at `Decoder.string()`, but is also aliased to `string()`. Using the
     * function aliases exported with the library is recommended.
     *
     * `Decoder` exposes a number of 'run' methods, which all decode json in the
     * same way, but communicate success and failure in different ways. The `map`
     * and `andThen` methods modify decoders without having to call a 'run' method.
     *
     * Alternatively, the main decoder `run()` method returns an object of type
     * `Result<A, DecoderError>`. This library provides a number of helper
     * functions for dealing with the `Result` type, so you can do all the same
     * things with a `Result` as with the decoder methods.
     */
    var Decoder$1 = /** @class */ (function () {
        /**
         * The Decoder class constructor is kept private to separate the internal
         * `decode` function from the external `run` function. The distinction
         * between the two functions is that `decode` returns a
         * `Partial<DecoderError>` on failure, which contains an unfinished error
         * report. When `run` is called on a decoder, the relevant series of `decode`
         * calls is made, and then on failure the resulting `Partial<DecoderError>`
         * is turned into a `DecoderError` by filling in the missing information.
         *
         * While hiding the constructor may seem restrictive, leveraging the
         * provided decoder combinators and helper functions such as
         * `andThen` and `map` should be enough to build specialized decoders as
         * needed.
         */
        function Decoder(decode) {
            var _this = this;
            this.decode = decode;
            /**
             * Run the decoder and return a `Result` with either the decoded value or a
             * `DecoderError` containing the json input, the location of the error, and
             * the error message.
             *
             * Examples:
             * ```
             * number().run(12)
             * // => {ok: true, result: 12}
             *
             * string().run(9001)
             * // =>
             * // {
             * //   ok: false,
             * //   error: {
             * //     kind: 'DecoderError',
             * //     input: 9001,
             * //     at: 'input',
             * //     message: 'expected a string, got 9001'
             * //   }
             * // }
             * ```
             */
            this.run = function (json) {
                return mapError$1(function (error) { return ({
                    kind: 'DecoderError',
                    input: json,
                    at: 'input' + (error.at || ''),
                    message: error.message || ''
                }); }, _this.decode(json));
            };
            /**
             * Run the decoder as a `Promise`.
             */
            this.runPromise = function (json) { return asPromise$1(_this.run(json)); };
            /**
             * Run the decoder and return the value on success, or throw an exception
             * with a formatted error string.
             */
            this.runWithException = function (json) { return withException$1(_this.run(json)); };
            /**
             * Construct a new decoder that applies a transformation to the decoded
             * result. If the decoder succeeds then `f` will be applied to the value. If
             * it fails the error will propagated through.
             *
             * Example:
             * ```
             * number().map(x => x * 5).run(10)
             * // => {ok: true, result: 50}
             * ```
             */
            this.map = function (f) {
                return new Decoder(function (json) { return map$1(f, _this.decode(json)); });
            };
            /**
             * Chain together a sequence of decoders. The first decoder will run, and
             * then the function will determine what decoder to run second. If the result
             * of the first decoder succeeds then `f` will be applied to the decoded
             * value. If it fails the error will propagate through.
             *
             * This is a very powerful method -- it can act as both the `map` and `where`
             * methods, can improve error messages for edge cases, and can be used to
             * make a decoder for custom types.
             *
             * Example of adding an error message:
             * ```
             * const versionDecoder = valueAt(['version'], number());
             * const infoDecoder3 = object({a: boolean()});
             *
             * const decoder = versionDecoder.andThen(version => {
             *   switch (version) {
             *     case 3:
             *       return infoDecoder3;
             *     default:
             *       return fail(`Unable to decode info, version ${version} is not supported.`);
             *   }
             * });
             *
             * decoder.run({version: 3, a: true})
             * // => {ok: true, result: {a: true}}
             *
             * decoder.run({version: 5, x: 'abc'})
             * // =>
             * // {
             * //   ok: false,
             * //   error: {... message: 'Unable to decode info, version 5 is not supported.'}
             * // }
             * ```
             *
             * Example of decoding a custom type:
             * ```
             * // nominal type for arrays with a length of at least one
             * type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };
             *
             * const nonEmptyArrayDecoder = <T>(values: Decoder<T>): Decoder<NonEmptyArray<T>> =>
             *   array(values).andThen(arr =>
             *     arr.length > 0
             *       ? succeed(createNonEmptyArray(arr))
             *       : fail(`expected a non-empty array, got an empty array`)
             *   );
             * ```
             */
            this.andThen = function (f) {
                return new Decoder(function (json) {
                    return andThen$1(function (value) { return f(value).decode(json); }, _this.decode(json));
                });
            };
            /**
             * Add constraints to a decoder _without_ changing the resulting type. The
             * `test` argument is a predicate function which returns true for valid
             * inputs. When `test` fails on an input, the decoder fails with the given
             * `errorMessage`.
             *
             * ```
             * const chars = (length: number): Decoder<string> =>
             *   string().where(
             *     (s: string) => s.length === length,
             *     `expected a string of length ${length}`
             *   );
             *
             * chars(5).run('12345')
             * // => {ok: true, result: '12345'}
             *
             * chars(2).run('HELLO')
             * // => {ok: false, error: {... message: 'expected a string of length 2'}}
             *
             * chars(12).run(true)
             * // => {ok: false, error: {... message: 'expected a string, got a boolean'}}
             * ```
             */
            this.where = function (test, errorMessage) {
                return _this.andThen(function (value) { return (test(value) ? Decoder.succeed(value) : Decoder.fail(errorMessage)); });
            };
        }
        /**
         * Decoder primitive that validates strings, and fails on all other input.
         */
        Decoder.string = function () {
            return new Decoder(function (json) {
                return typeof json === 'string'
                    ? ok$1(json)
                    : err$1({ message: expectedGot$1('a string', json) });
            });
        };
        /**
         * Decoder primitive that validates numbers, and fails on all other input.
         */
        Decoder.number = function () {
            return new Decoder(function (json) {
                return typeof json === 'number'
                    ? ok$1(json)
                    : err$1({ message: expectedGot$1('a number', json) });
            });
        };
        /**
         * Decoder primitive that validates booleans, and fails on all other input.
         */
        Decoder.boolean = function () {
            return new Decoder(function (json) {
                return typeof json === 'boolean'
                    ? ok$1(json)
                    : err$1({ message: expectedGot$1('a boolean', json) });
            });
        };
        Decoder.constant = function (value) {
            return new Decoder(function (json) {
                return isEqual$1(json, value)
                    ? ok$1(value)
                    : err$1({ message: "expected " + JSON.stringify(value) + ", got " + JSON.stringify(json) });
            });
        };
        Decoder.object = function (decoders) {
            return new Decoder(function (json) {
                if (isJsonObject$1(json) && decoders) {
                    var obj = {};
                    for (var key in decoders) {
                        if (decoders.hasOwnProperty(key)) {
                            var r = decoders[key].decode(json[key]);
                            if (r.ok === true) {
                                // tslint:disable-next-line:strict-type-predicates
                                if (r.result !== undefined) {
                                    obj[key] = r.result;
                                }
                            }
                            else if (json[key] === undefined) {
                                return err$1({ message: "the key '" + key + "' is required but was not present" });
                            }
                            else {
                                return err$1(prependAt$1("." + key, r.error));
                            }
                        }
                    }
                    return ok$1(obj);
                }
                else if (isJsonObject$1(json)) {
                    return ok$1(json);
                }
                else {
                    return err$1({ message: expectedGot$1('an object', json) });
                }
            });
        };
        Decoder.array = function (decoder) {
            return new Decoder(function (json) {
                if (isJsonArray$1(json) && decoder) {
                    var decodeValue_1 = function (v, i) {
                        return mapError$1(function (err$$1) { return prependAt$1("[" + i + "]", err$$1); }, decoder.decode(v));
                    };
                    return json.reduce(function (acc, v, i) {
                        return map2$1(function (arr, result) { return arr.concat([result]); }, acc, decodeValue_1(v, i));
                    }, ok$1([]));
                }
                else if (isJsonArray$1(json)) {
                    return ok$1(json);
                }
                else {
                    return err$1({ message: expectedGot$1('an array', json) });
                }
            });
        };
        Decoder.tuple = function (decoders) {
            return new Decoder(function (json) {
                if (isJsonArray$1(json)) {
                    if (json.length !== decoders.length) {
                        return err$1({
                            message: "expected a tuple of length " + decoders.length + ", got one of length " + json.length
                        });
                    }
                    var result = [];
                    for (var i = 0; i < decoders.length; i++) {
                        var nth = decoders[i].decode(json[i]);
                        if (nth.ok) {
                            result[i] = nth.result;
                        }
                        else {
                            return err$1(prependAt$1("[" + i + "]", nth.error));
                        }
                    }
                    return ok$1(result);
                }
                else {
                    return err$1({ message: expectedGot$1("a tuple of length " + decoders.length, json) });
                }
            });
        };
        Decoder.union = function (ad, bd) {
            var decoders = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                decoders[_i - 2] = arguments[_i];
            }
            return Decoder.oneOf.apply(Decoder, [ad, bd].concat(decoders));
        };
        Decoder.intersection = function (ad, bd) {
            var ds = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                ds[_i - 2] = arguments[_i];
            }
            return new Decoder(function (json) {
                return [ad, bd].concat(ds).reduce(function (acc, decoder) { return map2$1(Object.assign, acc, decoder.decode(json)); }, ok$1({}));
            });
        };
        /**
         * Escape hatch to bypass validation. Always succeeds and types the result as
         * `any`. Useful for defining decoders incrementally, particularly for
         * complex objects.
         *
         * Example:
         * ```
         * interface User {
         *   name: string;
         *   complexUserData: ComplexType;
         * }
         *
         * const userDecoder: Decoder<User> = object({
         *   name: string(),
         *   complexUserData: anyJson()
         * });
         * ```
         */
        Decoder.anyJson = function () { return new Decoder(function (json) { return ok$1(json); }); };
        /**
         * Decoder identity function which always succeeds and types the result as
         * `unknown`.
         */
        Decoder.unknownJson = function () {
            return new Decoder(function (json) { return ok$1(json); });
        };
        /**
         * Decoder for json objects where the keys are unknown strings, but the values
         * should all be of the same type.
         *
         * Example:
         * ```
         * dict(number()).run({chocolate: 12, vanilla: 10, mint: 37});
         * // => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
         * ```
         */
        Decoder.dict = function (decoder) {
            return new Decoder(function (json) {
                if (isJsonObject$1(json)) {
                    var obj = {};
                    for (var key in json) {
                        if (json.hasOwnProperty(key)) {
                            var r = decoder.decode(json[key]);
                            if (r.ok === true) {
                                obj[key] = r.result;
                            }
                            else {
                                return err$1(prependAt$1("." + key, r.error));
                            }
                        }
                    }
                    return ok$1(obj);
                }
                else {
                    return err$1({ message: expectedGot$1('an object', json) });
                }
            });
        };
        /**
         * Decoder for values that may be `undefined`. This is primarily helpful for
         * decoding interfaces with optional fields.
         *
         * Example:
         * ```
         * interface User {
         *   id: number;
         *   isOwner?: boolean;
         * }
         *
         * const decoder: Decoder<User> = object({
         *   id: number(),
         *   isOwner: optional(boolean())
         * });
         * ```
         */
        Decoder.optional = function (decoder) {
            return new Decoder(function (json) { return (json === undefined || json === null ? ok$1(undefined) : decoder.decode(json)); });
        };
        /**
         * Decoder that attempts to run each decoder in `decoders` and either succeeds
         * with the first successful decoder, or fails after all decoders have failed.
         *
         * Note that `oneOf` expects the decoders to all have the same return type,
         * while `union` creates a decoder for the union type of all the input
         * decoders.
         *
         * Examples:
         * ```
         * oneOf(string(), number().map(String))
         * oneOf(constant('start'), constant('stop'), succeed('unknown'))
         * ```
         */
        Decoder.oneOf = function () {
            var decoders = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                decoders[_i] = arguments[_i];
            }
            return new Decoder(function (json) {
                var errors = [];
                for (var i = 0; i < decoders.length; i++) {
                    var r = decoders[i].decode(json);
                    if (r.ok === true) {
                        return r;
                    }
                    else {
                        errors[i] = r.error;
                    }
                }
                var errorsList = errors
                    .map(function (error) { return "at error" + (error.at || '') + ": " + error.message; })
                    .join('", "');
                return err$1({
                    message: "expected a value matching one of the decoders, got the errors [\"" + errorsList + "\"]"
                });
            });
        };
        /**
         * Decoder that always succeeds with either the decoded value, or a fallback
         * default value.
         */
        Decoder.withDefault = function (defaultValue, decoder) {
            return new Decoder(function (json) {
                return ok$1(withDefault$1(defaultValue, decoder.decode(json)));
            });
        };
        /**
         * Decoder that pulls a specific field out of a json structure, instead of
         * decoding and returning the full structure. The `paths` array describes the
         * object keys and array indices to traverse, so that values can be pulled out
         * of a nested structure.
         *
         * Example:
         * ```
         * const decoder = valueAt(['a', 'b', 0], string());
         *
         * decoder.run({a: {b: ['surprise!']}})
         * // => {ok: true, result: 'surprise!'}
         *
         * decoder.run({a: {x: 'cats'}})
         * // => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
         * ```
         *
         * Note that the `decoder` is ran on the value found at the last key in the
         * path, even if the last key is not found. This allows the `optional`
         * decoder to succeed when appropriate.
         * ```
         * const optionalDecoder = valueAt(['a', 'b', 'c'], optional(string()));
         *
         * optionalDecoder.run({a: {b: {c: 'surprise!'}}})
         * // => {ok: true, result: 'surprise!'}
         *
         * optionalDecoder.run({a: {b: 'cats'}})
         * // => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}
         *
         * optionalDecoder.run({a: {b: {z: 1}}})
         * // => {ok: true, result: undefined}
         * ```
         */
        Decoder.valueAt = function (paths, decoder) {
            return new Decoder(function (json) {
                var jsonAtPath = json;
                for (var i = 0; i < paths.length; i++) {
                    if (jsonAtPath === undefined) {
                        return err$1({
                            at: printPath$1(paths.slice(0, i + 1)),
                            message: 'path does not exist'
                        });
                    }
                    else if (typeof paths[i] === 'string' && !isJsonObject$1(jsonAtPath)) {
                        return err$1({
                            at: printPath$1(paths.slice(0, i + 1)),
                            message: expectedGot$1('an object', jsonAtPath)
                        });
                    }
                    else if (typeof paths[i] === 'number' && !isJsonArray$1(jsonAtPath)) {
                        return err$1({
                            at: printPath$1(paths.slice(0, i + 1)),
                            message: expectedGot$1('an array', jsonAtPath)
                        });
                    }
                    else {
                        jsonAtPath = jsonAtPath[paths[i]];
                    }
                }
                return mapError$1(function (error) {
                    return jsonAtPath === undefined
                        ? { at: printPath$1(paths), message: 'path does not exist' }
                        : prependAt$1(printPath$1(paths), error);
                }, decoder.decode(jsonAtPath));
            });
        };
        /**
         * Decoder that ignores the input json and always succeeds with `fixedValue`.
         */
        Decoder.succeed = function (fixedValue) {
            return new Decoder(function (json) { return ok$1(fixedValue); });
        };
        /**
         * Decoder that ignores the input json and always fails with `errorMessage`.
         */
        Decoder.fail = function (errorMessage) {
            return new Decoder(function (json) { return err$1({ message: errorMessage }); });
        };
        /**
         * Decoder that allows for validating recursive data structures. Unlike with
         * functions, decoders assigned to variables can't reference themselves
         * before they are fully defined. We can avoid prematurely referencing the
         * decoder by wrapping it in a function that won't be called until use, at
         * which point the decoder has been defined.
         *
         * Example:
         * ```
         * interface Comment {
         *   msg: string;
         *   replies: Comment[];
         * }
         *
         * const decoder: Decoder<Comment> = object({
         *   msg: string(),
         *   replies: lazy(() => array(decoder))
         * });
         * ```
         */
        Decoder.lazy = function (mkDecoder) {
            return new Decoder(function (json) { return mkDecoder().decode(json); });
        };
        return Decoder;
    }());

    /* tslint:disable:variable-name */
    /** See `Decoder.string` */
    var string$1 = Decoder$1.string;
    /** See `Decoder.number` */
    var number$1 = Decoder$1.number;
    /** See `Decoder.boolean` */
    var boolean$1 = Decoder$1.boolean;
    /** See `Decoder.anyJson` */
    var anyJson$1 = Decoder$1.anyJson;
    /** See `Decoder.unknownJson` */
    Decoder$1.unknownJson;
    /** See `Decoder.constant` */
    var constant$1 = Decoder$1.constant;
    /** See `Decoder.object` */
    var object$1 = Decoder$1.object;
    /** See `Decoder.array` */
    var array$1 = Decoder$1.array;
    /** See `Decoder.tuple` */
    Decoder$1.tuple;
    /** See `Decoder.dict` */
    Decoder$1.dict;
    /** See `Decoder.optional` */
    var optional$1 = Decoder$1.optional;
    /** See `Decoder.oneOf` */
    var oneOf$1 = Decoder$1.oneOf;
    /** See `Decoder.union` */
    Decoder$1.union;
    /** See `Decoder.intersection` */
    Decoder$1.intersection;
    /** See `Decoder.withDefault` */
    Decoder$1.withDefault;
    /** See `Decoder.valueAt` */
    Decoder$1.valueAt;
    /** See `Decoder.succeed` */
    Decoder$1.succeed;
    /** See `Decoder.fail` */
    Decoder$1.fail;
    /** See `Decoder.lazy` */
    var lazy = Decoder$1.lazy;

    const connectBrowserAppProps = ["name", "title", "version", "customProperties", "icon", "caption", "type"];
    const fdc3v2AppProps = ["appId", "name", "type", "details", "version", "title", "tooltip", "lang", "description", "categories", "icons", "screenshots", "contactEmail", "moreInfo", "publisher", "customConfig", "hostManifests", "interop", "localizedVersions"];

    /**
     * Wraps values in an `Ok` type.
     *
     * Example: `ok(5) // => {ok: true, result: 5}`
     */
    var ok = function (result) { return ({ ok: true, result: result }); };
    /**
     * Wraps errors in an `Err` type.
     *
     * Example: `err('on fire') // => {ok: false, error: 'on fire'}`
     */
    var err = function (error) { return ({ ok: false, error: error }); };
    /**
     * Create a `Promise` that either resolves with the result of `Ok` or rejects
     * with the error of `Err`.
     */
    var asPromise = function (r) {
        return r.ok === true ? Promise.resolve(r.result) : Promise.reject(r.error);
    };
    /**
     * Unwraps a `Result` and returns either the result of an `Ok`, or
     * `defaultValue`.
     *
     * Example:
     * ```
     * Result.withDefault(5, number().run(json))
     * ```
     *
     * It would be nice if `Decoder` had an instance method that mirrored this
     * function. Such a method would look something like this:
     * ```
     * class Decoder<A> {
     *   runWithDefault = (defaultValue: A, json: any): A =>
     *     Result.withDefault(defaultValue, this.run(json));
     * }
     *
     * number().runWithDefault(5, json)
     * ```
     * Unfortunately, the type of `defaultValue: A` on the method causes issues
     * with type inference on  the `object` decoder in some situations. While these
     * inference issues can be solved by providing the optional type argument for
     * `object`s, the extra trouble and confusion doesn't seem worth it.
     */
    var withDefault = function (defaultValue, r) {
        return r.ok === true ? r.result : defaultValue;
    };
    /**
     * Return the successful result, or throw an error.
     */
    var withException = function (r) {
        if (r.ok === true) {
            return r.result;
        }
        else {
            throw r.error;
        }
    };
    /**
     * Apply `f` to the result of an `Ok`, or pass the error through.
     */
    var map = function (f, r) {
        return r.ok === true ? ok(f(r.result)) : r;
    };
    /**
     * Apply `f` to the result of two `Ok`s, or pass an error through. If both
     * `Result`s are errors then the first one is returned.
     */
    var map2 = function (f, ar, br) {
        return ar.ok === false ? ar :
            br.ok === false ? br :
                ok(f(ar.result, br.result));
    };
    /**
     * Apply `f` to the error of an `Err`, or pass the success through.
     */
    var mapError = function (f, r) {
        return r.ok === true ? r : err(f(r.error));
    };
    /**
     * Chain together a sequence of computations that may fail, similar to a
     * `Promise`. If the first computation fails then the error will propagate
     * through. If it succeeds, then `f` will be applied to the value, returning a
     * new `Result`.
     */
    var andThen = function (f, r) {
        return r.ok === true ? f(r.result) : r;
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */



    var __assign$1 = function() {
        __assign$1 = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function isEqual(a, b) {
        if (a === b) {
            return true;
        }
        if (a === null && b === null) {
            return true;
        }
        if (typeof (a) !== typeof (b)) {
            return false;
        }
        if (typeof (a) === 'object') {
            // Array
            if (Array.isArray(a)) {
                if (!Array.isArray(b)) {
                    return false;
                }
                if (a.length !== b.length) {
                    return false;
                }
                for (var i = 0; i < a.length; i++) {
                    if (!isEqual(a[i], b[i])) {
                        return false;
                    }
                }
                return true;
            }
            // Hash table
            var keys = Object.keys(a);
            if (keys.length !== Object.keys(b).length) {
                return false;
            }
            for (var i = 0; i < keys.length; i++) {
                if (!b.hasOwnProperty(keys[i])) {
                    return false;
                }
                if (!isEqual(a[keys[i]], b[keys[i]])) {
                    return false;
                }
            }
            return true;
        }
    }
    /*
     * Helpers
     */
    var isJsonArray = function (json) { return Array.isArray(json); };
    var isJsonObject = function (json) {
        return typeof json === 'object' && json !== null && !isJsonArray(json);
    };
    var typeString = function (json) {
        switch (typeof json) {
            case 'string':
                return 'a string';
            case 'number':
                return 'a number';
            case 'boolean':
                return 'a boolean';
            case 'undefined':
                return 'undefined';
            case 'object':
                if (json instanceof Array) {
                    return 'an array';
                }
                else if (json === null) {
                    return 'null';
                }
                else {
                    return 'an object';
                }
            default:
                return JSON.stringify(json);
        }
    };
    var expectedGot = function (expected, got) {
        return "expected " + expected + ", got " + typeString(got);
    };
    var printPath = function (paths) {
        return paths.map(function (path) { return (typeof path === 'string' ? "." + path : "[" + path + "]"); }).join('');
    };
    var prependAt = function (newAt, _a) {
        var at = _a.at, rest = __rest(_a, ["at"]);
        return (__assign$1({ at: newAt + (at || '') }, rest));
    };
    /**
     * Decoders transform json objects with unknown structure into known and
     * verified forms. You can create objects of type `Decoder<A>` with either the
     * primitive decoder functions, such as `boolean()` and `string()`, or by
     * applying higher-order decoders to the primitives, such as `array(boolean())`
     * or `dict(string())`.
     *
     * Each of the decoder functions are available both as a static method on
     * `Decoder` and as a function alias -- for example the string decoder is
     * defined at `Decoder.string()`, but is also aliased to `string()`. Using the
     * function aliases exported with the library is recommended.
     *
     * `Decoder` exposes a number of 'run' methods, which all decode json in the
     * same way, but communicate success and failure in different ways. The `map`
     * and `andThen` methods modify decoders without having to call a 'run' method.
     *
     * Alternatively, the main decoder `run()` method returns an object of type
     * `Result<A, DecoderError>`. This library provides a number of helper
     * functions for dealing with the `Result` type, so you can do all the same
     * things with a `Result` as with the decoder methods.
     */
    var Decoder = /** @class */ (function () {
        /**
         * The Decoder class constructor is kept private to separate the internal
         * `decode` function from the external `run` function. The distinction
         * between the two functions is that `decode` returns a
         * `Partial<DecoderError>` on failure, which contains an unfinished error
         * report. When `run` is called on a decoder, the relevant series of `decode`
         * calls is made, and then on failure the resulting `Partial<DecoderError>`
         * is turned into a `DecoderError` by filling in the missing information.
         *
         * While hiding the constructor may seem restrictive, leveraging the
         * provided decoder combinators and helper functions such as
         * `andThen` and `map` should be enough to build specialized decoders as
         * needed.
         */
        function Decoder(decode) {
            var _this = this;
            this.decode = decode;
            /**
             * Run the decoder and return a `Result` with either the decoded value or a
             * `DecoderError` containing the json input, the location of the error, and
             * the error message.
             *
             * Examples:
             * ```
             * number().run(12)
             * // => {ok: true, result: 12}
             *
             * string().run(9001)
             * // =>
             * // {
             * //   ok: false,
             * //   error: {
             * //     kind: 'DecoderError',
             * //     input: 9001,
             * //     at: 'input',
             * //     message: 'expected a string, got 9001'
             * //   }
             * // }
             * ```
             */
            this.run = function (json) {
                return mapError(function (error) { return ({
                    kind: 'DecoderError',
                    input: json,
                    at: 'input' + (error.at || ''),
                    message: error.message || ''
                }); }, _this.decode(json));
            };
            /**
             * Run the decoder as a `Promise`.
             */
            this.runPromise = function (json) { return asPromise(_this.run(json)); };
            /**
             * Run the decoder and return the value on success, or throw an exception
             * with a formatted error string.
             */
            this.runWithException = function (json) { return withException(_this.run(json)); };
            /**
             * Construct a new decoder that applies a transformation to the decoded
             * result. If the decoder succeeds then `f` will be applied to the value. If
             * it fails the error will propagated through.
             *
             * Example:
             * ```
             * number().map(x => x * 5).run(10)
             * // => {ok: true, result: 50}
             * ```
             */
            this.map = function (f) {
                return new Decoder(function (json) { return map(f, _this.decode(json)); });
            };
            /**
             * Chain together a sequence of decoders. The first decoder will run, and
             * then the function will determine what decoder to run second. If the result
             * of the first decoder succeeds then `f` will be applied to the decoded
             * value. If it fails the error will propagate through.
             *
             * This is a very powerful method -- it can act as both the `map` and `where`
             * methods, can improve error messages for edge cases, and can be used to
             * make a decoder for custom types.
             *
             * Example of adding an error message:
             * ```
             * const versionDecoder = valueAt(['version'], number());
             * const infoDecoder3 = object({a: boolean()});
             *
             * const decoder = versionDecoder.andThen(version => {
             *   switch (version) {
             *     case 3:
             *       return infoDecoder3;
             *     default:
             *       return fail(`Unable to decode info, version ${version} is not supported.`);
             *   }
             * });
             *
             * decoder.run({version: 3, a: true})
             * // => {ok: true, result: {a: true}}
             *
             * decoder.run({version: 5, x: 'abc'})
             * // =>
             * // {
             * //   ok: false,
             * //   error: {... message: 'Unable to decode info, version 5 is not supported.'}
             * // }
             * ```
             *
             * Example of decoding a custom type:
             * ```
             * // nominal type for arrays with a length of at least one
             * type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };
             *
             * const nonEmptyArrayDecoder = <T>(values: Decoder<T>): Decoder<NonEmptyArray<T>> =>
             *   array(values).andThen(arr =>
             *     arr.length > 0
             *       ? succeed(createNonEmptyArray(arr))
             *       : fail(`expected a non-empty array, got an empty array`)
             *   );
             * ```
             */
            this.andThen = function (f) {
                return new Decoder(function (json) {
                    return andThen(function (value) { return f(value).decode(json); }, _this.decode(json));
                });
            };
            /**
             * Add constraints to a decoder _without_ changing the resulting type. The
             * `test` argument is a predicate function which returns true for valid
             * inputs. When `test` fails on an input, the decoder fails with the given
             * `errorMessage`.
             *
             * ```
             * const chars = (length: number): Decoder<string> =>
             *   string().where(
             *     (s: string) => s.length === length,
             *     `expected a string of length ${length}`
             *   );
             *
             * chars(5).run('12345')
             * // => {ok: true, result: '12345'}
             *
             * chars(2).run('HELLO')
             * // => {ok: false, error: {... message: 'expected a string of length 2'}}
             *
             * chars(12).run(true)
             * // => {ok: false, error: {... message: 'expected a string, got a boolean'}}
             * ```
             */
            this.where = function (test, errorMessage) {
                return _this.andThen(function (value) { return (test(value) ? Decoder.succeed(value) : Decoder.fail(errorMessage)); });
            };
        }
        /**
         * Decoder primitive that validates strings, and fails on all other input.
         */
        Decoder.string = function () {
            return new Decoder(function (json) {
                return typeof json === 'string'
                    ? ok(json)
                    : err({ message: expectedGot('a string', json) });
            });
        };
        /**
         * Decoder primitive that validates numbers, and fails on all other input.
         */
        Decoder.number = function () {
            return new Decoder(function (json) {
                return typeof json === 'number'
                    ? ok(json)
                    : err({ message: expectedGot('a number', json) });
            });
        };
        /**
         * Decoder primitive that validates booleans, and fails on all other input.
         */
        Decoder.boolean = function () {
            return new Decoder(function (json) {
                return typeof json === 'boolean'
                    ? ok(json)
                    : err({ message: expectedGot('a boolean', json) });
            });
        };
        Decoder.constant = function (value) {
            return new Decoder(function (json) {
                return isEqual(json, value)
                    ? ok(value)
                    : err({ message: "expected " + JSON.stringify(value) + ", got " + JSON.stringify(json) });
            });
        };
        Decoder.object = function (decoders) {
            return new Decoder(function (json) {
                if (isJsonObject(json) && decoders) {
                    var obj = {};
                    for (var key in decoders) {
                        if (decoders.hasOwnProperty(key)) {
                            var r = decoders[key].decode(json[key]);
                            if (r.ok === true) {
                                // tslint:disable-next-line:strict-type-predicates
                                if (r.result !== undefined) {
                                    obj[key] = r.result;
                                }
                            }
                            else if (json[key] === undefined) {
                                return err({ message: "the key '" + key + "' is required but was not present" });
                            }
                            else {
                                return err(prependAt("." + key, r.error));
                            }
                        }
                    }
                    return ok(obj);
                }
                else if (isJsonObject(json)) {
                    return ok(json);
                }
                else {
                    return err({ message: expectedGot('an object', json) });
                }
            });
        };
        Decoder.array = function (decoder) {
            return new Decoder(function (json) {
                if (isJsonArray(json) && decoder) {
                    var decodeValue_1 = function (v, i) {
                        return mapError(function (err$$1) { return prependAt("[" + i + "]", err$$1); }, decoder.decode(v));
                    };
                    return json.reduce(function (acc, v, i) {
                        return map2(function (arr, result) { return arr.concat([result]); }, acc, decodeValue_1(v, i));
                    }, ok([]));
                }
                else if (isJsonArray(json)) {
                    return ok(json);
                }
                else {
                    return err({ message: expectedGot('an array', json) });
                }
            });
        };
        Decoder.tuple = function (decoders) {
            return new Decoder(function (json) {
                if (isJsonArray(json)) {
                    if (json.length !== decoders.length) {
                        return err({
                            message: "expected a tuple of length " + decoders.length + ", got one of length " + json.length
                        });
                    }
                    var result = [];
                    for (var i = 0; i < decoders.length; i++) {
                        var nth = decoders[i].decode(json[i]);
                        if (nth.ok) {
                            result[i] = nth.result;
                        }
                        else {
                            return err(prependAt("[" + i + "]", nth.error));
                        }
                    }
                    return ok(result);
                }
                else {
                    return err({ message: expectedGot("a tuple of length " + decoders.length, json) });
                }
            });
        };
        Decoder.union = function (ad, bd) {
            var decoders = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                decoders[_i - 2] = arguments[_i];
            }
            return Decoder.oneOf.apply(Decoder, [ad, bd].concat(decoders));
        };
        Decoder.intersection = function (ad, bd) {
            var ds = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                ds[_i - 2] = arguments[_i];
            }
            return new Decoder(function (json) {
                return [ad, bd].concat(ds).reduce(function (acc, decoder) { return map2(Object.assign, acc, decoder.decode(json)); }, ok({}));
            });
        };
        /**
         * Escape hatch to bypass validation. Always succeeds and types the result as
         * `any`. Useful for defining decoders incrementally, particularly for
         * complex objects.
         *
         * Example:
         * ```
         * interface User {
         *   name: string;
         *   complexUserData: ComplexType;
         * }
         *
         * const userDecoder: Decoder<User> = object({
         *   name: string(),
         *   complexUserData: anyJson()
         * });
         * ```
         */
        Decoder.anyJson = function () { return new Decoder(function (json) { return ok(json); }); };
        /**
         * Decoder identity function which always succeeds and types the result as
         * `unknown`.
         */
        Decoder.unknownJson = function () {
            return new Decoder(function (json) { return ok(json); });
        };
        /**
         * Decoder for json objects where the keys are unknown strings, but the values
         * should all be of the same type.
         *
         * Example:
         * ```
         * dict(number()).run({chocolate: 12, vanilla: 10, mint: 37});
         * // => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
         * ```
         */
        Decoder.dict = function (decoder) {
            return new Decoder(function (json) {
                if (isJsonObject(json)) {
                    var obj = {};
                    for (var key in json) {
                        if (json.hasOwnProperty(key)) {
                            var r = decoder.decode(json[key]);
                            if (r.ok === true) {
                                obj[key] = r.result;
                            }
                            else {
                                return err(prependAt("." + key, r.error));
                            }
                        }
                    }
                    return ok(obj);
                }
                else {
                    return err({ message: expectedGot('an object', json) });
                }
            });
        };
        /**
         * Decoder for values that may be `undefined`. This is primarily helpful for
         * decoding interfaces with optional fields.
         *
         * Example:
         * ```
         * interface User {
         *   id: number;
         *   isOwner?: boolean;
         * }
         *
         * const decoder: Decoder<User> = object({
         *   id: number(),
         *   isOwner: optional(boolean())
         * });
         * ```
         */
        Decoder.optional = function (decoder) {
            return new Decoder(function (json) { return (json === undefined || json === null ? ok(undefined) : decoder.decode(json)); });
        };
        /**
         * Decoder that attempts to run each decoder in `decoders` and either succeeds
         * with the first successful decoder, or fails after all decoders have failed.
         *
         * Note that `oneOf` expects the decoders to all have the same return type,
         * while `union` creates a decoder for the union type of all the input
         * decoders.
         *
         * Examples:
         * ```
         * oneOf(string(), number().map(String))
         * oneOf(constant('start'), constant('stop'), succeed('unknown'))
         * ```
         */
        Decoder.oneOf = function () {
            var decoders = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                decoders[_i] = arguments[_i];
            }
            return new Decoder(function (json) {
                var errors = [];
                for (var i = 0; i < decoders.length; i++) {
                    var r = decoders[i].decode(json);
                    if (r.ok === true) {
                        return r;
                    }
                    else {
                        errors[i] = r.error;
                    }
                }
                var errorsList = errors
                    .map(function (error) { return "at error" + (error.at || '') + ": " + error.message; })
                    .join('", "');
                return err({
                    message: "expected a value matching one of the decoders, got the errors [\"" + errorsList + "\"]"
                });
            });
        };
        /**
         * Decoder that always succeeds with either the decoded value, or a fallback
         * default value.
         */
        Decoder.withDefault = function (defaultValue, decoder) {
            return new Decoder(function (json) {
                return ok(withDefault(defaultValue, decoder.decode(json)));
            });
        };
        /**
         * Decoder that pulls a specific field out of a json structure, instead of
         * decoding and returning the full structure. The `paths` array describes the
         * object keys and array indices to traverse, so that values can be pulled out
         * of a nested structure.
         *
         * Example:
         * ```
         * const decoder = valueAt(['a', 'b', 0], string());
         *
         * decoder.run({a: {b: ['surprise!']}})
         * // => {ok: true, result: 'surprise!'}
         *
         * decoder.run({a: {x: 'cats'}})
         * // => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
         * ```
         *
         * Note that the `decoder` is ran on the value found at the last key in the
         * path, even if the last key is not found. This allows the `optional`
         * decoder to succeed when appropriate.
         * ```
         * const optionalDecoder = valueAt(['a', 'b', 'c'], optional(string()));
         *
         * optionalDecoder.run({a: {b: {c: 'surprise!'}}})
         * // => {ok: true, result: 'surprise!'}
         *
         * optionalDecoder.run({a: {b: 'cats'}})
         * // => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}
         *
         * optionalDecoder.run({a: {b: {z: 1}}})
         * // => {ok: true, result: undefined}
         * ```
         */
        Decoder.valueAt = function (paths, decoder) {
            return new Decoder(function (json) {
                var jsonAtPath = json;
                for (var i = 0; i < paths.length; i++) {
                    if (jsonAtPath === undefined) {
                        return err({
                            at: printPath(paths.slice(0, i + 1)),
                            message: 'path does not exist'
                        });
                    }
                    else if (typeof paths[i] === 'string' && !isJsonObject(jsonAtPath)) {
                        return err({
                            at: printPath(paths.slice(0, i + 1)),
                            message: expectedGot('an object', jsonAtPath)
                        });
                    }
                    else if (typeof paths[i] === 'number' && !isJsonArray(jsonAtPath)) {
                        return err({
                            at: printPath(paths.slice(0, i + 1)),
                            message: expectedGot('an array', jsonAtPath)
                        });
                    }
                    else {
                        jsonAtPath = jsonAtPath[paths[i]];
                    }
                }
                return mapError(function (error) {
                    return jsonAtPath === undefined
                        ? { at: printPath(paths), message: 'path does not exist' }
                        : prependAt(printPath(paths), error);
                }, decoder.decode(jsonAtPath));
            });
        };
        /**
         * Decoder that ignores the input json and always succeeds with `fixedValue`.
         */
        Decoder.succeed = function (fixedValue) {
            return new Decoder(function (json) { return ok(fixedValue); });
        };
        /**
         * Decoder that ignores the input json and always fails with `errorMessage`.
         */
        Decoder.fail = function (errorMessage) {
            return new Decoder(function (json) { return err({ message: errorMessage }); });
        };
        /**
         * Decoder that allows for validating recursive data structures. Unlike with
         * functions, decoders assigned to variables can't reference themselves
         * before they are fully defined. We can avoid prematurely referencing the
         * decoder by wrapping it in a function that won't be called until use, at
         * which point the decoder has been defined.
         *
         * Example:
         * ```
         * interface Comment {
         *   msg: string;
         *   replies: Comment[];
         * }
         *
         * const decoder: Decoder<Comment> = object({
         *   msg: string(),
         *   replies: lazy(() => array(decoder))
         * });
         * ```
         */
        Decoder.lazy = function (mkDecoder) {
            return new Decoder(function (json) { return mkDecoder().decode(json); });
        };
        return Decoder;
    }());

    /* tslint:disable:variable-name */
    /** See `Decoder.string` */
    var string = Decoder.string;
    /** See `Decoder.number` */
    var number = Decoder.number;
    /** See `Decoder.boolean` */
    var boolean = Decoder.boolean;
    /** See `Decoder.anyJson` */
    var anyJson = Decoder.anyJson;
    /** See `Decoder.unknownJson` */
    Decoder.unknownJson;
    /** See `Decoder.constant` */
    var constant = Decoder.constant;
    /** See `Decoder.object` */
    var object = Decoder.object;
    /** See `Decoder.array` */
    var array = Decoder.array;
    /** See `Decoder.tuple` */
    Decoder.tuple;
    /** See `Decoder.dict` */
    var dict = Decoder.dict;
    /** See `Decoder.optional` */
    var optional = Decoder.optional;
    /** See `Decoder.oneOf` */
    var oneOf = Decoder.oneOf;
    /** See `Decoder.union` */
    Decoder.union;
    /** See `Decoder.intersection` */
    Decoder.intersection;
    /** See `Decoder.withDefault` */
    Decoder.withDefault;
    /** See `Decoder.valueAt` */
    Decoder.valueAt;
    /** See `Decoder.succeed` */
    Decoder.succeed;
    /** See `Decoder.fail` */
    Decoder.fail;
    /** See `Decoder.lazy` */
    Decoder.lazy;

    const nonEmptyStringDecoder$1 = string().where((s) => s.length > 0, "Expected a non-empty string");
    const nonNegativeNumberDecoder$1 = number().where((num) => num >= 0, "Expected a non-negative number");

    const intentDefinitionDecoder$1 = object({
        name: nonEmptyStringDecoder$1,
        displayName: optional(string()),
        contexts: optional(array(string())),
        customConfig: optional(object())
    });
    const v2TypeDecoder = oneOf(constant("web"), constant("native"), constant("citrix"), constant("onlineNative"), constant("other"));
    const v2DetailsDecoder = object({
        url: nonEmptyStringDecoder$1
    });
    const v2IconDecoder = object({
        src: nonEmptyStringDecoder$1,
        size: optional(nonEmptyStringDecoder$1),
        type: optional(nonEmptyStringDecoder$1)
    });
    const v2ScreenshotDecoder = object({
        src: nonEmptyStringDecoder$1,
        size: optional(nonEmptyStringDecoder$1),
        type: optional(nonEmptyStringDecoder$1),
        label: optional(nonEmptyStringDecoder$1)
    });
    const v2ListensForIntentDecoder = object({
        contexts: array(nonEmptyStringDecoder$1),
        displayName: optional(nonEmptyStringDecoder$1),
        resultType: optional(nonEmptyStringDecoder$1),
        customConfig: optional(anyJson())
    });
    const v2IntentsDecoder = object({
        listensFor: optional(dict(v2ListensForIntentDecoder)),
        raises: optional(dict(array(nonEmptyStringDecoder$1)))
    });
    const v2UserChannelDecoder = object({
        broadcasts: optional(array(nonEmptyStringDecoder$1)),
        listensFor: optional(array(nonEmptyStringDecoder$1))
    });
    const v2AppChannelDecoder = object({
        name: nonEmptyStringDecoder$1,
        description: optional(nonEmptyStringDecoder$1),
        broadcasts: optional(array(nonEmptyStringDecoder$1)),
        listensFor: optional(array(nonEmptyStringDecoder$1))
    });
    const v2InteropDecoder = object({
        intents: optional(v2IntentsDecoder),
        userChannels: optional(v2UserChannelDecoder),
        appChannels: optional(array(v2AppChannelDecoder))
    });
    const glue42ApplicationDetailsDecoder = object({
        url: nonEmptyStringDecoder$1,
        top: optional(number()),
        left: optional(number()),
        width: optional(nonNegativeNumberDecoder$1),
        height: optional(nonNegativeNumberDecoder$1)
    });
    const glue42HostManifestsBrowserDecoder = object({
        name: optional(nonEmptyStringDecoder$1),
        type: optional(nonEmptyStringDecoder$1.where((s) => s === "window", "Expected a value of window")),
        title: optional(nonEmptyStringDecoder$1),
        version: optional(nonEmptyStringDecoder$1),
        customProperties: optional(anyJson()),
        icon: optional(string()),
        caption: optional(string()),
        details: optional(glue42ApplicationDetailsDecoder),
        intents: optional(array(intentDefinitionDecoder$1)),
        hidden: optional(boolean())
    });
    const hostManifestsBrowserDecoder = oneOf(object({
        "Glue42": oneOf(glue42HostManifestsBrowserDecoder, anyJson())
    }), anyJson());
    const v1DefinitionDecoder = object({
        name: nonEmptyStringDecoder$1,
        appId: nonEmptyStringDecoder$1,
        title: optional(nonEmptyStringDecoder$1),
        version: optional(nonEmptyStringDecoder$1),
        manifest: nonEmptyStringDecoder$1,
        manifestType: nonEmptyStringDecoder$1,
        tooltip: optional(nonEmptyStringDecoder$1),
        description: optional(nonEmptyStringDecoder$1),
        contactEmail: optional(nonEmptyStringDecoder$1),
        supportEmail: optional(nonEmptyStringDecoder$1),
        publisher: optional(nonEmptyStringDecoder$1),
        images: optional(array(object({ url: optional(nonEmptyStringDecoder$1) }))),
        icons: optional(array(object({ icon: optional(nonEmptyStringDecoder$1) }))),
        customConfig: anyJson(),
        intents: optional(array(intentDefinitionDecoder$1))
    });
    const v2LocalizedDefinitionDecoder = object({
        appId: optional(nonEmptyStringDecoder$1),
        name: optional(nonEmptyStringDecoder$1),
        details: optional(v2DetailsDecoder),
        version: optional(nonEmptyStringDecoder$1),
        title: optional(nonEmptyStringDecoder$1),
        tooltip: optional(nonEmptyStringDecoder$1),
        lang: optional(nonEmptyStringDecoder$1),
        description: optional(nonEmptyStringDecoder$1),
        categories: optional(array(nonEmptyStringDecoder$1)),
        icons: optional(array(v2IconDecoder)),
        screenshots: optional(array(v2ScreenshotDecoder)),
        contactEmail: optional(nonEmptyStringDecoder$1),
        supportEmail: optional(nonEmptyStringDecoder$1),
        moreInfo: optional(nonEmptyStringDecoder$1),
        publisher: optional(nonEmptyStringDecoder$1),
        customConfig: optional(array(anyJson())),
        hostManifests: optional(hostManifestsBrowserDecoder),
        interop: optional(v2InteropDecoder)
    });
    const v2DefinitionDecoder = object({
        appId: nonEmptyStringDecoder$1,
        name: nonEmptyStringDecoder$1,
        type: v2TypeDecoder,
        details: v2DetailsDecoder,
        version: optional(nonEmptyStringDecoder$1),
        title: optional(nonEmptyStringDecoder$1),
        tooltip: optional(nonEmptyStringDecoder$1),
        lang: optional(nonEmptyStringDecoder$1),
        description: optional(nonEmptyStringDecoder$1),
        categories: optional(array(nonEmptyStringDecoder$1)),
        icons: optional(array(v2IconDecoder)),
        screenshots: optional(array(v2ScreenshotDecoder)),
        contactEmail: optional(nonEmptyStringDecoder$1),
        supportEmail: optional(nonEmptyStringDecoder$1),
        moreInfo: optional(nonEmptyStringDecoder$1),
        publisher: optional(nonEmptyStringDecoder$1),
        customConfig: optional(array(anyJson())),
        hostManifests: optional(hostManifestsBrowserDecoder),
        interop: optional(v2InteropDecoder),
        localizedVersions: optional(dict(v2LocalizedDefinitionDecoder))
    });
    const allDefinitionsDecoder = oneOf(v1DefinitionDecoder, v2DefinitionDecoder);

    const parseDecoderErrorToStringMessage = (error) => {
        return `${error.kind} at ${error.at}: ${JSON.stringify(error.input)}. Reason - ${error.message}`;
    };

    class FDC3Service {
        constructor() {
            this.fdc3ToDesktopDefinitionType = {
                web: "window",
                native: "exe",
                citrix: "citrix",
                onlineNative: "clickonce",
                other: "window"
            };
        }
        toApi() {
            return {
                isFdc3Definition: this.isFdc3Definition.bind(this),
                parseToBrowserBaseAppData: this.parseToBrowserBaseAppData.bind(this),
                parseToDesktopAppConfig: this.parseToDesktopAppConfig.bind(this)
            };
        }
        isFdc3Definition(definition) {
            const decodeRes = allDefinitionsDecoder.run(definition);
            if (!decodeRes.ok) {
                return { isFdc3: false, reason: parseDecoderErrorToStringMessage(decodeRes.error) };
            }
            if (definition.appId && definition.details) {
                return { isFdc3: true, version: "2.0" };
            }
            if (definition.manifest) {
                return { isFdc3: true, version: "1.2" };
            }
            return { isFdc3: false, reason: "The passed definition is not FDC3" };
        }
        parseToBrowserBaseAppData(definition) {
            var _a;
            const { isFdc3, version } = this.isFdc3Definition(definition);
            if (!isFdc3) {
                throw new Error("The passed definition is not FDC3");
            }
            const decodeRes = allDefinitionsDecoder.run(definition);
            if (!decodeRes.ok) {
                throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(decodeRes.error)}`);
            }
            const userProperties = this.getUserPropertiesFromDefinition(definition, version);
            const createOptions = { url: this.getUrl(definition, version) };
            let baseApplicationData = {
                name: definition.appId,
                type: "window",
                createOptions,
                userProperties: Object.assign(Object.assign({}, userProperties), { intents: version === "1.2"
                        ? userProperties.intents
                        : this.getIntentsFromV2AppDefinition(definition), details: createOptions }),
                title: definition.title,
                version: definition.version,
                icon: this.getIconFromDefinition(definition, version),
                caption: definition.description,
                fdc3: version === "2.0" ? Object.assign(Object.assign({}, definition), { definitionVersion: "2.0" }) : undefined,
            };
            if ((_a = definition.hostManifests) === null || _a === void 0 ? void 0 : _a["Glue42"]) {
                const decodeRes = glue42HostManifestsBrowserDecoder.run(definition.hostManifests["Glue42"]);
                if (!decodeRes.ok) {
                    throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(decodeRes.error)}`);
                }
                if (!Object.keys(decodeRes.result).length) {
                    throw new Error("Invalid 'hostManifests['Glue42]' key");
                }
                baseApplicationData = this.mergeBaseAppDataWithGlueManifest(baseApplicationData, decodeRes.result);
            }
            return baseApplicationData;
        }
        parseToDesktopAppConfig(definition) {
            var _a, _b, _c;
            const { isFdc3, version } = this.isFdc3Definition(definition);
            if (!isFdc3) {
                throw new Error("The passed definition is not FDC3");
            }
            const decodeRes = allDefinitionsDecoder.run(definition);
            if (!decodeRes.ok) {
                throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(decodeRes.error)}`);
            }
            if (version === "1.2") {
                const fdc3v1Definition = definition;
                return {
                    name: fdc3v1Definition.appId,
                    type: "window",
                    details: {
                        url: this.getUrl(definition, version)
                    },
                    version: fdc3v1Definition.version,
                    title: fdc3v1Definition.title,
                    tooltip: fdc3v1Definition.tooltip,
                    caption: fdc3v1Definition.description,
                    icon: (_a = fdc3v1Definition.icons) === null || _a === void 0 ? void 0 : _a[0].icon,
                    intents: fdc3v1Definition.intents,
                    customProperties: {
                        manifestType: fdc3v1Definition.manifestType,
                        images: fdc3v1Definition.images,
                        contactEmail: fdc3v1Definition.contactEmail,
                        supportEmail: fdc3v1Definition.supportEmail,
                        publisher: fdc3v1Definition.publisher,
                        icons: fdc3v1Definition.icons,
                        customConfig: fdc3v1Definition.customConfig
                    }
                };
            }
            const fdc3v2Definition = definition;
            let desktopDefinition = {
                name: fdc3v2Definition.appId,
                type: this.fdc3ToDesktopDefinitionType[fdc3v2Definition.type],
                details: fdc3v2Definition.details,
                version: fdc3v2Definition.version,
                title: fdc3v2Definition.title,
                tooltip: fdc3v2Definition.tooltip,
                caption: fdc3v2Definition.description,
                icon: this.getIconFromDefinition(fdc3v2Definition, "2.0"),
                intents: this.getIntentsFromV2AppDefinition(fdc3v2Definition),
                fdc3: Object.assign(Object.assign({}, fdc3v2Definition), { definitionVersion: "2.0" })
            };
            if ((_b = fdc3v2Definition.hostManifests) === null || _b === void 0 ? void 0 : _b["Glue42"]) {
                if (typeof fdc3v2Definition.hostManifests["Glue42"] !== "object" || Array.isArray(fdc3v2Definition.hostManifests["Glue42"])) {
                    throw new Error("Invalid 'hostManifests['Glue42]' key");
                }
                desktopDefinition = this.mergeDesktopConfigWithGlueManifest(desktopDefinition, (_c = fdc3v2Definition.hostManifests) === null || _c === void 0 ? void 0 : _c["Glue42"]);
            }
            return desktopDefinition;
        }
        getUserPropertiesFromDefinition(definition, version) {
            if (version === "1.2") {
                return Object.fromEntries(Object.entries(definition).filter(([key]) => !connectBrowserAppProps.includes(key)));
            }
            return Object.fromEntries(Object.entries(definition).filter(([key]) => !connectBrowserAppProps.includes(key) && !fdc3v2AppProps.includes(key)));
        }
        getUrl(definition, version) {
            var _a, _b;
            let url;
            if (version === "1.2") {
                const parsedManifest = JSON.parse(definition.manifest);
                url = ((_a = parsedManifest.details) === null || _a === void 0 ? void 0 : _a.url) || parsedManifest.url;
            }
            else {
                url = (_b = definition.details) === null || _b === void 0 ? void 0 : _b.url;
            }
            if (!url || typeof url !== "string") {
                throw new Error(`Invalid FDC3 ${version} definition. Provide valid 'url' under '${version === "1.2" ? "manifest" : "details"}' key`);
            }
            return url;
        }
        getIntentsFromV2AppDefinition(definition) {
            var _a, _b;
            const fdc3Intents = (_b = (_a = definition.interop) === null || _a === void 0 ? void 0 : _a.intents) === null || _b === void 0 ? void 0 : _b.listensFor;
            if (!fdc3Intents) {
                return;
            }
            const intents = Object.entries(fdc3Intents).map((fdc3Intent) => {
                const [intentName, intentData] = fdc3Intent;
                return Object.assign({ name: intentName }, intentData);
            });
            return intents;
        }
        getIconFromDefinition(definition, version) {
            var _a, _b, _c, _d;
            if (version === "1.2") {
                return ((_b = (_a = definition.icons) === null || _a === void 0 ? void 0 : _a.find((iconDef) => iconDef.icon)) === null || _b === void 0 ? void 0 : _b.icon) || undefined;
            }
            return ((_d = (_c = definition.icons) === null || _c === void 0 ? void 0 : _c.find((iconDef) => iconDef.src)) === null || _d === void 0 ? void 0 : _d.src) || undefined;
        }
        mergeBaseAppDataWithGlueManifest(baseAppData, hostManifestDefinition) {
            let baseApplicationDefinition = baseAppData;
            if (hostManifestDefinition.details) {
                const details = Object.assign(Object.assign({}, baseAppData.createOptions), hostManifestDefinition.details);
                baseApplicationDefinition.createOptions = details;
                baseApplicationDefinition.userProperties.details = details;
            }
            if (Array.isArray(hostManifestDefinition.intents)) {
                baseApplicationDefinition.userProperties.intents = (baseApplicationDefinition.userProperties.intents || []).concat(hostManifestDefinition.intents);
            }
            baseApplicationDefinition = Object.assign(Object.assign({}, baseApplicationDefinition), hostManifestDefinition);
            delete baseApplicationDefinition.details;
            delete baseApplicationDefinition.intents;
            return baseApplicationDefinition;
        }
        mergeDesktopConfigWithGlueManifest(config, desktopDefinition) {
            const appConfig = Object.assign({}, config, desktopDefinition, { details: Object.assign(Object.assign({}, config.details), desktopDefinition.details) });
            if (Array.isArray(desktopDefinition.intents)) {
                appConfig.intents = (config.intents || []).concat(desktopDefinition.intents);
            }
            return appConfig;
        }
    }

    const decoders$1 = {
        common: {
            nonEmptyStringDecoder: nonEmptyStringDecoder$1,
            nonNegativeNumberDecoder: nonNegativeNumberDecoder$1
        },
        fdc3: {
            allDefinitionsDecoder,
            v1DefinitionDecoder,
            v2DefinitionDecoder
        }
    };

    var INTENTS_ERRORS;
    (function (INTENTS_ERRORS) {
        INTENTS_ERRORS["USER_CANCELLED"] = "User Closed Intents Resolver UI without choosing a handler";
        INTENTS_ERRORS["CALLER_NOT_DEFINED"] = "Caller Id is not defined";
        INTENTS_ERRORS["TIMEOUT_HIT"] = "Timeout hit";
        INTENTS_ERRORS["INTENT_NOT_FOUND"] = "Cannot find Intent";
        INTENTS_ERRORS["HANDLER_NOT_FOUND"] = "Cannot find Intent Handler";
        INTENTS_ERRORS["TARGET_INSTANCE_UNAVAILABLE"] = "Cannot start Target Instance";
        INTENTS_ERRORS["INTENT_DELIVERY_FAILED"] = "Target Instance did not add a listener";
        INTENTS_ERRORS["RESOLVER_UNAVAILABLE"] = "Intents Resolver UI unavailable";
        INTENTS_ERRORS["RESOLVER_TIMEOUT"] = "User did not choose a handler";
        INTENTS_ERRORS["INVALID_RESOLVER_RESPONSE"] = "Intents Resolver UI returned invalid response";
        INTENTS_ERRORS["INTENT_HANDLER_REJECTION"] = "Intent Handler function processing the raised intent threw an error or rejected the promise it returned";
    })(INTENTS_ERRORS || (INTENTS_ERRORS = {}));

    let IoC$1 = class IoC {
        constructor() {
            this._decoders = decoders$1;
            this._errors = {
                intents: INTENTS_ERRORS
            };
        }
        get fdc3() {
            if (!this._fdc3) {
                this._fdc3 = new FDC3Service().toApi();
            }
            return this._fdc3;
        }
        get decoders() {
            return this._decoders;
        }
        get errors() {
            return this._errors;
        }
    };

    const ioc = new IoC$1();
    ioc.fdc3;
    const decoders = ioc.decoders;
    ioc.errors;

    const nonEmptyStringDecoder = string$1().where((s) => s.length > 0, "Expected a non-empty string");
    const nonNegativeNumberDecoder = number$1().where((num) => num >= 0, "Expected a non-negative number");
    const optionalNonEmptyStringDecoder = optional$1(nonEmptyStringDecoder);
    const libDomainDecoder = oneOf$1(constant$1("system"), constant$1("windows"), constant$1("appManager"), constant$1("layouts"), constant$1("intents"), constant$1("notifications"), constant$1("channels"), constant$1("extension"), constant$1("themes"), constant$1("prefs"));
    const windowOperationTypesDecoder = oneOf$1(constant$1("openWindow"), constant$1("windowHello"), constant$1("windowAdded"), constant$1("windowRemoved"), constant$1("getBounds"), constant$1("getFrameBounds"), constant$1("getUrl"), constant$1("moveResize"), constant$1("focus"), constant$1("close"), constant$1("getTitle"), constant$1("setTitle"), constant$1("focusChange"), constant$1("getChannel"));
    const appManagerOperationTypesDecoder = oneOf$1(constant$1("appHello"), constant$1("appDirectoryStateChange"), constant$1("instanceStarted"), constant$1("instanceStopped"), constant$1("applicationStart"), constant$1("instanceStop"), constant$1("clear"));
    const layoutsOperationTypesDecoder = oneOf$1(constant$1("layoutAdded"), constant$1("layoutChanged"), constant$1("layoutRemoved"), constant$1("get"), constant$1("getAll"), constant$1("export"), constant$1("import"), constant$1("remove"), constant$1("clientSaveRequest"), constant$1("getGlobalPermissionState"), constant$1("checkGlobalActivated"), constant$1("requestGlobalPermission"), constant$1("getDefaultGlobal"), constant$1("setDefaultGlobal"), constant$1("clearDefaultGlobal"));
    const notificationsOperationTypesDecoder = oneOf$1(constant$1("raiseNotification"), constant$1("requestPermission"), constant$1("notificationShow"), constant$1("notificationClick"), constant$1("getPermission"), constant$1("list"), constant$1("notificationRaised"), constant$1("notificationClosed"), constant$1("click"), constant$1("clear"), constant$1("clearAll"), constant$1("configure"), constant$1("getConfiguration"), constant$1("configurationChanged"), constant$1("setState"), constant$1("clearOld"), constant$1("activeCountChange"), constant$1("stateChange"));
    const systemOperationTypesDecoder = oneOf$1(constant$1("getEnvironment"), constant$1("getBase"), constant$1("platformShutdown"));
    const windowRelativeDirectionDecoder = oneOf$1(constant$1("top"), constant$1("left"), constant$1("right"), constant$1("bottom"));
    const windowBoundsDecoder = object$1({
        top: number$1(),
        left: number$1(),
        width: nonNegativeNumberDecoder,
        height: nonNegativeNumberDecoder
    });
    const windowOpenSettingsDecoder = optional$1(object$1({
        top: optional$1(number$1()),
        left: optional$1(number$1()),
        width: optional$1(nonNegativeNumberDecoder),
        height: optional$1(nonNegativeNumberDecoder),
        context: optional$1(anyJson$1()),
        relativeTo: optional$1(nonEmptyStringDecoder),
        relativeDirection: optional$1(windowRelativeDirectionDecoder),
        windowId: optional$1(nonEmptyStringDecoder),
        layoutComponentId: optional$1(nonEmptyStringDecoder)
    }));
    const openWindowConfigDecoder = object$1({
        name: nonEmptyStringDecoder,
        url: nonEmptyStringDecoder,
        options: windowOpenSettingsDecoder
    });
    const windowHelloDecoder = object$1({
        windowId: optional$1(nonEmptyStringDecoder)
    });
    const coreWindowDataDecoder = object$1({
        windowId: nonEmptyStringDecoder,
        name: nonEmptyStringDecoder
    });
    const simpleWindowDecoder = object$1({
        windowId: nonEmptyStringDecoder
    });
    const helloSuccessDecoder = object$1({
        windows: array$1(coreWindowDataDecoder),
        isWorkspaceFrame: boolean$1()
    });
    const windowTitleConfigDecoder = object$1({
        windowId: nonEmptyStringDecoder,
        title: string$1()
    });
    const focusEventDataDecoder = object$1({
        windowId: nonEmptyStringDecoder,
        hasFocus: boolean$1()
    });
    const windowMoveResizeConfigDecoder = object$1({
        windowId: nonEmptyStringDecoder,
        top: optional$1(number$1()),
        left: optional$1(number$1()),
        width: optional$1(nonNegativeNumberDecoder),
        height: optional$1(nonNegativeNumberDecoder),
        relative: optional$1(boolean$1())
    });
    const windowBoundsResultDecoder = object$1({
        windowId: nonEmptyStringDecoder,
        bounds: object$1({
            top: number$1(),
            left: number$1(),
            width: nonNegativeNumberDecoder,
            height: nonNegativeNumberDecoder
        })
    });
    const frameWindowBoundsResultDecoder = object$1({
        bounds: object$1({
            top: number$1(),
            left: number$1(),
            width: nonNegativeNumberDecoder,
            height: nonNegativeNumberDecoder
        })
    });
    const windowUrlResultDecoder = object$1({
        windowId: nonEmptyStringDecoder,
        url: nonEmptyStringDecoder
    });
    const anyDecoder = anyJson$1();
    const boundsDecoder = object$1({
        top: optional$1(number$1()),
        left: optional$1(number$1()),
        width: optional$1(nonNegativeNumberDecoder),
        height: optional$1(nonNegativeNumberDecoder)
    });
    const instanceDataDecoder = object$1({
        id: nonEmptyStringDecoder,
        applicationName: nonEmptyStringDecoder
    });
    const applicationDetailsDecoder = object$1({
        url: nonEmptyStringDecoder,
        top: optional$1(number$1()),
        left: optional$1(number$1()),
        width: optional$1(nonNegativeNumberDecoder),
        height: optional$1(nonNegativeNumberDecoder)
    });
    const intentDefinitionDecoder = object$1({
        name: nonEmptyStringDecoder,
        displayName: optional$1(string$1()),
        contexts: optional$1(array$1(string$1())),
        customConfig: optional$1(object$1())
    });
    object$1({
        name: nonEmptyStringDecoder,
        title: optional$1(nonEmptyStringDecoder),
        version: optional$1(nonEmptyStringDecoder),
        appId: optional$1(nonEmptyStringDecoder),
        manifest: nonEmptyStringDecoder,
        manifestType: nonEmptyStringDecoder,
        tooltip: optional$1(nonEmptyStringDecoder),
        description: optional$1(nonEmptyStringDecoder),
        contactEmail: optional$1(nonEmptyStringDecoder),
        supportEmail: optional$1(nonEmptyStringDecoder),
        publisher: optional$1(nonEmptyStringDecoder),
        images: optional$1(array$1(object$1({ url: optional$1(nonEmptyStringDecoder) }))),
        icons: optional$1(array$1(object$1({ icon: optional$1(nonEmptyStringDecoder) }))),
        customConfig: anyJson$1(),
        intents: optional$1(array$1(intentDefinitionDecoder))
    });
    const applicationDefinitionDecoder = object$1({
        name: nonEmptyStringDecoder,
        type: nonEmptyStringDecoder.where((s) => s === "window", "Expected a value of window"),
        title: optional$1(nonEmptyStringDecoder),
        version: optional$1(nonEmptyStringDecoder),
        customProperties: optional$1(anyJson$1()),
        icon: optional$1(string$1()),
        caption: optional$1(string$1()),
        details: applicationDetailsDecoder,
        intents: optional$1(array$1(intentDefinitionDecoder)),
        hidden: optional$1(boolean$1()),
        fdc3: optional$1(decoders.fdc3.v2DefinitionDecoder)
    });
    const allApplicationDefinitionsDecoder = oneOf$1(applicationDefinitionDecoder, decoders.fdc3.v2DefinitionDecoder, decoders.fdc3.v1DefinitionDecoder);
    object$1({
        definitions: array$1(allApplicationDefinitionsDecoder),
        mode: oneOf$1(constant$1("replace"), constant$1("merge"))
    });
    const appRemoveConfigDecoder = object$1({
        name: nonEmptyStringDecoder
    });
    const appsExportOperationDecoder = object$1({
        definitions: array$1(applicationDefinitionDecoder)
    });
    const applicationDataDecoder = object$1({
        name: nonEmptyStringDecoder,
        type: nonEmptyStringDecoder.where((s) => s === "window", "Expected a value of window"),
        instances: array$1(instanceDataDecoder),
        userProperties: optional$1(anyJson$1()),
        title: optional$1(nonEmptyStringDecoder),
        version: optional$1(nonEmptyStringDecoder),
        icon: optional$1(nonEmptyStringDecoder),
        caption: optional$1(nonEmptyStringDecoder)
    });
    const baseApplicationDataDecoder = object$1({
        name: nonEmptyStringDecoder,
        type: nonEmptyStringDecoder.where((s) => s === "window", "Expected a value of window"),
        userProperties: anyJson$1(),
        title: optional$1(nonEmptyStringDecoder),
        version: optional$1(nonEmptyStringDecoder),
        icon: optional$1(nonEmptyStringDecoder),
        caption: optional$1(nonEmptyStringDecoder)
    });
    const appDirectoryStateChangeDecoder = object$1({
        appsAdded: array$1(baseApplicationDataDecoder),
        appsChanged: array$1(baseApplicationDataDecoder),
        appsRemoved: array$1(baseApplicationDataDecoder)
    });
    const appHelloSuccessDecoder = object$1({
        apps: array$1(applicationDataDecoder),
        initialChannelId: optional$1(nonEmptyStringDecoder)
    });
    const basicInstanceDataDecoder = object$1({
        id: nonEmptyStringDecoder
    });
    const applicationStartConfigDecoder = object$1({
        name: nonEmptyStringDecoder,
        waitForAGMReady: boolean$1(),
        id: optional$1(nonEmptyStringDecoder),
        context: optional$1(anyJson$1()),
        top: optional$1(number$1()),
        left: optional$1(number$1()),
        width: optional$1(nonNegativeNumberDecoder),
        height: optional$1(nonNegativeNumberDecoder),
        relativeTo: optional$1(nonEmptyStringDecoder),
        relativeDirection: optional$1(windowRelativeDirectionDecoder),
        forceChromeTab: optional$1(boolean$1()),
        layoutComponentId: optional$1(nonEmptyStringDecoder),
        channelId: optional$1(nonEmptyStringDecoder)
    });
    const layoutTypeDecoder = oneOf$1(constant$1("Global"), constant$1("Activity"), constant$1("ApplicationDefault"), constant$1("Swimlane"), constant$1("Workspace"));
    const componentTypeDecoder = oneOf$1(constant$1("application"), constant$1("activity"));
    const windowComponentStateDecoder = object$1({
        context: optional$1(anyJson$1()),
        bounds: windowBoundsDecoder,
        createArgs: object$1({
            name: optional$1(nonEmptyStringDecoder),
            url: optional$1(nonEmptyStringDecoder),
            context: optional$1(anyJson$1())
        }),
        windowState: optional$1(nonEmptyStringDecoder),
        restoreState: optional$1(nonEmptyStringDecoder),
        instanceId: nonEmptyStringDecoder,
        isCollapsed: optional$1(boolean$1()),
        isSticky: optional$1(boolean$1()),
        restoreSettings: object$1({
            groupId: optional$1(nonEmptyStringDecoder),
            groupZOrder: optional$1(number$1())
        })
    });
    const windowLayoutComponentDecoder = object$1({
        type: constant$1("window"),
        componentType: optional$1(componentTypeDecoder),
        application: nonEmptyStringDecoder,
        state: windowComponentStateDecoder
    });
    const windowLayoutItemDecoder = object$1({
        type: constant$1("window"),
        config: object$1({
            appName: nonEmptyStringDecoder,
            url: optional$1(nonEmptyStringDecoder),
            title: optional$1(string$1()),
            allowExtract: optional$1(boolean$1()),
            allowReorder: optional$1(boolean$1()),
            showCloseButton: optional$1(boolean$1()),
            isMaximized: optional$1(boolean$1())
        })
    });
    const groupLayoutItemDecoder = object$1({
        type: constant$1("group"),
        config: anyJson$1(),
        children: array$1(oneOf$1(windowLayoutItemDecoder))
    });
    const columnLayoutItemDecoder = object$1({
        type: constant$1("column"),
        config: anyJson$1(),
        children: array$1(oneOf$1(groupLayoutItemDecoder, windowLayoutItemDecoder, lazy(() => columnLayoutItemDecoder), lazy(() => rowLayoutItemDecoder)))
    });
    const rowLayoutItemDecoder = object$1({
        type: constant$1("row"),
        config: anyJson$1(),
        children: array$1(oneOf$1(columnLayoutItemDecoder, groupLayoutItemDecoder, windowLayoutItemDecoder, lazy(() => rowLayoutItemDecoder)))
    });
    const workspaceLayoutComponentStateDecoder = object$1({
        config: anyJson$1(),
        context: anyJson$1(),
        children: array$1(oneOf$1(rowLayoutItemDecoder, columnLayoutItemDecoder, groupLayoutItemDecoder, windowLayoutItemDecoder))
    });
    const workspaceLayoutComponentDecoder = object$1({
        type: constant$1("Workspace"),
        application: optional$1(nonEmptyStringDecoder),
        state: workspaceLayoutComponentStateDecoder
    });
    const workspaceFrameComponentStateDecoder = object$1({
        bounds: windowBoundsDecoder,
        instanceId: nonEmptyStringDecoder,
        selectedWorkspace: nonNegativeNumberDecoder,
        workspaces: array$1(workspaceLayoutComponentStateDecoder),
        windowState: optional$1(nonEmptyStringDecoder),
        restoreState: optional$1(nonEmptyStringDecoder),
        context: optional$1(anyJson$1())
    });
    const workspaceFrameComponentDecoder = object$1({
        type: constant$1("workspaceFrame"),
        application: nonEmptyStringDecoder,
        componentType: optional$1(componentTypeDecoder),
        state: workspaceFrameComponentStateDecoder
    });
    const glueLayoutDecoder = object$1({
        name: nonEmptyStringDecoder,
        type: layoutTypeDecoder,
        components: array$1(oneOf$1(windowLayoutComponentDecoder, workspaceLayoutComponentDecoder, workspaceFrameComponentDecoder)),
        context: optional$1(anyJson$1()),
        metadata: optional$1(anyJson$1()),
        version: optional$1(number$1())
    });
    const newLayoutOptionsDecoder = object$1({
        name: nonEmptyStringDecoder,
        context: optional$1(anyJson$1()),
        metadata: optional$1(anyJson$1()),
        instances: optional$1(array$1(nonEmptyStringDecoder)),
        ignoreInstances: optional$1(array$1(nonEmptyStringDecoder))
    });
    const restoreOptionsDecoder = object$1({
        name: nonEmptyStringDecoder,
        context: optional$1(anyJson$1()),
        closeRunningInstance: optional$1(boolean$1()),
        closeMe: optional$1(boolean$1()),
        timeout: optional$1(nonNegativeNumberDecoder)
    });
    const layoutSummaryDecoder = object$1({
        name: nonEmptyStringDecoder,
        type: layoutTypeDecoder,
        context: optional$1(anyJson$1()),
        metadata: optional$1(anyJson$1())
    });
    const simpleLayoutConfigDecoder = object$1({
        name: nonEmptyStringDecoder,
        type: layoutTypeDecoder
    });
    const saveLayoutConfigDecoder = object$1({
        layout: newLayoutOptionsDecoder
    });
    const restoreLayoutConfigDecoder = object$1({
        layout: restoreOptionsDecoder
    });
    const getAllLayoutsConfigDecoder = object$1({
        type: layoutTypeDecoder
    });
    const allLayoutsFullConfigDecoder = object$1({
        layouts: array$1(glueLayoutDecoder)
    });
    const importModeDecoder = oneOf$1(constant$1("replace"), constant$1("merge"));
    const layoutsImportConfigDecoder = object$1({
        layouts: array$1(glueLayoutDecoder),
        mode: importModeDecoder,
        isManagerOperation: optional$1(boolean$1())
    });
    const allLayoutsSummariesResultDecoder = object$1({
        summaries: array$1(layoutSummaryDecoder)
    });
    const simpleLayoutResultDecoder = object$1({
        layout: glueLayoutDecoder
    });
    const optionalSimpleLayoutResult = object$1({
        layout: optional$1(glueLayoutDecoder)
    });
    const setDefaultGlobalConfigDecoder = object$1({
        name: nonEmptyStringDecoder
    });
    const intentsOperationTypesDecoder = oneOf$1(constant$1("findIntent"), constant$1("getIntents"), constant$1("raiseIntent"), constant$1("raise"), constant$1("filterHandlers"));
    const intentHandlerDecoder = object$1({
        applicationName: nonEmptyStringDecoder,
        applicationTitle: optional$1(string$1()),
        applicationDescription: optional$1(string$1()),
        applicationIcon: optional$1(string$1()),
        type: oneOf$1(constant$1("app"), constant$1("instance")),
        displayName: optional$1(string$1()),
        contextTypes: optional$1(array$1(nonEmptyStringDecoder)),
        instanceId: optional$1(string$1()),
        instanceTitle: optional$1(string$1()),
        resultType: optional$1(string$1())
    });
    object$1({
        applicationName: string$1(),
        applicationIcon: optional$1(string$1()),
        instanceId: optional$1(string$1()),
    });
    const intentResolverResponseDecoder = object$1({
        intent: nonEmptyStringDecoder,
        handler: intentHandlerDecoder
    });
    const intentDecoder = object$1({
        name: nonEmptyStringDecoder,
        handlers: array$1(intentHandlerDecoder)
    });
    const intentTargetDecoder = oneOf$1(constant$1("startNew"), constant$1("reuse"), object$1({
        app: optional$1(nonEmptyStringDecoder),
        instance: optional$1(nonEmptyStringDecoder)
    }));
    const intentContextDecoder = object$1({
        type: optional$1(nonEmptyStringDecoder),
        data: optional$1(anyJson$1())
    });
    const intentsDecoder = array$1(intentDecoder);
    const wrappedIntentsDecoder = object$1({
        intents: intentsDecoder
    });
    const intentFilterDecoder = object$1({
        name: optional$1(nonEmptyStringDecoder),
        contextType: optional$1(nonEmptyStringDecoder),
        resultType: optional$1(nonEmptyStringDecoder)
    });
    const findFilterDecoder = oneOf$1(nonEmptyStringDecoder, intentFilterDecoder);
    const wrappedIntentFilterDecoder = object$1({
        filter: optional$1(intentFilterDecoder)
    });
    const intentRequestDecoder = object$1({
        intent: nonEmptyStringDecoder,
        target: optional$1(intentTargetDecoder),
        context: optional$1(intentContextDecoder),
        options: optional$1(windowOpenSettingsDecoder),
        handlers: optional$1(array$1(intentHandlerDecoder)),
        timeout: optional$1(nonNegativeNumberDecoder),
        waitUserResponseIndefinitely: optional$1(boolean$1())
    });
    const raiseRequestDecoder = oneOf$1(nonEmptyStringDecoder, intentRequestDecoder);
    const resolverConfigDecoder = object$1({
        enabled: boolean$1(),
        appName: nonEmptyStringDecoder,
        waitResponseTimeout: number$1()
    });
    const raiseIntentRequestDecoder = object$1({
        intentRequest: intentRequestDecoder,
        resolverConfig: resolverConfigDecoder
    });
    const intentResultDecoder = object$1({
        request: intentRequestDecoder,
        handler: intentHandlerDecoder,
        result: anyJson$1()
    });
    const handlersFilterDecoder = object$1({
        title: optional$1(nonEmptyStringDecoder),
        openResolver: optional$1(boolean$1()),
        timeout: optional$1(nonNegativeNumberDecoder),
        intent: optional$1(nonEmptyStringDecoder),
        contextTypes: optional$1(array$1(nonEmptyStringDecoder)),
        resultType: optional$1(nonEmptyStringDecoder),
        applicationNames: optional$1(array$1(nonEmptyStringDecoder))
    });
    const filterHandlersResultDecoder = object$1({
        handlers: array$1(intentHandlerDecoder)
    });
    const filterHandlersWithResolverConfigDecoder = object$1({
        filterHandlersRequest: handlersFilterDecoder,
        resolverConfig: resolverConfigDecoder
    });
    const AddIntentListenerRequestDecoder = object$1({
        intent: nonEmptyStringDecoder,
        contextTypes: optional$1(array$1(nonEmptyStringDecoder)),
        displayName: optional$1(string$1()),
        icon: optional$1(string$1()),
        description: optional$1(string$1()),
        resultType: optional$1(string$1())
    });
    const AddIntentListenerDecoder = oneOf$1(nonEmptyStringDecoder, AddIntentListenerRequestDecoder);
    const intentInfoDecoder = object$1({
        intent: nonEmptyStringDecoder,
        contextTypes: optional$1(array$1(nonEmptyStringDecoder)),
        description: optional$1(nonEmptyStringDecoder),
        displayName: optional$1(nonEmptyStringDecoder),
        icon: optional$1(nonEmptyStringDecoder),
        resultType: optional$1(nonEmptyStringDecoder)
    });
    const getIntentsResultDecoder = object$1({
        intents: array$1(intentInfoDecoder)
    });
    const channelNameDecoder = (channelNames) => {
        return nonEmptyStringDecoder.where(s => channelNames.includes(s), "Expected a valid channel name");
    };
    const interopActionSettingsDecoder = object$1({
        method: nonEmptyStringDecoder,
        arguments: optional$1(anyJson$1()),
        target: optional$1(oneOf$1(constant$1("all"), constant$1("best")))
    });
    const glue42NotificationActionDecoder = object$1({
        action: string$1(),
        title: nonEmptyStringDecoder,
        icon: optional$1(string$1()),
        interop: optional$1(interopActionSettingsDecoder)
    });
    const notificationStateDecoder = oneOf$1(constant$1("Active"), constant$1("Acknowledged"), constant$1("Seen"), constant$1("Closed"), constant$1("Stale"), constant$1("Snoozed"), constant$1("Processing"));
    const activeNotificationsCountChangeDecoder = object$1({
        count: number$1()
    });
    const notificationDefinitionDecoder = object$1({
        badge: optional$1(string$1()),
        body: optional$1(string$1()),
        data: optional$1(anyJson$1()),
        dir: optional$1(oneOf$1(constant$1("auto"), constant$1("ltr"), constant$1("rtl"))),
        icon: optional$1(string$1()),
        image: optional$1(string$1()),
        lang: optional$1(string$1()),
        renotify: optional$1(boolean$1()),
        requireInteraction: optional$1(boolean$1()),
        silent: optional$1(boolean$1()),
        tag: optional$1(string$1()),
        timestamp: optional$1(nonNegativeNumberDecoder),
        vibrate: optional$1(array$1(number$1()))
    });
    const glue42NotificationOptionsDecoder = object$1({
        title: nonEmptyStringDecoder,
        clickInterop: optional$1(interopActionSettingsDecoder),
        actions: optional$1(array$1(glue42NotificationActionDecoder)),
        focusPlatformOnDefaultClick: optional$1(boolean$1()),
        badge: optional$1(string$1()),
        body: optional$1(string$1()),
        data: optional$1(anyJson$1()),
        dir: optional$1(oneOf$1(constant$1("auto"), constant$1("ltr"), constant$1("rtl"))),
        icon: optional$1(string$1()),
        image: optional$1(string$1()),
        lang: optional$1(string$1()),
        renotify: optional$1(boolean$1()),
        requireInteraction: optional$1(boolean$1()),
        silent: optional$1(boolean$1()),
        tag: optional$1(string$1()),
        timestamp: optional$1(nonNegativeNumberDecoder),
        vibrate: optional$1(array$1(number$1())),
        severity: optional$1(oneOf$1(constant$1("Low"), constant$1("None"), constant$1("Medium"), constant$1("High"), constant$1("Critical"))),
        showToast: optional$1(boolean$1()),
        showInPanel: optional$1(boolean$1()),
        state: optional$1(notificationStateDecoder)
    });
    const notificationSetStateRequestDecoder = object$1({
        id: nonEmptyStringDecoder,
        state: notificationStateDecoder
    });
    const channelContextDecoder = object$1({
        name: nonEmptyStringDecoder,
        meta: object$1({
            color: nonEmptyStringDecoder
        }),
        data: optional$1(object$1()),
    });
    const raiseNotificationDecoder = object$1({
        settings: glue42NotificationOptionsDecoder,
        id: nonEmptyStringDecoder
    });
    const raiseNotificationResultDecoder = object$1({
        settings: glue42NotificationOptionsDecoder
    });
    const permissionRequestResultDecoder = object$1({
        permissionGranted: boolean$1()
    });
    const permissionQueryResultDecoder = object$1({
        permission: oneOf$1(constant$1("default"), constant$1("granted"), constant$1("denied"))
    });
    const notificationEventPayloadDecoder = object$1({
        definition: notificationDefinitionDecoder,
        action: optional$1(string$1()),
        id: optional$1(nonEmptyStringDecoder)
    });
    const notificationFilterDecoder = object$1({
        allowed: optional$1(array$1(nonEmptyStringDecoder)),
        blocked: optional$1(array$1(nonEmptyStringDecoder))
    });
    const notificationsConfigurationDecoder = object$1({
        enable: optional$1(boolean$1()),
        enableToasts: optional$1(boolean$1()),
        sourceFilter: optional$1(notificationFilterDecoder),
    });
    const notificationsConfigurationProtocolDecoder = object$1({
        configuration: notificationsConfigurationDecoder
    });
    const strictNotificationsConfigurationProtocolDecoder = object$1({
        configuration: object$1({
            enable: boolean$1(),
            enableToasts: boolean$1(),
            sourceFilter: object$1({
                allowed: array$1(nonEmptyStringDecoder),
                blocked: array$1(nonEmptyStringDecoder)
            })
        })
    });
    const platformSaveRequestConfigDecoder = object$1({
        layoutType: oneOf$1(constant$1("Global"), constant$1("Workspace")),
        layoutName: nonEmptyStringDecoder,
        context: optional$1(anyJson$1())
    });
    const saveRequestClientResponseDecoder = object$1({
        windowContext: optional$1(anyJson$1()),
    });
    const permissionStateResultDecoder = object$1({
        state: oneOf$1(constant$1("prompt"), constant$1("denied"), constant$1("granted"))
    });
    const simpleAvailabilityResultDecoder = object$1({
        isAvailable: boolean$1()
    });
    const simpleItemIdDecoder = object$1({
        itemId: nonEmptyStringDecoder
    });
    const operationCheckResultDecoder = object$1({
        isSupported: boolean$1()
    });
    const operationCheckConfigDecoder = object$1({
        operation: nonEmptyStringDecoder
    });
    const workspaceFrameBoundsResultDecoder = object$1({
        bounds: windowBoundsDecoder
    });
    const themeDecoder = object$1({
        displayName: nonEmptyStringDecoder,
        name: nonEmptyStringDecoder
    });
    const simpleThemeResponseDecoder = object$1({
        theme: themeDecoder
    });
    const allThemesResponseDecoder = object$1({
        themes: array$1(themeDecoder)
    });
    const selectThemeConfigDecoder = object$1({
        name: nonEmptyStringDecoder
    });
    const notificationsDataDecoder = object$1({
        id: nonEmptyStringDecoder,
        title: nonEmptyStringDecoder,
        clickInterop: optional$1(interopActionSettingsDecoder),
        actions: optional$1(array$1(glue42NotificationActionDecoder)),
        focusPlatformOnDefaultClick: optional$1(boolean$1()),
        badge: optional$1(string$1()),
        body: optional$1(string$1()),
        data: optional$1(anyJson$1()),
        dir: optional$1(oneOf$1(constant$1("auto"), constant$1("ltr"), constant$1("rtl"))),
        icon: optional$1(string$1()),
        image: optional$1(string$1()),
        lang: optional$1(string$1()),
        renotify: optional$1(boolean$1()),
        requireInteraction: optional$1(boolean$1()),
        silent: optional$1(boolean$1()),
        tag: optional$1(string$1()),
        timestamp: optional$1(nonNegativeNumberDecoder),
        vibrate: optional$1(array$1(number$1())),
        severity: optional$1(oneOf$1(constant$1("Low"), constant$1("None"), constant$1("Medium"), constant$1("High"), constant$1("Critical"))),
        showToast: optional$1(boolean$1()),
        showInPanel: optional$1(boolean$1()),
        state: optional$1(notificationStateDecoder)
    });
    const simpleNotificationDataDecoder = object$1({
        notification: notificationsDataDecoder
    });
    const allNotificationsDataDecoder = object$1({
        notifications: array$1(notificationsDataDecoder)
    });
    const simpleNotificationSelectDecoder = object$1({
        id: nonEmptyStringDecoder
    });
    const getWindowIdsOnChannelDataDecoder = object$1({
        channel: nonEmptyStringDecoder
    });
    const getWindowIdsOnChannelResultDecoder = object$1({
        windowIds: array$1(nonEmptyStringDecoder)
    });
    const channelsOperationTypesDecoder = oneOf$1(constant$1("addChannel"), constant$1("getMyChannel"), constant$1("getWindowIdsOnChannel"), constant$1("getWindowIdsWithChannels"), constant$1("joinChannel"));
    const getMyChanelResultDecoder = object$1({
        channel: optional$1(nonEmptyStringDecoder)
    });
    const windowWithChannelFilterDecoder = object$1({
        application: optional$1(nonEmptyStringDecoder),
        channels: optional$1(array$1(nonEmptyStringDecoder)),
        windowIds: optional$1(array$1(nonEmptyStringDecoder))
    });
    const wrappedWindowWithChannelFilterDecoder = object$1({
        filter: optional$1(windowWithChannelFilterDecoder)
    });
    const getWindowIdsWithChannelsResultDecoder = object$1({
        windowIdsWithChannels: array$1(object$1({
            application: nonEmptyStringDecoder,
            channel: optional$1(nonEmptyStringDecoder),
            windowId: nonEmptyStringDecoder
        }))
    });
    const startApplicationContextDecoder = optional$1(anyJson$1());
    const startApplicationOptionsDecoder = optional$1(object$1({
        top: optional$1(number$1()),
        left: optional$1(number$1()),
        width: optional$1(nonNegativeNumberDecoder),
        height: optional$1(nonNegativeNumberDecoder),
        relativeTo: optional$1(nonEmptyStringDecoder),
        relativeDirection: optional$1(windowRelativeDirectionDecoder),
        waitForAGMReady: optional$1(boolean$1()),
        channelId: optional$1(nonEmptyStringDecoder),
        reuseId: optional$1(nonEmptyStringDecoder),
    }));
    const joinChannelDataDecoder = object$1({
        channel: nonEmptyStringDecoder,
        windowId: nonEmptyStringDecoder
    });
    const windowChannelResultDecoder = object$1({
        channel: optional$1(nonEmptyStringDecoder),
    });
    const prefsOperationTypesDecoder = oneOf$1(constant$1("clear"), constant$1("clearAll"), constant$1("get"), constant$1("getAll"), constant$1("set"), constant$1("update"), constant$1("prefsChanged"), constant$1("prefsHello"));
    const appPreferencesDecoder = object$1({
        app: nonEmptyStringDecoder,
        data: object$1(),
        lastUpdate: optional$1(nonEmptyStringDecoder),
    });
    const basePrefsConfigDecoder = object$1({
        app: nonEmptyStringDecoder,
    });
    const getPrefsResultDecoder = object$1({
        prefs: appPreferencesDecoder,
    });
    const getAllPrefsResultDecoder = object$1({
        all: array$1(appPreferencesDecoder),
    });
    const changePrefsDataDecoder = object$1({
        app: nonEmptyStringDecoder,
        data: object$1(),
    });
    const prefsHelloSuccessDecoder = object$1({
        platform: object$1({
            app: nonEmptyStringDecoder,
        }),
    });

    const operations$9 = {
        openWindow: { name: "openWindow", dataDecoder: openWindowConfigDecoder, resultDecoder: coreWindowDataDecoder },
        windowHello: { name: "windowHello", dataDecoder: windowHelloDecoder, resultDecoder: helloSuccessDecoder },
        windowAdded: { name: "windowAdded", dataDecoder: coreWindowDataDecoder },
        windowRemoved: { name: "windowRemoved", dataDecoder: simpleWindowDecoder },
        getBounds: { name: "getBounds", dataDecoder: simpleWindowDecoder, resultDecoder: windowBoundsResultDecoder },
        getFrameBounds: { name: "getFrameBounds", dataDecoder: simpleWindowDecoder, resultDecoder: frameWindowBoundsResultDecoder },
        getUrl: { name: "getUrl", dataDecoder: simpleWindowDecoder, resultDecoder: windowUrlResultDecoder },
        moveResize: { name: "moveResize", dataDecoder: windowMoveResizeConfigDecoder },
        focus: { name: "focus", dataDecoder: simpleWindowDecoder },
        close: { name: "close", dataDecoder: simpleWindowDecoder },
        getTitle: { name: "getTitle", dataDecoder: simpleWindowDecoder, resultDecoder: windowTitleConfigDecoder },
        setTitle: { name: "setTitle", dataDecoder: windowTitleConfigDecoder },
        focusChange: { name: "focusChange", dataDecoder: focusEventDataDecoder },
        getChannel: { name: "getChannel", dataDecoder: simpleWindowDecoder, resultDecoder: windowChannelResultDecoder },
    };

    function getDefaultExportFromCjs$1 (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createRegistry$1(options) {
        if (options && options.errorHandling
            && typeof options.errorHandling !== "function"
            && options.errorHandling !== "log"
            && options.errorHandling !== "silent"
            && options.errorHandling !== "throw") {
            throw new Error("Invalid options passed to createRegistry. Prop errorHandling should be [\"log\" | \"silent\" | \"throw\" | (err) => void], but " + typeof options.errorHandling + " was passed");
        }
        var _userErrorHandler = options && typeof options.errorHandling === "function" && options.errorHandling;
        var callbacks = {};
        function add(key, callback, replayArgumentsArr) {
            var callbacksForKey = callbacks[key];
            if (!callbacksForKey) {
                callbacksForKey = [];
                callbacks[key] = callbacksForKey;
            }
            callbacksForKey.push(callback);
            if (replayArgumentsArr) {
                setTimeout(function () {
                    replayArgumentsArr.forEach(function (replayArgument) {
                        var _a;
                        if ((_a = callbacks[key]) === null || _a === void 0 ? void 0 : _a.includes(callback)) {
                            try {
                                if (Array.isArray(replayArgument)) {
                                    callback.apply(undefined, replayArgument);
                                }
                                else {
                                    callback.apply(undefined, [replayArgument]);
                                }
                            }
                            catch (err) {
                                _handleError(err, key);
                            }
                        }
                    });
                }, 0);
            }
            return function () {
                var allForKey = callbacks[key];
                if (!allForKey) {
                    return;
                }
                allForKey = allForKey.reduce(function (acc, element, index) {
                    if (!(element === callback && acc.length === index)) {
                        acc.push(element);
                    }
                    return acc;
                }, []);
                if (allForKey.length === 0) {
                    delete callbacks[key];
                }
                else {
                    callbacks[key] = allForKey;
                }
            };
        }
        function execute(key) {
            var argumentsArr = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                argumentsArr[_i - 1] = arguments[_i];
            }
            var callbacksForKey = callbacks[key];
            if (!callbacksForKey || callbacksForKey.length === 0) {
                return [];
            }
            var results = [];
            callbacksForKey.forEach(function (callback) {
                try {
                    var result = callback.apply(undefined, argumentsArr);
                    results.push(result);
                }
                catch (err) {
                    results.push(undefined);
                    _handleError(err, key);
                }
            });
            return results;
        }
        function _handleError(exceptionArtifact, key) {
            var errParam = exceptionArtifact instanceof Error ? exceptionArtifact : new Error(exceptionArtifact);
            if (_userErrorHandler) {
                _userErrorHandler(errParam);
                return;
            }
            var msg = "[ERROR] callback-registry: User callback for key \"" + key + "\" failed: " + errParam.stack;
            if (options) {
                switch (options.errorHandling) {
                    case "log":
                        return console.error(msg);
                    case "silent":
                        return;
                    case "throw":
                        throw new Error(msg);
                }
            }
            console.error(msg);
        }
        function clear() {
            callbacks = {};
        }
        function clearKey(key) {
            var callbacksForKey = callbacks[key];
            if (!callbacksForKey) {
                return;
            }
            delete callbacks[key];
        }
        return {
            add: add,
            execute: execute,
            clear: clear,
            clearKey: clearKey
        };
    }
    createRegistry$1.default = createRegistry$1;
    var lib$3 = createRegistry$1;

    class WebWindowModel {
        constructor(_id, _name, _bridge) {
            this._id = _id;
            this._name = _name;
            this._bridge = _bridge;
            this.registry = lib$3();
            this.myCtxKey = `___window___${this.id}`;
        }
        get id() {
            return this._id.slice();
        }
        get name() {
            return this._name.slice();
        }
        clean() {
            if (this.ctxUnsubscribe) {
                this.ctxUnsubscribe();
            }
        }
        processSelfFocusEvent(hasFocus) {
            this.me.isFocused = hasFocus;
            this.registry.execute("focus-change", this.me);
        }
        toApi() {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.ctxUnsubscribe = yield this._bridge.contextLib.subscribe(this.myCtxKey, (data) => this.registry.execute("context-updated", data));
                this.me = {
                    id: this.id,
                    name: this.name,
                    isFocused: false,
                    getURL: this.getURL.bind(this),
                    moveResize: this.moveResize.bind(this),
                    resizeTo: this.resizeTo.bind(this),
                    moveTo: this.moveTo.bind(this),
                    focus: this.focus.bind(this),
                    close: this.close.bind(this),
                    getTitle: this.getTitle.bind(this),
                    setTitle: this.setTitle.bind(this),
                    getBounds: this.getBounds.bind(this),
                    getContext: this.getContext.bind(this),
                    updateContext: this.updateContext.bind(this),
                    setContext: this.setContext.bind(this),
                    onContextUpdated: this.onContextUpdated.bind(this),
                    onFocusChanged: this.onFocusChanged.bind(this),
                    getChannel: this.getChannel.bind(this),
                };
                return this.me;
            });
        }
        getURL() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const result = yield this._bridge.send("windows", operations$9.getUrl, { windowId: this.id });
                return result.url;
            });
        }
        onFocusChanged(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to context changes, because the provided callback is not a function!");
            }
            return this.registry.add("focus-change", callback);
        }
        moveResize(dimension) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const targetBounds = boundsDecoder.runWithException(dimension);
                const commandArgs = Object.assign({}, targetBounds, { windowId: this.id, relative: false });
                yield this._bridge.send("windows", operations$9.moveResize, commandArgs);
                return this.me;
            });
        }
        resizeTo(width, height) {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (typeof width === "undefined" && typeof height === "undefined") {
                    return this.me;
                }
                if (typeof width !== "undefined") {
                    nonNegativeNumberDecoder.runWithException(width);
                }
                if (typeof height !== "undefined") {
                    nonNegativeNumberDecoder.runWithException(height);
                }
                const commandArgs = Object.assign({}, { width, height }, { windowId: this.id, relative: true });
                yield this._bridge.send("windows", operations$9.moveResize, commandArgs);
                return this.me;
            });
        }
        moveTo(top, left) {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (typeof top === "undefined" && typeof left === "undefined") {
                    return this.me;
                }
                if (typeof top !== "undefined") {
                    number$1().runWithException(top);
                }
                if (typeof left !== "undefined") {
                    number$1().runWithException(left);
                }
                const commandArgs = Object.assign({}, { top, left }, { windowId: this.id, relative: true });
                yield this._bridge.send("windows", operations$9.moveResize, commandArgs);
                return this.me;
            });
        }
        focus() {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (this.name === "Platform") {
                    window.open(undefined, this.id);
                }
                else {
                    yield this._bridge.send("windows", operations$9.focus, { windowId: this.id });
                }
                return this.me;
            });
        }
        close() {
            return __awaiter$1(this, void 0, void 0, function* () {
                yield this._bridge.send("windows", operations$9.close, { windowId: this.id });
                return this.me;
            });
        }
        getTitle() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const result = yield this._bridge.send("windows", operations$9.getTitle, { windowId: this.id });
                return result.title;
            });
        }
        setTitle(title) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const ttl = nonEmptyStringDecoder.runWithException(title);
                yield this._bridge.send("windows", operations$9.setTitle, { windowId: this.id, title: ttl });
                return this.me;
            });
        }
        getBounds() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const result = yield this._bridge.send("windows", operations$9.getBounds, { windowId: this.id });
                return result.bounds;
            });
        }
        getContext() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const ctx = yield this._bridge.contextLib.get(this.myCtxKey);
                return ctx;
            });
        }
        updateContext(context) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const ctx = anyDecoder.runWithException(context);
                yield this._bridge.contextLib.update(this.myCtxKey, ctx);
                return this.me;
            });
        }
        setContext(context) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const ctx = anyDecoder.runWithException(context);
                yield this._bridge.contextLib.set(this.myCtxKey, ctx);
                return this.me;
            });
        }
        onContextUpdated(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to context changes, because the provided callback is not a function!");
            }
            const wrappedCallback = (data) => {
                callback(data, this.me);
            };
            return this.registry.add("context-updated", wrappedCallback);
        }
        getChannel() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const result = yield this._bridge.send("windows", operations$9.getChannel, { windowId: this.id }, undefined, { includeOperationCheck: true });
                return result.channel;
            });
        }
    }

    const systemOperations = {
        operationCheck: { name: "operationCheck", dataDecoder: operationCheckConfigDecoder, resultDecoder: operationCheckResultDecoder },
        getWorkspaceWindowFrameBounds: { name: "getWorkspaceWindowFrameBounds", resultDecoder: workspaceFrameBoundsResultDecoder, dataDecoder: simpleItemIdDecoder }
    };

    const PromiseWrap = (promise, timeoutMilliseconds, timeoutMessage) => {
        return new Promise((resolve, reject) => {
            let promiseActive = true;
            const timeout = setTimeout(() => {
                if (!promiseActive) {
                    return;
                }
                promiseActive = false;
                const message = timeoutMessage || `Promise timeout hit: ${timeoutMilliseconds}`;
                reject(message);
            }, timeoutMilliseconds);
            promise()
                .then((result) => {
                if (!promiseActive) {
                    return;
                }
                promiseActive = false;
                clearTimeout(timeout);
                resolve(result);
            })
                .catch((error) => {
                if (!promiseActive) {
                    return;
                }
                promiseActive = false;
                clearTimeout(timeout);
                reject(error);
            });
        });
    };
    const PromisePlus$1 = (executor, timeoutMilliseconds, timeoutMessage) => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                const message = timeoutMessage || `Promise timeout hit: ${timeoutMilliseconds}`;
                reject(message);
            }, timeoutMilliseconds);
            const providedPromise = new Promise(executor);
            providedPromise
                .then((result) => {
                clearTimeout(timeout);
                resolve(result);
            })
                .catch((error) => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    };

    class WindowsController {
        constructor() {
            this.registry = lib$3();
            this.allWindowProjections = [];
        }
        start(coreGlue, ioc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.logger = coreGlue.logger.subLogger("windows.controller.web");
                this.logger.trace("starting the web windows controller");
                this.publicWindowId = ioc.publicWindowId;
                this.addWindowOperationExecutors();
                this.ioc = ioc;
                this.bridge = ioc.bridge;
                this.instanceId = coreGlue.interop.instance.instance;
                this.channelsController = ioc.channelsController;
                this.logger.trace(`set the public window id: ${this.publicWindowId}, set the bridge operations and ioc, registering with the platform now`);
                this.platformRegistration = this.registerWithPlatform();
                yield this.platformRegistration;
                yield this.initializeFocusTracking();
                this.logger.trace("registration with the platform successful, attaching the windows property to glue and returning");
                const api = this.toApi();
                coreGlue.windows = api;
            });
        }
        handlePlatformShutdown() {
            this.registry.clear();
            this.allWindowProjections = [];
            if (!this.focusEventHandler) {
                return;
            }
            document.removeEventListener("visibilityChange", this.focusEventHandler);
            window.removeEventListener("focus", this.focusEventHandler);
            window.removeEventListener("blur", this.focusEventHandler);
        }
        handleBridgeMessage(args) {
            return __awaiter$1(this, void 0, void 0, function* () {
                yield this.platformRegistration;
                const operationName = windowOperationTypesDecoder.runWithException(args.operation);
                const operation = operations$9[operationName];
                if (!operation.execute) {
                    return;
                }
                let operationData = args.data;
                if (operation.dataDecoder) {
                    operationData = operation.dataDecoder.runWithException(args.data);
                }
                return yield operation.execute(operationData);
            });
        }
        open(name, url, options) {
            return __awaiter$1(this, void 0, void 0, function* () {
                nonEmptyStringDecoder.runWithException(name);
                nonEmptyStringDecoder.runWithException(url);
                const settings = windowOpenSettingsDecoder.runWithException(options);
                const windowSuccess = yield this.bridge.send("windows", operations$9.openWindow, { name, url, options: settings });
                return this.waitForWindowAdded(windowSuccess.windowId);
            });
        }
        list() {
            return this.allWindowProjections.map((projection) => projection.api);
        }
        findById(id) {
            var _a;
            nonEmptyStringDecoder.runWithException(id);
            return (_a = this.allWindowProjections.find((projection) => projection.id === id)) === null || _a === void 0 ? void 0 : _a.api;
        }
        toApi() {
            return {
                open: this.open.bind(this),
                my: this.my.bind(this),
                list: this.list.bind(this),
                findById: this.findById.bind(this),
                onWindowAdded: this.onWindowAdded.bind(this),
                onWindowRemoved: this.onWindowRemoved.bind(this),
                onWindowGotFocus: this.onWindowGotFocus.bind(this),
                onWindowLostFocus: this.onWindowLostFocus.bind(this)
            };
        }
        addWindowOperationExecutors() {
            operations$9.focusChange.execute = this.handleFocusChangeEvent.bind(this);
            operations$9.windowAdded.execute = this.handleWindowAdded.bind(this);
            operations$9.windowRemoved.execute = this.handleWindowRemoved.bind(this);
            operations$9.getBounds.execute = this.handleGetBounds.bind(this);
            operations$9.getFrameBounds.execute = this.handleGetBounds.bind(this);
            operations$9.getTitle.execute = this.handleGetTitle.bind(this);
            operations$9.getUrl.execute = this.handleGetUrl.bind(this);
            operations$9.moveResize.execute = this.handleMoveResize.bind(this);
            operations$9.setTitle.execute = this.handleSetTitle.bind(this);
            operations$9.getChannel.execute = this.handleGetChannel.bind(this);
        }
        my() {
            return Object.assign({}, this.me);
        }
        onWindowAdded(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to window added, because the provided callback is not a function!");
            }
            return this.registry.add("window-added", callback);
        }
        onWindowRemoved(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to window removed, because the provided callback is not a function!");
            }
            return this.registry.add("window-removed", callback);
        }
        onWindowGotFocus(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to onWindowGotFocus, because the provided callback is not a function!");
            }
            return this.registry.add("window-got-focus", callback);
        }
        onWindowLostFocus(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to onWindowLostFocus, because the provided callback is not a function!");
            }
            return this.registry.add("window-lost-focus", callback);
        }
        sayHello() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const helloSuccess = yield this.bridge.send("windows", operations$9.windowHello, { windowId: this.publicWindowId });
                return helloSuccess;
            });
        }
        registerWithPlatform() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const { windows, isWorkspaceFrame } = yield this.sayHello();
                this.isWorkspaceFrame = isWorkspaceFrame;
                this.logger.trace("the platform responded to the hello message");
                if (!this.isWorkspaceFrame && this.publicWindowId) {
                    this.logger.trace("i am not treated as a workspace frame, setting my window");
                    const myWindow = windows.find((w) => w.windowId === this.publicWindowId);
                    if (!myWindow) {
                        throw new Error("Cannot initialize the window library, because I received no information about me from the platform");
                    }
                    const myProjection = yield this.ioc.buildWebWindow(this.publicWindowId, myWindow.name);
                    this.me = myProjection.api;
                    this.allWindowProjections.push(myProjection);
                }
                const currentWindows = yield Promise.all(windows
                    .filter((w) => w.windowId !== this.publicWindowId)
                    .map((w) => this.ioc.buildWebWindow(w.windowId, w.name)));
                this.logger.trace("all windows projections are completed, building the list collection");
                this.allWindowProjections.push(...currentWindows);
            });
        }
        handleFocusChangeEvent(focusData) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const foundProjection = this.allWindowProjections.find((projection) => projection.id === focusData.windowId);
                if (!foundProjection) {
                    return;
                }
                foundProjection.model.processSelfFocusEvent(focusData.hasFocus);
                const keyToExecute = focusData.hasFocus ? "window-got-focus" : "window-lost-focus";
                this.registry.execute(keyToExecute, foundProjection.api);
            });
        }
        handleWindowAdded(data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (this.allWindowProjections.some((projection) => projection.id === data.windowId)) {
                    return;
                }
                const webWindowProjection = yield this.ioc.buildWebWindow(data.windowId, data.name);
                this.allWindowProjections.push(webWindowProjection);
                this.registry.execute("window-added", webWindowProjection.api);
            });
        }
        handleWindowRemoved(data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const removed = this.allWindowProjections.find((w) => w.id === data.windowId);
                if (!removed) {
                    return;
                }
                this.allWindowProjections = this.allWindowProjections.filter((w) => w.id !== data.windowId);
                removed.model.clean();
                this.registry.execute("window-removed", removed.api);
            });
        }
        handleGetBounds() {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (!this.me && !this.isWorkspaceFrame) {
                    throw new Error("This window cannot report it's bounds, because it is not a Glue Window, most likely because it is an iframe");
                }
                return {
                    windowId: this.isWorkspaceFrame ? "noop" : this.me.id,
                    bounds: {
                        top: window.screenTop,
                        left: window.screenLeft,
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                };
            });
        }
        handleGetTitle() {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (!this.me) {
                    throw new Error("This window cannot report it's title, because it is not a Glue Window, most likely because it is an iframe");
                }
                return {
                    windowId: this.me.id,
                    title: document.title
                };
            });
        }
        handleGetUrl() {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (!this.me) {
                    throw new Error("This window cannot report it's url, because it is not a Glue Window, most likely because it is an iframe");
                }
                return {
                    windowId: this.me.id,
                    url: window.location.href
                };
            });
        }
        handleMoveResize(config) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const targetTop = typeof config.top === "number" ? config.top :
                    config.relative ? 0 : window.screenTop;
                const targetLeft = typeof config.left === "number" ? config.left :
                    config.relative ? 0 : window.screenLeft;
                const targetHeight = typeof config.height === "number" ? config.height :
                    config.relative ? 0 : window.innerHeight;
                const targetWidth = typeof config.width === "number" ? config.width :
                    config.relative ? 0 : window.innerWidth;
                const moveMethod = config.relative ? window.moveBy : window.moveTo;
                const resizeMethod = config.relative ? window.resizeBy : window.resizeTo;
                moveMethod(targetLeft, targetTop);
                resizeMethod(targetWidth, targetHeight);
            });
        }
        handleSetTitle(config) {
            return __awaiter$1(this, void 0, void 0, function* () {
                document.title = config.title;
            });
        }
        initializeFocusTracking() {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (this.isWorkspaceFrame) {
                    this.logger.trace("Ignoring the focus tracking, because this client is a workspace frame");
                    return;
                }
                try {
                    yield this.bridge.send("windows", systemOperations.operationCheck, { operation: "focusChange" });
                }
                catch (error) {
                    this.logger.warn("The platform of this client is outdated and does not support focus tracking, disabling focus events for this client.");
                    return;
                }
                const hasFocus = document.hasFocus();
                yield this.transmitFocusChange(true);
                if (!hasFocus) {
                    yield this.transmitFocusChange(false);
                }
                this.defineEventListeners();
            });
        }
        processFocusEvent() {
            const hasFocus = document.hasFocus();
            this.transmitFocusChange(hasFocus);
        }
        waitForWindowAdded(windowId) {
            const foundWindow = this.allWindowProjections.find((projection) => projection.id === windowId);
            if (foundWindow) {
                return Promise.resolve(foundWindow.api);
            }
            return PromisePlus$1((resolve) => {
                const unsubscribe = this.onWindowAdded((addedWindow) => {
                    if (addedWindow.id === windowId) {
                        unsubscribe();
                        resolve(addedWindow);
                    }
                });
            }, 30000, `Timed out waiting for ${windowId} to be announced`);
        }
        transmitFocusChange(hasFocus) {
            var _a;
            return __awaiter$1(this, void 0, void 0, function* () {
                const eventData = {
                    windowId: ((_a = this.me) === null || _a === void 0 ? void 0 : _a.id) || `iframe-${this.instanceId}`,
                    hasFocus
                };
                if (this.me) {
                    this.me.isFocused = hasFocus;
                }
                yield this.bridge.send("windows", operations$9.focusChange, eventData);
            });
        }
        defineEventListeners() {
            this.focusEventHandler = this.processFocusEvent.bind(this);
            document.addEventListener("visibilityChange", this.focusEventHandler);
            window.addEventListener("focus", this.focusEventHandler);
            window.addEventListener("blur", this.focusEventHandler);
        }
        handleGetChannel() {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (!this.me) {
                    throw new Error("This window cannot report it's channel, because it is not a Glue Window, most likely because it is an iframe");
                }
                const channel = this.channelsController.my();
                return Object.assign({}, (channel ? { channel } : {}));
            });
        }
    }

    const GlueWebPlatformControlName = "T42.Web.Platform.Control";
    const GlueWebPlatformStreamName = "T42.Web.Platform.Stream";
    const GlueClientControlName = "T42.Web.Client.Control";
    const GlueCorePlusThemesStream = "T42.Core.Plus.Themes.Stream";

    class GlueBridge {
        constructor(coreGlue, communicationId) {
            this.coreGlue = coreGlue;
            this.communicationId = communicationId;
            this.platformMethodTimeoutMs = 10000;
        }
        get contextLib() {
            return this.coreGlue.contexts;
        }
        get interopInstance() {
            return this.coreGlue.interop.instance.instance;
        }
        stop() {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.running = false;
                this.sub.close();
                yield this.coreGlue.interop.unregister(GlueClientControlName);
            });
        }
        start(controllers) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.running = true;
                this.controllers = controllers;
                yield Promise.all([
                    this.checkWaitMethod(GlueWebPlatformControlName),
                    this.checkWaitMethod(GlueWebPlatformStreamName)
                ]);
                const systemId = this.communicationId;
                const [sub] = yield Promise.all([
                    this.coreGlue.interop.subscribe(GlueWebPlatformStreamName, systemId ? { target: { instance: this.communicationId } } : undefined),
                    this.coreGlue.interop.registerAsync(GlueClientControlName, (args, _, success, error) => this.passMessageController(args, success, error))
                ]);
                this.sub = sub;
                this.sub.onData((pkg) => this.passMessageController(pkg.data));
            });
        }
        getInteropInstance(windowId) {
            const result = this.coreGlue.interop.servers().find((s) => s.windowId && s.windowId === windowId);
            return {
                application: result === null || result === void 0 ? void 0 : result.application,
                applicationName: result === null || result === void 0 ? void 0 : result.applicationName,
                peerId: result === null || result === void 0 ? void 0 : result.peerId,
                instance: result === null || result === void 0 ? void 0 : result.instance,
                windowId: result === null || result === void 0 ? void 0 : result.windowId
            };
        }
        send(domain, operation, operationData, options, webOptions) {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (operation.dataDecoder) {
                    try {
                        operation.dataDecoder.runWithException(operationData);
                    }
                    catch (error) {
                        throw new Error(`Unexpected Web->Platform outgoing validation error: ${error.message}, for operation: ${operation.name} and input: ${JSON.stringify(error.input)}`);
                    }
                }
                const operationSupported = (webOptions === null || webOptions === void 0 ? void 0 : webOptions.includeOperationCheck) ?
                    (yield this.checkOperationSupported(domain, operation)).isSupported :
                    true;
                if (!operationSupported) {
                    throw new Error(`Cannot complete operation: ${operation.name} for domain: ${domain} because this client is connected to a platform which does not support it`);
                }
                try {
                    const operationResult = yield this.transmitMessage(domain, operation, operationData, options);
                    if (operation.resultDecoder) {
                        operation.resultDecoder.runWithException(operationResult);
                    }
                    return operationResult;
                }
                catch (error) {
                    if (error.kind) {
                        throw new Error(`Unexpected Web<-Platform incoming validation error: ${error.message}, for operation: ${operation.name} and input: ${JSON.stringify(error.input)}`);
                    }
                    throw new Error(error.message);
                }
            });
        }
        createNotificationsSteam() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const streamExists = this.coreGlue.interop.methods().some((method) => method.name === GlueCorePlusThemesStream);
                if (!streamExists) {
                    throw new Error("Cannot subscribe to theme changes, because the underlying interop stream does not exist. Most likely this is the case when this client is not connected to Core Plus.");
                }
                return this.coreGlue.interop.subscribe(GlueCorePlusThemesStream, this.communicationId ? { target: { instance: this.communicationId } } : undefined);
            });
        }
        checkOperationSupported(domain, operation) {
            return __awaiter$1(this, void 0, void 0, function* () {
                try {
                    const result = yield this.send(domain, systemOperations.operationCheck, { operation: operation.name });
                    return result;
                }
                catch (error) {
                    return { isSupported: false };
                }
            });
        }
        checkWaitMethod(name) {
            return PromisePlus$1((resolve) => {
                const hasMethod = this.coreGlue.interop.methods().some((method) => {
                    const nameMatch = method.name === name;
                    const serverMatch = this.communicationId ?
                        method.getServers().some((server) => server.instance === this.communicationId) :
                        true;
                    return nameMatch && serverMatch;
                });
                if (hasMethod) {
                    return resolve();
                }
                const unSub = this.coreGlue.interop.serverMethodAdded((data) => {
                    const method = data.method;
                    const server = data.server;
                    const serverMatch = this.communicationId ?
                        server.instance === this.communicationId :
                        true;
                    if (method.name === name && serverMatch) {
                        unSub();
                        resolve();
                    }
                });
            }, this.platformMethodTimeoutMs, `Cannot initiate Glue Web, because a system method's discovery timed out: ${name}`);
        }
        passMessageController(args, success, error) {
            const decodeResult = libDomainDecoder.run(args.domain);
            if (!decodeResult.ok) {
                if (error) {
                    error(`Cannot execute this client control, because of domain validation error: ${JSON.stringify(decodeResult.error)}`);
                }
                return;
            }
            const domain = decodeResult.result;
            this.controllers[domain]
                .handleBridgeMessage(args)
                .then((resolutionData) => {
                if (success) {
                    success(resolutionData);
                }
            })
                .catch((err) => {
                if (error) {
                    error(err);
                }
                console.warn(err);
            });
        }
        transmitMessage(domain, operation, data, options) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const messageData = { domain, data, operation: operation.name };
                let invocationResult;
                const baseErrorMessage = `Internal Platform Communication Error. Attempted operation: ${JSON.stringify(operation.name)} with data: ${JSON.stringify(data)}. `;
                const systemId = this.communicationId;
                try {
                    if (!this.running) {
                        throw new Error("Cannot send a control message, because the platform shut down");
                    }
                    invocationResult = yield this.coreGlue.interop.invoke(GlueWebPlatformControlName, messageData, systemId ? { instance: this.communicationId } : undefined, options);
                    if (!invocationResult) {
                        throw new Error("Received unsupported result from the platform - empty result");
                    }
                    if (!Array.isArray(invocationResult.all_return_values) || invocationResult.all_return_values.length === 0) {
                        throw new Error("Received unsupported result from the platform - empty values collection");
                    }
                }
                catch (error) {
                    if (error && error.all_errors && error.all_errors.length) {
                        const invocationErrorMessage = error.all_errors[0].message;
                        throw new Error(`${baseErrorMessage} -> Inner message: ${invocationErrorMessage}`);
                    }
                    throw new Error(`${baseErrorMessage} -> Inner message: ${error.message}`);
                }
                return invocationResult.all_return_values[0].returned;
            });
        }
    }

    const operations$8 = {
        appHello: { name: "appHello", dataDecoder: windowHelloDecoder, resultDecoder: appHelloSuccessDecoder },
        appDirectoryStateChange: { name: "appDirectoryStateChange", dataDecoder: appDirectoryStateChangeDecoder },
        instanceStarted: { name: "instanceStarted", dataDecoder: instanceDataDecoder },
        instanceStopped: { name: "instanceStopped", dataDecoder: instanceDataDecoder },
        applicationStart: { name: "applicationStart", dataDecoder: applicationStartConfigDecoder, resultDecoder: instanceDataDecoder },
        instanceStop: { name: "instanceStop", dataDecoder: basicInstanceDataDecoder },
        import: { name: "import" },
        remove: { name: "remove", dataDecoder: appRemoveConfigDecoder },
        export: { name: "export", resultDecoder: appsExportOperationDecoder },
        clear: { name: "clear" }
    };

    class AppManagerController {
        constructor() {
            this.baseApplicationsTimeoutMS = 60000;
            this.appImportTimeoutMS = 20;
            this.registry = lib$3();
            this.applications = [];
            this.instances = [];
        }
        handlePlatformShutdown() {
            this.registry.clear();
            this.applications = [];
            this.instances = [];
            delete this.me;
        }
        start(coreGlue, ioc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.logger = coreGlue.logger.subLogger("appManger.controller.web");
                this.logger.trace("starting the web appManager controller");
                this.publicWindowId = ioc.publicWindowId;
                this.addOperationsExecutors();
                this.ioc = ioc;
                this.bridge = ioc.bridge;
                this.channelsController = ioc.channelsController;
                this.sessionController = ioc.sessionController;
                this.platformRegistration = this.registerWithPlatform();
                yield this.platformRegistration;
                this.logger.trace("registration with the platform successful, attaching the appManager property to glue and returning");
                const api = this.toApi();
                coreGlue.appManager = api;
            });
        }
        handleBridgeMessage(args) {
            return __awaiter$1(this, void 0, void 0, function* () {
                yield this.platformRegistration;
                const operationName = appManagerOperationTypesDecoder.runWithException(args.operation);
                const operation = operations$8[operationName];
                if (!operation.execute) {
                    return;
                }
                let operationData = args.data;
                if (operation.dataDecoder) {
                    operationData = operation.dataDecoder.runWithException(args.data);
                }
                return yield operation.execute(operationData);
            });
        }
        onInstanceStarted(callback) {
            if (typeof callback !== "function") {
                throw new Error("onInstanceStarted requires a single argument of type function");
            }
            return this.registry.add("instance-started", callback, this.instances);
        }
        onInstanceStopped(callback) {
            if (typeof callback !== "function") {
                throw new Error("onInstanceStopped requires a single argument of type function");
            }
            return this.registry.add("instance-stopped", callback);
        }
        startApplication(appName, context, options) {
            var _a;
            return __awaiter$1(this, void 0, void 0, function* () {
                const channels = yield this.channelsController.all();
                if ((options === null || options === void 0 ? void 0 : options.channelId) && !channels.includes(options.channelId)) {
                    throw new Error(`The channel with name "${options.channelId}" doesn't exist!`);
                }
                const startOptions = {
                    name: appName,
                    waitForAGMReady: (_a = options === null || options === void 0 ? void 0 : options.waitForAGMReady) !== null && _a !== void 0 ? _a : true,
                    context,
                    top: options === null || options === void 0 ? void 0 : options.top,
                    left: options === null || options === void 0 ? void 0 : options.left,
                    width: options === null || options === void 0 ? void 0 : options.width,
                    height: options === null || options === void 0 ? void 0 : options.height,
                    relativeTo: options === null || options === void 0 ? void 0 : options.relativeTo,
                    relativeDirection: options === null || options === void 0 ? void 0 : options.relativeDirection,
                    id: options === null || options === void 0 ? void 0 : options.reuseId,
                    forceChromeTab: options === null || options === void 0 ? void 0 : options.forceTab,
                    layoutComponentId: options === null || options === void 0 ? void 0 : options.layoutComponentId,
                    channelId: options === null || options === void 0 ? void 0 : options.channelId
                };
                const openResult = yield this.bridge.send("appManager", operations$8.applicationStart, startOptions);
                const app = this.applications.find((a) => a.name === openResult.applicationName);
                return this.ioc.buildInstance(openResult, app);
            });
        }
        getApplication(name) {
            const verifiedName = nonEmptyStringDecoder.runWithException(name);
            return this.applications.find((app) => app.name === verifiedName);
        }
        getInstances() {
            return this.instances.slice();
        }
        toApi() {
            const api = {
                myInstance: this.me,
                inMemory: {
                    import: this.import.bind(this),
                    remove: this.remove.bind(this),
                    export: this.export.bind(this),
                    clear: this.clear.bind(this)
                },
                application: this.getApplication.bind(this),
                applications: this.getApplications.bind(this),
                instances: this.getInstances.bind(this),
                onAppAdded: this.onAppAdded.bind(this),
                onAppChanged: this.onAppChanged.bind(this),
                onAppRemoved: this.onAppRemoved.bind(this),
                onInstanceStarted: this.onInstanceStarted.bind(this),
                onInstanceStopped: this.onInstanceStopped.bind(this)
            };
            return api;
        }
        addOperationsExecutors() {
            operations$8.appDirectoryStateChange.execute = this.handleAppDirectoryStateChange.bind(this);
            operations$8.instanceStarted.execute = this.handleInstanceStartedMessage.bind(this);
            operations$8.instanceStopped.execute = this.handleInstanceStoppedMessage.bind(this);
        }
        handleAppDirectoryStateChange(data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                data.appsAdded.forEach(this.handleApplicationAddedMessage.bind(this));
                data.appsChanged.forEach(this.handleApplicationChangedMessage.bind(this));
                data.appsRemoved.forEach(this.handleApplicationRemovedMessage.bind(this));
            });
        }
        onAppAdded(callback) {
            if (typeof callback !== "function") {
                throw new Error("onAppAdded requires a single argument of type function");
            }
            return this.registry.add("application-added", callback, this.applications);
        }
        onAppRemoved(callback) {
            if (typeof callback !== "function") {
                throw new Error("onAppRemoved requires a single argument of type function");
            }
            return this.registry.add("application-removed", callback);
        }
        onAppChanged(callback) {
            if (typeof callback !== "function") {
                throw new Error("onAppChanged requires a single argument of type function");
            }
            return this.registry.add("application-changed", callback);
        }
        handleApplicationAddedMessage(appData) {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (this.applications.some((app) => app.name === appData.name)) {
                    return;
                }
                const app = yield this.ioc.buildApplication(appData, []);
                const instances = this.instances.filter((instance) => instance.application.name === app.name);
                app.instances.push(...instances);
                this.applications.push(app);
                this.registry.execute("application-added", app);
            });
        }
        handleApplicationRemovedMessage(appData) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const appIndex = this.applications.findIndex((app) => app.name === appData.name);
                if (appIndex < 0) {
                    return;
                }
                const app = this.applications[appIndex];
                this.applications.splice(appIndex, 1);
                this.registry.execute("application-removed", app);
            });
        }
        handleApplicationChangedMessage(appData) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const app = this.applications.find((app) => app.name === appData.name);
                if (!app) {
                    return this.handleApplicationAddedMessage(appData);
                }
                app.title = appData.title;
                app.version = appData.version;
                app.icon = appData.icon;
                app.caption = appData.caption;
                app.userProperties = appData.userProperties;
                this.registry.execute("application-changed", app);
            });
        }
        handleInstanceStartedMessage(instanceData) {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (this.instances.some((instance) => instance.id === instanceData.id)) {
                    return;
                }
                const application = this.applications.find((app) => app.name === instanceData.applicationName);
                if (!application) {
                    throw new Error(`Cannot add instance: ${instanceData.id}, because there is no application definition associated with it`);
                }
                const instance = this.ioc.buildInstance(instanceData, application);
                this.instances.push(instance);
                application.instances.push(instance);
                this.registry.execute("instance-started", instance);
            });
        }
        handleInstanceStoppedMessage(instanceData) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const instance = this.instances.find((i) => i.id === instanceData.id);
                if (instance) {
                    const instIdx = this.instances.findIndex((inst) => inst.id === instanceData.id);
                    this.instances.splice(instIdx, 1);
                }
                const application = this.applications.find((app) => app.instances.some((inst) => inst.id === instanceData.id));
                if (application) {
                    const instIdxApps = application.instances.findIndex((inst) => inst.id === instanceData.id);
                    application.instances.splice(instIdxApps, 1);
                }
                if (!instance) {
                    return;
                }
                this.registry.execute("instance-stopped", instance);
            });
        }
        import(definitions, mode = "replace") {
            return __awaiter$1(this, void 0, void 0, function* () {
                importModeDecoder.runWithException(mode);
                if (!Array.isArray(definitions)) {
                    throw new Error("Import must be called with an array of definitions");
                }
                if (definitions.length > 10000) {
                    throw new Error("Cannot import more than 10000 app definitions in Glue42 Core.");
                }
                const parseResult = definitions.reduce((soFar, definition) => {
                    const decodeResult = allApplicationDefinitionsDecoder.run(definition);
                    if (!decodeResult.ok) {
                        soFar.invalid.push({ app: definition === null || definition === void 0 ? void 0 : definition.name, error: JSON.stringify(decodeResult.error) });
                    }
                    else {
                        soFar.valid.push(definition);
                    }
                    return soFar;
                }, { valid: [], invalid: [] });
                const responseTimeout = this.baseApplicationsTimeoutMS + this.appImportTimeoutMS * parseResult.valid.length;
                yield this.bridge.send("appManager", operations$8.import, { definitions: parseResult.valid, mode }, { methodResponseTimeoutMs: responseTimeout });
                return {
                    imported: parseResult.valid.map((valid) => valid.name),
                    errors: parseResult.invalid
                };
            });
        }
        remove(name) {
            return __awaiter$1(this, void 0, void 0, function* () {
                nonEmptyStringDecoder.runWithException(name);
                yield this.bridge.send("appManager", operations$8.remove, { name }, { methodResponseTimeoutMs: this.baseApplicationsTimeoutMS });
            });
        }
        clear() {
            return __awaiter$1(this, void 0, void 0, function* () {
                yield this.bridge.send("appManager", operations$8.clear, undefined, { methodResponseTimeoutMs: this.baseApplicationsTimeoutMS });
            });
        }
        export() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const response = yield this.bridge.send("appManager", operations$8.export, undefined, { methodResponseTimeoutMs: this.baseApplicationsTimeoutMS });
                return response.definitions;
            });
        }
        getApplications() {
            return this.applications.slice();
        }
        joinInitialChannel(initialChannelId) {
            return __awaiter$1(this, void 0, void 0, function* () {
                try {
                    yield this.channelsController.join(initialChannelId);
                }
                catch (error) {
                    this.logger.warn(`Application instance ${this.me} was unable to join the ${initialChannelId} channel. Reason: ${JSON.stringify(error)}`);
                }
            });
        }
        registerWithPlatform() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const result = yield this.bridge.send("appManager", operations$8.appHello, { windowId: this.publicWindowId }, { methodResponseTimeoutMs: this.baseApplicationsTimeoutMS });
                this.logger.trace("the platform responded to the hello message with a full list of apps");
                this.applications = yield Promise.all(result.apps.map((app) => this.ioc.buildApplication(app, app.instances)));
                this.instances = this.applications.reduce((instancesSoFar, app) => {
                    instancesSoFar.push(...app.instances);
                    return instancesSoFar;
                }, []);
                this.me = this.findMyInstance();
                this.logger.trace(`all applications were parsed and saved. I am ${this.me ? "NOT a" : "a"} valid instance`);
                const { channels: channelsStorageData } = this.sessionController.getWindowData();
                const channel = channelsStorageData ? channelsStorageData.currentName : result.initialChannelId;
                if (channel) {
                    yield this.joinInitialChannel(channel);
                }
            });
        }
        findMyInstance() {
            for (const app of this.applications) {
                const foundInstance = app.instances.find((instance) => instance.id === this.publicWindowId);
                if (foundInstance) {
                    return foundInstance;
                }
            }
            return undefined;
        }
    }

    class InstanceModel {
        constructor(data, bridge, application) {
            this.data = data;
            this.bridge = bridge;
            this.application = application;
            this.myCtxKey = `___instance___${this.data.id}`;
        }
        toApi() {
            const agm = this.bridge.getInteropInstance(this.data.id);
            const api = {
                id: this.data.id,
                agm,
                application: this.application,
                stop: this.stop.bind(this),
                getContext: this.getContext.bind(this)
            };
            this.me = Object.freeze(api);
            return this.me;
        }
        getContext() {
            return __awaiter$1(this, void 0, void 0, function* () {
                return this.bridge.contextLib.get(this.myCtxKey);
            });
        }
        stop() {
            return __awaiter$1(this, void 0, void 0, function* () {
                yield this.bridge.send("appManager", operations$8.instanceStop, { id: this.data.id });
            });
        }
    }

    class ApplicationModel {
        constructor(data, instances, controller) {
            this.data = data;
            this.instances = instances;
            this.controller = controller;
        }
        toApi() {
            const api = {
                name: this.data.name,
                title: this.data.title,
                version: this.data.version,
                icon: this.data.icon,
                caption: this.data.caption,
                userProperties: this.data.userProperties,
                instances: this.instances,
                start: this.start.bind(this),
                onInstanceStarted: this.onInstanceStarted.bind(this),
                onInstanceStopped: this.onInstanceStopped.bind(this)
            };
            this.me = api;
            return this.me;
        }
        onInstanceStarted(callback) {
            if (typeof callback !== "function") {
                throw new Error("OnInstanceStarted requires a single argument of type function");
            }
            return this.controller.onInstanceStarted((instance) => {
                if (instance.application.name === this.data.name) {
                    callback(instance);
                }
            });
        }
        onInstanceStopped(callback) {
            if (typeof callback !== "function") {
                throw new Error("OnInstanceStarted requires a single argument of type function");
            }
            return this.controller.onInstanceStopped((instance) => {
                if (instance.application.name === this.data.name) {
                    callback(instance);
                }
            });
        }
        start(context, options) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const verifiedContext = startApplicationContextDecoder.runWithException(context);
                const verifiedOptions = startApplicationOptionsDecoder.runWithException(options);
                return this.controller.startApplication(this.data.name, verifiedContext, verifiedOptions);
            });
        }
    }

    const operations$7 = {
        layoutAdded: { name: "layoutAdded", dataDecoder: glueLayoutDecoder },
        layoutChanged: { name: "layoutChanged", dataDecoder: glueLayoutDecoder },
        layoutRemoved: { name: "layoutRemoved", dataDecoder: glueLayoutDecoder },
        get: { name: "get", dataDecoder: simpleLayoutConfigDecoder, resultDecoder: optionalSimpleLayoutResult },
        getAll: { name: "getAll", dataDecoder: getAllLayoutsConfigDecoder, resultDecoder: allLayoutsSummariesResultDecoder },
        export: { name: "export", dataDecoder: getAllLayoutsConfigDecoder, resultDecoder: allLayoutsFullConfigDecoder },
        import: { name: "import", dataDecoder: layoutsImportConfigDecoder },
        remove: { name: "remove", dataDecoder: simpleLayoutConfigDecoder },
        save: { name: "save", dataDecoder: saveLayoutConfigDecoder, resultDecoder: simpleLayoutResultDecoder },
        restore: { name: "restore", dataDecoder: restoreLayoutConfigDecoder },
        clientSaveRequest: { name: "clientSaveRequest", dataDecoder: platformSaveRequestConfigDecoder, resultDecoder: saveRequestClientResponseDecoder },
        getGlobalPermissionState: { name: "getGlobalPermissionState", resultDecoder: permissionStateResultDecoder },
        requestGlobalPermission: { name: "requestGlobalPermission", resultDecoder: simpleAvailabilityResultDecoder },
        checkGlobalActivated: { name: "checkGlobalActivated", resultDecoder: simpleAvailabilityResultDecoder },
        getDefaultGlobal: { name: "getDefaultGlobal", resultDecoder: optionalSimpleLayoutResult },
        setDefaultGlobal: { name: "setDefaultGlobal", dataDecoder: setDefaultGlobalConfigDecoder },
        clearDefaultGlobal: { name: "clearDefaultGlobal" }
    };

    class LayoutsController {
        constructor() {
            this.defaultLayoutRestoreTimeoutMS = 120000;
            this.registry = lib$3();
        }
        handlePlatformShutdown() {
            this.registry.clear();
        }
        start(coreGlue, ioc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.logger = coreGlue.logger.subLogger("layouts.controller.web");
                this.logger.trace("starting the web layouts controller");
                this.bridge = ioc.bridge;
                this.windowsController = ioc.windowsController;
                this.addOperationsExecutors();
                const api = this.toApi();
                this.logger.trace("no need for platform registration, attaching the layouts property to glue and returning");
                coreGlue.layouts = api;
            });
        }
        handleBridgeMessage(args) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const operationName = layoutsOperationTypesDecoder.runWithException(args.operation);
                const operation = operations$7[operationName];
                if (!operation.execute) {
                    return;
                }
                let operationData = args.data;
                if (operation.dataDecoder) {
                    operationData = operation.dataDecoder.runWithException(args.data);
                }
                return yield operation.execute(operationData);
            });
        }
        toApi() {
            const api = {
                get: this.get.bind(this),
                getAll: this.getAll.bind(this),
                export: this.export.bind(this),
                import: this.import.bind(this),
                save: this.save.bind(this),
                restore: this.restore.bind(this),
                remove: this.remove.bind(this),
                onAdded: this.onAdded.bind(this),
                onChanged: this.onChanged.bind(this),
                onRemoved: this.onRemoved.bind(this),
                onSaveRequested: this.subscribeOnSaveRequested.bind(this),
                getMultiScreenPermissionState: this.getGlobalPermissionState.bind(this),
                requestMultiScreenPermission: this.requestGlobalPermission.bind(this),
                getGlobalTypeState: this.checkGlobalActivated.bind(this),
                getDefaultGlobal: this.getDefaultGlobal.bind(this),
                setDefaultGlobal: this.setDefaultGlobal.bind(this),
                clearDefaultGlobal: this.clearDefaultGlobal.bind(this)
            };
            return Object.freeze(api);
        }
        addOperationsExecutors() {
            operations$7.layoutAdded.execute = this.handleOnAdded.bind(this);
            operations$7.layoutChanged.execute = this.handleOnChanged.bind(this);
            operations$7.layoutRemoved.execute = this.handleOnRemoved.bind(this);
            operations$7.clientSaveRequest.execute = this.handleSaveRequest.bind(this);
        }
        get(name, type) {
            return __awaiter$1(this, void 0, void 0, function* () {
                nonEmptyStringDecoder.runWithException(name);
                layoutTypeDecoder.runWithException(type);
                const result = yield this.bridge.send("layouts", operations$7.get, { name, type });
                return result.layout;
            });
        }
        getAll(type) {
            return __awaiter$1(this, void 0, void 0, function* () {
                layoutTypeDecoder.runWithException(type);
                const result = yield this.bridge.send("layouts", operations$7.getAll, { type });
                return result.summaries;
            });
        }
        export(type) {
            return __awaiter$1(this, void 0, void 0, function* () {
                layoutTypeDecoder.runWithException(type);
                const result = yield this.bridge.send("layouts", operations$7.export, { type });
                return result.layouts;
            });
        }
        import(layouts, mode = "replace") {
            return __awaiter$1(this, void 0, void 0, function* () {
                importModeDecoder.runWithException(mode);
                if (!Array.isArray(layouts)) {
                    throw new Error("Import must be called with an array of layouts");
                }
                if (layouts.length > 1000) {
                    throw new Error("Cannot import more than 1000 layouts at once in Glue42 Core.");
                }
                const parseResult = layouts.reduce((soFar, layout) => {
                    const decodeResult = glueLayoutDecoder.run(layout);
                    if (decodeResult.ok) {
                        soFar.valid.push(layout);
                    }
                    else {
                        this.logger.warn(`A layout with name: ${layout.name} was not imported, because of error: ${JSON.stringify(decodeResult.error)}`);
                    }
                    return soFar;
                }, { valid: [] });
                const layoutsToImport = layouts.filter((layout) => parseResult.valid.some((validLayout) => validLayout.name === layout.name));
                yield this.bridge.send("layouts", operations$7.import, { layouts: layoutsToImport, mode });
            });
        }
        save(layout) {
            return __awaiter$1(this, void 0, void 0, function* () {
                newLayoutOptionsDecoder.runWithException(layout);
                const saveResult = yield this.bridge.send("layouts", operations$7.save, { layout });
                return saveResult.layout;
            });
        }
        restore(options) {
            return __awaiter$1(this, void 0, void 0, function* () {
                restoreOptionsDecoder.runWithException(options);
                const invocationTimeout = options.timeout ? options.timeout * 2 : this.defaultLayoutRestoreTimeoutMS;
                yield this.bridge.send("layouts", operations$7.restore, { layout: options }, { methodResponseTimeoutMs: invocationTimeout });
            });
        }
        remove(type, name) {
            return __awaiter$1(this, void 0, void 0, function* () {
                layoutTypeDecoder.runWithException(type);
                nonEmptyStringDecoder.runWithException(name);
                yield this.bridge.send("layouts", operations$7.remove, { type, name });
            });
        }
        handleSaveRequest(config) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const response = {};
                if (this.saveRequestSubscription) {
                    try {
                        const onSaveRequestResponse = this.saveRequestSubscription(config);
                        response.windowContext = onSaveRequestResponse === null || onSaveRequestResponse === void 0 ? void 0 : onSaveRequestResponse.windowContext;
                    }
                    catch (error) {
                        this.logger.warn(`An error was thrown by the onSaveRequested callback, ignoring the callback: ${JSON.stringify(error)}`);
                    }
                }
                return response;
            });
        }
        getGlobalPermissionState() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const requestResult = yield this.bridge.send("layouts", operations$7.getGlobalPermissionState, undefined);
                return requestResult;
            });
        }
        requestGlobalPermission() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const currentState = (yield this.getGlobalPermissionState()).state;
                if (currentState === "denied") {
                    return { permissionGranted: false };
                }
                if (currentState === "granted") {
                    return { permissionGranted: true };
                }
                const myWindow = this.windowsController.my();
                const globalNamespace = window.glue42core || window.iobrowser;
                const amIWorkspaceFrame = globalNamespace.isPlatformFrame;
                if (myWindow.name !== "Platform" && !amIWorkspaceFrame) {
                    throw new Error("Cannot request permission for multi-window placement from any app other than the Platform.");
                }
                const requestResult = yield this.bridge.send("layouts", operations$7.requestGlobalPermission, undefined, { methodResponseTimeoutMs: 180000 });
                return { permissionGranted: requestResult.isAvailable };
            });
        }
        checkGlobalActivated() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const requestResult = yield this.bridge.send("layouts", operations$7.checkGlobalActivated, undefined);
                return { activated: requestResult.isAvailable };
            });
        }
        getDefaultGlobal() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const requestResult = yield this.bridge.send("layouts", operations$7.getDefaultGlobal, undefined, undefined, { includeOperationCheck: true });
                return requestResult.layout;
            });
        }
        setDefaultGlobal(name) {
            return __awaiter$1(this, void 0, void 0, function* () {
                nonEmptyStringDecoder.runWithException(name);
                yield this.bridge.send("layouts", operations$7.setDefaultGlobal, { name }, undefined, { includeOperationCheck: true });
            });
        }
        clearDefaultGlobal() {
            return __awaiter$1(this, void 0, void 0, function* () {
                yield this.bridge.send("layouts", operations$7.clearDefaultGlobal, undefined, undefined, { includeOperationCheck: true });
            });
        }
        onAdded(callback) {
            this.export("Global").then((layouts) => layouts.forEach((layout) => callback(layout))).catch(() => { });
            this.export("Workspace").then((layouts) => layouts.forEach((layout) => callback(layout))).catch(() => { });
            return this.registry.add(operations$7.layoutAdded.name, callback);
        }
        onChanged(callback) {
            return this.registry.add(operations$7.layoutChanged.name, callback);
        }
        onRemoved(callback) {
            return this.registry.add(operations$7.layoutRemoved.name, callback);
        }
        subscribeOnSaveRequested(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to onSaveRequested, because the provided argument is not a valid callback function.");
            }
            if (this.saveRequestSubscription) {
                throw new Error("Cannot subscribe to onSaveRequested, because this client has already subscribed and only one subscription is supported. Consider unsubscribing from the initial one.");
            }
            this.saveRequestSubscription = callback;
            return () => {
                delete this.saveRequestSubscription;
            };
        }
        handleOnAdded(layout) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.registry.execute(operations$7.layoutAdded.name, layout);
            });
        }
        handleOnChanged(layout) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.registry.execute(operations$7.layoutChanged.name, layout);
            });
        }
        handleOnRemoved(layout) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.registry.execute(operations$7.layoutRemoved.name, layout);
            });
        }
    }

    const operations$6 = {
        raiseNotification: { name: "raiseNotification", dataDecoder: raiseNotificationDecoder, resultDecoder: raiseNotificationResultDecoder },
        requestPermission: { name: "requestPermission", resultDecoder: permissionRequestResultDecoder },
        notificationShow: { name: "notificationShow", dataDecoder: notificationEventPayloadDecoder },
        notificationClick: { name: "notificationClick", dataDecoder: notificationEventPayloadDecoder },
        getPermission: { name: "getPermission", resultDecoder: permissionQueryResultDecoder },
        list: { name: "list", resultDecoder: allNotificationsDataDecoder },
        notificationRaised: { name: "notificationRaised", dataDecoder: simpleNotificationDataDecoder },
        notificationClosed: { name: "notificationClosed", dataDecoder: simpleNotificationSelectDecoder },
        click: { name: "click" },
        clear: { name: "clear" },
        clearAll: { name: "clearAll" },
        clearOld: { name: "clearOld" },
        configure: { name: "configure", dataDecoder: notificationsConfigurationProtocolDecoder },
        getConfiguration: { name: "getConfiguration", resultDecoder: strictNotificationsConfigurationProtocolDecoder },
        configurationChanged: { name: "configurationChanged", resultDecoder: strictNotificationsConfigurationProtocolDecoder },
        setState: { name: "setState", dataDecoder: notificationSetStateRequestDecoder },
        activeCountChange: { name: "activeCountChange", resultDecoder: activeNotificationsCountChangeDecoder },
        stateChange: { name: "stateChange", resultDecoder: notificationSetStateRequestDecoder }
    };

    var shortidExports$1 = {};
    var shortid$3 = {
      get exports(){ return shortidExports$1; },
      set exports(v){ shortidExports$1 = v; },
    };

    var libExports$1 = {};
    var lib$2 = {
      get exports(){ return libExports$1; },
      set exports(v){ libExports$1 = v; },
    };

    // Found this seed-based random generator somewhere
    // Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

    var seed$1 = 1;

    /**
     * return a random number based on a seed
     * @param seed
     * @returns {number}
     */
    function getNextValue$1() {
        seed$1 = (seed$1 * 9301 + 49297) % 233280;
        return seed$1/(233280.0);
    }

    function setSeed$3(_seed_) {
        seed$1 = _seed_;
    }

    var randomFromSeed$3 = {
        nextValue: getNextValue$1,
        seed: setSeed$3
    };

    var randomFromSeed$2 = randomFromSeed$3;

    var ORIGINAL$1 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
    var alphabet$5;
    var previousSeed$1;

    var shuffled$1;

    function reset$1() {
        shuffled$1 = false;
    }

    function setCharacters$1(_alphabet_) {
        if (!_alphabet_) {
            if (alphabet$5 !== ORIGINAL$1) {
                alphabet$5 = ORIGINAL$1;
                reset$1();
            }
            return;
        }

        if (_alphabet_ === alphabet$5) {
            return;
        }

        if (_alphabet_.length !== ORIGINAL$1.length) {
            throw new Error('Custom alphabet for shortid must be ' + ORIGINAL$1.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
        }

        var unique = _alphabet_.split('').filter(function(item, ind, arr){
           return ind !== arr.lastIndexOf(item);
        });

        if (unique.length) {
            throw new Error('Custom alphabet for shortid must be ' + ORIGINAL$1.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
        }

        alphabet$5 = _alphabet_;
        reset$1();
    }

    function characters$1(_alphabet_) {
        setCharacters$1(_alphabet_);
        return alphabet$5;
    }

    function setSeed$2(seed) {
        randomFromSeed$2.seed(seed);
        if (previousSeed$1 !== seed) {
            reset$1();
            previousSeed$1 = seed;
        }
    }

    function shuffle$1() {
        if (!alphabet$5) {
            setCharacters$1(ORIGINAL$1);
        }

        var sourceArray = alphabet$5.split('');
        var targetArray = [];
        var r = randomFromSeed$2.nextValue();
        var characterIndex;

        while (sourceArray.length > 0) {
            r = randomFromSeed$2.nextValue();
            characterIndex = Math.floor(r * sourceArray.length);
            targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
        }
        return targetArray.join('');
    }

    function getShuffled$1() {
        if (shuffled$1) {
            return shuffled$1;
        }
        shuffled$1 = shuffle$1();
        return shuffled$1;
    }

    /**
     * lookup shuffled letter
     * @param index
     * @returns {string}
     */
    function lookup$1(index) {
        var alphabetShuffled = getShuffled$1();
        return alphabetShuffled[index];
    }

    function get$1 () {
      return alphabet$5 || ORIGINAL$1;
    }

    var alphabet_1$1 = {
        get: get$1,
        characters: characters$1,
        seed: setSeed$2,
        lookup: lookup$1,
        shuffled: getShuffled$1
    };

    var crypto$1 = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

    var randomByte$1;

    if (!crypto$1 || !crypto$1.getRandomValues) {
        randomByte$1 = function(size) {
            var bytes = [];
            for (var i = 0; i < size; i++) {
                bytes.push(Math.floor(Math.random() * 256));
            }
            return bytes;
        };
    } else {
        randomByte$1 = function(size) {
            return crypto$1.getRandomValues(new Uint8Array(size));
        };
    }

    var randomByteBrowser$1 = randomByte$1;

    // This file replaces `format.js` in bundlers like webpack or Rollup,
    // according to `browser` config in `package.json`.

    var format_browser$1 = function (random, alphabet, size) {
      // We can’t use bytes bigger than the alphabet. To make bytes values closer
      // to the alphabet, we apply bitmask on them. We look for the closest
      // `2 ** x - 1` number, which will be bigger than alphabet size. If we have
      // 30 symbols in the alphabet, we will take 31 (00011111).
      // We do not use faster Math.clz32, because it is not available in browsers.
      var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;
      // Bitmask is not a perfect solution (in our example it will pass 31 bytes,
      // which is bigger than the alphabet). As a result, we will need more bytes,
      // than ID size, because we will refuse bytes bigger than the alphabet.

      // Every hardware random generator call is costly,
      // because we need to wait for entropy collection. This is why often it will
      // be faster to ask for few extra bytes in advance, to avoid additional calls.

      // Here we calculate how many random bytes should we call in advance.
      // It depends on ID length, mask / alphabet size and magic number 1.6
      // (which was selected according benchmarks).

      // -~f => Math.ceil(f) if n is float number
      // -~i => i + 1 if n is integer number
      var step = -~(1.6 * mask * size / alphabet.length);
      var id = '';

      while (true) {
        var bytes = random(step);
        // Compact alternative for `for (var i = 0; i < step; i++)`
        var i = step;
        while (i--) {
          // If random byte is bigger than alphabet even after bitmask,
          // we refuse it by `|| ''`.
          id += alphabet[bytes[i] & mask] || '';
          // More compact than `id.length + 1 === size`
          if (id.length === +size) return id
        }
      }
    };

    var alphabet$4 = alphabet_1$1;
    var random$1 = randomByteBrowser$1;
    var format$1 = format_browser$1;

    function generate$3(number) {
        var loopCounter = 0;
        var done;

        var str = '';

        while (!done) {
            str = str + format$1(random$1, alphabet$4.get(), 1);
            done = number < (Math.pow(16, loopCounter + 1 ) );
            loopCounter++;
        }
        return str;
    }

    var generate_1$1 = generate$3;

    var generate$2 = generate_1$1;

    // Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
    // This number should be updated every year or so to keep the generated id short.
    // To regenerate `new Date() - 0` and bump the version. Always bump the version!
    var REDUCE_TIME$1 = 1567752802062;

    // don't change unless we change the algos or REDUCE_TIME
    // must be an integer and less than 16
    var version$3 = 7;

    // Counter is used when shortid is called multiple times in one second.
    var counter$1;

    // Remember the last time shortid was called in case counter is needed.
    var previousSeconds$1;

    /**
     * Generate unique id
     * Returns string id
     */
    function build$1(clusterWorkerId) {
        var str = '';

        var seconds = Math.floor((Date.now() - REDUCE_TIME$1) * 0.001);

        if (seconds === previousSeconds$1) {
            counter$1++;
        } else {
            counter$1 = 0;
            previousSeconds$1 = seconds;
        }

        str = str + generate$2(version$3);
        str = str + generate$2(clusterWorkerId);
        if (counter$1 > 0) {
            str = str + generate$2(counter$1);
        }
        str = str + generate$2(seconds);
        return str;
    }

    var build_1$1 = build$1;

    var alphabet$3 = alphabet_1$1;

    function isShortId$1(id) {
        if (!id || typeof id !== 'string' || id.length < 6 ) {
            return false;
        }

        var nonAlphabetic = new RegExp('[^' +
          alphabet$3.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
        ']');
        return !nonAlphabetic.test(id);
    }

    var isValid$1 = isShortId$1;

    (function (module) {

    	var alphabet = alphabet_1$1;
    	var build = build_1$1;
    	var isValid = isValid$1;

    	// if you are using cluster or multiple servers use this to make each instance
    	// has a unique value for worker
    	// Note: I don't know if this is automatically set when using third
    	// party cluster solutions such as pm2.
    	var clusterWorkerId = 0;

    	/**
    	 * Set the seed.
    	 * Highly recommended if you don't want people to try to figure out your id schema.
    	 * exposed as shortid.seed(int)
    	 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
    	 */
    	function seed(seedValue) {
    	    alphabet.seed(seedValue);
    	    return module.exports;
    	}

    	/**
    	 * Set the cluster worker or machine id
    	 * exposed as shortid.worker(int)
    	 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
    	 * returns shortid module so it can be chained.
    	 */
    	function worker(workerId) {
    	    clusterWorkerId = workerId;
    	    return module.exports;
    	}

    	/**
    	 *
    	 * sets new characters to use in the alphabet
    	 * returns the shuffled alphabet
    	 */
    	function characters(newCharacters) {
    	    if (newCharacters !== undefined) {
    	        alphabet.characters(newCharacters);
    	    }

    	    return alphabet.shuffled();
    	}

    	/**
    	 * Generate unique id
    	 * Returns string id
    	 */
    	function generate() {
    	  return build(clusterWorkerId);
    	}

    	// Export all other functions as properties of the generate function
    	module.exports = generate;
    	module.exports.generate = generate;
    	module.exports.seed = seed;
    	module.exports.worker = worker;
    	module.exports.characters = characters;
    	module.exports.isValid = isValid;
    } (lib$2));

    (function (module) {
    	module.exports = libExports$1;
    } (shortid$3));

    var shortid$2 = /*@__PURE__*/getDefaultExportFromCjs$1(shortidExports$1);

    class NotificationsController {
        constructor() {
            this.registry = lib$3();
            this.notifications = {};
        }
        handlePlatformShutdown() {
            this.notifications = {};
            this.registry.clear();
        }
        start(coreGlue, ioc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.logger = coreGlue.logger.subLogger("notifications.controller.web");
                this.logger.trace("starting the web notifications controller");
                this.bridge = ioc.bridge;
                this.coreGlue = coreGlue;
                this.notificationsSettings = ioc.config.notifications;
                this.buildNotificationFunc = ioc.buildNotification;
                const api = this.toApi();
                this.addOperationExecutors();
                coreGlue.notifications = api;
                this.logger.trace("notifications are ready");
            });
        }
        handleBridgeMessage(args) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const operationName = notificationsOperationTypesDecoder.runWithException(args.operation);
                const operation = operations$6[operationName];
                if (!operation.execute) {
                    return;
                }
                let operationData = args.data;
                if (operation.dataDecoder) {
                    operationData = operation.dataDecoder.runWithException(args.data);
                }
                return yield operation.execute(operationData);
            });
        }
        toApi() {
            const api = {
                raise: this.raise.bind(this),
                requestPermission: this.requestPermission.bind(this),
                getPermission: this.getPermission.bind(this),
                list: this.list.bind(this),
                onRaised: this.onRaised.bind(this),
                onClosed: this.onClosed.bind(this),
                click: this.click.bind(this),
                clear: this.clear.bind(this),
                clearAll: this.clearAll.bind(this),
                clearOld: this.clearOld.bind(this),
                configure: this.configure.bind(this),
                getConfiguration: this.getConfiguration.bind(this),
                getFilter: this.getFilter.bind(this),
                setFilter: this.setFilter.bind(this),
                setState: this.setState.bind(this),
                onConfigurationChanged: this.onConfigurationChanged.bind(this),
                onActiveCountChanged: this.onActiveCountChanged.bind(this),
                onStateChanged: this.onStateChanged.bind(this)
            };
            return Object.freeze(api);
        }
        getPermission() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const queryResult = yield this.bridge.send("notifications", operations$6.getPermission, undefined);
                return queryResult.permission;
            });
        }
        requestPermission() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const permissionResult = yield this.bridge.send("notifications", operations$6.requestPermission, undefined);
                return permissionResult.permissionGranted;
            });
        }
        raise(options) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const settings = glue42NotificationOptionsDecoder.runWithException(options);
                settings.showToast = typeof settings.showToast === "boolean" ? settings.showToast : true;
                settings.showInPanel = typeof settings.showInPanel === "boolean" ? settings.showInPanel : true;
                const permissionGranted = yield this.requestPermission();
                if (!permissionGranted) {
                    throw new Error("Cannot raise the notification, because the user has declined the permission request");
                }
                const id = shortidExports$1.generate();
                const raiseResult = yield this.bridge.send("notifications", operations$6.raiseNotification, { settings, id });
                const notification = this.buildNotificationFunc(raiseResult.settings, id);
                this.notifications[id] = notification;
                return notification;
            });
        }
        list() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const bridgeResponse = yield this.bridge.send("notifications", operations$6.list, undefined, undefined, { includeOperationCheck: true });
                return bridgeResponse.notifications;
            });
        }
        onRaised(callback) {
            if (typeof callback !== "function") {
                throw new Error("onRaised expects a callback of type function");
            }
            return this.registry.add("notification-raised", callback);
        }
        onClosed(callback) {
            if (typeof callback !== "function") {
                throw new Error("onRaised expects a callback of type function");
            }
            return this.registry.add("notification-closed", callback);
        }
        click(id, action) {
            return __awaiter$1(this, void 0, void 0, function* () {
                nonEmptyStringDecoder.runWithException(id);
                if (action) {
                    nonEmptyStringDecoder.runWithException(action);
                }
                yield this.bridge.send("notifications", operations$6.click, { id, action }, undefined, { includeOperationCheck: true });
            });
        }
        clear(id) {
            return __awaiter$1(this, void 0, void 0, function* () {
                nonEmptyStringDecoder.runWithException(id);
                yield this.bridge.send("notifications", operations$6.clear, { id }, undefined, { includeOperationCheck: true });
            });
        }
        clearAll() {
            return __awaiter$1(this, void 0, void 0, function* () {
                yield this.bridge.send("notifications", operations$6.clearAll, undefined, undefined, { includeOperationCheck: true });
            });
        }
        clearOld() {
            return __awaiter$1(this, void 0, void 0, function* () {
                yield this.bridge.send("notifications", operations$6.clearOld, undefined, undefined, { includeOperationCheck: true });
            });
        }
        configure(config) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const verifiedConfig = notificationsConfigurationDecoder.runWithException(config);
                yield this.bridge.send("notifications", operations$6.configure, { configuration: verifiedConfig }, undefined, { includeOperationCheck: true });
            });
        }
        getConfiguration() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const response = yield this.bridge.send("notifications", operations$6.getConfiguration, undefined, undefined, { includeOperationCheck: true });
                return response.configuration;
            });
        }
        getFilter() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const response = yield this.bridge.send("notifications", operations$6.getConfiguration, undefined, undefined, { includeOperationCheck: true });
                return response.configuration.sourceFilter;
            });
        }
        setFilter(filter) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const verifiedFilter = notificationFilterDecoder.runWithException(filter);
                yield this.bridge.send("notifications", operations$6.configure, { configuration: { sourceFilter: verifiedFilter } }, undefined, { includeOperationCheck: true });
                return verifiedFilter;
            });
        }
        setState(id, state) {
            return __awaiter$1(this, void 0, void 0, function* () {
                nonEmptyStringDecoder.runWithException(id);
                notificationStateDecoder.runWithException(state);
                yield this.bridge.send("notifications", operations$6.setState, { id, state }, undefined, { includeOperationCheck: true });
            });
        }
        onConfigurationChanged(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to configuration changed, because the provided callback is not a function!");
            }
            return this.registry.add("notifications-config-changed", callback);
        }
        onActiveCountChanged(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to onActiveCountChanged changed, because the provided callback is not a function!");
            }
            return this.registry.add("notifications-active-count-changed", callback);
        }
        onStateChanged(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to onStateChanged changed, because the provided callback is not a function!");
            }
            return this.registry.add("notification-state-changed", callback);
        }
        addOperationExecutors() {
            operations$6.notificationShow.execute = this.handleNotificationShow.bind(this);
            operations$6.notificationClick.execute = this.handleNotificationClick.bind(this);
            operations$6.notificationRaised.execute = this.handleNotificationRaised.bind(this);
            operations$6.notificationClosed.execute = this.handleNotificationClosed.bind(this);
            operations$6.configurationChanged.execute = this.handleConfigurationChanged.bind(this);
            operations$6.activeCountChange.execute = this.handleActiveCountChanged.bind(this);
            operations$6.stateChange.execute = this.handleNotificationStateChanged.bind(this);
        }
        handleConfigurationChanged(data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.registry.execute("notifications-config-changed", data.configuration);
            });
        }
        handleActiveCountChanged(data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.registry.execute("notifications-active-count-changed", data);
            });
        }
        handleNotificationStateChanged(data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.registry.execute("notification-state-changed", { id: data.id }, data.state);
            });
        }
        handleNotificationShow(data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (!data.id) {
                    return;
                }
                const notification = this.notifications[data.id];
                if (notification && notification.onshow) {
                    notification.onshow();
                }
            });
        }
        handleNotificationClick(data) {
            var _a, _b, _c, _d, _e;
            return __awaiter$1(this, void 0, void 0, function* () {
                if (!data.action && ((_a = this.notificationsSettings) === null || _a === void 0 ? void 0 : _a.defaultClick)) {
                    this.notificationsSettings.defaultClick(this.coreGlue, data.definition);
                }
                if (data.action && ((_c = (_b = this.notificationsSettings) === null || _b === void 0 ? void 0 : _b.actionClicks) === null || _c === void 0 ? void 0 : _c.some((actionDef) => actionDef.action === data.action))) {
                    const foundHandler = (_e = (_d = this.notificationsSettings) === null || _d === void 0 ? void 0 : _d.actionClicks) === null || _e === void 0 ? void 0 : _e.find((actionDef) => actionDef.action === data.action);
                    foundHandler.handler(this.coreGlue, data.definition);
                }
                if (!data.id) {
                    return;
                }
                const notification = this.notifications[data.id];
                if (notification && notification.onclick) {
                    notification.onclick();
                    delete this.notifications[data.id];
                }
            });
        }
        handleNotificationRaised(data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.registry.execute("notification-raised", data.notification);
            });
        }
        handleNotificationClosed(data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.registry.execute("notification-closed", data);
            });
        }
    }

    const operations$5 = {
        getIntents: { name: "getIntents", resultDecoder: wrappedIntentsDecoder },
        findIntent: { name: "findIntent", dataDecoder: wrappedIntentFilterDecoder, resultDecoder: wrappedIntentsDecoder },
        raiseIntent: { name: "raiseIntent", dataDecoder: intentRequestDecoder, resultDecoder: intentResultDecoder },
        raise: { name: "raise", dataDecoder: raiseIntentRequestDecoder, resultDecoder: intentResultDecoder },
        filterHandlers: { name: "filterHandlers", dataDecoder: filterHandlersWithResolverConfigDecoder, resultDecoder: filterHandlersResultDecoder },
        getIntentsByHandler: { name: "getIntentsByHandler", dataDecoder: intentHandlerDecoder, resultDecoder: getIntentsResultDecoder }
    };

    const GLUE42_FDC3_INTENTS_METHOD_PREFIX = "Tick42.FDC3.Intents.";
    const INTENTS_RESOLVER_INTEROP_PREFIX = "T42.Intents.Resolver.Control.";
    const INTENTS_RESOLVER_APP_NAME = "intentsResolver";
    const DEFAULT_RESOLVER_RESPONSE_TIMEOUT = 60 * 1000;
    const ADDITIONAL_BRIDGE_OPERATION_TIMEOUT = 30 * 1000;
    const INTENTS_RESOLVER_WIDTH = 400;
    const INTENTS_RESOLVER_HEIGHT = 440;
    const MAX_SET_TIMEOUT_DELAY = 2147483647;
    const DEFAULT_PICK_HANDLER_BY_TIMEOUT = 90 * 1000;

    class IntentsController {
        constructor() {
            this.myIntents = new Set();
            this.useIntentsResolverUI = true;
            this.unregisterIntentPromises = [];
        }
        start(coreGlue, ioc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.logger = coreGlue.logger.subLogger("intents.controller.web");
                this.logger.trace("starting the web intents controller");
                this.bridge = ioc.bridge;
                this.interop = coreGlue.interop;
                this.legacyIntentsController = ioc.legacyIntentsHelper;
                this.checkIfIntentsResolverIsEnabled(ioc.config);
                const api = this.toApi();
                this.logger.trace("no need for platform registration, attaching the intents property to glue and returning");
                coreGlue.intents = api;
            });
        }
        handlePlatformShutdown() {
            this.myIntents = new Set();
            this.unregisterIntentPromises = [];
        }
        handleBridgeMessage(args) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const operationName = intentsOperationTypesDecoder.runWithException(args.operation);
                const operation = operations$5[operationName];
                if (!operation.execute) {
                    return;
                }
                let operationData = args.data;
                if (operation.dataDecoder) {
                    operationData = operation.dataDecoder.runWithException(args.data);
                }
                return yield operation.execute(operationData);
            });
        }
        toApi() {
            const api = {
                raise: this.raise.bind(this),
                all: this.all.bind(this),
                addIntentListener: this.addIntentListener.bind(this),
                register: this.register.bind(this),
                find: this.find.bind(this),
                filterHandlers: this.filterHandlers.bind(this),
                getIntents: this.getIntentsByHandler.bind(this)
            };
            return api;
        }
        raise(request) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const validatedIntentRequest = raiseRequestDecoder.runWithException(request);
                const intentRequest = typeof validatedIntentRequest === "string"
                    ? { intent: validatedIntentRequest }
                    : validatedIntentRequest;
                yield Promise.all(this.unregisterIntentPromises);
                const requestWithResolverInfo = { intentRequest, resolverConfig: this.getResolverConfigByRequest({ intentRequest }) };
                const isRaiseOperationSupported = yield this.isRaiseOperationSupported();
                if (!isRaiseOperationSupported.supported) {
                    this.logger.warn(`${isRaiseOperationSupported.reason}. Invoking legacy raise method`);
                    return this.legacyIntentsController.raise(requestWithResolverInfo, this.find.bind(this));
                }
                this.logger.trace(`Sending raise request to the platform: ${JSON.stringify(request)} and method response timeout of ${this.intentResolverResponseTimeout}ms`);
                const methodResponseTimeoutMs = intentRequest.waitUserResponseIndefinitely
                    ? MAX_SET_TIMEOUT_DELAY
                    : (intentRequest.timeout || this.intentResolverResponseTimeout) + ADDITIONAL_BRIDGE_OPERATION_TIMEOUT;
                const response = yield this.bridge.send("intents", operations$5.raise, requestWithResolverInfo, { methodResponseTimeoutMs, waitTimeoutMs: methodResponseTimeoutMs });
                return response;
            });
        }
        getResolverConfigByRequest(filter) {
            var _a, _b, _c, _d;
            if (filter.handlerFilter) {
                return {
                    enabled: typeof ((_a = filter.handlerFilter) === null || _a === void 0 ? void 0 : _a.openResolver) === "boolean" ? (_b = filter.handlerFilter) === null || _b === void 0 ? void 0 : _b.openResolver : this.useIntentsResolverUI,
                    appName: this.intentsResolverAppName,
                    waitResponseTimeout: ((_c = filter.handlerFilter) === null || _c === void 0 ? void 0 : _c.timeout) || DEFAULT_PICK_HANDLER_BY_TIMEOUT
                };
            }
            const waitResponseTimeout = ((_d = filter.intentRequest) === null || _d === void 0 ? void 0 : _d.waitUserResponseIndefinitely) ? MAX_SET_TIMEOUT_DELAY : this.intentResolverResponseTimeout;
            return {
                enabled: this.useIntentsResolverUI,
                appName: this.intentsResolverAppName,
                waitResponseTimeout
            };
        }
        isRaiseOperationSupported() {
            return __awaiter$1(this, void 0, void 0, function* () {
                try {
                    const { isSupported } = yield this.bridge.send("intents", systemOperations.operationCheck, { operation: "raise" });
                    return {
                        supported: isSupported,
                        reason: isSupported ? "" : "The platform of this client is outdated and does not support \"raise\" operation"
                    };
                }
                catch (error) {
                    return {
                        supported: false,
                        reason: "The platform of this client is outdated and does not support \"operationCheck\" command"
                    };
                }
            });
        }
        all() {
            return __awaiter$1(this, void 0, void 0, function* () {
                yield Promise.all(this.unregisterIntentPromises);
                const result = yield this.bridge.send("intents", operations$5.getIntents, undefined);
                return result.intents;
            });
        }
        addIntentListener(intent, handler) {
            AddIntentListenerDecoder.runWithException(intent);
            if (typeof handler !== "function") {
                throw new Error("Cannot add intent listener, because the provided handler is not a function!");
            }
            let registerPromise;
            const intentName = typeof intent === "string" ? intent : intent.intent;
            const methodName = this.buildInteropMethodName(intentName);
            const alreadyRegistered = this.myIntents.has(intentName);
            if (alreadyRegistered) {
                throw new Error(`Intent listener for intent ${intentName} already registered!`);
            }
            this.myIntents.add(intentName);
            const result = {
                unsubscribe: () => {
                    this.myIntents.delete(intentName);
                    registerPromise
                        .then(() => this.interop.unregister(methodName))
                        .catch((err) => this.logger.trace(`Unregistration of a method with name ${methodName} failed with reason: ${err}`));
                }
            };
            let intentFlag = {};
            if (typeof intent === "object") {
                const rest = __rest$2(intent, ["intent"]);
                intentFlag = rest;
            }
            registerPromise = this.interop.register({ name: methodName, flags: { intent: intentFlag } }, (args) => {
                if (this.myIntents.has(intentName)) {
                    const rest = __rest$2(args, ["_initialCallerId"]);
                    return handler(rest);
                }
            });
            registerPromise.catch(err => {
                this.myIntents.delete(intentName);
                this.logger.warn(`Registration of a method with name ${methodName} failed with reason: ${err}`);
            });
            return result;
        }
        register(intent, handler) {
            return __awaiter$1(this, void 0, void 0, function* () {
                AddIntentListenerDecoder.runWithException(intent);
                if (typeof handler !== "function") {
                    throw new Error("Cannot add intent listener, because the provided handler is not a function!");
                }
                yield Promise.all(this.unregisterIntentPromises);
                const intentName = typeof intent === "string" ? intent : intent.intent;
                const methodName = this.buildInteropMethodName(intentName);
                const alreadyRegistered = this.myIntents.has(intentName);
                if (alreadyRegistered) {
                    throw new Error(`Intent listener for intent ${intentName} already registered!`);
                }
                this.myIntents.add(intentName);
                let intentFlag = {};
                if (typeof intent === "object") {
                    const rest = __rest$2(intent, ["intent"]);
                    intentFlag = rest;
                }
                try {
                    yield this.interop.register({ name: methodName, flags: { intent: intentFlag } }, (args) => {
                        if (this.myIntents.has(intentName)) {
                            const { _initialCallerId } = args, rest = __rest$2(args, ["_initialCallerId"]);
                            const caller = this.interop.servers().find((server) => server.instance === _initialCallerId);
                            return handler(rest, caller);
                        }
                    });
                }
                catch (err) {
                    this.myIntents.delete(intentName);
                    throw new Error(`Registration of a method with name ${methodName} failed with reason: ${JSON.stringify(err)}`);
                }
                return {
                    unsubscribe: () => this.unsubscribeIntent(intentName)
                };
            });
        }
        find(intentFilter) {
            return __awaiter$1(this, void 0, void 0, function* () {
                let data = undefined;
                if (typeof intentFilter !== "undefined") {
                    const intentFilterObj = findFilterDecoder.runWithException(intentFilter);
                    if (typeof intentFilterObj === "string") {
                        data = {
                            filter: {
                                name: intentFilterObj
                            }
                        };
                    }
                    else if (typeof intentFilterObj === "object") {
                        data = {
                            filter: intentFilterObj
                        };
                    }
                }
                yield Promise.all(this.unregisterIntentPromises);
                const result = yield this.bridge.send("intents", operations$5.findIntent, data);
                return result.intents;
            });
        }
        checkIfIntentsResolverIsEnabled(options) {
            var _a, _b, _c, _d, _e;
            this.useIntentsResolverUI = typeof ((_a = options.intents) === null || _a === void 0 ? void 0 : _a.enableIntentsResolverUI) === "boolean"
                ? options.intents.enableIntentsResolverUI
                : true;
            this.intentsResolverAppName = (_c = (_b = options.intents) === null || _b === void 0 ? void 0 : _b.intentsResolverAppName) !== null && _c !== void 0 ? _c : INTENTS_RESOLVER_APP_NAME;
            this.intentResolverResponseTimeout = (_e = (_d = options.intents) === null || _d === void 0 ? void 0 : _d.methodResponseTimeoutMs) !== null && _e !== void 0 ? _e : DEFAULT_RESOLVER_RESPONSE_TIMEOUT;
        }
        clearUnregistrationPromise(promiseToRemove) {
            this.unregisterIntentPromises = this.unregisterIntentPromises.filter(promise => promise !== promiseToRemove);
        }
        buildInteropMethodName(intentName) {
            return `${GLUE42_FDC3_INTENTS_METHOD_PREFIX}${intentName}`;
        }
        unsubscribeIntent(intentName) {
            this.myIntents.delete(intentName);
            const methodName = this.buildInteropMethodName(intentName);
            const unregisterPromise = this.interop.unregister(methodName);
            this.unregisterIntentPromises.push(unregisterPromise);
            unregisterPromise
                .then(() => {
                this.clearUnregistrationPromise(unregisterPromise);
            })
                .catch((err) => {
                this.logger.error(`Unregistration of a method with name ${methodName} failed with reason: ${err}`);
                this.clearUnregistrationPromise(unregisterPromise);
            });
        }
        filterHandlers(handlerFilter) {
            return __awaiter$1(this, void 0, void 0, function* () {
                handlersFilterDecoder.runWithException(handlerFilter);
                this.checkIfAtLeastOneFilterIsPresent(handlerFilter);
                if (handlerFilter.openResolver && !this.useIntentsResolverUI) {
                    throw new Error("Cannot resolve 'filterHandlers' request using Intents Resolver UI because it's globally disabled");
                }
                const methodResponseTimeoutMs = (handlerFilter.timeout || DEFAULT_PICK_HANDLER_BY_TIMEOUT) + ADDITIONAL_BRIDGE_OPERATION_TIMEOUT;
                const filterHandlersRequestWithResolverConfig = { filterHandlersRequest: handlerFilter, resolverConfig: this.getResolverConfigByRequest({ handlerFilter }) };
                const result = yield this.bridge.send("intents", operations$5.filterHandlers, filterHandlersRequestWithResolverConfig, { methodResponseTimeoutMs, waitTimeoutMs: methodResponseTimeoutMs }, { includeOperationCheck: true });
                return result;
            });
        }
        checkIfAtLeastOneFilterIsPresent(filter) {
            const errorMsg = "Provide at least one filter criteria of the following: 'intent' | 'contextTypes' | 'resultType' | 'applicationNames'";
            if (!Object.keys(filter).length) {
                throw new Error(errorMsg);
            }
            const { intent, resultType, contextTypes, applicationNames } = filter;
            const existingValidContextTypes = contextTypes === null || contextTypes === void 0 ? void 0 : contextTypes.length;
            const existingValidApplicationNames = applicationNames === null || applicationNames === void 0 ? void 0 : applicationNames.length;
            if (!intent && !resultType && !existingValidContextTypes && !existingValidApplicationNames) {
                throw new Error(errorMsg);
            }
        }
        getIntentsByHandler(handler) {
            return __awaiter$1(this, void 0, void 0, function* () {
                intentHandlerDecoder.runWithException(handler);
                const result = yield this.bridge.send("intents", operations$5.getIntentsByHandler, handler, undefined, { includeOperationCheck: true });
                return result;
            });
        }
    }

    const Glue42CoreMessageTypes = {
        platformUnload: { name: "platformUnload" },
        transportSwitchRequest: { name: "transportSwitchRequest" },
        transportSwitchResponse: { name: "transportSwitchResponse" },
        getCurrentTransport: { name: "getCurrentTransport" },
        getCurrentTransportResponse: { name: "getCurrentTransportResponse" },
        checkPreferredLogic: { name: "checkPreferredLogic" },
        checkPreferredConnection: { name: "checkPreferredConnection" },
        checkPreferredLogicResponse: { name: "checkPreferredLogicResponse" },
        checkPreferredConnectionResponse: { name: "checkPreferredConnectionResponse" }
    };
    const webPlatformTransportName = "web-platform";
    const latestFDC3Type = "latest_fdc3_type";

    const operations$4 = {
        addChannel: { name: "addChannel", dataDecoder: channelContextDecoder },
        getMyChannel: { name: "getMyChannel", resultDecoder: getMyChanelResultDecoder },
        getWindowIdsOnChannel: { name: "getWindowIdsOnChannel", dataDecoder: getWindowIdsOnChannelDataDecoder, resultDecoder: getWindowIdsOnChannelResultDecoder },
        getWindowIdsWithChannels: { name: "getWindowIdsWithChannels", dataDecoder: wrappedWindowWithChannelFilterDecoder, resultDecoder: getWindowIdsWithChannelsResultDecoder },
        joinChannel: { name: "joinChannel", dataDecoder: joinChannelDataDecoder },
    };

    class ChannelsController {
        constructor() {
            this.registry = lib$3();
            this.GlueWebChannelsPrefix = "___channel___";
            this.SubsKey = "subs";
            this.ChangedKey = "changed";
            this.replaySubscribe = (callback, channelId) => {
                this.get(channelId)
                    .then((channelContext) => {
                    if (typeof channelContext.data === "object" && Object.keys(channelContext.data).length) {
                        const contextName = this.createContextName(channelContext.name);
                        return this.contexts.subscribe(contextName, (context, _, __, ___, extraData) => {
                            callback(context.data, context, extraData === null || extraData === void 0 ? void 0 : extraData.updaterId);
                        });
                    }
                    return undefined;
                })
                    .then((un) => {
                    if (un && typeof un === "function") {
                        un();
                    }
                })
                    .catch(err => this.logger.trace(err));
            };
        }
        handlePlatformShutdown() {
            this.registry.clear();
        }
        addOperationsExecutors() {
            operations$4.getMyChannel.execute = this.handleGetMyChannel.bind(this);
            operations$4.joinChannel.execute = this.handleJoinChannel.bind(this);
        }
        start(coreGlue, ioc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.logger = coreGlue.logger.subLogger("channels.controller.web");
                this.logger.trace("starting the web channels controller");
                this.contexts = coreGlue.contexts;
                this.addOperationsExecutors();
                this.bridge = ioc.bridge;
                this.windowsController = ioc.windowsController;
                this.sessionController = ioc.sessionController;
                this.logger.trace("no need for platform registration, attaching the channels property to glue and returning");
                const api = this.toApi();
                coreGlue.channels = api;
            });
        }
        handleBridgeMessage(args) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const operationName = channelsOperationTypesDecoder.runWithException(args.operation);
                const operation = operations$4[operationName];
                if (!operation.execute) {
                    return;
                }
                let operationData = args.data;
                if (operation.dataDecoder) {
                    operationData = operation.dataDecoder.runWithException(args.data);
                }
                return yield operation.execute(operationData);
            });
        }
        list() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const channelNames = this.getAllChannelNames();
                const channelContexts = yield Promise.all(channelNames.map((channelName) => this.get(channelName)));
                return channelContexts;
            });
        }
        my() {
            return this.current();
        }
        handleGetMyChannel() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const channel = this.my();
                return channel ? { channel } : {};
            });
        }
        join(name, windowId) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const channelNames = this.getAllChannelNames();
                channelNameDecoder(channelNames).runWithException(name);
                optionalNonEmptyStringDecoder.runWithException(windowId);
                if (!windowId || windowId === this.windowsController.my().id) {
                    yield this.switchToChannel(name);
                }
                else {
                    yield this.bridge.send("channels", operations$4.joinChannel, { channel: name, windowId }, undefined, { includeOperationCheck: true });
                }
            });
        }
        handleJoinChannel({ channel, windowId }) {
            return this.join(channel, windowId);
        }
        onChanged(callback) {
            return this.changed(callback);
        }
        leave() {
            return __awaiter$1(this, void 0, void 0, function* () {
                yield this.switchToChannel();
            });
        }
        toApi() {
            const api = {
                subscribe: this.subscribe.bind(this),
                subscribeFor: this.subscribeFor.bind(this),
                publish: this.publish.bind(this),
                all: this.all.bind(this),
                list: this.list.bind(this),
                get: this.get.bind(this),
                join: this.join.bind(this),
                leave: this.leave.bind(this),
                current: this.current.bind(this),
                my: this.my.bind(this),
                changed: this.changed.bind(this),
                onChanged: this.onChanged.bind(this),
                add: this.add.bind(this),
                getMy: this.getMy.bind(this),
                getWindowsOnChannel: this.getWindowsOnChannel.bind(this),
                getWindowsWithChannels: this.getWindowsWithChannels.bind(this),
            };
            return Object.freeze(api);
        }
        createContextName(channelName) {
            return `${this.GlueWebChannelsPrefix}${channelName}`;
        }
        getAllChannelNames() {
            const contextNames = this.contexts.all();
            const channelContextNames = contextNames.filter((contextName) => contextName.startsWith(this.GlueWebChannelsPrefix));
            const channelNames = channelContextNames.map((channelContextName) => channelContextName.replace(this.GlueWebChannelsPrefix, ""));
            return channelNames;
        }
        unsubscribe() {
            if (this.unsubscribeFunc) {
                this.unsubscribeFunc();
                this.unsubscribeFunc = undefined;
            }
        }
        switchToChannel(name) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.unsubscribe();
                this.currentChannelName = name;
                if (typeof name !== "undefined") {
                    const contextName = this.createContextName(name);
                    this.unsubscribeFunc = yield this.contexts.subscribe(contextName, (context, _, __, ___, extraData) => {
                        this.registry.execute(this.SubsKey, context.data, context, extraData === null || extraData === void 0 ? void 0 : extraData.updaterId);
                    });
                }
                this.registry.execute(this.ChangedKey, name);
                this.sessionController.setWindowData({ currentName: name }, "channels");
            });
        }
        updateData(name, data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const contextName = this.createContextName(name);
                const fdc3Type = this.getFDC3Type(data);
                if (this.contexts.setPathSupported) {
                    const pathValues = Object.keys(data).map((key) => {
                        return {
                            path: `data.${key}`,
                            value: data[key]
                        };
                    });
                    if (fdc3Type) {
                        pathValues.push({ path: latestFDC3Type, value: fdc3Type });
                    }
                    yield this.contexts.setPaths(contextName, pathValues);
                }
                else {
                    if (fdc3Type) {
                        data[latestFDC3Type] = fdc3Type;
                    }
                    yield this.contexts.update(contextName, { data });
                }
            });
        }
        getFDC3Type(data) {
            const fdc3PropsArr = Object.keys(data).filter((key) => key.indexOf("fdc3_") === 0);
            if (fdc3PropsArr.length === 0) {
                return;
            }
            if (fdc3PropsArr.length > 1) {
                throw new Error("FDC3 does not support updating of multiple context keys");
            }
            return fdc3PropsArr[0].split("_").slice(1).join("_");
        }
        subscribe(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to channels, because the provided callback is not a function!");
            }
            const currentChannel = this.current();
            if (currentChannel) {
                this.replaySubscribe(callback, currentChannel);
            }
            return this.registry.add(this.SubsKey, callback);
        }
        subscribeFor(name, callback) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const channelNames = this.getAllChannelNames();
                channelNameDecoder(channelNames).runWithException(name);
                if (typeof callback !== "function") {
                    throw new Error(`Cannot subscribe to channel ${name}, because the provided callback is not a function!`);
                }
                const contextName = this.createContextName(name);
                return this.contexts.subscribe(contextName, (context, _, __, ___, extraData) => {
                    callback(context.data, context, extraData === null || extraData === void 0 ? void 0 : extraData.updaterId);
                });
            });
        }
        publish(data, name) {
            if (typeof data !== "object") {
                throw new Error("Cannot publish to channel, because the provided data is not an object!");
            }
            if (typeof name !== "undefined") {
                const channelNames = this.getAllChannelNames();
                channelNameDecoder(channelNames).runWithException(name);
                return this.updateData(name, data);
            }
            if (typeof this.currentChannelName === "undefined") {
                throw new Error("Cannot publish to channel, because not joined to a channel!");
            }
            return this.updateData(this.currentChannelName, data);
        }
        all() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const channelNames = this.getAllChannelNames();
                return channelNames;
            });
        }
        get(name) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const channelNames = this.getAllChannelNames();
                channelNameDecoder(channelNames).runWithException(name);
                const contextName = this.createContextName(name);
                const channelContext = yield this.contexts.get(contextName);
                if (channelContext.latest_fdc3_type) {
                    const rest = __rest$2(channelContext, ["latest_fdc3_type"]);
                    return Object.assign({}, rest);
                }
                return channelContext;
            });
        }
        current() {
            return this.currentChannelName;
        }
        changed(callback) {
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to channel changed, because the provided callback is not a function!");
            }
            return this.registry.add(this.ChangedKey, callback);
        }
        add(info) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const channelContext = channelContextDecoder.runWithException(info);
                const channelWithSuchNameExists = this.getAllChannelNames().includes(channelContext.name);
                if (channelWithSuchNameExists) {
                    throw new Error("There's an already existing channel with such name");
                }
                yield this.bridge.send("channels", operations$4.addChannel, channelContext);
                return channelContext;
            });
        }
        getMy() {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (!this.currentChannelName) {
                    return;
                }
                return this.get(this.currentChannelName);
            });
        }
        getWindowsOnChannel(channel) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const channelNames = this.getAllChannelNames();
                channelNameDecoder(channelNames).runWithException(channel);
                const { windowIds } = yield this.bridge.send("channels", operations$4.getWindowIdsOnChannel, { channel }, undefined, { includeOperationCheck: true });
                const result = windowIds.reduce((windows, windowId) => {
                    const window = this.windowsController.findById(windowId);
                    return window ? [...windows, window] : windows;
                }, []);
                return result;
            });
        }
        getWindowsWithChannels(filter) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const operationData = filter !== undefined
                    ? { filter: windowWithChannelFilterDecoder.runWithException(filter) }
                    : {};
                const { windowIdsWithChannels } = yield this.bridge.send("channels", operations$4.getWindowIdsWithChannels, operationData, undefined, { includeOperationCheck: true });
                const result = windowIdsWithChannels.reduce((windowsWithChannels, { application, channel, windowId }) => {
                    const window = this.windowsController.findById(windowId);
                    return window ? [...windowsWithChannels, { application, channel, window }] : windowsWithChannels;
                }, []);
                return result;
            });
        }
    }

    const operations$3 = {
        getEnvironment: { name: "getEnvironment", resultDecoder: anyDecoder },
        getBase: { name: "getBase", resultDecoder: anyDecoder },
        platformShutdown: { name: "platformShutdown" }
    };

    class SystemController {
        start(coreGlue, ioc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.bridge = ioc.bridge;
                this.ioc = ioc;
                this.addOperationsExecutors();
                yield this.setEnvironment();
            });
        }
        handleBridgeMessage(args) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const operationName = systemOperationTypesDecoder.runWithException(args.operation);
                const operation = operations$3[operationName];
                if (!operation.execute) {
                    return;
                }
                let operationData = args.data;
                if (operation.dataDecoder) {
                    operationData = operation.dataDecoder.runWithException(args.data);
                }
                return yield operation.execute(operationData);
            });
        }
        processPlatformShutdown() {
            return __awaiter$1(this, void 0, void 0, function* () {
                Object.values(this.ioc.controllers).forEach((controller) => controller.handlePlatformShutdown ? controller.handlePlatformShutdown() : null);
                this.ioc.preferredConnectionController.stop();
                this.ioc.eventsDispatcher.stop();
                yield this.bridge.stop();
            });
        }
        setEnvironment() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const environment = yield this.bridge.send("system", operations$3.getEnvironment, undefined);
                const base = yield this.bridge.send("system", operations$3.getBase, undefined);
                const globalNamespace = window.glue42core || window.iobrowser;
                const globalNamespaceName = window.glue42core ? "glue42core" : "iobrowser";
                const globalObj = Object.assign({}, globalNamespace, base, { environment });
                window[globalNamespaceName] = Object.freeze(globalObj);
            });
        }
        addOperationsExecutors() {
            operations$3.platformShutdown.execute = this.processPlatformShutdown.bind(this);
        }
    }

    class Notification {
        constructor(config, id) {
            this.onclick = () => { };
            this.onshow = () => { };
            this.id = id;
            this.badge = config.badge;
            this.body = config.body;
            this.data = config.data;
            this.dir = config.dir;
            this.icon = config.icon;
            this.image = config.image;
            this.lang = config.lang;
            this.renotify = config.renotify;
            this.requireInteraction = config.requireInteraction;
            this.silent = config.silent;
            this.tag = config.tag;
            this.timestamp = config.timestamp;
            this.vibrate = config.vibrate;
            this.title = config.title;
            this.clickInterop = config.clickInterop;
            this.actions = config.actions;
            this.focusPlatformOnDefaultClick = config.focusPlatformOnDefaultClick;
            this.severity = config.severity;
            this.showToast = config.showToast;
            this.showInPanel = config.showInPanel;
            this.state = config.state;
        }
    }

    oneOf$1(constant$1("clientHello"));
    const extensionConfigDecoder = object$1({
        widget: object$1({
            inject: boolean$1()
        })
    });

    const operations$2 = {
        clientHello: { name: "clientHello", resultDecoder: extensionConfigDecoder }
    };

    class ExtController {
        constructor() {
            this.channels = [];
            this.unsubFuncs = [];
            this.contentCommands = {
                widgetVisualizationPermission: { name: "widgetVisualizationPermission", handle: this.handleWidgetVisualizationPermission.bind(this) },
                changeChannel: { name: "changeChannel", handle: this.handleChangeChannel.bind(this) }
            };
        }
        handlePlatformShutdown() {
            this.unsubFuncs.forEach((unsub) => unsub());
            this.channels = [];
            this.unsubFuncs = [];
        }
        start(coreGlue, ioc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.logger = coreGlue.logger.subLogger("extension.controller.web");
                this.windowId = ioc.publicWindowId;
                this.logger.trace("starting the extension web controller");
                this.bridge = ioc.bridge;
                this.channelsController = ioc.channelsController;
                this.eventsDispatcher = ioc.eventsDispatcher;
                try {
                    yield this.registerWithPlatform();
                }
                catch (error) {
                    return;
                }
                this.channels = yield this.channelsController.list();
                const unsubDispatcher = this.eventsDispatcher.onContentMessage(this.handleContentMessage.bind(this));
                const unsubChannels = this.channelsController.onChanged((channel) => {
                    this.eventsDispatcher.sendContentMessage({ command: "channelChange", newChannel: channel });
                });
                this.unsubFuncs.push(unsubDispatcher);
                this.unsubFuncs.push(unsubChannels);
            });
        }
        handleBridgeMessage(_) {
            return __awaiter$1(this, void 0, void 0, function* () {
            });
        }
        handleContentMessage(message) {
            if (!message || typeof message.command !== "string") {
                return;
            }
            const foundHandler = this.contentCommands[message.command];
            if (!foundHandler) {
                return;
            }
            foundHandler.handle(message);
        }
        registerWithPlatform() {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.logger.trace("registering with the platform");
                this.config = yield this.bridge.send("extension", operations$2.clientHello, { windowId: this.windowId });
                this.logger.trace("the platform responded to the hello message with a valid extension config");
            });
        }
        handleWidgetVisualizationPermission() {
            var _a;
            return __awaiter$1(this, void 0, void 0, function* () {
                if (!((_a = this.config) === null || _a === void 0 ? void 0 : _a.widget.inject)) {
                    return this.eventsDispatcher.sendContentMessage({ command: "permissionResponse", allowed: false });
                }
                const currentChannel = this.channels.find((channel) => channel.name === this.channelsController.my());
                this.eventsDispatcher.sendContentMessage({ command: "permissionResponse", allowed: true, channels: this.channels, currentChannel });
            });
        }
        handleChangeChannel(message) {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (message.name === "no-channel") {
                    yield this.channelsController.leave();
                    return;
                }
                yield this.channelsController.join(message.name);
            });
        }
    }

    class EventsDispatcher {
        constructor(config) {
            this.config = config;
            this.registry = lib$3();
            this.glue42EventName = "Glue42";
            this.events = {
                notifyStarted: { name: "notifyStarted", handle: this.handleNotifyStarted.bind(this) },
                contentInc: { name: "contentInc", handle: this.handleContentInc.bind(this) },
                requestGlue: { name: "requestGlue", handle: this.handleRequestGlue.bind(this) }
            };
        }
        stop() {
            window.removeEventListener(this.glue42EventName, this._handleMessage);
        }
        start(glue) {
            this.glue = glue;
            this.wireCustomEventListener();
            this.announceStarted();
        }
        sendContentMessage(message) {
            this.send("contentOut", "glue42core", message);
        }
        onContentMessage(callback) {
            return this.registry.add("content-inc", callback);
        }
        wireCustomEventListener() {
            this._handleMessage = this.handleMessage.bind(this);
            window.addEventListener(this.glue42EventName, this._handleMessage);
        }
        handleMessage(event) {
            var _a;
            const data = event.detail;
            const namespace = (_a = data === null || data === void 0 ? void 0 : data.glue42) !== null && _a !== void 0 ? _a : data === null || data === void 0 ? void 0 : data.glue42core;
            if (!namespace) {
                return;
            }
            const glue42Event = namespace.event;
            const foundHandler = this.events[glue42Event];
            if (!foundHandler) {
                return;
            }
            foundHandler.handle(namespace.message);
        }
        announceStarted() {
            this.send("start", "glue42");
        }
        handleRequestGlue() {
            if (!this.config.exposeAPI) {
                this.send("requestGlueResponse", "glue42", { error: "Will not give access to the underlying Glue API, because it was explicitly denied upon initialization." });
                return;
            }
            this.send("requestGlueResponse", "glue42", { glue: this.glue });
        }
        handleNotifyStarted() {
            this.announceStarted();
        }
        handleContentInc(message) {
            this.registry.execute("content-inc", message);
        }
        send(eventName, namespace, message) {
            const payload = {};
            payload[namespace] = { event: eventName, message };
            const event = new CustomEvent(this.glue42EventName, { detail: payload });
            window.dispatchEvent(event);
        }
    }

    class PreferredConnectionController {
        constructor(coreGlue) {
            this.coreGlue = coreGlue;
            this.transactionTimeout = 15000;
            this.transactionLocks = {};
            this.reconnectCounter = 0;
            this.logger = this.coreGlue.logger.subLogger("web.preferred.connection.controller");
        }
        stop() {
            if (!this.webPlatformMessagesUnsubscribe) {
                return;
            }
            this.webPlatformMessagesUnsubscribe();
        }
        start(coreConfig) {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (coreConfig.isPlatformInternal) {
                    this.logger.trace("This is an internal client to the platform, skipping all client preferred communication logic.");
                    return;
                }
                const isConnectedToPlatform = this.coreGlue.connection.transport.name() === webPlatformTransportName;
                if (!isConnectedToPlatform) {
                    throw new Error("Cannot initiate the Glue Web Bridge, because the initial connection was not handled by a Web Platform transport.");
                }
                if (!this.coreGlue.connection.transport.isPreferredActivated) {
                    this.logger.trace("The platform of this client was configured without a preferred connection, skipping the rest of the initialization.");
                    return;
                }
                this.webPlatformTransport = this.coreGlue.connection.transport;
                this.webPlatformMessagesUnsubscribe = this.webPlatformTransport.onMessage(this.handleWebPlatformMessage.bind(this));
                const transportState = yield this.getCurrentPlatformTransportState();
                yield this.checkSwitchTransport(transportState);
            });
        }
        handleWebPlatformMessage(msg) {
            if (typeof msg === "string") {
                return;
            }
            const isConnectedToPlatform = this.coreGlue.connection.transport.name() === webPlatformTransportName;
            const type = msg.type;
            const args = msg.args;
            const transactionId = msg.transactionId;
            if (type === Glue42CoreMessageTypes.transportSwitchRequest.name) {
                return this.handleTransportSwitchRequest(args, transactionId);
            }
            if (type === Glue42CoreMessageTypes.platformUnload.name && !isConnectedToPlatform) {
                return this.handlePlatformUnload();
            }
            if (type === Glue42CoreMessageTypes.getCurrentTransportResponse.name) {
                return this.handleGetCurrentTransportResponse(args, transactionId);
            }
            if (type === Glue42CoreMessageTypes.checkPreferredLogic.name) {
                return this.handleCheckPreferredLogic(transactionId);
            }
            if (type === Glue42CoreMessageTypes.checkPreferredConnection.name) {
                return this.handleCheckPreferredConnection(args, transactionId);
            }
        }
        reEstablishPlatformPort() {
            return __awaiter$1(this, void 0, void 0, function* () {
                try {
                    yield this.webPlatformTransport.connect();
                }
                catch (error) {
                    this.logger.trace(`Error when re-establishing port connection to the platform: ${JSON.stringify(error)}`);
                    --this.reconnectCounter;
                    if (this.reconnectCounter > 0) {
                        return this.reEstablishPlatformPort();
                    }
                    this.logger.warn("This client lost connection to the platform while connected to a preferred GW and was not able to re-connect to the platform.");
                }
                this.logger.trace("The connection to the platform was re-established, closing the connection to the web gateway.");
                this.reconnectCounter = 0;
                this.webPlatformTransport.close();
                const transportState = yield this.getCurrentPlatformTransportState();
                yield this.checkSwitchTransport(transportState);
            });
        }
        checkSwitchTransport(config) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const myCurrentTransportName = this.coreGlue.connection.transport.name();
                if (myCurrentTransportName === config.transportName) {
                    this.logger.trace("A check switch was requested, but the platform transport and my transport are identical, no switch is necessary");
                    return;
                }
                this.logger.trace(`A check switch was requested and a transport switch is necessary, because this client is now on ${myCurrentTransportName}, but it should reconnect to ${JSON.stringify(config)}`);
                const result = yield this.coreGlue.connection.switchTransport(config);
                this.setConnected();
                this.logger.trace(`The transport switch was completed with result: ${JSON.stringify(result)}`);
            });
        }
        getCurrentPlatformTransportState() {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.logger.trace("Requesting the current transport state of the platform.");
                const transaction = this.setTransaction(Glue42CoreMessageTypes.getCurrentTransport.name);
                this.sendPlatformMessage(Glue42CoreMessageTypes.getCurrentTransport.name, transaction.id);
                const transportState = yield transaction.lock;
                this.logger.trace(`The platform responded with transport state: ${JSON.stringify(transportState)}`);
                return transportState;
            });
        }
        setTransaction(operation) {
            const transaction = {};
            const transactionId = shortidExports$1.generate();
            const transactionLock = new Promise((resolve, reject) => {
                let transactionLive = true;
                transaction.lift = (args) => {
                    transactionLive = false;
                    delete this.transactionLocks[transactionId];
                    resolve(args);
                };
                transaction.fail = (reason) => {
                    transactionLive = false;
                    delete this.transactionLocks[transactionId];
                    reject(reason);
                };
                setTimeout(() => {
                    if (!transactionLive) {
                        return;
                    }
                    transactionLive = false;
                    this.logger.warn(`Transaction for operation: ${operation} timed out.`);
                    delete this.transactionLocks[transactionId];
                    reject(`Transaction for operation: ${operation} timed out.`);
                }, this.transactionTimeout);
            });
            transaction.lock = transactionLock;
            transaction.id = transactionId;
            this.transactionLocks[transactionId] = transaction;
            return transaction;
        }
        sendPlatformMessage(type, transactionId, args) {
            this.logger.trace(`Sending a platform message of type: ${type}, id: ${transactionId} and args: ${JSON.stringify(args)}`);
            this.webPlatformTransport.sendObject({
                glue42core: { type, args, transactionId }
            });
        }
        handleTransportSwitchRequest(args, transactionId) {
            this.logger.trace(`Received a transport switch request with id: ${transactionId} and data: ${JSON.stringify(args)}`);
            this.coreGlue.connection.switchTransport(args.switchSettings)
                .then((result) => {
                this.logger.trace(`The transport switch was completed with result: ${JSON.stringify(result)}`);
                this.setConnected();
                this.sendPlatformMessage(Glue42CoreMessageTypes.transportSwitchResponse.name, transactionId, { success: result.success });
            })
                .catch((error) => {
                this.logger.error(error);
                this.sendPlatformMessage(Glue42CoreMessageTypes.transportSwitchResponse.name, transactionId, { success: false });
            });
        }
        handlePlatformUnload() {
            this.reconnectCounter = 5;
            this.logger.trace("The platform was unloaded while I am connected to a preferred connection, re-establishing the port connection.");
            this.reEstablishPlatformPort();
        }
        handleGetCurrentTransportResponse(args, transactionId) {
            this.logger.trace(`Got a current transport response from the platform with id: ${transactionId} and data: ${JSON.stringify(args)}`);
            const transportState = args.transportState;
            const transaction = this.transactionLocks[transactionId];
            transaction === null || transaction === void 0 ? void 0 : transaction.lift(transportState);
        }
        handleCheckPreferredLogic(transactionId) {
            setTimeout(() => this.sendPlatformMessage(Glue42CoreMessageTypes.checkPreferredLogicResponse.name, transactionId), 0);
        }
        handleCheckPreferredConnection(args, transactionId) {
            const url = args.url;
            this.logger.trace(`Testing the possible connection to: ${url}`);
            this.checkPreferredConnection(url)
                .then((result) => {
                this.logger.trace(`The connection to ${url} is possible`);
                this.sendPlatformMessage(Glue42CoreMessageTypes.checkPreferredConnectionResponse.name, transactionId, result);
            })
                .catch((error) => {
                this.logger.trace(`The connection to ${url} is not possible`);
                this.sendPlatformMessage(Glue42CoreMessageTypes.checkPreferredConnectionResponse.name, transactionId, { error });
            });
        }
        checkPreferredConnection(url) {
            return new Promise((resolve) => {
                const ws = new WebSocket(url);
                ws.onerror = () => resolve({ live: false });
                ws.onopen = () => {
                    ws.close();
                    resolve({ live: true });
                };
            });
        }
        setConnected() {
            this.webPlatformTransport.manualSetReadyState();
        }
    }

    class LegacyIntentsHelper {
        constructor(logger, bridge, interop, appManagerController, windowsController) {
            this.bridge = bridge;
            this.interop = interop;
            this.appManagerController = appManagerController;
            this.windowsController = windowsController;
            this.intentsResolverResponsePromises = {};
            this.logger = this.configureLogger(logger);
        }
        raise(requestWithResolverInfo, findIntentFn) {
            var _a;
            return __awaiter$1(this, void 0, void 0, function* () {
                const { intentRequest, resolverConfig } = requestWithResolverInfo;
                const intent = (yield findIntentFn(intentRequest.intent)).find(intent => intent.name === intentRequest.intent);
                if (!intent) {
                    throw new Error(`Intent with name ${intentRequest.intent} not found`);
                }
                const { open, reason } = this.checkIfResolverShouldBeOpened(intent, intentRequest, resolverConfig);
                if (!open) {
                    (_a = this.logger) === null || _a === void 0 ? void 0 : _a.trace(`Intent Resolver UI won't be used. Reason: ${reason}`);
                    return this.invokeRaiseIntent(intentRequest);
                }
                const intentResult = yield this.raiseIntentWithResolverApp(requestWithResolverInfo);
                return intentResult;
            });
        }
        configureLogger(loggerInst) {
            return loggerInst.subLogger("intents.legacy.helper.web");
        }
        raiseIntentWithResolverApp(requestWithResolverInfo) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const { intentRequest, resolverConfig } = requestWithResolverInfo;
                this.logger.trace(`Intents Resolver UI with app name ${resolverConfig.appName} will be used`);
                const responseMethodName = yield this.registerResponseMethod();
                this.logger.trace(`Registered interop method ${responseMethodName}`);
                const resolverInstance = yield this.openIntentResolverApplication(requestWithResolverInfo, responseMethodName);
                this.logger.trace(`Intents Resolver Instance with id ${resolverInstance.id} opened`);
                const handler = yield this.handleInstanceResponse(resolverInstance.id);
                const target = handler.type === "app"
                    ? { app: handler.applicationName }
                    : { instance: handler.instanceId };
                this.logger.trace(`Intent handler chosen by the user: ${JSON.stringify(target)}`);
                const intentResult = yield this.invokeRaiseIntent(Object.assign(Object.assign({}, intentRequest), { target }));
                return intentResult;
            });
        }
        handleInstanceResponse(instanceId) {
            var _a;
            return __awaiter$1(this, void 0, void 0, function* () {
                try {
                    const { handler, intent } = yield this.intentsResolverResponsePromises[instanceId].promise;
                    (_a = this.logger) === null || _a === void 0 ? void 0 : _a.trace(`Intent handler chosen for intent ${intent}: ${JSON.stringify(handler)}`);
                    this.stopResolverInstance(instanceId);
                    return handler;
                }
                catch (error) {
                    this.stopResolverInstance(instanceId);
                    throw new Error(error);
                }
            });
        }
        invokeRaiseIntent(requestObj) {
            return this.bridge.send("intents", operations$5.raiseIntent, requestObj);
        }
        registerResponseMethod() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const methodName = INTENTS_RESOLVER_INTEROP_PREFIX + shortid$2();
                yield this.interop.register(methodName, this.resolverResponseHandler.bind(this));
                return methodName;
            });
        }
        openIntentResolverApplication(requestWithResolverInfo, methodName) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const { intentRequest, resolverConfig } = requestWithResolverInfo;
                const startContext = this.buildStartContext(intentRequest, methodName);
                const startOptions = yield this.buildStartOptions();
                this.logger.trace(`Starting Intents Resolver UI with context: ${JSON.stringify(startContext)} and options: ${startOptions}`);
                const instance = yield this.appManagerController.getApplication(resolverConfig.appName).start(startContext, startOptions);
                this.logger.trace(`Intents Resolver instance with id ${instance.id} opened`);
                this.subscribeOnInstanceStopped(instance);
                this.createResponsePromise(intentRequest.intent, instance.id, methodName, resolverConfig.waitResponseTimeout);
                return instance;
            });
        }
        cleanUpIntentResolverPromise(instanceId) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const intentPromise = this.intentsResolverResponsePromises[instanceId];
                if (!intentPromise) {
                    return;
                }
                const unregisterPromise = this.interop.unregister(intentPromise.methodName);
                unregisterPromise.catch((error) => this.logger.warn(error));
                delete this.intentsResolverResponsePromises[instanceId];
            });
        }
        buildStartContext(requestObj, methodName) {
            return {
                intent: requestObj,
                callerId: this.interop.instance.instance,
                methodName
            };
        }
        buildStartOptions() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const bounds = yield this.getTargetBounds();
                return {
                    top: (bounds.height - INTENTS_RESOLVER_HEIGHT) / 2 + bounds.top,
                    left: (bounds.width - INTENTS_RESOLVER_WIDTH) / 2 + bounds.left,
                    width: INTENTS_RESOLVER_WIDTH,
                    height: INTENTS_RESOLVER_HEIGHT
                };
            });
        }
        getTargetBounds() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const bounds = (yield this.tryGetWindowBasedBounds()) || (yield this.tryGetWorkspaceBasedBounds());
                if (bounds) {
                    this.logger.trace(`Opening Intents Resolver UI with bounds: ${JSON.stringify(bounds)}`);
                    return bounds;
                }
                const defaultBounds = {
                    top: window.screen.availTop || 0,
                    left: window.screen.availLeft || 0,
                    width: window.screen.width,
                    height: window.screen.height
                };
                this.logger.trace(`Opening Intents Resolver UI relative to my screen bounds: ${JSON.stringify(defaultBounds)}`);
                return defaultBounds;
            });
        }
        tryGetWindowBasedBounds() {
            return __awaiter$1(this, void 0, void 0, function* () {
                try {
                    const myWindowBounds = yield this.windowsController.my().getBounds();
                    this.logger.trace(`Opening the resolver UI relative to my window bounds: ${JSON.stringify(myWindowBounds)}`);
                    return myWindowBounds;
                }
                catch (error) {
                    this.logger.trace(`Failure to get my window bounds: ${JSON.stringify(error)}`);
                }
                return undefined;
            });
        }
        tryGetWorkspaceBasedBounds() {
            return __awaiter$1(this, void 0, void 0, function* () {
                try {
                    yield this.bridge.send("workspaces", systemOperations.operationCheck, { operation: "getWorkspaceWindowFrameBounds" });
                    const bridgeResponse = yield this.bridge.send("workspaces", systemOperations.getWorkspaceWindowFrameBounds, { itemId: this.windowsController.my().id });
                    const myWorkspaceBounds = bridgeResponse.bounds;
                    this.logger.trace(`Opening the resolver UI relative to my workspace frame window bounds: ${JSON.stringify(myWorkspaceBounds)}`);
                    return myWorkspaceBounds;
                }
                catch (error) {
                    this.logger.trace(`Failure to get my workspace frame window bounds: ${JSON.stringify(error)}`);
                }
                return undefined;
            });
        }
        subscribeOnInstanceStopped(instance) {
            const { application } = instance;
            const unsub = application.onInstanceStopped((inst) => {
                if (inst.id !== instance.id) {
                    return;
                }
                const intentPromise = this.intentsResolverResponsePromises[inst.id];
                if (!intentPromise) {
                    return unsub();
                }
                intentPromise.reject(`Cannot resolve raised intent "${intentPromise.intent}" - User closed ${application.name} app without choosing an intent handler`);
                this.cleanUpIntentResolverPromise(inst.id);
                unsub();
            });
        }
        createResponsePromise(intent, instanceId, methodName, timeout) {
            let resolve = () => { };
            let reject = () => { };
            const promise = PromisePlus$1((res, rej) => {
                resolve = res;
                reject = rej;
            }, timeout, `Timeout of ${timeout}ms hit waiting for the user to choose a handler for intent ${intent}`);
            this.intentsResolverResponsePromises[instanceId] = { intent, resolve, reject, promise, methodName };
        }
        resolverResponseHandler(args, callerId) {
            const response = intentResolverResponseDecoder.run(args);
            const instanceId = callerId.instance;
            if (response.ok) {
                this.logger.trace(`Intent Resolver instance with id ${instanceId} send a valid response: ${JSON.stringify(response.result)}`);
                return this.intentsResolverResponsePromises[instanceId].resolve(response.result);
            }
            this.logger.trace(`Intent Resolver instance with id ${instanceId} sent an invalid response. Error: ${JSON.stringify(response.error)}`);
            this.intentsResolverResponsePromises[instanceId].reject(response.error.message);
            this.stopResolverInstance(instanceId);
        }
        stopResolverInstance(instanceId) {
            const searchedInstance = this.appManagerController.getInstances().find((inst) => inst.id === instanceId);
            if (!searchedInstance) {
                return;
            }
            searchedInstance.stop().catch(err => this.logger.error(err));
        }
        checkIfIntentHasMoreThanOneHandler(intent, request) {
            if (typeof request.target === "object") {
                return false;
            }
            return request.handlers ? request.handlers.length > 1 : intent.handlers.length > 1;
        }
        checkIfResolverShouldBeOpened(intent, intentRequest, resolverConfig) {
            if (!resolverConfig.enabled) {
                return { open: false, reason: "Intent Resolver is disabled. Raising intent to first found handler" };
            }
            const intentsResolverApp = this.appManagerController.getApplication(resolverConfig.appName);
            if (!intentsResolverApp) {
                return { open: false, reason: `Application with name ${resolverConfig.appName} not found` };
            }
            const hasMoreThanOneHandler = this.checkIfIntentHasMoreThanOneHandler(intent, intentRequest);
            if (!hasMoreThanOneHandler) {
                return { open: false, reason: "Raised intent has only one handler" };
            }
            return { open: true };
        }
    }

    const operations$1 = {
        getCurrent: { name: "getCurrent", resultDecoder: simpleThemeResponseDecoder },
        list: { name: "list", resultDecoder: allThemesResponseDecoder },
        select: { name: "select", dataDecoder: selectThemeConfigDecoder }
    };

    class ThemesController {
        constructor() {
            this.registry = lib$3();
            this.activeThemeSubs = 0;
        }
        start(coreGlue, ioc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.logger = coreGlue.logger.subLogger("themes.controller.web");
                this.logger.trace("starting the web themes controller");
                this.bridge = ioc.bridge;
                const api = this.toApi();
                coreGlue.themes = api;
                this.logger.trace("themes are ready");
            });
        }
        handlePlatformShutdown() {
            var _a;
            this.registry.clear();
            this.activeThemeSubs = 0;
            (_a = this.themesSubscription) === null || _a === void 0 ? void 0 : _a.close();
            delete this.themesSubscription;
        }
        handleBridgeMessage() {
            return __awaiter$1(this, void 0, void 0, function* () {
            });
        }
        toApi() {
            const api = {
                getCurrent: this.getCurrent.bind(this),
                list: this.list.bind(this),
                select: this.select.bind(this),
                onChanged: this.onChanged.bind(this)
            };
            return Object.freeze(api);
        }
        getCurrent() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const bridgeResponse = yield this.bridge.send("themes", operations$1.getCurrent, undefined, undefined, { includeOperationCheck: true });
                return bridgeResponse.theme;
            });
        }
        list() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const bridgeResponse = yield this.bridge.send("themes", operations$1.list, undefined, undefined, { includeOperationCheck: true });
                return bridgeResponse.themes;
            });
        }
        select(name) {
            return __awaiter$1(this, void 0, void 0, function* () {
                nonEmptyStringDecoder.runWithException(name);
                yield this.bridge.send("themes", operations$1.select, { name }, undefined, { includeOperationCheck: true });
            });
        }
        onChanged(callback) {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (typeof callback !== "function") {
                    throw new Error("onChanged requires a callback of type function");
                }
                const subReady = this.themesSubscription ?
                    Promise.resolve() :
                    this.configureThemeSubscription();
                yield subReady;
                ++this.activeThemeSubs;
                const unsubFunc = this.registry.add("on-theme-change", callback);
                return () => this.themeUnsub(unsubFunc);
            });
        }
        configureThemeSubscription() {
            return __awaiter$1(this, void 0, void 0, function* () {
                if (this.themesSubscription) {
                    return;
                }
                this.themesSubscription = yield this.bridge.createNotificationsSteam();
                this.themesSubscription.onData((data) => {
                    const eventData = data.data;
                    const validation = simpleThemeResponseDecoder.run(eventData);
                    if (!validation.ok) {
                        this.logger.warn(`Received invalid theme data on the theme event stream: ${JSON.stringify(validation.error)}`);
                        return;
                    }
                    const themeChanged = validation.result;
                    this.registry.execute("on-theme-change", themeChanged.theme);
                });
                this.themesSubscription.onClosed(() => {
                    this.logger.warn("The Themes interop stream was closed, no theme changes notifications will be received");
                    this.registry.clear();
                    this.activeThemeSubs = 0;
                    delete this.themesSubscription;
                });
            });
        }
        themeUnsub(registryUnsub) {
            var _a;
            registryUnsub();
            --this.activeThemeSubs;
            if (this.activeThemeSubs) {
                return;
            }
            (_a = this.themesSubscription) === null || _a === void 0 ? void 0 : _a.close();
            delete this.themesSubscription;
        }
    }

    class SessionStorageController {
        constructor() {
            this.sessionStorage = window.sessionStorage;
        }
        get allNamespaces() {
            return [{ namespace: this.windowNamespace, defaultValue: {} }];
        }
        configure(config) {
            this.windowId = config.windowId;
            this.allNamespaces.forEach(({ namespace, defaultValue }) => {
                const data = this.sessionStorage.getItem(namespace);
                if (!data) {
                    this.sessionStorage.setItem(namespace, JSON.stringify(defaultValue));
                }
            });
        }
        get windowNamespace() {
            return `io_connect_window_${this.windowId}`;
        }
        getWindowData() {
            return JSON.parse(this.sessionStorage.getItem(this.windowNamespace));
        }
        setWindowData(data, key) {
            const allData = this.getWindowData();
            allData[key] = data;
            this.sessionStorage.setItem(this.windowNamespace, JSON.stringify(allData));
        }
    }

    const operations = {
        clear: { name: "clear", dataDecoder: basePrefsConfigDecoder },
        clearAll: { name: "clearAll" },
        get: { name: "get", dataDecoder: basePrefsConfigDecoder, resultDecoder: getPrefsResultDecoder },
        getAll: { name: "getAll", resultDecoder: getAllPrefsResultDecoder },
        set: { name: "set", dataDecoder: changePrefsDataDecoder },
        update: { name: "update", dataDecoder: changePrefsDataDecoder },
        prefsChanged: { name: "prefsChanged", dataDecoder: getPrefsResultDecoder },
        prefsHello: { name: "prefsHello", resultDecoder: prefsHelloSuccessDecoder },
    };

    class PrefsController {
        constructor() {
            this.registry = lib$3();
        }
        handlePlatformShutdown() {
            this.registry.clear();
        }
        start(coreGlue, ioc) {
            return __awaiter$1(this, void 0, void 0, function* () {
                this.logger = coreGlue.logger.subLogger("prefs.controller.web");
                this.logger.trace("starting the web prefs controller");
                this.addOperationsExecutors();
                this.bridge = ioc.bridge;
                this.config = ioc.config;
                this.appManagerController = ioc.appManagerController;
                try {
                    const prefsHelloSuccess = yield this.bridge.send("prefs", operations.prefsHello, undefined, undefined, { includeOperationCheck: true });
                    this.platformAppName = prefsHelloSuccess.platform.app;
                }
                catch (error) {
                    this.logger.warn("The platform of this client is outdated and does not support Prefs API.");
                    return;
                }
                this.logger.trace("no need for platform registration, attaching the prefs property to glue and returning");
                const api = this.toApi();
                coreGlue.prefs = api;
            });
        }
        handleBridgeMessage(args) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const operationName = prefsOperationTypesDecoder.runWithException(args.operation);
                const operation = operations[operationName];
                if (!operation.execute) {
                    return;
                }
                let operationData = args.data;
                if (operation.dataDecoder) {
                    operationData = operation.dataDecoder.runWithException(args.data);
                }
                return yield operation.execute(operationData);
            });
        }
        addOperationsExecutors() {
            operations.prefsChanged.execute = this.handleOnChanged.bind(this);
        }
        toApi() {
            const api = {
                clear: this.clear.bind(this),
                clearAll: this.clearAll.bind(this),
                clearFor: this.clearFor.bind(this),
                get: this.get.bind(this),
                getAll: this.getAll.bind(this),
                set: this.set.bind(this),
                setFor: this.setFor.bind(this),
                subscribe: this.subscribe.bind(this),
                subscribeFor: this.subscribeFor.bind(this),
                update: this.update.bind(this),
                updateFor: this.updateFor.bind(this),
            };
            return api;
        }
        clear() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const app = this.getMyAppName();
                yield this.clearFor(app);
            });
        }
        clearAll() {
            return __awaiter$1(this, void 0, void 0, function* () {
                yield this.bridge.send("prefs", operations.clearAll, undefined, undefined, { includeOperationCheck: true });
            });
        }
        clearFor(app) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const verifiedApp = nonEmptyStringDecoder.runWithException(app);
                yield this.bridge.send("prefs", operations.clear, { app: verifiedApp }, undefined, { includeOperationCheck: true });
            });
        }
        get(app) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const verifiedApp = app === undefined || app === null ? this.getMyAppName() : nonEmptyStringDecoder.runWithException(app);
                const { prefs } = yield this.bridge.send("prefs", operations.get, { app: verifiedApp }, undefined, { includeOperationCheck: true });
                return prefs;
            });
        }
        getAll() {
            return __awaiter$1(this, void 0, void 0, function* () {
                const result = yield this.bridge.send("prefs", operations.getAll, undefined, undefined, { includeOperationCheck: true });
                return result;
            });
        }
        set(data, options) {
            var _a;
            return __awaiter$1(this, void 0, void 0, function* () {
                const verifiedOptions = optional$1(basePrefsConfigDecoder).runWithException(options);
                const app = (_a = verifiedOptions === null || verifiedOptions === void 0 ? void 0 : verifiedOptions.app) !== null && _a !== void 0 ? _a : this.getMyAppName();
                yield this.setFor(app, data);
            });
        }
        setFor(app, data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const verifiedApp = nonEmptyStringDecoder.runWithException(app);
                const verifiedData = object$1().runWithException(data);
                yield this.bridge.send("prefs", operations.set, { app: verifiedApp, data: verifiedData }, undefined, { includeOperationCheck: true });
            });
        }
        subscribe(callback) {
            const app = this.getMyAppName();
            return this.subscribeFor(app, callback);
        }
        subscribeFor(app, callback) {
            const verifiedApp = nonEmptyStringDecoder.runWithException(app);
            const applications = this.appManagerController.getApplications();
            const isValidApp = verifiedApp === this.platformAppName || applications.some((application) => application.name === verifiedApp);
            if (!isValidApp) {
                throw new Error(`The provided app name "${app}" is not valid.`);
            }
            if (typeof callback !== "function") {
                throw new Error("Cannot subscribe to prefs, because the provided callback is not a function!");
            }
            const subscriptionKey = this.getSubscriptionKey(verifiedApp);
            this.get(verifiedApp).then(callback);
            return this.registry.add(subscriptionKey, callback);
        }
        update(data, options) {
            var _a;
            return __awaiter$1(this, void 0, void 0, function* () {
                const verifiedOptions = optional$1(basePrefsConfigDecoder).runWithException(options);
                const app = (_a = verifiedOptions === null || verifiedOptions === void 0 ? void 0 : verifiedOptions.app) !== null && _a !== void 0 ? _a : this.getMyAppName();
                yield this.updateFor(app, data);
            });
        }
        updateFor(app, data) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const verifiedApp = nonEmptyStringDecoder.runWithException(app);
                const verifiedData = object$1().runWithException(data);
                yield this.bridge.send("prefs", operations.update, { app: verifiedApp, data: verifiedData }, undefined, { includeOperationCheck: true });
            });
        }
        getMyAppName() {
            var _a;
            const myAppName = this.config.isPlatformInternal ? this.platformAppName : (_a = this.appManagerController.me) === null || _a === void 0 ? void 0 : _a.application.name;
            if (!myAppName) {
                throw new Error("App Preferences operations can not be executed for windows that do not have app!");
            }
            return myAppName;
        }
        getSubscriptionKey(app) {
            return `prefs-changed-${app}`;
        }
        handleOnChanged({ prefs }) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const subscriptionKey = this.getSubscriptionKey(prefs.app);
                this.registry.execute(subscriptionKey, prefs);
            });
        }
    }

    class IoC {
        constructor() {
            this.controllers = {
                windows: this.windowsController,
                appManager: this.appManagerController,
                layouts: this.layoutsController,
                notifications: this.notificationsController,
                intents: this.intentsController,
                channels: this.channelsController,
                system: this.systemController,
                extension: this.extensionController,
                themes: this.themesController,
                prefs: this.prefsController
            };
        }
        get communicationId() {
            return this._communicationId;
        }
        get publicWindowId() {
            return this._publicWindowId;
        }
        get windowsController() {
            if (!this._windowsControllerInstance) {
                this._windowsControllerInstance = new WindowsController();
            }
            return this._windowsControllerInstance;
        }
        get appManagerController() {
            if (!this._appManagerControllerInstance) {
                this._appManagerControllerInstance = new AppManagerController();
            }
            return this._appManagerControllerInstance;
        }
        get layoutsController() {
            if (!this._layoutsControllerInstance) {
                this._layoutsControllerInstance = new LayoutsController();
            }
            return this._layoutsControllerInstance;
        }
        get themesController() {
            if (!this._themesControllerInstance) {
                this._themesControllerInstance = new ThemesController();
            }
            return this._themesControllerInstance;
        }
        get notificationsController() {
            if (!this._notificationsControllerInstance) {
                this._notificationsControllerInstance = new NotificationsController();
            }
            return this._notificationsControllerInstance;
        }
        get intentsController() {
            if (!this._intentsControllerInstance) {
                this._intentsControllerInstance = new IntentsController();
            }
            return this._intentsControllerInstance;
        }
        get legacyIntentsHelper() {
            if (!this._legacyIntentsHelperInstance) {
                this._legacyIntentsHelperInstance = new LegacyIntentsHelper(this._coreGlue.logger, this.bridge, this._coreGlue.interop, this.appManagerController, this.windowsController);
            }
            return this._legacyIntentsHelperInstance;
        }
        get systemController() {
            if (!this._systemControllerInstance) {
                this._systemControllerInstance = new SystemController();
            }
            return this._systemControllerInstance;
        }
        get channelsController() {
            if (!this._channelsControllerInstance) {
                this._channelsControllerInstance = new ChannelsController();
            }
            return this._channelsControllerInstance;
        }
        get prefsController() {
            if (!this._prefsControllerInstance) {
                this._prefsControllerInstance = new PrefsController();
            }
            return this._prefsControllerInstance;
        }
        get extensionController() {
            if (!this._extensionController) {
                this._extensionController = new ExtController();
            }
            return this._extensionController;
        }
        get eventsDispatcher() {
            if (!this._eventsDispatcher) {
                this._eventsDispatcher = new EventsDispatcher(this.config);
            }
            return this._eventsDispatcher;
        }
        get bridge() {
            if (!this._bridgeInstance) {
                this._bridgeInstance = new GlueBridge(this._coreGlue, this.communicationId);
            }
            return this._bridgeInstance;
        }
        get preferredConnectionController() {
            if (!this._preferredConnectionController) {
                this._preferredConnectionController = new PreferredConnectionController(this._coreGlue);
            }
            return this._preferredConnectionController;
        }
        get sessionController() {
            if (!this._sessionController) {
                this._sessionController = new SessionStorageController();
            }
            return this._sessionController;
        }
        get config() {
            return this._webConfig;
        }
        defineGlue(coreGlue) {
            this._coreGlue = coreGlue;
            this._publicWindowId = coreGlue.connection.transport.publicWindowId;
            const globalNamespace = window.glue42core || window.iobrowser;
            this._communicationId = coreGlue.connection.transport.communicationId || globalNamespace.communicationId;
        }
        defineConfig(config) {
            this._webConfig = config;
        }
        buildWebWindow(id, name) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const model = new WebWindowModel(id, name, this.bridge);
                const api = yield model.toApi();
                return { id, model, api };
            });
        }
        buildNotification(config, id) {
            return new Notification(config, id);
        }
        buildApplication(app, applicationInstances) {
            return __awaiter$1(this, void 0, void 0, function* () {
                const application = (new ApplicationModel(app, [], this.appManagerController)).toApi();
                const instances = applicationInstances.map((instanceData) => this.buildInstance(instanceData, application));
                application.instances.push(...instances);
                return application;
            });
        }
        buildInstance(instanceData, app) {
            return (new InstanceModel(instanceData, this.bridge, app)).toApi();
        }
    }

    var version$2 = "3.2.0";

    const createFactoryFunction = (coreFactoryFunction) => {
        return (userConfig) => __awaiter$1(void 0, void 0, void 0, function* () {
            if (window.glue42gd || window.iodesktop) {
                return enterprise(userConfig);
            }
            const ioc = new IoC();
            const config = parseConfig(userConfig);
            checkSingleton();
            const glue = yield PromiseWrap(() => coreFactoryFunction(config, { version: version$2 }), 30000, "Glue Web initialization timed out, because core didn't resolve");
            const logger = glue.logger.subLogger("web.main.controller");
            ioc.defineGlue(glue);
            ioc.sessionController.configure({ windowId: glue.interop.instance.instance });
            yield ioc.preferredConnectionController.start(config);
            yield ioc.bridge.start(ioc.controllers);
            ioc.defineConfig(config);
            logger.trace("the bridge has been started, initializing all controllers");
            yield Promise.all(Object.values(ioc.controllers).map((controller) => controller.start(glue, ioc)));
            logger.trace("all controllers reported started, starting all additional libraries");
            yield Promise.all(config.libraries.map((lib) => lib(glue, config)));
            logger.trace("all libraries were started");
            ioc.eventsDispatcher.start(glue);
            logger.trace("start event dispatched, glue is ready, returning it");
            return glue;
        });
    };

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var MetricTypes = {
        STRING: 1,
        NUMBER: 2,
        TIMESTAMP: 3,
        OBJECT: 4
    };

    function getMetricTypeByValue(metric) {
        if (metric.type === MetricTypes.TIMESTAMP) {
            return "timestamp";
        }
        else if (metric.type === MetricTypes.NUMBER) {
            return "number";
        }
        else if (metric.type === MetricTypes.STRING) {
            return "string";
        }
        else if (metric.type === MetricTypes.OBJECT) {
            return "object";
        }
        return "unknown";
    }
    function getTypeByValue(value) {
        if (value.constructor === Date) {
            return "timestamp";
        }
        else if (typeof value === "number") {
            return "number";
        }
        else if (typeof value === "string") {
            return "string";
        }
        else if (typeof value === "object") {
            return "object";
        }
        else {
            return "string";
        }
    }
    function serializeMetric(metric) {
        var serializedMetrics = {};
        var type = getMetricTypeByValue(metric);
        if (type === "object") {
            var values = Object.keys(metric.value).reduce(function (memo, key) {
                var innerType = getTypeByValue(metric.value[key]);
                if (innerType === "object") {
                    var composite = defineNestedComposite(metric.value[key]);
                    memo[key] = {
                        type: "object",
                        description: "",
                        context: {},
                        composite: composite,
                    };
                }
                else {
                    memo[key] = {
                        type: innerType,
                        description: "",
                        context: {},
                    };
                }
                return memo;
            }, {});
            serializedMetrics.composite = values;
        }
        serializedMetrics.name = normalizeMetricName(metric.path.join("/") + "/" + metric.name);
        serializedMetrics.type = type;
        serializedMetrics.description = metric.description;
        serializedMetrics.context = {};
        return serializedMetrics;
    }
    function defineNestedComposite(values) {
        return Object.keys(values).reduce(function (memo, key) {
            var type = getTypeByValue(values[key]);
            if (type === "object") {
                memo[key] = {
                    type: "object",
                    description: "",
                    context: {},
                    composite: defineNestedComposite(values[key]),
                };
            }
            else {
                memo[key] = {
                    type: type,
                    description: "",
                    context: {},
                };
            }
            return memo;
        }, {});
    }
    function normalizeMetricName(name) {
        if (typeof name !== "undefined" && name.length > 0 && name[0] !== "/") {
            return "/" + name;
        }
        else {
            return name;
        }
    }
    function getMetricValueByType(metric) {
        var type = getMetricTypeByValue(metric);
        if (type === "timestamp") {
            return Date.now();
        }
        else {
            return publishNestedComposite(metric.value);
        }
    }
    function publishNestedComposite(values) {
        if (typeof values !== "object") {
            return values;
        }
        return Object.keys(values).reduce(function (memo, key) {
            var value = values[key];
            if (typeof value === "object" && value.constructor !== Date) {
                memo[key] = publishNestedComposite(value);
            }
            else if (value.constructor === Date) {
                memo[key] = new Date(value).getTime();
            }
            else if (value.constructor === Boolean) {
                memo[key] = value.toString();
            }
            else {
                memo[key] = value;
            }
            return memo;
        }, {});
    }
    function flatten(arr) {
        return arr.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
    }
    function getHighestState(arr) {
        return arr.sort(function (a, b) {
            if (!a.state) {
                return 1;
            }
            if (!b.state) {
                return -1;
            }
            return b.state - a.state;
        })[0];
    }
    function aggregateDescription(arr) {
        var msg = "";
        arr.forEach(function (m, idx, a) {
            var path = m.path.join(".");
            if (idx === a.length - 1) {
                msg += path + "." + m.name + ": " + m.description;
            }
            else {
                msg += path + "." + m.name + ": " + m.description + ",";
            }
        });
        if (msg.length > 100) {
            return msg.slice(0, 100) + "...";
        }
        else {
            return msg;
        }
    }
    function composeMsgForRootStateMetric(system) {
        var aggregatedState = system.root.getAggregateState();
        var merged = flatten(aggregatedState);
        var highestState = getHighestState(merged);
        var aggregateDesc = aggregateDescription(merged);
        return {
            description: aggregateDesc,
            value: highestState.state,
        };
    }

    function gw3 (connection, config) {
        var _this = this;
        if (!connection || typeof connection !== "object") {
            throw new Error("Connection is required parameter");
        }
        var joinPromise;
        var session;
        var init = function (repo) {
            var resolveReadyPromise;
            joinPromise = new Promise(function (resolve) {
                resolveReadyPromise = resolve;
            });
            session = connection.domain("metrics");
            session.onJoined(function (reconnect) {
                if (!reconnect && resolveReadyPromise) {
                    resolveReadyPromise();
                    resolveReadyPromise = undefined;
                }
                var rootStateMetric = {
                    name: "/State",
                    type: "object",
                    composite: {
                        Description: {
                            type: "string",
                            description: "",
                        },
                        Value: {
                            type: "number",
                            description: "",
                        },
                    },
                    description: "System state",
                    context: {},
                };
                var defineRootMetricsMsg = {
                    type: "define",
                    metrics: [rootStateMetric],
                };
                session.send(defineRootMetricsMsg);
                if (reconnect) {
                    replayRepo(repo);
                }
            });
            session.join({
                system: config.system,
                service: config.service,
                instance: config.instance
            });
        };
        var replayRepo = function (repo) {
            replaySystem(repo.root);
        };
        var replaySystem = function (system) {
            createSystem(system);
            system.metrics.forEach(function (m) {
                createMetric(m);
            });
            system.subSystems.forEach(function (ss) {
                replaySystem(ss);
            });
        };
        var createSystem = function (system) { return __awaiter(_this, void 0, void 0, function () {
            var metric, createMetricsMsg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (system.parent === undefined) {
                            return [2];
                        }
                        return [4, joinPromise];
                    case 1:
                        _a.sent();
                        metric = {
                            name: normalizeMetricName(system.path.join("/") + "/" + system.name + "/State"),
                            type: "object",
                            composite: {
                                Description: {
                                    type: "string",
                                    description: "",
                                },
                                Value: {
                                    type: "number",
                                    description: "",
                                },
                            },
                            description: "System state",
                            context: {},
                        };
                        createMetricsMsg = {
                            type: "define",
                            metrics: [metric],
                        };
                        session.send(createMetricsMsg);
                        return [2];
                }
            });
        }); };
        var updateSystem = function (system, state) { return __awaiter(_this, void 0, void 0, function () {
            var shadowedUpdateMetric, stateObj, rootMetric;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, joinPromise];
                    case 1:
                        _a.sent();
                        shadowedUpdateMetric = {
                            type: "publish",
                            values: [{
                                    name: normalizeMetricName(system.path.join("/") + "/" + system.name + "/State"),
                                    value: {
                                        Description: state.description,
                                        Value: state.state,
                                    },
                                    timestamp: Date.now(),
                                }],
                        };
                        session.send(shadowedUpdateMetric);
                        stateObj = composeMsgForRootStateMetric(system);
                        rootMetric = {
                            type: "publish",
                            peer_id: connection.peerId,
                            values: [{
                                    name: "/State",
                                    value: {
                                        Description: stateObj.description,
                                        Value: stateObj.value,
                                    },
                                    timestamp: Date.now(),
                                }],
                        };
                        session.send(rootMetric);
                        return [2];
                }
            });
        }); };
        var createMetric = function (metric) { return __awaiter(_this, void 0, void 0, function () {
            var metricClone, m, createMetricsMsg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metricClone = cloneMetric(metric);
                        return [4, joinPromise];
                    case 1:
                        _a.sent();
                        m = serializeMetric(metricClone);
                        createMetricsMsg = {
                            type: "define",
                            metrics: [m],
                        };
                        session.send(createMetricsMsg);
                        if (typeof metricClone.value !== "undefined") {
                            updateMetricCore(metricClone);
                        }
                        return [2];
                }
            });
        }); };
        var updateMetric = function (metric) { return __awaiter(_this, void 0, void 0, function () {
            var metricClone;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metricClone = cloneMetric(metric);
                        return [4, joinPromise];
                    case 1:
                        _a.sent();
                        updateMetricCore(metricClone);
                        return [2];
                }
            });
        }); };
        var updateMetricCore = function (metric) {
            if (canUpdate()) {
                var value = getMetricValueByType(metric);
                var publishMetricsMsg = {
                    type: "publish",
                    values: [{
                            name: normalizeMetricName(metric.path.join("/") + "/" + metric.name),
                            value: value,
                            timestamp: Date.now(),
                        }],
                };
                return session.sendFireAndForget(publishMetricsMsg);
            }
            return Promise.resolve();
        };
        var cloneMetric = function (metric) {
            var metricClone = __assign({}, metric);
            if (typeof metric.value === "object" && metric.value !== null) {
                metricClone.value = __assign({}, metric.value);
            }
            return metricClone;
        };
        var canUpdate = function () {
            var _a;
            try {
                var func = (_a = config.canUpdateMetric) !== null && _a !== void 0 ? _a : (function () { return true; });
                return func();
            }
            catch (_b) {
                return true;
            }
        };
        return {
            init: init,
            createSystem: createSystem,
            updateSystem: updateSystem,
            createMetric: createMetric,
            updateMetric: updateMetric,
        };
    }

    var Helpers = {
        validate: function (definition, parent, transport) {
            if (definition === null || typeof definition !== "object") {
                throw new Error("Missing definition");
            }
            if (parent === null || typeof parent !== "object") {
                throw new Error("Missing parent");
            }
            if (transport === null || typeof transport !== "object") {
                throw new Error("Missing transport");
            }
        },
    };

    var BaseMetric = (function () {
        function BaseMetric(definition, system, transport, value, type) {
            this.definition = definition;
            this.system = system;
            this.transport = transport;
            this.value = value;
            this.type = type;
            this.path = [];
            Helpers.validate(definition, system, transport);
            this.path = system.path.slice(0);
            this.path.push(system.name);
            this.name = definition.name;
            this.description = definition.description;
            transport.createMetric(this);
        }
        Object.defineProperty(BaseMetric.prototype, "repo", {
            get: function () {
                var _a;
                return (_a = this.system) === null || _a === void 0 ? void 0 : _a.repo;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseMetric.prototype, "id", {
            get: function () { return "".concat(this.system.path, "/").concat(name); },
            enumerable: false,
            configurable: true
        });
        BaseMetric.prototype.update = function (newValue) {
            this.value = newValue;
            return this.transport.updateMetric(this);
        };
        return BaseMetric;
    }());

    var NumberMetric = (function (_super) {
        __extends(NumberMetric, _super);
        function NumberMetric(definition, system, transport, value) {
            return _super.call(this, definition, system, transport, value, MetricTypes.NUMBER) || this;
        }
        NumberMetric.prototype.incrementBy = function (num) {
            this.update(this.value + num);
        };
        NumberMetric.prototype.increment = function () {
            this.incrementBy(1);
        };
        NumberMetric.prototype.decrement = function () {
            this.incrementBy(-1);
        };
        NumberMetric.prototype.decrementBy = function (num) {
            this.incrementBy(num * -1);
        };
        return NumberMetric;
    }(BaseMetric));

    var ObjectMetric = (function (_super) {
        __extends(ObjectMetric, _super);
        function ObjectMetric(definition, system, transport, value) {
            return _super.call(this, definition, system, transport, value, MetricTypes.OBJECT) || this;
        }
        ObjectMetric.prototype.update = function (newValue) {
            this.mergeValues(newValue);
            return this.transport.updateMetric(this);
        };
        ObjectMetric.prototype.mergeValues = function (values) {
            var _this = this;
            return Object.keys(this.value).forEach(function (k) {
                if (typeof values[k] !== "undefined") {
                    _this.value[k] = values[k];
                }
            });
        };
        return ObjectMetric;
    }(BaseMetric));

    var StringMetric = (function (_super) {
        __extends(StringMetric, _super);
        function StringMetric(definition, system, transport, value) {
            return _super.call(this, definition, system, transport, value, MetricTypes.STRING) || this;
        }
        return StringMetric;
    }(BaseMetric));

    var TimestampMetric = (function (_super) {
        __extends(TimestampMetric, _super);
        function TimestampMetric(definition, system, transport, value) {
            return _super.call(this, definition, system, transport, value, MetricTypes.TIMESTAMP) || this;
        }
        TimestampMetric.prototype.now = function () {
            this.update(new Date());
        };
        return TimestampMetric;
    }(BaseMetric));

    function system(name, repo, protocol, parent, description) {
        if (!repo) {
            throw new Error("Repository is required");
        }
        if (!protocol) {
            throw new Error("Transport is required");
        }
        var _transport = protocol;
        var _name = name;
        var _description = description || "";
        var _repo = repo;
        var _parent = parent;
        var _path = _buildPath(parent);
        var _state = {};
        var id = _arrayToString(_path, "/") + name;
        var root = repo.root;
        var _subSystems = [];
        var _metrics = [];
        function subSystem(nameSystem, descriptionSystem) {
            if (!nameSystem || nameSystem.length === 0) {
                throw new Error("name is required");
            }
            var match = _subSystems.filter(function (s) { return s.name === nameSystem; });
            if (match.length > 0) {
                return match[0];
            }
            var _system = system(nameSystem, _repo, _transport, me, descriptionSystem);
            _subSystems.push(_system);
            return _system;
        }
        function setState(state, stateDescription) {
            _state = { state: state, description: stateDescription };
            _transport.updateSystem(me, _state);
        }
        function stringMetric(definition, value) {
            return _getOrCreateMetric(definition, MetricTypes.STRING, value, function (metricDef) { return new StringMetric(metricDef, me, _transport, value); });
        }
        function numberMetric(definition, value) {
            return _getOrCreateMetric(definition, MetricTypes.NUMBER, value, function (metricDef) { return new NumberMetric(metricDef, me, _transport, value); });
        }
        function objectMetric(definition, value) {
            return _getOrCreateMetric(definition, MetricTypes.OBJECT, value, function (metricDef) { return new ObjectMetric(metricDef, me, _transport, value); });
        }
        function timestampMetric(definition, value) {
            return _getOrCreateMetric(definition, MetricTypes.TIMESTAMP, value, function (metricDef) { return new TimestampMetric(metricDef, me, _transport, value); });
        }
        function _getOrCreateMetric(metricObject, expectedType, value, createMetric) {
            var metricDef = { name: "" };
            if (typeof metricObject === "string") {
                metricDef = { name: metricObject };
            }
            else {
                metricDef = metricObject;
            }
            var matching = _metrics.filter(function (shadowedMetric) { return shadowedMetric.name === metricDef.name; });
            if (matching.length > 0) {
                var existing = matching[0];
                if (existing.type !== expectedType) {
                    throw new Error("A metric named ".concat(metricDef.name, " is already defined with different type."));
                }
                if (typeof value !== "undefined") {
                    existing
                        .update(value)
                        .catch(function () { });
                }
                return existing;
            }
            var metric = createMetric(metricDef);
            _metrics.push(metric);
            return metric;
        }
        function _buildPath(shadowedSystem) {
            if (!shadowedSystem || !shadowedSystem.parent) {
                return [];
            }
            var path = _buildPath(shadowedSystem.parent);
            path.push(shadowedSystem.name);
            return path;
        }
        function _arrayToString(path, separator) {
            return ((path && path.length > 0) ? path.join(separator) : "");
        }
        function getAggregateState() {
            var aggState = [];
            if (Object.keys(_state).length > 0) {
                aggState.push({
                    name: _name,
                    path: _path,
                    state: _state.state,
                    description: _state.description,
                });
            }
            _subSystems.forEach(function (shadowedSubSystem) {
                var result = shadowedSubSystem.getAggregateState();
                if (result.length > 0) {
                    aggState.push.apply(aggState, result);
                }
            });
            return aggState;
        }
        var me = {
            get name() {
                return _name;
            },
            get description() {
                return _description;
            },
            get repo() {
                return _repo;
            },
            get parent() {
                return _parent;
            },
            path: _path,
            id: id,
            root: root,
            get subSystems() {
                return _subSystems;
            },
            get metrics() {
                return _metrics;
            },
            subSystem: subSystem,
            getState: function () {
                return _state;
            },
            setState: setState,
            stringMetric: stringMetric,
            timestampMetric: timestampMetric,
            objectMetric: objectMetric,
            numberMetric: numberMetric,
            getAggregateState: getAggregateState,
        };
        _transport.createSystem(me);
        return me;
    }

    var Repository = (function () {
        function Repository(options, protocol) {
            protocol.init(this);
            this.root = system("", this, protocol);
            this.addSystemMetrics(this.root, options.clickStream || options.clickStream === undefined);
        }
        Repository.prototype.addSystemMetrics = function (rootSystem, useClickStream) {
            if (typeof navigator !== "undefined") {
                rootSystem.stringMetric("UserAgent", navigator.userAgent);
            }
            if (useClickStream && typeof document !== "undefined") {
                var clickStream_1 = rootSystem.subSystem("ClickStream");
                var documentClickHandler = function (e) {
                    var _a;
                    if (!e.target) {
                        return;
                    }
                    var target = e.target;
                    var className = target ? (_a = target.getAttribute("class")) !== null && _a !== void 0 ? _a : "" : "";
                    clickStream_1.objectMetric("LastBrowserEvent", {
                        type: "click",
                        timestamp: new Date(),
                        target: {
                            className: className,
                            id: target.id,
                            type: "<" + target.tagName.toLowerCase() + ">",
                            href: target.href || "",
                        },
                    });
                };
                clickStream_1.objectMetric("Page", {
                    title: document.title,
                    page: window.location.href,
                });
                if (document.addEventListener) {
                    document.addEventListener("click", documentClickHandler);
                }
                else {
                    document.attachEvent("onclick", documentClickHandler);
                }
            }
            rootSystem.stringMetric("StartTime", (new Date()).toString());
            var urlMetric = rootSystem.stringMetric("StartURL", "");
            var appNameMetric = rootSystem.stringMetric("AppName", "");
            if (typeof window !== "undefined") {
                if (typeof window.location !== "undefined") {
                    var startUrl = window.location.href;
                    urlMetric.update(startUrl);
                }
                if (typeof window.glue42gd !== "undefined") {
                    appNameMetric.update(window.glue42gd.appName);
                }
            }
        };
        return Repository;
    }());

    var NullProtocol = (function () {
        function NullProtocol() {
        }
        NullProtocol.prototype.init = function (repo) {
        };
        NullProtocol.prototype.createSystem = function (system) {
            return Promise.resolve();
        };
        NullProtocol.prototype.updateSystem = function (metric, state) {
            return Promise.resolve();
        };
        NullProtocol.prototype.createMetric = function (metric) {
            return Promise.resolve();
        };
        NullProtocol.prototype.updateMetric = function (metric) {
            return Promise.resolve();
        };
        return NullProtocol;
    }());

    var PerfTracker = (function () {
        function PerfTracker(api, initialPublishTimeout, publishInterval) {
            this.api = api;
            this.lastCount = 0;
            this.initialPublishTimeout = 10 * 1000;
            this.publishInterval = 60 * 1000;
            this.initialPublishTimeout = initialPublishTimeout !== null && initialPublishTimeout !== void 0 ? initialPublishTimeout : this.initialPublishTimeout;
            this.publishInterval = publishInterval !== null && publishInterval !== void 0 ? publishInterval : this.publishInterval;
            this.scheduleCollection();
            this.system = this.api.subSystem("performance", "Performance data published by the web application");
        }
        PerfTracker.prototype.scheduleCollection = function () {
            var _this = this;
            setTimeout(function () {
                _this.collect();
                setInterval(function () {
                    _this.collect();
                }, _this.publishInterval);
            }, this.initialPublishTimeout);
        };
        PerfTracker.prototype.collect = function () {
            try {
                this.collectMemory();
                this.collectEntries();
            }
            catch (_a) {
            }
        };
        PerfTracker.prototype.collectMemory = function () {
            var memory = window.performance.memory;
            this.system.stringMetric("memory", JSON.stringify({
                totalJSHeapSize: memory.totalJSHeapSize,
                usedJSHeapSize: memory.usedJSHeapSize
            }));
        };
        PerfTracker.prototype.collectEntries = function () {
            var allEntries = window.performance.getEntries();
            if (allEntries.length <= this.lastCount) {
                return;
            }
            this.lastCount = allEntries.length;
            var jsonfiedEntries = allEntries.map(function (i) { return i.toJSON(); });
            this.system.stringMetric("entries", JSON.stringify(jsonfiedEntries));
        };
        return PerfTracker;
    }());

    var metrics = (function (options) {
        var protocol;
        if (!options.connection || typeof options.connection !== "object") {
            protocol = new NullProtocol();
        }
        else {
            protocol = gw3(options.connection, options);
        }
        var repo = new Repository(options, protocol);
        var rootSystem = repo.root;
        if (!options.disableAutoAppSystem) {
            rootSystem = rootSystem.subSystem("App");
        }
        var api = addFAVSupport(rootSystem);
        initPerf(api, options.pagePerformanceMetrics);
        return api;
    });
    function initPerf(api, config) {
        var _a, _b;
        if (typeof window === "undefined") {
            return;
        }
        var perfConfig = (_b = (_a = window === null || window === void 0 ? void 0 : window.glue42gd) === null || _a === void 0 ? void 0 : _a.metrics) === null || _b === void 0 ? void 0 : _b.pagePerformanceMetrics;
        if (perfConfig) {
            config = perfConfig;
        }
        if (config === null || config === void 0 ? void 0 : config.enabled) {
            new PerfTracker(api, config.initialPublishTimeout, config.publishInterval);
        }
    }
    function addFAVSupport(system) {
        var reportingSystem = system.subSystem("reporting");
        var def = {
            name: "features"
        };
        var featureMetric;
        var featureMetricFunc = function (name, action, payload) {
            if (typeof name === "undefined" || name === "") {
                throw new Error("name is mandatory");
            }
            else if (typeof action === "undefined" || action === "") {
                throw new Error("action is mandatory");
            }
            else if (typeof payload === "undefined" || payload === "") {
                throw new Error("payload is mandatory");
            }
            if (!featureMetric) {
                featureMetric = reportingSystem.objectMetric(def, { name: name, action: action, payload: payload });
            }
            else {
                featureMetric.update({
                    name: name,
                    action: action,
                    payload: payload
                });
            }
        };
        system.featureMetric = featureMetricFunc;
        return system;
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createRegistry(options) {
        if (options && options.errorHandling
            && typeof options.errorHandling !== "function"
            && options.errorHandling !== "log"
            && options.errorHandling !== "silent"
            && options.errorHandling !== "throw") {
            throw new Error("Invalid options passed to createRegistry. Prop errorHandling should be [\"log\" | \"silent\" | \"throw\" | (err) => void], but " + typeof options.errorHandling + " was passed");
        }
        var _userErrorHandler = options && typeof options.errorHandling === "function" && options.errorHandling;
        var callbacks = {};
        function add(key, callback, replayArgumentsArr) {
            var callbacksForKey = callbacks[key];
            if (!callbacksForKey) {
                callbacksForKey = [];
                callbacks[key] = callbacksForKey;
            }
            callbacksForKey.push(callback);
            if (replayArgumentsArr) {
                setTimeout(function () {
                    replayArgumentsArr.forEach(function (replayArgument) {
                        var _a;
                        if ((_a = callbacks[key]) === null || _a === void 0 ? void 0 : _a.includes(callback)) {
                            try {
                                if (Array.isArray(replayArgument)) {
                                    callback.apply(undefined, replayArgument);
                                }
                                else {
                                    callback.apply(undefined, [replayArgument]);
                                }
                            }
                            catch (err) {
                                _handleError(err, key);
                            }
                        }
                    });
                }, 0);
            }
            return function () {
                var allForKey = callbacks[key];
                if (!allForKey) {
                    return;
                }
                allForKey = allForKey.reduce(function (acc, element, index) {
                    if (!(element === callback && acc.length === index)) {
                        acc.push(element);
                    }
                    return acc;
                }, []);
                if (allForKey.length === 0) {
                    delete callbacks[key];
                }
                else {
                    callbacks[key] = allForKey;
                }
            };
        }
        function execute(key) {
            var argumentsArr = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                argumentsArr[_i - 1] = arguments[_i];
            }
            var callbacksForKey = callbacks[key];
            if (!callbacksForKey || callbacksForKey.length === 0) {
                return [];
            }
            var results = [];
            callbacksForKey.forEach(function (callback) {
                try {
                    var result = callback.apply(undefined, argumentsArr);
                    results.push(result);
                }
                catch (err) {
                    results.push(undefined);
                    _handleError(err, key);
                }
            });
            return results;
        }
        function _handleError(exceptionArtifact, key) {
            var errParam = exceptionArtifact instanceof Error ? exceptionArtifact : new Error(exceptionArtifact);
            if (_userErrorHandler) {
                _userErrorHandler(errParam);
                return;
            }
            var msg = "[ERROR] callback-registry: User callback for key \"" + key + "\" failed: " + errParam.stack;
            if (options) {
                switch (options.errorHandling) {
                    case "log":
                        return console.error(msg);
                    case "silent":
                        return;
                    case "throw":
                        throw new Error(msg);
                }
            }
            console.error(msg);
        }
        function clear() {
            callbacks = {};
        }
        function clearKey(key) {
            var callbacksForKey = callbacks[key];
            if (!callbacksForKey) {
                return;
            }
            delete callbacks[key];
        }
        return {
            add: add,
            execute: execute,
            clear: clear,
            clearKey: clearKey
        };
    }
    createRegistry.default = createRegistry;
    var lib$1 = createRegistry;

    var InProcTransport = (function () {
        function InProcTransport(settings, logger) {
            var _this = this;
            this.registry = lib$1();
            this.gw = settings.facade;
            this.gw.connect(function (_client, message) {
                _this.messageHandler(message);
            }).then(function (client) {
                _this.client = client;
            });
        }
        Object.defineProperty(InProcTransport.prototype, "isObjectBasedTransport", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        InProcTransport.prototype.sendObject = function (msg) {
            if (this.client) {
                this.client.send(msg);
                return Promise.resolve(undefined);
            }
            else {
                return Promise.reject("not connected");
            }
        };
        InProcTransport.prototype.send = function (_msg) {
            return Promise.reject("not supported");
        };
        InProcTransport.prototype.onMessage = function (callback) {
            return this.registry.add("onMessage", callback);
        };
        InProcTransport.prototype.onConnectedChanged = function (callback) {
            callback(true);
            return function () { };
        };
        InProcTransport.prototype.close = function () {
            return Promise.resolve();
        };
        InProcTransport.prototype.open = function () {
            return Promise.resolve();
        };
        InProcTransport.prototype.name = function () {
            return "in-memory";
        };
        InProcTransport.prototype.reconnect = function () {
            return Promise.resolve();
        };
        InProcTransport.prototype.messageHandler = function (msg) {
            this.registry.execute("onMessage", msg);
        };
        return InProcTransport;
    }());

    var SharedWorkerTransport = (function () {
        function SharedWorkerTransport(workerFile, logger) {
            var _this = this;
            this.logger = logger;
            this.registry = lib$1();
            this.worker = new SharedWorker(workerFile);
            this.worker.port.onmessage = function (e) {
                _this.messageHandler(e.data);
            };
        }
        Object.defineProperty(SharedWorkerTransport.prototype, "isObjectBasedTransport", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        SharedWorkerTransport.prototype.sendObject = function (msg) {
            this.worker.port.postMessage(msg);
            return Promise.resolve();
        };
        SharedWorkerTransport.prototype.send = function (_msg) {
            return Promise.reject("not supported");
        };
        SharedWorkerTransport.prototype.onMessage = function (callback) {
            return this.registry.add("onMessage", callback);
        };
        SharedWorkerTransport.prototype.onConnectedChanged = function (callback) {
            callback(true);
            return function () { };
        };
        SharedWorkerTransport.prototype.close = function () {
            return Promise.resolve();
        };
        SharedWorkerTransport.prototype.open = function () {
            return Promise.resolve();
        };
        SharedWorkerTransport.prototype.name = function () {
            return "shared-worker";
        };
        SharedWorkerTransport.prototype.reconnect = function () {
            return Promise.resolve();
        };
        SharedWorkerTransport.prototype.messageHandler = function (msg) {
            this.registry.execute("onMessage", msg);
        };
        return SharedWorkerTransport;
    }());

    var Utils = (function () {
        function Utils() {
        }
        Utils.isNode = function () {
            if (typeof Utils._isNode !== "undefined") {
                return Utils._isNode;
            }
            if (typeof window !== "undefined") {
                Utils._isNode = false;
                return false;
            }
            try {
                Utils._isNode = Object.prototype.toString.call(global.process) === "[object process]";
            }
            catch (e) {
                Utils._isNode = false;
            }
            return Utils._isNode;
        };
        return Utils;
    }());

    var PromiseWrapper = (function () {
        function PromiseWrapper() {
            var _this = this;
            this.rejected = false;
            this.resolved = false;
            this.promise = new Promise(function (resolve, reject) {
                _this.resolve = function (t) {
                    _this.resolved = true;
                    resolve(t);
                };
                _this.reject = function (err) {
                    _this.rejected = true;
                    reject(err);
                };
            });
        }
        PromiseWrapper.delay = function (time) {
            return new Promise(function (resolve) { return setTimeout(resolve, time); });
        };
        Object.defineProperty(PromiseWrapper.prototype, "ended", {
            get: function () {
                return this.rejected || this.resolved;
            },
            enumerable: false,
            configurable: true
        });
        return PromiseWrapper;
    }());

    var timers = {};
    function getAllTimers() {
        return timers;
    }
    function timer (timerName) {
        var existing = timers[timerName];
        if (existing) {
            return existing;
        }
        var marks = [];
        function now() {
            return new Date().getTime();
        }
        var startTime = now();
        mark("start", startTime);
        var endTime;
        var period;
        function stop() {
            endTime = now();
            mark("end", endTime);
            period = endTime - startTime;
            return period;
        }
        function mark(name, time) {
            var currentTime = time !== null && time !== void 0 ? time : now();
            var diff = 0;
            if (marks.length > 0) {
                diff = currentTime - marks[marks.length - 1].time;
            }
            marks.push({ name: name, time: currentTime, diff: diff });
        }
        var timerObj = {
            get startTime() {
                return startTime;
            },
            get endTime() {
                return endTime;
            },
            get period() {
                return period;
            },
            stop: stop,
            mark: mark,
            marks: marks
        };
        timers[timerName] = timerObj;
        return timerObj;
    }

    var WebSocketConstructor = Utils.isNode() ? require("ws") : window.WebSocket;
    var WS = (function () {
        function WS(settings, logger) {
            this.startupTimer = timer("connection");
            this._running = true;
            this._registry = lib$1();
            this.wsRequests = [];
            this.settings = settings;
            this.logger = logger;
            if (!this.settings.ws) {
                throw new Error("ws is missing");
            }
        }
        WS.prototype.onMessage = function (callback) {
            return this._registry.add("onMessage", callback);
        };
        WS.prototype.send = function (msg, options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.waitForSocketConnection(function () {
                    var _a;
                    try {
                        (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.send(msg);
                        resolve();
                    }
                    catch (e) {
                        reject(e);
                    }
                }, reject);
            });
        };
        WS.prototype.open = function () {
            var _this = this;
            this.logger.info("opening ws...");
            this._running = true;
            return new Promise(function (resolve, reject) {
                _this.waitForSocketConnection(resolve, reject);
            });
        };
        WS.prototype.close = function () {
            this._running = false;
            if (this.ws) {
                this.ws.close();
            }
            return Promise.resolve();
        };
        WS.prototype.onConnectedChanged = function (callback) {
            return this._registry.add("onConnectedChanged", callback);
        };
        WS.prototype.name = function () {
            return this.settings.ws;
        };
        WS.prototype.reconnect = function () {
            var _a;
            (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
            var pw = new PromiseWrapper();
            this.waitForSocketConnection(function () {
                pw.resolve();
            });
            return pw.promise;
        };
        WS.prototype.waitForSocketConnection = function (callback, failed) {
            var _a;
            failed = failed !== null && failed !== void 0 ? failed : (function () { });
            if (!this._running) {
                failed("wait for socket on ".concat(this.settings.ws, " failed - socket closed by user"));
                return;
            }
            if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === 1) {
                callback();
                return;
            }
            this.wsRequests.push({ callback: callback, failed: failed });
            if (this.wsRequests.length > 1) {
                return;
            }
            this.openSocket();
        };
        WS.prototype.openSocket = function (retryInterval, retriesLeft) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.startupTimer.mark("opening-socket");
                            if (retryInterval === undefined) {
                                retryInterval = this.settings.reconnectInterval;
                            }
                            if (typeof retriesLeft === "undefined") {
                                retriesLeft = this.settings.reconnectAttempts;
                            }
                            if (retriesLeft !== undefined) {
                                if (retriesLeft === 0) {
                                    this.notifyForSocketState("wait for socket on ".concat(this.settings.ws, " failed - no more retries left"));
                                    return [2];
                                }
                                this.logger.debug("will retry ".concat(retriesLeft, " more times (every ").concat(retryInterval, " ms)"));
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4, this.initiateSocket()];
                        case 2:
                            _b.sent();
                            this.startupTimer.mark("socket-initiated");
                            this.notifyForSocketState();
                            return [3, 4];
                        case 3:
                            _b.sent();
                            setTimeout(function () {
                                var retries = retriesLeft === undefined ? undefined : retriesLeft - 1;
                                _this.openSocket(retryInterval, retries);
                            }, retryInterval);
                            return [3, 4];
                        case 4: return [2];
                    }
                });
            });
        };
        WS.prototype.initiateSocket = function () {
            var _this = this;
            var pw = new PromiseWrapper();
            this.logger.debug("initiating ws to ".concat(this.settings.ws, "..."));
            this.ws = new WebSocketConstructor(this.settings.ws || "");
            this.ws.onerror = function (err) {
                var reason = "";
                try {
                    reason = JSON.stringify(err);
                }
                catch (error) {
                    var seen_1 = new WeakSet();
                    var replacer = function (key, value) {
                        if (typeof value === "object" && value !== null) {
                            if (seen_1.has(value)) {
                                return;
                            }
                            seen_1.add(value);
                        }
                        return value;
                    };
                    reason = JSON.stringify(err, replacer);
                }
                pw.reject("error");
                _this.notifyStatusChanged(false, reason);
            };
            this.ws.onclose = function (err) {
                _this.logger.info("ws closed ".concat(err));
                pw.reject("closed");
                _this.notifyStatusChanged(false);
            };
            this.ws.onopen = function () {
                var _a;
                _this.startupTimer.mark("ws-opened");
                _this.logger.info("ws opened ".concat((_a = _this.settings.identity) === null || _a === void 0 ? void 0 : _a.application));
                pw.resolve();
                _this.notifyStatusChanged(true);
            };
            this.ws.onmessage = function (message) {
                _this._registry.execute("onMessage", message.data);
            };
            return pw.promise;
        };
        WS.prototype.notifyForSocketState = function (error) {
            this.wsRequests.forEach(function (wsRequest) {
                if (error) {
                    if (wsRequest.failed) {
                        wsRequest.failed(error);
                    }
                }
                else {
                    wsRequest.callback();
                }
            });
            this.wsRequests = [];
        };
        WS.prototype.notifyStatusChanged = function (status, reason) {
            this._registry.execute("onConnectedChanged", status, reason);
        };
        return WS;
    }());

    var shortidExports = {};
    var shortid$1 = {
      get exports(){ return shortidExports; },
      set exports(v){ shortidExports = v; },
    };

    var libExports = {};
    var lib = {
      get exports(){ return libExports; },
      set exports(v){ libExports = v; },
    };

    // Found this seed-based random generator somewhere
    // Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

    var seed = 1;

    /**
     * return a random number based on a seed
     * @param seed
     * @returns {number}
     */
    function getNextValue() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed/(233280.0);
    }

    function setSeed$1(_seed_) {
        seed = _seed_;
    }

    var randomFromSeed$1 = {
        nextValue: getNextValue,
        seed: setSeed$1
    };

    var randomFromSeed = randomFromSeed$1;

    var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
    var alphabet$2;
    var previousSeed;

    var shuffled;

    function reset() {
        shuffled = false;
    }

    function setCharacters(_alphabet_) {
        if (!_alphabet_) {
            if (alphabet$2 !== ORIGINAL) {
                alphabet$2 = ORIGINAL;
                reset();
            }
            return;
        }

        if (_alphabet_ === alphabet$2) {
            return;
        }

        if (_alphabet_.length !== ORIGINAL.length) {
            throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
        }

        var unique = _alphabet_.split('').filter(function(item, ind, arr){
           return ind !== arr.lastIndexOf(item);
        });

        if (unique.length) {
            throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
        }

        alphabet$2 = _alphabet_;
        reset();
    }

    function characters(_alphabet_) {
        setCharacters(_alphabet_);
        return alphabet$2;
    }

    function setSeed(seed) {
        randomFromSeed.seed(seed);
        if (previousSeed !== seed) {
            reset();
            previousSeed = seed;
        }
    }

    function shuffle() {
        if (!alphabet$2) {
            setCharacters(ORIGINAL);
        }

        var sourceArray = alphabet$2.split('');
        var targetArray = [];
        var r = randomFromSeed.nextValue();
        var characterIndex;

        while (sourceArray.length > 0) {
            r = randomFromSeed.nextValue();
            characterIndex = Math.floor(r * sourceArray.length);
            targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
        }
        return targetArray.join('');
    }

    function getShuffled() {
        if (shuffled) {
            return shuffled;
        }
        shuffled = shuffle();
        return shuffled;
    }

    /**
     * lookup shuffled letter
     * @param index
     * @returns {string}
     */
    function lookup(index) {
        var alphabetShuffled = getShuffled();
        return alphabetShuffled[index];
    }

    function get () {
      return alphabet$2 || ORIGINAL;
    }

    var alphabet_1 = {
        get: get,
        characters: characters,
        seed: setSeed,
        lookup: lookup,
        shuffled: getShuffled
    };

    var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

    var randomByte;

    if (!crypto || !crypto.getRandomValues) {
        randomByte = function(size) {
            var bytes = [];
            for (var i = 0; i < size; i++) {
                bytes.push(Math.floor(Math.random() * 256));
            }
            return bytes;
        };
    } else {
        randomByte = function(size) {
            return crypto.getRandomValues(new Uint8Array(size));
        };
    }

    var randomByteBrowser = randomByte;

    // This file replaces `format.js` in bundlers like webpack or Rollup,
    // according to `browser` config in `package.json`.

    var format_browser = function (random, alphabet, size) {
      // We can’t use bytes bigger than the alphabet. To make bytes values closer
      // to the alphabet, we apply bitmask on them. We look for the closest
      // `2 ** x - 1` number, which will be bigger than alphabet size. If we have
      // 30 symbols in the alphabet, we will take 31 (00011111).
      // We do not use faster Math.clz32, because it is not available in browsers.
      var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;
      // Bitmask is not a perfect solution (in our example it will pass 31 bytes,
      // which is bigger than the alphabet). As a result, we will need more bytes,
      // than ID size, because we will refuse bytes bigger than the alphabet.

      // Every hardware random generator call is costly,
      // because we need to wait for entropy collection. This is why often it will
      // be faster to ask for few extra bytes in advance, to avoid additional calls.

      // Here we calculate how many random bytes should we call in advance.
      // It depends on ID length, mask / alphabet size and magic number 1.6
      // (which was selected according benchmarks).

      // -~f => Math.ceil(f) if n is float number
      // -~i => i + 1 if n is integer number
      var step = -~(1.6 * mask * size / alphabet.length);
      var id = '';

      while (true) {
        var bytes = random(step);
        // Compact alternative for `for (var i = 0; i < step; i++)`
        var i = step;
        while (i--) {
          // If random byte is bigger than alphabet even after bitmask,
          // we refuse it by `|| ''`.
          id += alphabet[bytes[i] & mask] || '';
          // More compact than `id.length + 1 === size`
          if (id.length === +size) return id
        }
      }
    };

    var alphabet$1 = alphabet_1;
    var random = randomByteBrowser;
    var format = format_browser;

    function generate$1(number) {
        var loopCounter = 0;
        var done;

        var str = '';

        while (!done) {
            str = str + format(random, alphabet$1.get(), 1);
            done = number < (Math.pow(16, loopCounter + 1 ) );
            loopCounter++;
        }
        return str;
    }

    var generate_1 = generate$1;

    var generate = generate_1;

    // Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
    // This number should be updated every year or so to keep the generated id short.
    // To regenerate `new Date() - 0` and bump the version. Always bump the version!
    var REDUCE_TIME = 1567752802062;

    // don't change unless we change the algos or REDUCE_TIME
    // must be an integer and less than 16
    var version$1 = 7;

    // Counter is used when shortid is called multiple times in one second.
    var counter;

    // Remember the last time shortid was called in case counter is needed.
    var previousSeconds;

    /**
     * Generate unique id
     * Returns string id
     */
    function build(clusterWorkerId) {
        var str = '';

        var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

        if (seconds === previousSeconds) {
            counter++;
        } else {
            counter = 0;
            previousSeconds = seconds;
        }

        str = str + generate(version$1);
        str = str + generate(clusterWorkerId);
        if (counter > 0) {
            str = str + generate(counter);
        }
        str = str + generate(seconds);
        return str;
    }

    var build_1 = build;

    var alphabet = alphabet_1;

    function isShortId(id) {
        if (!id || typeof id !== 'string' || id.length < 6 ) {
            return false;
        }

        var nonAlphabetic = new RegExp('[^' +
          alphabet.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
        ']');
        return !nonAlphabetic.test(id);
    }

    var isValid = isShortId;

    (function (module) {

    	var alphabet = alphabet_1;
    	var build = build_1;
    	var isValid$1 = isValid;

    	// if you are using cluster or multiple servers use this to make each instance
    	// has a unique value for worker
    	// Note: I don't know if this is automatically set when using third
    	// party cluster solutions such as pm2.
    	var clusterWorkerId = 0;

    	/**
    	 * Set the seed.
    	 * Highly recommended if you don't want people to try to figure out your id schema.
    	 * exposed as shortid.seed(int)
    	 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
    	 */
    	function seed(seedValue) {
    	    alphabet.seed(seedValue);
    	    return module.exports;
    	}

    	/**
    	 * Set the cluster worker or machine id
    	 * exposed as shortid.worker(int)
    	 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
    	 * returns shortid module so it can be chained.
    	 */
    	function worker(workerId) {
    	    clusterWorkerId = workerId;
    	    return module.exports;
    	}

    	/**
    	 *
    	 * sets new characters to use in the alphabet
    	 * returns the shuffled alphabet
    	 */
    	function characters(newCharacters) {
    	    if (newCharacters !== undefined) {
    	        alphabet.characters(newCharacters);
    	    }

    	    return alphabet.shuffled();
    	}

    	/**
    	 * Generate unique id
    	 * Returns string id
    	 */
    	function generate() {
    	  return build(clusterWorkerId);
    	}

    	// Export all other functions as properties of the generate function
    	module.exports = generate;
    	module.exports.generate = generate;
    	module.exports.seed = seed;
    	module.exports.worker = worker;
    	module.exports.characters = characters;
    	module.exports.isValid = isValid$1;
    } (lib));

    (function (module) {
    	module.exports = libExports;
    } (shortid$1));

    var shortid = /*@__PURE__*/getDefaultExportFromCjs(shortidExports);

    function domainSession (domain, connection, logger, successMessages, errorMessages) {
        if (domain == null) {
            domain = "global";
        }
        successMessages = successMessages || ["success"];
        errorMessages = errorMessages || ["error"];
        var isJoined = false;
        var tryReconnecting = false;
        var _latestOptions;
        var _connectionOn = false;
        var callbacks = lib$1();
        connection.disconnected(handleConnectionDisconnected);
        connection.loggedIn(handleConnectionLoggedIn);
        connection.on("success", function (msg) { return handleSuccessMessage(msg); });
        connection.on("error", function (msg) { return handleErrorMessage(msg); });
        connection.on("result", function (msg) { return handleSuccessMessage(msg); });
        if (successMessages) {
            successMessages.forEach(function (sm) {
                connection.on(sm, function (msg) { return handleSuccessMessage(msg); });
            });
        }
        if (errorMessages) {
            errorMessages.forEach(function (sm) {
                connection.on(sm, function (msg) { return handleErrorMessage(msg); });
            });
        }
        var requestsMap = {};
        function join(options) {
            _latestOptions = options;
            return new Promise(function (resolve, reject) {
                if (isJoined) {
                    resolve({});
                    return;
                }
                var joinPromise;
                if (domain === "global") {
                    joinPromise = _connectionOn ? Promise.resolve({}) : Promise.reject("not connected to gateway");
                }
                else {
                    logger.debug("joining domain ".concat(domain));
                    var joinMsg = {
                        type: "join",
                        destination: domain,
                        domain: "global",
                        options: options,
                    };
                    joinPromise = send(joinMsg);
                }
                joinPromise
                    .then(function () {
                    handleJoined();
                    resolve({});
                })
                    .catch(function (err) {
                    logger.debug("error joining " + domain + " domain: " + JSON.stringify(err));
                    reject(err);
                });
            });
        }
        function leave() {
            if (domain === "global") {
                return Promise.resolve();
            }
            logger.debug("stopping session " + domain + "...");
            var leaveMsg = {
                type: "leave",
                destination: domain,
                domain: "global",
            };
            tryReconnecting = false;
            return send(leaveMsg)
                .then(function () {
                isJoined = false;
                callbacks.execute("onLeft");
            })
                .catch(function () {
                isJoined = false;
                callbacks.execute("onLeft");
            });
        }
        function handleJoined() {
            logger.debug("did join " + domain);
            isJoined = true;
            var wasReconnect = tryReconnecting;
            tryReconnecting = false;
            callbacks.execute("onJoined", wasReconnect);
        }
        function handleConnectionDisconnected() {
            _connectionOn = false;
            logger.debug("connection is down");
            isJoined = false;
            tryReconnecting = true;
            callbacks.execute("onLeft", { disconnected: true });
        }
        function handleConnectionLoggedIn() {
            _connectionOn = true;
            if (tryReconnecting) {
                logger.debug("connection is now up - trying to reconnect...");
                join(_latestOptions);
            }
        }
        function onJoined(callback) {
            if (isJoined) {
                callback(false);
            }
            return callbacks.add("onJoined", callback);
        }
        function onLeft(callback) {
            if (!isJoined) {
                callback();
            }
            return callbacks.add("onLeft", callback);
        }
        function handleErrorMessage(msg) {
            if (domain !== msg.domain) {
                return;
            }
            var requestId = msg.request_id;
            if (!requestId) {
                return;
            }
            var entry = requestsMap[requestId];
            if (!entry) {
                return;
            }
            entry.error(msg);
        }
        function handleSuccessMessage(msg) {
            if (msg.domain !== domain) {
                return;
            }
            var requestId = msg.request_id;
            if (!requestId) {
                return;
            }
            var entry = requestsMap[requestId];
            if (!entry) {
                return;
            }
            entry.success(msg);
        }
        function getNextRequestId() {
            return shortid();
        }
        function send(msg, tag, options) {
            options = options || {};
            msg.request_id = msg.request_id || getNextRequestId();
            msg.domain = msg.domain || domain;
            if (!options.skipPeerId) {
                msg.peer_id = connection.peerId;
            }
            var requestId = msg.request_id;
            return new Promise(function (resolve, reject) {
                requestsMap[requestId] = {
                    success: function (successMsg) {
                        delete requestsMap[requestId];
                        successMsg._tag = tag;
                        resolve(successMsg);
                    },
                    error: function (errorMsg) {
                        logger.warn("GW error - ".concat(JSON.stringify(errorMsg), " for request ").concat(JSON.stringify(msg)));
                        delete requestsMap[requestId];
                        errorMsg._tag = tag;
                        reject(errorMsg);
                    },
                };
                connection
                    .send(msg, options)
                    .catch(function (err) {
                    requestsMap[requestId].error({ err: err });
                });
            });
        }
        function sendFireAndForget(msg) {
            msg.request_id = msg.request_id ? msg.request_id : getNextRequestId();
            msg.domain = msg.domain || domain;
            msg.peer_id = connection.peerId;
            return connection.send(msg);
        }
        return {
            join: join,
            leave: leave,
            onJoined: onJoined,
            onLeft: onLeft,
            send: send,
            sendFireAndForget: sendFireAndForget,
            on: function (type, callback) {
                connection.on(type, function (msg) {
                    if (msg.domain !== domain) {
                        return;
                    }
                    try {
                        callback(msg);
                    }
                    catch (e) {
                        logger.error("Callback  failed: ".concat(e, " \n ").concat(e.stack, " \n msg was: ").concat(JSON.stringify(msg)), e);
                    }
                });
            },
            loggedIn: function (callback) { return connection.loggedIn(callback); },
            connected: function (callback) { return connection.connected(callback); },
            disconnected: function (callback) { return connection.disconnected(callback); },
            get peerId() {
                return connection.peerId;
            },
            get domain() {
                return domain;
            },
        };
    }

    var GW3ProtocolImpl = (function () {
        function GW3ProtocolImpl(connection, settings, logger) {
            var _this = this;
            this.connection = connection;
            this.settings = settings;
            this.logger = logger;
            this.protocolVersion = 3;
            this.datePrefix = "#T42_DATE#";
            this.datePrefixLen = this.datePrefix.length;
            this.dateMinLen = this.datePrefixLen + 1;
            this.datePrefixFirstChar = this.datePrefix[0];
            this.registry = lib$1();
            this._isLoggedIn = false;
            this.shouldTryLogin = true;
            this.initialLogin = true;
            this.initialLoginAttempts = 3;
            this.sessions = [];
            connection.disconnected(function () {
                _this.handleDisconnected();
            });
            this.ping();
        }
        Object.defineProperty(GW3ProtocolImpl.prototype, "isLoggedIn", {
            get: function () {
                return this._isLoggedIn;
            },
            enumerable: false,
            configurable: true
        });
        GW3ProtocolImpl.prototype.processStringMessage = function (message) {
            var _this = this;
            var msg = JSON.parse(message, function (key, value) {
                if (typeof value !== "string") {
                    return value;
                }
                if (value.length < _this.dateMinLen) {
                    return value;
                }
                if (value[0] !== _this.datePrefixFirstChar) {
                    return value;
                }
                if (value.substring(0, _this.datePrefixLen) !== _this.datePrefix) {
                    return value;
                }
                try {
                    var milliseconds = parseInt(value.substring(_this.datePrefixLen, value.length), 10);
                    if (isNaN(milliseconds)) {
                        return value;
                    }
                    return new Date(milliseconds);
                }
                catch (ex) {
                    return value;
                }
            });
            return {
                msg: msg,
                msgType: msg.type,
            };
        };
        GW3ProtocolImpl.prototype.createStringMessage = function (message) {
            var oldToJson = Date.prototype.toJSON;
            try {
                var datePrefix_1 = this.datePrefix;
                Date.prototype.toJSON = function () {
                    return datePrefix_1 + this.getTime();
                };
                var result = JSON.stringify(message);
                return result;
            }
            finally {
                Date.prototype.toJSON = oldToJson;
            }
        };
        GW3ProtocolImpl.prototype.processObjectMessage = function (message) {
            if (!message.type) {
                throw new Error("Object should have type property");
            }
            return {
                msg: message,
                msgType: message.type,
            };
        };
        GW3ProtocolImpl.prototype.createObjectMessage = function (message) {
            return message;
        };
        GW3ProtocolImpl.prototype.login = function (config, reconnect) {
            return __awaiter(this, void 0, void 0, function () {
                var authentication, token, e_1, _a, helloMsg, sendOptions, welcomeMsg, msg, token, _b, err_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            this.logger.debug("logging in...");
                            this.loginConfig = config;
                            if (!this.loginConfig) {
                                this.loginConfig = { username: "", password: "" };
                            }
                            this.shouldTryLogin = true;
                            authentication = {};
                            this.connection.gatewayToken = config.gatewayToken;
                            if (!config.gatewayToken) return [3, 5];
                            if (!reconnect) return [3, 4];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4, this.getNewGWToken()];
                        case 2:
                            token = _c.sent();
                            config.gatewayToken = token;
                            return [3, 4];
                        case 3:
                            e_1 = _c.sent();
                            this.logger.warn("failed to get GW token when reconnecting ".concat((e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || e_1));
                            return [3, 4];
                        case 4:
                            authentication.method = "gateway-token";
                            authentication.token = config.gatewayToken;
                            this.connection.gatewayToken = config.gatewayToken;
                            return [3, 10];
                        case 5:
                            if (!(config.flowName === "sspi")) return [3, 9];
                            authentication.provider = "win";
                            authentication.method = "access-token";
                            if (!(config.flowCallback && config.sessionId)) return [3, 7];
                            _a = authentication;
                            return [4, config.flowCallback(config.sessionId, null)];
                        case 6:
                            _a.token =
                                (_c.sent())
                                    .data
                                    .toString("base64");
                            return [3, 8];
                        case 7: throw new Error("Invalid SSPI config");
                        case 8: return [3, 10];
                        case 9:
                            if (config.token) {
                                authentication.method = "access-token";
                                authentication.token = config.token;
                            }
                            else if (config.username) {
                                authentication.method = "secret";
                                authentication.login = config.username;
                                authentication.secret = config.password;
                            }
                            else if (config.provider) {
                                authentication.provider = config.provider;
                                authentication.providerContext = config.providerContext;
                            }
                            else {
                                throw new Error("invalid auth message" + JSON.stringify(config));
                            }
                            _c.label = 10;
                        case 10:
                            helloMsg = {
                                type: "hello",
                                identity: this.settings.identity,
                                authentication: authentication
                            };
                            if (config.sessionId) {
                                helloMsg.request_id = config.sessionId;
                            }
                            this.globalDomain = domainSession("global", this.connection, this.logger.subLogger("global-domain"), [
                                "welcome",
                                "token",
                                "authentication-request"
                            ]);
                            sendOptions = { skipPeerId: true };
                            if (this.initialLogin) {
                                sendOptions.retryInterval = this.settings.reconnectInterval;
                                sendOptions.maxRetries = this.settings.reconnectAttempts;
                            }
                            _c.label = 11;
                        case 11:
                            _c.trys.push([11, 19, 20, 21]);
                            welcomeMsg = void 0;
                            _c.label = 12;
                        case 12:
                            return [4, this.globalDomain.send(helloMsg, undefined, sendOptions)];
                        case 13:
                            msg = _c.sent();
                            if (!(msg.type === "authentication-request")) return [3, 16];
                            token = Buffer.from(msg.authentication.token, "base64");
                            if (!(config.flowCallback && config.sessionId)) return [3, 15];
                            _b = helloMsg.authentication;
                            return [4, config.flowCallback(config.sessionId, token)];
                        case 14:
                            _b.token =
                                (_c.sent())
                                    .data
                                    .toString("base64");
                            _c.label = 15;
                        case 15:
                            helloMsg.request_id = config.sessionId;
                            return [3, 12];
                        case 16:
                            if (msg.type === "welcome") {
                                welcomeMsg = msg;
                                return [3, 18];
                            }
                            else if (msg.type === "error") {
                                throw new Error("Authentication failed: " + msg.reason);
                            }
                            else {
                                throw new Error("Unexpected message type during authentication: " + msg.type);
                            }
                        case 17: return [3, 12];
                        case 18:
                            this.initialLogin = false;
                            this.logger.debug("login successful with peerId " + welcomeMsg.peer_id);
                            this.connection.peerId = welcomeMsg.peer_id;
                            this.connection.resolvedIdentity = welcomeMsg.resolved_identity;
                            this.connection.availableDomains = welcomeMsg.available_domains;
                            if (welcomeMsg.options) {
                                this.connection.token = welcomeMsg.options.access_token;
                                this.connection.info = welcomeMsg.options.info;
                            }
                            this.setLoggedIn(true);
                            return [2, welcomeMsg.resolved_identity];
                        case 19:
                            err_1 = _c.sent();
                            this.logger.error("error sending hello message - " + (err_1.message || err_1.msg || err_1.reason || err_1), err_1);
                            throw err_1;
                        case 20:
                            if (config && config.flowCallback && config.sessionId) {
                                config.flowCallback(config.sessionId, null);
                            }
                            return [7];
                        case 21: return [2];
                    }
                });
            });
        };
        GW3ProtocolImpl.prototype.logout = function () {
            return __awaiter(this, void 0, void 0, function () {
                var promises;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.debug("logging out...");
                            this.shouldTryLogin = false;
                            if (this.pingTimer) {
                                clearTimeout(this.pingTimer);
                            }
                            promises = this.sessions.map(function (session) {
                                session.leave();
                            });
                            return [4, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        GW3ProtocolImpl.prototype.loggedIn = function (callback) {
            if (this._isLoggedIn) {
                callback();
            }
            return this.registry.add("onLoggedIn", callback);
        };
        GW3ProtocolImpl.prototype.domain = function (domainName, domainLogger, successMessages, errorMessages) {
            var session = this.sessions.filter(function (s) { return s.domain === domainName; })[0];
            if (!session) {
                session = domainSession(domainName, this.connection, domainLogger, successMessages, errorMessages);
                this.sessions.push(session);
            }
            return session;
        };
        GW3ProtocolImpl.prototype.handleDisconnected = function () {
            var _this = this;
            this.setLoggedIn(false);
            var tryToLogin = this.shouldTryLogin;
            if (tryToLogin && this.initialLogin) {
                if (this.initialLoginAttempts <= 0) {
                    return;
                }
                this.initialLoginAttempts--;
            }
            this.logger.debug("disconnected - will try new login?" + this.shouldTryLogin);
            if (this.shouldTryLogin) {
                if (!this.loginConfig) {
                    throw new Error("no login info");
                }
                this.connection.login(this.loginConfig, true)
                    .catch(function () {
                    setTimeout(_this.handleDisconnected.bind(_this), _this.settings.reconnectInterval || 1000);
                });
            }
        };
        GW3ProtocolImpl.prototype.setLoggedIn = function (value) {
            this._isLoggedIn = value;
            if (this._isLoggedIn) {
                this.registry.execute("onLoggedIn");
            }
        };
        GW3ProtocolImpl.prototype.ping = function () {
            var _this = this;
            if (!this.shouldTryLogin) {
                return;
            }
            if (this._isLoggedIn) {
                this.connection.send({ type: "ping" });
            }
            this.pingTimer = setTimeout(function () {
                _this.ping();
            }, 30 * 1000);
        };
        GW3ProtocolImpl.prototype.authToken = function () {
            var createTokenReq = {
                type: "create-token"
            };
            if (!this.globalDomain) {
                return Promise.reject(new Error("no global domain session"));
            }
            return this.globalDomain.send(createTokenReq)
                .then(function (res) {
                return res.token;
            });
        };
        GW3ProtocolImpl.prototype.getNewGWToken = function () {
            if (typeof window !== "undefined") {
                var glue42gd = window.glue42gd;
                if (glue42gd) {
                    return glue42gd.getGWToken();
                }
            }
            return Promise.reject(new Error("not running in GD"));
        };
        return GW3ProtocolImpl;
    }());

    var MessageReplayerImpl = (function () {
        function MessageReplayerImpl(specs) {
            this.specsNames = [];
            this.messages = {};
            this.subs = {};
            this.subsRefCount = {};
            this.specs = {};
            for (var _i = 0, specs_1 = specs; _i < specs_1.length; _i++) {
                var spec = specs_1[_i];
                this.specs[spec.name] = spec;
                this.specsNames.push(spec.name);
            }
        }
        MessageReplayerImpl.prototype.init = function (connection) {
            var _this = this;
            this.connection = connection;
            for (var _i = 0, _a = this.specsNames; _i < _a.length; _i++) {
                var name_1 = _a[_i];
                var _loop_1 = function (type) {
                    var refCount = this_1.subsRefCount[type];
                    if (!refCount) {
                        refCount = 0;
                    }
                    refCount += 1;
                    this_1.subsRefCount[type] = refCount;
                    if (refCount > 1) {
                        return "continue";
                    }
                    var sub = connection.on(type, function (msg) { return _this.processMessage(type, msg); });
                    this_1.subs[type] = sub;
                };
                var this_1 = this;
                for (var _b = 0, _c = this.specs[name_1].types; _b < _c.length; _b++) {
                    var type = _c[_b];
                    _loop_1(type);
                }
            }
        };
        MessageReplayerImpl.prototype.processMessage = function (type, msg) {
            if (this.isDone || !msg) {
                return;
            }
            for (var _i = 0, _a = this.specsNames; _i < _a.length; _i++) {
                var name_2 = _a[_i];
                if (this.specs[name_2].types.indexOf(type) !== -1) {
                    var messages = this.messages[name_2] || [];
                    this.messages[name_2] = messages;
                    messages.push(msg);
                }
            }
        };
        MessageReplayerImpl.prototype.drain = function (name, callback) {
            var _a;
            if (callback) {
                (this.messages[name] || []).forEach(callback);
            }
            delete this.messages[name];
            for (var _i = 0, _b = this.specs[name].types; _i < _b.length; _i++) {
                var type = _b[_i];
                this.subsRefCount[type] -= 1;
                if (this.subsRefCount[type] <= 0) {
                    (_a = this.connection) === null || _a === void 0 ? void 0 : _a.off(this.subs[type]);
                    delete this.subs[type];
                    delete this.subsRefCount[type];
                }
            }
            delete this.specs[name];
            if (!this.specs.length) {
                this.isDone = true;
            }
        };
        return MessageReplayerImpl;
    }());

    var PromisePlus = function (executor, timeoutMilliseconds, timeoutMessage) {
        return new Promise(function (resolve, reject) {
            var timeout = setTimeout(function () {
                var message = timeoutMessage || "Promise timeout hit: ".concat(timeoutMilliseconds);
                reject(message);
            }, timeoutMilliseconds);
            var providedPromise = new Promise(executor);
            providedPromise
                .then(function (result) {
                clearTimeout(timeout);
                resolve(result);
            })
                .catch(function (error) {
                clearTimeout(timeout);
                reject(error);
            });
        });
    };

    var WebPlatformTransport = (function () {
        function WebPlatformTransport(settings, logger, identity) {
            this.settings = settings;
            this.logger = logger;
            this.identity = identity;
            this.iAmConnected = false;
            this.parentReady = false;
            this.rejected = false;
            this.children = [];
            this.extContentAvailable = false;
            this.extContentConnecting = false;
            this.extContentConnected = false;
            this.parentInExtMode = false;
            this.webNamespace = "g42_core_web";
            this.parentPingTimeout = 5000;
            this.connectionRequestTimeout = 7000;
            this.defaultTargetString = "*";
            this.registry = lib$1();
            this.messages = {
                connectionAccepted: { name: "connectionAccepted", handle: this.handleConnectionAccepted.bind(this) },
                connectionRejected: { name: "connectionRejected", handle: this.handleConnectionRejected.bind(this) },
                connectionRequest: { name: "connectionRequest", handle: this.handleConnectionRequest.bind(this) },
                parentReady: {
                    name: "parentReady", handle: function () {
                    }
                },
                parentPing: { name: "parentPing", handle: this.handleParentPing.bind(this) },
                platformPing: { name: "platformPing", handle: this.handlePlatformPing.bind(this) },
                platformReady: { name: "platformReady", handle: this.handlePlatformReady.bind(this) },
                clientUnload: { name: "clientUnload", handle: this.handleClientUnload.bind(this) },
                manualUnload: { name: "manualUnload", handle: this.handleManualUnload.bind(this) },
                extConnectionResponse: { name: "extConnectionResponse", handle: this.handleExtConnectionResponse.bind(this) },
                extSetupRequest: { name: "extSetupRequest", handle: this.handleExtSetupRequest.bind(this) },
                gatewayDisconnect: { name: "gatewayDisconnect", handle: this.handleGatewayDisconnect.bind(this) },
                gatewayInternalConnect: { name: "gatewayInternalConnect", handle: this.handleGatewayInternalConnect.bind(this) }
            };
            this.extContentAvailable = !!window.glue42ext;
            this.setUpMessageListener();
            this.setUpUnload();
            this.setupPlatformUnloadListener();
            this.parentType = window.name.includes("#wsp") ? "workspace" : undefined;
        }
        WebPlatformTransport.prototype.manualSetReadyState = function () {
            this.iAmConnected = true;
            this.parentReady = true;
        };
        Object.defineProperty(WebPlatformTransport.prototype, "transportWindowId", {
            get: function () {
                return this.publicWindowId;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WebPlatformTransport.prototype, "communicationId", {
            get: function () {
                return this._communicationId;
            },
            enumerable: false,
            configurable: true
        });
        WebPlatformTransport.prototype.sendObject = function (msg) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.extContentConnected) {
                        return [2, window.postMessage({ glue42ExtOut: msg }, this.defaultTargetString)];
                    }
                    if (!this.port) {
                        throw new Error("Cannot send message, because the port was not opened yet");
                    }
                    this.port.postMessage(msg);
                    return [2];
                });
            });
        };
        Object.defineProperty(WebPlatformTransport.prototype, "isObjectBasedTransport", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        WebPlatformTransport.prototype.onMessage = function (callback) {
            return this.registry.add("onMessage", callback);
        };
        WebPlatformTransport.prototype.send = function () {
            return Promise.reject("not supported");
        };
        WebPlatformTransport.prototype.onConnectedChanged = function (callback) {
            return this.registry.add("onConnectedChanged", callback);
        };
        WebPlatformTransport.prototype.open = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.debug("opening a connection to the web platform gateway.");
                            return [4, this.connect()];
                        case 1:
                            _a.sent();
                            this.notifyStatusChanged(true);
                            return [2];
                    }
                });
            });
        };
        WebPlatformTransport.prototype.close = function () {
            var _a, _b;
            var message = {
                glue42core: {
                    type: this.messages.gatewayDisconnect.name,
                    data: {
                        clientId: this.myClientId,
                        ownWindowId: (_a = this.identity) === null || _a === void 0 ? void 0 : _a.windowId
                    }
                }
            };
            (_b = this.port) === null || _b === void 0 ? void 0 : _b.postMessage(message);
            this.parentReady = false;
            this.notifyStatusChanged(false, "manual reconnection");
            return Promise.resolve();
        };
        WebPlatformTransport.prototype.name = function () {
            return "web-platform";
        };
        WebPlatformTransport.prototype.reconnect = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.close()];
                        case 1:
                            _a.sent();
                            return [2, Promise.resolve()];
                    }
                });
            });
        };
        WebPlatformTransport.prototype.initiateInternalConnection = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.logger.debug("opening an internal web platform connection");
                _this.port = _this.settings.port;
                if (_this.iAmConnected) {
                    _this.logger.warn("cannot open a new connection, because this client is currently connected");
                    return;
                }
                _this.port.onmessage = function (event) {
                    var _a, _b;
                    if (_this.iAmConnected && !((_a = event.data) === null || _a === void 0 ? void 0 : _a.glue42core)) {
                        _this.registry.execute("onMessage", event.data);
                        return;
                    }
                    var data = (_b = event.data) === null || _b === void 0 ? void 0 : _b.glue42core;
                    if (!data) {
                        return;
                    }
                    if (data.type === _this.messages.gatewayInternalConnect.name && data.success) {
                        _this.publicWindowId = _this.settings.windowId;
                        if (_this.identity && _this.publicWindowId) {
                            _this.identity.windowId = _this.publicWindowId;
                            _this.identity.instance = _this.publicWindowId;
                        }
                        resolve();
                    }
                    if (data.type === _this.messages.gatewayInternalConnect.name && data.error) {
                        reject(data.error);
                    }
                };
                _this.port.postMessage({
                    glue42core: {
                        type: _this.messages.gatewayInternalConnect.name
                    }
                });
            });
        };
        WebPlatformTransport.prototype.initiateRemoteConnection = function (target) {
            var _this = this;
            return PromisePlus(function (resolve, reject) {
                var _a;
                _this.connectionResolve = resolve;
                _this.connectionReject = reject;
                _this.myClientId = (_a = _this.myClientId) !== null && _a !== void 0 ? _a : shortid();
                var bridgeInstanceId = _this.getMyWindowId() || shortid();
                var request = {
                    glue42core: {
                        type: _this.messages.connectionRequest.name,
                        clientId: _this.myClientId,
                        clientType: "child",
                        bridgeInstanceId: bridgeInstanceId,
                        selfAssignedWindowId: _this.selfAssignedWindowId
                    }
                };
                _this.logger.debug("sending connection request");
                if (_this.extContentConnecting) {
                    request.glue42core.clientType = "child";
                    request.glue42core.bridgeInstanceId = _this.myClientId;
                    request.glue42core.parentWindowId = _this.parentWindowId;
                    return window.postMessage(request, _this.defaultTargetString);
                }
                if (!target) {
                    throw new Error("Cannot send a connection request, because no glue target was specified!");
                }
                target.postMessage(request, _this.defaultTargetString);
            }, this.connectionRequestTimeout, "The connection to the target glue window timed out");
        };
        WebPlatformTransport.prototype.isParentCheckSuccess = function (parentCheck) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, parentCheck];
                        case 1:
                            _a.sent();
                            return [2, { success: true }];
                        case 2:
                            _a.sent();
                            return [2, { success: false }];
                        case 3: return [2];
                    }
                });
            });
        };
        WebPlatformTransport.prototype.setUpMessageListener = function () {
            var _this = this;
            if (this.settings.port) {
                this.logger.debug("skipping generic message listener, because this is an internal client");
                return;
            }
            window.addEventListener("message", function (event) {
                var _a;
                var data = (_a = event.data) === null || _a === void 0 ? void 0 : _a.glue42core;
                if (!data || _this.rejected) {
                    return;
                }
                var allowedOrigins = _this.settings.allowedOrigins || [];
                if (allowedOrigins.length && !allowedOrigins.includes(event.origin)) {
                    _this.logger.warn("received a message from an origin which is not in the allowed list: ".concat(event.origin));
                    return;
                }
                if (!_this.checkMessageTypeValid(data.type)) {
                    _this.logger.error("cannot handle the incoming glue42 core message, because the type is invalid: ".concat(data.type));
                    return;
                }
                var messageType = data.type;
                _this.logger.debug("received valid glue42core message of type: ".concat(messageType));
                _this.messages[messageType].handle(event);
            });
        };
        WebPlatformTransport.prototype.setUpUnload = function () {
            var _this = this;
            if (this.settings.port) {
                this.logger.debug("skipping unload event listener, because this is an internal client");
                return;
            }
            window.addEventListener("beforeunload", function () {
                var _a, _b;
                if (_this.extContentConnected) {
                    return;
                }
                var message = {
                    glue42core: {
                        type: _this.messages.clientUnload.name,
                        data: {
                            clientId: _this.myClientId,
                            ownWindowId: (_a = _this.identity) === null || _a === void 0 ? void 0 : _a.windowId
                        }
                    }
                };
                if (_this.parent) {
                    _this.parent.postMessage(message, _this.defaultTargetString);
                }
                (_b = _this.port) === null || _b === void 0 ? void 0 : _b.postMessage(message);
            });
        };
        WebPlatformTransport.prototype.handlePlatformReady = function (event) {
            this.logger.debug("the web platform gave the ready signal");
            this.parentReady = true;
            if (this.parentPingResolve) {
                this.parentPingResolve();
                delete this.parentPingResolve;
            }
            if (this.parentPingInterval) {
                clearInterval(this.parentPingInterval);
                delete this.parentPingInterval;
            }
            this.parent = event.source;
            this.parentType = window.name.includes("#wsp") ? "workspace" : "window";
        };
        WebPlatformTransport.prototype.handleConnectionAccepted = function (event) {
            var _a;
            var data = (_a = event.data) === null || _a === void 0 ? void 0 : _a.glue42core;
            if (this.myClientId === data.clientId) {
                return this.handleAcceptanceOfMyRequest(data);
            }
            return this.handleAcceptanceOfGrandChildRequest(data, event);
        };
        WebPlatformTransport.prototype.handleAcceptanceOfMyRequest = function (data) {
            var _this = this;
            this.logger.debug("handling a connection accepted signal targeted at me.");
            this.isPreferredActivated = data.isPreferredActivated;
            if (this.extContentConnecting) {
                return this.processExtContentConnection(data);
            }
            if (!data.port) {
                this.logger.error("cannot set up my connection, because I was not provided with a port");
                return;
            }
            this.publicWindowId = this.getMyWindowId();
            if (this.identity) {
                this.identity.windowId = this.publicWindowId;
                this.identity.instance = this.identity.instance ? this.identity.instance : this.publicWindowId || shortid();
            }
            if (this.identity && data.appName) {
                this.identity.application = data.appName;
                this.identity.applicationName = data.appName;
            }
            this._communicationId = data.communicationId;
            this.port = data.port;
            this.port.onmessage = function (e) { return _this.registry.execute("onMessage", e.data); };
            if (this.connectionResolve) {
                this.logger.debug("my connection is set up, calling the connection resolve.");
                this.connectionResolve();
                delete this.connectionResolve;
                return;
            }
            this.logger.error("unable to call the connection resolve, because no connection promise was found");
        };
        WebPlatformTransport.prototype.processExtContentConnection = function (data) {
            var _this = this;
            this.logger.debug("handling a connection accepted signal targeted at me for extension content connection.");
            this.extContentConnecting = false;
            this.extContentConnected = true;
            this.publicWindowId = this.parentWindowId || this.myClientId;
            if (this.extContentConnecting && this.identity) {
                this.identity.windowId = this.publicWindowId;
            }
            if (this.identity && data.appName) {
                this.identity.application = data.appName;
                this.identity.applicationName = data.appName;
            }
            window.addEventListener("message", function (event) {
                var _a;
                var extData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.glue42ExtInc;
                if (!extData) {
                    return;
                }
                var allowedOrigins = _this.settings.allowedOrigins || [];
                if (allowedOrigins.length && !allowedOrigins.includes(event.origin)) {
                    _this.logger.warn("received a message from an origin which is not in the allowed list: ".concat(event.origin));
                    return;
                }
                _this.registry.execute("onMessage", extData);
            });
            if (this.connectionResolve) {
                this.logger.debug("my connection is set up, calling the connection resolve.");
                this.connectionResolve();
                delete this.connectionResolve;
                return;
            }
        };
        WebPlatformTransport.prototype.handleAcceptanceOfGrandChildRequest = function (data, event) {
            if (this.extContentConnecting || this.extContentConnected) {
                this.logger.debug("cannot process acceptance of a grandchild, because I am connected to a content script");
                return;
            }
            this.logger.debug("handling a connection accepted signal targeted at a grandchild: ".concat(data.clientId));
            var child = this.children.find(function (c) { return c.grandChildId === data.clientId; });
            if (!child) {
                this.logger.error("cannot handle connection accepted for grandchild: ".concat(data.clientId, ", because there is no grandchild with this id"));
                return;
            }
            child.connected = true;
            this.logger.debug("the grandchild connection for ".concat(data.clientId, " is set up, forwarding the success message and the gateway port"));
            data.parentWindowId = this.publicWindowId;
            child.source.postMessage(event.data, child.origin, [data.port]);
            return;
        };
        WebPlatformTransport.prototype.handleConnectionRejected = function () {
            this.logger.debug("handling a connection rejection. Most likely the reason is that this window was not created by a glue API call");
            if (this.connectionReject) {
                this.connectionReject("The platform connection was rejected. Most likely because this window was not created by a glue API call");
                delete this.connectionReject;
            }
        };
        WebPlatformTransport.prototype.handleConnectionRequest = function (event) {
            if (this.extContentConnecting) {
                this.logger.debug("This connection request event is targeted at the extension content");
                return;
            }
            var source = event.source;
            var data = event.data.glue42core;
            if (!data.clientType || data.clientType !== "grandChild") {
                return this.rejectConnectionRequest(source, event.origin, "rejecting a connection request, because the source was not opened by a glue API call");
            }
            if (!data.clientId) {
                return this.rejectConnectionRequest(source, event.origin, "rejecting a connection request, because the source did not provide a valid id");
            }
            if (!this.parent) {
                return this.rejectConnectionRequest(source, event.origin, "Cannot forward the connection request, because no direct connection to the platform was found");
            }
            this.logger.debug("handling a connection request for a grandchild: ".concat(data.clientId));
            this.children.push({ grandChildId: data.clientId, source: source, connected: false, origin: event.origin });
            this.logger.debug("grandchild: ".concat(data.clientId, " is prepared, forwarding connection request to the platform"));
            this.parent.postMessage(event.data, this.defaultTargetString);
        };
        WebPlatformTransport.prototype.handleParentPing = function (event) {
            if (!this.parentReady) {
                this.logger.debug("my parent is not ready, I am ignoring the parent ping");
                return;
            }
            if (!this.iAmConnected) {
                this.logger.debug("i am not fully connected yet, I am ignoring the parent ping");
                return;
            }
            var message = {
                glue42core: {
                    type: this.messages.parentReady.name
                }
            };
            if (this.extContentConnected) {
                message.glue42core.extMode = { windowId: this.myClientId };
            }
            var source = event.source;
            this.logger.debug("responding to a parent ping with a ready message");
            source.postMessage(message, event.origin);
        };
        WebPlatformTransport.prototype.setupPlatformUnloadListener = function () {
            var _this = this;
            this.onMessage(function (msg) {
                if (msg.type === "platformUnload") {
                    _this.logger.debug("detected a web platform unload");
                    _this.parentReady = false;
                    _this.notifyStatusChanged(false, "Gateway unloaded");
                }
            });
        };
        WebPlatformTransport.prototype.handleManualUnload = function () {
            var _a, _b;
            var message = {
                glue42core: {
                    type: this.messages.clientUnload.name,
                    data: {
                        clientId: this.myClientId,
                        ownWindowId: (_a = this.identity) === null || _a === void 0 ? void 0 : _a.windowId
                    }
                }
            };
            if (this.extContentConnected) {
                return window.postMessage({ glue42ExtOut: message }, this.defaultTargetString);
            }
            (_b = this.port) === null || _b === void 0 ? void 0 : _b.postMessage(message);
        };
        WebPlatformTransport.prototype.handleClientUnload = function (event) {
            var data = event.data.glue42core;
            var clientId = data === null || data === void 0 ? void 0 : data.data.clientId;
            if (!clientId) {
                this.logger.warn("cannot process grand child unload, because the provided id was not valid");
                return;
            }
            var foundChild = this.children.find(function (child) { return child.grandChildId === clientId; });
            if (!foundChild) {
                this.logger.warn("cannot process grand child unload, because this client is unaware of this grandchild");
                return;
            }
            this.logger.debug("handling grandchild unload for id: ".concat(clientId));
            this.children = this.children.filter(function (child) { return child.grandChildId !== clientId; });
        };
        WebPlatformTransport.prototype.handlePlatformPing = function () {
            return;
        };
        WebPlatformTransport.prototype.notifyStatusChanged = function (status, reason) {
            this.iAmConnected = status;
            this.registry.execute("onConnectedChanged", status, reason);
        };
        WebPlatformTransport.prototype.checkMessageTypeValid = function (typeToValidate) {
            return typeof typeToValidate === "string" && !!this.messages[typeToValidate];
        };
        WebPlatformTransport.prototype.rejectConnectionRequest = function (source, origin, reason) {
            this.rejected = true;
            this.logger.error(reason);
            var rejection = {
                glue42core: {
                    type: this.messages.connectionRejected.name
                }
            };
            source.postMessage(rejection, origin);
        };
        WebPlatformTransport.prototype.requestConnectionPermissionFromExt = function () {
            var _this = this;
            return this.waitForContentScript()
                .then(function () { return PromisePlus(function (resolve, reject) {
                _this.extConnectionResolve = resolve;
                _this.extConnectionReject = reject;
                var message = {
                    glue42core: {
                        type: "extSetupRequest"
                    }
                };
                _this.logger.debug("permission request to the extension content script was sent");
                window.postMessage(message, _this.defaultTargetString);
            }, _this.parentPingTimeout, "Cannot initialize glue, because this app was not opened or created by a Glue Client and the request for extension connection timed out"); });
        };
        WebPlatformTransport.prototype.handleExtConnectionResponse = function (event) {
            var _a;
            var data = (_a = event.data) === null || _a === void 0 ? void 0 : _a.glue42core;
            if (!data.approved) {
                return this.extConnectionReject ? this.extConnectionReject("Cannot initialize glue, because this app was not opened or created by a Glue Client and the request for extension connection was rejected") : undefined;
            }
            if (this.extConnectionResolve) {
                this.extConnectionResolve();
                delete this.extConnectionResolve;
            }
            this.extContentConnecting = true;
            this.parentType = "extension";
            this.logger.debug("The extension connection was approved, proceeding.");
        };
        WebPlatformTransport.prototype.handleExtSetupRequest = function () {
            return;
        };
        WebPlatformTransport.prototype.handleGatewayDisconnect = function () {
            return;
        };
        WebPlatformTransport.prototype.handleGatewayInternalConnect = function () {
            return;
        };
        WebPlatformTransport.prototype.waitForContentScript = function () {
            var _a;
            var contentReady = !!((_a = window.glue42ext) === null || _a === void 0 ? void 0 : _a.content);
            if (contentReady) {
                return Promise.resolve();
            }
            return PromisePlus(function (resolve) {
                window.addEventListener("Glue42EXTReady", function () {
                    resolve();
                });
            }, this.connectionRequestTimeout, "The content script was available, but was never heard to be ready");
        };
        WebPlatformTransport.prototype.connect = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.settings.port) return [3, 2];
                            return [4, this.initiateInternalConnection()];
                        case 1:
                            _a.sent();
                            this.logger.debug("internal web platform connection completed");
                            return [2];
                        case 2:
                            this.logger.debug("opening a client web platform connection");
                            return [4, this.findParent()];
                        case 3:
                            _a.sent();
                            return [4, this.initiateRemoteConnection(this.parent)];
                        case 4:
                            _a.sent();
                            this.logger.debug("the client is connected");
                            return [2];
                    }
                });
            });
        };
        WebPlatformTransport.prototype.findParent = function () {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var connectionNotPossibleMsg, myInsideParents, myOutsideParents, uniqueParents, defaultParentCheck;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            connectionNotPossibleMsg = "Cannot initiate glue, because this window was not opened or created by a glue client";
                            myInsideParents = this.getPossibleParentsInWindow(window);
                            myOutsideParents = this.getPossibleParentsOutsideWindow((_a = window.top) === null || _a === void 0 ? void 0 : _a.opener, window.top);
                            uniqueParents = new Set(__spreadArray(__spreadArray([], myInsideParents, true), myOutsideParents, true));
                            if (!uniqueParents.size && !this.extContentAvailable) {
                                throw new Error(connectionNotPossibleMsg);
                            }
                            if (!(!uniqueParents.size && this.extContentAvailable)) return [3, 2];
                            return [4, this.requestConnectionPermissionFromExt()];
                        case 1:
                            _b.sent();
                            return [2];
                        case 2: return [4, this.isParentCheckSuccess(this.confirmParent(Array.from(uniqueParents)))];
                        case 3:
                            defaultParentCheck = _b.sent();
                            if (defaultParentCheck.success) {
                                this.logger.debug("The default parent was found!");
                                return [2];
                            }
                            if (!this.extContentAvailable) {
                                throw new Error(connectionNotPossibleMsg);
                            }
                            return [4, this.requestConnectionPermissionFromExt()];
                        case 4:
                            _b.sent();
                            return [2];
                    }
                });
            });
        };
        WebPlatformTransport.prototype.getPossibleParentsInWindow = function (currentWindow) {
            return (!currentWindow || currentWindow === currentWindow.top) ? [] : __spreadArray([currentWindow.parent], this.getPossibleParentsInWindow(currentWindow.parent), true);
        };
        WebPlatformTransport.prototype.getPossibleParentsOutsideWindow = function (opener, current) {
            return (!opener || !current || opener === current) ? [] : __spreadArray(__spreadArray([opener], this.getPossibleParentsInWindow(opener), true), this.getPossibleParentsOutsideWindow(opener.opener, opener), true);
        };
        WebPlatformTransport.prototype.confirmParent = function (targets) {
            var _this = this;
            var connectionNotPossibleMsg = "Cannot initiate glue, because this window was not opened or created by a glue client";
            var parentCheck = PromisePlus(function (resolve) {
                _this.parentPingResolve = resolve;
                var message = {
                    glue42core: {
                        type: _this.messages.platformPing.name
                    }
                };
                _this.parentPingInterval = setInterval(function () {
                    targets.forEach(function (target) {
                        target.postMessage(message, _this.defaultTargetString);
                    });
                }, 1000);
            }, this.parentPingTimeout, connectionNotPossibleMsg);
            parentCheck.catch(function () {
                if (_this.parentPingInterval) {
                    clearInterval(_this.parentPingInterval);
                    delete _this.parentPingInterval;
                }
            });
            return parentCheck;
        };
        WebPlatformTransport.prototype.getMyWindowId = function () {
            var _a;
            if (this.parentType === "workspace") {
                return window.name.substring(0, window.name.indexOf("#wsp"));
            }
            if (window !== window.top) {
                return;
            }
            if ((_a = window.name) === null || _a === void 0 ? void 0 : _a.includes("g42")) {
                return window.name;
            }
            this.selfAssignedWindowId = this.selfAssignedWindowId || "g42-".concat(shortid());
            return this.selfAssignedWindowId;
        };
        return WebPlatformTransport;
    }());

    var waitForInvocations = function (invocations, callback) {
        var left = invocations;
        return function () {
            left--;
            if (left === 0) {
                callback();
            }
        };
    };

    var AsyncSequelizer = (function () {
        function AsyncSequelizer(minSequenceInterval) {
            if (minSequenceInterval === void 0) { minSequenceInterval = 0; }
            this.minSequenceInterval = minSequenceInterval;
            this.queue = [];
            this.isExecutingQueue = false;
        }
        AsyncSequelizer.prototype.enqueue = function (action) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.queue.push({ action: action, resolve: resolve, reject: reject });
                _this.executeQueue();
            });
        };
        AsyncSequelizer.prototype.executeQueue = function () {
            return __awaiter(this, void 0, void 0, function () {
                var operation, actionResult, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isExecutingQueue) {
                                return [2];
                            }
                            this.isExecutingQueue = true;
                            _a.label = 1;
                        case 1:
                            if (!this.queue.length) return [3, 7];
                            operation = this.queue.shift();
                            if (!operation) {
                                this.isExecutingQueue = false;
                                return [2];
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4, operation.action()];
                        case 3:
                            actionResult = _a.sent();
                            operation.resolve(actionResult);
                            return [3, 5];
                        case 4:
                            error_1 = _a.sent();
                            operation.reject(error_1);
                            return [3, 5];
                        case 5: return [4, this.intervalBreak()];
                        case 6:
                            _a.sent();
                            return [3, 1];
                        case 7:
                            this.isExecutingQueue = false;
                            return [2];
                    }
                });
            });
        };
        AsyncSequelizer.prototype.intervalBreak = function () {
            var _this = this;
            return new Promise(function (res) { return setTimeout(res, _this.minSequenceInterval); });
        };
        return AsyncSequelizer;
    }());

    var Connection = (function () {
        function Connection(settings, logger) {
            this.settings = settings;
            this.logger = logger;
            this.messageHandlers = {};
            this.ids = 1;
            this.registry = lib$1();
            this._connected = false;
            this.isTrace = false;
            this._swapTransport = false;
            this._switchInProgress = false;
            this._transportSubscriptions = [];
            this._sequelizer = new AsyncSequelizer();
            settings = settings || {};
            settings.reconnectAttempts = settings.reconnectAttempts || 10;
            settings.reconnectInterval = settings.reconnectInterval || 1000;
            if (settings.inproc) {
                this.transport = new InProcTransport(settings.inproc, logger.subLogger("inMemory"));
            }
            else if (settings.sharedWorker) {
                this.transport = new SharedWorkerTransport(settings.sharedWorker, logger.subLogger("shared-worker"));
            }
            else if (settings.webPlatform) {
                this.transport = new WebPlatformTransport(settings.webPlatform, logger.subLogger("web-platform"), settings.identity);
            }
            else if (settings.ws !== undefined) {
                this.transport = new WS(settings, logger.subLogger("ws"));
            }
            else {
                throw new Error("No connection information specified");
            }
            this.isTrace = logger.canPublish("trace");
            logger.debug("starting with ".concat(this.transport.name(), " transport"));
            this.protocol = new GW3ProtocolImpl(this, settings, logger.subLogger("protocol"));
            var unsubConnectionChanged = this.transport.onConnectedChanged(this.handleConnectionChanged.bind(this));
            var unsubOnMessage = this.transport.onMessage(this.handleTransportMessage.bind(this));
            this._transportSubscriptions.push(unsubConnectionChanged);
            this._transportSubscriptions.push(unsubOnMessage);
            this._defaultTransport = this.transport;
        }
        Object.defineProperty(Connection.prototype, "protocolVersion", {
            get: function () {
                var _a;
                return (_a = this.protocol) === null || _a === void 0 ? void 0 : _a.protocolVersion;
            },
            enumerable: false,
            configurable: true
        });
        Connection.prototype.switchTransport = function (settings) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2, this._sequelizer.enqueue(function () { return __awaiter(_this, void 0, void 0, function () {
                            var switchTargetTransport, verifyPromise, isSwitchSuccess;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!settings || typeof settings !== "object") {
                                            throw new Error("Cannot switch transports, because the settings are missing or invalid.");
                                        }
                                        if (typeof settings.type === "undefined") {
                                            throw new Error("Cannot switch the transport, because the type is not defined");
                                        }
                                        this.logger.trace("Starting transport switch with settings: ".concat(JSON.stringify(settings)));
                                        switchTargetTransport = settings.type === "secondary" ? this.getNewSecondaryTransport(settings) : this._defaultTransport;
                                        this._targetTransport = switchTargetTransport;
                                        this._targetAuth = settings.type === "secondary" ? this.getNewSecondaryAuth(settings) : this._defaultAuth;
                                        verifyPromise = this.verifyConnection();
                                        this._swapTransport = true;
                                        this._switchInProgress = true;
                                        this.logger.trace("The new transport has been set, closing the current transport");
                                        return [4, this.transport.close()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4, verifyPromise];
                                    case 3:
                                        _a.sent();
                                        isSwitchSuccess = this.transport === switchTargetTransport;
                                        this.logger.info("The reconnection after the switch was completed. Was the switch a success: ".concat(isSwitchSuccess));
                                        this._switchInProgress = false;
                                        return [2, { success: isSwitchSuccess }];
                                    case 4:
                                        _a.sent();
                                        this.logger.info("The reconnection after the switch timed out, reverting back to the default transport.");
                                        this.switchTransport({ type: "default" });
                                        this._switchInProgress = false;
                                        return [2, { success: false }];
                                    case 5: return [2];
                                }
                            });
                        }); })];
                });
            });
        };
        Connection.prototype.onLibReAnnounced = function (callback) {
            return this.registry.add("libReAnnounced", callback);
        };
        Connection.prototype.setLibReAnnounced = function (lib) {
            this.registry.execute("libReAnnounced", lib);
        };
        Connection.prototype.send = function (message, options) {
            if (this.transport.sendObject &&
                this.transport.isObjectBasedTransport) {
                var msg = this.protocol.createObjectMessage(message);
                if (this.isTrace) {
                    this.logger.trace(">> ".concat(JSON.stringify(msg)));
                }
                return this.transport.sendObject(msg, options);
            }
            else {
                var strMessage = this.protocol.createStringMessage(message);
                if (this.isTrace) {
                    this.logger.trace(">> ".concat(strMessage));
                }
                return this.transport.send(strMessage, options);
            }
        };
        Connection.prototype.on = function (type, messageHandler) {
            type = type.toLowerCase();
            if (this.messageHandlers[type] === undefined) {
                this.messageHandlers[type] = {};
            }
            var id = this.ids++;
            this.messageHandlers[type][id] = messageHandler;
            return {
                type: type,
                id: id,
            };
        };
        Connection.prototype.off = function (info) {
            delete this.messageHandlers[info.type.toLowerCase()][info.id];
        };
        Object.defineProperty(Connection.prototype, "isConnected", {
            get: function () {
                return this.protocol.isLoggedIn;
            },
            enumerable: false,
            configurable: true
        });
        Connection.prototype.connected = function (callback) {
            var _this = this;
            return this.protocol.loggedIn(function () {
                var currentServer = _this.transport.name();
                callback(currentServer);
            });
        };
        Connection.prototype.disconnected = function (callback) {
            return this.registry.add("disconnected", callback);
        };
        Connection.prototype.login = function (authRequest, reconnect) {
            return __awaiter(this, void 0, void 0, function () {
                var newAuth, identity, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this._defaultAuth) {
                                this._defaultAuth = authRequest;
                            }
                            if (this._swapTransport) {
                                this.logger.trace("Detected a transport swap, swapping transports");
                                newAuth = this.transportSwap();
                                authRequest = newAuth !== null && newAuth !== void 0 ? newAuth : authRequest;
                            }
                            this.logger.trace("Starting login for transport: ".concat(this.transport.name(), " and auth ").concat(JSON.stringify(authRequest)));
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4, this.transport.open()];
                        case 2:
                            _a.sent();
                            this.logger.trace("Transport: ".concat(this.transport.name(), " opened, logging in"));
                            timer("connection").mark("transport-opened");
                            return [4, this.protocol.login(authRequest, reconnect)];
                        case 3:
                            identity = _a.sent();
                            this.logger.trace("Logged in with identity: ".concat(JSON.stringify(identity)));
                            timer("connection").mark("protocol-logged-in");
                            return [2, identity];
                        case 4:
                            error_2 = _a.sent();
                            if (this._switchInProgress) {
                                this.logger.trace("An error while logging in after a transport swap, preparing a default swap.");
                                this.prepareDefaultSwap();
                            }
                            throw new Error(error_2);
                        case 5: return [2];
                    }
                });
            });
        };
        Connection.prototype.logout = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.protocol.logout()];
                        case 1:
                            _a.sent();
                            return [4, this.transport.close()];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        Connection.prototype.loggedIn = function (callback) {
            return this.protocol.loggedIn(callback);
        };
        Connection.prototype.domain = function (domain, successMessages, errorMessages) {
            return this.protocol.domain(domain, this.logger.subLogger("domain=".concat(domain)), successMessages, errorMessages);
        };
        Connection.prototype.authToken = function () {
            return this.protocol.authToken();
        };
        Connection.prototype.reconnect = function () {
            return this.transport.reconnect();
        };
        Connection.prototype.distributeMessage = function (message, type) {
            var _this = this;
            var handlers = this.messageHandlers[type.toLowerCase()];
            if (handlers !== undefined) {
                Object.keys(handlers).forEach(function (handlerId) {
                    var handler = handlers[handlerId];
                    if (handler !== undefined) {
                        try {
                            handler(message);
                        }
                        catch (error) {
                            try {
                                _this.logger.error("Message handler failed with ".concat(error.stack), error);
                            }
                            catch (loggerError) {
                                console.log("Message handler failed", error);
                            }
                        }
                    }
                });
            }
        };
        Connection.prototype.handleConnectionChanged = function (connected) {
            if (this._connected === connected) {
                return;
            }
            this._connected = connected;
            if (connected) {
                if (this.settings.replaySpecs && this.settings.replaySpecs.length) {
                    this.replayer = new MessageReplayerImpl(this.settings.replaySpecs);
                    this.replayer.init(this);
                }
                this.registry.execute("connected");
            }
            else {
                this.registry.execute("disconnected");
            }
        };
        Connection.prototype.handleTransportMessage = function (msg) {
            var msgObj;
            if (typeof msg === "string") {
                msgObj = this.protocol.processStringMessage(msg);
            }
            else {
                msgObj = this.protocol.processObjectMessage(msg);
            }
            if (this.isTrace) {
                this.logger.trace("<< ".concat(JSON.stringify(msgObj)));
            }
            this.distributeMessage(msgObj.msg, msgObj.msgType);
        };
        Connection.prototype.verifyConnection = function () {
            var _this = this;
            return PromisePlus(function (resolve) {
                var unsub;
                var ready = waitForInvocations(2, function () {
                    if (unsub) {
                        unsub();
                    }
                    resolve();
                });
                unsub = _this.onLibReAnnounced(function (lib) {
                    if (lib.name === "interop") {
                        return ready();
                    }
                    if (lib.name === "contexts") {
                        return ready();
                    }
                });
            }, 10000, "Transport switch timed out waiting for all libraries to be re-announced");
        };
        Connection.prototype.getNewSecondaryTransport = function (settings) {
            var _a;
            if (!((_a = settings.transportConfig) === null || _a === void 0 ? void 0 : _a.url)) {
                throw new Error("Missing secondary transport URL.");
            }
            return new WS(Object.assign({}, this.settings, { ws: settings.transportConfig.url, reconnectAttempts: 1 }), this.logger.subLogger("ws-secondary"));
        };
        Connection.prototype.getNewSecondaryAuth = function (settings) {
            var _a;
            if (!((_a = settings.transportConfig) === null || _a === void 0 ? void 0 : _a.auth)) {
                throw new Error("Missing secondary transport auth information.");
            }
            return settings.transportConfig.auth;
        };
        Connection.prototype.transportSwap = function () {
            this._swapTransport = false;
            if (!this._targetTransport || !this._targetAuth) {
                this.logger.warn("Error while switching transports - either the target transport or auth is not defined: transport defined -> ".concat(!!this._defaultTransport, ", auth defined -> ").concat(!!this._targetAuth, ". Staying on the current one."));
                return;
            }
            this._transportSubscriptions.forEach(function (unsub) { return unsub(); });
            this._transportSubscriptions = [];
            this.transport = this._targetTransport;
            var unsubConnectionChanged = this.transport.onConnectedChanged(this.handleConnectionChanged.bind(this));
            var unsubOnMessage = this.transport.onMessage(this.handleTransportMessage.bind(this));
            this._transportSubscriptions.push(unsubConnectionChanged);
            this._transportSubscriptions.push(unsubOnMessage);
            return this._targetAuth;
        };
        Connection.prototype.prepareDefaultSwap = function () {
            var _this = this;
            this._transportSubscriptions.forEach(function (unsub) { return unsub(); });
            this._transportSubscriptions = [];
            this.transport.close().catch(function (error) { return _this.logger.warn("Error closing the ".concat(_this.transport.name(), " transport after a failed connection attempt: ").concat(JSON.stringify(error))); });
            this._targetTransport = this._defaultTransport;
            this._targetAuth = this._defaultAuth;
            this._swapTransport = true;
        };
        return Connection;
    }());

    var order = ["trace", "debug", "info", "warn", "error", "off"];
    var Logger = (function () {
        function Logger(name, parent, logFn) {
            this.name = name;
            this.parent = parent;
            this.subLoggers = [];
            this.logFn = console;
            this.customLogFn = false;
            this.name = name;
            if (parent) {
                this.path = "".concat(parent.path, ".").concat(name);
            }
            else {
                this.path = name;
            }
            this.loggerFullName = "[".concat(this.path, "]");
            this.includeTimeAndLevel = !logFn;
            if (logFn) {
                this.logFn = logFn;
                this.customLogFn = true;
            }
        }
        Logger.prototype.subLogger = function (name) {
            var existingSub = this.subLoggers.filter(function (subLogger) {
                return subLogger.name === name;
            })[0];
            if (existingSub !== undefined) {
                return existingSub;
            }
            Object.keys(this).forEach(function (key) {
                if (key === name) {
                    throw new Error("This sub logger name is not allowed.");
                }
            });
            var sub = new Logger(name, this, this.customLogFn ? this.logFn : undefined);
            this.subLoggers.push(sub);
            return sub;
        };
        Logger.prototype.publishLevel = function (level) {
            var _a;
            if (level) {
                this._publishLevel = level;
            }
            return this._publishLevel || ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.publishLevel());
        };
        Logger.prototype.consoleLevel = function (level) {
            var _a;
            if (level) {
                this._consoleLevel = level;
            }
            return this._consoleLevel || ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.consoleLevel());
        };
        Logger.prototype.log = function (message, level, error) {
            this.publishMessage(level || "info", message, error);
        };
        Logger.prototype.trace = function (message) {
            this.log(message, "trace");
        };
        Logger.prototype.debug = function (message) {
            this.log(message, "debug");
        };
        Logger.prototype.info = function (message) {
            this.log(message, "info");
        };
        Logger.prototype.warn = function (message) {
            this.log(message, "warn");
        };
        Logger.prototype.error = function (message, err) {
            this.log(message, "error");
        };
        Logger.prototype.canPublish = function (level, compareWith) {
            var levelIdx = order.indexOf(level);
            var restrictionIdx = order.indexOf(compareWith || this.consoleLevel() || "trace");
            return levelIdx >= restrictionIdx;
        };
        Logger.prototype.publishMessage = function (level, message, error) {
            var loggerName = this.loggerFullName;
            if (level === "error" && !error) {
                var e = new Error();
                if (e.stack) {
                    message =
                        message +
                            "\n" +
                            e.stack
                                .split("\n")
                                .slice(3)
                                .join("\n");
                }
            }
            if (this.canPublish(level, this.publishLevel())) {
                var interop = Logger.Interop;
                if (interop) {
                    try {
                        if (interop.methods({ name: Logger.InteropMethodName }).length > 0) {
                            interop.invoke(Logger.InteropMethodName, {
                                msg: "".concat(message),
                                logger: loggerName,
                                level: level
                            });
                        }
                    }
                    catch (_a) {
                    }
                }
            }
            if (this.canPublish(level)) {
                var prefix = "";
                if (this.includeTimeAndLevel) {
                    var date = new Date();
                    var time = "".concat(date.getHours(), ":").concat(date.getMinutes(), ":").concat(date.getSeconds(), ":").concat(date.getMilliseconds());
                    prefix = "[".concat(time, "] [").concat(level, "] ");
                }
                var toPrint = "".concat(prefix).concat(loggerName, ": ").concat(message);
                switch (level) {
                    case "trace":
                        this.logFn.debug(toPrint);
                        break;
                    case "debug":
                        if (this.logFn.debug) {
                            this.logFn.debug(toPrint);
                        }
                        else {
                            this.logFn.log(toPrint);
                        }
                        break;
                    case "info":
                        this.logFn.info(toPrint);
                        break;
                    case "warn":
                        this.logFn.warn(toPrint);
                        break;
                    case "error":
                        this.logFn.error(toPrint, error);
                        break;
                }
            }
        };
        Logger.InteropMethodName = "T42.AppLogger.Log";
        return Logger;
    }());

    var GW_MESSAGE_CREATE_CONTEXT = "create-context";
    var GW_MESSAGE_ACTIVITY_CREATED = "created";
    var GW_MESSAGE_ACTIVITY_DESTROYED = "destroyed";
    var GW_MESSAGE_CONTEXT_CREATED = "context-created";
    var GW_MESSAGE_CONTEXT_ADDED = "context-added";
    var GW_MESSAGE_SUBSCRIBE_CONTEXT = "subscribe-context";
    var GW_MESSAGE_SUBSCRIBED_CONTEXT = "subscribed-context";
    var GW_MESSAGE_UNSUBSCRIBE_CONTEXT = "unsubscribe-context";
    var GW_MESSAGE_DESTROY_CONTEXT = "destroy-context";
    var GW_MESSAGE_CONTEXT_DESTROYED = "context-destroyed";
    var GW_MESSAGE_UPDATE_CONTEXT = "update-context";
    var GW_MESSAGE_CONTEXT_UPDATED = "context-updated";
    var GW_MESSAGE_JOINED_ACTIVITY = "joined";

    var ContextMessageReplaySpec = {
        get name() {
            return "context";
        },
        get types() {
            return [
                GW_MESSAGE_CREATE_CONTEXT,
                GW_MESSAGE_ACTIVITY_CREATED,
                GW_MESSAGE_ACTIVITY_DESTROYED,
                GW_MESSAGE_CONTEXT_CREATED,
                GW_MESSAGE_CONTEXT_ADDED,
                GW_MESSAGE_SUBSCRIBE_CONTEXT,
                GW_MESSAGE_SUBSCRIBED_CONTEXT,
                GW_MESSAGE_UNSUBSCRIBE_CONTEXT,
                GW_MESSAGE_DESTROY_CONTEXT,
                GW_MESSAGE_CONTEXT_DESTROYED,
                GW_MESSAGE_UPDATE_CONTEXT,
                GW_MESSAGE_CONTEXT_UPDATED,
                GW_MESSAGE_JOINED_ACTIVITY
            ];
        }
    };

    var version = "6.2.0";

    function prepareConfig (configuration, ext, glue42gd) {
        var _a, _b, _c, _d;
        var nodeStartingContext;
        if (Utils.isNode()) {
            var startingContextString = process.env._GD_STARTING_CONTEXT_;
            if (startingContextString) {
                try {
                    nodeStartingContext = JSON.parse(startingContextString);
                }
                catch (_e) {
                }
            }
        }
        function getConnection() {
            var _a, _b, _c, _d, _e, _f;
            var gwConfig = configuration.gateway;
            var protocolVersion = (_a = gwConfig === null || gwConfig === void 0 ? void 0 : gwConfig.protocolVersion) !== null && _a !== void 0 ? _a : 3;
            var reconnectInterval = gwConfig === null || gwConfig === void 0 ? void 0 : gwConfig.reconnectInterval;
            var reconnectAttempts = gwConfig === null || gwConfig === void 0 ? void 0 : gwConfig.reconnectAttempts;
            var defaultWs = "ws://localhost:8385";
            var ws = gwConfig === null || gwConfig === void 0 ? void 0 : gwConfig.ws;
            var sharedWorker = gwConfig === null || gwConfig === void 0 ? void 0 : gwConfig.sharedWorker;
            var inproc = gwConfig === null || gwConfig === void 0 ? void 0 : gwConfig.inproc;
            var webPlatform = (_b = gwConfig === null || gwConfig === void 0 ? void 0 : gwConfig.webPlatform) !== null && _b !== void 0 ? _b : undefined;
            if (glue42gd) {
                ws = glue42gd.gwURL;
            }
            if (Utils.isNode() && nodeStartingContext && nodeStartingContext.gwURL) {
                ws = nodeStartingContext.gwURL;
            }
            if (!ws && !sharedWorker && !inproc) {
                ws = defaultWs;
            }
            var instanceId;
            var windowId;
            var pid;
            var environment;
            var region;
            var appName = getApplication();
            var uniqueAppName = appName;
            if (typeof glue42gd !== "undefined") {
                windowId = glue42gd.windowId;
                pid = glue42gd.pid;
                if (glue42gd.env) {
                    environment = glue42gd.env.env;
                    region = glue42gd.env.region;
                }
                uniqueAppName = (_c = glue42gd.application) !== null && _c !== void 0 ? _c : "glue-app";
                instanceId = glue42gd.appInstanceId;
            }
            else if (Utils.isNode()) {
                pid = process.pid;
                if (nodeStartingContext) {
                    environment = nodeStartingContext.env;
                    region = nodeStartingContext.region;
                    instanceId = nodeStartingContext.instanceId;
                }
            }
            else if (typeof (window === null || window === void 0 ? void 0 : window.glue42electron) !== "undefined") {
                windowId = window === null || window === void 0 ? void 0 : window.glue42electron.instanceId;
                pid = window === null || window === void 0 ? void 0 : window.glue42electron.pid;
                environment = window === null || window === void 0 ? void 0 : window.glue42electron.env;
                region = window === null || window === void 0 ? void 0 : window.glue42electron.region;
                uniqueAppName = (_d = window === null || window === void 0 ? void 0 : window.glue42electron.application) !== null && _d !== void 0 ? _d : "glue-app";
                instanceId = window === null || window === void 0 ? void 0 : window.glue42electron.instanceId;
            }
            else ;
            var replaySpecs = (_f = (_e = configuration.gateway) === null || _e === void 0 ? void 0 : _e.replaySpecs) !== null && _f !== void 0 ? _f : [];
            replaySpecs.push(ContextMessageReplaySpec);
            var identity = {
                application: uniqueAppName,
                applicationName: appName,
                windowId: windowId,
                instance: instanceId,
                process: pid,
                region: region,
                environment: environment,
                api: ext.version || version
            };
            if (configuration.identity) {
                identity = Object.assign(identity, configuration.identity);
            }
            return {
                identity: identity,
                reconnectInterval: reconnectInterval,
                ws: ws,
                sharedWorker: sharedWorker,
                webPlatform: webPlatform,
                inproc: inproc,
                protocolVersion: protocolVersion,
                reconnectAttempts: reconnectAttempts,
                replaySpecs: replaySpecs,
            };
        }
        function getContexts() {
            if (typeof configuration.contexts === "undefined") {
                return { reAnnounceKnownContexts: true };
            }
            if (typeof configuration.contexts === "boolean" && configuration.contexts) {
                return { reAnnounceKnownContexts: true };
            }
            if (typeof configuration.contexts === "object") {
                return Object.assign({}, { reAnnounceKnownContexts: true }, configuration.contexts);
            }
            return false;
        }
        function getApplication() {
            if (configuration.application) {
                return configuration.application;
            }
            if (glue42gd) {
                return glue42gd.applicationName;
            }
            if (typeof window !== "undefined" && typeof window.glue42electron !== "undefined") {
                return window.glue42electron.application;
            }
            var uid = shortid();
            if (Utils.isNode()) {
                if (nodeStartingContext) {
                    return nodeStartingContext.applicationConfig.name;
                }
                return "NodeJS" + uid;
            }
            if (typeof window !== "undefined" && typeof document !== "undefined") {
                return document.title + " (".concat(uid, ")");
            }
            return uid;
        }
        function getAuth() {
            var _a, _b, _c;
            if (typeof configuration.auth === "string") {
                return {
                    token: configuration.auth
                };
            }
            if (configuration.auth) {
                return configuration.auth;
            }
            if (Utils.isNode() && nodeStartingContext && nodeStartingContext.gwToken) {
                return {
                    gatewayToken: nodeStartingContext.gwToken
                };
            }
            if (((_a = configuration.gateway) === null || _a === void 0 ? void 0 : _a.webPlatform) || ((_b = configuration.gateway) === null || _b === void 0 ? void 0 : _b.inproc) || ((_c = configuration.gateway) === null || _c === void 0 ? void 0 : _c.sharedWorker)) {
                return {
                    username: "glue42", password: "glue42"
                };
            }
        }
        function getLogger() {
            var _a, _b;
            var config = configuration.logger;
            var defaultLevel = "warn";
            if (!config) {
                config = defaultLevel;
            }
            var gdConsoleLevel;
            if (glue42gd) {
                gdConsoleLevel = glue42gd.consoleLogLevel;
            }
            if (typeof config === "string") {
                return { console: gdConsoleLevel !== null && gdConsoleLevel !== void 0 ? gdConsoleLevel : config, publish: defaultLevel };
            }
            return {
                console: (_a = gdConsoleLevel !== null && gdConsoleLevel !== void 0 ? gdConsoleLevel : config.console) !== null && _a !== void 0 ? _a : defaultLevel,
                publish: (_b = config.publish) !== null && _b !== void 0 ? _b : defaultLevel
            };
        }
        var connection = getConnection();
        var application = getApplication();
        if (typeof window !== "undefined") {
            var windowAsAny = window;
            var containerApplication = windowAsAny.htmlContainer ?
                "".concat(windowAsAny.htmlContainer.containerName, ".").concat(windowAsAny.htmlContainer.application) :
                (_a = windowAsAny === null || windowAsAny === void 0 ? void 0 : windowAsAny.glue42gd) === null || _a === void 0 ? void 0 : _a.application;
            if (containerApplication) {
                application = containerApplication;
            }
        }
        return {
            bus: (_b = configuration.bus) !== null && _b !== void 0 ? _b : false,
            application: application,
            auth: getAuth(),
            logger: getLogger(),
            connection: connection,
            metrics: (_c = configuration.metrics) !== null && _c !== void 0 ? _c : true,
            contexts: getContexts(),
            version: ext.version || version,
            libs: (_d = ext.libs) !== null && _d !== void 0 ? _d : [],
            customLogger: configuration.customLogger
        };
    }

    var GW3ContextData = (function () {
        function GW3ContextData(contextId, name, isAnnounced, activityId) {
            this.updateCallbacks = {};
            this.contextId = contextId;
            this.name = name;
            this.isAnnounced = isAnnounced;
            this.activityId = activityId;
            this.context = {};
        }
        GW3ContextData.prototype.hasCallbacks = function () {
            return Object.keys(this.updateCallbacks).length > 0;
        };
        GW3ContextData.prototype.getState = function () {
            if (this.isAnnounced && this.hasCallbacks()) {
                return 3;
            }
            if (this.isAnnounced) {
                return 2;
            }
            if (this.hasCallbacks()) {
                return 1;
            }
            return 0;
        };
        return GW3ContextData;
    }());

    var lodash_clonedeepExports = {};
    var lodash_clonedeep = {
      get exports(){ return lodash_clonedeepExports; },
      set exports(v){ lodash_clonedeepExports = v; },
    };

    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    (function (module, exports) {
    	/** Used as the size to enable large array optimizations. */
    	var LARGE_ARRAY_SIZE = 200;

    	/** Used to stand-in for `undefined` hash values. */
    	var HASH_UNDEFINED = '__lodash_hash_undefined__';

    	/** Used as references for various `Number` constants. */
    	var MAX_SAFE_INTEGER = 9007199254740991;

    	/** `Object#toString` result references. */
    	var argsTag = '[object Arguments]',
    	    arrayTag = '[object Array]',
    	    boolTag = '[object Boolean]',
    	    dateTag = '[object Date]',
    	    errorTag = '[object Error]',
    	    funcTag = '[object Function]',
    	    genTag = '[object GeneratorFunction]',
    	    mapTag = '[object Map]',
    	    numberTag = '[object Number]',
    	    objectTag = '[object Object]',
    	    promiseTag = '[object Promise]',
    	    regexpTag = '[object RegExp]',
    	    setTag = '[object Set]',
    	    stringTag = '[object String]',
    	    symbolTag = '[object Symbol]',
    	    weakMapTag = '[object WeakMap]';

    	var arrayBufferTag = '[object ArrayBuffer]',
    	    dataViewTag = '[object DataView]',
    	    float32Tag = '[object Float32Array]',
    	    float64Tag = '[object Float64Array]',
    	    int8Tag = '[object Int8Array]',
    	    int16Tag = '[object Int16Array]',
    	    int32Tag = '[object Int32Array]',
    	    uint8Tag = '[object Uint8Array]',
    	    uint8ClampedTag = '[object Uint8ClampedArray]',
    	    uint16Tag = '[object Uint16Array]',
    	    uint32Tag = '[object Uint32Array]';

    	/**
    	 * Used to match `RegExp`
    	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
    	 */
    	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    	/** Used to match `RegExp` flags from their coerced string values. */
    	var reFlags = /\w*$/;

    	/** Used to detect host constructors (Safari). */
    	var reIsHostCtor = /^\[object .+?Constructor\]$/;

    	/** Used to detect unsigned integer values. */
    	var reIsUint = /^(?:0|[1-9]\d*)$/;

    	/** Used to identify `toStringTag` values supported by `_.clone`. */
    	var cloneableTags = {};
    	cloneableTags[argsTag] = cloneableTags[arrayTag] =
    	cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
    	cloneableTags[boolTag] = cloneableTags[dateTag] =
    	cloneableTags[float32Tag] = cloneableTags[float64Tag] =
    	cloneableTags[int8Tag] = cloneableTags[int16Tag] =
    	cloneableTags[int32Tag] = cloneableTags[mapTag] =
    	cloneableTags[numberTag] = cloneableTags[objectTag] =
    	cloneableTags[regexpTag] = cloneableTags[setTag] =
    	cloneableTags[stringTag] = cloneableTags[symbolTag] =
    	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
    	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    	cloneableTags[errorTag] = cloneableTags[funcTag] =
    	cloneableTags[weakMapTag] = false;

    	/** Detect free variable `global` from Node.js. */
    	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    	/** Detect free variable `self`. */
    	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    	/** Used as a reference to the global object. */
    	var root = freeGlobal || freeSelf || Function('return this')();

    	/** Detect free variable `exports`. */
    	var freeExports = exports && !exports.nodeType && exports;

    	/** Detect free variable `module`. */
    	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    	/** Detect the popular CommonJS extension `module.exports`. */
    	var moduleExports = freeModule && freeModule.exports === freeExports;

    	/**
    	 * Adds the key-value `pair` to `map`.
    	 *
    	 * @private
    	 * @param {Object} map The map to modify.
    	 * @param {Array} pair The key-value pair to add.
    	 * @returns {Object} Returns `map`.
    	 */
    	function addMapEntry(map, pair) {
    	  // Don't return `map.set` because it's not chainable in IE 11.
    	  map.set(pair[0], pair[1]);
    	  return map;
    	}

    	/**
    	 * Adds `value` to `set`.
    	 *
    	 * @private
    	 * @param {Object} set The set to modify.
    	 * @param {*} value The value to add.
    	 * @returns {Object} Returns `set`.
    	 */
    	function addSetEntry(set, value) {
    	  // Don't return `set.add` because it's not chainable in IE 11.
    	  set.add(value);
    	  return set;
    	}

    	/**
    	 * A specialized version of `_.forEach` for arrays without support for
    	 * iteratee shorthands.
    	 *
    	 * @private
    	 * @param {Array} [array] The array to iterate over.
    	 * @param {Function} iteratee The function invoked per iteration.
    	 * @returns {Array} Returns `array`.
    	 */
    	function arrayEach(array, iteratee) {
    	  var index = -1,
    	      length = array ? array.length : 0;

    	  while (++index < length) {
    	    if (iteratee(array[index], index, array) === false) {
    	      break;
    	    }
    	  }
    	  return array;
    	}

    	/**
    	 * Appends the elements of `values` to `array`.
    	 *
    	 * @private
    	 * @param {Array} array The array to modify.
    	 * @param {Array} values The values to append.
    	 * @returns {Array} Returns `array`.
    	 */
    	function arrayPush(array, values) {
    	  var index = -1,
    	      length = values.length,
    	      offset = array.length;

    	  while (++index < length) {
    	    array[offset + index] = values[index];
    	  }
    	  return array;
    	}

    	/**
    	 * A specialized version of `_.reduce` for arrays without support for
    	 * iteratee shorthands.
    	 *
    	 * @private
    	 * @param {Array} [array] The array to iterate over.
    	 * @param {Function} iteratee The function invoked per iteration.
    	 * @param {*} [accumulator] The initial value.
    	 * @param {boolean} [initAccum] Specify using the first element of `array` as
    	 *  the initial value.
    	 * @returns {*} Returns the accumulated value.
    	 */
    	function arrayReduce(array, iteratee, accumulator, initAccum) {
    	  var index = -1,
    	      length = array ? array.length : 0;

    	  if (initAccum && length) {
    	    accumulator = array[++index];
    	  }
    	  while (++index < length) {
    	    accumulator = iteratee(accumulator, array[index], index, array);
    	  }
    	  return accumulator;
    	}

    	/**
    	 * The base implementation of `_.times` without support for iteratee shorthands
    	 * or max array length checks.
    	 *
    	 * @private
    	 * @param {number} n The number of times to invoke `iteratee`.
    	 * @param {Function} iteratee The function invoked per iteration.
    	 * @returns {Array} Returns the array of results.
    	 */
    	function baseTimes(n, iteratee) {
    	  var index = -1,
    	      result = Array(n);

    	  while (++index < n) {
    	    result[index] = iteratee(index);
    	  }
    	  return result;
    	}

    	/**
    	 * Gets the value at `key` of `object`.
    	 *
    	 * @private
    	 * @param {Object} [object] The object to query.
    	 * @param {string} key The key of the property to get.
    	 * @returns {*} Returns the property value.
    	 */
    	function getValue(object, key) {
    	  return object == null ? undefined : object[key];
    	}

    	/**
    	 * Checks if `value` is a host object in IE < 9.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
    	 */
    	function isHostObject(value) {
    	  // Many host objects are `Object` objects that can coerce to strings
    	  // despite having improperly defined `toString` methods.
    	  var result = false;
    	  if (value != null && typeof value.toString != 'function') {
    	    try {
    	      result = !!(value + '');
    	    } catch (e) {}
    	  }
    	  return result;
    	}

    	/**
    	 * Converts `map` to its key-value pairs.
    	 *
    	 * @private
    	 * @param {Object} map The map to convert.
    	 * @returns {Array} Returns the key-value pairs.
    	 */
    	function mapToArray(map) {
    	  var index = -1,
    	      result = Array(map.size);

    	  map.forEach(function(value, key) {
    	    result[++index] = [key, value];
    	  });
    	  return result;
    	}

    	/**
    	 * Creates a unary function that invokes `func` with its argument transformed.
    	 *
    	 * @private
    	 * @param {Function} func The function to wrap.
    	 * @param {Function} transform The argument transform.
    	 * @returns {Function} Returns the new function.
    	 */
    	function overArg(func, transform) {
    	  return function(arg) {
    	    return func(transform(arg));
    	  };
    	}

    	/**
    	 * Converts `set` to an array of its values.
    	 *
    	 * @private
    	 * @param {Object} set The set to convert.
    	 * @returns {Array} Returns the values.
    	 */
    	function setToArray(set) {
    	  var index = -1,
    	      result = Array(set.size);

    	  set.forEach(function(value) {
    	    result[++index] = value;
    	  });
    	  return result;
    	}

    	/** Used for built-in method references. */
    	var arrayProto = Array.prototype,
    	    funcProto = Function.prototype,
    	    objectProto = Object.prototype;

    	/** Used to detect overreaching core-js shims. */
    	var coreJsData = root['__core-js_shared__'];

    	/** Used to detect methods masquerading as native. */
    	var maskSrcKey = (function() {
    	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    	  return uid ? ('Symbol(src)_1.' + uid) : '';
    	}());

    	/** Used to resolve the decompiled source of functions. */
    	var funcToString = funcProto.toString;

    	/** Used to check objects for own properties. */
    	var hasOwnProperty = objectProto.hasOwnProperty;

    	/**
    	 * Used to resolve the
    	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
    	 * of values.
    	 */
    	var objectToString = objectProto.toString;

    	/** Used to detect if a method is native. */
    	var reIsNative = RegExp('^' +
    	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
    	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    	);

    	/** Built-in value references. */
    	var Buffer = moduleExports ? root.Buffer : undefined,
    	    Symbol = root.Symbol,
    	    Uint8Array = root.Uint8Array,
    	    getPrototype = overArg(Object.getPrototypeOf, Object),
    	    objectCreate = Object.create,
    	    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    	    splice = arrayProto.splice;

    	/* Built-in method references for those with the same name as other `lodash` methods. */
    	var nativeGetSymbols = Object.getOwnPropertySymbols,
    	    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    	    nativeKeys = overArg(Object.keys, Object);

    	/* Built-in method references that are verified to be native. */
    	var DataView = getNative(root, 'DataView'),
    	    Map = getNative(root, 'Map'),
    	    Promise = getNative(root, 'Promise'),
    	    Set = getNative(root, 'Set'),
    	    WeakMap = getNative(root, 'WeakMap'),
    	    nativeCreate = getNative(Object, 'create');

    	/** Used to detect maps, sets, and weakmaps. */
    	var dataViewCtorString = toSource(DataView),
    	    mapCtorString = toSource(Map),
    	    promiseCtorString = toSource(Promise),
    	    setCtorString = toSource(Set),
    	    weakMapCtorString = toSource(WeakMap);

    	/** Used to convert symbols to primitives and strings. */
    	var symbolProto = Symbol ? Symbol.prototype : undefined,
    	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    	/**
    	 * Creates a hash object.
    	 *
    	 * @private
    	 * @constructor
    	 * @param {Array} [entries] The key-value pairs to cache.
    	 */
    	function Hash(entries) {
    	  var index = -1,
    	      length = entries ? entries.length : 0;

    	  this.clear();
    	  while (++index < length) {
    	    var entry = entries[index];
    	    this.set(entry[0], entry[1]);
    	  }
    	}

    	/**
    	 * Removes all key-value entries from the hash.
    	 *
    	 * @private
    	 * @name clear
    	 * @memberOf Hash
    	 */
    	function hashClear() {
    	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
    	}

    	/**
    	 * Removes `key` and its value from the hash.
    	 *
    	 * @private
    	 * @name delete
    	 * @memberOf Hash
    	 * @param {Object} hash The hash to modify.
    	 * @param {string} key The key of the value to remove.
    	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
    	 */
    	function hashDelete(key) {
    	  return this.has(key) && delete this.__data__[key];
    	}

    	/**
    	 * Gets the hash value for `key`.
    	 *
    	 * @private
    	 * @name get
    	 * @memberOf Hash
    	 * @param {string} key The key of the value to get.
    	 * @returns {*} Returns the entry value.
    	 */
    	function hashGet(key) {
    	  var data = this.__data__;
    	  if (nativeCreate) {
    	    var result = data[key];
    	    return result === HASH_UNDEFINED ? undefined : result;
    	  }
    	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
    	}

    	/**
    	 * Checks if a hash value for `key` exists.
    	 *
    	 * @private
    	 * @name has
    	 * @memberOf Hash
    	 * @param {string} key The key of the entry to check.
    	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
    	 */
    	function hashHas(key) {
    	  var data = this.__data__;
    	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
    	}

    	/**
    	 * Sets the hash `key` to `value`.
    	 *
    	 * @private
    	 * @name set
    	 * @memberOf Hash
    	 * @param {string} key The key of the value to set.
    	 * @param {*} value The value to set.
    	 * @returns {Object} Returns the hash instance.
    	 */
    	function hashSet(key, value) {
    	  var data = this.__data__;
    	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    	  return this;
    	}

    	// Add methods to `Hash`.
    	Hash.prototype.clear = hashClear;
    	Hash.prototype['delete'] = hashDelete;
    	Hash.prototype.get = hashGet;
    	Hash.prototype.has = hashHas;
    	Hash.prototype.set = hashSet;

    	/**
    	 * Creates an list cache object.
    	 *
    	 * @private
    	 * @constructor
    	 * @param {Array} [entries] The key-value pairs to cache.
    	 */
    	function ListCache(entries) {
    	  var index = -1,
    	      length = entries ? entries.length : 0;

    	  this.clear();
    	  while (++index < length) {
    	    var entry = entries[index];
    	    this.set(entry[0], entry[1]);
    	  }
    	}

    	/**
    	 * Removes all key-value entries from the list cache.
    	 *
    	 * @private
    	 * @name clear
    	 * @memberOf ListCache
    	 */
    	function listCacheClear() {
    	  this.__data__ = [];
    	}

    	/**
    	 * Removes `key` and its value from the list cache.
    	 *
    	 * @private
    	 * @name delete
    	 * @memberOf ListCache
    	 * @param {string} key The key of the value to remove.
    	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
    	 */
    	function listCacheDelete(key) {
    	  var data = this.__data__,
    	      index = assocIndexOf(data, key);

    	  if (index < 0) {
    	    return false;
    	  }
    	  var lastIndex = data.length - 1;
    	  if (index == lastIndex) {
    	    data.pop();
    	  } else {
    	    splice.call(data, index, 1);
    	  }
    	  return true;
    	}

    	/**
    	 * Gets the list cache value for `key`.
    	 *
    	 * @private
    	 * @name get
    	 * @memberOf ListCache
    	 * @param {string} key The key of the value to get.
    	 * @returns {*} Returns the entry value.
    	 */
    	function listCacheGet(key) {
    	  var data = this.__data__,
    	      index = assocIndexOf(data, key);

    	  return index < 0 ? undefined : data[index][1];
    	}

    	/**
    	 * Checks if a list cache value for `key` exists.
    	 *
    	 * @private
    	 * @name has
    	 * @memberOf ListCache
    	 * @param {string} key The key of the entry to check.
    	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
    	 */
    	function listCacheHas(key) {
    	  return assocIndexOf(this.__data__, key) > -1;
    	}

    	/**
    	 * Sets the list cache `key` to `value`.
    	 *
    	 * @private
    	 * @name set
    	 * @memberOf ListCache
    	 * @param {string} key The key of the value to set.
    	 * @param {*} value The value to set.
    	 * @returns {Object} Returns the list cache instance.
    	 */
    	function listCacheSet(key, value) {
    	  var data = this.__data__,
    	      index = assocIndexOf(data, key);

    	  if (index < 0) {
    	    data.push([key, value]);
    	  } else {
    	    data[index][1] = value;
    	  }
    	  return this;
    	}

    	// Add methods to `ListCache`.
    	ListCache.prototype.clear = listCacheClear;
    	ListCache.prototype['delete'] = listCacheDelete;
    	ListCache.prototype.get = listCacheGet;
    	ListCache.prototype.has = listCacheHas;
    	ListCache.prototype.set = listCacheSet;

    	/**
    	 * Creates a map cache object to store key-value pairs.
    	 *
    	 * @private
    	 * @constructor
    	 * @param {Array} [entries] The key-value pairs to cache.
    	 */
    	function MapCache(entries) {
    	  var index = -1,
    	      length = entries ? entries.length : 0;

    	  this.clear();
    	  while (++index < length) {
    	    var entry = entries[index];
    	    this.set(entry[0], entry[1]);
    	  }
    	}

    	/**
    	 * Removes all key-value entries from the map.
    	 *
    	 * @private
    	 * @name clear
    	 * @memberOf MapCache
    	 */
    	function mapCacheClear() {
    	  this.__data__ = {
    	    'hash': new Hash,
    	    'map': new (Map || ListCache),
    	    'string': new Hash
    	  };
    	}

    	/**
    	 * Removes `key` and its value from the map.
    	 *
    	 * @private
    	 * @name delete
    	 * @memberOf MapCache
    	 * @param {string} key The key of the value to remove.
    	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
    	 */
    	function mapCacheDelete(key) {
    	  return getMapData(this, key)['delete'](key);
    	}

    	/**
    	 * Gets the map value for `key`.
    	 *
    	 * @private
    	 * @name get
    	 * @memberOf MapCache
    	 * @param {string} key The key of the value to get.
    	 * @returns {*} Returns the entry value.
    	 */
    	function mapCacheGet(key) {
    	  return getMapData(this, key).get(key);
    	}

    	/**
    	 * Checks if a map value for `key` exists.
    	 *
    	 * @private
    	 * @name has
    	 * @memberOf MapCache
    	 * @param {string} key The key of the entry to check.
    	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
    	 */
    	function mapCacheHas(key) {
    	  return getMapData(this, key).has(key);
    	}

    	/**
    	 * Sets the map `key` to `value`.
    	 *
    	 * @private
    	 * @name set
    	 * @memberOf MapCache
    	 * @param {string} key The key of the value to set.
    	 * @param {*} value The value to set.
    	 * @returns {Object} Returns the map cache instance.
    	 */
    	function mapCacheSet(key, value) {
    	  getMapData(this, key).set(key, value);
    	  return this;
    	}

    	// Add methods to `MapCache`.
    	MapCache.prototype.clear = mapCacheClear;
    	MapCache.prototype['delete'] = mapCacheDelete;
    	MapCache.prototype.get = mapCacheGet;
    	MapCache.prototype.has = mapCacheHas;
    	MapCache.prototype.set = mapCacheSet;

    	/**
    	 * Creates a stack cache object to store key-value pairs.
    	 *
    	 * @private
    	 * @constructor
    	 * @param {Array} [entries] The key-value pairs to cache.
    	 */
    	function Stack(entries) {
    	  this.__data__ = new ListCache(entries);
    	}

    	/**
    	 * Removes all key-value entries from the stack.
    	 *
    	 * @private
    	 * @name clear
    	 * @memberOf Stack
    	 */
    	function stackClear() {
    	  this.__data__ = new ListCache;
    	}

    	/**
    	 * Removes `key` and its value from the stack.
    	 *
    	 * @private
    	 * @name delete
    	 * @memberOf Stack
    	 * @param {string} key The key of the value to remove.
    	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
    	 */
    	function stackDelete(key) {
    	  return this.__data__['delete'](key);
    	}

    	/**
    	 * Gets the stack value for `key`.
    	 *
    	 * @private
    	 * @name get
    	 * @memberOf Stack
    	 * @param {string} key The key of the value to get.
    	 * @returns {*} Returns the entry value.
    	 */
    	function stackGet(key) {
    	  return this.__data__.get(key);
    	}

    	/**
    	 * Checks if a stack value for `key` exists.
    	 *
    	 * @private
    	 * @name has
    	 * @memberOf Stack
    	 * @param {string} key The key of the entry to check.
    	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
    	 */
    	function stackHas(key) {
    	  return this.__data__.has(key);
    	}

    	/**
    	 * Sets the stack `key` to `value`.
    	 *
    	 * @private
    	 * @name set
    	 * @memberOf Stack
    	 * @param {string} key The key of the value to set.
    	 * @param {*} value The value to set.
    	 * @returns {Object} Returns the stack cache instance.
    	 */
    	function stackSet(key, value) {
    	  var cache = this.__data__;
    	  if (cache instanceof ListCache) {
    	    var pairs = cache.__data__;
    	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
    	      pairs.push([key, value]);
    	      return this;
    	    }
    	    cache = this.__data__ = new MapCache(pairs);
    	  }
    	  cache.set(key, value);
    	  return this;
    	}

    	// Add methods to `Stack`.
    	Stack.prototype.clear = stackClear;
    	Stack.prototype['delete'] = stackDelete;
    	Stack.prototype.get = stackGet;
    	Stack.prototype.has = stackHas;
    	Stack.prototype.set = stackSet;

    	/**
    	 * Creates an array of the enumerable property names of the array-like `value`.
    	 *
    	 * @private
    	 * @param {*} value The value to query.
    	 * @param {boolean} inherited Specify returning inherited property names.
    	 * @returns {Array} Returns the array of property names.
    	 */
    	function arrayLikeKeys(value, inherited) {
    	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    	  // Safari 9 makes `arguments.length` enumerable in strict mode.
    	  var result = (isArray(value) || isArguments(value))
    	    ? baseTimes(value.length, String)
    	    : [];

    	  var length = result.length,
    	      skipIndexes = !!length;

    	  for (var key in value) {
    	    if ((inherited || hasOwnProperty.call(value, key)) &&
    	        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
    	      result.push(key);
    	    }
    	  }
    	  return result;
    	}

    	/**
    	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
    	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
    	 * for equality comparisons.
    	 *
    	 * @private
    	 * @param {Object} object The object to modify.
    	 * @param {string} key The key of the property to assign.
    	 * @param {*} value The value to assign.
    	 */
    	function assignValue(object, key, value) {
    	  var objValue = object[key];
    	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
    	      (value === undefined && !(key in object))) {
    	    object[key] = value;
    	  }
    	}

    	/**
    	 * Gets the index at which the `key` is found in `array` of key-value pairs.
    	 *
    	 * @private
    	 * @param {Array} array The array to inspect.
    	 * @param {*} key The key to search for.
    	 * @returns {number} Returns the index of the matched value, else `-1`.
    	 */
    	function assocIndexOf(array, key) {
    	  var length = array.length;
    	  while (length--) {
    	    if (eq(array[length][0], key)) {
    	      return length;
    	    }
    	  }
    	  return -1;
    	}

    	/**
    	 * The base implementation of `_.assign` without support for multiple sources
    	 * or `customizer` functions.
    	 *
    	 * @private
    	 * @param {Object} object The destination object.
    	 * @param {Object} source The source object.
    	 * @returns {Object} Returns `object`.
    	 */
    	function baseAssign(object, source) {
    	  return object && copyObject(source, keys(source), object);
    	}

    	/**
    	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
    	 * traversed objects.
    	 *
    	 * @private
    	 * @param {*} value The value to clone.
    	 * @param {boolean} [isDeep] Specify a deep clone.
    	 * @param {boolean} [isFull] Specify a clone including symbols.
    	 * @param {Function} [customizer] The function to customize cloning.
    	 * @param {string} [key] The key of `value`.
    	 * @param {Object} [object] The parent object of `value`.
    	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
    	 * @returns {*} Returns the cloned value.
    	 */
    	function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
    	  var result;
    	  if (customizer) {
    	    result = object ? customizer(value, key, object, stack) : customizer(value);
    	  }
    	  if (result !== undefined) {
    	    return result;
    	  }
    	  if (!isObject(value)) {
    	    return value;
    	  }
    	  var isArr = isArray(value);
    	  if (isArr) {
    	    result = initCloneArray(value);
    	    if (!isDeep) {
    	      return copyArray(value, result);
    	    }
    	  } else {
    	    var tag = getTag(value),
    	        isFunc = tag == funcTag || tag == genTag;

    	    if (isBuffer(value)) {
    	      return cloneBuffer(value, isDeep);
    	    }
    	    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
    	      if (isHostObject(value)) {
    	        return object ? value : {};
    	      }
    	      result = initCloneObject(isFunc ? {} : value);
    	      if (!isDeep) {
    	        return copySymbols(value, baseAssign(result, value));
    	      }
    	    } else {
    	      if (!cloneableTags[tag]) {
    	        return object ? value : {};
    	      }
    	      result = initCloneByTag(value, tag, baseClone, isDeep);
    	    }
    	  }
    	  // Check for circular references and return its corresponding clone.
    	  stack || (stack = new Stack);
    	  var stacked = stack.get(value);
    	  if (stacked) {
    	    return stacked;
    	  }
    	  stack.set(value, result);

    	  if (!isArr) {
    	    var props = isFull ? getAllKeys(value) : keys(value);
    	  }
    	  arrayEach(props || value, function(subValue, key) {
    	    if (props) {
    	      key = subValue;
    	      subValue = value[key];
    	    }
    	    // Recursively populate clone (susceptible to call stack limits).
    	    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
    	  });
    	  return result;
    	}

    	/**
    	 * The base implementation of `_.create` without support for assigning
    	 * properties to the created object.
    	 *
    	 * @private
    	 * @param {Object} prototype The object to inherit from.
    	 * @returns {Object} Returns the new object.
    	 */
    	function baseCreate(proto) {
    	  return isObject(proto) ? objectCreate(proto) : {};
    	}

    	/**
    	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
    	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
    	 * symbols of `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @param {Function} keysFunc The function to get the keys of `object`.
    	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
    	 * @returns {Array} Returns the array of property names and symbols.
    	 */
    	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    	  var result = keysFunc(object);
    	  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    	}

    	/**
    	 * The base implementation of `getTag`.
    	 *
    	 * @private
    	 * @param {*} value The value to query.
    	 * @returns {string} Returns the `toStringTag`.
    	 */
    	function baseGetTag(value) {
    	  return objectToString.call(value);
    	}

    	/**
    	 * The base implementation of `_.isNative` without bad shim checks.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a native function,
    	 *  else `false`.
    	 */
    	function baseIsNative(value) {
    	  if (!isObject(value) || isMasked(value)) {
    	    return false;
    	  }
    	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
    	  return pattern.test(toSource(value));
    	}

    	/**
    	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of property names.
    	 */
    	function baseKeys(object) {
    	  if (!isPrototype(object)) {
    	    return nativeKeys(object);
    	  }
    	  var result = [];
    	  for (var key in Object(object)) {
    	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
    	      result.push(key);
    	    }
    	  }
    	  return result;
    	}

    	/**
    	 * Creates a clone of  `buffer`.
    	 *
    	 * @private
    	 * @param {Buffer} buffer The buffer to clone.
    	 * @param {boolean} [isDeep] Specify a deep clone.
    	 * @returns {Buffer} Returns the cloned buffer.
    	 */
    	function cloneBuffer(buffer, isDeep) {
    	  if (isDeep) {
    	    return buffer.slice();
    	  }
    	  var result = new buffer.constructor(buffer.length);
    	  buffer.copy(result);
    	  return result;
    	}

    	/**
    	 * Creates a clone of `arrayBuffer`.
    	 *
    	 * @private
    	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
    	 * @returns {ArrayBuffer} Returns the cloned array buffer.
    	 */
    	function cloneArrayBuffer(arrayBuffer) {
    	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    	  return result;
    	}

    	/**
    	 * Creates a clone of `dataView`.
    	 *
    	 * @private
    	 * @param {Object} dataView The data view to clone.
    	 * @param {boolean} [isDeep] Specify a deep clone.
    	 * @returns {Object} Returns the cloned data view.
    	 */
    	function cloneDataView(dataView, isDeep) {
    	  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    	}

    	/**
    	 * Creates a clone of `map`.
    	 *
    	 * @private
    	 * @param {Object} map The map to clone.
    	 * @param {Function} cloneFunc The function to clone values.
    	 * @param {boolean} [isDeep] Specify a deep clone.
    	 * @returns {Object} Returns the cloned map.
    	 */
    	function cloneMap(map, isDeep, cloneFunc) {
    	  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
    	  return arrayReduce(array, addMapEntry, new map.constructor);
    	}

    	/**
    	 * Creates a clone of `regexp`.
    	 *
    	 * @private
    	 * @param {Object} regexp The regexp to clone.
    	 * @returns {Object} Returns the cloned regexp.
    	 */
    	function cloneRegExp(regexp) {
    	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    	  result.lastIndex = regexp.lastIndex;
    	  return result;
    	}

    	/**
    	 * Creates a clone of `set`.
    	 *
    	 * @private
    	 * @param {Object} set The set to clone.
    	 * @param {Function} cloneFunc The function to clone values.
    	 * @param {boolean} [isDeep] Specify a deep clone.
    	 * @returns {Object} Returns the cloned set.
    	 */
    	function cloneSet(set, isDeep, cloneFunc) {
    	  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
    	  return arrayReduce(array, addSetEntry, new set.constructor);
    	}

    	/**
    	 * Creates a clone of the `symbol` object.
    	 *
    	 * @private
    	 * @param {Object} symbol The symbol object to clone.
    	 * @returns {Object} Returns the cloned symbol object.
    	 */
    	function cloneSymbol(symbol) {
    	  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    	}

    	/**
    	 * Creates a clone of `typedArray`.
    	 *
    	 * @private
    	 * @param {Object} typedArray The typed array to clone.
    	 * @param {boolean} [isDeep] Specify a deep clone.
    	 * @returns {Object} Returns the cloned typed array.
    	 */
    	function cloneTypedArray(typedArray, isDeep) {
    	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    	}

    	/**
    	 * Copies the values of `source` to `array`.
    	 *
    	 * @private
    	 * @param {Array} source The array to copy values from.
    	 * @param {Array} [array=[]] The array to copy values to.
    	 * @returns {Array} Returns `array`.
    	 */
    	function copyArray(source, array) {
    	  var index = -1,
    	      length = source.length;

    	  array || (array = Array(length));
    	  while (++index < length) {
    	    array[index] = source[index];
    	  }
    	  return array;
    	}

    	/**
    	 * Copies properties of `source` to `object`.
    	 *
    	 * @private
    	 * @param {Object} source The object to copy properties from.
    	 * @param {Array} props The property identifiers to copy.
    	 * @param {Object} [object={}] The object to copy properties to.
    	 * @param {Function} [customizer] The function to customize copied values.
    	 * @returns {Object} Returns `object`.
    	 */
    	function copyObject(source, props, object, customizer) {
    	  object || (object = {});

    	  var index = -1,
    	      length = props.length;

    	  while (++index < length) {
    	    var key = props[index];

    	    var newValue = customizer
    	      ? customizer(object[key], source[key], key, object, source)
    	      : undefined;

    	    assignValue(object, key, newValue === undefined ? source[key] : newValue);
    	  }
    	  return object;
    	}

    	/**
    	 * Copies own symbol properties of `source` to `object`.
    	 *
    	 * @private
    	 * @param {Object} source The object to copy symbols from.
    	 * @param {Object} [object={}] The object to copy symbols to.
    	 * @returns {Object} Returns `object`.
    	 */
    	function copySymbols(source, object) {
    	  return copyObject(source, getSymbols(source), object);
    	}

    	/**
    	 * Creates an array of own enumerable property names and symbols of `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of property names and symbols.
    	 */
    	function getAllKeys(object) {
    	  return baseGetAllKeys(object, keys, getSymbols);
    	}

    	/**
    	 * Gets the data for `map`.
    	 *
    	 * @private
    	 * @param {Object} map The map to query.
    	 * @param {string} key The reference key.
    	 * @returns {*} Returns the map data.
    	 */
    	function getMapData(map, key) {
    	  var data = map.__data__;
    	  return isKeyable(key)
    	    ? data[typeof key == 'string' ? 'string' : 'hash']
    	    : data.map;
    	}

    	/**
    	 * Gets the native function at `key` of `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @param {string} key The key of the method to get.
    	 * @returns {*} Returns the function if it's native, else `undefined`.
    	 */
    	function getNative(object, key) {
    	  var value = getValue(object, key);
    	  return baseIsNative(value) ? value : undefined;
    	}

    	/**
    	 * Creates an array of the own enumerable symbol properties of `object`.
    	 *
    	 * @private
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of symbols.
    	 */
    	var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

    	/**
    	 * Gets the `toStringTag` of `value`.
    	 *
    	 * @private
    	 * @param {*} value The value to query.
    	 * @returns {string} Returns the `toStringTag`.
    	 */
    	var getTag = baseGetTag;

    	// Fallback for data views, maps, sets, and weak maps in IE 11,
    	// for data views in Edge < 14, and promises in Node.js.
    	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    	    (Map && getTag(new Map) != mapTag) ||
    	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    	    (Set && getTag(new Set) != setTag) ||
    	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
    	  getTag = function(value) {
    	    var result = objectToString.call(value),
    	        Ctor = result == objectTag ? value.constructor : undefined,
    	        ctorString = Ctor ? toSource(Ctor) : undefined;

    	    if (ctorString) {
    	      switch (ctorString) {
    	        case dataViewCtorString: return dataViewTag;
    	        case mapCtorString: return mapTag;
    	        case promiseCtorString: return promiseTag;
    	        case setCtorString: return setTag;
    	        case weakMapCtorString: return weakMapTag;
    	      }
    	    }
    	    return result;
    	  };
    	}

    	/**
    	 * Initializes an array clone.
    	 *
    	 * @private
    	 * @param {Array} array The array to clone.
    	 * @returns {Array} Returns the initialized clone.
    	 */
    	function initCloneArray(array) {
    	  var length = array.length,
    	      result = array.constructor(length);

    	  // Add properties assigned by `RegExp#exec`.
    	  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    	    result.index = array.index;
    	    result.input = array.input;
    	  }
    	  return result;
    	}

    	/**
    	 * Initializes an object clone.
    	 *
    	 * @private
    	 * @param {Object} object The object to clone.
    	 * @returns {Object} Returns the initialized clone.
    	 */
    	function initCloneObject(object) {
    	  return (typeof object.constructor == 'function' && !isPrototype(object))
    	    ? baseCreate(getPrototype(object))
    	    : {};
    	}

    	/**
    	 * Initializes an object clone based on its `toStringTag`.
    	 *
    	 * **Note:** This function only supports cloning values with tags of
    	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
    	 *
    	 * @private
    	 * @param {Object} object The object to clone.
    	 * @param {string} tag The `toStringTag` of the object to clone.
    	 * @param {Function} cloneFunc The function to clone values.
    	 * @param {boolean} [isDeep] Specify a deep clone.
    	 * @returns {Object} Returns the initialized clone.
    	 */
    	function initCloneByTag(object, tag, cloneFunc, isDeep) {
    	  var Ctor = object.constructor;
    	  switch (tag) {
    	    case arrayBufferTag:
    	      return cloneArrayBuffer(object);

    	    case boolTag:
    	    case dateTag:
    	      return new Ctor(+object);

    	    case dataViewTag:
    	      return cloneDataView(object, isDeep);

    	    case float32Tag: case float64Tag:
    	    case int8Tag: case int16Tag: case int32Tag:
    	    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
    	      return cloneTypedArray(object, isDeep);

    	    case mapTag:
    	      return cloneMap(object, isDeep, cloneFunc);

    	    case numberTag:
    	    case stringTag:
    	      return new Ctor(object);

    	    case regexpTag:
    	      return cloneRegExp(object);

    	    case setTag:
    	      return cloneSet(object, isDeep, cloneFunc);

    	    case symbolTag:
    	      return cloneSymbol(object);
    	  }
    	}

    	/**
    	 * Checks if `value` is a valid array-like index.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
    	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
    	 */
    	function isIndex(value, length) {
    	  length = length == null ? MAX_SAFE_INTEGER : length;
    	  return !!length &&
    	    (typeof value == 'number' || reIsUint.test(value)) &&
    	    (value > -1 && value % 1 == 0 && value < length);
    	}

    	/**
    	 * Checks if `value` is suitable for use as unique object key.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
    	 */
    	function isKeyable(value) {
    	  var type = typeof value;
    	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    	    ? (value !== '__proto__')
    	    : (value === null);
    	}

    	/**
    	 * Checks if `func` has its source masked.
    	 *
    	 * @private
    	 * @param {Function} func The function to check.
    	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
    	 */
    	function isMasked(func) {
    	  return !!maskSrcKey && (maskSrcKey in func);
    	}

    	/**
    	 * Checks if `value` is likely a prototype object.
    	 *
    	 * @private
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
    	 */
    	function isPrototype(value) {
    	  var Ctor = value && value.constructor,
    	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

    	  return value === proto;
    	}

    	/**
    	 * Converts `func` to its source code.
    	 *
    	 * @private
    	 * @param {Function} func The function to process.
    	 * @returns {string} Returns the source code.
    	 */
    	function toSource(func) {
    	  if (func != null) {
    	    try {
    	      return funcToString.call(func);
    	    } catch (e) {}
    	    try {
    	      return (func + '');
    	    } catch (e) {}
    	  }
    	  return '';
    	}

    	/**
    	 * This method is like `_.clone` except that it recursively clones `value`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 1.0.0
    	 * @category Lang
    	 * @param {*} value The value to recursively clone.
    	 * @returns {*} Returns the deep cloned value.
    	 * @see _.clone
    	 * @example
    	 *
    	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
    	 *
    	 * var deep = _.cloneDeep(objects);
    	 * console.log(deep[0] === objects[0]);
    	 * // => false
    	 */
    	function cloneDeep(value) {
    	  return baseClone(value, true, true);
    	}

    	/**
    	 * Performs a
    	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
    	 * comparison between two values to determine if they are equivalent.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to compare.
    	 * @param {*} other The other value to compare.
    	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
    	 * @example
    	 *
    	 * var object = { 'a': 1 };
    	 * var other = { 'a': 1 };
    	 *
    	 * _.eq(object, object);
    	 * // => true
    	 *
    	 * _.eq(object, other);
    	 * // => false
    	 *
    	 * _.eq('a', 'a');
    	 * // => true
    	 *
    	 * _.eq('a', Object('a'));
    	 * // => false
    	 *
    	 * _.eq(NaN, NaN);
    	 * // => true
    	 */
    	function eq(value, other) {
    	  return value === other || (value !== value && other !== other);
    	}

    	/**
    	 * Checks if `value` is likely an `arguments` object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
    	 *  else `false`.
    	 * @example
    	 *
    	 * _.isArguments(function() { return arguments; }());
    	 * // => true
    	 *
    	 * _.isArguments([1, 2, 3]);
    	 * // => false
    	 */
    	function isArguments(value) {
    	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
    	}

    	/**
    	 * Checks if `value` is classified as an `Array` object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
    	 * @example
    	 *
    	 * _.isArray([1, 2, 3]);
    	 * // => true
    	 *
    	 * _.isArray(document.body.children);
    	 * // => false
    	 *
    	 * _.isArray('abc');
    	 * // => false
    	 *
    	 * _.isArray(_.noop);
    	 * // => false
    	 */
    	var isArray = Array.isArray;

    	/**
    	 * Checks if `value` is array-like. A value is considered array-like if it's
    	 * not a function and has a `value.length` that's an integer greater than or
    	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
    	 * @example
    	 *
    	 * _.isArrayLike([1, 2, 3]);
    	 * // => true
    	 *
    	 * _.isArrayLike(document.body.children);
    	 * // => true
    	 *
    	 * _.isArrayLike('abc');
    	 * // => true
    	 *
    	 * _.isArrayLike(_.noop);
    	 * // => false
    	 */
    	function isArrayLike(value) {
    	  return value != null && isLength(value.length) && !isFunction(value);
    	}

    	/**
    	 * This method is like `_.isArrayLike` except that it also checks if `value`
    	 * is an object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is an array-like object,
    	 *  else `false`.
    	 * @example
    	 *
    	 * _.isArrayLikeObject([1, 2, 3]);
    	 * // => true
    	 *
    	 * _.isArrayLikeObject(document.body.children);
    	 * // => true
    	 *
    	 * _.isArrayLikeObject('abc');
    	 * // => false
    	 *
    	 * _.isArrayLikeObject(_.noop);
    	 * // => false
    	 */
    	function isArrayLikeObject(value) {
    	  return isObjectLike(value) && isArrayLike(value);
    	}

    	/**
    	 * Checks if `value` is a buffer.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.3.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
    	 * @example
    	 *
    	 * _.isBuffer(new Buffer(2));
    	 * // => true
    	 *
    	 * _.isBuffer(new Uint8Array(2));
    	 * // => false
    	 */
    	var isBuffer = nativeIsBuffer || stubFalse;

    	/**
    	 * Checks if `value` is classified as a `Function` object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
    	 * @example
    	 *
    	 * _.isFunction(_);
    	 * // => true
    	 *
    	 * _.isFunction(/abc/);
    	 * // => false
    	 */
    	function isFunction(value) {
    	  // The use of `Object#toString` avoids issues with the `typeof` operator
    	  // in Safari 8-9 which returns 'object' for typed array and other constructors.
    	  var tag = isObject(value) ? objectToString.call(value) : '';
    	  return tag == funcTag || tag == genTag;
    	}

    	/**
    	 * Checks if `value` is a valid array-like length.
    	 *
    	 * **Note:** This method is loosely based on
    	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
    	 * @example
    	 *
    	 * _.isLength(3);
    	 * // => true
    	 *
    	 * _.isLength(Number.MIN_VALUE);
    	 * // => false
    	 *
    	 * _.isLength(Infinity);
    	 * // => false
    	 *
    	 * _.isLength('3');
    	 * // => false
    	 */
    	function isLength(value) {
    	  return typeof value == 'number' &&
    	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    	}

    	/**
    	 * Checks if `value` is the
    	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
    	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
    	 * @example
    	 *
    	 * _.isObject({});
    	 * // => true
    	 *
    	 * _.isObject([1, 2, 3]);
    	 * // => true
    	 *
    	 * _.isObject(_.noop);
    	 * // => true
    	 *
    	 * _.isObject(null);
    	 * // => false
    	 */
    	function isObject(value) {
    	  var type = typeof value;
    	  return !!value && (type == 'object' || type == 'function');
    	}

    	/**
    	 * Checks if `value` is object-like. A value is object-like if it's not `null`
    	 * and has a `typeof` result of "object".
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
    	 * @example
    	 *
    	 * _.isObjectLike({});
    	 * // => true
    	 *
    	 * _.isObjectLike([1, 2, 3]);
    	 * // => true
    	 *
    	 * _.isObjectLike(_.noop);
    	 * // => false
    	 *
    	 * _.isObjectLike(null);
    	 * // => false
    	 */
    	function isObjectLike(value) {
    	  return !!value && typeof value == 'object';
    	}

    	/**
    	 * Creates an array of the own enumerable property names of `object`.
    	 *
    	 * **Note:** Non-object values are coerced to objects. See the
    	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
    	 * for more details.
    	 *
    	 * @static
    	 * @since 0.1.0
    	 * @memberOf _
    	 * @category Object
    	 * @param {Object} object The object to query.
    	 * @returns {Array} Returns the array of property names.
    	 * @example
    	 *
    	 * function Foo() {
    	 *   this.a = 1;
    	 *   this.b = 2;
    	 * }
    	 *
    	 * Foo.prototype.c = 3;
    	 *
    	 * _.keys(new Foo);
    	 * // => ['a', 'b'] (iteration order is not guaranteed)
    	 *
    	 * _.keys('hi');
    	 * // => ['0', '1']
    	 */
    	function keys(object) {
    	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    	}

    	/**
    	 * This method returns a new empty array.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.13.0
    	 * @category Util
    	 * @returns {Array} Returns the new empty array.
    	 * @example
    	 *
    	 * var arrays = _.times(2, _.stubArray);
    	 *
    	 * console.log(arrays);
    	 * // => [[], []]
    	 *
    	 * console.log(arrays[0] === arrays[1]);
    	 * // => false
    	 */
    	function stubArray() {
    	  return [];
    	}

    	/**
    	 * This method returns `false`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.13.0
    	 * @category Util
    	 * @returns {boolean} Returns `false`.
    	 * @example
    	 *
    	 * _.times(2, _.stubFalse);
    	 * // => [false, false]
    	 */
    	function stubFalse() {
    	  return false;
    	}

    	module.exports = cloneDeep;
    } (lodash_clonedeep, lodash_clonedeepExports));

    var cloneDeep = lodash_clonedeepExports;

    function applyContextDelta(context, delta, logger) {
        try {
            if (logger === null || logger === void 0 ? void 0 : logger.canPublish("trace")) {
                logger === null || logger === void 0 ? void 0 : logger.trace("applying context delta ".concat(JSON.stringify(delta), " on context ").concat(JSON.stringify(context)));
            }
            if (!delta) {
                return context;
            }
            if (delta.reset) {
                context = __assign({}, delta.reset);
                return context;
            }
            context = deepClone(context, undefined);
            if (delta.commands) {
                for (var _i = 0, _a = delta.commands; _i < _a.length; _i++) {
                    var command = _a[_i];
                    if (command.type === "remove") {
                        deletePath(context, command.path);
                    }
                    else if (command.type === "set") {
                        setValueToPath(context, command.value, command.path);
                    }
                }
                return context;
            }
            var added_1 = delta.added;
            var updated_1 = delta.updated;
            var removed = delta.removed;
            if (added_1) {
                Object.keys(added_1).forEach(function (key) {
                    context[key] = added_1[key];
                });
            }
            if (updated_1) {
                Object.keys(updated_1).forEach(function (key) {
                    mergeObjectsProperties(key, context, updated_1);
                });
            }
            if (removed) {
                removed.forEach(function (key) {
                    delete context[key];
                });
            }
            return context;
        }
        catch (e) {
            logger === null || logger === void 0 ? void 0 : logger.error("error applying context delta ".concat(JSON.stringify(delta), " on context ").concat(JSON.stringify(context)), e);
            return context;
        }
    }
    function deepClone(obj, hash) {
        return cloneDeep(obj);
    }
    var mergeObjectsProperties = function (key, what, withWhat) {
        var right = withWhat[key];
        if (right === undefined) {
            return what;
        }
        var left = what[key];
        if (!left || !right) {
            what[key] = right;
            return what;
        }
        if (typeof left === "string" ||
            typeof left === "number" ||
            typeof left === "boolean" ||
            typeof right === "string" ||
            typeof right === "number" ||
            typeof right === "boolean" ||
            Array.isArray(left) ||
            Array.isArray(right)) {
            what[key] = right;
            return what;
        }
        what[key] = Object.assign({}, left, right);
        return what;
    };
    function deepEqual(x, y) {
        if (x === y) {
            return true;
        }
        if (!(x instanceof Object) || !(y instanceof Object)) {
            return false;
        }
        if (x.constructor !== y.constructor) {
            return false;
        }
        for (var p in x) {
            if (!x.hasOwnProperty(p)) {
                continue;
            }
            if (!y.hasOwnProperty(p)) {
                return false;
            }
            if (x[p] === y[p]) {
                continue;
            }
            if (typeof (x[p]) !== "object") {
                return false;
            }
            if (!deepEqual(x[p], y[p])) {
                return false;
            }
        }
        for (var p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    }
    function setValueToPath(obj, value, path) {
        var pathArr = path.split(".");
        var i;
        for (i = 0; i < pathArr.length - 1; i++) {
            if (!obj[pathArr[i]]) {
                obj[pathArr[i]] = {};
            }
            if (typeof obj[pathArr[i]] !== "object") {
                obj[pathArr[i]] = {};
            }
            obj = obj[pathArr[i]];
        }
        obj[pathArr[i]] = value;
    }
    function isSubset(superObj, subObj) {
        return Object.keys(subObj).every(function (ele) {
            if (typeof subObj[ele] === "object") {
                return isSubset((superObj === null || superObj === void 0 ? void 0 : superObj[ele]) || {}, subObj[ele] || {});
            }
            return subObj[ele] === (superObj === null || superObj === void 0 ? void 0 : superObj[ele]);
        });
    }
    function deletePath(obj, path) {
        var pathArr = path.split(".");
        var i;
        for (i = 0; i < pathArr.length - 1; i++) {
            if (!obj[pathArr[i]]) {
                return;
            }
            obj = obj[pathArr[i]];
        }
        delete obj[pathArr[i]];
    }

    var GW3Bridge = (function () {
        function GW3Bridge(config) {
            var _this = this;
            var _a;
            this._contextNameToData = {};
            this._gw3Subscriptions = [];
            this._nextCallbackSubscriptionNumber = 0;
            this._creationPromises = {};
            this._contextNameToId = {};
            this._contextIdToName = {};
            this._protocolVersion = undefined;
            this._contextsTempCache = {};
            this._contextsSubscriptionsCache = [];
            this._connection = config.connection;
            this._logger = config.logger;
            this._trackAllContexts = config.trackAllContexts;
            this._reAnnounceKnownContexts = config.reAnnounceKnownContexts;
            this._gw3Session = this._connection.domain("global", [
                GW_MESSAGE_CONTEXT_CREATED,
                GW_MESSAGE_SUBSCRIBED_CONTEXT,
                GW_MESSAGE_CONTEXT_DESTROYED,
                GW_MESSAGE_CONTEXT_UPDATED,
            ]);
            this._gw3Session.disconnected(this.resetState.bind(this));
            this._gw3Session.onJoined(function (wasReconnect) {
                if (!wasReconnect) {
                    return;
                }
                if (!_this._reAnnounceKnownContexts) {
                    return _this._connection.setLibReAnnounced({ name: "contexts" });
                }
                _this.reInitiateState().then(function () { return _this._connection.setLibReAnnounced({ name: "contexts" }); });
            });
            this.subscribeToContextCreatedMessages();
            this.subscribeToContextUpdatedMessages();
            this.subscribeToContextDestroyedMessages();
            (_a = this._connection.replayer) === null || _a === void 0 ? void 0 : _a.drain(ContextMessageReplaySpec.name, function (message) {
                var type = message.type;
                if (!type) {
                    return;
                }
                if (type === GW_MESSAGE_CONTEXT_CREATED ||
                    type === GW_MESSAGE_CONTEXT_ADDED ||
                    type === GW_MESSAGE_ACTIVITY_CREATED) {
                    _this.handleContextCreatedMessage(message);
                }
                else if (type === GW_MESSAGE_SUBSCRIBED_CONTEXT ||
                    type === GW_MESSAGE_CONTEXT_UPDATED ||
                    type === GW_MESSAGE_JOINED_ACTIVITY) {
                    _this.handleContextUpdatedMessage(message);
                }
                else if (type === GW_MESSAGE_CONTEXT_DESTROYED ||
                    type === GW_MESSAGE_ACTIVITY_DESTROYED) {
                    _this.handleContextDestroyedMessage(message);
                }
            });
        }
        Object.defineProperty(GW3Bridge.prototype, "protocolVersion", {
            get: function () {
                var _a;
                if (!this._protocolVersion) {
                    var contextsDomainInfo = this._connection.availableDomains.find(function (d) { return d.uri === "context"; });
                    this._protocolVersion = (_a = contextsDomainInfo === null || contextsDomainInfo === void 0 ? void 0 : contextsDomainInfo.version) !== null && _a !== void 0 ? _a : 1;
                }
                return this._protocolVersion;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GW3Bridge.prototype, "setPathSupported", {
            get: function () {
                return this.protocolVersion >= 2;
            },
            enumerable: false,
            configurable: true
        });
        GW3Bridge.prototype.dispose = function () {
            for (var _i = 0, _a = this._gw3Subscriptions; _i < _a.length; _i++) {
                var sub = _a[_i];
                this._connection.off(sub);
            }
            this._gw3Subscriptions.length = 0;
            for (var contextName in this._contextNameToData) {
                if (this._contextNameToId.hasOwnProperty(contextName)) {
                    delete this._contextNameToData[contextName];
                }
            }
        };
        GW3Bridge.prototype.createContext = function (name, data) {
            var _this = this;
            if (name in this._creationPromises) {
                return this._creationPromises[name];
            }
            this._creationPromises[name] =
                this._gw3Session
                    .send({
                    type: GW_MESSAGE_CREATE_CONTEXT,
                    domain: "global",
                    name: name,
                    data: data,
                    lifetime: "retained",
                })
                    .then(function (createContextMsg) {
                    _this._contextNameToId[name] = createContextMsg.context_id;
                    _this._contextIdToName[createContextMsg.context_id] = name;
                    var contextData = _this._contextNameToData[name] || new GW3ContextData(createContextMsg.context_id, name, true, undefined);
                    contextData.isAnnounced = true;
                    contextData.name = name;
                    contextData.contextId = createContextMsg.context_id;
                    contextData.context = createContextMsg.data || deepClone(data);
                    contextData.hasReceivedSnapshot = true;
                    _this._contextNameToData[name] = contextData;
                    delete _this._creationPromises[name];
                    return createContextMsg.context_id;
                });
            return this._creationPromises[name];
        };
        GW3Bridge.prototype.all = function () {
            var _this = this;
            return Object.keys(this._contextNameToData)
                .filter(function (name) { return _this._contextNameToData[name].isAnnounced; });
        };
        GW3Bridge.prototype.update = function (name, delta) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var contextData, currentContext, calculatedDelta;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (delta) {
                                delta = deepClone(delta);
                            }
                            if (!(name in this._creationPromises)) return [3, 2];
                            return [4, this._creationPromises[name]];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2:
                            contextData = this._contextNameToData[name];
                            if (!contextData || !contextData.isAnnounced) {
                                return [2, this.createContext(name, delta)];
                            }
                            currentContext = contextData.context;
                            if (!!contextData.hasCallbacks()) return [3, 4];
                            return [4, this.get(contextData.name)];
                        case 3:
                            currentContext = _b.sent();
                            _b.label = 4;
                        case 4:
                            calculatedDelta = this.setPathSupported ?
                                this.calculateContextDeltaV2(currentContext, delta) :
                                this.calculateContextDeltaV1(currentContext, delta);
                            if (!Object.keys(calculatedDelta.added).length
                                && !Object.keys(calculatedDelta.updated).length
                                && !calculatedDelta.removed.length
                                && !((_a = calculatedDelta.commands) === null || _a === void 0 ? void 0 : _a.length)) {
                                return [2, Promise.resolve()];
                            }
                            return [2, this._gw3Session
                                    .send({
                                    type: GW_MESSAGE_UPDATE_CONTEXT,
                                    domain: "global",
                                    context_id: contextData.contextId,
                                    delta: calculatedDelta,
                                }, {}, { skipPeerId: false })
                                    .then(function (gwResponse) {
                                    _this.handleUpdated(contextData, calculatedDelta, {
                                        updaterId: gwResponse.peer_id
                                    });
                                })];
                    }
                });
            });
        };
        GW3Bridge.prototype.set = function (name, data) {
            return __awaiter(this, void 0, void 0, function () {
                var contextData;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (data) {
                                data = deepClone(data);
                            }
                            if (!(name in this._creationPromises)) return [3, 2];
                            return [4, this._creationPromises[name]];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            contextData = this._contextNameToData[name];
                            if (!contextData || !contextData.isAnnounced) {
                                return [2, this.createContext(name, data)];
                            }
                            return [2, this._gw3Session
                                    .send({
                                    type: GW_MESSAGE_UPDATE_CONTEXT,
                                    domain: "global",
                                    context_id: contextData.contextId,
                                    delta: { reset: data },
                                }, {}, { skipPeerId: false })
                                    .then(function (gwResponse) {
                                    _this.handleUpdated(contextData, {
                                        reset: data,
                                        added: {},
                                        removed: [],
                                        updated: {}
                                    }, {
                                        updaterId: gwResponse.peer_id
                                    });
                                })];
                    }
                });
            });
        };
        GW3Bridge.prototype.setPath = function (name, path, value) {
            if (!this.setPathSupported) {
                return Promise.reject("glue.contexts.setPath operation is not supported, use Glue42 3.10 or later");
            }
            return this.setPaths(name, [{ path: path, value: value }]);
        };
        GW3Bridge.prototype.setPaths = function (name, pathValues) {
            return __awaiter(this, void 0, void 0, function () {
                var contextData, obj, _i, pathValues_1, pathValue, commands, _a, pathValues_2, pathValue;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.setPathSupported) {
                                return [2, Promise.reject("glue.contexts.setPaths operation is not supported, use Glue42 3.10 or later")];
                            }
                            if (pathValues) {
                                pathValues = deepClone(pathValues);
                            }
                            if (!(name in this._creationPromises)) return [3, 2];
                            return [4, this._creationPromises[name]];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2:
                            contextData = this._contextNameToData[name];
                            if (!contextData || !contextData.isAnnounced) {
                                obj = {};
                                for (_i = 0, pathValues_1 = pathValues; _i < pathValues_1.length; _i++) {
                                    pathValue = pathValues_1[_i];
                                    setValueToPath(obj, pathValue.value, pathValue.path);
                                }
                                return [2, this.createContext(name, obj)];
                            }
                            commands = [];
                            for (_a = 0, pathValues_2 = pathValues; _a < pathValues_2.length; _a++) {
                                pathValue = pathValues_2[_a];
                                if (pathValue.value === null) {
                                    commands.push({ type: "remove", path: pathValue.path });
                                }
                                else {
                                    commands.push({ type: "set", path: pathValue.path, value: pathValue.value });
                                }
                            }
                            return [2, this._gw3Session
                                    .send({
                                    type: GW_MESSAGE_UPDATE_CONTEXT,
                                    domain: "global",
                                    context_id: contextData.contextId,
                                    delta: { commands: commands }
                                }, {}, { skipPeerId: false })
                                    .then(function (gwResponse) {
                                    _this.handleUpdated(contextData, {
                                        added: {},
                                        removed: [],
                                        updated: {},
                                        commands: commands
                                    }, {
                                        updaterId: gwResponse.peer_id
                                    });
                                })];
                    }
                });
            });
        };
        GW3Bridge.prototype.get = function (name) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var contextData, context;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(name in this._creationPromises)) return [3, 2];
                            return [4, this._creationPromises[name]];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2:
                            contextData = this._contextNameToData[name];
                            if (!contextData || !contextData.isAnnounced) {
                                return [2, Promise.resolve({})];
                            }
                            if (contextData && (!contextData.hasCallbacks() || !contextData.hasReceivedSnapshot)) {
                                return [2, new Promise(function (resolve) {
                                        _this.subscribe(name, function (data, _d, _r, un) {
                                            _this.unsubscribe(un);
                                            resolve(data);
                                        });
                                    })];
                            }
                            context = (_a = contextData === null || contextData === void 0 ? void 0 : contextData.context) !== null && _a !== void 0 ? _a : {};
                            return [2, Promise.resolve(deepClone(context))];
                    }
                });
            });
        };
        GW3Bridge.prototype.subscribe = function (name, callback, subscriptionKey) {
            return __awaiter(this, void 0, void 0, function () {
                var thisCallbackSubscriptionNumber, contextData, hadCallbacks, clone, clone, clone;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(name in this._creationPromises)) return [3, 2];
                            return [4, this._creationPromises[name]];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            thisCallbackSubscriptionNumber = typeof subscriptionKey === "undefined" ? this._nextCallbackSubscriptionNumber : subscriptionKey;
                            if (typeof subscriptionKey === "undefined") {
                                this._nextCallbackSubscriptionNumber += 1;
                            }
                            if (this._contextsSubscriptionsCache.every(function (subscription) { return subscription.subKey !== _this._nextCallbackSubscriptionNumber; })) {
                                this._contextsSubscriptionsCache.push({ contextName: name, subKey: thisCallbackSubscriptionNumber, callback: callback });
                            }
                            contextData = this._contextNameToData[name];
                            if (!contextData ||
                                !contextData.isAnnounced) {
                                contextData = contextData || new GW3ContextData(undefined, name, false, undefined);
                                this._contextNameToData[name] = contextData;
                                contextData.updateCallbacks[thisCallbackSubscriptionNumber] = callback;
                                return [2, Promise.resolve(thisCallbackSubscriptionNumber)];
                            }
                            hadCallbacks = contextData.hasCallbacks();
                            contextData.updateCallbacks[thisCallbackSubscriptionNumber] = callback;
                            if (!hadCallbacks) {
                                if (!contextData.joinedActivity) {
                                    if (contextData.context && contextData.sentExplicitSubscription) {
                                        if (contextData.hasReceivedSnapshot) {
                                            clone = deepClone(contextData.context);
                                            callback(clone, clone, [], thisCallbackSubscriptionNumber);
                                        }
                                        return [2, Promise.resolve(thisCallbackSubscriptionNumber)];
                                    }
                                    return [2, this.sendSubscribe(contextData)
                                            .then(function () { return thisCallbackSubscriptionNumber; })];
                                }
                                else {
                                    if (contextData.hasReceivedSnapshot) {
                                        clone = deepClone(contextData.context);
                                        callback(clone, clone, [], thisCallbackSubscriptionNumber);
                                    }
                                    return [2, Promise.resolve(thisCallbackSubscriptionNumber)];
                                }
                            }
                            else {
                                if (contextData.hasReceivedSnapshot) {
                                    clone = deepClone(contextData.context);
                                    callback(clone, clone, [], thisCallbackSubscriptionNumber);
                                }
                                return [2, Promise.resolve(thisCallbackSubscriptionNumber)];
                            }
                    }
                });
            });
        };
        GW3Bridge.prototype.unsubscribe = function (subscriptionKey) {
            this._contextsSubscriptionsCache = this._contextsSubscriptionsCache.filter(function (subscription) { return subscription.subKey !== subscriptionKey; });
            for (var _i = 0, _a = Object.keys(this._contextNameToData); _i < _a.length; _i++) {
                var name_1 = _a[_i];
                var contextData = this._contextNameToData[name_1];
                if (!contextData) {
                    return;
                }
                var hadCallbacks = contextData.hasCallbacks();
                delete contextData.updateCallbacks[subscriptionKey];
                if (contextData.isAnnounced &&
                    hadCallbacks &&
                    !contextData.hasCallbacks() &&
                    contextData.sentExplicitSubscription) {
                    this.sendUnsubscribe(contextData);
                }
                if (!contextData.isAnnounced &&
                    !contextData.hasCallbacks()) {
                    delete this._contextNameToData[name_1];
                }
            }
        };
        GW3Bridge.prototype.destroy = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                var contextData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(name in this._creationPromises)) return [3, 2];
                            return [4, this._creationPromises[name]];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            contextData = this._contextNameToData[name];
                            if (!contextData) {
                                return [2, Promise.reject("context with ".concat(name, " does not exist"))];
                            }
                            return [2, this._gw3Session
                                    .send({
                                    type: GW_MESSAGE_DESTROY_CONTEXT,
                                    domain: "global",
                                    context_id: contextData.contextId,
                                }).then(function (_) { return undefined; })];
                    }
                });
            });
        };
        GW3Bridge.prototype.handleUpdated = function (contextData, delta, extraData) {
            var oldContext = contextData.context;
            contextData.context = applyContextDelta(contextData.context, delta, this._logger);
            contextData.hasReceivedSnapshot = true;
            if (this._contextNameToData[contextData.name] === contextData &&
                !deepEqual(oldContext, contextData.context)) {
                this.invokeUpdateCallbacks(contextData, delta, extraData);
            }
        };
        GW3Bridge.prototype.subscribeToContextCreatedMessages = function () {
            var createdMessageTypes = [
                GW_MESSAGE_CONTEXT_ADDED,
                GW_MESSAGE_CONTEXT_CREATED,
                GW_MESSAGE_ACTIVITY_CREATED,
            ];
            for (var _i = 0, createdMessageTypes_1 = createdMessageTypes; _i < createdMessageTypes_1.length; _i++) {
                var createdMessageType = createdMessageTypes_1[_i];
                var sub = this._connection.on(createdMessageType, this.handleContextCreatedMessage.bind(this));
                this._gw3Subscriptions.push(sub);
            }
        };
        GW3Bridge.prototype.handleContextCreatedMessage = function (contextCreatedMsg) {
            var _this = this;
            var createdMessageType = contextCreatedMsg.type;
            if (createdMessageType === GW_MESSAGE_ACTIVITY_CREATED) {
                this._contextNameToId[contextCreatedMsg.activity_id] = contextCreatedMsg.context_id;
                this._contextIdToName[contextCreatedMsg.context_id] = contextCreatedMsg.activity_id;
            }
            else if (createdMessageType === GW_MESSAGE_CONTEXT_ADDED) {
                this._contextNameToId[contextCreatedMsg.name] = contextCreatedMsg.context_id;
                this._contextIdToName[contextCreatedMsg.context_id] = contextCreatedMsg.name;
            }
            else ;
            var name = this._contextIdToName[contextCreatedMsg.context_id];
            if (!name) {
                throw new Error("Received created event for context with unknown name: " + contextCreatedMsg.context_id);
            }
            if (!this._contextNameToId[name]) {
                throw new Error("Received created event for context with unknown id: " + contextCreatedMsg.context_id);
            }
            var contextData = this._contextNameToData[name];
            if (contextData) {
                if (contextData.isAnnounced) {
                    return;
                }
                else {
                    if (!contextData.hasCallbacks()) {
                        throw new Error("Assertion failure: contextData.hasCallbacks()");
                    }
                    contextData.isAnnounced = true;
                    contextData.contextId = contextCreatedMsg.context_id;
                    contextData.activityId = contextCreatedMsg.activity_id;
                    if (!contextData.sentExplicitSubscription) {
                        this.sendSubscribe(contextData);
                    }
                }
            }
            else {
                this._contextNameToData[name] = contextData =
                    new GW3ContextData(contextCreatedMsg.context_id, name, true, contextCreatedMsg.activity_id);
                if (this._trackAllContexts) {
                    this.subscribe(name, function () { }).then(function (subKey) { return _this._systemContextsSubKey = subKey; });
                }
            }
        };
        GW3Bridge.prototype.subscribeToContextUpdatedMessages = function () {
            var updatedMessageTypes = [
                GW_MESSAGE_CONTEXT_UPDATED,
                GW_MESSAGE_SUBSCRIBED_CONTEXT,
                GW_MESSAGE_JOINED_ACTIVITY,
            ];
            for (var _i = 0, updatedMessageTypes_1 = updatedMessageTypes; _i < updatedMessageTypes_1.length; _i++) {
                var updatedMessageType = updatedMessageTypes_1[_i];
                var sub = this._connection.on(updatedMessageType, this.handleContextUpdatedMessage.bind(this));
                this._gw3Subscriptions.push(sub);
            }
        };
        GW3Bridge.prototype.handleContextUpdatedMessage = function (contextUpdatedMsg) {
            var updatedMessageType = contextUpdatedMsg.type;
            var contextId = contextUpdatedMsg.context_id;
            var contextData = this._contextNameToData[this._contextIdToName[contextId]];
            var justSeen = !contextData || !contextData.isAnnounced;
            if (updatedMessageType === GW_MESSAGE_JOINED_ACTIVITY) {
                if (!contextData) {
                    contextData =
                        this._contextNameToData[contextUpdatedMsg.activity_id] ||
                            new GW3ContextData(contextId, contextUpdatedMsg.activity_id, true, contextUpdatedMsg.activity_id);
                }
                this._contextNameToData[contextUpdatedMsg.activity_id] = contextData;
                this._contextIdToName[contextId] = contextUpdatedMsg.activity_id;
                this._contextNameToId[contextUpdatedMsg.activity_id] = contextId;
                contextData.contextId = contextId;
                contextData.isAnnounced = true;
                contextData.activityId = contextUpdatedMsg.activity_id;
                contextData.joinedActivity = true;
            }
            else {
                if (!contextData || !contextData.isAnnounced) {
                    if (updatedMessageType === GW_MESSAGE_SUBSCRIBED_CONTEXT) {
                        contextData = contextData || new GW3ContextData(contextId, contextUpdatedMsg.name, true, undefined);
                        contextData.sentExplicitSubscription = true;
                        this._contextNameToData[contextUpdatedMsg.name] = contextData;
                        this._contextIdToName[contextId] = contextUpdatedMsg.name;
                        this._contextNameToId[contextUpdatedMsg.name] = contextId;
                    }
                    else {
                        this._logger.error("Received 'update' for unknown context: ".concat(contextId));
                    }
                    return;
                }
            }
            var oldContext = contextData.context;
            contextData.hasReceivedSnapshot = true;
            if (updatedMessageType === GW_MESSAGE_SUBSCRIBED_CONTEXT) {
                contextData.context = contextUpdatedMsg.data || {};
            }
            else if (updatedMessageType === GW_MESSAGE_JOINED_ACTIVITY) {
                contextData.context = contextUpdatedMsg.context_snapshot || {};
            }
            else if (updatedMessageType === GW_MESSAGE_CONTEXT_UPDATED) {
                contextData.context = applyContextDelta(contextData.context, contextUpdatedMsg.delta, this._logger);
            }
            else {
                throw new Error("Unrecognized context update message " + updatedMessageType);
            }
            if (justSeen ||
                !deepEqual(contextData.context, oldContext) ||
                updatedMessageType === GW_MESSAGE_SUBSCRIBED_CONTEXT) {
                this.invokeUpdateCallbacks(contextData, contextUpdatedMsg.delta, { updaterId: contextUpdatedMsg.updater_id });
            }
        };
        GW3Bridge.prototype.invokeUpdateCallbacks = function (contextData, delta, extraData) {
            delta = delta || { added: {}, updated: {}, reset: {}, removed: [] };
            if (delta.commands) {
                delta.added = delta.updated = delta.reset = {};
                delta.removed = [];
                for (var _i = 0, _a = delta.commands; _i < _a.length; _i++) {
                    var command = _a[_i];
                    if (command.type === "remove") {
                        if (command.path.indexOf(".") === -1) {
                            delta.removed.push(command.path);
                        }
                        setValueToPath(delta.updated, null, command.path);
                    }
                    else if (command.type === "set") {
                        setValueToPath(delta.updated, command.value, command.path);
                    }
                }
            }
            for (var updateCallbackIndex in contextData.updateCallbacks) {
                if (contextData.updateCallbacks.hasOwnProperty(updateCallbackIndex)) {
                    try {
                        var updateCallback = contextData.updateCallbacks[updateCallbackIndex];
                        updateCallback(deepClone(contextData.context), deepClone(Object.assign({}, delta.added || {}, delta.updated || {}, delta.reset || {})), delta.removed, parseInt(updateCallbackIndex, 10), extraData);
                    }
                    catch (err) {
                        this._logger.debug("callback error: " + JSON.stringify(err));
                    }
                }
            }
        };
        GW3Bridge.prototype.subscribeToContextDestroyedMessages = function () {
            var destroyedMessageTypes = [
                GW_MESSAGE_CONTEXT_DESTROYED,
                GW_MESSAGE_ACTIVITY_DESTROYED,
            ];
            for (var _i = 0, destroyedMessageTypes_1 = destroyedMessageTypes; _i < destroyedMessageTypes_1.length; _i++) {
                var destroyedMessageType = destroyedMessageTypes_1[_i];
                var sub = this._connection.on(destroyedMessageType, this.handleContextDestroyedMessage.bind(this));
                this._gw3Subscriptions.push(sub);
            }
        };
        GW3Bridge.prototype.handleContextDestroyedMessage = function (destroyedMsg) {
            var destroyedMessageType = destroyedMsg.type;
            var contextId;
            var name;
            if (destroyedMessageType === GW_MESSAGE_ACTIVITY_DESTROYED) {
                name = destroyedMsg.activity_id;
                contextId = this._contextNameToId[name];
                if (!contextId) {
                    this._logger.error("Received 'destroyed' for unknown activity: ".concat(destroyedMsg.activity_id));
                    return;
                }
            }
            else {
                contextId = destroyedMsg.context_id;
                name = this._contextIdToName[contextId];
                if (!name) {
                    this._logger.error("Received 'destroyed' for unknown context: ".concat(destroyedMsg.context_id));
                    return;
                }
            }
            delete this._contextIdToName[contextId];
            delete this._contextNameToId[name];
            var contextData = this._contextNameToData[name];
            delete this._contextNameToData[name];
            if (!contextData || !contextData.isAnnounced) {
                this._logger.error("Received 'destroyed' for unknown context: ".concat(contextId));
                return;
            }
        };
        GW3Bridge.prototype.sendSubscribe = function (contextData) {
            contextData.sentExplicitSubscription = true;
            return this._gw3Session
                .send({
                type: GW_MESSAGE_SUBSCRIBE_CONTEXT,
                domain: "global",
                context_id: contextData.contextId,
            }).then(function (_) { return undefined; });
        };
        GW3Bridge.prototype.sendUnsubscribe = function (contextData) {
            contextData.sentExplicitSubscription = false;
            return this._gw3Session
                .send({
                type: GW_MESSAGE_UNSUBSCRIBE_CONTEXT,
                domain: "global",
                context_id: contextData.contextId,
            }).then(function (_) { return undefined; });
        };
        GW3Bridge.prototype.calculateContextDeltaV1 = function (from, to) {
            var delta = { added: {}, updated: {}, removed: [], reset: undefined };
            if (from) {
                for (var _i = 0, _a = Object.keys(from); _i < _a.length; _i++) {
                    var x = _a[_i];
                    if (Object.keys(to).indexOf(x) !== -1
                        && to[x] !== null
                        && !deepEqual(from[x], to[x])) {
                        delta.updated[x] = to[x];
                    }
                }
            }
            for (var _b = 0, _c = Object.keys(to); _b < _c.length; _b++) {
                var x = _c[_b];
                if (!from || (Object.keys(from).indexOf(x) === -1)) {
                    if (to[x] !== null) {
                        delta.added[x] = to[x];
                    }
                }
                else if (to[x] === null) {
                    delta.removed.push(x);
                }
            }
            return delta;
        };
        GW3Bridge.prototype.calculateContextDeltaV2 = function (from, to) {
            var _a, _b;
            var delta = { added: {}, updated: {}, removed: [], reset: undefined, commands: [] };
            for (var _i = 0, _c = Object.keys(to); _i < _c.length; _i++) {
                var x = _c[_i];
                if (to[x] !== null) {
                    var fromX = from ? from[x] : null;
                    if (!deepEqual(fromX, to[x])) {
                        (_a = delta.commands) === null || _a === void 0 ? void 0 : _a.push({ type: "set", path: x, value: to[x] });
                    }
                }
                else {
                    (_b = delta.commands) === null || _b === void 0 ? void 0 : _b.push({ type: "remove", path: x });
                }
            }
            return delta;
        };
        GW3Bridge.prototype.resetState = function () {
            var _this = this;
            for (var _i = 0, _a = this._gw3Subscriptions; _i < _a.length; _i++) {
                var sub = _a[_i];
                this._connection.off(sub);
            }
            if (this._systemContextsSubKey) {
                this.unsubscribe(this._systemContextsSubKey);
                delete this._systemContextsSubKey;
            }
            this._gw3Subscriptions = [];
            this._contextNameToId = {};
            this._contextIdToName = {};
            delete this._protocolVersion;
            this._contextsTempCache = Object.keys(this._contextNameToData).reduce(function (cacheSoFar, ctxName) {
                cacheSoFar[ctxName] = _this._contextNameToData[ctxName].context;
                return cacheSoFar;
            }, {});
            this._contextNameToData = {};
        };
        GW3Bridge.prototype.reInitiateState = function () {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var _b, _c, _e, _i, ctxName, lastKnownData;
                var _this = this;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            this.subscribeToContextCreatedMessages();
                            this.subscribeToContextUpdatedMessages();
                            this.subscribeToContextDestroyedMessages();
                            (_a = this._connection.replayer) === null || _a === void 0 ? void 0 : _a.drain(ContextMessageReplaySpec.name, function (message) {
                                var type = message.type;
                                if (!type) {
                                    return;
                                }
                                if (type === GW_MESSAGE_CONTEXT_CREATED ||
                                    type === GW_MESSAGE_CONTEXT_ADDED ||
                                    type === GW_MESSAGE_ACTIVITY_CREATED) {
                                    _this.handleContextCreatedMessage(message);
                                }
                                else if (type === GW_MESSAGE_SUBSCRIBED_CONTEXT ||
                                    type === GW_MESSAGE_CONTEXT_UPDATED ||
                                    type === GW_MESSAGE_JOINED_ACTIVITY) {
                                    _this.handleContextUpdatedMessage(message);
                                }
                                else if (type === GW_MESSAGE_CONTEXT_DESTROYED ||
                                    type === GW_MESSAGE_ACTIVITY_DESTROYED) {
                                    _this.handleContextDestroyedMessage(message);
                                }
                            });
                            return [4, Promise.all(this._contextsSubscriptionsCache.map(function (subscription) { return _this.subscribe(subscription.contextName, subscription.callback, subscription.subKey); }))];
                        case 1:
                            _f.sent();
                            return [4, this.flushQueue()];
                        case 2:
                            _f.sent();
                            _b = this._contextsTempCache;
                            _c = [];
                            for (_e in _b)
                                _c.push(_e);
                            _i = 0;
                            _f.label = 3;
                        case 3:
                            if (!(_i < _c.length)) return [3, 7];
                            _e = _c[_i];
                            if (!(_e in _b)) return [3, 6];
                            ctxName = _e;
                            if (typeof this._contextsTempCache[ctxName] !== "object" || Object.keys(this._contextsTempCache[ctxName]).length === 0) {
                                return [3, 6];
                            }
                            lastKnownData = this._contextsTempCache[ctxName];
                            this._logger.info("Re-announcing known context: ".concat(ctxName));
                            return [4, this.flushQueue()];
                        case 4:
                            _f.sent();
                            return [4, this.update(ctxName, lastKnownData)];
                        case 5:
                            _f.sent();
                            _f.label = 6;
                        case 6:
                            _i++;
                            return [3, 3];
                        case 7:
                            this._contextsTempCache = {};
                            this._logger.info("Contexts are re-announced");
                            return [2];
                    }
                });
            });
        };
        GW3Bridge.prototype.flushQueue = function () {
            return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, 0); });
        };
        return GW3Bridge;
    }());

    var ContextsModule = (function () {
        function ContextsModule(config) {
            this._bridge = new GW3Bridge(config);
        }
        ContextsModule.prototype.all = function () {
            return this._bridge.all();
        };
        ContextsModule.prototype.update = function (name, data) {
            this.checkName(name);
            this.checkData(data);
            return this._bridge.update(name, data);
        };
        ContextsModule.prototype.set = function (name, data) {
            this.checkName(name);
            this.checkData(data);
            return this._bridge.set(name, data);
        };
        ContextsModule.prototype.setPath = function (name, path, data) {
            this.checkName(name);
            this.checkPath(path);
            var isTopLevelPath = path === "";
            if (isTopLevelPath) {
                this.checkData(data);
                return this.set(name, data);
            }
            return this._bridge.setPath(name, path, data);
        };
        ContextsModule.prototype.setPaths = function (name, paths) {
            this.checkName(name);
            if (!Array.isArray(paths)) {
                throw new Error("Please provide the paths as an array of PathValues!");
            }
            for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                var _a = paths_1[_i], path = _a.path, value = _a.value;
                this.checkPath(path);
                var isTopLevelPath = path === "";
                if (isTopLevelPath) {
                    this.checkData(value);
                }
            }
            return this._bridge.setPaths(name, paths);
        };
        ContextsModule.prototype.subscribe = function (name, callback) {
            var _this = this;
            this.checkName(name);
            if (typeof callback !== "function") {
                throw new Error("Please provide the callback as a function!");
            }
            return this._bridge
                .subscribe(name, function (data, delta, removed, key, extraData) { return callback(data, delta, removed, function () { return _this._bridge.unsubscribe(key); }, extraData); })
                .then(function (key) {
                return function () {
                    _this._bridge.unsubscribe(key);
                };
            });
        };
        ContextsModule.prototype.get = function (name) {
            this.checkName(name);
            return this._bridge.get(name);
        };
        ContextsModule.prototype.ready = function () {
            return Promise.resolve(this);
        };
        ContextsModule.prototype.destroy = function (name) {
            this.checkName(name);
            return this._bridge.destroy(name);
        };
        Object.defineProperty(ContextsModule.prototype, "setPathSupported", {
            get: function () {
                return this._bridge.setPathSupported;
            },
            enumerable: false,
            configurable: true
        });
        ContextsModule.prototype.checkName = function (name) {
            if (typeof name !== "string" || name === "") {
                throw new Error("Please provide the name as a non-empty string!");
            }
        };
        ContextsModule.prototype.checkPath = function (path) {
            if (typeof path !== "string") {
                throw new Error("Please provide the path as a dot delimited string!");
            }
        };
        ContextsModule.prototype.checkData = function (data) {
            if (typeof data !== "object") {
                throw new Error("Please provide the data as an object!");
            }
        };
        return ContextsModule;
    }());

    function promisify (promise, successCallback, errorCallback) {
        if (typeof successCallback !== "function" && typeof errorCallback !== "function") {
            return promise;
        }
        if (typeof successCallback !== "function") {
            successCallback = function () { };
        }
        else if (typeof errorCallback !== "function") {
            errorCallback = function () { };
        }
        return promise.then(successCallback, errorCallback);
    }

    function rejectAfter(ms, promise, error) {
        if (ms === void 0) { ms = 0; }
        var timeout;
        var clearTimeoutIfThere = function () {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
        promise
            .then(function () {
            clearTimeoutIfThere();
        })
            .catch(function () {
            clearTimeoutIfThere();
        });
        return new Promise(function (resolve, reject) {
            timeout = setTimeout(function () { return reject(error); }, ms);
        });
    }

    var InvokeStatus;
    (function (InvokeStatus) {
        InvokeStatus[InvokeStatus["Success"] = 0] = "Success";
        InvokeStatus[InvokeStatus["Error"] = 1] = "Error";
    })(InvokeStatus || (InvokeStatus = {}));
    var Client = (function () {
        function Client(protocol, repo, instance, configuration) {
            this.protocol = protocol;
            this.repo = repo;
            this.instance = instance;
            this.configuration = configuration;
        }
        Client.prototype.subscribe = function (method, options, successCallback, errorCallback, existingSub) {
            var _this = this;
            var callProtocolSubscribe = function (targetServers, stream, successProxy, errorProxy) {
                var _a;
                options.methodResponseTimeout = (_a = options.methodResponseTimeout) !== null && _a !== void 0 ? _a : options.waitTimeoutMs;
                _this.protocol.client.subscribe(stream, options, targetServers, successProxy, errorProxy, existingSub);
            };
            var promise = new Promise(function (resolve, reject) {
                var successProxy = function (sub) {
                    resolve(sub);
                };
                var errorProxy = function (err) {
                    reject(err);
                };
                if (!method) {
                    reject("Method definition is required. Please, provide either a unique string for a method name or a \u201CmethodDefinition\u201D object with a required \u201Cname\u201D property.");
                    return;
                }
                var methodDef;
                if (typeof method === "string") {
                    methodDef = { name: method };
                }
                else {
                    methodDef = method;
                }
                if (!methodDef.name) {
                    reject("Method definition is required. Please, provide either a unique string for a method name or a \u201CmethodDefinition\u201D object with a required \u201Cname\u201D property.");
                    return;
                }
                if (options === undefined) {
                    options = {};
                }
                var target = options.target;
                if (target === undefined) {
                    target = "best";
                }
                if (typeof target === "string" && target !== "all" && target !== "best") {
                    reject(new Error("\"".concat(target, "\" is not a valid target. Valid targets are \"all\", \"best\", or an instance.")));
                    return;
                }
                if (options.methodResponseTimeout === undefined) {
                    options.methodResponseTimeout = options.method_response_timeout;
                    if (options.methodResponseTimeout === undefined) {
                        options.methodResponseTimeout = _this.configuration.methodResponseTimeout;
                    }
                }
                if (options.waitTimeoutMs === undefined) {
                    options.waitTimeoutMs = options.wait_for_method_timeout;
                    if (options.waitTimeoutMs === undefined) {
                        options.waitTimeoutMs = _this.configuration.waitTimeoutMs;
                    }
                }
                var delayStep = 500;
                var delayTillNow = 0;
                var currentServers = _this.getServerMethodsByFilterAndTarget(methodDef, target);
                if (currentServers.length > 0) {
                    callProtocolSubscribe(currentServers, currentServers[0].methods[0], successProxy, errorProxy);
                }
                else {
                    var retry_1 = function () {
                        if (!target || !(options.waitTimeoutMs)) {
                            return;
                        }
                        delayTillNow += delayStep;
                        currentServers = _this.getServerMethodsByFilterAndTarget(methodDef, target);
                        if (currentServers.length > 0) {
                            var streamInfo = currentServers[0].methods[0];
                            callProtocolSubscribe(currentServers, streamInfo, successProxy, errorProxy);
                        }
                        else if (delayTillNow >= options.waitTimeoutMs) {
                            var def = typeof method === "string" ? { name: method } : method;
                            callProtocolSubscribe(currentServers, def, successProxy, errorProxy);
                        }
                        else {
                            setTimeout(retry_1, delayStep);
                        }
                    };
                    setTimeout(retry_1, delayStep);
                }
            });
            return promisify(promise, successCallback, errorCallback);
        };
        Client.prototype.servers = function (methodFilter) {
            var filterCopy = methodFilter === undefined
                ? undefined
                : __assign({}, methodFilter);
            return this.getServers(filterCopy).map(function (serverMethodMap) {
                return serverMethodMap.server.instance;
            });
        };
        Client.prototype.methods = function (methodFilter) {
            if (typeof methodFilter === "string") {
                methodFilter = { name: methodFilter };
            }
            else {
                methodFilter = __assign({}, methodFilter);
            }
            return this.getMethods(methodFilter);
        };
        Client.prototype.methodsForInstance = function (instance) {
            return this.getMethodsForInstance(instance);
        };
        Client.prototype.methodAdded = function (callback) {
            return this.repo.onMethodAdded(callback);
        };
        Client.prototype.methodRemoved = function (callback) {
            return this.repo.onMethodRemoved(callback);
        };
        Client.prototype.serverAdded = function (callback) {
            return this.repo.onServerAdded(callback);
        };
        Client.prototype.serverRemoved = function (callback) {
            return this.repo.onServerRemoved(function (server, reason) {
                callback(server, reason);
            });
        };
        Client.prototype.serverMethodAdded = function (callback) {
            return this.repo.onServerMethodAdded(function (server, method) {
                callback({ server: server, method: method });
            });
        };
        Client.prototype.serverMethodRemoved = function (callback) {
            return this.repo.onServerMethodRemoved(function (server, method) {
                callback({ server: server, method: method });
            });
        };
        Client.prototype.invoke = function (methodFilter, argumentObj, target, additionalOptions, success, error) {
            return __awaiter(this, void 0, void 0, function () {
                var getInvokePromise;
                var _this = this;
                return __generator(this, function (_a) {
                    getInvokePromise = function () { return __awaiter(_this, void 0, void 0, function () {
                        var methodDefinition, serversMethodMap, method, errorObj, timeout, additionalOptionsCopy, invokePromises, invocationMessages, results, allRejected;
                        var _this = this;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (typeof methodFilter === "string") {
                                        methodDefinition = { name: methodFilter };
                                    }
                                    else {
                                        methodDefinition = __assign({}, methodFilter);
                                    }
                                    if (!methodDefinition.name) {
                                        return [2, Promise.reject("Method definition is required. Please, provide either a unique string for a method name or a \u201CmethodDefinition\u201D object with a required \u201Cname\u201D property.")];
                                    }
                                    if (!argumentObj) {
                                        argumentObj = {};
                                    }
                                    if (!target) {
                                        target = "best";
                                    }
                                    if (typeof target === "string" && target !== "all" && target !== "best" && target !== "skipMine") {
                                        return [2, Promise.reject(new Error("\"".concat(target, "\" is not a valid target. Valid targets are \"all\" and \"best\".")))];
                                    }
                                    if (!additionalOptions) {
                                        additionalOptions = {};
                                    }
                                    if (additionalOptions.methodResponseTimeoutMs === undefined) {
                                        additionalOptions.methodResponseTimeoutMs = additionalOptions.method_response_timeout;
                                        if (additionalOptions.methodResponseTimeoutMs === undefined) {
                                            additionalOptions.methodResponseTimeoutMs = this.configuration.methodResponseTimeout;
                                        }
                                    }
                                    if (additionalOptions.waitTimeoutMs === undefined) {
                                        additionalOptions.waitTimeoutMs = additionalOptions.wait_for_method_timeout;
                                        if (additionalOptions.waitTimeoutMs === undefined) {
                                            additionalOptions.waitTimeoutMs = this.configuration.waitTimeoutMs;
                                        }
                                    }
                                    if (additionalOptions.waitTimeoutMs !== undefined && typeof additionalOptions.waitTimeoutMs !== "number") {
                                        return [2, Promise.reject(new Error("\"".concat(additionalOptions.waitTimeoutMs, "\" is not a valid number for \"waitTimeoutMs\" ")))];
                                    }
                                    if (typeof argumentObj !== "object") {
                                        return [2, Promise.reject(new Error("The method arguments must be an object. method: ".concat(methodDefinition.name)))];
                                    }
                                    serversMethodMap = this.getServerMethodsByFilterAndTarget(methodDefinition, target);
                                    if (!(serversMethodMap.length === 0)) return [3, 4];
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, 3, , 4]);
                                    return [4, this.tryToAwaitForMethods(methodDefinition, target, additionalOptions)];
                                case 2:
                                    serversMethodMap = _d.sent();
                                    return [3, 4];
                                case 3:
                                    _d.sent();
                                    method = __assign(__assign({}, methodDefinition), { getServers: function () { return []; }, supportsStreaming: false, objectTypes: (_a = methodDefinition.objectTypes) !== null && _a !== void 0 ? _a : [], flags: (_c = (_b = methodDefinition.flags) === null || _b === void 0 ? void 0 : _b.metadata) !== null && _c !== void 0 ? _c : {} });
                                    errorObj = {
                                        method: method,
                                        called_with: argumentObj,
                                        message: "Can not find a method matching ".concat(JSON.stringify(methodFilter), " with server filter ").concat(JSON.stringify(target)),
                                        executed_by: undefined,
                                        returned: undefined,
                                        status: undefined,
                                    };
                                    return [2, Promise.reject(errorObj)];
                                case 4:
                                    timeout = additionalOptions.methodResponseTimeoutMs;
                                    additionalOptionsCopy = additionalOptions;
                                    invokePromises = serversMethodMap.map(function (serversMethodPair) {
                                        var invId = shortid();
                                        var method = serversMethodPair.methods[0];
                                        var server = serversMethodPair.server;
                                        var invokePromise = _this.protocol.client.invoke(invId, method, argumentObj, server, additionalOptionsCopy);
                                        return Promise.race([
                                            invokePromise,
                                            rejectAfter(timeout, invokePromise, {
                                                invocationId: invId,
                                                message: "Invocation timeout (".concat(timeout, " ms) reached for method name: ").concat(method === null || method === void 0 ? void 0 : method.name, ", target instance: ").concat(JSON.stringify(server.instance), ", options: ").concat(JSON.stringify(additionalOptionsCopy)),
                                                status: InvokeStatus.Error,
                                            })
                                        ]);
                                    });
                                    return [4, Promise.all(invokePromises)];
                                case 5:
                                    invocationMessages = _d.sent();
                                    results = this.getInvocationResultObj(invocationMessages, methodDefinition, argumentObj);
                                    allRejected = invocationMessages.every(function (result) { return result.status === InvokeStatus.Error; });
                                    if (allRejected) {
                                        return [2, Promise.reject(results)];
                                    }
                                    return [2, results];
                            }
                        });
                    }); };
                    return [2, promisify(getInvokePromise(), success, error)];
                });
            });
        };
        Client.prototype.getInvocationResultObj = function (invocationResults, method, calledWith) {
            var all_return_values = invocationResults
                .filter(function (invokeMessage) { return invokeMessage.status === InvokeStatus.Success; })
                .reduce(function (allValues, currentValue) {
                allValues = __spreadArray(__spreadArray([], allValues, true), [
                    {
                        executed_by: currentValue.instance,
                        returned: currentValue.result,
                        called_with: calledWith,
                        method: method,
                        message: currentValue.message,
                        status: currentValue.status,
                    }
                ], false);
                return allValues;
            }, []);
            var all_errors = invocationResults
                .filter(function (invokeMessage) { return invokeMessage.status === InvokeStatus.Error; })
                .reduce(function (allErrors, currError) {
                allErrors = __spreadArray(__spreadArray([], allErrors, true), [
                    {
                        executed_by: currError.instance,
                        called_with: calledWith,
                        name: method.name,
                        message: currError.message,
                    }
                ], false);
                return allErrors;
            }, []);
            var invResult = invocationResults[0];
            var result = {
                method: method,
                called_with: calledWith,
                returned: invResult.result,
                executed_by: invResult.instance,
                all_return_values: all_return_values,
                all_errors: all_errors,
                message: invResult.message,
                status: invResult.status
            };
            return result;
        };
        Client.prototype.tryToAwaitForMethods = function (methodDefinition, target, additionalOptions) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (additionalOptions.waitTimeoutMs === 0) {
                    reject();
                    return;
                }
                var delayStep = 500;
                var delayTillNow = 0;
                var retry = function () {
                    delayTillNow += delayStep;
                    var serversMethodMap = _this.getServerMethodsByFilterAndTarget(methodDefinition, target);
                    if (serversMethodMap.length > 0) {
                        clearInterval(interval);
                        resolve(serversMethodMap);
                    }
                    else if (delayTillNow >= (additionalOptions.waitTimeoutMs || 10000)) {
                        clearInterval(interval);
                        reject();
                        return;
                    }
                };
                var interval = setInterval(retry, delayStep);
            });
        };
        Client.prototype.filterByTarget = function (target, serverMethodMap) {
            var _this = this;
            if (typeof target === "string") {
                if (target === "all") {
                    return __spreadArray([], serverMethodMap, true);
                }
                else if (target === "best") {
                    var localMachine = serverMethodMap
                        .find(function (s) { return s.server.instance.isLocal; });
                    if (localMachine) {
                        return [localMachine];
                    }
                    if (serverMethodMap[0] !== undefined) {
                        return [serverMethodMap[0]];
                    }
                }
                else if (target === "skipMine") {
                    return serverMethodMap.filter(function (_a) {
                        var server = _a.server;
                        return server.instance.peerId !== _this.instance.peerId;
                    });
                }
            }
            else {
                var targetArray = void 0;
                if (!Array.isArray(target)) {
                    targetArray = [target];
                }
                else {
                    targetArray = target;
                }
                var allServersMatching = targetArray.reduce(function (matches, filter) {
                    var myMatches = serverMethodMap.filter(function (serverMethodPair) {
                        return _this.instanceMatch(filter, serverMethodPair.server.instance);
                    });
                    return matches.concat(myMatches);
                }, []);
                return allServersMatching;
            }
            return [];
        };
        Client.prototype.instanceMatch = function (instanceFilter, instanceDefinition) {
            return this.containsProps(instanceFilter, instanceDefinition);
        };
        Client.prototype.methodMatch = function (methodFilter, methodDefinition) {
            return this.containsProps(methodFilter, methodDefinition);
        };
        Client.prototype.containsProps = function (filter, repoMethod) {
            var filterProps = Object.keys(filter)
                .filter(function (prop) {
                return filter[prop] !== undefined
                    && filter[prop] !== null
                    && typeof filter[prop] !== "function"
                    && prop !== "object_types"
                    && prop !== "display_name"
                    && prop !== "id"
                    && prop !== "gatewayId"
                    && prop !== "identifier"
                    && prop[0] !== "_";
            });
            return filterProps.every(function (prop) {
                var isMatch;
                var filterValue = filter[prop];
                var repoMethodValue = repoMethod[prop];
                switch (prop) {
                    case "objectTypes":
                        isMatch = (filterValue || []).every(function (filterValueEl) {
                            return (repoMethodValue || []).includes(filterValueEl);
                        });
                        break;
                    case "flags":
                        isMatch = isSubset(repoMethodValue || {}, filterValue || {});
                        break;
                    default:
                        isMatch = String(filterValue).toLowerCase() === String(repoMethodValue).toLowerCase();
                }
                return isMatch;
            });
        };
        Client.prototype.getMethods = function (methodFilter) {
            var _this = this;
            if (methodFilter === undefined) {
                return this.repo.getMethods();
            }
            var methods = this.repo.getMethods().filter(function (method) {
                return _this.methodMatch(methodFilter, method);
            });
            return methods;
        };
        Client.prototype.getMethodsForInstance = function (instanceFilter) {
            var _this = this;
            var allServers = this.repo.getServers();
            var matchingServers = allServers.filter(function (server) {
                return _this.instanceMatch(instanceFilter, server.instance);
            });
            if (matchingServers.length === 0) {
                return [];
            }
            var resultMethodsObject = {};
            if (matchingServers.length === 1) {
                resultMethodsObject = matchingServers[0].methods;
            }
            else {
                matchingServers.forEach(function (server) {
                    Object.keys(server.methods).forEach(function (methodKey) {
                        var method = server.methods[methodKey];
                        resultMethodsObject[method.identifier] = method;
                    });
                });
            }
            return Object.keys(resultMethodsObject)
                .map(function (key) {
                return resultMethodsObject[key];
            });
        };
        Client.prototype.getServers = function (methodFilter) {
            var _this = this;
            var servers = this.repo.getServers();
            if (methodFilter === undefined) {
                return servers.map(function (server) {
                    return { server: server, methods: [] };
                });
            }
            return servers.reduce(function (prev, current) {
                var methodsForServer = Object.values(current.methods);
                var matchingMethods = methodsForServer.filter(function (method) {
                    return _this.methodMatch(methodFilter, method);
                });
                if (matchingMethods.length > 0) {
                    prev.push({ server: current, methods: matchingMethods });
                }
                return prev;
            }, []);
        };
        Client.prototype.getServerMethodsByFilterAndTarget = function (methodFilter, target) {
            var serversMethodMap = this.getServers(methodFilter);
            return this.filterByTarget(target, serversMethodMap);
        };
        return Client;
    }());

    var ServerSubscription = (function () {
        function ServerSubscription(protocol, repoMethod, subscription) {
            this.protocol = protocol;
            this.repoMethod = repoMethod;
            this.subscription = subscription;
        }
        Object.defineProperty(ServerSubscription.prototype, "stream", {
            get: function () {
                if (!this.repoMethod.stream) {
                    throw new Error("no stream");
                }
                return this.repoMethod.stream;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ServerSubscription.prototype, "arguments", {
            get: function () { return this.subscription.arguments || {}; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ServerSubscription.prototype, "branchKey", {
            get: function () { return this.subscription.branchKey; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ServerSubscription.prototype, "instance", {
            get: function () {
                if (!this.subscription.instance) {
                    throw new Error("no instance");
                }
                return this.subscription.instance;
            },
            enumerable: false,
            configurable: true
        });
        ServerSubscription.prototype.close = function () {
            this.protocol.server.closeSingleSubscription(this.repoMethod, this.subscription);
        };
        ServerSubscription.prototype.push = function (data) {
            this.protocol.server.pushDataToSingle(this.repoMethod, this.subscription, data);
        };
        return ServerSubscription;
    }());

    var Request = (function () {
        function Request(protocol, repoMethod, requestContext) {
            this.protocol = protocol;
            this.repoMethod = repoMethod;
            this.requestContext = requestContext;
            this.arguments = requestContext.arguments;
            this.instance = requestContext.instance;
        }
        Request.prototype.accept = function () {
            this.protocol.server.acceptRequestOnBranch(this.requestContext, this.repoMethod, "");
        };
        Request.prototype.acceptOnBranch = function (branch) {
            this.protocol.server.acceptRequestOnBranch(this.requestContext, this.repoMethod, branch);
        };
        Request.prototype.reject = function (reason) {
            this.protocol.server.rejectRequest(this.requestContext, this.repoMethod, reason);
        };
        return Request;
    }());

    var ServerStreaming$1 = (function () {
        function ServerStreaming(protocol, server) {
            var _this = this;
            this.protocol = protocol;
            this.server = server;
            protocol.server.onSubRequest(function (rc, rm) { return _this.handleSubRequest(rc, rm); });
            protocol.server.onSubAdded(function (sub, rm) { return _this.handleSubAdded(sub, rm); });
            protocol.server.onSubRemoved(function (sub, rm) { return _this.handleSubRemoved(sub, rm); });
        }
        ServerStreaming.prototype.handleSubRequest = function (requestContext, repoMethod) {
            if (!(repoMethod &&
                repoMethod.streamCallbacks &&
                typeof repoMethod.streamCallbacks.subscriptionRequestHandler === "function")) {
                return;
            }
            var request = new Request(this.protocol, repoMethod, requestContext);
            repoMethod.streamCallbacks.subscriptionRequestHandler(request);
        };
        ServerStreaming.prototype.handleSubAdded = function (subscription, repoMethod) {
            if (!(repoMethod &&
                repoMethod.streamCallbacks &&
                typeof repoMethod.streamCallbacks.subscriptionAddedHandler === "function")) {
                return;
            }
            var sub = new ServerSubscription(this.protocol, repoMethod, subscription);
            repoMethod.streamCallbacks.subscriptionAddedHandler(sub);
        };
        ServerStreaming.prototype.handleSubRemoved = function (subscription, repoMethod) {
            if (!(repoMethod &&
                repoMethod.streamCallbacks &&
                typeof repoMethod.streamCallbacks.subscriptionRemovedHandler === "function")) {
                return;
            }
            var sub = new ServerSubscription(this.protocol, repoMethod, subscription);
            repoMethod.streamCallbacks.subscriptionRemovedHandler(sub);
        };
        return ServerStreaming;
    }());

    var ServerBranch = (function () {
        function ServerBranch(key, protocol, repoMethod) {
            this.key = key;
            this.protocol = protocol;
            this.repoMethod = repoMethod;
        }
        ServerBranch.prototype.subscriptions = function () {
            var _this = this;
            var subList = this.protocol.server.getSubscriptionList(this.repoMethod, this.key);
            return subList.map(function (sub) {
                return new ServerSubscription(_this.protocol, _this.repoMethod, sub);
            });
        };
        ServerBranch.prototype.close = function () {
            this.protocol.server.closeAllSubscriptions(this.repoMethod, this.key);
        };
        ServerBranch.prototype.push = function (data) {
            this.protocol.server.pushData(this.repoMethod, data, [this.key]);
        };
        return ServerBranch;
    }());

    var ServerStream = (function () {
        function ServerStream(_protocol, _repoMethod, _server) {
            this._protocol = _protocol;
            this._repoMethod = _repoMethod;
            this._server = _server;
            this.name = this._repoMethod.definition.name;
        }
        ServerStream.prototype.branches = function (key) {
            var _this = this;
            var bList = this._protocol.server.getBranchList(this._repoMethod);
            if (key) {
                if (bList.indexOf(key) > -1) {
                    return new ServerBranch(key, this._protocol, this._repoMethod);
                }
                return undefined;
            }
            else {
                return bList.map(function (branchKey) {
                    return new ServerBranch(branchKey, _this._protocol, _this._repoMethod);
                });
            }
        };
        ServerStream.prototype.branch = function (key) {
            return this.branches(key);
        };
        ServerStream.prototype.subscriptions = function () {
            var _this = this;
            var subList = this._protocol.server.getSubscriptionList(this._repoMethod);
            return subList.map(function (sub) {
                return new ServerSubscription(_this._protocol, _this._repoMethod, sub);
            });
        };
        Object.defineProperty(ServerStream.prototype, "definition", {
            get: function () {
                var _a;
                var def2 = this._repoMethod.definition;
                return {
                    accepts: def2.accepts,
                    description: def2.description,
                    displayName: def2.displayName,
                    name: def2.name,
                    objectTypes: def2.objectTypes,
                    returns: def2.returns,
                    supportsStreaming: def2.supportsStreaming,
                    flags: (_a = def2.flags) === null || _a === void 0 ? void 0 : _a.metadata,
                };
            },
            enumerable: false,
            configurable: true
        });
        ServerStream.prototype.close = function () {
            this._protocol.server.closeAllSubscriptions(this._repoMethod);
            this._server.unregister(this._repoMethod.definition, true);
        };
        ServerStream.prototype.push = function (data, branches) {
            if (typeof branches !== "string" && !Array.isArray(branches) && branches !== undefined) {
                throw new Error("invalid branches should be string or string array");
            }
            if (typeof data !== "object") {
                throw new Error("Invalid arguments. Data must be an object.");
            }
            this._protocol.server.pushData(this._repoMethod, data, branches);
        };
        ServerStream.prototype.updateRepoMethod = function (repoMethod) {
            this._repoMethod = repoMethod;
        };
        return ServerStream;
    }());

    var Server = (function () {
        function Server(protocol, serverRepository) {
            this.protocol = protocol;
            this.serverRepository = serverRepository;
            this.invocations = 0;
            this.currentlyUnregistering = {};
            this.streaming = new ServerStreaming$1(protocol, this);
            this.protocol.server.onInvoked(this.onMethodInvoked.bind(this));
        }
        Server.prototype.createStream = function (streamDef, callbacks, successCallback, errorCallback, existingStream) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
                if (!streamDef) {
                    reject("The stream name must be unique! Please, provide either a unique string for a stream name to “glue.interop.createStream()” or a “methodDefinition” object with a unique “name” property for the stream.");
                    return;
                }
                var streamMethodDefinition;
                if (typeof streamDef === "string") {
                    streamMethodDefinition = { name: "" + streamDef };
                }
                else {
                    streamMethodDefinition = __assign({}, streamDef);
                }
                if (!streamMethodDefinition.name) {
                    return reject("The \u201Cname\u201D property is required for the \u201CstreamDefinition\u201D object and must be unique. Stream definition: ".concat(JSON.stringify(streamMethodDefinition)));
                }
                var nameAlreadyExists = _this.serverRepository.getList()
                    .some(function (serverMethod) { return serverMethod.definition.name === streamMethodDefinition.name; });
                if (nameAlreadyExists) {
                    return reject("A stream with the name \"".concat(streamMethodDefinition.name, "\" already exists! Please, provide a unique name for the stream."));
                }
                streamMethodDefinition.supportsStreaming = true;
                if (!callbacks) {
                    callbacks = {};
                }
                if (typeof callbacks.subscriptionRequestHandler !== "function") {
                    callbacks.subscriptionRequestHandler = function (request) {
                        request.accept();
                    };
                }
                var repoMethod = _this.serverRepository.add({
                    definition: streamMethodDefinition,
                    streamCallbacks: callbacks,
                    protocolState: {},
                });
                _this.protocol.server.createStream(repoMethod)
                    .then(function () {
                    var streamUserObject;
                    if (existingStream) {
                        streamUserObject = existingStream;
                        existingStream.updateRepoMethod(repoMethod);
                    }
                    else {
                        streamUserObject = new ServerStream(_this.protocol, repoMethod, _this);
                    }
                    repoMethod.stream = streamUserObject;
                    resolve(streamUserObject);
                })
                    .catch(function (err) {
                    if (repoMethod.repoId) {
                        _this.serverRepository.remove(repoMethod.repoId);
                    }
                    reject(err);
                });
            });
            return promisify(promise, successCallback, errorCallback);
        };
        Server.prototype.register = function (methodDefinition, callback) {
            var _this = this;
            if (!methodDefinition) {
                return Promise.reject("Method definition is required. Please, provide either a unique string for a method name or a “methodDefinition” object with a required “name” property.");
            }
            if (typeof callback !== "function") {
                return Promise.reject("The second parameter must be a callback function. Method: ".concat(typeof methodDefinition === "string" ? methodDefinition : methodDefinition.name));
            }
            var wrappedCallbackFunction = function (context, resultCallback) { return __awaiter(_this, void 0, void 0, function () {
                var result, resultValue, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            result = callback(context.args, context.instance);
                            if (!(result && typeof result.then === "function")) return [3, 2];
                            return [4, result];
                        case 1:
                            resultValue = _a.sent();
                            resultCallback(undefined, resultValue);
                            return [3, 3];
                        case 2:
                            resultCallback(undefined, result);
                            _a.label = 3;
                        case 3: return [3, 5];
                        case 4:
                            e_1 = _a.sent();
                            resultCallback(e_1 !== null && e_1 !== void 0 ? e_1 : "", e_1 !== null && e_1 !== void 0 ? e_1 : "");
                            return [3, 5];
                        case 5: return [2];
                    }
                });
            }); };
            wrappedCallbackFunction.userCallback = callback;
            return this.registerCore(methodDefinition, wrappedCallbackFunction);
        };
        Server.prototype.registerAsync = function (methodDefinition, callback) {
            var _this = this;
            if (!methodDefinition) {
                return Promise.reject("Method definition is required. Please, provide either a unique string for a method name or a “methodDefinition” object with a required “name” property.");
            }
            if (typeof callback !== "function") {
                return Promise.reject("The second parameter must be a callback function. Method: ".concat(typeof methodDefinition === "string" ? methodDefinition : methodDefinition.name));
            }
            var wrappedCallback = function (context, resultCallback) { return __awaiter(_this, void 0, void 0, function () {
                var resultCalled_1, success, error, methodResult;
                return __generator(this, function (_a) {
                    try {
                        resultCalled_1 = false;
                        success = function (result) {
                            if (!resultCalled_1) {
                                resultCallback(undefined, result);
                            }
                            resultCalled_1 = true;
                        };
                        error = function (e) {
                            if (!resultCalled_1) {
                                if (!e) {
                                    e = "";
                                }
                                resultCallback(e, e);
                            }
                            resultCalled_1 = true;
                        };
                        methodResult = callback(context.args, context.instance, success, error);
                        if (methodResult && typeof methodResult.then === "function") {
                            methodResult
                                .then(success)
                                .catch(error);
                        }
                    }
                    catch (e) {
                        resultCallback(e, undefined);
                    }
                    return [2];
                });
            }); };
            wrappedCallback.userCallbackAsync = callback;
            return this.registerCore(methodDefinition, wrappedCallback);
        };
        Server.prototype.unregister = function (methodFilter, forStream) {
            if (forStream === void 0) { forStream = false; }
            return __awaiter(this, void 0, void 0, function () {
                var methodDefinition, methodToBeRemoved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (methodFilter === undefined) {
                                return [2, Promise.reject("Please, provide either a unique string for a name or an object containing a “name” property.")];
                            }
                            if (!(typeof methodFilter === "function")) return [3, 2];
                            return [4, this.unregisterWithPredicate(methodFilter, forStream)];
                        case 1:
                            _a.sent();
                            return [2];
                        case 2:
                            if (typeof methodFilter === "string") {
                                methodDefinition = { name: methodFilter };
                            }
                            else {
                                methodDefinition = methodFilter;
                            }
                            if (methodDefinition.name === undefined) {
                                return [2, Promise.reject("Method name is required. Cannot find a method if the method name is undefined!")];
                            }
                            methodToBeRemoved = this.serverRepository.getList().find(function (serverMethod) {
                                return serverMethod.definition.name === methodDefinition.name
                                    && (serverMethod.definition.supportsStreaming || false) === forStream;
                            });
                            if (!methodToBeRemoved) {
                                return [2, Promise.reject("Method with a name \"".concat(methodDefinition.name, "\" does not exist or is not registered by your application!"))];
                            }
                            return [4, this.removeMethodsOrStreams([methodToBeRemoved])];
                        case 3:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        Server.prototype.unregisterWithPredicate = function (filterPredicate, forStream) {
            return __awaiter(this, void 0, void 0, function () {
                var methodsOrStreamsToRemove;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            methodsOrStreamsToRemove = this.serverRepository.getList()
                                .filter(function (sm) { return filterPredicate(sm.definition); })
                                .filter(function (serverMethod) {
                                return (serverMethod.definition.supportsStreaming || false) === forStream;
                            });
                            if (!methodsOrStreamsToRemove || methodsOrStreamsToRemove.length === 0) {
                                return [2, Promise.reject("Could not find a ".concat(forStream ? "stream" : "method", " matching the specified condition!"))];
                            }
                            return [4, this.removeMethodsOrStreams(methodsOrStreamsToRemove)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        Server.prototype.removeMethodsOrStreams = function (methodsToRemove) {
            var _this = this;
            var methodUnregPromises = [];
            methodsToRemove.forEach(function (method) {
                var promise = _this.protocol.server.unregister(method)
                    .then(function () {
                    if (method.repoId) {
                        _this.serverRepository.remove(method.repoId);
                    }
                });
                methodUnregPromises.push(promise);
                _this.addAsCurrentlyUnregistering(method.definition.name, promise);
            });
            return Promise.all(methodUnregPromises);
        };
        Server.prototype.addAsCurrentlyUnregistering = function (methodName, promise) {
            return __awaiter(this, void 0, void 0, function () {
                var timeout;
                var _this = this;
                return __generator(this, function (_a) {
                    timeout = new Promise(function (resolve) { return setTimeout(resolve, 5000); });
                    this.currentlyUnregistering[methodName] = Promise.race([promise, timeout]).then(function () {
                        delete _this.currentlyUnregistering[methodName];
                    });
                    return [2];
                });
            });
        };
        Server.prototype.registerCore = function (method, theFunction) {
            return __awaiter(this, void 0, void 0, function () {
                var methodDefinition, unregisterInProgress, nameAlreadyExists, repoMethod;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof method === "string") {
                                methodDefinition = { name: "" + method };
                            }
                            else {
                                methodDefinition = __assign({}, method);
                            }
                            if (!methodDefinition.name) {
                                return [2, Promise.reject("Please, provide a (unique) string value for the \u201Cname\u201D property in the \u201CmethodDefinition\u201D object: ".concat(JSON.stringify(method)))];
                            }
                            unregisterInProgress = this.currentlyUnregistering[methodDefinition.name];
                            if (!(typeof unregisterInProgress !== "undefined")) return [3, 2];
                            return [4, unregisterInProgress];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            nameAlreadyExists = this.serverRepository.getList()
                                .some(function (serverMethod) { return serverMethod.definition.name === methodDefinition.name; });
                            if (nameAlreadyExists) {
                                return [2, Promise.reject("A method with the name \"".concat(methodDefinition.name, "\" already exists! Please, provide a unique name for the method."))];
                            }
                            if (methodDefinition.supportsStreaming) {
                                return [2, Promise.reject("When you create methods with \u201Cglue.interop.register()\u201D or \u201Cglue.interop.registerAsync()\u201D the property \u201CsupportsStreaming\u201D cannot be \u201Ctrue\u201D. If you want \u201C".concat(methodDefinition.name, "\u201D to be a stream, please use the \u201Cglue.interop.createStream()\u201D method."))];
                            }
                            repoMethod = this.serverRepository.add({
                                definition: methodDefinition,
                                theFunction: theFunction,
                                protocolState: {},
                            });
                            return [2, this.protocol.server.register(repoMethod)
                                    .catch(function (err) {
                                    if (repoMethod === null || repoMethod === void 0 ? void 0 : repoMethod.repoId) {
                                        _this.serverRepository.remove(repoMethod.repoId);
                                    }
                                    throw err;
                                })];
                    }
                });
            });
        };
        Server.prototype.onMethodInvoked = function (methodToExecute, invocationId, invocationArgs) {
            var _this = this;
            if (!methodToExecute || !methodToExecute.theFunction) {
                return;
            }
            methodToExecute.theFunction(invocationArgs, function (err, result) {
                if (err !== undefined && err !== null) {
                    if (err.message && typeof err.message === "string") {
                        err = err.message;
                    }
                    else if (typeof err !== "string") {
                        try {
                            err = JSON.stringify(err);
                        }
                        catch (unStrException) {
                            err = "un-stringifyable error in onMethodInvoked! Top level prop names: ".concat(Object.keys(err));
                        }
                    }
                }
                if (!result) {
                    result = {};
                }
                else if (typeof result !== "object" || Array.isArray(result)) {
                    result = { _value: result };
                }
                _this.protocol.server.methodInvocationResult(methodToExecute, invocationId, err, result);
            });
        };
        return Server;
    }());

    var InstanceWrapper = (function () {
        function InstanceWrapper(API, instance, connection) {
            var _this = this;
            this.wrapped = {};
            this.wrapped.getMethods = function () {
                return API.methodsForInstance(this);
            };
            this.wrapped.getStreams = function () {
                return API.methodsForInstance(this).filter(function (m) { return m.supportsStreaming; });
            };
            if (instance) {
                this.refreshWrappedObject(instance);
            }
            if (connection) {
                connection.loggedIn(function () {
                    _this.refresh(connection);
                });
                this.refresh(connection);
            }
        }
        InstanceWrapper.prototype.unwrap = function () {
            return this.wrapped;
        };
        InstanceWrapper.prototype.refresh = function (connection) {
            if (!connection) {
                return;
            }
            var resolvedIdentity = connection === null || connection === void 0 ? void 0 : connection.resolvedIdentity;
            var instance = Object.assign({}, resolvedIdentity !== null && resolvedIdentity !== void 0 ? resolvedIdentity : {}, { peerId: connection === null || connection === void 0 ? void 0 : connection.peerId });
            this.refreshWrappedObject(instance);
        };
        InstanceWrapper.prototype.refreshWrappedObject = function (resolvedIdentity) {
            var _this = this;
            var _a, _b, _c, _d;
            Object.keys(resolvedIdentity).forEach(function (key) {
                _this.wrapped[key] = resolvedIdentity[key];
            });
            this.wrapped.user = resolvedIdentity.user;
            this.wrapped.instance = resolvedIdentity.instance;
            this.wrapped.application = (_a = resolvedIdentity.application) !== null && _a !== void 0 ? _a : shortid();
            this.wrapped.applicationName = resolvedIdentity.applicationName;
            this.wrapped.pid = (_c = (_b = resolvedIdentity.pid) !== null && _b !== void 0 ? _b : resolvedIdentity.process) !== null && _c !== void 0 ? _c : Math.floor(Math.random() * 10000000000);
            this.wrapped.machine = resolvedIdentity.machine;
            this.wrapped.environment = resolvedIdentity.environment;
            this.wrapped.region = resolvedIdentity.region;
            this.wrapped.windowId = resolvedIdentity.windowId;
            this.wrapped.isLocal = (_d = resolvedIdentity.isLocal) !== null && _d !== void 0 ? _d : true;
            this.wrapped.api = resolvedIdentity.api;
            this.wrapped.service = resolvedIdentity.service;
            this.wrapped.peerId = resolvedIdentity.peerId;
        };
        return InstanceWrapper;
    }());

    var hideMethodSystemFlags = function (method) {
        return __assign(__assign({}, method), { flags: method.flags.metadata || {} });
    };
    var ClientRepository = (function () {
        function ClientRepository(logger, API) {
            this.logger = logger;
            this.API = API;
            this.servers = {};
            this.methodsCount = {};
            this.callbacks = lib$1();
            var peerId = this.API.instance.peerId;
            this.myServer = {
                id: peerId,
                methods: {},
                instance: this.API.instance,
                wrapper: this.API.unwrappedInstance,
            };
            this.servers[peerId] = this.myServer;
        }
        ClientRepository.prototype.addServer = function (info, serverId) {
            this.logger.debug("adding server ".concat(serverId));
            var current = this.servers[serverId];
            if (current) {
                return current.id;
            }
            var wrapper = new InstanceWrapper(this.API, info);
            var serverEntry = {
                id: serverId,
                methods: {},
                instance: wrapper.unwrap(),
                wrapper: wrapper,
            };
            this.servers[serverId] = serverEntry;
            this.callbacks.execute("onServerAdded", serverEntry.instance);
            return serverId;
        };
        ClientRepository.prototype.removeServerById = function (id, reason) {
            var _this = this;
            var server = this.servers[id];
            if (!server) {
                this.logger.warn("not aware of server ".concat(id, ", my state ").concat(JSON.stringify(Object.keys(this.servers))));
                return;
            }
            else {
                this.logger.debug("removing server ".concat(id));
            }
            Object.keys(server.methods).forEach(function (methodId) {
                _this.removeServerMethod(id, methodId);
            });
            delete this.servers[id];
            this.callbacks.execute("onServerRemoved", server.instance, reason);
        };
        ClientRepository.prototype.addServerMethod = function (serverId, method) {
            var _a;
            var server = this.servers[serverId];
            if (!server) {
                throw new Error("server does not exists");
            }
            if (server.methods[method.id]) {
                return;
            }
            var identifier = this.createMethodIdentifier(method);
            var that = this;
            var methodDefinition = {
                identifier: identifier,
                gatewayId: method.id,
                name: method.name,
                displayName: method.display_name,
                description: method.description,
                version: method.version,
                objectTypes: method.object_types || [],
                accepts: method.input_signature,
                returns: method.result_signature,
                supportsStreaming: typeof method.flags !== "undefined" ? method.flags.streaming : false,
                flags: (_a = method.flags) !== null && _a !== void 0 ? _a : {},
                getServers: function () {
                    return that.getServersByMethod(identifier);
                }
            };
            methodDefinition.object_types = methodDefinition.objectTypes;
            methodDefinition.display_name = methodDefinition.displayName;
            methodDefinition.version = methodDefinition.version;
            server.methods[method.id] = methodDefinition;
            var clientMethodDefinition = hideMethodSystemFlags(methodDefinition);
            if (!this.methodsCount[identifier]) {
                this.methodsCount[identifier] = 0;
                this.callbacks.execute("onMethodAdded", clientMethodDefinition);
            }
            this.methodsCount[identifier] = this.methodsCount[identifier] + 1;
            this.callbacks.execute("onServerMethodAdded", server.instance, clientMethodDefinition);
            return methodDefinition;
        };
        ClientRepository.prototype.removeServerMethod = function (serverId, methodId) {
            var server = this.servers[serverId];
            if (!server) {
                throw new Error("server does not exists");
            }
            var method = server.methods[methodId];
            delete server.methods[methodId];
            var clientMethodDefinition = hideMethodSystemFlags(method);
            this.methodsCount[method.identifier] = this.methodsCount[method.identifier] - 1;
            if (this.methodsCount[method.identifier] === 0) {
                this.callbacks.execute("onMethodRemoved", clientMethodDefinition);
            }
            this.callbacks.execute("onServerMethodRemoved", server.instance, clientMethodDefinition);
        };
        ClientRepository.prototype.getMethods = function () {
            return this.extractMethodsFromServers(Object.values(this.servers)).map(hideMethodSystemFlags);
        };
        ClientRepository.prototype.getServers = function () {
            return Object.values(this.servers).map(this.hideServerMethodSystemFlags);
        };
        ClientRepository.prototype.onServerAdded = function (callback) {
            var unsubscribeFunc = this.callbacks.add("onServerAdded", callback);
            var serversWithMethodsToReplay = this.getServers().map(function (s) { return s.instance; });
            return this.returnUnsubWithDelayedReplay(unsubscribeFunc, serversWithMethodsToReplay, callback);
        };
        ClientRepository.prototype.onMethodAdded = function (callback) {
            var unsubscribeFunc = this.callbacks.add("onMethodAdded", callback);
            var methodsToReplay = this.getMethods();
            return this.returnUnsubWithDelayedReplay(unsubscribeFunc, methodsToReplay, callback);
        };
        ClientRepository.prototype.onServerMethodAdded = function (callback) {
            var unsubscribeFunc = this.callbacks.add("onServerMethodAdded", callback);
            var unsubCalled = false;
            var servers = this.getServers();
            setTimeout(function () {
                servers.forEach(function (server) {
                    var methods = server.methods;
                    Object.keys(methods).forEach(function (methodId) {
                        if (!unsubCalled) {
                            callback(server.instance, methods[methodId]);
                        }
                    });
                });
            }, 0);
            return function () {
                unsubCalled = true;
                unsubscribeFunc();
            };
        };
        ClientRepository.prototype.onMethodRemoved = function (callback) {
            var unsubscribeFunc = this.callbacks.add("onMethodRemoved", callback);
            return unsubscribeFunc;
        };
        ClientRepository.prototype.onServerRemoved = function (callback) {
            var unsubscribeFunc = this.callbacks.add("onServerRemoved", callback);
            return unsubscribeFunc;
        };
        ClientRepository.prototype.onServerMethodRemoved = function (callback) {
            var unsubscribeFunc = this.callbacks.add("onServerMethodRemoved", callback);
            return unsubscribeFunc;
        };
        ClientRepository.prototype.getServerById = function (id) {
            return this.hideServerMethodSystemFlags(this.servers[id]);
        };
        ClientRepository.prototype.reset = function () {
            var _a;
            var _this = this;
            Object.keys(this.servers).forEach(function (key) {
                _this.removeServerById(key, "reset");
            });
            this.servers = (_a = {},
                _a[this.myServer.id] = this.myServer,
                _a);
            this.methodsCount = {};
        };
        ClientRepository.prototype.createMethodIdentifier = function (methodInfo) {
            var _a, _b;
            var accepts = (_a = methodInfo.input_signature) !== null && _a !== void 0 ? _a : "";
            var returns = (_b = methodInfo.result_signature) !== null && _b !== void 0 ? _b : "";
            return (methodInfo.name + accepts + returns).toLowerCase();
        };
        ClientRepository.prototype.getServersByMethod = function (identifier) {
            var allServers = [];
            Object.values(this.servers).forEach(function (server) {
                Object.values(server.methods).forEach(function (method) {
                    if (method.identifier === identifier) {
                        allServers.push(server.instance);
                    }
                });
            });
            return allServers;
        };
        ClientRepository.prototype.returnUnsubWithDelayedReplay = function (unsubscribeFunc, collectionToReplay, callback) {
            var unsubCalled = false;
            setTimeout(function () {
                collectionToReplay.forEach(function (item) {
                    if (!unsubCalled) {
                        callback(item);
                    }
                });
            }, 0);
            return function () {
                unsubCalled = true;
                unsubscribeFunc();
            };
        };
        ClientRepository.prototype.hideServerMethodSystemFlags = function (server) {
            var clientMethods = {};
            Object.entries(server.methods).forEach(function (_a) {
                var name = _a[0], method = _a[1];
                clientMethods[name] = hideMethodSystemFlags(method);
            });
            return __assign(__assign({}, server), { methods: clientMethods });
        };
        ClientRepository.prototype.extractMethodsFromServers = function (servers) {
            var methods = Object.values(servers).reduce(function (clientMethods, server) {
                return __spreadArray(__spreadArray([], clientMethods, true), Object.values(server.methods), true);
            }, []);
            return methods;
        };
        return ClientRepository;
    }());

    var ServerRepository = (function () {
        function ServerRepository() {
            this.nextId = 0;
            this.methods = [];
        }
        ServerRepository.prototype.add = function (method) {
            method.repoId = String(this.nextId);
            this.nextId += 1;
            this.methods.push(method);
            return method;
        };
        ServerRepository.prototype.remove = function (repoId) {
            if (typeof repoId !== "string") {
                return new TypeError("Expecting a string");
            }
            this.methods = this.methods.filter(function (m) {
                return m.repoId !== repoId;
            });
        };
        ServerRepository.prototype.getById = function (id) {
            if (typeof id !== "string") {
                return undefined;
            }
            return this.methods.find(function (m) {
                return m.repoId === id;
            });
        };
        ServerRepository.prototype.getList = function () {
            return this.methods.map(function (m) { return m; });
        };
        ServerRepository.prototype.length = function () {
            return this.methods.length;
        };
        ServerRepository.prototype.reset = function () {
            this.methods = [];
        };
        return ServerRepository;
    }());

    var SUBSCRIPTION_REQUEST = "onSubscriptionRequest";
    var SUBSCRIPTION_ADDED = "onSubscriptionAdded";
    var SUBSCRIPTION_REMOVED = "onSubscriptionRemoved";
    var ServerStreaming = (function () {
        function ServerStreaming(session, repository, serverRepository) {
            var _this = this;
            this.session = session;
            this.repository = repository;
            this.serverRepository = serverRepository;
            this.ERR_URI_SUBSCRIPTION_FAILED = "com.tick42.agm.errors.subscription.failure";
            this.callbacks = lib$1();
            this.nextStreamId = 0;
            session.on("add-interest", function (msg) {
                _this.handleAddInterest(msg);
            });
            session.on("remove-interest", function (msg) {
                _this.handleRemoveInterest(msg);
            });
        }
        ServerStreaming.prototype.acceptRequestOnBranch = function (requestContext, streamingMethod, branch) {
            if (typeof branch !== "string") {
                branch = "";
            }
            if (typeof streamingMethod.protocolState.subscriptionsMap !== "object") {
                throw new TypeError("The streaming method is missing its subscriptions.");
            }
            if (!Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
                throw new TypeError("The streaming method is missing its branches.");
            }
            var streamId = this.getStreamId(streamingMethod, branch);
            var key = requestContext.msg.subscription_id;
            var subscription = {
                id: key,
                arguments: requestContext.arguments,
                instance: requestContext.instance,
                branchKey: branch,
                streamId: streamId,
                subscribeMsg: requestContext.msg,
            };
            streamingMethod.protocolState.subscriptionsMap[key] = subscription;
            this.session.sendFireAndForget({
                type: "accepted",
                subscription_id: key,
                stream_id: streamId,
            });
            this.callbacks.execute(SUBSCRIPTION_ADDED, subscription, streamingMethod);
        };
        ServerStreaming.prototype.rejectRequest = function (requestContext, streamingMethod, reason) {
            if (typeof reason !== "string") {
                reason = "";
            }
            this.sendSubscriptionFailed("Subscription rejected by user. " + reason, requestContext.msg.subscription_id);
        };
        ServerStreaming.prototype.pushData = function (streamingMethod, data, branches) {
            var _this = this;
            if (typeof streamingMethod !== "object" || !Array.isArray(streamingMethod.protocolState.branchKeyToStreamIdMap)) {
                return;
            }
            if (typeof data !== "object") {
                throw new Error("Invalid arguments. Data must be an object.");
            }
            if (typeof branches === "string") {
                branches = [branches];
            }
            else if (!Array.isArray(branches) || branches.length <= 0) {
                branches = [];
            }
            var streamIdList = streamingMethod.protocolState.branchKeyToStreamIdMap
                .filter(function (br) {
                if (!branches || branches.length === 0) {
                    return true;
                }
                return branches.indexOf(br.key) >= 0;
            }).map(function (br) {
                return br.streamId;
            });
            streamIdList.forEach(function (streamId) {
                var publishMessage = {
                    type: "publish",
                    stream_id: streamId,
                    data: data,
                };
                _this.session.sendFireAndForget(publishMessage);
            });
        };
        ServerStreaming.prototype.pushDataToSingle = function (method, subscription, data) {
            if (typeof data !== "object") {
                throw new Error("Invalid arguments. Data must be an object.");
            }
            var postMessage = {
                type: "post",
                subscription_id: subscription.id,
                data: data,
            };
            this.session.sendFireAndForget(postMessage);
        };
        ServerStreaming.prototype.closeSingleSubscription = function (streamingMethod, subscription) {
            if (streamingMethod.protocolState.subscriptionsMap) {
                delete streamingMethod.protocolState.subscriptionsMap[subscription.id];
            }
            var dropSubscriptionMessage = {
                type: "drop-subscription",
                subscription_id: subscription.id,
                reason: "Server dropping a single subscription",
            };
            this.session.sendFireAndForget(dropSubscriptionMessage);
            subscription.instance;
            this.callbacks.execute(SUBSCRIPTION_REMOVED, subscription, streamingMethod);
        };
        ServerStreaming.prototype.closeMultipleSubscriptions = function (streamingMethod, branchKey) {
            var _this = this;
            if (typeof streamingMethod !== "object" || typeof streamingMethod.protocolState.subscriptionsMap !== "object") {
                return;
            }
            if (!streamingMethod.protocolState.subscriptionsMap) {
                return;
            }
            var subscriptionsMap = streamingMethod.protocolState.subscriptionsMap;
            var subscriptionsToClose = Object.keys(subscriptionsMap)
                .map(function (key) {
                return subscriptionsMap[key];
            });
            if (typeof branchKey === "string") {
                subscriptionsToClose = subscriptionsToClose.filter(function (sub) {
                    return sub.branchKey === branchKey;
                });
            }
            subscriptionsToClose.forEach(function (subscription) {
                delete subscriptionsMap[subscription.id];
                var drop = {
                    type: "drop-subscription",
                    subscription_id: subscription.id,
                    reason: "Server dropping all subscriptions on stream_id: " + subscription.streamId,
                };
                _this.session.sendFireAndForget(drop);
            });
        };
        ServerStreaming.prototype.getSubscriptionList = function (streamingMethod, branchKey) {
            if (typeof streamingMethod !== "object") {
                return [];
            }
            var subscriptions = [];
            if (!streamingMethod.protocolState.subscriptionsMap) {
                return [];
            }
            var subscriptionsMap = streamingMethod.protocolState.subscriptionsMap;
            var allSubscriptions = Object.keys(subscriptionsMap)
                .map(function (key) {
                return subscriptionsMap[key];
            });
            if (typeof branchKey !== "string") {
                subscriptions = allSubscriptions;
            }
            else {
                subscriptions = allSubscriptions.filter(function (sub) {
                    return sub.branchKey === branchKey;
                });
            }
            return subscriptions;
        };
        ServerStreaming.prototype.getBranchList = function (streamingMethod) {
            if (typeof streamingMethod !== "object") {
                return [];
            }
            if (!streamingMethod.protocolState.subscriptionsMap) {
                return [];
            }
            var subscriptionsMap = streamingMethod.protocolState.subscriptionsMap;
            var allSubscriptions = Object.keys(subscriptionsMap)
                .map(function (key) {
                return subscriptionsMap[key];
            });
            var result = [];
            allSubscriptions.forEach(function (sub) {
                var branch = "";
                if (typeof sub === "object" && typeof sub.branchKey === "string") {
                    branch = sub.branchKey;
                }
                if (result.indexOf(branch) === -1) {
                    result.push(branch);
                }
            });
            return result;
        };
        ServerStreaming.prototype.onSubAdded = function (callback) {
            this.onSubscriptionLifetimeEvent(SUBSCRIPTION_ADDED, callback);
        };
        ServerStreaming.prototype.onSubRequest = function (callback) {
            this.onSubscriptionLifetimeEvent(SUBSCRIPTION_REQUEST, callback);
        };
        ServerStreaming.prototype.onSubRemoved = function (callback) {
            this.onSubscriptionLifetimeEvent(SUBSCRIPTION_REMOVED, callback);
        };
        ServerStreaming.prototype.handleRemoveInterest = function (msg) {
            var streamingMethod = this.serverRepository.getById(msg.method_id);
            if (typeof msg.subscription_id !== "string" ||
                typeof streamingMethod !== "object") {
                return;
            }
            if (!streamingMethod.protocolState.subscriptionsMap) {
                return;
            }
            if (typeof streamingMethod.protocolState.subscriptionsMap[msg.subscription_id] !== "object") {
                return;
            }
            var subscription = streamingMethod.protocolState.subscriptionsMap[msg.subscription_id];
            delete streamingMethod.protocolState.subscriptionsMap[msg.subscription_id];
            this.callbacks.execute(SUBSCRIPTION_REMOVED, subscription, streamingMethod);
        };
        ServerStreaming.prototype.onSubscriptionLifetimeEvent = function (eventName, handlerFunc) {
            this.callbacks.add(eventName, handlerFunc);
        };
        ServerStreaming.prototype.getNextStreamId = function () {
            return this.nextStreamId++ + "";
        };
        ServerStreaming.prototype.handleAddInterest = function (msg) {
            var caller = this.repository.getServerById(msg.caller_id);
            var instance = caller.instance;
            var requestContext = {
                msg: msg,
                arguments: msg.arguments_kv || {},
                instance: instance,
            };
            var streamingMethod = this.serverRepository.getById(msg.method_id);
            if (streamingMethod === undefined) {
                var errorMsg = "No method with id " + msg.method_id + " on this server.";
                this.sendSubscriptionFailed(errorMsg, msg.subscription_id);
                return;
            }
            if (streamingMethod.protocolState.subscriptionsMap &&
                streamingMethod.protocolState.subscriptionsMap[msg.subscription_id]) {
                this.sendSubscriptionFailed("A subscription with id " + msg.subscription_id + " already exists.", msg.subscription_id);
                return;
            }
            this.callbacks.execute(SUBSCRIPTION_REQUEST, requestContext, streamingMethod);
        };
        ServerStreaming.prototype.sendSubscriptionFailed = function (reason, subscriptionId) {
            var errorMessage = {
                type: "error",
                reason_uri: this.ERR_URI_SUBSCRIPTION_FAILED,
                reason: reason,
                request_id: subscriptionId,
            };
            this.session.sendFireAndForget(errorMessage);
        };
        ServerStreaming.prototype.getStreamId = function (streamingMethod, branchKey) {
            if (typeof branchKey !== "string") {
                branchKey = "";
            }
            if (!streamingMethod.protocolState.branchKeyToStreamIdMap) {
                throw new Error("streaming ".concat(streamingMethod.definition.name, " method without protocol state"));
            }
            var needleBranch = streamingMethod.protocolState.branchKeyToStreamIdMap.filter(function (branch) {
                return branch.key === branchKey;
            })[0];
            var streamId = (needleBranch ? needleBranch.streamId : undefined);
            if (typeof streamId !== "string" || streamId === "") {
                streamId = this.getNextStreamId();
                streamingMethod.protocolState.branchKeyToStreamIdMap.push({ key: branchKey, streamId: streamId });
            }
            return streamId;
        };
        return ServerStreaming;
    }());

    var ServerProtocol = (function () {
        function ServerProtocol(session, clientRepository, serverRepository, logger) {
            var _this = this;
            this.session = session;
            this.clientRepository = clientRepository;
            this.serverRepository = serverRepository;
            this.logger = logger;
            this.callbacks = lib$1();
            this.streaming = new ServerStreaming(session, clientRepository, serverRepository);
            this.session.on("invoke", function (msg) { return _this.handleInvokeMessage(msg); });
        }
        ServerProtocol.prototype.createStream = function (repoMethod) {
            repoMethod.protocolState.subscriptionsMap = {};
            repoMethod.protocolState.branchKeyToStreamIdMap = [];
            return this.register(repoMethod, true);
        };
        ServerProtocol.prototype.register = function (repoMethod, isStreaming) {
            var _this = this;
            var _a;
            var methodDef = repoMethod.definition;
            var flags = Object.assign({}, { metadata: (_a = methodDef.flags) !== null && _a !== void 0 ? _a : {} }, { streaming: isStreaming || false });
            var registerMsg = {
                type: "register",
                methods: [{
                        id: repoMethod.repoId,
                        name: methodDef.name,
                        display_name: methodDef.displayName,
                        description: methodDef.description,
                        version: methodDef.version,
                        flags: flags,
                        object_types: methodDef.objectTypes || methodDef.object_types,
                        input_signature: methodDef.accepts,
                        result_signature: methodDef.returns,
                        restrictions: undefined,
                    }],
            };
            return this.session.send(registerMsg, { methodId: repoMethod.repoId })
                .then(function () {
                _this.logger.debug("registered method " + repoMethod.definition.name + " with id " + repoMethod.repoId);
            })
                .catch(function (msg) {
                _this.logger.warn("failed to register method ".concat(repoMethod.definition.name, " with id ").concat(repoMethod.repoId, " - ").concat(JSON.stringify(msg)));
                throw msg;
            });
        };
        ServerProtocol.prototype.onInvoked = function (callback) {
            this.callbacks.add("onInvoked", callback);
        };
        ServerProtocol.prototype.methodInvocationResult = function (method, invocationId, err, result) {
            var msg;
            if (err || err === "") {
                msg = {
                    type: "error",
                    request_id: invocationId,
                    reason_uri: "agm.errors.client_error",
                    reason: err,
                    context: result,
                    peer_id: undefined,
                };
            }
            else {
                msg = {
                    type: "yield",
                    invocation_id: invocationId,
                    peer_id: this.session.peerId,
                    result: result,
                    request_id: undefined,
                };
            }
            this.session.sendFireAndForget(msg);
        };
        ServerProtocol.prototype.unregister = function (method) {
            return __awaiter(this, void 0, void 0, function () {
                var msg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            msg = {
                                type: "unregister",
                                methods: [method.repoId],
                            };
                            return [4, this.session.send(msg)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        ServerProtocol.prototype.getBranchList = function (method) {
            return this.streaming.getBranchList(method);
        };
        ServerProtocol.prototype.getSubscriptionList = function (method, branchKey) {
            return this.streaming.getSubscriptionList(method, branchKey);
        };
        ServerProtocol.prototype.closeAllSubscriptions = function (method, branchKey) {
            this.streaming.closeMultipleSubscriptions(method, branchKey);
        };
        ServerProtocol.prototype.pushData = function (method, data, branches) {
            this.streaming.pushData(method, data, branches);
        };
        ServerProtocol.prototype.pushDataToSingle = function (method, subscription, data) {
            this.streaming.pushDataToSingle(method, subscription, data);
        };
        ServerProtocol.prototype.closeSingleSubscription = function (method, subscription) {
            this.streaming.closeSingleSubscription(method, subscription);
        };
        ServerProtocol.prototype.acceptRequestOnBranch = function (requestContext, method, branch) {
            this.streaming.acceptRequestOnBranch(requestContext, method, branch);
        };
        ServerProtocol.prototype.rejectRequest = function (requestContext, method, reason) {
            this.streaming.rejectRequest(requestContext, method, reason);
        };
        ServerProtocol.prototype.onSubRequest = function (callback) {
            this.streaming.onSubRequest(callback);
        };
        ServerProtocol.prototype.onSubAdded = function (callback) {
            this.streaming.onSubAdded(callback);
        };
        ServerProtocol.prototype.onSubRemoved = function (callback) {
            this.streaming.onSubRemoved(callback);
        };
        ServerProtocol.prototype.handleInvokeMessage = function (msg) {
            var invocationId = msg.invocation_id;
            var callerId = msg.caller_id;
            var methodId = msg.method_id;
            var args = msg.arguments_kv;
            var methodList = this.serverRepository.getList();
            var method = methodList.filter(function (m) {
                return m.repoId === methodId;
            })[0];
            if (method === undefined) {
                return;
            }
            var client = this.clientRepository.getServerById(callerId).instance;
            var invocationArgs = { args: args, instance: client };
            this.callbacks.execute("onInvoked", method, invocationId, invocationArgs);
        };
        return ServerProtocol;
    }());

    var UserSubscription = (function () {
        function UserSubscription(repository, subscriptionData) {
            this.repository = repository;
            this.subscriptionData = subscriptionData;
        }
        Object.defineProperty(UserSubscription.prototype, "requestArguments", {
            get: function () {
                return this.subscriptionData.params.arguments || {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UserSubscription.prototype, "servers", {
            get: function () {
                var _this = this;
                return this.subscriptionData.trackedServers
                    .filter(function (pair) { return pair.subscriptionId; })
                    .map(function (pair) { return _this.repository.getServerById(pair.serverId).instance; });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UserSubscription.prototype, "serverInstance", {
            get: function () {
                return this.servers[0];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UserSubscription.prototype, "stream", {
            get: function () {
                return this.subscriptionData.method;
            },
            enumerable: false,
            configurable: true
        });
        UserSubscription.prototype.onData = function (dataCallback) {
            if (typeof dataCallback !== "function") {
                throw new TypeError("The data callback must be a function.");
            }
            this.subscriptionData.handlers.onData.push(dataCallback);
            if (this.subscriptionData.handlers.onData.length === 1 && this.subscriptionData.queued.data.length > 0) {
                this.subscriptionData.queued.data.forEach(function (dataItem) {
                    dataCallback(dataItem);
                });
            }
        };
        UserSubscription.prototype.onClosed = function (closedCallback) {
            if (typeof closedCallback !== "function") {
                throw new TypeError("The callback must be a function.");
            }
            this.subscriptionData.handlers.onClosed.push(closedCallback);
        };
        UserSubscription.prototype.onFailed = function (callback) {
        };
        UserSubscription.prototype.onConnected = function (callback) {
            if (typeof callback !== "function") {
                throw new TypeError("The callback must be a function.");
            }
            this.subscriptionData.handlers.onConnected.push(callback);
        };
        UserSubscription.prototype.close = function () {
            this.subscriptionData.close();
        };
        UserSubscription.prototype.setNewSubscription = function (newSub) {
            this.subscriptionData = newSub;
        };
        return UserSubscription;
    }());

    var TimedCache = (function () {
        function TimedCache(config) {
            this.config = config;
            this.cache = [];
            this.timeoutIds = [];
        }
        TimedCache.prototype.add = function (element) {
            var _this = this;
            var id = shortid();
            this.cache.push({ id: id, element: element });
            var timeoutId = setTimeout(function () {
                var elementIdx = _this.cache.findIndex(function (entry) { return entry.id === id; });
                if (elementIdx < 0) {
                    return;
                }
                _this.cache.splice(elementIdx, 1);
            }, this.config.ELEMENT_TTL_MS);
            this.timeoutIds.push(timeoutId);
        };
        TimedCache.prototype.flush = function () {
            var elements = this.cache.map(function (entry) { return entry.element; });
            this.timeoutIds.forEach(function (id) { return clearInterval(id); });
            this.cache = [];
            this.timeoutIds = [];
            return elements;
        };
        return TimedCache;
    }());

    var STATUS_AWAITING_ACCEPT = "awaitingAccept";
    var STATUS_SUBSCRIBED = "subscribed";
    var ERR_MSG_SUB_FAILED = "Subscription failed.";
    var ERR_MSG_SUB_REJECTED = "Subscription rejected.";
    var ON_CLOSE_MSG_SERVER_INIT = "ServerInitiated";
    var ON_CLOSE_MSG_CLIENT_INIT = "ClientInitiated";
    var ClientStreaming = (function () {
        function ClientStreaming(session, repository, logger) {
            var _this = this;
            this.session = session;
            this.repository = repository;
            this.logger = logger;
            this.subscriptionsList = {};
            this.timedCache = new TimedCache({ ELEMENT_TTL_MS: 10000 });
            this.subscriptionIdToLocalKeyMap = {};
            this.nextSubLocalKey = 0;
            this.handleErrorSubscribing = function (errorResponse) {
                var tag = errorResponse._tag;
                var subLocalKey = tag.subLocalKey;
                var pendingSub = _this.subscriptionsList[subLocalKey];
                if (typeof pendingSub !== "object") {
                    return;
                }
                pendingSub.trackedServers = pendingSub.trackedServers.filter(function (server) {
                    return server.serverId !== tag.serverId;
                });
                if (pendingSub.trackedServers.length <= 0) {
                    clearTimeout(pendingSub.timeoutId);
                    if (pendingSub.status === STATUS_AWAITING_ACCEPT) {
                        var reason = (typeof errorResponse.reason === "string" && errorResponse.reason !== "") ?
                            ' Publisher said "' + errorResponse.reason + '".' :
                            " No reason given.";
                        var callArgs = typeof pendingSub.params.arguments === "object" ?
                            JSON.stringify(pendingSub.params.arguments) :
                            "{}";
                        pendingSub.error({
                            message: ERR_MSG_SUB_REJECTED + reason + " Called with:" + callArgs,
                            called_with: pendingSub.params.arguments,
                            method: pendingSub.method,
                        });
                    }
                    else if (pendingSub.status === STATUS_SUBSCRIBED) {
                        _this.callOnClosedHandlers(pendingSub);
                    }
                    delete _this.subscriptionsList[subLocalKey];
                }
            };
            this.handleSubscribed = function (msg) {
                var subLocalKey = msg._tag.subLocalKey;
                var pendingSub = _this.subscriptionsList[subLocalKey];
                if (typeof pendingSub !== "object") {
                    return;
                }
                var serverId = msg._tag.serverId;
                var acceptingServer = pendingSub.trackedServers
                    .filter(function (server) {
                    return server.serverId === serverId;
                })[0];
                if (typeof acceptingServer !== "object") {
                    return;
                }
                acceptingServer.subscriptionId = msg.subscription_id;
                _this.subscriptionIdToLocalKeyMap[msg.subscription_id] = subLocalKey;
                var isFirstResponse = (pendingSub.status === STATUS_AWAITING_ACCEPT);
                pendingSub.status = STATUS_SUBSCRIBED;
                if (isFirstResponse) {
                    var reconnect = false;
                    var sub = pendingSub.subscription;
                    if (sub) {
                        sub.setNewSubscription(pendingSub);
                        pendingSub.success(sub);
                        reconnect = true;
                    }
                    else {
                        sub = new UserSubscription(_this.repository, pendingSub);
                        pendingSub.subscription = sub;
                        pendingSub.success(sub);
                    }
                    for (var _i = 0, _a = pendingSub.handlers.onConnected; _i < _a.length; _i++) {
                        var handler = _a[_i];
                        try {
                            handler(sub.serverInstance, reconnect);
                        }
                        catch (e) {
                        }
                    }
                }
            };
            this.handleEventData = function (msg) {
                var subLocalKey = _this.subscriptionIdToLocalKeyMap[msg.subscription_id];
                if (typeof subLocalKey === "undefined") {
                    return;
                }
                var subscription = _this.subscriptionsList[subLocalKey];
                if (typeof subscription !== "object") {
                    return;
                }
                var trackedServersFound = subscription.trackedServers.filter(function (server) {
                    return server.subscriptionId === msg.subscription_id;
                });
                if (trackedServersFound.length !== 1) {
                    return;
                }
                var isPrivateData = msg.oob;
                var sendingServerId = trackedServersFound[0].serverId;
                var receivedStreamData = function () {
                    return {
                        data: msg.data,
                        server: _this.repository.getServerById(sendingServerId).instance,
                        requestArguments: subscription.params.arguments,
                        message: undefined,
                        private: isPrivateData,
                    };
                };
                var onDataHandlers = subscription.handlers.onData;
                var queuedData = subscription.queued.data;
                if (onDataHandlers.length > 0) {
                    onDataHandlers.forEach(function (callback) {
                        if (typeof callback === "function") {
                            callback(receivedStreamData());
                        }
                    });
                }
                else {
                    queuedData.push(receivedStreamData());
                }
            };
            this.handleSubscriptionCancelled = function (msg) {
                var subLocalKey = _this.subscriptionIdToLocalKeyMap[msg.subscription_id];
                if (typeof subLocalKey === "undefined") {
                    return;
                }
                var subscription = _this.subscriptionsList[subLocalKey];
                if (typeof subscription !== "object") {
                    return;
                }
                var expectedNewLength = subscription.trackedServers.length - 1;
                subscription.trackedServers = subscription.trackedServers.filter(function (server) {
                    if (server.subscriptionId === msg.subscription_id) {
                        subscription.queued.closers.push(server.serverId);
                        return false;
                    }
                    else {
                        return true;
                    }
                });
                if (subscription.trackedServers.length !== expectedNewLength) {
                    return;
                }
                if (subscription.trackedServers.length <= 0) {
                    _this.timedCache.add(subscription);
                    clearTimeout(subscription.timeoutId);
                    _this.callOnClosedHandlers(subscription);
                    delete _this.subscriptionsList[subLocalKey];
                }
                delete _this.subscriptionIdToLocalKeyMap[msg.subscription_id];
            };
            session.on("subscribed", this.handleSubscribed);
            session.on("event", this.handleEventData);
            session.on("subscription-cancelled", this.handleSubscriptionCancelled);
        }
        ClientStreaming.prototype.subscribe = function (streamingMethod, params, targetServers, success, error, existingSub) {
            var _this = this;
            if (targetServers.length === 0) {
                error({
                    method: streamingMethod,
                    called_with: params.arguments,
                    message: ERR_MSG_SUB_FAILED + " No available servers matched the target params.",
                });
                return;
            }
            var subLocalKey = this.getNextSubscriptionLocalKey();
            var pendingSub = this.registerSubscription(subLocalKey, streamingMethod, params, success, error, params.methodResponseTimeout || 10000, existingSub);
            if (typeof pendingSub !== "object") {
                error({
                    method: streamingMethod,
                    called_with: params.arguments,
                    message: ERR_MSG_SUB_FAILED + " Unable to register the user callbacks.",
                });
                return;
            }
            targetServers.forEach(function (target) {
                var serverId = target.server.id;
                var method = target.methods.find(function (m) { return m.name === streamingMethod.name; });
                if (!method) {
                    _this.logger.error("can not find method ".concat(streamingMethod.name, " for target ").concat(target.server.id));
                    return;
                }
                pendingSub.trackedServers.push({
                    serverId: serverId,
                    subscriptionId: undefined,
                });
                var msg = {
                    type: "subscribe",
                    server_id: serverId,
                    method_id: method.gatewayId,
                    arguments_kv: params.arguments,
                };
                _this.session.send(msg, { serverId: serverId, subLocalKey: subLocalKey })
                    .then(function (m) { return _this.handleSubscribed(m); })
                    .catch(function (err) { return _this.handleErrorSubscribing(err); });
            });
        };
        ClientStreaming.prototype.drainSubscriptions = function () {
            var existing = Object.values(this.subscriptionsList);
            this.subscriptionsList = {};
            this.subscriptionIdToLocalKeyMap = {};
            return existing;
        };
        ClientStreaming.prototype.drainSubscriptionsCache = function () {
            return this.timedCache.flush();
        };
        ClientStreaming.prototype.getNextSubscriptionLocalKey = function () {
            var current = this.nextSubLocalKey;
            this.nextSubLocalKey += 1;
            return current;
        };
        ClientStreaming.prototype.registerSubscription = function (subLocalKey, method, params, success, error, timeout, existingSub) {
            var _this = this;
            var subsInfo = {
                localKey: subLocalKey,
                status: STATUS_AWAITING_ACCEPT,
                method: method,
                params: params,
                success: success,
                error: error,
                trackedServers: [],
                handlers: {
                    onData: (existingSub === null || existingSub === void 0 ? void 0 : existingSub.handlers.onData) || [],
                    onClosed: (existingSub === null || existingSub === void 0 ? void 0 : existingSub.handlers.onClosed) || [],
                    onConnected: (existingSub === null || existingSub === void 0 ? void 0 : existingSub.handlers.onConnected) || [],
                },
                queued: {
                    data: [],
                    closers: [],
                },
                timeoutId: undefined,
                close: function () { return _this.closeSubscription(subLocalKey); },
                subscription: existingSub === null || existingSub === void 0 ? void 0 : existingSub.subscription
            };
            if (!existingSub) {
                if (params.onData) {
                    subsInfo.handlers.onData.push(params.onData);
                }
                if (params.onClosed) {
                    subsInfo.handlers.onClosed.push(params.onClosed);
                }
                if (params.onConnected) {
                    subsInfo.handlers.onConnected.push(params.onConnected);
                }
            }
            this.subscriptionsList[subLocalKey] = subsInfo;
            subsInfo.timeoutId = setTimeout(function () {
                if (_this.subscriptionsList[subLocalKey] === undefined) {
                    return;
                }
                var pendingSub = _this.subscriptionsList[subLocalKey];
                if (pendingSub.status === STATUS_AWAITING_ACCEPT) {
                    error({
                        method: method,
                        called_with: params.arguments,
                        message: ERR_MSG_SUB_FAILED + " Subscription attempt timed out after " + timeout + " ms.",
                    });
                    delete _this.subscriptionsList[subLocalKey];
                }
                else if (pendingSub.status === STATUS_SUBSCRIBED && pendingSub.trackedServers.length > 0) {
                    pendingSub.trackedServers = pendingSub.trackedServers.filter(function (server) {
                        return (typeof server.subscriptionId !== "undefined");
                    });
                    delete pendingSub.timeoutId;
                    if (pendingSub.trackedServers.length <= 0) {
                        _this.callOnClosedHandlers(pendingSub);
                        delete _this.subscriptionsList[subLocalKey];
                    }
                }
            }, timeout);
            return subsInfo;
        };
        ClientStreaming.prototype.callOnClosedHandlers = function (subscription, reason) {
            var closersCount = subscription.queued.closers.length;
            var closingServerId = (closersCount > 0) ? subscription.queued.closers[closersCount - 1] : null;
            var closingServer;
            if (closingServerId !== undefined && typeof closingServerId === "string") {
                closingServer = this.repository.getServerById(closingServerId).instance;
            }
            subscription.handlers.onClosed.forEach(function (callback) {
                if (typeof callback !== "function") {
                    return;
                }
                callback({
                    message: reason || ON_CLOSE_MSG_SERVER_INIT,
                    requestArguments: subscription.params.arguments || {},
                    server: closingServer,
                    stream: subscription.method,
                });
            });
        };
        ClientStreaming.prototype.closeSubscription = function (subLocalKey) {
            var _this = this;
            var subscription = this.subscriptionsList[subLocalKey];
            if (typeof subscription !== "object") {
                return;
            }
            subscription.trackedServers.forEach(function (server) {
                if (typeof server.subscriptionId === "undefined") {
                    return;
                }
                subscription.queued.closers.push(server.serverId);
                _this.session.sendFireAndForget({
                    type: "unsubscribe",
                    subscription_id: server.subscriptionId,
                    reason_uri: "",
                    reason: ON_CLOSE_MSG_CLIENT_INIT,
                });
                delete _this.subscriptionIdToLocalKeyMap[server.subscriptionId];
            });
            subscription.trackedServers = [];
            this.callOnClosedHandlers(subscription, ON_CLOSE_MSG_CLIENT_INIT);
            delete this.subscriptionsList[subLocalKey];
        };
        return ClientStreaming;
    }());

    var ClientProtocol = (function () {
        function ClientProtocol(session, repository, logger) {
            var _this = this;
            this.session = session;
            this.repository = repository;
            this.logger = logger;
            session.on("peer-added", function (msg) { return _this.handlePeerAdded(msg); });
            session.on("peer-removed", function (msg) { return _this.handlePeerRemoved(msg); });
            session.on("methods-added", function (msg) { return _this.handleMethodsAddedMessage(msg); });
            session.on("methods-removed", function (msg) { return _this.handleMethodsRemovedMessage(msg); });
            this.streaming = new ClientStreaming(session, repository, logger);
        }
        ClientProtocol.prototype.subscribe = function (stream, options, targetServers, success, error, existingSub) {
            this.streaming.subscribe(stream, options, targetServers, success, error, existingSub);
        };
        ClientProtocol.prototype.invoke = function (id, method, args, target) {
            var _this = this;
            var serverId = target.id;
            var methodId = method.gatewayId;
            var msg = {
                type: "call",
                server_id: serverId,
                method_id: methodId,
                arguments_kv: args,
            };
            return this.session.send(msg, { invocationId: id, serverId: serverId })
                .then(function (m) { return _this.handleResultMessage(m); })
                .catch(function (err) { return _this.handleInvocationError(err); });
        };
        ClientProtocol.prototype.drainSubscriptions = function () {
            return this.streaming.drainSubscriptions();
        };
        ClientProtocol.prototype.drainSubscriptionsCache = function () {
            return this.streaming.drainSubscriptionsCache();
        };
        ClientProtocol.prototype.handlePeerAdded = function (msg) {
            var newPeerId = msg.new_peer_id;
            var remoteId = msg.identity;
            var isLocal = msg.meta ? msg.meta.local : true;
            var pid = Number(remoteId.process);
            var serverInfo = {
                machine: remoteId.machine,
                pid: isNaN(pid) ? remoteId.process : pid,
                instance: remoteId.instance,
                application: remoteId.application,
                applicationName: remoteId.applicationName,
                environment: remoteId.environment,
                region: remoteId.region,
                user: remoteId.user,
                windowId: remoteId.windowId,
                peerId: newPeerId,
                api: remoteId.api,
                isLocal: isLocal
            };
            this.repository.addServer(serverInfo, newPeerId);
        };
        ClientProtocol.prototype.handlePeerRemoved = function (msg) {
            var removedPeerId = msg.removed_id;
            var reason = msg.reason;
            this.repository.removeServerById(removedPeerId, reason);
        };
        ClientProtocol.prototype.handleMethodsAddedMessage = function (msg) {
            var _this = this;
            var serverId = msg.server_id;
            var methods = msg.methods;
            methods.forEach(function (method) {
                _this.repository.addServerMethod(serverId, method);
            });
        };
        ClientProtocol.prototype.handleMethodsRemovedMessage = function (msg) {
            var _this = this;
            var serverId = msg.server_id;
            var methodIdList = msg.methods;
            var server = this.repository.getServerById(serverId);
            var serverMethodKeys = Object.keys(server.methods);
            serverMethodKeys.forEach(function (methodKey) {
                var method = server.methods[methodKey];
                if (methodIdList.indexOf(method.gatewayId) > -1) {
                    _this.repository.removeServerMethod(serverId, methodKey);
                }
            });
        };
        ClientProtocol.prototype.handleResultMessage = function (msg) {
            var invocationId = msg._tag.invocationId;
            var result = msg.result;
            var serverId = msg._tag.serverId;
            var server = this.repository.getServerById(serverId);
            return {
                invocationId: invocationId,
                result: result,
                instance: server.instance,
                status: InvokeStatus.Success,
                message: ""
            };
        };
        ClientProtocol.prototype.handleInvocationError = function (msg) {
            this.logger.debug("handle invocation error ".concat(JSON.stringify(msg)));
            if ("_tag" in msg) {
                var invocationId = msg._tag.invocationId;
                var serverId = msg._tag.serverId;
                var server = this.repository.getServerById(serverId);
                var message = msg.reason;
                var context_1 = msg.context;
                return {
                    invocationId: invocationId,
                    result: context_1,
                    instance: server.instance,
                    status: InvokeStatus.Error,
                    message: message
                };
            }
            else {
                return {
                    invocationId: "",
                    message: msg.message,
                    status: InvokeStatus.Error,
                    error: msg
                };
            }
        };
        return ClientProtocol;
    }());

    function gW3ProtocolFactory (instance, connection, clientRepository, serverRepository, libConfig, interop) {
        var logger = libConfig.logger.subLogger("gw3-protocol");
        var resolveReadyPromise;
        var readyPromise = new Promise(function (resolve) {
            resolveReadyPromise = resolve;
        });
        var session = connection.domain("agm", ["subscribed"]);
        var server = new ServerProtocol(session, clientRepository, serverRepository, logger.subLogger("server"));
        var client = new ClientProtocol(session, clientRepository, logger.subLogger("client"));
        function handleReconnect() {
            return __awaiter(this, void 0, void 0, function () {
                var reconnectionPromises, existingSubscriptions, _loop_1, _i, existingSubscriptions_1, sub, registeredMethods, _loop_2, _a, registeredMethods_1, method;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            logger.info("reconnected - will replay registered methods and subscriptions");
                            client.drainSubscriptionsCache().forEach(function (sub) {
                                var methodInfo = sub.method;
                                var params = Object.assign({}, sub.params);
                                logger.info("trying to soft-re-subscribe to method ".concat(methodInfo.name, ", with params: ").concat(JSON.stringify(params)));
                                interop.client.subscribe(methodInfo, params, undefined, undefined, sub).then(function () { return logger.info("soft-subscribing to method ".concat(methodInfo.name, " DONE")); }).catch(function (error) { return logger.warn("subscribing to method ".concat(methodInfo.name, " failed: ").concat(JSON.stringify(error), "}")); });
                            });
                            reconnectionPromises = [];
                            existingSubscriptions = client.drainSubscriptions();
                            _loop_1 = function (sub) {
                                var methodInfo = sub.method;
                                var params = Object.assign({}, sub.params);
                                logger.info("trying to re-subscribe to method ".concat(methodInfo.name, ", with params: ").concat(JSON.stringify(params)));
                                reconnectionPromises.push(interop.client.subscribe(methodInfo, params, undefined, undefined, sub).then(function () { return logger.info("subscribing to method ".concat(methodInfo.name, " DONE")); }));
                            };
                            for (_i = 0, existingSubscriptions_1 = existingSubscriptions; _i < existingSubscriptions_1.length; _i++) {
                                sub = existingSubscriptions_1[_i];
                                _loop_1(sub);
                            }
                            registeredMethods = serverRepository.getList();
                            serverRepository.reset();
                            _loop_2 = function (method) {
                                var def = method.definition;
                                logger.info("re-publishing method ".concat(def.name));
                                if (method.stream) {
                                    reconnectionPromises.push(interop.server.createStream(def, method.streamCallbacks, undefined, undefined, method.stream).then(function () { return logger.info("subscribing to method ".concat(def.name, " DONE")); }));
                                }
                                else if (method.theFunction && method.theFunction.userCallback) {
                                    reconnectionPromises.push(interop.register(def, method.theFunction.userCallback).then(function () { return logger.info("subscribing to method ".concat(def.name, " DONE")); }));
                                }
                                else if (method.theFunction && method.theFunction.userCallbackAsync) {
                                    reconnectionPromises.push(interop.registerAsync(def, method.theFunction.userCallbackAsync).then(function () { return logger.info("subscribing to method ".concat(def.name, " DONE")); }));
                                }
                                logger.info("re-publishing method ".concat(def.name, " DONE"));
                            };
                            for (_a = 0, registeredMethods_1 = registeredMethods; _a < registeredMethods_1.length; _a++) {
                                method = registeredMethods_1[_a];
                                _loop_2(method);
                            }
                            return [4, Promise.all(reconnectionPromises)];
                        case 1:
                            _b.sent();
                            logger.info("Interop is re-announced");
                            return [2];
                    }
                });
            });
        }
        function handleInitialJoin() {
            if (resolveReadyPromise) {
                resolveReadyPromise({
                    client: client,
                    server: server,
                });
                resolveReadyPromise = undefined;
            }
        }
        session.onJoined(function (reconnect) {
            clientRepository.addServer(instance, connection.peerId);
            if (reconnect) {
                handleReconnect().then(function () { return connection.setLibReAnnounced({ name: "interop" }); }).catch(function (error) { return logger.warn("Error while re-announcing interop: ".concat(JSON.stringify(error))); });
            }
            else {
                handleInitialJoin();
            }
        });
        session.onLeft(function () {
            clientRepository.reset();
        });
        session.join();
        return readyPromise;
    }

    var Interop = (function () {
        function Interop(configuration) {
            var _this = this;
            if (typeof configuration === "undefined") {
                throw new Error("configuration is required");
            }
            if (typeof configuration.connection === "undefined") {
                throw new Error("configuration.connections is required");
            }
            var connection = configuration.connection;
            if (typeof configuration.methodResponseTimeout !== "number") {
                configuration.methodResponseTimeout = 30 * 1000;
            }
            if (typeof configuration.waitTimeoutMs !== "number") {
                configuration.waitTimeoutMs = 30 * 1000;
            }
            this.unwrappedInstance = new InstanceWrapper(this, undefined, connection);
            this.instance = this.unwrappedInstance.unwrap();
            this.clientRepository = new ClientRepository(configuration.logger.subLogger("cRep"), this);
            this.serverRepository = new ServerRepository();
            var protocolPromise;
            if (connection.protocolVersion === 3) {
                protocolPromise = gW3ProtocolFactory(this.instance, connection, this.clientRepository, this.serverRepository, configuration, this);
            }
            else {
                throw new Error("protocol ".concat(connection.protocolVersion, " not supported"));
            }
            this.readyPromise = protocolPromise.then(function (protocol) {
                _this.protocol = protocol;
                _this.client = new Client(_this.protocol, _this.clientRepository, _this.instance, configuration);
                _this.server = new Server(_this.protocol, _this.serverRepository);
                return _this;
            });
        }
        Interop.prototype.ready = function () {
            return this.readyPromise;
        };
        Interop.prototype.serverRemoved = function (callback) {
            return this.client.serverRemoved(callback);
        };
        Interop.prototype.serverAdded = function (callback) {
            return this.client.serverAdded(callback);
        };
        Interop.prototype.serverMethodRemoved = function (callback) {
            return this.client.serverMethodRemoved(callback);
        };
        Interop.prototype.serverMethodAdded = function (callback) {
            return this.client.serverMethodAdded(callback);
        };
        Interop.prototype.methodRemoved = function (callback) {
            return this.client.methodRemoved(callback);
        };
        Interop.prototype.methodAdded = function (callback) {
            return this.client.methodAdded(callback);
        };
        Interop.prototype.methodsForInstance = function (instance) {
            return this.client.methodsForInstance(instance);
        };
        Interop.prototype.methods = function (methodFilter) {
            return this.client.methods(methodFilter);
        };
        Interop.prototype.servers = function (methodFilter) {
            return this.client.servers(methodFilter);
        };
        Interop.prototype.subscribe = function (method, options, successCallback, errorCallback) {
            return this.client.subscribe(method, options, successCallback, errorCallback);
        };
        Interop.prototype.createStream = function (streamDef, callbacks, successCallback, errorCallback) {
            return this.server.createStream(streamDef, callbacks, successCallback, errorCallback);
        };
        Interop.prototype.unregister = function (methodFilter) {
            return this.server.unregister(methodFilter);
        };
        Interop.prototype.registerAsync = function (methodDefinition, callback) {
            return this.server.registerAsync(methodDefinition, callback);
        };
        Interop.prototype.register = function (methodDefinition, callback) {
            return this.server.register(methodDefinition, callback);
        };
        Interop.prototype.invoke = function (methodFilter, argumentObj, target, additionalOptions, success, error) {
            return this.client.invoke(methodFilter, argumentObj, target, additionalOptions, success, error);
        };
        Interop.prototype.waitForMethod = function (name) {
            var pw = new PromiseWrapper();
            var unsubscribe = this.client.methodAdded(function (m) {
                if (m.name === name) {
                    unsubscribe();
                    pw.resolve(m);
                }
            });
            return pw.promise;
        };
        return Interop;
    }());

    var successMessages = ["subscribed", "success"];
    var MessageBus = (function () {
        function MessageBus(connection, logger) {
            var _this = this;
            this.publish = function (topic, data, options) {
                var _a = options || {}, routingKey = _a.routingKey, target = _a.target;
                var args = _this.removeEmptyValues({
                    type: "publish",
                    topic: topic,
                    data: data,
                    peer_id: _this.peerId,
                    routing_key: routingKey,
                    target_identity: target
                });
                _this.session.send(args);
            };
            this.subscribe = function (topic, callback, options) {
                return new Promise(function (resolve, reject) {
                    var _a = options || {}, routingKey = _a.routingKey, target = _a.target;
                    var args = _this.removeEmptyValues({
                        type: "subscribe",
                        topic: topic,
                        peer_id: _this.peerId,
                        routing_key: routingKey,
                        source: target
                    });
                    _this.session.send(args)
                        .then(function (response) {
                        var subscription_id = response.subscription_id;
                        _this.subscriptions.push({ subscription_id: subscription_id, topic: topic, callback: callback, source: target });
                        resolve({
                            unsubscribe: function () {
                                _this.session.send({ type: "unsubscribe", subscription_id: subscription_id, peer_id: _this.peerId });
                                _this.subscriptions = _this.subscriptions.filter(function (s) { return s.subscription_id !== subscription_id; });
                                return Promise.resolve();
                            }
                        });
                    })
                        .catch(function (error) { return reject(error); });
                });
            };
            this.watchOnEvent = function () {
                _this.session.on("event", function (args) {
                    var data = args.data, subscription_id = args.subscription_id;
                    var source = args["publisher-identity"];
                    var subscription = _this.subscriptions.find(function (s) { return s.subscription_id === subscription_id; });
                    if (subscription) {
                        if (!subscription.source) {
                            subscription.callback(data, subscription.topic, source);
                        }
                        else {
                            if (_this.keysMatch(subscription.source, source)) {
                                subscription.callback(data, subscription.topic, source);
                            }
                        }
                    }
                });
            };
            this.connection = connection;
            this.logger = logger;
            this.peerId = connection.peerId;
            this.subscriptions = [];
            this.session = connection.domain("bus", successMessages);
            this.readyPromise = this.session.join();
            this.readyPromise.then(function () {
                _this.watchOnEvent();
            });
        }
        MessageBus.prototype.ready = function () {
            return this.readyPromise;
        };
        MessageBus.prototype.removeEmptyValues = function (obj) {
            var cleaned = {};
            Object.keys(obj).forEach(function (key) {
                if (obj[key] !== undefined && obj[key] !== null) {
                    cleaned[key] = obj[key];
                }
            });
            return cleaned;
        };
        MessageBus.prototype.keysMatch = function (obj1, obj2) {
            var keysObj1 = Object.keys(obj1);
            var allMatch = true;
            keysObj1.forEach(function (key) {
                if (obj1[key] !== obj2[key]) {
                    allMatch = false;
                }
            });
            return allMatch;
        };
        return MessageBus;
    }());

    var IOConnectCoreFactory = function (userConfig, ext) {
        var _a, _b;
        var iodesktop = typeof window === "object" ? ((_a = window.iodesktop) !== null && _a !== void 0 ? _a : window.glue42gd) : undefined;
        var preloadPromise = typeof window === "object" ? ((_b = window.gdPreloadPromise) !== null && _b !== void 0 ? _b : Promise.resolve()) : Promise.resolve();
        var glueInitTimer = timer("glue");
        userConfig = userConfig || {};
        ext = ext || {};
        var internalConfig = prepareConfig(userConfig, ext, iodesktop);
        var _connection;
        var _interop;
        var _logger;
        var _metrics;
        var _contexts;
        var _bus;
        var _allowTrace;
        var libs = {};
        function registerLib(name, inner, t) {
            _allowTrace = _logger.canPublish("trace");
            if (_allowTrace) {
                _logger.trace("registering ".concat(name, " module"));
            }
            var done = function () {
                inner.initTime = t.stop();
                inner.initEndTime = t.endTime;
                inner.marks = t.marks;
                if (_allowTrace) {
                    _logger.trace("".concat(name, " is ready - ").concat(t.endTime - t.startTime));
                }
            };
            inner.initStartTime = t.startTime;
            if (inner.ready) {
                inner.ready().then(function () {
                    done();
                });
            }
            else {
                done();
            }
            if (!Array.isArray(name)) {
                name = [name];
            }
            name.forEach(function (n) {
                libs[n] = inner;
                IOConnectCoreFactory[n] = inner;
            });
        }
        function setupConnection() {
            var initTimer = timer("connection");
            _connection = new Connection(internalConfig.connection, _logger.subLogger("connection"));
            var authPromise = Promise.resolve(internalConfig.auth);
            if (internalConfig.connection && !internalConfig.auth) {
                if (iodesktop) {
                    authPromise = iodesktop.getGWToken()
                        .then(function (token) {
                        return {
                            gatewayToken: token
                        };
                    });
                }
                else if (typeof window !== "undefined" && (window === null || window === void 0 ? void 0 : window.glue42electron)) {
                    if (typeof window.glue42electron.gwToken === "string") {
                        authPromise = Promise.resolve({
                            gatewayToken: window.glue42electron.gwToken
                        });
                    }
                }
                else {
                    authPromise = Promise.reject("You need to provide auth information");
                }
            }
            return authPromise
                .then(function (authConfig) {
                initTimer.mark("auth-promise-resolved");
                var authRequest;
                if (Object.prototype.toString.call(authConfig) === "[object Object]") {
                    authRequest = authConfig;
                }
                else {
                    throw new Error("Invalid auth object - " + JSON.stringify(authConfig));
                }
                return _connection.login(authRequest);
            })
                .then(function () {
                registerLib("connection", _connection, initTimer);
                return internalConfig;
            })
                .catch(function (e) {
                if (_connection) {
                    _connection.logout();
                }
                throw e;
            });
        }
        function setupLogger() {
            var _a;
            var initTimer = timer("logger");
            _logger = new Logger("".concat((_a = internalConfig.connection.identity) === null || _a === void 0 ? void 0 : _a.application), undefined, internalConfig.customLogger);
            _logger.consoleLevel(internalConfig.logger.console);
            _logger.publishLevel(internalConfig.logger.publish);
            if (_logger.canPublish("debug")) {
                _logger.debug("initializing glue...");
            }
            registerLib("logger", _logger, initTimer);
            return Promise.resolve(undefined);
        }
        function setupMetrics() {
            var _a, _b, _c, _d, _e;
            var initTimer = timer("metrics");
            var config = internalConfig.metrics;
            var metricsPublishingEnabledFunc = iodesktop === null || iodesktop === void 0 ? void 0 : iodesktop.getMetricsPublishingEnabled;
            var identity = internalConfig.connection.identity;
            var canUpdateMetric = metricsPublishingEnabledFunc ? metricsPublishingEnabledFunc : function () { return true; };
            var disableAutoAppSystem = (_a = (typeof config !== "boolean" && config.disableAutoAppSystem)) !== null && _a !== void 0 ? _a : false;
            _metrics = metrics({
                connection: config ? _connection : undefined,
                logger: _logger.subLogger("metrics"),
                canUpdateMetric: canUpdateMetric,
                system: "Glue42",
                service: (_c = (_b = identity === null || identity === void 0 ? void 0 : identity.service) !== null && _b !== void 0 ? _b : iodesktop === null || iodesktop === void 0 ? void 0 : iodesktop.applicationName) !== null && _c !== void 0 ? _c : internalConfig.application,
                instance: (_e = (_d = identity === null || identity === void 0 ? void 0 : identity.instance) !== null && _d !== void 0 ? _d : identity === null || identity === void 0 ? void 0 : identity.windowId) !== null && _e !== void 0 ? _e : shortid(),
                disableAutoAppSystem: disableAutoAppSystem,
                pagePerformanceMetrics: typeof config !== "boolean" ? config === null || config === void 0 ? void 0 : config.pagePerformanceMetrics : undefined
            });
            registerLib("metrics", _metrics, initTimer);
            return Promise.resolve();
        }
        function setupInterop() {
            var initTimer = timer("interop");
            var agmConfig = {
                connection: _connection,
                logger: _logger.subLogger("interop"),
            };
            _interop = new Interop(agmConfig);
            Logger.Interop = _interop;
            registerLib(["interop", "agm"], _interop, initTimer);
            return Promise.resolve();
        }
        function setupContexts() {
            var hasActivities = (internalConfig.activities && _connection.protocolVersion === 3);
            var needsContexts = internalConfig.contexts || hasActivities;
            if (needsContexts) {
                var initTimer = timer("contexts");
                _contexts = new ContextsModule({
                    connection: _connection,
                    logger: _logger.subLogger("contexts"),
                    trackAllContexts: typeof internalConfig.contexts === "object" ? internalConfig.contexts.trackAllContexts : false,
                    reAnnounceKnownContexts: typeof internalConfig.contexts === "object" ? internalConfig.contexts.reAnnounceKnownContexts : false
                });
                registerLib("contexts", _contexts, initTimer);
                return _contexts;
            }
            else {
                var replayer = _connection.replayer;
                if (replayer) {
                    replayer.drain(ContextMessageReplaySpec.name);
                }
            }
        }
        function setupBus() {
            return __awaiter(this, void 0, void 0, function () {
                var initTimer;
                return __generator(this, function (_a) {
                    if (!internalConfig.bus) {
                        return [2, Promise.resolve()];
                    }
                    initTimer = timer("bus");
                    _bus = new MessageBus(_connection, _logger.subLogger("bus"));
                    registerLib("bus", _bus, initTimer);
                    return [2, Promise.resolve()];
                });
            });
        }
        function setupExternalLibs(externalLibs) {
            try {
                externalLibs.forEach(function (lib) {
                    setupExternalLib(lib.name, lib.create);
                });
                return Promise.resolve();
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        function setupExternalLib(name, createCallback) {
            var initTimer = timer(name);
            var lib = createCallback(libs);
            if (lib) {
                registerLib(name, lib, initTimer);
            }
        }
        function waitForLibs() {
            var libsReadyPromises = Object.keys(libs).map(function (key) {
                var lib = libs[key];
                return lib.ready ?
                    lib.ready() : Promise.resolve();
            });
            return Promise.all(libsReadyPromises);
        }
        function constructGlueObject() {
            var feedbackFunc = function (feedbackInfo) {
                if (!_interop) {
                    return;
                }
                _interop.invoke("T42.ACS.Feedback", feedbackInfo, "best");
            };
            var info = {
                coreVersion: version,
                version: internalConfig.version
            };
            glueInitTimer.stop();
            var glue = {
                feedback: feedbackFunc,
                info: info,
                logger: _logger,
                interop: _interop,
                agm: _interop,
                connection: _connection,
                metrics: _metrics,
                contexts: _contexts,
                bus: _bus,
                version: internalConfig.version,
                userConfig: userConfig,
                done: function () {
                    _logger === null || _logger === void 0 ? void 0 : _logger.info("done called by user...");
                    return _connection.logout();
                }
            };
            glue.performance = {
                get glueVer() {
                    return internalConfig.version;
                },
                get glueConfig() {
                    return JSON.stringify(userConfig);
                },
                get browser() {
                    return window.performance.timing.toJSON();
                },
                get memory() {
                    return window.performance.memory;
                },
                get initTimes() {
                    var all = getAllTimers();
                    return Object.keys(all).map(function (key) {
                        var t = all[key];
                        return {
                            name: key,
                            duration: t.endTime - t.startTime,
                            marks: t.marks,
                            startTime: t.startTime,
                            endTime: t.endTime
                        };
                    });
                }
            };
            Object.keys(libs).forEach(function (key) {
                var lib = libs[key];
                glue[key] = lib;
            });
            glue.config = {};
            Object.keys(internalConfig).forEach(function (k) {
                glue.config[k] = internalConfig[k];
            });
            if (ext && ext.extOptions) {
                Object.keys(ext.extOptions).forEach(function (k) {
                    glue.config[k] = ext === null || ext === void 0 ? void 0 : ext.extOptions[k];
                });
            }
            if (ext === null || ext === void 0 ? void 0 : ext.enrichGlue) {
                ext.enrichGlue(glue);
            }
            if (iodesktop && iodesktop.updatePerfData) {
                iodesktop.updatePerfData(glue.performance);
            }
            if (glue.agm) {
                var deprecatedDecorator = function (fn, wrong, proper) {
                    return function () {
                        glue.logger.warn("glue.js - 'glue.agm.".concat(wrong, "' method is deprecated, use 'glue.interop.").concat(proper, "' instead."));
                        return fn.apply(glue.agm, arguments);
                    };
                };
                var agmAny = glue.agm;
                agmAny.method_added = deprecatedDecorator(glue.agm.methodAdded, "method_added", "methodAdded");
                agmAny.method_removed = deprecatedDecorator(glue.agm.methodRemoved, "method_removed", "methodRemoved");
                agmAny.server_added = deprecatedDecorator(glue.agm.serverAdded, "server_added", "serverAdded");
                agmAny.server_method_aded = deprecatedDecorator(glue.agm.serverMethodAdded, "server_method_aded", "serverMethodAdded");
                agmAny.server_method_removed = deprecatedDecorator(glue.agm.serverMethodRemoved, "server_method_removed", "serverMethodRemoved");
            }
            return glue;
        }
        function registerInstanceIfNeeded() {
            return __awaiter(this, void 0, void 0, function () {
                var RegisterInstanceMethodName, isMethodAvailable, error_1, typedError;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            RegisterInstanceMethodName = "T42.ACS.RegisterInstance";
                            if (!(Utils.isNode() && typeof process.env._GD_STARTING_CONTEXT_ === "undefined" && typeof (userConfig === null || userConfig === void 0 ? void 0 : userConfig.application) !== "undefined")) return [3, 4];
                            isMethodAvailable = _interop.methods({ name: RegisterInstanceMethodName }).length > 0;
                            if (!isMethodAvailable) return [3, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, _interop.invoke(RegisterInstanceMethodName, { appName: userConfig === null || userConfig === void 0 ? void 0 : userConfig.application, pid: process.pid })];
                        case 2:
                            _a.sent();
                            return [3, 4];
                        case 3:
                            error_1 = _a.sent();
                            typedError = error_1;
                            _logger.error("Cannot register as an instance: ".concat(JSON.stringify(typedError.message)));
                            return [3, 4];
                        case 4: return [2];
                    }
                });
            });
        }
        return preloadPromise
            .then(setupLogger)
            .then(setupConnection)
            .then(function () { return Promise.all([setupMetrics(), setupInterop(), setupContexts(), setupBus()]); })
            .then(function () { return _interop.readyPromise; })
            .then(function () { return registerInstanceIfNeeded(); })
            .then(function () {
            return setupExternalLibs(internalConfig.libs || []);
        })
            .then(waitForLibs)
            .then(constructGlueObject)
            .catch(function (err) {
            return Promise.reject({
                err: err,
                libs: libs
            });
        });
    };
    if (typeof window !== "undefined") {
        window.IOConnectCore = IOConnectCoreFactory;
    }
    IOConnectCoreFactory.version = version;
    IOConnectCoreFactory.default = IOConnectCoreFactory;

    const iOConnectBrowserFactory = createFactoryFunction(IOConnectCoreFactory);
    if (typeof window !== "undefined") {
        const windowAny = window;
        windowAny.IOBrowser = iOConnectBrowserFactory;
        delete windowAny.GlueCore;
        delete windowAny.IOConnectCore;
    }
    const legacyGlobal = window.glue42gd || window.glue42core;
    const ioGlobal = window.iodesktop || window.iobrowser;
    if (!legacyGlobal && !ioGlobal) {
        window.iobrowser = { webStarted: false };
    }
    iOConnectBrowserFactory.version = version$2;

    return iOConnectBrowserFactory;

}));
//# sourceMappingURL=browser.umd.js.map
