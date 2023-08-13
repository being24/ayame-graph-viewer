const params = (new URL(document.location)).searchParams

function searchMessage(status) {
    document.getElementById("search-list-msg-area").classList.add("search-list-msg-area-on")

    if (status == 0) {
        document.getElementById("search-list-msg").textContent = "No results found"
    }
    else if (status == 1) {
        document.getElementById("search-list-msg").textContent = "No display results"
    }
    else if (status == 2) {
        document.getElementById("search-list-msg").textContent = "Request error"
    }
    else {
        document.getElementById("search-list-msg").textContent = "Unknown error"
    }
}

function searchListClear() {
    document.getElementById("search-list").remove()
    document.getElementById("search-list-control").classList.add("search-list-control-hidden")
}

function searchListDraw(list) {
    const search_list = document.createElement("div")
    search_list.setAttribute("id", "search-list")
    document.getElementById("search-list-area").prepend(search_list)

    const search_content = document.querySelector('#template-contents').content
    for (const [index, element] of list.entries()) {
        const clone = document.importNode(search_content, true)
        const search_element = clone.querySelector(".search-element")
        search_element.style.animationDuration = (0.5 + (index * 0.2)) < 2.5 ? 0.5 + (index * 0.2) + "s" : "2.5s"
        search_element.onclick = function () {
            location.href = "./chart.html?id=" + element.id
        }

        const search_rate_circle = clone.querySelector(".rate-circle")
        const rate_percent = parseInt((element.rating / 2500) * 100)
        search_rate_circle.textContent = element.rating
        search_rate_circle.style.backgroundImage = "radial-gradient(#101519 60%, transparent 61%), conic-gradient(#45a9ad 0% " + rate_percent + "%, #44474a " + rate_percent + "% 100%)"

        const rate_value = clone.querySelector(".rate-circle-animation")
        rate_value.textContent = element.rating

        const search_title = clone.querySelector(".search-element-title")
        search_title.textContent = element.metatitle || element.title || element.fullname

        const search_subtitle = clone.querySelector(".search-element-subtitle")
        search_subtitle.textContent = element.fullname

        const search_tag = clone.querySelector(".search-element-tags")
        if (element.tags) {
            element.tags = element.tags.map(function (element_tag) {
                return "<a href='./search.html?page=1&show=10&&tag=" + element_tag + "&rate_min=0&rate_max=2500'>" + element_tag + "</a>";
            })
            search_tag.innerHTML = element.tags.join(" , ")
        }
        const search_author = clone.querySelector(".search-element-author")
        search_author.textContent = element.created_by_unix
        search_author.href = "./search.html?page=1&show=10&author=" + element.created_by_unix + "&rate_min=0&rate_max=2500"

        const search_created_date = clone.querySelector(".search-element-created-date")
        search_created_date.textContent = element.created_at

        search_list.appendChild(clone)
    }

    const bg_h = list.length * 256 + 186 > window.innerHeight ? list.length * 256 + 186 : window.innerHeight
    document.documentElement.style.setProperty('--bg_h', bg_h + "px")

    if (list.length == 0) {
        if (params.get("page") == "1") {
            searchMessage(0)
        }
        else {
            searchMessage(1)
        }
    }
}

function searchNextPrevInit() {
    if (params.has("hit_num")) {
        searchNextPrevDraw(params.get("hit_num"))
    }
    else {
        searchHitNum()
    }
}

