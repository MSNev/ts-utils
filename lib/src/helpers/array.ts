/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { ArrProto, MAP } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";
import { isArray, isUndefined } from "./base";

/**
 * The `reducer` function called for {@link arrReduce}.
 * @group Array
 * @typeParam T - Identifies the type of array elements
 * @typeParam R - Identifies the type of the return array elements (defaults to T)
 * @param previousValue - The value resulting from the previous call to callbackFn. On first call, initialValue if
 * specified, otherwise the value of array[0].
 * @param currentValue - The value of the current element. On first call, the value of array[0] if an initialValue
 * was specified, otherwise the value of array[1].
 * @param currentIndex - The index position of currentValue in the array. On first call, 0 if initialValue was
 * specified, otherwise 1.
 * @param array -The array being traversed.
 */
export type ArrReduceCallbackFn<T, R = T> = (previousValue: T, currentValue: R, currentIndex: number, array: T[]) => R;

/**
 * Callback signature for {@link arrMap} that is called for every element of array. Each time callbackFn
 * executes, the returned value is added to newArray.
 * @group Array
 * @typeParam T - Identifies the type of the array elements
 * @typeParam R - Identifies the type of the elements returned by the callback function, defaults to T.
 * @param value - The current element being processed in the array.
 * @param index - The index of the current element being processed in the array.
 * @param array - The array that the `map` function was called on.
 */
export type ArrMapCallbackFn<T, R = T> = (value: T, index?: number, array?: T[]) => R;

/**
 * Calls the provided `callbackFn` function once for each element in an array in ascending index order. It is not invoked for index properties
 * that have been deleted or are uninitialized. And unlike the ES6 forEach() you CAN stop or break the iteration by returning -1 from the
 * `callbackFn` function.
 *
 * The range (number of elements) processed by arrForEach() is set before the first call to the `callbackFn`. Any elements added beyond the range
 * or elements which as assigned to indexes already processed will not be visited by the `callbackFn`.
 * @group Array
 * @typeParam T - Identifies the element type of the array
 * @param callbackfn A `synchronous` function that accepts up to three arguments. arrForEach calls the callbackfn function one time for each element in the array.
 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, null or undefined
 * the array will be used as the this value.
 * @remarks
 * arrForEach expects a `synchronous` function.
 * arrForEach does not wait for promises. Make sure you are aware of the implications while using promises (or async functions) as forEach callback.
 * @example
 * ```ts
 * const items = ['item1', 'item2', 'item3'];
 * const copyItems = [];
 *
 * // before using for loop
 * for (let i = 0; i < items.length; i++) {
 *   copyItems.push(items[i]);
 * }
 *
 * // before using forEach()
 * items.forEach((item) => {
 *   copyItems.push(item);
 * });
 *
 * // after
 * arrForEach(items, (item) => {
 *   copyItems.push(item);
 *   // May return -1 to abort the iteration
 * });
 * ```
 */
export function arrForEach<T>(arr: T[], callbackfn: (value: T, index?: number, array?: T[]) => void | number, thisArg?: any): void {
    if (arr) {
        const len = arr.length;
        for (let idx = 0; idx < len; idx++) {
            if (idx in arr) {
                if (callbackfn.call(thisArg || arr, arr[idx], idx, arr) === -1) {
                    break;
                }
            }
        }
    }
}

/**
 * Appends the `elms` to the `target` where the elms may be an array or single object
 * @group Array
 * @example
 * ```ts
 * let theArray = arrAppend([], 1);
 * arrAppend(theArray, [ 2, 3, 4 ]);
 * arrAppend(theArray, [ "a", "b", "c" ]);
 * // theArray is now [ 1, 2, 3, 4, "a", "b", "c" ]
 * ```
 * @param target - The target array
 * @param elms - The item or items to add to the target
 */
export function arrAppend<T>(target: T[], elms: any[] | any): T[] {
    if (!isUndefined(elms) && target) {
        if (isArray(elms)) {
            ArrProto.push.apply(target, elms);
        } else {
            target.push(elms);
        }
    }

    return target;
}

