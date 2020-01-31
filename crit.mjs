import ArrowBolt from './arrow-bolt.mjs'
import Blunt from './blunt.mjs'
import Bullet from './bullet.mjs'
import Cutting from './cutting.mjs'

export const typeMap = {
    'arrow-bolt': ArrowBolt,
    'blunt': Blunt,
    'bullet': Bullet,
    'cutting': Cutting,
}

/**
 * @returns {string[]}
 */
export function types() {
    return Object.entries(typeMap).map(t => t[0])
}

/**
 * @returns {string[]}
 */
export function bodyParts() {
    return [
        'arm',
        'body',
        'head',
        'leg',
    ]
}

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
    const val = 12 ** (1 - (currentHP / maxHP)) + 7 ** (clamp(d100, 100, 0) / 100) - 2
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
export function crit(attackType, bodyPart, sev) {
    if (typeMap[attackType] === undefined) {
        throw new Error(`invalid attack type ${attackType}`)
    }
    if (typeMap[attackType][bodyPart] === undefined) {
        throw new Error(`invalid body part ${bodyPart}`)
    }

    return typeMap[attackType][bodyPart][sev]
}
