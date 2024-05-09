const baseUrl = 'http://localhost:5000';

async function fetchGameStatus() {
    try {
        const response = await fetch(`${baseUrl}/game/status`);
        if (!response.ok) {
            if (response.status === 404) {
                console.log('No active game found');
                return;
            }
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const data = await response.json();
        updateBoard(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchActiveGames() {
    try {
        const response = await fetch(`${baseUrl}/game/active`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const data = await response.json();
        updateActiveGames(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchCompletedGames() {
    try {
        const response = await fetch(`${baseUrl}/game/completed`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const data = await response.json();
        updateCompletedGames(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Login successful');
            document.getElementById('authSection').style.display = 'none';
            document.getElementById('gameSection').style.display = 'block';
            fetchActiveGames();
            fetchCompletedGames();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful');
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function createNewGame(player) {
    try {
        const response = await fetch(`${baseUrl}/game/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(player)
        });
        const data = await response.json();
        if (response.ok) {
            alert('New game created');
            updateBoard(data);
            document.getElementById('gameBoard').style.display = 'block';
            fetchActiveGames();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function joinGame(player, gameId) {
    try {
        const response = await fetch(`${baseUrl}/game/join?gameId=${gameId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(player)
        });
        const data = await response.json();
        if (response.ok) {
            alert('Joined game successfully');
            updateBoard(data);
            document.getElementById('gameBoard').style.display = 'block';
            fetchActiveGames();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function makeMove(row, col, player) {
    try {
        const response = await fetch(`${baseUrl}/game/move`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ row, col, player })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const data = await response.json();
        updateBoard(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateBoard(game) {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.style.display = 'block';
    const cells = gameBoard.getElementsByTagName('td');
    for (let cell of cells) {
        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');
        cell.textContent = game.Board[row][col] || '';
        cell.onclick = game.CurrentTurn === document.getElementById('loginUsername').value ? 
            () => makeMove(row, col, game.CurrentTurn) : null;
    }
}

function updateActiveGames(games) {
    const activeGamesDiv = document.getElementById('activeGames');
    activeGamesDiv.innerHTML = '';
    games.forEach((game) => {
        const gameInfo = document.createElement('div');
        const playerCount = game.Players ? game.Players.length : 0;
        gameInfo.textContent = `Game ${game.Id} - Players: ${playerCount}/2`;
        if (game.HasRoom) {
            const joinButton = document.createElement('button');
            joinButton.textContent = 'Join Game';
            joinButton.onclick = () => joinGame(document.getElementById('loginUsername').value, game.Id);
            gameInfo.appendChild(joinButton);
        }
        activeGamesDiv.appendChild(gameInfo);
    });
}

function updateCompletedGames(games) {
    const completedGamesDiv = document.getElementById('completedGames');
    completedGamesDiv.innerHTML = '';
    games.forEach((game) => {
        const gameInfo = document.createElement('div');
        gameInfo.textContent = `Game ${game.Id} - Winner: ${game.Winner}`;
        completedGamesDiv.appendChild(gameInfo);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchActiveGames();
    fetchCompletedGames();
});

document.getElementById('loginForm').addEventListener('submit', loginUser);
document.getElementById('registerForm').addEventListener('submit', registerUser);
document.getElementById('createGameButton').addEventListener('click', () => {
    createNewGame(document.getElementById('loginUsername').value);
});