/**
 * The arrIndexOf() method returns the first index at which a given element can be found in the array,
 * or -1 if it is not present.
 * `arrIndexOf()` compares searchElement to elements of the Array using strict equality (the same
 * method used by the === or triple-equals operator).
 * @group Array
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array of elements to be searched
 * @param searchElement - The element to locate in the array.
 * @param fromIndex - The index to start the search at. If the index is greater than or equal to
 * the array's length, -1 is returned, which means the array will not be searched. If the provided
 * index value is a negative number, it is taken as the offset from the end of the array.
 * Note: if the provided index is negative, the array is still searched from front to back. If the
 * provided index is 0, then the whole array will be searched. Default: 0 (entire array is searched).
 * @return The first index of the element in the array; -1 if not found.
 * @example
 * ```ts
 * const array = [2, 9, 9];
 * arrIndexOf(array, 2);     // 0
 * arrIndexOf(array, 7);     // -1
 * arrIndexOf(array, 9, 2);  // 2
 * arrIndexOf(array, 2, -1); // -1
 * arrIndexOf(array, 2, -3); // 0
 *
 * let indices: number[] = [];
 * const array = ['a', 'b', 'a', 'c', 'a', 'd'];
 * const element = 'a';
 * let idx = arrIndexOf(array, element);
 * while (idx !== -1) {
 *   indices.push(idx);
 *   idx = arrIndexOf(array, element, idx + 1);
 * }
 * console.log(indices);
 * // [0, 2, 4]
 *
 * function updateVegetablesCollection (veggies, veggie) {
 *     if (arrIndexOf(veggies, veggie) === -1) {
 *         veggies.push(veggie);
 *         console.log('New veggies collection is : ' + veggies);
 *     } else {
 *         console.log(veggie + ' already exists in the veggies collection.');
 *     }
 * }
 *
 * let veggies = ['potato', 'tomato', 'chillies', 'green-pepper'];
 *
 * updateVegetablesCollection(veggies, 'spinach');
 * // New veggies collection is : potato,tomato,chillies,green-pepper,spinach
 * updateVegetablesCollection(veggies, 'spinach');
 * // spinach already exists in the veggies collection.
 * ```
 */
export const arrIndexOf: <T>(theArray: T[], searchElement: T, fromIndex?: number) => number = _unwrapFunction("indexOf");

/**
 * The arrReduce() method executes a user-supplied "reducer" callback function on each element of the array,
 * in order, passing in the return value from the calculation on the preceding element. The final result of
 * running the reducer across all elements of the array is a single value.
 *
 * The first time that the callback is run there is no "return value of the previous calculation". If supplied,
 * an initial value may be used in its place. Otherwise the array element at index 0 is used as the initial
 * value and iteration starts from the next element (index 1 instead of index 0).
 * @group Array
 * @typeParam T - Identifies the type of array elements
 * @param theArray - The array of elements to be searched
 * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
 */
export const arrReduce: <T, R = T>(theArray: T[], callbackfn: ArrReduceCallbackFn<T, R>, initialValue?: T | R) => R = _unwrapFunction("reduce");


/**
 * The arrMap() method creates a new array populated with the results of calling a provided function on every
 * element in the calling array.
 *
 * `arrMap` calls a provided callbackFn function once for each element in an array, in order, and constructs
 * a new array from the results. callbackFn is invoked only for indexes of the array which have assigned
 * values (including undefined).
 *
 * It is not called for missing elements of the array; that is:
 * - indexes that have never been set;
 * - indexes which have been deleted.
 * @group Array
 * @typeParam T - Identifies the type of the array elements
 * @typeParam R - Identifies the type of the elements returned by the callback function, defaults to T.
 * @param theArray
 * @param callbackFn - The function that is called for evetn element of `theArray`.
 * @param thisArg - The value to use as the `this` when executing the `callbackFn`.
 * @example
 * ```ts
 * const numbers = [1, 4, 9];
 * const roots = arrMap(numbers, (num) => Math.sqrt(num));
 *
 * // roots is now     [1, 2, 3]
 * // numbers is still [1, 4, 9]
 *
 * const kvArray = [{ key: 1, value: 10 },
 *                  { key: 2, value: 20 },
 *                  { key: 3, value: 30 }];
 *
 * const reformattedArray = arrMap(kvArray, ({ key, value}) => ({ [key]: value }));
 *
 * // reformattedArray is now [{1: 10}, {2: 20}, {3: 30}],
 *
 * // kvArray is still:
 * // [{key: 1, value: 10},
 * //  {key: 2, value: 20},
 * //  {key: 3, value: 30}]
 * ```
 */
export const arrMap: <T, R = T>(theArray: T[], callbackFn: ArrMapCallbackFn<T, R>, thisArg?: any) => R[] = _unwrapFunction(MAP);