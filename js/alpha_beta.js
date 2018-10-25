function successors(board) {
    let temp_board = JSON.parse(JSON.stringify(board));
    let child_list = []
    for (let i = 0; i < board.width; i++) {
        place_piece(temp_board, i);
        temp_board.column = i;
        child_list.push(temp_board);
        temp_board = JSON.parse(JSON.stringify(board));
    }
    return child_list;
}

function alpha_beta(board, depth, alpha, beta) {
    let value = -Infinity;
    let column = 0;
    for (let s of successors(board)) {
        let v = min_value(s, depth - 1, alpha, beta);
        if (v >= value) {
            value = v;
            column = s.column;
            if (value >= beta)
                break;
        }
    }
    return column;
}


function min_value(board, depth, alpha, beta) {
    const value = utility(board);
    if (depth == 0 || value == -512 || value == 512 || is_draw(board))
        return value;
    let v = Infinity;
    board.current_player = board.first_player;
    for (let s of successors(board)) {
        v = Math.min(v, max_value(s, depth - 1, alpha, beta));
        if (v <= alpha)
            return v;
        beta = Math.min(beta, v);
    }
    return v;
}


function max_value(board, depth, alpha, beta) {
    const value = utility(board);
    if (depth == 0 | value == -512 || value == 512 || is_draw(board))
        return value;
    let v = -Infinity;
    board.current_player = board.second_player;
    for (let s of successors(board)) {
        v = Math.max(v, min_value(s, depth - 1, alpha, beta));
        if (v >= beta)
            return v;
        alpha = Math.max(alpha, v);
    }
    return v;
}


function place_piece(board, column) {
    const empty = "_";
    for (let i = board.height - 1; i >= 0; i--) {
        if (board.matrix[i][column] == empty) {
            if (board.current_player == board.first_player) {
                board.matrix[i][column] = "r";
            } else {
                board.matrix[i][column] = "b";
            }
            return;
        }
    }
    return;
}