import { qs, deepcopy, COMPUTE, TRAIN, toggleCompute } from "./utils.js"
import { AI } from "./script.js"



export default class Nim {
    constructor(initial = [1, 3, 5, 7]) {
        this.initial = initial
        this.piles = deepcopy(this.initial)
        this.state = deepcopy(this.initial)
        this.winner = null
        this.player = 0
        this.playerMove = { row: null, count: 0 }
    }


    changeRows(row_num) {
        if (COMPUTE) {
            qs('#training').innerText = 'Training AI... Check the console for more information.'
        }
        let container = qs('.container')
        let allRows = qs('.row', true)
        allRows.forEach(row => {
            container.removeChild(row)
        })
        for (let rowIndex = 0; rowIndex < this.piles.length; rowIndex++) {
            let rowElt = document.createElement('div')
            rowElt.setAttribute('id', 'row-' + rowIndex)
            rowElt.classList.add('row')
            if (row_num == 6) rowElt.classList.add('expand')
            for (let i = 0; i < this.piles[rowIndex]; i++) {
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
        qs('.remove', true).forEach(btn => {
            btn.onclick = e => {
                if (this.player != 0) return
                if (this.piles[parseInt(e.target.dataset.row)] == 0) return
                if (this.playerMove.row != null && this.playerMove.row != e.target.dataset.row) return
                if (this.playerMove.row == null) {
                    this.playerMove.row = parseInt(e.target.dataset.row)
                }
                if (this.state[this.playerMove.row] == this.playerMove.count) return
                this.playerMove.count++
                this.piles[parseInt(this.playerMove.row)]--
                this.updateUI()
                if (this.checkGameOver(this.piles)) {
                    this.winner = this.player == 0 ? 'AI' : 'Human'
                    this.gameOverScreen()
                    return
                }
                // console.log(this.playerMove)
            }
        })
        if (COMPUTE) {
            setTimeout(() => {

                AI.train(TRAIN, this.piles)
            }, 100)
        }
    }


    updateUI() {

        let container = qs('.container')
        let allRows = qs('.row', true)
        allRows.forEach(row => {
            container.removeChild(row)
        })
        for (let rowIndex = 0; rowIndex < this.piles.length; rowIndex++) {
            let rowElt = document.createElement('div')
            rowElt.setAttribute('id', 'row-' + rowIndex)
            rowElt.classList.add('row')
            if (this.piles.length == 6) rowElt.classList.add('expand')
            for (let i = 0; i < this.piles[rowIndex]; i++) {
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
        qs('.remove', true).forEach(btn => {
            btn.onclick = e => {
                if (this.player != 0) return
                if (this.piles[parseInt(e.target.dataset.row)] == 0) return
                if (this.playerMove.row != null && this.playerMove.row != e.target.dataset.row) return
                if (this.playerMove.row == null) {
                    this.playerMove.row = parseInt(e.target.dataset.row)
                }
                if (this.state[this.playerMove.row] == this.playerMove.count) return
                this.playerMove.count++
                this.piles[parseInt(this.playerMove.row)]--
                this.updateUI()
                if (this.checkGameOver(this.piles)) {
                    this.winner = this.player == 0 ? 'AI' : 'Human'
                    this.gameOverScreen()
                    return
                }
                // console.log(this.playerMove)
            }
        })

    }

    checkGameOver(state) {
        for (let i of state) {
            if (i != 0) return false
        }
        return true
    }

    gameOverScreen() {
        qs('#game-over-screen').classList.remove('hidden')
        qs('#game-over-screen>h1').innerText = this.player == 1 ? 'You Won!' : 'You Lost :('
    }

    convertToKey(state, action) {
        return state.join('_') + '-' + action.join('_')
    }

    convertBack(str) {
        let state = str.split('-')[0]
        let action = str.split('-')[1]
        state = state.split('_')
        action = action.split('_')
        for (let i = 0; i < state.length; i++) {
            state[i] = parseInt(state[i])
        }
        for (let i = 0; i < action.length; i++) {
            action[i] = parseInt(action[i])
        }
        return [state, action]
    }

    initialiseUI() {
        const container = qs('.container')
        if (!COMPUTE) {
            qs('#training').innerText = ''
        }
        for (let rowIndex = 0; rowIndex < this.piles.length; rowIndex++) {
            let rowElt = document.createElement('div')
            rowElt.setAttribute('id', 'row-' + rowIndex)
            rowElt.classList.add('row')
            for (let i = 0; i < this.piles[rowIndex]; i++) {
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
        const rowSelect = document.createElement('select')
        const toggleComputeBtn = document.createElement('button')
        rowSelect.setAttribute('id', 'select')
        for (let i = 3; i <= 5; i++) {
            let option = document.createElement('option')
            if (i == 4) option.setAttribute('selected', 'true')
            option.innerText = `${i} Rows`
            rowSelect.appendChild(option)
        }
        resetBtn.classList.add('btn')
        resetBtn.setAttribute('id', 'reset-btn')
        toggleComputeBtn.classList.add('btn')
        toggleComputeBtn.setAttribute('id', 'compute-btn')
        aiBtn.classList.add('btn')
        aiBtn.setAttribute('id', 'ai-btn')
        aiBtn.innerText = 'AI Move'
        resetBtn.innerText = 'Reset'
        toggleComputeBtn.innerText = 'Toggle computation'
        btnContainer.appendChild(aiBtn)
        btnContainer.appendChild(resetBtn)
        btnContainer.appendChild(rowSelect)
        btnContainer.appendChild(toggleComputeBtn)
        container.appendChild(btnContainer)

        qs('#compute-btn').onclick = (e) => {
            let row_num = parseInt(qs('#select').value[0])
            toggleCompute()
            e.target.classList.toggle('compute')
            if (COMPUTE) {
                qs('#training').innerText = 'Training AI... Check the console for more information.'
                setTimeout(() => {
                    AI.train(TRAIN, this.piles)
                }, 100)
            }
        }

        qs('#reset-btn').onclick = () => {
            this.playerMove.count = 0
            this.playerMove.row = null
            this.piles = deepcopy(this.initial)
            this.updateUI()
        }

        qs('#select').onchange = (e) => {
            let row_num = parseInt(e.target.value[0])
            this.piles = []

            for (let i = 1; i <= row_num; i++) {
                this.piles.push(2 * i - 1)
            }
            this.initial = deepcopy(this.piles)
            this.changeRows(row_num)
        }

        // handle removal of sticks by player
        qs('.remove', true).forEach(btn => {
            btn.onclick = e => {
                if (this.player != 0) return
                if (this.piles[parseInt(e.target.dataset.row)] == 0) return
                if (this.playerMove.row != null && this.playerMove.row != e.target.dataset.row) return
                if (this.playerMove.row == null) {
                    this.playerMove.row = parseInt(e.target.dataset.row)
                }
                if (this.state[this.playerMove.row] == this.playerMove.count) return
                this.playerMove.count++
                this.piles[parseInt(this.playerMove.row)]--
                this.updateUI()
                if (this.checkGameOver(this.piles)) {
                    this.winner = this.player == 0 ? 'AI' : 'Human'
                    this.gameOverScreen()
                    return
                }
                // console.log(this.playerMove)
            }
        })

        qs('#restart-btn').onclick = () => {
            this.piles = deepcopy(this.initial)
            this.playerMove.count = 0
            this.player = 0
            this.playerMove.row = null
            qs('#game-over-screen').classList.add('hidden')
            this.updateUI()
        }









    }
}

