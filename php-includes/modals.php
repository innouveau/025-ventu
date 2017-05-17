<div class="ventu-overlay">

    <!-- ventu login -->
    <div class="ventu-login ventu-popup">
        <div class="ventu-popup-head">
            <h2>
                Inloggen
            </h2>
        </div>
        <div class="ventu-popup-body with-padding">
            <form action="/Home" class="form-signin ventu-form" method="post">
                <label class="sr-only" for="inputEmail">E-mailadres</label>
                <input type="text" id="inputEmail" class="form-control" name="emailAddress" placeholder="E-mailadres" required autofocus>
                <label class="sr-only" for="inputPassword">Wachtwoord</label>
                <input type="password" id="inputPassword" class="form-control" name="password" placeholder="Wachtwoord" required>
                <input id="inputFavorites" name="favorites" type="hidden">
                <div class="checkbox">
                    <label>
                        <input name="rememberMe" value="true" type="checkbox">
                        Onthoud mij
                    </label>
                </div>
                <a href="/account/accountmaken">Maak een account</a>
                <a href="/account/wachtwoordvergeten">Wachtwoord vergeten</a>
                <button class="btn orange btn-lg btn-primary btn-block" type="submit">Inloggen</button>
            </form>
        </div>
        <div class="ventu-close-popup ventu-icon ventu-icon-close"></div>
    </div>
</div>