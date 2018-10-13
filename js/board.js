class Board {
    constructor(width, height, _class) {
        this.width = width;
        this.height = height;
        this.class = _class;
        this.first_player;
        this.second_player;
        this.current_player;
        this.matrix = Array.from({ length: height }, () => Array.from({ length: width }, () => "_"));
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

        function find_empty_cell(column) {
            const cells = document.querySelectorAll('[data-column="' + column + '"]');
            for (let i = cells.length - 1; i >= 0; i--) {
                if (cells[i].className.includes('empty')) {
                    return cells[i];
                }
            }
            return null;
        }

        function play_ai(board) {
            const depth = parseInt(document.querySelectorAll('input[name="config-dif"]:checked')[0].value);
            let col = alpha_beta(board, depth, -Infinity, Infinity);
            console.log("Column: ", col);
            const empty_cell = find_empty_cell(col);
            console.log("ROW: ", empty_cell.dataset.row);
            board.matrix[empty_cell.dataset.row][empty_cell.dataset.column] = 'b';
            empty_cell.classList.add('blue');
            empty_cell.classList.remove('empty');
            const result = utility(board);
            if (result == 512 || result == -512) {
                alert(board.current_player + ' won!');
                return;
            }
            board.current_player = board.first_player;
        }

        board.addEventListener('mouseover', (event) => {
            if (event.target.className.includes('cell empty')) {
                const column = event.target.dataset.column;
                //console.log("col", column);
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

                const result = utility(this);
                if (result == 512 || result == -512) {
                    alert(this.current_player + ' won!');
                    /*document.getElementsByClassName("board")[0].innerHTML = "";
                    document.getElementsByClassName("board")[0].style.opacity = "0.2";
                    const width = document.getElementById('size-w').value;
                    const height = document.getElementById('size-h').value;
                    new Board(width, height, 'board');
                    show_config();*/
                    return;
                }

                if (empty_cell != null) {
                    console.log(empty_cell.classList);
                    empty_cell.classList.remove('empty');
                    if (this.current_player == this.first_player) {
                        this.matrix[empty_cell.dataset.row][empty_cell.dataset.column] = 'r';
                        empty_cell.classList.add('red');
                        this.current_player = this.second_player;
                        play_ai(this);
                    } else {
                        this.matrix[empty_cell.dataset.row][empty_cell.dataset.column] = 'b';
                        empty_cell.classList.add('blue');
                        this.current_player = this.first_player;
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
        for(let j = 0; j < board.width; j++) {
            if(board.matrix[i][j] != empty)
                cont += 1;
            if(cont == 42)
                return true;
        }
    }
    return false;
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
    if(is_draw(board)) return 0;
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