class Board {
    constructor(width, height, _class) {
        this.width = width;
        this.height = height;
        this.class = _class;
        this.create_board();
    }

    create_board() {
        const board = document.getElementsByClassName(this.class)[0];
        for (let i = 0; i < this.height; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            board.appendChild(row);
            for (let j = 0; j < this.width; j++) {
                const columns = document.createElement('div');
                columns.className = 'cell empty';
                columns.dataset.column = j;
                columns.dataset.row = i;
                row.appendChild(columns);
            }
        }
    }

    event_listener() {
        const board = document.getElementsByClassName(this.class)[0];

        function find_empty_cell(column) {
            const cells = document.querySelectorAll('[data-column="' + column + '"]');
            for (let i = cells.length - 1; i >= 0; i--) {
                if (cells[i].className.includes('empty')) {
                    console.log("cells", cells[i]);
                    return cells[i];
                }
            }
            return null;
        }

        board.addEventListener('mouseover', (event) => { 
            if (event.target.className.includes('cell empty')) {
                const column = event.target.dataset.column;
                console.log("col", column);
                const empty_cell = find_empty_cell(column);
                empty_cell.classList.add('cell-red');
            }
        });

        board.addEventListener('mouseout', (event) => { 
            if (event.target.className.includes('cell')) {
                const cells = document.querySelectorAll('.cell-red')[0];
                console.log("Name: ", cells);
                cells.classList.remove('cell-red');
                console.log(event.target.classList);
            }
        });

        board.addEventListener('click', (event) => { 
            if (event.target.className.includes('cell empty')) {
                const column = event.target.dataset.column;
                const empty_cell = find_empty_cell(column);
                empty_cell.classList.remove('empty');
                empty_cell.classList.add('red');
            }
        });

    }

}


window.onload = function() {
    const width = document.getElementById('size-w').value;
    const height = document.getElementById('size-h').value;
    new Board(width, height,'board');
};

function select_opponent(id) {
    if (id == "ai") {
        document.getElementById("f-label").innerText = "Player";
        document.getElementById("s-label").innerText = "AI";
        document.getElementsByClassName("config-dif")[0].style.display = "unset";
        document.getElementsByClassName("button")[0].style.margin = "10px 0 0";
    }
    else {
        document.getElementById("f-label").innerText = "Player 1";
        document.getElementById("s-label").innerText = "Player 2";
        document.getElementsByClassName("config-dif")[0].style.display = "none";
        document.getElementsByClassName("button")[0].style.margin = "50px 0 0";
    }
}

function start_game() {
    document.getElementsByClassName("configuration")[0].style.display = "none";
    document.getElementsByClassName("board")[0].innerHTML = "";
    const width = document.getElementById('size-w').value;
    const height = document.getElementById('size-h').value;
    const board = new Board(width, height,'board');
    board.event_listener();
}

function show_config() {
    const display = document.getElementsByClassName("configuration")[0].style.display;
    if (display == "unset") {
        document.getElementsByClassName("configuration")[0].style.display = "none";
    }
    else {
        document.getElementsByClassName("configuration")[0].style.display = "unset";
    }
    
}

function show_rules() {
    const display = document.getElementsByClassName("rules")[0].style.display;
    if (display == "unset") {
        document.getElementsByClassName("rules")[0].style.display = "none";
    }
    else {
        document.getElementsByClassName("rules")[0].style.display = "unset";
    }
}

function show_leaderboard() {
    const display = document.getElementsByClassName("leaderboard")[0].style.display;
    if (display == "unset") {
        document.getElementsByClassName("leaderboard")[0].style.display = "none";
    }
    else {
        document.getElementsByClassName("leaderboard")[0].style.display = "unset";
    }
}