function Element(tag, attributes = {}) {
    this.el = document.createElement(tag);
    for (let a in attributes) {
        this.el.setAttribute(a, attributes[a]);
    }
    return this.el;
};
class Table{
    constructor(columns, lines, callback) {
        this.tableElement = new Element('table');
        this.height = lines; 
        this.width = columns;
        for (let i = 0; i < lines; i++){
            const tr = new Element('tr');
            this.tableElement.appendChild(tr);
            this[i] = [];
            for (let j = 0; j < columns; j++){
                const td = new Element('td');
                [td.i,td.j] = [i,j];
                this.tableElement.rows[i].appendChild(td);
                this[i][j] = td;
                callback && callback(td,i,j);
            }
        }
        document.body.appendChild(this.tableElement)
    }
    forEach(callback){
        for (let i of this.tableElement.rows){
            for (let j of i.cells){
                callback(j);
            }
        }
    }
    map(callback){
        const r = [];
        for (let i = 0; i < this.height; i++){
            for (let j = 0; j < this.width; j++){
                r.push(callback(this[i][j],i,j));
            }
        }
        return r;
    }
}