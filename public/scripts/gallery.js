$(document).ready(function() {


    $("#zoomed").hide()
    $("#zoomed").animate({"opacity" : 0});

    let gallery_name = window.location.search.slice(1,100)

    $.getJSON(("../gallery/eskuvok/" + gallery_name + "/leiras.json"), function(json){
        
        {
            let img = new Image();
            img.src = '../gallery/eskuvok/' + gallery_name + '/img/' + json.thumbnail + '.jpg';
            $("#thumbnail").append(img); 
        }

        for (let i = 0; i < json.col_1.length; i++) {
            let img = new Image();
            img.src = '../gallery/eskuvok/' + gallery_name + '/img/' + json.col_1[i] + '.jpg';
            $("#col-1").append(img);
        }
        
        for (let i = 0; i < json.col_2.length; i++) {
            let img = new Image();
            img.src = '../gallery/eskuvok/' + gallery_name + '/img/' + json.col_2[i] + '.jpg';
            $("#col-2").append(img);
        }
        
        for (let i = 0; i < json.col_3.length; i++) {
            let img = new Image();
            img.src = '../gallery/eskuvok/' + gallery_name + '/img/' + json.col_3[i] + '.jpg';
            $("#col-3").append(img);
        }

        $("#description h1").text(json.title);
        $("#description p").text(json.description);

        $("#rows > div > img, #thumbnail > img").click(function(){
            let src = $(this).prop("src");

            // console.log(src);

            $("#zoomed-img").prop({"src" : src})

            $("#zoomed").css({ "display" : "flex" });
            $("#zoomed").animate({"opacity" : 1});
        });

        $("#zoomed-x, #zoomed").click(function(){
            $("#zoomed").animate({"opacity" : 0}, function(){
                $("#zoomed").css({ "display" : "none" });
            }).children().click(function(e){
                return false;
            });
        });

    });


});