function searchNextPrevDraw(hitNum) {
    document.getElementById("hit-search-num").textContent = hitNum + " results"

    document.getElementById("search-list-control").classList.remove("search-list-control-hidden")
    const nowShowNum = hitNum - (Number(params.get("show")) * Number(params.get("page")))
    if (nowShowNum <= 0) {
        document.getElementById("search-list-next").classList.add("search-list-control-btn-lock")
        document.getElementById("search-list-next").classList.remove("center-eff-btn")
        document.getElementById("search-list-next").onclick = ""
    }
    else {
        document.getElementById("search-list-next").classList.remove("search-list-control-btn-lock")
        document.getElementById("search-list-next").classList.add("center-eff-btn")
        document.getElementById("search-list-next").onclick = function () {
            location.href = "./search.html?page=" + (Number(params.get("page")) + 1)
                + "&show=" + params.get("show")
                + (params.get("title") ? "&title=" + params.get("title") : "")
                + (params.get("tag") ? "&tag=" + params.get("tag") : "")
                + (params.get("author") ? "&author=" + params.get("author") : "")
                + (params.get("rate_min") ? "&rate_min=" + params.get("rate_min") : "")
                + (params.get("rate_max") ? "&rate_max=" + params.get("rate_max") : "")
                + (params.get("date_from") ? "&date_from=" + params.get("date_from") : "")
                + (params.get("date_to") ? "&date_to=" + params.get("date_to") : "")
                + "&hit_num=" + hitNum
        }
    }

    if (params.get("page") == "1") {
        document.getElementById("search-list-prev").classList.add("search-list-control-btn-lock")
        document.getElementById("search-list-prev").classList.remove("center-eff-btn")
        document.getElementById("search-list-prev").onclick = ""
    }
    else {
        document.getElementById("search-list-prev").classList.remove("search-list-control-btn-lock")
        document.getElementById("search-list-prev").classList.add("center-eff-btn")
        document.getElementById("search-list-prev").onclick = function () {
            location.href = "./search.html?page=" + (Number(params.get("page")) - 1)
                + "&show=" + params.get("show")
                + (params.get("title") ? "&title=" + params.get("title") : "")
                + (params.get("tag") ? "&tag=" + params.get("tag") : "")
                + (params.get("author") ? "&author=" + params.get("author") : "")
                + (params.get("rate_min") ? "&rate_min=" + params.get("rate_min") : "")
                + (params.get("rate_max") ? "&rate_max=" + params.get("rate_max") : "")
                + (params.get("date_from") ? "&date_from=" + params.get("date_from") : "")
                + (params.get("date_to") ? "&date_to=" + params.get("date_to") : "")
                + "&hit_num=" + hitNum
        }
    }
    paginationInit(Number(params.get("page")), Number(hitNum));
}

function searchHitNum() {
    const req_url = "https://ayameapidev.yukkuriikouze.com/search/complex_count"
        + createRequestParameter()

    const xhr = new XMLHttpRequest()

    xhr.open('GET', req_url, true)
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function () {
        if (xhr.status == 200) {
            history.replaceState(null, document.title, location.href + "&hit_num=" + xhr.response);
            searchNextPrevDraw(xhr.response)
        }
        else {
            searchMessage(2)
        }
    }
    xhr.send()
}

function searchBoxInit() {
    document.getElementsByName("search")[0].value = params.get("title")
    document.getElementsByName("tag")[0].value = params.get("tag")
    document.getElementsByName("author")[0].value = params.get("author")
    document.getElementById("input-range-min").value = params.get("rate_min")
    document.getElementById("input-range-max").value = params.get("rate_max")

    let initDate = ""
    if (params.get("date_from")) {
        initDate += params.get("date_from")
        if (params.get("date_to")) {
            initDate += " to " + params.get("date_to")
        }
    }
    document.getElementById("flatpickr").value = initDate

    sub_search_tab()
    mr_min_max_draw()
}

function searchGet() {
    searchListClear()

    const req_url = "https://ayameapidev.yukkuriikouze.com/search/complex"
        + createRequestParameter()

    const xhr = new XMLHttpRequest()

    xhr.open('GET', req_url, true)
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function () {
        if (xhr.status == 200) {
            ResponseData = JSON.parse(xhr.response)
            searchListDraw(ResponseData)
        }
        else {
            searchMessage(2)
        }
    }
    xhr.send()
}

function createRequestParameter() {
    const form = document.getElementById("search_area");
    const fd = new FormData(form)

    const separatorString = /\s+/;
    const _tags = fd.get("tag").split(separatorString)
    let send_tags = ""
    for (const tag of _tags) {
        send_tags += "&tags=" + encodeURIComponent(tag)
    }

    fd.append("show", params.get("show"))
    fd.append("page", params.get("page"))

    const fd_date = fd.get("date").length ? fd.get("date").split(" to ") : []

    const req_url = "?page=" + fd.get("page")
        + "&show=" + fd.get("show")
        + (fd.get("search").length ? "&title=" + encodeURIComponent(search_title_convert(fd.get("search"))) : "")
        + (send_tags.length ? send_tags : "")
        + (fd.get("author").length ? "&author=" + encodeURIComponent(fd.get("author")) : "")
        + (fd.get("rate-min").length ? "&rate_min=" + fd.get("rate-min") : "")
        + (fd.get("rate-max").length ? "&rate_max=" + fd.get("rate-max") : "")
        + (fd_date.length >= 1 ? "&date_from=" + fd_date[0] : "")
        + (fd_date.length >= 2 ? "&date_to=" + fd_date[1] : "")

    return req_url
}

function search_title_convert(title) {
    return title.replace(/^(https?:\/\/)?scp-jp.wikidot.com\//g, "")
}

window.addEventListener('load', () => {
    searchBoxInit()
    searchGet()
    searchNextPrevInit()
})

window.addEventListener("hashchange", () => {
    searchGet()
})
