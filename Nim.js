import { sleep } from "./utils.js"

const qs = (elt, all = false) => {
    if (all) {
        return document.querySelectorAll(elt)
    }
    return document.querySelector(elt)
}


export default class Nim {
    constructor(initial = [1, 3, 5, 7]) {
        self.initial = initial ? initial : [1, 3, 5, 7]
        self.piles = self.initial
    }
    updateUI() {
        const container = qs('.container')
        qs('.row', true).forEach(row => {
            let bruh = row.children.length - 1
            for (let i = 0; i < bruh; i++) {
                row.removeChild(row.firstElementChild)
            }
        })
        for (let rowIndex = 0; rowIndex < self.piles.length; rowIndex++) {
            let rowElt = qs(`#row-${rowIndex}`)
            for (let i = 0; i < self.piles[rowIndex]; i++) {
                let stickElt = document.createElement('span')
                stickElt.classList.add('stick')
                stickElt.setAttribute('id', rowIndex.toString() + '-' + i.toString())
                rowElt.prepend(stickElt)
            }

        }
    }
    initialiseUI() {
        const container = qs('.container')
        for (let rowIndex = 0; rowIndex < self.piles.length; rowIndex++) {
            let rowElt = document.createElement('div')
            rowElt.setAttribute('id', 'row-' + rowIndex)
            rowElt.classList.add('row')
            for (let i = 0; i < self.piles[rowIndex]; i++) {
                let stickElt = document.createElement('span')
                stickElt.classList.add('stick')
                stickElt.setAttribute('id', rowIndex.toString() + '-' + i.toString())
                rowElt.appendChild(stickElt)
            }
            let btn = document.createElement('button')
            btn.classList.add('btn')
            btn.classList.add('remove')
            btn.setAttribute("data-row", rowIndex)
            btn.innerText = "Remove"
            rowElt.appendChild(btn)
            container.appendChild(rowElt)
        }
        const btnContainer = document.createElement('div')
        btnContainer.setAttribute('id', 'btn-container')
        const aiBtn = document.createElement('button')
        const resetBtn = document.createElement('button')
        resetBtn.classList.add('btn')
        resetBtn.setAttribute('id', 'reset-btn')
        aiBtn.classList.add('btn')
        aiBtn.setAttribute('id', 'ai-btn')
        aiBtn.innerText = 'AI Move'
        resetBtn.innerText = 'Reset'
        btnContainer.appendChild(aiBtn)
        btnContainer.appendChild(resetBtn)
        container.appendChild(btnContainer)
        resetBtn.onclick = () => {
            self.piles = self.initial
            this.updateUI()
        }

        // handle removal of sticks by player
        qs('.remove', true).forEach(btn => {
            btn.onclick = e => {
                let toBeRemoved = qs(`#row-${e.target.dataset.row}`).firstElementChild
                if (toBeRemoved.innerText == 'Remove') return
                qs(`#row-${e.target.dataset.row}`).removeChild(toBeRemoved)
            }
        })





    }
}

