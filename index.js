module.exports = {
	Array   : require('./dist/class/Array.class.js'  ).default,
	Date    : require('./dist/class/Date.class.js'   ).default,
	Map     : require('./dist/class/Map.class.js'    ).default,
	Math    : require('./dist/class/Math.class.js'   ).default,
	Number  : require('./dist/class/Number.class.js' ).default,
	Object  : require('./dist/class/Object.class.js' ).default,
	Promise : require('./dist/class/Promise.class.js').default,
	Set     : require('./dist/class/Set.class.js'    ).default,
	String  : require('./dist/class/String.class.js' ).default,

	IndexOutOfBoundsError: require('./dist/class/IndexOutOfBoundsError.class.js').default,
	NaNError: require('./dist/class/NaNError.class.js').default,
}
