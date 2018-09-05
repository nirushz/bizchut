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