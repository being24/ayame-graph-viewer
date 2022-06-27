function paginationInit(index,hitNum){
    const maxIndex = Math.ceil(hitNum/Number(params.get("show")));
    if(maxIndex < 5){
        createButton(index,1,maxIndex,hitNum);
    }
    else{
        if(index < 3){
            createButton(index,1,5,hitNum);
        }
        else if(maxIndex - index < 2){
            createButton(index,maxIndex-4,maxIndex,hitNum);
        }
        else{
            createButton(index,index-2,index+2,hitNum);
        }
    }
}

function createButton(now,min,max,hitNum){

    const paginationArea = document.getElementById("search-list-num");
    while(paginationArea.lastChild){
        paginationArea.removeChild(paginationArea.lastChild);
    }

    for (let i = 0; i <= max-min; i++) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("paginationButton");
        newDiv.classList.add("center-eff-btn");
        if(now == min+i){
            newDiv.classList.add("nowPageButton");
        }

        const newContent = document.createTextNode(min+i);
        newDiv.appendChild(newContent);
        
        const newA = document.createElement("a");
        newA.href = "./search.html?page=" + (min+i) 
                    + "&show=" + params.get("show")
                    + (params.get("title") ? "&title=" + params.get("title") : "")
                    + (params.get("tag") ? "&tag=" + params.get("tag") : "")
                    + (params.get("author") ? "&author=" + params.get("author") : "")
                    + (params.get("rate_min") ? "&rate_min=" + params.get("rate_min") : "")
                    + (params.get("rate_max") ? "&rate_max=" + params.get("rate_max") : "")
                    + (params.get("date_from")  ? "&date_from=" + params.get("date_from") : "")
                    + (params.get("date_to") ? "&date_to=" + params.get("date_to") : "")
                    + "&hit_num=" + hitNum;
        newDiv.appendChild(newA);

        paginationArea.appendChild(newDiv);
    }
}