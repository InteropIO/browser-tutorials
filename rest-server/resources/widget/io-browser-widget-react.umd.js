(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-dom')) :
    typeof define === 'function' && define.amd ? define(['react', 'react-dom'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["io-browser-widget-react"] = factory(global.React, global.ReactDOM));
})(this, (function (i, require$$0) { 'use strict';

    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }

    var i__namespace = /*#__PURE__*/_interopNamespaceDefault(i);
    var require$$0__namespace = /*#__PURE__*/_interopNamespaceDefault(require$$0);

    const GLUE42_EVENT_NAME = "Glue42";
    const WIDGET_READY = "widgetFactoryReady";
    const REQUEST_WIDGET_READY = "requestWidgetFactoryReady";

    class EventController {
        events = {
            [REQUEST_WIDGET_READY]: { name: REQUEST_WIDGET_READY, handle: this.handleWidgetReadyRequest.bind(this) },
        };
        wireCustomEventListener = () => {
            window.addEventListener(GLUE42_EVENT_NAME, this.handleMessage.bind(this));
        };
        notifyStarted() {
            this.send(WIDGET_READY);
        }
        handleMessage(event) {
            const data = event.detail;
            if (!data?.glue42) {
                return;
            }
            const eventName = data.glue42.event;
            const foundHandler = this.events[eventName];
            if (!foundHandler) {
                return;
            }
            foundHandler.handle(data.glue42.message);
        }
        handleWidgetReadyRequest() {
            this.send(WIDGET_READY);
        }
        send(eventName, message) {
            const payload = { glue42: { event: eventName, message } };
            const event = new CustomEvent(GLUE42_EVENT_NAME, { detail: payload });
            window.dispatchEvent(event);
        }
    }

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
        return (__assign({ at: newAt + (at || '') }, rest));
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
    Decoder.string;
    /** See `Decoder.number` */
    Decoder.number;
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
    Decoder.array;
    /** See `Decoder.tuple` */
    Decoder.tuple;
    /** See `Decoder.dict` */
    Decoder.dict;
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

    const channelSelectorTypeDecoder = oneOf(constant("directional"), constant("default"));
    const channelSelectorDecoder = object({
        type: optional(channelSelectorTypeDecoder),
        enable: optional(boolean())
    });
    const positionDecoder = oneOf(constant("top"), constant("bottom"), constant("left"), constant("right"));
    const modeDecoder = oneOf(constant("default"), constant("compact"));
    const displayModeDecoder = oneOf(constant("all"), constant("fdc3"));
    const channelsDecoder = object({
        selector: optional(channelSelectorDecoder),
        displayMode: optional(displayModeDecoder)
    });
    const configDecoder = object({
        rootElement: anyJson(),
        enable: boolean(),
        channels: optional(channelsDecoder),
        position: optional(positionDecoder),
        mode: optional(modeDecoder),
        displayInWorkspace: optional(boolean())
    });

    const browserPlatformMethodName = "T42.Web.Platform.Control";

    class Bridge {
        io;
        defaultTransportTimeout = 30000;
        logger;
        constructor(io) {
            this.io = io;
            const windowId = io.windows.my().id;
            this.logger = io.logger.subLogger(`widget.bridge-${windowId}`);
        }
        async initiate() {
            const browserGlobal = window.glue42core || window.iobrowser;
            if (!browserGlobal) {
                const errorMsg = "App is not running in IO.Connect.Browser environment";
                this.logger.trace(errorMsg);
                return { success: false, reason: errorMsg };
            }
            const res = await this.checkPlatformMethodsExist();
            this.logger.trace(`Bridge initiated successfully`);
            return res;
        }
        async send(operation, domain, operationArguments, options) {
            const browserGlobal = window.glue42core || window.iobrowser;
            const platformTarget = browserGlobal.communicationId;
            const invocationArguments = { operation, domain, data: operationArguments };
            const operationSupported = options?.includeOperationCheck ? (await this.checkOperationSupported(operation, domain)).isSupported : true;
            if (!operationSupported) {
                throw new Error(`Cannot complete operation: ${operation} for domain: ${domain} because this client is connected to a platform which does not support it`);
            }
            let invocationResult;
            const baseErrorMessage = `Internal Widget Communication Error. Attempted operation: ${JSON.stringify(invocationArguments)}. `;
            try {
                invocationResult = await this.io.interop.invoke(browserPlatformMethodName, invocationArguments, platformTarget ? { instance: platformTarget } : "best", { methodResponseTimeoutMs: this.defaultTransportTimeout });
                if (!invocationResult) {
                    throw new Error("Received unsupported result from Platform - empty result");
                }
                if (!Array.isArray(invocationResult.all_return_values) || invocationResult.all_return_values.length === 0) {
                    throw new Error("Received unsupported result from Platform - empty values collection");
                }
            }
            catch (error) {
                if (error?.all_errors?.length) {
                    const invocationErrorMessage = error.all_errors[0].message;
                    throw new Error(`${baseErrorMessage} -> Inner message: ${invocationErrorMessage}`);
                }
                throw new Error(`${baseErrorMessage} -> Inner message: ${error.message}`);
            }
            return invocationResult.all_return_values[0].returned;
        }
        async checkOperationSupported(operation, domain) {
            try {
                const result = await this.send("operationCheck", domain, { operation });
                return result;
            }
            catch (error) {
                return { isSupported: false };
            }
        }
        async checkPlatformMethodsExist() {
            const workspacesInitCheckSupported = await this.checkOperationSupported("workspacesInitCheck", "system");
            if (!workspacesInitCheckSupported.isSupported) {
                const errorMsg = `IO.Connect Browser Platform is an older version and does not support 'workspacesInitCheck' operation for 'system' domain`;
                this.logger.trace(errorMsg);
                return { success: false, reason: errorMsg };
            }
            return { success: true };
        }
    }

    var createRoot;

    var m$1 = require$$0;
    {
      createRoot = m$1.createRoot;
      m$1.hydrateRoot;
    }

    const drop = (e, setSelectedPosition) => {
        e.preventDefault();
        const x = e.clientX;
        const y = e.clientY;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;
        let position;
        if (x < centerX && y < centerY) {
            position = centerX - x < centerY - y ? "top" : "left";
        }
        else if (x < centerX && y > centerY) {
            position = Math.abs(centerY - y) < x ? "bottom" : "left";
        }
        else if (x > centerX && y < centerY) {
            position = screenWidth - x < y ? "right" : "top";
        }
        else {
            position = screenWidth - x < screenHeight - y ? "right" : "bottom";
        }
        setSelectedPosition(position);
    };

    const DragSection = () => {
        return (i.createElement("div", { className: "drag-element" },
            i.createElement("div", null),
            i.createElement("div", null),
            i.createElement("div", null),
            i.createElement("div", null),
            i.createElement("div", null),
            i.createElement("div", null),
            i.createElement("div", null),
            i.createElement("div", null)));
    };

    var jsxRuntime = {exports: {}};

    var reactJsxRuntime_production_min = {};

    /**
     * @license React
     * react-jsx-runtime.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var f=i,k$1=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
    function q$1(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k$1,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q$1;reactJsxRuntime_production_min.jsxs=q$1;

    {
      jsxRuntime.exports = reactJsxRuntime_production_min;
    }

    var jsxRuntimeExports = jsxRuntime.exports;

    var propTypes = {exports: {}};

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

    var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactPropTypesSecret = ReactPropTypesSecret_1;

    function emptyFunction() {}
    function emptyFunctionWithReset() {}
    emptyFunctionWithReset.resetWarningCache = emptyFunction;

    var factoryWithThrowingShims = function() {
      function shim(props, propName, componentName, location, propFullName, secret) {
        if (secret === ReactPropTypesSecret) {
          // It is still safe when called from React.
          return;
        }
        var err = new Error(
          'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
          'Use PropTypes.checkPropTypes() to call them. ' +
          'Read more at http://fb.me/use-check-prop-types'
        );
        err.name = 'Invariant Violation';
        throw err;
      }  shim.isRequired = shim;
      function getShim() {
        return shim;
      }  // Important!
      // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
      var ReactPropTypes = {
        array: shim,
        bigint: shim,
        bool: shim,
        func: shim,
        number: shim,
        object: shim,
        string: shim,
        symbol: shim,

        any: shim,
        arrayOf: getShim,
        element: shim,
        elementType: shim,
        instanceOf: getShim,
        node: shim,
        objectOf: getShim,
        oneOf: getShim,
        oneOfType: getShim,
        shape: getShim,
        exact: getShim,

        checkPropTypes: emptyFunctionWithReset,
        resetWarningCache: emptyFunction
      };

      ReactPropTypes.PropTypes = ReactPropTypes;

      return ReactPropTypes;
    };

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    {
      // By explicitly using `prop-types` you are opting into new production behavior.
      // http://fb.me/prop-types-in-prod
      propTypes.exports = factoryWithThrowingShims();
    }

    var propTypesExports = propTypes.exports;

    const extractErrorMsg = (error) => {
        const errorMessage = error.message ? JSON.stringify(error.message) : JSON.stringify(error);
        const stringError = typeof error === "string" ? error : errorMessage;
        return stringError;
    };

    const useIOConnectInit = (settings, onInitError) => {
        const [io, setIOConnect] = i.useState(null);
        i.useEffect(() => {
            const initialize = async () => {
                try {
                    if (settings.browser && settings.browserPlatform) {
                        throw new Error("Cannot initialize, because the settings are over-specified: defined are both browser and browserPlatform. Please set one or the other");
                    }
                    const isDesktop = (typeof window.glue42gd !== "undefined") || (typeof window.iodesktop !== "undefined");
                    if (isDesktop) {
                        const factory = settings.desktop?.factory || settings.browser?.factory || settings.browserPlatform?.factory || window.Glue;
                        const config = settings.desktop?.config || settings.browser?.config || settings.browserPlatform?.config;
                        const factoryResult = await factory(config);
                        setIOConnect(factoryResult.io || factoryResult.glue || factoryResult);
                        return;
                    }
                    const config = settings.browser?.config || settings.browserPlatform?.config;
                    const factory = settings.browser?.factory || settings.browserPlatform?.factory || window.IOBrowser || window.IOBrowserPlatform;
                    const factoryResult = await factory(config);
                    setIOConnect(factoryResult.io || factoryResult.glue || factoryResult);
                }
                catch (error) {
                    console.error(error);
                    onInitError?.(error instanceof Error ? error : new Error(extractErrorMsg(error)));
                }
            };
            initialize();
        }, []);
        return io;
    };

    const IOConnectContext = i.createContext(null);
    const IOConnectProvider = i.memo(({ children, fallback = null, settings = {}, onInitError }) => {
        const glue = useIOConnectInit(settings, onInitError);
        return glue ? (i.createElement(IOConnectContext.Provider, { value: glue }, children)) : (i.createElement(i.Fragment, null, fallback));
    });
    IOConnectProvider.propTypes = {
        children: propTypesExports.node,
        settings: propTypesExports.object,
        fallback: propTypesExports.node,
    };
    IOConnectProvider.displayName = 'IOConnectProvider';

    function y(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var w,b={exports:{}};
    /*!
    	Copyright (c) 2018 Jed Watson.
    	Licensed under the MIT License (MIT), see
    	http://jedwatson.github.io/classnames
    */w=b,function(){var e={}.hasOwnProperty;function t(){for(var e="",t=0;t<arguments.length;t++){var o=arguments[t];o&&(e=i(e,n(o)));}return e}function n(n){if("string"==typeof n||"number"==typeof n)return n;if("object"!=typeof n)return "";if(Array.isArray(n))return t.apply(null,n);if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]"))return n.toString();var o="";for(var r in n)e.call(n,r)&&n[r]&&(o=i(o,r));return o}function i(e,t){return t?e?e+" "+t:e+t:e}w.exports?(t.default=t,w.exports=t):window.classNames=t;}();var k=y(b.exports);function C({className:t,size:n="16",variant:i="workspace",...o}){const r=k("icon",n&&[`icon-size-${n}`],t);return jsxRuntimeExports.jsx("span",{className:r,...o,children:jsxRuntimeExports.jsx("i",{className:`icon-${i}`})})}const N=i.forwardRef((({className:t,variant:n="default",icon:i$1="workspace",size:o="16",iconSize:a="16",onClick:s,disabled:c,children:l,...u},d)=>{const f=k("io-btn-icon","default"!==n&&[`io-btn-icon-${n}`],[`io-btn-icon-size-${o}`],t),m=i.useCallback((e=>{if(!c)return s?s(e):void 0;e.preventDefault();}),[s,c]);return jsxRuntimeExports.jsx("button",{className:f,type:"button",ref:d,"aria-label":"button",onClick:m,disabled:c,...u,children:l??(i$1&&jsxRuntimeExports.jsx(C,{variant:i$1,size:a}))})}));N.displayName="ButtonIcon";function D({className:t,variant:n="default",children:i,...o}){const r=k("io-badge","default"!==n&&[`io-badge-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:i})}function E({className:t,tag:n="h2",size:i="normal",text:o="Title",...r}){const a=n,s=k("small"===i&&"io-title-semibold","normal"===i&&"io-title","large"===i&&"io-title-large",t);return jsxRuntimeExports.jsx(a,{className:s,...r,children:o})}function I({className:n,title:i,titleSize:o="normal",tag:r,hint:a,children:s,...c}){const l=k("io-block",n);return jsxRuntimeExports.jsxs("div",{className:l,...c,children:[i&&jsxRuntimeExports.jsx(E,{tag:r,text:i,size:o}),s,a&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:a})]})}const A=i.forwardRef((({className:n,variant:i$1="default",size:o="normal",icon:a,iconSize:s="12",iconRight:c=false,text:l,onClick:u,disabled:d,children:f,...m},h)=>{const p=k("io-btn",("primary"===i$1||"critical"===i$1||"outline"===i$1||"link"===i$1)&&[`io-btn-${i$1}`],"large"===o&&"io-btn-lg",n),g=i.useCallback((e=>{if(!d)return u?u(e):void 0;e.preventDefault();}),[u,d]);return jsxRuntimeExports.jsxs("button",{className:p,ref:h,type:"button","aria-label":"button",onClick:g,disabled:d,tabIndex:0,...m,children:[a&&!c&&jsxRuntimeExports.jsx(C,{variant:a,size:s}),f??l,a&&c&&jsxRuntimeExports.jsx(C,{variant:a,size:s})]})}));A.displayName="Button";const M=i.createContext({});const T=i.forwardRef((({size:t="32",...n},i$1)=>{const{handleOpen:o,disabled:a}=i.useContext(M),c=i.useCallback((()=>{o&&o();}),[o]);return jsxRuntimeExports.jsx(N,{ref:i$1,size:t,onClick:c,disabled:a,...n})}));function P({className:t,...n}){const{handleOpen:i$1}=i.useContext(M),o=k("io-dropdown-content",t),a=i.useCallback((e=>{e.stopPropagation(),i$1&&i$1();}),[i$1]);return jsxRuntimeExports.jsx("div",{className:o,role:"button",onClick:a,...n})}T.displayName="DropdownButtonIcon";const _=i.createContext({}),O=i.forwardRef(((n,i$1)=>{const{className:o,prepend:r,append:a,isSelected:c,onClick:l,description:u,disabled:d=false,children:f,tooltip:m,...h}=n,{variant:p="default",selected:g,checkIcon:v,handleItemClick:y}=i.useContext(_),w=c??g?.some((e=>e.children===f)),b="default"!==p&&!!v,N=b||r,x=k("io-list-item",N&&"io-list-item-left",a&&"io-list-item-right","default"!==p&&w&&"selected",u&&"io-list-item-description",d&&"io-list-item-disabled",o);return jsxRuntimeExports.jsxs("li",{className:x,ref:i$1,role:"menuitem","aria-roledescription":"menuitem",tabIndex:0,onClick:e=>{d?e.preventDefault():(y?.(e,{children:f}),l?.(e));},...h,children:[N&&jsxRuntimeExports.jsxs("div",{className:"io-list-left-column",children:[b&&jsxRuntimeExports.jsx(C,{variant:v.variant,title:w?v.tooltip:void 0}),r]}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:m,children:f}),a&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:a}),u&&jsxRuntimeExports.jsx("div",{className:"io-list-text-description",children:u})]})}));O.displayName="ListItem";const L=i.forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},c)=>{const l=k("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-title",n);return jsxRuntimeExports.jsxs("li",{className:l,ref:c,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));L.displayName="ListItemTitle";const F=i.forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},c)=>{const l=k("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-section",n);return jsxRuntimeExports.jsxs("li",{className:l,ref:c,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));F.displayName="ListItemSection";const B=i.forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},c)=>{const l=k("io-list-item-header",n);return jsxRuntimeExports.jsxs("div",{className:l,ref:c,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));B.displayName="ListItemHeader";const R=i.forwardRef((({className:t,children:n,...i},o)=>{const r=k("io-list-item","io-list-with-sub-items",t);return jsxRuntimeExports.jsx("li",{className:r,ref:o,...i,children:n})}));R.displayName="ListItemWithSubItems";const j=i.forwardRef(((t,n)=>{const{className:i$1,variant:o="default",checkIcon:a,children:s,...u}=t,[d,f]=i.useState([]),m=k("io-list","default"!==o&&"io-list-selectable",i$1),h=i.useMemo((()=>{if(a)return "object"==typeof a?a:{variant:a}}),[a]),p=i.useCallback(((e,t)=>{if("default"===o)return;const n=d.some((e=>e.children?.toString()===t.children?.toString()));"single"===o?f([t]):(()=>{const e=n?d.filter((e=>e.children!==t.children)):[...d,t];f(e);})();}),[d,o]),g=i.useMemo((()=>({variant:o,selected:d,checkIcon:h,handleItemClick:p})),[o,d,h,p]);return jsxRuntimeExports.jsx(_.Provider,{value:g,children:jsxRuntimeExports.jsx("ul",{className:m,ref:n,...u,children:s})})}));j.displayName="List";const H=j;function z(e,t){i.useEffect((()=>{const n=n=>{e.current&&!e.current.contains(n.target)&&t();};return document.addEventListener("mousedown",n),()=>{document.removeEventListener("mousedown",n);}}),[e,t]);}function $({className:t,variant:n="outline",align:i$1="down",disabled:o,children:a,...s}){const[u,f]=i.useState(false),m=i.useRef(null),h=k("io-dropdown",u&&"io-dropdown-open","default"!==n&&[`io-dropdown-${n}`],t),p=i.useCallback((()=>{f(!u);}),[u]);z(m,i.useCallback((()=>{f(false);}),[]));const g=i.useMemo((()=>({isOpen:u,handleOpen:p,variant:n,align:i$1,disabled:o})),[u,p,n,i$1,o]);return jsxRuntimeExports.jsx(M.Provider,{value:g,children:jsxRuntimeExports.jsx("div",{className:h,ref:m,...s,children:a})})}function V({className:t,variant:n="default",align:i="left",children:o,...r}){const a=k("io-btn-group","sticky"===n&&"io-btn-group-sticky","append"===n&&"io-btn-group-append","fullwidth"===n&&"io-btn-group-fullwidth","right"===i&&"io-btn-group-right",t);return jsxRuntimeExports.jsx("div",{className:a,...r,children:o})}function Y({className:t,draggable:n=false,children:i,...o}){const r=k("io-header",n&&["draggable"],t);return jsxRuntimeExports.jsx("header",{className:r,style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--spacing-8)"},...o,children:i})}function U({className:t,children:n,...i}){const o=k("io-dialog-header",t);return jsxRuntimeExports.jsx(Y,{"data-testid":"io-dialog-header",className:o,...i,children:n})}function W({className:t,children:n,...i}){const o=k("io-dialog-body",t);return jsxRuntimeExports.jsx("div",{"data-testid":"io-dialog-body",className:o,...i,children:n})}function J({className:t,children:n,...i}){const o=k("io-footer",t);return jsxRuntimeExports.jsx("footer",{className:o,...i,children:n})}function q({className:t,...n}){const i=k("io-dialog-footer",t);return jsxRuntimeExports.jsx(J,{"data-testid":"io-dialog-footer",className:i,...n})}function G(){return "undefined"!=typeof window}function Q(e){return ee(e)?(e.nodeName||"").toLowerCase():"#document"}function X(e){var t;return (null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function Z(e){var t;return null==(t=(ee(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function ee(e){return !!G()&&(e instanceof Node||e instanceof X(e).Node)}function te(e){return !!G()&&(e instanceof Element||e instanceof X(e).Element)}function ne(e){return !!G()&&(e instanceof HTMLElement||e instanceof X(e).HTMLElement)}function ie(e){return !(!G()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof X(e).ShadowRoot)}function oe(e){const{overflow:t,overflowX:n,overflowY:i,display:o}=ue(e);return /auto|scroll|overlay|hidden|clip/.test(t+i+n)&&!["inline","contents"].includes(o)}function re(e){return ["table","td","th"].includes(Q(e))}function ae(e){return [":popover-open",":modal"].some((t=>{try{return e.matches(t)}catch(e){return  false}}))}function se(e){const t=ce(),n=te(e)?ue(e):e;return "none"!==n.transform||"none"!==n.perspective||!!n.containerType&&"normal"!==n.containerType||!t&&!!n.backdropFilter&&"none"!==n.backdropFilter||!t&&!!n.filter&&"none"!==n.filter||["transform","perspective","filter"].some((e=>(n.willChange||"").includes(e)))||["paint","layout","strict","content"].some((e=>(n.contain||"").includes(e)))}function ce(){return !("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function le(e){return ["html","body","#document"].includes(Q(e))}function ue(e){return X(e).getComputedStyle(e)}function de(e){return te(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function fe(e){if("html"===Q(e))return e;const t=e.assignedSlot||e.parentNode||ie(e)&&e.host||Z(e);return ie(t)?t.host:t}function me(e){const t=fe(e);return le(t)?e.ownerDocument?e.ownerDocument.body:e.body:ne(t)&&oe(t)?t:me(t)}function he(e,t,n){var i;void 0===t&&(t=[]),void 0===n&&(n=true);const o=me(e),r=o===(null==(i=e.ownerDocument)?void 0:i.body),a=X(o);if(r){const e=function(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}(a);return t.concat(a,a.visualViewport||[],oe(o)?o:[],e&&n?he(e):[])}return t.concat(o,he(o,[],n))}function pe(e){let t=e.activeElement;for(;null!=(null==(n=t)||null==(n=n.shadowRoot)?void 0:n.activeElement);){var n;t=t.shadowRoot.activeElement;}return t}function ge(e,t){if(!e||!t)return  false;const n=null==t.getRootNode?void 0:t.getRootNode();if(e.contains(t))return  true;if(n&&ie(n)){let n=t;for(;n;){if(e===n)return  true;n=n.parentNode||n.host;}}return  false}function ve(){const e=navigator.userAgentData;return null!=e&&e.platform?e.platform:navigator.platform}function ye(){const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map((e=>{let{brand:t,version:n}=e;return t+"/"+n})).join(" "):navigator.userAgent}function we(e){return !(0!==e.mozInputSource||!e.isTrusted)||(Ce()&&e.pointerType?"click"===e.type&&1===e.buttons:0===e.detail&&!e.pointerType)}function be(e){return !ye().includes("jsdom/")&&(!Ce()&&0===e.width&&0===e.height||Ce()&&1===e.width&&1===e.height&&0===e.pressure&&0===e.detail&&"mouse"===e.pointerType||e.width<1&&e.height<1&&0===e.pressure&&0===e.detail&&"touch"===e.pointerType)}function ke(){return /apple/i.test(navigator.vendor)}function Ce(){const e=/android/i;return e.test(ve())||e.test(ye())}function Ne(e,t){const n=["mouse","pen"];return t||n.push("",void 0),n.includes(e)}function xe(e){return (null==e?void 0:e.ownerDocument)||document}function Se(e,t){if(null==t)return  false;if("composedPath"in e)return e.composedPath().includes(t);const n=e;return null!=n.target&&t.contains(n.target)}function De(e){return "composedPath"in e?e.composedPath()[0]:e.target}H.Item=O,H.ItemTitle=L,H.ItemSection=F,H.ItemHeader=B,H.ItemWithSubItems=R,$.Button=function({icon:t="chevron-down",...n}){const{handleOpen:i$1,disabled:o}=i.useContext(M),a=i.useCallback((e=>{e.stopPropagation(),i$1&&i$1();}),[i$1]);return jsxRuntimeExports.jsx(A,{icon:t,iconRight:true,onClick:a,disabled:o,...n})},$.ButtonIcon=T,$.Content=P,$.List=H,$.Item=O,$.ItemTitle=L,$.ItemSection=F,V.Button=A,V.ButtonIcon=N,V.Dropdown=$,Y.Title=E,Y.ButtonGroup=V,Y.Button=A,Y.ButtonIcon=N,Y.Dropdown=$,U.Title=E,U.ButtonGroup=V,U.Button=A,U.ButtonIcon=N,U.Dropdown=$,W.Content=function({className:t,children:n,...i}){const o=k("io-dialog-content",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})},J.ButtonGroup=V,J.Button=A,J.ButtonIcon=N,J.Dropdown=$,q.ButtonGroup=V,q.Button=A,q.ButtonIcon=N,q.Dropdown=$;const Ee="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function Ie(e){return ne(e)&&e.matches(Ee)}function Ae(e){e.preventDefault(),e.stopPropagation();}function Me(e){return !!e&&("combobox"===e.getAttribute("role")&&Ie(e))}const Te=Math.min,Pe=Math.max,_e=Math.round,Oe=Math.floor,Le=e=>({x:e,y:e}),Fe={left:"right",right:"left",bottom:"top",top:"bottom"},Be={start:"end",end:"start"};function Re(e,t,n){return Pe(e,Te(t,n))}function je(e,t){return "function"==typeof e?e(t):e}function He(e){return e.split("-")[0]}function ze(e){return e.split("-")[1]}function $e(e){return "x"===e?"y":"x"}function Ve(e){return "y"===e?"height":"width"}function Ye(e){return ["top","bottom"].includes(He(e))?"y":"x"}function Ue(e){return $e(Ye(e))}function We(e){return e.replace(/start|end/g,(e=>Be[e]))}function Je(e){return e.replace(/left|right|bottom|top/g,(e=>Fe[e]))}function qe(e){const{x:t,y:n,width:i,height:o}=e;return {width:i,height:o,top:n,left:t,right:t+i,bottom:n+o,x:t,y:n}}
    /*!
    * tabbable 6.2.0
    * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
    */var Ke=["input:not([inert])","select:not([inert])","textarea:not([inert])","a[href]:not([inert])","button:not([inert])","[tabindex]:not(slot):not([inert])","audio[controls]:not([inert])","video[controls]:not([inert])",'[contenteditable]:not([contenteditable="false"]):not([inert])',"details>summary:first-of-type:not([inert])","details:not([inert])"].join(","),Ge="undefined"==typeof Element,Qe=Ge?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,Xe=!Ge&&Element.prototype.getRootNode?function(e){var t;return null==e||null===(t=e.getRootNode)||void 0===t?void 0:t.call(e)}:function(e){return null==e?void 0:e.ownerDocument},Ze=function e(t,n){var i;void 0===n&&(n=true);var o=null==t||null===(i=t.getAttribute)||void 0===i?void 0:i.call(t,"inert");return ""===o||"true"===o||n&&t&&e(t.parentNode)},et=function e(t,n,i){for(var o=[],r=Array.from(t);r.length;){var a=r.shift();if(!Ze(a,false))if("SLOT"===a.tagName){var s=a.assignedElements(),c=e(s.length?s:a.children,true,i);i.flatten?o.push.apply(o,c):o.push({scopeParent:a,candidates:c});}else {Qe.call(a,Ke)&&i.filter(a)&&(n||!t.includes(a))&&o.push(a);var l=a.shadowRoot||"function"==typeof i.getShadowRoot&&i.getShadowRoot(a),u=!Ze(l,false)&&(!i.shadowRootFilter||i.shadowRootFilter(a));if(l&&u){var d=e(true===l?a.children:l.children,true,i);i.flatten?o.push.apply(o,d):o.push({scopeParent:a,candidates:d});}else r.unshift.apply(r,a.children);}}return o},tt=function(e){return !isNaN(parseInt(e.getAttribute("tabindex"),10))},nt=function(e){if(!e)throw new Error("No node provided");return e.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||function(e){var t,n=null==e||null===(t=e.getAttribute)||void 0===t?void 0:t.call(e,"contenteditable");return ""===n||"true"===n}(e))&&!tt(e)?0:e.tabIndex},it=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},ot=function(e){return "INPUT"===e.tagName},rt=function(e){return function(e){return ot(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return  true;var t,n=e.form||Xe(e),i=function(e){return n.querySelectorAll('input[type="radio"][name="'+e+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=i(window.CSS.escape(e.name));else try{t=i(e.name);}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),false}var o=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form);return !o||o===e}(e)},at=function(e){var t=e.getBoundingClientRect(),n=t.width,i=t.height;return 0===n&&0===i},st=function(e,t){var n=t.displayCheck,i=t.getShadowRoot;if("hidden"===getComputedStyle(e).visibility)return  true;var o=Qe.call(e,"details>summary:first-of-type")?e.parentElement:e;if(Qe.call(o,"details:not([open]) *"))return  true;if(n&&"full"!==n&&"legacy-full"!==n){if("non-zero-area"===n)return at(e)}else {if("function"==typeof i){for(var r=e;e;){var a=e.parentElement,s=Xe(e);if(a&&!a.shadowRoot&&true===i(a))return at(e);e=e.assignedSlot?e.assignedSlot:a||s===e.ownerDocument?a:s.host;}e=r;}if(function(e){var t,n,i,o,r=e&&Xe(e),a=null===(t=r)||void 0===t?void 0:t.host,s=false;if(r&&r!==e)for(s=!!(null!==(n=a)&&void 0!==n&&null!==(i=n.ownerDocument)&&void 0!==i&&i.contains(a)||null!=e&&null!==(o=e.ownerDocument)&&void 0!==o&&o.contains(e));!s&&a;){var c,l,u;s=!(null===(l=a=null===(c=r=Xe(a))||void 0===c?void 0:c.host)||void 0===l||null===(u=l.ownerDocument)||void 0===u||!u.contains(a));}return s}(e))return !e.getClientRects().length;if("legacy-full"!==n)return  true}return  false},ct=function(e,t){return !(t.disabled||Ze(t)||function(e){return ot(e)&&"hidden"===e.type}(t)||st(t,e)||function(e){return "DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some((function(e){return "SUMMARY"===e.tagName}))}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var n=0;n<t.children.length;n++){var i=t.children.item(n);if("LEGEND"===i.tagName)return !!Qe.call(t,"fieldset[disabled] *")||!i.contains(e)}return  true}t=t.parentElement;}return  false}(t))},lt=function(e,t){return !(rt(t)||nt(t)<0||!ct(e,t))},ut=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return !!(isNaN(t)||t>=0)},dt=function e(t){var n=[],i=[];return t.forEach((function(t,o){var r=!!t.scopeParent,a=r?t.scopeParent:t,s=function(e,t){var n=nt(e);return n<0&&t&&!tt(e)?0:n}(a,r),c=r?e(t.candidates):a;0===s?r?n.push.apply(n,c):n.push(a):i.push({documentOrder:o,tabIndex:s,item:t,isScope:r,content:c});})),i.sort(it).reduce((function(e,t){return t.isScope?e.push.apply(e,t.content):e.push(t.content),e}),[]).concat(n)},ft=function(e,t){var n;return n=(t=t||{}).getShadowRoot?et([e],t.includeContainer,{filter:lt.bind(null,t),flatten:false,getShadowRoot:t.getShadowRoot,shadowRootFilter:ut}):function(e,t,n){if(Ze(e))return [];var i=Array.prototype.slice.apply(e.querySelectorAll(Ke));return t&&Qe.call(e,Ke)&&i.unshift(e),i.filter(n)}(e,t.includeContainer,lt.bind(null,t)),dt(n)},mt=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return  false!==Qe.call(e,Ke)&&lt(t,e)};function ht(e,t,n){let{reference:i,floating:o}=e;const r=Ye(t),a=Ue(t),s=Ve(a),c=He(t),l="y"===r,u=i.x+i.width/2-o.width/2,d=i.y+i.height/2-o.height/2,f=i[s]/2-o[s]/2;let m;switch(c){case "top":m={x:u,y:i.y-o.height};break;case "bottom":m={x:u,y:i.y+i.height};break;case "right":m={x:i.x+i.width,y:d};break;case "left":m={x:i.x-o.width,y:d};break;default:m={x:i.x,y:i.y};}switch(ze(t)){case "start":m[a]-=f*(n&&l?-1:1);break;case "end":m[a]+=f*(n&&l?-1:1);}return m}async function pt(e,t){var n;void 0===t&&(t={});const{x:i,y:o,platform:r,rects:a,elements:s,strategy:c}=e,{boundary:l="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:f=false,padding:m=0}=je(t,e),h=function(e){return "number"!=typeof e?function(e){return {top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}(m),p=s[f?"floating"===d?"reference":"floating":d],g=qe(await r.getClippingRect({element:null==(n=await(null==r.isElement?void 0:r.isElement(p)))||n?p:p.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(s.floating)),boundary:l,rootBoundary:u,strategy:c})),v="floating"===d?{x:i,y:o,width:a.floating.width,height:a.floating.height}:a.reference,y=await(null==r.getOffsetParent?void 0:r.getOffsetParent(s.floating)),w=await(null==r.isElement?void 0:r.isElement(y))&&await(null==r.getScale?void 0:r.getScale(y))||{x:1,y:1},b=qe(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:v,offsetParent:y,strategy:c}):v);return {top:(g.top-b.top+h.top)/w.y,bottom:(b.bottom-g.bottom+h.bottom)/w.y,left:(g.left-b.left+h.left)/w.x,right:(b.right-g.right+h.right)/w.x}}function gt(e){const t=ue(e);let n=parseFloat(t.width)||0,i=parseFloat(t.height)||0;const o=ne(e),r=o?e.offsetWidth:n,a=o?e.offsetHeight:i,s=_e(n)!==r||_e(i)!==a;return s&&(n=r,i=a),{width:n,height:i,$:s}}function vt(e){return te(e)?e:e.contextElement}function yt(e){const t=vt(e);if(!ne(t))return Le(1);const n=t.getBoundingClientRect(),{width:i,height:o,$:r}=gt(t);let a=(r?_e(n.width):n.width)/i,s=(r?_e(n.height):n.height)/o;return a&&Number.isFinite(a)||(a=1),s&&Number.isFinite(s)||(s=1),{x:a,y:s}}const wt=Le(0);function bt(e){const t=X(e);return ce()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:wt}function kt(e,t,n,i){ void 0===t&&(t=false),void 0===n&&(n=false);const o=e.getBoundingClientRect(),r=vt(e);let a=Le(1);t&&(i?te(i)&&(a=yt(i)):a=yt(e));const s=function(e,t,n){return void 0===t&&(t=false),!(!n||t&&n!==X(e))&&t}(r,n,i)?bt(r):Le(0);let c=(o.left+s.x)/a.x,l=(o.top+s.y)/a.y,u=o.width/a.x,d=o.height/a.y;if(r){const e=X(r),t=i&&te(i)?X(i):i;let n=e,o=n.frameElement;for(;o&&i&&t!==n;){const e=yt(o),t=o.getBoundingClientRect(),i=ue(o),r=t.left+(o.clientLeft+parseFloat(i.paddingLeft))*e.x,a=t.top+(o.clientTop+parseFloat(i.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=r,l+=a,n=X(o),o=n.frameElement;}}return qe({width:u,height:d,x:c,y:l})}const Ct=[":popover-open",":modal"];function Nt(e){return Ct.some((t=>{try{return e.matches(t)}catch(e){return  false}}))}function xt(e){return kt(Z(e)).left+de(e).scrollLeft}function St(e,t,n){let i;if("viewport"===t)i=function(e,t){const n=X(e),i=Z(e),o=n.visualViewport;let r=i.clientWidth,a=i.clientHeight,s=0,c=0;if(o){r=o.width,a=o.height;const e=ce();(!e||e&&"fixed"===t)&&(s=o.offsetLeft,c=o.offsetTop);}return {width:r,height:a,x:s,y:c}}(e,n);else if("document"===t)i=function(e){const t=Z(e),n=de(e),i=e.ownerDocument.body,o=Pe(t.scrollWidth,t.clientWidth,i.scrollWidth,i.clientWidth),r=Pe(t.scrollHeight,t.clientHeight,i.scrollHeight,i.clientHeight);let a=-n.scrollLeft+xt(e);const s=-n.scrollTop;return "rtl"===ue(i).direction&&(a+=Pe(t.clientWidth,i.clientWidth)-o),{width:o,height:r,x:a,y:s}}(Z(e));else if(te(t))i=function(e,t){const n=kt(e,true,"fixed"===t),i=n.top+e.clientTop,o=n.left+e.clientLeft,r=ne(e)?yt(e):Le(1);return {width:e.clientWidth*r.x,height:e.clientHeight*r.y,x:o*r.x,y:i*r.y}}(t,n);else {const n=bt(e);i={...t,x:t.x-n.x,y:t.y-n.y};}return qe(i)}function Dt(e,t){const n=fe(e);return !(n===t||!te(n)||le(n))&&("fixed"===ue(n).position||Dt(n,t))}function Et(e,t,n){const i=ne(t),o=Z(t),r="fixed"===n,a=kt(e,true,r,t);let s={scrollLeft:0,scrollTop:0};const c=Le(0);if(i||!i&&!r)if(("body"!==Q(t)||oe(o))&&(s=de(t)),i){const e=kt(t,true,r,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop;}else o&&(c.x=xt(o));return {x:a.left+s.scrollLeft-c.x,y:a.top+s.scrollTop-c.y,width:a.width,height:a.height}}function It(e){return "static"===ue(e).position}function At(e,t){return ne(e)&&"fixed"!==ue(e).position?t?t(e):e.offsetParent:null}function Mt(e,t){const n=X(e);if(Nt(e))return n;if(!ne(e)){let t=fe(e);for(;t&&!le(t);){if(te(t)&&!It(t))return t;t=fe(t);}return n}let i=At(e,t);for(;i&&re(i)&&It(i);)i=At(i,t);return i&&le(i)&&It(i)&&!se(i)?n:i||function(e){let t=fe(e);for(;ne(t)&&!le(t);){if(se(t))return t;if(ae(t))return null;t=fe(t);}return null}(e)||n}const Tt={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:n,offsetParent:i,strategy:o}=e;const r="fixed"===o,a=Z(i),s=!!t&&Nt(t.floating);if(i===a||s&&r)return n;let c={scrollLeft:0,scrollTop:0},l=Le(1);const u=Le(0),d=ne(i);if((d||!d&&!r)&&(("body"!==Q(i)||oe(a))&&(c=de(i)),ne(i))){const e=kt(i);l=yt(i),u.x=e.x+i.clientLeft,u.y=e.y+i.clientTop;}return {width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x,y:n.y*l.y-c.scrollTop*l.y+u.y}},getDocumentElement:Z,getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:i,strategy:o}=e;const r=[..."clippingAncestors"===n?Nt(t)?[]:function(e,t){const n=t.get(e);if(n)return n;let i=he(e,[],false).filter((e=>te(e)&&"body"!==Q(e))),o=null;const r="fixed"===ue(e).position;let a=r?fe(e):e;for(;te(a)&&!le(a);){const t=ue(a),n=se(a);n||"fixed"!==t.position||(o=null),(r?!n&&!o:!n&&"static"===t.position&&o&&["absolute","fixed"].includes(o.position)||oe(a)&&!n&&Dt(e,a))?i=i.filter((e=>e!==a)):o=t,a=fe(a);}return t.set(e,i),i}(t,this._c):[].concat(n),i],a=r[0],s=r.reduce(((e,n)=>{const i=St(t,n,o);return e.top=Pe(i.top,e.top),e.right=Te(i.right,e.right),e.bottom=Te(i.bottom,e.bottom),e.left=Pe(i.left,e.left),e}),St(t,a,o));return {width:s.right-s.left,height:s.bottom-s.top,x:s.left,y:s.top}},getOffsetParent:Mt,getElementRects:async function(e){const t=this.getOffsetParent||Mt,n=this.getDimensions,i=await n(e.floating);return {reference:Et(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){const{width:t,height:n}=gt(e);return {width:t,height:n}},getScale:yt,isElement:te,isRTL:function(e){return "rtl"===ue(e).direction}};function Pt(e,t,n,i){ void 0===i&&(i={});const{ancestorScroll:o=true,ancestorResize:r=true,elementResize:a="function"==typeof ResizeObserver,layoutShift:s="function"==typeof IntersectionObserver,animationFrame:c=false}=i,l=vt(e),u=o||r?[...l?he(l):[],...he(t)]:[];u.forEach((e=>{o&&e.addEventListener("scroll",n,{passive:true}),r&&e.addEventListener("resize",n);}));const d=l&&s?function(e,t){let n,i=null;const o=Z(e);function r(){var e;clearTimeout(n),null==(e=i)||e.disconnect(),i=null;}return function a(s,c){ void 0===s&&(s=false),void 0===c&&(c=1),r();const{left:l,top:u,width:d,height:f}=e.getBoundingClientRect();if(s||t(),!d||!f)return;const m={rootMargin:-Oe(u)+"px "+-Oe(o.clientWidth-(l+d))+"px "+-Oe(o.clientHeight-(u+f))+"px "+-Oe(l)+"px",threshold:Pe(0,Te(1,c))||1};let h=true;function p(e){const t=e[0].intersectionRatio;if(t!==c){if(!h)return a();t?a(false,t):n=setTimeout((()=>{a(false,1e-7);}),1e3);}h=false;}try{i=new IntersectionObserver(p,{...m,root:o.ownerDocument});}catch(e){i=new IntersectionObserver(p,m);}i.observe(e);}(true),r}(l,n):null;let f,m=-1,h=null;a&&(h=new ResizeObserver((e=>{let[i]=e;i&&i.target===l&&h&&(h.unobserve(t),cancelAnimationFrame(m),m=requestAnimationFrame((()=>{var e;null==(e=h)||e.observe(t);}))),n();})),l&&!c&&h.observe(l),h.observe(t));let p=c?kt(e):null;return c&&function t(){const i=kt(e);!p||i.x===p.x&&i.y===p.y&&i.width===p.width&&i.height===p.height||n();p=i,f=requestAnimationFrame(t);}(),n(),()=>{var e;u.forEach((e=>{o&&e.removeEventListener("scroll",n),r&&e.removeEventListener("resize",n);})),null==d||d(),null==(e=h)||e.disconnect(),h=null,c&&cancelAnimationFrame(f);}}const _t=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var n,i;const{x:o,y:r,placement:a,middlewareData:s}=t,c=await async function(e,t){const{placement:n,platform:i,elements:o}=e,r=await(null==i.isRTL?void 0:i.isRTL(o.floating)),a=He(n),s=ze(n),c="y"===Ye(n),l=["left","top"].includes(a)?-1:1,u=r&&c?-1:1,d=je(t,e);let{mainAxis:f,crossAxis:m,alignmentAxis:h}="number"==typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...d};return s&&"number"==typeof h&&(m="end"===s?-1*h:h),c?{x:m*u,y:f*l}:{x:f*l,y:m*u}}(t,e);return a===(null==(n=s.offset)?void 0:n.placement)&&null!=(i=s.arrow)&&i.alignmentOffset?{}:{x:o+c.x,y:r+c.y,data:{...c,placement:a}}}}},Ot=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:i,placement:o}=t,{mainAxis:r=true,crossAxis:a=false,limiter:s={fn:e=>{let{x:t,y:n}=e;return {x:t,y:n}}},...c}=je(e,t),l={x:n,y:i},u=await pt(t,c),d=Ye(He(o)),f=$e(d);let m=l[f],h=l[d];if(r){const e="y"===f?"bottom":"right";m=Re(m+u["y"===f?"top":"left"],m,m-u[e]);}if(a){const e="y"===d?"bottom":"right";h=Re(h+u["y"===d?"top":"left"],h,h-u[e]);}const p=s.fn({...t,[f]:m,[d]:h});return {...p,data:{x:p.x-n,y:p.y-i}}}}},Lt=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(t){var n,i;const{placement:o,middlewareData:r,rects:a,initialPlacement:s,platform:c,elements:l}=t,{mainAxis:u=true,crossAxis:d=true,fallbackPlacements:f,fallbackStrategy:m="bestFit",fallbackAxisSideDirection:h="none",flipAlignment:p=true,...g}=je(e,t);if(null!=(n=r.arrow)&&n.alignmentOffset)return {};const v=He(o),y=He(s)===s,w=await(null==c.isRTL?void 0:c.isRTL(l.floating)),b=f||(y||!p?[Je(s)]:function(e){const t=Je(e);return [We(e),t,We(t)]}(s));f||"none"===h||b.push(...function(e,t,n,i){const o=ze(e);let r=function(e,t,n){const i=["left","right"],o=["right","left"],r=["top","bottom"],a=["bottom","top"];switch(e){case "top":case "bottom":return n?t?o:i:t?i:o;case "left":case "right":return t?r:a;default:return []}}(He(e),"start"===n,i);return o&&(r=r.map((e=>e+"-"+o)),t&&(r=r.concat(r.map(We)))),r}(s,p,h,w));const k=[s,...b],C=await pt(t,g),N=[];let x=(null==(i=r.flip)?void 0:i.overflows)||[];if(u&&N.push(C[v]),d){const e=function(e,t,n){ void 0===n&&(n=false);const i=ze(e),o=Ue(e),r=Ve(o);let a="x"===o?i===(n?"end":"start")?"right":"left":"start"===i?"bottom":"top";return t.reference[r]>t.floating[r]&&(a=Je(a)),[a,Je(a)]}(o,a,w);N.push(C[e[0]],C[e[1]]);}if(x=[...x,{placement:o,overflows:N}],!N.every((e=>e<=0))){var S,D;const e=((null==(S=r.flip)?void 0:S.index)||0)+1,t=k[e];if(t)return {data:{index:e,overflows:x},reset:{placement:t}};let n=null==(D=x.filter((e=>e.overflows[0]<=0)).sort(((e,t)=>e.overflows[1]-t.overflows[1]))[0])?void 0:D.placement;if(!n)switch(m){case "bestFit":{var E;const e=null==(E=x.map((e=>[e.placement,e.overflows.filter((e=>e>0)).reduce(((e,t)=>e+t),0)])).sort(((e,t)=>e[1]-t[1]))[0])?void 0:E[0];e&&(n=e);break}case "initialPlacement":n=s;}if(o!==n)return {reset:{placement:n}}}return {}}}},Ft=(e,t,n)=>{const i=new Map,o={platform:Tt,...n},r={...o.platform,_c:i};return (async(e,t,n)=>{const{placement:i="bottom",strategy:o="absolute",middleware:r=[],platform:a}=n,s=r.filter(Boolean),c=await(null==a.isRTL?void 0:a.isRTL(t));let l=await a.getElementRects({reference:e,floating:t,strategy:o}),{x:u,y:d}=ht(l,i,c),f=i,m={},h=0;for(let n=0;n<s.length;n++){const{name:r,fn:p}=s[n],{x:g,y:v,data:y,reset:w}=await p({x:u,y:d,initialPlacement:i,placement:f,strategy:o,middlewareData:m,rects:l,platform:a,elements:{reference:e,floating:t}});u=null!=g?g:u,d=null!=v?v:d,m={...m,[r]:{...m[r],...y}},w&&h<=50&&(h++,"object"==typeof w&&(w.placement&&(f=w.placement),w.rects&&(l=true===w.rects?await a.getElementRects({reference:e,floating:t,strategy:o}):w.rects),({x:u,y:d}=ht(l,f,c))),n=-1);}return {x:u,y:d,placement:f,strategy:o,middlewareData:m}})(e,t,{...o,platform:r})};var Bt="undefined"!=typeof document?i.useLayoutEffect:i.useEffect;function Rt(e,t){if(e===t)return  true;if(typeof e!=typeof t)return  false;if("function"==typeof e&&e.toString()===t.toString())return  true;let n,i,o;if(e&&t&&"object"==typeof e){if(Array.isArray(e)){if(n=e.length,n!==t.length)return  false;for(i=n;0!=i--;)if(!Rt(e[i],t[i]))return  false;return  true}if(o=Object.keys(e),n=o.length,n!==Object.keys(t).length)return  false;for(i=n;0!=i--;)if(!{}.hasOwnProperty.call(t,o[i]))return  false;for(i=n;0!=i--;){const n=o[i];if(("_owner"!==n||!e.$$typeof)&&!Rt(e[n],t[n]))return  false}return  true}return e!=e&&t!=t}function jt(e){if("undefined"==typeof window)return 1;return (e.ownerDocument.defaultView||window).devicePixelRatio||1}function Ht(e,t){const n=jt(e);return Math.round(t*n)/n}function zt(e){const t=i__namespace.useRef(e);return Bt((()=>{t.current=e;})),t}const $t=(e,t)=>({...Ot(e),options:[e,t]}),Vt=(e,t)=>({...Lt(e),options:[e,t]});function Yt(e){return i__namespace.useMemo((()=>e.every((e=>null==e))?null:t=>{e.forEach((e=>{"function"==typeof e?e(t):null!=e&&(e.current=t);}));}),e)}const Ut={...i__namespace},Wt=Ut.useInsertionEffect||(e=>e());function Jt(e){const t=i__namespace.useRef((()=>{}));return Wt((()=>{t.current=e;})),i__namespace.useCallback((function(){for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];return null==t.current?void 0:t.current(...n)}),[])}const qt="ArrowUp",Kt="ArrowDown",Gt="ArrowLeft",Qt="ArrowRight";function Xt(e,t,n){return Math.floor(e/t)!==n}function Zt(e,t){return t<0||t>=e.current.length}function en(e,t){return nn(e,{disabledIndices:t})}function tn(e,t){return nn(e,{decrement:true,startingIndex:e.current.length,disabledIndices:t})}function nn(e,t){let{startingIndex:n=-1,decrement:i=false,disabledIndices:o,amount:r=1}=void 0===t?{}:t;const a=e.current;let s=n;do{s+=i?-r:r;}while(s>=0&&s<=a.length-1&&an(a,s,o));return s}function on(e,t,n,i,o){if(-1===e)return  -1;const r=n.indexOf(e),a=t[e];switch(o){case "tl":return r;case "tr":return a?r+a.width-1:r;case "bl":return a?r+(a.height-1)*i:r;case "br":return n.lastIndexOf(e)}}function rn(e,t){return t.flatMap(((t,n)=>e.includes(t)?[n]:[]))}function an(e,t,n){if(n)return n.includes(t);const i=e[t];return null==i||i.hasAttribute("disabled")||"true"===i.getAttribute("aria-disabled")}var sn="undefined"!=typeof document?i.useLayoutEffect:i.useEffect;function cn(e,t){const n=e.compareDocumentPosition(t);return n&Node.DOCUMENT_POSITION_FOLLOWING||n&Node.DOCUMENT_POSITION_CONTAINED_BY?-1:n&Node.DOCUMENT_POSITION_PRECEDING||n&Node.DOCUMENT_POSITION_CONTAINS?1:0}const ln=i__namespace.createContext({register:()=>{},unregister:()=>{},map:new Map,elementsRef:{current:[]}});function un(e){const{children:t,elementsRef:n,labelsRef:o}=e,[r,a]=i__namespace.useState((()=>new Map)),s=i__namespace.useCallback((e=>{a((t=>new Map(t).set(e,null)));}),[]),c=i__namespace.useCallback((e=>{a((t=>{const n=new Map(t);return n.delete(e),n}));}),[]);return sn((()=>{const e=new Map(r);Array.from(e.keys()).sort(cn).forEach(((t,n)=>{e.set(t,n);})),function(e,t){if(e.size!==t.size)return  false;for(const[n,i]of e.entries())if(i!==t.get(n))return  false;return  true}(r,e)||a(e);}),[r]),i__namespace.createElement(ln.Provider,{value:i__namespace.useMemo((()=>({register:s,unregister:c,map:r,elementsRef:n,labelsRef:o})),[s,c,r,n,o])},t)}function dn(e){ void 0===e&&(e={});const{label:t}=e,{register:n,unregister:o,map:r,elementsRef:a,labelsRef:s}=i__namespace.useContext(ln),[c,l]=i__namespace.useState(null),u=i__namespace.useRef(null),d=i__namespace.useCallback((e=>{if(u.current=e,null!==c&&(a.current[c]=e,s)){var n;const i=void 0!==t;s.current[c]=i?t:null!=(n=null==e?void 0:e.textContent)?n:null;}}),[c,a,s,t]);return sn((()=>{const e=u.current;if(e)return n(e),()=>{o(e);}}),[n,o]),sn((()=>{const e=u.current?r.get(u.current):null;null!=e&&l(e);}),[r]),i__namespace.useMemo((()=>({ref:d,index:null==c?-1:c})),[c,d])}function fn(){return fn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i]);}return e},fn.apply(this,arguments)}let mn=false,hn=0;const pn=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+hn++;const gn=Ut.useId||function(){const[e,t]=i__namespace.useState((()=>mn?pn():void 0));return sn((()=>{null==e&&t(pn());}),[]),i__namespace.useEffect((()=>{mn=true;}),[]),e};function wn(){const e=new Map;return {emit(t,n){var i;null==(i=e.get(t))||i.forEach((e=>e(n)));},on(t,n){e.set(t,[...e.get(t)||[],n]);},off(t,n){var i;e.set(t,(null==(i=e.get(t))?void 0:i.filter((e=>e!==n)))||[]);}}}const bn=i__namespace.createContext(null),kn=i__namespace.createContext(null),Cn=()=>{var e;return (null==(e=i__namespace.useContext(bn))?void 0:e.id)||null},Nn=()=>i__namespace.useContext(kn);function xn(e){const{children:t,id:n}=e,o=Cn();return i__namespace.createElement(bn.Provider,{value:i__namespace.useMemo((()=>({id:n,parentId:o})),[n,o])},t)}function Sn(e){const{children:t}=e,n=i__namespace.useRef([]),o=i__namespace.useCallback((e=>{n.current=[...n.current,e];}),[]),r=i__namespace.useCallback((e=>{n.current=n.current.filter((t=>t!==e));}),[]),a=i__namespace.useState((()=>wn()))[0];return i__namespace.createElement(kn.Provider,{value:i__namespace.useMemo((()=>({nodesRef:n,addNode:o,removeNode:r,events:a})),[o,r,a])},t)}function Dn(e){return "data-floating-ui-"+e}function En(e){const t=i.useRef(e);return sn((()=>{t.current=e;})),t}const In=Dn("safe-polygon");function An(e,t,n){return n&&!Ne(n)?0:"number"==typeof e?e:null==e?void 0:e[t]}let Mn=0;function Tn(e,t){ void 0===t&&(t={});const{preventScroll:n=false,cancelPrevious:i=true,sync:o=false}=t;i&&cancelAnimationFrame(Mn);const r=()=>null==e?void 0:e.focus({preventScroll:n});o?r():Mn=requestAnimationFrame(r);}function Pn(e,t){let n=e.filter((e=>{var n;return e.parentId===t&&(null==(n=e.context)?void 0:n.open)})),i=n;for(;i.length;)i=e.filter((e=>{var t;return null==(t=i)?void 0:t.some((t=>{var n;return e.parentId===t.id&&(null==(n=e.context)?void 0:n.open)}))})),n=n.concat(i);return n}let _n=new WeakMap,On=new WeakSet,Ln={},Fn=0;const Bn=e=>e&&(e.host||Bn(e.parentNode)),Rn=(e,t)=>t.map((t=>{if(e.contains(t))return t;const n=Bn(t);return e.contains(n)?n:null})).filter((e=>null!=e));function jn(e,t,n){ void 0===t&&(t=false),void 0===n&&(n=false);const i=xe(e[0]).body;return function(e,t,n,i){const o="data-floating-ui-inert",r=i?"inert":n?"aria-hidden":null,a=Rn(t,e),s=new Set,c=new Set(a),l=[];Ln[o]||(Ln[o]=new WeakMap);const u=Ln[o];return a.forEach((function e(t){t&&!s.has(t)&&(s.add(t),t.parentNode&&e(t.parentNode));})),function e(t){t&&!c.has(t)&&[].forEach.call(t.children,(t=>{if("script"!==Q(t))if(s.has(t))e(t);else {const e=r?t.getAttribute(r):null,n=null!==e&&"false"!==e,i=(_n.get(t)||0)+1,a=(u.get(t)||0)+1;_n.set(t,i),u.set(t,a),l.push(t),1===i&&n&&On.add(t),1===a&&t.setAttribute(o,""),!n&&r&&t.setAttribute(r,"true");}}));}(t),s.clear(),Fn++,()=>{l.forEach((e=>{const t=(_n.get(e)||0)-1,n=(u.get(e)||0)-1;_n.set(e,t),u.set(e,n),t||(!On.has(e)&&r&&e.removeAttribute(r),On.delete(e)),n||e.removeAttribute(o);})),Fn--,Fn||(_n=new WeakMap,_n=new WeakMap,On=new WeakSet,Ln={});}}(e.concat(Array.from(i.querySelectorAll("[aria-live]"))),i,t,n)}const Hn=()=>({getShadowRoot:true,displayCheck:"function"==typeof ResizeObserver&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function zn(e,t){const n=ft(e,Hn());"prev"===t&&n.reverse();const i=n.indexOf(pe(xe(e)));return n.slice(i+1)[0]}function $n(e,t){const n=t||e.currentTarget,i=e.relatedTarget;return !i||!ge(n,i)}const Vn={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0};function Yn(e){"Tab"===e.key&&(e.target,clearTimeout(undefined));}const Un=i__namespace.forwardRef((function(e,t){const[n,o]=i__namespace.useState();sn((()=>(ke()&&o("button"),document.addEventListener("keydown",Yn),()=>{document.removeEventListener("keydown",Yn);})),[]);const r={ref:t,tabIndex:0,role:n,"aria-hidden":!n||void 0,[Dn("focus-guard")]:"",style:Vn};return i__namespace.createElement("span",fn({},e,r))})),Wn=i__namespace.createContext(null),Jn="data-floating-ui-focusable";function qn(e){return e?e.hasAttribute(Jn)?e:e.querySelector("["+Jn+"]")||e:null}const Kn=20;let Gn=[];function Qn(e){Gn=Gn.filter((e=>e.isConnected));let t=e;if(t&&"body"!==Q(t)){if(!mt(t,Hn())){const e=ft(t,Hn())[0];e&&(t=e);}Gn.push(t),Gn.length>Kn&&(Gn=Gn.slice(-20));}}function Xn(){return Gn.slice().reverse().find((e=>e.isConnected))}const Zn=i__namespace.forwardRef((function(e,t){return i__namespace.createElement("button",fn({},e,{type:"button",ref:t,tabIndex:-1,style:Vn}))}));function ei(e){const{context:t,children:n,disabled:o=false,order:r=["content"],guards:a=true,initialFocus:s=0,returnFocus:c=true,restoreFocus:l=false,modal:u=true,visuallyHiddenDismiss:d=false,closeOnFocusOut:f=true}=e,{open:m,refs:h,nodeId:p,onOpenChange:g,events:v,dataRef:y,floatingId:w,elements:{domReference:b,floating:k}}=t,C="number"==typeof s&&s<0,N=Me(b)&&C,x="undefined"==typeof HTMLElement||!("inert"in HTMLElement.prototype)||a,S=En(r),D=En(s),E=En(c),I=Nn(),A=i__namespace.useContext(Wn),M=i__namespace.useRef(null),T=i__namespace.useRef(null),P=i__namespace.useRef(false),_=i__namespace.useRef(false),O=i__namespace.useRef(-1),L=null!=A,F=qn(k),B=Jt((function(e){return void 0===e&&(e=F),e?ft(e,Hn()):[]})),R=Jt((e=>{const t=B(e);return S.current.map((e=>b&&"reference"===e?b:F&&"floating"===e?F:t)).filter(Boolean).flat()}));function j(e){return !o&&d&&u?i__namespace.createElement(Zn,{ref:"start"===e?M:T,onClick:e=>g(false,e.nativeEvent)},"string"==typeof d?d:"Dismiss"):null}i__namespace.useEffect((()=>{if(o)return;if(!u)return;function e(e){if("Tab"===e.key){ge(F,pe(xe(F)))&&0===B().length&&!N&&Ae(e);const t=R(),n=De(e);"reference"===S.current[0]&&n===b&&(Ae(e),e.shiftKey?Tn(t[t.length-1]):Tn(t[1])),"floating"===S.current[1]&&n===F&&e.shiftKey&&(Ae(e),Tn(t[0]));}}const t=xe(F);return t.addEventListener("keydown",e),()=>{t.removeEventListener("keydown",e);}}),[o,b,F,u,S,N,B,R]),i__namespace.useEffect((()=>{if(!o&&k)return k.addEventListener("focusin",e),()=>{k.removeEventListener("focusin",e);};function e(e){const t=De(e),n=B().indexOf(t);-1!==n&&(O.current=n);}}),[o,k,B]),i__namespace.useEffect((()=>{if(!o&&f)return k&&ne(b)?(b.addEventListener("focusout",t),b.addEventListener("pointerdown",e),k.addEventListener("focusout",t),()=>{b.removeEventListener("focusout",t),b.removeEventListener("pointerdown",e),k.removeEventListener("focusout",t);}):void 0;function e(){_.current=true,setTimeout((()=>{_.current=false;}));}function t(e){const t=e.relatedTarget;queueMicrotask((()=>{const n=!(ge(b,t)||ge(k,t)||ge(t,k)||ge(null==A?void 0:A.portalNode,t)||null!=t&&t.hasAttribute(Dn("focus-guard"))||I&&(Pn(I.nodesRef.current,p).find((e=>{var n,i;return ge(null==(n=e.context)?void 0:n.elements.floating,t)||ge(null==(i=e.context)?void 0:i.elements.domReference,t)}))||function(e,t){var n;let i=[],o=null==(n=e.find((e=>e.id===t)))?void 0:n.parentId;for(;o;){const t=e.find((e=>e.id===o));o=null==t?void 0:t.parentId,t&&(i=i.concat(t));}return i}(I.nodesRef.current,p).find((e=>{var n,i;return (null==(n=e.context)?void 0:n.elements.floating)===t||(null==(i=e.context)?void 0:i.elements.domReference)===t}))));if(l&&n&&pe(xe(F))===xe(F).body){ne(F)&&F.focus();const e=O.current,t=B(),n=t[e]||t[t.length-1]||F;ne(n)&&n.focus();}!N&&u||!t||!n||_.current||t===Xn()||(P.current=true,g(false,e,"focus-out"));}));}}),[o,b,k,F,u,p,I,A,g,f,l,B,N]),i__namespace.useEffect((()=>{var e;if(o)return;const t=Array.from((null==A||null==(e=A.portalNode)?void 0:e.querySelectorAll("["+Dn("portal")+"]"))||[]);if(k){const e=[k,...t,M.current,T.current,S.current.includes("reference")||N?b:null].filter((e=>null!=e)),n=u||N?jn(e,x,!x):jn(e);return ()=>{n();}}}),[o,b,k,u,S,A,N,x]),sn((()=>{if(o||!ne(F))return;const e=pe(xe(F));queueMicrotask((()=>{const t=R(F),n=D.current,i=("number"==typeof n?t[n]:n.current)||F,o=ge(F,e);C||o||!m||Tn(i,{preventScroll:i===F});}));}),[o,m,F,C,R,D]),sn((()=>{if(o||!F)return;let e=false;const t=xe(F),n=pe(t);let i=y.current.openEvent;function r(t){let{open:n,reason:o,event:r,nested:a}=t;n&&(i=r),"escape-key"===o&&h.domReference.current&&Qn(h.domReference.current),"hover"===o&&"mouseleave"===r.type&&(P.current=true),"outside-press"===o&&(a?(P.current=false,e=true):P.current=!(we(r)||be(r)));}Qn(n),v.on("openchange",r);const a=t.createElement("span");return a.setAttribute("tabindex","-1"),a.setAttribute("aria-hidden","true"),Object.assign(a.style,Vn),L&&b&&b.insertAdjacentElement("afterend",a),()=>{v.off("openchange",r);const n=pe(t),o=ge(k,n)||I&&Pn(I.nodesRef.current,p).some((e=>{var t;return ge(null==(t=e.context)?void 0:t.elements.floating,n)}));(o||i&&["click","mousedown"].includes(i.type))&&h.domReference.current&&Qn(h.domReference.current);const s="boolean"==typeof E.current?Xn()||a:E.current.current||a;queueMicrotask((()=>{E.current&&!P.current&&ne(s)&&(s===n||n===t.body||o)&&s.focus({preventScroll:e}),a.remove();}));}}),[o,k,F,E,y,h,v,I,p,L,b]),i__namespace.useEffect((()=>{queueMicrotask((()=>{P.current=false;}));}),[o]),sn((()=>{if(!o&&A)return A.setFocusManagerState({modal:u,closeOnFocusOut:f,open:m,onOpenChange:g,refs:h}),()=>{A.setFocusManagerState(null);}}),[o,A,u,m,g,h,f]),sn((()=>{if(o)return;if(!F)return;if("function"!=typeof MutationObserver)return;if(C)return;const e=()=>{const e=F.getAttribute("tabindex"),t=B(),n=pe(xe(k)),i=t.indexOf(n);-1!==i&&(O.current=i),S.current.includes("floating")||n!==h.domReference.current&&0===t.length?"0"!==e&&F.setAttribute("tabindex","0"):"-1"!==e&&F.setAttribute("tabindex","-1");};e();const t=new MutationObserver(e);return t.observe(F,{childList:true,subtree:true,attributes:true}),()=>{t.disconnect();}}),[o,k,F,h,S,B,C]);const H=!o&&x&&(!u||!N)&&(L||u);return i__namespace.createElement(i__namespace.Fragment,null,H&&i__namespace.createElement(Un,{"data-type":"inside",ref:null==A?void 0:A.beforeInsideRef,onFocus:e=>{if(u){const e=R();Tn("reference"===r[0]?e[0]:e[e.length-1]);}else if(null!=A&&A.preserveTabOrder&&A.portalNode)if(P.current=false,$n(e,A.portalNode)){const e=zn(document.body,"next")||b;null==e||e.focus();}else {var t;null==(t=A.beforeOutsideRef.current)||t.focus();}}}),!N&&j("start"),n,j("end"),H&&i__namespace.createElement(Un,{"data-type":"inside",ref:null==A?void 0:A.afterInsideRef,onFocus:e=>{if(u)Tn(R()[0]);else if(null!=A&&A.preserveTabOrder&&A.portalNode)if(f&&(P.current=true),$n(e,A.portalNode)){const e=zn(document.body,"prev")||b;null==e||e.focus();}else {var t;null==(t=A.afterOutsideRef.current)||t.focus();}}}))}function ti(e){return ne(e.target)&&"BUTTON"===e.target.tagName}function ni(e){return Ie(e)}const ii={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},oi={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},ri=e=>{var t,n;return {escapeKey:"boolean"==typeof e?e:null!=(t=null==e?void 0:e.escapeKey)&&t,outsidePress:"boolean"==typeof e?e:null==(n=null==e?void 0:e.outsidePress)||n}};function ai(e){const{open:t=false,onOpenChange:n,elements:o}=e,r=gn(),a=i__namespace.useRef({}),[s]=i__namespace.useState((()=>wn())),c=null!=Cn();const[l,u]=i__namespace.useState(o.reference),d=Jt(((e,t,i)=>{a.current.openEvent=e?t:void 0,s.emit("openchange",{open:e,event:t,reason:i,nested:c}),null==n||n(e,t,i);})),f=i__namespace.useMemo((()=>({setPositionReference:u})),[]),m=i__namespace.useMemo((()=>({reference:l||o.reference||null,floating:o.floating||null,domReference:o.reference})),[l,o.reference,o.floating]);return i__namespace.useMemo((()=>({dataRef:a,open:t,onOpenChange:d,elements:m,events:s,floatingId:r,refs:f})),[t,d,m,s,r,f])}function si(e){ void 0===e&&(e={});const{nodeId:t}=e,n=ai({...e,elements:{reference:null,floating:null,...e.elements}}),o=e.rootContext||n,r=o.elements,[a,s]=i__namespace.useState(null),[c,l]=i__namespace.useState(null),u=(null==r?void 0:r.domReference)||a,d=i__namespace.useRef(null),f=Nn();sn((()=>{u&&(d.current=u);}),[u]);const m=function(e){ void 0===e&&(e={});const{placement:t="bottom",strategy:n="absolute",middleware:o=[],platform:r,elements:{reference:a,floating:s}={},transform:c=true,whileElementsMounted:l,open:u}=e,[d,f]=i__namespace.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:false}),[m,h]=i__namespace.useState(o);Rt(m,o)||h(o);const[g,v]=i__namespace.useState(null),[y,w]=i__namespace.useState(null),b=i__namespace.useCallback((e=>{e!==x.current&&(x.current=e,v(e));}),[]),k=i__namespace.useCallback((e=>{e!==S.current&&(S.current=e,w(e));}),[]),C=a||g,N=s||y,x=i__namespace.useRef(null),S=i__namespace.useRef(null),D=i__namespace.useRef(d),E=null!=l,I=zt(l),A=zt(r),M=zt(u),T=i__namespace.useCallback((()=>{if(!x.current||!S.current)return;const e={placement:t,strategy:n,middleware:m};A.current&&(e.platform=A.current),Ft(x.current,S.current,e).then((e=>{const t={...e,isPositioned:false!==M.current};P.current&&!Rt(D.current,t)&&(D.current=t,require$$0__namespace.flushSync((()=>{f(t);})));}));}),[m,t,n,A,M]);Bt((()=>{ false===u&&D.current.isPositioned&&(D.current.isPositioned=false,f((e=>({...e,isPositioned:false}))));}),[u]);const P=i__namespace.useRef(false);Bt((()=>(P.current=true,()=>{P.current=false;})),[]),Bt((()=>{if(C&&(x.current=C),N&&(S.current=N),C&&N){if(I.current)return I.current(C,N,T);T();}}),[C,N,T,I,E]);const _=i__namespace.useMemo((()=>({reference:x,floating:S,setReference:b,setFloating:k})),[b,k]),O=i__namespace.useMemo((()=>({reference:C,floating:N})),[C,N]),L=i__namespace.useMemo((()=>{const e={position:n,left:0,top:0};if(!O.floating)return e;const t=Ht(O.floating,d.x),i=Ht(O.floating,d.y);return c?{...e,transform:"translate("+t+"px, "+i+"px)",...jt(O.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:t,top:i}}),[n,c,O.floating,d.x,d.y]);return i__namespace.useMemo((()=>({...d,update:T,refs:_,elements:O,floatingStyles:L})),[d,T,_,O,L])}({...e,elements:{...r,...c&&{reference:c}}}),h=i__namespace.useCallback((e=>{const t=te(e)?{getBoundingClientRect:()=>e.getBoundingClientRect(),contextElement:e}:e;l(t),m.refs.setReference(t);}),[m.refs]),g=i__namespace.useCallback((e=>{(te(e)||null===e)&&(d.current=e,s(e)),(te(m.refs.reference.current)||null===m.refs.reference.current||null!==e&&!te(e))&&m.refs.setReference(e);}),[m.refs]),v=i__namespace.useMemo((()=>({...m.refs,setReference:g,setPositionReference:h,domReference:d})),[m.refs,g,h]),y=i__namespace.useMemo((()=>({...m.elements,domReference:u})),[m.elements,u]),w=i__namespace.useMemo((()=>({...m,...o,refs:v,elements:y,nodeId:t})),[m,v,y,t,o]);return sn((()=>{o.dataRef.current.floatingContext=w;const e=null==f?void 0:f.nodesRef.current.find((e=>e.id===t));e&&(e.context=w);})),i__namespace.useMemo((()=>({...m,context:w,refs:v,elements:y})),[m,v,y,w])}const ci="active",li="selected";function ui(e,t,n){const i=new Map,o="item"===n;let r=e;if(o&&e){const{[ci]:t,[li]:n,...i}=e;r=i;}return {..."floating"===n&&{tabIndex:-1,[Jn]:""},...r,...t.map((t=>{const i=t?t[n]:null;return "function"==typeof i?e?i(e):null:i})).concat(e).reduce(((e,t)=>t?(Object.entries(t).forEach((t=>{let[n,r]=t;var a;o&&[ci,li].includes(n)||(0===n.indexOf("on")?(i.has(n)||i.set(n,[]),"function"==typeof r&&(null==(a=i.get(n))||a.push(r),e[n]=function(){for(var e,t=arguments.length,o=new Array(t),r=0;r<t;r++)o[r]=arguments[r];return null==(e=i.get(n))?void 0:e.map((e=>e(...o))).find((e=>void 0!==e))})):e[n]=r);})),e):e),{})}}let di=false;function fi(e,t,n){switch(e){case "vertical":return t;case "horizontal":return n;default:return t||n}}function mi(e,t){return fi(t,e===qt||e===Kt,e===Gt||e===Qt)}function hi(e,t,n){return fi(t,e===Kt,n?e===Gt:e===Qt)||"Enter"===e||" "===e||""===e}function pi(e,t,n){return fi(t,n?e===Qt:e===Gt,e===qt)}function gi(e,t){const{open:n,onOpenChange:o,elements:r}=e,{listRef:a,activeIndex:s,onNavigate:c=(()=>{}),enabled:l=true,selectedIndex:u=null,allowEscape:d=false,loop:f=false,nested:m=false,rtl:h=false,virtual:p=false,focusItemOnOpen:g="auto",focusItemOnHover:v=true,openOnArrowKeyDown:y=true,disabledIndices:w,orientation:b="vertical",cols:k=1,scrollItemIntoView:C=true,virtualItemRef:N,itemSizes:x,dense:S=false}=t;const D=En(qn(r.floating)),E=Cn(),I=Nn(),A=Jt(c),M=Me(r.domReference),T=i__namespace.useRef(g),P=i__namespace.useRef(null!=u?u:-1),_=i__namespace.useRef(null),O=i__namespace.useRef(true),L=i__namespace.useRef(A),F=i__namespace.useRef(!!r.floating),B=i__namespace.useRef(n),R=i__namespace.useRef(false),j=i__namespace.useRef(false),H=En(w),z=En(n),$=En(C),V=En(u),[Y,U]=i__namespace.useState(),[W,J]=i__namespace.useState(),q=Jt((function(e,t,n){function i(e){p?(U(e.id),null==I||I.events.emit("virtualfocus",e),N&&(N.current=e)):Tn(e,{preventScroll:true,sync:!(!ve().toLowerCase().startsWith("mac")||navigator.maxTouchPoints||!ke())&&(di||R.current)});} void 0===n&&(n=false);const o=e.current[t.current];o&&i(o),requestAnimationFrame((()=>{const r=e.current[t.current]||o;if(!r)return;o||i(r);const a=$.current;a&&G&&(n||!O.current)&&(null==r.scrollIntoView||r.scrollIntoView("boolean"==typeof a?{block:"nearest",inline:"nearest"}:a));}));}));sn((()=>{document.createElement("div").focus({get preventScroll(){return di=true,false}});}),[]),sn((()=>{l&&(n&&r.floating?T.current&&null!=u&&(j.current=true,P.current=u,A(u)):F.current&&(P.current=-1,L.current(null)));}),[l,n,r.floating,u,A]),sn((()=>{if(l&&n&&r.floating)if(null==s){if(R.current=false,null!=V.current)return;if(F.current&&(P.current=-1,q(a,P)),(!B.current||!F.current)&&T.current&&(null!=_.current||true===T.current&&null==_.current)){let e=0;const t=()=>{if(null==a.current[0]){if(e<2){(e?requestAnimationFrame:queueMicrotask)(t);}e++;}else P.current=null==_.current||hi(_.current,b,h)||m?en(a,H.current):tn(a,H.current),_.current=null,A(P.current);};t();}}else Zt(a,s)||(P.current=s,q(a,P,j.current),j.current=false);}),[l,n,r.floating,s,V,m,a,b,h,A,q,H]),sn((()=>{var e;if(!l||r.floating||!I||p||!F.current)return;const t=I.nodesRef.current,n=null==(e=t.find((e=>e.id===E)))||null==(e=e.context)?void 0:e.elements.floating,i=pe(xe(r.floating)),o=t.some((e=>e.context&&ge(e.context.elements.floating,i)));n&&!o&&O.current&&n.focus({preventScroll:true});}),[l,r.floating,I,E,p]),sn((()=>{if(l&&I&&p&&!E)return I.events.on("virtualfocus",e),()=>{I.events.off("virtualfocus",e);};function e(e){J(e.id),N&&(N.current=e);}}),[l,I,p,E,N]),sn((()=>{L.current=A,F.current=!!r.floating;})),sn((()=>{n||(_.current=null);}),[n]),sn((()=>{B.current=n;}),[n]);const K=null!=s,G=i__namespace.useMemo((()=>{function e(e){if(!n)return;const t=a.current.indexOf(e);-1!==t&&A(t);}return {onFocus(t){let{currentTarget:n}=t;e(n);},onClick:e=>{let{currentTarget:t}=e;return t.focus({preventScroll:true})},...v&&{onMouseMove(t){let{currentTarget:n}=t;e(n);},onPointerLeave(e){let{pointerType:t}=e;O.current&&"touch"!==t&&(P.current=-1,q(a,P),A(null),p||Tn(D.current,{preventScroll:true}));}}}}),[n,D,q,v,a,A,p]),Q=Jt((e=>{if(O.current=false,R.current=true,229===e.which)return;if(!z.current&&e.currentTarget===D.current)return;if(m&&pi(e.key,b,h))return Ae(e),o(false,e.nativeEvent,"list-navigation"),void(ne(r.domReference)&&(p?null==I||I.events.emit("virtualfocus",r.domReference):r.domReference.focus()));const t=P.current,i=en(a,w),s=tn(a,w);if(M||("Home"===e.key&&(Ae(e),P.current=i,A(P.current)),"End"===e.key&&(Ae(e),P.current=s,A(P.current))),k>1){const t=x||Array.from({length:a.current.length},(()=>({width:1,height:1}))),n=function(e,t,n){const i=[];let o=0;return e.forEach(((e,r)=>{let{width:a,height:s}=e;let c=false;for(n&&(o=0);!c;){const e=[];for(let n=0;n<a;n++)for(let i=0;i<s;i++)e.push(o+n+i*t);o%t+a<=t&&e.every((e=>null==i[e]))?(e.forEach((e=>{i[e]=r;})),c=true):o++;}})),[...i]}(t,k,S),o=n.findIndex((e=>null!=e&&!an(a.current,e,w))),r=n.reduce(((e,t,n)=>null==t||an(a.current,t,w)?e:n),-1),c=n[function(e,t){let{event:n,orientation:i,loop:o,rtl:r,cols:a,disabledIndices:s,minIndex:c,maxIndex:l,prevIndex:u,stopEvent:d=false}=t,f=u;if(n.key===qt){if(d&&Ae(n),-1===u)f=l;else if(f=nn(e,{startingIndex:f,amount:a,decrement:true,disabledIndices:s}),o&&(u-a<c||f<0)){const e=u%a,t=l%a,n=l-(t-e);f=t===e?l:t>e?n:n-a;}Zt(e,f)&&(f=u);}if(n.key===Kt&&(d&&Ae(n),-1===u?f=c:(f=nn(e,{startingIndex:u,amount:a,disabledIndices:s}),o&&u+a>l&&(f=nn(e,{startingIndex:u%a-a,amount:a,disabledIndices:s}))),Zt(e,f)&&(f=u)),"both"===i){const t=Oe(u/a);n.key===(r?Gt:Qt)&&(d&&Ae(n),u%a!=a-1?(f=nn(e,{startingIndex:u,disabledIndices:s}),o&&Xt(f,a,t)&&(f=nn(e,{startingIndex:u-u%a-1,disabledIndices:s}))):o&&(f=nn(e,{startingIndex:u-u%a-1,disabledIndices:s})),Xt(f,a,t)&&(f=u)),n.key===(r?Qt:Gt)&&(d&&Ae(n),u%a!=0?(f=nn(e,{startingIndex:u,decrement:true,disabledIndices:s}),o&&Xt(f,a,t)&&(f=nn(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s}))):o&&(f=nn(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s})),Xt(f,a,t)&&(f=u));const i=Oe(l/a)===t;Zt(e,f)&&(f=o&&i?n.key===(r?Qt:Gt)?l:nn(e,{startingIndex:u-u%a-1,disabledIndices:s}):u);}return f}({current:n.map((e=>null!=e?a.current[e]:null))},{event:e,orientation:b,loop:f,rtl:h,cols:k,disabledIndices:rn([...w||a.current.map(((e,t)=>an(a.current,t)?t:void 0)),void 0],n),minIndex:o,maxIndex:r,prevIndex:on(P.current>s?i:P.current,t,n,k,e.key===Kt?"bl":e.key===(h?Gt:Qt)?"tr":"tl"),stopEvent:true})];if(null!=c&&(P.current=c,A(P.current)),"both"===b)return}if(mi(e.key,b)){if(Ae(e),n&&!p&&pe(e.currentTarget.ownerDocument)===e.currentTarget)return P.current=hi(e.key,b,h)?i:s,void A(P.current);hi(e.key,b,h)?P.current=f?t>=s?d&&t!==a.current.length?-1:i:nn(a,{startingIndex:t,disabledIndices:w}):Math.min(s,nn(a,{startingIndex:t,disabledIndices:w})):P.current=f?t<=i?d&&-1!==t?a.current.length:s:nn(a,{startingIndex:t,decrement:true,disabledIndices:w}):Math.max(i,nn(a,{startingIndex:t,decrement:true,disabledIndices:w})),Zt(a,P.current)?A(null):A(P.current);}})),X=i__namespace.useMemo((()=>p&&n&&K&&{"aria-activedescendant":W||Y}),[p,n,K,W,Y]),Z=i__namespace.useMemo((()=>({"aria-orientation":"both"===b?void 0:b,...!Me(r.domReference)&&X,onKeyDown:Q,onPointerMove(){O.current=true;}})),[X,Q,r.domReference,b]),ee=i__namespace.useMemo((()=>{function e(e){"auto"===g&&we(e.nativeEvent)&&(T.current=true);}return {...X,onKeyDown(e){O.current=false;const t=e.key.startsWith("Arrow"),i=["Home","End"].includes(e.key),r=t||i,s=function(e,t,n){return fi(t,n?e===Gt:e===Qt,e===Kt)}(e.key,b,h),c=pi(e.key,b,h),l=mi(e.key,b),d=(m?s:l)||"Enter"===e.key||""===e.key.trim();if(p&&n){const t=null==I?void 0:I.nodesRef.current.find((e=>null==e.parentId)),n=I&&t?function(e,t){let n,i=-1;return function t(o,r){r>i&&(n=o,i=r),Pn(e,o).forEach((e=>{t(e.id,r+1);}));}(t,0),e.find((e=>e.id===n))}(I.nodesRef.current,t.id):null;if(r&&n&&N){const t=new KeyboardEvent("keydown",{key:e.key,bubbles:true});if(s||c){var f,g;const i=(null==(f=n.context)?void 0:f.elements.domReference)===e.currentTarget,o=c&&!i?null==(g=n.context)?void 0:g.elements.domReference:s?a.current.find((e=>(null==e?void 0:e.id)===Y)):null;o&&(Ae(e),o.dispatchEvent(t),J(void 0));}var v;if((l||i)&&n.context)if(n.context.open&&n.parentId&&e.currentTarget!==n.context.elements.domReference)return Ae(e),void(null==(v=n.context.elements.domReference)||v.dispatchEvent(t))}return Q(e)}(n||y||!t)&&(d&&(_.current=m&&l?null:e.key),m?s&&(Ae(e),n?(P.current=en(a,H.current),A(P.current)):o(true,e.nativeEvent,"list-navigation")):l&&(null!=u&&(P.current=u),Ae(e),!n&&y?o(true,e.nativeEvent,"list-navigation"):Q(e),n&&A(P.current)));},onFocus(){n&&!p&&A(null);},onPointerDown:function(e){T.current=g,"auto"===g&&be(e.nativeEvent)&&(T.current=true);},onMouseDown:e,onClick:e}}),[Y,X,Q,H,g,a,m,A,o,n,y,b,h,u,I,p,N]);return i__namespace.useMemo((()=>l?{reference:ee,floating:Z,item:G}:{}),[l,ee,Z,G])}const vi=new Map([["select","listbox"],["combobox","listbox"],["label",false]]);function yi(e,t){const[n,i]=e;let o=false;const r=t.length;for(let e=0,a=r-1;e<r;a=e++){const[r,s]=t[e]||[0,0],[c,l]=t[a]||[0,0];s>=i!=l>=i&&n<=(c-r)*(i-s)/(l-s)+r&&(o=!o);}return o}function wi(e){ void 0===e&&(e={});const{buffer:t=.5,blockPointerEvents:n=false,requireIntent:i=true}=e;let o,r=false,a=null,s=null,c=performance.now();const l=e=>{let{x:n,y:l,placement:u,elements:d,onClose:f,nodeId:m,tree:h}=e;return function(e){function p(){clearTimeout(o),f();}if(clearTimeout(o),!d.domReference||!d.floating||null==u||null==n||null==l)return;const{clientX:g,clientY:v}=e,y=[g,v],w=De(e),b="mouseleave"===e.type,k=ge(d.floating,w),C=ge(d.domReference,w),N=d.domReference.getBoundingClientRect(),x=d.floating.getBoundingClientRect(),S=u.split("-")[0],D=n>x.right-x.width/2,E=l>x.bottom-x.height/2,I=function(e,t){return e[0]>=t.x&&e[0]<=t.x+t.width&&e[1]>=t.y&&e[1]<=t.y+t.height}(y,N),A=x.width>N.width,M=x.height>N.height,T=(A?N:x).left,P=(A?N:x).right,_=(M?N:x).top,O=(M?N:x).bottom;if(k&&(r=true,!b))return;if(C&&(r=false),C&&!b)return void(r=true);if(b&&te(e.relatedTarget)&&ge(d.floating,e.relatedTarget))return;if(h&&Pn(h.nodesRef.current,m).some((e=>{let{context:t}=e;return null==t?void 0:t.open})))return;if("top"===S&&l>=N.bottom-1||"bottom"===S&&l<=N.top+1||"left"===S&&n>=N.right-1||"right"===S&&n<=N.left+1)return p();let L=[];switch(S){case "top":L=[[T,N.top+1],[T,x.bottom-1],[P,x.bottom-1],[P,N.top+1]];break;case "bottom":L=[[T,x.top+1],[T,N.bottom-1],[P,N.bottom-1],[P,x.top+1]];break;case "left":L=[[x.right-1,O],[x.right-1,_],[N.left+1,_],[N.left+1,O]];break;case "right":L=[[N.right-1,O],[N.right-1,_],[x.left+1,_],[x.left+1,O]];}if(!yi([g,v],L)){if(r&&!I)return p();if(!b&&i){const t=function(e,t){const n=performance.now(),i=n-c;if(null===a||null===s||0===i)return a=e,s=t,c=n,null;const o=e-a,r=t-s,l=Math.sqrt(o*o+r*r);return a=e,s=t,c=n,l/i}(e.clientX,e.clientY);if(null!==t&&t<.1)return p()}yi([g,v],function(e){let[n,i]=e;switch(S){case "top":return [[A?n+t/2:D?n+4*t:n-4*t,i+t+1],[A?n-t/2:D?n+4*t:n-4*t,i+t+1],...[[x.left,D||A?x.bottom-t:x.top],[x.right,D?A?x.bottom-t:x.top:x.bottom-t]]];case "bottom":return [[A?n+t/2:D?n+4*t:n-4*t,i-t],[A?n-t/2:D?n+4*t:n-4*t,i-t],...[[x.left,D||A?x.top+t:x.bottom],[x.right,D?A?x.top+t:x.bottom:x.top+t]]];case "left":{const e=[n+t+1,M?i+t/2:E?i+4*t:i-4*t],o=[n+t+1,M?i-t/2:E?i+4*t:i-4*t];return [...[[E||M?x.right-t:x.left,x.top],[E?M?x.right-t:x.left:x.right-t,x.bottom]],e,o]}case "right":return [[n-t,M?i+t/2:E?i+4*t:i-4*t],[n-t,M?i-t/2:E?i+4*t:i-4*t],...[[E||M?x.left+t:x.right,x.top],[E?M?x.left+t:x.right:x.left+t,x.bottom]]]}}([n,l]))?!r&&i&&(o=window.setTimeout(p,40)):p();}}};return l.__options={blockPointerEvents:n},l}const bi=i.createContext({getItemProps:()=>({}),activeIndex:null,setActiveIndex:()=>{},setHasFocusInside:()=>{},isOpen:false,setIsOpen:()=>{}}),ki=i.forwardRef((({className:t,disabled:n,children:i$1,...o},r)=>{const a=i.useContext(bi),c=dn(),l=Nn(),u=c.index===a.activeIndex,d=k("io-dropdown-menu-item",n&&"io-dropdown-menu-item-disabled",t);return jsxRuntimeExports.jsx("div",{ref:Yt([c.ref,r]),role:"menuitem",className:d,tabIndex:u?0:-1,...o,...a.getItemProps({onClick(e){o.onClick?.(e),a.setIsOpen(false),l?.events.emit("click");},onFocus(e){o.onFocus?.(e),a.setHasFocusInside(true);}}),children:i$1})}));ki.displayName="DropdownMenuItem";const Ci=i.forwardRef((({className:n,variant:o="default",icon:r,iconRight:a,text:f="",disabled:m,children:h,...p},g)=>{const[v,y]=i.useState(false),[w,b]=i.useState(false),[C,N]=i.useState(null),x=i.useRef([]),S=i.useRef([]),D=i.useContext(bi),E=Nn(),I=function(e){const t=gn(),n=Nn(),i=Cn();return sn((()=>{const e={id:t,parentId:i};return null==n||n.addNode(e),()=>{null==n||n.removeNode(e);}}),[n,t,i]),t}(),M=Cn(),T=dn(),P=null!=M,{floatingStyles:_,refs:O,context:L}=si({nodeId:I,open:v,onOpenChange:y,placement:P?"right-start":"bottom-start",middleware:[(F={mainAxis:P?0:4,alignmentAxis:P?-4:0},{..._t(F),options:[F,B]}),Vt(),$t()],whileElementsMounted:Pt});var F,B;const R=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,events:a,elements:s}=e,{enabled:c=true,delay:l=0,handleClose:u=null,mouseOnly:d=false,restMs:f=0,move:m=true}=t,h=Nn(),p=Cn(),g=En(u),v=En(l),y=En(n),w=i__namespace.useRef(),b=i__namespace.useRef(-1),k=i__namespace.useRef(),C=i__namespace.useRef(-1),N=i__namespace.useRef(true),x=i__namespace.useRef(false),S=i__namespace.useRef((()=>{})),D=i__namespace.useRef(false),E=i__namespace.useCallback((()=>{var e;const t=null==(e=r.current.openEvent)?void 0:e.type;return (null==t?void 0:t.includes("mouse"))&&"mousedown"!==t}),[r]);i__namespace.useEffect((()=>{if(c)return a.on("openchange",e),()=>{a.off("openchange",e);};function e(e){let{open:t}=e;t||(clearTimeout(b.current),clearTimeout(C.current),N.current=true,D.current=false);}}),[c,a]),i__namespace.useEffect((()=>{if(!c)return;if(!g.current)return;if(!n)return;function e(e){E()&&o(false,e,"hover");}const t=xe(s.floating).documentElement;return t.addEventListener("mouseleave",e),()=>{t.removeEventListener("mouseleave",e);}}),[s.floating,n,o,c,g,E]);const I=i__namespace.useCallback((function(e,t,n){ void 0===t&&(t=true),void 0===n&&(n="hover");const i=An(v.current,"close",w.current);i&&!k.current?(clearTimeout(b.current),b.current=window.setTimeout((()=>o(false,e,n)),i)):t&&(clearTimeout(b.current),o(false,e,n));}),[v,o]),A=Jt((()=>{S.current(),k.current=void 0;})),M=Jt((()=>{if(x.current){const e=xe(s.floating).body;e.style.pointerEvents="",e.removeAttribute(In),x.current=false;}})),T=Jt((()=>!!r.current.openEvent&&["click","mousedown"].includes(r.current.openEvent.type)));i__namespace.useEffect((()=>{if(c&&te(s.domReference)){var e;const o=s.domReference;return n&&o.addEventListener("mouseleave",a),null==(e=s.floating)||e.addEventListener("mouseleave",a),m&&o.addEventListener("mousemove",t,{once:true}),o.addEventListener("mouseenter",t),o.addEventListener("mouseleave",i),()=>{var e;n&&o.removeEventListener("mouseleave",a),null==(e=s.floating)||e.removeEventListener("mouseleave",a),m&&o.removeEventListener("mousemove",t),o.removeEventListener("mouseenter",t),o.removeEventListener("mouseleave",i);}}function t(e){if(clearTimeout(b.current),N.current=false,d&&!Ne(w.current)||f>0&&!An(v.current,"open"))return;const t=An(v.current,"open",w.current);t?b.current=window.setTimeout((()=>{y.current||o(true,e,"hover");}),t):n||o(true,e,"hover");}function i(e){if(T())return;S.current();const t=xe(s.floating);if(clearTimeout(C.current),D.current=false,g.current&&r.current.floatingContext){n||clearTimeout(b.current),k.current=g.current({...r.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){M(),A(),T()||I(e,true,"safe-polygon");}});const i=k.current;return t.addEventListener("mousemove",i),void(S.current=()=>{t.removeEventListener("mousemove",i);})}("touch"!==w.current||!ge(s.floating,e.relatedTarget))&&I(e);}function a(e){T()||r.current.floatingContext&&(null==g.current||g.current({...r.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){M(),A(),T()||I(e);}})(e));}}),[s,c,e,d,f,m,I,A,M,o,n,y,h,v,g,r,T]),sn((()=>{var e;if(c&&n&&null!=(e=g.current)&&e.__options.blockPointerEvents&&E()){x.current=true;const e=s.floating;if(te(s.domReference)&&e){var t;const n=xe(s.floating).body;n.setAttribute(In,"");const i=s.domReference,o=null==h||null==(t=h.nodesRef.current.find((e=>e.id===p)))||null==(t=t.context)?void 0:t.elements.floating;return o&&(o.style.pointerEvents=""),n.style.pointerEvents="none",i.style.pointerEvents="auto",e.style.pointerEvents="auto",()=>{n.style.pointerEvents="",i.style.pointerEvents="",e.style.pointerEvents="";}}}}),[c,n,p,s,h,g,E]),sn((()=>{n||(w.current=void 0,D.current=false,A(),M());}),[n,A,M]),i__namespace.useEffect((()=>()=>{A(),clearTimeout(b.current),clearTimeout(C.current),M();}),[c,s.domReference,A,M]);const P=i__namespace.useMemo((()=>{function e(e){w.current=e.pointerType;}return {onPointerDown:e,onPointerEnter:e,onMouseMove(e){const{nativeEvent:t}=e;function i(){N.current||y.current||o(true,t,"hover");}d&&!Ne(w.current)||n||0===f||D.current&&e.movementX**2+e.movementY**2<2||(clearTimeout(C.current),"touch"===w.current?i():(D.current=true,C.current=window.setTimeout(i,f)));}}}),[d,o,n,y,f]),_=i__namespace.useMemo((()=>({onMouseEnter(){clearTimeout(b.current);},onMouseLeave(e){T()||I(e.nativeEvent,false);}})),[I,T]);return i__namespace.useMemo((()=>c?{reference:P,floating:_}:{}),[c,P,_])}(L,{enabled:P,delay:{open:75},handleClose:wi({blockPointerEvents:true})}),j=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,elements:{domReference:a}}=e,{enabled:s=true,event:c="click",toggle:l=true,ignoreMouse:u=false,keyboardHandlers:d=true,stickIfOpen:f=true}=t,m=i__namespace.useRef(),h=i__namespace.useRef(false),p=i__namespace.useMemo((()=>({onPointerDown(e){m.current=e.pointerType;},onMouseDown(e){const t=m.current;0===e.button&&"click"!==c&&(Ne(t,true)&&u||(!n||!l||r.current.openEvent&&f&&"mousedown"!==r.current.openEvent.type?(e.preventDefault(),o(true,e.nativeEvent,"click")):o(false,e.nativeEvent,"click")));},onClick(e){const t=m.current;"mousedown"===c&&m.current?m.current=void 0:Ne(t,true)&&u||(!n||!l||r.current.openEvent&&f&&"click"!==r.current.openEvent.type?o(true,e.nativeEvent,"click"):o(false,e.nativeEvent,"click"));},onKeyDown(e){m.current=void 0,e.defaultPrevented||!d||ti(e)||(" "!==e.key||ni(a)||(e.preventDefault(),h.current=true),"Enter"===e.key&&o(!n||!l,e.nativeEvent,"click"));},onKeyUp(e){e.defaultPrevented||!d||ti(e)||ni(a)||" "===e.key&&h.current&&(h.current=false,o(!n||!l,e.nativeEvent,"click"));}})),[r,a,c,u,d,o,n,f,l]);return i__namespace.useMemo((()=>s?{reference:p}:{}),[s,p])}(L,{event:"mousedown",toggle:!P,ignoreMouse:P}),H=function(e,t){var n;void 0===t&&(t={});const{open:o,floatingId:r}=e,{enabled:a=true,role:s="dialog"}=t,c=null!=(n=vi.get(s))?n:s,l=gn(),u=null!=Cn(),d=i__namespace.useMemo((()=>"tooltip"===c||"label"===s?{["aria-"+("label"===s?"labelledby":"describedby")]:o?r:void 0}:{"aria-expanded":o?"true":"false","aria-haspopup":"alertdialog"===c?"dialog":c,"aria-controls":o?r:void 0,..."listbox"===c&&{role:"combobox"},..."menu"===c&&{id:l},..."menu"===c&&u&&{role:"menuitem"},..."select"===s&&{"aria-autocomplete":"none"},..."combobox"===s&&{"aria-autocomplete":"list"}}),[c,r,u,o,l,s]),f=i__namespace.useMemo((()=>{const e={id:r,...c&&{role:c}};return "tooltip"===c||"label"===s?e:{...e,..."menu"===c&&{"aria-labelledby":l}}}),[c,r,l,s]),m=i__namespace.useCallback((e=>{let{active:t,selected:n}=e;const i={role:"option",...t&&{id:r+"-option"}};switch(s){case "select":return {...i,"aria-selected":t&&n};case "combobox":return {...i,...t&&{"aria-selected":true}}}return {}}),[r,s]);return i__namespace.useMemo((()=>a?{reference:d,floating:f,item:m}:{}),[a,d,f,m])}(L,{role:"menu"}),z=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,elements:r,dataRef:a}=e,{enabled:s=true,escapeKey:c=true,outsidePress:l=true,outsidePressEvent:u="pointerdown",referencePress:d=false,referencePressEvent:f="pointerdown",ancestorScroll:m=false,bubbles:h,capture:p}=t,g=Nn(),v=Jt("function"==typeof l?l:()=>false),y="function"==typeof l?v:l,w=i__namespace.useRef(false),b=i__namespace.useRef(false),{escapeKey:k,outsidePress:C}=ri(h),{escapeKey:N,outsidePress:x}=ri(p),S=i__namespace.useRef(false),D=Jt((e=>{var t;if(!n||!s||!c||"Escape"!==e.key)return;if(S.current)return;const i=null==(t=a.current.floatingContext)?void 0:t.nodeId,r=g?Pn(g.nodesRef.current,i):[];if(!k&&(e.stopPropagation(),r.length>0)){let e=true;if(r.forEach((t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__escapeKeyBubbles||(e=false);})),!e)return}o(false,function(e){return "nativeEvent"in e}(e)?e.nativeEvent:e,"escape-key");})),E=Jt((e=>{var t;const n=()=>{var t;D(e),null==(t=De(e))||t.removeEventListener("keydown",n);};null==(t=De(e))||t.addEventListener("keydown",n);})),I=Jt((e=>{var t;const n=w.current;w.current=false;const i=b.current;if(b.current=false,"click"===u&&i)return;if(n)return;if("function"==typeof y&&!y(e))return;const s=De(e),c="["+Dn("inert")+"]",l=xe(r.floating).querySelectorAll(c);let d=te(s)?s:null;for(;d&&!le(d);){const e=fe(d);if(le(e)||!te(e))break;d=e;}if(l.length&&te(s)&&!s.matches("html,body")&&!ge(s,r.floating)&&Array.from(l).every((e=>!ge(d,e))))return;if(ne(s)&&T){const t=s.clientWidth>0&&s.scrollWidth>s.clientWidth,n=s.clientHeight>0&&s.scrollHeight>s.clientHeight;let i=n&&e.offsetX>s.clientWidth;if(n&&"rtl"===ue(s).direction&&(i=e.offsetX<=s.offsetWidth-s.clientWidth),i||t&&e.offsetY>s.clientHeight)return}const f=null==(t=a.current.floatingContext)?void 0:t.nodeId,m=g&&Pn(g.nodesRef.current,f).some((t=>{var n;return Se(e,null==(n=t.context)?void 0:n.elements.floating)}));if(Se(e,r.floating)||Se(e,r.domReference)||m)return;const h=g?Pn(g.nodesRef.current,f):[];if(h.length>0){let e=true;if(h.forEach((t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__outsidePressBubbles||(e=false);})),!e)return}o(false,e,"outside-press");})),A=Jt((e=>{var t;const n=()=>{var t;I(e),null==(t=De(e))||t.removeEventListener(u,n);};null==(t=De(e))||t.addEventListener(u,n);}));i__namespace.useEffect((()=>{if(!n||!s)return;a.current.__escapeKeyBubbles=k,a.current.__outsidePressBubbles=C;let e=-1;function t(e){o(false,e,"ancestor-scroll");}function i(){window.clearTimeout(e),S.current=true;}function l(){e=window.setTimeout((()=>{S.current=false;}),ce()?5:0);}const d=xe(r.floating);c&&(d.addEventListener("keydown",N?E:D,N),d.addEventListener("compositionstart",i),d.addEventListener("compositionend",l)),y&&d.addEventListener(u,x?A:I,x);let f=[];return m&&(te(r.domReference)&&(f=he(r.domReference)),te(r.floating)&&(f=f.concat(he(r.floating))),!te(r.reference)&&r.reference&&r.reference.contextElement&&(f=f.concat(he(r.reference.contextElement)))),f=f.filter((e=>{var t;return e!==(null==(t=d.defaultView)?void 0:t.visualViewport)})),f.forEach((e=>{e.addEventListener("scroll",t,{passive:true});})),()=>{c&&(d.removeEventListener("keydown",N?E:D,N),d.removeEventListener("compositionstart",i),d.removeEventListener("compositionend",l)),y&&d.removeEventListener(u,x?A:I,x),f.forEach((e=>{e.removeEventListener("scroll",t);})),window.clearTimeout(e);}}),[a,r,c,y,u,n,o,m,s,k,C,D,N,E,I,x,A]),i__namespace.useEffect((()=>{w.current=false;}),[y,u]);const M=i__namespace.useMemo((()=>({onKeyDown:D,[ii[f]]:e=>{d&&o(false,e.nativeEvent,"reference-press");}})),[D,o,d,f]),T=i__namespace.useMemo((()=>({onKeyDown:D,onMouseDown(){b.current=true;},onMouseUp(){b.current=true;},[oi[u]]:()=>{w.current=true;}})),[D,u]);return i__namespace.useMemo((()=>s?{reference:M,floating:T}:{}),[s,M,T])}(L,{bubbles:true}),$=gi(L,{listRef:x,activeIndex:C,nested:P,onNavigate:N}),{getReferenceProps:V,getFloatingProps:Y,getItemProps:U}=function(e){ void 0===e&&(e=[]);const t=e.map((e=>null==e?void 0:e.reference)),n=e.map((e=>null==e?void 0:e.floating)),o=e.map((e=>null==e?void 0:e.item)),r=i__namespace.useCallback((t=>ui(t,e,"reference")),t),a=i__namespace.useCallback((t=>ui(t,e,"floating")),n),s=i__namespace.useCallback((t=>ui(t,e,"item")),o);return i__namespace.useMemo((()=>({getReferenceProps:r,getFloatingProps:a,getItemProps:s})),[r,a,s])}([R,j,H,z,$]);i.useEffect((()=>{if(E)return E.events.on("click",e),E.events.on("menuopen",t),()=>{E.events.off("click",e),E.events.off("menuopen",t);};function e(){y(false);}function t(e){e.nodeId!==I&&e.parentId===M&&y(false);}}),[E,I,M]),i.useEffect((()=>{v&&E&&E.events.emit("menuopen",{parentId:M,nodeId:I});}),[E,v,I,M]);const W={activeIndex:C,setActiveIndex:N,getItemProps:U,setHasFocusInside:b,isOpen:v,setIsOpen:y},J=i.useMemo((()=>W),[C,N,U,b,v]),q=k("io-dropdown-menu-button",P&&"io-dropdown-menu-item",v&&!P&&"active",n),K=Yt([O.setReference,T.ref,g]),G=D.activeIndex===T.index?0:-1;return jsxRuntimeExports.jsxs(xn,{id:I,children:[jsxRuntimeExports.jsx(A,{className:q,ref:K,variant:P?"link":o,tabIndex:P?G:void 0,role:P?"menuitem":void 0,"data-open":v?"":void 0,"data-nested":P?"":void 0,"data-focus-inside":w?"":void 0,text:f,icon:P?"chevron-right":r,iconSize:"10",iconRight:!!P||a,disabled:m,...V(D.getItemProps({onFocus(e){p.onFocus?.(e),b(false),D.setHasFocusInside(true);},...p}))}),jsxRuntimeExports.jsx(bi.Provider,{value:J,children:jsxRuntimeExports.jsx(un,{elementsRef:x,labelsRef:S,children:v&&jsxRuntimeExports.jsx(ei,{context:L,modal:false,initialFocus:P?-1:0,returnFocus:!P,children:jsxRuntimeExports.jsx("div",{ref:O.setFloating,className:"io-dropdown-menu",style:_,...Y(),children:h})})})})]})}));function Ni({className:t,...n}){const i=k("io-separator",t);return jsxRuntimeExports.jsx("hr",{className:i,...n})}Ci.displayName="DropdownMenu";const xi=i.forwardRef((({...t},n)=>null===Cn()?jsxRuntimeExports.jsx(Sn,{children:jsxRuntimeExports.jsx(Ci,{ref:n,...t})}):jsxRuntimeExports.jsx(Ci,{ref:n,...t})));function Di({className:n,size:i="large",variant:o="default",align:r="up",text:a,...s}){const c=k("io-loader",{[`io-loader-${o}`]:"default"!==o},"normal"===i&&"io-loader-md","small"===i&&"io-loader-sm",r&&[`direction-${r}`],n);return jsxRuntimeExports.jsxs("div",{className:c,...s,children:[jsxRuntimeExports.jsx("div",{className:"io-loader-icon"}),a&&jsxRuntimeExports.jsx("div",{className:"io-loader-text",children:a})]})}function Ei({className:t,children:n,...i}){const o=k("io-panel-header",t);return jsxRuntimeExports.jsx(Y,{className:o,...i,children:n})}xi.displayName="DropdownMenu",xi.Item=ki,xi.Separator=Ni,Ei.Title=E,Ei.ButtonGroup=V,Ei.Button=A,Ei.ButtonIcon=N,Ei.Dropdown=$;const Ii=i.forwardRef((({className:t,children:n,...i},o)=>{const r=k("io-panel-body",t);return jsxRuntimeExports.jsx("div",{className:r,ref:o,...i,children:n})}));function Ai({className:t,...n}){const i=k("io-panel-footer",t);return jsxRuntimeExports.jsx(J,{className:i,...n})}function Mi({className:t,children:n,...i}){const o=k("io-panel",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function Pi({className:t,variant:n="active",value:i=0,...o}){const r=k("io-progress",n,t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx("div",{className:"io-progress-bar",style:{width:`${i<0?0:i>100?100:i}%`}})})}function _i({text:t="Label",...n}){return jsxRuntimeExports.jsx("label",{...n,children:t})}Ii.displayName="PanelBody",Ai.ButtonGroup=V,Ai.Button=A,Ai.ButtonIcon=N,Ai.Dropdown=$,Mi.Header=Ei,Mi.Body=Ii,Mi.Footer=Ai;const Oi=i.forwardRef((({id:n="input",className:i$1,type:o="text",name:a="input",align:s="up",label:c,iconPrepend:l,iconPrependOnClick:u,iconAppend:d,iconAppendOnClick:f,placeholder:m,disabled:h,readOnly:p,errorMessage:g,errorDataTestId:v,...y},w)=>{const b=k("io-control-input",l&&"io-control-leading-icon",d&&"io-control-trailing-icon",h&&"io-control-disabled",p&&"io-control-readonly",g&&"io-control-error",s&&[`direction-${s}`],i$1),N=i.useCallback((e=>{h?e.preventDefault():u&&u(e);}),[u,h]),x=i.useCallback((e=>{h?e.preventDefault():f&&f(e);}),[f,h]);return jsxRuntimeExports.jsxs("div",{className:b,children:[c&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:c}),l&&jsxRuntimeExports.jsx(C,{variant:l,onClick:e=>N(e)}),jsxRuntimeExports.jsx("input",{id:n,className:"io-input",ref:w,type:o,name:a,tabIndex:0,placeholder:m??(()=>{switch(o){case "email":return "Enter your email here...";case "number":return "Enter number here...";case "password":return "Enter your password here...";case "tel":return "Enter your phone number here...";case "file":return "Select a file...";default:return "Enter text here..."}})(),disabled:h,readOnly:p,...y}),d&&jsxRuntimeExports.jsx(C,{variant:d,onClick:e=>x(e)}),g&&jsxRuntimeExports.jsxs("div",{"data-testid":v,children:[jsxRuntimeExports.jsx(C,{variant:"close"}),g]})]})}));Oi.displayName="Input";const Li=i.forwardRef((({id:n="textarea",className:i,name:o="textarea",align:r="up",label:a,rows:s=4,placeholder:c="Enter text here...",disabled:l,readOnly:u,...d},f)=>{const m=k("io-control-textarea",l&&"io-control-disabled",u&&"io-control-readonly",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:m,children:[a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a}),jsxRuntimeExports.jsx("textarea",{id:n,className:"io-textarea",ref:f,name:o,tabIndex:0,placeholder:c,disabled:l,readOnly:u,rows:s,...d})]})}));Li.displayName="Textarea";const Fi=i.forwardRef((({id:n="checkbox",className:i,name:o="checkbox",align:r="left",label:a,checked:s,disabled:c,...l},u)=>{const d=k("io-control-checkbox",s&&"io-control-checked",c&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:o,tabIndex:0,checked:s,disabled:c,...l}),a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a})]})}));Fi.displayName="Checkbox";const Bi=i.forwardRef((({id:n="radio",className:i,name:o="radio",align:r="left",label:a,checked:s,disabled:c,...l},u)=>{const d=k("io-control-radio",s&&"io-control-checked",c&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"radio",id:n,className:"io-radio",ref:u,name:o,tabIndex:0,checked:s,disabled:c,...l}),a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a})]})}));Bi.displayName="Radio";const Ri=i.forwardRef((({id:n="toggle",className:i,name:o="toggle",align:r="left",label:a="Toggle",checked:s,disabled:c,...l},u)=>{const d=k("io-control-toggle",s&&"io-control-checked",c&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsx("div",{className:d,children:jsxRuntimeExports.jsxs("label",{className:"io-toggle",children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:o,checked:s,disabled:c,...l}),jsxRuntimeExports.jsx("span",{className:"slider"}),a]})})}));function Hi(e,t){const n=i.useCallback((n=>{const i=t.some((e=>n.key===e));i&&(n.preventDefault(),e());}),[e,t]);i.useEffect((()=>(document.addEventListener("keydown",n),()=>{document.removeEventListener("keydown",n);})),[n]);}function Vi(e,t=500){const[n,i$1]=i.useState(e);return i.useEffect((()=>{const n=setTimeout((()=>{i$1(e);}),t);return ()=>clearTimeout(n)}),[e,t]),n}Ri.displayName="Toggle";const Ji=()=>void 0!==window.glue42gd||void 0!==window.iodesktop;function qi(){return i.useMemo((()=>"object"==typeof window&&Ji()),[])}i.createContext({theme:"dark"});const Xi="___platform_prefs___",eo="_launchpad_pinnedPosition",to="_launchpad_allowDocking",no="_launchpad_minimizeToTray",io="_launchpad_autoCloseStartingAppsAndWorkspaces",oo="_launchpad_showTutorialOnStartup",ro="_layouts_restoreLastSaved",ao="_layouts_saveCurrentOnExit",so="_layouts_showUnsavedChangesPrompt",co="_layouts_showDeletePrompt",lo="_downloads_askForEachDownload",fo=e=>"string"==typeof e?e:e?.message?"string"==typeof e.message?e.message:JSON.stringify(e.message):JSON.stringify(e),mo={SUCCESS:"success",WARNING:"warning"},ho={success:5e3,warning:1e4};var po=function(e){return {ok:true,result:e}},go=function(e){return {ok:false,error:e}},vo=function(e,t,n){return  false===t.ok?t:false===n.ok?n:po(e(t.result,n.result))},yo=function(e,t){return  true===t.ok?t:go(e(t.error))},wo=function(){return wo=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},wo.apply(this,arguments)};function bo(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!bo(e[n],t[n]))return  false;return  true}var i=Object.keys(e);if(i.length!==Object.keys(t).length)return  false;for(n=0;n<i.length;n++){if(!t.hasOwnProperty(i[n]))return  false;if(!bo(e[i[n]],t[i[n]]))return  false}return  true}}var ko=function(e){return Array.isArray(e)},Co=function(e){return "object"==typeof e&&null!==e&&!ko(e)},No=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},xo=function(e){return e.map((function(e){return "string"==typeof e?"."+e:"["+e+"]"})).join("")},So=function(e,t){var n=t.at,i=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(n[i[o]]=e[i[o]]);}return n}(t,["at"]);return wo({at:e+(n||"")},i)},Do=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return yo((function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}}),n.decode(e))},this.runPromise=function(e){return function(e){return  true===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e((function(e){return function(e,t){return  true===t.ok?po(e(t.result)):t}(t,n.decode(e))}))},this.andThen=function(t){return new e((function(e){return function(e,t){return  true===t.ok?e(t.result):t}((function(n){return t(n).decode(e)}),n.decode(e))}))},this.where=function(t,i){return n.andThen((function(n){return t(n)?e.succeed(n):e.fail(i)}))};}return e.string=function(){return new e((function(e){return "string"==typeof e?po(e):go({message:No("a string",e)})}))},e.number=function(){return new e((function(e){return "number"==typeof e?po(e):go({message:No("a number",e)})}))},e.boolean=function(){return new e((function(e){return "boolean"==typeof e?po(e):go({message:No("a boolean",e)})}))},e.constant=function(t){return new e((function(e){return bo(e,t)?po(t):go({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})}))},e.object=function(t){return new e((function(e){if(Co(e)&&t){var n={};for(var i in t)if(t.hasOwnProperty(i)){var o=t[i].decode(e[i]);if(true!==o.ok)return void 0===e[i]?go({message:"the key '"+i+"' is required but was not present"}):go(So("."+i,o.error));void 0!==o.result&&(n[i]=o.result);}return po(n)}return Co(e)?po(e):go({message:No("an object",e)})}))},e.array=function(t){return new e((function(e){if(ko(e)&&t){return e.reduce((function(e,n,i){return vo((function(e,t){return e.concat([t])}),e,function(e,n){return yo((function(e){return So("["+n+"]",e)}),t.decode(e))}(n,i))}),po([]))}return ko(e)?po(e):go({message:No("an array",e)})}))},e.tuple=function(t){return new e((function(e){if(ko(e)){if(e.length!==t.length)return go({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e[i]);if(!o.ok)return go(So("["+i+"]",o.error));n[i]=o.result;}return po(n)}return go({message:No("a tuple of length "+t.length,e)})}))},e.union=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return e.oneOf.apply(e,[t,n].concat(i))},e.intersection=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return new e((function(e){return [t,n].concat(i).reduce((function(t,n){return vo(Object.assign,t,n.decode(e))}),po({}))}))},e.anyJson=function(){return new e((function(e){return po(e)}))},e.unknownJson=function(){return new e((function(e){return po(e)}))},e.dict=function(t){return new e((function(e){if(Co(e)){var n={};for(var i in e)if(e.hasOwnProperty(i)){var o=t.decode(e[i]);if(true!==o.ok)return go(So("."+i,o.error));n[i]=o.result;}return po(n)}return go({message:No("an object",e)})}))},e.optional=function(t){return new e((function(e){return null==e?po(void 0):t.decode(e)}))},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e((function(e){for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e);if(true===o.ok)return o;n[i]=o.error;}var r=n.map((function(e){return "at error"+(e.at||"")+": "+e.message})).join('", "');return go({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})}))},e.withDefault=function(t,n){return new e((function(e){return po(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))}))},e.valueAt=function(t,n){return new e((function(e){for(var i=e,o=0;o<t.length;o++){if(void 0===i)return go({at:xo(t.slice(0,o+1)),message:"path does not exist"});if("string"==typeof t[o]&&!Co(i))return go({at:xo(t.slice(0,o+1)),message:No("an object",i)});if("number"==typeof t[o]&&!ko(i))return go({at:xo(t.slice(0,o+1)),message:No("an array",i)});i=i[t[o]];}return yo((function(e){return void 0===i?{at:xo(t),message:"path does not exist"}:So(xo(t),e)}),n.decode(i))}))},e.succeed=function(t){return new e((function(e){return po(t)}))},e.fail=function(t){return new e((function(e){return go({message:t})}))},e.lazy=function(t){return new e((function(e){return t().decode(e)}))},e}(),Eo=Do.string;Do.number;var Io=Do.boolean,Ao=Do.anyJson;Do.unknownJson;var Mo=Do.constant,To=Do.object,Po=Do.array;Do.tuple,Do.dict;var _o=Do.optional,Oo=Do.oneOf;Do.union,Do.intersection,Do.withDefault,Do.valueAt,Do.succeed,Do.fail,Do.lazy;const Lo=["name","title","version","customProperties","icon","caption","type"],Fo=["appId","name","type","details","version","title","tooltip","lang","description","categories","icons","screenshots","contactEmail","moreInfo","publisher","customConfig","hostManifests","interop","localizedVersions"];var Bo=function(e){return {ok:true,result:e}},Ro=function(e){return {ok:false,error:e}},jo=function(e,t,n){return  false===t.ok?t:false===n.ok?n:Bo(e(t.result,n.result))},Ho=function(e,t){return  true===t.ok?t:Ro(e(t.error))},zo=function(){return zo=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},zo.apply(this,arguments)};function $o(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!$o(e[n],t[n]))return  false;return  true}var i=Object.keys(e);if(i.length!==Object.keys(t).length)return  false;for(n=0;n<i.length;n++){if(!t.hasOwnProperty(i[n]))return  false;if(!$o(e[i[n]],t[i[n]]))return  false}return  true}}var Vo=function(e){return Array.isArray(e)},Yo=function(e){return "object"==typeof e&&null!==e&&!Vo(e)},Uo=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},Wo=function(e){return e.map((function(e){return "string"==typeof e?"."+e:"["+e+"]"})).join("")},Jo=function(e,t){var n=t.at,i=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(n[i[o]]=e[i[o]]);}return n}(t,["at"]);return zo({at:e+(n||"")},i)},qo=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return Ho((function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}}),n.decode(e))},this.runPromise=function(e){return function(e){return  true===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e((function(e){return function(e,t){return  true===t.ok?Bo(e(t.result)):t}(t,n.decode(e))}))},this.andThen=function(t){return new e((function(e){return function(e,t){return  true===t.ok?e(t.result):t}((function(n){return t(n).decode(e)}),n.decode(e))}))},this.where=function(t,i){return n.andThen((function(n){return t(n)?e.succeed(n):e.fail(i)}))};}return e.string=function(){return new e((function(e){return "string"==typeof e?Bo(e):Ro({message:Uo("a string",e)})}))},e.number=function(){return new e((function(e){return "number"==typeof e?Bo(e):Ro({message:Uo("a number",e)})}))},e.boolean=function(){return new e((function(e){return "boolean"==typeof e?Bo(e):Ro({message:Uo("a boolean",e)})}))},e.constant=function(t){return new e((function(e){return $o(e,t)?Bo(t):Ro({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})}))},e.object=function(t){return new e((function(e){if(Yo(e)&&t){var n={};for(var i in t)if(t.hasOwnProperty(i)){var o=t[i].decode(e[i]);if(true!==o.ok)return void 0===e[i]?Ro({message:"the key '"+i+"' is required but was not present"}):Ro(Jo("."+i,o.error));void 0!==o.result&&(n[i]=o.result);}return Bo(n)}return Yo(e)?Bo(e):Ro({message:Uo("an object",e)})}))},e.array=function(t){return new e((function(e){if(Vo(e)&&t){return e.reduce((function(e,n,i){return jo((function(e,t){return e.concat([t])}),e,function(e,n){return Ho((function(e){return Jo("["+n+"]",e)}),t.decode(e))}(n,i))}),Bo([]))}return Vo(e)?Bo(e):Ro({message:Uo("an array",e)})}))},e.tuple=function(t){return new e((function(e){if(Vo(e)){if(e.length!==t.length)return Ro({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e[i]);if(!o.ok)return Ro(Jo("["+i+"]",o.error));n[i]=o.result;}return Bo(n)}return Ro({message:Uo("a tuple of length "+t.length,e)})}))},e.union=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return e.oneOf.apply(e,[t,n].concat(i))},e.intersection=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return new e((function(e){return [t,n].concat(i).reduce((function(t,n){return jo(Object.assign,t,n.decode(e))}),Bo({}))}))},e.anyJson=function(){return new e((function(e){return Bo(e)}))},e.unknownJson=function(){return new e((function(e){return Bo(e)}))},e.dict=function(t){return new e((function(e){if(Yo(e)){var n={};for(var i in e)if(e.hasOwnProperty(i)){var o=t.decode(e[i]);if(true!==o.ok)return Ro(Jo("."+i,o.error));n[i]=o.result;}return Bo(n)}return Ro({message:Uo("an object",e)})}))},e.optional=function(t){return new e((function(e){return null==e?Bo(void 0):t.decode(e)}))},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e((function(e){for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e);if(true===o.ok)return o;n[i]=o.error;}var r=n.map((function(e){return "at error"+(e.at||"")+": "+e.message})).join('", "');return Ro({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})}))},e.withDefault=function(t,n){return new e((function(e){return Bo(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))}))},e.valueAt=function(t,n){return new e((function(e){for(var i=e,o=0;o<t.length;o++){if(void 0===i)return Ro({at:Wo(t.slice(0,o+1)),message:"path does not exist"});if("string"==typeof t[o]&&!Yo(i))return Ro({at:Wo(t.slice(0,o+1)),message:Uo("an object",i)});if("number"==typeof t[o]&&!Vo(i))return Ro({at:Wo(t.slice(0,o+1)),message:Uo("an array",i)});i=i[t[o]];}return Ho((function(e){return void 0===i?{at:Wo(t),message:"path does not exist"}:Jo(Wo(t),e)}),n.decode(i))}))},e.succeed=function(t){return new e((function(e){return Bo(t)}))},e.fail=function(t){return new e((function(e){return Ro({message:t})}))},e.lazy=function(t){return new e((function(e){return t().decode(e)}))},e}(),Ko=qo.string,Go=qo.number,Qo=qo.boolean,Xo=qo.anyJson;qo.unknownJson;var Zo=qo.constant,er=qo.object,tr=qo.array;qo.tuple;var nr=qo.dict,ir=qo.optional,or=qo.oneOf;qo.union,qo.intersection,qo.withDefault,qo.valueAt,qo.succeed,qo.fail,qo.lazy;const rr=Ko().where((e=>e.length>0),"Expected a non-empty string"),ar=Go().where((e=>e>=0),"Expected a non-negative number"),sr=er({name:rr,displayName:ir(Ko()),contexts:ir(tr(Ko())),customConfig:ir(er())}),cr=or(Zo("web"),Zo("native"),Zo("citrix"),Zo("onlineNative"),Zo("other")),lr=er({url:rr}),ur=er({src:rr,size:ir(rr),type:ir(rr)}),dr=er({src:rr,size:ir(rr),type:ir(rr),label:ir(rr)}),fr=er({contexts:tr(rr),displayName:ir(rr),resultType:ir(rr),customConfig:ir(Xo())}),mr=er({listensFor:ir(nr(fr)),raises:ir(nr(tr(rr)))}),hr=er({broadcasts:ir(tr(rr)),listensFor:ir(tr(rr))}),pr=er({name:rr,description:ir(rr),broadcasts:ir(tr(rr)),listensFor:ir(tr(rr))}),gr=er({intents:ir(mr),userChannels:ir(hr),appChannels:ir(tr(pr))}),vr=er({url:ir(rr),top:ir(Go()),left:ir(Go()),width:ir(ar),height:ir(ar)}),yr=er({name:ir(rr),type:ir(rr.where((e=>"window"===e),"Expected a value of window")),title:ir(rr),version:ir(rr),customProperties:ir(Xo()),icon:ir(Ko()),caption:ir(Ko()),details:ir(vr),intents:ir(tr(sr)),hidden:ir(Qo())}),wr=er({name:rr,appId:rr,title:ir(rr),version:ir(rr),manifest:rr,manifestType:rr,tooltip:ir(rr),description:ir(rr),contactEmail:ir(rr),supportEmail:ir(rr),publisher:ir(rr),images:ir(tr(er({url:ir(rr)}))),icons:ir(tr(er({icon:ir(rr)}))),customConfig:Xo(),intents:ir(tr(sr))}),br=er({appId:ir(rr),name:ir(rr),details:ir(lr),version:ir(rr),title:ir(rr),tooltip:ir(rr),lang:ir(rr),description:ir(rr),categories:ir(tr(rr)),icons:ir(tr(ur)),screenshots:ir(tr(dr)),contactEmail:ir(rr),supportEmail:ir(rr),moreInfo:ir(rr),publisher:ir(rr),customConfig:ir(tr(Xo())),hostManifests:ir(Xo()),interop:ir(gr)}),kr=er({appId:rr,name:ir(rr),type:cr,details:lr,version:ir(rr),title:ir(rr),tooltip:ir(rr),lang:ir(rr),description:ir(rr),categories:ir(tr(rr)),icons:ir(tr(ur)),screenshots:ir(tr(dr)),contactEmail:ir(rr),supportEmail:ir(rr),moreInfo:ir(rr),publisher:ir(rr),customConfig:ir(tr(Xo())),hostManifests:ir(Xo()),interop:ir(gr),localizedVersions:ir(nr(br))}),Cr=or(wr,kr),Nr=e=>`${e.kind} at ${e.at}: ${JSON.stringify(e.input)}. Reason - ${e.message}`;class xr{fdc3ToDesktopDefinitionType={web:"window",native:"exe",citrix:"citrix",onlineNative:"clickonce",other:"window"};toApi(){return {isFdc3Definition:this.isFdc3Definition.bind(this),parseToBrowserBaseAppData:this.parseToBrowserBaseAppData.bind(this),parseToDesktopAppConfig:this.parseToDesktopAppConfig.bind(this)}}isFdc3Definition(e){const t=Cr.run(e);return t.ok?e.appId&&e.details?{isFdc3:true,version:"2.0"}:e.manifest?{isFdc3:true,version:"1.2"}:{isFdc3:false,reason:"The passed definition is not FDC3"}:{isFdc3:false,reason:Nr(t.error)}}parseToBrowserBaseAppData(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const i=Cr.run(e);if(!i.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Nr(i.error)}`);const o=this.getUserPropertiesFromDefinition(e,n),r={url:this.getUrl(e,n)},a={name:e.appId,type:"window",createOptions:r,userProperties:{...o,intents:"1.2"===n?o.intents:this.getIntentsFromV2AppDefinition(e),details:r},title:e.title,version:e.version,icon:this.getIconFromDefinition(e,n),caption:e.description,fdc3:"2.0"===n?{...e,definitionVersion:"2.0"}:void 0},s=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!s)return a;const c=yr.run(s);if(!c.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Nr(c.error)}`);return Object.keys(c.result).length?this.mergeBaseAppDataWithGlueManifest(a,c.result):a}parseToDesktopAppConfig(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const i=Cr.run(e);if(!i.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Nr(i.error)}`);if("1.2"===n){const t=e;return {name:t.appId,type:"window",details:{url:this.getUrl(e,n)},version:t.version,title:t.title,tooltip:t.tooltip,caption:t.description,icon:t.icons?.[0].icon,intents:t.intents,customProperties:{manifestType:t.manifestType,images:t.images,contactEmail:t.contactEmail,supportEmail:t.supportEmail,publisher:t.publisher,icons:t.icons,customConfig:t.customConfig}}}const o=e,r={name:o.appId,type:this.fdc3ToDesktopDefinitionType[o.type],details:o.details,version:o.version,title:o.title,tooltip:o.tooltip,caption:o.description,icon:this.getIconFromDefinition(o,"2.0"),intents:this.getIntentsFromV2AppDefinition(o),fdc3:{...o,definitionVersion:"2.0"}},a=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!a)return r;if("object"!=typeof a||Array.isArray(a))throw new Error(`Invalid '${e.hostManifests.ioConnect?"hostManifests.ioConnect":"hostManifests['Glue42']"}' key`);return this.mergeDesktopConfigWithGlueManifest(r,a)}getUserPropertiesFromDefinition(e,t){return "1.2"===t?Object.fromEntries(Object.entries(e).filter((([e])=>!Lo.includes(e)))):Object.fromEntries(Object.entries(e).filter((([e])=>!Lo.includes(e)&&!Fo.includes(e))))}getUrl(e,t){let n;if("1.2"===t){const t=JSON.parse(e.manifest);n=t.details?.url||t.url;}else n=e.details?.url;if(!n||"string"!=typeof n)throw new Error(`Invalid FDC3 ${t} definition. Provide valid 'url' under '${"1.2"===t?"manifest":"details"}' key`);return n}getIntentsFromV2AppDefinition(e){const t=e.interop?.intents?.listensFor;if(!t)return;return Object.entries(t).map((e=>{const[t,n]=e;return {name:t,...n}}))}getIconFromDefinition(e,t){return "1.2"===t?e.icons?.find((e=>e.icon))?.icon||void 0:e.icons?.find((e=>e.src))?.src||void 0}mergeBaseAppDataWithGlueManifest(e,t){let n=e;if(t.customProperties&&(n.userProperties={...e.userProperties,...t.customProperties}),t.details){const i={...e.createOptions,...t.details};n.createOptions=i,n.userProperties.details=i;}return Array.isArray(t.intents)&&(n.userProperties.intents=(n.userProperties.intents||[]).concat(t.intents)),n={...n,...t},delete n.details,delete n.intents,n}mergeDesktopConfigWithGlueManifest(e,t){const n=Object.assign({},e,t,{details:{...e.details,...t.details}});return Array.isArray(t.intents)&&(n.intents=(e.intents||[]).concat(t.intents)),n}}const Sr={common:{nonEmptyStringDecoder:rr,nonNegativeNumberDecoder:ar},fdc3:{allDefinitionsDecoder:Cr,v1DefinitionDecoder:wr,v2DefinitionDecoder:kr}};var Dr;!function(e){e.USER_CANCELLED="User Closed Intents Resolver UI without choosing a handler",e.CALLER_NOT_DEFINED="Caller Id is not defined",e.TIMEOUT_HIT="Timeout hit",e.INTENT_NOT_FOUND="Cannot find Intent",e.HANDLER_NOT_FOUND="Cannot find Intent Handler",e.TARGET_INSTANCE_UNAVAILABLE="Cannot start Target Instance",e.INTENT_DELIVERY_FAILED="Target Instance did not add a listener",e.RESOLVER_UNAVAILABLE="Intents Resolver UI unavailable",e.RESOLVER_TIMEOUT="User did not choose a handler",e.INVALID_RESOLVER_RESPONSE="Intents Resolver UI returned invalid response",e.INTENT_HANDLER_REJECTION="Intent Handler function processing the raised intent threw an error or rejected the promise it returned";}(Dr||(Dr={}));const Er=new class{_fdc3;_decoders=Sr;_errors={intents:Dr};get fdc3(){return this._fdc3||(this._fdc3=(new xr).toApi()),this._fdc3}get decoders(){return this._decoders}get errors(){return this._errors}};Er.fdc3;const Ir=Er.decoders;Er.errors;const Ar=Ir.common.nonEmptyStringDecoder,Mr=Oo(Mo("add"),Mo("align-bottom"),Mo("align-bottom-solid"),Mo("align-left"),Mo("align-left-bottom"),Mo("align-left-bottom-solid"),Mo("align-left-solid"),Mo("align-left-top"),Mo("align-left-top-solid"),Mo("align-right"),Mo("align-right-bottom"),Mo("align-right-bottom-solid"),Mo("align-right-solid"),Mo("align-right-top"),Mo("align-right-top-solid"),Mo("align-top"),Mo("align-top-solid"),Mo("always-on-top"),Mo("always-on-top-on"),Mo("application"),Mo("arrow-down-long"),Mo("arrow-down-to-bracket"),Mo("arrow-left-long"),Mo("arrow-right-from-bracket"),Mo("arrow-right-long"),Mo("arrow-right"),Mo("arrow-up"),Mo("arrow-up-long"),Mo("ban"),Mo("bell"),Mo("bell-solid"),Mo("bookmark"),Mo("bullseye-pointer"),Mo("certificate"),Mo("check"),Mo("check-light"),Mo("check-solid"),Mo("chevron-down"),Mo("chevron-left"),Mo("chevron-right"),Mo("chevron-up"),Mo("circle-info"),Mo("circle-xmark"),Mo("circle-xmark-full"),Mo("clock"),Mo("clock-rotate-left"),Mo("clone"),Mo("close"),Mo("cog"),Mo("cog-solid"),Mo("collapse"),Mo("copy"),Mo("download"),Mo("delete-left"),Mo("dev-tools"),Mo("ellipsis"),Mo("ellipsis-vertical"),Mo("expand"),Mo("envelope"),Mo("envelope-open"),Mo("exclamation-mark"),Mo("expand"),Mo("feedback"),Mo("filter"),Mo("floppy"),Mo("floppy-disk-pen"),Mo("folder"),Mo("folder-open"),Mo("globe"),Mo("group"),Mo("hidden"),Mo("home"),Mo("house"),Mo("info"),Mo("keyboard"),Mo("layout"),Mo("link"),Mo("list-ul"),Mo("lock"),Mo("logo"),Mo("minimize"),Mo("minimize-down"),Mo("paper-plane-top"),Mo("paperclip"),Mo("pause"),Mo("pen-line"),Mo("pen-to-square"),Mo("pin"),Mo("play"),Mo("pop-in"),Mo("pop-in-widget"),Mo("pop-out"),Mo("power-off"),Mo("publish"),Mo("refresh"),Mo("resize"),Mo("restore"),Mo("rotate-right"),Mo("search"),Mo("search-filled"),Mo("sliders"),Mo("snooze"),Mo("spinner"),Mo("square"),Mo("square-arrow-down"),Mo("square-arrow-up"),Mo("star"),Mo("star-full"),Mo("sticky-off"),Mo("sticky-off-hover"),Mo("sticky-on"),Mo("sticky-on-hover"),Mo("subscribe"),Mo("system-close"),Mo("system-maximize"),Mo("system-minimize"),Mo("thumbs-down"),Mo("thumbs-up"),Mo("trash"),Mo("trash-can"),Mo("triangle-exclamation"),Mo("unlock"),Mo("unpin"),Mo("up-to-line"),Mo("user"),Mo("user-gear"),Mo("visible"),Mo("workspace")),Tr=To({id:Ar,title:Ar,description:_o(Eo()),icon:_o(Mr),iconSrc:_o(Ar),contextMenuActions:_o(Po(Ao())),type:Ar}),Pr=Oo(Mo("Left"),Mo("Right")),_r=Oo(Mo("daily"),Mo("weekly")),Or=Oo(Mo("Sunday"),Mo("Monday"),Mo("Tuesday"),Mo("Wednesday"),Mo("Thursday"),Mo("Friday"),Mo("Saturday")),Lr=To({customPrefs:_o(Ao()),_launchpad_collapsedSections:_o(Po(Ar)),_launchpad_favorites:_o(Po(Tr)),_launchpad_isLayoutsPanelOpen:_o(Io()),_launchpad_isCollapsed:_o(Io()),_launchpad_isPinned:_o(Io()),_launchpad_pinnedPosition:_o(Pr),_launchpad_allowDocking:_o(Io()),_launchpad_minimizeToTray:_o(Io()),_launchpad_autoCloseStartingAppsAndWorkspaces:_o(Io()),_launchpad_showTutorialOnStartup:_o(Io()),_layouts_restoreLastSaved:_o(Io()),_layouts_saveCurrentOnExit:_o(Io()),_layouts_showUnsavedChangesPrompt:_o(Io()),_layouts_showDeletePrompt:_o(Io()),_downloads_askForEachDownload:_o(Io()),_downloads_location:_o(Eo()),_system_scheduleRestart:_o(Io()),_system_scheduleRestartTime:_o(Ar),_system_scheduleRestartFrequency:_o(_r),_system_scheduleRestartDay:_o(Or),_system_scheduleShutdown:_o(Io()),_system_scheduleShutdownTime:_o(Ar),_system_scheduleShutdownFrequency:_o(_r),_system_scheduleShutdownDay:_o(Or)}),Fr=async e=>{const{io:t,variant:n,text:i,error:o}=e,r=fo(o);try{if(n===mo.WARNING&&t.logger.warn(r?`${i} ${r}`:i),!("modals"in t)||!t.modals)throw new Error("Modals are not enabled.");const e={text:i,variant:n,ttl:ho[n]};await t.modals.alerts.request(e);}catch(e){console.warn("Failed to request alert. ",{error:e});}},Br=i.createContext(void 0);function Hr({prefKey:e}){const t=i.useContext(IOConnectContext),n=i.useContext(Br),i$1=n?.prefs?.[e],o=n?.isInitialSetupCompleted??false,[a,l]=i.useState(!o),[f,m]=i.useState(),h=i.useRef(0);i.useEffect((()=>{o&&0===h.current&&l(false);}),[o]);const p=i.useCallback((async n=>{if(!t)return;const i=++h.current;l(true),m(void 0);const o=async n=>{n&&await Fr({io:t,variant:mo.WARNING,text:`Failed to update prefKey "${e}".`,error:n}),i===h.current&&(l(false),n&&m({message:fo(n)}));};let r;if(n instanceof Function)try{r=n((await t.contexts.get(Xi))[e]);}catch(e){return o(e)}else r=n;try{const n=Lr.runWithException({[e]:r});await t.contexts.update(Xi,n);}catch(e){return o(e)}await o();}),[t,e]);if(void 0===n)throw new Error("usePlatformPref must be used within a PlatformPrefsProvider");return {error:f,isLoading:a,update:p,value:i$1}}function zr(e,t,n){return Math.min(Math.max(e,n),t)}class $r extends Error{constructor(e){super(`Failed to parse color: "${e}"`);}}var Vr=$r;function Yr(e){if("string"!=typeof e)throw new Vr(e);if("transparent"===e.trim().toLowerCase())return [0,0,0,0];let t=e.trim();t=Xr.test(e)?function(e){const t=e.toLowerCase().trim(),n=Wr[function(e){let t=5381,n=e.length;for(;n;)t=33*t^e.charCodeAt(--n);return (t>>>0)%2341}(t)];if(!n)throw new Vr(e);return `#${n}`}(e):e;const n=qr.exec(t);if(n){const e=Array.from(n).slice(1);return [...e.slice(0,3).map((e=>parseInt(Jr(e,2),16))),parseInt(Jr(e[3]||"f",2),16)/255]}const i=Kr.exec(t);if(i){const e=Array.from(i).slice(1);return [...e.slice(0,3).map((e=>parseInt(e,16))),parseInt(e[3]||"ff",16)/255]}const o=Gr.exec(t);if(o){const e=Array.from(o).slice(1);return [...e.slice(0,3).map((e=>parseInt(e,10))),parseFloat(e[3]||"1")]}const r=Qr.exec(t);if(r){const[t,n,i,o]=Array.from(r).slice(1).map(parseFloat);if(zr(0,100,n)!==n)throw new Vr(e);if(zr(0,100,i)!==i)throw new Vr(e);return [...ea(t,n,i),Number.isNaN(o)?1:o]}throw new Vr(e)}const Ur=e=>parseInt(e.replace(/_/g,""),36),Wr="1q29ehhb 1n09sgk7 1kl1ekf_ _yl4zsno 16z9eiv3 1p29lhp8 _bd9zg04 17u0____ _iw9zhe5 _to73___ _r45e31e _7l6g016 _jh8ouiv _zn3qba8 1jy4zshs 11u87k0u 1ro9yvyo 1aj3xael 1gz9zjz0 _3w8l4xo 1bf1ekf_ _ke3v___ _4rrkb__ 13j776yz _646mbhl _nrjr4__ _le6mbhl 1n37ehkb _m75f91n _qj3bzfz 1939yygw 11i5z6x8 _1k5f8xs 1509441m 15t5lwgf _ae2th1n _tg1ugcv 1lp1ugcv 16e14up_ _h55rw7n _ny9yavn _7a11xb_ 1ih442g9 _pv442g9 1mv16xof 14e6y7tu 1oo9zkds 17d1cisi _4v9y70f _y98m8kc 1019pq0v 12o9zda8 _348j4f4 1et50i2o _8epa8__ _ts6senj 1o350i2o 1mi9eiuo 1259yrp0 1ln80gnw _632xcoy 1cn9zldc _f29edu4 1n490c8q _9f9ziet 1b94vk74 _m49zkct 1kz6s73a 1eu9dtog _q58s1rz 1dy9sjiq __u89jo3 _aj5nkwg _ld89jo3 13h9z6wx _qa9z2ii _l119xgq _bs5arju 1hj4nwk9 1qt4nwk9 1ge6wau6 14j9zlcw 11p1edc_ _ms1zcxe _439shk6 _jt9y70f _754zsow 1la40eju _oq5p___ _x279qkz 1fa5r3rv _yd2d9ip _424tcku _8y1di2_ _zi2uabw _yy7rn9h 12yz980_ __39ljp6 1b59zg0x _n39zfzp 1fy9zest _b33k___ _hp9wq92 1il50hz4 _io472ub _lj9z3eo 19z9ykg0 _8t8iu3a 12b9bl4a 1ak5yw0o _896v4ku _tb8k8lv _s59zi6t _c09ze0p 1lg80oqn 1id9z8wb _238nba5 1kq6wgdi _154zssg _tn3zk49 _da9y6tc 1sg7cv4f _r12jvtt 1gq5fmkz 1cs9rvci _lp9jn1c _xw1tdnb 13f9zje6 16f6973h _vo7ir40 _bt5arjf _rc45e4t _hr4e100 10v4e100 _hc9zke2 _w91egv_ _sj2r1kk 13c87yx8 _vqpds__ _ni8ggk8 _tj9yqfb 1ia2j4r4 _7x9b10u 1fc9ld4j 1eq9zldr _5j9lhpx _ez9zl6o _md61fzm".split(" ").reduce(((e,t)=>{const n=Ur(t.substring(0,3)),i=Ur(t.substring(3)).toString(16);let o="";for(let e=0;e<6-i.length;e++)o+="0";return e[n]=`${o}${i}`,e}),{});const Jr=(e,t)=>Array.from(Array(t)).map((()=>e)).join(""),qr=new RegExp(`^#${Jr("([a-f0-9])",3)}([a-f0-9])?$`,"i"),Kr=new RegExp(`^#${Jr("([a-f0-9]{2})",3)}([a-f0-9]{2})?$`,"i"),Gr=new RegExp(`^rgba?\\(\\s*(\\d+)\\s*${Jr(",\\s*(\\d+)\\s*",2)}(?:,\\s*([\\d.]+))?\\s*\\)$`,"i"),Qr=/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i,Xr=/^[a-z]+$/i,Zr=e=>Math.round(255*e),ea=(e,t,n)=>{let i=n/100;if(0===t)return [i,i,i].map(Zr);const o=(e%360+360)%360/60,r=(1-Math.abs(2*i-1))*(t/100),a=r*(1-Math.abs(o%2-1));let s=0,c=0,l=0;o>=0&&o<1?(s=r,c=a):o>=1&&o<2?(s=a,c=r):o>=2&&o<3?(c=r,l=a):o>=3&&o<4?(c=a,l=r):o>=4&&o<5?(s=a,l=r):o>=5&&o<6&&(s=r,l=a);const u=i-r/2;return [s+u,c+u,l+u].map(Zr)};function ta(e){return function(e){if("transparent"===e)return 0;function t(e){const t=e/255;return t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}const[n,i,o]=Yr(e);return .2126*t(n)+.7152*t(i)+.0722*t(o)}(e)>.179}function na({className:t,channel:n,...i}){const o=k("io-channel-badge",t);return jsxRuntimeExports.jsx("div",{className:o,style:{color:(r=n.color,ta(r)?"#000":"#fff"),backgroundColor:n.color},...i,children:jsxRuntimeExports.jsx("span",{className:"io-channel-badge-label",children:n.label})});var r;}function ia(){return jsxRuntimeExports.jsx(C,{variant:"check"})}function oa({channel:i,handleChannelRestricted:o,restricted:r}){return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{children:i.isSelected&&jsxRuntimeExports.jsx("span",{children:"Active"})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||e.stopPropagation();},tabIndex:0,children:jsxRuntimeExports.jsx(Ri,{label:"Publish",checked:i.write,onChange:()=>{o({...i,write:!i.write});},disabled:r?.write})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||e.stopPropagation();},tabIndex:0,children:jsxRuntimeExports.jsx(Ri,{label:"Subscribe",checked:i.read,onChange:()=>{o({...i,read:!i.read});},disabled:r?.read})})]})}const ra=i.createContext({});function aa({channel:t,isSelected:n,onChannelSelect:i$1,onChannelRestrict:o,...a}){const{variant:c,selectedChannels:l,restrictedChannels:u}=i.useContext(ra),d=n||t.isSelected||l?.includes(t),f=u?.find((e=>e.name===t.name)),m=i.useCallback((()=>i$1?.({...t,isSelected:!d})),[t,i$1,d]),h=i.useCallback((e=>{o&&o(e);}),[o]);return jsxRuntimeExports.jsx(O,{prepend:jsxRuntimeExports.jsx(na,{channel:t}),append:"single"===c||"multi"===c?d&&jsxRuntimeExports.jsx(ia,{}):jsxRuntimeExports.jsx(oa,{channel:t,handleChannelRestricted:h,restricted:f}),isSelected:d,onClick:m,...a,children:t.name},t.name)}const sa=i.forwardRef((({className:n,variant:i$1="single",variantToggle:o=false,channels:r=[],restrictedChannels:a=[],onVariantChange:s,onChannelSelect:c,onChannelRestrict:u,...d},f)=>{const m=k("io-list-channels","directionalSingle"===i$1&&"io-bi-direction",n),h=r.filter((e=>e.isSelected)),p=i.useMemo((()=>({variant:i$1,selectedChannels:h,restrictedChannels:a,onVariantChange:s,onChannelSelect:c,onChannelRestrict:u})),[i$1,h,a,s,c,u]);let g="Select Channel";return "multi"===i$1?g="Select Channels":"directionalSingle"===i$1&&(g="Select Directional Channel"),jsxRuntimeExports.jsx(ra.Provider,{value:p,children:jsxRuntimeExports.jsx("div",{className:m,ref:f,children:jsxRuntimeExports.jsxs(H,{variant:"single",...d,children:[jsxRuntimeExports.jsx(H.ItemTitle,{append:o&&jsxRuntimeExports.jsx(Ri,{label:"Directional",align:"right",onChange:e=>s&&s(e.target.checked),checked:"directionalSingle"===i$1}),children:g}),r?.map((t=>jsxRuntimeExports.jsx(aa,{channel:t,onChannelSelect:c,onChannelRestrict:u},t.name)))]})})})}));sa.displayName="ChannelSelector";var ca=Object.freeze({__proto__:null,Channel:aa,ChannelBadge:na,ChannelDirectionalAppend:oa,ChannelSelector:sa,ChannelSingleAppend:ia,useIOCDChannels:function(e){const t="T42.ChannelSelector.Execute",n=i.useContext(IOConnectContext),[i$1,o]=i.useState(null),[a,l]=i.useState([]),[m,h]=i.useState(""),[p,g]=i.useState(false),[y,w]=i.useState(),[b,k]=i.useState("single"),C=i.useRef(),N=n?.windows.my(),x=i.useCallback((async e=>{const t=n.windows.findById(e),i=await(t?.application?.getConfiguration());return t&&i?i.details?.channelSelector?.preventModifyingRestrictionsFor??[]:[]}),[n.windows]),S=i.useCallback(((e,t,i)=>{if("will-show"===e.command){const t=async()=>{C.current=i,g(true);const{windowId:t,channels:r,variant:a}=e,s="function"==typeof n.channels.getRestrictions?await n.channels.getRestrictions(t):{channels:[]},c=r.map((e=>{const t=((e,t)=>e.channels.find((e=>e.name===t.name)))(s,e);return t?{...e,read:t.read??true,write:t.write??true}:{...e,read:true,write:true}}));let u=c.find((e=>e.isSelected))?.name;if(!u){const e=n?.windows.findById(t);u=await(e?.getChannel());}const d=await x(t);l(d),k(a),h(t),o(((e,t)=>{const n=Array.from({length:e.length},((e,t)=>String.fromCharCode(t+65)));return e.map(((e,i)=>{const o=e.meta;return {key:e.name,color:o.color,name:e.name,isSelected:e.isSelected??e.name===t,label:o?.label??n[i],write:e.write,read:e.read}}))})(c,u)),g(false);};t().catch((e=>{w(e),g(false);}));}}),[n?.windows,n?.channels,x]),D=i.useCallback((({name:e,read:t,write:r,isSelected:a})=>{const s=()=>{if("directionalSingle"!==b)return N?.hide()};o((n=>n?n?.map((n=>n.name===e?{...n,isSelected:a,read:t,write:r}:{...n,isSelected:false})):n));let c=true;const l=i$1?.find((e=>e.isSelected))?.name;"single"===b||"directionalSingle"===b?c=l===e:"multi"===b&&(c=i$1?.find((t=>t.name===e))?.isSelected??false),c?(n?.channels.leave)(m,e).finally((()=>{s()?.catch(console.error);})):n?.channels.join(e,m).finally((()=>{s()?.catch(console.error);}));}),[n?.channels,i$1,b,N,m]),E=i.useCallback((({name:e,read:t,write:i})=>{const o=n?.channels;"directionalSingle"===b&&"function"==typeof o?.restrict&&o?.restrict({name:e,read:t,write:i,windowId:m}).catch(console.error);}),[n?.channels,b,m]),I=i.useCallback((e=>{o((t=>t?t.map((t=>{const n=((e,t)=>e.channels.find((e=>e.name===t.name)))(e,t);return n?{...t,read:n.read,write:n.write}:t})):t));}),[]);return Hi((()=>{N?.hide().catch(console.error);}),["Escape"]),i.useEffect((()=>{const e=N?.onClosing((async e=>(e({showDialog:false}),Promise.resolve())));return e}),[N]),i.useEffect((()=>{const e=n.windows.findById(m);if(!e)return;if("function"!=typeof e?.onChannelRestrictionsChanged)return;return e.onChannelRestrictionsChanged(I)}),[n.windows,m,I]),i.useEffect((()=>((async()=>{await(n?.interop.registerAsync(t,S));})(),()=>{n?.interop.unregister(t);})),[n?.interop,S]),i.useLayoutEffect((()=>{if(e?.current&&i$1&&i$1.length>0){const{height:t,width:n,x:i,y:o}=e.current.getBoundingClientRect();C.current&&t>0&&C.current({height:t,width:n,x:i,y:o});}}),[i$1,e]),{onChannelSelected:D,onChannelRestricted:E,variant:b,isLoading:p,channels:i$1,restrictedChannels:a,error:y,windowId:m}}});i.createContext({config:{message:""},theme:"dark",setResult:()=>{}});function ba({title:n="Downloads"}){const{ItemSearch:i,HeaderButtons:o}=Ya();return jsxRuntimeExports.jsxs("div",{className:"io-dm-header",children:[jsxRuntimeExports.jsxs(Y,{children:[jsxRuntimeExports.jsx(Y.Title,{tag:"h1",text:n,size:"large"}),jsxRuntimeExports.jsx(o,{})]}),jsxRuntimeExports.jsx(i,{})]})}const Ca=i.createContext({configuration:{},items:[],removeItem:()=>{},pauseResumeItem:()=>{},cancelItem:()=>{},clearItems:()=>{},showItemInFolder:()=>{},isSettingsVisible:false,showSettings:()=>{},hideSettings:()=>{},searchQuery:"",setSearch:()=>{},itemsCount:0,setCount:()=>{},setDownloadLocation:()=>{},setDownloadLocationWithDialog:()=>{},sortItems:()=>[],downloadLocationList:[],isDownloadLocationDialogVisible:false}),Na=()=>i.useContext(Ca);function xa({className:n,icon:i$1="search",placeholder:o="Search",...r}){const a=k("io-header-search",n),s=i.useRef(null),{searchQuery:c,setSearch:l,itemsCount:u}=Na();return jsxRuntimeExports.jsxs("div",{className:a,children:[jsxRuntimeExports.jsx(Oi,{ref:s,value:c,iconPrepend:i$1,placeholder:o,onChange:e=>l(e.target.value),...r}),c.length>0&&jsxRuntimeExports.jsx("p",{className:"io-header-search-count",children:`${u} results`})]})}function Sa({className:n,...i}){const{SettingsButton:o,MoreButton:r}=Ya();return jsxRuntimeExports.jsxs(V,{className:n,align:"right",...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{})]})}function Da({icon:t="cog",...n}){const{showSettings:i}=Na();return jsxRuntimeExports.jsx(N,{icon:t,variant:"circle",size:"32",onClick:i,...n})}function Ea({icon:n="ellipsis",...i}){const{items:o,clearItems:r}=Na(),a=0===o.length;return jsxRuntimeExports.jsxs($,{variant:"light",...i,children:[jsxRuntimeExports.jsx($.ButtonIcon,{icon:n,variant:"circle",size:"32"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:jsxRuntimeExports.jsx($.Item,{disabled:a,onClick:e=>(e=>{a?e.stopPropagation():r();})(e),children:"Clear All"})})})]})}function Ia(e,t=false,n=false,i=false){const o=e.getDate(),r=["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()],a=e.getFullYear(),s=e.getHours(),c=e.getMinutes();let l="";return l=c<10?`0${c}`:`${c}`,t?"Today"===t?n?"Today":`Today at ${s}:${l}`:"Yesterday"===t?n?"Yesterday":`Yesterday at ${s}:${l}`:`${s}:${l}`:i?n?`${r} ${o}`:`${r} ${o} at ${s}:${l}`:n?`${r} ${o}, ${a}`:`${r} ${o}, ${a} at ${s}:${l}`}function Aa(e,t={showTime:true}){const n=new Date(1e3*e),i=new Date,o=Math.round((i-n)/1e3),r=Math.round(o/60),a=i.toDateString()===n.toDateString(),s=new Date(i.setDate(i.getDate()-1)).toDateString()===n.toDateString(),c=i.getFullYear()===n.getFullYear();return t.showTime?o<5?"Just Now":o<60?`${o} seconds ago`:o<90?"about a minute ago":r<60?`${r} minutes ago`:a?Ia(n,"Today",false,true):s?Ia(n,"Yesterday",false,true):c?Ia(n,false,false,true):Ia(n):a?"Today":s?"Yesterday":c?Ia(n,false,true,true):Ia(n,false,true)}function Ma({className:t,...n}){const i$1=k("io-dm-body",t),{DownloadListEmpty:o,ItemGroup:r,Item:a}=Ya(),{items:s,searchQuery:c,setCount:d,sortItems:f}=Na(),m=f(s),h=Vi(c),p=i.useMemo((()=>m.filter((e=>e.displayInfo.filename.toLowerCase().includes(h.toLowerCase())||e.displayInfo.url.toLowerCase().includes(h.toLowerCase())))),[m,h]),g=i.useMemo((()=>p.map((e=>({...e,displayInfo:{...e.displayInfo,startTime:Aa(e.displayInfo.startTime,{showTime:false})}})))),[p]),v=i.useMemo((()=>Object.values(g.reduce(((e={},t)=>(e[t.displayInfo.startTime]=e[t.displayInfo.startTime]?.concat([])??[],e[t.displayInfo.startTime].push(t),e)),{}))),[g]);return i.useEffect((()=>{d(p.length);}),[p,d]),jsxRuntimeExports.jsx("div",{className:i$1,...n,children:v&&0!==v.length?v.map((t=>jsxRuntimeExports.jsx(r,{title:String(t[0].displayInfo.startTime)??null,children:t.map((t=>jsxRuntimeExports.jsx(a,{item:t},t.id)))},t[0].id??""))):jsxRuntimeExports.jsx(o,{})})}function Ta({className:n,icon:i="download",text:o="No downloads to display.",...r}){const a=k("io-dm-no-items",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[jsxRuntimeExports.jsx(C,{variant:i}),jsxRuntimeExports.jsx("p",{children:o})]})}function Pa({className:n,title:i,children:o,...r}){const a=k("io-dm-item-group",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[i&&jsxRuntimeExports.jsx("p",{children:i}),o]})}function _a({className:i,item:o,...r}){const{ItemHeader:a,ItemBody:s,ItemFooter:c}=Ya(),{state:l,url:u,filename:d,receivedBytes:f,totalBytes:m,speed:h,timeRemaining:p}=o.displayInfo;if(!o)return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{});const g=k("io-dm-item",o.displayInfo.state&&[l],i);return jsxRuntimeExports.jsxs("div",{className:g,...r,children:[jsxRuntimeExports.jsx(a,{itemID:o.id,filename:d,state:l}),jsxRuntimeExports.jsx(s,{state:l,url:u,bytesReceived:f,bytesTotal:m,speed:h,timeRemaining:p}),jsxRuntimeExports.jsx(c,{itemID:o.id,state:l})]})}function Oa({bytesReceived:t=0,bytesTotal:n=0,...i$1}){const o=i.useCallback((()=>t&&n?Math.round(t/n*100):0),[t,n]);return jsxRuntimeExports.jsx(Pi,{value:o(),...i$1})}function La({className:n,itemID:i$1,filename:o,state:a,cancel:s,remove:c,...l}){const u=k("io-dm-item-header",n),{cancelItem:d,removeItem:f}=Na(),m=i.useCallback((e=>{s?s(e):d(e);}),[s,d]),h=i.useCallback((e=>{c?c(e):f(e);}),[c,f]);return jsxRuntimeExports.jsxs("div",{className:u,...l,children:[jsxRuntimeExports.jsx(E,{text:o,style:{textDecoration:"interrupted"===a||"cancelled"===a?"line-through":"none"}}),jsxRuntimeExports.jsx(N,{icon:"close",onClick:()=>{"progressing"===a||"paused"===a?m(i$1):h(i$1);}})]})}function Fa({className:n,state:i,url:o,bytesReceived:r=0,bytesTotal:a=0,speed:s=0,timeRemaining:c=0,...l}){const u=k("io-dm-item-body",n),d=e=>{const t=["Bytes","KB","MB","GB","TB"];if(0===e)return "0";const n=Math.floor(Math.log(e)/Math.log(1024));return 0===n?`${e}${t[n]}`:`${(e/1024**n).toFixed(1)}${t[n]}`};return jsxRuntimeExports.jsxs("div",{className:u,...l,children:[jsxRuntimeExports.jsx("p",{className:"io-text-small",children:o}),(m=i,"cancelled"===m||"interrupted"===m||"completed"===m?null:jsxRuntimeExports.jsx(Oa,{variant:"paused"===m?"paused":"active",bytesReceived:r,bytesTotal:a})),jsxRuntimeExports.jsx("p",{className:"io-text-default-lh16",children:"completed"===i?`${d(r??0)} - Done`:"cancelled"===i||"interrupted"===i?`${d(r??0)}/${d(a??0)} - Failed`:`${d(r??0)}/${d(a??0)} (${f=s,(f?`${(f/1e6/8).toFixed(2)}MB/s`:0)??0}) - ${(e=>{const t=Math.floor(e/3600),n=Math.floor(e%3600/60);let i="";return t>0&&(i+=`${t} hour${t>1?"s":""}, `),n>0&&(i+=`${n} min${n>1?"s":""}, `),((e=Math.floor(e%60))>0||""===i)&&(i+=`${e} sec${1!==e?"s":""}`),`${i.trim()} left`})(c)??0}`})]});var f,m;}const Ba={success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function Ra({className:n,variant:i,text:o}){const r=k("io-dm-item-status",`io-dm-item-status-${i}`,n);return jsxRuntimeExports.jsxs("div",{className:r,children:[i&&jsxRuntimeExports.jsx(C,{variant:Ba[i],className:"icon-severity"}),o&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:o})]})}function ja({className:i$1,itemID:o,state:a,pauseResume:s,showInFolder:c,cancel:l,...u}){const d=k("io-dm-item-footer",i$1),{pauseResumeItem:f,showItemInFolder:m,cancelItem:h}=Na(),p=i.useCallback((e=>{s?s(e):f(e);}),[s,f]),g=i.useCallback((e=>{c?c(e):m(e);}),[c,m]),v=i.useCallback((e=>{l?l(e):h(e);}),[l,h]);return jsxRuntimeExports.jsx("div",{className:d,...u,children:(()=>{switch(a){case "progressing":return jsxRuntimeExports.jsxs(V,{align:"right",children:[jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Pause",onClick:()=>p(o)}),jsxRuntimeExports.jsx(V.Button,{variant:"link",text:"Cancel",onClick:()=>v(o)})]});case "paused":return jsxRuntimeExports.jsx(V,{align:"right",children:jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Resume",onClick:()=>p(o)})});case "completed":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Ra,{variant:"success",text:"Complete"}),jsxRuntimeExports.jsx(V,{align:"right",children:jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Show in Folder",onClick:()=>g(o)})})]});case "cancelled":return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:jsxRuntimeExports.jsx(Ra,{variant:"warning",text:"Cancelled"})});case "interrupted":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Ra,{variant:"critical",text:"Failed"}),jsxRuntimeExports.jsx(V,{align:"right",children:jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Retry",onClick:()=>p(o)})})]});default:return null}})()})}function Ha({className:n,title:i="Settings",...o}){const r=k("io-dm-settings-panel",n),{configuration:{downloadFolder:a},hideSettings:s,setDownloadLocation:c,setDownloadLocationWithDialog:l,isDownloadLocationDialogVisible:u,downloadLocationList:d}=Na();return jsxRuntimeExports.jsxs(Mi,{className:r,...o,children:[jsxRuntimeExports.jsxs(Mi.Header,{children:[jsxRuntimeExports.jsx(Mi.Header.Title,{size:"large",text:i,tag:"h1"}),jsxRuntimeExports.jsx(Mi.Header.ButtonGroup,{children:jsxRuntimeExports.jsx(N,{variant:"circle",icon:"close",size:"32",onClick:()=>{s();},disabled:u})})]}),jsxRuntimeExports.jsx(Mi.Body,{children:jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsxs($,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx($.Button,{children:jsxRuntimeExports.jsx("span",{className:"io-dm-settings-panel-download-location",children:a??d[0]})}),d.length>1&&jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:d.map(((t,n)=>!t||0===n||n>3?null:jsxRuntimeExports.jsx($.Item,{onClick:()=>{c(t);},children:t},t)))})})]}),jsxRuntimeExports.jsx(A,{className:"io-btn io-dm-settings-panel-download-location-btn",text:"Browse",onClick:()=>{l();},disabled:u})]})})]})}const za={Header:ba,ItemSearch:xa,HeaderButtons:Sa,SettingsButton:Da,MoreButton:Ea,Body:Ma,DownloadListEmpty:Ta,ItemGroup:Pa,Item:_a,ItemProgress:Oa,ItemHeader:La,ItemBody:Fa,ItemFooter:ja,Settings:Ha},$a=i.createContext(za),Va=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...za,...n})),[n]);return jsxRuntimeExports.jsx($a.Provider,{value:i$1,children:t})}));Va.displayName="ComponentsStore";const Ya=()=>i.useContext($a);function Ja(e){if(e&&e.errorHandling&&"function"!=typeof e.errorHandling&&"log"!==e.errorHandling&&"silent"!==e.errorHandling&&"throw"!==e.errorHandling)throw new Error('Invalid options passed to createRegistry. Prop errorHandling should be ["log" | "silent" | "throw" | (err) => void], but '+typeof e.errorHandling+" was passed");var t=e&&"function"==typeof e.errorHandling&&e.errorHandling,n={};function i(n,i){var o=n instanceof Error?n:new Error(n);if(t)t(o);else {var r='[ERROR] callback-registry: User callback for key "'+i+'" failed: '+o.stack;if(e)switch(e.errorHandling){case "log":return console.error(r);case "silent":return;case "throw":throw new Error(r)}console.error(r);}}return {add:function(e,t,o){var r=n[e];return r||(r=[],n[e]=r),r.push(t),o&&setTimeout((function(){o.forEach((function(o){var r;if(null===(r=n[e])||void 0===r?void 0:r.includes(t))try{Array.isArray(o)?t.apply(void 0,o):t.apply(void 0,[o]);}catch(t){i(t,e);}}));}),0),function(){var i=n[e];i&&(i=i.reduce((function(e,n,i){return n===t&&e.length===i||e.push(n),e}),[]),0===i.length?delete n[e]:n[e]=i);}},execute:function(e){for(var t=[],o=1;o<arguments.length;o++)t[o-1]=arguments[o];var r=n[e];if(!r||0===r.length)return [];var a=[];return r.forEach((function(n){try{var o=n.apply(void 0,t);a.push(o);}catch(t){a.push(void 0),i(t,e);}})),a},clear:function(){n={};},clearKey:function(e){n[e]&&delete n[e];}}}Ja.default=Ja;y(Ja);const Ga=i.createContext({config:{env:"",region:"",version:"",buildVersion:"",theme:"",isError:false,mailingList:"",createJiraTicket:true,sendEmail:false,attachments:[],applicationTitle:"",allowEditRecipients:true,attachmentsViewMode:"category",environmentInfo:"",selectedCategories:[],errorMessage:"",showEnvironmentInfo:false,context:{},technicalInfo:"",sendEmailClient:"Outlook"},onThemeChanged:e=>{},openUrl:()=>{},submit:()=>Promise.resolve({}),setBounds:()=>{},close:e=>{},showMailingList:true,setShowMailingList:()=>{},attachmentCategories:[],submitInProgress:false,setSubmitInProgress:()=>{},submitStatus:{type:"success",title:"",text:""},setSubmitStatus:()=>{},submitCompleted:false,setSubmitCompleted:()=>{},jiraTicketURL:"",setJiraTicketURL:()=>{},submitFeedback:()=>{}}),Qa=()=>i.useContext(Ga);function Xa({...n}){const{config:i,close:o}=Qa(),{applicationTitle:r}=i;return jsxRuntimeExports.jsxs(Y,{draggable:true,...n,children:[jsxRuntimeExports.jsx(Y.Title,{tag:"h1",text:r?`Feedback Form - ${r}`:"Feedback Form",size:"large"}),jsxRuntimeExports.jsx(Y.ButtonGroup,{className:"non-draggable",children:jsxRuntimeExports.jsx(Y.ButtonIcon,{variant:"circle",icon:"close",size:"32",onClick:()=>o()})})]})}function Za({className:n,handleSubmit:i,...o}){const r=k("io-panel-body",n),{config:a,submitFeedback:s}=Qa(),{IntroField:c,DescriptionField:l,TechInfoField:u,EnvInfoField:d,FileAttachmentsField:f,CategoryAttachmentsField:m,SettingsField:h,MailListField:p}=vs(),g=i??s,v=`Your feedback will be submitted to the ${a.buildVersion} team and some additional information will be automatically included to help us examine your issue.`;return jsxRuntimeExports.jsxs("form",{className:r,id:"feedback",onSubmit:e=>g(e),...o,children:[jsxRuntimeExports.jsx(c,{children:jsxRuntimeExports.jsx("p",{children:v})}),jsxRuntimeExports.jsx(h,{}),jsxRuntimeExports.jsx(p,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(u,{readOnly:true}),jsxRuntimeExports.jsx(d,{readOnly:true}),"file"===a.attachmentsViewMode?jsxRuntimeExports.jsx(f,{}):jsxRuntimeExports.jsx(m,{})]})}function es({...n}){const{FooterButtons:i}=vs(),{openUrl:o,submitInProgress:r,submitStatus:a,jiraTicketURL:s}=Qa();return jsxRuntimeExports.jsx(J,{...n,children:jsxRuntimeExports.jsxs("div",r?{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsx(I,{children:jsxRuntimeExports.jsx("p",{children:a.title})}),jsxRuntimeExports.jsx(Di,{align:"right",size:"small"})]}:{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsxs(I,{children:[jsxRuntimeExports.jsx("p",{className:"error"===a.type?"io-text-error":"",children:a.title}),s&&jsxRuntimeExports.jsx("a",{href:s,onClick:e=>{e.preventDefault(),o(s);},children:s})]}),jsxRuntimeExports.jsx(i,{})]})})}function ts({className:t,...n}){const{CloseButton:i}=vs(),{close:o}=Qa();return jsxRuntimeExports.jsx(V,{className:t,...n,children:jsxRuntimeExports.jsx(i,{onClick:()=>o()})})}function ns({className:n,...i}){const{SubmitButton:o,CancelButton:r,CloseButton:a}=vs(),{close:s,submitCompleted:c}=Qa();return c?jsxRuntimeExports.jsx(V,{className:n,...i,children:jsxRuntimeExports.jsx(a,{text:"Close",onClick:()=>s()})}):jsxRuntimeExports.jsxs(V,{className:n,...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{onClick:()=>s()})]})}function is({text:t="Submit",...n}){return jsxRuntimeExports.jsx(A,{form:"feedback",type:"submit",variant:"primary",text:t,...n})}function os({text:t="Cancel",...n}){return jsxRuntimeExports.jsx(A,{variant:"link",text:t,...n})}function rs({...t}){return jsxRuntimeExports.jsx(A,{variant:"primary",...t})}function as({showField:t=true,className:n,title:i,hint:o,children:r,...a}){return t?jsxRuntimeExports.jsx(I,{className:n,title:i,hint:o,...a,children:r}):null}function ss({showField:t=true,className:n,title:i="Description",hint:o,readOnly:r=false,disabled:a,...s}){return t?jsxRuntimeExports.jsx(I,{className:n,hint:o,title:"",...s,children:jsxRuntimeExports.jsx(Li,{id:"description",name:"description",label:i,readOnly:r,disabled:a})}):null}function cs({showField:t,className:n,title:i="Technical Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...c}){const{config:l}=Qa(),u=t??l.errorMessage,d=r??l.errorMessage;return u&&d?jsxRuntimeExports.jsx(I,{className:n,hint:o,...c,children:jsxRuntimeExports.jsx(Li,{id:"errorMessage",name:"errorMessage",label:i,value:d,readOnly:a,disabled:s})}):null}function ls({showField:t,className:n,title:i="Environment Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...c}){const{config:l}=Qa(),u=t??l.showEnvironmentInfo,d=r??l.environmentInfo;return u&&d?jsxRuntimeExports.jsx(I,{className:n,hint:o,...c,children:jsxRuntimeExports.jsx(Li,{id:"environmentInfo",name:"environmentInfo",label:i,value:d,readOnly:a,disabled:s})}):null}function us({showField:t=true,className:n,title:i$1="Attachments",hint:o,readOnly:a=false,disabled:s,attachments:c,selectedCategories:l,...u}){const d=k("io-block-list-gap",n),{config:f}=Qa(),m=c??f.attachments,h=l??f.selectedCategories,p=i.useCallback((e=>!!h&&-1!==h.indexOf(e)),[h]);return t?!m||m.length<=0?jsxRuntimeExports.jsx(I,{title:"Attachments",children:jsxRuntimeExports.jsx("p",{children:"No Attachments"})}):jsxRuntimeExports.jsx(I,{className:d,title:i$1,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"file-attachments",children:m.map((t=>jsxRuntimeExports.jsx(Fi,{id:t.id,name:t.id,label:t.name,readOnly:a,disabled:s,defaultChecked:p(t.category)},t.id)))})}):null}function ds({showField:t=true,className:n,title:i$1="Attachments",hint:o,readOnly:a=false,disabled:s,categories:c,selectedCategories:l,...u}){const{config:d,attachmentCategories:f}=Qa(),m=c??f,h=l??d.selectedCategories,p=i.useCallback((e=>!!h&&-1!==h.indexOf(e)),[h]);return t?!m||m.length<=0?jsxRuntimeExports.jsx("p",{children:"No Attachments"}):jsxRuntimeExports.jsx(I,{className:n,title:i$1,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"category-attachments",children:m.map((t=>jsxRuntimeExports.jsx(Ri,{id:t,name:t,align:"right",label:t,readOnly:a,disabled:s,defaultChecked:p(t)},t)))})}):null}function fs({className:n,title:i,hint:o,showField:r=true,showJiraTicketField:a,jiraTicketLabel:s="Create Jira Ticket",showSendEmailField:c,sendEmailLabel:l="Send Email",readOnly:u=false,disabled:d,...f}){const m=k("io-block-list-gap",n),{config:h,showMailingList:p,setShowMailingList:g}=Qa();if(!r)return null;const v=a??h.createJiraTicket,y=c??h.sendEmail;return jsxRuntimeExports.jsxs(I,{className:m,hint:o,title:i,...f,children:[v&&jsxRuntimeExports.jsx(Ri,{id:"createJiraTicket",name:"createJiraTicket",label:s,align:"right",readOnly:u,disabled:d,defaultChecked:v}),y&&jsxRuntimeExports.jsx(Ri,{onChange:()=>{g(!p);},id:"sendEmail",name:"sendEmail",label:l,align:"right",readOnly:u,disabled:d,defaultChecked:y})]})}function ms({showField:t=true,className:n,title:i="Email List",hint:o="Separate with commas or semicolons.",placeholder:r="john.doe@somedomain.com; jane.doe@otherdomain.com",readOnly:a,disabled:s,...c}){const{config:l,showMailingList:u}=Qa(),d=t??l.sendEmail,f=a??false===l.allowEditRecipients;return d&&u?jsxRuntimeExports.jsx(I,{className:n,hint:o,...c,children:jsxRuntimeExports.jsx(Oi,{id:"mailingList",name:"mailingList",label:i,placeholder:r,readOnly:f,disabled:s,defaultValue:l.mailingList??""})}):null}const hs={Header:Xa,Body:Za,Footer:es,HeaderButtons:ts,FooterButtons:ns,SubmitButton:is,CancelButton:os,CloseButton:rs,IntroField:as,DescriptionField:ss,TechInfoField:cs,EnvInfoField:ls,FileAttachmentsField:us,CategoryAttachmentsField:ds,SettingsField:fs,MailListField:ms},ps=i.createContext(hs),gs=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...hs,...n})),[n]);return jsxRuntimeExports.jsx(ps.Provider,{value:i$1,children:t})}));function vs(e){return {...i.useContext(ps),...e}}gs.displayName="ComponentsStore";function bs({className:n,title:i="General",...o}){const r=k("io-notifications-settings-panel-general",n),{AllowNotifications:a,ShowNotificationBadge:s,CloseNotificationOnClick:c,PanelAutoHide:l,HideToastsAfter:u}=lc(),d=qi();return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[d&&jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),d&&jsxRuntimeExports.jsx(c,{}),d&&jsxRuntimeExports.jsx(l,{}),d&&jsxRuntimeExports.jsx(u,{})]})})}function Cs(e){const t=i.useContext(IOConnectContext),n=t?.appManager,i$1=qi(),[o,a]=i.useState([]),[d,f]=i.useState(0),m="Platform",h=i.useCallback(((e="asc")=>{if(null===i$1)return [];const t=[...o].sort(((t,n)=>{const i=(t.title??t.name).toLowerCase(),o=(n.title??n.name).toLowerCase();return "asc"===e?i.localeCompare(o):o.localeCompare(i)}));if(!i$1){const e=t.findIndex((e=>e.name===m));if(-1!==e){const[n]=t.splice(e,1);t.unshift(n);}}return t}),[o,i$1]),p=i.useMemo((()=>h("asc")),[h]),g=i.useMemo((()=>h("desc")),[h]);i.useEffect((()=>{if(null===i$1||i$1)return;const e={title:"System",name:m,hidden:false,userProperties:{hidden:false}};a((t=>t.some((t=>t.name===e.name))?t:[...t,e]));}),[i$1]),i.useEffect((()=>{if(!n)return;const e=n.onAppAdded((e=>{a((t=>[...t,{title:e.title,name:e.name,hidden:e.hidden,userProperties:e.userProperties}]));})),t=n.onAppRemoved((e=>{a((t=>t.filter((t=>t.name!==e.name))));})),i=n.onAppChanged((e=>{a((t=>{const n=t.find((t=>t.name===e.name));return [...t.filter((t=>t.name!==e.name)),{title:e.title,name:n?.name,hidden:n?.hidden,allowed:n?.allowed,userProperties:n?.userProperties}]}));}));return ()=>{e(),t(),i();}}),[n]);return {apps:i.useMemo((()=>{if(!e?.sourceFilter||!Array.isArray(o))return o;const{allowed:t=[],blocked:n=[]}=e.sourceFilter,i=t.includes("*"),r=n.includes("*");let a=0;const s=o.map((e=>{const n=i||t.includes(e.name),o=!r&&n;return o&&a++,{...e,allowed:o}}));return f(a),s}),[e,o]),allowedApps:d,sortedAppsAsc:p,sortedAppsDesc:g,sortAppsAlphabetically:h}}const Ss="newest",Ds="oldest",Es="severity",Is=["None","Low","Medium","High","Critical"],As={key:Ss,descending:true};const Os=i.createContext({allApps:[],settings:{},configuration:{},notifications:[],notificationsCount:0,onClose:()=>{},allApplications:0,clearAll:()=>{},showPanel:()=>{},hidePanel:()=>{},saveFilter:()=>{},clearAllOld:()=>{},notificationStacks:[],saveSetting:()=>{},allowedApplications:0,saveAllFilter:()=>{},isBulkActionsSupported:false,selectedNotifications:[],selectNotification:()=>{},selectAllNotifications:()=>{},clearMany:()=>{},snooze:()=>{},snoozeMany:()=>{},setState:()=>{},setStates:()=>{},setCount:()=>{}}),Ls=()=>i.useContext(Os);function Fs({label:t="Allow notifications",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Ls(),s=qi(),c=i.useCallback((e=>{a({enabledNotifications:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:c,checked:o.enabledNotifications??false,...i$1}):null}function Bs({label:t="Show notification badge",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Ls(),s=qi()&&!o.enabledNotifications,c=i.useCallback((e=>{a({showNotificationBadge:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:c,checked:o.showNotificationBadge??false,disabled:s,...i$1})}function Rs({label:t="Close notification on click",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Ls(),s=qi(),c=s&&!o.enabledNotifications,l=i.useCallback((e=>{a({closeNotificationOnClick:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:l,checked:o.closeNotificationOnClick??false,disabled:c,...i$1}):null}function js({label:t="Auto hide panel",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Ls(),s=qi(),c=i.useCallback((e=>{a({autoHidePanel:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:c,checked:o.autoHidePanel??false,...i$1}):null}function Hs({label:t="Panel always on top",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Ls(),s=i.useCallback((e=>{a({alwaysOnTop:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:s,checked:o.alwaysOnTop??false,...i$1})}const zs=(e,t)=>e?`${e} ${t}${1!==e?"s":""}`:"",$s=e=>{const t=Math.floor(e/60),n=e%60,i=zs(t,"minute"),o=zs(n,"second");return i+(i&&o?" ":"")+o};function Vs({className:n,title:i$1="Hide toasts after",items:o=[15,30,45,60],...a}){const s=k("flex","jc-between","ai-center",n),{settings:c,saveSetting:l}=Ls(),u=qi(),d=u&&!c.enabledNotifications,f=i.useCallback(((e=15e3)=>{c.toastExpiry!==e&&l({toastExpiry:1e3*e});}),[c.toastExpiry,l]);return u?jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(d?"io-text-disabled":""),children:jsxRuntimeExports.jsx("span",{children:i$1})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx($.Button,{text:$s((c.toastExpiry??0)/1e3)}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:o.map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{f(t);},children:$s(t)},t)))})})]})]}):null}function Ys({className:n,title:i="Highlight new for",...o}){const r=k("flex","jc-between","ai-center",n),{settings:a}=Ls(),s=qi()&&!a.enabledNotifications,c=["30 seconds","1 minute","5 minutes","Never"];return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":s}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:s,children:[jsxRuntimeExports.jsx($.Button,{text:c[0]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:c.map((t=>jsxRuntimeExports.jsx($.Item,{children:t},t)))})})]})]})}function Us({className:n,title:i="Mark as read after",...o}){const r=k("flex","jc-between","ai-center",n),{settings:a}=Ls(),s=qi()&&!a.enabledNotifications,c=["1 minute","5 minutes","Never"];return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":s}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:s,children:[jsxRuntimeExports.jsx($.Button,{text:c[0]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:c.map((t=>jsxRuntimeExports.jsx($.Item,{children:t},t)))})})]})]})}function Ws({className:n,title:i="Stacking",...o}){const r=k("io-notifications-settings-panel-stacking",n),{ToastStacking:a,ToastStackBy:s}=lc();return qi()?jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function Js({label:t="Allow toast stacking",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Ls(),s=qi(),c=s&&!o.enabledNotifications,l=i.useCallback((e=>{a({toastStacking:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:l,checked:o.toastStacking??false,disabled:c,...i$1}):null}const qs=e=>e.replace(/(^|-)\w/g,(e=>e.toUpperCase().replace("-"," ")));function Ks({className:n,title:i$1="Group by",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:c}=Ls(),l=qi(),u=l&&!s.enabledNotifications,d=i.useCallback((e=>{e||(e="severity"),s.stackBy!==e&&c({stackBy:e.toLowerCase()});}),[s.stackBy,c]);if(!l)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":u}),children:jsxRuntimeExports.jsx("span",{children:i$1})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx($.Button,{text:s.stackBy?qs(s.stackBy):"Severity"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:["Severity","Application"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{d(t);},children:t},t)))})})]})]})}function Gs({className:n,title:i="Placement",...o}){const r=k("io-notifications-settings-panel-placement",n),{PlacementPanel:a,PlacementToasts:s}=lc();return qi()?jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function Qs({className:n,title:i$1="Panel position",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:c}=Ls(),l=qi(),u=i.useCallback((e=>{e||(e="right"),s.placement?.panel!==e&&c({placement:{...s.placement,panel:e.toLowerCase()}});}),[s.placement,c]);if(!l)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i$1})}),jsxRuntimeExports.jsxs($,{variant:"light",children:[jsxRuntimeExports.jsx($.Button,{text:s.placement?.panel?qs(s.placement?.panel):"Right"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:["Right","Left"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{u(t);},children:t},t)))})})]})]})}function Xs({className:n,title:i$1="Toasts position",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:c}=Ls(),l=qi(),u=i.useCallback((e=>{if(e||(e="bottom-right"),s.placement?.toasts===e)return;const t=e.replace(/\s+/g,"-").toLowerCase();c({placement:{...s.placement,toasts:t}});}),[s.placement,c]);if(!l)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i$1})}),jsxRuntimeExports.jsxs($,{variant:"light",children:[jsxRuntimeExports.jsx($.Button,{text:s.placement?.toasts?qs(s.placement?.toasts):"Bottom Right"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:["Top Right","Top Left","Bottom Right","Bottom Left"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{u(t);},children:t},t)))})})]})]})}function Zs({className:t,title:n="Snooze",...i}){const o=k("io-notifications-settings-panel-snooze",t),{SnoozeDuration:r}=lc(),{settings:a}=Ls();return qi()&&a.snooze?.enabled?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsx(I,{title:n,children:jsxRuntimeExports.jsx(r,{})})}):null}function ec({className:n,title:i$1="Default duration",items:o=[60,120,180,300],...a}){const s=k("flex","jc-between","ai-center",n),{settings:c,saveSetting:l}=Ls(),u=qi(),d=u&&!c.enabledNotifications,f=i.useCallback(((e=6e4)=>{c.snooze&&c.snooze?.duration!==e&&l({snooze:{...c.snooze,duration:1e3*e}});}),[c.snooze,l]);return u&&c.snooze?.enabled?jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":d}),children:jsxRuntimeExports.jsx("span",{children:i$1})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx($.Button,{text:$s((c.snooze?.duration??0)/1e3)}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:o.map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{f(t);},children:$s(t)},t)))})})]})]}):null}function tc({className:n,title:i,...o}){const r=k("io-notifications-settings-panel-subscriptions",n),{SubscribeAll:a,SubscribeApp:s,SubscribeMuteAll:c,SubscribeMuteApp:l}=lc(),{sortAppsAlphabetically:u}=Cs(),d=qi(),f=u(),m="io-notifications-subscriptions-grid "+(d?"with-three-columns":"with-two-columns");return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i??(d?"Subscribe & Mute":"Subscribe"),children:[jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Sources"}),jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Subscribe"}),d&&jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Mute"})]}),jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:"All Sources"}),jsxRuntimeExports.jsx(a,{label:""}),d&&jsxRuntimeExports.jsx(c,{label:""})]}),f.map((n=>!n||n.hidden||n?.userProperties?.hidden?null:jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:n.title??n.name}),jsxRuntimeExports.jsx(s,{app:n,label:""}),d&&jsxRuntimeExports.jsx(l,{app:n,label:""})]},n.name)))]})})}function nc({label:t="All apps",align:n="right",...i$1}){const{settings:o,configuration:a,saveAllFilter:s}=Ls(),c=qi()&&!o.enabledNotifications,l=i.useCallback((e=>{s({subscribe:e.target.checked});}),[s]);return jsxRuntimeExports.jsx(Ri,{align:n,label:t,onChange:l,checked:(a.sourceFilter?.allowed?.includes("*")&&0===a.sourceFilter?.blocked?.length)??false,disabled:c,...i$1})}function ic({label:t="App",align:n="right",app:i$1,...o}){const{allApps:a,settings:s,configuration:c,saveFilter:l}=Ls(),u=qi()&&!s.enabledNotifications,d=i.useCallback(((e,t)=>{const n={...c.sourceFilter},i=n.allowed?.indexOf("*");"number"==typeof i&&i>-1&&(n.allowed?.splice(i,1),a.forEach((e=>{e.name!==t.name&&n.allowed?.push(e.name);}))),e?(n.allowed=[...new Set([...n.allowed??[],t.name])],n.blocked=n.blocked?.filter((e=>e!==t.name))):(n.allowed=n.allowed?.filter((e=>e!==t.name)),n.blocked=[...new Set([...n.blocked??[],t.name])]),n.allowed?.length&&n.blocked?.includes("*")&&n.blocked.splice(n.blocked.indexOf("*"),1),l(n);}),[a,c.sourceFilter,l]);return jsxRuntimeExports.jsx(Ri,{id:i$1.name,label:t,align:n,onChange:e=>d(e.target.checked,i$1),checked:(c.sourceFilter?.allowed?.includes("*")&&!c.sourceFilter?.blocked?.includes(i$1.name)||c.sourceFilter?.allowed?.includes(i$1.name))??false,disabled:u,...o})}function oc({label:t="Mute all",align:n="right",...i$1}){const{settings:o,configuration:a,saveAllFilter:s}=Ls(),c=qi(),l=c&&(!o.enabledNotifications||-1===a.sourceFilter?.allowed?.indexOf("*")),u=i.useCallback((e=>{s({mute:e.target.checked});}),[s]);return c?jsxRuntimeExports.jsx(Ri,{align:n,label:t,onChange:u,checked:a.sourceFilter?.muted?.includes("*")??false,disabled:l??false,...i$1}):null}function rc({label:t="App",align:n="right",app:i$1,...o}){const{allApps:a,settings:s,configuration:c,saveFilter:l}=Ls(),u=qi(),d=u&&(!s.enabledNotifications||c.sourceFilter?.blocked?.includes("*")||c.sourceFilter?.blocked?.includes(i$1.name)||0===c.sourceFilter?.allowed?.length||-1===c.sourceFilter?.allowed?.indexOf(i$1.name)&&-1===c.sourceFilter?.allowed?.indexOf("*")&&0===c.sourceFilter?.blocked?.length),f=i.useCallback(((e,t)=>{const n={...c.sourceFilter},i=n?.muted?.indexOf("*");"number"==typeof i&&i>-1&&(n.muted?.splice(i,1),a.forEach((e=>{e.name===t.name||e.hidden||n.muted?.push(e.name);}))),e?n.muted?.push(t.name):n.muted=n.muted?.filter((e=>e!==t.name)),l(n);}),[a,c.sourceFilter,l]);return !u||i$1.hidden?null:jsxRuntimeExports.jsx(Ri,{id:i$1.name,label:t,align:n,onChange:e=>f(e.target.checked,i$1),checked:(c.sourceFilter?.muted?.includes("*")||c.sourceFilter?.muted?.includes(i$1.name))??false,disabled:d??false,...o})}const ac={Body:n=>{const{General:i,Placement:o,Stacking:r,Snooze:a,Subscriptions:s}=lc();return jsxRuntimeExports.jsxs(Ii,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},General:bs,AllowNotifications:Fs,ShowNotificationBadge:Bs,CloseNotificationOnClick:Rs,PanelAutoHide:js,PanelAlwaysOnTop:Hs,HideToastsAfter:Vs,MarkAsNew:Ys,MarkAsRead:Us,Stacking:Ws,ToastStacking:Js,ToastStackBy:Ks,Placement:Gs,PlacementPanel:Qs,PlacementToasts:Xs,Snooze:Zs,SnoozeDuration:ec,Subscriptions:tc,SubscribeAll:nc,SubscribeApp:ic,SubscribeMuteAll:oc,SubscribeMuteApp:rc},sc=i.createContext(ac),cc=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...ac,...n})),[n]);return jsxRuntimeExports.jsx(sc.Provider,{value:i$1,children:t})}));cc.displayName="NotificationsSettingsPanelComponentsStoreProvider";const lc=()=>i.useContext(sc);const mc=i.createContext({searchQuery:"",setSearch:()=>{},isPanelVisible:false,sortNotificationsBy:"newest",setSortBy:()=>{},viewNotificationsBy:"all",setViewBy:()=>{},isBulkActionsVisible:false,showBulkActions:()=>{},hideBulkActions:()=>{}}),hc=()=>i.useContext(mc);function pc({title:n,onClose:i,onOpenSettings:o,...r}){const{HeaderCaptionTitle:a,HeaderCaptionCount:s,HeaderCaptionButtonSettings:c,HeaderCaptionButtonClose:l,HeaderActions:u,HeaderBulkActions:d,HeaderSearch:f}=Zc(),{isBulkActionsSupported:m,notificationsCount:h}=Ls(),{isBulkActionsVisible:p}=hc(),g=qi();return jsxRuntimeExports.jsxs(Ei,{...r,children:[jsxRuntimeExports.jsxs("div",{className:"io-panel-header-caption",children:[jsxRuntimeExports.jsx(a,{title:n}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsxs(Ei.ButtonGroup,{children:[g&&jsxRuntimeExports.jsx(c,{onClick:o}),jsxRuntimeExports.jsx(l,{onClick:i})]})]}),m?jsxRuntimeExports.jsxs("div",{className:`io-panel-header-actions-wrapper ${p&&h>0?"io-panel-header-bulk-actions-opened":""} `,children:[jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]}):jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(f,{})]})}function gc({text:n="Notifications",counter:i,...o}){const{notificationsCount:r}=Ls();return jsxRuntimeExports.jsx(E,{text:n,size:"large",...o,children:(i??true)&&jsxRuntimeExports.jsxs("span",{children:["(",r,")"]})})}const vc=e=>[...e].sort(((e,t)=>(t.timestamp||0)-(e.timestamp||0))),yc=e=>[...e].sort(((e,t)=>(e.timestamp||0)-(t.timestamp||0))),wc=(e,t)=>{const n=Is[0];return [...e].sort(((e,i)=>{const o=Is.indexOf(e.severity||n),r=Is.indexOf(i.severity||n);return (t?-1:1)*(o-r)}))},bc={[Ss]:vc,[Ds]:yc,[Es]:wc};function kc({...t}){const[n,i$1]=i.useState([]),{NotificationsList:o,Notification:r}=Zc(),{notifications:a,setCount:s,notificationsCount:f}=Ls(),{sortNotificationsBy:m,viewNotificationsBy:h,searchQuery:p}=hc(),g=i.useRef(null),v=Vi(p),y=i.useMemo((()=>{const e=((e,t)=>{if(!e)return [];switch(t){case "all":default:return e;case "unread":return e.filter((e=>"Active"===e.state||"Stale"===e.state));case "read":return e.filter((e=>"Acknowledged"===e.state||"Seen"===e.state));case "snoozed":return e.filter((e=>"Snoozed"===e.state))}})(a,h);return e.filter((e=>e.title.toLowerCase().includes(v.toLowerCase())||e.source?.toLowerCase().includes(v.toLowerCase())||e.body?.toLowerCase().includes(v.toLowerCase())))}),[v,a,h]);return i.useEffect((()=>{switch(m){case "newest":i$1(vc(y));break;case "oldest":i$1(yc(y));break;case "severity":i$1(wc(y,true));break;default:i$1(y);}s(y.length);}),[y,m,s]),i.useEffect((()=>{g.current&&g.current?.scrollTo({top:0,behavior:"smooth"});}),[v,f,m,h]),jsxRuntimeExports.jsx(Ii,{ref:g,...t,children:jsxRuntimeExports.jsx(o,{notifications:n,Notification:r})})}function Cc({...t}){const{FooterButtons:n}=Zc();return jsxRuntimeExports.jsx(Ai,{...t,children:jsxRuntimeExports.jsx(n,{})})}function Nc({className:n,...i$1}){const{FooterButtonClearAll:o,FooterButtonClearAllOld:r}=Zc(),{notifications:a}=Ls(),[s,l]=i.useState(false);return i.useEffect((()=>{a.filter((e=>"Stale"===e.state||"Acknowledged"===e.state)).length>0?l(true):l(false);}),[a]),jsxRuntimeExports.jsxs(V,{className:n,align:"right",...i$1,children:[jsxRuntimeExports.jsx(r,{disabled:!s}),jsxRuntimeExports.jsx(o,{disabled:a.length<=0})]})}function xc({text:t="Clear All",...n}){const{clearAll:i}=Ls();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{i();},...n})}function Sc({text:t="Clear Old",...n}){const{clearAllOld:i}=Ls();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{i();},...n})}function Dc({className:n,notification:i,...o}){const r=k("io-notification-header",n),{HeaderCount:a,HeaderBadge:s,HeaderTitle:c,HeaderTimestamp:l,HeaderButtonSnooze:u,HeaderButtonClose:d}=Vc();return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx(s,{notification:i}),jsxRuntimeExports.jsx(a,{notification:i}),jsxRuntimeExports.jsx(c,{notification:i}),jsxRuntimeExports.jsx(l,{notification:i}),jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(u,{notification:i}),jsxRuntimeExports.jsx(d,{notification:i})]})]})}function Ec({notification:t,...n}){const{settings:i,notificationStacks:o}=Ls(),{isPanelVisible:r}=hc(),{toastStacking:a,stackBy:s}=i,c="application"===s?"source":s??"source";let l;if(a){const e=o.find((e=>e.key===t[c]));l=e?.items.length??0;}return a&&!r&&l&&l>1?jsxRuntimeExports.jsx(D,{...n,children:l<10?l:"9+"}):null}function Ic({className:n,notification:i,...o}){if(!i?.severity||"None"===i.severity)return null;const r=k("io-notification-header-badge",n);return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx(C,{variant:((e="None")=>{switch(e.toLowerCase()){case "low":case "medium":case "none":default:return "circle-info";case "high":return "triangle-exclamation";case "critical":return "ban"}})(i.severity),size:"12"}),i.severity]})}function Ac({className:n,state:i,severity:o="None",icon:r,...a}){const s=k("io-notification-header-icon",n),{isPanelVisible:c}=hc();return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[r&&jsxRuntimeExports.jsx("span",{className:"io-notification-header-icon-image",children:jsxRuntimeExports.jsx("img",{src:r,alt:`io-notification-header-icon-${r}`})}),jsxRuntimeExports.jsx("span",{className:`io-notification-header-icon-badge color-${o.toLowerCase()}`,children:c&&"Acknowledged"!==i&&"New"})]})}function Mc({className:t,notification:{appTitle:n},...i}){const o=k("io-notification-header-title",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function Tc({className:t,notification:{timestamp:n,state:i,snooze:o},...r}){const a=k("io-notification-timestamp",t);return jsxRuntimeExports.jsx("small",o&&"Snoozed"===i?{className:a,...r,children:"Snoozed"}:{className:a,...r,children:Aa(n??0)??"Just Now"})}function Pc({notification:{id:t,state:n},...i$1}){const{settings:o,snooze:a}=Ls(),s=i.useCallback((e=>{e.stopPropagation(),a&&a(t,o.snooze?.duration??0);}),[t,a,o.snooze?.duration]);return a&&"Snoozed"!==n&&o.snooze?.enabled?jsxRuntimeExports.jsx(A,{icon:"snooze",variant:"link",text:"Snooze",tabIndex:-1,onClick:s,...i$1}):null}function _c({notification:{id:t,updateState:n},...i$1}){const o=qi(),{onClose:a}=Ls(),{isPanelVisible:s}=hc(),c=i.useCallback((e=>{e.stopPropagation(),!o||s?a(t):n("Acknowledged").catch(console.error);}),[o,t,a,s,n]);return jsxRuntimeExports.jsx(N,{icon:"close",iconSize:"10",size:"24",tabIndex:-1,onClick:c,...i$1})}function Oc({className:n,notification:i$1,...o}){const a=k("io-notification-body",n),s=qi(),{BodyIcon:c,BodyTitle:l,BodyDescription:u}=Vc(),{id:d,icon:f,title:m,body:h,onClick:p,updateState:g}=i$1,{settings:v,onClose:y}=Ls(),{isPanelVisible:w}=hc(),b=i.useCallback((async()=>{if(!p)return;if(!s)return void y(d);const e=!v?.toastStacking&&null,t=w?v?.closeNotificationOnClick??true:e;null!==t?await p({close:t}).catch(console.error):(await p({close:false}).catch(console.error),await g("Acknowledged").catch(console.error));}),[s,d,w,p,y,g,v?.closeNotificationOnClick,v?.toastStacking]);return jsxRuntimeExports.jsxs("div",{className:a,role:"button",tabIndex:0,onKeyDown:async e=>{(e=>"Enter"===e.key||" "===e.key)(e)&&await b();},onClick:b,...o,children:[jsxRuntimeExports.jsx(c,{icon:f}),jsxRuntimeExports.jsxs("div",{className:"io-notification-body-content",children:[jsxRuntimeExports.jsx(l,{text:m}),jsxRuntimeExports.jsx(u,{text:h})]})]})}function Lc({className:t,icon:n,altText:i="notification icon",...o}){if(!n)return null;const r=k("io-notification-body-icon",t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx("img",{src:n,alt:i})})}function Fc({text:t,...n}){return jsxRuntimeExports.jsx(E,{text:t,...n})}function Bc({className:t,text:n,...i}){const o=k("io-notification-body-description",t);return jsxRuntimeExports.jsx("p",{className:o,...i,children:n})}function Rc({className:n,notification:i$1}){const o=k("io-notification-footer",n),{FooterButton:r}=Vc(),a=i.useMemo((()=>function(e){const t=[],n={};if(!e)return;e.forEach((e=>{const{displayId:i,displayPath:o}=e,r={...e,children:[]};if(o&&o.length>0){let e;o.forEach(((t,i)=>{0===i?e=n[t]:e&&(e=e.children?.find((e=>e.displayId===t)));})),e&&e.children?.push(r);}else i?(t.push(r),n[i]=r):t.push(r);i&&(n[i]=r);}));const i=e=>{e.forEach((e=>{e.children&&0===e.children.length?delete e.children:e.children&&i(e.children);}));};return i(t),t}(i$1.actions)),[i$1.actions]),s=(t,n)=>t.children?jsxRuntimeExports.jsx(xi,{text:t.title,children:t.children.map(s)},`${t.title}-${n}`):((t,n)=>jsxRuntimeExports.jsx(xi.Item,{children:jsxRuntimeExports.jsx(r,{variant:"link",className:"io-dropdown-menu-item io-dropdown-menu-button",notificationAction:t,notificationId:i$1.id})},`${t.title}-${n}`))(t,n);return jsxRuntimeExports.jsx("div",{className:o,children:jsxRuntimeExports.jsx(V,{align:"right",children:a?.map(((n,o)=>n.children?jsxRuntimeExports.jsxs(V,{variant:"append",children:[jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"default",notificationId:i$1.id}),jsxRuntimeExports.jsx(xi,{variant:0===o?"primary":"default",icon:"ellipsis",children:n.children.map(s)})]},`${n.title}-${o}`):jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"link",notificationId:i$1.id},`${n.title}-${o}`)))})})}function jc({notificationAction:t,...n}){const i$1=i.useCallback((e=>{e.stopPropagation(),t.onClick({close:true});}),[t]);return jsxRuntimeExports.jsx(A,{text:t.title,onClick:i$1,...n})}const Hc={Header:Dc,HeaderCount:Ec,HeaderBadge:Ic,HeaderIcon:Ac,HeaderTitle:Mc,HeaderTimestamp:Tc,HeaderButtonSnooze:Pc,HeaderButtonClose:_c,Body:Oc,BodyIcon:Lc,BodyTitle:Fc,BodyDescription:Bc,Footer:Rc,FooterButton:jc},zc=i.createContext(Hc),$c=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...Hc,...n})),[n]);return jsxRuntimeExports.jsx(zc.Provider,{value:i$1,children:t})}));function Vc(e){return {...i.useContext(zc),...e}}function Yc({className:n,notification:i,...o}){const{Header:r,Body:a,Footer:s}=Vc(),{severity:c}=i,l=k("io-notification",`severity-${c?.toLowerCase()??"none"}`,"Acknowledged"!==i.state&&"state-new",n);return jsxRuntimeExports.jsxs("div",{className:l,...o,children:[jsxRuntimeExports.jsx(r,{notification:i}),jsxRuntimeExports.jsx(a,{notification:i}),jsxRuntimeExports.jsx(s,{notification:i})]})}function Uc({components:t,notification:n,...i}){return jsxRuntimeExports.jsx($c,{components:t,children:jsxRuntimeExports.jsx(Yc,{notification:n,...i})})}function Wc({className:n,notifications:i$1,...o}){const[a,s]=i.useState(false),l=i$1.length>=3?"large":"normal",u=2===i$1.length?"small":l,d=i$1[0].severity,f=k("io-notification-stack",a&&"io-notification-stack-open","normal"!==u&&[`io-notification-stack-${u}`],d&&"None"!==d&&[`io-notification-stack-${d.toLowerCase()}`],n),m=i.useCallback((()=>{s(true);}),[]),h=i.useCallback((e=>{e.stopPropagation(),i$1.forEach((e=>{e.close();}));}),[i$1]);return jsxRuntimeExports.jsxs("div",{className:f,onClick:m,...o,children:[a&&"normal"!==u&&jsxRuntimeExports.jsx("div",{className:"io-notification-stack-btn",children:jsxRuntimeExports.jsx(A,{icon:"close",onClick:e=>h(e),children:jsxRuntimeExports.jsx("span",{className:"io-btn-text",children:"Clear All"})})}),i$1.map((t=>jsxRuntimeExports.jsx(Uc,{notification:t},t.id)))]})}function Jc({...t}){const{notificationStacks:i}=Ls();return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:i.map((n=>jsxRuntimeExports.jsx(Wc,{notifications:n.items,...t},n.key)))})}$c.displayName="ComponentsStoreProvider";const qc=({notification:n,Notification:i,...o})=>{const{configuration:r,isBulkActionsSupported:a,selectedNotifications:s,selectNotification:c}=Ls(),{isPanelVisible:l,isBulkActionsVisible:u}=hc(),d=r.sourceFilter?.muted??[],f=n.source&&d.includes(n.source)||d.includes("*");if(!l&&f)return null;const m=l&&a&&u,h=s.includes(n.id);return m?jsxRuntimeExports.jsxs("div",{className:k("io-notification-list-bulk-action-item",{selected:h}),children:[jsxRuntimeExports.jsx(Fi,{checked:h,onChange:e=>c(n.id,e.target.checked)}),jsxRuntimeExports.jsx(i,{notification:n,...o})]}):jsxRuntimeExports.jsx(i,{notification:n,...o})};function Kc({className:n,Notification:i,notifications:o=[],noNotificationText:r="No notifications to display",...a}){const s=k("io-notification-list",n),{settings:c}=Ls(),{isPanelVisible:l}=hc(),{toastStacking:u}=c,d=u&&!l,f=o.length>0;return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[d&&jsxRuntimeExports.jsx(Jc,{}),!d&&(f?o.map((t=>jsxRuntimeExports.jsx(qc,{notification:t,Notification:i,...a},t.id))):jsxRuntimeExports.jsx("div",{className:"flex jc-center mt-8",children:r}))]})}const Gc={Header:pc,HeaderCaptionTitle:gc,HeaderCaptionCount:function({variant:t="primary",...n}){const{notificationsCount:i=0}=Ls();return 0===i?null:jsxRuntimeExports.jsx(D,{variant:t,...n,children:i>99?"99+":i})},HeaderCaptionButtonSettings:function({icon:t="cog",size:n="32",variant:i="circle",...o}){return qi()?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,...o}):null},HeaderCaptionButtonClose:function({icon:t="close",size:n="32",variant:i="circle",onClick:o,...r}){const{hidePanel:a}=Ls(),s=qi();return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,onClick:e=>{o?o(e):s&&a();},...r})},HeaderActions:function({className:n,...i}){const o=k("io-panel-header-actions",n),{HeaderActionSort:r,HeaderActionView:a,HeaderActionClear:s,HeaderActionEdit:c}=Zc();return jsxRuntimeExports.jsxs("div",{className:o,...i,children:[jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]}),jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(c,{})]})]})},HeaderActionSort:function({text:n="Sort by",...i$1}){const{sortNotificationsBy:o,setSortBy:a}=hc(),{onNotificationsSort:s}=(()=>{const{notifications:e}=Ls(),[t,n]=i.useState(As),{key:i$1,descending:o}=t,a=i.useMemo((()=>bc[i$1](e,o)),[e,i$1,o]),s=i.useCallback((e=>{n((t=>({key:e,descending:t.key!==e?As.descending:!t.descending})));}),[]);return {onNotificationsSort:s,sortedNotifications:a}})();return jsxRuntimeExports.jsxs($,{variant:"light",...i$1,children:[jsxRuntimeExports.jsxs($.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:o})]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",checkIcon:"check",children:["Newest","Oldest","Severity"].map((t=>jsxRuntimeExports.jsx($.Item,{isSelected:o===t.toLowerCase(),onClick:()=>{a(t.toLowerCase()),s(t.toLowerCase());},children:t},t)))})})]})},HeaderActionView:function({text:n="View",...i}){const{settings:o}=Ls(),{viewNotificationsBy:r,setViewBy:a}=hc(),s=o.snooze?.enabled?["All","Read","Unread","Snoozed"]:["All","Read","Unread"];return jsxRuntimeExports.jsxs($,{variant:"light",...i,children:[jsxRuntimeExports.jsxs($.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:r})]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",checkIcon:"check",children:s.map((t=>jsxRuntimeExports.jsx($.Item,{isSelected:r===t.toLowerCase(),onClick:()=>a(t.toLowerCase()),children:t},t)))})})]})},HeaderActionClear:function({text:t="Clear All",...n}){const{clearAll:i,notificationsCount:o}=Ls();return jsxRuntimeExports.jsx(A,{variant:"link",text:t,onClick:i,disabled:0===o,...n})},HeaderActionEdit:function({tooltip:t="Bulk Edit",...n}){const{isBulkActionsSupported:i,notificationsCount:o}=Ls(),{showBulkActions:r}=hc();return i?jsxRuntimeExports.jsx(N,{icon:"pen-to-square",title:t,size:"32",onClick:r,disabled:0===o,...n}):null},HeaderBulkActions:function({className:n,...i}){const o=k("io-panel-header-bulk-actions",n),{HeaderBulkActionSelect:r,HeaderBulkActionSelectDropdown:a,HeaderBulkActionMarkAsRead:s,HeaderBulkActionMarkAsUnread:c,HeaderBulkActionSnooze:l,HeaderBulkActionClear:u,HeaderBulkActionClose:d}=Zc(),{isBulkActionsSupported:f}=Ls();return f?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]})}):null},HeaderBulkActionSelect:function({...t}){const{isBulkActionsSupported:n,selectedNotifications:i,selectAllNotifications:o,notificationsCount:r}=Ls();return n?jsxRuntimeExports.jsx(Fi,{checked:r===i.length&&r>0,onChange:e=>o("all",e.target.checked),disabled:0===r,...t}):null},HeaderBulkActionSelectDropdown:function({...n}){const{isBulkActionsSupported:i,selectAllNotifications:o,notificationsCount:r}=Ls();return i?jsxRuntimeExports.jsxs($,{variant:"light",...n,children:[jsxRuntimeExports.jsx($.ButtonIcon,{variant:"default",icon:"chevron-down",size:"16",iconSize:"10",disabled:0===r}),jsxRuntimeExports.jsx(P,{children:jsxRuntimeExports.jsxs($.List,{variant:"single",checkIcon:"check",children:[jsxRuntimeExports.jsx($.ItemSection,{children:"Select"}),["All","Read","Unread","Snoozed"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>o(t.toLowerCase(),true),children:t},t)))]})})]}):null},HeaderBulkActionMarkAsRead:function({icon:t="envelope-open",size:n="32",variant:i$1="circle",tooltip:o="Mark as read",...a}){const{isBulkActionsSupported:s,selectedNotifications:c,setStates:l,notificationsCount:u}=Ls(),d=i.useCallback((()=>{l(c,"Seen");}),[c,l]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i$1,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionMarkAsUnread:function({icon:t="envelope",size:n="32",variant:i$1="circle",tooltip:o="Mark as unread",...a}){const{isBulkActionsSupported:s,selectedNotifications:c,setStates:l,notificationsCount:u}=Ls(),d=i.useCallback((()=>{l(c,"Active");}),[c,l]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i$1,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionSnooze:function({icon:t="snooze",size:n="32",variant:i$1="circle",tooltip:o="Snooze",...a}){const{isBulkActionsSupported:s,selectedNotifications:c,snoozeMany:l,settings:u,notificationsCount:d}=Ls(),f=i.useCallback((()=>{l(c,u.snooze?.duration??0);}),[c,l,u.snooze?.duration]);return s&&u.snooze?.enabled?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i$1,title:o,onClick:f,disabled:0===d,...a}):null},HeaderBulkActionClear:function({icon:t="trash",size:n="32",variant:i$1="circle",tooltip:o="Clear",...a}){const{isBulkActionsSupported:s,selectedNotifications:c,clearMany:l,notificationsCount:u}=Ls(),d=i.useCallback((()=>{l(c);}),[c,l]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i$1,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionClose:function({text:t="Done",variant:n="primary",...i}){const{isBulkActionsSupported:o,notificationsCount:r}=Ls(),{hideBulkActions:a}=hc();return o?jsxRuntimeExports.jsx(A,{variant:n,text:t,onClick:a,disabled:0===r,...i}):null},HeaderSearch:function({className:n,icon:i$1="search",placeholder:o="Search",...r}){const a=k("io-panel-header-search",n),{notificationsCount:s}=Ls(),{searchQuery:c,setSearch:l}=hc(),u=i.useRef(null);return jsxRuntimeExports.jsxs("div",{className:a,children:[jsxRuntimeExports.jsx(Oi,{ref:u,value:c,iconPrepend:i$1,placeholder:o,onChange:e=>l(e.target.value),...r}),c.length>0&&jsxRuntimeExports.jsx("p",{className:"io-panel-header-search-count",children:`${s} results`})]})},Body:kc,Footer:Cc,FooterButtons:Nc,FooterButtonClearAll:xc,FooterButtonClearAllOld:Sc,Notification:Uc,NotificationsList:Kc},Qc=i.createContext(Gc),Xc=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...Gc,...n})),[n]);return jsxRuntimeExports.jsx(Qc.Provider,{value:i$1,children:t})}));function Zc(e){return {...i.useContext(Qc),...e}}Xc.displayName="ComponentsStoreProvider";const nl={Body:function({className:t,notifications:n,maxToasts:i$1=1,...o}){const r=k("io-toasts-body",t),{NotificationsList:a,Notification:s}=rl(),[l,d]=i.useState([]);return i.useEffect((()=>{const e=i$1<0?n.length:i$1,t=n.filter((e=>"Active"===e.state)).slice(0,e);for(const e of t)e.onShow();d(t);}),[n,i$1]),jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx(a,{Notification:s,notifications:l,noNotificationText:""})})},Notification:Uc,NotificationsList:Kc},il=i.createContext(nl),ol=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...nl,...n})),[n]);return jsxRuntimeExports.jsx(il.Provider,{value:i$1,children:t})}));function rl(e){return {...i.useContext(il),...e}}ol.displayName="ComponentsStoreProvider";const ll=n=>{const{General:i,Layouts:o,Downloads:r,System:a}=Cu();return jsxRuntimeExports.jsxs(Ii,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})},ul=({className:n,title:i="General",...o})=>{const{Theme:r,PinnedPosition:a,MinimizeToTray:s,ShowTutorialOnStartup:c}=Cu();return jsxRuntimeExports.jsxs(I,{className:k("io-block io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(c,{})]})},dl=(e="dark")=>{switch(e){case "dark":return "Dark";case "light":return "Light";default:return e}},fl=({className:n,title:i$1="Theme",...o})=>{const{currentTheme:a,selectTheme:l}=(()=>{const e=i.useContext(IOConnectContext),[t,n]=i.useState(null),i$1=i.useCallback((t=>e?.themes?.select(t)),[e]);return i.useEffect((()=>{if(!e)return;let t=false;const i=e=>{t||n(e);};return e.themes?.onChanged(i),e.themes?.getCurrent().then(i).catch(console.warn),()=>{t=true;}}),[e]),{currentTheme:t,selectTheme:i$1}})(),d=(()=>{const e=i.useContext(IOConnectContext),[t,n]=i.useState([]);return i.useEffect((()=>{e&&e.themes?.list().then(n).catch(console.warn);}),[e]),t})();return jsxRuntimeExports.jsxs("div",{className:k("flex jc-between ai-center",n),...o,children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i$1}),jsxRuntimeExports.jsxs($,{variant:"light",children:[jsxRuntimeExports.jsx($.Button,{text:dl(a?.name)}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:d.map((({name:t})=>jsxRuntimeExports.jsx($.Item,{onClick:()=>l(t),children:dl(t)},t)))})})]})]})},ml=({prefKey:n,options:i,disabled:o,...r})=>{const{isLoading:a,value:s="Select option",update:c}=Hr({prefKey:n});return jsxRuntimeExports.jsxs($,{variant:"light",disabled:a||o,...r,children:[jsxRuntimeExports.jsx($.Button,{children:s}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:i.map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>(async e=>{if(e!==s)try{await c(e);}catch(e){console.error("Failed to update platform preference:",e);}})(t),children:t},t)))})})]})},hl=({className:n,label:i="Pinned position",...o})=>jsxRuntimeExports.jsx(I,{className:k("io-block-list-gap",n),...o,children:jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsx(ml,{className:n,prefKey:eo,options:["Left","Right"],...o})]})}),pl=({prefKey:t,...n})=>{const{isLoading:i,value:o=false,update:r}=Hr({prefKey:t});return jsxRuntimeExports.jsx(Ri,{checked:o,disabled:i,onChange:e=>r(e.target.checked),...n})},gl=({align:t="right",label:n="Allow docking",...i})=>jsxRuntimeExports.jsx(pl,{align:t,label:n,prefKey:to,...i}),vl=({align:t="right",label:n="Minimize to tray",...i})=>jsxRuntimeExports.jsx(pl,{align:t,label:n,prefKey:no,...i}),yl=({align:t="right",label:n="Auto-close on starting apps and workspaces",...i})=>jsxRuntimeExports.jsx(pl,{align:t,label:n,prefKey:io,disabled:true,...i}),wl=({align:t="right",label:n="Show tutorial on startup",...i})=>jsxRuntimeExports.jsx(pl,{align:t,label:n,prefKey:oo,...i}),bl=({className:n,title:i="Layouts",...o})=>{const{LayoutsSaveCurrentOnExit:r,LayoutsShowDeletePrompt:a,LayoutsShowUnsavedChangesPrompt:s}=Cu();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(a,{})]})},kl=({align:t="right",label:n="Restore last saved on startup",...i})=>jsxRuntimeExports.jsx(pl,{align:t,label:n,prefKey:ro,...i}),Cl=({align:t="right",label:n="Save current on exit",...i})=>jsxRuntimeExports.jsx(pl,{align:t,label:n,prefKey:ao,...i}),Nl=({align:t="right",label:n="Show prompt for unsaved changes",...i})=>jsxRuntimeExports.jsx(pl,{align:t,label:n,prefKey:so,...i}),xl=({align:t="right",label:n="Show prompt for deleting",...i})=>jsxRuntimeExports.jsx(pl,{align:t,label:n,prefKey:co,...i}),Sl=({className:t,title:n="Downloads",...i})=>{const{DownloadsLocation:o}=Cu();return jsxRuntimeExports.jsx(I,{className:k("io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},Dl=({align:t="right",label:n="Ask where to save each file before downloading",...i})=>jsxRuntimeExports.jsx(pl,{align:t,label:n,prefKey:lo,...i}),El=({className:n,label:i="Location",...o})=>{const{configuration:{downloadFolder:r},setDownloadLocationWithDialog:a,isDownloadLocationDialogVisible:s,downloadLocationList:c}=Na();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),...o,children:[jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsx(A,{text:"Change",onClick:a,disabled:s})]}),jsxRuntimeExports.jsx("p",{children:r??c?.[0]??"Not set"})]})},Il=({className:n,title:i="System",...o})=>{const{SystemRestartSection:r,SystemShutdownSection:a}=Cu();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})};var Al=["onChange","onClose","onDayCreate","onDestroy","onKeyDown","onMonthChange","onOpen","onParseConfig","onReady","onValueUpdate","onYearChange","onPreCalendarPosition"],Ml={_disable:[],allowInput:false,allowInvalidPreload:false,altFormat:"F j, Y",altInput:false,altInputClass:"form-control input",animate:"object"==typeof window&&-1===window.navigator.userAgent.indexOf("MSIE"),ariaDateFormat:"F j, Y",autoFillDefaultTime:true,clickOpens:true,closeOnSelect:true,conjunction:", ",dateFormat:"Y-m-d",defaultHour:12,defaultMinute:0,defaultSeconds:0,disable:[],disableMobile:false,enableSeconds:false,enableTime:false,errorHandler:function(e){return "undefined"!=typeof console&&console.warn(e)},getWeek:function(e){var t=new Date(e.getTime());t.setHours(0,0,0,0),t.setDate(t.getDate()+3-(t.getDay()+6)%7);var n=new Date(t.getFullYear(),0,4);return 1+Math.round(((t.getTime()-n.getTime())/864e5-3+(n.getDay()+6)%7)/7)},hourIncrement:1,ignoredFocusElements:[],inline:false,locale:"default",minuteIncrement:5,mode:"single",monthSelectorType:"dropdown",nextArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",noCalendar:false,now:new Date,onChange:[],onClose:[],onDayCreate:[],onDestroy:[],onKeyDown:[],onMonthChange:[],onOpen:[],onParseConfig:[],onReady:[],onValueUpdate:[],onYearChange:[],onPreCalendarPosition:[],plugins:[],position:"auto",positionElement:void 0,prevArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",shorthandCurrentMonth:false,showMonths:1,static:false,time_24hr:false,weekNumbers:false,wrap:false},Tl={weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0,ordinal:function(e){var t=e%100;if(t>3&&t<21)return "th";switch(t%10){case 1:return "st";case 2:return "nd";case 3:return "rd";default:return "th"}},rangeSeparator:" to ",weekAbbreviation:"Wk",scrollTitle:"Scroll to increment",toggleTitle:"Click to toggle",amPM:["AM","PM"],yearAriaLabel:"Year",monthAriaLabel:"Month",hourAriaLabel:"Hour",minuteAriaLabel:"Minute",time_24hr:false},Pl=function(e,t){return void 0===t&&(t=2),("000"+e).slice(-1*t)},_l=function(e){return  true===e?1:0};function Ol(e,t){var n;return function(){var i=this,o=arguments;clearTimeout(n),n=setTimeout((function(){return e.apply(i,o)}),t);}}var Ll=function(e){return e instanceof Array?e:[e]};function Fl(e,t,n){if(true===n)return e.classList.add(t);e.classList.remove(t);}function Bl(e,t,n){var i=window.document.createElement(e);return t=t||"",n=n||"",i.className=t,void 0!==n&&(i.textContent=n),i}function Rl(e){for(;e.firstChild;)e.removeChild(e.firstChild);}function jl(e,t){return t(e)?e:e.parentNode?jl(e.parentNode,t):void 0}function Hl(e,t){var n=Bl("div","numInputWrapper"),i=Bl("input","numInput "+e),o=Bl("span","arrowUp"),r=Bl("span","arrowDown");if(-1===navigator.userAgent.indexOf("MSIE 9.0")?i.type="number":(i.type="text",i.pattern="\\d*"),void 0!==t)for(var a in t)i.setAttribute(a,t[a]);return n.appendChild(i),n.appendChild(o),n.appendChild(r),n}function zl(e){try{return "function"==typeof e.composedPath?e.composedPath()[0]:e.target}catch(t){return e.target}}var $l=function(){},Vl=function(e,t,n){return n.months[t?"shorthand":"longhand"][e]},Yl={D:$l,F:function(e,t,n){e.setMonth(n.months.longhand.indexOf(t));},G:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},H:function(e,t){e.setHours(parseFloat(t));},J:function(e,t){e.setDate(parseFloat(t));},K:function(e,t,n){e.setHours(e.getHours()%12+12*_l(new RegExp(n.amPM[1],"i").test(t)));},M:function(e,t,n){e.setMonth(n.months.shorthand.indexOf(t));},S:function(e,t){e.setSeconds(parseFloat(t));},U:function(e,t){return new Date(1e3*parseFloat(t))},W:function(e,t,n){var i=parseInt(t),o=new Date(e.getFullYear(),0,2+7*(i-1),0,0,0,0);return o.setDate(o.getDate()-o.getDay()+n.firstDayOfWeek),o},Y:function(e,t){e.setFullYear(parseFloat(t));},Z:function(e,t){return new Date(t)},d:function(e,t){e.setDate(parseFloat(t));},h:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},i:function(e,t){e.setMinutes(parseFloat(t));},j:function(e,t){e.setDate(parseFloat(t));},l:$l,m:function(e,t){e.setMonth(parseFloat(t)-1);},n:function(e,t){e.setMonth(parseFloat(t)-1);},s:function(e,t){e.setSeconds(parseFloat(t));},u:function(e,t){return new Date(parseFloat(t))},w:$l,y:function(e,t){e.setFullYear(2e3+parseFloat(t));}},Ul={D:"",F:"",G:"(\\d\\d|\\d)",H:"(\\d\\d|\\d)",J:"(\\d\\d|\\d)\\w+",K:"",M:"",S:"(\\d\\d|\\d)",U:"(.+)",W:"(\\d\\d|\\d)",Y:"(\\d{4})",Z:"(.+)",d:"(\\d\\d|\\d)",h:"(\\d\\d|\\d)",i:"(\\d\\d|\\d)",j:"(\\d\\d|\\d)",l:"",m:"(\\d\\d|\\d)",n:"(\\d\\d|\\d)",s:"(\\d\\d|\\d)",u:"(.+)",w:"(\\d\\d|\\d)",y:"(\\d{2})"},Wl={Z:function(e){return e.toISOString()},D:function(e,t,n){return t.weekdays.shorthand[Wl.w(e,t,n)]},F:function(e,t,n){return Vl(Wl.n(e,t,n)-1,false,t)},G:function(e,t,n){return Pl(Wl.h(e,t,n))},H:function(e){return Pl(e.getHours())},J:function(e,t){return void 0!==t.ordinal?e.getDate()+t.ordinal(e.getDate()):e.getDate()},K:function(e,t){return t.amPM[_l(e.getHours()>11)]},M:function(e,t){return Vl(e.getMonth(),true,t)},S:function(e){return Pl(e.getSeconds())},U:function(e){return e.getTime()/1e3},W:function(e,t,n){return n.getWeek(e)},Y:function(e){return Pl(e.getFullYear(),4)},d:function(e){return Pl(e.getDate())},h:function(e){return e.getHours()%12?e.getHours()%12:12},i:function(e){return Pl(e.getMinutes())},j:function(e){return e.getDate()},l:function(e,t){return t.weekdays.longhand[e.getDay()]},m:function(e){return Pl(e.getMonth()+1)},n:function(e){return e.getMonth()+1},s:function(e){return e.getSeconds()},u:function(e){return e.getTime()},w:function(e){return e.getDay()},y:function(e){return String(e.getFullYear()).substring(2)}},Jl=function(e){var t=e.config,n=void 0===t?Ml:t,i=e.l10n,o=void 0===i?Tl:i,r=e.isMobile,a=void 0!==r&&r;return function(e,t,i){var r=i||o;return void 0===n.formatDate||a?t.split("").map((function(t,i,o){return Wl[t]&&"\\"!==o[i-1]?Wl[t](e,r,n):"\\"!==t?t:""})).join(""):n.formatDate(e,t,r)}},ql=function(e){var t=e.config,n=void 0===t?Ml:t,i=e.l10n,o=void 0===i?Tl:i;return function(e,t,i,r){if(0===e||e){var a,s=r||o,c=e;if(e instanceof Date)a=new Date(e.getTime());else if("string"!=typeof e&&void 0!==e.toFixed)a=new Date(e);else if("string"==typeof e){var l=t||(n||Ml).dateFormat,u=String(e).trim();if("today"===u)a=new Date,i=true;else if(n&&n.parseDate)a=n.parseDate(e,l);else if(/Z$/.test(u)||/GMT$/.test(u))a=new Date(e);else {for(var d=void 0,f=[],m=0,h=0,p="";m<l.length;m++){var g=l[m],v="\\"===g,y="\\"===l[m-1]||v;if(Ul[g]&&!y){p+=Ul[g];var w=new RegExp(p).exec(e);w&&(d=true)&&f["Y"!==g?"push":"unshift"]({fn:Yl[g],val:w[++h]});}else v||(p+=".");}a=n&&n.noCalendar?new Date((new Date).setHours(0,0,0,0)):new Date((new Date).getFullYear(),0,1,0,0,0,0),f.forEach((function(e){var t=e.fn,n=e.val;return a=t(a,n,s)||a})),a=d?a:void 0;}}if(a instanceof Date&&!isNaN(a.getTime()))return  true===i&&a.setHours(0,0,0,0),a;n.errorHandler(new Error("Invalid date provided: "+c));}}};function Kl(e,t,n){return void 0===n&&(n=true),false!==n?new Date(e.getTime()).setHours(0,0,0,0)-new Date(t.getTime()).setHours(0,0,0,0):e.getTime()-t.getTime()}var Gl=function(e,t,n){return e>Math.min(t,n)&&e<Math.max(t,n)},Ql=function(e,t,n){return 3600*e+60*t+n},Xl=function(e){var t=Math.floor(e/3600),n=(e-3600*t)/60;return [t,n,e-3600*t-60*n]},Zl={DAY:864e5};function eu(e){var t=e.defaultHour,n=e.defaultMinute,i=e.defaultSeconds;if(void 0!==e.minDate){var o=e.minDate.getHours(),r=e.minDate.getMinutes(),a=e.minDate.getSeconds();t<o&&(t=o),t===o&&n<r&&(n=r),t===o&&n===r&&i<a&&(i=e.minDate.getSeconds());}if(void 0!==e.maxDate){var s=e.maxDate.getHours(),c=e.maxDate.getMinutes();(t=Math.min(t,s))===s&&(n=Math.min(c,n)),t===s&&n===c&&(i=e.maxDate.getSeconds());}return {hours:t,minutes:n,seconds:i}}"function"!=typeof Object.assign&&(Object.assign=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(!e)throw TypeError("Cannot convert undefined or null to object");for(var i=function(t){t&&Object.keys(t).forEach((function(n){return e[n]=t[n]}));},o=0,r=t;o<r.length;o++){i(r[o]);}return e});var tu=function(){return tu=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},tu.apply(this,arguments)},nu=function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var i=Array(e),o=0;for(t=0;t<n;t++)for(var r=arguments[t],a=0,s=r.length;a<s;a++,o++)i[o]=r[a];return i},iu=300;function ou(e,t){var n={config:tu(tu({},Ml),au.defaultConfig),l10n:Tl};function i(){var e;return (null===(e=n.calendarContainer)||void 0===e?void 0:e.getRootNode()).activeElement||document.activeElement}function o(e){return e.bind(n)}function r(){var e=n.config;false===e.weekNumbers&&1===e.showMonths||true!==e.noCalendar&&window.requestAnimationFrame((function(){if(void 0!==n.calendarContainer&&(n.calendarContainer.style.visibility="hidden",n.calendarContainer.style.display="block"),void 0!==n.daysContainer){var t=(n.days.offsetWidth+1)*e.showMonths;n.daysContainer.style.width=t+"px",n.calendarContainer.style.width=t+(void 0!==n.weekWrapper?n.weekWrapper.offsetWidth:0)+"px",n.calendarContainer.style.removeProperty("visibility"),n.calendarContainer.style.removeProperty("display");}}));}function a(e){if(0===n.selectedDates.length){var t=void 0===n.config.minDate||Kl(new Date,n.config.minDate)>=0?new Date:new Date(n.config.minDate.getTime()),i=eu(n.config);t.setHours(i.hours,i.minutes,i.seconds,t.getMilliseconds()),n.selectedDates=[t],n.latestSelectedDateObj=t;} void 0!==e&&"blur"!==e.type&&function(e){e.preventDefault();var t="keydown"===e.type,i=zl(e),o=i;void 0!==n.amPM&&i===n.amPM&&(n.amPM.textContent=n.l10n.amPM[_l(n.amPM.textContent===n.l10n.amPM[0])]);var r=parseFloat(o.getAttribute("min")),a=parseFloat(o.getAttribute("max")),s=parseFloat(o.getAttribute("step")),c=parseInt(o.value,10),l=e.delta||(t?38===e.which?1:-1:0),u=c+s*l;if(void 0!==o.value&&2===o.value.length){var d=o===n.hourElement,f=o===n.minuteElement;u<r?(u=a+u+_l(!d)+(_l(d)&&_l(!n.amPM)),f&&p(void 0,-1,n.hourElement)):u>a&&(u=o===n.hourElement?u-a-_l(!n.amPM):r,f&&p(void 0,1,n.hourElement)),n.amPM&&d&&(1===s?u+c===23:Math.abs(u-c)>s)&&(n.amPM.textContent=n.l10n.amPM[_l(n.amPM.textContent===n.l10n.amPM[0])]),o.value=Pl(u);}}(e);var o=n._input.value;s(),Z(),n._input.value!==o&&n._debouncedChange();}function s(){if(void 0!==n.hourElement&&void 0!==n.minuteElement){var e,t,i=(parseInt(n.hourElement.value.slice(-2),10)||0)%24,o=(parseInt(n.minuteElement.value,10)||0)%60,r=void 0!==n.secondElement?(parseInt(n.secondElement.value,10)||0)%60:0;void 0!==n.amPM&&(e=i,t=n.amPM.textContent,i=e%12+12*_l(t===n.l10n.amPM[1]));var a=void 0!==n.config.minTime||n.config.minDate&&n.minDateHasTime&&n.latestSelectedDateObj&&0===Kl(n.latestSelectedDateObj,n.config.minDate,true),s=void 0!==n.config.maxTime||n.config.maxDate&&n.maxDateHasTime&&n.latestSelectedDateObj&&0===Kl(n.latestSelectedDateObj,n.config.maxDate,true);if(void 0!==n.config.maxTime&&void 0!==n.config.minTime&&n.config.minTime>n.config.maxTime){var c=Ql(n.config.minTime.getHours(),n.config.minTime.getMinutes(),n.config.minTime.getSeconds()),u=Ql(n.config.maxTime.getHours(),n.config.maxTime.getMinutes(),n.config.maxTime.getSeconds()),d=Ql(i,o,r);if(d>u&&d<c){var f=Xl(c);i=f[0],o=f[1],r=f[2];}}else {if(s){var m=void 0!==n.config.maxTime?n.config.maxTime:n.config.maxDate;(i=Math.min(i,m.getHours()))===m.getHours()&&(o=Math.min(o,m.getMinutes())),o===m.getMinutes()&&(r=Math.min(r,m.getSeconds()));}if(a){var h=void 0!==n.config.minTime?n.config.minTime:n.config.minDate;(i=Math.max(i,h.getHours()))===h.getHours()&&o<h.getMinutes()&&(o=h.getMinutes()),o===h.getMinutes()&&(r=Math.max(r,h.getSeconds()));}}l(i,o,r);}}function c(e){var t=e||n.latestSelectedDateObj;t&&t instanceof Date&&l(t.getHours(),t.getMinutes(),t.getSeconds());}function l(e,t,i){ void 0!==n.latestSelectedDateObj&&n.latestSelectedDateObj.setHours(e%24,t,i||0,0),n.hourElement&&n.minuteElement&&!n.isMobile&&(n.hourElement.value=Pl(n.config.time_24hr?e:(12+e)%12+12*_l(e%12==0)),n.minuteElement.value=Pl(t),void 0!==n.amPM&&(n.amPM.textContent=n.l10n.amPM[_l(e>=12)]),void 0!==n.secondElement&&(n.secondElement.value=Pl(i)));}function u(e){var t=zl(e),n=parseInt(t.value)+(e.delta||0);(n/1e3>1||"Enter"===e.key&&!/[^\d]/.test(n.toString()))&&M(n);}function d(e,t,i,o){return t instanceof Array?t.forEach((function(t){return d(e,t,i,o)})):e instanceof Array?e.forEach((function(e){return d(e,t,i,o)})):(e.addEventListener(t,i,o),void n._handlers.push({remove:function(){return e.removeEventListener(t,i,o)}}))}function f(){q("onChange");}function m(e,t){var i=void 0!==e?n.parseDate(e):n.latestSelectedDateObj||(n.config.minDate&&n.config.minDate>n.now?n.config.minDate:n.config.maxDate&&n.config.maxDate<n.now?n.config.maxDate:n.now),o=n.currentYear,r=n.currentMonth;try{void 0!==i&&(n.currentYear=i.getFullYear(),n.currentMonth=i.getMonth());}catch(e){e.message="Invalid date supplied: "+i,n.config.errorHandler(e);}t&&n.currentYear!==o&&(q("onYearChange"),C()),!t||n.currentYear===o&&n.currentMonth===r||q("onMonthChange"),n.redraw();}function h(e){var t=zl(e);~t.className.indexOf("arrow")&&p(e,t.classList.contains("arrowUp")?1:-1);}function p(e,t,n){var i=e&&zl(e),o=n||i&&i.parentNode&&i.parentNode.firstChild,r=K("increment");r.delta=t,o&&o.dispatchEvent(r);}function g(e,t,i,o){var r=T(t,true),a=Bl("span",e,t.getDate().toString());return a.dateObj=t,a.$i=o,a.setAttribute("aria-label",n.formatDate(t,n.config.ariaDateFormat)),-1===e.indexOf("hidden")&&0===Kl(t,n.now)&&(n.todayDateElem=a,a.classList.add("today"),a.setAttribute("aria-current","date")),r?(a.tabIndex=-1,G(t)&&(a.classList.add("selected"),n.selectedDateElem=a,"range"===n.config.mode&&(Fl(a,"startRange",n.selectedDates[0]&&0===Kl(t,n.selectedDates[0],true)),Fl(a,"endRange",n.selectedDates[1]&&0===Kl(t,n.selectedDates[1],true)),"nextMonthDay"===e&&a.classList.add("inRange")))):a.classList.add("flatpickr-disabled"),"range"===n.config.mode&&function(e){return !("range"!==n.config.mode||n.selectedDates.length<2)&&(Kl(e,n.selectedDates[0])>=0&&Kl(e,n.selectedDates[1])<=0)}(t)&&!G(t)&&a.classList.add("inRange"),n.weekNumbers&&1===n.config.showMonths&&"prevMonthDay"!==e&&o%7==6&&n.weekNumbers.insertAdjacentHTML("beforeend","<span class='flatpickr-day'>"+n.config.getWeek(t)+"</span>"),q("onDayCreate",a),a}function v(e){e.focus(),"range"===n.config.mode&&L(e);}function y(e){for(var t=e>0?0:n.config.showMonths-1,i=e>0?n.config.showMonths:-1,o=t;o!=i;o+=e)for(var r=n.daysContainer.children[o],a=e>0?0:r.children.length-1,s=e>0?r.children.length:-1,c=a;c!=s;c+=e){var l=r.children[c];if(-1===l.className.indexOf("hidden")&&T(l.dateObj))return l}}function w(e,t){var o=i(),r=P(o||document.body),a=void 0!==e?e:r?o:void 0!==n.selectedDateElem&&P(n.selectedDateElem)?n.selectedDateElem:void 0!==n.todayDateElem&&P(n.todayDateElem)?n.todayDateElem:y(t>0?1:-1);void 0===a?n._input.focus():r?function(e,t){for(var i=-1===e.className.indexOf("Month")?e.dateObj.getMonth():n.currentMonth,o=t>0?n.config.showMonths:-1,r=t>0?1:-1,a=i-n.currentMonth;a!=o;a+=r)for(var s=n.daysContainer.children[a],c=i-n.currentMonth===a?e.$i+t:t<0?s.children.length-1:0,l=s.children.length,u=c;u>=0&&u<l&&u!=(t>0?l:-1);u+=r){var d=s.children[u];if(-1===d.className.indexOf("hidden")&&T(d.dateObj)&&Math.abs(e.$i-u)>=Math.abs(t))return v(d)}n.changeMonth(r),w(y(r),0);}(a,t):v(a);}function b(e,t){for(var i=(new Date(e,t,1).getDay()-n.l10n.firstDayOfWeek+7)%7,o=n.utils.getDaysInMonth((t-1+12)%12,e),r=n.utils.getDaysInMonth(t,e),a=window.document.createDocumentFragment(),s=n.config.showMonths>1,c=s?"prevMonthDay hidden":"prevMonthDay",l=s?"nextMonthDay hidden":"nextMonthDay",u=o+1-i,d=0;u<=o;u++,d++)a.appendChild(g("flatpickr-day "+c,new Date(e,t-1,u),0,d));for(u=1;u<=r;u++,d++)a.appendChild(g("flatpickr-day",new Date(e,t,u),0,d));for(var f=r+1;f<=42-i&&(1===n.config.showMonths||d%7!=0);f++,d++)a.appendChild(g("flatpickr-day "+l,new Date(e,t+1,f%r),0,d));var m=Bl("div","dayContainer");return m.appendChild(a),m}function k(){if(void 0!==n.daysContainer){Rl(n.daysContainer),n.weekNumbers&&Rl(n.weekNumbers);for(var e=document.createDocumentFragment(),t=0;t<n.config.showMonths;t++){var i=new Date(n.currentYear,n.currentMonth,1);i.setMonth(n.currentMonth+t),e.appendChild(b(i.getFullYear(),i.getMonth()));}n.daysContainer.appendChild(e),n.days=n.daysContainer.firstChild,"range"===n.config.mode&&1===n.selectedDates.length&&L();}}function C(){if(!(n.config.showMonths>1||"dropdown"!==n.config.monthSelectorType)){var e=function(e){return !(void 0!==n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&e<n.config.minDate.getMonth())&&!(void 0!==n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()&&e>n.config.maxDate.getMonth())};n.monthsDropdownContainer.tabIndex=-1,n.monthsDropdownContainer.innerHTML="";for(var t=0;t<12;t++)if(e(t)){var i=Bl("option","flatpickr-monthDropdown-month");i.value=new Date(n.currentYear,t).getMonth().toString(),i.textContent=Vl(t,n.config.shorthandCurrentMonth,n.l10n),i.tabIndex=-1,n.currentMonth===t&&(i.selected=true),n.monthsDropdownContainer.appendChild(i);}}}function N(){var e,t=Bl("div","flatpickr-month"),i=window.document.createDocumentFragment();n.config.showMonths>1||"static"===n.config.monthSelectorType?e=Bl("span","cur-month"):(n.monthsDropdownContainer=Bl("select","flatpickr-monthDropdown-months"),n.monthsDropdownContainer.setAttribute("aria-label",n.l10n.monthAriaLabel),d(n.monthsDropdownContainer,"change",(function(e){var t=zl(e),i=parseInt(t.value,10);n.changeMonth(i-n.currentMonth),q("onMonthChange");})),C(),e=n.monthsDropdownContainer);var o=Hl("cur-year",{tabindex:"-1"}),r=o.getElementsByTagName("input")[0];r.setAttribute("aria-label",n.l10n.yearAriaLabel),n.config.minDate&&r.setAttribute("min",n.config.minDate.getFullYear().toString()),n.config.maxDate&&(r.setAttribute("max",n.config.maxDate.getFullYear().toString()),r.disabled=!!n.config.minDate&&n.config.minDate.getFullYear()===n.config.maxDate.getFullYear());var a=Bl("div","flatpickr-current-month");return a.appendChild(e),a.appendChild(o),i.appendChild(a),t.appendChild(i),{container:t,yearElement:r,monthElement:e}}function x(){Rl(n.monthNav),n.monthNav.appendChild(n.prevMonthNav),n.config.showMonths&&(n.yearElements=[],n.monthElements=[]);for(var e=n.config.showMonths;e--;){var t=N();n.yearElements.push(t.yearElement),n.monthElements.push(t.monthElement),n.monthNav.appendChild(t.container);}n.monthNav.appendChild(n.nextMonthNav);}function S(){n.weekdayContainer?Rl(n.weekdayContainer):n.weekdayContainer=Bl("div","flatpickr-weekdays");for(var e=n.config.showMonths;e--;){var t=Bl("div","flatpickr-weekdaycontainer");n.weekdayContainer.appendChild(t);}return D(),n.weekdayContainer}function D(){if(n.weekdayContainer){var e=n.l10n.firstDayOfWeek,t=nu(n.l10n.weekdays.shorthand);e>0&&e<t.length&&(t=nu(t.splice(e,t.length),t.splice(0,e)));for(var i=n.config.showMonths;i--;)n.weekdayContainer.children[i].innerHTML="\n      <span class='flatpickr-weekday'>\n        "+t.join("</span><span class='flatpickr-weekday'>")+"\n      </span>\n      ";}}function E(e,t){ void 0===t&&(t=true);var i=t?e:e-n.currentMonth;i<0&&true===n._hidePrevMonthArrow||i>0&&true===n._hideNextMonthArrow||(n.currentMonth+=i,(n.currentMonth<0||n.currentMonth>11)&&(n.currentYear+=n.currentMonth>11?1:-1,n.currentMonth=(n.currentMonth+12)%12,q("onYearChange"),C()),k(),q("onMonthChange"),Q());}function I(e){return n.calendarContainer.contains(e)}function A(e){if(n.isOpen&&!n.config.inline){var t=zl(e),i=I(t),o=!(t===n.input||t===n.altInput||n.element.contains(t)||e.path&&e.path.indexOf&&(~e.path.indexOf(n.input)||~e.path.indexOf(n.altInput)))&&!i&&!I(e.relatedTarget),r=!n.config.ignoredFocusElements.some((function(e){return e.contains(t)}));o&&r&&(n.config.allowInput&&n.setDate(n._input.value,false,n.config.altInput?n.config.altFormat:n.config.dateFormat),void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement&&""!==n.input.value&&void 0!==n.input.value&&a(),n.close(),n.config&&"range"===n.config.mode&&1===n.selectedDates.length&&n.clear(false));}}function M(e){if(!(!e||n.config.minDate&&e<n.config.minDate.getFullYear()||n.config.maxDate&&e>n.config.maxDate.getFullYear())){var t=e,i=n.currentYear!==t;n.currentYear=t||n.currentYear,n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth=Math.min(n.config.maxDate.getMonth(),n.currentMonth):n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&(n.currentMonth=Math.max(n.config.minDate.getMonth(),n.currentMonth)),i&&(n.redraw(),q("onYearChange"),C());}}function T(e,t){var i;void 0===t&&(t=true);var o=n.parseDate(e,void 0,t);if(n.config.minDate&&o&&Kl(o,n.config.minDate,void 0!==t?t:!n.minDateHasTime)<0||n.config.maxDate&&o&&Kl(o,n.config.maxDate,void 0!==t?t:!n.maxDateHasTime)>0)return  false;if(!n.config.enable&&0===n.config.disable.length)return  true;if(void 0===o)return  false;for(var r=!!n.config.enable,a=null!==(i=n.config.enable)&&void 0!==i?i:n.config.disable,s=0,c=void 0;s<a.length;s++){if("function"==typeof(c=a[s])&&c(o))return r;if(c instanceof Date&&void 0!==o&&c.getTime()===o.getTime())return r;if("string"==typeof c){var l=n.parseDate(c,void 0,true);return l&&l.getTime()===o.getTime()?r:!r}if("object"==typeof c&&void 0!==o&&c.from&&c.to&&o.getTime()>=c.from.getTime()&&o.getTime()<=c.to.getTime())return r}return !r}function P(e){return void 0!==n.daysContainer&&(-1===e.className.indexOf("hidden")&&-1===e.className.indexOf("flatpickr-disabled")&&n.daysContainer.contains(e))}function _(e){var t=e.target===n._input,i=n._input.value.trimEnd()!==X();!t||!i||e.relatedTarget&&I(e.relatedTarget)||n.setDate(n._input.value,true,e.target===n.altInput?n.config.altFormat:n.config.dateFormat);}function O(t){var o=zl(t),r=n.config.wrap?e.contains(o):o===n._input,c=n.config.allowInput,l=n.isOpen&&(!c||!r),u=n.config.inline&&r&&!c;if(13===t.keyCode&&r){if(c)return n.setDate(n._input.value,true,o===n.altInput?n.config.altFormat:n.config.dateFormat),n.close(),o.blur();n.open();}else if(I(o)||l||u){var d=!!n.timeContainer&&n.timeContainer.contains(o);switch(t.keyCode){case 13:d?(t.preventDefault(),a(),$()):V(t);break;case 27:t.preventDefault(),$();break;case 8:case 46:r&&!n.config.allowInput&&(t.preventDefault(),n.clear());break;case 37:case 39:if(d||r)n.hourElement&&n.hourElement.focus();else {t.preventDefault();var f=i();if(void 0!==n.daysContainer&&(false===c||f&&P(f))){var m=39===t.keyCode?1:-1;t.ctrlKey?(t.stopPropagation(),E(m),w(y(1),0)):w(void 0,m);}}break;case 38:case 40:t.preventDefault();var h=40===t.keyCode?1:-1;n.daysContainer&&void 0!==o.$i||o===n.input||o===n.altInput?t.ctrlKey?(t.stopPropagation(),M(n.currentYear-h),w(y(1),0)):d||w(void 0,7*h):o===n.currentYearElement?M(n.currentYear-h):n.config.enableTime&&(!d&&n.hourElement&&n.hourElement.focus(),a(t),n._debouncedChange());break;case 9:if(d){var p=[n.hourElement,n.minuteElement,n.secondElement,n.amPM].concat(n.pluginElements).filter((function(e){return e})),g=p.indexOf(o);if(-1!==g){var v=p[g+(t.shiftKey?-1:1)];t.preventDefault(),(v||n._input).focus();}}else !n.config.noCalendar&&n.daysContainer&&n.daysContainer.contains(o)&&t.shiftKey&&(t.preventDefault(),n._input.focus());}}if(void 0!==n.amPM&&o===n.amPM)switch(t.key){case n.l10n.amPM[0].charAt(0):case n.l10n.amPM[0].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[0],s(),Z();break;case n.l10n.amPM[1].charAt(0):case n.l10n.amPM[1].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[1],s(),Z();}(r||I(o))&&q("onKeyDown",t);}function L(e,t){if(void 0===t&&(t="flatpickr-day"),1===n.selectedDates.length&&(!e||e.classList.contains(t)&&!e.classList.contains("flatpickr-disabled"))){for(var i=e?e.dateObj.getTime():n.days.firstElementChild.dateObj.getTime(),o=n.parseDate(n.selectedDates[0],void 0,true).getTime(),r=Math.min(i,n.selectedDates[0].getTime()),a=Math.max(i,n.selectedDates[0].getTime()),s=false,c=0,l=0,u=r;u<a;u+=Zl.DAY)T(new Date(u),true)||(s=s||u>r&&u<a,u<o&&(!c||u>c)?c=u:u>o&&(!l||u<l)&&(l=u));Array.from(n.rContainer.querySelectorAll("*:nth-child(-n+"+n.config.showMonths+") > ."+t)).forEach((function(t){var r=t.dateObj.getTime(),a=c>0&&r<c||l>0&&r>l;if(a)return t.classList.add("notAllowed"),void["inRange","startRange","endRange"].forEach((function(e){t.classList.remove(e);}));s&&!a||(["startRange","inRange","endRange","notAllowed"].forEach((function(e){t.classList.remove(e);})),void 0!==e&&(e.classList.add(i<=n.selectedDates[0].getTime()?"startRange":"endRange"),o<i&&r===o?t.classList.add("startRange"):o>i&&r===o&&t.classList.add("endRange"),r>=c&&(0===l||r<=l)&&Gl(r,o,i)&&t.classList.add("inRange")));}));}}function F(){!n.isOpen||n.config.static||n.config.inline||H();}function B(e){return function(t){var i=n.config["_"+e+"Date"]=n.parseDate(t,n.config.dateFormat),o=n.config["_"+("min"===e?"max":"min")+"Date"];void 0!==i&&(n["min"===e?"minDateHasTime":"maxDateHasTime"]=i.getHours()>0||i.getMinutes()>0||i.getSeconds()>0),n.selectedDates&&(n.selectedDates=n.selectedDates.filter((function(e){return T(e)})),n.selectedDates.length||"min"!==e||c(i),Z()),n.daysContainer&&(z(),void 0!==i?n.currentYearElement[e]=i.getFullYear().toString():n.currentYearElement.removeAttribute(e),n.currentYearElement.disabled=!!o&&void 0!==i&&o.getFullYear()===i.getFullYear());}}function R(){return n.config.wrap?e.querySelector("[data-input]"):e}function j(){"object"!=typeof n.config.locale&&void 0===au.l10ns[n.config.locale]&&n.config.errorHandler(new Error("flatpickr: invalid locale "+n.config.locale)),n.l10n=tu(tu({},au.l10ns.default),"object"==typeof n.config.locale?n.config.locale:"default"!==n.config.locale?au.l10ns[n.config.locale]:void 0),Ul.D="("+n.l10n.weekdays.shorthand.join("|")+")",Ul.l="("+n.l10n.weekdays.longhand.join("|")+")",Ul.M="("+n.l10n.months.shorthand.join("|")+")",Ul.F="("+n.l10n.months.longhand.join("|")+")",Ul.K="("+n.l10n.amPM[0]+"|"+n.l10n.amPM[1]+"|"+n.l10n.amPM[0].toLowerCase()+"|"+n.l10n.amPM[1].toLowerCase()+")",void 0===tu(tu({},t),JSON.parse(JSON.stringify(e.dataset||{}))).time_24hr&&void 0===au.defaultConfig.time_24hr&&(n.config.time_24hr=n.l10n.time_24hr),n.formatDate=Jl(n),n.parseDate=ql({config:n.config,l10n:n.l10n});}function H(e){if("function"!=typeof n.config.position){if(void 0!==n.calendarContainer){q("onPreCalendarPosition");var t=e||n._positionElement,i=Array.prototype.reduce.call(n.calendarContainer.children,(function(e,t){return e+t.offsetHeight}),0),o=n.calendarContainer.offsetWidth,r=n.config.position.split(" "),a=r[0],s=r.length>1?r[1]:null,c=t.getBoundingClientRect(),l=window.innerHeight-c.bottom,u="above"===a||"below"!==a&&l<i&&c.top>i,d=window.pageYOffset+c.top+(u?-i-2:t.offsetHeight+2);if(Fl(n.calendarContainer,"arrowTop",!u),Fl(n.calendarContainer,"arrowBottom",u),!n.config.inline){var f=window.pageXOffset+c.left,m=false,h=false;"center"===s?(f-=(o-c.width)/2,m=true):"right"===s&&(f-=o-c.width,h=true),Fl(n.calendarContainer,"arrowLeft",!m&&!h),Fl(n.calendarContainer,"arrowCenter",m),Fl(n.calendarContainer,"arrowRight",h);var p=window.document.body.offsetWidth-(window.pageXOffset+c.right),g=f+o>window.document.body.offsetWidth,v=p+o>window.document.body.offsetWidth;if(Fl(n.calendarContainer,"rightMost",g),!n.config.static)if(n.calendarContainer.style.top=d+"px",g)if(v){var y=function(){for(var e=null,t=0;t<document.styleSheets.length;t++){var n=document.styleSheets[t];if(n.cssRules){try{n.cssRules;}catch(e){continue}e=n;break}}return null!=e?e:(i=document.createElement("style"),document.head.appendChild(i),i.sheet);var i;}();if(void 0===y)return;var w=window.document.body.offsetWidth,b=Math.max(0,w/2-o/2),k=y.cssRules.length,C="{left:"+c.left+"px;right:auto;}";Fl(n.calendarContainer,"rightMost",false),Fl(n.calendarContainer,"centerMost",true),y.insertRule(".flatpickr-calendar.centerMost:before,.flatpickr-calendar.centerMost:after"+C,k),n.calendarContainer.style.left=b+"px",n.calendarContainer.style.right="auto";}else n.calendarContainer.style.left="auto",n.calendarContainer.style.right=p+"px";else n.calendarContainer.style.left=f+"px",n.calendarContainer.style.right="auto";}}}else n.config.position(n,e);}function z(){n.config.noCalendar||n.isMobile||(C(),Q(),k());}function $(){n._input.focus(),-1!==window.navigator.userAgent.indexOf("MSIE")||void 0!==navigator.msMaxTouchPoints?setTimeout(n.close,0):n.close();}function V(e){e.preventDefault(),e.stopPropagation();var t=jl(zl(e),(function(e){return e.classList&&e.classList.contains("flatpickr-day")&&!e.classList.contains("flatpickr-disabled")&&!e.classList.contains("notAllowed")}));if(void 0!==t){var i=t,o=n.latestSelectedDateObj=new Date(i.dateObj.getTime()),r=(o.getMonth()<n.currentMonth||o.getMonth()>n.currentMonth+n.config.showMonths-1)&&"range"!==n.config.mode;if(n.selectedDateElem=i,"single"===n.config.mode)n.selectedDates=[o];else if("multiple"===n.config.mode){var a=G(o);a?n.selectedDates.splice(parseInt(a),1):n.selectedDates.push(o);}else "range"===n.config.mode&&(2===n.selectedDates.length&&n.clear(false,false),n.latestSelectedDateObj=o,n.selectedDates.push(o),0!==Kl(o,n.selectedDates[0],true)&&n.selectedDates.sort((function(e,t){return e.getTime()-t.getTime()})));if(s(),r){var c=n.currentYear!==o.getFullYear();n.currentYear=o.getFullYear(),n.currentMonth=o.getMonth(),c&&(q("onYearChange"),C()),q("onMonthChange");}if(Q(),k(),Z(),r||"range"===n.config.mode||1!==n.config.showMonths?void 0!==n.selectedDateElem&&void 0===n.hourElement&&n.selectedDateElem&&n.selectedDateElem.focus():v(i),void 0!==n.hourElement&&void 0!==n.hourElement&&n.hourElement.focus(),n.config.closeOnSelect){var l="single"===n.config.mode&&!n.config.enableTime,u="range"===n.config.mode&&2===n.selectedDates.length&&!n.config.enableTime;(l||u)&&$();}f();}}n.parseDate=ql({config:n.config,l10n:n.l10n}),n._handlers=[],n.pluginElements=[],n.loadedPlugins=[],n._bind=d,n._setHoursFromDate=c,n._positionCalendar=H,n.changeMonth=E,n.changeYear=M,n.clear=function(e,t){ void 0===e&&(e=true);void 0===t&&(t=true);n.input.value="",void 0!==n.altInput&&(n.altInput.value="");void 0!==n.mobileInput&&(n.mobileInput.value="");n.selectedDates=[],n.latestSelectedDateObj=void 0,true===t&&(n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth());if(true===n.config.enableTime){var i=eu(n.config);l(i.hours,i.minutes,i.seconds);}n.redraw(),e&&q("onChange");},n.close=function(){n.isOpen=false,n.isMobile||(void 0!==n.calendarContainer&&n.calendarContainer.classList.remove("open"),void 0!==n._input&&n._input.classList.remove("active"));q("onClose");},n.onMouseOver=L,n._createElement=Bl,n.createDay=g,n.destroy=function(){ void 0!==n.config&&q("onDestroy");for(var e=n._handlers.length;e--;)n._handlers[e].remove();if(n._handlers=[],n.mobileInput)n.mobileInput.parentNode&&n.mobileInput.parentNode.removeChild(n.mobileInput),n.mobileInput=void 0;else if(n.calendarContainer&&n.calendarContainer.parentNode)if(n.config.static&&n.calendarContainer.parentNode){var t=n.calendarContainer.parentNode;if(t.lastChild&&t.removeChild(t.lastChild),t.parentNode){for(;t.firstChild;)t.parentNode.insertBefore(t.firstChild,t);t.parentNode.removeChild(t);}}else n.calendarContainer.parentNode.removeChild(n.calendarContainer);n.altInput&&(n.input.type="text",n.altInput.parentNode&&n.altInput.parentNode.removeChild(n.altInput),delete n.altInput);n.input&&(n.input.type=n.input._type,n.input.classList.remove("flatpickr-input"),n.input.removeAttribute("readonly"));["_showTimeInput","latestSelectedDateObj","_hideNextMonthArrow","_hidePrevMonthArrow","__hideNextMonthArrow","__hidePrevMonthArrow","isMobile","isOpen","selectedDateElem","minDateHasTime","maxDateHasTime","days","daysContainer","_input","_positionElement","innerContainer","rContainer","monthNav","todayDateElem","calendarContainer","weekdayContainer","prevMonthNav","nextMonthNav","monthsDropdownContainer","currentMonthElement","currentYearElement","navigationCurrentMonth","selectedDateElem","config"].forEach((function(e){try{delete n[e];}catch(e){}}));},n.isEnabled=T,n.jumpToDate=m,n.updateValue=Z,n.open=function(e,t){ void 0===t&&(t=n._positionElement);if(true===n.isMobile){if(e){e.preventDefault();var i=zl(e);i&&i.blur();}return void 0!==n.mobileInput&&(n.mobileInput.focus(),n.mobileInput.click()),void q("onOpen")}if(n._input.disabled||n.config.inline)return;var o=n.isOpen;n.isOpen=true,o||(n.calendarContainer.classList.add("open"),n._input.classList.add("active"),q("onOpen"),H(t));true===n.config.enableTime&&true===n.config.noCalendar&&(false!==n.config.allowInput||void 0!==e&&n.timeContainer.contains(e.relatedTarget)||setTimeout((function(){return n.hourElement.select()}),50));},n.redraw=z,n.set=function(e,t){if(null!==e&&"object"==typeof e)for(var i in Object.assign(n.config,e),e) void 0!==Y[i]&&Y[i].forEach((function(e){return e()}));else n.config[e]=t,void 0!==Y[e]?Y[e].forEach((function(e){return e()})):Al.indexOf(e)>-1&&(n.config[e]=Ll(t));n.redraw(),Z(true);},n.setDate=function(e,t,i){ void 0===t&&(t=false);void 0===i&&(i=n.config.dateFormat);if(0!==e&&!e||e instanceof Array&&0===e.length)return n.clear(t);U(e,i),n.latestSelectedDateObj=n.selectedDates[n.selectedDates.length-1],n.redraw(),m(void 0,t),c(),0===n.selectedDates.length&&n.clear(false);Z(t),t&&q("onChange");},n.toggle=function(e){if(true===n.isOpen)return n.close();n.open(e);};var Y={locale:[j,D],showMonths:[x,r,S],minDate:[m],maxDate:[m],positionElement:[J],clickOpens:[function(){ true===n.config.clickOpens?(d(n._input,"focus",n.open),d(n._input,"click",n.open)):(n._input.removeEventListener("focus",n.open),n._input.removeEventListener("click",n.open));}]};function U(e,t){var i=[];if(e instanceof Array)i=e.map((function(e){return n.parseDate(e,t)}));else if(e instanceof Date||"number"==typeof e)i=[n.parseDate(e,t)];else if("string"==typeof e)switch(n.config.mode){case "single":case "time":i=[n.parseDate(e,t)];break;case "multiple":i=e.split(n.config.conjunction).map((function(e){return n.parseDate(e,t)}));break;case "range":i=e.split(n.l10n.rangeSeparator).map((function(e){return n.parseDate(e,t)}));}else n.config.errorHandler(new Error("Invalid date supplied: "+JSON.stringify(e)));n.selectedDates=n.config.allowInvalidPreload?i:i.filter((function(e){return e instanceof Date&&T(e,false)})),"range"===n.config.mode&&n.selectedDates.sort((function(e,t){return e.getTime()-t.getTime()}));}function W(e){return e.slice().map((function(e){return "string"==typeof e||"number"==typeof e||e instanceof Date?n.parseDate(e,void 0,true):e&&"object"==typeof e&&e.from&&e.to?{from:n.parseDate(e.from,void 0),to:n.parseDate(e.to,void 0)}:e})).filter((function(e){return e}))}function J(){n._positionElement=n.config.positionElement||n._input;}function q(e,t){if(void 0!==n.config){var i=n.config[e];if(void 0!==i&&i.length>0)for(var o=0;i[o]&&o<i.length;o++)i[o](n.selectedDates,n.input.value,n,t);"onChange"===e&&(n.input.dispatchEvent(K("change")),n.input.dispatchEvent(K("input")));}}function K(e){var t=document.createEvent("Event");return t.initEvent(e,true,true),t}function G(e){for(var t=0;t<n.selectedDates.length;t++){var i=n.selectedDates[t];if(i instanceof Date&&0===Kl(i,e))return ""+t}return  false}function Q(){n.config.noCalendar||n.isMobile||!n.monthNav||(n.yearElements.forEach((function(e,t){var i=new Date(n.currentYear,n.currentMonth,1);i.setMonth(n.currentMonth+t),n.config.showMonths>1||"static"===n.config.monthSelectorType?n.monthElements[t].textContent=Vl(i.getMonth(),n.config.shorthandCurrentMonth,n.l10n)+" ":n.monthsDropdownContainer.value=i.getMonth().toString(),e.value=i.getFullYear().toString();})),n._hidePrevMonthArrow=void 0!==n.config.minDate&&(n.currentYear===n.config.minDate.getFullYear()?n.currentMonth<=n.config.minDate.getMonth():n.currentYear<n.config.minDate.getFullYear()),n._hideNextMonthArrow=void 0!==n.config.maxDate&&(n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth+1>n.config.maxDate.getMonth():n.currentYear>n.config.maxDate.getFullYear()));}function X(e){var t=e||(n.config.altInput?n.config.altFormat:n.config.dateFormat);return n.selectedDates.map((function(e){return n.formatDate(e,t)})).filter((function(e,t,i){return "range"!==n.config.mode||n.config.enableTime||i.indexOf(e)===t})).join("range"!==n.config.mode?n.config.conjunction:n.l10n.rangeSeparator)}function Z(e){ void 0===e&&(e=true),void 0!==n.mobileInput&&n.mobileFormatStr&&(n.mobileInput.value=void 0!==n.latestSelectedDateObj?n.formatDate(n.latestSelectedDateObj,n.mobileFormatStr):""),n.input.value=X(n.config.dateFormat),void 0!==n.altInput&&(n.altInput.value=X(n.config.altFormat)),false!==e&&q("onValueUpdate");}function ee(e){var t=zl(e),i=n.prevMonthNav.contains(t),o=n.nextMonthNav.contains(t);i||o?E(i?-1:1):n.yearElements.indexOf(t)>=0?t.select():t.classList.contains("arrowUp")?n.changeYear(n.currentYear+1):t.classList.contains("arrowDown")&&n.changeYear(n.currentYear-1);}return function(){n.element=n.input=e,n.isOpen=false,function(){var i=["wrap","weekNumbers","allowInput","allowInvalidPreload","clickOpens","time_24hr","enableTime","noCalendar","altInput","shorthandCurrentMonth","inline","static","enableSeconds","disableMobile"],r=tu(tu({},JSON.parse(JSON.stringify(e.dataset||{}))),t),a={};n.config.parseDate=r.parseDate,n.config.formatDate=r.formatDate,Object.defineProperty(n.config,"enable",{get:function(){return n.config._enable},set:function(e){n.config._enable=W(e);}}),Object.defineProperty(n.config,"disable",{get:function(){return n.config._disable},set:function(e){n.config._disable=W(e);}});var s="time"===r.mode;if(!r.dateFormat&&(r.enableTime||s)){var c=au.defaultConfig.dateFormat||Ml.dateFormat;a.dateFormat=r.noCalendar||s?"H:i"+(r.enableSeconds?":S":""):c+" H:i"+(r.enableSeconds?":S":"");}if(r.altInput&&(r.enableTime||s)&&!r.altFormat){var l=au.defaultConfig.altFormat||Ml.altFormat;a.altFormat=r.noCalendar||s?"h:i"+(r.enableSeconds?":S K":" K"):l+" h:i"+(r.enableSeconds?":S":"")+" K";}Object.defineProperty(n.config,"minDate",{get:function(){return n.config._minDate},set:B("min")}),Object.defineProperty(n.config,"maxDate",{get:function(){return n.config._maxDate},set:B("max")});var u=function(e){return function(t){n.config["min"===e?"_minTime":"_maxTime"]=n.parseDate(t,"H:i:S");}};Object.defineProperty(n.config,"minTime",{get:function(){return n.config._minTime},set:u("min")}),Object.defineProperty(n.config,"maxTime",{get:function(){return n.config._maxTime},set:u("max")}),"time"===r.mode&&(n.config.noCalendar=true,n.config.enableTime=true);Object.assign(n.config,a,r);for(var d=0;d<i.length;d++)n.config[i[d]]=true===n.config[i[d]]||"true"===n.config[i[d]];Al.filter((function(e){return void 0!==n.config[e]})).forEach((function(e){n.config[e]=Ll(n.config[e]||[]).map(o);})),n.isMobile=!n.config.disableMobile&&!n.config.inline&&"single"===n.config.mode&&!n.config.disable.length&&!n.config.enable&&!n.config.weekNumbers&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);for(d=0;d<n.config.plugins.length;d++){var f=n.config.plugins[d](n)||{};for(var m in f)Al.indexOf(m)>-1?n.config[m]=Ll(f[m]).map(o).concat(n.config[m]):void 0===r[m]&&(n.config[m]=f[m]);}r.altInputClass||(n.config.altInputClass=R().className+" "+n.config.altInputClass);q("onParseConfig");}(),j(),function(){if(n.input=R(),!n.input)return void n.config.errorHandler(new Error("Invalid input element specified"));n.input._type=n.input.type,n.input.type="text",n.input.classList.add("flatpickr-input"),n._input=n.input,n.config.altInput&&(n.altInput=Bl(n.input.nodeName,n.config.altInputClass),n._input=n.altInput,n.altInput.placeholder=n.input.placeholder,n.altInput.disabled=n.input.disabled,n.altInput.required=n.input.required,n.altInput.tabIndex=n.input.tabIndex,n.altInput.type="text",n.input.setAttribute("type","hidden"),!n.config.static&&n.input.parentNode&&n.input.parentNode.insertBefore(n.altInput,n.input.nextSibling));n.config.allowInput||n._input.setAttribute("readonly","readonly");J();}(),function(){n.selectedDates=[],n.now=n.parseDate(n.config.now)||new Date;var e=n.config.defaultDate||("INPUT"!==n.input.nodeName&&"TEXTAREA"!==n.input.nodeName||!n.input.placeholder||n.input.value!==n.input.placeholder?n.input.value:null);e&&U(e,n.config.dateFormat);n._initialDate=n.selectedDates.length>0?n.selectedDates[0]:n.config.minDate&&n.config.minDate.getTime()>n.now.getTime()?n.config.minDate:n.config.maxDate&&n.config.maxDate.getTime()<n.now.getTime()?n.config.maxDate:n.now,n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth(),n.selectedDates.length>0&&(n.latestSelectedDateObj=n.selectedDates[0]);void 0!==n.config.minTime&&(n.config.minTime=n.parseDate(n.config.minTime,"H:i"));void 0!==n.config.maxTime&&(n.config.maxTime=n.parseDate(n.config.maxTime,"H:i"));n.minDateHasTime=!!n.config.minDate&&(n.config.minDate.getHours()>0||n.config.minDate.getMinutes()>0||n.config.minDate.getSeconds()>0),n.maxDateHasTime=!!n.config.maxDate&&(n.config.maxDate.getHours()>0||n.config.maxDate.getMinutes()>0||n.config.maxDate.getSeconds()>0);}(),n.utils={getDaysInMonth:function(e,t){return void 0===e&&(e=n.currentMonth),void 0===t&&(t=n.currentYear),1===e&&(t%4==0&&t%100!=0||t%400==0)?29:n.l10n.daysInMonth[e]}},n.isMobile||function(){var e=window.document.createDocumentFragment();if(n.calendarContainer=Bl("div","flatpickr-calendar"),n.calendarContainer.tabIndex=-1,!n.config.noCalendar){if(e.appendChild((n.monthNav=Bl("div","flatpickr-months"),n.yearElements=[],n.monthElements=[],n.prevMonthNav=Bl("span","flatpickr-prev-month"),n.prevMonthNav.innerHTML=n.config.prevArrow,n.nextMonthNav=Bl("span","flatpickr-next-month"),n.nextMonthNav.innerHTML=n.config.nextArrow,x(),Object.defineProperty(n,"_hidePrevMonthArrow",{get:function(){return n.__hidePrevMonthArrow},set:function(e){n.__hidePrevMonthArrow!==e&&(Fl(n.prevMonthNav,"flatpickr-disabled",e),n.__hidePrevMonthArrow=e);}}),Object.defineProperty(n,"_hideNextMonthArrow",{get:function(){return n.__hideNextMonthArrow},set:function(e){n.__hideNextMonthArrow!==e&&(Fl(n.nextMonthNav,"flatpickr-disabled",e),n.__hideNextMonthArrow=e);}}),n.currentYearElement=n.yearElements[0],Q(),n.monthNav)),n.innerContainer=Bl("div","flatpickr-innerContainer"),n.config.weekNumbers){var t=function(){n.calendarContainer.classList.add("hasWeeks");var e=Bl("div","flatpickr-weekwrapper");e.appendChild(Bl("span","flatpickr-weekday",n.l10n.weekAbbreviation));var t=Bl("div","flatpickr-weeks");return e.appendChild(t),{weekWrapper:e,weekNumbers:t}}(),i=t.weekWrapper,o=t.weekNumbers;n.innerContainer.appendChild(i),n.weekNumbers=o,n.weekWrapper=i;}n.rContainer=Bl("div","flatpickr-rContainer"),n.rContainer.appendChild(S()),n.daysContainer||(n.daysContainer=Bl("div","flatpickr-days"),n.daysContainer.tabIndex=-1),k(),n.rContainer.appendChild(n.daysContainer),n.innerContainer.appendChild(n.rContainer),e.appendChild(n.innerContainer);}n.config.enableTime&&e.appendChild(function(){n.calendarContainer.classList.add("hasTime"),n.config.noCalendar&&n.calendarContainer.classList.add("noCalendar");var e=eu(n.config);n.timeContainer=Bl("div","flatpickr-time"),n.timeContainer.tabIndex=-1;var t=Bl("span","flatpickr-time-separator",":"),i=Hl("flatpickr-hour",{"aria-label":n.l10n.hourAriaLabel});n.hourElement=i.getElementsByTagName("input")[0];var o=Hl("flatpickr-minute",{"aria-label":n.l10n.minuteAriaLabel});n.minuteElement=o.getElementsByTagName("input")[0],n.hourElement.tabIndex=n.minuteElement.tabIndex=-1,n.hourElement.value=Pl(n.latestSelectedDateObj?n.latestSelectedDateObj.getHours():n.config.time_24hr?e.hours:function(e){switch(e%24){case 0:case 12:return 12;default:return e%12}}(e.hours)),n.minuteElement.value=Pl(n.latestSelectedDateObj?n.latestSelectedDateObj.getMinutes():e.minutes),n.hourElement.setAttribute("step",n.config.hourIncrement.toString()),n.minuteElement.setAttribute("step",n.config.minuteIncrement.toString()),n.hourElement.setAttribute("min",n.config.time_24hr?"0":"1"),n.hourElement.setAttribute("max",n.config.time_24hr?"23":"12"),n.hourElement.setAttribute("maxlength","2"),n.minuteElement.setAttribute("min","0"),n.minuteElement.setAttribute("max","59"),n.minuteElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(i),n.timeContainer.appendChild(t),n.timeContainer.appendChild(o),n.config.time_24hr&&n.timeContainer.classList.add("time24hr");if(n.config.enableSeconds){n.timeContainer.classList.add("hasSeconds");var r=Hl("flatpickr-second");n.secondElement=r.getElementsByTagName("input")[0],n.secondElement.value=Pl(n.latestSelectedDateObj?n.latestSelectedDateObj.getSeconds():e.seconds),n.secondElement.setAttribute("step",n.minuteElement.getAttribute("step")),n.secondElement.setAttribute("min","0"),n.secondElement.setAttribute("max","59"),n.secondElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(Bl("span","flatpickr-time-separator",":")),n.timeContainer.appendChild(r);}n.config.time_24hr||(n.amPM=Bl("span","flatpickr-am-pm",n.l10n.amPM[_l((n.latestSelectedDateObj?n.hourElement.value:n.config.defaultHour)>11)]),n.amPM.title=n.l10n.toggleTitle,n.amPM.tabIndex=-1,n.timeContainer.appendChild(n.amPM));return n.timeContainer}());Fl(n.calendarContainer,"rangeMode","range"===n.config.mode),Fl(n.calendarContainer,"animate",true===n.config.animate),Fl(n.calendarContainer,"multiMonth",n.config.showMonths>1),n.calendarContainer.appendChild(e);var r=void 0!==n.config.appendTo&&void 0!==n.config.appendTo.nodeType;if((n.config.inline||n.config.static)&&(n.calendarContainer.classList.add(n.config.inline?"inline":"static"),n.config.inline&&(!r&&n.element.parentNode?n.element.parentNode.insertBefore(n.calendarContainer,n._input.nextSibling):void 0!==n.config.appendTo&&n.config.appendTo.appendChild(n.calendarContainer)),n.config.static)){var a=Bl("div","flatpickr-wrapper");n.element.parentNode&&n.element.parentNode.insertBefore(a,n.element),a.appendChild(n.element),n.altInput&&a.appendChild(n.altInput),a.appendChild(n.calendarContainer);}n.config.static||n.config.inline||(void 0!==n.config.appendTo?n.config.appendTo:window.document.body).appendChild(n.calendarContainer);}(),function(){n.config.wrap&&["open","close","toggle","clear"].forEach((function(e){Array.prototype.forEach.call(n.element.querySelectorAll("[data-"+e+"]"),(function(t){return d(t,"click",n[e])}));}));if(n.isMobile)return void function(){var e=n.config.enableTime?n.config.noCalendar?"time":"datetime-local":"date";n.mobileInput=Bl("input",n.input.className+" flatpickr-mobile"),n.mobileInput.tabIndex=1,n.mobileInput.type=e,n.mobileInput.disabled=n.input.disabled,n.mobileInput.required=n.input.required,n.mobileInput.placeholder=n.input.placeholder,n.mobileFormatStr="datetime-local"===e?"Y-m-d\\TH:i:S":"date"===e?"Y-m-d":"H:i:S",n.selectedDates.length>0&&(n.mobileInput.defaultValue=n.mobileInput.value=n.formatDate(n.selectedDates[0],n.mobileFormatStr));n.config.minDate&&(n.mobileInput.min=n.formatDate(n.config.minDate,"Y-m-d"));n.config.maxDate&&(n.mobileInput.max=n.formatDate(n.config.maxDate,"Y-m-d"));n.input.getAttribute("step")&&(n.mobileInput.step=String(n.input.getAttribute("step")));n.input.type="hidden",void 0!==n.altInput&&(n.altInput.type="hidden");try{n.input.parentNode&&n.input.parentNode.insertBefore(n.mobileInput,n.input.nextSibling);}catch(e){}d(n.mobileInput,"change",(function(e){n.setDate(zl(e).value,false,n.mobileFormatStr),q("onChange"),q("onClose");}));}();var e=Ol(F,50);n._debouncedChange=Ol(f,iu),n.daysContainer&&!/iPhone|iPad|iPod/i.test(navigator.userAgent)&&d(n.daysContainer,"mouseover",(function(e){"range"===n.config.mode&&L(zl(e));}));d(n._input,"keydown",O),void 0!==n.calendarContainer&&d(n.calendarContainer,"keydown",O);n.config.inline||n.config.static||d(window,"resize",e);void 0!==window.ontouchstart?d(window.document,"touchstart",A):d(window.document,"mousedown",A);d(window.document,"focus",A,{capture:true}),true===n.config.clickOpens&&(d(n._input,"focus",n.open),d(n._input,"click",n.open));void 0!==n.daysContainer&&(d(n.monthNav,"click",ee),d(n.monthNav,["keyup","increment"],u),d(n.daysContainer,"click",V));if(void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement){var t=function(e){return zl(e).select()};d(n.timeContainer,["increment"],a),d(n.timeContainer,"blur",a,{capture:true}),d(n.timeContainer,"click",h),d([n.hourElement,n.minuteElement],["focus","click"],t),void 0!==n.secondElement&&d(n.secondElement,"focus",(function(){return n.secondElement&&n.secondElement.select()})),void 0!==n.amPM&&d(n.amPM,"click",(function(e){a(e);}));}n.config.allowInput&&d(n._input,"blur",_);}(),(n.selectedDates.length||n.config.noCalendar)&&(n.config.enableTime&&c(n.config.noCalendar?n.latestSelectedDateObj:void 0),Z(false)),r();var i=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);!n.isMobile&&i&&H(),q("onReady");}(),n}function ru(e,t){for(var n=Array.prototype.slice.call(e).filter((function(e){return e instanceof HTMLElement})),i=[],o=0;o<n.length;o++){var r=n[o];try{if(null!==r.getAttribute("data-fp-omit"))continue;void 0!==r._flatpickr&&(r._flatpickr.destroy(),r._flatpickr=void 0),r._flatpickr=ou(r,t||{}),i.push(r._flatpickr);}catch(e){console.error(e);}}return 1===i.length?i[0]:i}"undefined"!=typeof HTMLElement&&"undefined"!=typeof HTMLCollection&&"undefined"!=typeof NodeList&&(HTMLCollection.prototype.flatpickr=NodeList.prototype.flatpickr=function(e){return ru(this,e)},HTMLElement.prototype.flatpickr=function(e){return ru([this],e)});var au=function(e,t){return "string"==typeof e?ru(window.document.querySelectorAll(e),t):e instanceof Node?ru([e],t):ru(e,t)};au.defaultConfig={},au.l10ns={en:tu({},Tl),default:tu({},Tl)},au.localize=function(e){au.l10ns.default=tu(tu({},au.l10ns.default),e);},au.setDefaults=function(e){au.defaultConfig=tu(tu({},au.defaultConfig),e);},au.parseDate=ql({}),au.formatDate=Jl({}),au.compareDates=Kl,"undefined"!=typeof jQuery&&void 0!==jQuery.fn&&(jQuery.fn.flatpickr=function(e){return ru(this,e)}),Date.prototype.fp_incr=function(e){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+("string"==typeof e?parseInt(e,10):e))},"undefined"!=typeof window&&(window.flatpickr=au);const su=["onCreate","onDestroy"],cu=["onChange","onOpen","onClose","onMonthChange","onYearChange","onReady","onValueUpdate","onDayCreate"],lu=t=>{const n=i.useMemo((()=>({...t})),[t]),{defaultValue:i$1,options:o={},value:a,children:s,render:c}=n,f=i.useMemo((()=>((e,t)=>(cu.forEach((n=>{const i=t[n],o=e[n];if(i){o&&!Array.isArray(o)?e[n]=[e[n]]:e[n]||(e[n]=[]);const t=Array.isArray(i)?i:[i];0===e[n].length?e[n]=t:e[n].push(...t);}})),cu.forEach((e=>{delete t[e];})),su.forEach((e=>{delete t[e];})),e))(o,n)),[o,n]),m=i.useRef(null),p=i.useRef(void 0);i.useImperativeHandle(t.ref,(()=>({get flatpickr(){return p.current}})),[]),i.useEffect((()=>{var e;if(f.onClose=f.onClose||(()=>{var e;null!=(e=m.current)&&e.blur&&m.current.blur();}),p.current=((null==(n=au)?void 0:n.default)||au)(m.current,f),p.current&&void 0!==a&&p.current.setDate(a,false),t.onCreate&&t.onCreate(p.current),p.current){const t=Object.getOwnPropertyNames(f);for(let n=t.length-1;n>=0;n--){const i=t[n];let o=f[i];(null==o?void 0:o.toString())!==(null==(e=p.current.config[i])?void 0:e.toString())&&(cu.includes(i)&&!Array.isArray(o)&&(o=[o]),p.current.set(i,o));} void 0!==a&&a!==p.current.input.value&&p.current.setDate(a,false);}var n;return ()=>{t.onDestroy&&t.onDestroy(p.current),p.current&&p.current.destroy(),p.current=void 0;}}),[f,o,n,a,t]);const g=i.useCallback((e=>{m.current=e;}),[]);if(c)return c({...n,defaultValue:i$1,value:a},g);const v=i.useCallback((e=>{var n,i;t&&t.onChange&&(Array.isArray(null==t?void 0:t.onChange)?null==(n=null==t?void 0:t.onChange)||n.forEach((()=>[new Date(e.target.value)]),(null==a?void 0:a.toString())||""):"function"==typeof t.onChange&&(null==(i=null==t?void 0:t.onChange)||i.call(t,[new Date(e.target.value)],(null==a?void 0:a.toString())||"",p.current)));}),[t,a]);return o.wrap?jsxRuntimeExports.jsx("div",{className:"flatpickr",ref:g,children:s}):jsxRuntimeExports.jsx("input",{onChange:v,...n,value:null==a?void 0:a.toString(),defaultValue:i$1,ref:g})},uu="T42.GD.Execute",du=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],fu=(e,t)=>e in t;function mu({time:e,frequency:t,day:n}){const i=new Date(`01/01/2000 ${e}`),o=i.getMinutes(),r=i.getHours();let a="*";return "weekly"===t&&n&&(a=function(e){const t={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};if(!fu(e,t))throw new Error(`Invalid day: ${e}`);return t[e]}(n).toString()),`${o} ${r} * * ${a}`}function hu(e){const t=i.useContext(IOConnectContext),{value:n,update:i$1}=Hr({prefKey:pu(e)}),{value:o,update:a}=Hr({prefKey:pu(e,"Time")}),{value:c,update:l}=Hr({prefKey:pu(e,"Frequency")}),{value:d,update:f}=Hr({prefKey:pu(e,"Day")}),m=i.useCallback((async()=>{try{await t.interop.invoke(uu,{command:`cancel-${e}`});}catch(e){console.error(e);}}),[t,e]),h=i.useCallback((async()=>{try{const n=mu({time:o??"12:00 AM",frequency:c??"daily",day:"weekly"===c?d:"*"});await t.interop.invoke(uu,{command:`schedule-${e}`,args:{cronTime:n,discardUnsavedLayoutChanges:!1}});}catch(t){console.error(`Failed to update cron job for ${e}:`,t);}}),[t,e,o,c,d]);i.useEffect((()=>{t&&n&&h();}),[t,n,h]);return {enabled:n??false,time:o??"12:00 AM",frequency:c??"daily",day:d??"Monday",setEnabled:async e=>{e||await m();try{await i$1(e);}catch(e){console.error("Failed to update enabled state:",e);}},setTime:async e=>{try{await a(e);}catch(e){console.error("Failed to update time:",e);}},setFrequency:async e=>{try{await l(e),"daily"===e&&await f(void 0);}catch(e){console.error("Failed to update frequency:",e);}},setDay:async e=>{var t;if(t=e,du.includes(t))try{await f(e);}catch(e){console.error("Failed to update day:",e);}else console.error("Invalid day provided");}}}function pu(e,t){const n="restart"===e?"_system_scheduleRestart":"_system_scheduleShutdown";return t?`${n}${t}`:n}function gu({className:n,variant:i,...o}){const r=k("io-block-list-gap",i,n),{enabled:a,time:s,frequency:c,day:l,setEnabled:u,setTime:d,setFrequency:f,setDay:m}=hu(i);return jsxRuntimeExports.jsxs(I,{className:r,...o,children:[jsxRuntimeExports.jsx(Ri,{label:`Schedule ${i}`,align:"right",onChange:e=>u(e.target.checked),checked:a}),jsxRuntimeExports.jsxs("div",{className:"scheduler-controls",children:[jsxRuntimeExports.jsxs("div",{className:"io-control-input io-control-leading-icon direction-up",children:[jsxRuntimeExports.jsx(C,{variant:"clock"}),jsxRuntimeExports.jsx(lu,{className:"io-input",options:{enableTime:true,noCalendar:true,dateFormat:"h:i K",defaultDate:s,clickOpens:true},value:s,onClose:async([e])=>{const t=e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:true});await d(t);}})]}),jsxRuntimeExports.jsxs(xi,{text:c.charAt(0).toUpperCase()+c.slice(1),icon:"chevron-down",iconRight:true,children:[jsxRuntimeExports.jsx(xi.Item,{onClick:()=>f("daily"),children:"Daily"}),jsxRuntimeExports.jsx(xi.Item,{onClick:()=>f("weekly"),children:"Weekly"})]}),"weekly"===c&&jsxRuntimeExports.jsx(xi,{text:l,icon:"chevron-down",iconRight:true,children:du.map((t=>jsxRuntimeExports.jsx(xi.Item,{onClick:()=>m(t),children:t},t)))})]})]})}function vu({className:t,...n}){return jsxRuntimeExports.jsx(gu,{...n,className:t,variant:"restart"})}function yu({className:t,...n}){return jsxRuntimeExports.jsx(gu,{...n,className:t,variant:"shutdown"})}const wu={Body:ll,General:ul,Theme:fl,PinnedPosition:hl,AllowDocking:gl,MinimizeToTray:vl,AutoClose:yl,ShowTutorialOnStartup:wl,Layouts:bl,LayoutsRestoreLastSaved:kl,LayoutsSaveCurrentOnExit:Cl,LayoutsShowUnsavedChangesPrompt:Nl,LayoutsShowDeletePrompt:xl,Downloads:Sl,DownloadsAskForEachDownload:Dl,DownloadsLocation:El,System:Il,SystemRestartSection:vu,SystemShutdownSection:yu},bu=i.createContext(wu),ku=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...wu,...n})),[n]);return jsxRuntimeExports.jsx(bu.Provider,{value:i$1,children:t})}));ku.displayName="PreferencesPanelComponentsStoreProvider";const Cu=()=>i.useContext(bu);const Du=n=>{const{General:i,Layouts:o}=Pu();return jsxRuntimeExports.jsxs(Ii,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{})]})},Eu=({className:t,title:n="General",...i})=>{const{Theme:o}=Pu();return jsxRuntimeExports.jsx(I,{className:k("io-block io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},Iu=({className:n,title:i="Layouts",...o})=>{const{LayoutsShowDeletePrompt:r,LayoutsShowUnsavedChangesPrompt:a}=Pu();return jsxRuntimeExports.jsxs(I,{className:k("io-block io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(r,{})]})},Au={Body:Du,General:Eu,Theme:fl,Layouts:Iu,LayoutsShowUnsavedChangesPrompt:Nl,LayoutsShowDeletePrompt:xl},Mu=i.createContext(Au),Tu=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...Au,...n})),[n]);return jsxRuntimeExports.jsx(Mu.Provider,{value:i$1,children:t})}));Tu.displayName="PreferencesPanelComponentsStoreProvider";const Pu=()=>i.useContext(Mu);const ju=({name:n,value:i})=>jsxRuntimeExports.jsxs("div",{className:"io-profile-section-item",children:[jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-name",children:n}),jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-value",children:i})]}),Hu=({className:n,items:i,title:o})=>jsxRuntimeExports.jsxs("div",{className:k("io-profile-section-body",n),children:[o&&jsxRuntimeExports.jsx(E,{className:"io-profile-section-title",text:o}),i.map((({name:t,value:n})=>jsxRuntimeExports.jsx(ju,{name:t,value:n},t)))]}),zu=({className:n,items:i,title:o})=>jsxRuntimeExports.jsxs("section",{className:k("io-profile-section",n),children:[jsxRuntimeExports.jsx(Hu,{items:i,title:o}),jsxRuntimeExports.jsx(Ni,{className:"mt-8"})]}),$u=({title:t="License",...n})=>jsxRuntimeExports.jsx(zu,{title:t,...n}),Vu=({title:t="Version",...n})=>jsxRuntimeExports.jsx(zu,{title:t,...n}),Yu=({title:t="Plugins",...n})=>jsxRuntimeExports.jsx(zu,{title:t,...n}),Uu=({className:n})=>{const i=Ji()?"io.Connect Desktop":"io.Connect Browser";return jsxRuntimeExports.jsxs("div",{className:k("io-trademark-container",n),children:[jsxRuntimeExports.jsx("h4",{className:"io-trademark-title",children:i}),jsxRuntimeExports.jsxs("p",{className:"io-trademark-text",children:[i,"® is a registered trademark of"," ",jsxRuntimeExports.jsx("a",{href:"https://www.interop.io",rel:"noreferrer",target:"_blank",children:"Interop Inc©"})," ",(new Date).getFullYear(),". All rights reserved."]})]})},Wu=({avatarInitials:n=(Ji()?"CD":"CB"),className:i,items:o,onLogout:r,title:a})=>jsxRuntimeExports.jsxs("section",{className:k("io-profile-section",i),children:[jsxRuntimeExports.jsxs("div",{className:"io-user-details-container",children:[jsxRuntimeExports.jsx("div",{className:"io-user-avatar",children:n}),jsxRuntimeExports.jsx(Hu,{className:"mt-12",items:o,title:a})]}),r&&jsxRuntimeExports.jsx(A,{className:"io-log-out-button",onClick:r,variant:"primary",icon:"arrow-right-from-bracket",children:"Log out"}),jsxRuntimeExports.jsx(Ni,{className:"mt-8"})]}),Ju={LicenseSection:$u,ProductsInfoSection:Vu,PluginsSection:Yu,Trademark:Uu,UserSection:Wu},qu=i.createContext(Ju),Ku=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...Ju,...n})),[n]);return jsxRuntimeExports.jsx(qu.Provider,{value:i$1,children:t})}));Ku.displayName="ProfilePanelComponentsStoreProvider";

    const GlueControllerContext = i.createContext(null);
    const useGlueController = () => {
        const context = i.useContext(GlueControllerContext);
        if (!context) {
            throw new Error(`useGlueController must be used within a GlueControllerContextProvider`);
        }
        return context;
    };
    const CustomGlueControllerProvider = ({ glueController, children }) => {
        return i.createElement(GlueControllerContext.Provider, { value: glueController }, children);
    };

    const getInitialType = (glueController) => {
        const type = glueController.config.channels?.selector?.type;
        if (!type) {
            return "single";
        }
        return type === "default" ? "single" : "directionalSingle";
    };
    const getChannelRestrictions = async (glueController, name) => {
        const restrictions = typeof glueController.io.channels.getRestrictions === "function" ? await glueController.io.channels.getRestrictions() : { channels: [] };
        const channelRestriction = restrictions.channels.find((restriction) => restriction.name === name);
        const read = typeof channelRestriction?.read === "boolean" ? channelRestriction.read : true;
        const write = typeof channelRestriction?.write === "boolean" ? channelRestriction.write : true;
        return { read, write };
    };

    const { ChannelSelector } = ca;
    const ChannelSelectorWrapper = ({ mode, channelsDisplayMode }) => {
        const glueController = useGlueController();
        const channelsMode = glueController.io.channels.mode;
        const [variantToggle, setVariantToggle] = i.useState(true);
        const [channelsInfo, setChannelsInfo] = i.useState([]);
        const [type, setType] = i.useState(getInitialType(glueController));
        const handleOnChannelSelect = i.useCallback(async ({ name }) => {
            const channel = channelsInfo.find((ch) => ch.name === name);
            if (channel?.isSelected) {
                const singleModeCb = (ch) => ({ ...ch, isSelected: false, read: false, write: false });
                const multiModeCb = (ch) => ch.name === name ? ({ ...ch, isSelected: false, read: false, write: false }) : ch;
                setChannelsInfo((channels) => channels.map(channelsMode === "single" ? singleModeCb : multiModeCb));
                return glueController.io.channels.leave({ channel: name });
            }
            const { read, write } = await getChannelRestrictions(glueController, name);
            const singleModeCb = (ch) => ch.name === name ? ({ ...ch, isSelected: true, read, write }) : ({ ...ch, isSelected: false, read: false, write: false });
            const multiModeCb = (ch) => ch.name === name ? ({ ...ch, isSelected: true, read, write }) : ch;
            setChannelsInfo((channels) => channels.map(channelsMode === "single" ? singleModeCb : multiModeCb));
            return glueController.io.channels.join(name);
        }, [channelsInfo, glueController, channelsMode]);
        const handleOnChannelRestrict = i.useCallback(async ({ name, read, write }) => {
            if (type === 'single' || typeof glueController.io.channels.restrict !== "function") {
                return;
            }
            if (!read && !write) {
                setChannelsInfo((channels) => channels.map((ch) => ch.name === name ? ({ ...ch, isSelected: false, read: false, write: false }) : ch));
                await glueController.io.channels.restrict({ name, read, write });
                return glueController.io.channels.leave({ channel: name });
            }
            await glueController.io.channels.restrict({ name, read, write });
            const singleModeCb = (ch) => ch.name === name ? { ...ch, isSelected: true, read, write } : { ...ch, isSelected: false, read: false, write: false };
            const multiModeCb = (ch) => ch.name === name ? { ...ch, isSelected: true, read, write } : ch;
            setChannelsInfo((channels) => channels.map(channelsMode === "single" ? singleModeCb : multiModeCb));
        }, [glueController.io.channels, type, channelsMode]);
        const onTypeChange = (checked) => {
            setType(checked ? "directionalSingle" : "single");
        };
        const getChannels = i.useCallback(async () => {
            const allChannels = await glueController.io.channels.list();
            const myChannels = channelsMode === "single" ? [await glueController.io.channels.getMy()] : await glueController.io.channels.getMyChannels();
            const channelsToParse = channelsDisplayMode === "all" ? allChannels : allChannels.filter((ch) => ch.meta?.fdc3);
            const channelsInfo = await Promise.all(channelsToParse.map(async (ch) => {
                const restrictions = typeof glueController.io.channels.getRestrictions === "function" ? await glueController.io.channels.getRestrictions() : { channels: [] };
                const channelRestrictions = restrictions.channels.find((restriction) => restriction.name === ch.name);
                const isSelected = myChannels?.some(myChannel => myChannel?.name === ch.name);
                const read = typeof channelRestrictions?.read === "boolean" ? channelRestrictions.read : true;
                const write = typeof channelRestrictions?.write === "boolean" ? channelRestrictions.write : true;
                return {
                    color: ch.meta.color,
                    name: ch.name,
                    label: ch.name[0],
                    isSelected,
                    read: isSelected ? read : false,
                    write: isSelected ? write : false
                };
            }));
            setChannelsInfo(channelsInfo);
        }, [glueController, channelsDisplayMode, channelsMode]);
        i.useEffect(() => {
            getChannels();
        }, [getChannels]);
        i.useEffect(() => {
            const subscribeForChannelChanged = () => {
                glueController.io.channels.onChanged(async (name) => {
                    if (!name) {
                        return;
                    }
                    const { read, write } = await getChannelRestrictions(glueController, name);
                    if (channelsMode === "multi") {
                        setChannelsInfo((channels) => channels.map((ch) => ch.name === name ? { ...ch, isSelected: true, read, write } : { ...ch, read: false, write: false }));
                        return;
                    }
                    setChannelsInfo((channels) => channels.map((ch) => ch.name === name ? { ...ch, isSelected: true, read, write } : { ...ch, isSelected: false, read: false, write: false }));
                });
            };
            const checkSetVariantToggle = async () => {
                const clientRestrictionsMethodsExist = typeof glueController.io.channels.restrict === "function" && typeof glueController.io.channels.restrictAll === "function" && typeof glueController.io.channels.getRestrictions === "function";
                if (!clientRestrictionsMethodsExist) {
                    setVariantToggle(false);
                    return;
                }
                const platformRestrictionsMethodsExist = await glueController.checkChannelRestrictionsExistInPlatform();
                setVariantToggle(platformRestrictionsMethodsExist);
            };
            const initialSetup = async () => {
                subscribeForChannelChanged();
                await checkSetVariantToggle();
            };
            initialSetup();
        }, [glueController, channelsMode]);
        const getSelectorButtonBackgroundColor = () => {
            const selectedChannels = channelsInfo.filter((channelInfo) => channelInfo.isSelected);
            return selectedChannels[selectedChannels.length - 1]?.color ?? "";
        };
        return (i.createElement($, { onClick: getChannels, variant: "outline" },
            mode === "default" ? (i.createElement($.ButtonIcon, { className: "io-btn-icon", icon: "link", iconSize: "16", size: "32", style: { backgroundColor: getSelectorButtonBackgroundColor() }, variant: "circle" })) : (i.createElement($.Item, { append: i.createElement(C, { variant: "chevron-right", size: "10" }) },
                i.createElement($.Button, { variant: "link", icon: "link", text: "Select Channel", iconRight: false }))),
            i.createElement($.Content, null,
                i.createElement(ChannelSelector, { className: "io-list-channels", variant: type, channels: channelsInfo, onChannelSelect: handleOnChannelSelect, variantToggle: variantToggle, onVariantChange: onTypeChange, onChannelRestrict: handleOnChannelRestrict }))));
    };

    const PositionDropdown = ({ position, positionClickHandler }) => {
        const positions = ["bottom", "left", "right", "top"].map((p) => {
            return (i.createElement($.Item, { key: p, isSelected: p === position, onClick: () => positionClickHandler(p) }, p[0].toUpperCase() + p.slice(1)));
        });
        return (i.createElement($.List, { variant: "single", checkIcon: "check" },
            i.createElement($.ItemSection, null, "Widget Position"),
            positions));
    };

    const ModeDropdown = ({ mode, modeClickHandler }) => {
        return (i.createElement($.List, null,
            i.createElement($.ItemSection, null, "Widget Mode"),
            i.createElement($.Item, null,
                i.createElement(Ri, { label: "Compact", align: "right", checked: mode === "compact", onChange: () => modeClickHandler(mode === "compact" ? "default" : "compact") }))));
    };

    const Settings = ({ position, positionClickHandler, mode, modeClickHandler }) => {
        return (i.createElement($, { align: "up", variant: "outline" },
            i.createElement($.ButtonIcon, { className: "io-btn-icon", icon: "cog", iconSize: "16", size: "32", variant: "circle" }),
            i.createElement($.Content, null,
                i.createElement(PositionDropdown, { position: position, positionClickHandler: positionClickHandler }),
                i.createElement(ModeDropdown, { mode: mode, modeClickHandler: modeClickHandler }))));
    };

    const DefaultWidget = ({ showBringBackToWspBtn, handleBringBackToWspClick, showChannelSelectorBtn, position, positionClickHandler, mode, modeClickHandler, channelsDisplayMode }) => {
        return (i.createElement(V, { align: "left", className: "io-btn-group", variant: "default" },
            showChannelSelectorBtn ? i.createElement(ChannelSelectorWrapper, { mode: mode, channelsDisplayMode: channelsDisplayMode }) : null,
            showBringBackToWspBtn ? (i.createElement(N, { className: "io-btn-icon", icon: "pop-in-widget", iconSize: "16", size: "32", variant: "circle", onClick: handleBringBackToWspClick })) : null,
            i.createElement(Settings, { position: position, positionClickHandler: positionClickHandler, mode: mode, modeClickHandler: modeClickHandler })));
    };

    const CompactWidget = ({ position, positionClickHandler, mode, modeClickHandler, channelsDisplayMode, handleBringBackToWspClick, showBringBackToWspBtn, showChannelSelectorBtn, }) => {
        return (i.createElement($, { variant: "outline" },
            i.createElement($.ButtonIcon, { icon: "logo", className: "io-btn-icon", iconSize: "16", size: "32", variant: "circle" }),
            i.createElement($.Content, null,
                i.createElement($.ItemSection, null, "App"),
                i.createElement($.List, null,
                    showBringBackToWspBtn ? (i.createElement($.Item, { onClick: handleBringBackToWspClick, prepend: i.createElement(C, { variant: "pop-in-widget" }) }, "Pop In")) : null,
                    showChannelSelectorBtn ? i.createElement(ChannelSelectorWrapper, { mode: mode, channelsDisplayMode: channelsDisplayMode }) : null),
                i.createElement(PositionDropdown, { position: position, positionClickHandler: positionClickHandler }),
                i.createElement(ModeDropdown, { mode: mode, modeClickHandler: modeClickHandler }))));
    };

    const useThemeSync = () => {
        const glueController = useGlueController();
        i.useEffect(() => {
            if (glueController.config.rootElement) {
                return;
            }
            let isUnsubscribed = false;
            const themesApi = glueController.io?.themes;
            if (!themesApi) {
                return;
            }
            const changeTheme = async (theme) => {
                if (isUnsubscribed) {
                    return;
                }
                const htmlElement = document.documentElement;
                if (htmlElement.classList.contains(theme.name)) {
                    return;
                }
                const allThemes = await themesApi.list();
                htmlElement.classList.remove(...allThemes.map(({ name }) => name));
                htmlElement.classList.add(theme.name);
            };
            themesApi.onChanged(changeTheme);
            themesApi.getCurrent().then(changeTheme);
            return () => {
                isUnsubscribed = true;
            };
        }, [glueController]);
    };

    const Widget = () => {
        const glueController = useGlueController();
        useThemeSync();
        const [position, setPosition] = i.useState(glueController.config.position ?? "bottom");
        const [mode, setMode] = i.useState(glueController.config.mode ?? "default");
        const [showBringBackToWspBtn, setShowBringBackToWspBtn] = i.useState(false);
        const className = i.useMemo(() => {
            const classNames = [
                "io-window-widget",
                ...(position !== "bottom" ? [`io-window-widget-${position}`] : []),
                ...(mode !== "default" ? [`io-window-widget-${mode}`] : []),
            ];
            return classNames.join(" ");
        }, [position, mode]);
        i.useEffect(() => {
            const checkIsEjectedWindow = async () => {
                const { isEjected, ejectData } = await glueController.checkIsEjected();
                if (!isEjected || !glueController.io.workspaces) {
                    setShowBringBackToWspBtn(isEjected);
                    return;
                }
                const unOnWorkspaceClosed = await glueController.io.workspaces.onWorkspaceClosed((closed) => {
                    if (closed.workspaceId !== ejectData?.workspaceId) {
                        return;
                    }
                    unOnWorkspaceClosed();
                    setShowBringBackToWspBtn(false);
                });
                setShowBringBackToWspBtn(isEjected);
            };
            checkIsEjectedWindow();
        }, [glueController]);
        const handleDragEnd = (e) => drop(e, setPosition);
        const getWidgetProps = () => {
            return {
                showChannelSelectorBtn: glueController.config.channels?.selector?.enable ?? true,
                position,
                positionClickHandler: setPosition,
                mode,
                modeClickHandler: setMode,
                showBringBackToWspBtn,
                handleBringBackToWspClick,
                channelsDisplayMode: glueController.config.channels?.displayMode ?? "all",
            };
        };
        const handleBringBackToWspClick = i.useCallback(async () => {
            try {
                await glueController.bringBackToWsp();
            }
            catch (error) {
                glueController.getLogger(`widget-component-${glueController.windowId}`).error(error);
                await glueController.removeEjectedWindowContext();
                setShowBringBackToWspBtn(false);
            }
        }, [glueController]);
        return (i.createElement("div", { className: className, draggable: "true", onDragEnd: handleDragEnd, role: "button", tabIndex: 0 },
            i.createElement(DragSection, null),
            mode === "default" ? (i.createElement(DefaultWidget, { ...getWidgetProps() })) : (i.createElement(CompactWidget, { ...getWidgetProps() }))));
    };

    class DOMController {
        rootElement;
        glueController;
        constructor(rootElement, glueController) {
            this.rootElement = rootElement;
            this.glueController = glueController;
        }
        async attachWidget() {
            const domNode = document.createElement("div");
            const reactRoot = createRoot(domNode);
            reactRoot.render(i.createElement(CustomGlueControllerProvider, { glueController: this.glueController },
                i.createElement(Widget, null)));
            const rootElement = this.rootElement ?? document.body;
            rootElement.appendChild(domNode);
        }
    }

    class GlueController {
        bridge;
        io;
        config;
        _windowId;
        _logger;
        constructor(bridge, io, config) {
            this.bridge = bridge;
            this.io = io;
            this.config = config;
            this._windowId = io.windows.my().id;
            this._logger = this.io.logger.subLogger(`widget-${this._windowId}`);
        }
        get logger() {
            return this._logger;
        }
        get windowId() {
            return this._windowId;
        }
        getLogger(name) {
            return this.io.logger.subLogger(name);
        }
        async checkShowWidget() {
            const errorMsg = `Current window is in workspace`;
            if (window.iobrowser?.isPlatformFrame) {
                return { show: false, reason: `Current window is a Platform in a Workspaces Frame` };
            }
            if (this.io.workspaces && await this.io.workspaces.inWorkspace()) {
                return { show: false, reason: errorMsg };
            }
            const isWorkspacesLibInitialized = await this.checkWorkspacesLibInitialized();
            if (!isWorkspacesLibInitialized) {
                return { show: true };
            }
            const isWindowInWorkspace = await this.checkWindowInWorkspace();
            return isWindowInWorkspace ? { show: false, reason: errorMsg } : { show: true };
        }
        async checkChannelRestrictionsExistInPlatform() {
            const restrictExist = await this.bridge.checkOperationSupported("restrict", "channels");
            if (!restrictExist.isSupported) {
                return false;
            }
            const getRestrictionsExist = await this.bridge.checkOperationSupported("getRestrictions", "channels");
            if (!getRestrictionsExist.isSupported) {
                return false;
            }
            const restrictAll = await this.bridge.checkOperationSupported("restrictAll", "channels");
            return restrictAll.isSupported;
        }
        async checkIsEjected() {
            const context = await this.io.contexts.get(`___window___${this.windowId}`);
            const frameId = context?.___io___?.ejectedWindow?.frameId;
            const workspaceId = context?.___io___?.ejectedWindow?.workspaceId;
            return frameId && workspaceId
                ? { isEjected: true, ejectData: { frameId, workspaceId } }
                : { isEjected: false };
        }
        async removeEjectedWindowContext() {
            await this.io.contexts.setPath(`___window___${this.windowId}`, "___io___.ejectedWindow", null);
            const appInstance = this.io.appManager.myInstance;
            if (!appInstance) {
                return;
            }
            await this.io.contexts.setPath(`___instance___${this.windowId}`, "___io___.ejectedWindow", null);
        }
        async bringBackToWsp() {
            await this.bridge.send("bringBackToWorkspace", "workspaces", { windowId: this.windowId }, { includeOperationCheck: true });
        }
        async checkWindowInWorkspace() {
            try {
                const res = await this.bridge.send("isWindowInWorkspace", "workspaces", { itemId: this.windowId });
                return res.inWorkspace;
            }
            catch (error) {
                this.logger.trace(typeof error === "string" ? error : JSON.stringify(error));
            }
        }
        async checkWorkspacesLibInitialized() {
            try {
                const res = await this.bridge.send("workspacesInitCheck", "system", {}, { includeOperationCheck: true });
                return res.initialized;
            }
            catch (error) {
                this.logger.trace(typeof error === "string" ? error : JSON.stringify(error));
            }
        }
    }

    class IoC {
        io;
        config;
        _domController;
        _bridge;
        _glueController;
        constructor(io, config) {
            this.io = io;
            this.config = config;
        }
        get domController() {
            if (!this._domController) {
                this._domController = new DOMController(this.config.rootElement, this.glueController);
            }
            return this._domController;
        }
        get bridge() {
            if (!this._bridge) {
                this._bridge = new Bridge(this.io);
            }
            return this._bridge;
        }
        get glueController() {
            if (!this._glueController) {
                this._glueController = new GlueController(this.bridge, this.io, this.config);
            }
            return this._glueController;
        }
    }

    const IOBrowserWidgetFactory = async (io, config) => {
        const validatedConfig = configDecoder.runWithException(config);
        if (!validatedConfig.rootElement) {
            console.warn("[IOBrowserWidget] 'rootElement' was not provided in config. This may indicate you're using an outdated io.CB client. Please consider upgrading to the latest io.CB version.");
        }
        if (validatedConfig.rootElement && !(validatedConfig.rootElement instanceof HTMLDivElement)) {
            throw new Error("'rootElement' must be an instance of HTMLDivElement");
        }
        const ioc = new IoC(io, validatedConfig);
        const baseErrorMessage = `Widget won't be shown. Reason:`;
        const windowId = io.windows.my().id;
        if (!windowId) {
            console.error(`${baseErrorMessage} There's no windowID associated with this client`);
            return;
        }
        const logger = ioc.glueController.getLogger(`widget.factory-${windowId}`);
        if (!validatedConfig.enable) {
            logger.warn(`${baseErrorMessage} It's disabled by config`);
            return;
        }
        const initiateRes = await ioc.bridge.initiate();
        if (!initiateRes.success) {
            logger.error(`${baseErrorMessage} ${initiateRes.reason}`);
            return;
        }
        logger.trace(`Bridge initiated successfully`);
        if (!validatedConfig.displayInWorkspace) {
            const showWidgetRes = await ioc.glueController.checkShowWidget();
            if (!showWidgetRes.show) {
                logger.error(`${baseErrorMessage} ${showWidgetRes.reason}`);
                return;
            }
        }
        logger.trace(`Widget will be attached to DOM`);
        await ioc.domController.attachWidget();
    };

    const eventController = new EventController();
    eventController.wireCustomEventListener();
    eventController.notifyStarted();
    if (typeof window !== "undefined") {
        window.IOBrowserWidget = IOBrowserWidgetFactory;
    }

    return IOBrowserWidgetFactory;

}));
//# sourceMappingURL=io-browser-widget-react.umd.js.map
