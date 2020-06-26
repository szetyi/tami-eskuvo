$(document).ready(function() {

    // Grafika galéria tömb, ezt egy HTTP Get request tölti fel
    let grafika_gallery = []

    // HTTP Get request a node.js szervernek a "/get/gr/imgs" címre,
    // Ez a "../gallery/grafika/" mappában lévő jpg képek fájlneveit adja vissza
    // A callback funcion akkor fut le, ha már megérkezett a válasz.
    $.get("/get/gr/imgs", function(data){
        
        // Amennyi kép van, annyiszor fut le a ciklus, belepakolja a képeket a tömbbe.
        for (let i = 0; i < data.length; i++) {
            let filename = data[i];
            
            grafika_gallery.push(
                "../gallery/grafika/" + filename,
            );
            
        }

        // Amint feltöltöttük a galériát, a main funkció fut le.
        main();

    });

    // A teljes funkcionalitás.
    function main(){    

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
        // let isDualEnabled = false;
        
        // Jelenlegi kép index
        let current_grafika_gallery = 0;

        // Jelenleg látszó frame ( három van belőle, melyek a sima előre-hátra transition-höz kellenek. )
        let current_grafika_frame = 2;

        let dual_status = undefined;

        // Galéria inicializálása
        let wait_for_dual_check = setInterval(() => {

            if(isDualEnabled != undefined) {
                dual_status = isDualEnabled;
                updateGrafikaGallery("init");
                clearInterval(wait_for_dual_check);
            }

        }, 100);

        

        let listen_for_dual_change = setInterval(() => {

            if(dual_status != isDualEnabled) {
                // Megváltozott a dual beállítás.
                dual_status = isDualEnabled;
                updateGrafikaGallery("change");
            }

        }, 100);



        function updateGrafikaGallery(setting) {

            switch (setting) {

                // INICIALIZÁLÁS
                case "init":
                    
                    // Ha kettős galérián inicializálunk, akkor beállítjuk a két linket,
                    // Az első két képet, és az utánuk jövő két képet.
                    if (isDualEnabled) {

                        animateFrame(0,1,0);
                        animateFrame(0,2,1);
                        animateFrame(0,3,0);
                        animateFrame(1,1,0);
                        animateFrame(1,2,1);
                        animateFrame(1,3,0);

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
                        
                        animateFrame(0,1,0);
                        animateFrame(0,2,1);
                        animateFrame(0,3,0);
                        animateFrame(1,1,0);
                        animateFrame(1,2,0);
                        animateFrame(1,3,0);

                        setFrame0("curr", 0);
                        setFrameBackground(0,getSubFrame("curr"), frame0.curr);
                        setFrame0("next", 1);
                        setFrameBackground(0,getSubFrame("next"), frame0.next);

                    }

                    break;
            
                // VÁLTÁS
                case "change":

                    if(current_grafika_gallery < 0) {
                        current_grafika_gallery = 0;
                    } else if (current_grafika_gallery > grafika_gallery.length - 1) {
                        current_grafika_gallery = grafika_gallery.length;
                    }

                    // Ha kettősről váltunk egyesre:
                    if(!isDualEnabled) {
                        
                        animateFrame(0,getSubFrame("prev"),0);
                        animateFrame(0,getSubFrame("curr"),1);
                        animateFrame(0,getSubFrame("next"),0);
                        animateFrame(1,getSubFrame("prev"),0);
                        animateFrame(1,getSubFrame("curr"),0);
                        animateFrame(1,getSubFrame("next"),0);

                        setFrame0("next", frame0.curr + 1);
                        setFrameBackground(0, getSubFrame("next"), frame0.next);
                        setFrame0("prev", frame0.curr - 1);
                        setFrameBackground(0, getSubFrame("prev"), frame0.prev);


                    // Ha egyesről váltunk kettősre:
                    } else {

                        animateFrame(0,getSubFrame("prev"),0);
                        animateFrame(0,getSubFrame("curr"),1);
                        animateFrame(0,getSubFrame("next"),0);
                        animateFrame(1,getSubFrame("prev"),0);
                        animateFrame(1,getSubFrame("curr"),1);
                        animateFrame(1,getSubFrame("next"),0);

                        // Attól függően, hogy páros, vagy páratlan a current, mást csinálunk!
                        let current = frame0.curr;

                        // Páros
                        if (current % 2 == 0) {
                            
                            // setFrame1("curr", frame0.next)
                            // setFrameBackground(1, getSubFrame("curr"), frame1.curr);
                            setFrame1("curr", current + 1);
                            setFrameBackground(1,getSubFrame("curr"), frame1.curr);

                            setFrame1("prev", current - 1);
                            setFrameBackground(1, getSubFrame("prev"), frame1.prev);

                            setFrame1("next", current + 3);
                            setFrameBackground(1, getSubFrame("next"), frame1.next);

                            setFrame0("prev", current - 2);
                            setFrameBackground(0, getSubFrame("prev"), frame0.prev);

                            setFrame0("next", current + 2);
                            setFrameBackground(0, getSubFrame("next"), frame0.next);


                        // Páratlan
                        } else {
                            
                            setFrame1("curr", current);
                            setFrameBackground(1, getSubFrame("curr"), frame1.curr);

                            setFrame1("prev", current - 2);
                            setFrameBackground(1, getSubFrame("prev"), frame1.prev);

                            setFrame1("next", current + 2);
                            setFrameBackground(1, getSubFrame("next"), frame1.next);

                            setFrame0("curr", current - 1);
                            setFrameBackground(0, getSubFrame("curr"), frame0.curr);

                            setFrame0("prev", current - 3);
                            setFrameBackground(0, getSubFrame("prev"), frame0.prev);

                            setFrame0("next", current + 1);
                            setFrameBackground(0, getSubFrame("next"), frame0.next);

                        }

                    }
                    
                    break;
                    
                // JOBBRA
                case "right":

                    if (isDualEnabled) {

                        // Animáljuk a current subframe-et 0 opacityre, a nextet pedig 1-re
                        animateFrame(0, getSubFrame("curr"), 0);
                        animateFrame(0, getSubFrame("next"), 1);
                        
                        animateFrame(1, getSubFrame("curr"), 0);
                        animateFrame(1, getSubFrame("next"), 1);
                        
                        // Átállítjuk a current frame-et a jelenlegi next-re 
                        // A current gallery-t pedig megnöveljük kettővel.
                        current_grafika_frame = getSubFrame("next");
                        current_grafika_gallery += 2;
                        
                        // ----- FRAME 0 -----
                        // Beállítjuk a prev-et az most elváltott képre.
                        setFrameBackground(0, getSubFrame("prev"), frame0.curr);
                        setFrame0("prev", frame0.curr);

                        // Frissítjük a curr-t a jelenlegi next-re, mert arra váltottunk.
                        setFrame0("curr", frame0.next);

                        // Beállítjuk a next-et az új curr utáni kettőre. 
                        setFrame0("next", frame0.curr + 2);
                        setFrameBackground(0, getSubFrame("next"), frame0.next);

                        // ----- FRAME 1 -----
                        // ua. mint a frame 0

                        setFrameBackground(1, getSubFrame("prev"), frame1.curr);
                        setFrame1("prev", frame1.curr);

                        setFrame1("curr", frame1.next);

                        setFrame1("next", frame1.curr + 2);
                        setFrameBackground(1, getSubFrame("next"), frame1.next);

                    // Ha egyes galériánk van:
                    } else {
                        
                        // Animáljuk a current subframe-et 0 opacityre, a nextet pedig 1-re
                        animateFrame(0, getSubFrame("curr"), 0);
                        animateFrame(0, getSubFrame("next"), 1);

                        // Átállítjuk a current frame-et a jelenlegi next-re 
                        // A current gallery-t pedig megnöveljük eggyel.
                        current_grafika_frame = getSubFrame("next");
                        current_grafika_gallery++;
                        
                        // Beállítjuk a prev-et az most elváltott képre.
                        setFrameBackground(0, getSubFrame("prev"), frame0.curr);
                        setFrame0("prev", frame0.curr);

                        // Frissítjük a curr-t a jelenlegi next-re, mert arra váltottunk.
                        setFrame0("curr", frame0.next);

                        // Beállítjuk a next-et az új curr utánira. 
                        setFrame0("next", frame0.curr + 1);
                        setFrameBackground(0, getSubFrame("next"), frame0.next);
                    }
                    
                    break;
                    

                // BALRA
                case "left":
                    

                    if (isDualEnabled) {

                        // Animáljuk a current subframe-et 0 opacityre, a prevet pedig 1-re
                        animateFrame(0, getSubFrame("curr"), 0);
                        animateFrame(0, getSubFrame("prev"), 1);
                        
                        animateFrame(1, getSubFrame("curr"), 0);
                        animateFrame(1, getSubFrame("prev"), 1);
                        
                        // Átállítjuk a current frame-et a jelenlegi prev-re 
                        // A current gallery-t pedig csökkentjük kettővel.
                        current_grafika_frame = getSubFrame("prev");
                        current_grafika_gallery -= 2;
                        
                        // ----- FRAME 0 -----
                        // Beállítjuk a next-et az most elváltott képre.
                        setFrameBackground(0, getSubFrame("next"), frame0.curr);
                        setFrame0("next", frame0.curr);

                        // Frissítjük a curr-t a jelenlegi prev-re, mert arra váltottunk.
                        setFrame0("curr", frame0.prev);

                        // Beállítjuk a prev-et az új curr előtti kettőre. 
                        setFrame0("prev", frame0.curr - 2);
                        setFrameBackground(0, getSubFrame("prev"), frame0.prev);

                        // ----- FRAME 1 -----
                        // ua. mint a frame 0

                        setFrameBackground(1, getSubFrame("next"), frame1.curr);
                        setFrame1("next", frame1.curr);

                        setFrame1("curr", frame1.prev);

                        setFrame1("prev", frame1.curr - 2);
                        setFrameBackground(1, getSubFrame("prev"), frame1.prev);

                    // Ha egyes galériánk van:
                    } else {
                        
                        // Animáljuk a current subframe-et 0 opacityre, a prevet pedig 1-re
                        animateFrame(0, getSubFrame("curr"), 0);
                        animateFrame(0, getSubFrame("prev"), 1);

                        // Átállítjuk a current frame-et a jelenlegi next-re 
                        // A current gallery-t pedig megnöveljük eggyel.
                        current_grafika_frame = getSubFrame("prev");
                        current_grafika_gallery--;
                        
                        // Beállítjuk a next-et az most elváltott képre.
                        setFrameBackground(0, getSubFrame("next"), frame0.curr);
                        setFrame0("next", frame0.curr);

                        // Frissítjük a curr-t a jelenlegi prev-re, mert arra váltottunk.
                        setFrame0("curr", frame0.prev);

                        // Beállítjuk a prev-et az új curr előttire. 
                        setFrame0("prev", frame0.curr - 1);
                        setFrameBackground(0, getSubFrame("prev"), frame0.prev);
                    }
                    
                    break;

                // ERROR
                default:
                    console.error("Wrong setting: " + setting + "\nMust be 'init', 'change', 'right' or 'left'.");
                    
                    break;
            }

            // console.log("dual: " + isDualEnabled + "\nsetting: " + setting);
            // console.table([frame0,frame1]);

        }


        function setFrame1(sub, value) {

            if ( (value < 0) || (value > grafika_gallery.length - 1) || isNaN(value) ) {
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

                if ( (value < 0) || (value > grafika_gallery.length - 1) || isNaN(value) ) {
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
                    
                    switch (current_grafika_frame) {
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
                    
                    switch (current_grafika_frame) {
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
                    
                    switch (current_grafika_frame) {
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

        // Beállítja a frame (0 vagy 1) -et üresre, és törli a linket.
        function setFrameBlank(frame, subframe) {
            $($(("#grafika-gallery .gallery .gallery-frame .frame" + subframe))[frame]).css({"background-image" : ("url(../img/placeholder-01.svg)")});
        }

        // Beállítja a frame (0 vagy 1) subframe (1, 2 vagy 3) -jét a value index képére.
        function setFrameBackground(frame, subframe, value) {


            // console.log("setFrameBackground:\nframe:" + frame + "\nsubframe: frame" + subframe + "\nvalue: " + value );
            
            if ( (value < 0) || (value > grafika_gallery.length - 1) || isNaN(value) ) {
                value = undefined;
            }
            if(value == undefined ) {
                setFrameBlank(frame, subframe);
            } else {
                $($(("#grafika-gallery .gallery .gallery-frame .frame" + subframe))[frame]).css({"background-image" : ("url(" + grafika_gallery[value] +")")});
            }

        }

        // Animálja a frame (0 vagy 1) subframe (1, 2 vagy 3) opacity-jét value (0 vagy 1) értékre.
        function animateFrame(frame, subframe, value){
            $($(("#grafika-gallery .gallery .gallery-frame .frame" + subframe))[frame]).animate({opacity : value}, 333);
        }



        // Grafika galéria balra
        $("#grafika-gallery .gallery .gallery-left").click(function(e){

            e.preventDefault();
            
            if(isDualEnabled) {

                if(frame0.prev == undefined && frame1.prev == undefined ) {
                    shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),'left');
                } else {
                    updateGrafikaGallery("left");
                }

            } else {

                if (frame0.prev == undefined ) {
                    shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),'left');
                } else {
                    updateGrafikaGallery("left");
                }

            }

        });


        // Grafika galéria jobbra
        $("#grafika-gallery .gallery .gallery-right").click(function(e){

            e.preventDefault();

            if(isDualEnabled) {

                if(frame0.next == undefined && frame1.next == undefined ) {
                    shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),'right');
                } else {
                    updateGrafikaGallery("right");
                }

            } else {

                if (frame0.next == undefined ) {
                    shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),'right');
                } else {
                    updateGrafikaGallery("right");
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
        $("#grafika-gallery .gallery .gallery-frame").on("touchstart", function (start_e) {

            start_touch = start_e.touches[0];
            startX = start_touch.clientX;

        });

        // Amikor véget ér a touch, megnézzük, hogy kell e léptetni.
        $("#grafika-gallery .gallery .gallery-frame").on("touchend", function (end_e) {

            // Eltároljuk a végpont X koordinátáját
            end_touch = end_e.changedTouches[0];
            endX = end_touch.clientX;

            // Ha a start 50 pixellel nagyobb, akkor jobb swipe történt
            if(startX > endX + 50) {
                
                // lsd. jobb gomb
                if(isDualEnabled) {

                    if(frame0.next == undefined && frame1.next == undefined ) {
                        shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),'right');
                    } else {
                        updateGrafikaGallery("right");
                    }

                } else {

                    if (frame0.next == undefined ) {
                        shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),'right');
                    } else {
                        updateGrafikaGallery("right");
                    }

                }

            // Ha az end 50-nel nagyobb, akkor bal swipe történt.
            } else if(startX + 50 < endX) {
                
                // lsd. bal gomb
                if(isDualEnabled) {

                    if(frame0.prev == undefined && frame1.prev == undefined ) {
                        shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),'left');
                    } else {
                        updateGrafikaGallery("left");
                    }

                } else {

                    if (frame0.prev == undefined ) {
                        shakeElement(("#grafika-gallery .gallery .gallery-frame .frame" + current_grafika_frame),'left');
                    } else {
                        updateGrafikaGallery("left");
                    }

                }
                
            // Ha a swipe kisebb mint 50 pixel, akkor nem teszünk semmit
            // Ez a buffer a fel-le görgetés miatt szükséges, ha nem lenne
            // akkor a fel-le görgetésnél is váltana a kép.
            } else {

                // console.log("Kicsi swipe!");

            }

        });

    }
    

    // Animáció funkció. Egy html elemet és egy irányt kell neki átadni.
    function shakeElement(element, direction) {

        // Ha jobbra akarjuk megrázni
        if(direction == "right") {

            // 15 pixellel jobbra toljuk, amint az végzett, visszahúzzuk,
            // majd a .css funkcióval levesszük a right : 0 style-t.
            // Ha ezt nem tesszük meg, új animáció esetén nem megfelelő a működés.
            // A szám érték (alapesetben 100) az animáció sebessége ms-ben.
            $(element).animate({"right" : '10px'}, 100, function(){
                $(element).animate({"right" : ""}, 100, function(){
                    $(element).css({"right" : ""});
                });
            });

        // Bal esetén ugyan az, csak baloldali irányba.
        } else if( direction == "left") {

            $(element).animate({"left" : '10px'}, 100, function(){
                $(element).animate({"left" : ""}, 100, function(){
                    $(element).css({"left" : ""});
                });
            });

        // Ha nem megfelelő az irány (left vagy right) error-t logolunk, az animáció pedig nem fut le.
        } else {
            console.error("direction must be \"left\" or \"right\".");
        }
        
    }

});
