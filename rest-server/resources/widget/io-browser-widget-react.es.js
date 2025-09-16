import * as i from 'react';
import i__default, { createContext, memo, useState, useEffect, forwardRef, useCallback, useContext, useMemo, useRef, useLayoutEffect, useImperativeHandle } from 'react';
import * as require$$0 from 'react-dom';
import require$$0__default from 'react-dom';

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

var m$1 = require$$0__default;
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
    return (i__default.createElement("div", { className: "drag-element" },
        i__default.createElement("div", null),
        i__default.createElement("div", null),
        i__default.createElement("div", null),
        i__default.createElement("div", null),
        i__default.createElement("div", null),
        i__default.createElement("div", null),
        i__default.createElement("div", null),
        i__default.createElement("div", null)));
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
var f=i__default,k$1=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
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
    const [io, setIOConnect] = useState(null);
    useEffect(() => {
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

const IOConnectContext = createContext(null);
const IOConnectProvider = memo(({ children, fallback = null, settings = {}, onInitError }) => {
    const glue = useIOConnectInit(settings, onInitError);
    return glue ? (i__default.createElement(IOConnectContext.Provider, { value: glue }, children)) : (i__default.createElement(i__default.Fragment, null, fallback));
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
*/w=b,function(){var e={}.hasOwnProperty;function t(){for(var e="",t=0;t<arguments.length;t++){var o=arguments[t];o&&(e=i(e,n(o)));}return e}function n(n){if("string"==typeof n||"number"==typeof n)return n;if("object"!=typeof n)return "";if(Array.isArray(n))return t.apply(null,n);if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]"))return n.toString();var o="";for(var r in n)e.call(n,r)&&n[r]&&(o=i(o,r));return o}function i(e,t){return t?e?e+" "+t:e+t:e}w.exports?(t.default=t,w.exports=t):window.classNames=t;}();var k=y(b.exports);function C({className:t,size:n="16",variant:i="workspace",...o}){const r=k("icon",n&&[`icon-size-${n}`],t);return jsxRuntimeExports.jsx("span",{className:r,...o,children:jsxRuntimeExports.jsx("i",{className:`icon-${i}`})})}const N=forwardRef((({className:t,variant:n="default",icon:i="workspace",size:o="16",iconSize:a="16",onClick:s,disabled:l,children:c,...u},d)=>{const f=k("io-btn-icon","default"!==n&&[`io-btn-icon-${n}`],[`io-btn-icon-size-${o}`],t),m=useCallback((e=>{if(!l)return s?s(e):void 0;e.preventDefault();}),[s,l]);return jsxRuntimeExports.jsx("button",{className:f,type:"button",ref:d,"aria-label":"button",onClick:m,disabled:l,...u,children:c??(i&&jsxRuntimeExports.jsx(C,{variant:i,size:a}))})}));N.displayName="ButtonIcon";function D({className:t,variant:n="default",children:i,...o}){const r=k("io-badge","default"!==n&&[`io-badge-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:i})}function E({className:t,tag:n="h2",size:i="normal",text:o="Title",...r}){const a=n,s=k("small"===i&&"io-title-semibold","normal"===i&&"io-title","large"===i&&"io-title-large",t);return jsxRuntimeExports.jsx(a,{className:s,...r,children:o})}function I({className:n,title:i,titleSize:o="normal",tag:r,hint:a,children:s,...l}){const c=k("io-block",n);return jsxRuntimeExports.jsxs("div",{className:c,...l,children:[i&&jsxRuntimeExports.jsx(E,{tag:r,text:i,size:o}),s,a&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:a})]})}const M=forwardRef((({className:n,variant:i="default",size:o="normal",icon:a,iconSize:s="12",iconRight:l=false,text:c,onClick:u,disabled:d,children:f,...m},h)=>{const p=k("io-btn",("primary"===i||"critical"===i||"outline"===i||"link"===i)&&[`io-btn-${i}`],"large"===o&&"io-btn-lg",n),g=useCallback((e=>{if(!d)return u?u(e):void 0;e.preventDefault();}),[u,d]);return jsxRuntimeExports.jsxs("button",{className:p,ref:h,type:"button","aria-label":"button",onClick:g,disabled:d,tabIndex:0,...m,children:[a&&!l&&jsxRuntimeExports.jsx(C,{variant:a,size:s}),f??c,a&&l&&jsxRuntimeExports.jsx(C,{variant:a,size:s})]})}));M.displayName="Button";const A=createContext({}),T=forwardRef((({icon:t="chevron-down",onClick:n,...i},o)=>{const{handleToggle:a,disabled:l,setTriggerRef:c}=useContext(A),u=useCallback((e=>{c?.(e),o&&("function"==typeof o?o(e):o.current=e);}),[o,c]),d=useCallback((e=>{e.stopPropagation(),n?.(e),e.defaultPrevented||a?.();}),[n,a]);return jsxRuntimeExports.jsx(M,{icon:t,iconRight:true,onClick:d,disabled:l,ref:u,...i})}));T.displayName="DropdownButton";const P=forwardRef((({size:t="32",onClick:n,...i},o)=>{const{handleToggle:a,disabled:l,setTriggerRef:c}=useContext(A),u=useCallback((e=>{c?.(e),o&&("function"==typeof o?o(e):o.current=e);}),[o,c]),d=useCallback((e=>{e.stopPropagation(),n?.(e),e.defaultPrevented||a?.();}),[n,a]);return jsxRuntimeExports.jsx(N,{size:t,onClick:d,disabled:l,ref:u,...i})}));function O({className:t,...n}){const i=k("io-dropdown-content",t);return jsxRuntimeExports.jsx("div",{className:i,...n})}P.displayName="DropdownButtonIcon";const L=createContext({}),F=forwardRef(((n,i)=>{const{className:o,prepend:r,append:a,isSelected:l,onClick:c,description:u,disabled:d=false,children:f,tooltip:m,onItemSelect:h,...p}=n,{variant:g="default",selected:v,checkIcon:y,handleItemClick:w}=useContext(L),b=l??v?.some((e=>e.children===f)),N="default"!==g&&!!y,S=N||r,x=k("io-list-item",S&&"io-list-item-left",a&&"io-list-item-right","default"!==g&&b&&"selected",u&&"io-list-item-description",d&&"io-list-item-disabled",o);return jsxRuntimeExports.jsxs("li",{className:x,ref:i,role:"menuitem","aria-roledescription":"menuitem",tabIndex:0,onClick:e=>{d?e.preventDefault():(w?.(e,{children:f}),c?.(e),h?.());},...p,children:[S&&jsxRuntimeExports.jsxs("div",{className:"io-list-left-column",children:[N&&jsxRuntimeExports.jsx(C,{variant:y.variant,title:b?y.tooltip:void 0}),r]}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:m,children:f}),a&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:a}),u&&jsxRuntimeExports.jsx("div",{className:"io-list-text-description",children:u})]})}));F.displayName="ListItem";const B=forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-title",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));B.displayName="ListItemTitle";const R=forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-section",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));R.displayName="ListItemSection";const _=forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item-header",n);return jsxRuntimeExports.jsxs("div",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));_.displayName="ListItemHeader";const H=forwardRef((({className:t,children:n,...i},o)=>{const r=k("io-list-item","io-list-with-sub-items",t);return jsxRuntimeExports.jsx("li",{className:r,ref:o,...i,children:n})}));H.displayName="ListItemWithSubItems";const j=forwardRef(((t,n)=>{const{className:i,variant:o="default",checkIcon:a,children:s,...u}=t,[d,f]=useState([]),m=k("io-list","default"!==o&&"io-list-selectable",i),h=useMemo((()=>{if(a)return "object"==typeof a?a:{variant:a}}),[a]),p=useCallback(((e,t)=>{if("default"===o)return;const n=d.some((e=>e.children?.toString()===t.children?.toString()));"single"===o?f([t]):(()=>{const e=n?d.filter((e=>e.children!==t.children)):[...d,t];f(e);})();}),[d,o]),g=useMemo((()=>({variant:o,selected:d,checkIcon:h,handleItemClick:p})),[o,d,h,p]);return jsxRuntimeExports.jsx(L.Provider,{value:g,children:jsxRuntimeExports.jsx("ul",{className:m,ref:n,...u,children:s})})}));j.displayName="List";const z=j;z.Item=F,z.ItemTitle=B,z.ItemSection=R,z.ItemHeader=_,z.ItemWithSubItems=H;const $=forwardRef(((t,n)=>jsxRuntimeExports.jsx(z,{...t,ref:n})));$.displayName="DropdownList";const V=forwardRef(((t,n)=>{const{handleClose:i}=useContext(A),{onClick:o,...r}=t;return jsxRuntimeExports.jsx(F,{...r,ref:n,onClick:e=>{o?.(e),i?.();}})}));V.displayName="DropdownItem";const Y=forwardRef(((t,n)=>jsxRuntimeExports.jsx(B,{...t,ref:n})));Y.displayName="DropdownItemTitle";const U=forwardRef(((t,n)=>jsxRuntimeExports.jsx(R,{...t,ref:n})));function W({className:t,...n}){const i=k("io-separator",t);return jsxRuntimeExports.jsx("hr",{className:i,...n})}U.displayName="DropdownItemSection";const J=forwardRef(((t,n)=>jsxRuntimeExports.jsx(W,{...t})));J.displayName="DropdownSeparator";const K=forwardRef((({className:t,variant:n="outline",align:i="down",disabled:o,isOpen:a,onOpenChange:s,children:f,...m},h)=>{const p=useRef(null),g=useRef(null),v=h??p,{isOpen:y,handleOpen:w,handleClose:b}=((e,t)=>{const[n,i]=useState(false),o=void 0!==e,a=o?e:n,s=useCallback((e=>{o||i(e),t?.(e);}),[o,t]),c=useCallback((()=>s(true)),[s]),u=useCallback((()=>s(false)),[s]);return {isOpen:a,setOpen:s,handleOpen:c,handleClose:u}})(a,s);((e,t,n=true)=>{useEffect((()=>{if(!n)return;const i=n=>{const i=n.target;i&&e.current&&!e.current.contains(i)&&(n.composedPath&&n.composedPath().some((t=>t===e.current||e.current&&t.nodeType===Node.ELEMENT_NODE&&e.current.contains(t)))||t());},o=requestAnimationFrame((()=>{document.addEventListener("mousedown",i,true);}));return ()=>{cancelAnimationFrame(o),document.removeEventListener("mousedown",i,true);}}),[e,t,n]);})(v,b,y);const C=useMemo((()=>({variant:n,align:i,disabled:o,isOpen:y,handleOpen:w,handleClose:b,handleToggle:y?b:w,setTriggerRef:e=>g.current=e})),[n,i,o,y,w,b]),N=k("io-dropdown",y&&"io-dropdown-open","default"!==n&&`io-dropdown-${n}`,t);return jsxRuntimeExports.jsx(A.Provider,{value:C,children:jsxRuntimeExports.jsx("div",{className:N,ref:v,...m,children:f})})}));function G({className:t,variant:n="default",align:i="left",children:o,...r}){const a=k("io-btn-group","sticky"===n&&"io-btn-group-sticky","append"===n&&"io-btn-group-append","fullwidth"===n&&"io-btn-group-fullwidth","right"===i&&"io-btn-group-right",t);return jsxRuntimeExports.jsx("div",{className:a,...r,children:o})}function q({className:t,draggable:n=false,children:i,...o}){const r=k("io-header",n&&["draggable"],t);return jsxRuntimeExports.jsx("header",{className:r,style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--spacing-8)"},...o,children:i})}function Q({className:t,children:n,...i}){const o=k("io-dialog-header",t);return jsxRuntimeExports.jsx(q,{"data-testid":"io-dialog-header",className:o,...i,children:n})}function X({className:t,children:n,...i}){const o=k("io-dialog-body",t);return jsxRuntimeExports.jsx("div",{"data-testid":"io-dialog-body",className:o,...i,children:n})}function Z({className:t,children:n,...i}){const o=k("io-footer",t);return jsxRuntimeExports.jsx("footer",{className:o,...i,children:n})}function ee({className:t,...n}){const i=k("io-dialog-footer",t);return jsxRuntimeExports.jsx(Z,{"data-testid":"io-dialog-footer",className:i,...n})}function ne(){return "undefined"!=typeof window}function ie(e){return ae(e)?(e.nodeName||"").toLowerCase():"#document"}function oe(e){var t;return (null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function re(e){var t;return null==(t=(ae(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function ae(e){return !!ne()&&(e instanceof Node||e instanceof oe(e).Node)}function se(e){return !!ne()&&(e instanceof Element||e instanceof oe(e).Element)}function le(e){return !!ne()&&(e instanceof HTMLElement||e instanceof oe(e).HTMLElement)}function ce(e){return !(!ne()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof oe(e).ShadowRoot)}function ue(e){const{overflow:t,overflowX:n,overflowY:i,display:o}=ge(e);return /auto|scroll|overlay|hidden|clip/.test(t+i+n)&&!["inline","contents"].includes(o)}function de(e){return ["table","td","th"].includes(ie(e))}function fe(e){return [":popover-open",":modal"].some((t=>{try{return e.matches(t)}catch(e){return  false}}))}function me(e){const t=he(),n=se(e)?ge(e):e;return "none"!==n.transform||"none"!==n.perspective||!!n.containerType&&"normal"!==n.containerType||!t&&!!n.backdropFilter&&"none"!==n.backdropFilter||!t&&!!n.filter&&"none"!==n.filter||["transform","perspective","filter"].some((e=>(n.willChange||"").includes(e)))||["paint","layout","strict","content"].some((e=>(n.contain||"").includes(e)))}function he(){return !("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function pe(e){return ["html","body","#document"].includes(ie(e))}function ge(e){return oe(e).getComputedStyle(e)}function ve(e){return se(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function ye(e){if("html"===ie(e))return e;const t=e.assignedSlot||e.parentNode||ce(e)&&e.host||re(e);return ce(t)?t.host:t}function we(e){const t=ye(e);return pe(t)?e.ownerDocument?e.ownerDocument.body:e.body:le(t)&&ue(t)?t:we(t)}function be(e,t,n){var i;void 0===t&&(t=[]),void 0===n&&(n=true);const o=we(e),r=o===(null==(i=e.ownerDocument)?void 0:i.body),a=oe(o);if(r){const e=function(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}(a);return t.concat(a,a.visualViewport||[],ue(o)?o:[],e&&n?be(e):[])}return t.concat(o,be(o,[],n))}function ke(e){let t=e.activeElement;for(;null!=(null==(n=t)||null==(n=n.shadowRoot)?void 0:n.activeElement);){var n;t=t.shadowRoot.activeElement;}return t}function Ce(e,t){if(!e||!t)return  false;const n=null==t.getRootNode?void 0:t.getRootNode();if(e.contains(t))return  true;if(n&&ce(n)){let n=t;for(;n;){if(e===n)return  true;n=n.parentNode||n.host;}}return  false}function Ne(){const e=navigator.userAgentData;return null!=e&&e.platform?e.platform:navigator.platform}function Se(){const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map((e=>{let{brand:t,version:n}=e;return t+"/"+n})).join(" "):navigator.userAgent}function xe(e){return !(0!==e.mozInputSource||!e.isTrusted)||(Ie()&&e.pointerType?"click"===e.type&&1===e.buttons:0===e.detail&&!e.pointerType)}function De(e){return !Se().includes("jsdom/")&&(!Ie()&&0===e.width&&0===e.height||Ie()&&1===e.width&&1===e.height&&0===e.pressure&&0===e.detail&&"mouse"===e.pointerType||e.width<1&&e.height<1&&0===e.pressure&&0===e.detail&&"touch"===e.pointerType)}function Ee(){return /apple/i.test(navigator.vendor)}function Ie(){const e=/android/i;return e.test(Ne())||e.test(Se())}function Me(e,t){const n=["mouse","pen"];return t||n.push("",void 0),n.includes(e)}function Ae(e){return (null==e?void 0:e.ownerDocument)||document}function Te(e,t){if(null==t)return  false;if("composedPath"in e)return e.composedPath().includes(t);const n=e;return null!=n.target&&t.contains(n.target)}function Pe(e){return "composedPath"in e?e.composedPath()[0]:e.target}K.Button=T,K.ButtonIcon=P,K.Content=O,K.List=$,K.Item=V,K.ItemTitle=Y,K.ItemSection=U,K.Separator=J,G.Button=M,G.ButtonIcon=N,G.Dropdown=K,q.Title=E,q.ButtonGroup=G,q.Button=M,q.ButtonIcon=N,q.Dropdown=K,Q.Title=E,Q.ButtonGroup=G,Q.Button=M,Q.ButtonIcon=N,Q.Dropdown=K,X.Content=function({className:t,children:n,...i}){const o=k("io-dialog-content",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})},Z.ButtonGroup=G,Z.Button=M,Z.ButtonIcon=N,Z.Dropdown=K,ee.ButtonGroup=G,ee.Button=M,ee.ButtonIcon=N,ee.Dropdown=K;const Oe="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function Le(e){return le(e)&&e.matches(Oe)}function Fe(e){e.preventDefault(),e.stopPropagation();}function Be(e){return !!e&&("combobox"===e.getAttribute("role")&&Le(e))}const Re=Math.min,_e=Math.max,He=Math.round,je=Math.floor,ze=e=>({x:e,y:e}),$e={left:"right",right:"left",bottom:"top",top:"bottom"},Ve={start:"end",end:"start"};function Ye(e,t,n){return _e(e,Re(t,n))}function Ue(e,t){return "function"==typeof e?e(t):e}function We(e){return e.split("-")[0]}function Je(e){return e.split("-")[1]}function Ke(e){return "x"===e?"y":"x"}function Ge(e){return "y"===e?"height":"width"}function qe(e){return ["top","bottom"].includes(We(e))?"y":"x"}function Qe(e){return Ke(qe(e))}function Xe(e){return e.replace(/start|end/g,(e=>Ve[e]))}function Ze(e){return e.replace(/left|right|bottom|top/g,(e=>$e[e]))}function et(e){const{x:t,y:n,width:i,height:o}=e;return {width:i,height:o,top:n,left:t,right:t+i,bottom:n+o,x:t,y:n}}
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/var tt=["input:not([inert])","select:not([inert])","textarea:not([inert])","a[href]:not([inert])","button:not([inert])","[tabindex]:not(slot):not([inert])","audio[controls]:not([inert])","video[controls]:not([inert])",'[contenteditable]:not([contenteditable="false"]):not([inert])',"details>summary:first-of-type:not([inert])","details:not([inert])"].join(","),nt="undefined"==typeof Element,it=nt?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,ot=!nt&&Element.prototype.getRootNode?function(e){var t;return null==e||null===(t=e.getRootNode)||void 0===t?void 0:t.call(e)}:function(e){return null==e?void 0:e.ownerDocument},rt=function e(t,n){var i;void 0===n&&(n=true);var o=null==t||null===(i=t.getAttribute)||void 0===i?void 0:i.call(t,"inert");return ""===o||"true"===o||n&&t&&e(t.parentNode)},at=function e(t,n,i){for(var o=[],r=Array.from(t);r.length;){var a=r.shift();if(!rt(a,false))if("SLOT"===a.tagName){var s=a.assignedElements(),l=e(s.length?s:a.children,true,i);i.flatten?o.push.apply(o,l):o.push({scopeParent:a,candidates:l});}else {it.call(a,tt)&&i.filter(a)&&(n||!t.includes(a))&&o.push(a);var c=a.shadowRoot||"function"==typeof i.getShadowRoot&&i.getShadowRoot(a),u=!rt(c,false)&&(!i.shadowRootFilter||i.shadowRootFilter(a));if(c&&u){var d=e(true===c?a.children:c.children,true,i);i.flatten?o.push.apply(o,d):o.push({scopeParent:a,candidates:d});}else r.unshift.apply(r,a.children);}}return o},st=function(e){return !isNaN(parseInt(e.getAttribute("tabindex"),10))},lt=function(e){if(!e)throw new Error("No node provided");return e.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||function(e){var t,n=null==e||null===(t=e.getAttribute)||void 0===t?void 0:t.call(e,"contenteditable");return ""===n||"true"===n}(e))&&!st(e)?0:e.tabIndex},ct=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},ut=function(e){return "INPUT"===e.tagName},dt=function(e){return function(e){return ut(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return  true;var t,n=e.form||ot(e),i=function(e){return n.querySelectorAll('input[type="radio"][name="'+e+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=i(window.CSS.escape(e.name));else try{t=i(e.name);}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),false}var o=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form);return !o||o===e}(e)},ft=function(e){var t=e.getBoundingClientRect(),n=t.width,i=t.height;return 0===n&&0===i},mt=function(e,t){var n=t.displayCheck,i=t.getShadowRoot;if("hidden"===getComputedStyle(e).visibility)return  true;var o=it.call(e,"details>summary:first-of-type")?e.parentElement:e;if(it.call(o,"details:not([open]) *"))return  true;if(n&&"full"!==n&&"legacy-full"!==n){if("non-zero-area"===n)return ft(e)}else {if("function"==typeof i){for(var r=e;e;){var a=e.parentElement,s=ot(e);if(a&&!a.shadowRoot&&true===i(a))return ft(e);e=e.assignedSlot?e.assignedSlot:a||s===e.ownerDocument?a:s.host;}e=r;}if(function(e){var t,n,i,o,r=e&&ot(e),a=null===(t=r)||void 0===t?void 0:t.host,s=false;if(r&&r!==e)for(s=!!(null!==(n=a)&&void 0!==n&&null!==(i=n.ownerDocument)&&void 0!==i&&i.contains(a)||null!=e&&null!==(o=e.ownerDocument)&&void 0!==o&&o.contains(e));!s&&a;){var l,c,u;s=!(null===(c=a=null===(l=r=ot(a))||void 0===l?void 0:l.host)||void 0===c||null===(u=c.ownerDocument)||void 0===u||!u.contains(a));}return s}(e))return !e.getClientRects().length;if("legacy-full"!==n)return  true}return  false},ht=function(e,t){return !(t.disabled||rt(t)||function(e){return ut(e)&&"hidden"===e.type}(t)||mt(t,e)||function(e){return "DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some((function(e){return "SUMMARY"===e.tagName}))}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var n=0;n<t.children.length;n++){var i=t.children.item(n);if("LEGEND"===i.tagName)return !!it.call(t,"fieldset[disabled] *")||!i.contains(e)}return  true}t=t.parentElement;}return  false}(t))},pt=function(e,t){return !(dt(t)||lt(t)<0||!ht(e,t))},gt=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return !!(isNaN(t)||t>=0)},vt=function e(t){var n=[],i=[];return t.forEach((function(t,o){var r=!!t.scopeParent,a=r?t.scopeParent:t,s=function(e,t){var n=lt(e);return n<0&&t&&!st(e)?0:n}(a,r),l=r?e(t.candidates):a;0===s?r?n.push.apply(n,l):n.push(a):i.push({documentOrder:o,tabIndex:s,item:t,isScope:r,content:l});})),i.sort(ct).reduce((function(e,t){return t.isScope?e.push.apply(e,t.content):e.push(t.content),e}),[]).concat(n)},yt=function(e,t){var n;return n=(t=t||{}).getShadowRoot?at([e],t.includeContainer,{filter:pt.bind(null,t),flatten:false,getShadowRoot:t.getShadowRoot,shadowRootFilter:gt}):function(e,t,n){if(rt(e))return [];var i=Array.prototype.slice.apply(e.querySelectorAll(tt));return t&&it.call(e,tt)&&i.unshift(e),i.filter(n)}(e,t.includeContainer,pt.bind(null,t)),vt(n)},wt=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return  false!==it.call(e,tt)&&pt(t,e)};function bt(e,t,n){let{reference:i,floating:o}=e;const r=qe(t),a=Qe(t),s=Ge(a),l=We(t),c="y"===r,u=i.x+i.width/2-o.width/2,d=i.y+i.height/2-o.height/2,f=i[s]/2-o[s]/2;let m;switch(l){case "top":m={x:u,y:i.y-o.height};break;case "bottom":m={x:u,y:i.y+i.height};break;case "right":m={x:i.x+i.width,y:d};break;case "left":m={x:i.x-o.width,y:d};break;default:m={x:i.x,y:i.y};}switch(Je(t)){case "start":m[a]-=f*(n&&c?-1:1);break;case "end":m[a]+=f*(n&&c?-1:1);}return m}async function kt(e,t){var n;void 0===t&&(t={});const{x:i,y:o,platform:r,rects:a,elements:s,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:f=false,padding:m=0}=Ue(t,e),h=function(e){return "number"!=typeof e?function(e){return {top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}(m),p=s[f?"floating"===d?"reference":"floating":d],g=et(await r.getClippingRect({element:null==(n=await(null==r.isElement?void 0:r.isElement(p)))||n?p:p.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(s.floating)),boundary:c,rootBoundary:u,strategy:l})),v="floating"===d?{x:i,y:o,width:a.floating.width,height:a.floating.height}:a.reference,y=await(null==r.getOffsetParent?void 0:r.getOffsetParent(s.floating)),w=await(null==r.isElement?void 0:r.isElement(y))&&await(null==r.getScale?void 0:r.getScale(y))||{x:1,y:1},b=et(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:v,offsetParent:y,strategy:l}):v);return {top:(g.top-b.top+h.top)/w.y,bottom:(b.bottom-g.bottom+h.bottom)/w.y,left:(g.left-b.left+h.left)/w.x,right:(b.right-g.right+h.right)/w.x}}function Ct(e){const t=ge(e);let n=parseFloat(t.width)||0,i=parseFloat(t.height)||0;const o=le(e),r=o?e.offsetWidth:n,a=o?e.offsetHeight:i,s=He(n)!==r||He(i)!==a;return s&&(n=r,i=a),{width:n,height:i,$:s}}function Nt(e){return se(e)?e:e.contextElement}function St(e){const t=Nt(e);if(!le(t))return ze(1);const n=t.getBoundingClientRect(),{width:i,height:o,$:r}=Ct(t);let a=(r?He(n.width):n.width)/i,s=(r?He(n.height):n.height)/o;return a&&Number.isFinite(a)||(a=1),s&&Number.isFinite(s)||(s=1),{x:a,y:s}}const xt=ze(0);function Dt(e){const t=oe(e);return he()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:xt}function Et(e,t,n,i){ void 0===t&&(t=false),void 0===n&&(n=false);const o=e.getBoundingClientRect(),r=Nt(e);let a=ze(1);t&&(i?se(i)&&(a=St(i)):a=St(e));const s=function(e,t,n){return void 0===t&&(t=false),!(!n||t&&n!==oe(e))&&t}(r,n,i)?Dt(r):ze(0);let l=(o.left+s.x)/a.x,c=(o.top+s.y)/a.y,u=o.width/a.x,d=o.height/a.y;if(r){const e=oe(r),t=i&&se(i)?oe(i):i;let n=e,o=n.frameElement;for(;o&&i&&t!==n;){const e=St(o),t=o.getBoundingClientRect(),i=ge(o),r=t.left+(o.clientLeft+parseFloat(i.paddingLeft))*e.x,a=t.top+(o.clientTop+parseFloat(i.paddingTop))*e.y;l*=e.x,c*=e.y,u*=e.x,d*=e.y,l+=r,c+=a,n=oe(o),o=n.frameElement;}}return et({width:u,height:d,x:l,y:c})}const It=[":popover-open",":modal"];function Mt(e){return It.some((t=>{try{return e.matches(t)}catch(e){return  false}}))}function At(e){return Et(re(e)).left+ve(e).scrollLeft}function Tt(e,t,n){let i;if("viewport"===t)i=function(e,t){const n=oe(e),i=re(e),o=n.visualViewport;let r=i.clientWidth,a=i.clientHeight,s=0,l=0;if(o){r=o.width,a=o.height;const e=he();(!e||e&&"fixed"===t)&&(s=o.offsetLeft,l=o.offsetTop);}return {width:r,height:a,x:s,y:l}}(e,n);else if("document"===t)i=function(e){const t=re(e),n=ve(e),i=e.ownerDocument.body,o=_e(t.scrollWidth,t.clientWidth,i.scrollWidth,i.clientWidth),r=_e(t.scrollHeight,t.clientHeight,i.scrollHeight,i.clientHeight);let a=-n.scrollLeft+At(e);const s=-n.scrollTop;return "rtl"===ge(i).direction&&(a+=_e(t.clientWidth,i.clientWidth)-o),{width:o,height:r,x:a,y:s}}(re(e));else if(se(t))i=function(e,t){const n=Et(e,true,"fixed"===t),i=n.top+e.clientTop,o=n.left+e.clientLeft,r=le(e)?St(e):ze(1);return {width:e.clientWidth*r.x,height:e.clientHeight*r.y,x:o*r.x,y:i*r.y}}(t,n);else {const n=Dt(e);i={...t,x:t.x-n.x,y:t.y-n.y};}return et(i)}function Pt(e,t){const n=ye(e);return !(n===t||!se(n)||pe(n))&&("fixed"===ge(n).position||Pt(n,t))}function Ot(e,t,n){const i=le(t),o=re(t),r="fixed"===n,a=Et(e,true,r,t);let s={scrollLeft:0,scrollTop:0};const l=ze(0);if(i||!i&&!r)if(("body"!==ie(t)||ue(o))&&(s=ve(t)),i){const e=Et(t,true,r,t);l.x=e.x+t.clientLeft,l.y=e.y+t.clientTop;}else o&&(l.x=At(o));return {x:a.left+s.scrollLeft-l.x,y:a.top+s.scrollTop-l.y,width:a.width,height:a.height}}function Lt(e){return "static"===ge(e).position}function Ft(e,t){return le(e)&&"fixed"!==ge(e).position?t?t(e):e.offsetParent:null}function Bt(e,t){const n=oe(e);if(Mt(e))return n;if(!le(e)){let t=ye(e);for(;t&&!pe(t);){if(se(t)&&!Lt(t))return t;t=ye(t);}return n}let i=Ft(e,t);for(;i&&de(i)&&Lt(i);)i=Ft(i,t);return i&&pe(i)&&Lt(i)&&!me(i)?n:i||function(e){let t=ye(e);for(;le(t)&&!pe(t);){if(me(t))return t;if(fe(t))return null;t=ye(t);}return null}(e)||n}const Rt={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:n,offsetParent:i,strategy:o}=e;const r="fixed"===o,a=re(i),s=!!t&&Mt(t.floating);if(i===a||s&&r)return n;let l={scrollLeft:0,scrollTop:0},c=ze(1);const u=ze(0),d=le(i);if((d||!d&&!r)&&(("body"!==ie(i)||ue(a))&&(l=ve(i)),le(i))){const e=Et(i);c=St(i),u.x=e.x+i.clientLeft,u.y=e.y+i.clientTop;}return {width:n.width*c.x,height:n.height*c.y,x:n.x*c.x-l.scrollLeft*c.x+u.x,y:n.y*c.y-l.scrollTop*c.y+u.y}},getDocumentElement:re,getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:i,strategy:o}=e;const r=[..."clippingAncestors"===n?Mt(t)?[]:function(e,t){const n=t.get(e);if(n)return n;let i=be(e,[],false).filter((e=>se(e)&&"body"!==ie(e))),o=null;const r="fixed"===ge(e).position;let a=r?ye(e):e;for(;se(a)&&!pe(a);){const t=ge(a),n=me(a);n||"fixed"!==t.position||(o=null),(r?!n&&!o:!n&&"static"===t.position&&o&&["absolute","fixed"].includes(o.position)||ue(a)&&!n&&Pt(e,a))?i=i.filter((e=>e!==a)):o=t,a=ye(a);}return t.set(e,i),i}(t,this._c):[].concat(n),i],a=r[0],s=r.reduce(((e,n)=>{const i=Tt(t,n,o);return e.top=_e(i.top,e.top),e.right=Re(i.right,e.right),e.bottom=Re(i.bottom,e.bottom),e.left=_e(i.left,e.left),e}),Tt(t,a,o));return {width:s.right-s.left,height:s.bottom-s.top,x:s.left,y:s.top}},getOffsetParent:Bt,getElementRects:async function(e){const t=this.getOffsetParent||Bt,n=this.getDimensions,i=await n(e.floating);return {reference:Ot(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){const{width:t,height:n}=Ct(e);return {width:t,height:n}},getScale:St,isElement:se,isRTL:function(e){return "rtl"===ge(e).direction}};function _t(e,t,n,i){ void 0===i&&(i={});const{ancestorScroll:o=true,ancestorResize:r=true,elementResize:a="function"==typeof ResizeObserver,layoutShift:s="function"==typeof IntersectionObserver,animationFrame:l=false}=i,c=Nt(e),u=o||r?[...c?be(c):[],...be(t)]:[];u.forEach((e=>{o&&e.addEventListener("scroll",n,{passive:true}),r&&e.addEventListener("resize",n);}));const d=c&&s?function(e,t){let n,i=null;const o=re(e);function r(){var e;clearTimeout(n),null==(e=i)||e.disconnect(),i=null;}return function a(s,l){ void 0===s&&(s=false),void 0===l&&(l=1),r();const{left:c,top:u,width:d,height:f}=e.getBoundingClientRect();if(s||t(),!d||!f)return;const m={rootMargin:-je(u)+"px "+-je(o.clientWidth-(c+d))+"px "+-je(o.clientHeight-(u+f))+"px "+-je(c)+"px",threshold:_e(0,Re(1,l))||1};let h=true;function p(e){const t=e[0].intersectionRatio;if(t!==l){if(!h)return a();t?a(false,t):n=setTimeout((()=>{a(false,1e-7);}),1e3);}h=false;}try{i=new IntersectionObserver(p,{...m,root:o.ownerDocument});}catch(e){i=new IntersectionObserver(p,m);}i.observe(e);}(true),r}(c,n):null;let f,m=-1,h=null;a&&(h=new ResizeObserver((e=>{let[i]=e;i&&i.target===c&&h&&(h.unobserve(t),cancelAnimationFrame(m),m=requestAnimationFrame((()=>{var e;null==(e=h)||e.observe(t);}))),n();})),c&&!l&&h.observe(c),h.observe(t));let p=l?Et(e):null;return l&&function t(){const i=Et(e);!p||i.x===p.x&&i.y===p.y&&i.width===p.width&&i.height===p.height||n();p=i,f=requestAnimationFrame(t);}(),n(),()=>{var e;u.forEach((e=>{o&&e.removeEventListener("scroll",n),r&&e.removeEventListener("resize",n);})),null==d||d(),null==(e=h)||e.disconnect(),h=null,l&&cancelAnimationFrame(f);}}const Ht=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var n,i;const{x:o,y:r,placement:a,middlewareData:s}=t,l=await async function(e,t){const{placement:n,platform:i,elements:o}=e,r=await(null==i.isRTL?void 0:i.isRTL(o.floating)),a=We(n),s=Je(n),l="y"===qe(n),c=["left","top"].includes(a)?-1:1,u=r&&l?-1:1,d=Ue(t,e);let{mainAxis:f,crossAxis:m,alignmentAxis:h}="number"==typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...d};return s&&"number"==typeof h&&(m="end"===s?-1*h:h),l?{x:m*u,y:f*c}:{x:f*c,y:m*u}}(t,e);return a===(null==(n=s.offset)?void 0:n.placement)&&null!=(i=s.arrow)&&i.alignmentOffset?{}:{x:o+l.x,y:r+l.y,data:{...l,placement:a}}}}},jt=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:i,placement:o}=t,{mainAxis:r=true,crossAxis:a=false,limiter:s={fn:e=>{let{x:t,y:n}=e;return {x:t,y:n}}},...l}=Ue(e,t),c={x:n,y:i},u=await kt(t,l),d=qe(We(o)),f=Ke(d);let m=c[f],h=c[d];if(r){const e="y"===f?"bottom":"right";m=Ye(m+u["y"===f?"top":"left"],m,m-u[e]);}if(a){const e="y"===d?"bottom":"right";h=Ye(h+u["y"===d?"top":"left"],h,h-u[e]);}const p=s.fn({...t,[f]:m,[d]:h});return {...p,data:{x:p.x-n,y:p.y-i}}}}},zt=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(t){var n,i;const{placement:o,middlewareData:r,rects:a,initialPlacement:s,platform:l,elements:c}=t,{mainAxis:u=true,crossAxis:d=true,fallbackPlacements:f,fallbackStrategy:m="bestFit",fallbackAxisSideDirection:h="none",flipAlignment:p=true,...g}=Ue(e,t);if(null!=(n=r.arrow)&&n.alignmentOffset)return {};const v=We(o),y=We(s)===s,w=await(null==l.isRTL?void 0:l.isRTL(c.floating)),b=f||(y||!p?[Ze(s)]:function(e){const t=Ze(e);return [Xe(e),t,Xe(t)]}(s));f||"none"===h||b.push(...function(e,t,n,i){const o=Je(e);let r=function(e,t,n){const i=["left","right"],o=["right","left"],r=["top","bottom"],a=["bottom","top"];switch(e){case "top":case "bottom":return n?t?o:i:t?i:o;case "left":case "right":return t?r:a;default:return []}}(We(e),"start"===n,i);return o&&(r=r.map((e=>e+"-"+o)),t&&(r=r.concat(r.map(Xe)))),r}(s,p,h,w));const k=[s,...b],C=await kt(t,g),N=[];let S=(null==(i=r.flip)?void 0:i.overflows)||[];if(u&&N.push(C[v]),d){const e=function(e,t,n){ void 0===n&&(n=false);const i=Je(e),o=Qe(e),r=Ge(o);let a="x"===o?i===(n?"end":"start")?"right":"left":"start"===i?"bottom":"top";return t.reference[r]>t.floating[r]&&(a=Ze(a)),[a,Ze(a)]}(o,a,w);N.push(C[e[0]],C[e[1]]);}if(S=[...S,{placement:o,overflows:N}],!N.every((e=>e<=0))){var x,D;const e=((null==(x=r.flip)?void 0:x.index)||0)+1,t=k[e];if(t)return {data:{index:e,overflows:S},reset:{placement:t}};let n=null==(D=S.filter((e=>e.overflows[0]<=0)).sort(((e,t)=>e.overflows[1]-t.overflows[1]))[0])?void 0:D.placement;if(!n)switch(m){case "bestFit":{var E;const e=null==(E=S.map((e=>[e.placement,e.overflows.filter((e=>e>0)).reduce(((e,t)=>e+t),0)])).sort(((e,t)=>e[1]-t[1]))[0])?void 0:E[0];e&&(n=e);break}case "initialPlacement":n=s;}if(o!==n)return {reset:{placement:n}}}return {}}}},$t=(e,t,n)=>{const i=new Map,o={platform:Rt,...n},r={...o.platform,_c:i};return (async(e,t,n)=>{const{placement:i="bottom",strategy:o="absolute",middleware:r=[],platform:a}=n,s=r.filter(Boolean),l=await(null==a.isRTL?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:o}),{x:u,y:d}=bt(c,i,l),f=i,m={},h=0;for(let n=0;n<s.length;n++){const{name:r,fn:p}=s[n],{x:g,y:v,data:y,reset:w}=await p({x:u,y:d,initialPlacement:i,placement:f,strategy:o,middlewareData:m,rects:c,platform:a,elements:{reference:e,floating:t}});u=null!=g?g:u,d=null!=v?v:d,m={...m,[r]:{...m[r],...y}},w&&h<=50&&(h++,"object"==typeof w&&(w.placement&&(f=w.placement),w.rects&&(c=true===w.rects?await a.getElementRects({reference:e,floating:t,strategy:o}):w.rects),({x:u,y:d}=bt(c,f,l))),n=-1);}return {x:u,y:d,placement:f,strategy:o,middlewareData:m}})(e,t,{...o,platform:r})};var Vt="undefined"!=typeof document?useLayoutEffect:useEffect;function Yt(e,t){if(e===t)return  true;if(typeof e!=typeof t)return  false;if("function"==typeof e&&e.toString()===t.toString())return  true;let n,i,o;if(e&&t&&"object"==typeof e){if(Array.isArray(e)){if(n=e.length,n!==t.length)return  false;for(i=n;0!=i--;)if(!Yt(e[i],t[i]))return  false;return  true}if(o=Object.keys(e),n=o.length,n!==Object.keys(t).length)return  false;for(i=n;0!=i--;)if(!{}.hasOwnProperty.call(t,o[i]))return  false;for(i=n;0!=i--;){const n=o[i];if(("_owner"!==n||!e.$$typeof)&&!Yt(e[n],t[n]))return  false}return  true}return e!=e&&t!=t}function Ut(e){if("undefined"==typeof window)return 1;return (e.ownerDocument.defaultView||window).devicePixelRatio||1}function Wt(e,t){const n=Ut(e);return Math.round(t*n)/n}function Jt(e){const t=i.useRef(e);return Vt((()=>{t.current=e;})),t}const Kt=(e,t)=>({...jt(e),options:[e,t]}),Gt=(e,t)=>({...zt(e),options:[e,t]});function qt(e){return i.useMemo((()=>e.every((e=>null==e))?null:t=>{e.forEach((e=>{"function"==typeof e?e(t):null!=e&&(e.current=t);}));}),e)}const Qt={...i},Xt=Qt.useInsertionEffect||(e=>e());function Zt(e){const t=i.useRef((()=>{}));return Xt((()=>{t.current=e;})),i.useCallback((function(){for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];return null==t.current?void 0:t.current(...n)}),[])}const en="ArrowUp",tn="ArrowDown",nn="ArrowLeft",on="ArrowRight";function rn(e,t,n){return Math.floor(e/t)!==n}function an(e,t){return t<0||t>=e.current.length}function sn(e,t){return cn(e,{disabledIndices:t})}function ln(e,t){return cn(e,{decrement:true,startingIndex:e.current.length,disabledIndices:t})}function cn(e,t){let{startingIndex:n=-1,decrement:i=false,disabledIndices:o,amount:r=1}=void 0===t?{}:t;const a=e.current;let s=n;do{s+=i?-r:r;}while(s>=0&&s<=a.length-1&&fn(a,s,o));return s}function un(e,t,n,i,o){if(-1===e)return  -1;const r=n.indexOf(e),a=t[e];switch(o){case "tl":return r;case "tr":return a?r+a.width-1:r;case "bl":return a?r+(a.height-1)*i:r;case "br":return n.lastIndexOf(e)}}function dn(e,t){return t.flatMap(((t,n)=>e.includes(t)?[n]:[]))}function fn(e,t,n){if(n)return n.includes(t);const i=e[t];return null==i||i.hasAttribute("disabled")||"true"===i.getAttribute("aria-disabled")}var mn="undefined"!=typeof document?useLayoutEffect:useEffect;function hn(e,t){const n=e.compareDocumentPosition(t);return n&Node.DOCUMENT_POSITION_FOLLOWING||n&Node.DOCUMENT_POSITION_CONTAINED_BY?-1:n&Node.DOCUMENT_POSITION_PRECEDING||n&Node.DOCUMENT_POSITION_CONTAINS?1:0}const pn=i.createContext({register:()=>{},unregister:()=>{},map:new Map,elementsRef:{current:[]}});function gn(e){const{children:t,elementsRef:n,labelsRef:o}=e,[r,a]=i.useState((()=>new Map)),s=i.useCallback((e=>{a((t=>new Map(t).set(e,null)));}),[]),l=i.useCallback((e=>{a((t=>{const n=new Map(t);return n.delete(e),n}));}),[]);return mn((()=>{const e=new Map(r);Array.from(e.keys()).sort(hn).forEach(((t,n)=>{e.set(t,n);})),function(e,t){if(e.size!==t.size)return  false;for(const[n,i]of e.entries())if(i!==t.get(n))return  false;return  true}(r,e)||a(e);}),[r]),i.createElement(pn.Provider,{value:i.useMemo((()=>({register:s,unregister:l,map:r,elementsRef:n,labelsRef:o})),[s,l,r,n,o])},t)}function vn(e){ void 0===e&&(e={});const{label:t}=e,{register:n,unregister:o,map:r,elementsRef:a,labelsRef:s}=i.useContext(pn),[l,c]=i.useState(null),u=i.useRef(null),d=i.useCallback((e=>{if(u.current=e,null!==l&&(a.current[l]=e,s)){var n;const i=void 0!==t;s.current[l]=i?t:null!=(n=null==e?void 0:e.textContent)?n:null;}}),[l,a,s,t]);return mn((()=>{const e=u.current;if(e)return n(e),()=>{o(e);}}),[n,o]),mn((()=>{const e=u.current?r.get(u.current):null;null!=e&&c(e);}),[r]),i.useMemo((()=>({ref:d,index:null==l?-1:l})),[l,d])}function yn(){return yn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i]);}return e},yn.apply(this,arguments)}let wn=false,bn=0;const kn=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+bn++;const Cn=Qt.useId||function(){const[e,t]=i.useState((()=>wn?kn():void 0));return mn((()=>{null==e&&t(kn());}),[]),i.useEffect((()=>{wn=true;}),[]),e};function xn(){const e=new Map;return {emit(t,n){var i;null==(i=e.get(t))||i.forEach((e=>e(n)));},on(t,n){e.set(t,[...e.get(t)||[],n]);},off(t,n){var i;e.set(t,(null==(i=e.get(t))?void 0:i.filter((e=>e!==n)))||[]);}}}const Dn=i.createContext(null),En=i.createContext(null),In=()=>{var e;return (null==(e=i.useContext(Dn))?void 0:e.id)||null},Mn=()=>i.useContext(En);function An(e){const{children:t,id:n}=e,o=In();return i.createElement(Dn.Provider,{value:i.useMemo((()=>({id:n,parentId:o})),[n,o])},t)}function Tn(e){const{children:t}=e,n=i.useRef([]),o=i.useCallback((e=>{n.current=[...n.current,e];}),[]),r=i.useCallback((e=>{n.current=n.current.filter((t=>t!==e));}),[]),a=i.useState((()=>xn()))[0];return i.createElement(En.Provider,{value:i.useMemo((()=>({nodesRef:n,addNode:o,removeNode:r,events:a})),[o,r,a])},t)}function Pn(e){return "data-floating-ui-"+e}function On(e){const t=useRef(e);return mn((()=>{t.current=e;})),t}const Ln=Pn("safe-polygon");function Fn(e,t,n){return n&&!Me(n)?0:"number"==typeof e?e:null==e?void 0:e[t]}let Bn=0;function Rn(e,t){ void 0===t&&(t={});const{preventScroll:n=false,cancelPrevious:i=true,sync:o=false}=t;i&&cancelAnimationFrame(Bn);const r=()=>null==e?void 0:e.focus({preventScroll:n});o?r():Bn=requestAnimationFrame(r);}function _n(e,t){let n=e.filter((e=>{var n;return e.parentId===t&&(null==(n=e.context)?void 0:n.open)})),i=n;for(;i.length;)i=e.filter((e=>{var t;return null==(t=i)?void 0:t.some((t=>{var n;return e.parentId===t.id&&(null==(n=e.context)?void 0:n.open)}))})),n=n.concat(i);return n}let Hn=new WeakMap,jn=new WeakSet,zn={},$n=0;const Vn=e=>e&&(e.host||Vn(e.parentNode)),Yn=(e,t)=>t.map((t=>{if(e.contains(t))return t;const n=Vn(t);return e.contains(n)?n:null})).filter((e=>null!=e));function Un(e,t,n){ void 0===t&&(t=false),void 0===n&&(n=false);const i=Ae(e[0]).body;return function(e,t,n,i){const o="data-floating-ui-inert",r=i?"inert":n?"aria-hidden":null,a=Yn(t,e),s=new Set,l=new Set(a),c=[];zn[o]||(zn[o]=new WeakMap);const u=zn[o];return a.forEach((function e(t){t&&!s.has(t)&&(s.add(t),t.parentNode&&e(t.parentNode));})),function e(t){t&&!l.has(t)&&[].forEach.call(t.children,(t=>{if("script"!==ie(t))if(s.has(t))e(t);else {const e=r?t.getAttribute(r):null,n=null!==e&&"false"!==e,i=(Hn.get(t)||0)+1,a=(u.get(t)||0)+1;Hn.set(t,i),u.set(t,a),c.push(t),1===i&&n&&jn.add(t),1===a&&t.setAttribute(o,""),!n&&r&&t.setAttribute(r,"true");}}));}(t),s.clear(),$n++,()=>{c.forEach((e=>{const t=(Hn.get(e)||0)-1,n=(u.get(e)||0)-1;Hn.set(e,t),u.set(e,n),t||(!jn.has(e)&&r&&e.removeAttribute(r),jn.delete(e)),n||e.removeAttribute(o);})),$n--,$n||(Hn=new WeakMap,Hn=new WeakMap,jn=new WeakSet,zn={});}}(e.concat(Array.from(i.querySelectorAll("[aria-live]"))),i,t,n)}const Wn=()=>({getShadowRoot:true,displayCheck:"function"==typeof ResizeObserver&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function Jn(e,t){const n=yt(e,Wn());"prev"===t&&n.reverse();const i=n.indexOf(ke(Ae(e)));return n.slice(i+1)[0]}function Kn(e,t){const n=t||e.currentTarget,i=e.relatedTarget;return !i||!Ce(n,i)}const Gn={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0};function qn(e){"Tab"===e.key&&(e.target,clearTimeout(undefined));}const Qn=i.forwardRef((function(e,t){const[n,o]=i.useState();mn((()=>(Ee()&&o("button"),document.addEventListener("keydown",qn),()=>{document.removeEventListener("keydown",qn);})),[]);const r={ref:t,tabIndex:0,role:n,"aria-hidden":!n||void 0,[Pn("focus-guard")]:"",style:Gn};return i.createElement("span",yn({},e,r))})),Xn=i.createContext(null),Zn="data-floating-ui-focusable";function ei(e){return e?e.hasAttribute(Zn)?e:e.querySelector("["+Zn+"]")||e:null}const ti=20;let ni=[];function ii(e){ni=ni.filter((e=>e.isConnected));let t=e;if(t&&"body"!==ie(t)){if(!wt(t,Wn())){const e=yt(t,Wn())[0];e&&(t=e);}ni.push(t),ni.length>ti&&(ni=ni.slice(-20));}}function oi(){return ni.slice().reverse().find((e=>e.isConnected))}const ri=i.forwardRef((function(e,t){return i.createElement("button",yn({},e,{type:"button",ref:t,tabIndex:-1,style:Gn}))}));function ai(e){const{context:t,children:n,disabled:o=false,order:r=["content"],guards:a=true,initialFocus:s=0,returnFocus:l=true,restoreFocus:c=false,modal:u=true,visuallyHiddenDismiss:d=false,closeOnFocusOut:f=true}=e,{open:m,refs:h,nodeId:p,onOpenChange:g,events:v,dataRef:y,floatingId:w,elements:{domReference:b,floating:k}}=t,C="number"==typeof s&&s<0,N=Be(b)&&C,S="undefined"==typeof HTMLElement||!("inert"in HTMLElement.prototype)||a,x=On(r),D=On(s),E=On(l),I=Mn(),M=i.useContext(Xn),A=i.useRef(null),T=i.useRef(null),P=i.useRef(false),O=i.useRef(false),L=i.useRef(-1),F=null!=M,B=ei(k),R=Zt((function(e){return void 0===e&&(e=B),e?yt(e,Wn()):[]})),_=Zt((e=>{const t=R(e);return x.current.map((e=>b&&"reference"===e?b:B&&"floating"===e?B:t)).filter(Boolean).flat()}));function H(e){return !o&&d&&u?i.createElement(ri,{ref:"start"===e?A:T,onClick:e=>g(false,e.nativeEvent)},"string"==typeof d?d:"Dismiss"):null}i.useEffect((()=>{if(o)return;if(!u)return;function e(e){if("Tab"===e.key){Ce(B,ke(Ae(B)))&&0===R().length&&!N&&Fe(e);const t=_(),n=Pe(e);"reference"===x.current[0]&&n===b&&(Fe(e),e.shiftKey?Rn(t[t.length-1]):Rn(t[1])),"floating"===x.current[1]&&n===B&&e.shiftKey&&(Fe(e),Rn(t[0]));}}const t=Ae(B);return t.addEventListener("keydown",e),()=>{t.removeEventListener("keydown",e);}}),[o,b,B,u,x,N,R,_]),i.useEffect((()=>{if(!o&&k)return k.addEventListener("focusin",e),()=>{k.removeEventListener("focusin",e);};function e(e){const t=Pe(e),n=R().indexOf(t);-1!==n&&(L.current=n);}}),[o,k,R]),i.useEffect((()=>{if(!o&&f)return k&&le(b)?(b.addEventListener("focusout",t),b.addEventListener("pointerdown",e),k.addEventListener("focusout",t),()=>{b.removeEventListener("focusout",t),b.removeEventListener("pointerdown",e),k.removeEventListener("focusout",t);}):void 0;function e(){O.current=true,setTimeout((()=>{O.current=false;}));}function t(e){const t=e.relatedTarget;queueMicrotask((()=>{const n=!(Ce(b,t)||Ce(k,t)||Ce(t,k)||Ce(null==M?void 0:M.portalNode,t)||null!=t&&t.hasAttribute(Pn("focus-guard"))||I&&(_n(I.nodesRef.current,p).find((e=>{var n,i;return Ce(null==(n=e.context)?void 0:n.elements.floating,t)||Ce(null==(i=e.context)?void 0:i.elements.domReference,t)}))||function(e,t){var n;let i=[],o=null==(n=e.find((e=>e.id===t)))?void 0:n.parentId;for(;o;){const t=e.find((e=>e.id===o));o=null==t?void 0:t.parentId,t&&(i=i.concat(t));}return i}(I.nodesRef.current,p).find((e=>{var n,i;return (null==(n=e.context)?void 0:n.elements.floating)===t||(null==(i=e.context)?void 0:i.elements.domReference)===t}))));if(c&&n&&ke(Ae(B))===Ae(B).body){le(B)&&B.focus();const e=L.current,t=R(),n=t[e]||t[t.length-1]||B;le(n)&&n.focus();}!N&&u||!t||!n||O.current||t===oi()||(P.current=true,g(false,e,"focus-out"));}));}}),[o,b,k,B,u,p,I,M,g,f,c,R,N]),i.useEffect((()=>{var e;if(o)return;const t=Array.from((null==M||null==(e=M.portalNode)?void 0:e.querySelectorAll("["+Pn("portal")+"]"))||[]);if(k){const e=[k,...t,A.current,T.current,x.current.includes("reference")||N?b:null].filter((e=>null!=e)),n=u||N?Un(e,S,!S):Un(e);return ()=>{n();}}}),[o,b,k,u,x,M,N,S]),mn((()=>{if(o||!le(B))return;const e=ke(Ae(B));queueMicrotask((()=>{const t=_(B),n=D.current,i=("number"==typeof n?t[n]:n.current)||B,o=Ce(B,e);C||o||!m||Rn(i,{preventScroll:i===B});}));}),[o,m,B,C,_,D]),mn((()=>{if(o||!B)return;let e=false;const t=Ae(B),n=ke(t);let i=y.current.openEvent;function r(t){let{open:n,reason:o,event:r,nested:a}=t;n&&(i=r),"escape-key"===o&&h.domReference.current&&ii(h.domReference.current),"hover"===o&&"mouseleave"===r.type&&(P.current=true),"outside-press"===o&&(a?(P.current=false,e=true):P.current=!(xe(r)||De(r)));}ii(n),v.on("openchange",r);const a=t.createElement("span");return a.setAttribute("tabindex","-1"),a.setAttribute("aria-hidden","true"),Object.assign(a.style,Gn),F&&b&&b.insertAdjacentElement("afterend",a),()=>{v.off("openchange",r);const n=ke(t),o=Ce(k,n)||I&&_n(I.nodesRef.current,p).some((e=>{var t;return Ce(null==(t=e.context)?void 0:t.elements.floating,n)}));(o||i&&["click","mousedown"].includes(i.type))&&h.domReference.current&&ii(h.domReference.current);const s="boolean"==typeof E.current?oi()||a:E.current.current||a;queueMicrotask((()=>{E.current&&!P.current&&le(s)&&(s===n||n===t.body||o)&&s.focus({preventScroll:e}),a.remove();}));}}),[o,k,B,E,y,h,v,I,p,F,b]),i.useEffect((()=>{queueMicrotask((()=>{P.current=false;}));}),[o]),mn((()=>{if(!o&&M)return M.setFocusManagerState({modal:u,closeOnFocusOut:f,open:m,onOpenChange:g,refs:h}),()=>{M.setFocusManagerState(null);}}),[o,M,u,m,g,h,f]),mn((()=>{if(o)return;if(!B)return;if("function"!=typeof MutationObserver)return;if(C)return;const e=()=>{const e=B.getAttribute("tabindex"),t=R(),n=ke(Ae(k)),i=t.indexOf(n);-1!==i&&(L.current=i),x.current.includes("floating")||n!==h.domReference.current&&0===t.length?"0"!==e&&B.setAttribute("tabindex","0"):"-1"!==e&&B.setAttribute("tabindex","-1");};e();const t=new MutationObserver(e);return t.observe(B,{childList:true,subtree:true,attributes:true}),()=>{t.disconnect();}}),[o,k,B,h,x,R,C]);const j=!o&&S&&(!u||!N)&&(F||u);return i.createElement(i.Fragment,null,j&&i.createElement(Qn,{"data-type":"inside",ref:null==M?void 0:M.beforeInsideRef,onFocus:e=>{if(u){const e=_();Rn("reference"===r[0]?e[0]:e[e.length-1]);}else if(null!=M&&M.preserveTabOrder&&M.portalNode)if(P.current=false,Kn(e,M.portalNode)){const e=Jn(document.body,"next")||b;null==e||e.focus();}else {var t;null==(t=M.beforeOutsideRef.current)||t.focus();}}}),!N&&H("start"),n,H("end"),j&&i.createElement(Qn,{"data-type":"inside",ref:null==M?void 0:M.afterInsideRef,onFocus:e=>{if(u)Rn(_()[0]);else if(null!=M&&M.preserveTabOrder&&M.portalNode)if(f&&(P.current=true),Kn(e,M.portalNode)){const e=Jn(document.body,"prev")||b;null==e||e.focus();}else {var t;null==(t=M.afterOutsideRef.current)||t.focus();}}}))}function si(e){return le(e.target)&&"BUTTON"===e.target.tagName}function li(e){return Le(e)}const ci={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},ui={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},di=e=>{var t,n;return {escapeKey:"boolean"==typeof e?e:null!=(t=null==e?void 0:e.escapeKey)&&t,outsidePress:"boolean"==typeof e?e:null==(n=null==e?void 0:e.outsidePress)||n}};function fi(e){const{open:t=false,onOpenChange:n,elements:o}=e,r=Cn(),a=i.useRef({}),[s]=i.useState((()=>xn())),l=null!=In();const[c,u]=i.useState(o.reference),d=Zt(((e,t,i)=>{a.current.openEvent=e?t:void 0,s.emit("openchange",{open:e,event:t,reason:i,nested:l}),null==n||n(e,t,i);})),f=i.useMemo((()=>({setPositionReference:u})),[]),m=i.useMemo((()=>({reference:c||o.reference||null,floating:o.floating||null,domReference:o.reference})),[c,o.reference,o.floating]);return i.useMemo((()=>({dataRef:a,open:t,onOpenChange:d,elements:m,events:s,floatingId:r,refs:f})),[t,d,m,s,r,f])}function mi(e){ void 0===e&&(e={});const{nodeId:t}=e,n=fi({...e,elements:{reference:null,floating:null,...e.elements}}),o=e.rootContext||n,r=o.elements,[a,s]=i.useState(null),[l,c]=i.useState(null),u=(null==r?void 0:r.domReference)||a,d=i.useRef(null),f=Mn();mn((()=>{u&&(d.current=u);}),[u]);const m=function(e){ void 0===e&&(e={});const{placement:t="bottom",strategy:n="absolute",middleware:o=[],platform:r,elements:{reference:a,floating:s}={},transform:l=true,whileElementsMounted:c,open:u}=e,[d,f]=i.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:false}),[m,h]=i.useState(o);Yt(m,o)||h(o);const[g,v]=i.useState(null),[y,w]=i.useState(null),b=i.useCallback((e=>{e!==S.current&&(S.current=e,v(e));}),[]),k=i.useCallback((e=>{e!==x.current&&(x.current=e,w(e));}),[]),C=a||g,N=s||y,S=i.useRef(null),x=i.useRef(null),D=i.useRef(d),E=null!=c,I=Jt(c),M=Jt(r),A=Jt(u),T=i.useCallback((()=>{if(!S.current||!x.current)return;const e={placement:t,strategy:n,middleware:m};M.current&&(e.platform=M.current),$t(S.current,x.current,e).then((e=>{const t={...e,isPositioned:false!==A.current};P.current&&!Yt(D.current,t)&&(D.current=t,require$$0.flushSync((()=>{f(t);})));}));}),[m,t,n,M,A]);Vt((()=>{ false===u&&D.current.isPositioned&&(D.current.isPositioned=false,f((e=>({...e,isPositioned:false}))));}),[u]);const P=i.useRef(false);Vt((()=>(P.current=true,()=>{P.current=false;})),[]),Vt((()=>{if(C&&(S.current=C),N&&(x.current=N),C&&N){if(I.current)return I.current(C,N,T);T();}}),[C,N,T,I,E]);const O=i.useMemo((()=>({reference:S,floating:x,setReference:b,setFloating:k})),[b,k]),L=i.useMemo((()=>({reference:C,floating:N})),[C,N]),F=i.useMemo((()=>{const e={position:n,left:0,top:0};if(!L.floating)return e;const t=Wt(L.floating,d.x),i=Wt(L.floating,d.y);return l?{...e,transform:"translate("+t+"px, "+i+"px)",...Ut(L.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:t,top:i}}),[n,l,L.floating,d.x,d.y]);return i.useMemo((()=>({...d,update:T,refs:O,elements:L,floatingStyles:F})),[d,T,O,L,F])}({...e,elements:{...r,...l&&{reference:l}}}),h=i.useCallback((e=>{const t=se(e)?{getBoundingClientRect:()=>e.getBoundingClientRect(),contextElement:e}:e;c(t),m.refs.setReference(t);}),[m.refs]),g=i.useCallback((e=>{(se(e)||null===e)&&(d.current=e,s(e)),(se(m.refs.reference.current)||null===m.refs.reference.current||null!==e&&!se(e))&&m.refs.setReference(e);}),[m.refs]),v=i.useMemo((()=>({...m.refs,setReference:g,setPositionReference:h,domReference:d})),[m.refs,g,h]),y=i.useMemo((()=>({...m.elements,domReference:u})),[m.elements,u]),w=i.useMemo((()=>({...m,...o,refs:v,elements:y,nodeId:t})),[m,v,y,t,o]);return mn((()=>{o.dataRef.current.floatingContext=w;const e=null==f?void 0:f.nodesRef.current.find((e=>e.id===t));e&&(e.context=w);})),i.useMemo((()=>({...m,context:w,refs:v,elements:y})),[m,v,y,w])}const hi="active",pi="selected";function gi(e,t,n){const i=new Map,o="item"===n;let r=e;if(o&&e){const{[hi]:t,[pi]:n,...i}=e;r=i;}return {..."floating"===n&&{tabIndex:-1,[Zn]:""},...r,...t.map((t=>{const i=t?t[n]:null;return "function"==typeof i?e?i(e):null:i})).concat(e).reduce(((e,t)=>t?(Object.entries(t).forEach((t=>{let[n,r]=t;var a;o&&[hi,pi].includes(n)||(0===n.indexOf("on")?(i.has(n)||i.set(n,[]),"function"==typeof r&&(null==(a=i.get(n))||a.push(r),e[n]=function(){for(var e,t=arguments.length,o=new Array(t),r=0;r<t;r++)o[r]=arguments[r];return null==(e=i.get(n))?void 0:e.map((e=>e(...o))).find((e=>void 0!==e))})):e[n]=r);})),e):e),{})}}let vi=false;function yi(e,t,n){switch(e){case "vertical":return t;case "horizontal":return n;default:return t||n}}function wi(e,t){return yi(t,e===en||e===tn,e===nn||e===on)}function bi(e,t,n){return yi(t,e===tn,n?e===nn:e===on)||"Enter"===e||" "===e||""===e}function ki(e,t,n){return yi(t,n?e===on:e===nn,e===en)}function Ci(e,t){const{open:n,onOpenChange:o,elements:r}=e,{listRef:a,activeIndex:s,onNavigate:l=(()=>{}),enabled:c=true,selectedIndex:u=null,allowEscape:d=false,loop:f=false,nested:m=false,rtl:h=false,virtual:p=false,focusItemOnOpen:g="auto",focusItemOnHover:v=true,openOnArrowKeyDown:y=true,disabledIndices:w,orientation:b="vertical",cols:k=1,scrollItemIntoView:C=true,virtualItemRef:N,itemSizes:S,dense:x=false}=t;const D=On(ei(r.floating)),E=In(),I=Mn(),M=Zt(l),A=Be(r.domReference),T=i.useRef(g),P=i.useRef(null!=u?u:-1),O=i.useRef(null),L=i.useRef(true),F=i.useRef(M),B=i.useRef(!!r.floating),R=i.useRef(n),_=i.useRef(false),H=i.useRef(false),j=On(w),z=On(n),$=On(C),V=On(u),[Y,U]=i.useState(),[W,J]=i.useState(),K=Zt((function(e,t,n){function i(e){p?(U(e.id),null==I||I.events.emit("virtualfocus",e),N&&(N.current=e)):Rn(e,{preventScroll:true,sync:!(!Ne().toLowerCase().startsWith("mac")||navigator.maxTouchPoints||!Ee())&&(vi||_.current)});} void 0===n&&(n=false);const o=e.current[t.current];o&&i(o),requestAnimationFrame((()=>{const r=e.current[t.current]||o;if(!r)return;o||i(r);const a=$.current;a&&q&&(n||!L.current)&&(null==r.scrollIntoView||r.scrollIntoView("boolean"==typeof a?{block:"nearest",inline:"nearest"}:a));}));}));mn((()=>{document.createElement("div").focus({get preventScroll(){return vi=true,false}});}),[]),mn((()=>{c&&(n&&r.floating?T.current&&null!=u&&(H.current=true,P.current=u,M(u)):B.current&&(P.current=-1,F.current(null)));}),[c,n,r.floating,u,M]),mn((()=>{if(c&&n&&r.floating)if(null==s){if(_.current=false,null!=V.current)return;if(B.current&&(P.current=-1,K(a,P)),(!R.current||!B.current)&&T.current&&(null!=O.current||true===T.current&&null==O.current)){let e=0;const t=()=>{if(null==a.current[0]){if(e<2){(e?requestAnimationFrame:queueMicrotask)(t);}e++;}else P.current=null==O.current||bi(O.current,b,h)||m?sn(a,j.current):ln(a,j.current),O.current=null,M(P.current);};t();}}else an(a,s)||(P.current=s,K(a,P,H.current),H.current=false);}),[c,n,r.floating,s,V,m,a,b,h,M,K,j]),mn((()=>{var e;if(!c||r.floating||!I||p||!B.current)return;const t=I.nodesRef.current,n=null==(e=t.find((e=>e.id===E)))||null==(e=e.context)?void 0:e.elements.floating,i=ke(Ae(r.floating)),o=t.some((e=>e.context&&Ce(e.context.elements.floating,i)));n&&!o&&L.current&&n.focus({preventScroll:true});}),[c,r.floating,I,E,p]),mn((()=>{if(c&&I&&p&&!E)return I.events.on("virtualfocus",e),()=>{I.events.off("virtualfocus",e);};function e(e){J(e.id),N&&(N.current=e);}}),[c,I,p,E,N]),mn((()=>{F.current=M,B.current=!!r.floating;})),mn((()=>{n||(O.current=null);}),[n]),mn((()=>{R.current=n;}),[n]);const G=null!=s,q=i.useMemo((()=>{function e(e){if(!n)return;const t=a.current.indexOf(e);-1!==t&&M(t);}return {onFocus(t){let{currentTarget:n}=t;e(n);},onClick:e=>{let{currentTarget:t}=e;return t.focus({preventScroll:true})},...v&&{onMouseMove(t){let{currentTarget:n}=t;e(n);},onPointerLeave(e){let{pointerType:t}=e;L.current&&"touch"!==t&&(P.current=-1,K(a,P),M(null),p||Rn(D.current,{preventScroll:true}));}}}}),[n,D,K,v,a,M,p]),Q=Zt((e=>{if(L.current=false,_.current=true,229===e.which)return;if(!z.current&&e.currentTarget===D.current)return;if(m&&ki(e.key,b,h))return Fe(e),o(false,e.nativeEvent,"list-navigation"),void(le(r.domReference)&&(p?null==I||I.events.emit("virtualfocus",r.domReference):r.domReference.focus()));const t=P.current,i=sn(a,w),s=ln(a,w);if(A||("Home"===e.key&&(Fe(e),P.current=i,M(P.current)),"End"===e.key&&(Fe(e),P.current=s,M(P.current))),k>1){const t=S||Array.from({length:a.current.length},(()=>({width:1,height:1}))),n=function(e,t,n){const i=[];let o=0;return e.forEach(((e,r)=>{let{width:a,height:s}=e;let l=false;for(n&&(o=0);!l;){const e=[];for(let n=0;n<a;n++)for(let i=0;i<s;i++)e.push(o+n+i*t);o%t+a<=t&&e.every((e=>null==i[e]))?(e.forEach((e=>{i[e]=r;})),l=true):o++;}})),[...i]}(t,k,x),o=n.findIndex((e=>null!=e&&!fn(a.current,e,w))),r=n.reduce(((e,t,n)=>null==t||fn(a.current,t,w)?e:n),-1),l=n[function(e,t){let{event:n,orientation:i,loop:o,rtl:r,cols:a,disabledIndices:s,minIndex:l,maxIndex:c,prevIndex:u,stopEvent:d=false}=t,f=u;if(n.key===en){if(d&&Fe(n),-1===u)f=c;else if(f=cn(e,{startingIndex:f,amount:a,decrement:true,disabledIndices:s}),o&&(u-a<l||f<0)){const e=u%a,t=c%a,n=c-(t-e);f=t===e?c:t>e?n:n-a;}an(e,f)&&(f=u);}if(n.key===tn&&(d&&Fe(n),-1===u?f=l:(f=cn(e,{startingIndex:u,amount:a,disabledIndices:s}),o&&u+a>c&&(f=cn(e,{startingIndex:u%a-a,amount:a,disabledIndices:s}))),an(e,f)&&(f=u)),"both"===i){const t=je(u/a);n.key===(r?nn:on)&&(d&&Fe(n),u%a!=a-1?(f=cn(e,{startingIndex:u,disabledIndices:s}),o&&rn(f,a,t)&&(f=cn(e,{startingIndex:u-u%a-1,disabledIndices:s}))):o&&(f=cn(e,{startingIndex:u-u%a-1,disabledIndices:s})),rn(f,a,t)&&(f=u)),n.key===(r?on:nn)&&(d&&Fe(n),u%a!=0?(f=cn(e,{startingIndex:u,decrement:true,disabledIndices:s}),o&&rn(f,a,t)&&(f=cn(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s}))):o&&(f=cn(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s})),rn(f,a,t)&&(f=u));const i=je(c/a)===t;an(e,f)&&(f=o&&i?n.key===(r?on:nn)?c:cn(e,{startingIndex:u-u%a-1,disabledIndices:s}):u);}return f}({current:n.map((e=>null!=e?a.current[e]:null))},{event:e,orientation:b,loop:f,rtl:h,cols:k,disabledIndices:dn([...w||a.current.map(((e,t)=>fn(a.current,t)?t:void 0)),void 0],n),minIndex:o,maxIndex:r,prevIndex:un(P.current>s?i:P.current,t,n,k,e.key===tn?"bl":e.key===(h?nn:on)?"tr":"tl"),stopEvent:true})];if(null!=l&&(P.current=l,M(P.current)),"both"===b)return}if(wi(e.key,b)){if(Fe(e),n&&!p&&ke(e.currentTarget.ownerDocument)===e.currentTarget)return P.current=bi(e.key,b,h)?i:s,void M(P.current);bi(e.key,b,h)?P.current=f?t>=s?d&&t!==a.current.length?-1:i:cn(a,{startingIndex:t,disabledIndices:w}):Math.min(s,cn(a,{startingIndex:t,disabledIndices:w})):P.current=f?t<=i?d&&-1!==t?a.current.length:s:cn(a,{startingIndex:t,decrement:true,disabledIndices:w}):Math.max(i,cn(a,{startingIndex:t,decrement:true,disabledIndices:w})),an(a,P.current)?M(null):M(P.current);}})),X=i.useMemo((()=>p&&n&&G&&{"aria-activedescendant":W||Y}),[p,n,G,W,Y]),Z=i.useMemo((()=>({"aria-orientation":"both"===b?void 0:b,...!Be(r.domReference)&&X,onKeyDown:Q,onPointerMove(){L.current=true;}})),[X,Q,r.domReference,b]),ee=i.useMemo((()=>{function e(e){"auto"===g&&xe(e.nativeEvent)&&(T.current=true);}return {...X,onKeyDown(e){L.current=false;const t=e.key.startsWith("Arrow"),i=["Home","End"].includes(e.key),r=t||i,s=function(e,t,n){return yi(t,n?e===nn:e===on,e===tn)}(e.key,b,h),l=ki(e.key,b,h),c=wi(e.key,b),d=(m?s:c)||"Enter"===e.key||""===e.key.trim();if(p&&n){const t=null==I?void 0:I.nodesRef.current.find((e=>null==e.parentId)),n=I&&t?function(e,t){let n,i=-1;return function t(o,r){r>i&&(n=o,i=r),_n(e,o).forEach((e=>{t(e.id,r+1);}));}(t,0),e.find((e=>e.id===n))}(I.nodesRef.current,t.id):null;if(r&&n&&N){const t=new KeyboardEvent("keydown",{key:e.key,bubbles:true});if(s||l){var f,g;const i=(null==(f=n.context)?void 0:f.elements.domReference)===e.currentTarget,o=l&&!i?null==(g=n.context)?void 0:g.elements.domReference:s?a.current.find((e=>(null==e?void 0:e.id)===Y)):null;o&&(Fe(e),o.dispatchEvent(t),J(void 0));}var v;if((c||i)&&n.context)if(n.context.open&&n.parentId&&e.currentTarget!==n.context.elements.domReference)return Fe(e),void(null==(v=n.context.elements.domReference)||v.dispatchEvent(t))}return Q(e)}(n||y||!t)&&(d&&(O.current=m&&c?null:e.key),m?s&&(Fe(e),n?(P.current=sn(a,j.current),M(P.current)):o(true,e.nativeEvent,"list-navigation")):c&&(null!=u&&(P.current=u),Fe(e),!n&&y?o(true,e.nativeEvent,"list-navigation"):Q(e),n&&M(P.current)));},onFocus(){n&&!p&&M(null);},onPointerDown:function(e){T.current=g,"auto"===g&&De(e.nativeEvent)&&(T.current=true);},onMouseDown:e,onClick:e}}),[Y,X,Q,j,g,a,m,M,o,n,y,b,h,u,I,p,N]);return i.useMemo((()=>c?{reference:ee,floating:Z,item:q}:{}),[c,ee,Z,q])}const Ni=new Map([["select","listbox"],["combobox","listbox"],["label",false]]);function Si(e,t){const[n,i]=e;let o=false;const r=t.length;for(let e=0,a=r-1;e<r;a=e++){const[r,s]=t[e]||[0,0],[l,c]=t[a]||[0,0];s>=i!=c>=i&&n<=(l-r)*(i-s)/(c-s)+r&&(o=!o);}return o}function xi(e){ void 0===e&&(e={});const{buffer:t=.5,blockPointerEvents:n=false,requireIntent:i=true}=e;let o,r=false,a=null,s=null,l=performance.now();const c=e=>{let{x:n,y:c,placement:u,elements:d,onClose:f,nodeId:m,tree:h}=e;return function(e){function p(){clearTimeout(o),f();}if(clearTimeout(o),!d.domReference||!d.floating||null==u||null==n||null==c)return;const{clientX:g,clientY:v}=e,y=[g,v],w=Pe(e),b="mouseleave"===e.type,k=Ce(d.floating,w),C=Ce(d.domReference,w),N=d.domReference.getBoundingClientRect(),S=d.floating.getBoundingClientRect(),x=u.split("-")[0],D=n>S.right-S.width/2,E=c>S.bottom-S.height/2,I=function(e,t){return e[0]>=t.x&&e[0]<=t.x+t.width&&e[1]>=t.y&&e[1]<=t.y+t.height}(y,N),M=S.width>N.width,A=S.height>N.height,T=(M?N:S).left,P=(M?N:S).right,O=(A?N:S).top,L=(A?N:S).bottom;if(k&&(r=true,!b))return;if(C&&(r=false),C&&!b)return void(r=true);if(b&&se(e.relatedTarget)&&Ce(d.floating,e.relatedTarget))return;if(h&&_n(h.nodesRef.current,m).some((e=>{let{context:t}=e;return null==t?void 0:t.open})))return;if("top"===x&&c>=N.bottom-1||"bottom"===x&&c<=N.top+1||"left"===x&&n>=N.right-1||"right"===x&&n<=N.left+1)return p();let F=[];switch(x){case "top":F=[[T,N.top+1],[T,S.bottom-1],[P,S.bottom-1],[P,N.top+1]];break;case "bottom":F=[[T,S.top+1],[T,N.bottom-1],[P,N.bottom-1],[P,S.top+1]];break;case "left":F=[[S.right-1,L],[S.right-1,O],[N.left+1,O],[N.left+1,L]];break;case "right":F=[[N.right-1,L],[N.right-1,O],[S.left+1,O],[S.left+1,L]];}if(!Si([g,v],F)){if(r&&!I)return p();if(!b&&i){const t=function(e,t){const n=performance.now(),i=n-l;if(null===a||null===s||0===i)return a=e,s=t,l=n,null;const o=e-a,r=t-s,c=Math.sqrt(o*o+r*r);return a=e,s=t,l=n,c/i}(e.clientX,e.clientY);if(null!==t&&t<.1)return p()}Si([g,v],function(e){let[n,i]=e;switch(x){case "top":return [[M?n+t/2:D?n+4*t:n-4*t,i+t+1],[M?n-t/2:D?n+4*t:n-4*t,i+t+1],...[[S.left,D||M?S.bottom-t:S.top],[S.right,D?M?S.bottom-t:S.top:S.bottom-t]]];case "bottom":return [[M?n+t/2:D?n+4*t:n-4*t,i-t],[M?n-t/2:D?n+4*t:n-4*t,i-t],...[[S.left,D||M?S.top+t:S.bottom],[S.right,D?M?S.top+t:S.bottom:S.top+t]]];case "left":{const e=[n+t+1,A?i+t/2:E?i+4*t:i-4*t],o=[n+t+1,A?i-t/2:E?i+4*t:i-4*t];return [...[[E||A?S.right-t:S.left,S.top],[E?A?S.right-t:S.left:S.right-t,S.bottom]],e,o]}case "right":return [[n-t,A?i+t/2:E?i+4*t:i-4*t],[n-t,A?i-t/2:E?i+4*t:i-4*t],...[[E||A?S.left+t:S.right,S.top],[E?A?S.left+t:S.right:S.left+t,S.bottom]]]}}([n,c]))?!r&&i&&(o=window.setTimeout(p,40)):p();}}};return c.__options={blockPointerEvents:n},c}const Di=createContext({getItemProps:()=>({}),activeIndex:null,setActiveIndex:()=>{},setHasFocusInside:()=>{},isOpen:false,setIsOpen:()=>{}}),Ei=forwardRef((({className:t,disabled:n,children:i,...o},r)=>{const a=useContext(Di),l=vn(),c=Mn(),u=l.index===a.activeIndex,d=k("io-dropdown-menu-item",n&&"io-dropdown-menu-item-disabled",t);return jsxRuntimeExports.jsx("div",{ref:qt([l.ref,r]),role:"menuitem",className:d,tabIndex:u?0:-1,...o,...a.getItemProps({onClick(e){o.onClick?.(e),a.setIsOpen(false),c?.events.emit("click");},onFocus(e){o.onFocus?.(e),a.setHasFocusInside(true);}}),children:i})}));Ei.displayName="DropdownMenuItem";const Ii=forwardRef((({className:n,variant:o="default",icon:r,iconRight:a,text:f="",disabled:m,children:h,...p},g)=>{const[v,y]=useState(false),[w,b]=useState(false),[C,N]=useState(null),S=useRef([]),x=useRef([]),D=useContext(Di),E=Mn(),I=function(e){const t=Cn(),n=Mn(),i=In();return mn((()=>{const e={id:t,parentId:i};return null==n||n.addNode(e),()=>{null==n||n.removeNode(e);}}),[n,t,i]),t}(),A=In(),T=vn(),P=null!=A,{floatingStyles:O,refs:L,context:F}=mi({nodeId:I,open:v,onOpenChange:y,placement:P?"right-start":"bottom-start",middleware:[(B={mainAxis:P?0:4,alignmentAxis:P?-4:0},{...Ht(B),options:[B,R]}),Gt(),Kt()],whileElementsMounted:_t});var B,R;const _=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,events:a,elements:s}=e,{enabled:l=true,delay:c=0,handleClose:u=null,mouseOnly:d=false,restMs:f=0,move:m=true}=t,h=Mn(),p=In(),g=On(u),v=On(c),y=On(n),w=i.useRef(),b=i.useRef(-1),k=i.useRef(),C=i.useRef(-1),N=i.useRef(true),S=i.useRef(false),x=i.useRef((()=>{})),D=i.useRef(false),E=i.useCallback((()=>{var e;const t=null==(e=r.current.openEvent)?void 0:e.type;return (null==t?void 0:t.includes("mouse"))&&"mousedown"!==t}),[r]);i.useEffect((()=>{if(l)return a.on("openchange",e),()=>{a.off("openchange",e);};function e(e){let{open:t}=e;t||(clearTimeout(b.current),clearTimeout(C.current),N.current=true,D.current=false);}}),[l,a]),i.useEffect((()=>{if(!l)return;if(!g.current)return;if(!n)return;function e(e){E()&&o(false,e,"hover");}const t=Ae(s.floating).documentElement;return t.addEventListener("mouseleave",e),()=>{t.removeEventListener("mouseleave",e);}}),[s.floating,n,o,l,g,E]);const I=i.useCallback((function(e,t,n){ void 0===t&&(t=true),void 0===n&&(n="hover");const i=Fn(v.current,"close",w.current);i&&!k.current?(clearTimeout(b.current),b.current=window.setTimeout((()=>o(false,e,n)),i)):t&&(clearTimeout(b.current),o(false,e,n));}),[v,o]),M=Zt((()=>{x.current(),k.current=void 0;})),A=Zt((()=>{if(S.current){const e=Ae(s.floating).body;e.style.pointerEvents="",e.removeAttribute(Ln),S.current=false;}})),T=Zt((()=>!!r.current.openEvent&&["click","mousedown"].includes(r.current.openEvent.type)));i.useEffect((()=>{if(l&&se(s.domReference)){var e;const o=s.domReference;return n&&o.addEventListener("mouseleave",a),null==(e=s.floating)||e.addEventListener("mouseleave",a),m&&o.addEventListener("mousemove",t,{once:true}),o.addEventListener("mouseenter",t),o.addEventListener("mouseleave",i),()=>{var e;n&&o.removeEventListener("mouseleave",a),null==(e=s.floating)||e.removeEventListener("mouseleave",a),m&&o.removeEventListener("mousemove",t),o.removeEventListener("mouseenter",t),o.removeEventListener("mouseleave",i);}}function t(e){if(clearTimeout(b.current),N.current=false,d&&!Me(w.current)||f>0&&!Fn(v.current,"open"))return;const t=Fn(v.current,"open",w.current);t?b.current=window.setTimeout((()=>{y.current||o(true,e,"hover");}),t):n||o(true,e,"hover");}function i(e){if(T())return;x.current();const t=Ae(s.floating);if(clearTimeout(C.current),D.current=false,g.current&&r.current.floatingContext){n||clearTimeout(b.current),k.current=g.current({...r.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){A(),M(),T()||I(e,true,"safe-polygon");}});const i=k.current;return t.addEventListener("mousemove",i),void(x.current=()=>{t.removeEventListener("mousemove",i);})}("touch"!==w.current||!Ce(s.floating,e.relatedTarget))&&I(e);}function a(e){T()||r.current.floatingContext&&(null==g.current||g.current({...r.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){A(),M(),T()||I(e);}})(e));}}),[s,l,e,d,f,m,I,M,A,o,n,y,h,v,g,r,T]),mn((()=>{var e;if(l&&n&&null!=(e=g.current)&&e.__options.blockPointerEvents&&E()){S.current=true;const e=s.floating;if(se(s.domReference)&&e){var t;const n=Ae(s.floating).body;n.setAttribute(Ln,"");const i=s.domReference,o=null==h||null==(t=h.nodesRef.current.find((e=>e.id===p)))||null==(t=t.context)?void 0:t.elements.floating;return o&&(o.style.pointerEvents=""),n.style.pointerEvents="none",i.style.pointerEvents="auto",e.style.pointerEvents="auto",()=>{n.style.pointerEvents="",i.style.pointerEvents="",e.style.pointerEvents="";}}}}),[l,n,p,s,h,g,E]),mn((()=>{n||(w.current=void 0,D.current=false,M(),A());}),[n,M,A]),i.useEffect((()=>()=>{M(),clearTimeout(b.current),clearTimeout(C.current),A();}),[l,s.domReference,M,A]);const P=i.useMemo((()=>{function e(e){w.current=e.pointerType;}return {onPointerDown:e,onPointerEnter:e,onMouseMove(e){const{nativeEvent:t}=e;function i(){N.current||y.current||o(true,t,"hover");}d&&!Me(w.current)||n||0===f||D.current&&e.movementX**2+e.movementY**2<2||(clearTimeout(C.current),"touch"===w.current?i():(D.current=true,C.current=window.setTimeout(i,f)));}}}),[d,o,n,y,f]),O=i.useMemo((()=>({onMouseEnter(){clearTimeout(b.current);},onMouseLeave(e){T()||I(e.nativeEvent,false);}})),[I,T]);return i.useMemo((()=>l?{reference:P,floating:O}:{}),[l,P,O])}(F,{enabled:P,delay:{open:75},handleClose:xi({blockPointerEvents:true})}),H=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,elements:{domReference:a}}=e,{enabled:s=true,event:l="click",toggle:c=true,ignoreMouse:u=false,keyboardHandlers:d=true,stickIfOpen:f=true}=t,m=i.useRef(),h=i.useRef(false),p=i.useMemo((()=>({onPointerDown(e){m.current=e.pointerType;},onMouseDown(e){const t=m.current;0===e.button&&"click"!==l&&(Me(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"mousedown"!==r.current.openEvent.type?(e.preventDefault(),o(true,e.nativeEvent,"click")):o(false,e.nativeEvent,"click")));},onClick(e){const t=m.current;"mousedown"===l&&m.current?m.current=void 0:Me(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"click"!==r.current.openEvent.type?o(true,e.nativeEvent,"click"):o(false,e.nativeEvent,"click"));},onKeyDown(e){m.current=void 0,e.defaultPrevented||!d||si(e)||(" "!==e.key||li(a)||(e.preventDefault(),h.current=true),"Enter"===e.key&&o(!n||!c,e.nativeEvent,"click"));},onKeyUp(e){e.defaultPrevented||!d||si(e)||li(a)||" "===e.key&&h.current&&(h.current=false,o(!n||!c,e.nativeEvent,"click"));}})),[r,a,l,u,d,o,n,f,c]);return i.useMemo((()=>s?{reference:p}:{}),[s,p])}(F,{event:"mousedown",toggle:!P,ignoreMouse:P}),j=function(e,t){var n;void 0===t&&(t={});const{open:o,floatingId:r}=e,{enabled:a=true,role:s="dialog"}=t,l=null!=(n=Ni.get(s))?n:s,c=Cn(),u=null!=In(),d=i.useMemo((()=>"tooltip"===l||"label"===s?{["aria-"+("label"===s?"labelledby":"describedby")]:o?r:void 0}:{"aria-expanded":o?"true":"false","aria-haspopup":"alertdialog"===l?"dialog":l,"aria-controls":o?r:void 0,..."listbox"===l&&{role:"combobox"},..."menu"===l&&{id:c},..."menu"===l&&u&&{role:"menuitem"},..."select"===s&&{"aria-autocomplete":"none"},..."combobox"===s&&{"aria-autocomplete":"list"}}),[l,r,u,o,c,s]),f=i.useMemo((()=>{const e={id:r,...l&&{role:l}};return "tooltip"===l||"label"===s?e:{...e,..."menu"===l&&{"aria-labelledby":c}}}),[l,r,c,s]),m=i.useCallback((e=>{let{active:t,selected:n}=e;const i={role:"option",...t&&{id:r+"-option"}};switch(s){case "select":return {...i,"aria-selected":t&&n};case "combobox":return {...i,...t&&{"aria-selected":true}}}return {}}),[r,s]);return i.useMemo((()=>a?{reference:d,floating:f,item:m}:{}),[a,d,f,m])}(F,{role:"menu"}),z=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,elements:r,dataRef:a}=e,{enabled:s=true,escapeKey:l=true,outsidePress:c=true,outsidePressEvent:u="pointerdown",referencePress:d=false,referencePressEvent:f="pointerdown",ancestorScroll:m=false,bubbles:h,capture:p}=t,g=Mn(),v=Zt("function"==typeof c?c:()=>false),y="function"==typeof c?v:c,w=i.useRef(false),b=i.useRef(false),{escapeKey:k,outsidePress:C}=di(h),{escapeKey:N,outsidePress:S}=di(p),x=i.useRef(false),D=Zt((e=>{var t;if(!n||!s||!l||"Escape"!==e.key)return;if(x.current)return;const i=null==(t=a.current.floatingContext)?void 0:t.nodeId,r=g?_n(g.nodesRef.current,i):[];if(!k&&(e.stopPropagation(),r.length>0)){let e=true;if(r.forEach((t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__escapeKeyBubbles||(e=false);})),!e)return}o(false,function(e){return "nativeEvent"in e}(e)?e.nativeEvent:e,"escape-key");})),E=Zt((e=>{var t;const n=()=>{var t;D(e),null==(t=Pe(e))||t.removeEventListener("keydown",n);};null==(t=Pe(e))||t.addEventListener("keydown",n);})),I=Zt((e=>{var t;const n=w.current;w.current=false;const i=b.current;if(b.current=false,"click"===u&&i)return;if(n)return;if("function"==typeof y&&!y(e))return;const s=Pe(e),l="["+Pn("inert")+"]",c=Ae(r.floating).querySelectorAll(l);let d=se(s)?s:null;for(;d&&!pe(d);){const e=ye(d);if(pe(e)||!se(e))break;d=e;}if(c.length&&se(s)&&!s.matches("html,body")&&!Ce(s,r.floating)&&Array.from(c).every((e=>!Ce(d,e))))return;if(le(s)&&T){const t=s.clientWidth>0&&s.scrollWidth>s.clientWidth,n=s.clientHeight>0&&s.scrollHeight>s.clientHeight;let i=n&&e.offsetX>s.clientWidth;if(n&&"rtl"===ge(s).direction&&(i=e.offsetX<=s.offsetWidth-s.clientWidth),i||t&&e.offsetY>s.clientHeight)return}const f=null==(t=a.current.floatingContext)?void 0:t.nodeId,m=g&&_n(g.nodesRef.current,f).some((t=>{var n;return Te(e,null==(n=t.context)?void 0:n.elements.floating)}));if(Te(e,r.floating)||Te(e,r.domReference)||m)return;const h=g?_n(g.nodesRef.current,f):[];if(h.length>0){let e=true;if(h.forEach((t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__outsidePressBubbles||(e=false);})),!e)return}o(false,e,"outside-press");})),M=Zt((e=>{var t;const n=()=>{var t;I(e),null==(t=Pe(e))||t.removeEventListener(u,n);};null==(t=Pe(e))||t.addEventListener(u,n);}));i.useEffect((()=>{if(!n||!s)return;a.current.__escapeKeyBubbles=k,a.current.__outsidePressBubbles=C;let e=-1;function t(e){o(false,e,"ancestor-scroll");}function i(){window.clearTimeout(e),x.current=true;}function c(){e=window.setTimeout((()=>{x.current=false;}),he()?5:0);}const d=Ae(r.floating);l&&(d.addEventListener("keydown",N?E:D,N),d.addEventListener("compositionstart",i),d.addEventListener("compositionend",c)),y&&d.addEventListener(u,S?M:I,S);let f=[];return m&&(se(r.domReference)&&(f=be(r.domReference)),se(r.floating)&&(f=f.concat(be(r.floating))),!se(r.reference)&&r.reference&&r.reference.contextElement&&(f=f.concat(be(r.reference.contextElement)))),f=f.filter((e=>{var t;return e!==(null==(t=d.defaultView)?void 0:t.visualViewport)})),f.forEach((e=>{e.addEventListener("scroll",t,{passive:true});})),()=>{l&&(d.removeEventListener("keydown",N?E:D,N),d.removeEventListener("compositionstart",i),d.removeEventListener("compositionend",c)),y&&d.removeEventListener(u,S?M:I,S),f.forEach((e=>{e.removeEventListener("scroll",t);})),window.clearTimeout(e);}}),[a,r,l,y,u,n,o,m,s,k,C,D,N,E,I,S,M]),i.useEffect((()=>{w.current=false;}),[y,u]);const A=i.useMemo((()=>({onKeyDown:D,[ci[f]]:e=>{d&&o(false,e.nativeEvent,"reference-press");}})),[D,o,d,f]),T=i.useMemo((()=>({onKeyDown:D,onMouseDown(){b.current=true;},onMouseUp(){b.current=true;},[ui[u]]:()=>{w.current=true;}})),[D,u]);return i.useMemo((()=>s?{reference:A,floating:T}:{}),[s,A,T])}(F,{bubbles:true}),$=Ci(F,{listRef:S,activeIndex:C,nested:P,onNavigate:N}),{getReferenceProps:V,getFloatingProps:Y,getItemProps:U}=function(e){ void 0===e&&(e=[]);const t=e.map((e=>null==e?void 0:e.reference)),n=e.map((e=>null==e?void 0:e.floating)),o=e.map((e=>null==e?void 0:e.item)),r=i.useCallback((t=>gi(t,e,"reference")),t),a=i.useCallback((t=>gi(t,e,"floating")),n),s=i.useCallback((t=>gi(t,e,"item")),o);return i.useMemo((()=>({getReferenceProps:r,getFloatingProps:a,getItemProps:s})),[r,a,s])}([_,H,j,z,$]);useEffect((()=>{if(E)return E.events.on("click",e),E.events.on("menuopen",t),()=>{E.events.off("click",e),E.events.off("menuopen",t);};function e(){y(false);}function t(e){e.nodeId!==I&&e.parentId===A&&y(false);}}),[E,I,A]),useEffect((()=>{v&&E&&E.events.emit("menuopen",{parentId:A,nodeId:I});}),[E,v,I,A]);const W={activeIndex:C,setActiveIndex:N,getItemProps:U,setHasFocusInside:b,isOpen:v,setIsOpen:y},J=useMemo((()=>W),[C,N,U,b,v]),K=k("io-dropdown-menu-button",P&&"io-dropdown-menu-item",v&&!P&&"active",n),G=qt([L.setReference,T.ref,g]),q=D.activeIndex===T.index?0:-1;return jsxRuntimeExports.jsxs(An,{id:I,children:[jsxRuntimeExports.jsx(M,{className:K,ref:G,variant:P?"link":o,tabIndex:P?q:void 0,role:P?"menuitem":void 0,"data-open":v?"":void 0,"data-nested":P?"":void 0,"data-focus-inside":w?"":void 0,text:f,icon:P?"chevron-right":r,iconSize:"10",iconRight:!!P||a,disabled:m,...V(D.getItemProps({onFocus(e){p.onFocus?.(e),b(false),D.setHasFocusInside(true);},...p}))}),jsxRuntimeExports.jsx(Di.Provider,{value:J,children:jsxRuntimeExports.jsx(gn,{elementsRef:S,labelsRef:x,children:v&&jsxRuntimeExports.jsx(ai,{context:F,modal:false,initialFocus:P?-1:0,returnFocus:!P,children:jsxRuntimeExports.jsx("div",{ref:L.setFloating,className:"io-dropdown-menu",style:O,...Y(),children:h})})})})]})}));Ii.displayName="DropdownMenu";const Mi=forwardRef((({...t},n)=>null===In()?jsxRuntimeExports.jsx(Tn,{children:jsxRuntimeExports.jsx(Ii,{ref:n,...t})}):jsxRuntimeExports.jsx(Ii,{ref:n,...t})));function Ti({className:n,size:i="large",variant:o="default",align:r="up",text:a,...s}){const l=k("io-loader",{[`io-loader-${o}`]:"default"!==o},"normal"===i&&"io-loader-md","small"===i&&"io-loader-sm",r&&[`direction-${r}`],n);return jsxRuntimeExports.jsxs("div",{className:l,...s,children:[jsxRuntimeExports.jsx("div",{className:"io-loader-icon"}),a&&jsxRuntimeExports.jsx("div",{className:"io-loader-text",children:a})]})}function Pi({className:t,children:n,...i}){const o=k("io-panel-header",t);return jsxRuntimeExports.jsx(q,{className:o,...i,children:n})}Mi.displayName="DropdownMenu",Mi.Item=Ei,Mi.Separator=W,Pi.Title=E,Pi.ButtonGroup=G,Pi.Button=M,Pi.ButtonIcon=N,Pi.Dropdown=K;const Oi=forwardRef((({className:t,children:n,...i},o)=>{const r=k("io-panel-body",t);return jsxRuntimeExports.jsx("div",{className:r,ref:o,...i,children:n})}));function Li({className:t,...n}){const i=k("io-panel-footer",t);return jsxRuntimeExports.jsx(Z,{className:i,...n})}function Fi({className:t,children:n,...i}){const o=k("io-panel",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function Ri({className:t,variant:n="active",value:i=0,...o}){const r=k("io-progress",n,t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx("div",{className:"io-progress-bar",style:{width:`${i<0?0:i>100?100:i}%`}})})}function _i({text:t="Label",...n}){return jsxRuntimeExports.jsx("label",{...n,children:t})}Oi.displayName="PanelBody",Li.ButtonGroup=G,Li.Button=M,Li.ButtonIcon=N,Li.Dropdown=K,Fi.Header=Pi,Fi.Body=Oi,Fi.Footer=Li;const Hi=forwardRef((({id:n="input",className:i,type:o="text",name:a="input",align:s="up",label:l,iconPrepend:c,iconPrependOnClick:u,iconAppend:d,iconAppendOnClick:f,placeholder:m,disabled:h,readOnly:p,errorMessage:g,errorDataTestId:v,...y},w)=>{const b=k("io-control-input",c&&"io-control-leading-icon",d&&"io-control-trailing-icon",h&&"io-control-disabled",p&&"io-control-readonly",g&&"io-control-error",s&&[`direction-${s}`],i),N=useCallback((e=>{h?e.preventDefault():u&&u(e);}),[u,h]),S=useCallback((e=>{h?e.preventDefault():f&&f(e);}),[f,h]);return jsxRuntimeExports.jsxs("div",{className:b,children:[l&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:l}),c&&jsxRuntimeExports.jsx(C,{variant:c,onClick:e=>N(e)}),jsxRuntimeExports.jsx("input",{id:n,className:"io-input",ref:w,type:o,name:a,tabIndex:0,placeholder:m??(()=>{switch(o){case "email":return "Enter your email here...";case "number":return "Enter number here...";case "password":return "Enter your password here...";case "tel":return "Enter your phone number here...";case "file":return "Select a file...";default:return "Enter text here..."}})(),disabled:h,readOnly:p,...y}),d&&jsxRuntimeExports.jsx(C,{variant:d,onClick:e=>S(e)}),g&&jsxRuntimeExports.jsxs("div",{"data-testid":v,children:[jsxRuntimeExports.jsx(C,{variant:"close"}),g]})]})}));Hi.displayName="Input";const ji=forwardRef((({id:n="textarea",className:i,name:o="textarea",align:r="up",label:a,rows:s=4,placeholder:l="Enter text here...",disabled:c,readOnly:u,...d},f)=>{const m=k("io-control-textarea",c&&"io-control-disabled",u&&"io-control-readonly",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:m,children:[a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a}),jsxRuntimeExports.jsx("textarea",{id:n,className:"io-textarea",ref:f,name:o,tabIndex:0,placeholder:l,disabled:c,readOnly:u,rows:s,...d})]})}));ji.displayName="Textarea";const zi=forwardRef((({id:n="checkbox",className:i,name:o="checkbox",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=k("io-control-checkbox",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:o,tabIndex:0,checked:s,disabled:l,...c}),a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a})]})}));zi.displayName="Checkbox";const $i=forwardRef((({id:n="radio",className:i,name:o="radio",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=k("io-control-radio",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"radio",id:n,className:"io-radio",ref:u,name:o,tabIndex:0,checked:s,disabled:l,...c}),a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a})]})}));$i.displayName="Radio";const Vi=forwardRef((({id:n="toggle",className:i,name:o="toggle",align:r="left",label:a="Toggle",checked:s,disabled:l,...c},u)=>{const d=k("io-control-toggle",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsx("div",{className:d,children:jsxRuntimeExports.jsxs("label",{className:"io-toggle",children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:o,checked:s,disabled:l,...c}),jsxRuntimeExports.jsx("span",{className:"slider"}),a]})})}));function Ui(e,t){const n=useCallback((n=>{const i=t.some((e=>n.key===e));i&&(n.preventDefault(),e());}),[e,t]);useEffect((()=>(document.addEventListener("keydown",n),()=>{document.removeEventListener("keydown",n);})),[n]);}function Ki(e,t=500){const[n,i]=useState(e);return useEffect((()=>{const n=setTimeout((()=>{i(e);}),t);return ()=>clearTimeout(n)}),[e,t]),n}Vi.displayName="Toggle";const Zi=()=>void 0!==window.glue42gd||void 0!==window.iodesktop;function eo(){return useMemo((()=>"object"==typeof window&&Zi()),[])}createContext({theme:"dark"});const oo="___platform_prefs___",ao="_launchpad_pinnedPosition",so="_launchpad_allowDocking",lo="_launchpad_minimizeToTray",co="_launchpad_autoCloseStartingAppsAndWorkspaces",uo="_launchpad_showTutorialOnStartup",fo="_layouts_restoreLastSaved",mo="_layouts_saveCurrentOnExit",ho="_layouts_showUnsavedChangesPrompt",po="_layouts_showDeletePrompt",go="_downloads_askForEachDownload",yo=e=>"string"==typeof e?e:e?.message?"string"==typeof e.message?e.message:JSON.stringify(e.message):JSON.stringify(e),wo={SUCCESS:"success",WARNING:"warning"},bo={success:5e3,warning:1e4};var ko=function(e){return {ok:true,result:e}},Co=function(e){return {ok:false,error:e}},No=function(e,t,n){return  false===t.ok?t:false===n.ok?n:ko(e(t.result,n.result))},So=function(e,t){return  true===t.ok?t:Co(e(t.error))},xo=function(){return xo=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},xo.apply(this,arguments)};function Do(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!Do(e[n],t[n]))return  false;return  true}var i=Object.keys(e);if(i.length!==Object.keys(t).length)return  false;for(n=0;n<i.length;n++){if(!t.hasOwnProperty(i[n]))return  false;if(!Do(e[i[n]],t[i[n]]))return  false}return  true}}var Eo=function(e){return Array.isArray(e)},Io=function(e){return "object"==typeof e&&null!==e&&!Eo(e)},Mo=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},Ao=function(e){return e.map((function(e){return "string"==typeof e?"."+e:"["+e+"]"})).join("")},To=function(e,t){var n=t.at,i=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(n[i[o]]=e[i[o]]);}return n}(t,["at"]);return xo({at:e+(n||"")},i)},Po=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return So((function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}}),n.decode(e))},this.runPromise=function(e){return  true===(t=n.run(e)).ok?Promise.resolve(t.result):Promise.reject(t.error);var t;},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e((function(e){return function(e,t){return  true===t.ok?ko(e(t.result)):t}(t,n.decode(e))}))},this.andThen=function(t){return new e((function(e){return function(e,t){return  true===t.ok?e(t.result):t}((function(n){return t(n).decode(e)}),n.decode(e))}))},this.where=function(t,i){return n.andThen((function(n){return t(n)?e.succeed(n):e.fail(i)}))};}return e.string=function(){return new e((function(e){return "string"==typeof e?ko(e):Co({message:Mo("a string",e)})}))},e.number=function(){return new e((function(e){return "number"==typeof e?ko(e):Co({message:Mo("a number",e)})}))},e.boolean=function(){return new e((function(e){return "boolean"==typeof e?ko(e):Co({message:Mo("a boolean",e)})}))},e.constant=function(t){return new e((function(e){return Do(e,t)?ko(t):Co({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})}))},e.object=function(t){return new e((function(e){if(Io(e)&&t){var n={};for(var i in t)if(t.hasOwnProperty(i)){var o=t[i].decode(e[i]);if(true!==o.ok)return void 0===e[i]?Co({message:"the key '"+i+"' is required but was not present"}):Co(To("."+i,o.error));void 0!==o.result&&(n[i]=o.result);}return ko(n)}return Io(e)?ko(e):Co({message:Mo("an object",e)})}))},e.array=function(t){return new e((function(e){if(Eo(e)&&t){return e.reduce((function(e,n,i){return No((function(e,t){return e.concat([t])}),e,function(e,n){return So((function(e){return To("["+n+"]",e)}),t.decode(e))}(n,i))}),ko([]))}return Eo(e)?ko(e):Co({message:Mo("an array",e)})}))},e.tuple=function(t){return new e((function(e){if(Eo(e)){if(e.length!==t.length)return Co({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e[i]);if(!o.ok)return Co(To("["+i+"]",o.error));n[i]=o.result;}return ko(n)}return Co({message:Mo("a tuple of length "+t.length,e)})}))},e.union=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return e.oneOf.apply(e,[t,n].concat(i))},e.intersection=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return new e((function(e){return [t,n].concat(i).reduce((function(t,n){return No(Object.assign,t,n.decode(e))}),ko({}))}))},e.anyJson=function(){return new e((function(e){return ko(e)}))},e.unknownJson=function(){return new e((function(e){return ko(e)}))},e.dict=function(t){return new e((function(e){if(Io(e)){var n={};for(var i in e)if(e.hasOwnProperty(i)){var o=t.decode(e[i]);if(true!==o.ok)return Co(To("."+i,o.error));n[i]=o.result;}return ko(n)}return Co({message:Mo("an object",e)})}))},e.optional=function(t){return new e((function(e){return null==e?ko(void 0):t.decode(e)}))},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e((function(e){for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e);if(true===o.ok)return o;n[i]=o.error;}var r=n.map((function(e){return "at error"+(e.at||"")+": "+e.message})).join('", "');return Co({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})}))},e.withDefault=function(t,n){return new e((function(e){return ko(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))}))},e.valueAt=function(t,n){return new e((function(e){for(var i=e,o=0;o<t.length;o++){if(void 0===i)return Co({at:Ao(t.slice(0,o+1)),message:"path does not exist"});if("string"==typeof t[o]&&!Io(i))return Co({at:Ao(t.slice(0,o+1)),message:Mo("an object",i)});if("number"==typeof t[o]&&!Eo(i))return Co({at:Ao(t.slice(0,o+1)),message:Mo("an array",i)});i=i[t[o]];}return So((function(e){return void 0===i?{at:Ao(t),message:"path does not exist"}:To(Ao(t),e)}),n.decode(i))}))},e.succeed=function(t){return new e((function(e){return ko(t)}))},e.fail=function(t){return new e((function(e){return Co({message:t})}))},e.lazy=function(t){return new e((function(e){return t().decode(e)}))},e}(),Oo=Po.string;Po.number;var Lo=Po.boolean,Fo=Po.anyJson;Po.unknownJson;var Bo=Po.constant,Ro=Po.object,_o=Po.array;Po.tuple,Po.dict;var Ho=Po.optional,jo=Po.oneOf;Po.union,Po.intersection,Po.withDefault,Po.valueAt,Po.succeed,Po.fail,Po.lazy;const zo=["name","title","version","customProperties","icon","caption","type"],$o=["appId","name","type","details","version","title","tooltip","lang","description","categories","icons","screenshots","contactEmail","moreInfo","publisher","customConfig","hostManifests","interop","localizedVersions"];var Vo=function(e){return {ok:true,result:e}},Yo=function(e){return {ok:false,error:e}},Uo=function(e,t,n){return  false===t.ok?t:false===n.ok?n:Vo(e(t.result,n.result))},Wo=function(e,t){return  true===t.ok?t:Yo(e(t.error))},Jo=function(){return Jo=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},Jo.apply(this,arguments)};function Ko(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!Ko(e[n],t[n]))return  false;return  true}var i=Object.keys(e);if(i.length!==Object.keys(t).length)return  false;for(n=0;n<i.length;n++){if(!t.hasOwnProperty(i[n]))return  false;if(!Ko(e[i[n]],t[i[n]]))return  false}return  true}}var Go=function(e){return Array.isArray(e)},qo=function(e){return "object"==typeof e&&null!==e&&!Go(e)},Qo=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},Xo=function(e){return e.map((function(e){return "string"==typeof e?"."+e:"["+e+"]"})).join("")},Zo=function(e,t){var n=t.at,i=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(n[i[o]]=e[i[o]]);}return n}(t,["at"]);return Jo({at:e+(n||"")},i)},er=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return Wo((function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}}),n.decode(e))},this.runPromise=function(e){return  true===(t=n.run(e)).ok?Promise.resolve(t.result):Promise.reject(t.error);var t;},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e((function(e){return function(e,t){return  true===t.ok?Vo(e(t.result)):t}(t,n.decode(e))}))},this.andThen=function(t){return new e((function(e){return function(e,t){return  true===t.ok?e(t.result):t}((function(n){return t(n).decode(e)}),n.decode(e))}))},this.where=function(t,i){return n.andThen((function(n){return t(n)?e.succeed(n):e.fail(i)}))};}return e.string=function(){return new e((function(e){return "string"==typeof e?Vo(e):Yo({message:Qo("a string",e)})}))},e.number=function(){return new e((function(e){return "number"==typeof e?Vo(e):Yo({message:Qo("a number",e)})}))},e.boolean=function(){return new e((function(e){return "boolean"==typeof e?Vo(e):Yo({message:Qo("a boolean",e)})}))},e.constant=function(t){return new e((function(e){return Ko(e,t)?Vo(t):Yo({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})}))},e.object=function(t){return new e((function(e){if(qo(e)&&t){var n={};for(var i in t)if(t.hasOwnProperty(i)){var o=t[i].decode(e[i]);if(true!==o.ok)return void 0===e[i]?Yo({message:"the key '"+i+"' is required but was not present"}):Yo(Zo("."+i,o.error));void 0!==o.result&&(n[i]=o.result);}return Vo(n)}return qo(e)?Vo(e):Yo({message:Qo("an object",e)})}))},e.array=function(t){return new e((function(e){if(Go(e)&&t){return e.reduce((function(e,n,i){return Uo((function(e,t){return e.concat([t])}),e,function(e,n){return Wo((function(e){return Zo("["+n+"]",e)}),t.decode(e))}(n,i))}),Vo([]))}return Go(e)?Vo(e):Yo({message:Qo("an array",e)})}))},e.tuple=function(t){return new e((function(e){if(Go(e)){if(e.length!==t.length)return Yo({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e[i]);if(!o.ok)return Yo(Zo("["+i+"]",o.error));n[i]=o.result;}return Vo(n)}return Yo({message:Qo("a tuple of length "+t.length,e)})}))},e.union=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return e.oneOf.apply(e,[t,n].concat(i))},e.intersection=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return new e((function(e){return [t,n].concat(i).reduce((function(t,n){return Uo(Object.assign,t,n.decode(e))}),Vo({}))}))},e.anyJson=function(){return new e((function(e){return Vo(e)}))},e.unknownJson=function(){return new e((function(e){return Vo(e)}))},e.dict=function(t){return new e((function(e){if(qo(e)){var n={};for(var i in e)if(e.hasOwnProperty(i)){var o=t.decode(e[i]);if(true!==o.ok)return Yo(Zo("."+i,o.error));n[i]=o.result;}return Vo(n)}return Yo({message:Qo("an object",e)})}))},e.optional=function(t){return new e((function(e){return null==e?Vo(void 0):t.decode(e)}))},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e((function(e){for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e);if(true===o.ok)return o;n[i]=o.error;}var r=n.map((function(e){return "at error"+(e.at||"")+": "+e.message})).join('", "');return Yo({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})}))},e.withDefault=function(t,n){return new e((function(e){return Vo(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))}))},e.valueAt=function(t,n){return new e((function(e){for(var i=e,o=0;o<t.length;o++){if(void 0===i)return Yo({at:Xo(t.slice(0,o+1)),message:"path does not exist"});if("string"==typeof t[o]&&!qo(i))return Yo({at:Xo(t.slice(0,o+1)),message:Qo("an object",i)});if("number"==typeof t[o]&&!Go(i))return Yo({at:Xo(t.slice(0,o+1)),message:Qo("an array",i)});i=i[t[o]];}return Wo((function(e){return void 0===i?{at:Xo(t),message:"path does not exist"}:Zo(Xo(t),e)}),n.decode(i))}))},e.succeed=function(t){return new e((function(e){return Vo(t)}))},e.fail=function(t){return new e((function(e){return Yo({message:t})}))},e.lazy=function(t){return new e((function(e){return t().decode(e)}))},e}(),tr=er.string,nr=er.number,ir=er.boolean,or=er.anyJson;er.unknownJson;var rr=er.constant,ar=er.object,sr=er.array;er.tuple;var lr=er.dict,cr=er.optional,ur=er.oneOf;er.union,er.intersection,er.withDefault,er.valueAt,er.succeed,er.fail,er.lazy;const dr=tr().where((e=>e.length>0),"Expected a non-empty string"),fr=nr().where((e=>e>=0),"Expected a non-negative number"),mr=ar({name:dr,displayName:cr(tr()),contexts:cr(sr(tr())),customConfig:cr(ar())}),hr=ur(rr("web"),rr("native"),rr("citrix"),rr("onlineNative"),rr("other")),pr=ar({url:dr}),gr=ar({src:dr,size:cr(dr),type:cr(dr)}),vr=ar({src:dr,size:cr(dr),type:cr(dr),label:cr(dr)}),yr=ar({contexts:sr(dr),displayName:cr(dr),resultType:cr(dr),customConfig:cr(or())}),wr=ar({listensFor:cr(lr(yr)),raises:cr(lr(sr(dr)))}),br=ar({broadcasts:cr(sr(dr)),listensFor:cr(sr(dr))}),kr=ar({name:dr,description:cr(dr),broadcasts:cr(sr(dr)),listensFor:cr(sr(dr))}),Cr=ar({intents:cr(wr),userChannels:cr(br),appChannels:cr(sr(kr))}),Nr=ar({url:cr(dr),top:cr(nr()),left:cr(nr()),width:cr(fr),height:cr(fr)}),Sr=ar({name:cr(dr),type:cr(dr.where((e=>"window"===e),"Expected a value of window")),title:cr(dr),version:cr(dr),customProperties:cr(or()),icon:cr(tr()),caption:cr(tr()),details:cr(Nr),intents:cr(sr(mr)),hidden:cr(ir())}),xr=ar({name:dr,appId:dr,title:cr(dr),version:cr(dr),manifest:dr,manifestType:dr,tooltip:cr(dr),description:cr(dr),contactEmail:cr(dr),supportEmail:cr(dr),publisher:cr(dr),images:cr(sr(ar({url:cr(dr)}))),icons:cr(sr(ar({icon:cr(dr)}))),customConfig:or(),intents:cr(sr(mr))}),Dr=ar({appId:cr(dr),name:cr(dr),details:cr(pr),version:cr(dr),title:cr(dr),tooltip:cr(dr),lang:cr(dr),description:cr(dr),categories:cr(sr(dr)),icons:cr(sr(gr)),screenshots:cr(sr(vr)),contactEmail:cr(dr),supportEmail:cr(dr),moreInfo:cr(dr),publisher:cr(dr),customConfig:cr(sr(or())),hostManifests:cr(or()),interop:cr(Cr)}),Er=ar({appId:dr,name:cr(dr),type:hr,details:pr,version:cr(dr),title:cr(dr),tooltip:cr(dr),lang:cr(dr),description:cr(dr),categories:cr(sr(dr)),icons:cr(sr(gr)),screenshots:cr(sr(vr)),contactEmail:cr(dr),supportEmail:cr(dr),moreInfo:cr(dr),publisher:cr(dr),customConfig:cr(sr(or())),hostManifests:cr(or()),interop:cr(Cr),localizedVersions:cr(lr(Dr))}),Ir=ur(xr,Er),Mr=e=>`${e.kind} at ${e.at}: ${JSON.stringify(e.input)}. Reason - ${e.message}`;class Ar{fdc3ToDesktopDefinitionType={web:"window",native:"exe",citrix:"citrix",onlineNative:"clickonce",other:"window"};toApi(){return {isFdc3Definition:this.isFdc3Definition.bind(this),parseToBrowserBaseAppData:this.parseToBrowserBaseAppData.bind(this),parseToDesktopAppConfig:this.parseToDesktopAppConfig.bind(this)}}isFdc3Definition(e){const t=Ir.run(e);return t.ok?e.appId&&e.details?{isFdc3:true,version:"2.0"}:e.manifest?{isFdc3:true,version:"1.2"}:{isFdc3:false,reason:"The passed definition is not FDC3"}:{isFdc3:false,reason:Mr(t.error)}}parseToBrowserBaseAppData(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const i=Ir.run(e);if(!i.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Mr(i.error)}`);const o=this.getUserPropertiesFromDefinition(e,n),r={url:this.getUrl(e,n)},a={name:e.appId,type:"window",createOptions:r,userProperties:{...o,intents:"1.2"===n?o.intents:this.getIntentsFromV2AppDefinition(e),details:r},title:e.title,version:e.version,icon:this.getIconFromDefinition(e,n),caption:e.description,fdc3:"2.0"===n?{...e,definitionVersion:"2.0"}:void 0},s=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!s)return a;const l=Sr.run(s);if(!l.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Mr(l.error)}`);return Object.keys(l.result).length?this.mergeBaseAppDataWithGlueManifest(a,l.result):a}parseToDesktopAppConfig(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const i=Ir.run(e);if(!i.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Mr(i.error)}`);if("1.2"===n){const t=e;return {name:t.appId,type:"window",details:{url:this.getUrl(e,n)},version:t.version,title:t.title,tooltip:t.tooltip,caption:t.description,icon:t.icons?.[0].icon,intents:t.intents,customProperties:{manifestType:t.manifestType,images:t.images,contactEmail:t.contactEmail,supportEmail:t.supportEmail,publisher:t.publisher,icons:t.icons,customConfig:t.customConfig}}}const o=e,r={name:o.appId,type:this.fdc3ToDesktopDefinitionType[o.type],details:o.details,version:o.version,title:o.title,tooltip:o.tooltip,caption:o.description,icon:this.getIconFromDefinition(o,"2.0"),intents:this.getIntentsFromV2AppDefinition(o),fdc3:{...o,definitionVersion:"2.0"}},a=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!a)return r;if("object"!=typeof a||Array.isArray(a))throw new Error(`Invalid '${e.hostManifests.ioConnect?"hostManifests.ioConnect":"hostManifests['Glue42']"}' key`);return this.mergeDesktopConfigWithGlueManifest(r,a)}getUserPropertiesFromDefinition(e,t){return "1.2"===t?Object.fromEntries(Object.entries(e).filter((([e])=>!zo.includes(e)))):Object.fromEntries(Object.entries(e).filter((([e])=>!zo.includes(e)&&!$o.includes(e))))}getUrl(e,t){let n;if("1.2"===t){const t=JSON.parse(e.manifest);n=t.details?.url||t.url;}else n=e.details?.url;if(!n||"string"!=typeof n)throw new Error(`Invalid FDC3 ${t} definition. Provide valid 'url' under '${"1.2"===t?"manifest":"details"}' key`);return n}getIntentsFromV2AppDefinition(e){const t=e.interop?.intents?.listensFor;if(!t)return;return Object.entries(t).map((e=>{const[t,n]=e;return {name:t,...n}}))}getIconFromDefinition(e,t){return "1.2"===t?e.icons?.find((e=>e.icon))?.icon||void 0:e.icons?.find((e=>e.src))?.src||void 0}mergeBaseAppDataWithGlueManifest(e,t){let n=e;if(t.customProperties&&(n.userProperties={...e.userProperties,...t.customProperties}),t.details){const i={...e.createOptions,...t.details};n.createOptions=i,n.userProperties.details=i;}return Array.isArray(t.intents)&&(n.userProperties.intents=(n.userProperties.intents||[]).concat(t.intents)),n={...n,...t},delete n.details,delete n.intents,n}mergeDesktopConfigWithGlueManifest(e,t){const n=Object.assign({},e,t,{details:{...e.details,...t.details}});return Array.isArray(t.intents)&&(n.intents=(e.intents||[]).concat(t.intents)),n}}const Tr={common:{nonEmptyStringDecoder:dr,nonNegativeNumberDecoder:fr},fdc3:{allDefinitionsDecoder:Ir,v1DefinitionDecoder:xr,v2DefinitionDecoder:Er}};var Pr;!function(e){e.USER_CANCELLED="User Closed Intents Resolver UI without choosing a handler",e.CALLER_NOT_DEFINED="Caller Id is not defined",e.TIMEOUT_HIT="Timeout hit",e.INTENT_NOT_FOUND="Cannot find Intent",e.HANDLER_NOT_FOUND="Cannot find Intent Handler",e.TARGET_INSTANCE_UNAVAILABLE="Cannot start Target Instance",e.INTENT_DELIVERY_FAILED="Target Instance did not add a listener",e.RESOLVER_UNAVAILABLE="Intents Resolver UI unavailable",e.RESOLVER_TIMEOUT="User did not choose a handler",e.INVALID_RESOLVER_RESPONSE="Intents Resolver UI returned invalid response",e.INTENT_HANDLER_REJECTION="Intent Handler function processing the raised intent threw an error or rejected the promise it returned";}(Pr||(Pr={}));const Or=new class{_fdc3;_decoders=Tr;_errors={intents:Pr};get fdc3(){return this._fdc3||(this._fdc3=(new Ar).toApi()),this._fdc3}get decoders(){return this._decoders}get errors(){return this._errors}};Or.fdc3;const Lr=Or.decoders;Or.errors;const Fr=Lr.common.nonEmptyStringDecoder,Br=jo(Bo("add"),Bo("align-bottom"),Bo("align-bottom-solid"),Bo("align-left"),Bo("align-left-bottom"),Bo("align-left-bottom-solid"),Bo("align-left-solid"),Bo("align-left-top"),Bo("align-left-top-solid"),Bo("align-right"),Bo("align-right-bottom"),Bo("align-right-bottom-solid"),Bo("align-right-solid"),Bo("align-right-top"),Bo("align-right-top-solid"),Bo("align-top"),Bo("align-top-solid"),Bo("always-on-top"),Bo("always-on-top-on"),Bo("application"),Bo("arrow-down-long"),Bo("arrow-down-to-bracket"),Bo("arrow-left-long"),Bo("arrow-right-from-bracket"),Bo("arrow-right-long"),Bo("arrow-right"),Bo("arrow-up"),Bo("arrow-up-long"),Bo("ban"),Bo("bell"),Bo("bell-solid"),Bo("bookmark"),Bo("bullseye-pointer"),Bo("certificate"),Bo("check"),Bo("check-light"),Bo("check-solid"),Bo("chevron-down"),Bo("chevron-left"),Bo("chevron-right"),Bo("chevron-up"),Bo("circle-info"),Bo("circle-xmark"),Bo("circle-xmark-full"),Bo("clock"),Bo("clock-rotate-left"),Bo("clone"),Bo("close"),Bo("cog"),Bo("cog-solid"),Bo("collapse"),Bo("copy"),Bo("download"),Bo("delete-left"),Bo("dev-tools"),Bo("ellipsis"),Bo("ellipsis-vertical"),Bo("expand"),Bo("envelope"),Bo("envelope-open"),Bo("exclamation-mark"),Bo("expand"),Bo("feedback"),Bo("filter"),Bo("floppy"),Bo("floppy-disk-pen"),Bo("folder"),Bo("folder-open"),Bo("globe"),Bo("group"),Bo("hidden"),Bo("home"),Bo("house"),Bo("info"),Bo("keyboard"),Bo("layout"),Bo("link"),Bo("list-ul"),Bo("lock"),Bo("logo"),Bo("minimize"),Bo("minimize-down"),Bo("paper-plane-top"),Bo("paperclip"),Bo("pause"),Bo("pen-line"),Bo("pen-to-square"),Bo("pin"),Bo("play"),Bo("pop-in"),Bo("pop-in-widget"),Bo("pop-out"),Bo("power-off"),Bo("publish"),Bo("refresh"),Bo("resize"),Bo("restore"),Bo("rotate-right"),Bo("search"),Bo("search-filled"),Bo("sliders"),Bo("snooze"),Bo("spinner"),Bo("square"),Bo("square-arrow-down"),Bo("square-arrow-up"),Bo("star"),Bo("star-full"),Bo("sticky-off"),Bo("sticky-off-hover"),Bo("sticky-on"),Bo("sticky-on-hover"),Bo("subscribe"),Bo("system-close"),Bo("system-maximize"),Bo("system-minimize"),Bo("thumbs-down"),Bo("thumbs-up"),Bo("trash"),Bo("trash-can"),Bo("triangle-exclamation"),Bo("unlock"),Bo("unpin"),Bo("up-to-line"),Bo("user"),Bo("user-gear"),Bo("visible"),Bo("workspace")),Rr=Ro({id:Fr,title:Fr,description:Ho(Oo()),icon:Ho(Br),iconSrc:Ho(Fr),contextMenuActions:Ho(_o(Fo())),type:Fr}),_r=jo(Bo("Left"),Bo("Right")),Hr=jo(Bo("daily"),Bo("weekly")),jr=jo(Bo("Sunday"),Bo("Monday"),Bo("Tuesday"),Bo("Wednesday"),Bo("Thursday"),Bo("Friday"),Bo("Saturday")),zr=Ro({customPrefs:Ho(Fo()),_launchpad_collapsedSections:Ho(_o(Fr)),_launchpad_favorites:Ho(_o(Rr)),_launchpad_isLayoutsPanelOpen:Ho(Lo()),_launchpad_isCollapsed:Ho(Lo()),_launchpad_isPinned:Ho(Lo()),_launchpad_pinnedPosition:Ho(_r),_launchpad_allowDocking:Ho(Lo()),_launchpad_minimizeToTray:Ho(Lo()),_launchpad_autoCloseStartingAppsAndWorkspaces:Ho(Lo()),_launchpad_showTutorialOnStartup:Ho(Lo()),_layouts_restoreLastSaved:Ho(Lo()),_layouts_saveCurrentOnExit:Ho(Lo()),_layouts_showUnsavedChangesPrompt:Ho(Lo()),_layouts_showDeletePrompt:Ho(Lo()),_downloads_askForEachDownload:Ho(Lo()),_downloads_location:Ho(Oo()),_system_scheduleRestart:Ho(Lo()),_system_scheduleRestartTime:Ho(Fr),_system_scheduleRestartFrequency:Ho(Hr),_system_scheduleRestartDay:Ho(jr),_system_scheduleShutdown:Ho(Lo()),_system_scheduleShutdownTime:Ho(Fr),_system_scheduleShutdownFrequency:Ho(Hr),_system_scheduleShutdownDay:Ho(jr)}),$r=async e=>{const{io:t,variant:n,text:i,error:o}=e,r=yo(o);try{if(n===wo.WARNING&&t.logger.warn(r?`${i} ${r}`:i),!("modals"in t)||!t.modals)throw new Error("Modals are not enabled.");const e={text:i,variant:n,ttl:bo[n]};await t.modals.alerts.request(e);}catch(e){console.warn("Failed to request alert. ",{error:e});}},Vr=createContext(void 0);function Wr({prefKey:e}){const t=useContext(IOConnectContext),n=useContext(Vr),i=n?.prefs?.[e],o=n?.isInitialSetupCompleted??false,[a,c]=useState(!o),[f,m]=useState(),h=useRef(0);useEffect((()=>{o&&0===h.current&&c(false);}),[o]);const p=useCallback((async n=>{if(!t)return;const i=++h.current;c(true),m(void 0);const o=async n=>{n&&await $r({io:t,variant:wo.WARNING,text:`Failed to update prefKey "${e}".`,error:n}),i===h.current&&(c(false),n&&m({message:yo(n)}));};let r;if(n instanceof Function)try{r=n((await t.contexts.get(oo))[e]);}catch(e){return o(e)}else r=n;try{const n=zr.runWithException({[e]:r});await t.contexts.update(oo,n);}catch(e){return o(e)}await o();}),[t,e]);if(void 0===n)throw new Error("usePlatformPref must be used within a PlatformPrefsProvider");return {error:f,isLoading:a,update:p,value:i}}const Jr={dark:"var(--io-neutrals-0)",light:"var(--io-neutrals-900)"};function Kr(e){let t,n,i;if(e.startsWith("#")){let o=e.slice(1);3===o.length&&(o=o.split("").map((e=>e+e)).join("")),t=parseInt(o.substring(0,2),16),n=parseInt(o.substring(2,4),16),i=parseInt(o.substring(4,6),16);}else {if(!e.startsWith("rgb")){const t=document.createElement("canvas").getContext("2d");if(!t)return Jr.light;t.fillStyle=e;return Kr(t.fillStyle)}{const o=e.match(/\d+/g)?.map(Number);if(!o||o.length<3)return Jr.light;[t,n,i]=o;}}return (.2126*t+.7152*n+.0722*i)/255>.5?Jr.light:Jr.dark}function Gr({className:t,channel:n,...i}){const o=k("io-channel-badge",t),r=useMemo((()=>Kr(n.color)),[n.color]);return jsxRuntimeExports.jsx("div",{className:o,style:{color:r,backgroundColor:n.color},...i,children:jsxRuntimeExports.jsx("span",{className:"io-channel-badge-label",children:n.label})})}function qr(){return jsxRuntimeExports.jsx(C,{variant:"check"})}function Qr({channel:i,handleChannelRestricted:o,lockedChannelRestriction:r}){return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{children:i.isSelected&&jsxRuntimeExports.jsx("span",{children:"Active"})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||e.stopPropagation();},tabIndex:0,children:jsxRuntimeExports.jsx(Vi,{label:"Publish",checked:i.write,onChange:()=>{o({...i,write:!i.write});},disabled:!i.isSelected||r?.write})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||e.stopPropagation();},tabIndex:0,children:jsxRuntimeExports.jsx(Vi,{label:"Subscribe",checked:i.read,onChange:()=>{o({...i,read:!i.read});},disabled:!i.isSelected||r?.read})})]})}const Xr=createContext({});function Zr({channel:t,isSelected:n,onChannelSelect:i,onChannelRestrict:o,...a}){const{variant:l,selectedChannels:c,lockedChannelRestrictions:u}=useContext(Xr),d=n||t.isSelected||c?.includes(t),f=u?.find((e=>e.name===t.name)),m=useCallback((()=>i?.({...t,isSelected:!d})),[t,i,d]),h=useCallback((e=>{o?.(e);}),[o]);return jsxRuntimeExports.jsx(F,{prepend:jsxRuntimeExports.jsx(Gr,{channel:t}),append:"single"===l||"multi"===l?d&&jsxRuntimeExports.jsx(qr,{}):jsxRuntimeExports.jsx(Qr,{channel:t,handleChannelRestricted:h,lockedChannelRestriction:f}),isSelected:d,onClick:m,...a,children:t.name},t.name)}const ea=forwardRef((({className:n,variant:i="single",variantToggle:o=false,channels:r=[],lockedChannelRestrictions:a=[],onVariantChange:s,onChannelSelect:l,onChannelRestrict:u,...d},f)=>{const m=k("io-list-channels",("directionalSingle"===i||"directionalMulti"===i)&&"io-list-channels-directional",n),h=useMemo((()=>({variant:i,selectedChannels:r.filter((e=>e.isSelected)),lockedChannelRestrictions:a,onVariantChange:s,onChannelSelect:l,onChannelRestrict:u})),[r,i,a,s,l,u]);return jsxRuntimeExports.jsx(Xr.Provider,{value:h,children:jsxRuntimeExports.jsx("div",{className:m,ref:f,children:jsxRuntimeExports.jsxs(z,{...d,children:[jsxRuntimeExports.jsx(z.ItemTitle,{append:o&&jsxRuntimeExports.jsx(Vi,{label:"Directional",align:"right",onChange:e=>s&&s(e.target.checked),checked:"directionalSingle"===i||"directionalMulti"===i}),children:{single:"Select Channel",directionalSingle:"Select Directional Channel",multi:"Select Channels",directionalMulti:"Select Directional Channels"}[i]}),r?.map((t=>jsxRuntimeExports.jsx(Zr,{channel:t,isSelected:t.isSelected,onChannelSelect:l,onChannelRestrict:u},t.name)))]})})})}));function ta(e,t){const n=useContext(IOConnectContext),i=n.windows,o=n.channels,[a,c]=useState({channels:[]});useEffect((()=>{if(!e)return;(async()=>{try{const t=await o.getRestrictions(e);c(t);}catch(e){console.error("Failed to fetch channel restrictions:",e);}})().catch(console.error);const t=i.findById(e);if(!t||"function"!=typeof t.onChannelRestrictionsChanged)return;return t.onChannelRestrictionsChanged(c)}),[e,o,i]);const d=useCallback((({name:n,read:i,write:r})=>{e&&!["single","multi"].includes(t)&&void 0!==i&&void 0!==r&&o.restrict({name:n,read:i,write:r,windowId:e}).catch(console.error);}),[e,t,o]),f=useCallback((e=>e.map((e=>{const t=a.channels.find((t=>t.name===e.name));return {...e,read:t?.read??true,write:t?.write??true}}))),[a.channels]);return {channelRestrictions:a,onChannelRestricted:d,applyChannelRestrictions:f}}function na(e){const t=useContext(IOConnectContext).windows,[n,i]=useState([]);return useEffect((()=>{if(!e)return;(async()=>{try{const n=t.findById(e);if(!n)return void i([]);const o=await(n.application?.getConfiguration()),r=o?.details?.channelSelector?.preventModifyingRestrictionsFor;if(!r)return void i([]);i(r);}catch(e){console.error("Failed to fetch locked channel restrictions:",e);}})().catch(console.error);}),[e,t]),{lockedChannelRestrictions:n}}ea.displayName="ChannelSelector";var ia=Object.freeze({__proto__:null,Channel:Zr,ChannelBadge:Gr,ChannelDirectionalAppend:Qr,ChannelSelector:ea,ChannelSingleAppend:qr,useChannelRestrictionLocks:na,useChannelRestrictions:ta,useIOCDChannels:function(e){const t="T42.ChannelSelector.Execute",n=useContext(IOConnectContext),i=n?.windows,o=n?.channels,a=n?.interop,c=eo(),m=i?.my(),h=useRef(),[p,g]=useState(""),[y,w]=useState("single"),[b,k]=useState(null),[C,N]=useState(false),[S,x]=useState(),{channelRestrictions:D,onChannelRestricted:E,applyChannelRestrictions:I}=ta(p,y),{lockedChannelRestrictions:M}=na(p),A=useCallback((async(e,t,n)=>{if("will-show"===e.command)try{N(!0),h.current=n;const{windowId:t,channels:o,variant:r}=e;w(r),g(t);const a=await(i?.findById(t)?.getChannel())??"",s=I(function(e,t){return e.map(((e,n)=>{const i=!!t&&t.split("+++").includes(e.name);return {...e,color:e.meta?.color,label:e.meta?.label??String.fromCharCode(n+65),isSelected:i,read:e.read??!0,write:e.write??!0}}))}(o,a));k(s);}catch(e){console.error("Error in channel selector handler:",e),x(e);}finally{N(false);}}),[i,I]),T=useCallback((async({name:e,isSelected:t})=>{if(o){k((n=>n?n.map((n=>"single"===y||"directionalSingle"===y?{...n,isSelected:n.name===e&&t}:n.name===e?{...n,isSelected:t}:n)):[]));try{t?await o.join(e,p):await o.leave({windowId:p,channel:e});}catch(e){x(e),console.error("Error selecting channel:",e);}"single"===y&&c&&m&&m?.hide().catch(console.error);}}),[o,y,m,p,c]);return Ui((()=>{c&&m&&m?.hide().catch(console.error);}),["Escape"]),useEffect((()=>{if(null===c||!c)return;const e=m?.onClosing((async e=>(e({showDialog:false}),Promise.resolve())));return e}),[m,c]),useEffect((()=>{if(!a)return;return a.registerAsync(t,((e,t,n)=>{A(e,t,n).catch((e=>{console.error("Error in channel selector handler:",e),x(e);}));})).catch(console.error),()=>{a.unregister(t);}}),[a,A]),useEffect((()=>{k((e=>e?I(e):null));}),[D,I]),useLayoutEffect((()=>{if(e?.current&&b?.length){const{height:t,width:n,x:i,y:o}=e.current.getBoundingClientRect();h.current&&t>0&&h.current({height:t,width:n,x:i,y:o});}}),[b,e]),{windowId:p,error:S,variant:y,channels:b,channelRestrictions:D,lockedChannelRestrictions:M,onChannelSelected:T,onChannelRestricted:E,isLoading:C}}});createContext({config:{message:""},theme:"dark",setResult:()=>{}});function pa({title:n="Downloads"}){const{ItemSearch:i,HeaderButtons:o}=Ha();return jsxRuntimeExports.jsxs("div",{className:"io-dm-header",children:[jsxRuntimeExports.jsxs(q,{children:[jsxRuntimeExports.jsx(q.Title,{tag:"h1",text:n,size:"large"}),jsxRuntimeExports.jsx(o,{})]}),jsxRuntimeExports.jsx(i,{})]})}const va=createContext({configuration:{},items:[],removeItem:()=>{},pauseResumeItem:()=>{},cancelItem:()=>{},clearItems:()=>{},showItemInFolder:()=>{},isSettingsVisible:false,showSettings:()=>{},hideSettings:()=>{},searchQuery:"",setSearch:()=>{},itemsCount:0,setCount:()=>{},setDownloadLocation:()=>{},setDownloadLocationWithDialog:()=>{},sortItems:()=>[],downloadLocationList:[],isDownloadLocationDialogVisible:false}),ya=()=>useContext(va);function wa({className:n,icon:i="search",placeholder:o="Search",...r}){const a=k("io-header-search",n),s=useRef(null),{searchQuery:l,setSearch:c,itemsCount:u}=ya();return jsxRuntimeExports.jsxs("div",{className:a,children:[jsxRuntimeExports.jsx(Hi,{ref:s,value:l,iconPrepend:i,placeholder:o,onChange:e=>c(e.target.value),...r}),l.length>0&&jsxRuntimeExports.jsx("p",{className:"io-header-search-count",children:`${u} results`})]})}function ba({className:n,...i}){const{SettingsButton:o,MoreButton:r}=Ha();return jsxRuntimeExports.jsxs(G,{className:n,align:"right",...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{})]})}function ka({icon:t="cog",...n}){const{showSettings:i}=ya();return jsxRuntimeExports.jsx(N,{icon:t,variant:"circle",size:"32",onClick:i,...n})}function Ca({icon:n="ellipsis",...i}){const{items:o,clearItems:r}=ya(),a=0===o.length;return jsxRuntimeExports.jsxs(K,{variant:"light",...i,children:[jsxRuntimeExports.jsx(K.ButtonIcon,{icon:n,variant:"circle",size:"32"}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{children:jsxRuntimeExports.jsx(K.Item,{disabled:a,onClick:e=>(e=>{a?e.stopPropagation():r();})(e),children:"Clear All"})})})]})}function Na(e,t=false,n=false,i=false){const o=e.getDate(),r=["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()],a=e.getFullYear(),s=e.getHours(),l=e.getMinutes();let c="";return c=l<10?`0${l}`:`${l}`,t?"Today"===t?n?"Today":`Today at ${s}:${c}`:"Yesterday"===t?n?"Yesterday":`Yesterday at ${s}:${c}`:`${s}:${c}`:i?n?`${r} ${o}`:`${r} ${o} at ${s}:${c}`:n?`${r} ${o}, ${a}`:`${r} ${o}, ${a} at ${s}:${c}`}function Sa(e,t={showTime:true}){const n=new Date(1e3*e),i=new Date,o=Math.round((i-n)/1e3),r=Math.round(o/60),a=i.toDateString()===n.toDateString(),s=new Date(i.setDate(i.getDate()-1)).toDateString()===n.toDateString(),l=i.getFullYear()===n.getFullYear();return t.showTime?o<5?"Just Now":o<60?`${o} seconds ago`:o<90?"about a minute ago":r<60?`${r} minutes ago`:a?Na(n,"Today",false,true):s?Na(n,"Yesterday",false,true):l?Na(n,false,false,true):Na(n):a?"Today":s?"Yesterday":l?Na(n,false,true,true):Na(n,false,true)}function xa({className:t,...n}){const i=k("io-dm-body",t),{DownloadListEmpty:o,ItemGroup:r,Item:a}=Ha(),{items:s,searchQuery:l,setCount:d,sortItems:f}=ya(),m=f(s),h=Ki(l),p=useMemo((()=>m.filter((e=>e.displayInfo.filename.toLowerCase().includes(h.toLowerCase())||e.displayInfo.url.toLowerCase().includes(h.toLowerCase())))),[m,h]),g=useMemo((()=>p.map((e=>({...e,displayInfo:{...e.displayInfo,startTime:Sa(e.displayInfo.startTime,{showTime:false})}})))),[p]),v=useMemo((()=>Object.values(g.reduce(((e={},t)=>(e[t.displayInfo.startTime]=e[t.displayInfo.startTime]?.concat([])??[],e[t.displayInfo.startTime].push(t),e)),{}))),[g]);return useEffect((()=>{d(p.length);}),[p,d]),jsxRuntimeExports.jsx("div",{className:i,...n,children:v&&0!==v.length?v.map((t=>jsxRuntimeExports.jsx(r,{title:String(t[0].displayInfo.startTime)??null,children:t.map((t=>jsxRuntimeExports.jsx(a,{item:t},t.id)))},t[0].id??""))):jsxRuntimeExports.jsx(o,{})})}function Da({className:n,icon:i="download",text:o="No downloads to display.",...r}){const a=k("io-dm-no-items",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[jsxRuntimeExports.jsx(C,{variant:i}),jsxRuntimeExports.jsx("p",{children:o})]})}function Ea({className:n,title:i,children:o,...r}){const a=k("io-dm-item-group",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[i&&jsxRuntimeExports.jsx("p",{children:i}),o]})}function Ia({className:i,item:o,...r}){const{ItemHeader:a,ItemBody:s,ItemFooter:l}=Ha(),{state:c,url:u,filename:d,receivedBytes:f,totalBytes:m,speed:h,timeRemaining:p}=o.displayInfo;if(!o)return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{});const g=k("io-dm-item",o.displayInfo.state&&[c],i);return jsxRuntimeExports.jsxs("div",{className:g,...r,children:[jsxRuntimeExports.jsx(a,{itemID:o.id,filename:d,state:c}),jsxRuntimeExports.jsx(s,{state:c,url:u,bytesReceived:f,bytesTotal:m,speed:h,timeRemaining:p}),jsxRuntimeExports.jsx(l,{itemID:o.id,state:c})]})}function Ma({bytesReceived:t=0,bytesTotal:n=0,...i}){const o=useCallback((()=>t&&n?Math.round(t/n*100):0),[t,n]);return jsxRuntimeExports.jsx(Ri,{value:o(),...i})}function Aa({className:n,itemID:i,filename:o,state:a,cancel:s,remove:l,...c}){const u=k("io-dm-item-header",n),{cancelItem:d,removeItem:f}=ya(),m=useCallback((e=>{s?s(e):d(e);}),[s,d]),h=useCallback((e=>{l?l(e):f(e);}),[l,f]);return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx(E,{text:o,style:{textDecoration:"interrupted"===a||"cancelled"===a?"line-through":"none"}}),jsxRuntimeExports.jsx(N,{icon:"close",onClick:()=>{"progressing"===a||"paused"===a?m(i):h(i);}})]})}function Ta({className:n,state:i,url:o,bytesReceived:r=0,bytesTotal:a=0,speed:s=0,timeRemaining:l=0,...c}){const u=k("io-dm-item-body",n),d=e=>{const t=["Bytes","KB","MB","GB","TB"];if(0===e)return "0";const n=Math.floor(Math.log(e)/Math.log(1024));return 0===n?`${e}${t[n]}`:`${(e/1024**n).toFixed(1)}${t[n]}`};return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx("p",{className:"io-text-small",children:o}),(m=i,"cancelled"===m||"interrupted"===m||"completed"===m?null:jsxRuntimeExports.jsx(Ma,{variant:"paused"===m?"paused":"active",bytesReceived:r,bytesTotal:a})),jsxRuntimeExports.jsx("p",{className:"io-text-default-lh16",children:"completed"===i?`${d(r??0)} - Done`:"cancelled"===i||"interrupted"===i?`${d(r??0)}/${d(a??0)} - Failed`:`${d(r??0)}/${d(a??0)} (${f=s,(f?`${(f/1e6/8).toFixed(2)}MB/s`:0)??0}) - ${(e=>{const t=Math.floor(e/3600),n=Math.floor(e%3600/60);let i="";return t>0&&(i+=`${t} hour${t>1?"s":""}, `),n>0&&(i+=`${n} min${n>1?"s":""}, `),((e=Math.floor(e%60))>0||""===i)&&(i+=`${e} sec${1!==e?"s":""}`),`${i.trim()} left`})(l)??0}`})]});var f,m;}const Pa={success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function Oa({className:n,variant:i,text:o}){const r=k("io-dm-item-status",`io-dm-item-status-${i}`,n);return jsxRuntimeExports.jsxs("div",{className:r,children:[i&&jsxRuntimeExports.jsx(C,{variant:Pa[i],className:"icon-severity"}),o&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:o})]})}function La({className:i,itemID:o,state:a,pauseResume:s,showInFolder:l,cancel:c,...u}){const d=k("io-dm-item-footer",i),{pauseResumeItem:f,showItemInFolder:m,cancelItem:h}=ya(),p=useCallback((e=>{s?s(e):f(e);}),[s,f]),g=useCallback((e=>{l?l(e):m(e);}),[l,m]),v=useCallback((e=>{c?c(e):h(e);}),[c,h]);return jsxRuntimeExports.jsx("div",{className:d,...u,children:(()=>{switch(a){case "progressing":return jsxRuntimeExports.jsxs(G,{align:"right",children:[jsxRuntimeExports.jsx(G.Button,{variant:"primary",text:"Pause",onClick:()=>p(o)}),jsxRuntimeExports.jsx(G.Button,{variant:"link",text:"Cancel",onClick:()=>v(o)})]});case "paused":return jsxRuntimeExports.jsx(G,{align:"right",children:jsxRuntimeExports.jsx(G.Button,{variant:"primary",text:"Resume",onClick:()=>p(o)})});case "completed":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Oa,{variant:"success",text:"Complete"}),jsxRuntimeExports.jsx(G,{align:"right",children:jsxRuntimeExports.jsx(G.Button,{variant:"primary",text:"Show in Folder",onClick:()=>g(o)})})]});case "cancelled":return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:jsxRuntimeExports.jsx(Oa,{variant:"warning",text:"Cancelled"})});case "interrupted":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Oa,{variant:"critical",text:"Failed"}),jsxRuntimeExports.jsx(G,{align:"right",children:jsxRuntimeExports.jsx(G.Button,{variant:"primary",text:"Retry",onClick:()=>p(o)})})]});default:return null}})()})}function Fa({className:n,title:i="Settings",...o}){const r=k("io-dm-settings-panel",n),{configuration:{downloadFolder:a},hideSettings:s,setDownloadLocation:l,setDownloadLocationWithDialog:c,isDownloadLocationDialogVisible:u,downloadLocationList:d}=ya();return jsxRuntimeExports.jsxs(Fi,{className:r,...o,children:[jsxRuntimeExports.jsxs(Fi.Header,{children:[jsxRuntimeExports.jsx(Fi.Header.Title,{size:"large",text:i,tag:"h1"}),jsxRuntimeExports.jsx(Fi.Header.ButtonGroup,{children:jsxRuntimeExports.jsx(N,{variant:"circle",icon:"close",size:"32",onClick:()=>{s();},disabled:u})})]}),jsxRuntimeExports.jsx(Fi.Body,{children:jsxRuntimeExports.jsxs(G,{children:[jsxRuntimeExports.jsxs(K,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx(K.Button,{children:jsxRuntimeExports.jsx("span",{className:"io-dm-settings-panel-download-location",children:a??d[0]})}),d.length>1&&jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{children:d.map(((t,n)=>!t||0===n||n>3?null:jsxRuntimeExports.jsx(K.Item,{onClick:()=>{l(t);},children:t},t)))})})]}),jsxRuntimeExports.jsx(M,{className:"io-btn io-dm-settings-panel-download-location-btn",text:"Browse",onClick:()=>{c();},disabled:u})]})})]})}const Ba={Header:pa,ItemSearch:wa,HeaderButtons:ba,SettingsButton:ka,MoreButton:Ca,Body:xa,DownloadListEmpty:Da,ItemGroup:Ea,Item:Ia,ItemProgress:Ma,ItemHeader:Aa,ItemBody:Ta,ItemFooter:La,Settings:Fa},Ra=createContext(Ba),_a=memo((({children:t,components:n})=>{const i=useMemo((()=>({...Ba,...n})),[n]);return jsxRuntimeExports.jsx(Ra.Provider,{value:i,children:t})}));_a.displayName="ComponentsStore";const Ha=()=>useContext(Ra);function $a(e){if(e&&e.errorHandling&&"function"!=typeof e.errorHandling&&"log"!==e.errorHandling&&"silent"!==e.errorHandling&&"throw"!==e.errorHandling)throw new Error('Invalid options passed to createRegistry. Prop errorHandling should be ["log" | "silent" | "throw" | (err) => void], but '+typeof e.errorHandling+" was passed");var t=e&&"function"==typeof e.errorHandling&&e.errorHandling,n={};function i(n,i){var o=n instanceof Error?n:new Error(n);if(t)t(o);else {var r='[ERROR] callback-registry: User callback for key "'+i+'" failed: '+o.stack;if(e)switch(e.errorHandling){case "log":return console.error(r);case "silent":return;case "throw":throw new Error(r)}console.error(r);}}return {add:function(e,t,o){var r=n[e];return r||(r=[],n[e]=r),r.push(t),o&&setTimeout((function(){o.forEach((function(o){var r;if(null===(r=n[e])||void 0===r?void 0:r.includes(t))try{Array.isArray(o)?t.apply(void 0,o):t.apply(void 0,[o]);}catch(t){i(t,e);}}));}),0),function(){var i=n[e];i&&(i=i.reduce((function(e,n,i){return n===t&&e.length===i||e.push(n),e}),[]),0===i.length?delete n[e]:n[e]=i);}},execute:function(e){for(var t=[],o=1;o<arguments.length;o++)t[o-1]=arguments[o];var r=n[e];if(!r||0===r.length)return [];var a=[];return r.forEach((function(n){try{var o=n.apply(void 0,t);a.push(o);}catch(t){a.push(void 0),i(t,e);}})),a},clear:function(){n={};},clearKey:function(e){n[e]&&delete n[e];}}}$a.default=$a;y($a);const Ua=createContext({config:{env:"",region:"",version:"",buildVersion:"",theme:"",isError:false,mailingList:"",createJiraTicket:true,sendEmail:false,attachments:[],applicationTitle:"",allowEditRecipients:true,attachmentsViewMode:"category",environmentInfo:"",selectedCategories:[],errorMessage:"",showEnvironmentInfo:false,context:{},technicalInfo:"",sendEmailClient:"Outlook"},onThemeChanged:e=>{},openUrl:()=>{},submit:()=>Promise.resolve({}),setBounds:()=>{},close:e=>{},showMailingList:true,setShowMailingList:()=>{},attachmentCategories:[],submitInProgress:false,setSubmitInProgress:()=>{},submitStatus:{type:"success",title:"",text:""},setSubmitStatus:()=>{},submitCompleted:false,setSubmitCompleted:()=>{},jiraTicketURL:"",setJiraTicketURL:()=>{},submitFeedback:()=>{}}),Wa=()=>useContext(Ua);function Ja({...n}){const{config:i,close:o}=Wa(),{applicationTitle:r}=i;return jsxRuntimeExports.jsxs(q,{draggable:true,...n,children:[jsxRuntimeExports.jsx(q.Title,{tag:"h1",text:r?`Feedback Form - ${r}`:"Feedback Form",size:"large"}),jsxRuntimeExports.jsx(q.ButtonGroup,{className:"non-draggable",children:jsxRuntimeExports.jsx(q.ButtonIcon,{variant:"circle",icon:"close",size:"32",onClick:()=>o()})})]})}function Ka({className:n,handleSubmit:i,...o}){const r=k("io-panel-body",n),{config:a,submitFeedback:s}=Wa(),{IntroField:l,DescriptionField:c,TechInfoField:u,EnvInfoField:d,FileAttachmentsField:f,CategoryAttachmentsField:m,SettingsField:h,MailListField:p}=fs(),g=i??s,v=`Your feedback will be submitted to the ${a.buildVersion} team and some additional information will be automatically included to help us examine your issue.`;return jsxRuntimeExports.jsxs("form",{className:r,id:"feedback",onSubmit:e=>g(e),...o,children:[jsxRuntimeExports.jsx(l,{children:jsxRuntimeExports.jsx("p",{children:v})}),jsxRuntimeExports.jsx(h,{}),jsxRuntimeExports.jsx(p,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{readOnly:true}),jsxRuntimeExports.jsx(d,{readOnly:true}),"file"===a.attachmentsViewMode?jsxRuntimeExports.jsx(f,{}):jsxRuntimeExports.jsx(m,{})]})}function Ga({...n}){const{FooterButtons:i}=fs(),{openUrl:o,submitInProgress:r,submitStatus:a,jiraTicketURL:s}=Wa();return jsxRuntimeExports.jsx(Z,{...n,children:jsxRuntimeExports.jsxs("div",r?{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsx(I,{children:jsxRuntimeExports.jsx("p",{children:a.title})}),jsxRuntimeExports.jsx(Ti,{align:"right",size:"small"})]}:{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsxs(I,{children:[jsxRuntimeExports.jsx("p",{className:"error"===a.type?"io-text-error":"",children:a.title}),s&&jsxRuntimeExports.jsx("a",{href:s,onClick:e=>{e.preventDefault(),o(s);},children:s})]}),jsxRuntimeExports.jsx(i,{})]})})}function qa({className:t,...n}){const{CloseButton:i}=fs(),{close:o}=Wa();return jsxRuntimeExports.jsx(G,{className:t,...n,children:jsxRuntimeExports.jsx(i,{onClick:()=>o()})})}function Qa({className:n,...i}){const{SubmitButton:o,CancelButton:r,CloseButton:a}=fs(),{close:s,submitCompleted:l}=Wa();return l?jsxRuntimeExports.jsx(G,{className:n,...i,children:jsxRuntimeExports.jsx(a,{text:"Close",onClick:()=>s()})}):jsxRuntimeExports.jsxs(G,{className:n,...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{onClick:()=>s()})]})}function Xa({text:t="Submit",...n}){return jsxRuntimeExports.jsx(M,{form:"feedback",type:"submit",variant:"primary",text:t,...n})}function Za({text:t="Cancel",...n}){return jsxRuntimeExports.jsx(M,{variant:"link",text:t,...n})}function es({...t}){return jsxRuntimeExports.jsx(M,{variant:"primary",...t})}function ts({showField:t=true,className:n,title:i,hint:o,children:r,...a}){return t?jsxRuntimeExports.jsx(I,{className:n,title:i,hint:o,...a,children:r}):null}function ns({showField:t=true,className:n,title:i="Description",hint:o,readOnly:r=false,disabled:a,...s}){return t?jsxRuntimeExports.jsx(I,{className:n,hint:o,title:"",...s,children:jsxRuntimeExports.jsx(ji,{id:"description",name:"description",label:i,readOnly:r,disabled:a})}):null}function is({showField:t,className:n,title:i="Technical Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=Wa(),u=t??c.errorMessage,d=r??c.errorMessage;return u&&d?jsxRuntimeExports.jsx(I,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(ji,{id:"errorMessage",name:"errorMessage",label:i,value:d,readOnly:a,disabled:s})}):null}function os({showField:t,className:n,title:i="Environment Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=Wa(),u=t??c.showEnvironmentInfo,d=r??c.environmentInfo;return u&&d?jsxRuntimeExports.jsx(I,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(ji,{id:"environmentInfo",name:"environmentInfo",label:i,value:d,readOnly:a,disabled:s})}):null}function rs({showField:t=true,className:n,title:i="Attachments",hint:o,readOnly:a=false,disabled:s,attachments:l,selectedCategories:c,...u}){const d=k("io-block-list-gap",n),{config:f}=Wa(),m=l??f.attachments,h=c??f.selectedCategories,p=useCallback((e=>!!h&&-1!==h.indexOf(e)),[h]);return t?!m||m.length<=0?jsxRuntimeExports.jsx(I,{title:"Attachments",children:jsxRuntimeExports.jsx("p",{children:"No Attachments"})}):jsxRuntimeExports.jsx(I,{className:d,title:i,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"file-attachments",children:m.map((t=>jsxRuntimeExports.jsx(zi,{id:t.id,name:t.id,label:t.name,readOnly:a,disabled:s,defaultChecked:p(t.category)},t.id)))})}):null}function as({showField:t=true,className:n,title:i="Attachments",hint:o,readOnly:a=false,disabled:s,categories:l,selectedCategories:c,...u}){const{config:d,attachmentCategories:f}=Wa(),m=l??f,h=c??d.selectedCategories,p=useCallback((e=>!!h&&-1!==h.indexOf(e)),[h]);return t?!m||m.length<=0?jsxRuntimeExports.jsx("p",{children:"No Attachments"}):jsxRuntimeExports.jsx(I,{className:n,title:i,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"category-attachments",children:m.map((t=>jsxRuntimeExports.jsx(Vi,{id:t,name:t,align:"right",label:t,readOnly:a,disabled:s,defaultChecked:p(t)},t)))})}):null}function ss({className:n,title:i,hint:o,showField:r=true,showJiraTicketField:a,jiraTicketLabel:s="Create Jira Ticket",showSendEmailField:l,sendEmailLabel:c="Send Email",readOnly:u=false,disabled:d,...f}){const m=k("io-block-list-gap",n),{config:h,showMailingList:p,setShowMailingList:g}=Wa();if(!r)return null;const v=a??h.createJiraTicket,y=l??h.sendEmail;return jsxRuntimeExports.jsxs(I,{className:m,hint:o,title:i,...f,children:[v&&jsxRuntimeExports.jsx(Vi,{id:"createJiraTicket",name:"createJiraTicket",label:s,align:"right",readOnly:u,disabled:d,defaultChecked:v}),y&&jsxRuntimeExports.jsx(Vi,{onChange:()=>{g(!p);},id:"sendEmail",name:"sendEmail",label:c,align:"right",readOnly:u,disabled:d,defaultChecked:y})]})}function ls({showField:t=true,className:n,title:i="Email List",hint:o="Separate with commas or semicolons.",placeholder:r="john.doe@somedomain.com; jane.doe@otherdomain.com",readOnly:a,disabled:s,...l}){const{config:c,showMailingList:u}=Wa(),d=t??c.sendEmail,f=a??false===c.allowEditRecipients;return d&&u?jsxRuntimeExports.jsx(I,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(Hi,{id:"mailingList",name:"mailingList",label:i,placeholder:r,readOnly:f,disabled:s,defaultValue:c.mailingList??""})}):null}const cs={Header:Ja,Body:Ka,Footer:Ga,HeaderButtons:qa,FooterButtons:Qa,SubmitButton:Xa,CancelButton:Za,CloseButton:es,IntroField:ts,DescriptionField:ns,TechInfoField:is,EnvInfoField:os,FileAttachmentsField:rs,CategoryAttachmentsField:as,SettingsField:ss,MailListField:ls},us=createContext(cs),ds=memo((({children:t,components:n})=>{const i=useMemo((()=>({...cs,...n})),[n]);return jsxRuntimeExports.jsx(us.Provider,{value:i,children:t})}));function fs(e){return {...useContext(us),...e}}ds.displayName="ComponentsStore";function ps({className:n,title:i="General",...o}){const r=k("io-notifications-settings-panel-general",n),{AllowNotifications:a,ShowNotificationBadge:s,CloseNotificationOnClick:l,PanelAutoHide:c,HideToastsAfter:u}=ol(),d=eo();return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[d&&jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),d&&jsxRuntimeExports.jsx(l,{}),d&&jsxRuntimeExports.jsx(c,{}),d&&jsxRuntimeExports.jsx(u,{})]})})}function vs(e){const t=useContext(IOConnectContext),n=t?.appManager,i=eo(),[o,a]=useState([]),[d,f]=useState(0),m="Platform",h=useCallback(((e="asc")=>{if(null===i)return [];const t=[...o].sort(((t,n)=>{const i=(t.title??t.name).toLowerCase(),o=(n.title??n.name).toLowerCase();return "asc"===e?i.localeCompare(o):o.localeCompare(i)}));if(!i){const e=t.findIndex((e=>e.name===m));if(-1!==e){const[n]=t.splice(e,1);t.unshift(n);}}return t}),[o,i]),p=useMemo((()=>h("asc")),[h]),g=useMemo((()=>h("desc")),[h]);useEffect((()=>{if(null===i||i)return;const e={title:"System",name:m,hidden:false,userProperties:{hidden:false}};a((t=>t.some((t=>t.name===e.name))?t:[...t,e]));}),[i]),useEffect((()=>{if(!n)return;const e=n.onAppAdded((e=>{a((t=>[...t,{title:e.title,name:e.name,hidden:e.hidden,userProperties:e.userProperties}]));})),t=n.onAppRemoved((e=>{a((t=>t.filter((t=>t.name!==e.name))));})),i=n.onAppChanged((e=>{a((t=>{const n=t.find((t=>t.name===e.name));return [...t.filter((t=>t.name!==e.name)),{title:e.title,name:n?.name,hidden:n?.hidden,allowed:n?.allowed,userProperties:n?.userProperties}]}));}));return ()=>{e(),t(),i();}}),[n]);return {apps:useMemo((()=>{if(!e?.sourceFilter||!Array.isArray(o))return o;const{allowed:t=[],blocked:n=[]}=e.sourceFilter,i=t.includes("*"),r=n.includes("*");let a=0;const s=o.map((e=>{const n=i||t.includes(e.name),o=!r&&n;return o&&a++,{...e,allowed:o}}));return f(a),s}),[e,o]),allowedApps:d,sortedAppsAsc:p,sortedAppsDesc:g,sortAppsAlphabetically:h}}const bs="newest",ks="oldest",Cs="severity",Ns=["None","Low","Medium","High","Critical"],Ss={key:bs,descending:true};const Ms=createContext({allApps:[],settings:{},configuration:{},notifications:[],notificationsCount:0,onClose:()=>{},allApplications:0,clearAll:()=>{},showPanel:()=>{},hidePanel:()=>{},saveFilter:()=>{},clearAllOld:()=>{},notificationStacks:[],saveSetting:()=>{},allowedApplications:0,saveAllFilter:()=>{},isBulkActionsSupported:false,selectedNotifications:[],selectNotification:()=>{},selectAllNotifications:()=>{},clearMany:()=>{},snooze:()=>{},snoozeMany:()=>{},setState:()=>{},setStates:()=>{},setCount:()=>{}}),As=()=>useContext(Ms);function Ts({label:t="Allow notifications",align:n="right",...i}){const{settings:o,saveSetting:a}=As(),s=eo(),l=useCallback((e=>{a({enabledNotifications:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Vi,{label:t,align:n,onChange:l,checked:o.enabledNotifications??false,...i}):null}function Ps({label:t="Show notification badge",align:n="right",...i}){const{settings:o,saveSetting:a}=As(),s=eo()&&!o.enabledNotifications,l=useCallback((e=>{a({showNotificationBadge:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Vi,{label:t,align:n,onChange:l,checked:o.showNotificationBadge??false,disabled:s,...i})}function Os({label:t="Close notification on click",align:n="right",...i}){const{settings:o,saveSetting:a}=As(),s=eo(),l=s&&!o.enabledNotifications,c=useCallback((e=>{a({closeNotificationOnClick:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Vi,{label:t,align:n,onChange:c,checked:o.closeNotificationOnClick??false,disabled:l,...i}):null}function Ls({label:t="Auto hide panel",align:n="right",...i}){const{settings:o,saveSetting:a}=As(),s=eo(),l=useCallback((e=>{a({autoHidePanel:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Vi,{label:t,align:n,onChange:l,checked:o.autoHidePanel??false,...i}):null}function Fs({label:t="Panel always on top",align:n="right",...i}){const{settings:o,saveSetting:a}=As(),s=useCallback((e=>{a({alwaysOnTop:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Vi,{label:t,align:n,onChange:s,checked:o.alwaysOnTop??false,...i})}const Bs=(e,t)=>e?`${e} ${t}${1!==e?"s":""}`:"",Rs=e=>{const t=Math.floor(e/60),n=e%60,i=Bs(t,"minute"),o=Bs(n,"second");return i+(i&&o?" ":"")+o};function _s({className:n,title:i="Hide toasts after",items:o=[15,30,45,60],...a}){const s=k("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=As(),u=eo(),d=u&&!l.enabledNotifications,f=useCallback(((e=15e3)=>{l.toastExpiry!==e&&c({toastExpiry:1e3*e});}),[l.toastExpiry,c]);return u?jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(d?"io-text-disabled":""),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(K,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx(K.Button,{text:Rs((l.toastExpiry??0)/1e3)}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{variant:"single",children:o.map((t=>jsxRuntimeExports.jsx(K.Item,{onClick:()=>{f(t);},children:Rs(t)},t)))})})]})]}):null}function Hs({className:n,title:i="Highlight new for",...o}){const r=k("flex","jc-between","ai-center",n),{settings:a}=As(),s=eo()&&!a.enabledNotifications,l=["30 seconds","1 minute","5 minutes","Never"];return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":s}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(K,{variant:"light",disabled:s,children:[jsxRuntimeExports.jsx(K.Button,{text:l[0]}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{variant:"single",children:l.map((t=>jsxRuntimeExports.jsx(K.Item,{children:t},t)))})})]})]})}function js({className:n,title:i="Mark as read after",...o}){const r=k("flex","jc-between","ai-center",n),{settings:a}=As(),s=eo()&&!a.enabledNotifications,l=["1 minute","5 minutes","Never"];return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":s}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(K,{variant:"light",disabled:s,children:[jsxRuntimeExports.jsx(K.Button,{text:l[0]}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{variant:"single",children:l.map((t=>jsxRuntimeExports.jsx(K.Item,{children:t},t)))})})]})]})}function zs({className:n,title:i="Stacking",...o}){const r=k("io-notifications-settings-panel-stacking",n),{ToastStacking:a,ToastStackBy:s}=ol();return eo()?jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function $s({label:t="Allow toast stacking",align:n="right",...i}){const{settings:o,saveSetting:a}=As(),s=eo(),l=s&&!o.enabledNotifications,c=useCallback((e=>{a({toastStacking:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Vi,{label:t,align:n,onChange:c,checked:o.toastStacking??false,disabled:l,...i}):null}const Vs=e=>e.replace(/(^|-)\w/g,(e=>e.toUpperCase().replace("-"," ")));function Ys({className:n,title:i="Group by",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=As(),c=eo(),u=c&&!s.enabledNotifications,d=useCallback((e=>{e||(e="severity"),s.stackBy!==e&&l({stackBy:e.toLowerCase()});}),[s.stackBy,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":u}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(K,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx(K.Button,{text:s.stackBy?Vs(s.stackBy):"Severity"}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{variant:"single",children:["Severity","Application"].map((t=>jsxRuntimeExports.jsx(K.Item,{onClick:()=>{d(t);},children:t},t)))})})]})]})}function Us({className:n,title:i="Placement",...o}){const r=k("io-notifications-settings-panel-placement",n),{PlacementPanel:a,PlacementToasts:s}=ol();return eo()?jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function Ws({className:n,title:i="Panel position",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=As(),c=eo(),u=useCallback((e=>{e||(e="right"),s.placement?.panel!==e&&l({placement:{...s.placement,panel:e.toLowerCase()}});}),[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(K,{variant:"light",children:[jsxRuntimeExports.jsx(K.Button,{text:s.placement?.panel?Vs(s.placement?.panel):"Right"}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{variant:"single",children:["Right","Left"].map((t=>jsxRuntimeExports.jsx(K.Item,{onClick:()=>{u(t);},children:t},t)))})})]})]})}function Js({className:n,title:i="Toasts position",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=As(),c=eo(),u=useCallback((e=>{if(e||(e="bottom-right"),s.placement?.toasts===e)return;const t=e.replace(/\s+/g,"-").toLowerCase();l({placement:{...s.placement,toasts:t}});}),[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(K,{variant:"light",children:[jsxRuntimeExports.jsx(K.Button,{text:s.placement?.toasts?Vs(s.placement?.toasts):"Bottom Right"}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{variant:"single",children:["Top Right","Top Left","Bottom Right","Bottom Left"].map((t=>jsxRuntimeExports.jsx(K.Item,{onClick:()=>{u(t);},children:t},t)))})})]})]})}function Ks({className:t,title:n="Snooze",...i}){const o=k("io-notifications-settings-panel-snooze",t),{SnoozeDuration:r}=ol(),{settings:a}=As();return eo()&&a.snooze?.enabled?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsx(I,{title:n,children:jsxRuntimeExports.jsx(r,{})})}):null}function Gs({className:n,title:i="Default duration",items:o=[60,120,180,300],...a}){const s=k("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=As(),u=eo(),d=u&&!l.enabledNotifications,f=useCallback(((e=6e4)=>{l.snooze&&l.snooze?.duration!==e&&c({snooze:{...l.snooze,duration:1e3*e}});}),[l.snooze,c]);return u&&l.snooze?.enabled?jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":d}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(K,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx(K.Button,{text:Rs((l.snooze?.duration??0)/1e3)}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{variant:"single",children:o.map((t=>jsxRuntimeExports.jsx(K.Item,{onClick:()=>{f(t);},children:Rs(t)},t)))})})]})]}):null}function qs({className:n,title:i,...o}){const r=k("io-notifications-settings-panel-subscriptions",n),{SubscribeAll:a,SubscribeApp:s,SubscribeMuteAll:l,SubscribeMuteApp:c}=ol(),{sortAppsAlphabetically:u}=vs(),d=eo(),f=u(),m="io-notifications-subscriptions-grid "+(d?"with-three-columns":"with-two-columns");return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i??(d?"Subscribe & Mute":"Subscribe"),children:[jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Sources"}),jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Subscribe"}),d&&jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Mute"})]}),jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:"All Sources"}),jsxRuntimeExports.jsx(a,{label:""}),d&&jsxRuntimeExports.jsx(l,{label:""})]}),f.map((n=>!n||n.hidden||n?.userProperties?.hidden?null:jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:n.title??n.name}),jsxRuntimeExports.jsx(s,{app:n,label:""}),d&&jsxRuntimeExports.jsx(c,{app:n,label:""})]},n.name)))]})})}function Qs({label:t="All apps",align:n="right",...i}){const{settings:o,configuration:a,saveAllFilter:s}=As(),l=eo()&&!o.enabledNotifications,c=useCallback((e=>{s({subscribe:e.target.checked});}),[s]);return jsxRuntimeExports.jsx(Vi,{align:n,label:t,onChange:c,checked:(a.sourceFilter?.allowed?.includes("*")&&0===a.sourceFilter?.blocked?.length)??false,disabled:l,...i})}function Xs({label:t="App",align:n="right",app:i,...o}){const{allApps:a,settings:s,configuration:l,saveFilter:c}=As(),u=eo()&&!s.enabledNotifications,d=useCallback(((e,t)=>{const n={...l.sourceFilter},i=n.allowed?.indexOf("*");"number"==typeof i&&i>-1&&(n.allowed?.splice(i,1),a.forEach((e=>{e.name!==t.name&&n.allowed?.push(e.name);}))),e?(n.allowed=[...new Set([...n.allowed??[],t.name])],n.blocked=n.blocked?.filter((e=>e!==t.name))):(n.allowed=n.allowed?.filter((e=>e!==t.name)),n.blocked=[...new Set([...n.blocked??[],t.name])]),n.allowed?.length&&n.blocked?.includes("*")&&n.blocked.splice(n.blocked.indexOf("*"),1),c(n);}),[a,l.sourceFilter,c]);return jsxRuntimeExports.jsx(Vi,{id:i.name,label:t,align:n,onChange:e=>d(e.target.checked,i),checked:(l.sourceFilter?.allowed?.includes("*")&&!l.sourceFilter?.blocked?.includes(i.name)||l.sourceFilter?.allowed?.includes(i.name))??false,disabled:u,...o})}function Zs({label:t="Mute all",align:n="right",...i}){const{settings:o,configuration:a,saveAllFilter:s}=As(),l=eo(),c=l&&(!o.enabledNotifications||-1===a.sourceFilter?.allowed?.indexOf("*")),u=useCallback((e=>{s({mute:e.target.checked});}),[s]);return l?jsxRuntimeExports.jsx(Vi,{align:n,label:t,onChange:u,checked:a.sourceFilter?.muted?.includes("*")??false,disabled:c??false,...i}):null}function el({label:t="App",align:n="right",app:i,...o}){const{allApps:a,settings:s,configuration:l,saveFilter:c}=As(),u=eo(),d=u&&(!s.enabledNotifications||l.sourceFilter?.blocked?.includes("*")||l.sourceFilter?.blocked?.includes(i.name)||0===l.sourceFilter?.allowed?.length||-1===l.sourceFilter?.allowed?.indexOf(i.name)&&-1===l.sourceFilter?.allowed?.indexOf("*")&&0===l.sourceFilter?.blocked?.length),f=useCallback(((e,t)=>{const n={...l.sourceFilter},i=n?.muted?.indexOf("*");"number"==typeof i&&i>-1&&(n.muted?.splice(i,1),a.forEach((e=>{e.name===t.name||e.hidden||n.muted?.push(e.name);}))),e?n.muted?.push(t.name):n.muted=n.muted?.filter((e=>e!==t.name)),c(n);}),[a,l.sourceFilter,c]);return !u||i.hidden?null:jsxRuntimeExports.jsx(Vi,{id:i.name,label:t,align:n,onChange:e=>f(e.target.checked,i),checked:(l.sourceFilter?.muted?.includes("*")||l.sourceFilter?.muted?.includes(i.name))??false,disabled:d??false,...o})}const tl={Body:n=>{const{General:i,Placement:o,Stacking:r,Snooze:a,Subscriptions:s}=ol();return jsxRuntimeExports.jsxs(Oi,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},General:ps,AllowNotifications:Ts,ShowNotificationBadge:Ps,CloseNotificationOnClick:Os,PanelAutoHide:Ls,PanelAlwaysOnTop:Fs,HideToastsAfter:_s,MarkAsNew:Hs,MarkAsRead:js,Stacking:zs,ToastStacking:$s,ToastStackBy:Ys,Placement:Us,PlacementPanel:Ws,PlacementToasts:Js,Snooze:Ks,SnoozeDuration:Gs,Subscriptions:qs,SubscribeAll:Qs,SubscribeApp:Xs,SubscribeMuteAll:Zs,SubscribeMuteApp:el},nl=createContext(tl),il=memo((({children:t,components:n})=>{const i=useMemo((()=>({...tl,...n})),[n]);return jsxRuntimeExports.jsx(nl.Provider,{value:i,children:t})}));il.displayName="NotificationsSettingsPanelComponentsStoreProvider";const ol=()=>useContext(nl);const ll=createContext({searchQuery:"",setSearch:()=>{},isPanelVisible:false,sortNotificationsBy:"newest",setSortBy:()=>{},viewNotificationsBy:"all",setViewBy:()=>{},isBulkActionsVisible:false,showBulkActions:()=>{},hideBulkActions:()=>{}}),cl=()=>useContext(ll);function ul({title:n,onClose:i,onOpenSettings:o,...r}){const{HeaderCaptionTitle:a,HeaderCaptionCount:s,HeaderCaptionButtonSettings:l,HeaderCaptionButtonClose:c,HeaderActions:u,HeaderBulkActions:d,HeaderSearch:f}=Kl(),{isBulkActionsSupported:m,notificationsCount:h}=As(),{isBulkActionsVisible:p}=cl(),g=eo();return jsxRuntimeExports.jsxs(Pi,{...r,children:[jsxRuntimeExports.jsxs("div",{className:"io-panel-header-caption",children:[jsxRuntimeExports.jsx(a,{title:n}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsxs(Pi.ButtonGroup,{children:[g&&jsxRuntimeExports.jsx(l,{onClick:o}),jsxRuntimeExports.jsx(c,{onClick:i})]})]}),m?jsxRuntimeExports.jsxs("div",{className:`io-panel-header-actions-wrapper ${p&&h>0?"io-panel-header-bulk-actions-opened":""} `,children:[jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]}):jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(f,{})]})}function dl({text:n="Notifications",counter:i,...o}){const{notificationsCount:r}=As();return jsxRuntimeExports.jsx(E,{text:n,size:"large",...o,children:(i??true)&&jsxRuntimeExports.jsxs("span",{children:["(",r,")"]})})}const fl=e=>[...e].sort(((e,t)=>(t.timestamp||0)-(e.timestamp||0))),ml=e=>[...e].sort(((e,t)=>(e.timestamp||0)-(t.timestamp||0))),hl=(e,t)=>{const n=Ns[0];return [...e].sort(((e,i)=>{const o=Ns.indexOf(e.severity||n),r=Ns.indexOf(i.severity||n);return (t?-1:1)*(o-r)}))},pl={[bs]:fl,[ks]:ml,[Cs]:hl};function gl({...t}){const[n,i]=useState([]),{NotificationsList:o,Notification:r}=Kl(),{notifications:a,setCount:s,notificationsCount:f}=As(),{sortNotificationsBy:m,viewNotificationsBy:h,searchQuery:p}=cl(),g=useRef(null),v=Ki(p),y=useMemo((()=>{const e=((e,t)=>{if(!e)return [];switch(t){case "all":default:return e;case "unread":return e.filter((e=>"Active"===e.state||"Stale"===e.state));case "read":return e.filter((e=>"Acknowledged"===e.state||"Seen"===e.state));case "snoozed":return e.filter((e=>"Snoozed"===e.state))}})(a,h);return e.filter((e=>e.title.toLowerCase().includes(v.toLowerCase())||e.source?.toLowerCase().includes(v.toLowerCase())||e.body?.toLowerCase().includes(v.toLowerCase())))}),[v,a,h]);return useEffect((()=>{switch(m){case "newest":i(fl(y));break;case "oldest":i(ml(y));break;case "severity":i(hl(y,true));break;default:i(y);}s(y.length);}),[y,m,s]),useEffect((()=>{g.current&&g.current?.scrollTo({top:0,behavior:"smooth"});}),[v,f,m,h]),jsxRuntimeExports.jsx(Oi,{ref:g,...t,children:jsxRuntimeExports.jsx(o,{notifications:n,Notification:r})})}function vl({...t}){const{FooterButtons:n}=Kl();return jsxRuntimeExports.jsx(Li,{...t,children:jsxRuntimeExports.jsx(n,{})})}function yl({className:n,...i}){const{FooterButtonClearAll:o,FooterButtonClearAllOld:r}=Kl(),{notifications:a}=As(),[s,c]=useState(false);return useEffect((()=>{a.filter((e=>"Stale"===e.state||"Acknowledged"===e.state)).length>0?c(true):c(false);}),[a]),jsxRuntimeExports.jsxs(G,{className:n,align:"right",...i,children:[jsxRuntimeExports.jsx(r,{disabled:!s}),jsxRuntimeExports.jsx(o,{disabled:a.length<=0})]})}function wl({text:t="Clear All",...n}){const{clearAll:i}=As();return jsxRuntimeExports.jsx(M,{text:t,onClick:()=>{i();},...n})}function bl({text:t="Clear Old",...n}){const{clearAllOld:i}=As();return jsxRuntimeExports.jsx(M,{text:t,onClick:()=>{i();},...n})}function kl({className:n,notification:i,...o}){const r=k("io-notification-header",n),{HeaderCount:a,HeaderBadge:s,HeaderTitle:l,HeaderTimestamp:c,HeaderButtonSnooze:u,HeaderButtonClose:d}=_l();return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx(s,{notification:i}),jsxRuntimeExports.jsx(a,{notification:i}),jsxRuntimeExports.jsx(l,{notification:i}),jsxRuntimeExports.jsx(c,{notification:i}),jsxRuntimeExports.jsxs(G,{children:[jsxRuntimeExports.jsx(u,{notification:i}),jsxRuntimeExports.jsx(d,{notification:i})]})]})}function Cl({notification:t,...n}){const{settings:i,notificationStacks:o}=As(),{isPanelVisible:r}=cl(),{toastStacking:a,stackBy:s}=i,l="application"===s?"source":s??"source";let c;if(a){const e=o.find((e=>e.key===t[l]));c=e?.items.length??0;}return a&&!r&&c&&c>1?jsxRuntimeExports.jsx(D,{...n,children:c<10?c:"9+"}):null}function Nl({className:n,notification:i,...o}){if(!i?.severity||"None"===i.severity)return null;const r=k("io-notification-header-badge",n);return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx(C,{variant:((e="None")=>{switch(e.toLowerCase()){case "low":case "medium":case "none":default:return "circle-info";case "high":return "triangle-exclamation";case "critical":return "ban"}})(i.severity),size:"12"}),i.severity]})}function Sl({className:n,state:i,severity:o="None",icon:r,...a}){const s=k("io-notification-header-icon",n),{isPanelVisible:l}=cl();return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[r&&jsxRuntimeExports.jsx("span",{className:"io-notification-header-icon-image",children:jsxRuntimeExports.jsx("img",{src:r,alt:`io-notification-header-icon-${r}`})}),jsxRuntimeExports.jsx("span",{className:`io-notification-header-icon-badge color-${o.toLowerCase()}`,children:l&&"Acknowledged"!==i&&"New"})]})}function xl({className:t,notification:{appTitle:n},...i}){const o=k("io-notification-header-title",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function Dl({className:t,notification:{timestamp:n,state:i,snooze:o},...r}){const a=k("io-notification-timestamp",t);return jsxRuntimeExports.jsx("small",o&&"Snoozed"===i?{className:a,...r,children:"Snoozed"}:{className:a,...r,children:Sa(n??0)??"Just Now"})}function El({notification:{id:t,state:n},...i}){const{settings:o,snooze:a}=As(),s=useCallback((e=>{e.stopPropagation(),a&&a(t,o.snooze?.duration??0);}),[t,a,o.snooze?.duration]);return a&&"Snoozed"!==n&&o.snooze?.enabled?jsxRuntimeExports.jsx(M,{icon:"snooze",variant:"link",text:"Snooze",tabIndex:-1,onClick:s,...i}):null}function Il({notification:{id:t,updateState:n},...i}){const o=eo(),{onClose:a}=As(),{isPanelVisible:s}=cl(),l=useCallback((e=>{e.stopPropagation(),!o||s?a(t):n("Acknowledged").catch(console.error);}),[o,t,a,s,n]);return jsxRuntimeExports.jsx(N,{icon:"close",iconSize:"10",size:"24",tabIndex:-1,onClick:l,...i})}function Ml({className:n,notification:i,...o}){const a=k("io-notification-body",n),s=eo(),{BodyIcon:l,BodyTitle:c,BodyDescription:u}=_l(),{id:d,icon:f,title:m,body:h,onClick:p,updateState:g}=i,{settings:v,onClose:y}=As(),{isPanelVisible:w}=cl(),b=useCallback((async()=>{if(!p)return;if(!s)return void y(d);const e=!v?.toastStacking&&null,t=w?v?.closeNotificationOnClick??true:e;null!==t?await p({close:t}).catch(console.error):(await p({close:false}).catch(console.error),await g("Acknowledged").catch(console.error));}),[s,d,w,p,y,g,v?.closeNotificationOnClick,v?.toastStacking]);return jsxRuntimeExports.jsxs("div",{className:a,role:"button",tabIndex:0,onKeyDown:async e=>{(e=>"Enter"===e.key||" "===e.key)(e)&&await b();},onClick:b,...o,children:[jsxRuntimeExports.jsx(l,{icon:f}),jsxRuntimeExports.jsxs("div",{className:"io-notification-body-content",children:[jsxRuntimeExports.jsx(c,{text:m}),jsxRuntimeExports.jsx(u,{text:h})]})]})}function Al({className:t,icon:n,altText:i="notification icon",...o}){if(!n)return null;const r=k("io-notification-body-icon",t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx("img",{src:n,alt:i})})}function Tl({text:t,...n}){return jsxRuntimeExports.jsx(E,{text:t,...n})}function Pl({className:t,text:n,...i}){const o=k("io-notification-body-description",t);return jsxRuntimeExports.jsx("p",{className:o,...i,children:n})}function Ol({className:n,notification:i}){const o=k("io-notification-footer",n),{FooterButton:r}=_l(),a=useMemo((()=>function(e){const t=[],n={};if(!e)return;e.forEach((e=>{const{displayId:i,displayPath:o}=e,r={...e,children:[]};if(o&&o.length>0){let e;o.forEach(((t,i)=>{0===i?e=n[t]:e&&(e=e.children?.find((e=>e.displayId===t)));})),e&&e.children?.push(r);}else i?(t.push(r),n[i]=r):t.push(r);i&&(n[i]=r);}));const i=e=>{e.forEach((e=>{e.children&&0===e.children.length?delete e.children:e.children&&i(e.children);}));};return i(t),t}(i.actions)),[i.actions]),s=(t,n)=>t.children?jsxRuntimeExports.jsx(Mi,{text:t.title,children:t.children.map(s)},`${t.title}-${n}`):((t,n)=>jsxRuntimeExports.jsx(Mi.Item,{children:jsxRuntimeExports.jsx(r,{variant:"link",className:"io-dropdown-menu-item io-dropdown-menu-button",notificationAction:t,notificationId:i.id})},`${t.title}-${n}`))(t,n);return jsxRuntimeExports.jsx("div",{className:o,children:jsxRuntimeExports.jsx(G,{align:"right",children:a?.map(((n,o)=>n.children?jsxRuntimeExports.jsxs(G,{variant:"append",children:[jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"default",notificationId:i.id}),jsxRuntimeExports.jsx(Mi,{variant:0===o?"primary":"default",icon:"ellipsis",children:n.children.map(s)})]},`${n.title}-${o}`):jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"link",notificationId:i.id},`${n.title}-${o}`)))})})}function Ll({notificationAction:t,...n}){const i=useCallback((e=>{e.stopPropagation(),t.onClick({close:true});}),[t]);return jsxRuntimeExports.jsx(M,{text:t.title,onClick:i,...n})}const Fl={Header:kl,HeaderCount:Cl,HeaderBadge:Nl,HeaderIcon:Sl,HeaderTitle:xl,HeaderTimestamp:Dl,HeaderButtonSnooze:El,HeaderButtonClose:Il,Body:Ml,BodyIcon:Al,BodyTitle:Tl,BodyDescription:Pl,Footer:Ol,FooterButton:Ll},Bl=createContext(Fl),Rl=memo((({children:t,components:n})=>{const i=useMemo((()=>({...Fl,...n})),[n]);return jsxRuntimeExports.jsx(Bl.Provider,{value:i,children:t})}));function _l(e){return {...useContext(Bl),...e}}function Hl({className:n,notification:i,...o}){const{Header:r,Body:a,Footer:s}=_l(),{severity:l}=i,c=k("io-notification",`severity-${l?.toLowerCase()??"none"}`,"Acknowledged"!==i.state&&"state-new",n);return jsxRuntimeExports.jsxs("div",{className:c,...o,children:[jsxRuntimeExports.jsx(r,{notification:i}),jsxRuntimeExports.jsx(a,{notification:i}),jsxRuntimeExports.jsx(s,{notification:i})]})}function jl({components:t,notification:n,...i}){return jsxRuntimeExports.jsx(Rl,{components:t,children:jsxRuntimeExports.jsx(Hl,{notification:n,...i})})}function zl({className:n,notifications:i,...o}){const[a,s]=useState(false),c=i.length>=3?"large":"normal",u=2===i.length?"small":c,d=i[0].severity,f=k("io-notification-stack",a&&"io-notification-stack-open","normal"!==u&&[`io-notification-stack-${u}`],d&&"None"!==d&&[`io-notification-stack-${d.toLowerCase()}`],n),m=useCallback((()=>{s(true);}),[]),h=useCallback((e=>{e.stopPropagation(),i.forEach((e=>{e.close();}));}),[i]);return jsxRuntimeExports.jsxs("div",{className:f,onClick:m,...o,children:[a&&"normal"!==u&&jsxRuntimeExports.jsx("div",{className:"io-notification-stack-btn",children:jsxRuntimeExports.jsx(M,{icon:"close",onClick:e=>h(e),children:jsxRuntimeExports.jsx("span",{className:"io-btn-text",children:"Clear All"})})}),i.map((t=>jsxRuntimeExports.jsx(jl,{notification:t},t.id)))]})}function $l({...t}){const{notificationStacks:i}=As();return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:i.map((n=>jsxRuntimeExports.jsx(zl,{notifications:n.items,...t},n.key)))})}Rl.displayName="ComponentsStoreProvider";const Vl=({notification:n,Notification:i,...o})=>{const{configuration:r,isBulkActionsSupported:a,selectedNotifications:s,selectNotification:l}=As(),{isPanelVisible:c,isBulkActionsVisible:u}=cl(),d=r.sourceFilter?.muted??[],f=n.source&&d.includes(n.source)||d.includes("*");if(!c&&f)return null;const m=c&&a&&u,h=s.includes(n.id);return m?jsxRuntimeExports.jsxs("div",{className:k("io-notification-list-bulk-action-item",{selected:h}),children:[jsxRuntimeExports.jsx(zi,{checked:h,onChange:e=>l(n.id,e.target.checked)}),jsxRuntimeExports.jsx(i,{notification:n,...o})]}):jsxRuntimeExports.jsx(i,{notification:n,...o})};function Yl({className:n,Notification:i,notifications:o=[],noNotificationText:r="No notifications to display",...a}){const s=k("io-notification-list",n),{settings:l}=As(),{isPanelVisible:c}=cl(),{toastStacking:u}=l,d=u&&!c,f=o.length>0;return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[d&&jsxRuntimeExports.jsx($l,{}),!d&&(f?o.map((t=>jsxRuntimeExports.jsx(Vl,{notification:t,Notification:i,...a},t.id))):jsxRuntimeExports.jsx("div",{className:"flex jc-center mt-8",children:r}))]})}const Ul={Header:ul,HeaderCaptionTitle:dl,HeaderCaptionCount:function({variant:t="primary",...n}){const{notificationsCount:i=0}=As();return 0===i?null:jsxRuntimeExports.jsx(D,{variant:t,...n,children:i>99?"99+":i})},HeaderCaptionButtonSettings:function({icon:t="cog",size:n="32",variant:i="circle",...o}){return eo()?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,...o}):null},HeaderCaptionButtonClose:function({icon:t="close",size:n="32",variant:i="circle",onClick:o,...r}){const{hidePanel:a}=As(),s=eo();return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,onClick:e=>{o?o(e):s&&a();},...r})},HeaderActions:function({className:n,...i}){const o=k("io-panel-header-actions",n),{HeaderActionSort:r,HeaderActionView:a,HeaderActionClear:s,HeaderActionEdit:l}=Kl();return jsxRuntimeExports.jsxs("div",{className:o,...i,children:[jsxRuntimeExports.jsxs(G,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]}),jsxRuntimeExports.jsxs(G,{children:[jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{})]})]})},HeaderActionSort:function({text:n="Sort by",...i}){const{sortNotificationsBy:o,setSortBy:a}=cl(),{onNotificationsSort:s}=(()=>{const{notifications:e}=As(),[t,n]=useState(Ss),{key:i,descending:o}=t,a=useMemo((()=>pl[i](e,o)),[e,i,o]),s=useCallback((e=>{n((t=>({key:e,descending:t.key!==e?Ss.descending:!t.descending})));}),[]);return {onNotificationsSort:s,sortedNotifications:a}})();return jsxRuntimeExports.jsxs(K,{variant:"light",...i,children:[jsxRuntimeExports.jsxs(K.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:o})]}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{variant:"single",checkIcon:"check",children:["Newest","Oldest","Severity"].map((t=>jsxRuntimeExports.jsx(K.Item,{isSelected:o===t.toLowerCase(),onClick:()=>{a(t.toLowerCase()),s(t.toLowerCase());},children:t},t)))})})]})},HeaderActionView:function({text:n="View",...i}){const{settings:o}=As(),{viewNotificationsBy:r,setViewBy:a}=cl(),s=o.snooze?.enabled?["All","Read","Unread","Snoozed"]:["All","Read","Unread"];return jsxRuntimeExports.jsxs(K,{variant:"light",...i,children:[jsxRuntimeExports.jsxs(K.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:r})]}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{variant:"single",checkIcon:"check",children:s.map((t=>jsxRuntimeExports.jsx(K.Item,{isSelected:r===t.toLowerCase(),onClick:()=>a(t.toLowerCase()),children:t},t)))})})]})},HeaderActionClear:function({text:t="Clear All",...n}){const{clearAll:i,notificationsCount:o}=As();return jsxRuntimeExports.jsx(M,{variant:"link",text:t,onClick:i,disabled:0===o,...n})},HeaderActionEdit:function({tooltip:t="Bulk Edit",...n}){const{isBulkActionsSupported:i,notificationsCount:o}=As(),{showBulkActions:r}=cl();return i?jsxRuntimeExports.jsx(N,{icon:"pen-to-square",title:t,size:"32",onClick:r,disabled:0===o,...n}):null},HeaderBulkActions:function({className:n,...i}){const o=k("io-panel-header-bulk-actions",n),{HeaderBulkActionSelect:r,HeaderBulkActionSelectDropdown:a,HeaderBulkActionMarkAsRead:s,HeaderBulkActionMarkAsUnread:l,HeaderBulkActionSnooze:c,HeaderBulkActionClear:u,HeaderBulkActionClose:d}=Kl(),{isBulkActionsSupported:f}=As();return f?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsxs(G,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]})}):null},HeaderBulkActionSelect:function({...t}){const{isBulkActionsSupported:n,selectedNotifications:i,selectAllNotifications:o,notificationsCount:r}=As();return n?jsxRuntimeExports.jsx(zi,{checked:r===i.length&&r>0,onChange:e=>o("all",e.target.checked),disabled:0===r,...t}):null},HeaderBulkActionSelectDropdown:function({...n}){const{isBulkActionsSupported:i,selectAllNotifications:o,notificationsCount:r}=As();return i?jsxRuntimeExports.jsxs(K,{variant:"light",...n,children:[jsxRuntimeExports.jsx(K.ButtonIcon,{variant:"default",icon:"chevron-down",size:"16",iconSize:"10",disabled:0===r}),jsxRuntimeExports.jsx(O,{children:jsxRuntimeExports.jsxs(K.List,{variant:"single",checkIcon:"check",children:[jsxRuntimeExports.jsx(K.ItemSection,{children:"Select"}),["All","Read","Unread","Snoozed"].map((t=>jsxRuntimeExports.jsx(K.Item,{onClick:()=>o(t.toLowerCase(),true),children:t},t)))]})})]}):null},HeaderBulkActionMarkAsRead:function({icon:t="envelope-open",size:n="32",variant:i="circle",tooltip:o="Mark as read",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=As(),d=useCallback((()=>{c(l,"Seen");}),[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionMarkAsUnread:function({icon:t="envelope",size:n="32",variant:i="circle",tooltip:o="Mark as unread",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=As(),d=useCallback((()=>{c(l,"Active");}),[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionSnooze:function({icon:t="snooze",size:n="32",variant:i="circle",tooltip:o="Snooze",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,snoozeMany:c,settings:u,notificationsCount:d}=As(),f=useCallback((()=>{c(l,u.snooze?.duration??0);}),[l,c,u.snooze?.duration]);return s&&u.snooze?.enabled?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:f,disabled:0===d,...a}):null},HeaderBulkActionClear:function({icon:t="trash",size:n="32",variant:i="circle",tooltip:o="Clear",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,clearMany:c,notificationsCount:u}=As(),d=useCallback((()=>{c(l);}),[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionClose:function({text:t="Done",variant:n="primary",...i}){const{isBulkActionsSupported:o,notificationsCount:r}=As(),{hideBulkActions:a}=cl();return o?jsxRuntimeExports.jsx(M,{variant:n,text:t,onClick:a,disabled:0===r,...i}):null},HeaderSearch:function({className:n,icon:i="search",placeholder:o="Search",...r}){const a=k("io-panel-header-search",n),{notificationsCount:s}=As(),{searchQuery:l,setSearch:c}=cl(),u=useRef(null);return jsxRuntimeExports.jsxs("div",{className:a,children:[jsxRuntimeExports.jsx(Hi,{ref:u,value:l,iconPrepend:i,placeholder:o,onChange:e=>c(e.target.value),...r}),l.length>0&&jsxRuntimeExports.jsx("p",{className:"io-panel-header-search-count",children:`${s} results`})]})},Body:gl,Footer:vl,FooterButtons:yl,FooterButtonClearAll:wl,FooterButtonClearAllOld:bl,Notification:jl,NotificationsList:Yl},Wl=createContext(Ul),Jl=memo((({children:t,components:n})=>{const i=useMemo((()=>({...Ul,...n})),[n]);return jsxRuntimeExports.jsx(Wl.Provider,{value:i,children:t})}));function Kl(e){return {...useContext(Wl),...e}}Jl.displayName="ComponentsStoreProvider";const Ql={Body:function({className:t,notifications:n,maxToasts:i=1,...o}){const r=k("io-toasts-body",t),{NotificationsList:a,Notification:s}=ec(),[c,d]=useState([]);return useEffect((()=>{const e=i<0?n.length:i,t=n.filter((e=>"Active"===e.state)).slice(0,e);for(const e of t)e.onShow();d(t);}),[n,i]),jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx(a,{Notification:s,notifications:c,noNotificationText:""})})},Notification:jl,NotificationsList:Yl},Xl=createContext(Ql),Zl=memo((({children:t,components:n})=>{const i=useMemo((()=>({...Ql,...n})),[n]);return jsxRuntimeExports.jsx(Xl.Provider,{value:i,children:t})}));function ec(e){return {...useContext(Xl),...e}}Zl.displayName="ComponentsStoreProvider";const oc=n=>{const{General:i,Layouts:o,Downloads:r,System:a}=vu();return jsxRuntimeExports.jsxs(Oi,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})},rc=({className:n,title:i="General",...o})=>{const{Theme:r,PinnedPosition:a,MinimizeToTray:s,ShowTutorialOnStartup:l}=vu();return jsxRuntimeExports.jsxs(I,{className:k("io-block io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{})]})},ac=(e="dark")=>{switch(e){case "dark":return "Dark";case "light":return "Light";default:return e}},sc=({className:n,title:i="Theme",...o})=>{const{currentTheme:a,selectTheme:c}=(()=>{const e=useContext(IOConnectContext),[t,n]=useState(null),i=useCallback((t=>e?.themes?.select(t)),[e]);return useEffect((()=>{if(!e)return;let t=false;const i=e=>{t||n(e);};return e.themes?.onChanged(i),e.themes?.getCurrent().then(i).catch(console.warn),()=>{t=true;}}),[e]),{currentTheme:t,selectTheme:i}})(),d=(()=>{const e=useContext(IOConnectContext),[t,n]=useState([]);return useEffect((()=>{e&&e.themes?.list().then(n).catch(console.warn);}),[e]),t})();return jsxRuntimeExports.jsxs("div",{className:k("flex jc-between ai-center",n),...o,children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsxs(K,{variant:"light",children:[jsxRuntimeExports.jsx(K.Button,{text:ac(a?.name)}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{children:d.map((({name:t})=>jsxRuntimeExports.jsx(K.Item,{onClick:()=>c(t),children:ac(t)},t)))})})]})]})},lc=({prefKey:n,options:i,disabled:o,...r})=>{const{isLoading:a,value:s="Select option",update:l}=Wr({prefKey:n});return jsxRuntimeExports.jsxs(K,{variant:"light",disabled:a||o,...r,children:[jsxRuntimeExports.jsx(K.Button,{children:s}),jsxRuntimeExports.jsx(K.Content,{children:jsxRuntimeExports.jsx(K.List,{children:i.map((t=>jsxRuntimeExports.jsx(K.Item,{onClick:()=>(async e=>{if(e!==s)try{await l(e);}catch(e){console.error("Failed to update platform preference:",e);}})(t),children:t},t)))})})]})},cc=({className:n,label:i="Pinned position",...o})=>jsxRuntimeExports.jsx(I,{className:k("io-block-list-gap",n),...o,children:jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsx(lc,{className:n,prefKey:ao,options:["Left","Right"],...o})]})}),uc=({prefKey:t,...n})=>{const{isLoading:i,value:o=false,update:r}=Wr({prefKey:t});return jsxRuntimeExports.jsx(Vi,{checked:o,disabled:i,onChange:e=>r(e.target.checked),...n})},dc=({align:t="right",label:n="Allow docking",...i})=>jsxRuntimeExports.jsx(uc,{align:t,label:n,prefKey:so,...i}),fc=({align:t="right",label:n="Minimize to tray",...i})=>jsxRuntimeExports.jsx(uc,{align:t,label:n,prefKey:lo,...i}),mc=({align:t="right",label:n="Auto-close on starting apps and workspaces",...i})=>jsxRuntimeExports.jsx(uc,{align:t,label:n,prefKey:co,disabled:true,...i}),hc=({align:t="right",label:n="Show tutorial on startup",...i})=>jsxRuntimeExports.jsx(uc,{align:t,label:n,prefKey:uo,...i}),pc=({className:n,title:i="Layouts",...o})=>{const{LayoutsSaveCurrentOnExit:r,LayoutsShowDeletePrompt:a,LayoutsShowUnsavedChangesPrompt:s}=vu();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(a,{})]})},gc=({align:t="right",label:n="Restore last saved on startup",...i})=>jsxRuntimeExports.jsx(uc,{align:t,label:n,prefKey:fo,...i}),vc=({align:t="right",label:n="Save current on exit",...i})=>jsxRuntimeExports.jsx(uc,{align:t,label:n,prefKey:mo,...i}),yc=({align:t="right",label:n="Show prompt for unsaved changes",...i})=>jsxRuntimeExports.jsx(uc,{align:t,label:n,prefKey:ho,...i}),wc=({align:t="right",label:n="Show prompt for deleting",...i})=>jsxRuntimeExports.jsx(uc,{align:t,label:n,prefKey:po,...i}),bc=({className:t,title:n="Downloads",...i})=>{const{DownloadsLocation:o}=vu();return jsxRuntimeExports.jsx(I,{className:k("io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},kc=({align:t="right",label:n="Ask where to save each file before downloading",...i})=>jsxRuntimeExports.jsx(uc,{align:t,label:n,prefKey:go,...i}),Cc=({className:n,label:i="Location",...o})=>{const{configuration:{downloadFolder:r},setDownloadLocationWithDialog:a,isDownloadLocationDialogVisible:s,downloadLocationList:l}=ya();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),...o,children:[jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsx(M,{text:"Change",onClick:a,disabled:s})]}),jsxRuntimeExports.jsx("p",{children:r??l?.[0]??"Not set"})]})},Nc=({className:n,title:i="System",...o})=>{const{SystemRestartSection:r,SystemShutdownSection:a}=vu();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})};var Sc=["onChange","onClose","onDayCreate","onDestroy","onKeyDown","onMonthChange","onOpen","onParseConfig","onReady","onValueUpdate","onYearChange","onPreCalendarPosition"],xc={_disable:[],allowInput:false,allowInvalidPreload:false,altFormat:"F j, Y",altInput:false,altInputClass:"form-control input",animate:"object"==typeof window&&-1===window.navigator.userAgent.indexOf("MSIE"),ariaDateFormat:"F j, Y",autoFillDefaultTime:true,clickOpens:true,closeOnSelect:true,conjunction:", ",dateFormat:"Y-m-d",defaultHour:12,defaultMinute:0,defaultSeconds:0,disable:[],disableMobile:false,enableSeconds:false,enableTime:false,errorHandler:function(e){return "undefined"!=typeof console&&console.warn(e)},getWeek:function(e){var t=new Date(e.getTime());t.setHours(0,0,0,0),t.setDate(t.getDate()+3-(t.getDay()+6)%7);var n=new Date(t.getFullYear(),0,4);return 1+Math.round(((t.getTime()-n.getTime())/864e5-3+(n.getDay()+6)%7)/7)},hourIncrement:1,ignoredFocusElements:[],inline:false,locale:"default",minuteIncrement:5,mode:"single",monthSelectorType:"dropdown",nextArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",noCalendar:false,now:new Date,onChange:[],onClose:[],onDayCreate:[],onDestroy:[],onKeyDown:[],onMonthChange:[],onOpen:[],onParseConfig:[],onReady:[],onValueUpdate:[],onYearChange:[],onPreCalendarPosition:[],plugins:[],position:"auto",positionElement:void 0,prevArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",shorthandCurrentMonth:false,showMonths:1,static:false,time_24hr:false,weekNumbers:false,wrap:false},Dc={weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0,ordinal:function(e){var t=e%100;if(t>3&&t<21)return "th";switch(t%10){case 1:return "st";case 2:return "nd";case 3:return "rd";default:return "th"}},rangeSeparator:" to ",weekAbbreviation:"Wk",scrollTitle:"Scroll to increment",toggleTitle:"Click to toggle",amPM:["AM","PM"],yearAriaLabel:"Year",monthAriaLabel:"Month",hourAriaLabel:"Hour",minuteAriaLabel:"Minute",time_24hr:false},Ec=function(e,t){return void 0===t&&(t=2),("000"+e).slice(-1*t)},Ic=function(e){return  true===e?1:0};function Mc(e,t){var n;return function(){var i=this,o=arguments;clearTimeout(n),n=setTimeout((function(){return e.apply(i,o)}),t);}}var Ac=function(e){return e instanceof Array?e:[e]};function Tc(e,t,n){if(true===n)return e.classList.add(t);e.classList.remove(t);}function Pc(e,t,n){var i=window.document.createElement(e);return t=t||"",n=n||"",i.className=t,void 0!==n&&(i.textContent=n),i}function Oc(e){for(;e.firstChild;)e.removeChild(e.firstChild);}function Lc(e,t){return t(e)?e:e.parentNode?Lc(e.parentNode,t):void 0}function Fc(e,t){var n=Pc("div","numInputWrapper"),i=Pc("input","numInput "+e),o=Pc("span","arrowUp"),r=Pc("span","arrowDown");if(-1===navigator.userAgent.indexOf("MSIE 9.0")?i.type="number":(i.type="text",i.pattern="\\d*"),void 0!==t)for(var a in t)i.setAttribute(a,t[a]);return n.appendChild(i),n.appendChild(o),n.appendChild(r),n}function Bc(e){try{return "function"==typeof e.composedPath?e.composedPath()[0]:e.target}catch(t){return e.target}}var Rc=function(){},_c=function(e,t,n){return n.months[t?"shorthand":"longhand"][e]},Hc={D:Rc,F:function(e,t,n){e.setMonth(n.months.longhand.indexOf(t));},G:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},H:function(e,t){e.setHours(parseFloat(t));},J:function(e,t){e.setDate(parseFloat(t));},K:function(e,t,n){e.setHours(e.getHours()%12+12*Ic(new RegExp(n.amPM[1],"i").test(t)));},M:function(e,t,n){e.setMonth(n.months.shorthand.indexOf(t));},S:function(e,t){e.setSeconds(parseFloat(t));},U:function(e,t){return new Date(1e3*parseFloat(t))},W:function(e,t,n){var i=parseInt(t),o=new Date(e.getFullYear(),0,2+7*(i-1),0,0,0,0);return o.setDate(o.getDate()-o.getDay()+n.firstDayOfWeek),o},Y:function(e,t){e.setFullYear(parseFloat(t));},Z:function(e,t){return new Date(t)},d:function(e,t){e.setDate(parseFloat(t));},h:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},i:function(e,t){e.setMinutes(parseFloat(t));},j:function(e,t){e.setDate(parseFloat(t));},l:Rc,m:function(e,t){e.setMonth(parseFloat(t)-1);},n:function(e,t){e.setMonth(parseFloat(t)-1);},s:function(e,t){e.setSeconds(parseFloat(t));},u:function(e,t){return new Date(parseFloat(t))},w:Rc,y:function(e,t){e.setFullYear(2e3+parseFloat(t));}},jc={D:"",F:"",G:"(\\d\\d|\\d)",H:"(\\d\\d|\\d)",J:"(\\d\\d|\\d)\\w+",K:"",M:"",S:"(\\d\\d|\\d)",U:"(.+)",W:"(\\d\\d|\\d)",Y:"(\\d{4})",Z:"(.+)",d:"(\\d\\d|\\d)",h:"(\\d\\d|\\d)",i:"(\\d\\d|\\d)",j:"(\\d\\d|\\d)",l:"",m:"(\\d\\d|\\d)",n:"(\\d\\d|\\d)",s:"(\\d\\d|\\d)",u:"(.+)",w:"(\\d\\d|\\d)",y:"(\\d{2})"},zc={Z:function(e){return e.toISOString()},D:function(e,t,n){return t.weekdays.shorthand[zc.w(e,t,n)]},F:function(e,t,n){return _c(zc.n(e,t,n)-1,false,t)},G:function(e,t,n){return Ec(zc.h(e,t,n))},H:function(e){return Ec(e.getHours())},J:function(e,t){return void 0!==t.ordinal?e.getDate()+t.ordinal(e.getDate()):e.getDate()},K:function(e,t){return t.amPM[Ic(e.getHours()>11)]},M:function(e,t){return _c(e.getMonth(),true,t)},S:function(e){return Ec(e.getSeconds())},U:function(e){return e.getTime()/1e3},W:function(e,t,n){return n.getWeek(e)},Y:function(e){return Ec(e.getFullYear(),4)},d:function(e){return Ec(e.getDate())},h:function(e){return e.getHours()%12?e.getHours()%12:12},i:function(e){return Ec(e.getMinutes())},j:function(e){return e.getDate()},l:function(e,t){return t.weekdays.longhand[e.getDay()]},m:function(e){return Ec(e.getMonth()+1)},n:function(e){return e.getMonth()+1},s:function(e){return e.getSeconds()},u:function(e){return e.getTime()},w:function(e){return e.getDay()},y:function(e){return String(e.getFullYear()).substring(2)}},$c=function(e){var t=e.config,n=void 0===t?xc:t,i=e.l10n,o=void 0===i?Dc:i,r=e.isMobile,a=void 0!==r&&r;return function(e,t,i){var r=i||o;return void 0===n.formatDate||a?t.split("").map((function(t,i,o){return zc[t]&&"\\"!==o[i-1]?zc[t](e,r,n):"\\"!==t?t:""})).join(""):n.formatDate(e,t,r)}},Vc=function(e){var t=e.config,n=void 0===t?xc:t,i=e.l10n,o=void 0===i?Dc:i;return function(e,t,i,r){if(0===e||e){var a,s=r||o,l=e;if(e instanceof Date)a=new Date(e.getTime());else if("string"!=typeof e&&void 0!==e.toFixed)a=new Date(e);else if("string"==typeof e){var c=t||(n||xc).dateFormat,u=String(e).trim();if("today"===u)a=new Date,i=true;else if(n&&n.parseDate)a=n.parseDate(e,c);else if(/Z$/.test(u)||/GMT$/.test(u))a=new Date(e);else {for(var d=void 0,f=[],m=0,h=0,p="";m<c.length;m++){var g=c[m],v="\\"===g,y="\\"===c[m-1]||v;if(jc[g]&&!y){p+=jc[g];var w=new RegExp(p).exec(e);w&&(d=true)&&f["Y"!==g?"push":"unshift"]({fn:Hc[g],val:w[++h]});}else v||(p+=".");}a=n&&n.noCalendar?new Date((new Date).setHours(0,0,0,0)):new Date((new Date).getFullYear(),0,1,0,0,0,0),f.forEach((function(e){var t=e.fn,n=e.val;return a=t(a,n,s)||a})),a=d?a:void 0;}}if(a instanceof Date&&!isNaN(a.getTime()))return  true===i&&a.setHours(0,0,0,0),a;n.errorHandler(new Error("Invalid date provided: "+l));}}};function Yc(e,t,n){return void 0===n&&(n=true),false!==n?new Date(e.getTime()).setHours(0,0,0,0)-new Date(t.getTime()).setHours(0,0,0,0):e.getTime()-t.getTime()}var Uc=function(e,t,n){return e>Math.min(t,n)&&e<Math.max(t,n)},Wc=function(e,t,n){return 3600*e+60*t+n},Jc=function(e){var t=Math.floor(e/3600),n=(e-3600*t)/60;return [t,n,e-3600*t-60*n]},Kc={DAY:864e5};function Gc(e){var t=e.defaultHour,n=e.defaultMinute,i=e.defaultSeconds;if(void 0!==e.minDate){var o=e.minDate.getHours(),r=e.minDate.getMinutes(),a=e.minDate.getSeconds();t<o&&(t=o),t===o&&n<r&&(n=r),t===o&&n===r&&i<a&&(i=e.minDate.getSeconds());}if(void 0!==e.maxDate){var s=e.maxDate.getHours(),l=e.maxDate.getMinutes();(t=Math.min(t,s))===s&&(n=Math.min(l,n)),t===s&&n===l&&(i=e.maxDate.getSeconds());}return {hours:t,minutes:n,seconds:i}}"function"!=typeof Object.assign&&(Object.assign=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(!e)throw TypeError("Cannot convert undefined or null to object");for(var i=function(t){t&&Object.keys(t).forEach((function(n){return e[n]=t[n]}));},o=0,r=t;o<r.length;o++){i(r[o]);}return e});var qc=function(){return qc=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},qc.apply(this,arguments)},Qc=function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var i=Array(e),o=0;for(t=0;t<n;t++)for(var r=arguments[t],a=0,s=r.length;a<s;a++,o++)i[o]=r[a];return i},Xc=300;function Zc(e,t){var n={config:qc(qc({},xc),tu.defaultConfig),l10n:Dc};function i(){var e;return (null===(e=n.calendarContainer)||void 0===e?void 0:e.getRootNode()).activeElement||document.activeElement}function o(e){return e.bind(n)}function r(){var e=n.config;false===e.weekNumbers&&1===e.showMonths||true!==e.noCalendar&&window.requestAnimationFrame((function(){if(void 0!==n.calendarContainer&&(n.calendarContainer.style.visibility="hidden",n.calendarContainer.style.display="block"),void 0!==n.daysContainer){var t=(n.days.offsetWidth+1)*e.showMonths;n.daysContainer.style.width=t+"px",n.calendarContainer.style.width=t+(void 0!==n.weekWrapper?n.weekWrapper.offsetWidth:0)+"px",n.calendarContainer.style.removeProperty("visibility"),n.calendarContainer.style.removeProperty("display");}}));}function a(e){if(0===n.selectedDates.length){var t=void 0===n.config.minDate||Yc(new Date,n.config.minDate)>=0?new Date:new Date(n.config.minDate.getTime()),i=Gc(n.config);t.setHours(i.hours,i.minutes,i.seconds,t.getMilliseconds()),n.selectedDates=[t],n.latestSelectedDateObj=t;} void 0!==e&&"blur"!==e.type&&function(e){e.preventDefault();var t="keydown"===e.type,i=Bc(e),o=i;void 0!==n.amPM&&i===n.amPM&&(n.amPM.textContent=n.l10n.amPM[Ic(n.amPM.textContent===n.l10n.amPM[0])]);var r=parseFloat(o.getAttribute("min")),a=parseFloat(o.getAttribute("max")),s=parseFloat(o.getAttribute("step")),l=parseInt(o.value,10),c=e.delta||(t?38===e.which?1:-1:0),u=l+s*c;if(void 0!==o.value&&2===o.value.length){var d=o===n.hourElement,f=o===n.minuteElement;u<r?(u=a+u+Ic(!d)+(Ic(d)&&Ic(!n.amPM)),f&&p(void 0,-1,n.hourElement)):u>a&&(u=o===n.hourElement?u-a-Ic(!n.amPM):r,f&&p(void 0,1,n.hourElement)),n.amPM&&d&&(1===s?u+l===23:Math.abs(u-l)>s)&&(n.amPM.textContent=n.l10n.amPM[Ic(n.amPM.textContent===n.l10n.amPM[0])]),o.value=Ec(u);}}(e);var o=n._input.value;s(),Z(),n._input.value!==o&&n._debouncedChange();}function s(){if(void 0!==n.hourElement&&void 0!==n.minuteElement){var e,t,i=(parseInt(n.hourElement.value.slice(-2),10)||0)%24,o=(parseInt(n.minuteElement.value,10)||0)%60,r=void 0!==n.secondElement?(parseInt(n.secondElement.value,10)||0)%60:0;void 0!==n.amPM&&(e=i,t=n.amPM.textContent,i=e%12+12*Ic(t===n.l10n.amPM[1]));var a=void 0!==n.config.minTime||n.config.minDate&&n.minDateHasTime&&n.latestSelectedDateObj&&0===Yc(n.latestSelectedDateObj,n.config.minDate,true),s=void 0!==n.config.maxTime||n.config.maxDate&&n.maxDateHasTime&&n.latestSelectedDateObj&&0===Yc(n.latestSelectedDateObj,n.config.maxDate,true);if(void 0!==n.config.maxTime&&void 0!==n.config.minTime&&n.config.minTime>n.config.maxTime){var l=Wc(n.config.minTime.getHours(),n.config.minTime.getMinutes(),n.config.minTime.getSeconds()),u=Wc(n.config.maxTime.getHours(),n.config.maxTime.getMinutes(),n.config.maxTime.getSeconds()),d=Wc(i,o,r);if(d>u&&d<l){var f=Jc(l);i=f[0],o=f[1],r=f[2];}}else {if(s){var m=void 0!==n.config.maxTime?n.config.maxTime:n.config.maxDate;(i=Math.min(i,m.getHours()))===m.getHours()&&(o=Math.min(o,m.getMinutes())),o===m.getMinutes()&&(r=Math.min(r,m.getSeconds()));}if(a){var h=void 0!==n.config.minTime?n.config.minTime:n.config.minDate;(i=Math.max(i,h.getHours()))===h.getHours()&&o<h.getMinutes()&&(o=h.getMinutes()),o===h.getMinutes()&&(r=Math.max(r,h.getSeconds()));}}c(i,o,r);}}function l(e){var t=e||n.latestSelectedDateObj;t&&t instanceof Date&&c(t.getHours(),t.getMinutes(),t.getSeconds());}function c(e,t,i){ void 0!==n.latestSelectedDateObj&&n.latestSelectedDateObj.setHours(e%24,t,i||0,0),n.hourElement&&n.minuteElement&&!n.isMobile&&(n.hourElement.value=Ec(n.config.time_24hr?e:(12+e)%12+12*Ic(e%12==0)),n.minuteElement.value=Ec(t),void 0!==n.amPM&&(n.amPM.textContent=n.l10n.amPM[Ic(e>=12)]),void 0!==n.secondElement&&(n.secondElement.value=Ec(i)));}function u(e){var t=Bc(e),n=parseInt(t.value)+(e.delta||0);(n/1e3>1||"Enter"===e.key&&!/[^\d]/.test(n.toString()))&&A(n);}function d(e,t,i,o){return t instanceof Array?t.forEach((function(t){return d(e,t,i,o)})):e instanceof Array?e.forEach((function(e){return d(e,t,i,o)})):(e.addEventListener(t,i,o),void n._handlers.push({remove:function(){return e.removeEventListener(t,i,o)}}))}function f(){K("onChange");}function m(e,t){var i=void 0!==e?n.parseDate(e):n.latestSelectedDateObj||(n.config.minDate&&n.config.minDate>n.now?n.config.minDate:n.config.maxDate&&n.config.maxDate<n.now?n.config.maxDate:n.now),o=n.currentYear,r=n.currentMonth;try{void 0!==i&&(n.currentYear=i.getFullYear(),n.currentMonth=i.getMonth());}catch(e){e.message="Invalid date supplied: "+i,n.config.errorHandler(e);}t&&n.currentYear!==o&&(K("onYearChange"),C()),!t||n.currentYear===o&&n.currentMonth===r||K("onMonthChange"),n.redraw();}function h(e){var t=Bc(e);~t.className.indexOf("arrow")&&p(e,t.classList.contains("arrowUp")?1:-1);}function p(e,t,n){var i=e&&Bc(e),o=n||i&&i.parentNode&&i.parentNode.firstChild,r=G("increment");r.delta=t,o&&o.dispatchEvent(r);}function g(e,t,i,o){var r=T(t,true),a=Pc("span",e,t.getDate().toString());return a.dateObj=t,a.$i=o,a.setAttribute("aria-label",n.formatDate(t,n.config.ariaDateFormat)),-1===e.indexOf("hidden")&&0===Yc(t,n.now)&&(n.todayDateElem=a,a.classList.add("today"),a.setAttribute("aria-current","date")),r?(a.tabIndex=-1,q(t)&&(a.classList.add("selected"),n.selectedDateElem=a,"range"===n.config.mode&&(Tc(a,"startRange",n.selectedDates[0]&&0===Yc(t,n.selectedDates[0],true)),Tc(a,"endRange",n.selectedDates[1]&&0===Yc(t,n.selectedDates[1],true)),"nextMonthDay"===e&&a.classList.add("inRange")))):a.classList.add("flatpickr-disabled"),"range"===n.config.mode&&function(e){return !("range"!==n.config.mode||n.selectedDates.length<2)&&(Yc(e,n.selectedDates[0])>=0&&Yc(e,n.selectedDates[1])<=0)}(t)&&!q(t)&&a.classList.add("inRange"),n.weekNumbers&&1===n.config.showMonths&&"prevMonthDay"!==e&&o%7==6&&n.weekNumbers.insertAdjacentHTML("beforeend","<span class='flatpickr-day'>"+n.config.getWeek(t)+"</span>"),K("onDayCreate",a),a}function v(e){e.focus(),"range"===n.config.mode&&F(e);}function y(e){for(var t=e>0?0:n.config.showMonths-1,i=e>0?n.config.showMonths:-1,o=t;o!=i;o+=e)for(var r=n.daysContainer.children[o],a=e>0?0:r.children.length-1,s=e>0?r.children.length:-1,l=a;l!=s;l+=e){var c=r.children[l];if(-1===c.className.indexOf("hidden")&&T(c.dateObj))return c}}function w(e,t){var o=i(),r=P(o||document.body),a=void 0!==e?e:r?o:void 0!==n.selectedDateElem&&P(n.selectedDateElem)?n.selectedDateElem:void 0!==n.todayDateElem&&P(n.todayDateElem)?n.todayDateElem:y(t>0?1:-1);void 0===a?n._input.focus():r?function(e,t){for(var i=-1===e.className.indexOf("Month")?e.dateObj.getMonth():n.currentMonth,o=t>0?n.config.showMonths:-1,r=t>0?1:-1,a=i-n.currentMonth;a!=o;a+=r)for(var s=n.daysContainer.children[a],l=i-n.currentMonth===a?e.$i+t:t<0?s.children.length-1:0,c=s.children.length,u=l;u>=0&&u<c&&u!=(t>0?c:-1);u+=r){var d=s.children[u];if(-1===d.className.indexOf("hidden")&&T(d.dateObj)&&Math.abs(e.$i-u)>=Math.abs(t))return v(d)}n.changeMonth(r),w(y(r),0);}(a,t):v(a);}function b(e,t){for(var i=(new Date(e,t,1).getDay()-n.l10n.firstDayOfWeek+7)%7,o=n.utils.getDaysInMonth((t-1+12)%12,e),r=n.utils.getDaysInMonth(t,e),a=window.document.createDocumentFragment(),s=n.config.showMonths>1,l=s?"prevMonthDay hidden":"prevMonthDay",c=s?"nextMonthDay hidden":"nextMonthDay",u=o+1-i,d=0;u<=o;u++,d++)a.appendChild(g("flatpickr-day "+l,new Date(e,t-1,u),0,d));for(u=1;u<=r;u++,d++)a.appendChild(g("flatpickr-day",new Date(e,t,u),0,d));for(var f=r+1;f<=42-i&&(1===n.config.showMonths||d%7!=0);f++,d++)a.appendChild(g("flatpickr-day "+c,new Date(e,t+1,f%r),0,d));var m=Pc("div","dayContainer");return m.appendChild(a),m}function k(){if(void 0!==n.daysContainer){Oc(n.daysContainer),n.weekNumbers&&Oc(n.weekNumbers);for(var e=document.createDocumentFragment(),t=0;t<n.config.showMonths;t++){var i=new Date(n.currentYear,n.currentMonth,1);i.setMonth(n.currentMonth+t),e.appendChild(b(i.getFullYear(),i.getMonth()));}n.daysContainer.appendChild(e),n.days=n.daysContainer.firstChild,"range"===n.config.mode&&1===n.selectedDates.length&&F();}}function C(){if(!(n.config.showMonths>1||"dropdown"!==n.config.monthSelectorType)){var e=function(e){return !(void 0!==n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&e<n.config.minDate.getMonth())&&!(void 0!==n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()&&e>n.config.maxDate.getMonth())};n.monthsDropdownContainer.tabIndex=-1,n.monthsDropdownContainer.innerHTML="";for(var t=0;t<12;t++)if(e(t)){var i=Pc("option","flatpickr-monthDropdown-month");i.value=new Date(n.currentYear,t).getMonth().toString(),i.textContent=_c(t,n.config.shorthandCurrentMonth,n.l10n),i.tabIndex=-1,n.currentMonth===t&&(i.selected=true),n.monthsDropdownContainer.appendChild(i);}}}function N(){var e,t=Pc("div","flatpickr-month"),i=window.document.createDocumentFragment();n.config.showMonths>1||"static"===n.config.monthSelectorType?e=Pc("span","cur-month"):(n.monthsDropdownContainer=Pc("select","flatpickr-monthDropdown-months"),n.monthsDropdownContainer.setAttribute("aria-label",n.l10n.monthAriaLabel),d(n.monthsDropdownContainer,"change",(function(e){var t=Bc(e),i=parseInt(t.value,10);n.changeMonth(i-n.currentMonth),K("onMonthChange");})),C(),e=n.monthsDropdownContainer);var o=Fc("cur-year",{tabindex:"-1"}),r=o.getElementsByTagName("input")[0];r.setAttribute("aria-label",n.l10n.yearAriaLabel),n.config.minDate&&r.setAttribute("min",n.config.minDate.getFullYear().toString()),n.config.maxDate&&(r.setAttribute("max",n.config.maxDate.getFullYear().toString()),r.disabled=!!n.config.minDate&&n.config.minDate.getFullYear()===n.config.maxDate.getFullYear());var a=Pc("div","flatpickr-current-month");return a.appendChild(e),a.appendChild(o),i.appendChild(a),t.appendChild(i),{container:t,yearElement:r,monthElement:e}}function S(){Oc(n.monthNav),n.monthNav.appendChild(n.prevMonthNav),n.config.showMonths&&(n.yearElements=[],n.monthElements=[]);for(var e=n.config.showMonths;e--;){var t=N();n.yearElements.push(t.yearElement),n.monthElements.push(t.monthElement),n.monthNav.appendChild(t.container);}n.monthNav.appendChild(n.nextMonthNav);}function x(){n.weekdayContainer?Oc(n.weekdayContainer):n.weekdayContainer=Pc("div","flatpickr-weekdays");for(var e=n.config.showMonths;e--;){var t=Pc("div","flatpickr-weekdaycontainer");n.weekdayContainer.appendChild(t);}return D(),n.weekdayContainer}function D(){if(n.weekdayContainer){var e=n.l10n.firstDayOfWeek,t=Qc(n.l10n.weekdays.shorthand);e>0&&e<t.length&&(t=Qc(t.splice(e,t.length),t.splice(0,e)));for(var i=n.config.showMonths;i--;)n.weekdayContainer.children[i].innerHTML="\n      <span class='flatpickr-weekday'>\n        "+t.join("</span><span class='flatpickr-weekday'>")+"\n      </span>\n      ";}}function E(e,t){ void 0===t&&(t=true);var i=t?e:e-n.currentMonth;i<0&&true===n._hidePrevMonthArrow||i>0&&true===n._hideNextMonthArrow||(n.currentMonth+=i,(n.currentMonth<0||n.currentMonth>11)&&(n.currentYear+=n.currentMonth>11?1:-1,n.currentMonth=(n.currentMonth+12)%12,K("onYearChange"),C()),k(),K("onMonthChange"),Q());}function I(e){return n.calendarContainer.contains(e)}function M(e){if(n.isOpen&&!n.config.inline){var t=Bc(e),i=I(t),o=!(t===n.input||t===n.altInput||n.element.contains(t)||e.path&&e.path.indexOf&&(~e.path.indexOf(n.input)||~e.path.indexOf(n.altInput)))&&!i&&!I(e.relatedTarget),r=!n.config.ignoredFocusElements.some((function(e){return e.contains(t)}));o&&r&&(n.config.allowInput&&n.setDate(n._input.value,false,n.config.altInput?n.config.altFormat:n.config.dateFormat),void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement&&""!==n.input.value&&void 0!==n.input.value&&a(),n.close(),n.config&&"range"===n.config.mode&&1===n.selectedDates.length&&n.clear(false));}}function A(e){if(!(!e||n.config.minDate&&e<n.config.minDate.getFullYear()||n.config.maxDate&&e>n.config.maxDate.getFullYear())){var t=e,i=n.currentYear!==t;n.currentYear=t||n.currentYear,n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth=Math.min(n.config.maxDate.getMonth(),n.currentMonth):n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&(n.currentMonth=Math.max(n.config.minDate.getMonth(),n.currentMonth)),i&&(n.redraw(),K("onYearChange"),C());}}function T(e,t){var i;void 0===t&&(t=true);var o=n.parseDate(e,void 0,t);if(n.config.minDate&&o&&Yc(o,n.config.minDate,void 0!==t?t:!n.minDateHasTime)<0||n.config.maxDate&&o&&Yc(o,n.config.maxDate,void 0!==t?t:!n.maxDateHasTime)>0)return  false;if(!n.config.enable&&0===n.config.disable.length)return  true;if(void 0===o)return  false;for(var r=!!n.config.enable,a=null!==(i=n.config.enable)&&void 0!==i?i:n.config.disable,s=0,l=void 0;s<a.length;s++){if("function"==typeof(l=a[s])&&l(o))return r;if(l instanceof Date&&void 0!==o&&l.getTime()===o.getTime())return r;if("string"==typeof l){var c=n.parseDate(l,void 0,true);return c&&c.getTime()===o.getTime()?r:!r}if("object"==typeof l&&void 0!==o&&l.from&&l.to&&o.getTime()>=l.from.getTime()&&o.getTime()<=l.to.getTime())return r}return !r}function P(e){return void 0!==n.daysContainer&&(-1===e.className.indexOf("hidden")&&-1===e.className.indexOf("flatpickr-disabled")&&n.daysContainer.contains(e))}function O(e){var t=e.target===n._input,i=n._input.value.trimEnd()!==X();!t||!i||e.relatedTarget&&I(e.relatedTarget)||n.setDate(n._input.value,true,e.target===n.altInput?n.config.altFormat:n.config.dateFormat);}function L(t){var o=Bc(t),r=n.config.wrap?e.contains(o):o===n._input,l=n.config.allowInput,c=n.isOpen&&(!l||!r),u=n.config.inline&&r&&!l;if(13===t.keyCode&&r){if(l)return n.setDate(n._input.value,true,o===n.altInput?n.config.altFormat:n.config.dateFormat),n.close(),o.blur();n.open();}else if(I(o)||c||u){var d=!!n.timeContainer&&n.timeContainer.contains(o);switch(t.keyCode){case 13:d?(t.preventDefault(),a(),$()):V(t);break;case 27:t.preventDefault(),$();break;case 8:case 46:r&&!n.config.allowInput&&(t.preventDefault(),n.clear());break;case 37:case 39:if(d||r)n.hourElement&&n.hourElement.focus();else {t.preventDefault();var f=i();if(void 0!==n.daysContainer&&(false===l||f&&P(f))){var m=39===t.keyCode?1:-1;t.ctrlKey?(t.stopPropagation(),E(m),w(y(1),0)):w(void 0,m);}}break;case 38:case 40:t.preventDefault();var h=40===t.keyCode?1:-1;n.daysContainer&&void 0!==o.$i||o===n.input||o===n.altInput?t.ctrlKey?(t.stopPropagation(),A(n.currentYear-h),w(y(1),0)):d||w(void 0,7*h):o===n.currentYearElement?A(n.currentYear-h):n.config.enableTime&&(!d&&n.hourElement&&n.hourElement.focus(),a(t),n._debouncedChange());break;case 9:if(d){var p=[n.hourElement,n.minuteElement,n.secondElement,n.amPM].concat(n.pluginElements).filter((function(e){return e})),g=p.indexOf(o);if(-1!==g){var v=p[g+(t.shiftKey?-1:1)];t.preventDefault(),(v||n._input).focus();}}else !n.config.noCalendar&&n.daysContainer&&n.daysContainer.contains(o)&&t.shiftKey&&(t.preventDefault(),n._input.focus());}}if(void 0!==n.amPM&&o===n.amPM)switch(t.key){case n.l10n.amPM[0].charAt(0):case n.l10n.amPM[0].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[0],s(),Z();break;case n.l10n.amPM[1].charAt(0):case n.l10n.amPM[1].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[1],s(),Z();}(r||I(o))&&K("onKeyDown",t);}function F(e,t){if(void 0===t&&(t="flatpickr-day"),1===n.selectedDates.length&&(!e||e.classList.contains(t)&&!e.classList.contains("flatpickr-disabled"))){for(var i=e?e.dateObj.getTime():n.days.firstElementChild.dateObj.getTime(),o=n.parseDate(n.selectedDates[0],void 0,true).getTime(),r=Math.min(i,n.selectedDates[0].getTime()),a=Math.max(i,n.selectedDates[0].getTime()),s=false,l=0,c=0,u=r;u<a;u+=Kc.DAY)T(new Date(u),true)||(s=s||u>r&&u<a,u<o&&(!l||u>l)?l=u:u>o&&(!c||u<c)&&(c=u));Array.from(n.rContainer.querySelectorAll("*:nth-child(-n+"+n.config.showMonths+") > ."+t)).forEach((function(t){var r=t.dateObj.getTime(),a=l>0&&r<l||c>0&&r>c;if(a)return t.classList.add("notAllowed"),void["inRange","startRange","endRange"].forEach((function(e){t.classList.remove(e);}));s&&!a||(["startRange","inRange","endRange","notAllowed"].forEach((function(e){t.classList.remove(e);})),void 0!==e&&(e.classList.add(i<=n.selectedDates[0].getTime()?"startRange":"endRange"),o<i&&r===o?t.classList.add("startRange"):o>i&&r===o&&t.classList.add("endRange"),r>=l&&(0===c||r<=c)&&Uc(r,o,i)&&t.classList.add("inRange")));}));}}function B(){!n.isOpen||n.config.static||n.config.inline||j();}function R(e){return function(t){var i=n.config["_"+e+"Date"]=n.parseDate(t,n.config.dateFormat),o=n.config["_"+("min"===e?"max":"min")+"Date"];void 0!==i&&(n["min"===e?"minDateHasTime":"maxDateHasTime"]=i.getHours()>0||i.getMinutes()>0||i.getSeconds()>0),n.selectedDates&&(n.selectedDates=n.selectedDates.filter((function(e){return T(e)})),n.selectedDates.length||"min"!==e||l(i),Z()),n.daysContainer&&(z(),void 0!==i?n.currentYearElement[e]=i.getFullYear().toString():n.currentYearElement.removeAttribute(e),n.currentYearElement.disabled=!!o&&void 0!==i&&o.getFullYear()===i.getFullYear());}}function _(){return n.config.wrap?e.querySelector("[data-input]"):e}function H(){"object"!=typeof n.config.locale&&void 0===tu.l10ns[n.config.locale]&&n.config.errorHandler(new Error("flatpickr: invalid locale "+n.config.locale)),n.l10n=qc(qc({},tu.l10ns.default),"object"==typeof n.config.locale?n.config.locale:"default"!==n.config.locale?tu.l10ns[n.config.locale]:void 0),jc.D="("+n.l10n.weekdays.shorthand.join("|")+")",jc.l="("+n.l10n.weekdays.longhand.join("|")+")",jc.M="("+n.l10n.months.shorthand.join("|")+")",jc.F="("+n.l10n.months.longhand.join("|")+")",jc.K="("+n.l10n.amPM[0]+"|"+n.l10n.amPM[1]+"|"+n.l10n.amPM[0].toLowerCase()+"|"+n.l10n.amPM[1].toLowerCase()+")",void 0===qc(qc({},t),JSON.parse(JSON.stringify(e.dataset||{}))).time_24hr&&void 0===tu.defaultConfig.time_24hr&&(n.config.time_24hr=n.l10n.time_24hr),n.formatDate=$c(n),n.parseDate=Vc({config:n.config,l10n:n.l10n});}function j(e){if("function"!=typeof n.config.position){if(void 0!==n.calendarContainer){K("onPreCalendarPosition");var t=e||n._positionElement,i=Array.prototype.reduce.call(n.calendarContainer.children,(function(e,t){return e+t.offsetHeight}),0),o=n.calendarContainer.offsetWidth,r=n.config.position.split(" "),a=r[0],s=r.length>1?r[1]:null,l=t.getBoundingClientRect(),c=window.innerHeight-l.bottom,u="above"===a||"below"!==a&&c<i&&l.top>i,d=window.pageYOffset+l.top+(u?-i-2:t.offsetHeight+2);if(Tc(n.calendarContainer,"arrowTop",!u),Tc(n.calendarContainer,"arrowBottom",u),!n.config.inline){var f=window.pageXOffset+l.left,m=false,h=false;"center"===s?(f-=(o-l.width)/2,m=true):"right"===s&&(f-=o-l.width,h=true),Tc(n.calendarContainer,"arrowLeft",!m&&!h),Tc(n.calendarContainer,"arrowCenter",m),Tc(n.calendarContainer,"arrowRight",h);var p=window.document.body.offsetWidth-(window.pageXOffset+l.right),g=f+o>window.document.body.offsetWidth,v=p+o>window.document.body.offsetWidth;if(Tc(n.calendarContainer,"rightMost",g),!n.config.static)if(n.calendarContainer.style.top=d+"px",g)if(v){var y=function(){for(var e=null,t=0;t<document.styleSheets.length;t++){var n=document.styleSheets[t];if(n.cssRules){try{n.cssRules;}catch(e){continue}e=n;break}}return null!=e?e:(i=document.createElement("style"),document.head.appendChild(i),i.sheet);var i;}();if(void 0===y)return;var w=window.document.body.offsetWidth,b=Math.max(0,w/2-o/2),k=y.cssRules.length,C="{left:"+l.left+"px;right:auto;}";Tc(n.calendarContainer,"rightMost",false),Tc(n.calendarContainer,"centerMost",true),y.insertRule(".flatpickr-calendar.centerMost:before,.flatpickr-calendar.centerMost:after"+C,k),n.calendarContainer.style.left=b+"px",n.calendarContainer.style.right="auto";}else n.calendarContainer.style.left="auto",n.calendarContainer.style.right=p+"px";else n.calendarContainer.style.left=f+"px",n.calendarContainer.style.right="auto";}}}else n.config.position(n,e);}function z(){n.config.noCalendar||n.isMobile||(C(),Q(),k());}function $(){n._input.focus(),-1!==window.navigator.userAgent.indexOf("MSIE")||void 0!==navigator.msMaxTouchPoints?setTimeout(n.close,0):n.close();}function V(e){e.preventDefault(),e.stopPropagation();var t=Lc(Bc(e),(function(e){return e.classList&&e.classList.contains("flatpickr-day")&&!e.classList.contains("flatpickr-disabled")&&!e.classList.contains("notAllowed")}));if(void 0!==t){var i=t,o=n.latestSelectedDateObj=new Date(i.dateObj.getTime()),r=(o.getMonth()<n.currentMonth||o.getMonth()>n.currentMonth+n.config.showMonths-1)&&"range"!==n.config.mode;if(n.selectedDateElem=i,"single"===n.config.mode)n.selectedDates=[o];else if("multiple"===n.config.mode){var a=q(o);a?n.selectedDates.splice(parseInt(a),1):n.selectedDates.push(o);}else "range"===n.config.mode&&(2===n.selectedDates.length&&n.clear(false,false),n.latestSelectedDateObj=o,n.selectedDates.push(o),0!==Yc(o,n.selectedDates[0],true)&&n.selectedDates.sort((function(e,t){return e.getTime()-t.getTime()})));if(s(),r){var l=n.currentYear!==o.getFullYear();n.currentYear=o.getFullYear(),n.currentMonth=o.getMonth(),l&&(K("onYearChange"),C()),K("onMonthChange");}if(Q(),k(),Z(),r||"range"===n.config.mode||1!==n.config.showMonths?void 0!==n.selectedDateElem&&void 0===n.hourElement&&n.selectedDateElem&&n.selectedDateElem.focus():v(i),void 0!==n.hourElement&&void 0!==n.hourElement&&n.hourElement.focus(),n.config.closeOnSelect){var c="single"===n.config.mode&&!n.config.enableTime,u="range"===n.config.mode&&2===n.selectedDates.length&&!n.config.enableTime;(c||u)&&$();}f();}}n.parseDate=Vc({config:n.config,l10n:n.l10n}),n._handlers=[],n.pluginElements=[],n.loadedPlugins=[],n._bind=d,n._setHoursFromDate=l,n._positionCalendar=j,n.changeMonth=E,n.changeYear=A,n.clear=function(e,t){ void 0===e&&(e=true);void 0===t&&(t=true);n.input.value="",void 0!==n.altInput&&(n.altInput.value="");void 0!==n.mobileInput&&(n.mobileInput.value="");n.selectedDates=[],n.latestSelectedDateObj=void 0,true===t&&(n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth());if(true===n.config.enableTime){var i=Gc(n.config);c(i.hours,i.minutes,i.seconds);}n.redraw(),e&&K("onChange");},n.close=function(){n.isOpen=false,n.isMobile||(void 0!==n.calendarContainer&&n.calendarContainer.classList.remove("open"),void 0!==n._input&&n._input.classList.remove("active"));K("onClose");},n.onMouseOver=F,n._createElement=Pc,n.createDay=g,n.destroy=function(){ void 0!==n.config&&K("onDestroy");for(var e=n._handlers.length;e--;)n._handlers[e].remove();if(n._handlers=[],n.mobileInput)n.mobileInput.parentNode&&n.mobileInput.parentNode.removeChild(n.mobileInput),n.mobileInput=void 0;else if(n.calendarContainer&&n.calendarContainer.parentNode)if(n.config.static&&n.calendarContainer.parentNode){var t=n.calendarContainer.parentNode;if(t.lastChild&&t.removeChild(t.lastChild),t.parentNode){for(;t.firstChild;)t.parentNode.insertBefore(t.firstChild,t);t.parentNode.removeChild(t);}}else n.calendarContainer.parentNode.removeChild(n.calendarContainer);n.altInput&&(n.input.type="text",n.altInput.parentNode&&n.altInput.parentNode.removeChild(n.altInput),delete n.altInput);n.input&&(n.input.type=n.input._type,n.input.classList.remove("flatpickr-input"),n.input.removeAttribute("readonly"));["_showTimeInput","latestSelectedDateObj","_hideNextMonthArrow","_hidePrevMonthArrow","__hideNextMonthArrow","__hidePrevMonthArrow","isMobile","isOpen","selectedDateElem","minDateHasTime","maxDateHasTime","days","daysContainer","_input","_positionElement","innerContainer","rContainer","monthNav","todayDateElem","calendarContainer","weekdayContainer","prevMonthNav","nextMonthNav","monthsDropdownContainer","currentMonthElement","currentYearElement","navigationCurrentMonth","selectedDateElem","config"].forEach((function(e){try{delete n[e];}catch(e){}}));},n.isEnabled=T,n.jumpToDate=m,n.updateValue=Z,n.open=function(e,t){ void 0===t&&(t=n._positionElement);if(true===n.isMobile){if(e){e.preventDefault();var i=Bc(e);i&&i.blur();}return void 0!==n.mobileInput&&(n.mobileInput.focus(),n.mobileInput.click()),void K("onOpen")}if(n._input.disabled||n.config.inline)return;var o=n.isOpen;n.isOpen=true,o||(n.calendarContainer.classList.add("open"),n._input.classList.add("active"),K("onOpen"),j(t));true===n.config.enableTime&&true===n.config.noCalendar&&(false!==n.config.allowInput||void 0!==e&&n.timeContainer.contains(e.relatedTarget)||setTimeout((function(){return n.hourElement.select()}),50));},n.redraw=z,n.set=function(e,t){if(null!==e&&"object"==typeof e)for(var i in Object.assign(n.config,e),e) void 0!==Y[i]&&Y[i].forEach((function(e){return e()}));else n.config[e]=t,void 0!==Y[e]?Y[e].forEach((function(e){return e()})):Sc.indexOf(e)>-1&&(n.config[e]=Ac(t));n.redraw(),Z(true);},n.setDate=function(e,t,i){ void 0===t&&(t=false);void 0===i&&(i=n.config.dateFormat);if(0!==e&&!e||e instanceof Array&&0===e.length)return n.clear(t);U(e,i),n.latestSelectedDateObj=n.selectedDates[n.selectedDates.length-1],n.redraw(),m(void 0,t),l(),0===n.selectedDates.length&&n.clear(false);Z(t),t&&K("onChange");},n.toggle=function(e){if(true===n.isOpen)return n.close();n.open(e);};var Y={locale:[H,D],showMonths:[S,r,x],minDate:[m],maxDate:[m],positionElement:[J],clickOpens:[function(){ true===n.config.clickOpens?(d(n._input,"focus",n.open),d(n._input,"click",n.open)):(n._input.removeEventListener("focus",n.open),n._input.removeEventListener("click",n.open));}]};function U(e,t){var i=[];if(e instanceof Array)i=e.map((function(e){return n.parseDate(e,t)}));else if(e instanceof Date||"number"==typeof e)i=[n.parseDate(e,t)];else if("string"==typeof e)switch(n.config.mode){case "single":case "time":i=[n.parseDate(e,t)];break;case "multiple":i=e.split(n.config.conjunction).map((function(e){return n.parseDate(e,t)}));break;case "range":i=e.split(n.l10n.rangeSeparator).map((function(e){return n.parseDate(e,t)}));}else n.config.errorHandler(new Error("Invalid date supplied: "+JSON.stringify(e)));n.selectedDates=n.config.allowInvalidPreload?i:i.filter((function(e){return e instanceof Date&&T(e,false)})),"range"===n.config.mode&&n.selectedDates.sort((function(e,t){return e.getTime()-t.getTime()}));}function W(e){return e.slice().map((function(e){return "string"==typeof e||"number"==typeof e||e instanceof Date?n.parseDate(e,void 0,true):e&&"object"==typeof e&&e.from&&e.to?{from:n.parseDate(e.from,void 0),to:n.parseDate(e.to,void 0)}:e})).filter((function(e){return e}))}function J(){n._positionElement=n.config.positionElement||n._input;}function K(e,t){if(void 0!==n.config){var i=n.config[e];if(void 0!==i&&i.length>0)for(var o=0;i[o]&&o<i.length;o++)i[o](n.selectedDates,n.input.value,n,t);"onChange"===e&&(n.input.dispatchEvent(G("change")),n.input.dispatchEvent(G("input")));}}function G(e){var t=document.createEvent("Event");return t.initEvent(e,true,true),t}function q(e){for(var t=0;t<n.selectedDates.length;t++){var i=n.selectedDates[t];if(i instanceof Date&&0===Yc(i,e))return ""+t}return  false}function Q(){n.config.noCalendar||n.isMobile||!n.monthNav||(n.yearElements.forEach((function(e,t){var i=new Date(n.currentYear,n.currentMonth,1);i.setMonth(n.currentMonth+t),n.config.showMonths>1||"static"===n.config.monthSelectorType?n.monthElements[t].textContent=_c(i.getMonth(),n.config.shorthandCurrentMonth,n.l10n)+" ":n.monthsDropdownContainer.value=i.getMonth().toString(),e.value=i.getFullYear().toString();})),n._hidePrevMonthArrow=void 0!==n.config.minDate&&(n.currentYear===n.config.minDate.getFullYear()?n.currentMonth<=n.config.minDate.getMonth():n.currentYear<n.config.minDate.getFullYear()),n._hideNextMonthArrow=void 0!==n.config.maxDate&&(n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth+1>n.config.maxDate.getMonth():n.currentYear>n.config.maxDate.getFullYear()));}function X(e){var t=e||(n.config.altInput?n.config.altFormat:n.config.dateFormat);return n.selectedDates.map((function(e){return n.formatDate(e,t)})).filter((function(e,t,i){return "range"!==n.config.mode||n.config.enableTime||i.indexOf(e)===t})).join("range"!==n.config.mode?n.config.conjunction:n.l10n.rangeSeparator)}function Z(e){ void 0===e&&(e=true),void 0!==n.mobileInput&&n.mobileFormatStr&&(n.mobileInput.value=void 0!==n.latestSelectedDateObj?n.formatDate(n.latestSelectedDateObj,n.mobileFormatStr):""),n.input.value=X(n.config.dateFormat),void 0!==n.altInput&&(n.altInput.value=X(n.config.altFormat)),false!==e&&K("onValueUpdate");}function ee(e){var t=Bc(e),i=n.prevMonthNav.contains(t),o=n.nextMonthNav.contains(t);i||o?E(i?-1:1):n.yearElements.indexOf(t)>=0?t.select():t.classList.contains("arrowUp")?n.changeYear(n.currentYear+1):t.classList.contains("arrowDown")&&n.changeYear(n.currentYear-1);}return function(){n.element=n.input=e,n.isOpen=false,function(){var i=["wrap","weekNumbers","allowInput","allowInvalidPreload","clickOpens","time_24hr","enableTime","noCalendar","altInput","shorthandCurrentMonth","inline","static","enableSeconds","disableMobile"],r=qc(qc({},JSON.parse(JSON.stringify(e.dataset||{}))),t),a={};n.config.parseDate=r.parseDate,n.config.formatDate=r.formatDate,Object.defineProperty(n.config,"enable",{get:function(){return n.config._enable},set:function(e){n.config._enable=W(e);}}),Object.defineProperty(n.config,"disable",{get:function(){return n.config._disable},set:function(e){n.config._disable=W(e);}});var s="time"===r.mode;if(!r.dateFormat&&(r.enableTime||s)){var l=tu.defaultConfig.dateFormat||xc.dateFormat;a.dateFormat=r.noCalendar||s?"H:i"+(r.enableSeconds?":S":""):l+" H:i"+(r.enableSeconds?":S":"");}if(r.altInput&&(r.enableTime||s)&&!r.altFormat){var c=tu.defaultConfig.altFormat||xc.altFormat;a.altFormat=r.noCalendar||s?"h:i"+(r.enableSeconds?":S K":" K"):c+" h:i"+(r.enableSeconds?":S":"")+" K";}Object.defineProperty(n.config,"minDate",{get:function(){return n.config._minDate},set:R("min")}),Object.defineProperty(n.config,"maxDate",{get:function(){return n.config._maxDate},set:R("max")});var u=function(e){return function(t){n.config["min"===e?"_minTime":"_maxTime"]=n.parseDate(t,"H:i:S");}};Object.defineProperty(n.config,"minTime",{get:function(){return n.config._minTime},set:u("min")}),Object.defineProperty(n.config,"maxTime",{get:function(){return n.config._maxTime},set:u("max")}),"time"===r.mode&&(n.config.noCalendar=true,n.config.enableTime=true);Object.assign(n.config,a,r);for(var d=0;d<i.length;d++)n.config[i[d]]=true===n.config[i[d]]||"true"===n.config[i[d]];Sc.filter((function(e){return void 0!==n.config[e]})).forEach((function(e){n.config[e]=Ac(n.config[e]||[]).map(o);})),n.isMobile=!n.config.disableMobile&&!n.config.inline&&"single"===n.config.mode&&!n.config.disable.length&&!n.config.enable&&!n.config.weekNumbers&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);for(d=0;d<n.config.plugins.length;d++){var f=n.config.plugins[d](n)||{};for(var m in f)Sc.indexOf(m)>-1?n.config[m]=Ac(f[m]).map(o).concat(n.config[m]):void 0===r[m]&&(n.config[m]=f[m]);}r.altInputClass||(n.config.altInputClass=_().className+" "+n.config.altInputClass);K("onParseConfig");}(),H(),function(){if(n.input=_(),!n.input)return void n.config.errorHandler(new Error("Invalid input element specified"));n.input._type=n.input.type,n.input.type="text",n.input.classList.add("flatpickr-input"),n._input=n.input,n.config.altInput&&(n.altInput=Pc(n.input.nodeName,n.config.altInputClass),n._input=n.altInput,n.altInput.placeholder=n.input.placeholder,n.altInput.disabled=n.input.disabled,n.altInput.required=n.input.required,n.altInput.tabIndex=n.input.tabIndex,n.altInput.type="text",n.input.setAttribute("type","hidden"),!n.config.static&&n.input.parentNode&&n.input.parentNode.insertBefore(n.altInput,n.input.nextSibling));n.config.allowInput||n._input.setAttribute("readonly","readonly");J();}(),function(){n.selectedDates=[],n.now=n.parseDate(n.config.now)||new Date;var e=n.config.defaultDate||("INPUT"!==n.input.nodeName&&"TEXTAREA"!==n.input.nodeName||!n.input.placeholder||n.input.value!==n.input.placeholder?n.input.value:null);e&&U(e,n.config.dateFormat);n._initialDate=n.selectedDates.length>0?n.selectedDates[0]:n.config.minDate&&n.config.minDate.getTime()>n.now.getTime()?n.config.minDate:n.config.maxDate&&n.config.maxDate.getTime()<n.now.getTime()?n.config.maxDate:n.now,n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth(),n.selectedDates.length>0&&(n.latestSelectedDateObj=n.selectedDates[0]);void 0!==n.config.minTime&&(n.config.minTime=n.parseDate(n.config.minTime,"H:i"));void 0!==n.config.maxTime&&(n.config.maxTime=n.parseDate(n.config.maxTime,"H:i"));n.minDateHasTime=!!n.config.minDate&&(n.config.minDate.getHours()>0||n.config.minDate.getMinutes()>0||n.config.minDate.getSeconds()>0),n.maxDateHasTime=!!n.config.maxDate&&(n.config.maxDate.getHours()>0||n.config.maxDate.getMinutes()>0||n.config.maxDate.getSeconds()>0);}(),n.utils={getDaysInMonth:function(e,t){return void 0===e&&(e=n.currentMonth),void 0===t&&(t=n.currentYear),1===e&&(t%4==0&&t%100!=0||t%400==0)?29:n.l10n.daysInMonth[e]}},n.isMobile||function(){var e=window.document.createDocumentFragment();if(n.calendarContainer=Pc("div","flatpickr-calendar"),n.calendarContainer.tabIndex=-1,!n.config.noCalendar){if(e.appendChild((n.monthNav=Pc("div","flatpickr-months"),n.yearElements=[],n.monthElements=[],n.prevMonthNav=Pc("span","flatpickr-prev-month"),n.prevMonthNav.innerHTML=n.config.prevArrow,n.nextMonthNav=Pc("span","flatpickr-next-month"),n.nextMonthNav.innerHTML=n.config.nextArrow,S(),Object.defineProperty(n,"_hidePrevMonthArrow",{get:function(){return n.__hidePrevMonthArrow},set:function(e){n.__hidePrevMonthArrow!==e&&(Tc(n.prevMonthNav,"flatpickr-disabled",e),n.__hidePrevMonthArrow=e);}}),Object.defineProperty(n,"_hideNextMonthArrow",{get:function(){return n.__hideNextMonthArrow},set:function(e){n.__hideNextMonthArrow!==e&&(Tc(n.nextMonthNav,"flatpickr-disabled",e),n.__hideNextMonthArrow=e);}}),n.currentYearElement=n.yearElements[0],Q(),n.monthNav)),n.innerContainer=Pc("div","flatpickr-innerContainer"),n.config.weekNumbers){var t=function(){n.calendarContainer.classList.add("hasWeeks");var e=Pc("div","flatpickr-weekwrapper");e.appendChild(Pc("span","flatpickr-weekday",n.l10n.weekAbbreviation));var t=Pc("div","flatpickr-weeks");return e.appendChild(t),{weekWrapper:e,weekNumbers:t}}(),i=t.weekWrapper,o=t.weekNumbers;n.innerContainer.appendChild(i),n.weekNumbers=o,n.weekWrapper=i;}n.rContainer=Pc("div","flatpickr-rContainer"),n.rContainer.appendChild(x()),n.daysContainer||(n.daysContainer=Pc("div","flatpickr-days"),n.daysContainer.tabIndex=-1),k(),n.rContainer.appendChild(n.daysContainer),n.innerContainer.appendChild(n.rContainer),e.appendChild(n.innerContainer);}n.config.enableTime&&e.appendChild(function(){n.calendarContainer.classList.add("hasTime"),n.config.noCalendar&&n.calendarContainer.classList.add("noCalendar");var e=Gc(n.config);n.timeContainer=Pc("div","flatpickr-time"),n.timeContainer.tabIndex=-1;var t=Pc("span","flatpickr-time-separator",":"),i=Fc("flatpickr-hour",{"aria-label":n.l10n.hourAriaLabel});n.hourElement=i.getElementsByTagName("input")[0];var o=Fc("flatpickr-minute",{"aria-label":n.l10n.minuteAriaLabel});n.minuteElement=o.getElementsByTagName("input")[0],n.hourElement.tabIndex=n.minuteElement.tabIndex=-1,n.hourElement.value=Ec(n.latestSelectedDateObj?n.latestSelectedDateObj.getHours():n.config.time_24hr?e.hours:function(e){switch(e%24){case 0:case 12:return 12;default:return e%12}}(e.hours)),n.minuteElement.value=Ec(n.latestSelectedDateObj?n.latestSelectedDateObj.getMinutes():e.minutes),n.hourElement.setAttribute("step",n.config.hourIncrement.toString()),n.minuteElement.setAttribute("step",n.config.minuteIncrement.toString()),n.hourElement.setAttribute("min",n.config.time_24hr?"0":"1"),n.hourElement.setAttribute("max",n.config.time_24hr?"23":"12"),n.hourElement.setAttribute("maxlength","2"),n.minuteElement.setAttribute("min","0"),n.minuteElement.setAttribute("max","59"),n.minuteElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(i),n.timeContainer.appendChild(t),n.timeContainer.appendChild(o),n.config.time_24hr&&n.timeContainer.classList.add("time24hr");if(n.config.enableSeconds){n.timeContainer.classList.add("hasSeconds");var r=Fc("flatpickr-second");n.secondElement=r.getElementsByTagName("input")[0],n.secondElement.value=Ec(n.latestSelectedDateObj?n.latestSelectedDateObj.getSeconds():e.seconds),n.secondElement.setAttribute("step",n.minuteElement.getAttribute("step")),n.secondElement.setAttribute("min","0"),n.secondElement.setAttribute("max","59"),n.secondElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(Pc("span","flatpickr-time-separator",":")),n.timeContainer.appendChild(r);}n.config.time_24hr||(n.amPM=Pc("span","flatpickr-am-pm",n.l10n.amPM[Ic((n.latestSelectedDateObj?n.hourElement.value:n.config.defaultHour)>11)]),n.amPM.title=n.l10n.toggleTitle,n.amPM.tabIndex=-1,n.timeContainer.appendChild(n.amPM));return n.timeContainer}());Tc(n.calendarContainer,"rangeMode","range"===n.config.mode),Tc(n.calendarContainer,"animate",true===n.config.animate),Tc(n.calendarContainer,"multiMonth",n.config.showMonths>1),n.calendarContainer.appendChild(e);var r=void 0!==n.config.appendTo&&void 0!==n.config.appendTo.nodeType;if((n.config.inline||n.config.static)&&(n.calendarContainer.classList.add(n.config.inline?"inline":"static"),n.config.inline&&(!r&&n.element.parentNode?n.element.parentNode.insertBefore(n.calendarContainer,n._input.nextSibling):void 0!==n.config.appendTo&&n.config.appendTo.appendChild(n.calendarContainer)),n.config.static)){var a=Pc("div","flatpickr-wrapper");n.element.parentNode&&n.element.parentNode.insertBefore(a,n.element),a.appendChild(n.element),n.altInput&&a.appendChild(n.altInput),a.appendChild(n.calendarContainer);}n.config.static||n.config.inline||(void 0!==n.config.appendTo?n.config.appendTo:window.document.body).appendChild(n.calendarContainer);}(),function(){n.config.wrap&&["open","close","toggle","clear"].forEach((function(e){Array.prototype.forEach.call(n.element.querySelectorAll("[data-"+e+"]"),(function(t){return d(t,"click",n[e])}));}));if(n.isMobile)return void function(){var e=n.config.enableTime?n.config.noCalendar?"time":"datetime-local":"date";n.mobileInput=Pc("input",n.input.className+" flatpickr-mobile"),n.mobileInput.tabIndex=1,n.mobileInput.type=e,n.mobileInput.disabled=n.input.disabled,n.mobileInput.required=n.input.required,n.mobileInput.placeholder=n.input.placeholder,n.mobileFormatStr="datetime-local"===e?"Y-m-d\\TH:i:S":"date"===e?"Y-m-d":"H:i:S",n.selectedDates.length>0&&(n.mobileInput.defaultValue=n.mobileInput.value=n.formatDate(n.selectedDates[0],n.mobileFormatStr));n.config.minDate&&(n.mobileInput.min=n.formatDate(n.config.minDate,"Y-m-d"));n.config.maxDate&&(n.mobileInput.max=n.formatDate(n.config.maxDate,"Y-m-d"));n.input.getAttribute("step")&&(n.mobileInput.step=String(n.input.getAttribute("step")));n.input.type="hidden",void 0!==n.altInput&&(n.altInput.type="hidden");try{n.input.parentNode&&n.input.parentNode.insertBefore(n.mobileInput,n.input.nextSibling);}catch(e){}d(n.mobileInput,"change",(function(e){n.setDate(Bc(e).value,false,n.mobileFormatStr),K("onChange"),K("onClose");}));}();var e=Mc(B,50);n._debouncedChange=Mc(f,Xc),n.daysContainer&&!/iPhone|iPad|iPod/i.test(navigator.userAgent)&&d(n.daysContainer,"mouseover",(function(e){"range"===n.config.mode&&F(Bc(e));}));d(n._input,"keydown",L),void 0!==n.calendarContainer&&d(n.calendarContainer,"keydown",L);n.config.inline||n.config.static||d(window,"resize",e);void 0!==window.ontouchstart?d(window.document,"touchstart",M):d(window.document,"mousedown",M);d(window.document,"focus",M,{capture:true}),true===n.config.clickOpens&&(d(n._input,"focus",n.open),d(n._input,"click",n.open));void 0!==n.daysContainer&&(d(n.monthNav,"click",ee),d(n.monthNav,["keyup","increment"],u),d(n.daysContainer,"click",V));if(void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement){var t=function(e){return Bc(e).select()};d(n.timeContainer,["increment"],a),d(n.timeContainer,"blur",a,{capture:true}),d(n.timeContainer,"click",h),d([n.hourElement,n.minuteElement],["focus","click"],t),void 0!==n.secondElement&&d(n.secondElement,"focus",(function(){return n.secondElement&&n.secondElement.select()})),void 0!==n.amPM&&d(n.amPM,"click",(function(e){a(e);}));}n.config.allowInput&&d(n._input,"blur",O);}(),(n.selectedDates.length||n.config.noCalendar)&&(n.config.enableTime&&l(n.config.noCalendar?n.latestSelectedDateObj:void 0),Z(false)),r();var i=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);!n.isMobile&&i&&j(),K("onReady");}(),n}function eu(e,t){for(var n=Array.prototype.slice.call(e).filter((function(e){return e instanceof HTMLElement})),i=[],o=0;o<n.length;o++){var r=n[o];try{if(null!==r.getAttribute("data-fp-omit"))continue;void 0!==r._flatpickr&&(r._flatpickr.destroy(),r._flatpickr=void 0),r._flatpickr=Zc(r,t||{}),i.push(r._flatpickr);}catch(e){console.error(e);}}return 1===i.length?i[0]:i}"undefined"!=typeof HTMLElement&&"undefined"!=typeof HTMLCollection&&"undefined"!=typeof NodeList&&(HTMLCollection.prototype.flatpickr=NodeList.prototype.flatpickr=function(e){return eu(this,e)},HTMLElement.prototype.flatpickr=function(e){return eu([this],e)});var tu=function(e,t){return "string"==typeof e?eu(window.document.querySelectorAll(e),t):e instanceof Node?eu([e],t):eu(e,t)};tu.defaultConfig={},tu.l10ns={en:qc({},Dc),default:qc({},Dc)},tu.localize=function(e){tu.l10ns.default=qc(qc({},tu.l10ns.default),e);},tu.setDefaults=function(e){tu.defaultConfig=qc(qc({},tu.defaultConfig),e);},tu.parseDate=Vc({}),tu.formatDate=$c({}),tu.compareDates=Yc,"undefined"!=typeof jQuery&&void 0!==jQuery.fn&&(jQuery.fn.flatpickr=function(e){return eu(this,e)}),Date.prototype.fp_incr=function(e){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+("string"==typeof e?parseInt(e,10):e))},"undefined"!=typeof window&&(window.flatpickr=tu);const nu=["onCreate","onDestroy"],iu=["onChange","onOpen","onClose","onMonthChange","onYearChange","onReady","onValueUpdate","onDayCreate"],ou=t=>{const n=useMemo((()=>({...t})),[t]),{defaultValue:i,options:o={},value:a,children:s,render:l}=n,f=useMemo((()=>((e,t)=>(iu.forEach((n=>{const i=t[n],o=e[n];if(i){o&&!Array.isArray(o)?e[n]=[e[n]]:e[n]||(e[n]=[]);const t=Array.isArray(i)?i:[i];0===e[n].length?e[n]=t:e[n].push(...t);}})),iu.forEach((e=>{delete t[e];})),nu.forEach((e=>{delete t[e];})),e))(o,n)),[o,n]),m=useRef(null),p=useRef(void 0);useImperativeHandle(t.ref,(()=>({get flatpickr(){return p.current}})),[]),useEffect((()=>{var e;if(f.onClose=f.onClose||(()=>{var e;null!=(e=m.current)&&e.blur&&m.current.blur();}),p.current=((null==(n=tu)?void 0:n.default)||tu)(m.current,f),p.current&&void 0!==a&&p.current.setDate(a,false),t.onCreate&&t.onCreate(p.current),p.current){const t=Object.getOwnPropertyNames(f);for(let n=t.length-1;n>=0;n--){const i=t[n];let o=f[i];(null==o?void 0:o.toString())!==(null==(e=p.current.config[i])?void 0:e.toString())&&(iu.includes(i)&&!Array.isArray(o)&&(o=[o]),p.current.set(i,o));} void 0!==a&&a!==p.current.input.value&&p.current.setDate(a,false);}var n;return ()=>{t.onDestroy&&t.onDestroy(p.current),p.current&&p.current.destroy(),p.current=void 0;}}),[f,o,n,a,t]);const g=useCallback((e=>{m.current=e;}),[]);if(l)return l({...n,defaultValue:i,value:a},g);const v=useCallback((e=>{var n,i;t&&t.onChange&&(Array.isArray(null==t?void 0:t.onChange)?null==(n=null==t?void 0:t.onChange)||n.forEach((()=>[new Date(e.target.value)]),(null==a?void 0:a.toString())||""):"function"==typeof t.onChange&&(null==(i=null==t?void 0:t.onChange)||i.call(t,[new Date(e.target.value)],(null==a?void 0:a.toString())||"",p.current)));}),[t,a]);return o.wrap?jsxRuntimeExports.jsx("div",{className:"flatpickr",ref:g,children:s}):jsxRuntimeExports.jsx("input",{onChange:v,...n,value:null==a?void 0:a.toString(),defaultValue:i,ref:g})},ru="T42.GD.Execute",au=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],su=(e,t)=>e in t;function lu({time:e,frequency:t,day:n}){const i=new Date(`01/01/2000 ${e}`),o=i.getMinutes(),r=i.getHours();let a="*";return "weekly"===t&&n&&(a=function(e){const t={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};if(!su(e,t))throw new Error(`Invalid day: ${e}`);return t[e]}(n).toString()),`${o} ${r} * * ${a}`}function cu(e){const t=useContext(IOConnectContext),{value:n,update:i}=Wr({prefKey:uu(e)}),{value:o,update:a}=Wr({prefKey:uu(e,"Time")}),{value:l,update:c}=Wr({prefKey:uu(e,"Frequency")}),{value:d,update:f}=Wr({prefKey:uu(e,"Day")}),m=useCallback((async()=>{try{await t.interop.invoke(ru,{command:`cancel-${e}`});}catch(e){console.error(e);}}),[t,e]),h=useCallback((async()=>{try{const n=lu({time:o??"12:00 AM",frequency:l??"daily",day:"weekly"===l?d:"*"});await t.interop.invoke(ru,{command:`schedule-${e}`,args:{cronTime:n,discardUnsavedLayoutChanges:!1}});}catch(t){console.error(`Failed to update cron job for ${e}:`,t);}}),[t,e,o,l,d]);useEffect((()=>{t&&n&&h();}),[t,n,h]);return {enabled:n??false,time:o??"12:00 AM",frequency:l??"daily",day:d??"Monday",setEnabled:async e=>{e||await m();try{await i(e);}catch(e){console.error("Failed to update enabled state:",e);}},setTime:async e=>{try{await a(e);}catch(e){console.error("Failed to update time:",e);}},setFrequency:async e=>{try{await c(e),"daily"===e&&await f(void 0);}catch(e){console.error("Failed to update frequency:",e);}},setDay:async e=>{var t;if(t=e,au.includes(t))try{await f(e);}catch(e){console.error("Failed to update day:",e);}else console.error("Invalid day provided");}}}function uu(e,t){const n="restart"===e?"_system_scheduleRestart":"_system_scheduleShutdown";return t?`${n}${t}`:n}function du({className:n,variant:i,...o}){const r=k("io-block-list-gap",i,n),{enabled:a,time:s,frequency:l,day:c,setEnabled:u,setTime:d,setFrequency:f,setDay:m}=cu(i);return jsxRuntimeExports.jsxs(I,{className:r,...o,children:[jsxRuntimeExports.jsx(Vi,{label:`Schedule ${i}`,align:"right",onChange:e=>u(e.target.checked),checked:a}),jsxRuntimeExports.jsxs("div",{className:"scheduler-controls",children:[jsxRuntimeExports.jsxs("div",{className:"io-control-input io-control-leading-icon direction-up",children:[jsxRuntimeExports.jsx(C,{variant:"clock"}),jsxRuntimeExports.jsx(ou,{className:"io-input",options:{enableTime:true,noCalendar:true,dateFormat:"h:i K",defaultDate:s,clickOpens:true},value:s,onClose:async([e])=>{const t=e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:true});await d(t);}})]}),jsxRuntimeExports.jsxs(Mi,{text:l.charAt(0).toUpperCase()+l.slice(1),icon:"chevron-down",iconRight:true,children:[jsxRuntimeExports.jsx(Mi.Item,{onClick:()=>f("daily"),children:"Daily"}),jsxRuntimeExports.jsx(Mi.Item,{onClick:()=>f("weekly"),children:"Weekly"})]}),"weekly"===l&&jsxRuntimeExports.jsx(Mi,{text:c,icon:"chevron-down",iconRight:true,children:au.map((t=>jsxRuntimeExports.jsx(Mi.Item,{onClick:()=>m(t),children:t},t)))})]})]})}function fu({className:t,...n}){return jsxRuntimeExports.jsx(du,{...n,className:t,variant:"restart"})}function mu({className:t,...n}){return jsxRuntimeExports.jsx(du,{...n,className:t,variant:"shutdown"})}const hu={Body:oc,General:rc,Theme:sc,PinnedPosition:cc,AllowDocking:dc,MinimizeToTray:fc,AutoClose:mc,ShowTutorialOnStartup:hc,Layouts:pc,LayoutsRestoreLastSaved:gc,LayoutsSaveCurrentOnExit:vc,LayoutsShowUnsavedChangesPrompt:yc,LayoutsShowDeletePrompt:wc,Downloads:bc,DownloadsAskForEachDownload:kc,DownloadsLocation:Cc,System:Nc,SystemRestartSection:fu,SystemShutdownSection:mu},pu=createContext(hu),gu=memo((({children:t,components:n})=>{const i=useMemo((()=>({...hu,...n})),[n]);return jsxRuntimeExports.jsx(pu.Provider,{value:i,children:t})}));gu.displayName="PreferencesPanelComponentsStoreProvider";const vu=()=>useContext(pu);const ku=n=>{const{General:i,Layouts:o}=Eu();return jsxRuntimeExports.jsxs(Oi,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{})]})},Cu=({className:t,title:n="General",...i})=>{const{Theme:o}=Eu();return jsxRuntimeExports.jsx(I,{className:k("io-block io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},Nu=({className:n,title:i="Layouts",...o})=>{const{LayoutsShowDeletePrompt:r,LayoutsShowUnsavedChangesPrompt:a}=Eu();return jsxRuntimeExports.jsxs(I,{className:k("io-block io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(r,{})]})},Su={Body:ku,General:Cu,Theme:sc,Layouts:Nu,LayoutsShowUnsavedChangesPrompt:yc,LayoutsShowDeletePrompt:wc},xu=createContext(Su),Du=memo((({children:t,components:n})=>{const i=useMemo((()=>({...Su,...n})),[n]);return jsxRuntimeExports.jsx(xu.Provider,{value:i,children:t})}));Du.displayName="PreferencesPanelComponentsStoreProvider";const Eu=()=>useContext(xu);const Lu=({name:n,value:i})=>jsxRuntimeExports.jsxs("div",{className:"io-profile-section-item",children:[jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-name",children:n}),jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-value",children:i})]}),Fu=({className:n,items:i,title:o})=>jsxRuntimeExports.jsxs("div",{className:k("io-profile-section-body",n),children:[o&&jsxRuntimeExports.jsx(E,{className:"io-profile-section-title",text:o}),i.map((({name:t,value:n})=>jsxRuntimeExports.jsx(Lu,{name:t,value:n},t)))]}),Bu=({className:n,items:i,title:o})=>jsxRuntimeExports.jsxs("section",{className:k("io-profile-section",n),children:[jsxRuntimeExports.jsx(Fu,{items:i,title:o}),jsxRuntimeExports.jsx(W,{className:"mt-8"})]}),Ru=({title:t="License",...n})=>jsxRuntimeExports.jsx(Bu,{title:t,...n}),_u=({title:t="Version",...n})=>jsxRuntimeExports.jsx(Bu,{title:t,...n}),Hu=({title:t="Plugins",...n})=>jsxRuntimeExports.jsx(Bu,{title:t,...n}),ju=({className:n})=>{const i=Zi()?"io.Connect Desktop":"io.Connect Browser";return jsxRuntimeExports.jsxs("div",{className:k("io-trademark-container",n),children:[jsxRuntimeExports.jsx("h4",{className:"io-trademark-title",children:i}),jsxRuntimeExports.jsxs("p",{className:"io-trademark-text",children:[i,"® is a registered trademark of"," ",jsxRuntimeExports.jsx("a",{href:"https://www.interop.io",rel:"noreferrer",target:"_blank",children:"Interop Inc©"})," ",(new Date).getFullYear(),". All rights reserved."]})]})},zu=({avatarInitials:n=(Zi()?"CD":"CB"),className:i,items:o,onLogout:r,title:a})=>jsxRuntimeExports.jsxs("section",{className:k("io-profile-section",i),children:[jsxRuntimeExports.jsxs("div",{className:"io-user-details-container",children:[jsxRuntimeExports.jsx("div",{className:"io-user-avatar",children:n}),jsxRuntimeExports.jsx(Fu,{className:"mt-12",items:o,title:a})]}),r&&jsxRuntimeExports.jsx(M,{className:"io-log-out-button",onClick:r,variant:"primary",icon:"arrow-right-from-bracket",children:"Log out"}),jsxRuntimeExports.jsx(W,{className:"mt-8"})]}),$u={LicenseSection:Ru,ProductsInfoSection:_u,PluginsSection:Hu,Trademark:ju,UserSection:zu},Vu=createContext($u),Yu=memo((({children:t,components:n})=>{const i=useMemo((()=>({...$u,...n})),[n]);return jsxRuntimeExports.jsx(Vu.Provider,{value:i,children:t})}));Yu.displayName="ProfilePanelComponentsStoreProvider";

const GlueControllerContext = createContext(null);
const useGlueController = () => {
    const context = useContext(GlueControllerContext);
    if (!context) {
        throw new Error(`useGlueController must be used within a GlueControllerContextProvider`);
    }
    return context;
};
const CustomGlueControllerProvider = ({ glueController, children }) => {
    return i__default.createElement(GlueControllerContext.Provider, { value: glueController }, children);
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

const { ChannelSelector } = ia;
const ChannelSelectorWrapper = ({ mode, channelsDisplayMode }) => {
    const glueController = useGlueController();
    const channelsMode = glueController.io.channels.mode;
    const [variantToggle, setVariantToggle] = useState(true);
    const [channelsInfo, setChannelsInfo] = useState([]);
    const [type, setType] = useState(getInitialType(glueController));
    const handleOnChannelSelect = useCallback(async ({ name }) => {
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
    const handleOnChannelRestrict = useCallback(async ({ name, read, write }) => {
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
    const getChannels = useCallback(async () => {
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
    useEffect(() => {
        getChannels();
    }, [getChannels]);
    useEffect(() => {
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
    return (i__default.createElement(K, { onClick: getChannels, variant: "outline" },
        mode === "default" ? (i__default.createElement(K.ButtonIcon, { className: "io-btn-icon", icon: "link", iconSize: "16", size: "32", style: { backgroundColor: getSelectorButtonBackgroundColor() }, variant: "circle" })) : (i__default.createElement(K.Item, { append: i__default.createElement(C, { variant: "chevron-right", size: "10" }) },
            i__default.createElement(K.Button, { variant: "link", icon: "link", text: "Select Channel", iconRight: false }))),
        i__default.createElement(K.Content, null,
            i__default.createElement(ChannelSelector, { className: "io-list-channels", variant: type, channels: channelsInfo, onChannelSelect: handleOnChannelSelect, variantToggle: variantToggle, onVariantChange: onTypeChange, onChannelRestrict: handleOnChannelRestrict }))));
};

const PositionDropdown = ({ position, positionClickHandler }) => {
    const positions = ["bottom", "left", "right", "top"].map((p) => {
        return (i__default.createElement(K.Item, { key: p, isSelected: p === position, onClick: () => positionClickHandler(p) }, p[0].toUpperCase() + p.slice(1)));
    });
    return (i__default.createElement(K.List, { variant: "single", checkIcon: "check" },
        i__default.createElement(K.ItemSection, null, "Widget Position"),
        positions));
};

const ModeDropdown = ({ mode, modeClickHandler }) => {
    return (i__default.createElement(K.List, null,
        i__default.createElement(K.ItemSection, null, "Widget Mode"),
        i__default.createElement(K.Item, null,
            i__default.createElement(Vi, { label: "Compact", align: "right", checked: mode === "compact", onChange: () => modeClickHandler(mode === "compact" ? "default" : "compact") }))));
};

const Settings = ({ position, positionClickHandler, mode, modeClickHandler }) => {
    return (i__default.createElement(K, { align: "up", variant: "outline" },
        i__default.createElement(K.ButtonIcon, { className: "io-btn-icon", icon: "cog", iconSize: "16", size: "32", variant: "circle" }),
        i__default.createElement(K.Content, null,
            i__default.createElement(PositionDropdown, { position: position, positionClickHandler: positionClickHandler }),
            i__default.createElement(ModeDropdown, { mode: mode, modeClickHandler: modeClickHandler }))));
};

const DefaultWidget = ({ showBringBackToWspBtn, handleBringBackToWspClick, showChannelSelectorBtn, position, positionClickHandler, mode, modeClickHandler, channelsDisplayMode }) => {
    return (i__default.createElement(G, { align: "left", className: "io-btn-group", variant: "default" },
        showChannelSelectorBtn ? i__default.createElement(ChannelSelectorWrapper, { mode: mode, channelsDisplayMode: channelsDisplayMode }) : null,
        showBringBackToWspBtn ? (i__default.createElement(N, { className: "io-btn-icon", icon: "pop-in-widget", iconSize: "16", size: "32", variant: "circle", onClick: handleBringBackToWspClick })) : null,
        i__default.createElement(Settings, { position: position, positionClickHandler: positionClickHandler, mode: mode, modeClickHandler: modeClickHandler })));
};

const CompactWidget = ({ position, positionClickHandler, mode, modeClickHandler, channelsDisplayMode, handleBringBackToWspClick, showBringBackToWspBtn, showChannelSelectorBtn, }) => {
    return (i__default.createElement(K, { variant: "outline" },
        i__default.createElement(K.ButtonIcon, { icon: "logo", className: "io-btn-icon", iconSize: "16", size: "32", variant: "circle" }),
        i__default.createElement(K.Content, null,
            i__default.createElement(K.ItemSection, null, "App"),
            i__default.createElement(K.List, null,
                showBringBackToWspBtn ? (i__default.createElement(K.Item, { onClick: handleBringBackToWspClick, prepend: i__default.createElement(C, { variant: "pop-in-widget" }) }, "Pop In")) : null,
                showChannelSelectorBtn ? i__default.createElement(ChannelSelectorWrapper, { mode: mode, channelsDisplayMode: channelsDisplayMode }) : null),
            i__default.createElement(PositionDropdown, { position: position, positionClickHandler: positionClickHandler }),
            i__default.createElement(ModeDropdown, { mode: mode, modeClickHandler: modeClickHandler }))));
};

const useThemeSync = () => {
    const glueController = useGlueController();
    useEffect(() => {
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
    const [position, setPosition] = useState(glueController.config.position ?? "bottom");
    const [mode, setMode] = useState(glueController.config.mode ?? "default");
    const [showBringBackToWspBtn, setShowBringBackToWspBtn] = useState(false);
    const className = useMemo(() => {
        const classNames = [
            "io-window-widget",
            ...(position !== "bottom" ? [`io-window-widget-${position}`] : []),
            ...(mode !== "default" ? [`io-window-widget-${mode}`] : []),
        ];
        return classNames.join(" ");
    }, [position, mode]);
    useEffect(() => {
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
    const handleBringBackToWspClick = useCallback(async () => {
        try {
            await glueController.bringBackToWsp();
        }
        catch (error) {
            glueController.getLogger(`widget-component-${glueController.windowId}`).error(error);
            await glueController.removeEjectedWindowContext();
            setShowBringBackToWspBtn(false);
        }
    }, [glueController]);
    return (i__default.createElement("div", { className: className, draggable: "true", onDragEnd: handleDragEnd, role: "button", tabIndex: 0 },
        i__default.createElement(DragSection, null),
        mode === "default" ? (i__default.createElement(DefaultWidget, { ...getWidgetProps() })) : (i__default.createElement(CompactWidget, { ...getWidgetProps() }))));
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
        reactRoot.render(i__default.createElement(CustomGlueControllerProvider, { glueController: this.glueController },
            i__default.createElement(Widget, null)));
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

export { IOBrowserWidgetFactory as default };
//# sourceMappingURL=io-browser-widget-react.es.js.map
