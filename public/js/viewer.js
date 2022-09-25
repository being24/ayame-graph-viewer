const params = (new URL(document.location)).searchParams

let rateChart
let ratedata

function datePreview(date_from,date_to) {
    const from_y = date_from.getFullYear()
    const from_m = date_from.getMonth()+1
    const from_d = date_from.getDate()

    const to_y = date_to.getFullYear()
    const to_m = date_to.getMonth()+1
    const to_d = date_to.getDate()

    document.getElementById("flatpickr").value = from_y + "-" + from_m + "-" + from_d + " to " + to_y + "-" + to_m + "-" + to_d
}

function rateDataTo(date_from=false,date_to=false){
    let rate_data = ratedata.map(function(item){
        return item.rating
    })
    let label_data = ratedata.map(function(item){
        return item.date
    })
    rate_data.reverse()
    label_data.reverse()

    if(!date_from){
        date_from = new Date(label_data[0])
    }
    else{
        date_from = new Date(date_from)
    }

    if(!date_to){ 
        date_to = new Date()
    }
    else{
        date_to = new Date(date_to)
    }

    let from_to_rate_data = []
    let from_to_label_data = []

    for(let label_index=0; label_index < label_data.length; label_index++){
        const tempDate =  new Date(label_data[label_index])
        if(date_from <= tempDate && tempDate <= date_to){
            from_to_rate_data.push(rate_data[label_index])
            from_to_label_data.push(label_data[label_index])
        }
    }
    datePreview(date_from,date_to)
    
    return [from_to_rate_data, from_to_label_data]
}

async function chartDraw(date_from=false,date_to=false){
    if(rateChart){
        rateChart.destroy()
    }
    let from_to_data = await rateDataTo(date_from, date_to)

    const data = {
        labels: from_to_data[1],
        datasets: [{
            backgroundColor: '#45a9ad',
            borderColor: '#45a9ad',
            fontColor: '#FFF',
            data: from_to_data[0],
        }]
    }

    rateChart = new Chart( document.getElementById('rateChart'), {
        type: 'line',
        data: data,
        options: {
            plugins:{
                legend: {
                    display: false,
                }
            },
            scales: {
                x: {
                    ticks : {
                        color: '#869ab3'
                    },
                    grid:{
                        color: '#303943',
                        borderDash:[1,1]
                    }
                },
                y: {
                    ticks : {
                        color: '#869ab3'
                    },
                    grid:{
                        color: '#303943',
                        borderDash:[1,1]
                    }
                    
                }
            }
        }
    })
}

function infoDraw(info=false){
    if(info){
        document.getElementById("info-title").textContent = info.metatitle || info.title || info.fullname
        document.getElementById("info-subtitle").textContent = info.fullname

        const info_rate_circle = document.getElementById("rate-circle-percent")
        const rate_percent = parseInt((info.rating / 2000) * 100)
        info_rate_circle.textContent = info.rating
        info_rate_circle.style.backgroundImage = "radial-gradient(#101519 60%, transparent 61%), conic-gradient(#45a9ad 0% " + rate_percent + "%, #44474a " + rate_percent + "% 100%)"

        const info_rate_value = document.getElementById("rate-circle-value")
        info_rate_value.textContent = info.rating
        info_rate_value.style.animationDuration = "2.0s"
        info_rate_value.style.animationName = "rate-circle-animation"

        const info_tag = document.getElementById("info-tags")
        if(info.tags){
            info.tags = info.tags.map(function(info_tag) {
                return "<a href='./search.html?page=1&show=10&&tag=" + info_tag + "&rate_min=0&rate_max=2000'>" + info_tag + "</a>";
            })
            info_tag.innerHTML = info.tags.join(" , ")
        }

        const info_author = document.getElementById("info-author")
        info_author.textContent = info.created_by_unix
        info_author.href = "./search.html?page=1&show=10&author=" + info.created_by_unix + "&rate_min=0&rate_max=2000"

        linkInit(info.fullname,info.created_by_unix)
        
        setTimeout(function(){
            idRateGet()
        },500)   
    }
    else{

    }
}

