
const $ = (s, p = document) => p.querySelector(s);
const svg = $('svg'); 
const svg_margin = 5;
class Case {
    constructor(x, y, t) {
        svg.insertAdjacentHTML('beforeend', `<rect cn x=${x * 50} y=${y * 50} height=50 width=50 class="case" /><text tn x=${x * 50 + 25} y=${y * 50 + 25}></text>`);
        this.el = $('[cn]', svg); this.el.removeAttribute('cn'); this.text_el = $('[tn]', svg); this.text_el.removeAttribute('tn'); this.value = null; this.table = t; this.x = x; this.y = y;
    }
    get nearbyCases() { return Table.nearby.map(e => this.table?.[this.y + e[0]]?.[this.x + e[1]]).filter(e => e) }
    setValue(v) { this.text_el.innerHTML = this.value = v }
}
class Table {
    static nearby = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    constructor(c, r) {
        this.c = c; this.r = r;
        for (let i = 0; i < r; i++) { this[i] = []; for (let j = 0; j < c; j++) this[i][j] = new Case(j, i, this) }
        svg.setAttribute('viewBox', `${-svg_margin} ${-svg_margin} ${50 * c + svg_margin * 2} ${50 * r + svg_margin * 2}`);
    }
    forEachCase(callback) { for (let i = 0; i < this.r; i++)for (let j = 0; j < this.c; j++)callback(this[i][j], j, i) }
}
export { Table, $, svg }