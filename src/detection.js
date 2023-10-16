const landMarks = [{"index": 0, "x": 10, "y": 20}, {"index": 1, "x": 20, "y": 30}, {"index": 2, "x": 40, "y": 50}]

const buildSquares = (landMarks) => {
    const squares =  [];
    const squareSide = 10;
    landMarks.forEach(landmark => {
        squares.push({
            "index": landmark.index,
            "x": landmark.x - squareSide / 2,
            "y": landmark.y + squareSide / 2,
            "side": squareSide
        })
    })
    return squares;
}

const detectPoses = (squares, actualLandMarks) => {
    actualLandMarks.forEach(landMark => {
        let square = squares.filter(s => s.index === landMark.index);
        if(!(landMark.x > square.x && landMark.x + square.side && landMark.y > square.y && landMark.y < square.y + square.side)){
            return false;
        }
    })
    return true;
}
