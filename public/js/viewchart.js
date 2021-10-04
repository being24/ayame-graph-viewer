var GLOBAL_GRAPH ;
function make_graf(label,data,dates){
    try{
        GLOBAL_GRAPH.destroy();
    }
    catch(e){
        
    }
     // X軸に使う日付
    let labels = dates;
    // Y軸に使う何かしらの数値
    let values = data;

    let config = {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                fill: false,
                lineTension: 0,
                borderColor: 'rgba(0, 0, 255, 0.5)',
                data: values
            }],
        },
        responsive:false,
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MM/DD'
                        }
                    }
                }]
            }
        }
    };
    var canvas = document.getElementById('stage');
    var chart = new Chart(canvas, config);
    GLOBAL_GRAPH =chart;
    return chart;
}




function date_to_str(date){
    return date.getFullYear() + "-" 
        + ( "0" + ( date.getMonth() + 1) ).slice(-2) + "-"
        + ( "0" + ( date.getDate() ) ).slice(-2) ;
}


function wait_get_rate_from_id(key,id,start,stop){
    const waitAsynchronousFunc = (async() => {
        const result = await get_rate_from_id(id,start,stop);
        var datelabels=[];
        var ratedata=[];
        Object.keys(result).forEach(function (key) {
            ratedata.unshift(result[key]["rating"]);
            datelabels.unshift(key);
        });
        console.log(datelabels);
        console.log(ratedata);
        make_graf(key,ratedata,datelabels)
    })();
}



function graph_drawing(mainkey,key){
    const waitAsynchronousFunc = (async() => {
        var start_date = document.getElementById("start_date").value;
        var stop_date = document.getElementById("stop_date").value;
        const pageid = await get_id_from_key(mainkey,key);
        console.log(pageid["id"]);
        wait_get_rate_from_id(key,pageid["id"],start_date,stop_date);
        var json = await get_json_from_id(pageid["id"]);
        console.log(json["tags"]);
        document.getElementById('json-viewer').innerHTML="タグ:"+json["tags"];
    })();
}


jQuery(document).ready(function() {
    var date = new Date();
    document.getElementById("stop_date").value = date_to_str(date) ;
    date.setMonth(date.getMonth() - 6);
    document.getElementById("start_date").value = date_to_str(date);
    moment.locale("ja");
    var queryString = window.location.search;
    var fullname;
    var metatitle;
    if(queryString.indexOf("?fullname=") === 0){
        fullname = queryString.replace("?fullname=","");
        graph_drawing("fullname",decodeURI(fullname));
    }
    if(queryString.indexOf("?metatitle=") === 0){
        metatitle = queryString.replace("?metatitle=","");
        graph_drawing("metatitle",decodeURI(metatitle));
    }
});

