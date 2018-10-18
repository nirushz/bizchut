function getCategoryNameByID(id){
    let categoryName;
    switch(id)  {
        case 1:
            break;
        case 2:
            categoryName = "אמונה"
            break;
        case 3:
            categoryName = "הלכה"
            break;
        case 4:
            categoryName = "פרשת שבוע"
            break;
    }

    return categoryName;
}


const objToMap = (obj => {
    const mp = new Map;
    Object.keys(obj).forEach (k => { mp.set(k, obj[k]) });
    return mp;
});

const mapToObj = (aMap => {
    const obj = {};
    aMap.forEach((v,k) => { obj[k] = v });
    return obj;
});


const endOfContentDiv = `<div id="endOfContent">תודה לרב גבריאל אלישע!<div>`;