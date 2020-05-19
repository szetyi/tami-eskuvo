$(document).ready(function() {

    // Navigáció scroll effect
    $(".scrolling-link").click(function(e) {
        e.preventDefault();
  
        $("html, body").animate({
            scrollTop: $(`${this.getAttribute("href")}`).offset().top
        }, 1000);
    });

    //Árajánlat form felfedő gomb
    $("#reveal-arajanlat").click(function(e){
        e.preventDefault();

        if($("#arajanlat-form").first().is(":hidden")) {
            $("#arajanlat-form").slideDown("slow");
        } else {
            $("#arajanlat-form").slideUp("slow");
        }

    });

    // MOBILON MÁS GALÉRIA ELRENDEZÉS!
    changeGalleries();
    window.onresize = function() {changeGalleries();};

    function changeGalleries() {
        if (window.matchMedia('(max-width: 600px)').matches) {
            $("#dekoracio-gallery").detach().insertAfter("#dekoracio-card");
            $("#grafika-gallery").detach().insertAfter("#grafika-card");
        } else {
            $("#dekoracio-gallery").detach().insertAfter("#szolgaltatasok-cards");
            $("#grafika-gallery").detach().insertAfter("#szolgaltatasok-cards");
        }
    }

    // DEKOR GALÉRIA GOMBOK
    $("#dekoracio-gallery .gallery .gallery-left").click(function(e){
        e.preventDefault();
        console.log("Dekor left");
    });

    $("#dekoracio-gallery .gallery .gallery-right").click(function(e){
        e.preventDefault();
        console.log("Dekor right");
    });

    // GRAFIKA GALÉRIA TEMP

    let grafika_gallery = [
        "./gallery/grafika/meghivo.jpg",
        "./gallery/grafika/arany.jpg",
        "./gallery/grafika/meghivo_2.jpg",
        "./gallery/grafika/fotofal.jpg",
        "./gallery/grafika/meghivo_3.jpg",
        "./gallery/grafika/koszono.jpg",
        "./gallery/grafika/meghivo_4.jpg",
        "./gallery/grafika/udvozlo.jpg"
    ]
    let current_grafika_gallery = 0;
    let current_grafika_frame = 2;
    
    updateGrafikaGallery(current_grafika_gallery, 'init');

    function updateGrafikaGallery(current, direction) {
        
        if(direction == 'init') {
            $("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame).css({"background-image" : ("url(" + grafika_gallery[current] +")")});
        } else if(direction == 'left') {

        } else if (direction == 'right') {

        } else {
            console.error("No direction provided at " + updateGrafikaGallery);
        }
    }


    // GRAFIKA GALÉRIA GOMBOK
    $("#grafika-gallery .gallery .gallery-left").click(function(e){
        e.preventDefault();
        if(current_grafika_gallery == 0) {
            console.log("Nothing left");
        } else {
            updateGrafikaGallery(--current_grafika_gallery, 'left');
        }
        // console.log("Grafika left, current: " + current_grafika_gallery);
    });

    $("#grafika-gallery .gallery .gallery-right").click(function(e){
        e.preventDefault();
        if(current_grafika_gallery == grafika_gallery.length - 1) {
            console.log("Nothing right");            
        } else {
            updateGrafikaGallery(++current_grafika_gallery, 'right');
        }
        // console.log("Grafika right, current: " + current_grafika_gallery);
    });

    // 0 = semmi
    // 1 = dekoracio
    // 2 = grafika
    let currently_open_gallery = 0;

    // $("#dekoracio-gallery .gallery .gallery-left")
    // $("#dekoracio-gallery .gallery .gallery-right")
    // $("#grafika-gallery .gallery .gallery-left")
    // $("#grafika-gallery .gallery .gallery-right")

    //Dekoráció galéria felfedő gomb
    $("#dekoracio-button").click(function(e){
        e.preventDefault();

        // Ha a dekor galéria be van zárva
        if( $("#dekoracio-gallery").first().is(":hidden") 
            && currently_open_gallery != 1
        ) {
            //Ha a másik meg van nyitva, először be kell csukni, majd ezt kinyitni
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

    //Grafika galéria felfedő gomb
    $("#grafika-button").click(function(e){
        e.preventDefault();

        // Ha a grafika galéria be van zárva
        if( $("#grafika-gallery").first().is(":hidden") 
            && currently_open_gallery != 2
        ) {
            //Ha a másik meg van nyitva, először be kell csukni, majd ezt kinyitni
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


    //Főkép váltó

    // __VÁLTOZTATHATÓ__ Az images-be kell belerakni a képek elérési útvonalát.
    let fo_images = [
        "/img/cover/fooldal_01.jpg",
        "/img/cover/fooldal_02.jpg",
        "/img/cover/fooldal_03.jpg",
        "/img/cover/fooldal_04.jpg",
        "/img/cover/fooldal_05.jpg",
        "/img/cover/fooldal_06.jpg"
    ];
    // __VÁLTOZTATHATÓ__ Az időintervallum millisecundumban
    let delay = 5000;
    // __VÁLTOZTATHATÓ__ Animációsebesség
    let change_speed = 333;

    let cover1 = 0;
    let cover2 = 1;

    let current = 1;
    
    $("#cover1").css({"background-image" : ("url(" + fo_images[cover1] +")")});
    $("#cover2").css({"background-image" : ("url(" + fo_images[cover2] +")")});

    setInterval( () => {

        if(current == 1) {
            $("#cover1").animate({opacity : 0}, change_speed);
            $("#cover2").animate({opacity : 1}, change_speed);
            cover1 += 2;
            current = 2;
        } else {
            $("#cover2").animate({opacity : 0}, change_speed);
            $("#cover1").animate({opacity : 1}, change_speed);
            cover2 += 2;
            current = 1;
        }

        if(cover1 >= fo_images.length) {
            cover1 = cover1 - fo_images.length;
        }

        if(cover2 >= fo_images.length) {
            cover2 = cover2 - fo_images.length;
        }

        setTimeout(function(){
            $("#cover1").css({"background-image" : ("url(" + fo_images[cover1] +")")});
            $("#cover2").css({"background-image" : ("url(" + fo_images[cover2] +")")});
        },change_speed);

    }, delay);


    // VISSZAJELZÉSEK VÁLTÓ
    // __VÁLTOZTATHATÓ__ A kép-leírás párok
    let vj_images = [
        {
            img : "img/cover/visszajel_01.jpg",
            desc : "Nagyon jó vót Nagyon jó vót Nagyon jó vót Nagyon jó vót Nagyon jó vót Nagyon jó vót Nagyon jó vót "
        },
        {
            img : "img/cover/visszajel_02.jpg",
            desc : "Fasza volt Fasza volt Fasza volt Fasza volt Fasza volt Fasza volt Fasza volt Fasza volt Fasza volt Fasza volt Fasza volt Fasza volt Fasza volt Fasza volt Fasza volt "
        },
        {
            img : "img/cover/visszajel_03.jpg",
            desc : "Ez aztán király lett Ez aztán király lett Ez aztán király lett Ez aztán király lett Ez aztán király lett Ez aztán király lett Ez aztán király lett Ez aztán király lett Ez aztán király lett Ez aztán király lett "
        },
        {
            img : "img/cover/visszajel_04.jpg",
            desc : "Tényleg nagyon jó volt Tényleg nagyon jó volt Tényleg nagyon jó volt Tényleg nagyon jó volt Tényleg nagyon jó volt Tényleg nagyon jó volt Tényleg nagyon jó volt Tényleg nagyon jó volt "
        },
        {
            img : "img/cover/visszajel_05.jpg",
            desc : "Kösz má he Kösz má he Kösz má he Kösz má he Kösz má he Kösz má he Kösz má he Kösz má he Kösz má he Kösz má he Kösz má he Kösz má he Kösz má he "
        },
        {
            img : "img/cover/visszajel_06.jpg",
            desc : "Váó, mekkora király vagy! Váó, mekkora király vagy! Váó, mekkora király vagy! Váó, mekkora király vagy! Váó, mekkora király vagy! Váó, mekkora király vagy! Váó, mekkora király vagy! "
        },
    ];

    
    // __VÁLTOZTATHATÓ__ Az időintervallum millisecundumban
    let vj_delay = 5000;
    // __VÁLTOZTATHATÓ__ Animációsebesség
    let vj_change_speed = 333;

    let vj_cover1 = 0;
    let vj_cover2 = 1;

    let vj_current = 1;

    let vj_current_text = 1;
    
    $("#vj-cover1").css({"background-image" : ("url(" + vj_images[vj_cover1].img +")")});
    $("#vj-cover2").css({"background-image" : ("url(" + vj_images[vj_cover2].img +")")});
    $("#visszajelzesek-idezet").text(vj_images[0].desc); 

    setInterval( () => {

        if(vj_current == 1) {
            $("#vj-cover1").animate({opacity : 0}, vj_change_speed);
            $("#vj-cover2").animate({opacity : 1}, vj_change_speed);
            vj_cover1 += 2;
            vj_current = 2;
        } else {
            $("#vj-cover2").animate({opacity : 0}, vj_change_speed);
            $("#vj-cover1").animate({opacity : 1}, vj_change_speed);
            vj_cover2 += 2;
            vj_current = 1;
        }

        if(vj_cover1 >= fo_images.length) {
            vj_cover1 = vj_cover1 - fo_images.length;
        }

        if(vj_cover2 >= fo_images.length) {
            vj_cover2 = vj_cover2 - fo_images.length;
        }

        setTimeout(function(){
            $("#vj-cover1").css({"background-image" : ("url(" + vj_images[vj_cover1].img +")")});
            $("#vj-cover2").css({"background-image" : ("url(" + vj_images[vj_cover2].img +")")});
        },change_speed);

        
        $("#visszajelzesek-idezet").text(vj_images[vj_current_text].desc); 
        vj_current_text += 1;
        if(vj_current_text == vj_images.length) {
            vj_current_text = vj_current_text - vj_images.length;
        }

    }, vj_delay);

});