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
            $("#search"+i+"_snippet").html(JSON.stringify(result.docs[i].text));

        }
        show_location_chart(result.location_trends);
        show_recommendations(result.recommendations);


    }

    window.DoPost = function(content_id){
         console.log("Coming here");
         var reco=$(content_id).text()
         $.post("", { search_field: reco} );
         $.post('/search_ui/', $(this).serialize(), function(data){
            var j_obj = JSON.parse(data)
            filter_and_show(j_obj.result)
        });


    }

    function show_recommendations(recommendations){
        $("#recommendations").html("You might also be interested in: ")
        console.log(recommendations);
        var i = 0;
        for (var key in recommendations){
            i++;
            $("#recommendation"+i).html(key)
            $("#recommendation"+i).data('key',{key:key})
        }

    }

    function show_location_chart(location_trends){
        var attr_list = Object.keys(location_trends);
        var val_list = [];
        console.log(location_trends);
        console.log(attr_list);
        for(var key in location_trends){
            console.log(key);
            val_list.push(location_trends[key]);
        }

        console.log(val_list);

        $('#container').highcharts({
            chart: {
            type: 'column'
            },
            title: {
            text: 'Location Trends'
            },
            xAxis: {
            categories: Object.keys(location_trends)
            },
            yAxis: {
            title: {
            text: 'numbers'
            }
            },
            series: [{
            name: 'Number of Users  ',
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


    function change_image() {
        console.log("Working")
        var image = document.getElementById('myImage');
        if (image.src.match("2")) {
            image.src = "pic1.png"
            //image.src = "static/search_ui/images/pic1.png"
        } else {

            image.src = "pic2.png"
            //image.src = "static/search_ui/images/pic2.png"
        }
    }





    $.getJSON("{% url 'bar' %}", function(data) {
            $('#container').highcharts(data);
        });


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







