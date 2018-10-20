class Board {
    constructor(width, height, _class) {
        this.width = width;
        this.height = height;
        this.class = _class;
        this.first_player;
        this.second_player;
        this.current_player;
        this.matrix = Array.from({
            length: height
        }, () => Array.from({
            length: width
        }, () => "_"));
        this.column = 0;
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

        board.addEventListener('mouseover', (event) => {
            if (event.target.className.includes('cell empty')) {
                const column = event.target.dataset.column;
                const empty_cell = find_empty_cell(column);
                if (empty_cell != null) {
                    if (this.current_player == this.first_player) {
                        empty_cell.classList.add('cell-red');
                    } else {
                        empty_cell.classList.add('cell-blue');
                    }
                }
            }
        });

        board.addEventListener('mouseout', (event) => {
            if (event.target.className.includes('cell')) {
                if (this.current_player == this.first_player) {
                    const cells = document.querySelectorAll('.cell-red')[0];
                    if (cells != null) {
                        cells.classList.remove('cell-red');
                    }
                } else {
                    const cells = document.querySelectorAll('.cell-blue')[0];
                    if (cells != null) {
                        cells.classList.remove('cell-blue');
                    }
                }
            }
        });

        board.addEventListener('click', (event) => {
            if (event.target.className.includes('cell empty')) {
                const column = event.target.dataset.column;
                let empty_cell = find_empty_cell(column);

                if (empty_cell != null) {
                    empty_cell.classList.remove('empty');
                    if (this.current_player == this.first_player) {
                        this.matrix[empty_cell.dataset.row][empty_cell.dataset.column] = 'r';
                        empty_cell.classList.add('red');
                        const result = utility(this);
                        who_won(this.current_player, result);
                        this.current_player = this.second_player;
                        set_current_player(this.current_player, "blue");
                        if (document.getElementById('ai').checked)
                            play_ai(this);

                    } else {
                        this.matrix[empty_cell.dataset.row][empty_cell.dataset.column] = 'b';
                        empty_cell.classList.add('blue');
                        const result = utility(this);
                        who_won(this.current_player, result);
                        this.current_player = this.first_player;
                        set_current_player(this.current_player, "red");
                    }
                }
            }
        });
    }
}

function is_draw(board) {
    let cont = 0;
    let empty = "_";
    for (let i = 0; i < board.height; i++) {
        for (let j = 0; j < board.width; j++) {
            if (board.matrix[i][j] != empty)
                cont += 1;
            if (cont == 42)
                return true;
        }
    }
    return false;
}

function find_empty_cell(column) {
    const cells = document.querySelectorAll('[data-column="' + column + '"]');
    for (let i = cells.length - 1; i >= 0; i--) {
        if (cells[i].className.includes('empty')) {
            return cells[i];
        }
    }
    return null;
}

function who_won(current_player, result) {
    if (result == 512 || result == -512) {
        alert(current_player + ' won!');
        quit_game();
    }
}

function play_ai(board) {
    const depth = parseInt(document.querySelectorAll('input[name="config-dif"]:checked')[0].value);
    let col = alpha_beta(board, depth, -Infinity, Infinity);
    const empty_cell = find_empty_cell(col);
    board.matrix[empty_cell.dataset.row][empty_cell.dataset.column] = 'b';
    empty_cell.classList.add('blue');
    empty_cell.classList.remove('empty');
    console.log(board.current_player);
    const result = utility(board);
    who_won(board.current_player, result);
    board.current_player = board.first_player;
    set_current_player(board.current_player, "red");
}

function value_aux(cont_r, cont_b) {
    if (cont_r == 3 && cont_b == 0)
        return -50;
    else if (cont_r == 2 && cont_b == 0)
        return -10;
    else if (cont_r == 1 && cont_b == 0)
        return -1;
    else if (cont_r == 0 && cont_b == 1)
        return 1;
    else if (cont_r == 0 && cont_b == 2)
        return 10;
    else if (cont_r == 0 && cont_b == 3)
        return 50;
    return 0;
}

function utility(board) {
    if (is_draw(board)) return 0;
    let cont_r = 0;
    let cont_b = 0;
    let sum = 0;
    for (let i = 0; i < board.height; i++) { // HORIZONTAL
        for (let j = 0; j < board.width - 3; j++) {
            for (let k = j; k < j + 4; k++) {
                if (board.matrix[i][k] == 'r')
                    cont_r += 1;
                else if (board.matrix[i][k] == 'b')
                    cont_b += 1;
            }
            if (cont_b == 4)
                return 512;
            else if (cont_r == 4)
                return -512;
            sum += value_aux(cont_r, cont_b);
            cont_r = 0;
            cont_b = 0;
        }
    }

    for (let j = 0; j < board.width; j++) { // VERTICAL
        for (let i = 0; i < board.height - 3; i++) {
            for (let k = i; k < i + 4; k++) {
                if (board.matrix[k][j] == 'r')
                    cont_r += 1;
                else if (board.matrix[k][j] == 'b')
                    cont_b += 1;
            }
            if (cont_b == 4)
                return 512;
            else if (cont_r == 4)
                return -512;
            sum += value_aux(cont_r, cont_b);
            cont_r = 0;
            cont_b = 0;
        }
    }

    for (let i = 3; i < board.height; i++) { // DIAGONAL RIGHT
        let z = i;
        for (let j = 0; j < board.width - 3; j++) {
            for (let k = j; k < j + 4; k++) {
                if (board.matrix[z][k] == 'r')
                    cont_r += 1;
                else if (board.matrix[z][k] == 'b')
                    cont_b += 1;
                z -= 1;
            }
            z = i;
            if (cont_b == 4)
                return 512;
            else if (cont_r == 4)
                return -512;
            sum += value_aux(cont_r, cont_b);
            cont_r = 0;
            cont_b = 0;
        }
    }

    for (let i = 3; i < board.height; i++) { // DIAGONAL LEFT
        let z = i;
        for (let j = board.width - 1; j > board.width - 5; j--) {
            for (let k = j; k > j - 4; k--) {
                if (board.matrix[z][k] == 'r')
                    cont_r += 1;
                else if (board.matrix[z][k] == 'b')
                    cont_b += 1;
                z -= 1;
            }
            z = i;
            if (cont_b == 4)
                return 512;
            else if (cont_r == 4)
                return -512;
            sum += value_aux(cont_r, cont_b);
            cont_r = 0;
            cont_b = 0;
        }
    }
    return sum;
}