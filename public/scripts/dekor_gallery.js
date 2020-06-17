$(document).ready(function() {

    // Ebbe a tömbbe töltjük be a galéria objektumokat, melyek
    // {
    //     img: "/elérési/út/fájl.jpg",
    //     link: "/gallery?valami-valami",
    //     text: "leírás"
    // }
    // formátumban vannak.
    let dekor_gallery = [];
    
    // HTTP Get requesttel lekérjük a ../gallery/eskuvok/ mappában
    // lévő mappák neveit.
    $.get("/get/dekor/", function(data){

        // A válasz egy mappaneveket tartalmazó tömb
        for (let i = 0; i < data.length; i++) {

            let dirname = data[i];

            // Az egyes mappában lévő leiras.json fájlokat lekérjük,
            // ez tartalmazza az objektumban a thumbnail kép nevét és a leírást.
            $.getJSON(("../gallery/eskuvok/" + dirname + "/leiras.json"))
                .done(function(json){
                        
                    // létrehozzuk az objektumot
                    let gallery_obj = 
                    {
                        img : "../gallery/eskuvok/" + dirname + "/img/" + json.thumbnail + ".jpg",
                        link : "/gallery?" + dirname,
                        text : json.title
                    };
                    
                    // belerakjuk a tömbünkbe.
                    dekor_gallery[i] = gallery_obj;

                });
            
        }
        
        // Ezzel a számlálóval várjuk a tömb feltöltését, 100 ms-onként
        // ellenőrzi, hogy minden galériát betöltöttünk e.
        let wait_for_gallery = setInterval(() => {
        
            // Akkor van kész a Get request, ha a dekor_gallery
            // tömb mérete eléri a válaszként kapott tömb méretét.    
            if(dekor_gallery.length == data.length) {
                // leállítjuk az ellenőrzést, majd futtatjuk a main funkciót.
                clearInterval(wait_for_gallery);
                main();
            }

        }, 100);

    });

    function main(){    

        dekor_gallery.forEach(e => {
            console.log(e.text);
        });
        // console.log(dekor_gallery);     
        
           

        let frame0 = {
            prev : undefined,
            curr : undefined,
            next : undefined
        }
    
        let frame1 = {
            prev : undefined,
            curr : undefined,
            next : undefined
        }

        // Ez a szám adja meg, hogy mennyi a minimum galéria szám, amitől kezdve már kettős galériát
        // szeretnénk használni. 
        let dualGalleryMinimum = 5;

        // Ebben a változóban tároljuk, hogy éppen kettős gallérián vagyunk e, vagy sem.
        let isDualEnabled = false;
        
        // Jelenlegi kép index
        let current_dekor_gallery = 0;

        // Jelenleg látszó frame ( három van belőle, melyek a sima előre-hátra transition-höz kellenek. )
        let current_dekor_frame = 2;

        // Galéria inicializálása
        checkDualDekorGallery(dualGalleryMinimum);
        updateDekorGallery('init');


        // Amikor átméretezzük az ablakot, legyen az asztali, vagy tablet/telefon elforgatás,
        // lefuttatjuk az ellenőrzést.
        window.addEventListener('resize', function(){
            checkDualDekorGallery(dualGalleryMinimum);
        });

        function checkDualDekorGallery(treshold) {

            // Ha elég széles a képernyő, azaz tabletnél nagyobb képernyő vagyunk,
            // akkor lehet két galléria kép egymás mellett. 
            // Azt is vizsgálni kell, hogy mennyi megjelenítendő kép van a galériában,
            // ha kevesebb, mint a megadott érték, akkor felesleges egyszerre többet mutatni.
    
            if (window.matchMedia('(max-width: 992px)').matches) {
    
                // Kicsi képernyő, nem kell a kettőzés.
                // console.log("Screen small, set gallery to single");
                isDualEnabled = false;
                $($("#dekoracio-gallery .gallery .gallery-frame")[1]).hide();

                
            } else {
    
                // Nagy képernyő, nézzük meg, hogy elértük e a minimumot
                
                if( dekor_gallery.length < treshold ) {
                    
                    // Ha alatta vagyunk akkor nem kell kettőzni.
                    // console.log("Gallery not large enough, set gallery to single");
                    isDualEnabled = false;
                    $($("#dekoracio-gallery .gallery .gallery-frame")[1]).hide();
    
                } else {
    
                    // Ha felette vagyunk, akkor kell!
                    // console.log("Set gallery to dual");
                    isDualEnabled = true;
                    $($("#dekoracio-gallery .gallery .gallery-frame")[1]).show();

                }
    
            }
            
    
        }

        function updateDekorGallery(setting) {

            switch (setting) {

                // INICIALIZÁLÁS
                case "init":
                    
                    // Ha kettős galérián inicializálunk, akkor beállítjuk a két linket,
                    // Az első két képet, és az utánuk jövő két képet.
                    if (isDualEnabled) {
                        
                        setHref(0,0);
                        setHref(1,1);

                        setFrame0("curr", 0);
                        setFrameBackground(0,getSubFrame("curr"), frame0.curr);

                        setFrame0("next", 2);
                        setFrameBackground(0,getSubFrame("next"), frame0.next);

                        setFrame1("curr", 1);
                        setFrameBackground(1,getSubFrame("curr"), frame1.curr);

                        setFrame1("next", 3)
                        setFrameBackground(1,getSubFrame("next"), frame1.next);

                    // Ha egyes galérián inicializálunk, akkor csak az első framere kell megcsinálni.
                    } else {
                        
                        setHref(0,0);
                        setFrame0("curr", 0);
                        setFrameBackground(0,getSubFrame("curr"), frame0.curr);
                        setFrame0("next", 1);
                        setFrameBackground(0,getSubFrame("next"), frame0.next);

                    }

                    break;
            
                // VÁLTÁS
                case "change":

                    // Ha kettősről váltunk egyesre:
                    if(isDualEnabled) {
/*
                        // Ha az első képen vagyunk, nincs prev, de van next.
                        if(frame0.curr == 0) {

                            setFrame0("prev", undefined)
                            setFrame0("next", frame0.curr + 1);
                            setFrameBackground(0, getSubFrame("next"), frame0.next);

                        // Ha nem az elsőn állunk, van prev.
                        } else {

                            setFrame0("prev",frame0.curr - 1);
                            setFrameBackground(0,getSubFrame("prev"),frame0.prev);

                            // DE! nem biztos, hogy van next!
                            if(frame0.curr == dekor_gallery.length-1) {

                                setFrame0("next", undefined);

                            } else {

                                setFrame0("next", frame0.curr + 1);
                                setFrameBackground(0,getSubFrame("next"),frame0.next);

                            }

                        }
*/

                        setFrame0("next", frame0.curr + 1);
                        setFrameBackground(0, getSubFrame("next"), frame0.next);
                        setFrame0("prev", frame0.curr - 1);
                        setFrameBackground(0, getSubFrame("prev"), frame0.prev);


                    // Ha egyesről váltunk kettősre:
                    } else {

                        // Attól függően, hogy páros, vagy páratlan a current, mást csinálunk!

                        // Páros
                        if (frame0.curr % 2 == 0) {
                            
                            setFrame1("curr", frame0.next)
                            setFrameBackground(1, getSubFrame("curr"), frame1.curr);

                            setFrame1("prev", frame1.curr - 2);
                            setFrameBackground(1, getSubFrame("prev"), frame1.prev);

                            setFrame1("next", frame1.curr + 2);
                            setFrameBackground(1, getSubFrame("next"), frame1.next);

                            setFrame0("prev", frame0.curr - 2);
                            setFrameBackground(0, getSubFrame("prev"), frame0.prev);

                            setFrame0("next", frame0.curr + 2);
                            setFrameBackground(0, getSubFrame("next"), frame0.next);

                        // Páratlan
                        } else {
                            
                            setFrame1("curr", frame0.curr);
                            setFrameBackground(1, getSubFrame("curr"). frame1.curr);

                            setFrame1("prev", frame1.curr - 2);
                            setFrameBackground(1, getSubFrame("prev"), frame1.prev);

                            setFrame1("next", frame1.curr + 2);
                            setFrameBackground(1, getSubFrame("next"), frame1.next);

                            setFrame0("curr", frame0.prev);
                            setFrameBackground(0, getSubFrame("curr"). frame0.curr);

                            setFrame0("prev", frame0.curr - 2);
                            setFrameBackground(0, getSubFrame("prev"), frame0.prev);

                            setFrame0("next", frame0.curr + 2);
                            setFrameBackground(0, getSubFrame("next"), frame0.next);

                        }

                    }
                    
                    break;
                    
                // JOBBRA
                case "right":

                    if (isDualEnabled) {

                        animateFrame(0, getSubFrame("curr"), 0);
                        animateFrame(0, getSubFrame("next"), 1);
                        
                        animateFrame(1, getSubFrame("curr"), 0);
                        animateFrame(1, getSubFrame("next"), 1);
                        
                        setTimeout(() => {
                            
                            current_dekor_gallery += 2;
                            
                            setFrameBackground(0, getSubFrame("curr"), frame0.curr);
                            setFrame0("curr", frame0.curr + 2);

                            setFrameBackground(0, getSubFrame("prev"), frame0.prev);
                            setFrame0("prev", frame0.curr - 2);

                            setFrameBackground(0, getSubFrame("next"), frame0.next);
                            setFrame0("next", frame0.curr + 2);

                            setFrameBackground(1, getSubFrame("curr"), frame0.curr);
                            setFrame1("curr", frame1.curr + 2);

                            setFrameBackground(1, getSubFrame("prev"), frame1.prev);
                            setFrame1("prev", frame1.curr - 2);

                            setFrameBackground(1, getSubFrame("next"), frame1.next);
                            setFrame1("next", frame1.curr + 2);

                            current_dekor_frame = getSubFrame("next");

                                
                        }, 333);




                    } else {
                        
                    }
                    
                    break;
                    

                // BALRA
                case "left":
                    
                    break;

                // ERROR
                default:
                    console.error("Wrong setting: " + setting + "\nMust be 'init', 'change', 'right' or 'left'.");
                    
                    break;
            }

        }


        function setFrame1(sub, value) {

            if ( (value < 0) || (value > dekor_gallery.length - 1) || isNaN(value) ) {
                value = undefined
            }

        switch (sub) {

            case "prev":
                frame1.prev = value;
                break;
        
            case "curr":
                frame1.curr = value;
                break;
        
            case "next":
                frame1.next = value;
                break;
        
            default:
                break;
        }
    }

        function setFrame0(sub, value) {

                if ( (value < 0) || (value > dekor_gallery.length - 1) || isNaN(value) ) {
                    value = undefined
                }

            switch (sub) {

                case "prev":
                    frame0.prev = value;
                    break;
            
                case "curr":
                    frame0.curr = value;
                    break;
            
                case "next":
                    frame0.next = value;
                    break;
            
                default:
                    break;
            }
        }

        // Visszadja, hogy melyik frame a "prev", "curr", "next" szám értékként.
        function getSubFrame(requested) {

            let result = undefined;

            switch (requested) {
                case "prev":
                    
                    switch (current_dekor_frame) {
                        case 1:
                            result = 3;
                            break;
                    
                        case 2:
                            result = 1;
                            break;
                    
                        case 3:
                            result = 2;
                            break;
                            

                        default:
                            break;
                    }

                    break;
            
                case "curr":
                    
                    switch (current_dekor_frame) {
                        case 1:
                            result = 1;
                            break;
                    
                        case 2:
                            result = 2;
                            break;
                    
                        case 3:
                            result = 3;
                            break;
                            

                        default:
                            break;
                    }

                    break;
            
                case "next":
                    
                    switch (current_dekor_frame) {
                        case 1:
                            result = 2;
                            break;
                    
                        case 2:
                            result = 3;
                            break;
                    
                        case 3:
                            result = 1;
                            break;
                            

                        default:
                            break;
                    }

                    break;
            
                default:

                    console.error("getSubFrame requested not valid: " + requested + "\nMust be 'prev', 'curr' or 'next'");

                    break;
            }

            return result;

        }

        // Beállítja a frame (0 vagy 1) linkjét a value indexre. Ha a value üres, vagy undefined, akkor leveszi a linket.
        function setHref( frame, value ) {

            if ( (value < 0) || (value > dekor_gallery.length - 1) || isNaN(value) ) {
                value = undefined
            }
            if( value == undefined) {
                $($("#dekoracio-gallery .gallery .gallery-frame a")[frame]).removeAttr('href');
            } else {
                $($("#dekoracio-gallery .gallery .gallery-frame a")[frame]).attr({'href' : dekor_gallery[value].link});
            }

        }

        // Beállítja a frame (0 vagy 1) -et üresre, és törli a linket.
        function setFrameBlank(frame) {
            setHref(frame);
            $($(("#dekoracio-gallery .gallery .gallery-frame .frame1"))[frame]).css({"background-image" : ("url(../img/virag_rozsaszin-01.svg)")});
            $($(("#dekoracio-gallery .gallery .gallery-frame .frame2"))[frame]).css({"background-image" : ("url(../img/virag_rozsaszin-01.svg)")});
            $($(("#dekoracio-gallery .gallery .gallery-frame .frame3"))[frame]).css({"background-image" : ("url(../img/virag_rozsaszin-01.svg)")});
        }

        // Beállítja a frame (0 vagy 1) subframe (1, 2 vagy 3) -jét a value index képére.
        function setFrameBackground(frame, subframe, value) {


            // console.log("setFrameBackground:\nframe:" + frame + "\nsubframe: frame" + subframe + "\nvalue: " + value );
            
            if ( (value < 0) || (value > dekor_gallery.length - 1) || isNaN(value) ) {
                value = undefined;
            }
            if(value == undefined ) {
                setFrameBlank(frame);
            } else {
                $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + subframe))[frame]).css({"background-image" : ("url(" + dekor_gallery[value].img +")")});
            }

        }

        // Animálja a frame (0 vagy 1) subframe (1, 2 vagy 3) opacity-jét value (0 vagy 1) értékre.
        function animateFrame(frame, subframe, value){      
            
            console.log("animateFrame:\nframe:" + frame + "\nsubframe: frame" + subframe + "\nvalue: " + value );
            
            $($(("#dekoracio-gallery .gallery .gallery-frame .frame" + subframe))[frame]).animate({opacity : value}, 333);
        }



        // Dekor galéria balra
        $("#dekoracio-gallery .gallery .gallery-left").click(function(e){

            e.preventDefault();
            
            //Ha a 0. képnél vagyunk, akkor nincs balra semmi, nem lépünk tovább
            if(current_dekor_gallery == 0) {

                shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'left')
                // NINCS ANIMÁCIÓ MÉG

            // Ha nem a 0. képnél vagyunk, akkor van mit mutatni, csökkentjük a jelenlegi indexet eggyel,
            // majd frissítjük vele a galériát.
            } else {

                updateDekorGallery('left');

            }
        });


        // Dekor galéria jobbra
        $("#dekoracio-gallery .gallery .gallery-right").click(function(e){

            e.preventDefault();

            // Ha az utolsó képnél vagyunk, nincs semmi jobbra.
            if(current_dekor_gallery >= dekor_gallery.length - 1) {

                shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),'right')

            // Ha nem az utolsónál vagyunk, van jobbra még kép, megnöveljük eggyel az indexet,
            // és frissítjük a galériát.
            } else {

                if(isDualEnabled) {

                    updateDekorGallery('right');

                } else {
                        
                    updateDekorGallery('right');

                }


            }
        });


        // ----------------------------
        // Galéria touch léptetés
        // ----------------------------
        
        // Szükséges változók
        let start_touch;
        let startX;
        let end_touch;
        let endX;

        // Amikor hozzáér a képhez, eltároljuk az X koordinátát.
        $("#dekoracio-gallery .gallery .gallery-frame").on("touchstart", function (start_e) {

            start_touch = start_e.touches[0];
            startX = start_touch.clientX;

        });

        // Amikor véget ér a touch, megnézzük, hogy kell e léptetni.
        $("#dekoracio-gallery .gallery .gallery-frame").on("touchend", function (end_e) {

            // Eltároljuk a végpont X koordinátáját
            end_touch = end_e.changedTouches[0];
            endX = end_touch.clientX;

            // Ha a start 50 pixellel nagyobb, akkor jobb swipe történt
            if(startX > endX + 50) {
                
                // lsd. jobb gomb
                if(current_dekor_gallery == dekor_gallery.length - 1) {

                    shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),"right");

                } else {

                    updateDekorGallery('right');

                }

            // Ha az end 50-nel nagyobb, akkor bal swipe történt.
            } else if(startX + 50 < endX) {
                
                // lsd. bal gomb
                if(current_dekor_gallery == 0) {

                    shakeElement(("#dekoracio-gallery .gallery .gallery-frame .frame" + current_dekor_frame),"left");
                    
                } else {

                    updateDekorGallery('left');

                }
                
            // Ha a swipe kisebb mint 50 pixel, akkor nem teszünk semmit
            // Ez a buffer a fel-le görgetés miatt szükséges, ha nem lenne
            // akkor a fel-le görgetésnél is váltana a kép.
            } else {

                // console.log("Kicsi swipe!");

            }

        });

    }

    // lsd. grafika_gallery.js
    function shakeElement(element, direction) {

        if(direction == "right") {

            $(element).animate({"right" : '10px'}, 100, function(){
                $(element).animate({"right" : ""}, 100, function(){
                    $(element).css({"right" : ""});
                });
            });

        } else if( direction == "left") {

            $(element).animate({"left" : '10px'}, 100, function(){
                $(element).animate({"left" : ""}, 100, function(){
                    $(element).css({"left" : ""});
                });
            });

        } else {
            console.error("direction must be \"left\" or \"right\".");
        }
        
    }


});
