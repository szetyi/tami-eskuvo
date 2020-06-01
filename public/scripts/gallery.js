$(document).ready(function() {

    // Kezdetben elrejtük a teljes viewportot befedő 
    // kép-kezelítő elemet.
    $("#zoomed").hide()
    $("#zoomed").animate({"opacity" : 0});

    // A galléria nevét a window.location.search tartalmazza egy extra 
    // "?" karakterrel az elején, ezt levágjuk és eltároljuk.
    let gallery_name = window.location.search.slice(1,100)

    // Betöltjük a galléria leiras.json fájlját.
    // Ez tárolja a főképet, az oszlopok képeit, a címet és a leírást.
    $.getJSON(("../gallery/eskuvok/" + gallery_name + "/leiras.json"), function(json){
        
        // Betöltjük a fő-képet
        {
            let img = new Image();
            img.src = '../gallery/eskuvok/' + gallery_name + '/img/' + json.thumbnail + '.jpg';
            $("#thumbnail").append(img); 
        }

        // feltöltjük képekkel az első oszlopot.
        for (let i = 0; i < json.col_1.length; i++) {
            let img = new Image();
            img.src = '../gallery/eskuvok/' + gallery_name + '/img/' + json.col_1[i] + '.jpg';
            $("#col-1").append(img);
        }
        
        // feltöltjük a második oszlopot.
        for (let i = 0; i < json.col_2.length; i++) {
            let img = new Image();
            img.src = '../gallery/eskuvok/' + gallery_name + '/img/' + json.col_2[i] + '.jpg';
            $("#col-2").append(img);
        }
        
        // feltöltjük a harmadik oszlopot.
        for (let i = 0; i < json.col_3.length; i++) {
            let img = new Image();
            img.src = '../gallery/eskuvok/' + gallery_name + '/img/' + json.col_3[i] + '.jpg';
            $("#col-3").append(img);
        }

        // frissítjük a placeholder címet és leírást.
        $("#description h1").text(json.title);
        $("#description p").text(json.description);

        // ZOOM FUNCKIÓ
        // Minden oszlop képet és a fő-képet ellátjuk egy click handlerrel.
        $("#rows > div > img, #thumbnail > img").click(function(){

            // eltároljuk annak a képnek az elérési útját, amelyre kattintottunk.
            let src = $(this).prop("src");

            // Betöltjük a zoomolt képnek az imént elmentett elérési utat
            $("#zoomed-img").prop({"src" : src})

            // Láthatóvá és kattinthatóvá tesszük a zoom overlayt.
            $("#zoomed").css({ "display" : "flex" });
            $("#zoomed").animate({"opacity" : 1});
        });

        // A zoom overlay bezárásához az x-re vagy a kép mellé kell kattintani.
        $("#zoomed-x, #zoomed").click(function(){
            // Elhalványítjuk, majd teljesen elrejtjük az ovelayt.
            $("#zoomed").animate({"opacity" : 0}, function(){
                $("#zoomed").css({ "display" : "none" });
            // A zoom-overlay gyermekét( a képet ) nem vesszük figyelembe kattintáskor.
            }).children().click(function(e){
                return false;
            });
        });

    });


});