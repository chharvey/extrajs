/**
 * Additional static members for the native Promise class.
 *
 * Does not extend the native Promise class.
 */
export class xjs_Promise {
	/**
	 * Creates a Promise that is resolved when any of the provided Promises are resolved,
	 * or rejected with an array of reasons when all Promises are rejected.
	 *
	 * [tc39 Proposal](https://github.com/tc39/proposal-promise-any)
	 *
	 * @see https://stackoverflow.com/a/37235274/877703
	 * @param   values An array of Promises.
	 * @returns A new Promise.
	 * @deprecated Use native [Promise.any](https://tc39.es/ecma262/#sec-promise.any) instead.
	 */
	static async any<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [T0 | Promise<T0>, T1 | Promise<T1>, T2 | Promise<T2>, T3 | Promise <T3>, T4 | Promise<T4>, T5 | Promise<T5>, T6 | Promise<T6>, T7 | Promise<T7>, T8 | Promise<T8>, T9 | Promise<T9>]): Promise<T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>;
	static async any<T0, T1, T2, T3, T4, T5, T6, T7, T8    >(values: [T0 | Promise<T0>, T1 | Promise<T1>, T2 | Promise<T2>, T3 | Promise <T3>, T4 | Promise<T4>, T5 | Promise<T5>, T6 | Promise<T6>, T7 | Promise<T7>, T8 | Promise<T8>                  ]): Promise<T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8     >;
	static async any<T0, T1, T2, T3, T4, T5, T6, T7        >(values: [T0 | Promise<T0>, T1 | Promise<T1>, T2 | Promise<T2>, T3 | Promise <T3>, T4 | Promise<T4>, T5 | Promise<T5>, T6 | Promise<T6>, T7 | Promise<T7>                                    ]): Promise<T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7          >;
	static async any<T0, T1, T2, T3, T4, T5, T6            >(values: [T0 | Promise<T0>, T1 | Promise<T1>, T2 | Promise<T2>, T3 | Promise <T3>, T4 | Promise<T4>, T5 | Promise<T5>, T6 | Promise<T6>                                                      ]): Promise<T0 | T1 | T2 | T3 | T4 | T5 | T6               >;
	static async any<T0, T1, T2, T3, T4, T5                >(values: [T0 | Promise<T0>, T1 | Promise<T1>, T2 | Promise<T2>, T3 | Promise <T3>, T4 | Promise<T4>, T5 | Promise<T5>                                                                        ]): Promise<T0 | T1 | T2 | T3 | T4 | T5                    >;
	static async any<T0, T1, T2, T3, T4                    >(values: [T0 | Promise<T0>, T1 | Promise<T1>, T2 | Promise<T2>, T3 | Promise <T3>, T4 | Promise<T4>                                                                                          ]): Promise<T0 | T1 | T2 | T3 | T4                         >;
	static async any<T0, T1, T2, T3                        >(values: [T0 | Promise<T0>, T1 | Promise<T1>, T2 | Promise<T2>, T3 | Promise <T3>                                                                                                            ]): Promise<T0 | T1 | T2 | T3                              >;
	static async any<T0, T1, T2                            >(values: [T0 | Promise<T0>, T1 | Promise<T1>, T2 | Promise<T2>                                                                                                                               ]): Promise<T0 | T1 | T2                                   >;
	static async any<T0, T1                                >(values: [T0 | Promise<T0>, T1 | Promise<T1>                                                                                                                                                 ]): Promise<T0 | T1                                        >;
	static async any<T0                                    >(values: [T0 | Promise<T0>                                                                                                                                                                   ]): Promise<T0                                             >;
	static async any<T>(values: Array<T | Promise<T>>): Promise<T>;
	static async any(values: unknown[]): Promise<unknown> {
		return Promise.all(values.map((p) => (!(p instanceof Promise)) ? Promise.reject(p) : p.then(
			(val) => Promise.reject (val),
			(err) => Promise.resolve(err),
		))).then(
			(errors) => Promise.reject (errors),
			(value)  => Promise.resolve(value),
		);
	}


	private constructor() {}
}
