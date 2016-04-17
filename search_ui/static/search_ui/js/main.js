$(function() {
    $('#post-form').submit(function(event){
        event.preventDefault();
        console.log("form submitted!")
        $.post('/search_ui/', $(this).serialize(), function(data){
            var j_obj = JSON.parse(data)
            filter_and_show(j_obj.result)

            //return result
        });
    });


    function filter_and_show(result){
        //$("#all_result").html(JSON.stringify(result))
        $('#search_count').html("Total results found are " + JSON.stringify(result.docs.length))
        link_count=result.docs.length/7 -1;
        clear_previous_search();
        create_links(link_count, result)
        for (var i=0; i<result.docs.length && i<8;i++) {
            $("a[target=user"+i+"]").html("Tweeted by:"+result.docs[i]["user.name"]);
            $("a[target=user"+i+"]").data("tweet_id",{id:result.docs[i].id});
            $("a[target=user"+i+"]").attr("href","display_tweet/?q="+result.docs[i].id);
            $("a[target=link_user"+i+"]").html("tweet_link: display_tweet/"+result.docs[i].id);
            $("a[target=link_user"+i+"]").attr("href","display_tweet/?q="+result.docs[i].id);
            $("#search"+i+"_snippet").html(JSON.stringify(result.docs[i].text[0]));

        }

        show_trend_chart(result.hashtag_trends, '#hashtag_container', "Hashtag Trends");
        show_recommendations(result.recommendations);
        show_sentiment_trend_chart(result.location_trends, "#location_container", "Location Trends", result.docs);
    }

    function filter_docs(docs, filter_param, param_value){
//        console.log(docs)
        var filtered_docs = [];
        for(var doc in docs){
//            console.log(docs[doc])
//            console.log(Object.keys(docs[doc]))
            if(filter_param in docs[doc]  && docs[doc][filter_param] == param_value)
            {
                console.log("Waah mere sher")
                filtered_docs.push(docs[doc]);
            }
        }

        console.log(filtered_docs);

        $('#search_count').html("Total results found are " + JSON.stringify(filtered_docs.length))
        link_count=filtered_docs.length/7 -1;
        clear_previous_search();
//        create_links(link_count, result)
        for (var i=0; i<filtered_docs.length && i<8;i++) {
            console.log(filtered_docs[i])
            $("a[target=user"+i+"]").html("Tweeted by:"+filtered_docs[i]["user.name"]);
            $("a[target=user"+i+"]").data("tweet_id",{id:filtered_docs[i].id});
            $("a[target=user"+i+"]").attr("href","display_tweet/?q="+filtered_docs[i].id);
            $("a[target=link_user"+i+"]").html("tweet_link: display_tweet/"+filtered_docs[i].id);
            $("a[target=link_user"+i+"]").attr("href","display_tweet/?q="+filtered_docs[i].id);
            $("#search"+i+"_snippet").html(JSON.stringify(filtered_docs[i].text[0]));

        }

//        return(filtered_docs)

    }

    function show_sentiment_trend_chart(trends, div, chart_title, docs){
        console.log("Showing Sentiments")
        var attr_list = Object.keys(trends);
        locations = trends['locs']
        pos = trends['pos']
        neg = trends['neg']
//        console.log(trends)
//        console.log(locations)
//        console.log(pos)
//        console.log(neg)


        $(div).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: chart_title
            },
            xAxis: {
                categories: locations
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Numbers'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        }
                    }
                },

                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                filter_docs(docs, 'user.time_zone', this.category)
                            }
                        }
                    }
                }
            },

            series: [{
                name: 'Positive',
                data: pos
            }, {
                name: 'Negative',
                data: neg
            }]
        });
    }

    window.DoPost = function(content_id){
//         console.log("Coming here");
         var reco=$(content_id).text()
         $.post('/search_ui/',{search_field: reco}, function(data){
            var j_obj = JSON.parse(data)
            filter_and_show(j_obj.result)
        });


    }

    function show_recommendations(recommendations){
        $("#recommendations").html("You might also be interested in: ")
//        console.log(recommendations);
        var i = 0;
        for (var key in recommendations){
            i++;
            $("#recommendation"+i).html(key)
            $("#recommendation"+i).data('key',{key:key})
        }

    }

    function show_trend_chart(trends, div, name){
        var attr_list = Object.keys(trends);
        var val_list = [];
//        console.log(trends);
//        console.log(attr_list);
        for(var key in trends){
//            console.log(key);
            val_list.push(trends[key]);
        }

//        console.log(val_list);

        $(div).highcharts({
            chart: {
            type: 'column'
            },
            title: {
            text: name
            },
            xAxis: {
            categories: Object.keys(trends)
            },
            yAxis: {
            title: {
            text: 'numbers'
            }
            },
            series: [{
            name: 'Number of Users ',
            data: val_list
            },]
        });

    }

    function clear_previous_search(){
        var search=8;
        for (var i=0; i<search;i++) {
            $("a[target=user"+i+"]").html("");
            $("a[target=user"+i+"]").data("");
            $("a[target=link_user"+i+"]").html("");
            $("a[target=link_user"+i+"]").attr("");
            $("#search"+i+"_snippet").html("");
        }
    }

    function clear_previous_link(){
        $("#link_generation").html("");
    }

    function create_links(link_count, result){
        clear_previous_link();
        if (link_count==0) return;
        console.log("i am trying to create links");
        $('#link_generation').append("<span><b>Next search: </b></span>");
        for(var i=0; i<link_count;i++){
            var mydiv = document.getElementById("link_generation");
            var aTag = document.createElement('a');
            aTag.id="link_data"+i;
            aTag.setAttribute('href',"http://google.com");
            aTag.setAttribute("class", "next_search");
            aTag.innerHTML = (i+1) + " ";
            mydiv.appendChild(aTag);
        }


        for(var i=0; i<link_count;i++){
            $("link_data"+i).data('result',{res:result})
        }
    }

    $("#search_form_id").bind("mouseover",function(){
            $(".search_form").css("background-color","blue");
    });

    $("#search_form_id").bind("mouseout",function(){
            $(".search_form").css("background-color","yellow");
    });


//    $.getJSON("{% url 'bar' %}", function(data) {
//            $('#container').highcharts(data);
//        });

    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $('.third_page').click(function() {
            var tweet_id=$(this).data('tweet_id');
            console.log(tweet_id);
            var url="display_tweet/?q="+tweet_id['id'];
           $("a[target='" + $(this).attr("target")+"']").attr("href",url);
    });


});







