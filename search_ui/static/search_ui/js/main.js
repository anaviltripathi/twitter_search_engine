$(function() {
    $('#post-form').submit(function(event){
        event.preventDefault();
        console.log("form submitted!")  // sanity check
//        var $form = $(this), term = $form.find("input[name='search_field']").val(), url = $form.attr("action");
//        var posting = $.post( url, {search_field: term} );
//
//        posting.done(function( data ){
//            alert( data.result);
//            $('#post-form').html(data.result)
//            var content = $( data ).find("*");
//            $( "#result").empty().append( content);
//        });

        var c = true
        $.post('/search_ui/', $(this).serialize(), function(data){
            var j_obj = JSON.parse(data)
            filter_and_show(j_obj.result)
            //$('.message').html(JSON.stringify(j_obj.result.docs))
            //return result
        });
        //create_post();
    });

    function filter_and_show(result){

        $("#all_result").html(JSON.stringify(result))
        $('#search_count').html("total results found are " + JSON.stringify(result.docs.length))
        for (var i=0; i<result.docs.length;i++) {
            $("a[target=user"+i+"]").html("Tweeted by:"+result.docs[i]["user.name"])
            $("#search"+i+"_snippet").html(JSON.stringify(result.docs[i].text))
        }

    }

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
    $('#container').highcharts({
        chart: {
        type: 'bar'
        },
        title: {
        text: 'Monthly Sales'
        },
        xAxis: {
        categories: ['Jan', 'Feb', 'Mar','Apr']
        },
        yAxis: {
        title: {
        text: 'numbers'
        }
        },
        series: [{
        name: 'John',
        data: [1, 0, 4]
        }, {
        name: 'King',
        data: [5, 7, 3]
        }]
    });

    $.getJSON("{% url 'bar' %}", function(data) {
            $('#container').highcharts(data);
        });

    // AJAX for posting
    function create_post() {
        console.log("create post is working!") // sanity check
        $("post-form").load({

        })
//        $.ajax({
//            url : "/search_ui/", // the endpoint
//            type : "POST", // http method
//            data : { the_post : $('#post-text').val() }, // data sent with the post request
//
//            // handle a successful response
//            success : function(json) {
//                $('#post-text').val(''); // remove the value from the input
//                console.log(json); // log the returned json to the console
//                $("#talk").prepend("<li><strong>"+json.text+"</strong> - <em> "+json.author+"</em> - <span> "+json.created+"</span></li>")
//                console.log("success"); // another sanity check
//            },
//
//            // handle a non-successful response
//            error : function(xhr,errmsg,err) {
//                $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
//                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
//                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
//            }
//        });
    };

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
    console.log("third page started working form submitted!")

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url : "display_tweet/",
        data : JSON.stringify({ x: "1", y: "2" , z: "3" }),
        dataType: "json",
        complete: function() {
          //called when complete
          console.log('process complete');
          window.location.replace('display_tweet/')
          },

        success: function(data) {
          console.log(data);
          console.log('process sucess');
         },

        error: function() {
          console.log('process error');
        },
    });

});



