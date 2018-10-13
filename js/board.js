class Board {
    constructor(width, height, _class) {
        this.width = width;
        this.height = height;
        this.class = _class;
        this.first_player;
        this.second_player;
        this.current_player;
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
                console.log(event.target.classList);
            }
        });

        board.addEventListener('click', (event) => {
            if (event.target.className.includes('cell empty')) {
                const column = event.target.dataset.column;
                const empty_cell = find_empty_cell(column);
                if (empty_cell != null) {
                    empty_cell.classList.remove('empty');
                    if (this.current_player == this.first_player) {
                        empty_cell.classList.add('red');
                        this.current_player = this.second_player;
                    } else {
                        empty_cell.classList.add('blue');
                        this.current_player = this.first_player;
                    }
                }
            }
        });
    }
}