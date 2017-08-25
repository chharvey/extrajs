var Util = require('./Util.class.js')
var Mapp = require('./Mapp.class.js')

/**
 * A Tree is a data structure containing a set of nodes arranged in a hierarchy.
 *
 * The following properties of the tree hierarchy are observed.
 * I. The tree hierarchy embeds an "ancestor" relation, which is a strict partial order:
 *   1. (antireflexive) no node is "an ancestor of" itself
 *   2. (asymmetric) if A is "an ancestor of" B, then B is not "an ancestor of" A.
 *   3. (transitive) if A is "an ancestor of" B, and B is "an ancestor of" C, then A is "an ancestor of" C.
 * II. The tree contains a "root node" (a unique minimal element):
 *   There exists a node that is "an ancestor of" every other node.
 * III. Every non-root node has a "parent" (a unique least upper bound of all its ancestors):
 *   For each node A there exists a node B that: (1) is not equal to A, and (2) shares all the ancestors (excluding B) of A.
 *   There are no nodes "between" a node and its parent in this ordering.
 * IV. Each set of nodes that share the same "parent" embeds two relations:
 *   1. an equivalence relation, "sibling":
 *     a. (reflexive) every node is "a sibling of" itself
 *     b. (symmetric) if A is "a sibling of" B, then B is also "a sibling of" A.
 *     c. (transitive) if A is "a sibling of" B, and B is "a sibling of" C, then A is "a sibling of" C.
 *   2. a strict total order, "older than":
 *     a. (antireflexive) no node is "older than" itself
 *     b. (asymmetric) if A is "older than" B, then B is not "older than" A.
 *     c. (transitive) if A is "older than" B, and B is "older than" C, then A is "older than" C.
 *     d. (total) for any A and B, either A is "older than" B or B is "older than A"
 *
 * Meta: The outlined list above is an example of a tree, with the root node being the sentence,
 * “The following properties of the tree hierarchy ...”.
 * For example, the list item ‘I’ is a sibling of ‘IV’ and is a parent of ‘2’; the item ‘IV’ is an ancestor of the first item ‘a’.
 *
 * This constructor requires 3 arguments:
 * 1. the string id of this tree; used in calculations involving finding nodes
 * 2. the root data value; it may be of any type
 * 3. an equality function comparing two of this tree’s nodes, with the signature {function(Tree.Node,Tree.Node):boolean}
 *   For example:
 *   ```
 *   function equal(a, b) {
 *     if (a "equals" b by some criterion) return true
 *     // else
 *     return false
 *   }
 *   ```
 *
 * @module
 */
