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
        $("#form-dekor-szinvilag-stilus")
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
                // Ha igen, nem kap keretet, és a 'valid' tömbben a megfelelő element igaz-ra állítjuk.
                element.css({ "border" : "" });
                valid[index] = true;

            } else {
                // Ha nem valid, akkor kap egy piros keretet, és hamisra állítjuk a 'valid' tömbben a hozzá tartozó elemet.
                element.css({ "border" : "2px red solid" });
                valid[index] = false;
            }
        })

    })

    // Form submit button kattintáskor nem engedjük az alap funkcióját, illetve itt is vizsgáljuk
    $("#arajanlat-form > form > input").click(function(e){
        e.preventDefault();

        const is_value_true = (currentValue) => currentValue === true;

        if (valid.every(is_value_true)) {

            $("#arajanlat-form > form").submit();

        } else {
            let message = "Kérlek töltsd ki az alábbi mezőket:\n";
            
            $.each(valid, function(index, value) {

                let name = required[index].prop("id");

                name = $("#arajanlat-form > form > fieldset > label[for='"+ name +"']").text();
                
                message += name + "\n";
                
            })

            alert( message );
        }
        
    })

    function validate(element) {

        let type = element.prop("type");
        let isValid = false;
        
        switch (type) {
            case "text":
                        
                if(element.val() != "" || null || undefined) isValid = true;

                break;
        
            case "email":

                if((element.val()).match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) isValid = true;
            
                break;
        
            case "tel":
                
                if((element.val()).match(/^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g)) isValid = true;
        
                break;
        
            case "date":
                
                if(element.val() != "" || null || undefined) isValid = true;
    
                break;
                
            case "number":

                if(element.val() != "" || null || undefined) isValid = true;
                
                break;
        
                                                
            default:
                break;
        }

        return isValid;
    }

});