function idRateGet(){
    const req_url = "https://ayameapidev.yukkuriikouze.com/data/rating?pageid=" + params.get("id")
                    
    const xhr = new XMLHttpRequest()

    xhr.open('GET', req_url, true)
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function () {
        if(xhr.status == 200){
            ResponseData = JSON.parse(xhr.response)
            ratedata = ResponseData
            chartDraw()
        }
        else{
            document.getElementById("chart-info-msg").textContent = "Failed to retrieve data"
        }
    }
    xhr.send()
}

function idDataGet(){
    const req_url = "https://ayameapidev.yukkuriikouze.com/data/pageid?pageid=" + params.get("id")
                    
    const xhr = new XMLHttpRequest()

    xhr.open('GET', req_url, true)
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.onload = function () {
        if(xhr.status == 200){
            ResponseData = JSON.parse(xhr.response)
            infoDraw(ResponseData)
            document.getElementById("chart-info-msg").textContent = ""
        }
        else{
            document.getElementById("chart-info-msg").textContent = "Failed to retrieve data"
        }
    }
    xhr.send()
}

function linkInit(link_id,link_author){
    document.getElementById("info-report-link").href = "http://scp-jp.wikidot.com/" + link_id
    document.getElementById("info-author-link").href = "http://scp-jp.wikidot.com/author:" + link_author   
}

function topBtnInit(){
    const month_btn = Array.from(document.getElementsByClassName("from-to-month"))
    const year_btn = Array.from(document.getElementsByClassName("from-to-year"))
    const all_btn = Array.from(document.getElementsByClassName("from-to-all"))

    month_btn.forEach(function(element) {
        element.addEventListener('click', () => {
            month_btn.forEach(function(target){
                target.classList.add("top-control-btn-active")
            })
            year_btn.forEach(function(target){
                target.classList.remove("top-control-btn-active")
            })
            all_btn.forEach(function(target){
                target.classList.remove("top-control-btn-active")
            })
            const today = new Date()
            chartDraw(today.setMonth(today.getMonth() - 1), new Date())
        })
    })
    year_btn.forEach(function(element) {
        element.addEventListener('click', () => {
            month_btn.forEach(function(target){
                target.classList.remove("top-control-btn-active")
            })
            year_btn.forEach(function(target){
                target.classList.add("top-control-btn-active")
            })
            all_btn.forEach(function(target){
                target.classList.remove("top-control-btn-active")
            })
            const today = new Date()
            chartDraw(today.setMonth(today.getMonth() - 12), new Date())
        })
    })
    all_btn.forEach(function(element) {
        element.addEventListener('click', () => {
            month_btn.forEach(function(target){
                target.classList.remove("top-control-btn-active")
            })
            year_btn.forEach(function(target){
                target.classList.remove("top-control-btn-active")
            })
            all_btn.forEach(function(target){
                target.classList.add("top-control-btn-active")
            })

            chartDraw()
        })
    })

    document.getElementById("flatpickr").addEventListener('change', () => {
        month_btn.forEach(function(element) {
            element.classList.remove("top-control-btn-active")
        })
        year_btn.forEach(function(element) {
            element.classList.remove("top-control-btn-active")
        })
        all_btn.forEach(function(element) {
            element.classList.remove("top-control-btn-active")
        })

        const from_to_input = document.getElementById("flatpickr").value.split(" to ")
        if(from_to_input.length == 2){
            chartDraw(from_to_input[0],from_to_input[1])
        }
        else if(from_to_input.length == 1){
            chartDraw(from_to_input[0])
        }
        else{
            chartDraw()
            all_btn.classList.add("top-control-btn-active")
        }

    })  
}

function windowBarInit(){
    document.getElementById("window-close-btn").addEventListener('click', () => {
        window.history.back()
    })
    document.getElementById("window-min-btn").addEventListener('click', () => {
        document.exitFullscreen()
    })
    document.getElementById("window-max-btn").addEventListener('click', () => {
        document.getElementsByClassName("column")[0].requestFullscreen()
    })
}

window.addEventListener('load', () => {
    idDataGet()
    topBtnInit()
    windowBarInit()
})