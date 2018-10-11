class Board {
    constructor(width, height, _class) {
        this.width = width;
        this.height = height;
        this.class = _class;
        this.create_board();
        this.event_listener();
    }

    create_board() {
        const board = document.getElementsByClassName(this.class)[0];
        for(let i = 0; i < this.height; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            board.appendChild(row);
            for(let j = 0; j < this.width; j++) {
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
            for(let i = cells.length - 1; i >= 0; i--) {
                if(cells[i].className.includes('empty')) {
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
                empty_cell.classList.add('cell-blue');
            }
        });

        board.addEventListener('mouseout', (event) => { 
            if (event.target.className.includes('cell')) {
                const cells = document.querySelectorAll('.cell-blue')[0];
                console.log("Name: ", cells);
                cells.classList.remove('cell-blue');
                console.log(event.target.classList);
            }
        });
    }

}


window.onload = function() {
    const width = document.getElementById('size-w').value;
    const height = document.getElementById('size-h').value;
    const board = new Board(width, height,'board');
};