module.exports = class Tree {
  /**
   * Construct a new Tree object.
   * You must provide a string identifier.
   *
   * You must provide a string ID, which serves as an identifier for this tree.
   *
   * You may also provide an equality comparator, which is a function that determines how
   * "equality" of node values is computed.
   *
   * @param {string} id this tree’s URI identifier
   * @param {Tree.Node} $root the root of this tree
   * @param {function(Tree.Node,Tree.Node):boolean=} equalityComparator a function determining how equality of node values is computed
   */
  constructor(id, $root, equalityComparator = ((a,b) => a===b)) {
    /** @private @final */ this._ID   = id
    /** @private @final */ this._ROOT = $root
    /** @private @final */ this._IS   = equalityComparator

    /**
     * NOTE: Type Definition
     * Data describing a node’s relationship to other nodes as it is added to this tree.
     * It represents an "edge" in graph theory terms.
     * It has the following signature:
     * {{path:string, children:Array<string>}}
     * Example:
     * ```
     * {
     *   path    : 'bobs-tree/root-node',
     *   children: ['first-child, child2, hijo-tercero'],
     * }
     * ```
     * @typedef  {Object}        Edge     - an object of type `{path:string, children:Array<string>}`
     * @property {string}        path     - a unique string that describes a node’s “location” in this tree
     * @property {Array<string>} children - an array of child node IDs
     */

    /**
     * Corresponds each node in this tree to an {@link Edge} type.
     * @private
     * @type {Mapp}
     */
    this._map = new Mapp(this._IS).set(this._ROOT, {
      path    : `${this._ID}/${this._ROOT.id}`,
      children: [],
    })
  }

  /**
   * Return this tree’s id.
   * @return {string} this tree’s identifier
   */
  get id() {
    return this._ID.slice()
  }

  /**
   * Return the root of this tree.
   * @return {Tree.Node} this tree’s root node
   */
  get root() {
    return this._ROOT
  }

  /**
   * Return whether this tree "equals" the given tree.
   * @param  {Tree} $tree another tree to compare to
   * @return {boolean} `true` if this "equals" `$tree`
   */
  equals($tree) {
    throw new Error('feature not yet supported')
  }

  /**
   * Return whether two nodes in this tree are "equal",
   * as determined by this tree’s equality comparator.
   * @param  {Tree.Node}  $nodeA the first node
   * @param  {Tree.Node}  $nodeB the second node
   * @return {boolean} `true` if `$nodeA` equals `$nodeB`
   */
  equalNodes($nodeA, $nodeB) {
    return this._IS($nodeA, $nodeB)
  }



  /**
   * Return whether the specified node has been added to this tree.
   * @param  {Tree.Node}  $node the node to test
   * @return {boolean} `true` if `$node` is in this tree
   */
  has($node) {
    return this._map.has($node)
  }

  /**
   * Get the tree-path of the specified node in this tree.
   * @param  {Tree.Node} $node a node in this tree
   * @return {string} the path to $node through this tree
   */
  pathOf($node) {
    if (!this.has($node)) throw new ReferenceError('The specified node is not in this tree.')
    return this._map.get($node).path
  }

  /**
   * Get the tree-path of the parent of the specified node in this tree.
   * @param  {Tree.Node} $node a node in this tree
   * @return {string} the path of the parent of $node in this tree
   */
  parentOf($node) {
    if (!this.has($node)) throw new ReferenceError('The specified node is not in this tree.')
    // remove the substring from the last slash onward
    return this._map.get($node).path.split('/').slice(0,-1).join('/')
  }

  /**
   * Get the children of the specified node in this tree.
   * This method returns a shallow copy of the children array.
   * @param  {Tree.Node} $node a node in this tree
   * @return {Array<string>} IDs of the children of $node in this tree
   */
  childrenOf($node) {
    if (!this.has($node)) throw new ReferenceError('The specified node is not in this tree.')
    return this._map.get($node).children.slice()
  }

  /**
   * Find the first node that satisfies the condition provided, and return it.
   * Here, "first" is defined in order of {@link Tree#add()} calls in your program.
   * Once the node is “found”, you may pass it to {@link Tree#remove()}, etc.
   * Example:
   * ```js
   * my_tree.find((node) => node.id === 'about.html') // returns the first node whose ID is 'about.html'.
   * ```
   * @param  {function(Tree.Node):boolean} fn condition to test for each node in this tree
   * @return {?Tree.Node} the first node that passes the test, else `null`
   */
  find(fn) {
    this._map.find((key) => fn.call(null, key)) // this._map.find(fn)
  }

  /**
   * Add a new node to this tree, then return this tree.
   * Only new nodes can be added; you cannot add the same node twice.
   * You may, however, “move” it by {@link Tree#remove()|removing} it first, and then adding it again.
   *
   * When adding a node to this tree, a parent node must be specified.
   * Otherwise, there would be no place to put it!
   * If no parent is specified, this tree’s root node is used by default.
   *
   * You may optionally specify an index at which to insert the node among its siblings.
   * If no index is given, it is pushed to the end of its siblings.
   * @param {Tree.Node} $node the node to add
   * @param {Tree.Node=} $parentNode the unique parent of the newly-added node
   * @param {number=} index index at which to insert the node, pushing siblings forward by 1
   * @return {Tree} this
   */
  add($node, $parentNode = this._ROOT, index = this._map.get($parentNode).children.length) {
    if (!this.has($parentNode)) throw new ReferenceError('The specified parent node is not in this tree.')
    if (this.has($node)) throw new Error('The specified node is already in this tree. Cannot be added twice.')
    // if (this.find((node) => node.id===$node.id)) throw new Error('The specified node must have an ID unique to this tree.')
    if (this._map.get($parentNode).children.contains($node.id)) throw new Error('The specified node must have a unique ID among its siblings.')
    this._map.get($parentNode).children.splice(index, 0, $node.id)
    this._map.set($node, {
      path    : this.pathOf($parentNode) + `/${$node.id}`,
      children: [],
    })
    return this
  }

  /**
   * Remove a node from this tree, then return this tree.
   * The root node cannot be removed.
   * If the node being removed has any children, those children will also be removed from this tree.
   * This method is recursive.
   * @param  {Tree.Node} $node the node to remove
   * @return {Tree} this
   */
  remove($node) {
    if (!this.has($node)) throw new ReferenceError('The specified node is not in this tree.')
    if (this.equalNodes($node, this.root)) throw new Error('Cannot remove root node.')

    // for each child of $node, remove that child from this tree, and then remove the ID
    this.childrenOf($node).forEach(function (id, index) {
      this.remove(this.find((child) => child.id === id))
      this._map.get($node).children.splice(index, 1)
    }, this)

    // finally remove the $node
    this._map.delete($node)

    return this
  }

  /**
   * Remove all nodes from this tree except the root node.
   * @return {Tree} this
   */
  removeAll() {
    this.childrenOf(this.root).forEach(function (id, index) {
      this.remove(this.find((child) => this.pathOf(child) === this.pathOf(this.root) + `/${id}`))
    }, this)
    let top_nodes = this._map.get(this.root).children
    top_nodes.splice(0, top_nodes.length)
    return this
  }

  /**
   * Traverse this tree, running a callback function on each node.
   * Example:
   * ```js
   * my_tree.traverse(function (node) {
   *   console.log(node.value)
   * })
   * ```
   * @param  {function(Tree.Node)} callback a function to call on each node
   * @param  {Tree.Traversal=} method a value of Tree.Traversal
   */
  traverse(callback, method = Tree.Traversal.DEPTH) {
    var self = this
    if (method === Tree.Traversal.BREADTH) {
      throw new Error('Not yet supported.')
    } else {
      ;(function recurse(current_node) {
        callback.call(null, current_node)
        self.childrenOf(current_node).forEach(function (id, index) {
          recurse(this.find((child) => child.id === id))
        }, self)
      })(self.root)
    }
  }



  /**
   * A Tree is a data structure with directed, linked nodes.
   * The links are directed in that they only link parent nodes to child nodes (not vice versa).
   * The links are also unique in that there may be no more than one link from A to B.
   * A Tree must have exactly one root, which is a unique node that has no parent.
   * Trees must have at least one node, but no more than a finite number of nodes.
   * An enum for tree traversal methods.
   * @enum {number}
   */
  static get Traversal() {
    return {
      BREADTH: 0,
      DEPTH  : 1,
    }
  }

  /**
   * A node in a Tree.
   * A node is a unit of data in a tree and has a value.
   * It is linked to other nodes in the tree.
   * A node may have at most one parent, but may have unlimited children.
   * The children of a node are Trees, not other Nodes.
   * @type {class}
   */
  static get Node() { return Node }
}





