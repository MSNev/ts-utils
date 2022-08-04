/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { objForEachKey } from "../object/for_each_key";
import { objDeepFreeze } from "../object/object";

/**
 * A type that identifies an enum class generated from a constant enum.
 * @typeParam E - The constant enum type
 *
 * Returned from {@link createEnum}
 */
export declare type EnumCls<E = any> = { readonly [key in keyof E extends string | number | symbol ? keyof E : never]: key extends string ? E[key] : key };

/**
 * A type that identifies an object whose property values are generally mapped to the key of the source type.
 * @typeParam E - The source constant enum type which isendifies the keys and values
 * @typeParam I - The resulting set of keys from the source type.
 *
 * Returned from {@link createEnumKeyMap}
 */
export declare type EnumNameMap<E = any, I = keyof E> = { readonly [key in keyof E extends string | number | symbol ? keyof E : never]: key extends string ? key : keyof E } & I;

/**
 * A type that identifies an object whose property values are mapped to the resulting values of the source objects keys.
 * @typeParam E - The source type which identifies the keys.
 * @typeParam V - The resulting set of keys from the source type.
 *
 * Returned from {@link createEnumValueMap}
 */
export declare type EnumValueMap<E = any, V = E[keyof E]> = { readonly [key in keyof E extends string | number | symbol ? keyof E : never]: key extends string ? E[key] : E[key] } & V;

/**
 * A type that maps the keys of E to the type of V.
 * @typeParam E - The type of object that defines the Key (typically a constant enum)
 * @typeParam V - The value type, typically `string`, `number` but may also be a complex type.
 *
 * Returned from {@link createSimpleMap}
 */
export declare type EnumTypeMap<E, V> = { readonly [key in keyof E extends string ? keyof E : never]: V };

/**
 * Create a TypeScript style enum class which is a mapping that maps from the key -> value and the value -> key.
 * This is effectively the same as defining a non-constant enum, but this only repeats the "Name" of the enum value once.
 * @example
 * ```ts
 * const enum Animal {
 *    Dog = 0,
 *    Cat = 1,
 *    Butterfly = 2,
 *    Bear = 3
 * }
 * const Animals = createEnum<typeof Animal>({
 *    Dog: Animal.Dog,
 *    Cat: Animal.Cat,
 *    Butterfly: Animal.Butterfly,
 *    Bear: Animal.Bear
 * });
 * // You end up with an object that maps everything to the name
 * Animals.Dog === 0;           // true
 * Animals[0] === "Dog";        // true
 * Animals["Dog"] === 0;        // true
 * Animals.Cat === 1;           // true
 * Animals[1] === "Cat";        // true
 * Animals["Cat"] === 1;        // true
 * ```

 * @param values - The values to populate on the new object
 * @typeParam E - Identifies the const enum type being mapped
 * @returns A new frozen (immutable) object which looks and acts like a TypeScript Enum class.
 */
export function createEnum<E>(values: { [key in keyof E]: E[keyof E] }): EnumCls<E> {
    let theEnum: any = {};
    objForEachKey(values, (field, value) => {
        theEnum[field] = value;
        theEnum[value] = field;
    });

    return objDeepFreeze(theEnum);
}

/**
 * Create a map object which contains both the property key and value which both map to the key,
 * E[key] => key and E[value] => key.
 * @example
 * ```ts
 * const enum Animal {
 *    Dog = 0,
 *    Cat = 1,
 *    Butterfly = 2,
 *    Bear = 3
 * }
 * const animalMap = createEnumKeyMap<typeof Animal>({
 *    Dog: Animal.Dog,
 *    Cat: Animal.Cat,
 *    Butterfly: Animal.Butterfly,
 *    Bear: Animal.Bear
 * });
 * // You end up with an object that maps everything to the name
 * animalMap.Dog === "Dog";         // true
 * animalMap[0] === "Dog";          // true
 * animalMap["Dog"] === "Dog";      // true
 * animalMap.Cat === "Cat";         // true
 * animalMap[1] === "Cat";          // true
 * animalMap["Cat"] === "Cat";      // true
 * // Helper function to always return the "Name" of the type of animal
 * function getAnimalType(type: string | number | Animal) {
 *     return animalMap[type];
 * }
 * ```
 * @param values - The values to populate on the new object
 * @typeParam E - Identifies the const enum type being mapped
 * @returns A new frozen (immutable) object which contains a property for each key and value that returns the value.
 */
