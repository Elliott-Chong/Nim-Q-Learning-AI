import Nim from './Nim.js'
import { deepcopy, qs, replacer, COMPUTE, TRAIN } from './utils.js'
import q from './q.js'


export default class NimAI {
    constructor() {
        qs('#restart-btn').onclick = () => {
            this.piles = deepcopy(this.initial)
            this.playerMove.count = 0
            this.player = 0
            this.playerMove.row = null
            qs('#game-over-screen').classList.add('hidden')
            this.updateUI()
        }
        this.values = new Map()
        this.game = new Nim()
        this.state = deepcopy(this.game.initial)
        this.game.initialiseUI()
        qs('#ai-btn').onclick = () => {
            // let oldState = deepcopy(this.state)
            // let action = deepcopy([this.playerMove.row, this.playerMove.count])
            // console.log(oldState, action)
            if (this.game.playerMove.count == 0) return
            this.game.player = 1
            let [row, count] = this.makeMove()
            this.game.piles[row] -= count
            this.game.updateUI()
            if (this.game.checkGameOver(this.game.piles)) {
                this.game.winner = this.p == 0 ? 'AI' : 'Human'
                this.game.gameOverScreen()
                return
            }
            this.game.player = 0
            this.game.playerMove = { row: null, count: 0 }
        }
        if (COMPUTE) {
            this.train(TRAIN, [1, 3, 5, 7])
        }
    }

    getPossibleMoves(state) {
        let moves = []
        for (let row = 0; row < state.length; row++) {
            for (let i = 1; i <= state[row]; i++) {
                moves.push([row, i])
            }
        }
        return moves
    }

    async train(n, initial) {

        this.values = new Map()
        const update_q = (old_state, new_state, action, reward) => {
            const learning_rate = 0.5
            let old_q = this.get_q(old_state, action)
            let best_future_reward = -Infinity
            for (let move of this.getPossibleMoves(new_state)) {
                if (this.get_q(new_state, move) > best_future_reward) {
                    best_future_reward = this.get_q(new_state, move)
                }
            }
            if (this.getPossibleMoves(new_state).length == 0) {
                best_future_reward = 0
            }
            let new_q = old_q + learning_rate * (reward + best_future_reward - old_q)
            this.set_q(old_state, action, new_q)
        }

        for (let i = 0; i < n; i++) {
            console.log(`Training AI on its ${i + 1} game`)
            let last = {
                0: { state: null, action: null },
                1: { state: null, action: null }
            }
            let game = new Nim(initial)
            while (true) {
                let state = deepcopy(game.piles)
                let best_move = this.chooseMove(state)
                last[game.player].state = deepcopy(state)
                last[game.player].move = deepcopy(best_move)
                let [row, count] = best_move
                game.piles[row] -= count
                let new_state = deepcopy(game.piles)
                game.player = game.player == 1 ? 0 : 1
                if (game.checkGameOver(game.piles)) {
                    update_q(state, new_state, best_move, -1)
                    update_q(last[game.player].state, new_state, last[game.player].move, 1)
                    break
                }
                else if (last[game.player].state && last[game.player].move) {
                    update_q(last[game.player].state, new_state, last[game.player].move, 0)
                }

            }
        }
        console.log(this.values)

        // const str = JSON.stringify(this.values, replacer)
        // navigator.clipboard.writeText(str)
        qs('#training').innerText = ''
    }

    get_q(state, action) {
        let key = this.game.convertToKey(state, action)
        if (!this.values.has(key)) return 0
        return this.values.get(key)
    }

    set_q(state, action, value) {
        let key = this.game.convertToKey(state, action)
        this.values.set(key, value)
    }

    chooseMove(state) {
        const epsilon = 0.1
        let possibleMoves = this.getPossibleMoves(state)
        let best_score = -Infinity
        let best_move = null
        if (COMPUTE) {

            for (let move of possibleMoves) {
                if (parseFloat(this.get_q(state, move)) > best_score) {
                    best_score = this.get_q(state, move)
                    best_move = move
                }
            }
            if (Math.random() <= epsilon) {
                best_move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
            }
        }
        else {
            for (let move of possibleMoves) {
                if (q.get(this.game.convertToKey(state, move)) > best_score) {
                    best_score = q.get(this.game.convertToKey(state, move))
                    best_move = move
                }
            }
        }
        return best_move
    }

    makeMove() {
        let [row, count] = this.chooseMove(this.game.piles)
        return [row, count]
    }
}