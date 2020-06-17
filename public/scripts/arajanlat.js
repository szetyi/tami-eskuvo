$(document).ready(function() {

    
    // -----------------------------------
    //
    //  Árajánlat lenyitása után itt történik az ellenőrzés,
    //  a leadás, és pár extra funkció.
    //
    // -----------------------------------


    // Attól függően, hogy van e pinterest-tábla (radio button) lenyitjuk a pinterest-link helyét.
    $("#pinterest-link").hide();
    $('input:radio[name=pinterest]').change(function () {

        if ($("input[name='pinterest']:checked").val() == 'igen') {
            $("#pinterest-link").slideDown("slow");
        }
        
        if ($("input[name='pinterest']:checked").val() == 'nem') {
            $("#pinterest-link").slideUp("slow");
        }

    });

    // Ebbe a tömbbe kell belerakni a leadáshoz kötelező inputok-at, id alapján.
    let required = [
        $("#form-jegyespar-nev"),
        $("#form-email"),
        $("#form-telefonszam"),
        $("#form-eskuvo-idopont"),
        $("#form-helyszin"),
        $("#form-tervezett-letszam"),
        $("#form-gdpr")
    ]

    // Ebben a tömbben tároljuk, hogy az egyes elemeket sikeresen kitöltötte e a felhasználó.
    // Először mindet hamisra állítjuk.
    let valid = [];
    $.each(required, function(index) {
        valid[index] = false;
    })
    
    // Minden kötelező elemre rakunk egy onChange listenert
    $.each(required, function(index, element){

        element.change(function(){

            // Az if statement-ben vizsgáljuk, hogy az adott elem valid-e.
            if (validate(element)) {
                // Ha igen, nem kap keretet
                element.css({ "border" : "" });
                
                // Az elemhez tartozó label-ről levesszük az aláhúzást
                $("#arajanlat-form > form > fieldset > label[for='"+ element.prop("id") +"']").css({ "text-decoration" : "" });

                // A 'valid' tömbben a megfelelő element igaz-ra állítjuk.
                valid[index] = true;

            } else {
                // Ha nem valid, akkor kap egy piros keretet
                element.css({ "border" : "2px red solid" });
            
                // Az elemhez tartozó label-t aláhúzzuk pirossal.
                $("#arajanlat-form > form > fieldset > label[for='"+ element.prop("id") +"']").css({ "text-decoration" : "underline red" });

                // hamisra állítjuk a 'valid' tömbben a hozzá tartozó elemet.
                valid[index] = false;
            }
        })

    })

    // Form submit button kattintáskor nem engedjük az alap funkcióját, illetve itt is vizsgáljuk a validitást.
    $("#arajanlat-form > form > input").click(function(e){
        e.preventDefault();

        // Helper function, vizsgálja, hogy a paraméterként kapott érték igaz e.
        const is_value_true = (currentValue) => currentValue === true;

        // HA a "valid" tömb minden eleme igaz értékű, leadhatjuk a form-ot.
        if (valid.every(is_value_true)) {

            $("#arajanlat-form > form").submit();

        // HA nem, akkor üzenetet küldünk alert formájában:
        } else {
            // Az üzenet első sora
            let message = "Kérlek töltsd ki az alábbi mezőket:\n";
            
            // A "valid" tömb minden elemén végigmegyünk
            $.each(valid, function(index, value) {

                // Ha az érték hamis
                if(!value) {

                    // Frissítjük a nem valid elem border stílusát pirosra.
                    required[index].css({ "border" : "2px red solid" });

                    // Kimentjük az adott elem ID-ját
                    let name = required[index].prop("id");

                    // Az elemhez tartozó label-t aláhúzzuk pirossal.
                    $("#arajanlat-form > form > fieldset > label[for='"+ name +"']").css({ "text-decoration" : "underline red" });

                    // A nevet frissítjük az input elemhez tartozó label szövegével, mert ez már szépen formázott.
                    name = $("#arajanlat-form > form > fieldset > label[for='"+ name +"']").text();


                    // Hozzáadjuk az üzenethez a nem valid elem nevét.
                    message += name + "\n";

                } 
                
            })

            // Az üzenetet egy alert formájában közöljük a felhasználóval.
            alert( message );
        }
        
    });

    // Funkció egy paraméterként átadott HTML elem validitásának vizsgálatára.
    function validate(element) {

        // megnézzük, hogy milyen input type-ja van az elemnek
        let type = element.prop("type");
        // Feltételezzük, hogy nem helyes a kitöltés.
        let isValid = false;
        
        // Az input type-tól függően máshogy vizsgáljuk a validitást.
        switch (type) {
            case "text":
                        
                // Ha az input value nem üres, null vagy undefined, akkor elfogadjuk.
                if(element.val() != "" || null || undefined) isValid = true;
                break;
        
            case "email":

                // Az input value-ra egy reguláris kifejezést vizsgálunk.
                if((element.val()).match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) isValid = true;
                break;
        
            case "tel":
                
                // lsd. email
                if((element.val()).match(/^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g)) isValid = true;
                break;
        
            case "date":
                
                // lsd. text
                if(element.val() != "" || null || undefined) isValid = true;
                break;
                
            case "number":

                // lsd. text
                // mivel a type number, nem kaphat nem-szám értéket.
                if(element.val() != "" || null || undefined) isValid = true;
                break;
                       
            case "checkbox":

                if(element.prop("checked") == true) isValid = true;
                break;

            default:
                // Ha más az input type, error-t logolunk
                // mert nincs rá megfelelő vizsgálat.
                break;
        }

        // Igaz vagy hamis visszatérési érték.
        return isValid;
    }

});