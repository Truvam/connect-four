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

    value_aux(cont_r, cont_b) {
        if (cont_r == 3 && cont_b == 0)
            return -50
        else if (cont_r == 2 && cont_b == 0)
            return -10
        else if (cont_r == 1 && cont_b == 0)
            return -1
        else if (cont_r == 0 && cont_b == 1)
            return 1
        else if (cont_r == 0 && cont_b == 2)
            return 10
        else if (cont_r == 0 && cont_b == 3)
            return 50
        return 0
    }

    utility() {
        let cont_r = 0
        let cont_b = 0
        let sum = 0
        for (let i = 0; i < this.height; i++){  // HORIZONTAL
            let cells = document.querySelectorAll('[data-row="' + i + '"]');
            for (let j = 0; j < this.width-3; j++) { 
                for (let k = j; k < j+4; k++) {
                    if (cells[k].className.includes('red'))
                        cont_r += 1
                    else if (cells[k].className.includes('blue'))
                        cont_b += 1      
                }
                if (cont_r == 4)
                    return 512
                else if ( cont_b == 4)
                    return -512
                sum += this.value_aux(cont_r, cont_b)
                cont_r = 0
                cont_b = 0
            }
        }

        for (let j = 0; j < this.width; j++){  // VERTICAL
            let cells = document.querySelectorAll('[data-column="' + j + '"]');
            for (let i = 0; i < this.height-3; i++) { 
                for (let k = i; k < i+4; k++) {
                    if (cells[k].className.includes('red'))
                        cont_r += 1
                    else if (cells[k].className.includes('blue'))
                        cont_b += 1      
                }
                if (cont_r == 4)
                    return 512
                else if ( cont_b == 4)
                    return -512
                sum += this.value_aux(cont_r, cont_b)
                cont_r = 0
                cont_b = 0
            }
        }

        for (let i = 3; i < this.height; i++){  // DIAGONAL RIGHT
            let z = i;
            for (let j = 0; j < this.width-3; j++) { 
                for (let k = j; k < j+4; k++) {
                    let cells = document.querySelectorAll('[data-row="' + z + '"]'); 
                    if (cells[k].className.includes('red'))
                        cont_r += 1
                    else if (cells[k].className.includes('blue'))
                        cont_b += 1   
                    z -= 1;   
                }
                z = i;
                if (cont_r == 4)
                    return 512
                else if ( cont_b == 4)
                    return -512
                sum += this.value_aux(cont_r, cont_b)
                cont_r = 0
                cont_b = 0
            }
        }

        for (let i = 3; i < this.height; i++){  // DIAGONAL LEFT
            let z = i;
            
            for (let j = this.width-1; j > this.width-5; j--) { 
                console.log("J: ", j);
                for (let k = j; k > j-4; k--) {
                    let cells = document.querySelectorAll('[data-row="' + z + '"]'); 
                    console.log("R: ", z, "C: ", k);
                    console.log("Utility: ", cells);
                    if (cells[k].className.includes('red'))
                        cont_r += 1
                    else if (cells[k].className.includes('blue'))
                        cont_b += 1   
                    z -= 1;   
                }
                z = i;
                if (cont_r == 4)
                    return 512
                else if ( cont_b == 4)
                    return -512
                sum += this.value_aux(cont_r, cont_b)
                cont_r = 0
                cont_b = 0
            }
        }
        return sum
    }

    event_listener() {
        const board = document.getElementsByClassName(this.class)[0];

        function find_empty_cell(column) {
            const cells = document.querySelectorAll('[data-column="' + column + '"]');
            for (let i = cells.length - 1; i >= 0; i--) {
                if (cells[i].className.includes('empty')) {
                    //console.log("cells", cells[i]);
                    return cells[i];
                }
            }
            return null;
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
                //console.log(event.target.classList);
            }
        });

        board.addEventListener('click', (event) => {
            if (event.target.className.includes('cell empty')) {
                const column = event.target.dataset.column;
                const row = event.target.dataset.row;
                const empty_cell = find_empty_cell(column);

                const result = this.utility();
                if (result == 512 || result == -512) {
                    alert('Player ' + this.current_player + ' won!');
                    return;
                }

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