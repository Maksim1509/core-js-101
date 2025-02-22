/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
// function fromJSON(proto, json) {
//   const obj = JSON.parse(json);
//   const keys = Object.keys(obj);
//   const obj1 = Object.create(proto);
//   keys.forEach((element) => {
//     obj1[element] = obj[element];
//   });
//   return obj1;
// }

function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelectorBuilder {
  constructor(selector) {
    this.selectors = [selector];
    this.avalableSelectorsMap = {
      element: ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'],
      id: ['id', 'class', 'attr', 'pseudoClass', 'pseudoElement'],
      class: ['class', 'attr', 'pseudoClass', 'pseudoElement'],
      attr: ['attr', 'pseudoClass', 'pseudoElement'],
      pseudoClass: ['pseudoClass', 'pseudoElement'],
      pseudoElement: [],
    };

    this.avalableSelectors = this.avalableSelectorsMap[selector.type];
  }

  element(value) {
    const isOccur = this.selectors.find(({ type }) => type === 'element');
    if (isOccur) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (!this.avalableSelectors.includes('element')) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.selectors.push({ type: 'element', value });
    return this;
  }

  id(value) {
    const isOccur = this.selectors.find(({ type }) => type === 'id');
    if (isOccur) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (!this.avalableSelectors.includes('id')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.avalableSelectors = this.avalableSelectorsMap.id;
    this.selectors.push({ type: 'id', value: `#${value}` });
    return this;
  }

  class(value) {
    if (!this.avalableSelectors.includes('class')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.avalableSelectors = this.avalableSelectorsMap.class;
    this.selectors.push({ type: 'class', value: `.${value}` });
    return this;
  }

  attr(value) {
    if (!this.avalableSelectors.includes('attr')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.avalableSelectors = this.avalableSelectorsMap.attr;
    this.selectors.push({ type: 'attr', value: `[${value}]` });
    return this;
  }

  pseudoClass(value) {
    if (!this.avalableSelectors.includes('pseudoClass')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.avalableSelectors = this.avalableSelectorsMap.pseudoClass;
    this.selectors.push(this.selectors.push({ type: 'pseudoClass', value: `:${value}` }));
    return this;
  }

  pseudoElement(value) {
    const isOccur = this.selectors.find(({ type }) => type === 'pseudoElement');
    if (isOccur) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (!this.avalableSelectors.includes('pseudoElement')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.avalableSelectors = [];
    this.selectors.push({ type: 'pseudoElement', value: `::${value}` });
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.selectors.push(selector1 + combinator + selector2);
    return this;
  }

  stringify() {
    return this.selectors.map(({ value }) => value).join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelectorBuilder({ type: 'element', value });
  },

  id(value) {
    return new CssSelectorBuilder({ type: 'id', value: `#${value}` });
  },

  class(value) {
    return new CssSelectorBuilder({ type: 'class', value: `.${value}` });
  },

  attr(value) {
    return new CssSelectorBuilder({ type: 'attr', value: `[${value}]` });
  },

  pseudoClass(value) {
    return new CssSelectorBuilder({ type: 'pseudoClass', value: `:${value}` });
  },

  pseudoElement(value) {
    return new CssSelectorBuilder({ type: 'pseudoElement', value: `::${value}` });
  },

  combine(selector1, combinator, selector2) {
    return new CssSelectorBuilder({ value: `${selector1.stringify()} ${combinator} ${selector2.stringify()}` });
  },
  // stringify() {
  //   return `${this}`;
  // },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
