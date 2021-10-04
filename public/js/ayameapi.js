
function get_id_from_key(mainkey,key){
    console.log("https://ayameapi.yukkuriikouze.com/get_id_from_"+mainkey+"?"+mainkey+"="+encodeURIComponent(key))
    return fetch("https://ayameapi.yukkuriikouze.com/get_id_from_"+mainkey+"?"+mainkey+"="+encodeURIComponent(key), {
        method: "GET",
    })
    .then(response => {
        return response.json();
    })
    .then(json => {
        return json;
    })
    .catch(e => {
        console.error(e);
    });
}
function get_json_from_id(id){
    console.log("https://ayameapi.yukkuriikouze.com/get_latest_data_from_id?_id="+encodeURIComponent(id))
    return fetch("https://ayameapi.yukkuriikouze.com/get_latest_data_from_id?_id="+encodeURIComponent(id), {
        method: "GET",
    })
    .then(response => {
        return response.json();
    })
    .then(json => {
        return json;
    })
    .catch(e => {
        console.error(e);
    });
}

function get_rate_from_id(id,start,stop){
    console.log('https://ayameapi.yukkuriikouze.com/get_rate_from_id_during_the_period?_id='+id+'&start='+start+'&stop='+stop)
    return fetch('https://ayameapi.yukkuriikouze.com/get_rate_from_id_during_the_period?_id='+id+'&start='+start+'&stop='+stop, {
        method: "GET",
    })
    .then(response => {
        return response.json();
    })
    .then(json => {
        return json;
    })
    .catch(e => {
        console.error(e);
    });
}

function get_rate_from_fullname(id,start,stop){
    console.log('https://ayameapi.yukkuriikouze.com/get_rate_from_fullname_during_the_period?fullname='+id+'&start='+start+'&stop='+stop)
    return fetch('https://ayameapi.yukkuriikouze.com/get_rate_from_fullname_during_the_period?fullname='+id+'&start='+start+'&stop='+stop, {
        method: "GET",
    })
    .then(response => {
        return response.json();
    })
    .then(json => {
        return json;
    })
    .catch(e => {
        console.error(e);
    });
}




