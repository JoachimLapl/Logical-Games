function createTectonic(columns, lines, maxG) {
    const matrix = new Table(columns, lines, tr=>{
        tr.choices=new Array(maxG).fill(true);
        tr.value = 1;
    });
    matrix.max = maxG;
    matrix.showValues= matrixShowValuesFunction(matrix);
    while (true){
        const newCell = getRandomBadCell(matrix);
        if (!newCell) break;
        newCell.value+=1;
        matrix.showValues();
    }
    return matrix;
} 
function cellIsBad(cell, matrix, getNumber = false){
    getNumber && (n = 0);
    const [x,y,value,maxX,maxY,maxG]=[cell.j,cell.i,cell.value,matrix.width,matrix.height,matrix.max];
    if (value >=maxG) return 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if ((x+i+1)&&(x+i-maxX)&&(y+j+1)&&(y+j-maxY)&&(i||j)){
                // console.log(x+i, maxX, y+j, maxY)
                const v = matrix[y+j][x+i].value;
                if (value === v && v < maxG){
                    if (!getNumber){
                        return true;
                    }
                    n++;
                }
            }
        }
    }
    return getNumber?n:false;
}
function getAllBadCells(matrix){
    const r = [];
    matrix.forEach(i => {
        const n = cellIsBad(i,matrix, true); 
        r[n] = r[n]||[];
        r[n].push(i);
    });
    return r;
}
function getWorstCells(matrix){
    const bads = getAllBadCells(matrix);
    return bads.length === 1? false : bads[bads.length-1];
}
function getRandomBadCell(matrix){
    const all = getWorstCells(matrix);
    if (all === 0) return false;
    return all[Math.floor(Math.random()*all.length)];
}
function matrixShowValuesFunction(matrix){
    return ()=>matrix.forEach(td=>td.innerHTML = td.value);
}