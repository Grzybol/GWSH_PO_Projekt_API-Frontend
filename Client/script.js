const baseUrl = 'http://localhost:5000';  // Zmień na odpowiedni adres i port

function fetchGameStatus() {
    fetch(`${baseUrl}/game/status`)
        .then(response => response.json())
        .then(data => updateBoard(data))
        .catch(error => console.error('Error:', error));
}

function updateBoard(game) {
    const board = game.board;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.querySelector(`td[data-row="${i}"][data-col="${j}"]`);
            cell.textContent = board[i][j] || '';
            cell.onclick = function() {
                if (!cell.textContent) {
                    makeMove(i, j, game.currentTurn);
                }
            };
        }
    }
}

function makeMove(row, col, player) {
    fetch(`${baseUrl}/game/move`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ row, col, player })
    })
    .then(response => response.json())
    .then(data => updateBoard(data))
    .catch(error => console.error('Error:', error));
}

function resetGame() {
    // Resetowanie gry może wymagać dodatkowej logiki po stronie serwera
    location.reload();  // Tymczasowe rozwiązanie
}

document.addEventListener('DOMContentLoaded', fetchGameStatus);
