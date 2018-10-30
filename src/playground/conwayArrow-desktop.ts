interface LitNumber {
    kind: 'number';
    value: number;
}

interface ConwayArrow {
    kind: 'arrow';
    value: Array<LitNumber | ConwayArrow>;
}

// function conwayArrowTag(delims: string[], ...arrows: ConwayArrow): string {

//     return '';
// }

function conwayArrowToString(xca: ConwayArrow): string {
    const len = xca.value.length;

    if(len === 0) {
        return '()';
    }
    for (let idx = 0; idx < len; idx++) {
        
    }
    return '';
}