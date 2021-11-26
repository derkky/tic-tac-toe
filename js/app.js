const playerFactory = (symbol, name) => {
	const playerSymbol = symbol
	const playerName = name
	var playerScore = 0

	const getPlayerSymbol = () => playerSymbol
	const getPlayerName = () => playerName

	const increasePlayerScore = () => playerScore += 1
	const getPlayerScore = () => playerScore

	return {getPlayerSymbol, getPlayerName, increasePlayerScore, getPlayerScore}
}


const playerList = (() => {
	var list = []

	const addPlayertoList = (player) => list.push(player)

	return {list, addPlayertoList}
})()

const startForm = document.getElementById("startContent")

startForm.onsubmit = (ev) => {
	ev.preventDefault()
	var p1Name = document.getElementById("p1Name").value
	var p2Name = document.getElementById("p2Name").value
	var p1Symbol = (document.getElementById("p1SymbolX").checked) ? "x" : "o"
	var p2Symbol = (p1Symbol == "x") ? "o" : "x"

	const player1 = playerFactory(p1Symbol, p1Name)
	const player2 = playerFactory(p2Symbol, p2Name)

	playerList.addPlayertoList(player1)
	playerList.addPlayertoList(player2)

	const startModal = document.getElementById("startModal")
	startModal.style.display = "none"

	game()

}

const gameBoard = (() => {
	var board = [" "," "," "," "," "," "," "," "," "]

	const htmlCells = document.getElementsByClassName("cell")

	const render = () => {
		for (const cell of htmlCells){
			var index = cell.dataset.index
			cell.innerHTML = board[index] 
		}
	}

	const checkCellTaken = (index) => {
		if (board[index] != " "){
			return true
		} else {
			return false
		}
	}

	const placeMark = (player, cell) => {
		symbol = player.getPlayerSymbol()
		board[cell] = symbol
	}

	const checkWin = () => {

		var win = false
		var winner 

		winCombos = [[0,1,2], [3,4,5],[6,7,8],
					 [0,3,6], [1,4,7], [2,5,8],
					 [0,4,8], [2,4,6]]

		for (const player of playerList.list){
			symbol = player.getPlayerSymbol()

			for (const winCombo of winCombos){
				if (board[winCombo[0]] == symbol && board[winCombo[1]] == symbol && board[winCombo[2]] == symbol){
					win = true
					winner = player
				} 
			}
		}
		return {win, winner}
	}

	const checkDraw = () => {
		for (cell of board){
			if (cell == " "){
				return false
			}
		}

		return true
	}

	const clearBoard = () => {
		board = [" "," "," "," "," "," "," "," "," "]
	}

	return {render, checkCellTaken, placeMark, checkWin, checkDraw, clearBoard}
})()

const scoreBoard = (() => {
	var scoreBoard = document.getElementById("scoreBoard")

	const updateScoreBoard = (player1, player2) => {
		player1Score = player1.getPlayerScore()
		player2Score = player2.getPlayerScore()
		player1Name = player1.getPlayerName()
		player2Name = player2.getPlayerName()

		scoreBoardHTML = `<b>Score</b><br>${player1Name}: ${player1Score}<br>${player2Name}: ${player2Score}`
		scoreBoard.innerHTML = scoreBoardHTML
	}

	return {updateScoreBoard}
})()


const game = () => {

	var currentPlayer = playerList.list[0]
	var turnIndicator = document.getElementById("turnIndicator")

	const changeTurn = () => {
		currentPlayer = (currentPlayer === playerList.list[0]) ? playerList.list[1] : playerList.list[0]
	}

	const updateTurnIndicator = () => {
		turnIndicator.innerHTML = `${currentPlayer.getPlayerName()}'s turn`
	}

	const endWin = (winner) => {
		var winnerName = winner.getPlayerName()
		const winModal = document.getElementById("winModal")
		const winMessage = document.getElementById("winMessage")

		winner.increasePlayerScore()

		winMessage.innerHTML = `<h1>GAME OVER </h1> ${winnerName} wins!`

		winModal.style.display = "block"

		const closeButton = document.getElementById("winCloseButton")
		closeButton.onclick = () => {
			winModal.style.display = "none"
			gameBoard.clearBoard()
			gameBoard.render()
			scoreBoard.updateScoreBoard(playerList.list[0], playerList.list[1])
		}
	}

	const endDraw = () => {
		const drawModal = document.getElementById("drawModal")
		drawModal.style.display = "block"

		const closeButton = document.getElementById("drawCloseButton")
		closeButton.onclick = () => {
			drawModal.style.display = "none"
			gameBoard.clearBoard()
			gameBoard.render()
		}
	}

	const htmlCells = document.getElementsByClassName("cell")

	updateTurnIndicator()

	for (const cell of htmlCells){
		cell.onclick = () => {
			var cellIndex = cell.dataset.index
			var player = currentPlayer

			if (gameBoard.checkCellTaken(cellIndex)){
				//console.log("taken!")
			} else {
				gameBoard.placeMark(player, cellIndex)
				gameBoard.render()
				changeTurn()
				updateTurnIndicator()
			}

			if (gameBoard.checkWin().win) {
				endWin(gameBoard.checkWin().winner)
			}

			if (gameBoard.checkDraw() && !gameBoard.checkWin().win) {
				endDraw()
			}
		}
	}
}






/*

*/