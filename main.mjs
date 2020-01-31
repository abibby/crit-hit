import ArrowBolt from './arrow-bolt.mjs'
import Blunt from './blunt.mjs'
import Bullet from './bullet.mjs'

/**
 * 
 * @param {number} value
 * @param {number} max
 * @param {number} min
 * 
 * @returns {number}
 */
function clamp(value, max, min) {
    return Math.max(Math.min(Math.round(value), max), min)
}

/**
 * 
 * @param {number} maxHP
 * @param {number} currentHP 
 * @param {number} d100 
 * 
 * @returns {number}
 */
export function severity(maxHP, currentHP, d100) {
    const val = 7 ** (currentHP / maxHP) + 10 ** (d100 / 100) - 2
    return clamp(Math.round(val), 14, 0)
}

/**
 * @param {string} attackType
 * @param {string} bodyPart
 * @param {number} maxHP
 * @param {number} currentHP 
 * @param {number} d100 
 * 
 * @returns {string}
 */
export function crit(attackType, bodyPart, maxHP, currentHP, d100) {
    const typeMap = {
        'arrow-bolt': ArrowBolt,
        'blunt': Blunt,
        'bullet': Bullet,
    }

    if (typeMap[attackType] === undefined) {
        throw new Error(`invalid attack type ${attackType}`)
    }
    if (typeMap[attackType][bodyPart] === undefined) {
        throw new Error(`invalid body part ${bodyPart}`)
    }

    return typeMap[attackType][bodyPart][severity(maxHP, currentHP, d100)]
}

// console.log(crit('arrow-bolt', 'body', 30, 30, 95))
console.log(crit('bullet', 'body', 30, 30, 49))