export function createEnumKeyMap<E>(values: { [key in keyof E]: E[keyof E] }): EnumNameMap<E, keyof E> {
    let mapClass: any = {};
    objForEachKey(values, (key, value) => {
        mapClass[key] = key;
        mapClass[value] = key;
    });

    return objDeepFreeze(mapClass);
}

/**
 * Create a map object which contains both the perperty key and value which both map to the resulting value,
 * E[key] => value and E[value] => value.
 * @example
 * ```ts
 * const enum Animal {
 *    Dog = 0,
 *    Cat = 1,
 *    Butterfly = 2,
 *    Bear = 3
 * }
 * const animalMap = createEnumValueMap<typeof Animal>({
 *    Dog: Animal.Dog,
 *    Cat: Animal.Cat,
 *    Butterfly: Animal.Butterfly,
 *    Bear: Animal.Bear
 * });
 * // You end up with an object that maps everything to the name
 * animalMap.Dog === 0;     // true
 * animalMap[0] === 0;      // true
 * animalMap["Dog"] === 0;  // true
 * animalMap.Cat === 1;     // true
 * animalMap[1] === 1;      // true
 * animalMap["Cat"] === 1;  // true
 *
 * // Helper function to always return the "Name" of the type of animal
 * function getAnimalValue(type: string | number | Animal) {
 *     return animalMap[type];
 * }
 * ```

 * @param values - The values to populate on the new object
 * @typeParam E - Identifies the const enum type being mapped
 * @returns A new frozen (immutable) object which contains a property for each key and value that returns the value.
 */
export function createEnumValueMap<E>(values: { [key in keyof E]: E[keyof E] }): EnumValueMap<E, E[keyof E]> {
    let mapClass: any = {};
    objForEachKey(values, (key, value) => {
        mapClass[key] = value;
        mapClass[value] = value;
    });

    return objDeepFreeze(mapClass);
}

/**
 * Create a map object which contains both the perperty key and value which both map to the requested
 * generic mapValue with a type of V, E[key] => mapValue and E[value] => mapValue.
 * @example
 * ```ts
 * const enum Animal {
 *    Dog = 0,
 *    Cat = 1,
 *    Butterfly = 2,
 *    Bear = 3
 * };
 * // Creates a simple mapping to a string value
 * const animalFamilyMap = createValueMap<typeof Animal, string>({
 *    Dog: [ Animal.Dog, "Canidae"],
 *    Cat: [ Animal.Cat, "Felidae"],
 *    Butterfly: [ Animal.Butterfly, "Papilionidae"],
 *    Bear: [ Animal.Bear, "Ursidae"]
 * });
 * // You end up with an object that maps everything to the name
 * animalMap.Dog === "Canidae";     // true with typeof animalMap.Dog is "string"
 * animalMap[0] === "Canidae";      // true with typeof animalMap[0] is "string"
 * animalMap["Dog"] === "Canidae";  // true with typeof animalMap["Dog"] is "string"
 * animalMap.Cat === "Felidae";     // true with typeof animalMap.Cat is "string"
 * animalMap[1] === "Felidae";      // true with typeof animalMap[1] is "string"
 * animalMap["Cat"] === "Felidae";  // true with typeof animalMap["Cat"] is "string"
 * ```
 * @param values - The values to populate on the new object
 * @typeParam E - Identifies the const enum type (eg. typeof Animal);
 * @typeParam V - Identifies the type of the mapping `string`; `number`; etc is not restructed to primitive types.
 * @returns A new frozen (immutable) object which contains a property for each key and value that returns the defiend mapped value.
 */
export function createSimpleMap<E, V>(values: { [key in keyof E]: [ E[keyof E], V] }): EnumTypeMap<E, V> {
    let mapClass: any = {};
    objForEachKey(values, (field, value) => {
        mapClass[field] = value[1];
        mapClass[value[0]] = value[1];
    });

    return objDeepFreeze(mapClass);
}

