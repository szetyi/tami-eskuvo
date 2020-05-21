$(document).ready(function() {

    // ------------------------------
    // Árajánlat form felfedő gomb
    // Ha jelenleg nem látható a form, akkor lecsúszik, ha már lent van, akkor felcsúszik.
    // ------------------------------
    $("#reveal-arajanlat").click(function(e){
        e.preventDefault();
        if($("#arajanlat-form").first().is(":hidden")) {
            $("#arajanlat-form").slideDown("slow");
        } else {
            $("#arajanlat-form").slideUp("slow");
        }
    });


    // ------------------------------
    // Dekor és grafika galéria felfedő gombok
    // ------------------------------

    // 0 = semmi
    // 1 = dekoracio
    // 2 = grafika
    let currently_open_gallery = 0;

    // Dekoráció galéria felfedő gomb
    $("#dekoracio-button").click(function(e){
        e.preventDefault();

        // Ha a dekor galéria be van zárva
        if( $("#dekoracio-gallery").first().is(":hidden") 
            && currently_open_gallery != 1
        ) {
            // Ha a másik meg van nyitva, először be kell csukni, majd ezt kinyitni
            if(currently_open_gallery == 2) {
                $("#grafika-gallery .gallery .gallery-left").hide();
                $("#grafika-gallery .gallery .gallery-right").hide();
                $("#grafika-gallery").slideUp("slow", function(){
                    $("#dekoracio-gallery").slideDown("slow", function(){
                        $("#dekoracio-gallery .gallery .gallery-left").show();
                        $("#dekoracio-gallery .gallery .gallery-right").show();
                    });
                });
            // Egyébként csak kinyitjuk
            } else {
                $("#dekoracio-gallery").slideDown("slow", function(){
                    $("#dekoracio-gallery .gallery .gallery-left").show();
                    $("#dekoracio-gallery .gallery .gallery-right").show();
                });
            }
            // Kinyitottuk.
            currently_open_gallery = 1;
        // Egyébként csukjuk be
        } else {
            $("#dekoracio-gallery .gallery .gallery-left").hide();
            $("#dekoracio-gallery .gallery .gallery-right").hide();
            $("#dekoracio-gallery").slideUp("slow");
            currently_open_gallery = 0;
        }

    });

    // Grafika galéria felfedő gomb
    $("#grafika-button").click(function(e){
        e.preventDefault();

        // Ha a grafika galéria be van zárva
        if( $("#grafika-gallery").first().is(":hidden") 
            && currently_open_gallery != 2
        ) {
            // Ha a másik meg van nyitva, először be kell csukni, majd ezt kinyitni
            if(currently_open_gallery == 1) {
                $("#dekoracio-gallery .gallery .gallery-left").hide();
                $("#dekoracio-gallery .gallery .gallery-right").hide();
                $("#dekoracio-gallery").slideUp("slow", function(){
                    $("#grafika-gallery").slideDown("slow", function(){
                        $("#grafika-gallery .gallery .gallery-left").show();
                        $("#grafika-gallery .gallery .gallery-right").show();
                    });
                });
            // Egyébként csak kinyitjuk
            } else {
                $("#grafika-gallery").slideDown("slow", function(){
                    $("#grafika-gallery .gallery .gallery-left").show();
                    $("#grafika-gallery .gallery .gallery-right").show();
                });
            }
            // Kinyitottuk.
            currently_open_gallery = 2;
        // Egyébként csukjuk be
        } else {
            $("#grafika-gallery .gallery .gallery-left").hide();
            $("#grafika-gallery .gallery .gallery-right").hide();
            $("#grafika-gallery").slideUp("slow");
            currently_open_gallery = 0;
        }

    });    


});