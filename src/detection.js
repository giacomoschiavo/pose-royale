export const buildSquares = (landMarks) => {
  const squares = [];
  const squareSide = 0.05;
  for (const [key, value] of Object.entries(landMarks)) {
    squares.push({
      index: key,
      x: value.x - squareSide / 2,
      y: value.y - squareSide / 2,
      side: squareSide,
    });
  }
  return squares;
};

export const detectPoses = (squares, actualLandMarks) => {
  actualLandMarks.forEach((landMark) => {
    let square = squares.filter((s) => s.index === landMark.index);
    if (
      !(
        landMark.x > square.x &&
        landMark.x + square.side &&
        landMark.y > square.y &&
        landMark.y < square.y + square.side
      )
    ) {
      return false;
    }
  });
  return true;
};
