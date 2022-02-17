function search_api(){
    const form = document.getElementById("search_area");
    const fd = new FormData(form)
    
    fd.append("show","10")
    fd.append("page","1")

    const fd_date = fd.get("date").length ? fd.get("date").split(" to "): []

    const req_url = "./search.html" 
                    + "?page=" + fd.get("page")
                    + "&show=" + fd.get("show")
                    + (fd.get("search").length ? "&title=" + fd.get("search") : "")
                    + (fd.get("tag").length ? "&tag=" + fd.get("tag") : "")
                    + (fd.get("author").length ? "&author=" + fd.get("author") : "")
                    + (fd.get("rate-min").length ? "&rate_min=" + fd.get("rate-min") : "")
                    + (fd.get("rate-max").length ? "&rate_max=" + fd.get("rate-max") : "")
                    + (fd_date.length >= 1 ? "&date_from=" + fd_date[0] : "")
                    + (fd_date.length >= 2 ? "&date_to=" + fd_date[1] : "")
    window.location.href = req_url
}
document.getElementById("search-btn").addEventListener("click", search_api, false)


function sub_search_tab(){
    document.getElementById("expansion-search").classList.toggle("sub-search-open")
    if(document.getElementById("expansion-search").classList.contains("sub-search-open")){
        document.getElementById("expansion-search-btn-title").title = "close"
    }
    else{
        document.getElementById("expansion-search-btn-title").title = "Expansion"
    }
}
document.getElementById("expansion-search-btn").addEventListener("click", sub_search_tab, false)


const mr = document.querySelector("multi-range")
const mr_min = document.getElementById("input-range-min")
const mr_max = document.getElementById("input-range-max")
mr.addEventListener('change', () => {
    mr_min.value = mr.from
    mr_max.value = mr.to
})

function mr_min_max_draw(){
    if(Number(mr_min.value) > Number(mr_max.value)){
        const mr_temp_value = mr_min.value
        mr_min.value = mr_max.value
        mr_max.value = mr_temp_value
    }
    mr.from = mr_min.value
    mr.to = mr_max.value
}
mr_min.addEventListener('input', mr_min_max_draw)
mr_max.addEventListener('input', mr_min_max_draw)