/**
 * Create a strongly types map object which contains both the perperty key and value which both map
 * to the requested mapValue,
 * E[key] => mapValue and E[value] => mapValue.
 * - E = the const enum type (typeof Animal);
 * - V = Identifies the valid values for the keys, this should include both the enum numeric and string key of the type. The
 * resulting "Value" of each entry identifies the valid values withing the assignments.
 * @example
 * ```ts
 * // Create a strongly types map
 * const animalFamilyMap = createTypeMap<typeof Animal, {
 *     // Defined the enum lookups
 *     [Animal.Dog]: "Canidae",
 *     [Animal.Cat]: "Felidae",
 *     [Animal.Butterfly]: "Papilionidae",
 *     [Animal.Bear]: "Ursidae",
 *     // Defined Named reference
 *     Dog: "Canidae",
 *     Cat: "Felidae",
 *     Butterfly: "Papilionidae",
 *     Bear: "Ursidae",
 * }>({
 *     Dog: [ Animal.Dog, "Canidae"],
 *     Cat: [ Animal.Cat, "Felidae"],
 *     Butterfly: [ Animal.Butterfly, "Papilionidae"],
 *     Bear: [ Animal.Bear, "Ursidae"]
 * });
 * // You end up with a strongly types result for each value
 * animalMap.Dog === "Canidae";     // true with typeof animalMap.Dog is (const) "Canidae"
 * animalMap[0] === "Canidae";      // true with typeof animalMap[0] is "Canidae"
 * animalMap["Dog"] === "Canidae";  // true with typeof animalMap["Dog"] is "Canidae"
 * animalMap.Cat === "Felidae";     // true with typeof animalMap.Cat is "Felidae"
 * animalMap[1] === "Felidae";      // true with typeof animalMap[1] is "Felidae"
 * animalMap["Cat"] === "Felidae";  // true with typeof animalMap["Cat"] is "Felidae"
 *
 * or using an interface to define the direct string mappings
 *
 * interface IAnimalFamilyMap {
 *     Dog: "Canidae",
 *     Cat: "Felidae",
 *     Butterfly: "Papilionidae",
 *     Bear: "Ursidae"
 * }
 *
 * // Create a strongly types map
 * const animalFamilyMap = createTypeMap<typeof Animal, IAnimalFamilyMap & {
 *     // Defined the enum lookups
 *     [Animal.Dog]: "Canidae",
 *     [Animal.Cat]: "Felidae",
 *     [Animal.Butterfly]: "Papilionidae",
 *     [Animal.Bear]: "Ursidae"
 * }>({
 *     Dog: [ Animal.Dog, "Canidae"],
 *     Cat: [ Animal.Cat, "Felidae"],
 *     Butterfly: [ Animal.Butterfly, "Papilionidae"],
 *     Bear: [ Animal.Bear, "Ursidae"]
 * });
 *
 * // You also end up with a strongly types result for each value
 * animalMap.Dog === "Canidae";     // true with typeof animalMap.Dog is (const) "Canidae"
 * animalMap[0] === "Canidae";      // true with typeof animalMap[0] is "Canidae"
 * animalMap["Dog"] === "Canidae";  // true with typeof animalMap["Dog"] is "Canidae"
 * animalMap.Cat === "Felidae";     // true with typeof animalMap.Cat is "Felidae"
 * animalMap[1] === "Felidae";      // true with typeof animalMap[1] is "Felidae"
 * animalMap["Cat"] === "Felidae";  // true with typeof animalMap["Cat"] is "Felidae"
 * ```
 * @param values - The values to populate on the new object
 * @typeParam E - Identifies the enum type
 * @typeParam T - Identifies the return type that is being created via the mapping.
 * @returns A new frozen (immutable) object which contains a property for each key and value that returns the defiend mapped value.
 */
export function createTypeMap<E, T>(values: { [key in keyof E]: [ E[keyof E], T[keyof T] ] }): T {
    return createSimpleMap<E, T>(values as any) as unknown as T;
}