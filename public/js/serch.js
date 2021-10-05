
new Picker(document.querySelector('.picker-from'), {
    controls: true,
    format: 'YYYY-MM-DD',
    headers: true
});

new Picker(document.querySelector('.picker-to'), {
    controls: true,
    format: 'YYYY-MM-DD',
    headers: true
});

function search_api(){
    const form = document.getElementById("search_area");

    const fd = new FormData(form)

    var xhr = new XMLHttpRequest()
    xhr.open('GET', "https://ayameapidev.yukkuriikouze.com/search/complex?page=1&show=10", true)

    xhr.onload = function () {
        if(xhr.status == 200){
            ResponseData = JSON.parse(xhr.response)
            console.log(ResponseData)
        }
    }
    xhr.send(fd)
}

document.getElementById("search-btn").addEventListener("click", search_api, false)