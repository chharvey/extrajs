console.warn(`
  (${__filename})
  WARNING: \`Tree.class\` is OBSOLETE!
  Use at your own risk.
  This class will be removed on Version 1.0.
`)
const xjs = require('../index.js')
const Mapp = require('./Mapp.class.js')
module.exports = class Tree {
  constructor(id, $root, equalityComparator = ((a,b) => a===b)) {
    this._ID   = id
    this._ROOT = $root
    this._IS   = equalityComparator
    this._map = new Mapp(this._IS).set(this._ROOT, {
      path    : `${this._ID}/${this._ROOT.id}`,
      children: [],
    })
  }
  get id() {
    return this._ID.slice()
  }
  get root() {
    return this._ROOT
  }
  equals($tree) {
    throw new Error('feature not yet supported')
  }
  equalNodes($nodeA, $nodeB) {
    return this._IS($nodeA, $nodeB)
  }
  has($node) {
    return this._map.has($node)
  }
  pathOf($node) {
    if (!this.has($node)) throw new ReferenceError('The specified node is not in this tree.')
    return this._map.get($node).path
  }
  parentOf($node) {
    if (!this.has($node)) throw new ReferenceError('The specified node is not in this tree.')
    // remove the substring from the last slash onward
    return this._map.get($node).path.split('/').slice(0,-1).join('/')
  }
  childrenOf($node) {
    if (!this.has($node)) throw new ReferenceError('The specified node is not in this tree.')
    return this._map.get($node).children.slice()
  }
  find(fn) {
    this._map.find((key) => fn.call(null, key)) // this._map.find(fn)
  }
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
  remove($node) {
    if (!this.has($node)) throw new ReferenceError('The specified node is not in this tree.')
    if (this.equalNodes($node, this.root)) throw new Error('Cannot remove root node.')
    this.childrenOf($node).forEach(function (id, index) {
      this.remove(this.find((child) => child.id === id))
      this._map.get($node).children.splice(index, 1)
    }, this)
    this._map.delete($node)
    return this
  }
  removeAll() {
    this.childrenOf(this.root).forEach(function (id, index) {
      this.remove(this.find((child) => this.pathOf(child) === this.pathOf(this.root) + `/${id}`))
    }, this)
    let top_nodes = this._map.get(this.root).children
    top_nodes.splice(0, top_nodes.length)
    return this
  }
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
  static get Traversal() {
    return {
      BREADTH: 0,
      DEPTH  : 1,
    }
  }
  static get Node() { return Node }
}
class Node {
  constructor(id, data = false) {
    if (data===null || Number.isNaN(data) || data===undefined) throw new TypeError('Value must not be `null`, `NaN`, nor `undefined`.')
    this._ID = id
    this._value = data
  }
  get id() {
    return this._ID.slice()
  }
  set value(data) {
    if (data===null || Number.isNaN(data) || data===undefined) throw new TypeError('Value must not be `null`, `NaN`, nor `undefined`.')
    this._value = data
  }
  get value() {
    return this._value
  }
  valueDeep() {
    return xjs.Object.cloneDeep(this._value)
  }
}
