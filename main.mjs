import { severity, crit, types, bodyParts, typeMap } from './crit.mjs'

/**
 * 
 * @param {string[]} options
 */
function createSelect(options) {
    return el('select', {}, options.map(opt => el('option', {}, opt)))
}

/**
 * @param {number} value
 */
function createNumber(value) {
    return el('input', { type: 'number', value: value })
}

function br() {
    return el('br')
}

function el(tagName, args = {}, children = []) {
    const element = document.createElement(tagName)
    for (const [key, val] of Object.entries(args)) {
        element[key] = val
    }
    element.append(...children)
    return element
}

const typeSelect = createSelect(types())
const bodyPartSelect = createSelect(bodyParts())
const d100Input = createNumber(((Math.random() * 100) + 1).toFixed())
const maxHP = createNumber(100)
const currentHP = createNumber(50)

const result = el('div')


function change() {
    const sev = severity(maxHP.value,
        currentHP.value,
        d100Input.value
    )

    result.innerText = ''

    result.append(el('ol', {}, typeMap[typeSelect.value][bodyPartSelect.value].map(
        (effect, i) => el('li', { className: sev === i ? 'active' : '' }, [effect]))
    ))
}

document.body.append(
    'type', typeSelect, br(),
    'body part', bodyPartSelect, br(),
    'max hp', maxHP, br(),
    'current hp', currentHP, br(),
    'd100', d100Input,
    result,
)

change()

typeSelect.addEventListener('input', change)
bodyPartSelect.addEventListener('input', change)
d100Input.addEventListener('input', change)
maxHP.addEventListener('input', change)
currentHP.addEventListener('input', change)

function makeTable(maxHP) {

    const table = document.createElement('table')

    table.className = 'big'

    const step = 0.02

    const tr = document.createElement('tr')

    const td = document.createElement('td')
    tr.append(td)
    for (let hpPercentage = 0; hpPercentage < 1; hpPercentage += step) {
        const td = document.createElement('td')
        td.innerText = ((1 - hpPercentage) * 100).toFixed()
        tr.append(td)
    }
    table.append(tr)

    for (let d100 = 0; d100 < 1; d100 += step) {
        const tr = document.createElement('tr')

        const td = document.createElement('td')
        td.innerText = `d100 ${((d100 * 100) + 1).toFixed()}`
        tr.append(td)

        for (let hpPercentage = 0; hpPercentage < 1; hpPercentage += step) {
            const td = document.createElement('td')
            const sev = severity(maxHP, maxHP * (1 - hpPercentage), d100 * 100)
            td.innerText = sev
            const r = sev / 14 * 2
            const g = (1 - (sev / 14))
            const b = 0
            td.style.backgroundColor = `rgba(${r * 255}, ${g * 255}, ${b * 255}, 1)`
            tr.append(td)
        }
        table.append(tr)
    }

    return table
}

const tblCtr = el('div')
const slider = el('input', { type: 'range', max: 500, min: 20 })
slider.addEventListener('input', () => {
    tblCtr.innerText = slider.value
    tblCtr.append(makeTable(slider.value))
})
document.body.append(slider, tblCtr)

tblCtr.append(makeTable(slider.value))