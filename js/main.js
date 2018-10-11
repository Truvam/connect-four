class Board {
    constructor(width, height, _class) {
        this.width = width;
        this.height = height;
        this.class = _class;
        this.create_board();
    }

    create_board() {
        var board = document.getElementsByClassName(this.class);
        for(let i = 0; i < this.height; i++) {
            var row = document.createElement('div');
            row.className = 'row';
            board[0].appendChild(row);
            for(let j = 0; j < this.width; j++) {
                var columns = document.createElement('div');
                columns.className = 'cell';
                row.appendChild(columns);
            }
        }
    }
}

window.onload = function() {
    width = document.getElementById('size-w').value;
    height = document.getElementById('size-h').value;
    const board = new Board(width, height,'board');
};