/**
 * Class representing a node in a tree.
 */
class Node {
  /**
   * Construct a new Node object.
   *
   * You must provide a string ID, which serves as an identifier for the node in the tree it is in.
   * The ID must be tree-unique, meaning no two nodes in a tree may have the same identifier.
   * (You may construct two nodes with the same ID, but they cannot then be added to the same Tree.)
   *
   * The data, if provided, may be a primititve, object, array, or function, except
   * it may not be `null`, `undefined`, or `NaN`.
   * If it is an object, array, or function, it may be mutable.
   * Data may be assigned and re-assigned to this node after construction, but the ID is immutable.
   *
   * @param {string} id this node’s URI identifier
   * @param {*=} data this node’s data value
   */
  constructor(id, data = false) {
    if (data===null || Number.isNaN(data) || data===undefined) throw new TypeError('Value must not be `null`, `NaN`, nor `undefined`.')
    /** @private @final */ this._ID = id
    /** @private */ this._value = data
  }

  /**
   * Return this node’s URI identifier.
   * @return {string} this node’s ID
   */
  get id() {
    return this._ID.slice()
  }

  /**
   * Change this node’s data value.
   * Equivalent to assignment during construction.
   * May not be `null`, `undefined`, or `NaN`.
   * @param  {*} data the value to assign
   */
  set value(data) {
    if (data===null || Number.isNaN(data) || data===undefined) throw new TypeError('Value must not be `null`, `NaN`, nor `undefined`.')
    this._value = data
  }

  /**
   * Return this node’s value exactly.
   * WARNING: this method returns this node’s actual value.
   * If the value is mutable and is changed, this node will be affected.
   * @return {*} the value of this node
   */
  get value() {
    return this._value
  }

  /**
   * Return a deep clone of this node’s value.
   * If the value is an array or object, a deep copy is returned.
   * If the value is a primitive type or a function, the value itself is returned.
   * CAUTION: If the value returned is mutable and is changed, this node will remain unaffected.
   * **NOTE WARNING: infinite loop possible!**
   * @return {*} a clone of this node’s value
   */
  valueDeep() {
    return Util.Object.cloneDeep(this._value)
  }
}
